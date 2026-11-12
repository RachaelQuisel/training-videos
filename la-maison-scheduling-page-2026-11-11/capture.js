// Read-only capture. Viewport 960x540 at scale 4/3 gives 1280x720 frames; boxes are scaled to match.
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'https://5xvhzkfujh.zite.so/';
const S = 4 / 3, boxes = {};
fs.mkdirSync('frames', { recursive: true });
const wait = (p, ms) => p.waitForTimeout(ms);
async function box(key, loc) {
  try { const b = await loc.first().boundingBox(); if (b) boxes[key] = { x: b.x * S, y: b.y * S, width: b.width * S, height: b.height * S }; else console.warn('no box for', key); }
  catch (e) { console.warn('box failed for', key, e.message.split('\n')[0]); }
}
const shot = (p, name) => p.screenshot({ path: `frames/${name}.png` });
async function top(p, loc, off = 30) { await loc.first().evaluate((e, off) => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - off), off); await wait(p, 700); }
const card = (p, t) => p.locator('button:visible', { hasText: t });
const tab = (p, n) => p.getByRole('tab', { name: n, exact: true });
const closest = (loc, sel) => loc.first().locator(`xpath=ancestor-or-self::*[contains(@class,"${sel}")][1]`);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: S });
  // Safety: only requests that read data go through. Anything that would save is stopped.
  await ctx.route('**/api/**', r => { const n = r.request().url().split('/api/')[1] || ''; if (/^(list|get)/.test(n)) return r.continue(); console.log('[BLOCKED WRITE]', n); return r.abort(); });

  // ---------- Cleaner link
  const p = await ctx.newPage();
  await p.goto(BASE + '?cleaner=Sam', { waitUntil: 'networkidle', timeout: 60000 }); await wait(p, 4000);
  await shot(p, 'home');
  await box('greeting', p.locator('h1:visible'));
  await box('tabs', p.getByRole('tablist'));
  for (const [k, n] of [['tab_mydates', 'My dates'], ['tab_tasks', 'Tasks'], ['tab_supplies', 'Supplies'], ['tab_contractors', 'Contractors'], ['tab_help', 'Help']]) await box(k, tab(p, n));
  await box('logo', p.getByText('LM', { exact: true }).locator('visible=true'));
  const how = closest(p.getByText('How to sign up').locator('visible=true'), 'rounded-2xl');
  await top(p, how, 60); await shot(p, 'howto'); await box('howto', how);
  await top(p, card(p, 'Wed 11/11'), 40); await shot(p, 'taken'); await box('card_taken', card(p, 'Wed 11/11'));
  await top(p, card(p, 'Mon 11/30'), 150); await shot(p, 'open');
  await box('card_open', card(p, 'Mon 11/30')); await box('needed', card(p, 'Mon 11/30').locator('span.text-accent'));
  await box('signup_off', p.locator('button:visible', { hasText: 'Sign me up' }));
  await top(p, card(p, 'Fri 2/26'), 150); await shot(p, 'sameday'); await box('card_sameday', card(p, 'Fri 2/26'));
  await top(p, card(p, 'Mon 11/30'), 150); await card(p, 'Mon 11/30').first().click(); await wait(p, 800);
  await shot(p, 'checked'); await box('card_checked', card(p, 'Mon 11/30')); await box('signup', p.locator('button:visible', { hasText: 'Sign me up' }));
  await card(p, 'Mon 11/30').first().click(); await wait(p, 400);   // uncheck again

  await tab(p, 'Help').click(); await wait(p, 1500); await p.evaluate(() => window.scrollTo(0, 0));
  await shot(p, 'help'); 
  const h2 = closest(p.getByText("2. You're on the calendar"), 'shadow-card'); await box('help_calendar', h2);
  const h3 = closest(p.getByText("Can't make a date?"), 'shadow-card'); await top(p, h3, 120); await shot(p, 'help_cant'); await box('help_cant', h3);
  console.log('HELP boxes', !!boxes.help_calendar, !!boxes.help_cant);

  await tab(p, 'Contractors').click(); await wait(p, 9000); await p.evaluate(() => window.scrollTo(0, 0)); await wait(p, 400);
  await shot(p, 'contractors');
  await box('search', p.getByPlaceholder('Search by name, type, phone or email'));
  await box('text_btn', p.locator(':is(a,button):visible', { hasText: /^\s*Text\s*$/ })); await box('email_btn', p.locator(':is(a,button):visible', { hasText: /^\s*Email\s*$/ }));
  console.log('contact hrefs', await p.locator('a:visible').evaluateAll(a => a.slice(0, 4).map(x => (x.getAttribute('href') || '').replace(/[0-9]/g, '#').replace(/:[^?]*/, ':…'))));
  await top(p, p.getByText('Handyman', { exact: true }), 40); await shot(p, 'contractors_more');

  await tab(p, 'Tasks').click(); await wait(p, 9000);
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await wait(p, 800);
  await shot(p, 'tasks_bottom_name'); await box('name_box', p.getByPlaceholder('Your name'));
  await p.close();

  // ---------- Inspector link
  const q = await ctx.newPage();
  await q.goto(BASE + '?inspector=Sam', { waitUntil: 'networkidle', timeout: 60000 }); await wait(q, 4000);
  await shot(q, 'insp_home'); await box('insp_greeting', q.locator('h1:visible'));
  await tab(q, 'Tasks').click(); await wait(q, 9000);
  await shot(q, 'tasks_top');
  await box('tasks_note', closest(q.getByText('Check off each item as you finish it'), 'rounded'));
  const bath = q.getByRole('button', { name: /Bathroom/ });
  await top(q, bath, 30); await shot(q, 'tasks_sections');
  await bath.click(); await wait(q, 1200); await top(q, bath, 30);
  await shot(q, 'tasks_open'); await box('sec_bathroom', bath);
  const li = q.locator('li:visible').first();
  await box('item1_circle', li.locator('button').first()); await box('item1_why', li.locator('summary'));
  await li.locator('summary').click(); await wait(q, 700); await shot(q, 'tasks_why'); await box('item1_details', li.locator('details'));
  await li.locator('summary').click(); await wait(q, 400);
  await li.locator('button').first().click(); await wait(q, 700); await shot(q, 'tasks_checked');
  await box('item1_done', li); await box('sec_count', bath);
  await q.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await wait(q, 800);
  await shot(q, 'tasks_bottom');
  await box('count', q.getByText(/of 76 completed/)); await box('submit', q.locator('button:visible', { hasText: 'Submit inspection' }));
  console.log('count text:', await q.getByText(/of \d+ completed/).innerText(), '| name box shown on inspector link:', await q.getByPlaceholder('Your name').count());

  await tab(q, 'Supplies').click(); await wait(q, 9000); await q.evaluate(() => window.scrollTo(0, 0)); await wait(q, 400);
  await top(q, q.getByText('Running low on something?'), 150);
  await shot(q, 'supplies');
  await box('item_input', q.getByPlaceholder(/Search or type an item/)); await box('howmuch', q.getByPlaceholder(/2 rolls/)); await box('additem', q.locator('button:visible', { hasText: 'Add Item to List' }));
  await q.getByPlaceholder(/Search or type an item/).click(); await wait(q, 1200); await shot(q, 'supplies_list');
  await q.keyboard.press('Escape');

  fs.writeFileSync('boxes.json', JSON.stringify(boxes, null, 1));
  console.log('boxes:', Object.keys(boxes).join(', '));
  await b.close();
})().catch(e => { console.error('ERR', e.message); fs.writeFileSync('boxes.json', JSON.stringify(boxes, null, 1)); process.exit(1); });
