// Keeps the brand name "Maritime Portugal" in English when a visitor's browser
// auto-translates the page (Chrome, Edge, Google Translate): every occurrence in the
// visible text of the built pages is wrapped in <span translate="no" class="notranslate">.
// Text inside <title>, <script>, <style> and attributes is left untouched.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BRANDS = ['Maritime Portugal', 'MARITIME PORTUGAL'];
const re = new RegExp(`(${BRANDS.map((b) => b.replace(/ /g, '\\s+')).join('|')})`, 'g');
// Blocks whose text must not be changed.
const SKIP = /(<(title|script|style|textarea|svg)\b[\s\S]*?<\/\2>)/i;

async function* html(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* html(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

export const protectBrand = (src) =>
  src.split(SKIP).map((chunk, i) => {
    // split() with two groups yields [text, block, tagName, text, block, tagName, …]
    if (i % 3 !== 0) return i % 3 === 1 ? chunk : '';
    return chunk.split(/(<[^>]*>)/).map((part) => (part.startsWith('<') ? part : part.replace(re, '<span translate="no" class="notranslate">$1</span>'))).join('');
  }).join('');

export default function brandNoTranslate() {
  return {
    name: 'brand-notranslate',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        let n = 0;
        for await (const file of html(fileURLToPath(dir))) {
          const src = await fs.readFile(file, 'utf8');
          const out = protectBrand(src);
          if (out !== src) { await fs.writeFile(file, out); n++; }
        }
        logger.info(`Brand name protected from auto-translation in ${n} page(s).`);
      },
    },
  };
}
