# Product requirements: how-to videos made from an app's real screens

Rachael Quisel wrote this document from the build of November 11, 2026. The skill and the first finished video are in this repository.

## Problem Statement

I build small web apps for people who do not work in software. They include the cleaners and property inspectors at La Maison, my vacation rental in Santa Barbara. They also include staff at the nonprofits I work with. These people are capable adults who do hard work. Most of them will not read a written guide.

When I give someone a new app with no walkthrough, one of three things happens.

- They call or text me to ask where to tap.
- They guess. At La Maison, the costly guess is to check a date and leave. That looks like signing up, and it is not. The cleaning then has no cleaner.
- They stop using the app. They go back to texting me their dates.

I tried three ways to make a walkthrough. Each one failed.

- **A screen recording.** It takes me an hour. I stumble. It is out of date the next time I change the app, and my apps change often.
- **An AI video summary of a written guide.** The slides had no real screens. The script added hype such as "listen up." It stated rules that the app does not have. Each video took a full review to correct.
- **A written guide with screenshots.** It is accurate. Nobody opens it.

I wanted a video with five properties.

- It shows the real app.
- It says only true things.
- It sounds like a friendly coworker.
- It costs a few dollars.
- It can be rebuilt in minutes when the app changes.

## Solution

I type one command in Claude Code: `/training-video` and a link. I answer five questions. I approve an outline. I get back an MP4.

The five questions cover the audience, the voice, personal data on screen, the colors, and the length.

The video is a sequence of slides. Each slide has four parts.

- A screenshot of the live app.
- A yellow box around the one control being described.
- A caption bar.
- A narrator's line, timed to start with the slide.

The build saves its script, screenshots, and highlight positions next to the video. When the app changes, only the changed screens and lines are redone.

The first video made this way is the La Maison app walk-through. It runs 4 minutes 28 seconds. It has 52 slides. It covers all five tabs of a Zite app.

## User Stories

**The person watching**

1. As a cleaner, I want to see the real screen I will use, so that I recognize it when I open my link.
2. As a cleaner, I want the button I am told about marked on the screen, so that I do not hunt for it.
3. As a cleaner, I want to hear the most important rule twice, so that I do not check a date and leave without signing up.
4. As a cleaner, I want to know what to do when my plans change, so that I give a date back.
5. As an inspector, I want to see the checklist, the supplies form, and the contractor list before my first visit, so that I know what the app will ask of me.
6. As a viewer watching without sound, I want every line shown as a caption, so that I can follow along.
7. As a viewer, I want the narrator to sound like a friendly coworker, so that I do not feel talked down to.
8. As a viewer, I want the video to be under five minutes, so that I watch it to the end.
9. As a viewer, I want the video to say only what the app does, so that a missing step does not confuse me.

**The person making the video**

10. As the app's builder, I want to start from a link, so that I prepare nothing first.
11. As the builder, I want every tab and main button listed before the script is written, so that no part of the app is left out by accident.
12. As the builder, I want any tab that is left out named in the outline, so that I can overrule it.
13. As the builder, I want to approve the outline before screens are captured or a voice is paid for, so that a change of direction is free.
14. As the builder, I want to choose the narrator's voice and how expressive it is, so that the tone fits the audience.
15. As the builder, I want a captions-only option, so that I can make a video without spending voice credits.
16. As the builder, I want my colors and the app's logo on the cards, so that the video looks like it belongs to the app.
17. As the builder, I want to know the narration cost before it is made, so that the charge is not a surprise.
18. As the builder, I want a short test clip before the full narration, so that a blocked account or a mispronounced name costs a few credits.
19. As the builder, I want the build to stop and tell me when the voice service refuses a request, so that I can add credits and continue.
20. As the builder, I want to rewrite the tone of the script and make the narration again, so that a dry first cut is not the final cut.
21. As the builder, I want one wrong line replaced without remaking the whole narration, so that a small fix has a small cost.
22. As the builder, I want a report of the length, the voice, the credits spent, and the checks, so that I know what I am sending out.

**The person responsible for the live app and its data**

23. As the app's owner, I want screens captured without any data being saved, so that making a video never puts a sample name on the real calendar.
24. As the owner, I want buttons that write data shown and highlighted but never pressed, so that the video can teach them safely.
25. As the owner, I want requests that would save data blocked during capture, so that a mistaken click cannot reach the database.
26. As the owner, I want to choose whether personal data is kept, blurred, or skipped before any capture, so that the choice is mine.
27. As the owner, I want the report to state what personal data is visible, so that I decide where the video may be shared.
28. As the owner, I want the skill to leave the app unchanged, so that making a video has no effect on the people using the app.

**The person maintaining the video later**

29. As the maintainer, I want the app read again on the day of the build, so that the video matches what viewers will see.
30. As the maintainer, I want the script, screenshots, and highlight positions saved with the video, so that I can compare them with the app later.
31. As the maintainer, I want only the changed screens recaptured, so that an update takes minutes.

**The person checking the result**

