import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
// Nota: Se o tipo 'test' gerar erro de tipo, garantir que 'vitest' está instalado
// e que 'types' inclui 'vitest' em tsconfig. Caso contrário remover bloco.

// Configuração consolidada e sanitizada (UTF-8, sem duplicações) + suporte a testes
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
    cors: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // Evita reescrever caminhos adicionais: mantém /api/... intacto
        // Opcional: timeout/ping de WS futuramente
      }
    },
    fs: {
      allow: [path.resolve(__dirname), path.resolve(__dirname, '..'), process.cwd()],
      deny: ['**/supabase/functions/**'],
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
    hmr: {
      overlay: false,
      clientPort: 5173,
      port: 5173,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    cors: true,
    strictPort: true,
  },
  publicDir: 'public',
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: { main: path.resolve(__dirname, 'index.html') },
      external: [
        /^supabase\/functions\/.*/,
        /^https:\/\/deno\.land\/.*/,
        /^https:\/\/esm\.sh\/.*/
      ],
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    esbuildOptions: { target: 'es2020' },
  },
  define: { global: 'globalThis' },
  esbuild: { target: 'es2020' },
  // Configuração de testes Vitest
  // Bloco de testes Vitest (comenta se types não presentes)
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup/vitest.setup.ts'],
    clearMocks: true,
    restoreMocks: true,
  },
});
