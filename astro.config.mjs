// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import optimizeImages from './integrations/optimize-images.mjs';

/**
 * Old-URL redirects are kept in ONE place: public/_redirects.
 * - On GitHub Pages they are generated as redirect pages by Astro (below).
 * - On Cloudflare Pages / Netlify the same file gives real 301 redirects.
 */
const redirects = Object.fromEntries(
  readFileSync('./public/_redirects', 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split(/\s+/))
    .map(([from, to]) => [from.replace(/\/$/, '') || '/', to]),
);

export default defineConfig({
  site: 'https://www.maritime.pt',
  trailingSlash: 'always',
  redirects,
  integrations: [sitemap({ filter: (page) => !page.includes('/members/') }), optimizeImages()],
  build: { format: 'directory' },
});
