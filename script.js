// ─── clock (BLR / IST) ─────────────────────────────────
(function clock(){
  const el = document.getElementById('clock');
  if(!el) return;
  function tick(){
    const now = new Date();
    const ist = new Date(now.toLocaleString('en-US', {timeZone:'Asia/Kolkata'}));
    const hh = String(ist.getHours()).padStart(2,'0');
    const mm = String(ist.getMinutes()).padStart(2,'0');
    el.textContent = `${hh}:${mm}`;
  }
  tick(); setInterval(tick, 30_000);
})();

// ─── count-up animation ────────────────────────────────
function animateCount(el){
  const raw = String(el.dataset.val);
  // optional non-numeric prefix like "₹"
  const m = raw.match(/^([^\d.\-]*)([-\d.]+)$/);
  const prefix = m ? m[1] : '';
  const target = parseFloat(m ? m[2] : raw);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const suf = el.dataset.suf ?? '';
  const dur = 1700;
  const start = performance.now();
  function frame(t){
    const p = Math.min(1, (t - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent = prefix + (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()) + suf;
    if(p < 1) requestAnimationFrame(frame);
    else el.textContent = prefix + (decimals ? target.toFixed(decimals) : Math.round(target).toLocaleString()) + suf;
  }
  requestAnimationFrame(frame);
}

// ─── intersection observer: reveals + counters ─────────
// only enable the data-aos hidden state once JS is ready, so the page is
// usable even if the observer never fires.
document.documentElement.classList.add('aos-ready');

const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('in');
    if(el.matches('.kpi__num, .counter')) animateCount(el);
    if(el.matches('.tile')){
      el.querySelectorAll('.kpi__bar').forEach(b => b.classList.add('in'));
    }
    io.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }) : null;

const tracked = document.querySelectorAll('[data-aos], .kpi__num, .counter, .tile, .rfunnel, .anomaly, .kpi__bar');
if(io){
  tracked.forEach(el => io.observe(el));
  // safety net: if anything is still hidden after 2.4s (above the fold elements
  // can race the observer on slow devices), force-reveal it
  setTimeout(() => {
    tracked.forEach(el => {
      if(el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if(r.top < window.innerHeight * 1.1){
        el.classList.add('in');
        if(el.matches('.kpi__num, .counter')) animateCount(el);
        if(el.matches('.tile')) el.querySelectorAll('.kpi__bar').forEach(b => b.classList.add('in'));
      }
    });
  }, 2400);
} else {
  // no IO support — show everything immediately
  tracked.forEach(el => el.classList.add('in'));
}

// ─── nav link active state via scroll ─────────────────
const links = document.querySelectorAll('.nav__links a[href^="#"]');
const sections = [...links].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const navIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    const id = '#' + e.target.id;
    links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navIO.observe(s));

// ─── nav scroll state ─────────────────────────────────
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 16);
window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

// ─── cursor spotlight ─────────────────────────────────
const root = document.documentElement;
let rafId = 0, mx = 0, my = 0;
window.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  if(rafId) return;
  rafId = requestAnimationFrame(() => {
    root.style.setProperty('--mx', mx + 'px');
    root.style.setProperty('--my', my + 'px');
    rafId = 0;
  });
}, {passive:true});

// ─── magnetic buttons ─────────────────────────────────
document.querySelectorAll('.magnetic').forEach(el => {
  const strength = 18;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width/2)) / (r.width/2);
    const y = (e.clientY - (r.top + r.height/2)) / (r.height/2);
    el.style.transform = `translate(${x*strength}px, ${y*strength}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

// ─── portrait tilt on mouse ───────────────────────────
const portrait = document.querySelector('.portrait__frame');
if(portrait){
  const wrap = portrait.parentElement;
  wrap.addEventListener('mousemove', (e) => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width/2)) / (r.width/2);
    const y = (e.clientY - (r.top + r.height/2)) / (r.height/2);
    portrait.style.transform = `perspective(900px) rotateY(${x*5}deg) rotateX(${-y*5}deg)`;
  });
  wrap.addEventListener('mouseleave', () => portrait.style.transform = '');
}

// ─── headline word-stagger on hover ───────────────────
document.querySelectorAll('.aw').forEach(el => {
  el.addEventListener('mouseenter', () => el.style.transform = 'translateX(8px)');
  el.addEventListener('mouseleave', () => el.style.transform = '');
  el.style.display = 'inline-block';
  el.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1)';
});
