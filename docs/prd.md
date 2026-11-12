# Product requirements: how-to videos built from an app's real screens

Written by Rachael Quisel from the build of November 11, 2026. The skill and the first finished video are in this repository. This document records the problem, the decisions, and what was verified.

## Problem Statement

I build small web apps for people whose job is not software: the cleaners and property inspectors at La Maison, my vacation rental in Santa Barbara, and the staff at the nonprofits I work with. They are capable adults doing hard work, and most of them will not read a written guide.

When I hand someone a new app with no walkthrough, three things happen.

- They call or text me to ask where to tap.
- They guess. At La Maison the costly guess is checking a date and leaving, which looks like signing up and is not. The cleaning then has no cleaner.
- They stop using the app and go back to texting me their dates.

I tried the usual ways to make a walkthrough, and each one failed for a specific reason.

- A screen recording takes me an hour, I stumble, and it is out of date the next time I change the app. My apps change often. La Maison's app was redesigned in the middle of the day this build happened.
- An AI video summary of a written guide produced slides with no real screens, added hype ("listen up"), and stated rules the app does not have. Each one took a full review pass to correct.
- A written guide with screenshots is accurate and nobody opens it.

I wanted a video that shows the real app, says only true things, sounds like a friendly coworker, costs a few dollars, and can be rebuilt in minutes when the app changes.

## Solution

One command in Claude Code, `/training-video` followed by a link. I answer five questions (who is watching, which voice, how to treat personal data on screen, which colors, how long), approve an outline, and get back an MP4.

The video is a sequence of slides. Each slide is a screenshot of the live app with a yellow box around the one control being described, a caption bar, and a narrator's line timed to appear with it. The build saves its script, screenshots, and highlight positions next to the video, so a later app change means redoing only what changed.

The first video made this way is the La Maison app walk-through: 4 minutes 28 seconds, 52 slides, covering all five tabs of a Zite app. A cleaner can watch it once and know which tab to open, which card to tap, and that their name is on the calendar only after they tap Sign me up.

## User Stories

**The person watching**

1. As a cleaner, I want to see the real screen I will be using, so that I recognize it when I open my link.
2. As a cleaner, I want the button I'm being told about marked on the screen, so that I don't have to hunt for it.
3. As a cleaner, I want to hear the one rule that matters most twice, so that I don't check a date and leave without signing up.
4. As a cleaner, I want to know what to do when my plans change, so that I give a date back instead of not showing up.
5. As an inspector, I want to see the checklist, the supplies form, and the contractor list before my first visit, so that I arrive knowing what the app will ask of me.
6. As a viewer watching without sound, I want every line shown as a caption, so that I can follow in a quiet house or a loud one.
7. As a viewer, I want the narrator to sound like a friendly coworker, so that I don't feel talked down to.
8. As a viewer, I want the video to be under five minutes, so that I watch it to the end.
9. As a viewer, I want the video to say only things the app does, so that I am not confused by a step that is not there.

**The person making the video**

10. As the app's builder, I want to start from a link, so that I don't prepare anything first.
11. As the builder, I want every tab and main button listed before the script is written, so that no part of the app is left out by accident.
12. As the builder, I want any tab that is left out named in the outline, so that I can overrule it.
13. As the builder, I want to approve the outline before screens are captured or a voice is paid for, so that changing direction is free.
14. As the builder, I want to choose the narrator's voice and how expressive it is, so that the tone fits the audience.
15. As the builder, I want a captions-only option, so that I can make a video without spending voice credits.
16. As the builder, I want my own colors and the app's own logo on the title and end cards, so that the video looks like it belongs to the app.
17. As the builder, I want to be told what the narration will cost before it is generated, so that the charge is not a surprise.
18. As the builder, I want a short test clip before the full narration, so that a blocked account or a mispronounced name costs a few credits instead of thousands.
19. As the builder, I want the build to stop and tell me when the voice service refuses the request, so that I can add credits and continue.
20. As the builder, I want to rewrite the tone of the script and regenerate, so that a dry first cut is not the final cut.
21. As the builder, I want a single wrong line replaced without regenerating the whole narration, so that a small fix has a small cost.
22. As the builder, I want a report of the length, the voice, the credits spent, and what was checked, so that I know what I'm sending out.

**The person responsible for the live app and its data**

23. As the app's owner, I want screens captured without any data being saved, so that making a video never puts a sample name on the real calendar.
24. As the owner, I want buttons that write data shown and highlighted but never pressed, so that the video can teach them safely.
25. As the owner, I want requests that would save data blocked during capture, so that a mistaken click cannot reach the database.
26. As the owner, I want to be asked whether to keep, blur, or skip personal data before anything is captured, so that the choice is mine.
27. As the owner, I want the report to state what personal data is visible, so that I decide where the video may be shared.

**The person maintaining the video later**

28. As the maintainer, I want the app re-read on the day of the build, so that the video matches what viewers will see.
29. As the maintainer, I want a changed app detected before the script is written, so that the video does not describe yesterday's screens.
30. As the maintainer, I want the script, screenshots, and highlight positions saved with the video, so that I can compare them against the app later.
31. As the maintainer, I want earlier cuts kept, so that I can go back to one.

**The person checking the result**

