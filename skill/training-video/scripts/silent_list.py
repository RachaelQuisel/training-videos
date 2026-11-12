#!/usr/bin/env python3
"""Captions-only timing: no narration, each slide stays long enough to read its caption.

Usage:
  python3 silent_list.py script.json seg/list.txt

Duration per slide = 1.5 s + 0.4 s per word of the caption (or spoken text), minimum 3 s.
Writes seg/list.txt and seg/boundaries.json, then prints the total for assemble.sh,
which takes the audio argument "none" in this mode.
"""
import json, sys, os


def main(script_path, list_path):
    segs = json.load(open(script_path))['segments']
    bounds = [0.0]
    with open(list_path, 'w') as f:
        for i, s in enumerate(segs):
            words = len((s.get('caption') or s['spoken']).split())
            d = max(3.0, 1.5 + 0.4 * words)
            f.write(f"file '{i:02d}.png'\nduration {d:.3f}\n")
            bounds.append(bounds[-1] + d)
        f.write(f"file '{len(segs) - 1:02d}.png'\n")
    json.dump({'bounds': bounds, 'total': bounds[-1]}, open(os.path.join(os.path.dirname(list_path) or '.', 'boundaries.json'), 'w'), indent=1)
    print(f'total {bounds[-1]:.2f}')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print(__doc__); sys.exit(2)
    main(*sys.argv[1:])
