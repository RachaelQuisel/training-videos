<img src="plugins/training-video/icon.png" alt="Training Video icon" width="120">

# Training Video

**A Claude Code plugin I built. Give it a link, and it makes a walk-through video of any web app.**

[![Watch a walk-through made by the plugin](la-maison-scheduling-page-2026-11-11/preview.jpg)](https://rachaelquisel.github.io/training-videos/)

**[Watch a walk-through the plugin made](https://rachaelquisel.github.io/training-videos/)** (4 minutes 28 seconds)

## Why I built it

I run La Maison, a vacation rental in Santa Barbara. I built an app for my cleaners and inspectors. They use it to sign up for dates and to run inspections.

An app only helps if people know where to tap. My team needed a walk-through.

The AI video tool I tried gave me slides with no real screens. The script added hype. It stated rules my app doesn't have. I had to review every video before I could send it.

So I built a plugin. I give it a link. It opens the real app and reads every tab. It writes the script, takes the screenshots, marks each button, and records the narrator.

The first video it made was accurate, and it was dull. I didn't want a monotone slideshow. I kept working on the plugin until the narrator sounded like a friendly coworker: "Found a day you like? Tap the card."

Now I point it at an app and get a walk-through I'm glad to send to my team. The videos are easy to follow.

## Install

Run these two commands in your terminal. You need [Claude Code](https://code.claude.com/docs/en/setup).

```sh
claude plugin marketplace add RachaelQuisel/training-videos
claude plugin install training-video@training-video
```

For narration, store your own ElevenLabs API key on your computer. The plugin contains no key.

```sh
pip install elevenlabs python-dotenv
npx -y @elevenlabs/cli@latest onboard connect --env-path ~/.config/elevenlabs/.env.local
```

## Make a video

Type a request inside Claude Code. Examples:

> /training-video:training-video https://your-app-link

> Make a how-to video of this app for my cleaners. Use a friendly voice and keep it under five minutes. [your app link]

> Make a captions-only video of the first tab. Don't spend any ElevenLabs credits. [your app link]

## What you get

- **Real screens.** Every slide is a screenshot of the live app. The screenshots are taken on the day the video is made.
- **One idea per slide.** A box marks the button being described. A caption repeats the spoken line.
- **A script in plain English.** The sentences are short. The most important rule is said twice.
- **A friendly narrator.** The voice comes from ElevenLabs. Each slide appears just before its first spoken word.
- **A checked result.** The finished audio is transcribed and compared with the script. Frames are pulled from the video and compared with the lines spoken at those moments.
- **Files you can reuse.** The script, screenshots, and highlight positions are saved next to the video. When the app changes, you redo only the screens and lines that changed.

## How it works

1. You give the plugin a link. You answer five questions: who is watching, which voice, how to handle personal data on screen, which colors, and how long.
2. The plugin reads the live app. It lists every tab and button.
3. The plugin writes the script. It shows you the outline before anything costs money.
4. The plugin takes the screenshots. It blocks every request that would save data. It does not press a button that saves, sends, or submits.
5. The plugin tests the voice on one short clip. Then it makes the full narration.
6. The plugin builds the slides, times them to the voice, and assembles the video.
7. The plugin checks the video. It reports the length, the credits spent, and what it checked.

The plugin only reads the app and makes the video. It does not change the app.

## What it works with

- **[Zite](https://www.zite.com) apps**, and any other web app that opens in a browser without a login.
- **[ElevenLabs](https://elevenlabs.io)**, for the narration.
- **Airtable**, when the app reads from an Airtable base. The plugin reads field options and statuses from the live base.
- **Playwright and Chromium**, to open the app and take the screenshots.
- **faster-whisper**, to transcribe the narration for timing and for the final check.
- **ffmpeg and Pillow**, to build the slides and assemble the video.

You can make a captions-only video without an ElevenLabs account. It uses no credits.

## The example: La Maison

La Maison is my vacation rental in Santa Barbara. Its scheduling app is built on Zite. Cleaners and property inspectors use the app to sign up for dates, work through a 76-item inspection checklist, report low supplies, and reach our contractors.

I ran the plugin on that app. The result is a 4 minute 28 second walk-through with 52 slides.

- **The app:** https://5xvhzkfujh.zite.so
- **The video:** [watch it in your browser](https://rachaelquisel.github.io/training-videos/)
- **The source files:** [script, screenshots, narration, and capture script](la-maison-scheduling-page-2026-11-11/)

The video shows the app as my team sees it. It shows first names of our cleaners and inspectors. It shows contact details for our contractors.

## Access and scope

The plugin cannot capture an app that sits behind a login. Attach screenshots for those apps.

Before it takes any screenshot, the plugin asks whether to keep, blur, or skip personal data on screen.

Narration uses your ElevenLabs credits at about one credit per character. The La Maison narration used about 4,250 credits.

The [privacy notice](plugins/training-video/PRIVACY.md) says what leaves your computer.

## Details

- [Working instructions](plugins/training-video/skills/training-video/SKILL.md): every step the plugin follows.
- [The La Maison example](plugins/training-video/skills/training-video/examples/la-maison/): the app, the finished script, and the capture script, bundled with the plugin.
- [Script rules](plugins/training-video/skills/training-video/references/script-rules.md): tone and file formats.
- [Product requirements](docs/prd.md): the problem, 35 user stories, the build decisions, and the checks.

Rachael Quisel maintains this plugin. [Ask a question or report a problem](https://github.com/RachaelQuisel/training-videos/issues). Released under the [MIT license](LICENSE).
