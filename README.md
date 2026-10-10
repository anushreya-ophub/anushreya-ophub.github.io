# anushreya-ophub.github.io

Netflix-style portfolio for Anushreya, Business Analyst — live at https://anushreya-ophub.github.io/

## Edit the content

Every word, number and link lives in `assets/js/data.js` (`window.PORTFOLIO`): case studies (`titles`), the Top 10 numbers, skills, profiles, the trailer and the FAQ. Numbers must come from the résumé — `node --test` fails if a number isn't in `tests/helpers/resume.mjs`.

## Add or swap photos

1. Put originals in `~/Downloads/portfolio-images/` named `hero-wide`, `hero-mobile`, `poster`, `work-presenting`, `work-whiteboard` or `work-laptop` (png/jpg/heic). A transparent `cutout.png` also works.
2. Run `tools/optimize-images.sh` — it resizes and compresses into `assets/img/`.
3. Point the matching slot in `assets/js/data.js` → `images` at the new file. Empty slots fall back to the portrait (heroes) or to generated art (work photos). If you change `images.heroWide` or `images.heroMobile`, update the hero preload paths in the head script of `index.html` to match.
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
