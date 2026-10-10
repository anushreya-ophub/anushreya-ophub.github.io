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
  },
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
    if (!$('#bill a[download][href$="Anushreya-Resume.pdf"]')) f.push('billboard résumé download link');
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
  },
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
    if (document.activeElement !== $('#who')) f.push('focus not returned to the nav avatar');
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
  },
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
    if (!$('#contact a[download][href$="Anushreya-Resume.pdf"]')) f.push('contact résumé download link');
    const li = $('#contact a[href*="linkedin.com"]');
    if (!li || li.target !== '_blank' || !li.rel.includes('noopener')) f.push('LinkedIn link attributes');
    input.value = 'not-an-email';
    $('#cta-form').requestSubmit(); await wait(50);
    if (input.validity.valid) f.push('invalid email not flagged');
    if (document.activeElement !== input) f.push('invalid email did not stop at validation (field not focused)');
    input.value = '';
    return f;
  },
  async motion() {
    const f = [], P = window.PORTFOLIO;
    if ($$('#rows .journey__step').length !== 7) f.push('journey steps ' + $$('#rows .journey__step').length);
    const tagged = $$('#rows .journey__step button');
    if (tagged.map(b => b.dataset.open).join() !== P.journey.filter(s => s.ref).map(s => s.ref).join()) f.push('journey tagged refs');
    for (const b of tagged) {
      b.click(); await wait(80);
      const m = $('.modal.is-open');
      if (!m) { f.push('journey step did not open ' + b.dataset.open); continue; }
      if (m.querySelector('.modal__title').textContent !== P.titles[b.dataset.open].title) f.push('journey opened the wrong title for ' + b.dataset.open);
      if (b === tagged[0]) {
        await wait(1500);
        const metric = m.querySelector('.modal__metric strong');
        if (metric.textContent !== P.titles[b.dataset.open].metric) f.push('modal metric did not land on ' + P.titles[b.dataset.open].metric);
      }
      press('Escape'); await wait(50);
    }
    $('#row-top10').scrollIntoView(); await wait(1700);
    $$('#row-top10 .t10card__val').forEach((el, i) => { if (el.textContent !== P.top10[i].value) f.push(`top10 value ${i}: "${el.textContent}" != "${P.top10[i].value}"`); });
    if (!$$('#rows .row.is-in').length) f.push('no row has .is-in');
    if ($$('.conveyor').length !== 2) f.push('conveyor count ' + $$('.conveyor').length);
    if (!(await (await fetch('/')).text()).includes('<span class="intro__tag">')) f.push('intro tagline missing from the HTML');
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
