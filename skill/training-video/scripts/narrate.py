#!/usr/bin/env python3
"""Make narration audio with the ElevenLabs key stored on this computer.

Usage:
  python3 narrate.py voices [--use-case informative_educational]
  python3 narrate.py clip "One or two sentences." test.mp3 [--voice ID] [--model ID]
  python3 narrate.py script script.json narration.mp3 [--voice ID] [--model ID]

Every clip and script call spends ElevenLabs credits. Do not rerun one to retry the same text.
The key is read by elevenlabs_client.py from ~/.config/elevenlabs/.env.local, never from this folder.
"""
import argparse
import json
import sys

DEFAULT_VOICE = "umwdC76NumBsGtudno3p"  # Claire, "E-Learning & Corporate Training"
DEFAULT_MODEL = "eleven_multilingual_v2"
MAX_CHARS = 10000  # eleven_multilingual_v2 limit for one request


def script_text(script):
    return " ".join(s["spoken"].strip() for s in script["segments"])


def check_length(text, limit=MAX_CHARS):
    if not text.strip():
        raise ValueError("no spoken text to narrate")
    if len(text) > limit:
        raise ValueError(f"{len(text)} characters is over the {limit}-character limit for one request; shorten the script")


def generate(text, out_path, voice, model):
    check_length(text)
    from elevenlabs_client import get_client

    client = get_client()
    with client.text_to_speech.with_raw_response.convert(
        voice_id=voice, model_id=model, text=text, output_format="mp3_44100_128"
    ) as response:
        credits = response.headers.get("character-cost")
        audio = b"".join(response.data)
    with open(out_path, "wb") as f:
        f.write(audio)
    print(f"wrote {out_path} ({len(audio)} bytes), voice {voice}, model {model}")
    print(f"characters sent: {len(text)}; credits charged: {credits if credits is not None else 'not reported'}")


def list_voices(use_case):
    from elevenlabs_client import get_client

    for v in get_client().voices.search(page_size=100, use_cases=[use_case] if use_case else None).voices:
        print(f"{v.voice_id}  {v.name}")


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("voices")
    p.add_argument("--use-case", default=None)
    for name in ("clip", "script"):
        p = sub.add_parser(name)
        p.add_argument("source", help="the text for clip, or the path to script.json for script")
        p.add_argument("out")
        p.add_argument("--voice", default=DEFAULT_VOICE)
        p.add_argument("--model", default=DEFAULT_MODEL)
    args = parser.parse_args()

    if args.command == "voices":
        list_voices(args.use_case)
        return
    text = args.source if args.command == "clip" else script_text(json.load(open(args.source)))
    try:
        generate(text, args.out, args.voice, args.model)
    except ValueError as e:
        sys.exit(f"error: {e}")


if __name__ == "__main__":
    main()
