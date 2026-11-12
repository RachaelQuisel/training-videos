# Training Videos

**Turn any web app into a short, narrated how-to video built from its real screens.**

I build apps for people who would rather not read a manual. So each app gets a video: real screenshots, a yellow box around the button I'm talking about, captions, and a friendly narrator. This repo has the Claude skill that builds those videos and a finished example you can watch.

[![Watch the La Maison app walk-through](la-maison-scheduling-page-2026-11-11/preview.jpg)](https://rachaelquisel.github.io/training-videos/)

**[Watch the La Maison app walk-through](https://rachaelquisel.github.io/training-videos/)** (4 minutes 28 seconds)

## The example: La Maison

La Maison is my vacation rental in Santa Barbara. Its scheduling app is built on [Zite](https://www.zite.com). Cleaners and property inspectors use it to sign up for dates, work through a 76-item inspection checklist, report supplies that are running low, and text or email our contractors.

- **The app:** https://5xvhzkfujh.zite.so
- **The video:** [watch it in your browser](https://rachaelquisel.github.io/training-videos/), or [open the file](la-maison-scheduling-page-2026-11-11/LaMaison-App-Walk-through-Video.mp4)
- **Everything behind it:** [script, screenshots, narration, and capture script](la-maison-scheduling-page-2026-11-11/)

The video makes the app much easier to use. A new cleaner can watch it once and know which tab to open, which card to tap, and that their name is only on the calendar after they tap Sign me up. An inspector sees the checklist, the supplies form, and the contractor list before their first visit. I send the link with each person's sign-up link, and they don't need me on the phone to get started.

## What you get

- **A real walkthrough.** Every slide is a screenshot of the live app, captured the day the video is made.
- **One idea per slide.** A yellow box marks the button being described, and a caption repeats the line for anyone watching without sound.
- **A script in plain English.** Short sentences, no hype, and the one rule that matters most said twice.
- **A voice that fits.** A warm ElevenLabs narrator, timed so each slide appears just before its first word.
- **A checked result.** The finished audio is transcribed and compared to the script, and frames are pulled to confirm each slide matches its narration.
- **Files you can reuse.** The script, screenshots, and highlight positions are saved next to the video, so an app change means redoing only the screens and lines that changed.

## What it works with

- **[Zite](https://www.zite.com) apps**, like La Maison, and any other web app that opens in a browser without a login.
- **[ElevenLabs](https://elevenlabs.io)** for the narration, through your own API key. The example uses the Claire voice on the expressive model.
- **Airtable**, when the app sits on a base. The skill reads field options and statuses from the live base so the script states them correctly.
- **Playwright and Chromium** to open the app and capture the screens.
- **faster-whisper** to transcribe the narration for timing and for the final check.
- **ffmpeg and Pillow** to build the slides and assemble the video.
- **Claude Code**, where the skill runs.

No ElevenLabs account? Choose captions only. That uses no credits.

## How it works

You type one request. The skill does the rest in ten steps, and it stops for your approval before anything costs money.

1. **It asks five questions at once.** Who is watching, voice or captions only, how to handle personal data on screen, which colors and logo, and how long the video should be.
2. **It reads the live app.** It lists every tab and button first, so the script covers the whole app and nothing is left out by accident.
3. **It shows you an outline and waits for your yes.** You see what the narrator will say and which screens will appear. This is the free place to change your mind.
4. **It writes the script.** One short sentence per slide, tied to one screen and one button, then rewritten in plain English.
5. **It captures the screens.** It clicks through the app the way your staff would. Requests that would save data are blocked, and buttons that write data are not pressed.
6. **It tests the voice on one short clip.** The clip contains every name in the script (your app, your company, your tools), so a name the voice says wrong gets fixed for a few credits.
7. **It generates the full narration.** One request to ElevenLabs with your own API key, and it records how many credits were charged.
8. **It builds the slides.** Each screenshot gets a box around the button being described and a caption bar underneath. Title and closing slides use your colors.
9. **It times the slides to the voice and assembles the video.** It listens to the narration, finds where each sentence starts, and shows each slide just before its first word.
10. **It checks the result before you see it.** It transcribes the finished audio to catch wrong names, pulls frames to confirm each slide matches its narration, and tells you the voice, the length, the credits spent, and what it verified. If one line is wrong, it redoes that line only.

### Your ElevenLabs key stays on your computer

The skill contains no API key. Narration runs with a key you store in one file on your own computer, outside the skill folder, so the key is not part of anything you copy, share, or push to GitHub. One-time setup:

```sh
pip install -r ~/.claude/skills/training-video/requirements.txt
npx -y @elevenlabs/cli@latest onboard connect --env-path ~/.config/elevenlabs/.env.local
```

The second command opens ElevenLabs in your browser, asks you to approve, and saves the key to that file. If there is no key file, the skill can use the ElevenLabs connector in Claude instead.

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

Then, inside Claude Code, type a request like one of these:

> /training-video https://5xvhzkfujh.zite.so

> Make a how-to video of this app for my cleaners. Use a friendly voice and keep it under five minutes. [your app link]

> Make a captions-only video of the My dates tab. Don't spend any ElevenLabs credits. [your app link]

The [working instructions](skill/training-video/SKILL.md) have every step. The [script rules](skill/training-video/references/script-rules.md) have the tone rules and file formats, with the La Maison script as the example.

## What's in a video folder

- `LaMaison-App-Walk-through-Video.mp4`: the finished video.
- `preview.jpg`: the still image shown above.
- `script.json`: every spoken line, its screen, and what is highlighted.
- `narration.txt` and `narration.mp3`: the narration text and audio.
- `frames/`: the screenshots, 1280 by 720.
- `boxes.json`, `brand.json`, `boundaries.json`: highlight positions, colors, and slide timing.
- `capture.js`: the script that took the screenshots.

## Access and scope

The skill reads an app and takes screenshots. It doesn't sign anyone up, submit a form, or send a message. Apps behind a login can't be captured this way; attach screenshots instead.

The La Maison video shows the app as my team sees it, with first names of our cleaners and inspectors and contact details for our contractors. For your own video, the skill asks whether to keep, blur, or skip personal data before it captures anything.

Narration uses your ElevenLabs credits, about one credit per character. The La Maison narration used about 4,250.

## How it was designed

The [product requirements](docs/prd.md) cover the problem, 35 user stories, the decisions behind the build, how it is checked, and what I learned making three cuts of the first video in one day.

## Help and details

Maintained by Rachael Quisel. [Ask a question or report a problem](https://github.com/RachaelQuisel/training-videos/issues).
