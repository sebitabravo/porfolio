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
      cssCodeSplit: true, // Cambiado para mejor performance
      rollupOptions: {
        output: {
          // Optimize chunk splitting for better caching
          manualChunks: {
            vendor: ["astro"],
          },
          assetFileNames: (assetInfo) => {
            // Better asset naming for caching
            const name = assetInfo.name || "asset";
            const info = name.split(".");
            const ext = info[info.length - 1];
            if (/\.(css)$/.test(name)) {
              return `assets/css/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          },
        },
      },
    },
  },
  output: "server",
  compressHTML: true,
  build: {
    inlineStylesheets: "always", // Inline critical CSS más agresivamente
    assets: "_astro",
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true, // Habilitado con CSP mejorada
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
