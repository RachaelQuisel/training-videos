# Script rules and the script.json format

## Who is listening

Staff who do not like software and read at about an 8th-grade level. They are capable adults doing hard work. The narrator is a calm coworker showing them where to click, not a presenter selling a product.

## Tone

- Plain words. One idea per sentence. Short sentences.
- Address staff as coworkers. No hype, no pep talk, no jokes at their expense.
- Words that do not belong: "master," "listen up," "listen closely," "pro tip," "golden rule," "boom," "I cannot stress this enough," "you guessed it," "pay attention," "crush," "supercharge."
- Say the one rule that matters most twice: once near the start, once at the step where it applies. Repetition is the one thing a hype-free script can borrow from sales videos, because it works.
- Do not add rules the app or the guide does not have. If the app lets you skip a note, the script does not say a note is required.
- When no password is needed, the first step is "open the page," not "log in." Staff who hear "log in" look for a login screen.

## Segment shape

- 8 to 25 words per segment. Each segment maps to one screen state and, usually, one highlight.
- A segment that names a button gets that button highlighted. A segment that explains a concept gets no highlight.
- Order: title, the key rule, open the app, one section per task in the order staff do them, errors and what to do, the export or final step, privacy, end card.
- Target 4 to 8 minutes. At a calm pace that is roughly 450 to 900 spoken words.

## Pronunciation (spoken text only; captions keep normal spelling)

Text-to-speech voices read letters and numbers in unexpected ways. These spellings make them read correctly:

- Acronyms as letters with periods: `L.M.` for LM
- Large numbers as words: `seventy-six items in thirteen groups`
- Web addresses letter by letter with commas: `5, x, v, h, z, k, f, u, j, h, dot zite dot so`
- Phone numbers as digit groups: `8 0 5, 5 5 5, 0 1 4 2`
- `N slash A` for N/A
- Product names the voice stumbles on get a spoken fix: ElevenLabs reads "Airtable" correctly; the local piper voice needs "Air table".

`caption_fixes` in script.json turns the spoken spellings back into normal text for the caption bar.

## script.json

```json
{
  "title": "How to Use the La Maison Scheduling Page",
  "subtitle": "For La Maison cleaners and property inspectors",
  "end_title": "Thank you for taking care of La Maison.",
  "end_subtitle": "Questions? Open the Help tab.",
  "caption_fixes": {"seventy-six": "76", "thirteen": "13", "N slash A": "N/A"},
  "spoken_fixes": {"Airtable": "Air table"},
  "extra_boxes": {"step2": {"x": 789, "y": 232, "width": 43, "height": 43}},
  "segments": [
    {"spoken": "This video shows La Maison cleaners and inspectors how to use the scheduling page.", "caption": null, "screen": "TITLE", "highlights": []},
    {"spoken": "Checking a date is not enough. Your name goes on the calendar only after you tap Sign me up.", "caption": null, "screen": "RULE", "highlights": []},
    {"spoken": "To start, open your own link in your web browser. Each person gets their own link. You do not need a password.", "caption": "Open your own link. No password needed.", "screen": "home", "highlights": []},
    {"spoken": "To pick a date, tap its card. A check mark appears and the card turns green.", "caption": null, "screen": "checked", "highlights": ["card_checked"]},
    {"spoken": "Then tap Sign me up at the bottom. This step puts your name on the La Maison calendar.", "caption": null, "screen": "checked", "highlights": ["signup"]},
    {"spoken": "The list has seventy-six items in thirteen groups, such as Bathroom, Kitchen, and Living Areas.", "caption": null, "screen": "tasks_sections", "highlights": []},
    {"spoken": "Thank you for taking care of La Maison.", "caption": null, "screen": "END", "highlights": []}
  ]
}
```

- `screen` is a file name in frames/ without .png, or TITLE, RULE, END.
- `caption` null means the caption bar shows the spoken text (after caption_fixes).
- `highlights` are keys from boxes.json or extra_boxes. Add extra_boxes by hand when a target was not measured (a column header, a step line), using viewport pixels read off the frame.
- `spoken_fixes` apply only in the piper fallback.

## brand.json

```json
{
  "red": "#F2B600",
  "black": "#1F3556",
  "category_label": "LA MAISON  |  SANTA BARBARA",
  "logo": {"screen": "home", "box": [540, 38, 740, 96]},
  "stripe": true
}
```

`red` is the highlight color and `black` is the caption bar and title color; take both from the brand guide when there is one. The logo is cropped from a captured frame (box is left, top, right, bottom in viewport pixels), so the cards use the same logo the app shows. When there is no guide, ask for colors: La Maison had none and Rachael named navy, grey, white, and yellow, so the highlight is yellow and the caption bar is navy. Check the highlight against the app's background before building; yellow on La Maison's cream background needed a thin navy edge to stay visible.