32. As a reviewer, I want the finished audio transcribed and compared with the script, so that a dropped line is found without listening to the whole video.
33. As a reviewer, I want frames pulled from several points in the video with the line spoken at each, so that I can confirm the slide matches the narration.
34. As a reviewer, I want a name that looks wrong in the transcript checked again with a more accurate transcriber, so that a transcription error is not mistaken for a pronunciation error.
35. As a reviewer, I want every unchecked item stated plainly, so that I know what a person still has to check.

## Implementation Decisions

**The video is made of slides.** It is not a screen recording. One line of the script maps to one screen and usually one highlight. That makes a single line or a single screen replaceable.

**The live app is the source of facts.** The build opens the app in a headless browser. A headless browser is a browser that runs without a window. The build lists every tab, heading, and control before any script exists. A fact that the screen does not show is read from the app's own code. The report names any line that rests on the code alone.

**Capture cannot write.** The browser session allows only requests that read data. Every other request to the app is stopped before it leaves the computer. Controls that write are measured and highlighted. They are never pressed. In La Maison, those controls are Sign me up, Submit inspection, Add Item to List, Text, and Email. Checking a date box and typing in a search field are allowed. Those actions only change what the page shows.

**One script file drives the build.** Each entry holds the caption text, the text sent to the voice, the screen, and the highlights. The caption text and the voice text are separate. The voice text can carry a direction such as "warmly." That direction must not appear on screen.

**Highlights are measured.** The capture step records the position of each control when the screenshot is taken. The slide step draws the box from those numbers. Before capture, every highlight named in the script is compared with the list of controls. A missing highlight is then found before any screen is captured.

**The voice is tested, then bought once.** One short clip runs first. It contains every name in the script. It shows that the account works. It shows how the names are read. The full narration is then made in a single request. One request gives an even voice, and each request is charged. A refused request is reported. It is not retried.

**Timing comes from the audio.** The narration is transcribed with a time for every word. Script words are matched to transcript words. Each slide starts just before its first word. In the final cut, 783 of 791 words matched. An unmatched word is placed between its neighbors.

**Tone is a requirement.** The script rules ban hype. They also ban dryness. The first cut was accurate and flat. The second cut was rewritten to be friendly. The third cut used a more expressive voice model, with a direction at the start of each section.

**The brand comes from the app.** Colors come from a brand guide when one exists. The builder is asked for colors when none exists. The logo on the cards is cropped from a captured screen.

**The source files are kept.** The script, screenshots, highlight positions, narration, and capture script are saved next to the video.

**There is one way to make the narration.** The skill's narration script calls ElevenLabs with a key stored on the builder's computer. The key is never stored in the skill or in a video folder. A captions-only video is the option that needs no key.

**Integrations.**

- Zite hosts the example app.
- ElevenLabs provides the narration.
- Playwright with Chromium captures the screens.
- faster-whisper transcribes the audio for timing and for the final check.
- ffmpeg and Pillow build the slides and the video.
- Airtable supplies field options and statuses when an app reads from an Airtable base.
- Claude Code runs the skill.

## Testing Decisions

A good test checks what a viewer or an owner would notice. It does not check how a script is written inside. Examples: the video is made from real screens, every slide has a caption, no data changed, and the result was checked before it was reported.

- **Every build checks itself.** The finished audio is transcribed and printed line by line. Watched names are marked. Five frames are pulled from evenly spaced points. Each frame is shown with the line spoken at that moment. The script is scanned for banned words.
- **The capture log shows whether anything tried to save.** Every stopped request is printed. In every capture run for La Maison, the log showed none.
- **The narration script has unit tests.** Six tests cover how the script text is joined, the length limit, and the choice of text for the expressive model.
- **Two written test cases are stored with the skill.** The first asks for a narrated video of the La Maison app. It is graded on real screens, no hype words, a check before delivery, and no pressed write buttons. The second asks for a captions-only video. It is graded on making no voice request. Neither case has been run from start to finish.
- **A person still listens.** I listen to the first thirty seconds and to the sign-up section. The automated check reads a transcript. It cannot hear tone.

## Out of Scope

- Apps behind a login. A headless browser cannot open them without credentials. The skill does not handle credentials. Attached screenshots are the route for those apps.
- Motion. The video has no cursor, scrolling, or animation.
- Pressing a control that writes data.
- Changing the app.
- Hosting the video, sharing it, or tracking who watched it.
- Translation into other languages.

## Further Notes

**Cost of the first build.** Three cuts were made in one day. The final narration used about 4,250 ElevenLabs credits. The rate is about one credit per character.

**What I learned.**

- A short test clip misjudges pace. The voice read a 30-word clip slowly. It read a 580-word script quickly. Length is better estimated from the word count.
- A small transcriber can mishear a name that the voice said correctly. Two lines looked wrong in the transcript. A larger transcriber showed that both were right.
- Accuracy is not enough. The first cut said only true things, and it was dull.

**Open items.**

- One line describes a screen that appears only after a real sign-up. It was written from the app's code. It has not been seen on screen.
- The two written test cases have not been run.
