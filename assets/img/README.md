# Images

Drop image files here and reference them **by filename** from the data files —
never with a path. The renderer prefixes the correct directory.

| What | Where it goes | Set in | As |
|---|---|---|---|
| Homepage hero | `assets/img/hero.jpg` | `data/site.js` → `hero.image` | ✅ in place |
| Homepage photo strip | `assets/img/` | `data/site.js` → `photos[].image` | ✅ 4 in place |
| Photo strip captions | — | `data/site.js` → `photos[].caption` | off; `alt` still set |
| Person photos | `assets/img/people/` | `data/people.js` → `photo` | ✅ 5 in place |
| Crest | `assets/img/crest.png` | `data/site.js` → `crestImage` | `"crest.png"` |
| Favicon | `assets/img/favicon.png` | — | replace the file |

Every image slot renders a brand-colored placeholder until a real file is set,
so nothing looks broken while you wait on photography.

## Sizes

- Hero: 2000×1200 or larger, landscape. It is cropped to fill.
- Photo strip: 1200×900 (4:3).
- People: square, 600×600 or larger. The card crops to a square.

## People photos

`data/people.js` records each person's `photoDrive` link from the college
contact sheet. The site deliberately does **not** hotlink Google Drive — those
URLs rate-limit and break. To publish a photo: open the `photoDrive` link,
download the file, save it here under a kebab-case name, and set `photo` on
that person's entry.

Entries marked `optOut: true` declined a photo on the contact sheet. Do not add
one for them.

## Generated crest files

`crest.png`, `crest.webp`, `favicon.png` and `apple-touch-icon.png` are all
derived from `brand/crest-master.png`. If a vector crest arrives, replace the
master and regenerate them rather than editing these by hand.

Two things the regeneration does that matter: it trims the master's transparent
margin to the artwork's alpha bounding box, and it palette-quantizes `crest.png`
(three flat colors plus antialiasing compress to about a fifth of the size).

## Crop focus

Square and 4:3 slots crop with `object-fit: cover`. When a photo would be
cropped through someone's head, set `focus` on that entry — a CSS
`object-position` value:

```js
{ name: "…", photo: "someone.jpg", focus: "center 20%" }
```

`center 20%` pulls the visible band toward the top of the image. Omit `focus`
for a centered crop. If no `object-position` can save the shot (a full-body
photo where the face ends up tiny), crop it tighter in an image editor instead
and reset `focus` to `"center center"`.

## Originals

Full-resolution originals live in `brand/photo-originals/`. Always re-crop from
those, never from the web-sized copies here.
