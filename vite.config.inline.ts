import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Configuração INLINE para contornar problemas de infraestrutura Lovable
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
        port: 8080,
        cors: {
            origin: [
                'http://localhost:8080',
                'https://lovable.dev',
                'https://api.lovable.dev',
                'https://lovable-api.com',
                /^https:\/\/.*\.lovable\.app$/,
                /^https:\/\/.*\.lovable\.dev$/,
            ],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        },
        strictPort: false,
        fs: {
            allow: ['templates', 'public', 'src'],
        },
        watch: {
            ignored: ['**/worktrees/**', '**/examples/**', '**/attached_assets/**'],
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Cross-Origin-Embedder-Policy': 'unsafe-none',
            'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        },
    },
    publicDir: 'public',
    assetsInclude: ['**/*.json'],
    build: {
        outDir: 'dist',
        sourcemap: false, // Reduce file count
        chunkSizeWarningLimit: 2000, // Allow larger single bundle
        copyPublicDir: true,
        rollupOptions: {
            output: {
                // FORÇA BUNDLE ÚNICO para contornar problemas Lovable
                manualChunks: undefined,
                inlineDynamicImports: true,

                // Simplifica estrutura de arquivos
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
        commonjsOptions: {
            transformMixedEsModules: true,
            include: [/node_modules/],
        },
        target: 'esnext',
        minify: 'esbuild',
    },
    optimizeDeps: {
        exclude: ['lucide-react'],
        include: ['react', 'react-dom', 'wouter'],
        esbuildOptions: {
            define: {
                global: 'globalThis',
            },
        },
    },
    define: {
        __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.VITEST': JSON.stringify(process.env.VITEST || false),
    },
    esbuild: {
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
});
