# Netflix-style Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current editorial site at https://anushreya-ophub.github.io/ with the Netflix-style single-page portfolio chosen in review: sample A's browse layout, with sample B's trailer and sample C's FAQ and contact form, built only from the October 2026 résumé.

**Architecture:** A static page (`index.html`), one stylesheet and three plain scripts that load in order:
- `data.js` holds every word, number and image slot.
- `ui.js` turns data into key art, the "More Info" window and the captioned player.
- `app.js` runs the page: intro, "Who's viewing?", billboard, rows, hover preview, FAQ and contact form.

Most of the code is promoted from the reviewed samples in `samples/`. There is no build step; GitHub Pages serves the repo root from `main`.

**Tech Stack:** HTML, CSS and vanilla JS (ES2020); Google Fonts; Node 20's built-in test runner (`node --test`, no packages); Chrome (DevTools MCP, or the DevTools console) for in-page checks and Lighthouse; macOS `sips` for images; `python3 -m http.server` for local preview.

**Spec:** `docs/superpowers/specs/2026-10-10-netflix-portfolio-design.md`

## Global Constraints

- Static HTML/CSS/vanilla JS only. No build step, no framework, no npm packages. GitHub Pages serves `main`.
- Résumé facts only. Every number in the copy must come from the résumé (enforced by `tests/helpers/resume.mjs`).
- Email `ssanushreya@gmail.com` and LinkedIn `https://www.linkedin.com/in/anushreya1306`. Never publish the phone number (the phone number from the résumé).
- No Netflix logo, name or marks. Use the wordmark **ANUSHREYA** in red (`#e50914`) and the red "A" studio mark.
- Dark theme only. Page background `#141414`. The muted grey token `--fg-4` is `#8c8c8c` (WCAG AA).
- Fonts: Bebas Neue, DM Serif Display, Inter and JetBrains Mono from Google Fonts, with `preconnect` and `display=swap`.
- Breakpoints: 1400, 1100, 820, 800, 700, 640 and 520 px. No horizontal page scroll at 360 px.
- Session keys: `nf-intro` (intro seen) and `nf-profile` (chosen profile). Deep link: `?p=<profile id>`.
- Image budgets:

  | Image | Budget |
  |---|---|
  | portrait | ≤ 300 KB |
  | heroWide | ≤ 350 KB, ≤ 2400 px wide |
  | heroMobile | ≤ 200 KB, ≤ 1200 px wide |
  | poster | ≤ 250 KB |
  | work photos | ≤ 200 KB, ≤ 1600 px wide |
  | og-image | ≤ 200 KB, 1200×630 |

- Lighthouse targets: Performance ≥ 85 (mobile); Accessibility, Best Practices and SEO ≥ 95.
- Commit on `netflix-portfolio` after each task. **Never push, open a PR or merge without the user's explicit OK.**
- Every commit message ends with the trailer line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` (added as a second `-m` below).

## Review Focus

1. **Browsers that block `sessionStorage`** (Safari private mode, some in-app browsers): the intro and gate still work and the console shows no errors. Covered by Task 5, Step 6.
2. **Phones and touch screens:** tapping a card opens its details, no hover preview gets stuck, and nothing scrolls sideways at 360 px. Covered by Task 4, Step 7.
3. **Keyboard and screen-reader visitors:** every card is reachable; the modal, player and gate keep Tab inside, close on Escape and return focus. Covered by Task 4 checks `modal`/`player` and Task 5 check `gate`.
4. **Photos added later that are missing, misnamed or fail to load:** heroes fall back to the portrait, cards fall back to generated art, and no broken-image icons appear. Covered by Task 2 tests (`img()`, `onerror`) and Task 7's slot-file test.
5. **Future content edits to `data.js`:** a typo'd key or a number that isn't in the résumé fails `node --test` before it can ship. Covered by Task 1 tests.

---

### Task 1: Content module and its guard tests

**Files:**
- Create: `assets/js/data.js` (promoted from `samples/shared/data.js`)
- Create: `assets/img/anushreya-portrait.jpg` (copy of `assets/anushreya-portrait.jpg`)
- Create: `tests/helpers/load.mjs`, `tests/helpers/resume.mjs`, `tests/data.test.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: `window.PORTFOLIO` with keys:
  - `person`
  - `images { portrait, heroWide, heroCutout, heroMobile, poster, work: { presenting, whiteboard, laptop } }`
  - `series`
  - `titles` (14 keys)
  - `top10[{ value, label, ref }]`
  - `skills[{ name, note, group }]`
  - `profiles[{ id, name, color, icon, hero, rows[] }]`
  - `rows { top10, returns, fraud, continue{ items, notes }, earlier, skills }`
  - `trailer[{ k, t, big? }]`
  - `faq[{ q, a }]`

  Test helpers: `load(...files) → window`, `read(file) → string`, `root: URL`, `RESUME_NUMBERS: Set<string>`, `numbersIn(text) → string[]`.

- [ ] **Step 1: Save the reviewed baseline**

```bash
git add samples docs/superpowers assets/anushreya-portrait.jpg
git commit -m "docs: add design samples, spec and implementation plan" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 2: Write the test helpers**

`tests/helpers/load.mjs`:
```js
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

export const root = new URL('../../', import.meta.url);
export const read = file => readFileSync(new URL(file, root), 'utf8');

/* Run the site's browser scripts in a bare context (no DOM) and return its window. */
export function load(...files) {
  const window = {};
  const context = vm.createContext({ window });
  for (const file of files) vm.runInContext(read(file), context, { filename: file });
  return window;
}
```

`tests/helpers/resume.mjs`:
```js
/* Every number allowed in the site's copy. Each one appears in the October 2026
   résumé, plus the "Top 10" row label and the LinkedIn handle (anushreya1306). */
export const RESUME_NUMBERS = new Set([
  '2', '3', '4', '8', '9', '13', '14', '19', '20', '38', '45', '60', '90', '95', '99', '100', '200', '309',
  '2017', '2021', '2022', '2023', '2024', '2026', '21', '24',
  '0.10', '0.18', '0.44', '2.0', '2.4', '3.5', '6.7', '26.17', '31.4', '81.8', '2,500', '14,000',
  '10', '1306'
]);

export const numbersIn = text => text.match(/\d+(?:[.,]\d+)*/g) || [];
```

- [ ] **Step 3: Write the failing data tests**

`tests/data.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { load, read, root } from './helpers/load.mjs';
import { RESUME_NUMBERS, numbersIn } from './helpers/resume.mjs';

const P = load('assets/js/data.js').PORTFOLIO;

