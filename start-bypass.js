#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting project in bypass mode...');
console.log('🔧 Bypassing TypeScript configuration issues...');

// Start Vite with bypass configuration
const viteProcess = spawn('npx', ['vite', '--config', 'vite.config.bypass.js', '--port', '8080'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

viteProcess.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  console.log(`🛑 Server closed with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  viteProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down...');
  viteProcess.kill();
  process.exit(0);
});