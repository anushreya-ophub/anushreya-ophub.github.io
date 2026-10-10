# Netflix-style portfolio — design spec

Date: 2026-10-10 · Branch: `netflix-portfolio` · Site: https://anushreya-ophub.github.io/

## 1. Goal

Replace the current editorial site with a Netflix-style single-page portfolio for Anushreya, built only from the October 2026 résumé (*Business Analyst / Process Excellence*).

- **Audience:** recruiters and hiring managers for Business Analyst and Process Excellence roles (e-commerce operations, returns and fraud analytics, process automation), plus data peers.
- **Success:** a recruiter can find the role, headline numbers and contact route in under 30 seconds on a phone. A hiring manager can open any case study and read the full story. The page should be memorable enough to get shared.

## 2. Decisions already made

| Topic | Decision |
|---|---|
| Direction | Mix of the three samples: **A (Browse) as the base**, **B's trailer** for the hero's Play button, **C's FAQ and email call-to-action** at the bottom. |
| Content | Résumé facts only. Nothing from the current site's unsupported numbers (34% reduction, ₹2.4 Cr averted, 89% precision, "Returns Reduction Manager", category-lead quote). |
| Photo | New headshot (`Professional Navy Blazer Headshot.png`), stored as an optimized JPEG. AI-generated images (ChatGPT prompts already supplied) drop into named slots when ready. The build does not wait for them. |
| Contact | Email `ssanushreya@gmail.com` (from the résumé; a single constant in `data.js`) and LinkedIn `linkedin.com/in/anushreya1306`. The phone number is not published. |
| Branding | Netflix-inspired layout only. No Netflix logo, name or marks. Own wordmark (ANUSHREYA, red) and red "A" studio mark. |
| Stack | Static HTML, CSS and vanilla JS. No build step, no framework, served by GitHub Pages from `main`. |
| Theme | Dark only. This is part of the brand. |

## 3. Page flow

```
first visit in session:  Intro (2.4 s, skippable) → "Who's viewing?" → Home
same session reload:     Home (saved profile)
deep link ?p=<profile>:  Home (that profile; skips intro and gate)
```

### 3.1 Intro
- The ANUSHREYA wordmark zooms in and then out (CSS only, no sound).
- Click or any key skips it.
- Shown once per session (`sessionStorage`).
- Skipped when the visitor prefers reduced motion or when `?p=` is present.

### 3.2 "Who's viewing?" gate
- Four profiles: **Recruiter**, **Hiring Manager**, **Data Folks**, **Just Browsing**. Each is a coloured tile with an icon.
- A profile sets the billboard title and the row order (see §5 `profiles`).
- The choice is saved for the session. The avatar in the nav reopens the gate.
- An unknown `?p=` value falls back to Recruiter.

### 3.3 Home (top to bottom)
1. **Nav** (fixed; goes solid after 40 px of scroll):
   - wordmark
   - links: Home, Case Files, Career, Skills, FAQ (hidden under 820 px)
   - Contact link
   - profile switcher
   - a "Skip to content" link for keyboard users
2. **Billboard**, driven by the profile:
   - **Recruiter** sees the series itself: the photo hero, "Anushreya", the 2+ yrs metric and the logline. **Play opens B's trailer.** More Info opens the series modal.
   - **Other profiles** see their featured case study: large key art, title, metric and logline. Play opens that case study in the player. More Info opens its modal.
   - A right-edge tag reads "Open to Bengaluru".
   - Under 700 px, the image stacks on top and the text is centred below it, as in the Netflix mobile app.
3. **Rows**, ordered by profile:
   - Top 10 Numbers From the Résumé
   - Case Files: Returns & RCA
   - Fraud & Risk Thrillers
   - Continue Watching (Green Belt, Season 2 AJIO, Every 3 Hours, each with an "in progress" bar)
   - Earlier Seasons (internship, Rajasthan Patrika, UBS, Amity)
   - Cast & Crew (skills)

   Row behaviour:
   - horizontal scroll with snap
   - arrow buttons on desktop hover
   - swipe on touch
   - 6 / 5 / 4 / 3 / 2.2 cards visible depending on width
4. **FAQ** (from C): six questions in an accordion, one open at a time, written in the first person.
5. **Call-to-action** (from C): "Ready to hire? Enter your email to start the conversation."
   - An email input plus a **Get in touch** button that opens a `mailto:` with a pre-filled subject and body. There is no backend.
   - The address is also shown as plain, copyable text for visitors without a mail app.
6. **Footer:** LinkedIn and email icons, a link grid, and "© 2026 Anushreya".

### 3.4 Overlays (shared)
- **Hover preview** (desktop with a fine pointer only):
  - appears after 420 ms
  - enlarged art, Play / Email / More-info buttons, metric, year, type and genres
  - hides on scroll or mouse-out
- **Title modal ("More Info"):**
  - art header, type badge and title
  - Play, email-about-this and LinkedIn buttons
  - year, type and genre; the large metric line; the logline
  - Cast, Genres and Studio
  - an **Episodes** list, one résumé bullet per episode