/* Paths that hold ids, colours, URLs or file paths rather than visible copy. */
const NOT_COPY = [
  /^images\b/, /^person\.(email|linkedin|linkedinLabel)$/, /\.art\b/,
  /^profiles\.\d+\.(id|color|icon|hero|rows)\b/, /^rows\.\w+\.items\b/, /^top10\.\d+\.ref$/
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
```

- [ ] **Step 4: Run the tests and watch them fail**

Run: `node --test tests/*.test.mjs`
Expected: FAIL with `ENOENT: no such file or directory, open '…/assets/js/data.js'`.

- [ ] **Step 5: Create the content module from the sample**

```bash
mkdir -p assets/js assets/img
cp samples/shared/data.js assets/js/data.js
cp assets/anushreya-portrait.jpg assets/img/anushreya-portrait.jpg
# drop sample B's season list and extras (out of scope per spec §13)
perl -0pi -e 's|  /\* Sample B: seasons → episodes \*/.*?(?=  trailer: \[)||s' assets/js/data.js
```

Then make these exact replacements in `assets/js/data.js`:

1. Delete the line `    photo: '../assets/anushreya-portrait.jpg',`
2. Replace `  /* The "show" about her — used as a hero and in the docuseries sample. */` with:
```js
  /* Photos. null = not supplied yet: heroes and the series card fall back to the
     portrait; work photos fall back to the generated key art. */
  images: {
    portrait: 'assets/img/anushreya-portrait.jpg',
    heroWide: null,
    heroCutout: false,
    heroMobile: null,
    poster: null,
    work: { presenting: null, whiteboard: null, laptop: null }
  },

  /* The "show" about her: Recruiter billboard, series card, trailer. */
```
3. Replace `    art: { motif: 'photo', font: 'display' }` with `    art: { motif: 'photo', photo: 'poster', font: 'display' }`
4. Replace `      art: { motif: 'clock', c1: '#b20710', c2: '#140203', font: 'mono' }` with `      art: { motif: 'clock', c1: '#b20710', c2: '#140203', font: 'mono', photo: 'work.laptop' }`
5. Replace `      art: { motif: 'gap', c1: '#9a4a14', c2: '#1c0b03', font: 'display' }` with `      art: { motif: 'gap', c1: '#9a4a14', c2: '#1c0b03', font: 'display', photo: 'work.presenting' }`
6. Replace `      art: { motif: 'steps', c1: '#0e5a8a', c2: '#04121c', font: 'display' }` with `      art: { motif: 'steps', c1: '#0e5a8a', c2: '#04121c', font: 'display', photo: 'work.whiteboard' }`
7. Replace `    continue: { title: 'Continue Watching for Anushreya', items: ['green-belt', 'series', 'every-3-hours'] },` with:
```js
    continue: {
      title: 'Continue Watching for Anushreya',
      items: ['green-belt', 'series', 'every-3-hours'],
      notes: {
        'green-belt': 'Lean Six Sigma · in progress · 2026',
        series: 'Season 2 · AJIO · Jul 2024 – Present',
        'every-3-hours': 'Running every 3 hours since Jun 2026'
      }
    },
```
8. Replace `  /* Sample A: who's viewing → hero + row order */` with `  /* Who's viewing: billboard title and row order per profile */`, and `  /* Sample C: landing page FAQ */` with `  /* FAQ */`.
9. Replace the first line `/* Résumé content shared by all three samples.` with `/* All site content: every word, number, link and image slot.`

Check: `grep -c "Sample\|seasons\|extras\|\.\./assets" assets/js/data.js` prints `0`.

- [ ] **Step 6: Run the tests and watch them pass**

Run: `node --test tests/*.test.mjs`
Expected: PASS, 7 tests, 0 failures.

- [ ] **Step 7: Commit**

```bash
git add assets/js/data.js assets/img/anushreya-portrait.jpg tests/helpers tests/data.test.mjs
git commit -m "feat: add portfolio content module guarded by résumé-number tests" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: UI module — key art, image slots, modal, player

**Files:**
- Create: `assets/js/ui.js` (motifs, `svg()` and icons copied from `samples/shared/nf.js`; everything else new)
- Create: `tests/ui.test.mjs`

**Interfaces:**
- Consumes: `window.PORTFOLIO` (Task 1).
- Produces: `window.NF` with:
  - `art(title, opts) → HTML string`. `opts`: `{ noTitle, noFlag, poster, eager, align }`.
  - `svg(title, opts) → HTML string`
  - `img(slot) → string | null`. Slots: `'portrait' | 'heroWide' | 'heroMobile' | 'poster' | 'work.presenting' | 'work.whiteboard' | 'work.laptop'`.
  - `icons: { [name]: svg string }`
  - `get(key) → title | series`
  - `meta(title) → HTML string`
  - `mailto(subject, body?) → string`
  - `ctaMailto(fromEmail) → string`
  - `pickProfile(query, saved) → profile | null`
  - `playConfig(key) → { title, sub, art, slides[] }`
  - `trap(keydownEvent, rootElement)`
  - `openTitle(key)`, `closeTitle()`, `play(keyOrConfig)`

- [ ] **Step 1: Write the failing tests**

`tests/ui.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/load.mjs';

const fresh = () => load('assets/js/data.js', 'assets/js/ui.js');

test('img(): heroes and poster fall back to the portrait, work photos to generated art', () => {
  const { NF, PORTFOLIO: P } = fresh();
  assert.equal(NF.img('heroWide'), P.images.portrait);
  assert.equal(NF.img('poster'), P.images.portrait);
  assert.equal(NF.img('nope'), P.images.portrait);
  assert.equal(NF.img('work.laptop'), null);
  P.images.heroWide = 'assets/img/hero-wide.jpg';
  P.images.work.laptop = 'assets/img/work-laptop.jpg';
  assert.equal(NF.img('heroWide'), 'assets/img/hero-wide.jpg');
  assert.equal(NF.img('work.laptop'), 'assets/img/work-laptop.jpg');
});

test('art(): a generated motif until a work photo is supplied, then the tinted photo', () => {
  const { NF, PORTFOLIO: P } = fresh();
  const t = P.titles['every-3-hours'];
  assert.match(NF.art(t), /<svg class="art__bg"/);
  P.images.work.laptop = 'assets/img/work-laptop.jpg';
  const html = NF.art(t);
  assert.match(html, /<img class="art__img" src="assets\/img\/work-laptop\.jpg" alt="" loading="lazy" onerror="this\.onerror=null;this\.remove\(\)">/);
  assert.match(html, /class="art__tint"/);
  assert.doesNotMatch(html, /<svg class="art__bg"/);
});

test('art(): the series uses the poster slot and falls back to the portrait if the file fails', () => {
  const { NF, PORTFOLIO: P } = fresh();
  const html = NF.art(P.series);
  assert.ok(html.includes(`src="${P.images.portrait}"`));
  assert.ok(html.includes(`onerror="this.onerror=null;this.src='${P.images.portrait}'"`));
  assert.doesNotMatch(NF.art(P.series, { eager: true }), /loading="lazy"/);
});

test('every title has a motif that draws something', () => {
  const { NF, PORTFOLIO: P } = fresh();
  for (const [key, t] of Object.entries(P.titles)) assert.doesNotMatch(NF.svg(t), /<g><\/g>/, key);
});

test('mailto() and ctaMailto() encode subject and body', () => {
  const { NF } = fresh();
  assert.equal(NF.mailto('About “The Spike”'), 'mailto:ssanushreya@gmail.com?subject=About%20%E2%80%9CThe%20Spike%E2%80%9D');
  const withFrom = NF.ctaMailto('hr@acme.co');
  assert.ok(withFrom.startsWith('mailto:ssanushreya@gmail.com?subject=Let%E2%80%99s%20talk%20%E2%80%94%20from%20your%20portfolio&body='));
  assert.match(decodeURIComponent(withFrom.split('&body=')[1]), /^Hi Anushreya,\n\n[\s\S]*You can reach me at hr@acme\.co\.\n$/);
  assert.doesNotMatch(decodeURIComponent(NF.ctaMailto('').split('&body=')[1]), /reach me/);
});

test('pickProfile(): ?p= wins, an unknown ?p= means Recruiter, else the saved choice, else the gate', () => {
  const { NF } = fresh();
  assert.equal(NF.pickProfile('manager', 'analyst').id, 'manager');
  assert.equal(NF.pickProfile('bogus', null).id, 'recruiter');
  assert.equal(NF.pickProfile(null, 'analyst').id, 'analyst');
  assert.equal(NF.pickProfile(null, 'bogus'), null);
  assert.equal(NF.pickProfile(null, null), null);
});

test('playConfig(): the series plays the trailer; a case study plays title → bullets → metric', () => {
  const { NF, PORTFOLIO: P } = fresh();
  const trailer = NF.playConfig('series');
  assert.equal(trailer.slides, P.trailer);
  assert.equal(trailer.sub, 'Official Trailer');
  assert.equal(trailer.art.art.photo, 'heroWide');
  const spike = NF.playConfig('the-spike');
  assert.equal(spike.slides.length, P.titles['the-spike'].points.length + 2);
  assert.equal(spike.slides[0].t, 'The Spike');
  assert.equal(spike.slides.at(-1).t, '19% → 38%');
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `node --test tests/ui.test.mjs`
Expected: FAIL with `ENOENT … assets/js/ui.js`.

- [ ] **Step 3: Assemble `assets/js/ui.js`**

Run this from the repo root. It copies the reviewed motifs, `svg()` and icons verbatim from the sample and writes the rest.
```bash
{
cat <<'JS'
/* Shared UI for the portfolio: generated key art, image slots, icons,
   the "More Info" title modal and the captioned player. */
(function () {
  const P = window.PORTFOLIO;
  let uid = 0;

  /* ── Key-art motifs, drawn in a 320×180 box (kept top/right so titles stay legible) ── */
JS
sed -n '/^  const motifs = {/,/^  };/p' samples/shared/nf.js
echo
sed -n '/^  function svg(/,/^  }$/p' samples/shared/nf.js
echo
sed -n '/^  const icons = {/,/^  };/p' samples/shared/nf.js
cat <<'JS'

  /* Image slot → path. Missing heroes and poster fall back to the portrait;
     missing work photos return null so the card keeps its generated art. */
  function img(slot) {
    const value = String(slot).split('.').reduce((o, k) => (o == null ? o : o[k]), P.images);
    if (value) return value;
    return String(slot).startsWith('work.') ? null : P.images.portrait;
  }

  /* Card-sized key art: the title's photo when supplied, otherwise a generated motif. */
  function art(t, opts = {}) {
    const a = t.art || {};
    const src = a.motif === 'photo' ? img(a.photo || 'poster') : (a.photo ? img(a.photo) : null);
    let media;
    if (src) {
      const lazy = opts.eager ? '' : ' loading="lazy"';
      const onError = a.motif === 'photo' ? `this.onerror=null;this.src='${P.images.portrait}'` : 'this.onerror=null;this.remove()';
      media = `<img class="art__img" src="${src}" alt=""${lazy} onerror="${onError}">`
        + (a.motif === 'photo' ? '' : `<span class="art__tint" style="--c1:${a.c1};--c2:${a.c2}"></span>`)
        + '<span class="art__shade"></span>';
    } else {
      media = svg(t, opts);
    }
    const title = opts.noTitle ? '' : `<span class="art__title f-${a.font || 'display'}">${t.title}</span>`;
    const flag = t.flag && !opts.noFlag ? `<span class="art__flag">${t.flag}</span>` : '';
    return `<span class="art${opts.poster ? ' art--poster' : ''}">${media}<span class="art__mark" aria-hidden="true">A</span>${title}${flag}</span>`;
  }

  const get = key => (key === 'series' ? P.series : P.titles[key]);
  const mailto = (subject, body) => `mailto:${P.person.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
  const meta = t => `<div class="meta"><span class="match">${t.metric}</span>${t.year ? `<span>${t.year}</span>` : ''}<span class="box">${t.type}</span></div>`;

  /* The contact form has no backend: it opens a pre-filled email. */
  function ctaMailto(from) {
    const body = `Hi Anushreya,\n\nI came across your portfolio and would like to talk.${from ? `\n\nYou can reach me at ${from}.` : ''}\n`;
    return mailto('Let’s talk — from your portfolio', body);
  }

  /* ?p= wins (an unknown id means the first profile), then this session's choice; null shows the gate. */
  function pickProfile(query, saved) {
    const find = id => P.profiles.find(p => p.id === id);
    if (query) return find(query) || P.profiles[0];
    return find(saved) || null;
  }

  /* Keep Tab inside an open dialog. */
  function trap(e, root) {
    if (e.key !== 'Tab') return;
    const items = [...root.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')]
      .filter(el => el.getClientRects().length);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1], at = document.activeElement;
    const leaving = !root.contains(at) || (e.shiftKey ? at === first : at === last);
    if (leaving) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
  }

  /* ── Title modal ("More Info") ── */
  let modal = null, lastFocus = null;
  function openTitle(key) {
    const t = get(key);
    if (!t) return;
    lastFocus = document.activeElement;
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      document.body.appendChild(modal);
      modal.addEventListener('click', e => {
        if (e.target === modal || e.target.closest('[data-close]')) return closeTitle();
        const p = e.target.closest('[data-play]');
        if (p) { closeTitle(); play(p.dataset.play); }
      });
      document.addEventListener('keydown', e => {
        if (!modal.classList.contains('is-open') || (player && player.classList.contains('is-open'))) return;
        if (e.key === 'Escape') closeTitle();
        else trap(e, modal);
      });
    }
    modal.setAttribute('aria-label', t.title);
    modal.innerHTML = `<div class="modal__panel">
      <div class="modal__hero">${art(t, { noTitle: true, noFlag: true })}<span class="modal__fade"></span>
        <button class="modal__x" data-close aria-label="Close">${icons.close}</button>
        <div class="modal__heroin">
          <div class="badge-series"><b>A</b>${t.type}</div>
          <h2 class="modal__title f-${t.art.font}">${t.title}</h2>
          <div class="modal__btns">
            <button class="btn btn--play" data-play="${key}">${icons.play}Play</button>
            <a class="circ" href="${mailto('About “' + t.title + '” — from your portfolio')}" aria-label="Email about this">${icons.mail}</a>
            <a class="circ" href="${P.person.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icons.linkedin}</a>
          </div>
        </div>
      </div>
      <div class="modal__body">
        <div class="modal__main"><div class="meta">${t.year ? `<span>${t.year}</span>` : ''}<span class="box">${t.type}</span><span>${t.genres[0]}</span></div><p class="modal__metric"><strong>${t.metric}</strong> ${t.metricLabel}</p><p class="modal__log">${t.logline}</p></div>
        <div class="modal__side"><p><span>Cast:</span> ${t.cast.join(', ')}</p><p><span>Genres:</span> ${t.genres.join(', ')}</p><p><span>Studio:</span> ${t.org}</p></div>
      </div>
      <div class="modal__eps"><h3>Episodes</h3><ol>${t.points.map((p, i) => `<li><span class="modal__epn">${i + 1}</span><p>${p}</p></li>`).join('')}</ol></div>
    </div>`;
    modal.classList.add('is-open');
    document.documentElement.classList.add('no-scroll');
    modal.scrollTop = 0;
    modal.querySelector('.modal__x').focus();
  }
  function closeTitle() {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    document.documentElement.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ── Player: a title plays as captioned slides; the series plays the trailer ── */
  let player = null, state = null;
  const SLIDE_MS = 3400;
  function playConfig(key) {
    if (key === 'series') {
      return { title: P.series.title, sub: 'Official Trailer', art: { title: P.series.title, art: { motif: 'photo', photo: 'heroWide', font: 'display' } }, slides: P.trailer };
    }
    const t = get(key);
    return {
      title: t.title, sub: t.type, art: t,
      slides: [{ k: t.type, t: t.title, big: true }, ...t.points.map(p => ({ k: t.title, t: p })), { k: t.metricLabel, t: t.metric, big: true }]
    };
  }
  function play(cfgOrKey) {
    const cfg = typeof cfgOrKey === 'string' ? playConfig(cfgOrKey) : cfgOrKey;
    lastFocus = document.activeElement;
    if (!player) {
      player = document.createElement('div');
      player.className = 'player';
      player.setAttribute('role', 'dialog');
      player.setAttribute('aria-modal', 'true');
      document.body.appendChild(player);
      player.addEventListener('click', e => {
        if (e.target.closest('[data-pclose]')) return stop();
        if (e.target.closest('[data-pnext]')) return go(state.i + 1);
        if (e.target.closest('[data-preplay]')) return go(0);
        if (e.target.closest('[data-ptoggle]') || e.target.closest('.player__stage')) toggle();
      });
      document.addEventListener('keydown', e => {
        if (!state) return;
        if (e.key === 'Escape') stop();
        else if (e.key === ' ') { e.preventDefault(); toggle(); }
        else if (e.key === 'ArrowRight') go(state.i + 1);
        else if (e.key === 'ArrowLeft') go(Math.max(0, state.i - 1));
        else trap(e, player);
      });
    }
    player.setAttribute('aria-label', cfg.title);
    player.innerHTML = `<div class="player__bg">${cfg.art ? art(cfg.art, { noTitle: true, noFlag: true }) : ''}</div>
      <button class="player__back" data-pclose>${icons.back}<span>Back</span></button>
      <div class="player__stage" aria-live="polite"></div>
      <div class="player__bar">
        <div class="player__track"><span class="player__fill"></span></div>
        <div class="player__ctrl">
          <button data-ptoggle aria-label="Pause">${icons.pause}</button>
          <button data-pnext aria-label="Next">${icons.next}</button>
          <span class="player__name"><b>${cfg.title}</b> ${cfg.sub || ''}</span>
        </div>
      </div>`;
    player.classList.add('is-open');
    document.documentElement.classList.add('no-scroll');
    state = { cfg, i: 0, t0: 0, elapsed: 0, paused: false, ended: false, raf: 0 };
    player.querySelector('[data-pclose]').focus();
    go(0);
  }
  function setToggle(mode) {
    const b = player.querySelector('[data-ptoggle]');
    b.innerHTML = icons[mode];
    b.setAttribute('aria-label', { pause: 'Pause', play: 'Play', replay: 'Replay' }[mode]);
  }
  function go(i) {
    const s = state;
    if (!s) return;
    if (i >= s.cfg.slides.length) return end();
    s.i = i; s.elapsed = 0; s.t0 = performance.now(); s.paused = false; s.ended = false;
    const slide = s.cfg.slides[i];
    player.querySelector('.player__stage').innerHTML = `<div class="player__slide${slide.big ? ' is-big' : ''}"><p class="player__k">${slide.k || ''}</p><p class="player__t">${slide.t}</p></div>`;
    setToggle('pause');
    cancelAnimationFrame(s.raf);
    s.raf = requestAnimationFrame(tick);
  }
  function tick(now) {
    const s = state;
    if (!s || s.paused || s.ended) return;
    s.elapsed = now - s.t0;
    const n = s.cfg.slides.length;
    player.querySelector('.player__fill').style.width = Math.min(100, (s.i + s.elapsed / SLIDE_MS) / n * 100) + '%';
    if (s.elapsed >= SLIDE_MS) return go(s.i + 1);
    s.raf = requestAnimationFrame(tick);
  }
  function toggle() {
    const s = state;
    if (!s) return;
    if (s.ended) return go(0);
    s.paused = !s.paused;
    setToggle(s.paused ? 'play' : 'pause');
    if (!s.paused) { s.t0 = performance.now() - s.elapsed; s.raf = requestAnimationFrame(tick); }
  }
  function end() {
    const s = state;
    s.ended = true;
    cancelAnimationFrame(s.raf);
    player.querySelector('.player__fill').style.width = '100%';
    setToggle('replay');
    player.querySelector('.player__stage').innerHTML = `<div class="player__slide is-end"><p class="player__k">Thanks for watching</p>
      <div class="player__endbtns"><button class="btn btn--play" data-preplay>${icons.replay}Replay</button>
      <a class="btn btn--info" href="${mailto('Let’s talk — from your portfolio')}">${icons.mail}Get in touch</a>
      <button class="btn btn--info" data-pclose>Back</button></div></div>`;
  }
  function stop() {
    if (!state) return;
    cancelAnimationFrame(state.raf);
    state = null;
    player.classList.remove('is-open');
    if (!(modal && modal.classList.contains('is-open'))) document.documentElement.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  window.NF = { art, svg, img, icons, get, meta, mailto, ctaMailto, pickProfile, playConfig, trap, openTitle, closeTitle, play };
})();
JS
} > assets/js/ui.js
node --check assets/js/ui.js && echo "syntax ok"
```
Expected: `syntax ok`.

- [ ] **Step 4: Run the tests and watch them pass**

Run: `node --test tests/*.test.mjs`
Expected: PASS, 14 tests, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add assets/js/ui.js tests/ui.test.mjs
git commit -m "feat: add UI module with image slots, focus-trapped modal and trailer player" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Page shell — HTML, stylesheet, nav and footer

**Files:**
- Replace: `index.html` (the old editorial page)
- Create: `assets/css/site.css`, `assets/js/app.js`, `assets/img/avatar.jpg`
- Create: `tests/page.test.mjs`, `tests/browser/checks.js`

**Interfaces:**
- Consumes: `NF.icons` (Task 2) and `PORTFOLIO.person` (Task 1).
- Produces the DOM mount points that later tasks fill: `#intro`, `#gate`, `#gate-list`, `#who`, `#nav`, `#content`, `#bill`, `#rows`, `#faq-list`, `#cta-form`, `#cta-email`, `#contact` and `#foot-social`.
  - `app.js` ends with the anchor comment `/* ── page sections are added below ── */` followed by `})();`.
  - `tests/browser/checks.js` exports `checks`, `run(name)` and `runAll()`.

- [ ] **Step 1: Write the failing static-page tests**

`tests/page.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { read, root } from './helpers/load.mjs';
import { RESUME_NUMBERS, numbersIn } from './helpers/resume.mjs';

const html = read('index.html');

test('head: title, description, canonical, social cards, favicon', () => {
  assert.match(html, /<title>Anushreya — Business Analyst · Returns &amp; Fraud Analytics · Process Automation<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]{50,}">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/anushreya-ophub\.github\.io\/">/);
  for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) assert.match(html, new RegExp(`<meta property="${p}" content="[^"]+">`), p);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(html, /<link rel="icon" href="data:image\/svg\+xml,/);
});

