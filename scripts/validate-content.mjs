import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const root = fileURLToPath(new URL('../src/content/', import.meta.url));
const minimums = { articles: 10, programs: 5, galleries: 2, documents: 4, events: 3, people: 4, pages: 3 };
const errors = [];

for (const [collection, minimum] of Object.entries(minimums)) {
  const folder = join(root, collection);
  const files = (await readdir(folder)).filter((file) => file.endsWith('.md'));
  if (files.length < minimum) errors.push(`${collection}: očekáváno alespoň ${minimum} položek, nalezeno ${files.length}.`);
  for (const file of files) {
    const { data } = matter(await readFile(join(folder, file), 'utf8'));
    if (!data.title && !data.name) errors.push(`${collection}/${file}: chybí title nebo name.`);
    if (data.status !== 'published' && data.status !== 'draft') errors.push(`${collection}/${file}: chybí platný status.`);
    if (collection === 'galleries') {
      if (!Array.isArray(data.photos) || !data.photos.length) errors.push(`${collection}/${file}: galerie nemá fotografie.`);
      data.photos?.forEach((photo, index) => { if (!photo.alt?.trim()) errors.push(`${collection}/${file}: fotografie ${index + 1} nemá ALT text.`); });
    }
  }
}

if (errors.length) { console.error('Kontrola obsahu selhala:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log('Kontrola obsahu proběhla úspěšně.');
