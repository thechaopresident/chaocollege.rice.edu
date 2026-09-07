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
"""
import csv, sys, re, argparse
from collections import defaultdict

def esc(s):
    """Escape a Python string for a JS double-quoted literal."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv_path")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    with open(args.csv_path, encoding="utf-8-sig", newline="") as fh:
        rows = list(csv.DictReader(fh))

    todo = [r for r in rows if (r.get("your_text") or "").strip()
                             or (r.get("your_url") or "").strip()]
    if not todo:
        print("Nothing filled in yet — every your_text and your_url is empty.")
        return 0

    by_file = defaultdict(list)
    for r in todo:
        by_file[r["file"]].append(r)

    applied, skipped = [], []
    for path, items in by_file.items():
        lines = open(path, encoding="utf-8").read().split("\n")
        # bottom-up: earlier line numbers stay valid as we edit
        for r in sorted(items, key=lambda x: int(x["line"]), reverse=True):
            n    = int(r["line"]) - 1
            find = r["find"]
            text = (r.get("your_text") or "").strip()
            url  = (r.get("your_url")  or "").strip()
            typ  = (r.get("type") or "text").strip()

            if n >= len(lines) or find not in lines[n]:
                skipped.append((r["id"], r["item"], path, r["line"],
                                "line no longer contains the expected text"))
                continue

            line = lines[n]

            # "NA" means: nothing belongs here. Null the field rather than
            # writing the literal string "NA" into the site.
            if text.upper() == "NA":
                quoted = '"' + find + '"'
                if quoted in line:
                    line = line.replace(quoted, "null", 1)
                    lines[n] = line
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
                line = line.replace(find, repl, 1)

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

    print(("DRY RUN — " if args.dry_run else "") + f"applied {len(applied)} row(s)")
    for i, item, f, l in sorted(applied, key=lambda x: int(x[0])):
        print(f"  #{i:<3} {item}   ({f}:{l})")
    if skipped:
        print(f"\nSKIPPED {len(skipped)}:")
        for i, item, f, l, why in skipped:
            print(f"  #{i:<3} {item}   ({f}:{l}) — {why}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
