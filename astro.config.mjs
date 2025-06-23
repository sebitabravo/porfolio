// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://sebita.dev/',
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  compressHTML: true,
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    imageService: true,
    imagesConfig: {
      sizes: [320, 640, 1280],
      domains: [],
    },
  }),
});
