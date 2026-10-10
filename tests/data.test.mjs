import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { load, read, root } from './helpers/load.mjs';
import { RESUME_NUMBERS, numbersIn } from './helpers/resume.mjs';

const P = load('assets/js/data.js').PORTFOLIO;

/* Paths that hold ids, colours, URLs or file paths rather than visible copy. */
const NOT_COPY = [
  /^images\b/, /^person\.(email|linkedin|linkedinLabel)$/, /\.art\b/,
  /^profiles\.\d+\.(id|color|icon|hero|rows)\b/, /^rows\.\w+\.items\b/, /^top10\.\d+\.ref$/, /^journey\.\d+\.ref$/
];

function* copy(value, path = '') {
  if (NOT_COPY.some(re => re.test(path))) return;
  if (typeof value === 'string') yield [path, value];
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) yield* copy(v, path ? `${path}.${k}` : k);
  }
}

test('every number in the copy comes from the résumé', () => {
  const stray = [];
  for (const [path, text] of copy(P)) for (const n of numbersIn(text)) if (!RESUME_NUMBERS.has(n)) stray.push(`${path}: ${n}`);
  assert.deepEqual(stray, []);
});

test('every reference resolves', () => {
  const isTitle = k => k === 'series' || Object.hasOwn(P.titles, k);
  const bad = [];
  P.top10.forEach(s => Object.hasOwn(P.titles, s.ref) || bad.push(`top10 → ${s.ref}`));
  Object.entries(P.rows).forEach(([id, r]) => (r.items || []).forEach(k => isTitle(k) || bad.push(`rows.${id} → ${k}`)));
  P.profiles.forEach(p => {
    isTitle(p.hero) || bad.push(`profile ${p.id} hero → ${p.hero}`);
    p.rows.forEach(r => Object.hasOwn(P.rows, r) || bad.push(`profile ${p.id} row → ${r}`));
  });
  Object.keys(P.rows.continue.notes).forEach(k => P.rows.continue.items.includes(k) || bad.push(`continue note → ${k}`));
  P.rows.continue.items.forEach(k => P.rows.continue.notes[k] || bad.push(`continue item without note → ${k}`));
  assert.deepEqual(bad, []);
});

test('each profile shows every row exactly once', () => {
  const all = Object.keys(P.rows).sort().join();
  for (const p of P.profiles) assert.equal([...p.rows].sort().join(), all, p.id);
});

test('every title has what the cards, modal and player need', () => {
  for (const [key, t] of Object.entries({ ...P.titles, series: P.series })) {
    for (const f of ['title', 'type', 'org', 'metric', 'metricLabel', 'logline']) assert.ok(typeof t[f] === 'string' && t[f].length, `${key}.${f}`);
    for (const f of ['genres', 'points', 'cast']) assert.ok(Array.isArray(t[f]) && t[f].length, `${key}.${f}`);
    assert.ok(t.art && t.art.font, `${key}.art.font`);
    assert.ok(t.art.motif === 'photo' || (t.art.c1 && t.art.c2), `${key}.art colours`);
    if (t.art.photo) assert.match(t.art.photo, /^(poster|heroWide|heroMobile|work\.(presenting|whiteboard|laptop))$/, `${key}.art.photo`);
  }
});

test('contact details come from the résumé and the phone number is never published', () => {
  assert.equal(P.person.email, 'ssanushreya@gmail.com');
  assert.equal(P.person.linkedin, 'https://www.linkedin.com/in/anushreya1306');
  assert.doesNotMatch(read('assets/js/data.js'), /(?:\+?91[\s-]?)?\b\d{5}[\s-]?\d{5}\b|\b\d{10}\b/);
});

test('image slots: portrait always set, the rest optional', () => {
  assert.equal(P.images.portrait, 'assets/img/anushreya-portrait.jpg');
  for (const k of ['heroWide', 'heroMobile', 'poster']) assert.ok(P.images[k] === null || typeof P.images[k] === 'string', k);
  for (const k of ['presenting', 'whiteboard', 'laptop']) assert.ok(P.images.work[k] === null || typeof P.images.work[k] === 'string', k);
  assert.equal(typeof P.images.heroCutout, 'boolean');
});

test('every image slot points at a real file', () => {
  const I = P.images;
  for (const p of [I.portrait, I.heroWide, I.heroMobile, I.poster, ...Object.values(I.work)].filter(Boolean)) {
    assert.ok(existsSync(new URL(p, root)), p);
  }
});

test('order journey: seven steps in order, tagged steps open a real title, no digits in the copy', () => {
  assert.deepEqual([...P.journey].map(s => s.step), ['Order placed', 'Fraud check', 'Shipped', 'Delivered', 'Return / RTO', 'Root cause', 'Fix']);
  assert.deepEqual([...P.journey].filter(s => s.ref).map(s => s.ref), ['every-3-hours', 'fourteen-day-lag', 'mind-the-gap', 'cutting-room']);
  for (const s of P.journey) {
    assert.ok(!s.ref || Object.hasOwn(P.titles, s.ref), `${s.step} → ${s.ref}`);
    assert.equal(!!s.ref, !!s.tag, `${s.step}: tag and ref go together`);
    assert.doesNotMatch(s.step + (s.tag || ''), /\d/, s.step);
  }
});

test('every Continue Watching item has a shipment status', () => {
  const { items, status } = P.rows.continue;
  for (const k of items) assert.ok(status[k], `status for ${k}`);
  assert.deepEqual([...Object.keys(status)].sort(), [...items].sort());
  assert.deepEqual({ ...status }, { 'green-belt': 'In transit', series: 'Active', 'every-3-hours': 'Live' });
});
