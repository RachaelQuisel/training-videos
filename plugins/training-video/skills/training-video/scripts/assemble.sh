#!/usr/bin/env bash
# Join the slides and the narration into one MP4.
#
# One narration file (ElevenLabs):
#   bash assemble.sh seg/list.txt narration.mp3 <total seconds from align_narration.py> out.mp4
# Captions only, no audio:
#   bash assemble.sh seg/list.txt none <total seconds from silent_list.py> out.mp4
#
# The concat list carries a duration per slide. apad adds silence at the end so the last
# slide holds; -t cuts the result to the total so it never runs long.
set -eu
LIST="$1"; AUDIO="$2"; TOTAL="$3"; OUT="$4"
if [ "$AUDIO" = "none" ]; then
  ffmpeg -v error -y -f concat -safe 0 -i "$LIST" \
    -c:v libx264 -tune stillimage -pix_fmt yuv420p -r 25 -t "$TOTAL" "$OUT"
else
  ffmpeg -v error -y -f concat -safe 0 -i "$LIST" -i "$AUDIO" \
    -af apad=pad_dur=0.8 \
    -c:v libx264 -tune stillimage -pix_fmt yuv420p -r 25 \
    -c:a aac -ar 44100 -ac 1 -t "$TOTAL" "$OUT"
fi
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT" | sed 's/^/length seconds: /'
