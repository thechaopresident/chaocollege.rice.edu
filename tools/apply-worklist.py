#!/usr/bin/env python3
"""
Apply a filled-in content-worklist.csv back into the data files.

  python3 tools/apply-worklist.py content-worklist.csv --dry-run
  python3 tools/apply-worklist.py content-worklist.csv

Rules:
  - A row is applied only if `your_text` or `your_url` is non-empty.
  - Edits run bottom-up per file so line numbers stay valid.
  - Every edit asserts the `find` string is still on the stated line; if the
    file has moved on, that row is reported and skipped rather than guessed at.
  - type=paragraphs: blank lines in your_text become separate <p> elements.
  - type=url (or any row with your_url): also rewires the card's `path`.
  - your_text of "NA" means the field is not needed: it is set to null rather
    than having the literal text "NA" written into the site.

Re-runs: after each run the exact text written per row is recorded in
tools/.worklist-state.json. On a later run, if a row's `find` string is gone
(because a previous run already replaced it) or its line has drifted, the row is
re-located by that recorded value. So the same CSV can be edited and re-applied
as many times as you like. Pass --previous OLD.csv to seed the state from a run
made before this file existed.
"""
import csv, sys, re, os, json, argparse
from collections import defaultdict

STATE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".worklist-state.json")

def load_state():
    try:
        with open(STATE, encoding="utf-8") as fh: return json.load(fh)
    except Exception:
        return {}

def save_state(st):
    with open(STATE, "w", encoding="utf-8") as fh:
        json.dump(st, fh, indent=1, ensure_ascii=False, sort_keys=True)

def locate(lines, row, previous):
    """Return (line_index, needle) for a row, tolerating drift and prior edits."""
    find = row["find"]
    try: n = int(row["line"]) - 1
    except ValueError: n = -1
    if 0 <= n < len(lines) and find in lines[n]:
        return n, find
    hits = [i for i, l in enumerate(lines) if find in l]
    if len(hits) == 1:
        return hits[0], find                       # line drifted, text intact
    if previous:
        hits = [i for i, l in enumerate(lines) if previous in l]
        if len(hits) == 1:
            return hits[0], previous               # already applied once before
    return None, None

def esc(s):
    """Escape a Python string for a JS double-quoted literal."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv_path")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--previous", help="a CSV from a run made before state tracking existed")
    args = ap.parse_args()

    with open(args.csv_path, encoding="utf-8-sig", newline="") as fh:
        rows = list(csv.DictReader(fh))

    state = load_state()
    if args.previous:
        with open(args.previous, encoding="utf-8-sig", newline="") as fh:
            for r in csv.DictReader(fh):
                t = (r.get("your_text") or "").strip()
                if not t or r["id"] in state: continue
                find = r["find"]
                wrote = "null" if t.upper() == "NA" else (
                    '"' + esc(t) + '"' if find.startswith('"') and find.endswith('"')
                    else 'email: "' + esc(t) + '"' if find == "email: null"
                    else esc(t))
                state[r["id"]] = {"file": r["file"], "wrote": wrote}

    todo = [r for r in rows if (r.get("your_text") or "").strip()
                             or (r.get("your_url") or "").strip()]
    if not todo:
        print("Nothing filled in yet — every your_text and your_url is empty.")
        return 0

    by_file = defaultdict(list)
    for r in todo:
        by_file[r["file"]].append(r)

    applied, skipped, moved, unchanged = [], [], [], []
    for path, items in by_file.items():
        lines = open(path, encoding="utf-8").read().split("\n")
        # bottom-up: earlier line numbers stay valid as we edit
        for r in sorted(items, key=lambda x: int(x["line"]), reverse=True):
            text = (r.get("your_text") or "").strip()
            url  = (r.get("your_url")  or "").strip()
            typ  = (r.get("type") or "text").strip()

            prev = (state.get(r["id"]) or {}).get("wrote")
            if text.upper() == "NA" and prev == "null":
                unchanged.append((r["id"], r["item"]))
                continue
            n, find = locate(lines, r, prev)
            if n is None:
                skipped.append((r["id"], r["item"], path, r["line"],
                                "could not locate this field — the file has moved on"))
                continue
            if n != int(r["line"]) - 1:
                moved.append((r["id"], r["item"], r["line"], n + 1))

            line = lines[n]

            # "NA" means: nothing belongs here. Null the field rather than
            # writing the literal string "NA" into the site.
            if text.upper() == "NA":
                quoted = '"' + find + '"'
                if quoted in line:
                    line = line.replace(quoted, "null", 1)
                    lines[n] = line
                    state[r["id"]] = {"file": path, "wrote": "null"}
                    applied.append((r["id"], r["item"] + "  (removed)", path, r["line"]))
                else:
                    skipped.append((r["id"], r["item"], path, r["line"],
                                    'NA given but the value is not a plain quoted string'))
                continue

            if text:
                if typ == "paragraphs":
                    paras = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
                    repl = '", "'.join(esc(p) for p in paras)
                elif find.startswith('"') and find.endswith('"'):
                    repl = '"' + esc(text) + '"'      # e.g. the "TBD" date fields
                elif find == "email: null":
                    repl = 'email: "' + esc(text) + '"'
                else:
                    repl = esc(text)
                if find == repl and not url:
                    unchanged.append((r["id"], r["item"]))
                    continue
                line = line.replace(find, repl, 1)
                state[r["id"]] = {"file": path, "wrote": repl}

            if url:
                if "path: null" in line:
                    line = line.replace("path: null", 'path: "' + esc(url) + '"', 1)
                    if text and "cta: null" in line:
                        line = line.replace("cta: null", 'cta: "' + esc(text) + '"', 1)
                else:
                    skipped.append((r["id"], r["item"], path, r["line"],
                                    "your_url given but no `path: null` on this line"))

            lines[n] = line
            applied.append((r["id"], r["item"], path, r["line"]))

        if not args.dry_run:
            open(path, "w", encoding="utf-8").write("\n".join(lines))

    if not args.dry_run:
        save_state(state)

    print(("DRY RUN — " if args.dry_run else "") + f"applied {len(applied)} row(s)")
    for i, item, f, l in sorted(applied, key=lambda x: int(x[0])):
        print(f"  #{i:<3} {item}   ({f}:{l})")
    if unchanged:
        print(f"unchanged {len(unchanged)} row(s) — already match the CSV: " +
              ", ".join("#" + i for i, _ in sorted(unchanged, key=lambda x: int(x[0]))))
    if moved:
        print(f"\nRE-LOCATED {len(moved)} (the file had shifted since the CSV was made):")
        for i, item, was, now in sorted(moved, key=lambda x: int(x[0])):
            print(f"  #{i:<3} {item}   line {was} -> {now}")
    if skipped:
        print(f"\nSKIPPED {len(skipped)}:")
        for i, item, f, l, why in skipped:
            print(f"  #{i:<3} {item}   ({f}:{l}) — {why}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
