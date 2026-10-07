# Updating the site

Everything here can be done from **github.com in a browser** — no terminal, no
downloads, no setup. Open a file, click the pencil, edit, commit. The site
rebuilds itself and is live at <https://chao.rice.edu>, usually within a
minute.

Content lives in three files. You will almost never touch anything else:

| File | What is in it |
|---|---|
| `data/site.js` | Announcements, nav, homepage, footer, contact details |
| `data/people.js` | Every person at Chao |
| `data/pages.js` | About, Resources, O-Week and Calendar page content |

> **One rule.** These are JavaScript files, so a missing comma or an unclosed
> quote breaks the whole page, not just the line you edited. If a page ever
> comes up blank after an edit, that is why — see
> [When something breaks](#when-something-breaks). It is always recoverable.

---

## Post an announcement

Announcements are the box on the homepage. Open **`data/site.js`** and find
`announcements:`. Copy this block and paste it as the **first** entry in the
list — newest goes on top:

```js
    { date: "10/15/2026", datetime: "2026-10-15", title: "Your headline here",
      body: "One or two sentences. Say what is happening and what someone should do about it.",
      link: null },
```

| Field | What it does |
|---|---|
| `date` | What readers see. Write it however you like — `10/15/2026`, `Oct 15` |
| `datetime` | The machine-readable version, always `YYYY-MM-DD`. **Must match `date`** — screen readers and search engines use this one |
| `title` | The headline, in bold |
| `body` | The text underneath |
| `link` | A button under the announcement. `null` for no button, or `"https://…"` |

With a link it looks like this:

```js
    { date: "10/15/2026", datetime: "2026-10-15", title: "Sign up for Beer Bike",
      body: "Sign-ups close Friday. Everyone racing needs to fill in the form.",
      link: "https://forms.gle/example" },
```

**Check the comma.** Every entry ends with `},` except the last one in the list,
which ends with `}`. If you paste a new entry at the top, make sure the entry
that used to be first still has its comma.

To remove an announcement, delete its whole block — from `{` to `},`.

---

## Add or replace someone's photo

Two steps: put the file in, then point the person at it.

### 1. Prepare the photo

**Portraits must be square.** The cards crop to a square, so a wide landscape
photo gets its sides chopped off — usually taking an ear with them.

- Crop it square **before uploading**, centred on the person's face, head and
  shoulders in frame. Any phone's photo editor does this.
- Aim for **600×600 or larger**. Bigger is fine; the site resizes it down.
- Name it in lower case with dashes: `firstname-lastname.jpg`.
- If other people are in the shot, crop them out.

### 2. Upload it

On GitHub, open the **`assets/img/people/`** folder → **Add file** → **Upload
files** → drag it in → **Commit changes**.

### 3. Point the person at it

Open **`data/people.js`** and find them. Someone without a photo looks like
this:

```js
        { name: "Jane Doe", pronouns: "she/her", email: "jd99@rice.edu",
          photo: null, photoDrive: null },
```

Change `photo: null` to the filename, and add `focus`:

```js
        { name: "Jane Doe", pronouns: "she/her", email: "jd99@rice.edu",
          photo: "jane-doe.jpg", focus: "center center", photoDrive: null },
```

Commit, and the lettered tile becomes their photo.

**Replacing a photo instead?** Upload the new file under the **same filename**
and it swaps everywhere that person appears — no data change needed. Several
people are listed twice (the Chief Justice is also an AJ, for instance), and
both entries point at the same file.

### If the crop is still wrong

`focus` controls which part of a square photo stays visible, like dragging the
picture inside its frame. It takes two values: across, then down.

```js
focus: "center center"   /* the middle — the normal choice */
focus: "center 20%"      /* pulls the view up, for a head near the top */
focus: "center 70%"      /* pulls the view down */
```

If someone's forehead is cut off, try `"center 20%"`. If no value fixes it, the
photo needs cropping tighter before upload — `focus` can only move the window,
not zoom it.

### Someone who does not want a photo

Add `optOut: true` to their entry and leave `photo: null`. They keep a lettered
tile and nobody should go looking for a picture of them.

---

## Other things you may need

### Change someone's email, pronouns or title

`data/people.js`, same entry. Edit the text between the quotes.

### Add a person

Copy a neighbouring entry in the same section, change the details. The sections
are `leadership`, `government`, `court`, `committees`, `rhas`, `ajs`, `paas`
and `associates`.

### Change a Resources card

`data/pages.js` → `resources` → the right group → the card. `title` is the
heading, `body` the text, `path` the link, `cta` the button label. Set `path`
and `cta` to `null` for a card with no button.

### Swap the calendar

`data/pages.js` → `calendar.embedSrc`. Paste only the **`src` URL** from Google
Calendar's embed code, not the whole `<iframe>`.

---

## When something breaks

**A page is blank or half-rendered.** You have a typo in a data file — almost
always a missing comma, a missing quote, or a deleted `}`. Nothing is lost.

On GitHub, open the file, click **History**, find the commit before yours, and
either copy the old text back in or use **Revert**. The site rebuilds and
recovers in a minute.

**To avoid it in the first place:** when you paste a new block, check that it
looks exactly like its neighbours — same indentation, same punctuation at the
start and end.

**A photo is not showing.** Check that the filename in `data/people.js` matches
the uploaded file *exactly*, including capitals and `.jpg` vs `.jpeg`. These are
case-sensitive: `Jane-Doe.JPG` and `jane-doe.jpg` are different files.

**A change is not appearing.** Give it a minute, then hard-refresh
(`Cmd/Ctrl + Shift + R`). If it is still missing, check the **Actions** tab on
GitHub for a failed build.

---

## What not to edit

- `assets/js/site.js` and `assets/css/styles.css` — how the site is built and
  styled, not what it says.
- `brand/tokens.css` — every colour and font. Changing one value here changes
  the whole site. See [brand/BRANDING.md](brand/BRANDING.md).
- `CNAME` — holds the domain. Deleting it takes the site off `chao.rice.edu`.
- `sitemap.xml` and `robots.txt` — only need touching if pages are added or
  removed.

Anything deeper is in [README.md](README.md).
