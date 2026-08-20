import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const base = process.env.ASTRO_BASE || undefined;
const site = process.env.ASTRO_SITE || 'https://www.sspu-opava.cz';

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark' }
  }
});
