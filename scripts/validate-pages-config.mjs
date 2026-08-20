import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseDocument } from 'yaml';

const root = process.cwd();
const configPath = resolve(root, '.pages.yml');
const document = parseDocument(await readFile(configPath, 'utf8'));
const errors = document.errors.map((error) => `.pages.yml: ${error.message}`);
const config = document.toJS();

if (!config || typeof config !== 'object') errors.push('.pages.yml: konfigurace není YAML objekt.');

const content = Array.isArray(config?.content) ? config.content : [];
const media = Array.isArray(config?.media) ? config.media : [];
const components = config?.components && typeof config.components === 'object' ? config.components : {};
const names = new Set();
for (const item of content) {
  if (!item?.name || !item?.type) {
    errors.push('Každá položka content musí mít name a type.');
    continue;
  }
  if (names.has(item.name)) errors.push(`Duplicitní content.name: ${item.name}.`);
  names.add(item.name);
  if (item.type === 'collection' && !item.path) errors.push(`Kolekce ${item.name} nemá path.`);
  if (item.type === 'collection' && item.path) {
    try { await access(resolve(root, item.path)); } catch { errors.push(`Kolekce ${item.name} odkazuje na neexistující složku ${item.path}.`); }
  }
}

for (const expected of ['web-pages', 'articles', 'programs', 'galleries', 'documents', 'events', 'people', 'categories']) {
  if (!names.has(expected)) errors.push(`Chybí požadovaná Pages CMS kolekce: ${expected}.`);
}

const mediaNames = new Set();
for (const source of media) {
  if (!source?.name || !source?.input || !source?.output) {
    errors.push('Každý media source musí mít name, input a output.');
    continue;
  }
  if (mediaNames.has(source.name)) errors.push(`Duplicitní media.name: ${source.name}.`);
  mediaNames.add(source.name);
  if (!source.output.startsWith('/')) errors.push(`Media source ${source.name} musí zapisovat veřejnou URL začínající /. `);
  try { await access(resolve(root, source.input)); } catch { errors.push(`Media source ${source.name} odkazuje na neexistující složku ${source.input}.`); }
}

const checkField = (field, context) => {
  if (!field || typeof field !== 'object') return;
  if (field.component && !components[field.component]) errors.push(`${context}: neznámá component ${field.component}.`);
  if (field.type === 'reference') {
    const target = field.options?.collection;
    if (!target || !names.has(target)) errors.push(`${context}: reference míří na neznámou kolekci ${target ?? '(bez collection)'}.`);
  }
  if ((field.type === 'image' || field.type === 'file' || field.type === 'rich-text') && field.options?.media && !mediaNames.has(field.options.media)) {
    errors.push(`${context}: neznámý media source ${field.options.media}.`);
  }
  for (const nested of field.fields ?? []) checkField(nested, `${context}.${field.name ?? 'field'}`);
  for (const block of field.blocks ?? []) for (const nested of block.fields ?? []) checkField(nested, `${context}.${block.name ?? 'block'}`);
};

for (const [name, component] of Object.entries(components)) checkField(component, `components.${name}`);
for (const item of content) for (const field of item.fields ?? []) checkField(field, `content.${item.name}`);

if (errors.length) {
  console.error('Kontrola Pages CMS konfigurace selhala:\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log(`Pages CMS konfigurace je strukturálně v pořádku (${content.length} kolekcí, ${media.length} media sources, ${Object.keys(components).length} components).`);
