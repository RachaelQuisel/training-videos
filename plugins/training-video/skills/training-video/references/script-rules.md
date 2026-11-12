# Script rules and file formats

## Who is listening

The viewers do not work in software. Many do not like software. They are capable adults who do hard work.

The narrator is a friendly coworker who shows them where to tap. The narrator is not selling anything.

## Tone

- Use plain words.
- Put one idea in each sentence.
- Keep sentences short.
- Speak to viewers as coworkers.
- Use contractions.
- Start with the first useful sentence.
- Ask the viewer a short question now and then. Example: "Found a day you like? Tap the card."
- Do not use hype, pep talk, or jokes about the viewer.
- Do not use these words: "master," "listen up," "listen closely," "pro tip," "golden rule," "boom," "I cannot stress this enough," "you guessed it," "pay attention," "crush," "supercharge."
- Say the most important rule twice. Say it once near the start and once at the step where it applies.
- Do not add a rule that the app does not have. If the app lets a person skip a note, do not say the note is required.
- When the app has no password, say "open the page." Do not say "log in." A viewer who hears "log in" looks for a login screen.
- A script can be accurate and still dull. The first La Maison cut said only true things, and it was dry. Check the tone before you pay for a voice.

## Segments

- Each segment has 8 to 25 words.
- Each segment shows one screen and usually one highlight.
- A segment that names a button highlights that button.
- A segment that explains an idea has no highlight.
- Put the segments in this order:
  1. the tabs or the first screen
  2. one section for each task, in the order people do them
  3. what to do when something goes wrong
  4. the last step
  5. the end card
- A title card and a rule card are optional. Use them when the user wants them.

## Length

Estimate the length from the word count. Do not estimate it from the test clip. A short clip is read slowly, and a full script is read faster.

| Model | Words per minute | Words for 6 minutes |
|---|---|---|
| `eleven_multilingual_v2` (standard) | about 145 | about 870 |
| `eleven_v4` (expressive) | about 175 | about 1,050 |

These rates come from the Claire voice reading full scripts.

## Pronunciation on the standard model

These rules apply to the spoken text on `eleven_multilingual_v2`. Captions keep normal spelling.

- Write an acronym as letters with periods: `L.M.` for LM.
- Write a large number as words: `seventy-six items in thirteen groups`.
- Write a web address letter by letter with commas: `5, x, v, h, z, k, f, u, j, h, dot zite dot so`.
- Write a phone number as digit groups: `8 0 5, 5 5 5, 0 1 4 2`.
- Write `N slash A` for N/A.

`caption_fixes` in `script.json` changes these spellings back to normal text in the caption bar.

## The expressive model

These rules apply on `eleven_v4`.

- Write numbers as digits.
- Do not use the spellings from the section above.
- Add a `tts` field to a segment when you want to direct the voice.
- The `tts` field holds the spoken line with a direction in square brackets in front. Examples: `[warmly]`, `[happy]`, `[curious]`.
- A direction applies until the next direction. Put one at the start of each section, not on every line.
- Keep `spoken` free of brackets. It is the caption text, and the timing step matches it to the audio.
- `narrate.py` sends the `tts` line when you run it with `--model eleven_v4`.

## script.json

```json
{
  "title": "How to Use the La Maison Scheduling Page",
  "subtitle": "For La Maison cleaners and property inspectors",
  "end_title": "Thank you for taking such good care of La Maison.",
  "end_subtitle": "Questions? Open the Help tab.",
  "caption_fixes": {},
  "extra_boxes": {"step2": {"x": 789, "y": 232, "width": 43, "height": 43}},
  "segments": [
    {"spoken": "There are five tabs across the top: My dates, Tasks, Supplies, Contractors, and Help. Here's what each one does for you.", "tts": "[warmly] There are five tabs across the top: My dates, Tasks, Supplies, Contractors, and Help. Here's what each one does for you.", "caption": null, "screen": "home", "highlights": ["tabs"]},
    {"spoken": "Found a day you like? Tap the card. The box fills in with a check mark.", "tts": "[happy] Found a day you like? Tap the card. The box fills in with a check mark.", "caption": null, "screen": "checked", "highlights": ["card_checked"]},
    {"spoken": "Now the important part: tap Sign me up. That tap puts your name on the La Maison calendar.", "tts": "[warmly] Now the important part: tap Sign me up. That tap puts your name on the La Maison calendar.", "caption": null, "screen": "checked", "highlights": ["signup"]},
    {"spoken": "There are 76 items, sorted into 13 areas like Bathroom, Kitchen, and Living Areas.", "caption": null, "screen": "tasks_sections", "highlights": []},
    {"spoken": "That's everything. Thank you for taking such good care of La Maison.", "caption": null, "screen": "END", "highlights": []}
  ]
}
```

- `screen` is a file name in `frames/` without `.png`. It can also be TITLE, RULE, or END.
- `caption` set to null means the caption bar shows the spoken text.
- `highlights` are keys from `boxes.json` or `extra_boxes`.
- Add a key to `extra_boxes` by hand when a target was not measured. Use pixel positions read from the 1280x720 frame.
- `tts` is optional. Segments without it send their `spoken` text.

## brand.json

```json
{
  "red": "#F2B600",
  "black": "#1F3556",
  "category_label": "LA MAISON  |  SANTA BARBARA",
  "logo": {"screen": "home", "box": [535, 40, 750, 95]},
  "edge": "#1F3556",
  "label_color": "#6B7280",
  "stripe": true
}
```

- `red` is the color of the highlight box.
- `black` is the color of the caption bar and the titles.
- `category_label` is the small label on the cards.
- `logo` is cropped from a captured frame. `box` is left, top, right, bottom in pixels.
- `edge` is optional. It draws a thin outline around each highlight box.
- `label_color` is optional. It sets the color of the small label on the cards.
- `stripe` draws a colored line across the top of each card.

Take the colors from the brand guide when there is one. Ask the user for colors when there is none. La Maison had no guide, and Rachael named navy, grey, white, and yellow.

Check the highlight color against the app's background before you build. A yellow box on La Maison's light background was hard to see. A navy `edge` fixed that.
