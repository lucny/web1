import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const root = fileURLToPath(new URL('../src/content/', import.meta.url));
const minimums = { articles: 10, programs: 5, galleries: 2, documents: 4, events: 3, people: 5, pages: 3, categories: 10 };
const errors = [];
const records = {};

for (const [collection, minimum] of Object.entries(minimums)) {
  const folder = join(root, collection);
  const files = (await readdir(folder)).filter((file) => file.endsWith('.md'));
  if (files.length < minimum) errors.push(`${collection}: očekáváno alespoň ${minimum} položek, nalezeno ${files.length}.`);
  records[collection] = await Promise.all(files.map(async (file) => {
    const { data } = matter(await readFile(join(folder, file), 'utf8'));
    return { id: basename(file, '.md'), file, data };
  }));
}

for (const [collection, items] of Object.entries(records)) {
  for (const { file, data } of items) {
    if (!data.title && !data.name) errors.push(`${collection}/${file}: chybí title nebo name.`);
    if (data.status !== 'published' && data.status !== 'draft') errors.push(`${collection}/${file}: chybí platný status.`);
    if (collection === 'galleries') {
      if (!Array.isArray(data.photos) || !data.photos.length) errors.push(`${collection}/${file}: galerie nemá fotografie.`);
      data.photos?.forEach((photo, index) => { if (!photo.alt?.trim()) errors.push(`${collection}/${file}: fotografie ${index + 1} nemá ALT text.`); });
    }
  }
}

const ids = (collection) => new Set(records[collection].map((item) => item.id));
const categoryTitles = new Set(records.categories.map((item) => item.data.title));
const peopleNames = new Set(records.people.map((item) => item.data.name));
const contentReference = (value) => typeof value === 'string' ? value.replace(/\.md$/i, '') : value;
const requireReferences = (source, file, field, values, available) => {
  for (const value of values ?? []) if (!available.has(contentReference(value))) errors.push(`${source}/${file}: ${field} odkazuje na neexistující položku „${value}“.`);
};

for (const { file, data } of records.articles) {
  if (!peopleNames.has(data.author)) errors.push(`articles/${file}: author „${data.author}“ není v people.`);
  requireReferences('articles', file, 'categories', data.categories, categoryTitles);
  requireReferences('articles', file, 'programs', data.programs, ids('programs'));
  requireReferences('articles', file, 'related', data.related, ids('articles'));
  if (data.gallery) requireReferences('articles', file, 'gallery', [data.gallery], ids('galleries'));
}
for (const { file, data } of records.galleries) {
  requireReferences('galleries', file, 'categories', data.categories, categoryTitles);
  requireReferences('galleries', file, 'programs', data.programs, ids('programs'));
  if (data.article) requireReferences('galleries', file, 'article', [data.article], ids('articles'));
}
for (const { file, data } of records.documents) {
  if (!categoryTitles.has(data.category)) errors.push(`documents/${file}: category „${data.category}“ není v categories.`);
  requireReferences('documents', file, 'programs', data.programs, ids('programs'));
  requireReferences('documents', file, 'pages', data.pages, ids('pages'));
}
for (const { file, data } of records.events) {
  requireReferences('events', file, 'programs', data.programs, ids('programs'));
  if (data.article) requireReferences('events', file, 'article', [data.article], ids('articles'));
  if (data.gallery) requireReferences('events', file, 'gallery', [data.gallery], ids('galleries'));
}
for (const { file, data } of records.people) requireReferences('people', file, 'programs', data.programs, ids('programs'));
for (const { file, data } of records.pages) {
  for (const [index, block] of (data.blocks ?? []).entries()) {
    if (block.type === 'gallery') requireReferences('pages', file, `blocks[${index}].gallery`, [block.gallery], ids('galleries'));
    if (block.type === 'documents') requireReferences('pages', file, `blocks[${index}].documents`, block.documents, ids('documents'));
    if (block.type === 'articles') requireReferences('pages', file, `blocks[${index}].articles`, block.articles, ids('articles'));
    if (block.type === 'people') requireReferences('pages', file, `blocks[${index}].people`, block.people, ids('people'));
  }
}

if (errors.length) { console.error('Kontrola obsahu selhala:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log('Kontrola obsahu a vztahů proběhla úspěšně.');