test('JSON-LD Person is valid and uses the résumé contact details', () => {
  const json = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(json['@type'], 'Person');
  assert.equal(json.name, 'Anushreya');
  assert.equal(json.email, 'mailto:ssanushreya@gmail.com');
  assert.deepEqual(json.sameAs, ['https://www.linkedin.com/in/anushreya1306']);
});

test('one h1, a skip link and no-JavaScript fallbacks', () => {
  assert.equal(html.match(/<h1\b/g).length, 1);
  assert.match(html, /<a class="skip" href="#content">Skip to content<\/a>/);
  assert.match(html, /<html lang="en" class="no-js">/);
  assert.match(html, /<noscript>[\s\S]*ssanushreya@gmail\.com[\s\S]*<\/noscript>/);
});

test('static copy uses only résumé numbers and never the phone number', () => {
  const noscript = html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1].replace(/<[^>]+>/g, ' ');
  const metas = [...html.matchAll(/<meta (?:name|property)="(?:description|og:description|og:title)" content="([^"]+)"/g)].map(m => m[1]);
  const stray = [noscript, ...metas].flatMap(numbersIn).filter(n => !RESUME_NUMBERS.has(n));
  assert.deepEqual(stray, []);
  assert.doesNotMatch(html, /(?:\+?91[\s-]?)?\b\d{5}[\s-]?\d{5}\b|\b\d{10}\b/);
});

test('scripts load deferred and in order: data, ui, app', () => {
  const order = [...html.matchAll(/<script defer src="([^"]+)"><\/script>/g)].map(m => m[1]);
  assert.deepEqual(order, ['assets/js/data.js', 'assets/js/ui.js', 'assets/js/app.js']);
});

