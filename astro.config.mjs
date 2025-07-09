// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://sebita.dev/",
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // Optimize chunk splitting for better caching
          manualChunks: {
            vendor: ["astro"],
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  },
  output: "server",
  compressHTML: true,
  build: {
    inlineStylesheets: "always",
    assets: "_astro",
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    speedInsights: {
      enabled: true,
    },
    imageService: true,
    imagesConfig: {
      sizes: [320, 640, 768, 1024, 1280, 1920],
      formats: ['webp', 'avif'],
      domains: [],
    },
    isr: {
      expiration: 60 * 60 * 24, // 24 hours
    },
    edgeMiddleware: false,
    functionPerRoute: false,
  }),
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