32. As a reviewer, I want the finished audio transcribed and compared to the script, so that a dropped or garbled line is found without listening to the whole video.
33. As a reviewer, I want frames pulled from several points in the video with the line being spoken at each, so that I can confirm the slide matches the narration.
34. As a reviewer, I want names that the transcriber may have misheard rechecked with a more accurate one, so that a transcription error is not mistaken for a pronunciation error.
35. As a reviewer, I want anything the build did not verify stated plainly, so that I know what is left for a person to check.

## Implementation Decisions

**Slides, not a screen recording.** The video is assembled from still screenshots. One line of the script maps to one screen and usually one highlight. This is what makes a single line or a single screen replaceable.

**The live app is the source of facts.** The build opens the app in a headless browser and lists every tab, heading, and control before any script exists. Facts the screen does not show are read from the app's own code, and the script says so when a line rests on that. During this build the app was restyled and reworded between the afternoon and the evening. The second inventory found new welcome boxes on every tab, a renamed supply list, a changed vendor list, and a line about Slack that was gone. All 28 screens were recaptured and the script was corrected to match.

**Capture cannot write.** The browser session allows only requests that read data. Any other request to the app is stopped before it leaves the machine. Controls that write (Sign me up, Submit inspection, Add Item to List, Text, Email) are measured and highlighted, never pressed. Actions that only change what the page shows, such as checking a date box or typing in a search field, are allowed because they are what the viewer most wants to see.

**One script file drives everything.** Each entry holds the caption text, the text sent to the voice, the screen, and the highlights. Caption text and voice text are separate because the voice text carries expression tags and pronunciation spellings that should never appear on screen.

**Highlights are measured, not drawn by hand.** The capture step records the position of each control at the moment of the screenshot, after scrolling. The slide step draws the box from those numbers. Before capture, every highlight named in the script is compared against the inventory, so a missing one is found while it is still free to fix.

**The voice is tested, then bought once.** One short clip containing every proper noun runs first. It proves the account works and shows how names are read. The full narration is then generated in a single request, because one request gives an even voice and each request is charged. A refused request is reported, not retried.

**Timing comes from the audio.** The narration is transcribed with a timestamp on every word. Script words are matched to transcript words, and each slide starts just before its first word. In the final cut 783 of 791 words matched. Unmatched words are placed by interpolation, so a small transcription error moves a slide by a word or two at most.

**Tone is a setting.** The script rules ban hype and talking down, and they also ban dryness when the audience calls for warmth. The first cut was accurate and flat. The second was rewritten to be friendly and to open on the first useful sentence. The third added a more expressive voice model, with a short direction such as warm or curious at the start of each section.

**Brand comes from the app.** Colors are taken from a brand guide when there is one, and asked for when there is not. The logo on the title and end cards is cropped from a captured screen, so it is always the logo the app shows.

**Everything is kept.** The script, screenshots, highlight positions, narration, and the capture script are saved beside the video. Earlier cuts are kept in their own folders.

**Integrations.** Zite hosts the example app. ElevenLabs provides the narration. Playwright with Chromium captures the screens. faster-whisper transcribes for timing and checking. ffmpeg and Pillow build the slides and the video. When an app sits on an Airtable base, the Airtable connector supplies field options and statuses. Claude Code runs the skill. A free local voice is the fallback when the voice service is unavailable.

## Testing Decisions

A good test here checks what a viewer or an owner would notice, not how a script is written inside: is the video made from real screens, does every slide have a caption, was any data changed, was the result checked before it was reported.

- **Every build checks itself.** The finished audio is transcribed and printed line by line with watched names marked. Five frames are pulled from evenly spaced points and shown with the line spoken at each. The script is scanned for words that do not belong in staff training.
- **Capture safety is checked by the log.** Every blocked request is printed. In all four capture runs for La Maison the log showed none, which means no step tried to save.
- **Two written test cases live with the skill.** One asks for a narrated video of the La Maison app and is graded on real screens, no hype words, a check before delivery, and no pressed write buttons. The other asks for a captions-only video and is graded on making no voice request at all. These cases are defined and have not been run end to end yet.
- **What a person still checks.** I listen to the first thirty seconds and the sign-up section. The automated check reads a transcript; it cannot hear tone.

## Out of Scope

- Apps behind a login. They can't be opened from a headless browser without credentials, and the skill does not handle credentials. Attached screenshots are the route for those.
- Recording motion. There is no cursor, scrolling, or animation in the video.
- Pressing anything that writes data, including to show what happens next.
- Hosting, sharing, or tracking who watched.
- Translation into other languages.
- Editing the app itself.

## Further Notes

**What the first build cost.** Three cuts were made in one day: a dry first cut, a friendlier short cut, and the final expressive cut. The final narration used about 4,250 ElevenLabs credits, at roughly one credit per character.

**What I learned.**

- An app can change while you are making a video about it. Re-reading the app before each cut found a redesign that would otherwise have shipped a video of the old screens.
- A short test clip misjudges pace. The same voice read a 30-word clip slowly and a 580-word script quickly, so length is better estimated from a full run than from the test.
- A small transcriber can mishear a name the voice said correctly. Two lines that looked wrong were right when rechecked with a larger one.
- Accuracy is not enough. The first cut said only true things and was dull. Tone is a requirement, not a finish.

**Open items.**

- One line describes a screen that appears only after a real sign-up. It was written from the app's code and has not been seen on screen.
- The two written test cases have not been run.