test('every local asset referenced by index.html exists', () => {
  const refs = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map(m => m[1]);
  assert.ok(refs.length >= 5, 'expected css, 3 scripts and the avatar');
  for (const r of refs) assert.ok(existsSync(new URL(r, root)), r);
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `node --test tests/page.test.mjs`
Expected: FAIL. The first assertion on `<title>` fails because the old page's title is "Anushreya — Returns Reduction Manager, AJIO".

- [ ] **Step 3: Write `index.html`**

Replace the whole file with:
```html
<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Anushreya — Business Analyst · Returns &amp; Fraud Analytics · Process Automation</title>
<meta name="description" content="Business analyst at AJIO (Reliance Retail): returns and fraud analytics, driver-level root cause analysis and process automation. Open to Bengaluru.">
<link rel="canonical" href="https://anushreya-ophub.github.io/">
<meta name="theme-color" content="#141414">
<meta property="og:type" content="profile">
<meta property="og:title" content="Anushreya — Business Analyst">
<meta property="og:description" content="Returns and fraud analytics, root cause analysis and process automation at AJIO (Reliance Retail).">
<meta property="og:url" content="https://anushreya-ophub.github.io/">
<meta property="og:image" content="https://anushreya-ophub.github.io/assets/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23141414'/%3E%3Ctext x='16' y='26' font-family='Impact,sans-serif' font-size='26' text-anchor='middle' fill='%23e50914'%3EA%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/site.css">
<script>
  /* Before first paint: mark JavaScript as on, and skip the intro when it isn't wanted. */
  (function (d) {
    d.classList.replace('no-js', 'js');
    var skip = /[?&]p=/.test(location.search) || matchMedia('(prefers-reduced-motion: reduce)').matches;
    try { skip = skip || !!sessionStorage.getItem('nf-intro'); } catch (e) {}
    if (skip) d.classList.add('skip-intro');
  })(document.documentElement);
</script>
<script defer src="assets/js/data.js"></script>
<script defer src="assets/js/ui.js"></script>
<script defer src="assets/js/app.js"></script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Anushreya",
  "jobTitle": "Business Analyst",
  "worksFor": { "@type": "Organization", "name": "AJIO, Reliance Retail Ltd." },
  "alumniOf": [
    { "@type": "CollegeOrUniversity", "name": "Universal Business School, Mumbai" },
    { "@type": "CollegeOrUniversity", "name": "Amity University, Noida" }
  ],
  "email": "mailto:ssanushreya@gmail.com",
  "url": "https://anushreya-ophub.github.io/",
  "sameAs": ["https://www.linkedin.com/in/anushreya1306"]
}
</script>
</head>
<body>
<a class="skip" href="#content">Skip to content</a>

<div class="intro" id="intro" aria-hidden="true"><div class="intro__mark">ANUSHREYA</div><span class="intro__skip">Click or press any key to skip</span></div>

<section class="gate" id="gate" hidden aria-labelledby="gate-h">
  <span class="wordmark">ANUSHREYA</span>
  <h2 id="gate-h">Who’s viewing?</h2>
  <div class="gate__list" id="gate-list"></div>
  <p class="gate__note">Pick a profile — each one reorders the page around what that viewer usually wants first.</p>
</section>

<header class="nav" id="nav">
  <a class="wordmark" href="#content" aria-label="Anushreya — back to top">ANUSHREYA</a>
  <nav class="nav__links" aria-label="Primary">
    <a href="#content">Home</a><a href="#row-returns">Case Files</a><a href="#row-earlier">Career</a><a href="#row-skills">Skills</a><a href="#faq">FAQ</a>
  </nav>
  <div class="nav__right">
    <a class="nav__hide" href="#contact">Contact</a>
    <button class="nav__who" id="who" aria-label="Switch profile"></button>
  </div>
</header>

<main id="content" tabindex="-1">
  <h1 class="sr">Anushreya — Business Analyst · Returns &amp; Fraud Analytics · Process Automation</h1>
  <section class="bill" id="bill" aria-label="Featured"></section>
  <div class="rows" id="rows"></div>

  <section class="faq" id="faq" aria-labelledby="faq-h">
    <h2 id="faq-h">Frequently Asked Questions</h2>
    <div id="faq-list"></div>
  </section>

  <section class="ctaband" id="contact" aria-labelledby="cta-h">
    <img class="ctaband__av" src="assets/img/avatar.jpg" alt="" width="112" height="112" loading="lazy">
    <h2 id="cta-h">Ready to hire?</h2>
    <p>Enter your email to start the conversation.</p>
    <form class="cta" id="cta-form" novalidate>
      <label class="sr" for="cta-email">Your email address</label>
      <input id="cta-email" type="email" placeholder="Email address" autocomplete="email">
      <button class="btn btn--red" type="submit">Get in touch</button>
    </form>
    <p class="ctaband__alt">Or write directly: <a href="mailto:ssanushreya@gmail.com">ssanushreya@gmail.com</a> · <a href="https://www.linkedin.com/in/anushreya1306" target="_blank" rel="noopener">LinkedIn</a></p>
  </section>

  <noscript>
    <section class="nojs">
      <h2>Anushreya</h2>
      <p>Business Analyst · Returns &amp; Fraud Analytics · Process Automation — open to Bengaluru.</p>
      <p>Business analyst with 2+ years at AJIO (Reliance Retail), owning return KPI analytics (RTO/RVP), driver-level root cause analysis and process automation. My fraud order cancellation automation, built in Python with Claude Code, has cancelled ~₹3.5 Cr of high-risk orders in 4 months.</p>
      <ul>
        <li>AJIO, Reliance Retail Ltd. — Assistant Manager, Project Management (Management Trainee), Jul 2024 – Present</li>
        <li>Writer Business Services (Writer Safeguard) — Summer Intern, Service Assurance (Report Operations), May – Jul 2023</li>
        <li>Universal Business School, Mumbai — PGDM, Operations &amp; Supply Chain, Business Analytics minor; ranked 3rd in batch, 2022 – 2024</li>
        <li>Amity University, Noida — B.Tech, Biotechnology, 2017 – 2021</li>
      </ul>
      <p><a href="mailto:ssanushreya@gmail.com">ssanushreya@gmail.com</a> · <a href="https://www.linkedin.com/in/anushreya1306">LinkedIn</a></p>
    </section>
  </noscript>
</main>

<footer class="foot">
  <div class="foot__social" id="foot-social"></div>
  <div class="foot__grid">
    <a href="#row-returns">Case Files</a><a href="#row-earlier">Career</a><a href="#row-skills">Skills</a><a href="#faq">FAQ</a>
    <a href="mailto:ssanushreya@gmail.com">Email</a><a href="https://www.linkedin.com/in/anushreya1306" target="_blank" rel="noopener">LinkedIn</a>
  </div>
  <p>© 2026 Anushreya · Business Analyst · Open to Bengaluru</p>
</footer>
</body>
</html>
```

- [ ] **Step 4: Build `assets/css/site.css`**

It's the reviewed sample CSS, sample A's page styles, two edits, and the site additions below.
```bash
mkdir -p assets/css
{ cat samples/shared/nf.css; echo; sed -n '/<style>/,/<\/style>/p' samples/a-browse.html | sed '1d;$d'; } > assets/css/site.css
sed -i '' 's/--fg-4: #737373;/--fg-4: #8c8c8c;/' assets/css/site.css
sed -i '' 's/^\.gate h1 {/.gate h2 {/' assets/css/site.css
grep -c "fg-4: #8c8c8c\|^\.gate h2 {" assets/css/site.css   # expect 2
```
Then append:
```css

/* ── site additions beyond the samples ── */
.skip { position: absolute; left: 12px; top: -64px; z-index: 1000; background: #fff; color: #000; padding: 10px 14px; border-radius: 4px; font-weight: 700; transition: top .2s }
.skip:focus { top: 12px }
.no-js .intro, .no-js .gate, .no-js .bill, .no-js #rows, .no-js .faq, .no-js .cta, .no-js .nav__who, .skip-intro .intro { display: none }
main:focus { outline: none }
.row, .faq, .ctaband { scroll-margin-top: 84px }

/* billboard: <picture>, photo-backed art, transparent cut-out */
.bill picture { display: contents }
.bill__art .art { position: absolute; inset: 0; aspect-ratio: auto; border-radius: 0 }
.bill__art .art__mark { display: none }
.bill__photo.is-cutout { -webkit-mask-image: none; mask-image: none; object-fit: contain; object-position: right bottom; filter: none }
@media (max-width: 700px) { .bill__photo.is-cutout { object-position: center bottom } }
.art__tint { position: absolute; inset: 0; z-index: -1; background: linear-gradient(135deg, var(--c1), var(--c2)); opacity: .55; mix-blend-mode: multiply }

/* FAQ (from sample C) */
.faq { padding: clamp(40px, 6vw, 72px) var(--pad); max-width: 1180px; margin: 0 auto }
.faq > h2 { font-size: clamp(28px, 3.4vw, 48px); font-weight: 900; text-align: center; margin-bottom: 24px }
.faq__item { margin-bottom: 8px }
.faq__q { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; background: #2d2d2d; padding: clamp(18px, 2vw, 24px); font-size: clamp(18px, 2vw, 24px); text-align: left; transition: background .2s }
.faq__q:hover { background: #414141 }
.faq__q svg { width: clamp(26px, 3vw, 38px); height: auto; flex: none; transition: transform .25s }
.faq__q[aria-expanded="true"] svg { transform: rotate(45deg) }
.faq__a { background: #2d2d2d; margin-top: 1px; padding: clamp(18px, 2vw, 24px); font-size: clamp(16px, 1.7vw, 21px); line-height: 1.45 }

/* contact call-to-action (from sample C) */
.ctaband { text-align: center; padding: clamp(40px, 6vw, 72px) var(--pad) clamp(48px, 7vw, 88px); max-width: 860px; margin: 0 auto }
.ctaband__av { width: clamp(84px, 9vw, 112px); height: auto; aspect-ratio: 1; border-radius: 50%; object-fit: cover; margin: 0 auto 20px; box-shadow: 0 0 0 3px var(--red), 0 12px 40px rgba(229, 9, 20, .35) }
.ctaband h2 { font-size: clamp(28px, 3.4vw, 48px); font-weight: 900; letter-spacing: -.01em }
.ctaband > p { color: var(--fg-2); margin: 10px 0 18px; font-size: clamp(15px, 1.3vw, 18px) }
.cta { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap }
.cta input { flex: 1 1 260px; max-width: 380px; min-height: 56px; padding: 0 16px; border-radius: 4px; border: 1px solid rgba(128, 128, 128, .7); background: rgba(22, 22, 22, .72); color: #fff; font: inherit; font-size: 16px }
.cta input::placeholder { color: #b3b3b3 }
.cta .btn { min-height: 56px; font-size: clamp(18px, 1.6vw, 24px); padding-inline: 26px }
.ctaband .ctaband__alt { color: var(--fg-3); font-size: 14px; margin-top: 18px }
.ctaband__alt a { color: var(--fg-2); text-decoration: underline; text-underline-offset: 3px }

/* no-JavaScript fallback */
.nojs { max-width: 760px; margin: 0 auto; padding: 120px var(--pad) 40px; color: var(--fg-2) }
.nojs h2 { font-family: var(--display); font-weight: 400; font-size: 72px; color: #fff; line-height: 1 }
.nojs p, .nojs ul { margin: 14px 0 }
.nojs a { text-decoration: underline }
```

- [ ] **Step 5: Create the avatar and the `app.js` skeleton**

```bash
sips -c 1201 1201 assets/img/anushreya-portrait.jpg --out assets/img/avatar.jpg >/dev/null
sips -z 224 224 -s formatOptions 82 assets/img/avatar.jpg >/dev/null
sips -g pixelWidth -g pixelHeight assets/img/avatar.jpg   # expect 224 × 224
```

`assets/js/app.js`:
```js
/* Page logic: intro, "Who's viewing?", billboard, rows, hover preview, FAQ and contact form. */
(function () {
  const P = window.PORTFOLIO;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const qs = new URLSearchParams(location.search);
  const ss = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  /* nav turns solid once the page scrolls */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* footer icons */
  $('#foot-social').innerHTML = `<a href="${P.person.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${NF.icons.linkedin}</a><a href="mailto:${P.person.email}" aria-label="Email">${NF.icons.mail}</a>`;

  /* ── page sections are added below ── */
})();
```

- [ ] **Step 6: Run the static tests and watch them pass**

Run: `node --test tests/*.test.mjs`
Expected: PASS, 20 tests, 0 failures.

- [ ] **Step 7: Write the in-page check runner with the `shell` check**

`tests/browser/checks.js`:
```js
/* In-page checks for the portfolio. With the preview server running, open
   http://127.0.0.1:8765/?p=recruiter and run in the DevTools console:
     (await import('/tests/browser/checks.js?v=' + Date.now())).runAll()
   or one check:
     (await import('/tests/browser/checks.js?v=' + Date.now())).run('modal') */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, ms));
const press = (key, opts = {}) =>
  (document.activeElement || document.body).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opts }));

