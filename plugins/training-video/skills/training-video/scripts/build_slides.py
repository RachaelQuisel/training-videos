#!/usr/bin/env python3
"""Build one 1280x720 slide PNG per script segment.

Usage:
  python3 build_slides.py script.json boxes.json brand.json frames/ seg/

script.json  : title, subtitle, end_title, end_subtitle, caption_fixes, segments
boxes.json   : {key: {x, y, width, height}} from capture_template.js (viewport pixels)
brand.json   : red (highlight), black (caption bar and titles), category_label, logo {screen, box},
               optional edge (thin outline around each highlight) and label_color
frames/      : frames/<screen>.png for every screen a segment names
seg/         : output folder, seg/00.png, seg/01.png, ...

Screens named TITLE, RULE and END become brand cards instead of screenshots.
A frame whose size differs from the capture size (for example a rendered PDF page)
is fitted inside the slide instead of stretched.
"""
import json, sys, os, textwrap
from PIL import Image, ImageDraw, ImageFont

W, H = 1280, 720
SCALE = 0.875          # leaves 90px at the bottom for the caption bar
CAP_H = H - int(H * SCALE)
OX = int((W - W * SCALE) / 2)


def find_font(bold=False):
    """Return a font file that exists on this machine (Linux sandbox first, then macOS, then Windows)."""
    names = [
        ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'),
        ('/System/Library/Fonts/Supplemental/Arial Bold.ttf', '/System/Library/Fonts/Supplemental/Arial.ttf'),
        ('/Library/Fonts/Arial Bold.ttf', '/Library/Fonts/Arial.ttf'),
        ('C:/Windows/Fonts/arialbd.ttf', 'C:/Windows/Fonts/arial.ttf'),
    ]
    for b, r in names:
        path = b if bold else r
        if os.path.exists(path):
            return path
    raise SystemExit('No usable font found. Add a .ttf path to find_font().')


F = find_font()
FB = find_font(bold=True)


def hexrgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def main(script_path, boxes_path, brand_path, frames_dir, out_dir):
    script = json.load(open(script_path))
    boxes = json.load(open(boxes_path)) if os.path.exists(boxes_path) else {}
    boxes.update(script.get('extra_boxes', {}))
    brand = json.load(open(brand_path))
    RED, BLACK = hexrgb(brand.get('red', '#CC2222')), hexrgb(brand.get('black', '#1a1a1a'))
    EDGE = hexrgb(brand['edge']) if brand.get('edge') else None
    LABEL = hexrgb(brand['label_color']) if brand.get('label_color') else RED
    fixes = script.get('caption_fixes', {})
    os.makedirs(out_dir, exist_ok=True)

    logo = None
    lg = brand.get('logo')
    if lg:
        src = Image.open(os.path.join(frames_dir, lg['screen'] + '.png')).convert('RGB')
        logo = src.crop(tuple(lg['box']))

    def stripe(d):
        for x in range(W):
            t = x / W
            c = RED if t < .55 else tuple(int(RED[i] + (BLACK[i] - RED[i]) * ((t - .55) / .45)) for i in range(3))
            d.line([(x, 0), (x, 5)], fill=c)

    def card(title, sub):
        im = Image.new('RGB', (W, H), 'white')
        d = ImageDraw.Draw(im)
        if brand.get('stripe', True):
            stripe(d)
        if logo is not None:
            lw = 231
            lh = int(logo.height * lw / logo.width)
            im.paste(logo.resize((lw, lh)), (80, 80))
        if brand.get('category_label'):
            d.text((80, 240), brand['category_label'], font=ImageFont.truetype(FB, 18), fill=LABEL)
        y = 280
        for line in textwrap.wrap(title, 36):
            d.text((80, y), line, font=ImageFont.truetype(FB, 46), fill=BLACK)
            y += 60
        if sub:
            y += 20
            for line in textwrap.wrap(sub, 60):
                d.text((80, y), line, font=ImageFont.truetype(F, 26), fill=(68, 68, 68))
                y += 38
        return im

    def frame(seg):
        screen = seg['screen']
        if screen == 'TITLE':
            return card(script['title'], script.get('subtitle', ''))
        if screen == 'RULE':
            return card(seg.get('caption') or seg['spoken'], None)
        if screen == 'END':
            return card(script.get('end_title', 'Thank you.'), script.get('end_subtitle', ''))
        im = Image.new('RGB', (W, H), 'white')
        src = Image.open(os.path.join(frames_dir, screen + '.png')).convert('RGB')
        fit = seg.get('fit') or src.size != (W, H)
        if fit:
            s = src.copy()
            s.thumbnail((W, int(H * SCALE)))
            im.paste(s, ((W - s.width) // 2, 0))
        else:
            im.paste(src.resize((int(W * SCALE), int(H * SCALE))), (OX, 0))
        d = ImageDraw.Draw(im)
        if not fit:
            for k in seg.get('highlights', []):
                if k not in boxes:
                    print(f'warning: no box for highlight "{k}" in segment "{seg["spoken"][:40]}"', file=sys.stderr)
                    continue
                b = boxes[k]
                p = 6
                x0 = OX + (b['x'] - p) * SCALE
                y0 = (b['y'] - p) * SCALE
                x1 = OX + (b['x'] + b['width'] + p) * SCALE
                y1 = (b['y'] + b['height'] + p) * SCALE
                if EDGE:
                    d.rounded_rectangle([x0 - 2, y0 - 2, x1 + 2, y1 + 2], radius=10, outline=EDGE, width=2)
                d.rounded_rectangle([x0, y0, x1, y1], radius=8, outline=RED, width=5 if EDGE else 4)
        d.rectangle([0, H - CAP_H, W, H], fill=BLACK)
        txt = seg.get('caption') or seg['spoken']
        for a, b in fixes.items():
            txt = txt.replace(a, b)
        lines = textwrap.wrap(txt, 78)[:2]
        fnt = ImageFont.truetype(F, 24)
        y = H - CAP_H + (CAP_H - len(lines) * 32) // 2
        for l in lines:
            w = d.textlength(l, font=fnt)
            d.text(((W - w) / 2, y), l, font=fnt, fill='white')
            y += 32
        return im

    for i, seg in enumerate(script['segments']):
        frame(seg).save(os.path.join(out_dir, f'{i:02d}.png'))
    print(f'wrote {len(script["segments"])} slides to {out_dir}')


if __name__ == '__main__':
    if len(sys.argv) != 6:
        print(__doc__)
        sys.exit(2)
    main(*sys.argv[1:])
