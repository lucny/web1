import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const dist = join(process.cwd(), 'dist');
const configuredBase = process.env.ASTRO_BASE && process.env.ASTRO_BASE !== '/' ? `/${process.env.ASTRO_BASE.replace(/^\/+|\/+$/g, '')}/` : '/';
const files = [];
try { await stat(dist); } catch { console.error('Chybí dist/. Nejprve spusťte npm run build.'); process.exit(1); }
async function walk(directory) { for (const name of await readdir(directory)) { const path = join(directory, name); const info = await stat(path); info.isDirectory() ? await walk(path) : name.endsWith('.html') && files.push(path); } }
await walk(dist);
if (!files.length) { console.error('V dist/ nebyly nalezeny žádné HTML stránky.'); process.exit(1); }
const missing = [];
for (const file of files) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/') || href.startsWith('//') || href.includes('#')) continue;
    const pathname = decodeURIComponent(href.split(/[?#]/)[0]);
    if (configuredBase !== '/' && !pathname.startsWith(configuredBase)) {
      missing.push(`${relative(dist, file)} → ${href} (odkaz neobsahuje GitHub Pages base path ${configuredBase})`);
      continue;
    }
    const localPathname = configuredBase === '/' ? pathname : pathname.slice(configuredBase.length - 1);
    if (/\.(css|js|png|jpe?g|webp|avif|svg|ico|xml|json|txt)$/i.test(localPathname)) continue;
    const target = localPathname === '/' ? join(dist, 'index.html') : join(dist, localPathname.replace(/^\//, ''), 'index.html');
    try { await stat(target); } catch { missing.push(`${relative(dist, file)} → ${href}`); }
  }
}
if (missing.length) { console.error('Nefunkční interní odkazy:\n- ' + missing.join('\n- ')); process.exit(1); }
console.log(`Kontrola interních odkazů proběhla úspěšně (${files.length} HTML stránek).`);
