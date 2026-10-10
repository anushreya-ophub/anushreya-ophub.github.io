import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/load.mjs';

const fresh = () => load('assets/js/data.js', 'assets/js/ui.js');

test('img(): heroes and poster fall back to the portrait, work photos to generated art', () => {
  const { NF, PORTFOLIO: P } = fresh();
  Object.assign(P.images, { heroWide: null, heroMobile: null, poster: null }); // the fallback is what is under test, not the shipped photos
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
  Object.assign(P.images, { heroWide: null, heroMobile: null, poster: null }); // the fallback is what is under test, not the shipped photos
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

test('countParts(): one number splits into prefix, value, decimals and suffix', () => {
  const { NF } = fresh();
  assert.deepEqual({ ...NF.countParts('₹3.5 Cr') }, { pre: '₹', num: 3.5, decimals: 1, post: ' Cr' });
  assert.deepEqual({ ...NF.countParts('2,500+') }, { pre: '', num: 2500, decimals: 0, post: '+' });
  assert.deepEqual({ ...NF.countParts('14,000+') }, { pre: '', num: 14000, decimals: 0, post: '+' });
  assert.deepEqual({ ...NF.countParts('+2.0 pp') }, { pre: '+', num: 2, decimals: 1, post: ' pp' });
  assert.deepEqual({ ...NF.countParts('+13 pp') }, { pre: '+', num: 13, decimals: 0, post: ' pp' });
  assert.deepEqual({ ...NF.countParts('14-day') }, { pre: '', num: 14, decimals: 0, post: '-day' });
  assert.deepEqual({ ...NF.countParts('3rd') }, { pre: '', num: 3, decimals: 0, post: 'rd' });
  assert.deepEqual({ ...NF.countParts('45%') }, { pre: '', num: 45, decimals: 0, post: '%' });
});

test('countParts(): no number, or more than one, is not animated', () => {
  const { NF } = fresh();
  for (const s of ['Weekly', '', '19% → 38%', '31.4% vs 26.17%', '2 of 4']) assert.equal(NF.countParts(s), null, s);
});

test('countable(): animate numbers with unit suffixes, not ordinals, hyphenated or spelled-out words', () => {
  const { NF } = fresh();
  for (const s of ['₹3.5 Cr', '+13 pp', '2,500+', '45%']) assert.equal(NF.countable(s), true, s);
  for (const s of ['3rd', '14-day', '8 steps', '19% → 38%']) assert.equal(NF.countable(s), false, s);
});

test('every Top 10 value has exactly one number to count up to', () => {
  const { NF, PORTFOLIO: P } = fresh();
  for (const { value } of P.top10) assert.ok(NF.countParts(value), value);
});

test('every title has an animated part in the motifs that move on hover', () => {
  const { NF, PORTFOLIO: P } = fresh();
  const has = (key, cls) => assert.match(NF.svg(P.titles[key]), new RegExp(`class="${cls}"`), `${key} ${cls}`);
  has('every-3-hours', 'm-hand');
  has('the-spike', 'm-draw');
  has('pincode-zero', 'm-pulse');
  has('fit-paradox', 'm-slide');
  assert.match(NF.svg(P.titles['the-spike']), /pathLength="1"/);
});
