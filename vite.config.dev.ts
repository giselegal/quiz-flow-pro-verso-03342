import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Configuração específica para desenvolvimento - ignora erros TypeScript
export default defineConfig({
  plugins: [
    react()
  ],
  // Desabilitar checagem TypeScript completamente durante desenvolvimento
  esbuild: {
    target: 'es2020',
    loader: 'tsx',
    include: /\.(tsx?|jsx?)$/,
    exclude: [],
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: false,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ignorar erros TypeScript durante build
    rollupOptions: {
      onwarn: (warning, warn) => {
        // Ignorar avisos TypeScript
        if (warning.code === 'TYPESCRIPT_ERROR') return;
        warn(warning);
      },
    },
  },
  define: {
    __DEV__: JSON.stringify(true),
  },
});