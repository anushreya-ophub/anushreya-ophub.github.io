/* Shared UI for the portfolio: generated key art, image slots, icons,
   the "More Info" title modal and the captioned player. */
(function () {
  const P = window.PORTFOLIO;
  let uid = 0;

  /* ── Key-art motifs, drawn in a 320×180 box (kept top/right so titles stay legible) ── */
  const motifs = {
    clock() {
      let ticks = '';
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6, major = i % 3 === 0, r1 = major ? 42 : 48, r2 = 56;
        ticks += `<line x1="${235 + r1 * Math.sin(a)}" y1="${78 - r1 * Math.cos(a)}" x2="${235 + r2 * Math.sin(a)}" y2="${78 - r2 * Math.cos(a)}" stroke="#fff" stroke-opacity="${major ? .9 : .35}" stroke-width="${major ? 3 : 1.5}"/>`;
      }
      return `<circle cx="235" cy="78" r="66" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="16"/>${ticks}
        <path d="M235 22 A56 56 0 0 1 291 78" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
        <path d="M283 71 L291 82 L299 71" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <line class="m-hand" x1="235" y1="78" x2="235" y2="42" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        <line class="m-hand" x1="235" y1="78" x2="266" y2="78" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
        <circle cx="235" cy="78" r="5" fill="#fff"/>`;
    },
    lag() {
      let s = '';
      const x0 = 146, y0 = 34, w = 20, g = 4;
      for (let i = 0; i < 14; i++) {
        const x = x0 + (i % 7) * (w + g), y = y0 + Math.floor(i / 7) * (w + g), last = i === 13;
        s += `<rect x="${x}" y="${y}" width="${w}" height="${w}" rx="3" fill="${last ? '#fff' : 'none'}" stroke="#fff" stroke-opacity="${last ? 1 : .45}" stroke-width="1.5"/>`;
      }
      const lx = x0 + 6 * (w + g);
      return s + `<text x="${lx + w / 2}" y="${y0 + w + g + 15}" text-anchor="middle" font-family="JetBrains Mono" font-size="11" font-weight="700" fill="#000" fill-opacity=".75">14</text>
        <path d="M${x0 + 10} ${y0 - 12} H${lx + 6}" stroke="#fff" stroke-width="2" stroke-dasharray="2 4"/>
        <path d="M${lx + 2} ${y0 - 17} L${lx + 10} ${y0 - 12} L${lx + 2} ${y0 - 7}" fill="none" stroke="#fff" stroke-width="2"/>`;
    },
    gap() {
      return `<g font-family="JetBrains Mono" font-size="10" fill="#fff">
        <line x1="120" y1="30" x2="312" y2="30" stroke="#fff" stroke-width="3"/>
        <text x="312" y="22" text-anchor="end" fill-opacity=".85">31.4% JUNE</text>
        <line x1="120" y1="96" x2="312" y2="96" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-dasharray="6 5"/>
        <text x="312" y="112" text-anchor="end" fill-opacity=".7">26.17% PLAN</text>
        <path d="M292 36 V90 M286 36 H298 M286 90 H298" stroke="#fff" stroke-width="2"/>
        <rect x="232" y="38" width="48" height="13" fill="#fff" fill-opacity=".9"/>
        <rect x="232" y="55" width="30" height="13" fill="#fff" fill-opacity=".6"/>
        <rect x="232" y="72" width="18" height="13" fill="#fff" fill-opacity=".35"/></g>`;
    },
    spike() {
      return `<line x1="0" y1="100" x2="320" y2="100" stroke="#fff" stroke-opacity=".25" stroke-dasharray="3 5"/>
        <path class="m-draw" pathLength="1" d="M0 104 L40 101 L80 106 L120 100 L160 103 L190 98 L215 92 L240 30 L262 18 L290 24 L320 20" fill="none" stroke="#fff" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="262" cy="18" r="5" fill="#fff"/><circle cx="262" cy="18" r="13" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.5"/>
        <text x="306" y="78" text-anchor="end" font-family="Bebas Neue" font-size="46" fill="#fff" fill-opacity=".16">38%</text>`;
    },
    pins(id) {
      return `<defs><pattern id="${id}p" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="1.3" fill="#fff" fill-opacity=".18"/></pattern></defs>
        <rect width="320" height="180" fill="url(#${id}p)"/>
        <circle cx="240" cy="68" r="28" fill="none" stroke="#ff2a2a" stroke-opacity=".6" stroke-width="1.5"/>
        <circle cx="240" cy="68" r="46" fill="none" stroke="#ff2a2a" stroke-opacity=".28" stroke-width="1.5"/>
        <g class="m-pulse" fill="#ff2a2a"><circle cx="232" cy="66" r="5"/><circle cx="247" cy="60" r="4"/><circle cx="240" cy="80" r="4.5"/><circle cx="258" cy="72" r="3.5"/><circle cx="224" cy="54" r="3"/></g>
        <path d="M240 6 c-9 0 -15 7 -15 15 c0 11 15 25 15 25 s15 -14 15 -25 c0 -8 -6 -15 -15 -15z" fill="#fff"/><circle cx="240" cy="21" r="5" fill="#000" fill-opacity=".55"/>`;
    },
    log() {
      let s = '';
      [150, 110, 170, 90, 140, 120].forEach((w, i) => {
        const y = 18 + i * 17, hot = i === 2;
        s += `<rect x="150" y="${y}" width="10" height="10" rx="2" fill="${hot ? '#ff2a2a' : '#fff'}" fill-opacity="${hot ? 1 : .5}"/><rect x="166" y="${y + 2}" width="${w * .85}" height="6" rx="3" fill="#fff" fill-opacity="${hot ? .95 : .28}"/>`;
      });
      for (let i = 0; i < 8; i++) s += `<circle cx="${18 + i * 16}" cy="61" r="${2 + i % 3}" fill="#fff" fill-opacity="${(.12 + i * .08).toFixed(2)}"/>`;
      return s;
    },
    dash() {
      let s = '';
      [[150, 12], [208, 12], [266, 12], [150, 60], [208, 60], [266, 60]].forEach(([x, y], i) => {
        s += `<rect x="${x}" y="${y}" width="50" height="40" rx="4" fill="#fff" fill-opacity=".07" stroke="#fff" stroke-opacity=".3"/>`;
        if (i === 1) {
          s += `<path d="M${x + 10} ${y + 31} A15 15 0 0 1 ${x + 40} ${y + 31}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="4"/><path d="M${x + 10} ${y + 31} A15 15 0 0 1 ${x + 34} ${y + 19}" fill="none" stroke="#46d369" stroke-width="4"/>`;
        } else {
          const pts = [];
          for (let j = 0; j < 7; j++) pts.push(`${x + 6 + j * 6.3},${y + 31 - ((j * 7 + i * 13) % 17)}`);
          s += `<polyline points="${pts.join(' ')}" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>`;
        }
      });
      return s;
    },
    fit() {
      let ticks = '';
      for (let i = 0; i <= 26; i++) ticks += `<line x1="${i * 8}" y1="0" x2="${i * 8}" y2="${i % 5 ? 6 : 11}" stroke="#2a0a18" stroke-width="1.2"/>`;
      return `<g class="m-slide" transform="translate(112 34) rotate(-12)"><rect width="216" height="24" rx="2" fill="#f4d58d"/>${ticks}</g>
        <path d="M250 62 q0 -12 12 -12 t12 12 q0 7 -12 11 M262 73 L214 102 H310 Z" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
    },
    cut() {
      let holes = '', frames = '';
      for (let x = 104; x < 320; x += 14) holes += `<rect x="${x}" y="12" width="7" height="5" rx="1" fill="#000" fill-opacity=".55"/><rect x="${x}" y="65" width="7" height="5" rx="1" fill="#000" fill-opacity=".55"/>`;
      [110, 178, 246].forEach((x, i) => {
        frames += `<rect x="${x}" y="22" width="60" height="38" fill="#000" fill-opacity="${i === 1 ? .75 : .45}"/>`;
        if (i === 1) frames += `<path d="M${x + 16} 29 L${x + 44} 53 M${x + 44} 29 L${x + 16} 53" stroke="#ff2a2a" stroke-width="4" stroke-linecap="round"/>`;
      });
      return `<rect x="100" y="7" width="230" height="68" fill="#fff" fill-opacity=".85"/>${holes}${frames}`;
    },
    steps() {
      let s = '';
      for (let i = 0; i < 8; i++) s += `<rect x="${120 + i * 24}" y="18" width="16" height="16" rx="3" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>`;
      return s + `<path d="M128 40 Q 200 66 222 76 M296 40 Q 256 62 246 76" fill="none" stroke="#fff" stroke-opacity=".45" stroke-dasharray="3 4"/>
        <rect x="196" y="76" width="76" height="26" rx="13" fill="#fff"/>
        <text x="234" y="93" text-anchor="middle" font-family="JetBrains Mono" font-size="10" font-weight="700" fill="#000" fill-opacity=".8">1 CLICK</text>
        <path d="M262 92 l0 18 l5 -5 l4 8 l3 -1.5 l-4 -8 l7 0 z" fill="#fff" stroke="#000" stroke-opacity=".6" stroke-width="1"/>`;
    },
    road() {
      return `<path d="M150 180 L248 40 L262 40 L340 180 Z" fill="#000" fill-opacity=".3"/>
        <path d="M150 180 L248 40 M340 180 L262 40" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
        <path d="M245 180 L255 40" stroke="#fff" stroke-width="3" stroke-dasharray="10 9"/>
        <path d="M255 4 c-7 0 -12 5 -12 12 c0 9 12 20 12 20 s12 -11 12 -20 c0 -7 -5 -12 -12 -12z" fill="#fff"/>
        <circle cx="255" cy="16" r="4" fill="#000" fill-opacity=".55"/>`;
    },
    cap() {
      return `<path d="M214 56 q-16 34 6 62 M310 56 q16 34 -6 62" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>
        <g fill="#fff" fill-opacity=".7"><ellipse cx="206" cy="72" rx="7" ry="3" transform="rotate(-50 206 72)"/><ellipse cx="205" cy="90" rx="7" ry="3" transform="rotate(-20 205 90)"/><ellipse cx="212" cy="107" rx="7" ry="3" transform="rotate(15 212 107)"/>
        <ellipse cx="318" cy="72" rx="7" ry="3" transform="rotate(50 318 72)"/><ellipse cx="319" cy="90" rx="7" ry="3" transform="rotate(20 319 90)"/><ellipse cx="312" cy="107" rx="7" ry="3" transform="rotate(-15 312 107)"/></g>
        <text x="262" y="118" text-anchor="middle" font-family="DM Serif Display" font-size="92" fill="#fff">3</text>
        <path d="M226 26 L262 12 L298 26 L262 40 Z" fill="#fff"/><path d="M290 30 v14" stroke="#fff" stroke-width="2"/>`;
    },
    dna() {
      let a = '', b = '', r = '';
      for (let i = 0; i <= 20; i++) {
        const x = 140 + i * 8.5, y1 = 64 + 28 * Math.sin(i * .55), y2 = 64 - 28 * Math.sin(i * .55);
        a += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y1.toFixed(1);
        b += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y2.toFixed(1);
        if (i % 2 === 0) r += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>`;
      }
      return r + `<path d="${a}" fill="none" stroke="#fff" stroke-width="3"/><path d="${b}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>`;
    },
    bell() {
      let p = '', sig = '';
      for (let i = 0; i <= 60; i++) {
        const z = (i - 30) / 10;
        p += (i ? 'L' : 'M') + (120 + i * 3.2).toFixed(1) + ' ' + (112 - 80 * Math.exp(-z * z / 2)).toFixed(1);
      }
      [-3, -2, -1, 1, 2, 3].forEach(k => {
        const x = 120 + (30 + k * 10) * 3.2;
        sig += `<line x1="${x}" y1="28" x2="${x}" y2="112" stroke="#fff" stroke-opacity="${(.5 - Math.abs(k) * .1).toFixed(2)}" stroke-dasharray="2 4"/>`;
      });
      return sig + `<path d="${p}" fill="none" stroke="#fff" stroke-width="3"/><text x="216" y="22" text-anchor="middle" font-family="DM Serif Display" font-size="22" fill="#fff" fill-opacity=".85">σ</text>`;
    },
    ring() {
      let s = '';
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3, x = 250 + 38 * Math.cos(a), y = 62 + 38 * Math.sin(a);
        s += `<line x1="250" y1="62" x2="${x}" y2="${y}" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="9" fill="#fff" fill-opacity=".85"/>`;
      }
      return s + `<circle cx="250" cy="62" r="14" fill="#fff"/>`;
    },
    paddle() {
      return `<path d="M170 120 Q 240 -6 300 30" fill="none" stroke="#fff" stroke-opacity=".35" stroke-dasharray="3 5"/>
        <g transform="rotate(-30 240 70)"><ellipse cx="240" cy="60" rx="34" ry="38" fill="#e23b3b"/><rect x="233" y="94" width="14" height="40" rx="5" fill="#f1d3a3"/></g>
        <circle cx="300" cy="30" r="8" fill="#fff"/>`;
    }
  };

  function svg(t, opts = {}) {
    const a = t.art, id = 'nf' + (++uid);
    return `<svg class="art__bg" viewBox="0 0 320 180" preserveAspectRatio="${opts.align || 'xMidYMid'} slice" aria-hidden="true">
      <defs>
        <linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a.c1}"/><stop offset="1" stop-color="${a.c2}"/></linearGradient>
        <radialGradient id="${id}b" cx=".78" cy=".25" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset=".4" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".78"/></linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#${id}a)"/><rect width="320" height="180" fill="url(#${id}b)"/>
      <g>${(motifs[a.motif] || (() => ''))(id)}</g>
      <rect width="320" height="180" fill="url(#${id}c)"/>
    </svg>`;
  }

  const icons = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4l15 8-15 8z"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7.2v.6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 4l10 8-10 8zM17 4h2v16h-2z"/></svg>',
    replay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1-.01 5 2.5 2.5 0 0 1 .01-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.5-2.25 3.1V21H9z"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>',
    popcorn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 9h14l-2 12H7zM9.5 9l.8 12M14.5 9l-.8 12"/><path d="M6 9a2.5 2.5 0 0 1 2-4 3 3 0 0 1 5-1 3 3 0 0 1 4 1 2.5 2.5 0 0 1 2 4"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>'
  };

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

  /* ── Count-up numbers ── */
  /* Split a string that holds exactly one number; anything else is not animated. */
  function countParts(str) {
    const found = [...String(str).matchAll(/\d+(?:,\d{3})*(?:\.\d+)?/g)];
    if (found.length !== 1) return null;
    const raw = found[0][0], at = found[0].index;
    return { pre: str.slice(0, at), num: Number(raw.replace(/,/g, '')), decimals: (raw.split('.')[1] || '').length, post: str.slice(at + raw.length) };
  }

  /* True when str is one number with a unit-like suffix (%, +, Cr, pp). Ordinals, hyphenated
     words and spelled-out words (3rd, 14-day, 8 steps) read wrong while counting, so they show as is. */
  function countable(str) {
    const c = countParts(str);
    return !!c && !/^(st|nd|rd|th)\b|^-|^\s+[a-z]{3,}/i.test(c.post);
  }

  /* Count el's text up from zero to finalText. Screen readers get the final value up front;
     the moving digits are hidden from them. Reduced motion shows the final text at once. */
  function countUp(el, finalText) {
    const c = countParts(finalText);
    cancelAnimationFrame(el.nfCount);
    if (!countable(finalText) || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = finalText; return; }
    const grouped = finalText.includes(',');
    const fmt = v => c.pre + v.toLocaleString('en-US', { minimumFractionDigits: c.decimals, maximumFractionDigits: c.decimals, useGrouping: grouped }) + c.post;
    const live = document.createElement('span'), sr = document.createElement('span');
    sr.className = 'sr'; sr.textContent = finalText;
    live.setAttribute('aria-hidden', 'true'); live.textContent = fmt(0);
    el.replaceChildren(sr, live);
    const t0 = performance.now(), MS = 1200;
    const tick = now => {
      const p = Math.min(1, (now - t0) / MS);
      if (p === 1) { el.textContent = finalText; return; }
      live.textContent = fmt(c.num * (1 - Math.pow(1 - p, 3)));
      el.nfCount = requestAnimationFrame(tick);
    };
    el.nfCount = requestAnimationFrame(tick);
  }

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
    const leaving = !root.contains(at) || at === root || (e.shiftKey ? at === first : at === last);
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
            <a class="circ" href="${P.person.resume}" download="Anushreya-Resume.pdf" aria-label="Download résumé (PDF)">${icons.download}</a>
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
    const metric = modal.querySelector('.modal__metric strong');
    metric.style.minWidth = metric.offsetWidth + 1 + 'px'; // final width, so the line doesn't reflow while counting
    countUp(metric, t.metric);
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
      player.tabIndex = -1;
      document.body.appendChild(player);
      player.addEventListener('click', e => {
        if (e.target.closest('a')) return;
        if (e.target.closest('[data-pclose]')) return stop();
        if (e.target.closest('[data-pnext]')) return go(state.i + 1);
        if (e.target.closest('[data-preplay]')) return go(0);
        if (e.target.closest('[data-ptoggle]') || e.target.closest('.player__stage')) toggle();
      });
      document.addEventListener('keydown', e => {
        if (!state) return;
        if (e.key === 'Escape') stop();
        else if (e.key === ' ') { if (e.target.closest('button, a')) return; e.preventDefault(); toggle(); }
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
    player.focus(); // not on Back, so Space pauses instead of closing the trailer
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

  window.NF = { art, svg, img, icons, get, meta, mailto, ctaMailto, pickProfile, countParts, countable, countUp, playConfig, trap, openTitle, closeTitle, play };
})();
