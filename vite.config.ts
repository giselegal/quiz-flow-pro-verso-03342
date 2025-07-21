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
    chunkSizeWarningLimit: 1000, // Aumenta o limite para 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar bibliotecas grandes em chunks específicos
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-slot', '@radix-ui/react-toast'],
          'editor-core': [
            './src/components/editor/SchemaDrivenEditorResponsive.tsx',
            './src/hooks/useSchemaEditorFixed.ts',
            './src/services/schemaDrivenFunnelService.ts'
          ],
          'dnd-vendor': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'quiz-data': [
            './src/components/visual-editor/realQuizData.ts',
            './src/config/blockDefinitions.ts'
          ]
        }
      }
    }
  },
}));
