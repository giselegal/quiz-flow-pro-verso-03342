#!/usr/bin/env node

// Iniciar projeto contornando erro TypeScript TS6310
console.log('🚀 Iniciando projeto sem checagem TypeScript...');

const { spawn } = require('child_process');
const path = require('path');

// Definir variáveis de ambiente
process.env.VITE_CJS_IGNORE_WARNING = 'true';
process.env.NODE_ENV = 'development';

// Executar Vite com configuração personalizada
const viteConfigPath = path.resolve(__dirname, 'vite.no-ts.config.ts');

const args = [
  'vite',
  '--config', viteConfigPath,
  '--host', '0.0.0.0',
  '--port', '8080',
  '--force' // Force dependency pre-bundling
];

console.log(`📁 Usando config: ${viteConfigPath}`);
console.log(`🌐 Servidor será iniciado em: http://localhost:8080`);

const viteProcess = spawn('npx', args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    TSC_COMPILE_ON_ERROR: 'true',
    SKIP_TYPE_CHECK: 'true'
  }
});

viteProcess.on('error', (error) => {
  console.error('❌ Erro ao iniciar:', error.message);
  process.exit(1);
});

viteProcess.on('exit', (code) => {
  console.log(`🏁 Processo finalizado com código: ${code}`);
});