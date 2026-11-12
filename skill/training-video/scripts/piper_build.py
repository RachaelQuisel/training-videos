#!/usr/bin/env python3
"""Fallback when ElevenLabs is blocked: free local voice, one clip per segment, then concat.

Usage:
  python3 piper_build.py script.json seg/ voice.onnx out.mp4

Needs: pip install --break-system-packages piper-tts, and a voice model such as
en_US-lessac-high.onnx (+ .onnx.json) from huggingface.co/rhasspy/piper-voices.
Slides must already exist in seg/ (build_slides.py). Each slide shows for the length of its
own clip plus half a second. Piper misreads some product names; 'spoken_fixes' in script.json
(for example {"Airtable": "Air table"}) is applied to the spoken text only.
"""
import json, os, subprocess, sys, wave


def main(script_path, seg_dir, voice, out):
    script = json.load(open(script_path))
    fixes = script.get('spoken_fixes', {})
    lst = os.path.join(seg_dir, 'piper_list.txt')
    with open(lst, 'w') as f:
        for i, seg in enumerate(script['segments']):
            text = seg['spoken']
            for a, b in fixes.items():
                text = text.replace(a, b)
            wav = os.path.join(seg_dir, f'{i:02d}.wav')
            subprocess.run(['python3', '-m', 'piper', '-m', voice, '-f', wav,
                            '--length-scale', '1.05', '--sentence-silence', '0.3'],
                           input=text.encode(), check=True, capture_output=True)
            w = wave.open(wav)
            dur = w.getnframes() / w.getframerate() + 0.5
            clip = os.path.join(seg_dir, f'{i:02d}.mp4')
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-i', os.path.join(seg_dir, f'{i:02d}.png'),
                            '-i', wav, '-af', 'apad=pad_dur=0.5', '-t', f'{dur:.2f}',
                            '-c:v', 'libx264', '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-r', '25',
                            '-c:a', 'aac', '-ar', '44100', '-ac', '1', clip], check=True)
            f.write(f"file '{i:02d}.mp4'\n")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', out], check=True)
    print('wrote', out)


if __name__ == '__main__':
    if len(sys.argv) != 5:
        print(__doc__); sys.exit(2)
    main(*sys.argv[1:])
