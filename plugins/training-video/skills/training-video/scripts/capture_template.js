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
// - Open dropdowns and menus to screenshot them, then press Escape. Change no real person's data.
// - The create-and-delete demo runs in its own copy (demo.js) with READ_ONLY_API = null, on a test record only.
//   See section 5 below and Step 3 of SKILL.md.
// - READ_ONLY_API stops every request to the app's API that is not a read, so a mistaken click cannot
//   save anything. Set the two patterns for the app; every stopped request is printed.
// - For a narrow, phone-shaped app, set ZOOM to 4/3: the page renders at 960x540 and the frames still
//   come out 1280x720, with boxes scaled to match.
let pw;
try { pw = require('playwright'); }
catch (e) { pw = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); }
const { chromium } = pw;
const fs = require('fs');

const URL = 'https://EXAMPLE.zite.so/';
const ZOOM = 1;                                   // 1, or 4/3 for narrow apps
const READ_ONLY_API = { match: '**/api/**', allow: /\/api\/(list|get)/ };   // null to turn off
const boxes = {};
fs.mkdirSync('frames', { recursive: true });

async function box(p, key, loc) {
  try { const b = await loc.first().boundingBox(); if (b) boxes[key] = { x: b.x * ZOOM, y: b.y * ZOOM, width: b.width * ZOOM, height: b.height * ZOOM }; else console.warn('no box for', key); }
  catch (e) { console.warn('box failed for', key, e.message); }
}
async function shot(p, name) { await p.screenshot({ path: `frames/${name}.png` }); }
const wait = (p, ms) => p.waitForTimeout(ms);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: Math.round(1280 / ZOOM), height: Math.round(720 / ZOOM) }, deviceScaleFactor: ZOOM });
  if (READ_ONLY_API) await ctx.route(READ_ONLY_API.match, r => {
    if (READ_ONLY_API.allow.test(r.request().url())) return r.continue();
    console.log('[BLOCKED WRITE]', r.request().method(), r.request().url()); return r.abort();
  });
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

  // 5. Create and delete on a TEST record (demo.js only, READ_ONLY_API = null). See Step 3 of SKILL.md.
  //    demo.js should start with: Object.assign(boxes, JSON.parse(fs.readFileSync('boxes.json')))
  // p.on('dialog', d => /delete/i.test(d.message()) ? d.accept() : d.dismiss());   // accept only a delete confirm
  // await p.getByText('Testy Testerson', { exact: true }).first().click(); await wait(p, 2000);
  // await box(p, 'create_button', p.getByRole('button', { name: 'Generate certificate' })); await shot(p, 'demo_before_create');
  // await p.getByRole('button', { name: 'Generate certificate' }).click();
  // await p.getByText(/certificate issued/i).first().waitFor({ timeout: 60000 }); await shot(p, 'demo_created');
  // await p.getByText('Open record', { exact: true }).first().click(); await p.waitForURL(/\/certificate\/rec/);
  // const createdId = p.url().match(/rec[A-Za-z0-9]{14}/)[0]; console.log('CREATED RECORD', createdId);   // report this if a later step fails
  // await box(p, 'delete_button', p.getByRole('button', { name: 'Delete' })); await shot(p, 'demo_record_page');
  // if (!p.url().includes(createdId)) throw new Error('Not on the created record; stopping before Delete. Record ' + createdId);
  // await p.getByRole('button', { name: 'Delete' }).first().click();
  // const dlg = p.getByRole('dialog'); await dlg.waitFor(); await shot(p, 'demo_confirm');
  // await dlg.getByRole('button', { name: 'Delete' }).click();       // the confirm button inside the app's own box
  // await dlg.waitFor({ state: 'hidden', timeout: 30000 }); await shot(p, 'demo_deleted');
  // Then read Airtable for createdId and confirm the record is gone.

  fs.writeFileSync('boxes.json', JSON.stringify(boxes, null, 1));
  console.log('boxes:', Object.keys(boxes).join(', '));
  await b.close();
})().catch(e => { console.error('ERR', e.message); fs.writeFileSync('boxes.json', JSON.stringify(boxes, null, 1)); process.exit(1); });
