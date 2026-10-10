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
