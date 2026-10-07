#!/usr/bin/env python3
"""
Cut the two dragons out of the crest so the intro animation can move them
independently, and write a crest with their quarters left empty.

Why this works at all: the lower half of the shield is counterchanged. The
left quarter is a blush dragon on a flat cream ground; the right is a cream
dragon on a flat blush ground. So within each quarter there is exactly one
background colour, and everything that is not that colour is dragon.

The shield outline, the centre divider and the motto banner are also "not the
background colour", but unlike the dragons they run off the edges of the
region being examined — so anything connected to an edge is discarded.

Outputs to assets/img/intro/:
    crest-base.png     the crest with both quarters emptied
    dragon-left.png    transparent cutout
    dragon-right.png   transparent cutout
    geometry.json      where each dragon sits on the base, as fractions

Run from the repository root:  python3 tools/make-intro-assets.py
"""

import json
import os
from collections import deque

from PIL import Image

MASTER = "brand/crest-master.png"
OUT = "assets/img/intro"

NAVY, CREAM, BLUSH = (0x41, 0x40, 0x6E), (0xF7, 0xF0, 0xE5), (0xD9, 0xA5, 0xA2)

# Measured from the artwork: the quarters begin just under the chief's fess
# line and end above the motto banner, and the shield's centre divider sits on
# the artwork's horizontal centre.
CENTRE_X = 899
# Wide enough that each dragon sits fully inside its region, arms and claws
# included. Anything clipped by the region's edge gets treated as shield
# furniture and discarded, which is how the right dragon lost its arms.
TOP_FRAC, BOT_FRAC = 0.415, 0.88
LEFT_FRAC, RIGHT_FRAC = 0.16, 0.84

BASE_WIDTH = 1200          # the crest as the intro draws it, large but not huge
TOLERANCE = 40             # how close a pixel must be to count as the ground
GROW = 5                   # pixels to widen the mask by when repainting the base
MARGIN = 60                # how far past the shield edge to look for arms
BAND = 26                  # thickness of the shield outline to erase


def near(p, c, tol=TOLERANCE):
    return all(abs(p[i] - c[i]) <= tol for i in range(3))


def extract(art, box, ground, outer):
    """Return (cutout, mask) for one quarter.

    Colour alone is not enough. The dragon's arms reach across the shield's
    navy outline and fuse with it, so anything that walks the image by
    connectivity treats dragon and shield as one object and loses the arms.

    Instead: flood the quarter's flat ground to learn where the shield's
    interior actually is on each row, take everything that is not that ground
    within those bounds (plus a margin, so the arms that overhang the edge
    come too), and erase the outline where it is still thin line work. An arm
    crossing the outline makes a thicker run, so it survives the erase.
    """
    x0, y0, x1, y1 = box
    sub = art.crop(box)
    w, h = sub.size
    px = sub.load()

    # Search inward from the centre divider. Starting at the outer edge can
    # land on a cream ribbon outside the shield, which floods the wrong region
    # entirely and leaves almost nothing behind.
    span = range(w - 10, 10, -1) if outer == "left" else range(10, w - 10)
    seed = None
    for y in range(h // 4, h // 2):
        for x in span:
            if near(px[x, y], ground):
                seed = (x, y)
                break
        if seed:
            break
    if seed is None:
        raise SystemExit("no ground seed found in quarter " + str(box))

    G = bytearray(w * h)
    q = deque([seed[1] * w + seed[0]])
    G[seed[1] * w + seed[0]] = 1
    while q:
        i = q.popleft()
        cy, cx = divmod(i, w)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h:
                j = ny * w + nx
                if not G[j] and px[nx, ny][3] > 128 and near(px[nx, ny], ground):
                    G[j] = 1
                    q.append(j)

    rows = {}
    for y in range(h):
        xs = [x for x in range(w) if G[y * w + x]]
        if xs:
            rows[y] = (min(xs), max(xs))

    cut = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    cp = cut.load()
    mask = bytearray(w * h)
    for y, (lo, hi) in rows.items():
        for x in range(max(0, lo - MARGIN), min(w, hi + MARGIN + 1)):
            p = px[x, y]
            if p[3] < 128 or near(p, ground):
                continue
            # the shield outline hugs the ground's outer edge
            edge = lo if outer == "left" else hi
            lohi = (edge - BAND, edge) if outer == "left" else (edge, edge + BAND)
            if lohi[0] <= x <= lohi[1]:
                run, xx = 0, edge
                step = -1 if outer == "left" else 1
                while 0 <= xx < w and px[xx, y][3] > 128 and not near(px[xx, y], ground) and run < BAND * 3:
                    run += 1
                    xx += step
                if run <= BAND:
                    continue
            cp[x, y] = p
            mask[y * w + x] = 1
    return cut, mask


def main():
    im = Image.open(MASTER).convert("RGBA")
    art = im.crop(im.getchannel("A").getbbox())
    W, H = art.size
    top, bot = int(H * TOP_FRAC), int(H * BOT_FRAC)

    quarters = {
        "left":  ((int(W * LEFT_FRAC), top, CENTRE_X, bot), CREAM, "left"),
        "right": ((CENTRE_X, top, int(W * RIGHT_FRAC), bot), BLUSH, "right"),
    }

    base = art.copy()
    bp = base.load()
    geometry = {}

    for side, (box, ground, outer) in quarters.items():
        cut, mask = extract(art, box, ground, outer)
        x0, y0, x1, y1 = box
        w = x1 - x0

        # Paint the dragon's pixels back to the quarter's flat ground, so the
        # shield reads as empty once the dragon has gone. The mask is widened
        # first: the cut follows the dragon exactly, which leaves its
        # antialiased fringe behind as a faint ghost of the shape.
        h_ = y1 - y0
        grown = bytearray(mask)
        for _ in range(GROW):
            prev = bytes(grown)
            for y in range(h_):
                for x in range(w):
                    if prev[y * w + x]:
                        continue
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h_ and prev[ny * w + nx]:
                            grown[y * w + x] = 1
                            break
        for y in range(h_):
            for x in range(w):
                if grown[y * w + x]:
                    bp[x0 + x, y0 + y] = (*ground, 255)

        bb = cut.getchannel("A").getbbox()
        cut = cut.crop(bb)
        geometry[side] = {
            # position and size on the base crest, as fractions, so the intro
            # can lay the dragons back exactly where they came from at any size
            "x": (x0 + bb[0]) / W,
            "y": (y0 + bb[1]) / H,
            "w": (bb[2] - bb[0]) / W,
            "h": (bb[3] - bb[1]) / H,
        }
        scale = BASE_WIDTH / W
        cut = cut.resize((max(1, round(cut.width * scale)),
                          max(1, round(cut.height * scale))), Image.LANCZOS)
        os.makedirs(OUT, exist_ok=True)
        cut.save(f"{OUT}/dragon-{side}.png", optimize=True)
        print(f"dragon-{side}.png   {cut.width}x{cut.height}")

    base = base.resize((BASE_WIDTH, round(BASE_WIDTH * H / W)), Image.LANCZOS)
    base.quantize(colors=128, method=Image.FASTOCTREE).save(
        f"{OUT}/crest-base.png", optimize=True)
    print(f"crest-base.png     {base.width}x{base.height}")

    geometry["base"] = {"w": base.width, "h": base.height}
    with open(f"{OUT}/geometry.json", "w") as f:
        json.dump(geometry, f, indent=2)
    print("geometry.json      " + json.dumps(geometry["left"]))


if __name__ == "__main__":
    main()