export const checks = {
  async shell() {
    const f = [];
    if (!document.title.startsWith('Anushreya —')) f.push('title');
    if (!$('link[rel="canonical"][href="https://anushreya-ophub.github.io/"]')) f.push('canonical');
    if (!$('meta[property="og:image"]')) f.push('og:image meta');
    if (!$('script[type="application/ld+json"]')) f.push('JSON-LD');
    if ($$('h1').length !== 1) f.push('h1 count ' + $$('h1').length);
    if (!$('a.skip[href="#content"]')) f.push('skip link');
    if (document.documentElement.classList.contains('no-js')) f.push('no-js class still set');
    if ($$('#foot-social a').length !== 2) f.push('footer icons');
    if (/(?:\+?91[\s-]?)?\b\d{5}[\s-]?\d{5}\b|\b\d{10}\b/.test(document.documentElement.outerHTML)) f.push('phone number on page');
    return f;
  }
};

export async function run(name) {
  const fails = await checks[name]();
  return { name, pass: fails.length === 0, fails };
}

export async function runAll() {
  const results = [];
  for (const name of Object.keys(checks)) results.push(await run(name));
  return results;
}
```

- [ ] **Step 8: Start the preview server and run the `shell` check**

Start the server in the background (reuse it if port 8765 is already serving this repo): `python3 -m http.server 8765 --bind 127.0.0.1`

Open `http://127.0.0.1:8765/?p=recruiter` in Chrome (DevTools MCP `new_page`, or a normal tab). Then run in the page (MCP `evaluate_script`, or the console):
```js
async () => (await import('/tests/browser/checks.js?v=' + Date.now())).run('shell')
```
Expected: `{"name":"shell","pass":true,"fails":[]}`.

Also check the console has no errors. The billboard and rows are still empty until Task 4.

- [ ] **Step 9: Commit**

```bash
git add index.html assets/css/site.css assets/js/app.js assets/img/avatar.jpg tests/page.test.mjs tests/browser/checks.js
git commit -m "feat: replace editorial page with the portfolio shell" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Billboard, rows, hover preview, modal and player wiring

**Files:**
- Modify: `assets/js/app.js` (insert before the final `})();`)
- Modify: `assets/css/site.css` (append the wide-hero rule)
- Modify: `tests/browser/checks.js` (add checks)

**Interfaces:**
- Consumes:
  - `NF.get`, `NF.art`, `NF.img`, `NF.meta`, `NF.mailto`, `NF.icons`, `NF.openTitle`, `NF.play` (Task 2)
  - `PORTFOLIO.profiles`, `rows`, `top10`, `skills`, `images` (Task 1)
- Produces, inside `app.js`:
  - `renderHome(profile)`, used by Task 5
  - `hidePeek()`
  - the closing line `  renderHome(P.profiles[0]);`, which Task 5 replaces

- [ ] **Step 1: Add the failing checks**

In `tests/browser/checks.js`, add these entries after the `shell` entry inside `export const checks = {`. Note the comma after `shell`'s closing `}`.
```js
  async billboard() {
    const f = [], P = window.PORTFOLIO;
    if ($('.bill__title')?.textContent !== 'Anushreya') f.push('recruiter billboard title');
    const img = $('.bill__photo');
    if (!img) f.push('billboard photo missing');
    else {
      if (img.getAttribute('fetchpriority') !== 'high') f.push('billboard photo not high priority');
      if (!img.complete) await wait(1500);
      if (!img.naturalWidth) f.push('billboard photo did not load');
    }
    if (!$('#bill [data-play="series"]')?.textContent.includes('Play Trailer')) f.push('Play Trailer button');
    if (!$('#bill [data-open="series"]')) f.push('More Info button');
    if (!$('#bill .bill__rating')?.textContent.includes(P.person.location)) f.push('location tag');
    return f;
  },
  async rows() {
    const f = [], P = window.PORTFOLIO;
    const order = $$('#rows .row').map(r => r.id.replace('row-', ''));
    if (order.join() !== P.profiles[0].rows.join()) f.push('row order ' + order.join());
    if ($$('#row-top10 .t10card').length !== P.top10.length) f.push('top10 cards');
    if ($$('#row-continue .cw__bar').length !== P.rows.continue.items.length) f.push('continue-watching bars');
    if ($$('#row-skills .skill').length !== P.skills.length) f.push('skill cards');
    $$('#rows [data-key]').forEach(c => {
      if (!NF.get(c.dataset.key)) f.push('unknown key ' + c.dataset.key);
      if (!c.getAttribute('aria-label')) f.push('unlabelled card ' + c.dataset.key);
    });
    return f;
  },
  async modal() {
    const f = [], P = window.PORTFOLIO;
    const card = $('#row-returns [data-key]'), key = card.dataset.key;
    card.focus(); card.click(); await wait(100);
    const m = $('.modal.is-open');
    if (!m) return ['modal did not open'];
    if (document.activeElement !== m.querySelector('.modal__x')) f.push('focus not on close button');
    if (m.querySelector('.modal__title').textContent !== P.titles[key].title) f.push('modal title');
    if (m.querySelectorAll('.modal__eps li').length !== P.titles[key].points.length) f.push('episode count');
    const items = [...m.querySelectorAll('a[href], button')];
    items.at(-1).focus(); press('Tab');
    if (document.activeElement !== items[0]) f.push('Tab on the last item does not wrap to the first');
    items[0].focus(); press('Tab', { shiftKey: true });
    if (document.activeElement !== items.at(-1)) f.push('Shift+Tab on the first item does not wrap to the last');
    press('Escape'); await wait(50);
    if ($('.modal.is-open')) f.push('Escape did not close the modal');
    if (document.activeElement !== card) f.push('focus not returned to the card');
    return f;
  },
  async player() {
    const f = [], P = window.PORTFOLIO;
    const btn = $('#bill [data-play="series"]');
    btn.focus(); btn.click(); await wait(100);
    const pl = $('.player.is-open');
    if (!pl) return ['player did not open'];
    if (pl.querySelector('.player__t').textContent !== P.trailer[0].t) f.push('trailer does not start on slide 1');
    press(' '); await wait(30);
    if (pl.querySelector('[data-ptoggle]').getAttribute('aria-label') !== 'Play') f.push('Space did not pause');
    press('ArrowRight'); await wait(30);
    if (pl.querySelector('.player__t').textContent !== P.trailer[1].t) f.push('ArrowRight did not advance');
    press('Escape'); await wait(50);
    if ($('.player.is-open')) f.push('Escape did not close the player');
    if (document.activeElement !== btn) f.push('focus not returned to Play');
    return f;
  },
  async a11y() {
    const f = [];
    $$('button').forEach(b => { if (!(b.textContent.trim() || b.getAttribute('aria-label'))) f.push('unnamed button .' + b.className); });
    $$('img').forEach(i => { if (!i.hasAttribute('alt')) f.push('img without alt ' + i.getAttribute('src')); });
    if (getComputedStyle(document.documentElement).getPropertyValue('--fg-4').trim() !== '#8c8c8c') f.push('muted grey token');
    return f;
  },
  async overflow() {
    const w = document.documentElement.scrollWidth;
    return w > innerWidth ? [`page scrolls sideways: ${w}px > ${innerWidth}px`] : [];
  }
```

- [ ] **Step 2: Run the checks and watch them fail**

Reload `http://127.0.0.1:8765/?p=recruiter` at 1440×900. Then run each of these on its own:
```js
async () => (await import('/tests/browser/checks.js?v=' + Date.now())).run('billboard')
async () => (await import('/tests/browser/checks.js?v=' + Date.now())).run('rows')
```
Expected:
- `billboard` fails with `["recruiter billboard title","billboard photo missing","Play Trailer button","More Info button","location tag"]`.
- `rows` fails with `["row order ","top10 cards","continue-watching bars","skill cards"]`.
- `runAll()` would reject with a `TypeError` from `modal` (there are no cards yet).

- [ ] **Step 3: Insert the billboard, rows, hover preview and click handling**

