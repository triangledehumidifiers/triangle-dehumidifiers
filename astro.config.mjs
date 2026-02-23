import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.triangledehumidifiers.com',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      assetsInlineLimit: 1048576, // 1MB — forces ALL assets including CSS to inline
      cssCodeSplit: false, // CHANGED: was true — splitting was causing external files
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
});
