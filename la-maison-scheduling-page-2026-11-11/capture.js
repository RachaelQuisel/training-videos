// Full read-only recapture after the app changed (evening of 2026-11-11). Only list*/get* requests go through.
const { chromium } = require('playwright'); const fs = require('fs');
const BASE = 'https://5xvhzkfujh.zite.so/', S = 4 / 3, boxes = {};
const wait = (p, ms) => p.waitForTimeout(ms);
async function box(key, loc) { try { const b = await loc.first().boundingBox({ timeout: 5000 }); if (b) boxes[key] = { x: b.x * S, y: b.y * S, width: b.width * S, height: b.height * S }; else console.warn('NO BOX', key); } catch (e) { console.warn('BOX FAILED', key, e.message.split('\n')[0]); } }
const shot = (p, n) => p.screenshot({ path: `frames/${n}.png` });
async function top(p, loc, off = 30) { await loc.first().evaluate((e, off) => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - off), off); await wait(p, 700); }
const tab = (p, n) => p.getByRole('tab', { name: n, exact: true });
const card = (p, t) => p.locator('button:visible', { hasText: t });
const up = (loc, sel) => loc.first().locator(`xpath=ancestor-or-self::*[contains(@class,"${sel}")][1]`);
const txt = (p, t) => p.getByText(t).locator('visible=true');
const btn = (p, t) => p.locator('button:visible', { hasText: t });
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: S });
  await ctx.route('**/api/**', r => { const n = r.request().url().split('/api/')[1] || ''; if (/^(list|get)/.test(n)) return r.continue(); console.log('[BLOCKED WRITE]', n); return r.abort(); });

  // ---------- cleaner link
  const p = await ctx.newPage();
  await p.goto(BASE + '?cleaner=Sam', { waitUntil: 'networkidle', timeout: 60000 }); await wait(p, 4000);
  await shot(p, 'home'); await box('tabs', p.getByRole('tablist'));
  for (const [k, n] of [['tab_mydates', 'My dates'], ['tab_tasks', 'Tasks'], ['tab_supplies', 'Supplies'], ['tab_contractors', 'Contractors'], ['tab_help', 'Help']]) await box(k, tab(p, n));
  await box('greeting', p.locator('h1:visible')); await box('step2', p.locator('span:visible,div:visible', { hasText: /^2$/ }).last());
  const how = up(txt(p, 'Here is how to sign up'), 'rounded-2xl'); await top(p, how, 60); await shot(p, 'howto'); await box('howto', how);
  await top(p, card(p, 'Wed 11/11'), 40); await shot(p, 'taken'); await box('card_taken', card(p, 'Wed 11/11'));
  await top(p, card(p, 'Mon 11/30'), 150); await shot(p, 'open'); await box('card_open', card(p, 'Mon 11/30')); await box('needed', card(p, 'Mon 11/30').locator('span.text-accent')); await box('signup_off', btn(p, 'Sign me up'));
  await top(p, card(p, 'Fri 2/26'), 150); await shot(p, 'sameday'); await box('card_sameday', card(p, 'Fri 2/26')); await box('card_checkout', card(p, 'Sun 2/28'));
  await top(p, card(p, 'Mon 11/30'), 150); await card(p, 'Mon 11/30').first().click(); await wait(p, 800);
  await shot(p, 'checked'); await box('card_checked', card(p, 'Mon 11/30')); await box('signup', btn(p, 'Sign me up'));
  await card(p, 'Mon 11/30').first().click(); await wait(p, 400);
  await tab(p, 'Help').click(); await wait(p, 1500); await p.evaluate(() => window.scrollTo(0, 0)); await wait(p, 300);
  await shot(p, 'help'); await box('help_welcome', up(txt(p, 'Here is how La Maison works'), 'rounded-'));
  const h1 = up(txt(p, '1. Pick your dates'), 'shadow-card'); await top(p, h1, 40); await shot(p, 'help_steps'); await box('help_pick', h1); await box('help_calendar', up(txt(p, "2. You're on the calendar"), 'shadow-card'));
  const h3 = up(txt(p, "Can't make a date?"), 'shadow-card'); await top(p, h3, 60); await shot(p, 'help_cant'); await box('help_cant', h3); await box('help_taken', up(txt(p, 'Dates someone else has'), 'shadow-card'));
  await tab(p, 'Tasks').click(); await wait(p, 9000); await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await wait(p, 800);
  await shot(p, 'tasks_bottom_name'); await box('name_box', p.getByPlaceholder('Your name'));
  await p.close();

  // ---------- inspector link
  const q = await ctx.newPage();
  await q.goto(BASE + '?inspector=Sam', { waitUntil: 'networkidle', timeout: 60000 }); await wait(q, 4000);
  await shot(q, 'insp_home'); await box('insp_greeting', q.locator('h1:visible'));
  const io = q.locator('button[aria-pressed="false"]:visible:not([disabled])').first(); await top(q, io, 150); await shot(q, 'insp_open'); await box('insp_card_open', io);
  await tab(q, 'Tasks').click(); await wait(q, 9000); await q.evaluate(() => window.scrollTo(0, 0)); await wait(q, 300);
  await shot(q, 'tasks_top'); await box('tasks_welcome', up(txt(q, 'Here is how the checklist works'), 'rounded-'));
  const head = txt(q, 'Inspection checklist'); await top(q, head, 60); await shot(q, 'tasks_note'); await box('tasks_note', up(txt(q, 'Please check off each item as you finish it'), 'rounded'));
  const bath = q.getByRole('button', { name: /^Bathroom/ }); await top(q, bath, 30); await shot(q, 'tasks_sections');
  await bath.click(); await wait(q, 1200); await top(q, bath, 30); await shot(q, 'tasks_open'); await box('sec_bathroom', bath);
  const li = q.locator('li:visible:has(summary)').first();
  await box('item1_circle', li.locator('button').first()); await box('item1_why', li.locator('summary'));
  await li.locator('summary').click(); await wait(q, 700); await shot(q, 'tasks_why'); await box('item1_details', li.locator('details')); await li.locator('summary').click(); await wait(q, 400);
  await li.locator('button').first().click(); await wait(q, 700); await shot(q, 'tasks_checked'); await box('item1_done', li);
  const on = (await bath.innerText()).replace(/\s+/g, ' ');
  await bath.click(); await wait(q, 600);
  const kit = q.getByRole('button', { name: /^Kitchen/ }); await kit.click(); await wait(q, 1200); await top(q, kit, 30); await shot(q, 'tasks_kitchen'); await box('sec_kitchen', kit);
  const kli = q.locator('li:visible:has(summary)').first(); await kli.locator('button').first().click(); await wait(q, 400); const k1 = (await kit.innerText()).replace(/\s+/g, ' '); await kli.locator('button').first().click(); await wait(q, 400);
  console.log('bathroom after check:', on, '| kitchen check then uncheck:', k1, '->', (await kit.innerText()).replace(/\s+/g, ' '));
  await kit.click(); await wait(q, 500);
  await q.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await wait(q, 800); await shot(q, 'tasks_bottom');
  await box('count', q.getByText(/of 76 completed/)); await box('submit', btn(q, 'Submit inspection'));
  console.log('count:', await q.getByText(/of \d+ completed/).innerText());

  await tab(q, 'Supplies').click(); await wait(q, 9000); await q.evaluate(() => window.scrollTo(0, 0)); await wait(q, 300);
  await shot(q, 'supplies_top'); await box('supplies_welcome', up(txt(q, 'Please let us know when something is running low'), 'rounded-'));
  await top(q, txt(q, 'Running low on something?'), 120); await shot(q, 'supplies');
  const inp = q.getByPlaceholder(/Search or type an item/); await box('item_input', inp); await box('howmuch', q.getByPlaceholder(/2 rolls/)); await box('additem', btn(q, 'Add Item to List'));
  await inp.click(); await wait(q, 1200); await shot(q, 'supplies_list');
  await inp.pressSequentially('paper', { delay: 60 }); await wait(q, 1200); await shot(q, 'supplies_typed');
  console.log('typed paper ->', (await q.evaluate(() => document.body.innerText)).split("What's running low?")[1].slice(0, 300).replace(/\s+/g, ' '));
  await inp.fill(''); await q.keyboard.press('Escape');

  await tab(q, 'Contractors').click(); await wait(q, 9000); await q.evaluate(() => window.scrollTo(0, 0)); await wait(q, 300);
  await shot(q, 'contractors_top'); await box('contractors_welcome', up(txt(q, 'Here is how to reach our contractors'), 'rounded-'));
  const s = q.getByPlaceholder('Search by name, type, phone or email'); await top(q, s, 150); await shot(q, 'contractors');
  await box('search', s); await box('text_btn', q.locator(':is(a,button):visible', { hasText: /^\s*Text\s*$/ })); await box('email_btn', q.locator(':is(a,button):visible', { hasText: /^\s*Email\s*$/ }));
  await s.click(); await s.pressSequentially('pool', { delay: 60 }); await wait(q, 1000); await shot(q, 'contractors_search');
  console.log('cards after typing pool:', await q.locator(':is(a,button):visible', { hasText: /^\s*Text\s*$/ }).count());
  await s.fill(''); await wait(q, 600); await top(q, q.getByText('Handyman', { exact: true }), 40); await shot(q, 'contractors_more');
  await box('email_faded', q.locator(':is(a,button):visible', { hasText: /^\s*Email\s*$/ }).nth(1));

  fs.writeFileSync('boxes.json', JSON.stringify(boxes, null, 1)); console.log(Object.keys(boxes).length, 'boxes;', fs.readdirSync('frames').length, 'frames');
  await b.close();
})().catch(e => { console.error('ERR', e.message.slice(0, 300)); fs.writeFileSync('boxes.json', JSON.stringify(boxes, null, 1)); process.exit(1); });
