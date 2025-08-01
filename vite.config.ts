
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: false,
    allowedHosts: true,
    hmr: {
      port: 8080,
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['lovable-tagger']
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 500, // Reduzir limite para forçar chunking melhor
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 📦 CHUNKING SUPER OTIMIZADO
          
          // React Core (separar react e react-dom)
          if (id.includes('react-dom')) {
            return 'react-dom';
          }
          if (id.includes('react/') && !id.includes('react-dom')) {
            return 'react-core';
          }
          
          // UI Libraries (dividir em sub-chunks)
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          if (id.includes('@radix-ui')) {
            return 'radix-ui';
          }
          if (id.includes('framer-motion')) {
            return 'animations';
          }
          
          // Editor - dividir em chunks menores
          if (id.includes('SchemaDrivenEditorResponsive')) {
            return 'editor-main';
          }
          if (id.includes('UniversalBlockRenderer')) {
            return 'block-renderer';
          }
          
          // Blocks - dividir por categoria
          if (id.includes('blocks/') && (id.includes('inline') || id.includes('Inline'))) {
            return 'blocks-inline';
          }
          if (id.includes('blocks/') && (id.includes('quiz') || id.includes('Quiz'))) {
            return 'blocks-quiz';
          }
          if (id.includes('blocks/') && !id.includes('UniversalBlockRenderer')) {
            return 'blocks-basic';
          }
          
          // Editor Hooks
          if (id.includes('hooks') && id.includes('editor')) {
            return 'editor-hooks';
          }
          
          // Step Templates
          if (id.includes('stepTemplateService') || id.includes('steps/')) {
            return 'step-templates';
          }
          
          // Services - dividir
          if (id.includes('services/') && id.includes('supabase')) {
            return 'services-db';
          }
          if (id.includes('services/')) {
            return 'services-core';
          }
          
          // Types
          if (id.includes('types/')) {
            return 'types';
          }
          
          // Utils
          if (id.includes('utils/')) {
            return 'utils';
          }
          
          // Panels & Components - dividir
          if (id.includes('panels/')) {
            return 'editor-panels';
          }
          if (id.includes('components/editor') && !id.includes('blocks')) {
            return 'editor-ui';
          }
          
          // Third-party libraries
          if (id.includes('node_modules')) {
            // Heavy libraries
            if (id.includes('supabase') || id.includes('postgres')) {
              return 'database';
            }
            if (id.includes('quill') || id.includes('editor')) {
              return 'text-editor';
            }
            if (id.includes('lodash') || id.includes('date-fns')) {
              return 'utilities';
            }
            // Fallback
            return 'vendor';
          }
        }
      }
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}));
