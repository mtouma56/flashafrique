import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

const manualChunks = (id: string) => {
  if (!id.includes("node_modules")) {
    return undefined;
  }

  if (id.includes("react")) {
    return "vendor-react";
  }

  if (id.includes("@tanstack")) {
    return "vendor-query";
  }

  if (id.includes("@radix-ui")) {
    return "vendor-radix";
  }

  if (id.includes("supabase")) {
    return "vendor-supabase";
  }

  return "vendor";
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && visualizer({
      filename: "./dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2019",
    sourcemap: mode !== "production",
    cssMinify: "esbuild",
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
}));
