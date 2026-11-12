---
name: training-video
description: Make a narrated how-to video of a web app from real screenshots. Plain-language script, a highlight box on each button, captions, an ElevenLabs voice timed to every slide, and a check before delivery. Use whenever the user types /training-video, asks for a training video, how-to video, walkthrough, explainer, screen recording, or onboarding video of an app, dashboard, Zite interface, or Airtable interface, or wants to replace a NotebookLM video. Use it even when the user only says "make a video of this."
compatibility: Needs Playwright with Chromium, ffmpeg, Python with Pillow, faster-whisper, elevenlabs and python-dotenv, the voice-align skill, and an ElevenLabs API key in ~/.config/elevenlabs/.env.local. Captions-only videos need no ElevenLabs key.
---

# Training video

Build a how-to video of a web app for people who do not work in software.

- Each slide is a real screenshot of the app.
- Each slide covers one idea.
- A box marks the button being described.
- A caption bar repeats the spoken line.
- The output is an MP4 at 1280x720, usually 4 to 8 minutes long.

This skill only reads the app and makes the video. It does not edit, publish, or suggest changes to the app.

Read `references/script-rules.md` before you write the script. It holds the tone rules, the pronunciation spellings, and the file formats the scripts read.

Example: `examples/la-maison/` holds the finished files from a real build. The app is a Zite scheduling app for cleaners and property inspectors. Read `examples/la-maison/README.md` first. It describes the app, the video, and each file.

- Watch the video: https://rachaelquisel.github.io/training-videos/
- The video file: https://github.com/RachaelQuisel/training-videos/blob/main/la-maison-scheduling-page-2026-11-11/LaMaison-App-Walk-through-Video.mp4

## Before building: ask once, then show the plan

Ask these five questions in one AskUserQuestion call.

1. Who is the audience, and what must they be able to do after watching?
2. Which narration: an ElevenLabs voice, captions only, or the user's own voice recorded later? An ElevenLabs voice costs about one credit per character. A 6-minute script costs about 4,000 to 5,500 credits. Ask whether the user wants the standard model or the more expressive one.
3. How should personal data on screen be handled? The options are: blur all of it, blur named fields only, skip screens that show it, or keep it. Ask which fields if the user picks named fields.
4. What is the brand: logo, colors, and a brand guide if one exists?
5. How long should the video be?

Then show the script outline and the list of screens. Wait for a yes before you capture screens or generate a voice. Both cost time or credits, and the outline costs nothing to change.

## Step 1: Read the live app

- Open the live app in a headless browser.
- Capture on the day you deliver. Say when you captured.
- Read the app again before every new cut, even later the same day.
- List every tab, menu item, and main button before you write the script. Build the outline from that list.
- If you leave a tab out on purpose, name it in the outline. The user can then overrule you.
- If the app sits on an Airtable base, read field options, statuses, and definitions from the live base for every fact the script states.
- If a how-to guide already exists, use it as the script source. Check each claim against the app.

## Step 2: Write script.json

Follow `references/script-rules.md`. Each segment has one spoken line, an optional caption, one screen, and the highlight keys for that screen.

Write `brand.json` from the brand guide. If there is no guide, ask the user for colors.

Before you leave this step:

- Run the `voice-align` skill on the spoken lines. Rewording a line now is free. Rewording it after Step 4 costs credits.
- Keep the pronunciation spellings from `references/script-rules.md`.
- Count the words in each segment again. Each segment has 8 to 25 words.
- Compare every highlight key and screen name in `script.json` against the Step 1 list. If one is not on the list, rename it, remove it, or add its capture to the plan.

## Step 3: Capture the screens without saving anything

Copy `scripts/capture_template.js`. Fill in the URL and the clicks. Run it with node.

It saves `frames/<screen>.png` at 1280x720. It saves `boxes.json` with the position of every highlight target.

- Move through the app as a user would. Open tabs, records, dropdowns, and menus for screenshots. Press Escape to close them.
- Change no data. Do not press a button that saves, sends, or submits. Say in the report which buttons you did not press.
- Set `READ_ONLY_API` in the capture script. It stops every request that is not a read before the request leaves the computer.
- Report how many requests were stopped. The expected number is zero.
- You may check a box or type in a search field. Those actions only change what the page shows.
- Scroll a target into view before you measure it. Measure it again after any scroll.
- For a narrow app shaped like a phone screen, set `ZOOM` to 4/3 in the capture script.
- You cannot capture an app behind a login this way. Ask the user for screenshots, and add the highlight positions to `extra_boxes` by hand.

## Step 4: Narration

Use `scripts/narrate.py`. It reads the ElevenLabs API key from `~/.config/elevenlabs/.env.local`.

Never copy the key or the key file into this skill folder or into a video's project folder. This skill folder is published to GitHub.

Setup on a new computer:

```
pip install -r requirements.txt
npx -y @elevenlabs/cli@latest onboard connect --env-path ~/.config/elevenlabs/.env.local
```