In `assets/js/app.js`, insert immediately before the final `})();`:
```js
  /* ── billboard ── */
  function renderBill(key) {
    const t = NF.get(key), I = P.images, photo = t.art.motif === 'photo';
    const cls = I.heroCutout ? ' is-cutout' : (I.heroWide ? ' is-wide' : '');
    const media = photo
      ? `<picture><source media="(max-width: 700px)" srcset="${NF.img('heroMobile')}"><img class="bill__photo${cls}" src="${NF.img('heroWide')}" alt="Portrait of Anushreya" fetchpriority="high" onerror="this.onerror=null;this.src='${I.portrait}'"></picture>`
      : `<div class="bill__art">${NF.art(t, { noTitle: true, noFlag: true, eager: true, align: 'xMaxYMid' })}</div>`;
    $('#bill').innerHTML = `${media}
      <div class="bill__shade"></div>
      <div class="bill__content">
        <div class="badge-series"><b>A</b>${t.type}</div>
        <h2 class="bill__title f-${t.art.font}">${t.title}</h2>
        <p class="bill__metric"><span class="match">${t.metric}</span>${t.metricLabel}</p>
        <p class="bill__desc">${t.logline}</p>
        <div class="bill__ctas">
          <button class="btn btn--play" data-play="${key}">${NF.icons.play}${photo ? 'Play Trailer' : 'Play'}</button>
          <button class="btn btn--info" data-open="${key}">${NF.icons.info}More Info</button>
        </div>
      </div>
      <div class="bill__rating">${P.person.location}</div>`;
  }

  /* ── rows ── */
  const chevL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  const chevR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
  function rowHTML(id) {
    const r = P.rows[id];
    let items, cls = '';
    if (id === 'top10') {
      cls = ' row--top10';
      items = P.top10.map((s, i) => `<div class="row__item"><button class="t10card" data-key="${s.ref}" aria-label="Number ${i + 1}: ${s.value}, ${s.label}">
        <span class="t10card__num${i === 9 ? ' is-10' : ''}" aria-hidden="true">${i + 1}</span>
        <span class="art art--poster">${NF.svg(P.titles[s.ref], { align: 'xMaxYMid' })}<span class="art__mark" aria-hidden="true">A</span><span class="t10card__txt"><span class="t10card__val">${s.value}</span><span class="t10card__lbl">${s.label}</span></span></span>
      </button></div>`).join('');
    } else if (id === 'skills') {
      items = P.skills.map(s => `<div class="row__item"><div class="skill"><span class="skill__group">${s.group}</span><strong>${s.name}</strong><span class="skill__note">${s.note}</span></div></div>`).join('');
    } else if (id === 'continue') {
      items = r.items.map(k => `<div class="row__item"><button class="card" data-key="${k}" aria-label="${NF.get(k).title}">${NF.art(NF.get(k), { noFlag: true })}<span class="cw__bar"></span><span class="cw__meta">${r.notes[k]}</span></button></div>`).join('');
    } else {
      items = r.items.map(k => `<div class="row__item"><button class="card" data-key="${k}" aria-label="${P.titles[k].title}">${NF.art(P.titles[k])}</button></div>`).join('');
    }
    return `<section class="row${cls}" id="row-${id}"><h2 class="row__h">${r.title}</h2>
      <div class="row__wrap">
        <button class="row__btn row__btn--l" aria-label="Scroll left" tabindex="-1">${chevL}</button>
        <div class="row__track">${items}</div>
        <button class="row__btn row__btn--r" aria-label="Scroll right" tabindex="-1">${chevR}</button>
      </div></section>`;
  }
  function renderHome(p) {
    $('#who').innerHTML = `<span class="nav__av" style="background:${p.color}">${NF.icons[p.icon]}</span><span class="nav__hide">${p.name}</span>${NF.icons.down.replace('<svg', '<svg class="caret"')}`;
    renderBill(p.hero);
    $('#rows').innerHTML = p.rows.map(rowHTML).join('');
  }

  /* ── hover preview (mouse and trackpad only) ── */
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const peek = document.createElement('div');
  peek.className = 'peek';
  document.body.appendChild(peek);
  let tShow = 0, tHide = 0, hoverCard = null;
  function showPeek(card) {
    const key = card.dataset.key, t = NF.get(key);
    const r = card.getBoundingClientRect();
    const w = Math.min(Math.max(r.width * 1.5, 290), 420);
    const left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, innerWidth - w - 8));
    const top = Math.max(scrollY + 70, r.top + scrollY + r.height / 2 - (w * 9 / 16) / 2 - 20);
    peek.style.cssText = `left:${left}px;top:${top}px;width:${w}px`;
    peek.innerHTML = `<div data-open="${key}">${NF.art(t, { noFlag: true })}</div>
      <div class="peek__body">
        <div class="peek__btns">
          <button class="circ circ--play" data-play="${key}" aria-label="Play">${NF.icons.play}</button>
          <a class="circ" href="${NF.mailto('About “' + t.title + '” — from your portfolio')}" aria-label="Email about this">${NF.icons.mail}</a>
          <button class="circ more" data-open="${key}" aria-label="More info">${NF.icons.down}</button>
        </div>
        ${NF.meta(t)}
        <div class="peek__genres">${t.genres.map(g => `<span>${g}</span>`).join('')}</div>
      </div>`;
    peek.classList.remove('is-on');
    void peek.offsetWidth;
    peek.classList.add('is-on');
  }
  function hidePeek() { clearTimeout(tShow); hoverCard = null; peek.classList.remove('is-on'); }
  if (canHover) {
    document.addEventListener('mouseover', e => {
      const c = e.target.closest('#rows [data-key]');
      if (!c || c === hoverCard) return;
      hoverCard = c;
      clearTimeout(tHide); clearTimeout(tShow);
      tShow = setTimeout(() => showPeek(c), 420);
    });
    document.addEventListener('mouseout', e => {
      const c = e.target.closest('#rows [data-key]');
      if (!c || c.contains(e.relatedTarget)) return;
      hoverCard = null;
      clearTimeout(tShow);
      if (!peek.contains(e.relatedTarget)) tHide = setTimeout(hidePeek, 160);
    });
    peek.addEventListener('mouseenter', () => clearTimeout(tHide));
    peek.addEventListener('mouseleave', () => { tHide = setTimeout(hidePeek, 160); });
  }
  addEventListener('scroll', () => { if (peek.classList.contains('is-on')) hidePeek(); }, { passive: true });

  /* ── clicks: row arrows, Play, More Info, cards ── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.row__btn');
    if (btn) {
      const tr = btn.parentElement.querySelector('.row__track');
      tr.scrollBy({ left: (btn.classList.contains('row__btn--l') ? -1 : 1) * tr.clientWidth * .9, behavior: 'smooth' });
      return;
    }
    if (e.target.closest('.modal, .player')) return;
    const op = e.target.closest('[data-open]');
    if (op) { hidePeek(); return NF.openTitle(op.dataset.open); }
    const pl = e.target.closest('[data-play]');
    if (pl) { hidePeek(); return NF.play(pl.dataset.play); }
    const c = e.target.closest('#rows [data-key]');
    if (c) { hidePeek(); NF.openTitle(c.dataset.key); }
  });

  renderHome(P.profiles[0]);
```

Append to `assets/css/site.css`. A supplied wide hero runs full-bleed on desktop; the portrait fallback keeps the masked look.
```css

/* full-bleed billboard when a real wide hero is supplied */
@media (min-width: 701px) {
  .bill__photo.is-wide { width: 100%; object-position: 70% 30%; -webkit-mask-image: none; mask-image: none; filter: none }
}
```

- [ ] **Step 4: Run the checks and watch them pass**

Reload `http://127.0.0.1:8765/?p=recruiter` at 1440×900 and run `runAll()` as in Step 2.
Expected: all seven checks `pass: true`. Then `list_console_messages` (or the console) shows no errors.

- [ ] **Step 5: Run the unit tests**

Run: `node --test tests/*.test.mjs`
Expected: PASS, 20 tests.

- [ ] **Step 6: Visual review on desktop**

Take screenshots at 1440×900 of:
- the billboard
- the page scrolled to 560 px (Top 10 + Case Files)
- the page scrolled to 1500 px (Continue Watching + Cast & Crew)
- the "Every 3 Hours" modal
- the trailer after 4 s

Compare against `samples/a-browse.html?p=recruiter`. They should match, apart from the Play button reading "Play Trailer". Hover a card for half a second and confirm the preview appears and hides on mouse-out.

- [ ] **Step 7: Touch and narrow screens (Review Focus 2)**

Emulate a phone: `390x844x3,mobile,touch` (MCP `emulate`), or DevTools device mode. Reload `/?p=recruiter`, then run:
```js
async () => {
  const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelector('#row-returns [data-key]').click();
  await new Promise(r => setTimeout(r, 150));
  const opened = !!document.querySelector('.modal.is-open');
  NF.closeTitle();
  const overflow = (await import('/tests/browser/checks.js?v=' + Date.now())).run('overflow');
  return { hover, opened, peek: !!document.querySelector('.peek.is-on'), overflow: await overflow };
}
```
Expected: `{"hover":false,"opened":true,"peek":false,"overflow":{"name":"overflow","pass":true,"fails":[]}}`.

Repeat the `overflow` check at `360x780x3,mobile,touch`; expected `pass: true`. Screenshot the mobile billboard: the photo sits on top and the text is centred below.

- [ ] **Step 8: Commit**

```bash
git add assets/js/app.js assets/css/site.css tests/browser/checks.js
git commit -m "feat: render billboard, rows, hover preview and title/trailer overlays" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Intro and "Who's viewing?" with session memory

**Files:**
- Modify: `assets/js/app.js` (replace the line `  renderHome(P.profiles[0]);`)
- Modify: `tests/browser/checks.js` (add the `gate` check)

**Interfaces:**
- Consumes:
  - `renderHome(p)` (Task 4)
  - `NF.pickProfile`, `NF.trap`, `NF.icons` (Task 2)
  - the `skip-intro` class set by the inline head script (Task 3)
- Produces: session keys `nf-intro` = `'1'` and `nf-profile` = profile id.

- [ ] **Step 1: Add the failing `gate` check**

In `tests/browser/checks.js`, add after the `overflow` entry (comma first):
```js
  async gate() {
    const f = [], P = window.PORTFOLIO, gate = $('#gate');
    $('#who').click(); await wait(50);
    if (gate.hidden) return ['gate did not open from the nav avatar'];
    const names = $$('#gate .prof__name').map(n => n.textContent);
    if (names.join('|') !== P.profiles.map(p => p.name).join('|')) f.push('profile names ' + names.join(','));
    const profs = $$('#gate .prof');
    profs.at(-1).focus(); press('Tab');
    if (document.activeElement !== profs[0]) f.push('Tab does not stay inside the gate');
    press('Escape'); await wait(30);
    if (!gate.hidden) f.push('Escape did not close the gate');
    $('#who').click(); await wait(50);
    $('#gate [data-p="manager"]').click(); await wait(50);
    const manager = P.profiles.find(p => p.id === 'manager');
    if (!gate.hidden) f.push('gate did not close after choosing');
    if (!$('#who').textContent.includes(manager.name)) f.push('nav avatar not updated');
    if ($('.bill__title')?.textContent !== NF.get(manager.hero).title) f.push('billboard not switched');
    const order = $$('#rows .row').map(r => r.id.replace('row-', ''));
    if (order.join() !== manager.rows.join()) f.push('rows not reordered');
    if (sessionStorage.getItem('nf-profile') !== 'manager') f.push('choice not saved for the session');
    $('#who').click(); await wait(50);
    $('#gate [data-p="recruiter"]').click(); await wait(50);
    return f;
  }
```

- [ ] **Step 2: Run it and watch it fail**

Reload `/?p=recruiter` and run `.run('gate')`.
Expected: `{"name":"gate","pass":false,"fails":["gate did not open from the nav avatar"]}`.

- [ ] **Step 3: Replace the temporary render call with the intro and the gate**

In `assets/js/app.js`, replace the single line `  renderHome(P.profiles[0]);` with:
```js
  /* ── intro: once per session; the head script adds .skip-intro when it isn't wanted ── */
  const intro = $('#intro');
  if (document.documentElement.classList.contains('skip-intro')) intro.remove();
  else {
    ss.set('nf-intro', '1');
    const endIntro = () => {
      removeEventListener('keydown', endIntro);
      if (!intro.isConnected || intro.classList.contains('is-done')) return;
      intro.classList.add('is-done');
      setTimeout(() => intro.remove(), 450);
    };
    intro.addEventListener('click', endIntro);
    addEventListener('keydown', endIntro);
    intro.querySelector('.intro__mark').addEventListener('animationend', endIntro);
  }

  /* ── who's viewing ── */
  const gate = $('#gate');
  $('#gate-list').innerHTML = P.profiles.map(p =>
    `<button class="prof" data-p="${p.id}"><span class="prof__av" style="background:${p.color}">${NF.icons[p.icon]}</span><span class="prof__name">${p.name}</span></button>`).join('');
  function openGate() {
    gate.hidden = false;
    document.documentElement.classList.add('no-scroll');
    gate.querySelector('.prof').focus({ preventScroll: true });
  }
  function closeGate() {
    gate.hidden = true;
    document.documentElement.classList.remove('no-scroll');
  }
  function choose(id) {
    const p = P.profiles.find(x => x.id === id) || P.profiles[0];
    ss.set('nf-profile', p.id);
    closeGate();
    renderHome(p);
    scrollTo(0, 0);
  }
  gate.addEventListener('click', e => {
    const b = e.target.closest('[data-p]');
    if (!b) return;
    choose(b.dataset.p);
    $('#who').focus({ preventScroll: true });
  });
  gate.addEventListener('keydown', e => {
    if (e.key === 'Escape' && ss.get('nf-profile')) { closeGate(); $('#who').focus({ preventScroll: true }); }
    else NF.trap(e, gate);
  });
  $('#who').addEventListener('click', openGate);

  const start = NF.pickProfile(qs.get('p'), ss.get('nf-profile'));
  if (start) choose(start.id); else openGate();
