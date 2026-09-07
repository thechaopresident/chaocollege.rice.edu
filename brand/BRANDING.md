# Swapping in Chao's branding

Everything visual comes from `brand/tokens.css`. This is the whole checklist.

## 1. Colors — done

The palette is already set, sampled from `brand/crest-master.png`:

```
--brand-navy    #41406E   shield ground, dragon outlines, motto lettering
--brand-cream   #F7F1E5   shield field, ribbon, dragons' bodies
--brand-blush   #D9A6A2   motto banner, dexter half of shield, rose charges
```

These three are the only solid colors in the crest, so they are exact. The
derived steps — `--brand-primary-dark/-light`, `--brand-accent-dark/-light` —
were chosen to hold WCAG AA contrast in the places they are actually used
(see step 4).

Only change these if the official branding sheet contradicts the crest. If it
does, keep the relationships intact: `-light` must be legible **on** the navy
bar, `-dark` must be legible **behind white text**.

## 2. Fonts

Section **2. TYPEFACES**. Two ways in:

**Google Fonts** — in every `.html` file there is a commented block marked
`FONT-LINK`. Uncomment it and set the family. Then put that family first:

```css
--font-display: "Your Display Face", Georgia, serif;
--font-body:    "Your Text Face", -apple-system, sans-serif;
```

**Licensed font files** — drop `.woff2` files into `brand/fonts/`, uncomment
the `@font-face` blocks at the bottom of `tokens.css`, then set the stacks.

Always keep the fallbacks after your family so the page still renders if the
font fails to load.

If the branded display face sits heavy, wide, or is meant to be set in caps,
tune it without touching any component:

```
--display-weight     --display-tracking     --display-transform
--nav-weight         --nav-tracking         --nav-transform
```

## 3. Crest — done

`brand/crest-master.png` is the master: 3508x3508, transparent.
`assets/img/crest.png`, `crest.webp`, `favicon.png` and `apple-touch-icon.png`
are generated from it.

Two things that regeneration does, and that matter if you ever redo it by hand:

- The master carries a wide transparent margin. The derivatives are trimmed to
  the artwork's alpha bounding box, otherwise the 34px nav mark would render as
  a tiny crest floating in an empty box.
- `crest.png` is palette-quantized. The artwork is three flat colors plus
  antialiasing, so 64 colors is lossless to the eye and takes the file from
  343KB to 61KB.

It is wired into the nav bar and the hero via `crestImage` in `data/site.js`.
Where it sits in the hero is set by `hero.crestPlacement`: `"above"` (its own
line, centered over the wordmark — current), `"between"` (set into the wordmark
between the two words) or `"none"`.

Because the crest is drawn in navy on a transparent ground, it would disappear
against the navy nav bar — so in the header only it sits on a cream plate
(`.site-header .crest` in `assets/css/styles.css`). Over the hero it keeps its
own transparent ground.

The master is high-resolution enough for print. A true vector (SVG/EPS/PDF)
would still be nice to have, but nothing on the site needs one.

## 4. Check it

Open `index.html` and confirm:

- White nav text is legible on `--brand-primary`.
- Button text is legible on `--brand-accent`. Blush is a light color, so button
  text is **navy, not white** (6.18:1). If you swap in a darker accent, flip
  `--color-btn-text` back to `--neutral-000`.
- `--brand-accent-dark` (`#96605C`) is deliberately deeper than the crest blush.
  It carries both the button-hover state (white text, 5.09:1) and
  `--color-link-hover` on cream (4.53:1). A softer rose fails both.
- The hero wordmark and crest read clearly over the placeholder gradient — and
  again once a real hero photo is dropped in.

Full measured table is in the README's accessibility section.

## No duplicated colors

Every color on the site resolves to a token in this file. The old placeholder
`favicon.svg`, which had to hardcode two hex values, has been replaced by
`assets/img/favicon.png` generated from the crest — so there is no longer any
exception.
