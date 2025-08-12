import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    // Middleware para servir templates da pasta /templates
    middlewareMode: false,
    fs: {
      allow: ['..', 'templates', 'public'],
    },
  },
  // Configuração para servir templates como assets estáticos
  publicDir: 'public',
  assetsInclude: ['**/*.json'],
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    // Copiar templates para o build
    copyPublicDir: true,
    rollupOptions: {
      output: {
        manualChunks: id => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }

            // UI libraries
            if (id.includes('lucide-react') || id.includes('radix') || id.includes('@radix-ui')) {
              return 'ui-vendor';
            }

            // Router
            if (id.includes('wouter')) {
              return 'router-vendor';
            }

            // Form libraries
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'forms-vendor';
            }

            // Animation libraries
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }

            // Other vendor packages
            return 'vendor';
          }

          // Application chunks
          if (id.includes('src/pages/')) {
            // Editor pages
            if (id.includes('editor') || id.includes('Editor')) {
              return 'editor-pages';
            }

            // Admin pages
            if (id.includes('admin') || id.includes('Admin')) {
              return 'admin-pages';
            }

            // Quiz pages
            if (id.includes('quiz') || id.includes('Quiz')) {
              return 'quiz-pages';
            }

            // Other pages
            return 'app-pages';
          }

          // Components
          if (id.includes('src/components/')) {
            // Editor components
            if (id.includes('editor') || id.includes('Editor')) {
              return 'editor-components';
            }

            // UI components
            if (id.includes('ui/')) {
              return 'ui-components';
            }

            // Auth components
            if (id.includes('auth') || id.includes('Auth')) {
              return 'auth-components';
            }

            // Quiz components
            if (id.includes('quiz') || id.includes('Quiz')) {
              return 'quiz-components';
            }

            // Other components
            return 'app-components';
          }

          // Context and hooks
          if (id.includes('src/context/') || id.includes('src/hooks/')) {
            return 'app-context';
          }

          // Utils and configs
          if (id.includes('src/utils/') || id.includes('src/config/')) {
            return 'app-utils';
          }
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'wouter'],
  },
  // Configurações de performance adicionais
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
