// Friendly content check, run before every build (npm run build).
// Errors stop the build with a plain-English message; warnings are printed but don't block publishing.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const errors = [];
const warnings = [];

const ENUMS = {
  newsType: ['Press release', 'Media coverage', 'Opinion', 'Interview', 'Statement'],
  language: ['EN', 'PT'],
  series: ['Madeira Maritime Week', 'Portugal Shipping Week', 'Annual Meeting'],
  group: ['Board of Directors', 'General Assembly', 'Fiscal Council', 'Honorary'],
  category: ['Minutes', 'Circular', 'Position paper', 'Presentation', 'Report', 'Other'],
};

const RULES = {
  news: { label: 'News', name: 'title', required: ['title', 'date', 'type'], dates: ['date'], enums: { type: ENUMS.newsType, language: ENUMS.language }, files: ['image', 'documents[].file'], refs: { event: 'events' } },
  events: { label: 'Event', name: 'shortTitle', required: ['title', 'shortTitle', 'series', 'startDate', 'location', 'summary'], dates: ['startDate', 'endDate'], enums: { series: ENUMS.series }, files: ['heroImage', 'gallery[].image', 'presentations[].file', 'documents[].file', 'speakers[].photo', 'partners[].logo'] },
  board: { label: 'Person', name: 'name', required: ['name', 'group', 'role'], dates: [], enums: { group: ENUMS.group }, files: ['photo'] },
  pages: { label: 'Page', name: 'title', required: ['title'], dates: ['updated'], enums: {}, files: [] },
  documents: { label: 'Members document', name: 'title', required: ['title', 'date', 'category', 'file'], dates: ['date'], enums: { category: ENUMS.category }, files: [] },
};

const empty = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const slugOf = (v) => String(v ?? '').split('/').pop().replace(/\.md$/, '');
const rel = (f) => path.relative(root, f);

/** Values at a path like "gallery[].image". */
const valuesAt = (data, p) => {
  const [head, ...rest] = p.split('[].');
  const v = data?.[head];
  if (!rest.length) return [v];
  return Array.isArray(v) ? v.flatMap((item) => valuesAt(item, rest.join('[].'))) : [];
};

const fileExists = (url) => {
  if (empty(url) || /^(https?:|mailto:|tel:)/.test(url) || !url.startsWith('/')) return true;
  return fs.existsSync(path.join(root, 'public', decodeURI(url.split(/[?#]/)[0])));
};

const ids = {};
const entries = {};
for (const [col, rule] of Object.entries(RULES)) {
  const dir = path.join(root, 'src/content', col);
  entries[col] = [];
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    const file = path.join(dir, f);
    const text = fs.readFileSync(file, 'utf8');
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    let data = {};
    try {
      data = m ? YAML.parse(m[1]) ?? {} : {};
    } catch (e) {
      errors.push(`${rule.label} "${f}" (${rel(file)}): the settings block at the top could not be read – ${e.message.split('\n')[0]}`);
      continue;
    }
    entries[col].push({ file, data, id: f.replace(/\.md$/, '') });
  }
  ids[col] = new Set(entries[col].map((e) => e.id));
}

for (const [col, rule] of Object.entries(RULES)) {
  for (const { file, data } of entries[col]) {
    const who = `${rule.label} "${data[rule.name] || path.basename(file)}" (${rel(file)})`;
    for (const k of rule.required) if (empty(data[k])) errors.push(`${who}: "${k}" is empty – please fill it in.`);
    for (const k of rule.dates) if (!empty(data[k]) && Number.isNaN(new Date(data[k]).valueOf())) errors.push(`${who}: "${k}" is not a valid date (${data[k]}).`);
    for (const [k, allowed] of Object.entries(rule.enums)) if (!empty(data[k]) && !allowed.includes(data[k])) errors.push(`${who}: "${k}" must be one of: ${allowed.join(', ')} (it is "${data[k]}").`);
    for (const p of rule.files) for (const v of valuesAt(data, p)) if (!fileExists(v)) warnings.push(`${who}: file not found – ${v}`);
    for (const [k, target] of Object.entries(rule.refs ?? {})) if (!empty(data[k]) && !ids[target].has(slugOf(data[k]))) errors.push(`${who}: "${k}" points to an event that doesn't exist (${data[k]}).`);
  }
}

const readJson = (p) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
  } catch (e) {
    errors.push(`${p} could not be read – ${e.message}`);
    return {};
  }
};
const home = readJson('src/data/home.json');
readJson('src/data/site.json');
readJson('src/data/navigation.json');
readJson('src/data/headers.json');
const order = readJson('src/data/people-order.json');

for (const s of home.sections ?? []) {
  if (!empty(s?.featured) && !ids.events.has(slugOf(s.featured))) errors.push(`Home page → Events section: the featured event no longer exists (${s.featured}). Pick another one or leave it empty.`);
}
for (const p of order.people ?? []) {
  if (!empty(p) && !ids.board.has(slugOf(p))) warnings.push(`People order: "${p}" no longer exists – it is skipped.`);
}

for (const w of warnings) console.warn(`⚠️  ${w}`);
if (errors.length) {
  console.error(`\n❌ The site was NOT published because of ${errors.length} content problem(s):\n`);
  for (const e of errors) console.error(`   • ${e}`);
  console.error('\nFix these in Pages CMS and save again. The previous version of the site stays online meanwhile.\n');
  process.exit(1);
}
console.log(`✓ Content check passed (${Object.values(entries).reduce((n, e) => n + e.length, 0)} entries${warnings.length ? `, ${warnings.length} warning(s)` : ''}).`);
