# Training Video

A Claude Code plugin that makes a narrated walk-through video of any web app.

You give it a link. It reads the app, writes a plain-English script, takes real screenshots, adds a highlight box and captions, records a friendly narrator, and checks the result.

[Watch an example](https://rachaelquisel.github.io/training-videos/). It walks cleaners and property inspectors through a scheduling app built on Zite.

## Install

```sh
claude plugin marketplace add RachaelQuisel/training-videos
claude plugin install training-video@training-video
```

## Use

Type a request inside Claude Code:

> /training-video:training-video https://your-app-link

> Make a how-to video of this app for my staff. Use a friendly voice and keep it under five minutes. [your app link]

## What it needs

- Playwright with Chromium
- ffmpeg
- Python with Pillow, faster-whisper, elevenlabs, and python-dotenv
- Your own ElevenLabs API key, for narration

A captions-only video needs no ElevenLabs key.

The [working instructions](skills/training-video/SKILL.md) list every step. The [privacy notice](PRIVACY.md) says what leaves your computer.
