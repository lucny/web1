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
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
  const eventTags = new Set(['vystava', 'prace-zaku', 'uchazeci', 'maturanti', 'akce', 'soutez', 'prednaska', 'exkurze', 'prumyslovy-design', 'graficky-design', 'informacni-technologie', 'strojirenstvi', 'design-hracek']);
  if (!data.excerpt?.trim()) errors.push(`events/${file}: chybí excerpt.`);
  if (!datePattern.test(data.startDate ?? '')) errors.push(`events/${file}: startDate musí mít formát RRRR-MM-DD.`);
  if (data.startTime && !timePattern.test(data.startTime)) errors.push(`events/${file}: startTime musí mít formát HH:mm.`);
  if (data.endDate && !datePattern.test(data.endDate)) errors.push(`events/${file}: endDate musí mít formát RRRR-MM-DD.`);
  if (data.endTime && !timePattern.test(data.endTime)) errors.push(`events/${file}: endTime musí mít formát HH:mm.`);
  const endDate = data.endDate ?? data.startDate;
  if (data.startDate && endDate < data.startDate) errors.push(`events/${file}: endDate je před startDate.`);
  if (data.startDate === endDate && data.startTime && data.endTime && data.endTime <= data.startTime) errors.push(`events/${file}: endTime musí být později než startTime.`);
  for (const tag of data.tags ?? []) if (!eventTags.has(tag)) errors.push(`events/${file}: neznámý štítek „${tag}“.`);
  for (const [index, attachment] of (data.attachments ?? []).entries()) {
    if (!attachment.file) errors.push(`events/${file}: attachments[${index}] nemá soubor.`);
    if (!attachment.label?.trim()) errors.push(`events/${file}: attachments[${index}] nemá viditelný název.`);
  }
  requireReferences('events', file, 'programs', data.programs, ids('programs'));
  if (data.article) requireReferences('events', file, 'article', [data.article], ids('articles'));
  if (data.gallery) requireReferences('events', file, 'gallery', [data.gallery], ids('galleries'));
}
for (const { file, data } of records.people) {
  const studyFields = data.studyFields?.length ? data.studyFields : data.programs;
  requireReferences('people', file, 'studyFields', studyFields, ids('programs'));
}
const validateBlocks = (collection, file, data) => {
  // `blocks` is accepted only as a migration alias for older page files.
  for (const [index, block] of (data.contentBlocks ?? data.blocks ?? []).entries()) {
    const path = `contentBlocks[${index}]`;
    if (block.type === 'gallery') requireReferences(collection, file, `${path}.gallery`, [block.gallery], ids('galleries'));
    if (block.type === 'documents') requireReferences(collection, file, `${path}.documents`, block.documents, ids('documents'));
    if (block.type === 'articles') requireReferences(collection, file, `${path}.articles`, block.articles, ids('articles'));
    if (block.type === 'people') requireReferences(collection, file, `${path}.people`, block.people, ids('people'));
  }
};

for (const { file, data } of records.pages) validateBlocks('pages', file, data);
for (const { file, data } of records.articles) validateBlocks('articles', file, data);
for (const { file, data } of records.programs) validateBlocks('programs', file, data);
for (const { file, data } of records.events) validateBlocks('events', file, data);

if (errors.length) { console.error('Kontrola obsahu selhala:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log('Kontrola obsahu a vztahů proběhla úspěšně.');
