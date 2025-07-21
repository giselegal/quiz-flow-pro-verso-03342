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
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 800, // 800kb limit
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('wouter')) {
            return 'react-vendor';
          }
          
          // Animation libraries
          if (id.includes('framer-motion') || id.includes('@dnd-kit')) {
            return 'animation-vendor';
          }
          
          // UI components and icons
          if (id.includes('lucide-react') || id.includes('@radix-ui') || id.includes('clsx') || id.includes('tailwind')) {
            return 'ui-vendor';
          }
          
          // Editor core functionality
          if (id.includes('SchemaDrivenEditor') || 
              id.includes('useSchemaEditor') || 
              id.includes('schemaDrivenFunnelService') ||
              id.includes('blockDefinitions')) {
            return 'editor-core';
          }
          
          // Visual editor components
          if (id.includes('visual-editor') || 
              id.includes('QuizOfferPageVisualEditor') ||
              id.includes('realQuizData')) {
            return 'visual-editor';
          }
          
          // Page components (split by type)
          if (id.includes('pages/') || id.includes('Page.tsx')) {
            if (id.includes('Quiz') || id.includes('Result')) {
              return 'quiz-pages';
            }
            if (id.includes('Dashboard') || id.includes('Analytics') || id.includes('Settings')) {
              return 'admin-pages';  
            }
            return 'pages';
          }
          
          // Large component groups
          if (id.includes('components/') && !id.includes('editor/')) {
            if (id.includes('quiz/') || id.includes('blocks/')) {
              return 'quiz-components';
            }
            if (id.includes('admin/') || id.includes('dashboard/')) {
              return 'admin-components';
            }
            return 'components';
          }
          
          // Utility functions
          if (id.includes('utils/') || id.includes('lib/') || id.includes('helpers/')) {
            return 'utils';
          }
          
          // Node modules that are not covered above
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        }
      }
    }
  },
}));
