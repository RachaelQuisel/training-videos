# Training Videos

**Turn a web app into a short, narrated how-to video made from its real screens.**

I build apps for people who do not want to read a manual. Each app gets a video. This repository holds the Claude skill that makes those videos. It also holds one finished video.

[![Watch the La Maison app walk-through](la-maison-scheduling-page-2026-11-11/preview.jpg)](https://rachaelquisel.github.io/training-videos/)

**[Watch the La Maison app walk-through](https://rachaelquisel.github.io/training-videos/)** (4 minutes 28 seconds)

## The example: La Maison

La Maison is my vacation rental in Santa Barbara. Its scheduling app is built on [Zite](https://www.zite.com). Cleaners and property inspectors use the app to:

- sign up for dates
- work through a 76-item inspection checklist
- report supplies that are running low
- text or email our contractors

Links:

- **The app:** https://5xvhzkfujh.zite.so
- **The video:** [watch it in your browser](https://rachaelquisel.github.io/training-videos/), or [open the file](la-maison-scheduling-page-2026-11-11/LaMaison-App-Walk-through-Video.mp4)
- **The source files:** [script, screenshots, narration, and capture script](la-maison-scheduling-page-2026-11-11/)

The video makes the app easier to use.

- A new cleaner watches it once. They learn which tab to open and which card to tap.
- They learn that their name is on the calendar only after they tap Sign me up.
- An inspector sees the checklist, the supplies form, and the contractor list before their first visit.
- I send the video link together with each person's sign-up link.

## What you get

- **Real screens.** Every slide is a screenshot of the live app. The screenshots are taken on the day the video is made.
- **One idea per slide.** A yellow box marks the button being described. A caption repeats the spoken line.
- **A script in plain English.** The sentences are short. The most important rule is said twice.
- **A friendly narrator.** The voice comes from ElevenLabs. Each slide appears just before its first spoken word.
- **A checked result.** The finished audio is transcribed and compared with the script. Frames are pulled from the video and compared with the lines spoken at those moments.
- **Files you can reuse.** The script, screenshots, and highlight positions are saved next to the video. When the app changes, you redo only the screens and lines that changed.

## What it works with

- **[Zite](https://www.zite.com) apps**, and any other web app that opens in a browser without a login.
- **[ElevenLabs](https://elevenlabs.io)**, for the narration. The example uses the Claire voice on the expressive model.
- **Airtable**, when the app reads from an Airtable base. The skill reads field options and statuses from the live base.
- **Playwright and Chromium**, to open the app and take the screenshots.
- **faster-whisper**, to transcribe the narration for timing and for the final check.
- **ffmpeg and Pillow**, to build the slides and assemble the video.
- **Claude Code**, where the skill runs.

You can make a captions-only video without an ElevenLabs account. It uses no credits.

## How it works

1. You give the skill a link. You answer five questions: who is watching, which voice, how to handle personal data on screen, which colors, and how long.
2. The skill reads the live app. It lists every tab and button.
3. The skill writes the script. It shows you the outline before anything costs money.
4. The skill takes the screenshots. It blocks every request that would save data. It does not press a button that saves, sends, or submits.
5. The skill tests the voice on one short clip. Then it makes the full narration.
6. The skill builds the slides, times them to the voice, and assembles the video.
7. The skill checks the video. It reports the length, the credits spent, and what it checked.

The skill only reads the app and makes the video. It does not change the app.

## Use the skill

Copy [`skill/training-video/`](skill/training-video/) into your Claude Code skills folder:

```sh
git clone https://github.com/RachaelQuisel/training-videos
cp -R training-videos/skill/training-video ~/.claude/skills/
```

For narration, store your own ElevenLabs API key on your computer. The skill contains no key.

```sh
pip install -r ~/.claude/skills/training-video/requirements.txt
npx -y @elevenlabs/cli@latest onboard connect --env-path ~/.config/elevenlabs/.env.local
```

Then type a request inside Claude Code. Examples:

> /training-video https://5xvhzkfujh.zite.so

> Make a how-to video of this app for my cleaners. Use a friendly voice and keep it under five minutes. [your app link]

> Make a captions-only video of the My dates tab. Don't spend any ElevenLabs credits. [your app link]

The [working instructions](skill/training-video/SKILL.md) list every step. The [script rules](skill/training-video/references/script-rules.md) cover tone and file formats.

## What is in a video folder

- `LaMaison-App-Walk-through-Video.mp4` is the finished video.
- `preview.jpg` is the still image at the top of this page.
- `script.json` holds every spoken line, its screen, and its highlights.
- `narration.txt` and `narration.mp3` are the narration text and audio.
- `captions.vtt` is the captions file for the video player.
- `frames/` holds the screenshots at 1280 by 720.
- `boxes.json` holds the position of each highlighted button.
- `brand.json` holds the colors, the label, and the logo position.
- `boundaries.json` holds the start time of each slide.
- `capture.js` is the script that took the screenshots.

## Access and scope

The skill cannot capture an app that sits behind a login. Attach screenshots for those apps.

The La Maison video shows the app as my team sees it. It shows first names of our cleaners and inspectors. It shows contact details for our contractors. For your own video, the skill asks whether to keep, blur, or skip personal data before it takes any screenshot.

Narration uses your ElevenLabs credits at about one credit per character. The La Maison narration used about 4,250 credits.

## How it was designed

The [product requirements](docs/prd.md) cover the problem, 35 user stories, the build decisions, the checks, and what I learned.

## Help

Rachael Quisel maintains this repository. [Ask a question or report a problem](https://github.com/RachaelQuisel/training-videos/issues).
