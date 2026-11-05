/**
 * One-off migration helper: downloads every file still hosted on the old Jimdo site
 * (PDFs, presentations, photos) into /public/uploads and rewrites the links in the content.
 *
 * Run ONCE on your computer, before cancelling Jimdo:
 *    npm run assets:download
 * Then review the changes (git diff) and commit.
 */
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOTS = ['src/content', 'src/data'];
const PATTERN = /https:\/\/(?:www\.portugal-shipowners\.com\/app\/download\/[^\s"')]+|image\.jimcdn\.com\/[^\s"')]+)/g;

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(md|json|ya?ml)$/.test(e.name)) yield p;
  }
}

const exists = (p) => stat(p).then(() => true, () => false);
const map = new Map();

function localName(url) {
  const clean = url.split('?')[0];
  if (clean.includes('/app/download/')) {
    const name = decodeURIComponent(clean.split('/').pop()).replace(/\+/g, '-').replace(/[^\w.\-]+/g, '-');
    return `/uploads/documents/${name}`;
  }
  // image.jimcdn.com/.../image/<id>/version/<v>/image.jpg  ->  /uploads/images/<id>.jpg
  const id = clean.match(/image\/(i[0-9a-f]+)\//)?.[1] ?? Math.random().toString(36).slice(2);
  return `/uploads/images/${id}${extname(clean) || '.jpg'}`;
}

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const text = await readFile(file, 'utf8');
    for (const url of text.match(PATTERN) ?? []) if (!map.has(url)) map.set(url, localName(url));
  }
}

console.log(`Found ${map.size} remote files`);
await mkdir('public/uploads/documents', { recursive: true });
await mkdir('public/uploads/images', { recursive: true });

const failed = [];
for (const [url, local] of map) {
  const dest = join('public', local);
  if (await exists(dest)) continue;
  // ask for a larger image than the 189px thumbnail
  const src = url.replace(/dimension=\d+x\d+/, 'dimension=600x1024');
  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error(res.status);
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    console.log('✓', local);
  } catch (e) {
    failed.push(url);
    map.delete(url);
    console.warn('✗', url, e.message);
  }
}

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    let text = await readFile(file, 'utf8');
    let changed = false;
    for (const [url, local] of map) if (text.includes(url)) { text = text.split(url).join(local); changed = true; }
    if (changed) await writeFile(file, text);
  }
}
console.log(`Done. ${map.size} downloaded/rewritten, ${failed.length} failed.`);
if (failed.length) console.log(failed.join('\n'));
