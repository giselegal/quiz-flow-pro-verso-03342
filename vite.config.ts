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
})
