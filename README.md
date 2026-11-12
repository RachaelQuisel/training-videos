# Training Videos

How-to videos of web apps, built from real screenshots with the `training-video` skill. Each video has its own folder.

| Video | Folder | Captured | Length | Voice |
|---|---|---|---|---|
| How to Use the La Maison Scheduling Page | `la-maison-scheduling-page-2026-11-11/` | 2026-11-11 (evening, after the app's redesign) | 4 min 28 s | Claire, ElevenLabs expressive model (eleven_v4) |

## What is in each folder

- `<Name>-Video.mp4`: the finished video.
- `script.json`: every spoken line, its caption, its screen, and what is highlighted.
- `narration.txt` and `narration.mp3`: the narration text and audio.
- `frames/`: the screenshots, 1280 by 720.
- `boxes.json`: the position of each highlighted button.
- `brand.json`: colors, label, and logo position for the cards and caption bar.
- `boundaries.json`: when each slide starts.
- `capture.js`: the script that took the screenshots. It blocks every request that would save data.
- `v1-first-draft/`, `v2-short-cut/`: earlier versions, when there are any. The La Maison ones show the app before its navy and yellow redesign.
- In `script.json`, `spoken` is the caption text and `tts` is the same line with the expression tags sent to the voice.

## Updating a video

When the app changes, compare its tabs and buttons against `script.json`, recapture only the screens that changed, and regenerate only the lines that changed.

## Privacy

The La Maison video shows real first names of cleaners and inspectors, and vendor phone numbers and emails. This repository is private for that reason.
