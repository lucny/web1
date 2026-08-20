import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// `actions/configure-pages` returns a base path without a trailing slash
// (for example `/web1`). Astro exposes that value to templates through
// `import.meta.env.BASE_URL`, where the slash is required when composing URLs.
const configuredBase = process.env.ASTRO_BASE;
const base = configuredBase && configuredBase !== '/'
  ? `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`
  : undefined;
const site = process.env.ASTRO_SITE || 'https://www.sspu-opava.cz';

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark' }
  }
});
