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
  assert.deepEqual(json.sameAs, ['https://www.linkedin.com/in/anushreya-ops']);
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

test('résumé PDF ships with the site and is linked for download from contact and footer', async () => {
  const { statSync } = await import('node:fs');
  const pdf = new URL('assets/resume/Anushreya-Resume.pdf', root);
  assert.ok(existsSync(pdf), 'assets/resume/Anushreya-Resume.pdf');
  assert.ok(statSync(pdf).size > 10 * 1024, 'résumé PDF suspiciously small');
  const links = [...html.matchAll(/<a\b[^>]*>/g)].map(m => m[0]).filter(a => a.includes('href="assets/resume/Anushreya-Resume.pdf"') && /\sdownload\b/.test(a));
  assert.ok(links.length >= 2, 'expected download links in contact and footer, got ' + links.length);
});

test('social preview image exists and is under 200 KB', async () => {
  const { statSync } = await import('node:fs');
  const og = new URL('assets/img/og-image.jpg', root);
  assert.ok(existsSync(og), 'assets/img/og-image.jpg');
  assert.ok(statSync(og).size <= 200 * 1024, 'og-image.jpg over 200 KB');
});

test('hero photo is preloaded only by the head script, and only for the Recruiter start', () => {
  assert.doesNotMatch(html, /<link rel="preload" as="image"/);
  const head = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  assert.match(head, /recruiter/);
  assert.match(head, /rel = 'preload'/);
  assert.match(head, /hero-wide\.jpg/);
  assert.match(head, /hero-mobile\.jpg/);
  assert.match(head, /setTimeout\(function \(\) \{ d\.classList\.add\('is-ready'\)/);
});

test('head-script preload paths match the hero images in data.js', () => {
  const data = read('assets/js/data.js');
  for (const slot of ['heroWide', 'heroMobile']) {
    const path = data.match(new RegExp(`${slot}: '([^']+)'`))[1];
    assert.ok(html.includes(`'${path}'`), `${slot} ${path}`);
  }
});

test('two conveyor dividers and the intro tagline are in the static HTML', () => {
  assert.equal(html.match(/<div class="conveyor" aria-hidden="true"><\/div>/g).length, 2);
  assert.match(html, /<div class="intro" id="intro" aria-hidden="true"><div class="intro__mark">ANUSHREYA<\/div><span class="intro__tag">Returns · Fraud · Automation<\/span>/);
  assert.ok(html.indexOf('id="rows"') < html.indexOf('class="conveyor"') && html.indexOf('class="conveyor"') < html.indexOf('id="faq"'));
});