```

- [ ] **Step 4: Run every check and watch them pass**

Reload `/?p=recruiter` at 1440×900 and run `runAll()`.
Expected: all eight checks `pass: true`, and the console has no errors.

- [ ] **Step 5: First visit, intro and session memory (fresh storage)**

Open `http://127.0.0.1:8765/` in a fresh context (MCP `new_page` with `isolatedContext: "intro-1"`, or a new incognito window). Run each line in order:
1. `() => ({ intro: !!document.querySelector('#intro'), gate: !document.getElementById('gate').hidden, flag: sessionStorage.getItem('nf-intro') })` → `{"intro":true,"gate":true,"flag":"1"}`
2. `async () => { document.querySelector('#intro').click(); await new Promise(r => setTimeout(r, 600)); return !!document.querySelector('#intro'); }` → `false`
3. `async () => { document.querySelector('[data-p="analyst"]').click(); await new Promise(r => setTimeout(r, 100)); return document.querySelector('.bill__title').textContent; }` → `"The 14-Day Lag"`
4. Reload the page, then `() => ({ intro: !!document.querySelector('#intro'), gate: !document.getElementById('gate').hidden, title: document.querySelector('.bill__title').textContent })` → `{"intro":false,"gate":false,"title":"The 14-Day Lag"}`

Also open `/?p=bogus` in a fresh context and confirm the billboard title is `Anushreya`.

- [ ] **Step 6: Blocked storage and reduced motion (Review Focus 1)**

In a fresh context, open `/` with this init script, which runs before page scripts (MCP `navigate_page` `initScript`, or a DevTools snippet before reload):
```js
Object.defineProperty(window, 'sessionStorage', { configurable: true, get() { throw new DOMException('blocked', 'SecurityError'); } });
```
Then run `async () => { document.querySelector('#intro')?.click(); document.querySelector('[data-p="guest"]').click(); await new Promise(r => setTimeout(r, 600)); return document.querySelector('.bill__title').textContent; }`.
Expected: `"The Fit Paradox"`, and the console has **no errors**.

In another fresh context, use this init script to simulate the reduced-motion setting:
```js
const mm = window.matchMedia.bind(window);
window.matchMedia = q => q.includes('prefers-reduced-motion') ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} } : mm(q);
```
Open `/` and run `() => ({ skip: document.documentElement.classList.contains('skip-intro'), intro: !!document.querySelector('#intro'), gate: !document.getElementById('gate').hidden })`.
Expected: `{"skip":true,"intro":false,"gate":true}`.

- [ ] **Step 7: Commit**

```bash
git add assets/js/app.js tests/browser/checks.js
git commit -m "feat: add intro and Who's-viewing profiles with session memory" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: FAQ and contact form

**Files:**
- Modify: `assets/js/app.js` (insert immediately after the line `  /* ── page sections are added below ── */`)
- Modify: `tests/browser/checks.js` (add `faq` and `cta` checks)

**Interfaces:**
- Consumes: `PORTFOLIO.faq`, `NF.icons.plus`, `NF.ctaMailto` (Tasks 1–2), and `#faq-list`, `#cta-form`, `#cta-email` (Task 3).
- Produces: nothing new for later tasks.

- [ ] **Step 1: Add the failing checks**

In `tests/browser/checks.js`, add after the `gate` entry (comma first):
```js
  async faq() {
    const f = [], P = window.PORTFOLIO;
    const qs = $$('#faq .faq__q');
    if (qs.length !== P.faq.length) return ['faq count ' + qs.length];
    qs[0].click();
    if (qs[0].getAttribute('aria-expanded') !== 'true' || qs[0].nextElementSibling.hidden) f.push('first answer did not open');
    qs[1].click();
    if (qs[0].getAttribute('aria-expanded') !== 'false' || !qs[0].nextElementSibling.hidden) f.push('first answer did not close when the second opened');
    qs[1].click();
    if (qs[1].getAttribute('aria-expanded') !== 'false') f.push('second answer did not close on a second click');
    return f;
  },
  async cta() {
    const f = [], P = window.PORTFOLIO;
    const input = $('#cta-email');
    if (!input || input.type !== 'email') f.push('email input');
    if (!$('#cta-form button[type="submit"]')) f.push('submit button');
    if (!$(`#contact a[href="mailto:${P.person.email}"]`)) f.push('visible email link');
    const li = $('#contact a[href*="linkedin.com"]');
    if (!li || li.target !== '_blank' || !li.rel.includes('noopener')) f.push('LinkedIn link attributes');
    input.value = 'not-an-email';
    $('#cta-form').requestSubmit(); await wait(50);
    if (input.validity.valid) f.push('invalid email not flagged');
    if (document.activeElement !== input) f.push('invalid email did not stop at validation (field not focused)');
    input.value = '';
    return f;
  }
```

- [ ] **Step 2: Run them and watch them fail**

Reload `/?p=recruiter` and run `.run('faq')`.
Expected: `{"name":"faq","pass":false,"fails":["faq count 0"]}`.

- [ ] **Step 3: Insert the FAQ and the form handler**

In `assets/js/app.js`, insert immediately after `  /* ── page sections are added below ── */`:
```js

  /* ── FAQ: one answer open at a time ── */
  $('#faq-list').innerHTML = P.faq.map((f, i) => `<div class="faq__item">
    <button class="faq__q" aria-expanded="false" aria-controls="fa${i}">${f.q}${NF.icons.plus}</button>
    <div class="faq__a" id="fa${i}" hidden>${f.a}</div></div>`).join('');
  $('#faq-list').addEventListener('click', e => {
    const q = e.target.closest('.faq__q');
    if (!q) return;
    const open = q.getAttribute('aria-expanded') === 'true';
    $$('.faq__q').forEach(b => { b.setAttribute('aria-expanded', 'false'); b.nextElementSibling.hidden = true; });
    if (!open) { q.setAttribute('aria-expanded', 'true'); q.nextElementSibling.hidden = false; }
  });

  /* ── contact form: no backend, opens a pre-filled email ── */
  $('#cta-form').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#cta-email');
    if (input.value && !input.checkValidity()) return input.reportValidity();
    location.href = NF.ctaMailto(input.value.trim());
  });
```

- [ ] **Step 4: Run every check and watch them pass**

Reload `/?p=recruiter` and run `runAll()`.
Expected: all ten checks `pass: true`, and the console has no errors.

Manually type `hr@acme.co` into the form, click **Get in touch**, and confirm the mail app opens. The subject should be "Let’s talk — from your portfolio" and the body should end with "You can reach me at hr@acme.co."

- [ ] **Step 5: Visual review**

Screenshot the FAQ (first answer open) and the contact band at 1440×900 and 390×844. Check: the avatar has a red ring, the input and button sit side by side on desktop and stack on a phone, and the email/LinkedIn line is visible.

- [ ] **Step 6: Commit**

```bash
git add assets/js/app.js tests/browser/checks.js
git commit -m "feat: add FAQ accordion and mail-based contact form" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Photos and social preview image

The user supplied two Gemini images on 2026-10-10:
- `~/Downloads/Gemini_Generated_Image_qv1dy2qv1dy2qv1d.png` — 3200×1344, wide. Becomes `heroWide`, which is also the trailer background.
- `~/Downloads/Gemini_Generated_Image_opma6eopma6eopma.png` — 1696×2528, tall. Becomes `heroMobile` and also `poster`.

Both carry Gemini's visible sparkle mark:
- wide image: background right of the shoulder, about x 2912–3008, y 1056–1152
- tall image: lower blazer, about x 1406–1502, y 2244–2340

**Crop them only if the user said so** (Step 2). No work photos were supplied, so those cards keep their generated art.

**Files:**
- Create: `tools/optimize-images.sh`, `tools/og-image.html`
- Create: `assets/img/hero-wide.jpg`, `assets/img/hero-mobile.jpg`, `assets/img/og-image.jpg`
- Modify: `assets/js/data.js` (`images` slots)
- Modify: `tests/page.test.mjs` (og-image test)

**Interfaces:**
- Consumes: `images` slots (Task 1), `NF.img` (Task 2) and the `is-wide` billboard rule (Task 4).
- Produces: filled image slots and `assets/img/og-image.jpg`, which `index.html` already references.

- [ ] **Step 1: Add the failing og-image test**

Append to `tests/page.test.mjs`:
```js
test('social preview image exists and is under 200 KB', async () => {
  const { statSync } = await import('node:fs');
  const og = new URL('assets/img/og-image.jpg', root);
  assert.ok(existsSync(og), 'assets/img/og-image.jpg');
  assert.ok(statSync(og).size <= 200 * 1024, 'og-image.jpg over 200 KB');
});
```
Run: `node --test tests/page.test.mjs`
Expected: FAIL with `assets/img/og-image.jpg`.

- [ ] **Step 2: Stage the source photos**

```bash
mkdir -p ~/Downloads/portfolio-images
cp ~/Downloads/Gemini_Generated_Image_qv1dy2qv1dy2qv1d.png ~/Downloads/portfolio-images/hero-wide.png
cp ~/Downloads/Gemini_Generated_Image_opma6eopma6eopma.png ~/Downloads/portfolio-images/hero-mobile.png
```

**Only if the user approved cropping the sparkle mark**, run the lines below. They edit only the staged copies; the originals are untouched.
```bash
sips -c 1344 2890 --cropOffset 0 0 ~/Downloads/portfolio-images/hero-wide.png >/dev/null    # keep the left 2890 px — only background is lost
sips -c 2228 1696 --cropOffset 0 0 ~/Downloads/portfolio-images/hero-mobile.png >/dev/null  # keep the top 2228 px — only lower blazer is lost
```
Open both staged files in Preview and confirm the mark is gone and her face and shoulders are intact.

- [ ] **Step 3: Write the optimizer**

`tools/optimize-images.sh`:
```bash
#!/usr/bin/env bash
# Resize and compress portfolio photos into assets/img/ with macOS sips.
# Usage: tools/optimize-images.sh [source-folder]   (default: ~/Downloads/portfolio-images)
# Source names: hero-wide, hero-mobile, poster, work-presenting, work-whiteboard, work-laptop
# (png/jpg/jpeg/heic), plus an optional transparent cutout.png.
set -euo pipefail

SRC="${1:-$HOME/Downloads/portfolio-images}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/assets/img"
mkdir -p "$OUT"

find_src() {
  for ext in png jpg jpeg heic PNG JPG JPEG HEIC; do
    if [ -f "$SRC/$1.$ext" ]; then echo "$SRC/$1.$ext"; return 0; fi
  done
  return 0
}

# name  max-width  budget-KB
while read -r name max budget; do
  src="$(find_src "$name")"
  if [ -z "$src" ]; then echo "skip  $name (not in $SRC)"; continue; fi
  width=$(sips -g pixelWidth "$src" | awk '/pixelWidth/ {print $2}')
  for q in 80 70 60; do
    if [ "$width" -gt "$max" ]; then
      sips -s format jpeg -s formatOptions "$q" --resampleWidth "$max" "$src" --out "$OUT/$name.jpg" >/dev/null
    else
      sips -s format jpeg -s formatOptions "$q" "$src" --out "$OUT/$name.jpg" >/dev/null
    fi
    kb=$(( $(stat -f%z "$OUT/$name.jpg") / 1024 ))
    [ "$kb" -le "$budget" ] && break
  done
  echo "ok    $name → assets/img/$name.jpg (${kb} KB, q$q)"
done <<'LIST'
hero-wide 2400 350
hero-mobile 1200 200
poster 1200 250
work-presenting 1600 200
work-whiteboard 1600 200
work-laptop 1600 200
LIST

src="$(find_src cutout)"
if [ -n "$src" ]; then
  sips -s format png --resampleHeight 1400 "$src" --out "$OUT/hero-cutout.png" >/dev/null
  echo "ok    cutout → assets/img/hero-cutout.png ($(( $(stat -f%z "$OUT/hero-cutout.png") / 1024 )) KB)"
fi
```

