#!/usr/bin/env python3
"""Check the finished video before sending it.

Usage:
  python3 verify.py out.mp4 script.json seg/boundaries.json [watch words...]

1. Transcribes the final audio and prints every line, with lines that contain a watch word
   marked, so mispronounced names (Airtable heard as "irritable") stand out.
2. Scans the script for words that do not belong in staff training.
3. Pulls a frame from the middle of five evenly spaced segments and saves check.jpg next to the
   video, with the expected caption printed for each, so a person can confirm the slide matches
   the narration at that moment.
"""
import json, subprocess, sys, os, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont

BANNED = ['master', 'listen up', 'listen closely', 'pro tip', 'golden rule', 'boom',
          'i cannot stress', 'you guessed it', 'pay attention', 'crush', 'supercharge']


def main(video, script_path, bounds_path, *watch):
    script = json.load(open(script_path))
    segs = script['segments']
    bounds = json.load(open(bounds_path))['bounds']
    here = os.path.dirname(os.path.abspath(video))

    wav = os.path.join(here, '_verify16k.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-ac', '1', '-ar', '16000', wav], check=True)
    from faster_whisper import WhisperModel
    w = wave.open(wav)
    audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    model = WhisperModel('base.en', device='cpu', compute_type='int8')
    out, _ = model.transcribe(audio, beam_size=1)
    watch = [x.lower() for x in watch]
    print('=== transcript (lines with a watch word are marked >>)')
    for s in out:
        mark = '>>' if any(x in s.text.lower() for x in watch) else '  '
        print(f'{mark} [{int(s.start) // 60}:{int(s.start) % 60:02d}] {s.text.strip()}')

    print('=== banned words in the script')
    text = ' '.join(s['spoken'] for s in segs).lower()
    hits = [b for b in BANNED if b in text]
    print(hits if hits else 'none')

    print('=== spot check')
    n = len(segs)
    picks = [int(n * k / 5) for k in range(5)]
    picks = [min(p + 1, n - 1) for p in picks]
    ims = []
    for p in picks:
        t = (bounds[p] + bounds[p + 1]) / 2
        png = os.path.join(here, f'_chk_{p:02d}.png')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', video, '-frames:v', '1', png], check=True)
        im = Image.open(png).resize((640, 360))
        d = ImageDraw.Draw(im)
        label = f'{t:.0f}s  seg {p}: ' + (segs[p].get('caption') or segs[p]['spoken'])[:70]
        d.rectangle([0, 0, 640, 18], fill='yellow')
        d.text((4, 3), label, fill='black', font=ImageFont.truetype(next(p for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/System/Library/Fonts/Supplemental/Arial.ttf', '/Library/Fonts/Arial.ttf', 'C:/Windows/Fonts/arial.ttf') if os.path.exists(p)), 11))
        ims.append(im)
        print(f'{t:6.1f}s  segment {p}: {segs[p]["spoken"][:80]}')
    sheet = Image.new('RGB', (1280, 360 * 3), 'white')
    for k, im in enumerate(ims):
        sheet.paste(im, ((k % 2) * 640, (k // 2) * 360))
    sheet.save(os.path.join(here, 'check.jpg'))
    print('contact sheet:', os.path.join(here, 'check.jpg'))
    dur = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video],
                         capture_output=True, text=True).stdout.strip()
    print('length seconds:', dur)


if __name__ == '__main__':
    if len(sys.argv) < 4:
        print(__doc__); sys.exit(2)
    main(*sys.argv[1:])
