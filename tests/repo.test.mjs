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
