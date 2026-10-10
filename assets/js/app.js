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

  /* ── "head follows the cursor" portrait ──
     Nine photos stacked in a round frame; one is visible at a time. Frames are created only when needed.
     Mouse: the head turns toward the pointer. Touch: device tilt where it needs no permission, else a gentle idle glance.
     Reduced motion: the straight-ahead frame only. */
  const LOOK_CENTER = 4;                               // index of look-2-2 in images.look (row-major)
  const LOOK_IDLE = [4, 5, 4, 1, 4, 3, 4, 7];          // 2-2 → 2-3 → 2-2 → 1-2 → 2-2 → 2-1 → 2-2 → 3-2
  function mountLook(holder, opts) {
    opts = opts || {};
    const paths = P.images.look;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const frames = [];
    let cur = LOOK_CENTER, onScreen = true, idle = 0, step = 0, tilt = false, raf = 0, aim = null;
    const pick = (d, zone) => Math.abs(d) < zone ? 1 : d < 0 ? 0 : 2; // 0, 1, 2 = left/centre/right (or up/centre/down)
    const ready = im => im && im.complete && im.naturalWidth > 0;

    function frame(i) {
      const im = new Image();
      im.decoding = 'async';
      im.alt = i === LOOK_CENTER ? (opts.alt || '') : '';
      if (i !== LOOK_CENTER) im.setAttribute('aria-hidden', 'true');
      im.width = im.height = 480;
      im.src = paths[i];
      frames[i] = im;
      holder.insertBefore(im, frames.slice(i + 1).find(Boolean) || null); // keep the DOM in row-major order
      return im;
    }
    function show(i) {
      if (i === cur || !ready(frames[i])) return;       // never blank out the portrait for a frame that hasn't loaded
      frames[cur].classList.remove('is-on');
      frames[i].classList.add('is-on');
      cur = i;
    }
    const frameAt = (r, c) => r * 3 + c;
    function render() {
      raf = 0;
      if (!onScreen || !aim) return show(LOOK_CENTER);
      if (aim.pointer) {
        const b = holder.getBoundingClientRect();
        const dx = aim.x - (b.left + b.width / 2), dy = aim.y - (b.top + b.height / 2);
        show(frameAt(pick(dy, innerHeight * .12), pick(dx, innerWidth * .12)));
      } else show(frameAt(pick(aim.beta - 50, 12), pick(aim.gamma, 12))); // 50° ≈ a phone held in the hand
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(render); };

    function syncIdle() {
      const go = !still && !fine && !tilt && onScreen && !document.hidden;
      if (go && !idle) idle = setInterval(() => show(LOOK_IDLE[step++ % LOOK_IDLE.length]), 1800);
      if (!go && idle) { clearInterval(idle); idle = 0; }
    }
    function track() {
      if (fine) {
        addEventListener('pointermove', e => { if (e.pointerType !== 'touch') { aim = { pointer: true, x: e.clientX, y: e.clientY }; queue(); } }, { passive: true });
        document.addEventListener('pointerout', e => { if (!e.relatedTarget) { aim = null; queue(); } }); // left the window
      } else {
        step = 1;
        addEventListener('deviceorientation', e => {      // fires with values only where no permission is needed (Android); never prompt on iOS
          if (e.gamma == null || e.beta == null) return;
          if (!tilt) { tilt = true; syncIdle(); }
          aim = { gamma: e.gamma, beta: e.beta };
          queue();
        }, { passive: true });
        document.addEventListener('visibilitychange', syncIdle);
        syncIdle();
      }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(l => { onScreen = l[l.length - 1].isIntersecting; if (!onScreen) show(LOOK_CENTER); else if (aim) queue(); syncIdle(); }).observe(holder);
      }
    }
    function begin() {
      if (opts.replace) opts.replace.replaceWith(holder);
      if (still) return;
      for (let i = 0; i < paths.length; i++) if (!frames[i]) frame(i);
      track();
    }

    const first = frame(LOOK_CENTER);
    first.classList.add('is-on');
    if (ready(first)) begin(); else first.addEventListener('load', begin, { once: true }); // the other eight wait for the first
  }

  /* gate: the avatar loads when the gate first opens (see openGate); contact: when the band is within 400 px of the screen */
  const ctaAv = $('.ctaband__av');
  if (ctaAv && P.images.look) {
    const holder = document.createElement('div');
    holder.className = 'look look--cta';
    const go = () => mountLook(holder, { alt: 'Portrait of Anushreya', replace: ctaAv }); // swapped in once its first frame has loaded
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(l => { if (l.some(en => en.isIntersecting)) { io.disconnect(); go(); } }, { rootMargin: '400px 0px' });
      io.observe(ctaAv);
    } else go();
  }

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
          <a class="circ" href="${P.person.resume}" download="Anushreya-Resume.pdf" aria-label="Download résumé (PDF)">${NF.icons.download}</a>
        </div>
      </div>
      <div class="bill__rating">${P.person.location}</div>`;
  }

  /* ── order journey and rows ── */
  const parcel = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9"/></svg>';
  const chevL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  const chevR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
  function rowHTML(id) {
    const r = P.rows[id];
    let items, cls = '';
    if (id === 'top10') {
      cls = ' row--top10';
      items = P.top10.map((s, i) => `<div class="row__item" style="--i:${i}"><button class="t10card" data-key="${s.ref}" aria-label="Number ${i + 1}: ${s.value}, ${s.label}">
        <span class="t10card__num${i === 9 ? ' is-10' : ''}" aria-hidden="true">${i + 1}</span>
        <span class="art art--poster">${NF.svg(P.titles[s.ref], { align: 'xMaxYMid' })}<span class="art__mark" aria-hidden="true">A</span><span class="t10card__code" aria-hidden="true"></span><span class="t10card__tag" aria-hidden="true"></span><span class="t10card__txt"><span class="t10card__val">${s.value}</span><span class="t10card__lbl">${s.label}</span></span></span>
      </button></div>`).join('');
    } else if (id === 'skills') {
      items = P.skills.map((s, i) => `<div class="row__item" style="--i:${i}"><div class="skill"><span class="skill__group">${s.group}</span><strong>${s.name}</strong><span class="skill__note">${s.note}</span></div></div>`).join('');
    } else if (id === 'continue') {
      items = r.items.map((k, i) => `<div class="row__item" style="--i:${i}"><button class="card" data-key="${k}" aria-label="${NF.get(k).title}">${NF.art(NF.get(k), { noFlag: true })}<span class="cw__bar"></span><span class="cw__meta"><span class="pill pill--${r.status[k].toLowerCase().replace(/\s+/g, '-')}">${r.status[k]}</span>${r.notes[k]}</span></button></div>`).join('');
    } else {
      items = r.items.map((k, i) => `<div class="row__item" style="--i:${i}"><button class="card" data-key="${k}" aria-label="${P.titles[k].title}">${NF.art(P.titles[k])}</button></div>`).join('');
    }
    return `<section class="row${cls}" id="row-${id}"><h2 class="row__h">${r.title}</h2>
      <div class="row__wrap">
        <button class="row__btn row__btn--l" aria-label="Scroll left" tabindex="-1">${chevL}</button>
        <div class="row__track">${items}</div>
        <button class="row__btn row__btn--r" aria-label="Scroll right" tabindex="-1">${chevR}</button>
      </div></section>`;
  }
  function journeyHTML() {
    const steps = P.journey.map(s => {
      const inner = `<span class="journey__dot"></span><span class="journey__name">${s.step}</span>${s.tag ? `<span class="journey__tag">${s.tag}</span>` : ''}`;
      return `<li class="journey__step${s.ref ? ' is-tagged' : ''}">${s.ref ? `<button data-open="${s.ref}"${s.tag ? ` aria-label="${s.step}: ${s.tag} — open case file"` : ''}>${inner}</button>` : `<span class="journey__plain">${inner}</span>`}</li>`;
    }).join('');
    return `<section class="journey" aria-label="Order journey"><div class="journey__lane"><ol class="journey__track">${steps}</ol>
      <span class="journey__rail" aria-hidden="true"><span class="journey__parcel">${parcel}</span></span></div></section>`;
  }

  /* Rows animate in the first time they scroll into view; the Top 10 values count up with them. */
  let rowSeen = null;
  function rowIn(row) {
    row.classList.add('is-in');
    if (row.id === 'row-top10') row.querySelectorAll('.t10card__val').forEach((el, i) => NF.countUp(el, P.top10[i].value));
  }
  function watchRows() {
    if (rowSeen) rowSeen.disconnect();
    const rows = $$('#rows .row');
    if (!('IntersectionObserver' in window)) return rows.forEach(rowIn);
    rowSeen = new IntersectionObserver(list => list.forEach(en => {
      if (!en.isIntersecting) return;
      rowSeen.unobserve(en.target);
      rowIn(en.target);
    }), { threshold: .15 });
    rows.forEach(r => rowSeen.observe(r));
  }

  function renderHome(p) {
    try {
      $('#who').setAttribute('aria-label', `Switch profile, currently ${p.name}`);
      $('#who').innerHTML = `<span class="nav__av" style="background:${p.color}">${NF.icons[p.icon]}</span><span class="nav__hide">${p.name}</span>${NF.icons.down.replace('<svg', '<svg class="caret"')}`;
      renderBill(p.hero);
      $('#rows').innerHTML = journeyHTML() + p.rows.map(rowHTML).join('');
    } finally {
      document.documentElement.classList.add('is-ready');
    }
    watchRows();
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
      tr.scrollBy({ left: (btn.classList.contains('row__btn--l') ? -1 : 1) * tr.clientWidth * .9, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
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

  /* ── intro: once per session; the head script adds .skip-intro when it isn't wanted ── */
  const intro = $('#intro');
  let focusGate = false; // set when the gate opens while the intro is still covering it
  const focusFirstProfile = () => gate.querySelector('.prof').focus({ preventScroll: true });
  if (document.documentElement.classList.contains('skip-intro')) intro.remove();
  else {
    ss.set('nf-intro', '1');
    const endIntro = e => {
      removeEventListener('keydown', endIntro);
      if (!intro.isConnected || intro.classList.contains('is-done')) return;
      if (e && e.type === 'keydown') e.preventDefault(); // the key that skips the intro must not also pick a profile
      intro.classList.add('is-done');
      setTimeout(() => {
        intro.remove();
        if (focusGate && !gate.hidden) focusFirstProfile(); // after the key is released, so it can't activate the button
        focusGate = false;
      }, 450);
    };
    intro.addEventListener('click', endIntro);
    addEventListener('keydown', endIntro);
    intro.querySelector('.intro__mark').addEventListener('animationend', endIntro);
  }

  /* ── who's viewing ── */
  const gate = $('#gate');
  let chosen = false;
  $('#gate-list').innerHTML = P.profiles.map(p =>
    `<button class="prof" data-p="${p.id}"><span class="prof__av" style="background:${p.color}">${NF.icons[p.icon]}</span><span class="prof__name">${p.name}</span></button>`).join('');
  let gateLook = false;
  function openGate() {
    gate.hidden = false;
    if (!gateLook) { gateLook = true; mountLook($('#gate-look')); }
    document.documentElement.classList.add('no-scroll');
    if (intro.isConnected) focusGate = true; else focusFirstProfile();
  }
  function closeGate() {
    gate.hidden = true;
    document.documentElement.classList.remove('no-scroll');
  }
  function choose(id) {
    const p = P.profiles.find(x => x.id === id) || P.profiles[0];
    chosen = true;
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
    if (e.key === 'Escape' && chosen) { closeGate(); $('#who').focus({ preventScroll: true }); }
    else NF.trap(e, gate);
  });
  $('#who').addEventListener('click', openGate);

  const start = NF.pickProfile(qs.get('p'), ss.get('nf-profile'));
  if (start) choose(start.id); else openGate();
})();
