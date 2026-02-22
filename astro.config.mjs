import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.triangledehumidifiers.com',
  integrations: [sitemap()],
  build: {
    // Inline small stylesheets to reduce render-blocking requests
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // Increase threshold so small CSS gets inlined instead of a separate request
      assetsInlineLimit: 8192,
    },
  },
});
