# Privacy notice for the Training Video plugin

## What the plugin is

The plugin is one skill. The skill has instructions, reference text, and scripts that run on your computer.

The plugin has no service run by its publisher. It has no account, telemetry, or storage. The publisher does not receive or keep any content through this plugin.

The plugin has no MCP servers, hooks, or agents.

## What runs on your computer

- A script opens the web app you name in a headless browser and takes screenshots.
- A script builds slide images from those screenshots.
- A script transcribes the narration audio with faster-whisper. The transcription runs on your computer.
- A script joins the slides and the audio into a video with ffmpeg.

The screenshots, the script file, the audio, and the video are written to the project folder you are working in.

## What leaves your computer

- **The web app you name.** The browser loads its pages, as your own browser would. The app's host sees those requests.
- **ElevenLabs, when you choose a narrator.** The narration script sends the spoken lines of your script to ElevenLabs and receives audio. It uses your own ElevenLabs API key. ElevenLabs handles that text under its own terms.
- **The faster-whisper model download.** The first transcription downloads a speech model from its public host.

A captions-only video sends nothing to ElevenLabs.

## Your ElevenLabs key

The narration script reads one key, `ELEVENLABS_API_KEY`, from a file on your computer at `~/.config/elevenlabs/.env.local`. The key is sent only to ElevenLabs. The plugin contains no key. The skill instructs Claude never to copy the key into the plugin folder or into a project folder.

## Personal data on screen

Screenshots show whatever the app shows. That can include names, phone numbers, and email addresses. Before any screenshot is taken, the skill asks whether to keep, blur, or skip that data.

## What the skill tells Claude not to do

- Do not press a button that saves, sends, or submits in the app.
- Do not change the app.
- Stop every request to the app that is not a read, when the capture script's read-only setting is on.

These are instructions and a script setting. The tools and permissions you allow in your own session decide what actions are possible.

## Questions

Ask in the [issue tracker](https://github.com/RachaelQuisel/training-videos/issues).
