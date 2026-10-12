import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          if (id.includes('/src/integrations/firebase/app.ts')) return 'firebase-core';
          if (id.includes('/src/integrations/firebase/auth.ts') || id.includes('/src/lib/firebaseAuth.ts') || id.includes('firebase/auth')) return 'firebase-auth';
          if (id.includes('/src/integrations/firebase/firestore.ts') || id.includes('/src/lib/firebaseService.ts') || id.includes('firebase/firestore')) return 'firebase-data';
          if (id.includes('recharts')) return 'charts';
          if (id.includes('@react-three') || id.includes('three')) return 'three';
          if (id.includes('react-router-dom')) return 'router';
          if (id.includes('react-dom') || id.includes('react') || id.includes('scheduler')) return 'react';

          return 'vendor';
        },
      },
    },
  },
}));
