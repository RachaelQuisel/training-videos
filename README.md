# Training Videos

I make short how-to videos of the web apps I build, and I make them from the real screens. Each one has real screenshots, a yellow box around the button I'm talking about, captions, and a narrator. This repo holds the videos and the Claude skill I use to build them.

## The La Maison scheduling page video

La Maison is my property in Santa Barbara. Cleaners and inspectors use this app to sign up for dates, work through the inspection checklist, report supplies that are running low, and reach our contractors.

- The app: https://5xvhzkfujh.zite.so
- The video: [`la-maison-scheduling-page-2026-11-11/LaMaison-Scheduling-Page-Video.mp4`](la-maison-scheduling-page-2026-11-11/LaMaison-Scheduling-Page-Video.mp4)
- Length: 4 minutes 28 seconds, 52 slides
- Voice: Claire, on the expressive ElevenLabs model
- Captured: November 11, 2026

The video covers all five tabs: My dates, Tasks, Supplies, Contractors, and Help. Nothing was saved to the app while the screens were captured. The buttons that write data (Sign me up, Submit inspection, Add Item to List, Text, Email) were never pressed.

## The skill

`skill/training-video/` is the Claude skill that builds these. I type `/training-video` with a link, answer a few questions, and it does the rest:

1. It reads the live app and lists every tab and button, so the script covers the whole app.
2. It writes the script in plain English, one idea per slide.
3. It captures the screens without changing any data.
4. It tests the voice on one short clip before paying for the full narration.
5. It builds the slides, times each one to the voice, and assembles the video.
6. It transcribes the finished audio and checks five frames before it calls the video done.

`SKILL.md` has the full steps. `references/script-rules.md` has the tone rules and the file formats. `scripts/` has the parts that run the same way every time.

You'll need Playwright, ffmpeg, Python with Pillow and faster-whisper, and an ElevenLabs account for the voice. Captions-only videos need no ElevenLabs credits.

## What's in a video folder

- `LaMaison-Scheduling-Page-Video.mp4`: the finished video.
- `script.json`: every spoken line, its screen, and what is highlighted. `spoken` is the caption text. `tts` is the same line with the expression tags sent to the voice.
- `narration.txt` and `narration.mp3`: the narration text and audio.
- `frames/`: the screenshots, 1280 by 720.
- `boxes.json`: where each highlighted button sits on the screen.
- `brand.json`: the colors, label, and logo position.
- `boundaries.json`: when each slide starts.
- `capture.js`: the script that took the screenshots. It blocks every request that would save data.
- `v1-first-draft/` and `v2-short-cut/`: earlier cuts. They show the app before its navy and yellow redesign.

## When the app changes

I compare the app's tabs and buttons against `script.json`, recapture only the screens that changed, and regenerate only the lines that changed.

## A note on what you'll see

The video shows the app as my team sees it: first names of our cleaners and inspectors, and the phone numbers and emails of our contractors.
