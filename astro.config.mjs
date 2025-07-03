// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://sebita.dev/',
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false, // Optimize CSS loading
      rollupOptions: {
        output: {
          // Optimize chunk splitting for better caching
          manualChunks: {
            vendor: ['astro'],
          }
        }
      }
    }
  },
  output: 'server',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto', // Inline critical CSS
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    imageService: true,
    imagesConfig: {
      sizes: [320, 640, 1280],
      domains: [],
    },
    isr: {
      // Enable ISR for better performance
      expiration: 60 * 60 * 24, // 24 hours
    },
  }),
});
