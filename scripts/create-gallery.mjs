import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const [source, slug, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(' ') || slug?.replaceAll('-', ' ');
if (!source || !slug) { console.error('Použití: npm run gallery:create -- <složka-fotek> <slug> "Název galerie"'); process.exit(1); }
if (!/^[a-z0-9-]+$/.test(slug)) { console.error('Slug může obsahovat jen malá písmena, číslice a pomlčky.'); process.exit(1); }
const files = (await readdir(source)).filter((file) => /\.(jpe?g|png|webp)$/i.test(file));
if (!files.length) { console.error('Ve zdrojové složce nejsou podporované fotografie.'); process.exit(1); }
const target = join(process.cwd(), 'public', 'uploads', 'galleries', slug);
await mkdir(target, { recursive: true });
const photos = [];
for (const [index, file] of files.entries()) {
  const output = `${String(index + 1).padStart(2, '0')}.webp`;
  await sharp(join(source, file)).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(target, output));
  photos.push({ src: `/uploads/galleries/${slug}/${output}`, alt: `Doplnit ALT text: ${basename(file, extname(file))}`, caption: '' });
}
const escape = (value) => String(value).replaceAll('"', '\\"');
const frontmatter = `---\ntitle: "${escape(title)}"\ndescription: "Doplnit stručný popis galerie."\ndate: ${new Date().toISOString().slice(0, 10)}\ncover: ${photos[0].src}\nphotos:\n${photos.map((photo) => `  - src: ${photo.src}\n    alt: "${escape(photo.alt)}"\n    caption: ""`).join('\n')}\nprograms: []\ncategories: []\ntags: []\nstatus: draft\n---\n\nDoplňte popis, ALT texty a vazby před publikováním.\n`;
await writeFile(join(process.cwd(), 'src', 'content', 'galleries', `${slug}.md`), frontmatter, 'utf8');
console.log(`Galerie ${slug} připravena: ${photos.length} optimalizovaných fotografií, metadata v konceptu.`);
