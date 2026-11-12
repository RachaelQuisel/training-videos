---
name: training-video
description: Make a narrated how-to video of a web app from real screenshots. Plain-language script, red highlights on each button, captions, an ElevenLabs voice synced to every slide, and a self-check before delivery. Use whenever Rachael types /training-video, asks for a training video, how-to video, walkthrough, explainer, screen recording, or onboarding video of an app, dashboard, Zite interface, or Airtable interface, or wants to replace a NotebookLM video. Use it even when she only says "make a video of this."
compatibility: Needs the sandbox shell with Playwright and Chromium, ffmpeg, pdftoppm, Python with Pillow and faster-whisper, the voice-align skill, and for narration either an ElevenLabs API key in ~/.config/elevenlabs/.env.local with the packages in requirements.txt (elevenlabs, python-dotenv), or the ElevenLabs connector (creative_list_voices, creative_generate_speech, creative_get_flow_run_status). The piper fallback needs pip and a one-time 110 MB voice download.
---

# Training video

Build a how-to video of a web app for non-technical staff. Real screens, one idea per slide, a red box around the button being described, a caption bar, and a calm narrator. Output: an MP4 at 1280x720, usually 4 to 8 minutes.

Example: the La Maison app walk-through, a Zite scheduling app for cleaners and property inspectors (4 minutes 28 seconds, Claire on eleven_v4): https://github.com/RachaelQuisel/training-videos/blob/main/la-maison-scheduling-page-2026-11-11/LaMaison-App-Walk-through-Video.mp4 . Watch it in a browser at https://rachaelquisel.github.io/training-videos/ . Its script.json, frames, boxes.json, and capture script are in the same folder of that repository and show what a finished build looks like.

This replaces the NotebookLM route. NotebookLM videos skip the screenshots, add hype, and invent rules, and each one takes a review pass to catch that. Building from the real app with a checked script avoids all three.

The bundled scripts do the repeatable parts. Read `references/script-rules.md` before writing the script; it holds the tone rules, the pronunciation spellings, and the exact JSON the scripts read.

## Before building: ask once, then show the plan

One AskUserQuestion call covering:

1. Audience, and what they must be able to do after watching.
2. Narration: an ElevenLabs voice (her credits, about 4,600 credits for a 6-minute script), captions only, or her own voice recorded later.
3. Privacy: real names, phone numbers, and emails show in screenshots. Blur all PII, blur specific fields only (e.g. phones yes, addresses no), skip screens with data, or keep as is. Ask which fields if she picks partial blur.
4. Brand: logo, colors, a brand guide if one exists.
5. Length target.

Then show the script outline and the list of screens, and wait for a yes. Capturing screens and generating a voice both cost time or credits, so the outline is the cheap place to change course.

## Step 1: Pull facts from live sources

- Read the live app in a headless browser. Apps change daily; capture the same day you deliver and say when you captured.
- List every tab, menu item, and main button in the app before writing the script, and build the outline from that list. An outline written from memory leaves out the tabs you forgot, and nothing later in the build reports them as missing. If a tab is left out on purpose, name it in the outline so she can overrule that.
- If the app sits on an Airtable base, pull field options, statuses, and definitions from the live base with the Airtable connector for every fact the script states. Memory and old screenshots go out of date.
- If a how-to guide already exists, use it as the script source, but recheck each claim against the app.

## Step 2: Write script.json

Follow `references/script-rules.md`. Each segment is one spoken line, an optional caption, one screen, and the highlight keys for that screen. Write brand.json from the brand guide, or from the colors visible in the app when there is no guide.

Before leaving this step:

- Run the `voice-align` skill on the spoken lines. It removes jargon and long sentences, which is what this audience needs, and rewording a line here is free while rewording it after Step 4 costs ElevenLabs credits. Keep the pronunciation spellings from `references/script-rules.md` intact, and recount words per segment afterward (8 to 25).
- Compare every highlight key and screen name in script.json against the Step 1 list. If one names a screen or control that is not on the list, rename it, remove it, or add the capture to the plan now. Otherwise `build_slides.py` reports the missing key only after the screens are already captured.

## Step 3: Capture screens, read-only

Copy `scripts/capture_template.js`, fill in the URL and the click-through, and run it with node. It saves frames/<screen>.png at 1280x720 and boxes.json with the position of every highlight target.

- Navigate like a user: open tabs, drill into a record, open dropdowns and menus for screenshots, then press Escape.
- Change no data. This is a live client system. If a check would save a record (picking a status, submitting a form), skip it and say so in the report.
- Scroll a target into view before measuring it, and measure again after any scroll, because positions are relative to the viewport.
- A PDF export can be downloaded; render page 1 with `pdftoppm -png -r 110 -f 1 -l 1 export.pdf frames/pdf`. build_slides.py fits a page that is not 1280x720 instead of stretching it.
- Apps behind a login cannot be captured from the sandbox. Ask her to attach screenshots or link her computer, and add their positions as `extra_boxes` by hand.

## Step 4: Narration

ElevenLabs, preferred. Use `scripts/narrate.py`, which makes speech with the ElevenLabs API key stored on this computer at `~/.config/elevenlabs/.env.local`. The key file stays outside this skill folder because this folder is published to GitHub; never copy the key, or the key file, into the skill or into a video's project folder. Setup on a new computer: `pip install -r requirements.txt`, then `npx -y @elevenlabs/cli@latest onboard connect --env-path ~/.config/elevenlabs/.env.local`.

