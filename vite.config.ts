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
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000, // Aumenta o limite para 2MB para reduzir warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks - bibliotecas externas
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // UI libraries
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Drag and Drop
            if (id.includes('@dnd-kit') || id.includes('@hello-pangea/dnd')) {
              return 'dnd-vendor';
            }
            // Animation libraries
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            // Form libraries
            if (id.includes('@hookform') || id.includes('zod')) {
              return 'form-vendor';
            }
            // Outros vendors
            return 'vendor';
          }
          
          // App chunks - código da aplicação
          // Editor core - funcionalidade principal do editor
          if (id.includes('SchemaDrivenEditor') || 
              id.includes('useSchemaEditor') || 
              id.includes('schemaDrivenFunnelService')) {
            return 'editor-core';
          }
          
          // Quiz data - dados estáticos do quiz
          if (id.includes('realQuizData') || 
              id.includes('blockDefinitions')) {
            return 'quiz-data';
          }
          
          // Visual editor - editor visual específico
          if (id.includes('QuizOfferPageVisualEditor') || 
              id.includes('visual-editor')) {
            return 'visual-editor';
          }
          
          // Pages - páginas principais
          if (id.includes('Page.tsx') || 
              id.includes('/pages/')) {
            return 'pages';
          }
          
          // Components - componentes reutilizáveis
          if (id.includes('/components/') && 
              !id.includes('editor') && 
              !id.includes('visual-editor')) {
            return 'components';
          }
          
          // Utils and services
          if (id.includes('/utils/') || 
              id.includes('/services/') ||
              id.includes('/hooks/')) {
            return 'utils';
          }
        }
      }
    }
  },
}));
