import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath, URL } from 'node:url'

const resolvePath = (dir: string) => fileURLToPath(new URL(dir, import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: '.security/bundle-stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      '@': resolvePath('./src'),
      '@components': resolvePath('./src/components'),
      '@services': resolvePath('./src/services'),
      '@hooks': resolvePath('./src/hooks'),
      '@utils': resolvePath('./src/utils'),
      '@lib': resolvePath('./src/lib'),
      '@types': resolvePath('./src/types'),
      '@config': resolvePath('./src/config'),
      '@templates': resolvePath('./src/templates'),
    },
  },
  build: {
    // ✅ OTIMIZAÇÃO: Code splitting agressivo
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendors principais
          'vendor-react': ['react', 'react-dom', 'react/jsx-runtime'],
          'vendor-router': ['wouter', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          // Features por módulo
          'editor-core': [
            './src/components/editor/EditorContext.tsx',
            './src/hooks/useEditor.ts',
            './src/contexts/editor/EditorStateProvider.tsx',
          ],
          'quiz-runtime': [
            './src/components/quiz/QuizContext.tsx',
            './src/contexts/quiz/QuizStateProvider.tsx',
          ],
        },
      },
    },
    // ✅ Otimizações gerais
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 500, // Warning para chunks > 500KB
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // ✅ OTIMIZAÇÃO: Pre-bundling de deps comuns
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'wouter',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
  },
})