1. `python3 scripts/narrate.py voices --use-case informative_educational` lists voice ids and names. Claire ("E-Learning & Corporate Training", voice id umwdC76NumBsGtudno3p) worked well for staff training and is the default voice.
2. Run one short test clip first: `python3 scripts/narrate.py clip "<text>" test.mp3`. Make its text a sentence or two containing every proper noun in the script (app name, client name, people, tools, acronyms). This one clip does two jobs. A blocked account ("Free Tier access has been disabled") fails for a few credits instead of thousands; if it fails, stop and tell her, because she may need to sign in or upgrade. And transcribing the clip with faster-whisper shows names the voice reads wrong (Airtable has been transcribed as "irritable") while a fix is still cheap: change the spelling in the spoken text per `references/script-rules.md`. If a spelling changed, one more short clip to confirm it is fine, since the text is different.
3. `python3 scripts/narrate.py script script.json narration.mp3` joins every segment's spoken text and makes the full narration in one request with model eleven_multilingual_v2. Add `--voice <id>` for a voice other than Claire. It prints the credits charged; record them for the report. One request takes at most 10,000 characters, about 12 minutes of speech; the script stops before spending credits if the text is longer.
4. Each clip and script call charges. Do not run one a second time to retry the same text.

If the key file does not exist and she does not want to create one, use the ElevenLabs connector instead: `creative_list_voices` with use_cases informative_educational, a test clip and then the full text through `creative_generate_speech` with model eleven_multilingual_v2 and generations_count 1, polling `creative_get_flow_run_status` every 45 to 60 seconds until completed, then download content_url with curl to narration.mp3. The same rules apply: test clip first, record credits, no second call for the same text.

Fallback when ElevenLabs is blocked and she agrees: `pip install --break-system-packages piper-tts`, download en_US-lessac-high.onnx and .onnx.json from huggingface.co/rhasspy/piper-voices (en/en_US/lessac/high) in the background, then skip to `scripts/piper_build.py` after Step 5. It builds one clip per segment, so no alignment is needed. The voice is flatter than ElevenLabs; say so.

## Step 5: Build the slides

```
python3 scripts/build_slides.py script.json boxes.json brand.json frames/ seg/
```

The screenshot takes the top 87.5% of the slide, which leaves a 90-pixel caption bar in brand black. Highlights are red rounded boxes with 6 pixels of padding. TITLE, RULE, and END screens become brand cards with the logo cropped from a captured frame. The script warns about any highlight key it cannot find; fix those in extra_boxes before moving on.

## Step 6: Align and assemble

```
ffmpeg -i narration.mp3 -ac 1 -ar 16000 narration16k.wav
python3 scripts/align_narration.py script.json narration16k.wav seg/list.txt
bash scripts/assemble.sh seg/list.txt narration.mp3 <total from align> out.mp4
```

align_narration.py transcribes the narration with word timestamps and matches the words to the script, so each slide starts just before its first spoken word. It prints how many script words matched; under 90% usually means the narration was generated from a different script version.

Captions only, no voice: `python3 scripts/silent_list.py script.json seg/list.txt`, then `bash scripts/assemble.sh seg/list.txt none <total> out.mp4`. Each slide holds long enough to read its caption.

## Step 7: Verify before sending

```
python3 scripts/verify.py out.mp4 script.json seg/boundaries.json "La Maison" Slack
```

Read the transcript it prints for mispronounced names (Airtable heard as "irritable"). Open check.jpg and confirm each of the five frames shows the slide the narration describes at that moment. If a slide is late, adjust `--lead`.

If a name or a line is wrong, regenerate only that segment, not the whole narration:

1. Fix the spelling in that segment's spoken text in script.json.
2. Generate that one segment's text as its own clip with `python3 scripts/narrate.py clip "<text>" fix.mp3` (same voice, same model).
3. Cut the old segment out of narration.mp3 at the start and end times in seg/boundaries.json, put the new clip in its place with ffmpeg, and rerun align_narration.py and assemble.sh.
4. Rerun verify.py and listen to the sentence before and after the replaced segment; the voice level and pace can differ between calls. If the join is audible, say so in the report.

Regenerate the full narration only when more than about a third of the segments changed.

## Step 8: Deliver

- Copy to /mnt/user-data/outputs/<Client>-<Topic>-Video.mp4 and send with SendUserFile, display render.
- Report in plain language: voice used, credits spent, length, what was checked, a privacy note if real data shows, confidence with the reason, what could go wrong, and one next step under two minutes. The usual next step: play the first 30 seconds, then upload over the old Drive file with Manage versions so existing links keep working.
- If an app page links to the old video, offer a Zite prompt that swaps the link and removes any outdated walkthrough text.
- Keep script.json, boxes.json, and frames/ next to the delivered video. When the app changes later, compare the new tab and control inventory against the saved script.json and recapture only the screens that changed.
- A training video changes no client data, so the Seven Deliverables do not apply. The plain-language report above is the record.

## Gotchas

- The Chrome extension can fail mid-session; Playwright in the sandbox is the reliable capture path for public apps.
- faster-whisper's file loader breaks with the installed av version. The scripts read the WAV with wave and numpy for that reason; keep that when editing them.
- Keep each shell step under the tool timeout: run voice-model downloads and pip installs in the background, and split long ffmpeg or whisper jobs.
- `scripts/elevenlabs_client.py` passes the key to the ElevenLabs client itself. The SDK reads the environment when it is imported, before the key file is loaded, so a client created with no key sends no key and every request fails with a 401. Keep that when editing it.
- The Chrome and ElevenLabs connectors can disconnect mid-session. If a tool vanishes, say so and continue with the fallback rather than retrying blindly.
