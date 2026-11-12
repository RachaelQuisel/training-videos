// Capture the app screens and the position of every button to highlight. Read-only.
//
// Copy this file, fill in URL and the click-through for the app, then:
//   node capture.js
// Writes frames/<key>.png and boxes.json for build_slides.py.
//
// Rules this template follows:
// - 1280x720 viewport, the same size the slides use, so boxes map 1:1.
// - Scroll a target into view before measuring it; measure again after any scroll,
//   because boundingBox() is relative to the viewport.
// - Open dropdowns and menus to screenshot them, then press Escape. Change no data.
// - Downloads (a PDF export) are allowed; render page 1 with: pdftoppm -png -r 110 -f 1 -l 1 export.pdf frames/pdf
const { chromium } = require('playwright');
const fs = require('fs');

const URL = 'https://EXAMPLE.zite.so/';
const boxes = {};
fs.mkdirSync('frames', { recursive: true });

async function box(p, key, loc) {
  try { const b = await loc.first().boundingBox(); if (b) boxes[key] = b; else console.warn('no box for', key); }
  catch (e) { console.warn('box failed for', key, e.message); }
}
async function shot(p, name) { await p.screenshot({ path: `frames/${name}.png` }); }
const wait = (p, ms) => p.waitForTimeout(ms);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, acceptDownloads: true });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'networkidle', timeout: 45000 }); await wait(p, 2500);

  // 1. Home screen and the tabs
  await shot(p, 'home');
  for (const t of ['Tab One', 'Tab Two']) await box(p, 'tab_' + t, p.getByRole('button', { name: t, exact: true }));

  // 2. Drill into a record (example: a list item by its text)
  // await p.getByText('Module 3', { exact: true }).first().click(); await wait(p, 2000);
  // await shot(p, 'list');
  // await box(p, 'first_row', p.getByText(/Oct 26, 2026/));

  // 3. A dropdown: open, screenshot, close
  // await p.locator('[role=combobox]').first().click(); await wait(p, 900);
  // await shot(p, 'statusmenu'); await p.keyboard.press('Escape'); await wait(p, 500);

  // 4. A popover opened by a titled button
  // await p.locator('button[title="Send SMS"]').first().click(); await wait(p, 1000);
  // await shot(p, 'smsmenu'); await p.keyboard.press('Escape');

  // 5. A download (PDF export)
  // const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 20000 }), p.getByText('Export PDF', { exact: true }).click()]);
  // await dl.saveAs('export.pdf');

  fs.writeFileSync('boxes.json', JSON.stringify(boxes, null, 1));
  console.log('boxes:', Object.keys(boxes).join(', '));
  await b.close();
})().catch(e => { console.error('ERR', e.message); fs.writeFileSync('boxes.json', JSON.stringify(boxes, null, 1)); process.exit(1); });
