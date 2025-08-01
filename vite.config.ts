import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react'
    }),
    // Desabilita componentTagger para reduzir overhead
    // mode === 'development' && componentTagger(),
  ].filter(Boolean),
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
    hmr: {
      port: 8080,
      overlay: false,
      // Reduz a frequência de atualizações para melhorar performance
      timeout: 25000,
    },
    // Configuração para lidar com domínios de preview
    allowedHosts: [
      'localhost',
      '.lovable.app',
      '.gitpod.io',
      '.codespaces.github.com'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        // Remove logs verbosos do proxy para reduzir overhead
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            if (mode === 'development') {
              console.error('Proxy error:', err.message);
            }
          });
        },
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./client/src/components"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  optimizeDeps: {
    // Força a inclusão do React para evitar problemas com forwardRef
    include: [
      'react', 
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'use-sync-external-store/shim',
      '@radix-ui/react-slot'
    ],
    // Remove exclusões problemáticas
    exclude: ['lovable-tagger'],
    // Força rebuild apenas quando necessário
    force: false,
  },
  // Configurações para reduzir violações de setTimeout
  esbuild: {
    // Reduz overhead de transformação
    target: 'es2020',
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'direct-eval': 'silent'
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/use-sync-external-store/, /node_modules/],
    },
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Aumenta o limite para reduzir warnings
    // Otimizações para reduzir violações de setTimeout
    target: 'es2020',
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: mode === 'development' ? 'inline' : false,
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
