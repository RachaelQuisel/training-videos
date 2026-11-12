# Example: the La Maison app walk-through

This folder holds the finished files from one real build. Read them when you want to see what a complete build looks like.

## The app

La Maison is a vacation rental in Santa Barbara. Its scheduling app is built on Zite.

- The app: https://5xvhzkfujh.zite.so
- The app opens without a login.
- Each person gets their own link. A cleaner's link ends in `?cleaner=Name`. An inspector's link ends in `?inspector=Name`.

The app has five tabs.

| Tab | Who uses it | What it does |
|---|---|---|
| My dates | Cleaners and inspectors | Sign up for dates, and give a date back |
| Tasks | Inspectors | A 76-item inspection checklist in 13 areas |
| Supplies | Inspectors | Report an item that is running low |
| Contractors | Everyone | Text or email a maintenance vendor |
| Help | Everyone | The sign-up steps in writing |

## The video

- Watch it: https://rachaelquisel.github.io/training-videos/
- Length: 4 minutes 28 seconds, 52 slides
- Audience: La Maison cleaners and property inspectors
- Voice: Claire on `eleven_v4`, with a direction at the start of each section
- Colors: navy caption bar, yellow highlight box with a navy edge
- Personal data: kept as shown, at the owner's choice

## The files

- `script.json` is the full script. Each segment has `spoken` text for the caption and `tts` text for the voice.
- `brand.json` holds the colors, the label, and the logo position.
- `boxes.json` holds the measured position of every highlighted button.
- `capture.js` is the capture script. It sets the read-only block, the 4/3 zoom, and the clicks for each screen.

The screenshots and the narration audio are in the repository: https://github.com/RachaelQuisel/training-videos/tree/main/la-maison-scheduling-page-2026-11-11

## What this build shows

- **The most important rule is said twice.** A check mark does not sign a person up. The tap on Sign me up does.
- **Buttons that write data were never pressed.** Those buttons are Sign me up, Submit inspection, Add Item to List, Text, and Email. The capture run stopped zero save requests.
- **One date box was checked for a screenshot, then unchecked.** That action only changes what the page shows.
- **The tone was a requirement.** The first cut was accurate and dull. The final script uses contractions and short questions, such as "Found a day you like? Tap the card."
- **The script follows the app's own words.** Button and tab names are spelled as the app shows them.
