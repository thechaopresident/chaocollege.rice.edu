# Chao College website

Static site for **chaocollege.rice.edu**. Plain HTML, CSS and JavaScript — no
build step, no npm, no framework. Every file you need to edit is plain text.

Layout follows the pattern used by Rice's other residential college sites
(sticky college-colored nav with dropdowns, full-bleed hero with the crest set
into the wordmark, quick links, announcements, photo strip, "Find us at Rice"
map band, contact footer).

---

## Run it locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>. (Opening `index.html` by double-clicking
also works — all paths are relative.)

---

## Where things live

```
index.html            Homepage
about/  resources/  oweek/  calendar/
                      One index.html each — structure only, no content
people/               Landing page linking to the six sections below
people/team/          Magisters, Coordinator, Resident Associates (bios)
people/government/    The Chabinet
people/court/         University Court + class representatives
people/committees/    Committees and representatives
people/student-staff/ RHAs, AJs, PAAs
people/associates/    Faculty, staff and community associates
brand/
  tokens.css          ★ ALL colors and fonts. The branding swap happens here.
  BRANDING.md         Step-by-step swap checklist
data/
  site.js             Nav, hero, quick links, announcements, footer, contact
  people.js           Every person at Chao (from the college contact sheet)
  pages.js            About / Resources / O-Week / Calendar content
assets/
  css/styles.css      Layout and components — references tokens, never raw colors
  js/site.js          Renders the header, footer and all data-driven sections
  img/                Photos (see assets/img/README.md)
```

The `.html` files contain only page structure and mount points. **Content lives
in `data/`.** A student webmaster can update the whole site without opening an
HTML file.

---

## Editing content

### Add or rename a nav item

`data/site.js` → `nav`. Add `children: [...]` to make it a dropdown.
If the item points at a new page, create the folder and copy an existing
`index.html` into it, changing `data-page` and the `<h1>`.

### Update an announcement

`data/site.js` → `announcements`. Newest first. Delete an entry to remove its row.

### Update a person

`data/people.js`. Grouped by section: `leadership`, `government`, `court`,
`committees`, `rhas`, `ajs`, `paas`, `associates`.

### Add a photo

Drop the file in `assets/img/` (or `assets/img/people/`) and set the filename in
the data file. See `assets/img/README.md`. Every image slot shows a
brand-colored placeholder until a real file is set, so nothing looks broken
while you wait on photography.

### The calendar

Already live — the Chao Events Calendar is embedded on `/calendar/`. It is set
by `calendar.embedSrc` in `data/pages.js`, which holds only the **`src` URL**
from Google Calendar's "Embed code", not the whole `<iframe>`; the renderer
builds its own responsive iframe around it. To point at a different calendar,
paste in a new `src`. Setting it to `null` restores the placeholder panel.

### Set the map

`data/site.js` → `contact.mapEmbed` (Google Maps → Share → Embed a map) and
`contact.mapLink`.

---

## How the People pages are laid out

Split across subpages and built from two layouts, both borrowed from the pattern
Rice's other college sites use. The split matters: it is what stops mismatched
bio lengths and photo shapes from leaving holes in a grid.

**Roster cards** (`rosterCard()` in `assets/js/site.js`) — used for every group.
Each card is role → name → pronouns → fixed-ratio portrait → email, and nothing
variable-length is allowed inside. The role, name and pronoun rows have fixed
heights, so every portrait in a row starts at the same y no matter how long a
title runs. People without a photo get a brand-colored tile with their initial.

