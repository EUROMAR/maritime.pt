// Shrinks uploaded photos in the built site (dist/) so large phone photos don't slow pages down.
// Originals in public/uploads stay untouched; file names and links don't change.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const MAX = 2000; // longest side in pixels
const QUALITY = 80;
const MIN_BYTES = 300 * 1024; // smaller files are left exactly as uploaded (logos, icons)
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (EXT.has(path.extname(e.name).toLowerCase())) yield p;
  }
}

export default function optimizeImages() {
  return {
    name: 'optimize-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = path.join(fileURLToPath(dir), 'uploads');
        let count = 0, saved = 0;
        for await (const file of walk(root)) {
          try {
            const input = await fs.readFile(file);
            const meta = await sharp(input, { failOn: 'none' }).metadata();
            if (input.length < MIN_BYTES && Math.max(meta.width ?? 0, meta.height ?? 0) <= MAX) continue;
            const img = sharp(input, { failOn: 'none' }).rotate().resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true });
            const ext = path.extname(file).toLowerCase();
            const out = await (ext === '.png' ? img.png({ compressionLevel: 9, palette: true, quality: QUALITY })
              : ext === '.webp' ? img.webp({ quality: QUALITY })
              : img.jpeg({ quality: QUALITY, mozjpeg: true })).toBuffer();
            if (out.length < input.length) {
              await fs.writeFile(file, out);
              count++;
              saved += input.length - out.length;
            }
          } catch (e) {
            logger.warn(`Could not optimise ${path.relative(root, file)}: ${e.message}`);
          }
        }
        logger.info(`Optimised ${count} image(s), saved ${(saved / 1024).toFixed(0)} KB.`);
      },
    },
  };
}
