#!/usr/bin/env python3
"""Build index.html and captions.vtt for the video page from script.json and boundaries.json.
Run from the repository root:  python3 site/build_page.py"""
import json, html
V = 'la-maison-scheduling-page-2026-11-11'
FILE = 'LaMaison-App-Walk-through-Video.mp4'
script = json.load(open(f'{V}/script.json'))
bounds = json.load(open(f'{V}/boundaries.json'))['bounds']
segs = script['segments']
CH = [('My dates', 0), ('Tasks', 22), ('Supplies', 36), ('Contractors', 43), ('Help', 49)]
lines = [{'t': round(bounds[i], 2), 'e': round(bounds[i + 1], 2), 'text': s['spoken'], 'screen': s['screen']} for i, s in enumerate(segs)]
chapters = [{'name': n, 'start': round(bounds[i], 2), 'first': i} for n, i in CH]
total = round(bounds[-1], 2)

def ts(x):
    h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return f'{h:02d}:{m:02d}:{s:06.3f}'
with open(f'{V}/captions.vtt', 'w') as f:
    f.write('WEBVTT\n\n')
    for i, l in enumerate(lines):
        f.write(f"{i + 1}\n{ts(l['t'])} --> {ts(l['e'])}\n{l['text']}\n\n")

DATA = json.dumps({'lines': lines, 'chapters': chapters, 'total': total})
page = open('site/template.html').read().replace('__DATA__', DATA).replace('__V__', V).replace('__FILE__', FILE)
open('index.html', 'w').write(page)
print(len(lines), 'lines,', len(chapters), 'chapters, total', total)
