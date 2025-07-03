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
          assetFileNames: (assetInfo) => {
            // Better asset naming for caching  
            const fileName = assetInfo.names?.[0] || "asset";
            const info = fileName.split(".");
            const ext = info[info.length - 1];
            if (/\.(css)$/.test(fileName)) {
              return `assets/css/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
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
    esbuild: {
      drop: ['console', 'debugger'],
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
    edgeMiddleware: false, // Better performance for simple middleware
    functionPerRoute: false, // Use single function for better cold start
  }),
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