- **Player:**
  - plays a title or the trailer as captioned slides, 3.4 s each, over dimmed key art
  - progress bar, pause/play, next and back controls
  - an end card with Replay, Get in touch and Back
  - case-study sequence: title card → each résumé bullet → metric card
  - trailer: the seven `trailer` slides

## 4. Units and files

```
index.html               shell: meta/SEO, skip link, nav, billboard + rows mounts, FAQ, CTA, footer, <noscript> summary
assets/css/site.css      tokens, buttons, key art, nav, billboard, rows, peek, modal, player, FAQ, CTA, footer, responsive, reduced motion
assets/js/data.js        window.PORTFOLIO — all content and image slots (only file edited for content changes)
assets/js/ui.js          window.NF — key-art renderer, icons, image-slot resolver, title modal, player, focus trap
assets/js/app.js         page logic — intro, gate, billboard, rows, hover preview, FAQ, CTA, nav state
assets/img/              portrait, avatar, AI images (optimized), og-image.jpg
README.md                how to edit content, swap images, preview locally
tests/                   Node built-in test runner (data, logic, static HTML) + in-page browser checks
tools/                   optimize-images.sh (sips) and og-image.html template
_config.yml              keeps docs/, tests/, tools/ and samples/ off the live site
```

| Unit | Depends on | Interface |
|---|---|---|
| `data.js` | nothing | `window.PORTFOLIO` (schema in §5) |
| `ui.js` | `data.js` | `NF.art(title, opts)`, `NF.svg(title, opts)`, `NF.img(slot)`, `NF.openTitle(key)`, `NF.play(keyOrConfig)`, `NF.icons`, `NF.mailto(subject)`, `NF.get(key)`, `NF.meta(title)` |
| `app.js` | `data.js`, `ui.js` | none (top-level code wrapped in an immediately-invoked function) |

`ui.js` and `app.js` are promoted from `samples/shared/nf.js` and the page scripts of samples A and C. They keep the bug fixes already made during the sample review: the Top-10 legibility overlay, the flag moved to the top-right corner, the motif kept clear of titles, the wider player captions, the duplicate metric removed, CSS specificity fixes, and the nav state set on load.

## 5. Content model (`data.js`)

- `person` — name, headline, role, company, location, email, linkedin, linkedinLabel, short, summary.
- `images` — slot → path, or `null` when not provided:
  - `portrait` (always set)
  - `heroWide`, `heroMobile`, `poster`
  - `work: { presenting, whiteboard, laptop }`
- `series` — the "show" about her: title, type, year, org, metric, metricLabel, logline, points[], cast[], genres[], art.
- `titles` — 14 case studies keyed by slug. Each has:
  - title, type, optional year, org, optional flag
  - genres[], metric, metricLabel, logline, points[], cast[]
  - `art: { motif, c1, c2, font, photo? }`
- `top10[]` — `{ value, label, ref }`. Every `ref` must be a key in `titles`.
- `skills[]` — `{ name, note, group }`.
- `profiles[]` — `{ id, name, color, icon, hero, rows[] }`, where `hero` is `'series'` or a title key.
- `rows` — `{ id: { title, items?[] } }`. Items are title keys or `'series'`.
- `trailer[]` — `{ k, t, big? }`.
- `faq[]` — `{ q, a }`.

**Content rules:**
- Every number must trace to the résumé.
- Loglines are written in a neutral third-person voice with no pronouns. The summary and FAQ are in the first person.
- No AJIO internal data, screenshots or logos.

## 6. Images

| Slot | Used for | Source | Delivered as | Fallback |
|---|---|---|---|---|
| `portrait` | billboard fallback, series cards, CTA avatar, trailer background | new headshot | JPEG, longest side ≤ 1400 px, ≤ 300 KB | — |
| `heroWide` | desktop billboard (Recruiter), trailer background | ChatGPT prompt 1 | JPEG, width ≤ 2400 px, ≤ 350 KB | `portrait`, masked from the right |
| `heroMobile` | billboard under 700 px | prompt 2 | JPEG, ≤ 1200 px wide, ≤ 200 KB | `portrait` |
| `poster` | series card art, series modal header | prompt 3 | JPEG, ≤ 250 KB | `portrait` |
| `work.laptop` | "Every 3 Hours" key art | prompt 6 | JPEG, ≤ 1600 px wide, ≤ 200 KB | generated motif art |
| `work.presenting` | "Mind the Gap" key art | prompt 4 | same | generated motif art |
| `work.whiteboard` | "8 Steps to One Click" key art | prompt 5 | same | generated motif art |
| `og-image.jpg` | link previews (1200×630) | rendered from an HTML template with the hero/portrait plus name and headline, captured via Chrome | JPEG, ≤ 200 KB | — |

