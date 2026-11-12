#!/usr/bin/env python3
"""Find where each script segment starts in one long narration file.

Usage:
  python3 align_narration.py script.json narration16k.wav seg/list.txt [--lead 0.15] [--pad 0.8]

narration16k.wav must be 16 kHz mono (ffmpeg -i narration.mp3 -ac 1 -ar 16000 narration16k.wav).
Writes an ffmpeg concat list with a duration for every slide, and boundaries.json next to it.
Prints the total length to pass to assemble.sh.

How it works: faster-whisper gives a timestamp for every spoken word. The script words and
the transcript words are matched with difflib, so small transcription errors (letters read
as one word, numbers merged) only shift a boundary by a word or two. Unmatched stretches are
interpolated. Each boundary is pulled 'lead' seconds earlier so the slide appears just before
its first word.
"""
import re, json, wave, sys, bisect, os
import numpy as np
from difflib import SequenceMatcher


def norm(t):
    return re.findall(r'[a-z0-9]+', t.lower().replace("'", ''))


def main():
    args = sys.argv[1:]
    lead, pad = 0.15, 0.8
    if '--lead' in args:
        i = args.index('--lead'); lead = float(args[i + 1]); del args[i:i + 2]
    if '--pad' in args:
        i = args.index('--pad'); pad = float(args[i + 1]); del args[i:i + 2]
    script_path, wav_path, list_path = args
    from faster_whisper import WhisperModel

    segs = json.load(open(script_path))['segments']
    ref, starts = [], []
    for s in segs:
        starts.append(len(ref))
        ref += norm(s['spoken'])

    w = wave.open(wav_path)
    assert w.getframerate() == 16000 and w.getnchannels() == 1, 'convert to 16 kHz mono first'
    audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    total = len(audio) / 16000

    model = WhisperModel('base.en', device='cpu', compute_type='int8')
    out, _ = model.transcribe(audio, beam_size=1, word_timestamps=True)
    hyp = []
    for s in out:
        for word in s.words:
            for piece in norm(word.word):
                hyp.append((piece, word.start))

    sm = SequenceMatcher(None, ref, [h[0] for h in hyp], autojunk=False)
    mapping = {}
    for b in sm.get_matching_blocks():
        for k in range(b.size):
            mapping[b.a + k] = b.b + k
    matched = sorted(mapping)

    def t_at(ri):
        if ri in mapping:
            return hyp[mapping[ri]][1]
        i = bisect.bisect_left(matched, ri)
        lo = matched[i - 1] if i > 0 else None
        hi = matched[i] if i < len(matched) else None
        if lo is None:
            return 0.0
        if hi is None:
            return hyp[mapping[lo]][1]
        tl, th = hyp[mapping[lo]][1], hyp[mapping[hi]][1]
        return tl + (th - tl) * (ri - lo) / max(1, hi - lo)

    bounds = [max(0.0, t_at(si) - lead) for si in starts] + [total + pad]
    bounds[0] = 0.0
    for i in range(1, len(bounds)):
        if bounds[i] <= bounds[i - 1]:
            bounds[i] = bounds[i - 1] + 0.5

    with open(list_path, 'w') as f:
        for i in range(len(segs)):
            f.write(f"file '{i:02d}.png'\nduration {bounds[i + 1] - bounds[i]:.3f}\n")
        f.write(f"file '{len(segs) - 1:02d}.png'\n")
    json.dump({'bounds': bounds, 'total': total + pad, 'matched_words': len(mapping), 'script_words': len(ref)},
              open(os.path.join(os.path.dirname(list_path) or '.', 'boundaries.json'), 'w'), indent=1)
    print(f'matched {len(mapping)} of {len(ref)} script words; total {total + pad:.2f}')
    print(json.dumps([round(b, 1) for b in bounds]))


if __name__ == '__main__':
    main()