Long position descriptions do **not** go in the cards — that is what made rows
ragged. `duties()` collects them into a definition list below the grid ("What
each officer does" on the government page).

**Profiles** (`profile()`) — used only on `people/team/`, where the bios run
long. The portrait floats and the text wraps around it, so a 400-word bio and a
60-word one both read correctly and neither leaves a gap. Below 640px the photo
unfloats and centers.

**Pill tabs** (`tabs()`) — the team page and the student-staff page group their
content behind tab pills rather than stacking everything. Keyboard arrows move
between tabs; `aria-selected` and `hidden` are managed for screen readers.

To move an entry between tabs on the team page, set `group` on it in
`data/people.js` — without it, entries are grouped by their `role`, which is why
"Resident Associate" and "Resident Associates" need the same explicit `group`.

## Branding

**Everything visual comes from `brand/tokens.css`.** Full instructions:
**[brand/BRANDING.md](brand/BRANDING.md)**.

### Colors — settled

Sampled straight out of the crest (`brand/crest-master.png`). These are the
only three solid colors in the artwork, so they are exact, not approximations:

| | Hex | Where it appears in the crest |
|---|---|---|
| Navy | `#41406E` | shield ground, dragon outlines, motto lettering |
| Cream | `#F7F1E5` | shield field, ribbon, dragons' bodies |
| Blush | `#D9A6A2` | motto banner, dexter half of the shield, rose charges |

The site uses navy for the nav bar, footer and headings; cream for tinted
sections; blush for buttons and rules. The `-dark`/`-light` steps in
`tokens.css` are derived from these three and chosen to hold contrast — see
the accessibility note at the bottom.

### Fonts — still open

`--font-display` and `--font-body` are web-safe stacks. The crest sets the motto
in a letterspaced serif, but the branding sheet has not named the web faces.
Swapping them is two lines in `tokens.css` plus uncommenting the `FONT-LINK`
block in each `.html` file.

No color is hardcoded anywhere outside `brand/tokens.css`.

---

## Crest, motto and mascot

- **Crest** — `brand/crest-master.png` is the master artwork: 3508x3508,
  transparent. The web-ready derivatives in `assets/img/` (`crest.png`,
  `crest.webp`, `favicon.png`, `apple-touch-icon.png`) are generated from it.
  The master carries a wide transparent margin, so the derivatives are trimmed
  to the artwork's alpha bounding box — otherwise the 34px nav mark would
  render tiny inside an empty box. `crest.png` is palette-quantized (the
  artwork is three flat colors plus antialiasing), which takes it from 343KB to
  61KB with no visible difference. It appears in the nav bar and
  set between "Chao" and "College" in the hero. Because the crest is drawn in
  navy on a transparent ground it would vanish against the navy nav bar, so in
  the header only it sits on a cream plate. Set `crestImage: null` in
  `data/site.js` to fall back to a lettered mark.
- **Motto** — `Una Domus, Multae Viae`, from the crest banner. Set once in
  `data/site.js` (`motto`); rendered in the hero, the footer and the About
  page's quick facts. No translation appears on the site — add one to
  `data/pages.js` if the college wants it published.
- **Mascot** — Dragons. In `data/site.js` (`mascot`) and the About facts.

The master is high-resolution enough for print. If a true vector (SVG/EPS/PDF)
ever turns up it is still worth swapping in, but nothing on the site needs it.

## Placeholder policy

No copy on this site is written by anyone but Chao.

- Text supplied by the college is reproduced **verbatim**.
- Everything else is an explicit slot: `[PLACEHOLDER: what goes here]`.

Placeholders render with a hatched highlight so they are impossible to miss in
review. Find every remaining one:

```bash
grep -rn "\[PLACEHOLDER" --include=*.js --include=*.html .
```

Before launch, when none remain, delete the `.tbd` rule at the end of
`assets/css/styles.css`.

---

## Where the content came from

Three sources, all marked inline in the data files so you can trace any string:

| Tag | Source | Status |
|---|---|---|
| **DRIVE** | "Chao College Contact Sheet" and INFO/TEXT > Main Page, Google Drive (Chao Secretaries) | College-supplied |
| **DRAFT** | The preliminary WordPress site at `chaocollege.rice.edu/chaosite-home-draft/`, pulled 2026-09-07 | **Unapproved — confirm before launch** |
| *(none)* | `[PLACEHOLDER: ...]` | Awaiting exact wording |

Nothing on the site is written on the college's behalf.

### What was filled in from Rice's own sites

Looked up and added, each one linked from the page it appears on:

- **About → At a Glance** — official name (Ting Tsung and Wei Fong Chao College),
  opening, standing as Rice's twelfth college, bed and student counts, the
  "Chaosens" name, mascot, the **official motto translation** ("one home, many
  paths"), the **official colors** (pink, ivory and navy blue — which match the
  crest sampling), architects, and building details.
- **About → Further Reading** — Rice News and Rice Magazine coverage.
- **Resources** — Peer Academic Advisors and Divisional Advisors descriptions
  quoted from the Office of Academic Advising, plus links to Rice Wellbeing,
  Student Judicial Programs, Housing and Dining.
- **People → RHAs** — the official Rice Health Advisors definition from the
  Student Wellbeing peer resources page, with a link.
- **O-Week** — Rice's O-Week hub, schedule, new student checklist and FAQs.
- **Footer** — Housing, Dining, Academic Advising, Wellbeing, O-Week.

Descriptions taken from Rice pages are quoted, not paraphrased, and each sits
beside a link to its source so it can be checked.

### What was lifted from the draft site

Homepage welcome copy and hero tagline ("Home of the Chaosens"), the photo-strip
heading and captions, the Facilities paragraphs, Financial Inclusivity, Give
Feedback, Book a Space, the RHA definition, Diversity & Affinity, the O-Week
introduction and "Your First Week At Chao", and the Calendar introduction.

The draft's History and Namesake pages are still lorem ipsum, so there was
nothing to take — those remain placeholders here.

## What came from the contact sheet

`data/people.js` is transcribed from **Chao College Contact Sheet** (Google
Drive, Chao Secretaries). Counts match the sheet exactly: 5 leadership entries,
11 Chabinet positions, 6 court/class reps, 14 committees (27 members), 4 RHAs,
13 AJs, 9 PAAs, and 20 faculty / 11 staff / 17 community associates.

`about.sections[0]` on the About page is the "About the Chaos" text from
**Drive > INFO/TEXT > Main Page**, with its source link preserved.

### Things to confirm

These are reproduced exactly as they appear on the sheet — correct them in
`data/people.js` if the college wants them corrected:

- `Improvments Representative` → *Improvements*
- `Student Matinence Representative` → *Maintenance*
- `Sophmore Rep` (×2) → *Sophomore*
- `Parlimentarian` → *Parliamentarian*
- Prasanna Bendalam is listed as `pa67@rice.edu` under Court but `pb67@rice.edu`
  under AJs and PAAs.
- The Laundry Representative row is `OPT OUT / NA` — currently a placeholder name.
- Three PAAs are marked Head PAA (`Y`): Ashley Wang, Graham Bixby, Jehad Mahmoud.

From the draft site:

- **All draft copy needs sign-off.** It was written for a preliminary site by
  someone else and has not necessarily been approved.
- The homepage photo caption reads "Chao College community celebration with the
  dragon mascot", but the photo shows **lion dance costumes**, not a dragon
  mascot. Flagged in `data/site.js`.
- "Home of the Chaosens" is the draft's tagline. Confirm that residents are
  called Chaosens and the mascot is Dragons — both appear on the site now.
- The draft's Donate and Calendar pages have no working links behind them, so
  there was no URL to carry over. The Donate nav button is still switched off
  (`navCta: null` in `data/site.js`), and no Chao-specific giving URL turned up
  in a search — ask the development office for one.

From Rice's own sites:

- **Opening date conflict.** Rice News reports the college opening in August
  2026; Rice Magazine (Winter 2026) says the building opened Fall 2025. "August
  2026" is on the page now — confirm which is meant.
- The official colors are given as "pink, ivory and navy blue", which matches
  the crest sampling. Worth confirming there is no separate spec with exact
  hex values.

### Photos

Eleven photos are in place: a hero rendering of the building, five leadership
portraits, and five scene photos across the homepage. Full-resolution originals
are archived in `brand/photo-originals/` — re-crop from those, never from the
web-sized copies in `assets/img/`.

Person photos are **not** hotlinked from Google Drive — those URLs rate-limit
and break. Entries still without a photo keep their `photoDrive` link so you can
download the file and drop it into `assets/img/people/`. Entries marked
`optOut: true` declined a photo; do not add one.

Square crops are controlled per entry by an optional `focus` field (a CSS
`object-position`, e.g. `"center 20%"`) so a full-body shot is not cropped
through someone's head. Two portraits — Tamara Jones and Judith Brunton & Sam
Robinson — were pre-cropped tighter because at thumbnail size the faces were
too small to read.

---

## Deploying to chaocollege.rice.edu

The whole repository is the deployable artifact — there is nothing to compile.
Hand Rice IT the folder (excluding `.claude/`, which is local tooling only), or
point their static host at it. Requirements: none beyond serving files.

The site is host-agnostic: all paths are relative, so it also works from a
subdirectory or straight off the filesystem.

---

## Accessibility notes

Skip link, visible focus rings, `aria-expanded` on menu toggles, `aria-current`
on the active nav item, keyboard-dismissable menus (Escape), reduced-motion
support, and tables with real `<th>` headers. Keep these when editing.

Measured contrast on the current palette (WCAG AA needs 4.5:1 for body text,
3:1 for large text):

| Pair | Ratio | |
|---|---|---|
| White on navy nav | 9.62:1 | AAA |
| Navy heading on cream | 8.55:1 | AAA |
| Body ink on white / cream | 14.8 / 13.2:1 | AAA |
| Navy link on white | 9.62:1 | AAA |
| Blush-light on navy (nav hover) | 6.58:1 | AA |
| Navy text on blush button | 6.18:1 | AA |
| Muted text on cream | 5.91:1 | AA |
| White on blush-dark (button hover) | 5.09:1 | AA |

Blush is light, so button text is navy rather than white, and `--brand-accent-dark`
was set to `#96605C` (not a softer rose) to keep the hover state and link-hover
color above 4.5:1. If you change the accent, re-check those two.
