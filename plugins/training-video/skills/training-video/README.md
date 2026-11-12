# Training video

This skill makes a how-to video of a web application from real screenshots. The video can have a narrator or captions only.

## What you tell the assistant

- Who the video is for.
- What viewers should be able to do after they watch.
- Which application to show.
- Whether you want a narrator or captions only.
- How to handle personal information on screen. You can hide all of it, hide named fields, skip those screens, or leave it showing.

You review the outline before any screen is captured and before any voice is paid for.

## What the assistant does

1. It lists every tab and main button in the application. The outline covers the whole application or names what it leaves out.
2. It writes the script in plain English.
3. It captures the screens. It does not press a button that saves, sends, or submits.
4. It tests how the voice says each name before it pays for the full narration.
5. It builds the slides and times each one to the voice.
6. It checks the finished video against the script.

If one line comes out wrong, it replaces that line only.

The skill only reads the application and makes the video. It does not change the application.

## Example

Watch the [La Maison app walk-through](https://rachaelquisel.github.io/training-videos/). It shows a Zite scheduling app for cleaners and property inspectors. The [video file](https://github.com/RachaelQuisel/training-videos/blob/main/la-maison-scheduling-page-2026-11-11/LaMaison-App-Walk-through-Video.mp4) and its source files are in the same repository.

## What it needs

- Playwright with Chromium, to open the application and capture screens.
- ffmpeg, to assemble the video.
- Python with Pillow, faster-whisper, elevenlabs, and python-dotenv.
- An ElevenLabs API key for narration. You store the key on your own computer, outside this folder. The skill contains no key.

A captions-only video does not use ElevenLabs.

The working instructions are in [SKILL.md](SKILL.md).

## Maintenance

RachaelQuisel maintains this skill. Its files are registered in the repository's maintenance inventory. The scheduled maintenance check does not build a full video, and it does not check access to the voice service.