1. List the voices: `python3 scripts/narrate.py voices --use-case informative_educational`. Claire is the default voice. Her voice id is `umwdC76NumBsGtudno3p`.
2. Make one short test clip: `python3 scripts/narrate.py clip "<text>" test.mp3`. Write one or two sentences that contain every name in the script: the app, the organization, people, and tools.
3. If the test clip fails, stop and tell the user. The account may be blocked or out of credits.
4. Transcribe the test clip with faster-whisper. If a name is read wrong, change its spelling in the spoken text and make one more test clip.
5. Compare the script's character count with the user's remaining credits. Tell the user first if the full script will not fit. A test clip that passes does not show this.
6. Make the full narration in one request: `python3 scripts/narrate.py script script.json narration.mp3`. Add `--voice <id>` for another voice.
7. Record the credits it prints. One request takes at most 10,000 characters. The script stops before it spends credits if the text is longer.
8. Each clip and script call is charged. Do not run one a second time with the same text.

For a warmer, more expressive voice, add `--model eleven_v4`. With that model, `narrate.py` sends each segment's `tts` line when the segment has one. `references/script-rules.md` explains the `tts` field.

If there is no key file, or the user does not want to spend credits, make a captions-only video in Step 6.

## Step 5: Build the slides

```
python3 scripts/build_slides.py script.json boxes.json brand.json frames/ seg/
```

- The screenshot fills the top 87.5% of the slide.
- A 90-pixel caption bar fills the rest.
- Each highlight is a rounded box with 6 pixels of padding.
- TITLE, RULE, and END screens become cards with the logo cropped from a captured frame.
- The script warns about any highlight key it cannot find. Add those to `extra_boxes` before you continue.

## Step 6: Time the slides and assemble the video

```
ffmpeg -i narration.mp3 -ac 1 -ar 16000 narration16k.wav
python3 scripts/align_narration.py script.json narration16k.wav seg/list.txt
bash scripts/assemble.sh seg/list.txt narration.mp3 <total from align> out.mp4
```

`align_narration.py` transcribes the narration and records a time for every word. It matches those words to the script. Each slide then starts just before its first spoken word.

It prints how many script words matched. If fewer than 90% matched, the narration was probably made from a different version of the script.

For captions only, with no voice:

```
python3 scripts/silent_list.py script.json seg/list.txt
bash scripts/assemble.sh seg/list.txt none <total> out.mp4
```

Each slide then stays up long enough to read its caption.

## Step 7: Check the video before you deliver it

```
python3 scripts/verify.py out.mp4 script.json seg/boundaries.json "La Maison" Slack
```

Replace the last words with the names in your script.

- Read the transcript it prints. Look for names that were heard wrong.
- If a name looks wrong, transcribe that line again with a larger faster-whisper model before you change anything. The small model can mishear a name that was spoken correctly.
- Open `check.jpg`. Confirm that each of the five frames shows the slide for the line spoken at that moment.
- If a slide appears late, change `--lead`.

If one name or one line is wrong, replace only that segment:

1. Fix the spoken text for that segment in `script.json`.
2. Make that one line as its own clip: `python3 scripts/narrate.py clip "<text>" fix.mp3`. Use the same voice and model.
3. Cut the old segment out of `narration.mp3` at the start and end times in `seg/boundaries.json`. Put the new clip in its place with ffmpeg.
4. Run `align_narration.py`, `assemble.sh`, and `verify.py` again.
5. Listen to the sentence before and the sentence after the new clip. Say in the report if the join can be heard.

Make the full narration again only when more than about a third of the segments changed.

## Step 8: Deliver

- Save the video as `<Name>-<Topic>-Video.mp4` in the project folder. Show it in Finder.
- Keep `script.json`, `boxes.json`, and `frames/` next to the video.
- Report in plain language:
  - the voice used
  - the credits spent
  - the length
  - what you checked
  - what personal data is visible
  - what you did not check
  - one next step that takes under two minutes
- The usual next step is to play the first 30 seconds.

When the app changes later, list its tabs and buttons again. Compare that list with the saved `script.json`. Capture only the screens that changed.

## Known problems and their fixes

- The slide builder draws captions and cards as text, so it loads a font file. It looks for one on Linux, macOS, and Windows. If it finds none, add a path in `find_font()` in `build_slides.py`.
- `capture_template.js` loads Playwright from the project folder first, then from the machine-wide npm install.
- faster-whisper cannot load audio files with the installed `av` package. The scripts read the WAV file with `wave` and `numpy` for that reason. Keep that when you edit them.
- Keep each shell step shorter than the tool's time limit. Run installs in the background, and split long ffmpeg or transcription jobs.
- `scripts/elevenlabs_client.py` passes the key to the ElevenLabs client directly. The ElevenLabs package reads the environment before the key file is loaded. A client created without the key sends no key, and every request fails with a 401 error. Keep that when you edit it.