Run:
```bash
chmod +x tools/optimize-images.sh
tools/optimize-images.sh
```
Expected output, with sizes within budget:
```
ok    hero-wide → assets/img/hero-wide.jpg (… KB, q…)
ok    hero-mobile → assets/img/hero-mobile.jpg (… KB, q…)
skip  poster (not in …)
skip  work-presenting (not in …)
skip  work-whiteboard (not in …)
skip  work-laptop (not in …)
```

- [ ] **Step 4: Fill the image slots**

In `assets/js/data.js`, replace:
```js
    heroWide: null,
    heroCutout: false,
    heroMobile: null,
    poster: null,
```
with:
```js
    heroWide: 'assets/img/hero-wide.jpg',
    heroCutout: false,
    heroMobile: 'assets/img/hero-mobile.jpg',
    poster: 'assets/img/hero-mobile.jpg',
```
Run: `node --test tests/data.test.mjs`
Expected: PASS. The "every image slot points at a real file" test now checks both new files.

- [ ] **Step 5: Write the social-preview template**

`tools/og-image.html`:
```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Social preview template (1200×630)</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@500;700&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #141414; color: #fff; font-family: Inter, sans-serif }
  .photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 72% 28% }
  .shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0, 0, 0, .92) 0%, rgba(0, 0, 0, .6) 42%, transparent 70%) }
  .text { position: absolute; left: 64px; top: 0; bottom: 0; width: 600px; display: flex; flex-direction: column; justify-content: center }
  .mark { font-family: 'Bebas Neue', sans-serif; color: #e50914; font-size: 34px; letter-spacing: .3em }
  h1 { font-family: 'Bebas Neue', sans-serif; font-weight: 400; font-size: 150px; line-height: .85; margin: 14px 0 16px }
  p { font-size: 28px; font-weight: 500; color: #e5e5e5; margin: 0; line-height: 1.3 }
  .tag { margin-top: 24px; font-size: 20px; font-weight: 700; color: #46d369 }
</style>
</head>
<body>
  <img class="photo" src="../assets/img/hero-wide.jpg" alt="" onerror="this.onerror=null;this.src='../assets/img/anushreya-portrait.jpg'">
  <div class="shade"></div>
  <div class="text">
    <div class="mark">A SERIES</div>
    <h1>ANUSHREYA</h1>
    <p>Business Analyst · Returns &amp; Fraud Analytics · Process Automation</p>
    <div class="tag">AJIO · Reliance Retail · Open to Bengaluru</div>
  </div>
</body>
</html>
```

- [ ] **Step 6: Render it to `assets/img/og-image.jpg`**

The preview server from Task 3 must be running.
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=5000 \
  --screenshot="$PWD/og.png" "http://127.0.0.1:8765/tools/og-image.html"
sips -s format jpeg -s formatOptions 82 og.png --out assets/img/og-image.jpg >/dev/null && rm og.png
sips -g pixelWidth -g pixelHeight assets/img/og-image.jpg
```
Expected: `pixelWidth: 1200` and `pixelHeight: 630`.

If the size differs, render instead with DevTools: emulate `1200x630x1`, open the same URL, take a PNG screenshot, and convert it with the same `sips` line.

Open `assets/img/og-image.jpg` and check that the photo, the red "A SERIES" mark, the name and the headline are all visible, and the fonts are Bebas Neue and Inter (not Times).

- [ ] **Step 7: Run all tests and review the photos in place**

Run: `node --test tests/*.test.mjs`
Expected: PASS, 21 tests.

Reload `/?p=recruiter`:
- At 1440×900, the billboard is the full-bleed wide photo, with her on the right and readable text on the left.
- At 390×844, it is the tall photo with a bottom fade and centred text.

Open the "Anushreya" card in Continue Watching (poster crop shows her face) and play the trailer (the wide photo dimmed behind the captions). Run `runAll()` again: expected all `pass: true`.

- [ ] **Step 8: Commit**

```bash
git add tools/optimize-images.sh tools/og-image.html assets/img/hero-wide.jpg assets/img/hero-mobile.jpg assets/img/og-image.jpg assets/js/data.js tests/page.test.mjs
git commit -m "feat: add hero photos, image optimizer and social preview image" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Cleanup, Pages config, README and release check

**Files:**
- Delete: `styles.css`, `script.js`, `assets/anushreya.jpg`, `assets/portrait-placeholder.svg`, `assets/anushreya-portrait.jpg`, `samples/`
- Create: `_config.yml`, `tests/repo.test.mjs`
- Replace: `README.md`

**Interfaces:**
- Consumes: everything above.
- Produces: a branch ready for the user's go-ahead to push and open a PR.

- [ ] **Step 1: Write the failing repo tests**

`tests/repo.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { read, root } from './helpers/load.mjs';

test('old site files and design samples are gone', () => {
  for (const f of ['styles.css', 'script.js', 'assets/anushreya.jpg', 'assets/portrait-placeholder.svg', 'assets/anushreya-portrait.jpg', 'samples']) {
    assert.ok(!existsSync(new URL(f, root)), f);
  }
});

test('_config.yml keeps repo-only folders off the live site', () => {
  const cfg = read('_config.yml');
  for (const d of ['docs', 'tests', 'tools', 'samples', 'README.md']) assert.match(cfg, new RegExp(`^\\s+- ${d.replace('.', '\\.')}$`, 'm'), d);
});

test('README explains content, images, preview and tests', () => {
  const md = read('README.md');
  for (const s of ['assets/js/data.js', 'tools/optimize-images.sh', 'python3 -m http.server', 'node --test', '?p=recruiter']) assert.ok(md.includes(s), s);
});
```
Run: `node --test tests/repo.test.mjs`
Expected: FAIL. `styles.css` still exists, and `_config.yml` is missing.

- [ ] **Step 2: Remove the old site and the samples**

```bash
git rm -q styles.css script.js assets/anushreya.jpg assets/portrait-placeholder.svg assets/anushreya-portrait.jpg
git rm -rq samples
```
These files stay recoverable from git history (commit "docs: add design samples, spec and implementation plan").

- [ ] **Step 3: Add `_config.yml`**

```yaml
# GitHub Pages (Jekyll): keep repo-only folders off the live site.
exclude:
  - docs
  - tests
  - tools
  - samples
  - README.md
```

- [ ] **Step 4: Rewrite `README.md`**

````markdown
# anushreya-ophub.github.io

Netflix-style portfolio for Anushreya, Business Analyst — live at https://anushreya-ophub.github.io/

## Edit the content

Every word, number and link lives in `assets/js/data.js` (`window.PORTFOLIO`): case studies (`titles`), the Top 10 numbers, skills, profiles, the trailer and the FAQ. Numbers must come from the résumé — `node --test` fails if a number isn't in `tests/helpers/resume.mjs`.

## Add or swap photos

1. Put originals in `~/Downloads/portfolio-images/` named `hero-wide`, `hero-mobile`, `poster`, `work-presenting`, `work-whiteboard` or `work-laptop` (png/jpg/heic). A transparent `cutout.png` also works.
2. Run `tools/optimize-images.sh` — it resizes and compresses into `assets/img/`.
3. Point the matching slot in `assets/js/data.js` → `images` at the new file. Empty slots fall back to the portrait (heroes) or to generated art (work photos).
4. To refresh the social preview, render `tools/og-image.html` to `assets/img/og-image.jpg` (1200×630).

## Preview locally

```
python3 -m http.server 8765
```
Open http://127.0.0.1:8765/ — add `?p=recruiter` (or `manager`, `analyst`, `guest`) to skip the intro and profile picker.

## Tests

- Data, logic and page structure: `node --test tests/*.test.mjs`
- In the browser (preview running, DevTools console): `(await import('/tests/browser/checks.js?v=' + Date.now())).runAll()`

## Structure

- `index.html` — page shell, meta tags and the no-JavaScript fallback
- `assets/css/site.css` — all styles
- `assets/js/data.js` — content · `ui.js` — key art, modal, player · `app.js` — page logic
- `assets/img/` — photos and the social preview
- `docs/` — design spec and plan · `tools/` — image scripts · `tests/` — checks (kept off the live site by `_config.yml`)
````

- [ ] **Step 5: Run all unit tests**

Run: `node --test tests/*.test.mjs`
Expected: PASS, 24 tests, 0 failures.

- [ ] **Step 6: Full in-browser pass**

With the preview server running:
1. At 1440×900, load `/?p=recruiter` and run `runAll()`. Expected: all ten checks `pass: true`; console clean.
2. At `390x844x3,mobile,touch`, load `/?p=recruiter` and run `.run('overflow')`, `.run('modal')`, `.run('faq')` and `.run('cta')`. Expected: all `pass: true`.
3. At `360x780x3,mobile,touch`, run `.run('overflow')`. Expected: `pass: true`.
4. Keyboard pass with a real keyboard:
   - Tab from the top: the skip link appears first, then the nav.
   - Enter on a card opens the modal.
   - Tab cycles inside the modal; Escape closes it and returns focus to the card.
   - Open the trailer: Space pauses, → advances, Escape closes it.
5. Screenshot each profile's billboard (`?p=recruiter`, `manager`, `analyst`, `guest`) at desktop and phone size, plus the rows, FAQ, contact band and footer. Look for clipped text, overlaps or broken images.

- [ ] **Step 7: Lighthouse**

Run Lighthouse (DevTools MCP `lighthouse_audit`, or the DevTools Lighthouse panel) on `http://127.0.0.1:8765/?p=recruiter`, once in mobile mode and once in desktop mode.

Targets:
- Performance ≥ 85 (mobile)
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

For any score under target, fix the top listed issue and re-run. Record the four mobile scores for the hand-off message.

- [ ] **Step 8: Commit**

```bash
git add -A _config.yml README.md tests/repo.test.mjs
git commit -m "chore: remove old site and samples, add Pages config and README" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git status --short   # expect clean
git log --oneline main..netflix-portfolio
```

- [ ] **Step 9: Stop and hand off**

Report to the user:
- test results
- Lighthouse scores
- screenshots of the billboard at desktop and phone size
- the branch log

**Do not push, open a PR or merge** until the user says so. Once they approve, run `git push -u origin netflix-portfolio` and `gh pr create --base main --head netflix-portfolio`, with the PR body ending in `🤖 Generated with [Claude Code](https://claude.com/claude-code)`. Merging the PR deploys the site.