- **Photo-backed key art:** the photo uses `object-fit: cover`, with a 55% tint in the title's colours, the bottom gradient and the title on top. The motif is omitted.
- **Transparent cut-out:** if one is supplied as `heroWide`, it gets the class `is-cutout` and sits on the dark gradient without a mask.
- **Optimization:** `sips` (resize + JPEG quality ≈ 80). Raw originals stay outside the repo.
- **Loading:** the billboard image gets `fetchpriority="high"`; every other image is `loading="lazy"`.
- **Alt text:** the portrait has meaningful alt text; key-art backgrounds are decorative (`alt=""`).

## 7. Accessibility

- **Interactive elements** are native `<button>` or `<a>` elements, in DOM order, with a visible `:focus-visible` ring. Icon-only buttons get `aria-label`s.
- **Modal and player** use `role="dialog"` and `aria-modal="true"`. Focus moves inside on open, **Tab is trapped** inside, Esc closes, and focus returns to the opener.
- **Player keys:** Space toggles pause, ← and → move between slides, and the caption region is `aria-live="polite"`.
- **FAQ:** buttons carry `aria-expanded` and `aria-controls`.
- **Reduced motion** (`prefers-reduced-motion`): no intro, no zoom/pan effects, no animated bars; transitions become instant.
- **Contrast:** WCAG AA on `#141414`. Raise the muted grey token from `#737373` to `#8c8c8c` or lighter.
- `lang="en"` and the skip link are present.

## 8. Responsive

- Breakpoints: 1400, 1100, 820 (nav links hide), 800, 700 (billboard stacks), 640, 520.
- No horizontal page scroll at 360 px. Rows scroll inside their own tracks.
- Hover preview and row arrows only on `(hover: hover) and (pointer: fine)`.

## 9. Performance, SEO and meta

- One CSS file and three deferred JS files.
- Google Fonts (Bebas Neue, DM Serif Display, Inter, JetBrains Mono) with `preconnect` and `display=swap`; system fallbacks are declared.
- `<title>Anushreya — Business Analyst · Returns & Fraud Analytics · Process Automation</title>`, a meta description, canonical `https://anushreya-ophub.github.io/`, Open Graph and Twitter card tags (with `og-image.jpg`), JSON-LD `Person` (name, jobTitle, worksFor AJIO, alumniOf, sameAs LinkedIn, email).
- `<noscript>` block: name, headline, summary, experience in one line each, email, LinkedIn.
- SVG favicon (red "A").
- Lighthouse targets: Performance ≥ 85 (mobile), and ≥ 95 for Accessibility, Best Practices and SEO.

## 10. Failure handling

| Failure | Behaviour |
|---|---|
| JavaScript off | `<noscript>` summary and contact are shown; the nav still renders from static HTML. |
| `sessionStorage` blocked | Wrapped in try/catch; intro and gate simply show every load. |
| Image slot missing or fails to load | `NF.img()` returns the fallback; an `onerror` handler swaps to `portrait` or to generated art. |
| Fonts fail | System fallbacks keep the layout readable. |
| Unknown `?p=` | Recruiter. |
| No mail app | The email is visible as text next to the CTA. |

## 11. Verification (no dependencies: Node's built-in test runner plus in-page checks in Chrome)

1. **Data integrity:** Node tests confirm that every `top10.ref`, `rows.*.items`, `profiles[].hero` and `profiles[].rows` entry resolves, that every title has the required fields, and that every number in the copy is a résumé number.
2. **Console:** no errors or warnings on load, or while opening every modal and player.
3. **Layouts:** screenshots at 1440×900 and 390×844 of the intro, gate, each profile's billboard, every row, the modal, the player, the FAQ, the CTA and the footer. No horizontal overflow at 360 px.
4. **Keyboard:** reach every card, open with Enter, Tab stays trapped inside the modal, Esc closes, and focus returns. The player keys work.
5. **Reduced motion:** emulated; intro skipped and nothing animates.
6. **Lighthouse:** mobile and desktop meet the §9 targets.
7. **Links:** mailto subject and body are encoded correctly; the LinkedIn URL opens in a new tab with `rel="noopener"`.
8. **Content:** every number on the page matches the résumé (manual pass against `data.js`).

## 12. Migration and cleanup

- `index.html` is replaced. `styles.css`, `script.js`, `assets/anushreya.jpg` and `assets/portrait-placeholder.svg` are removed (still recoverable from git history).
- `assets/anushreya-portrait.jpg` moves to `assets/img/`.
- `samples/` stays on the branch for comparison until the final site is approved, then is deleted before merging. It must not go live.
- `_config.yml` excludes `docs/`, `tests/`, `tools/`, `samples/` and `README.md` from the Pages build.
- README is rewritten: structure, how to edit `data.js`, how to add images to slots, and local preview (`python3 -m http.server`).
- Release: PR from `netflix-portfolio` to `main`. Merging deploys to GitHub Pages. Nothing is pushed or merged without explicit approval.

## 13. Out of scope

- backend or form handling, analytics, a CMS
- a downloadable résumé PDF (it would publish the phone number)
- a blog, extra pages or routing, a 404 page, a light theme, translations
- sample C's feature bands and "More Reasons to Hire"; sample B's season list (their content is already covered by rows and modals)
- AI images of real events (convocation, certificates, sports, SMART)
