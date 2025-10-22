#!/usr/bin/env node
// Fail fast if any production file imports expandedBlockSchemas directly.
// Allowed locations: tests (__tests__, tests), scripts/, and the canonical adapter src/config/propertySchemas.ts

import fs from 'fs';
import path from 'path';

const root = '/workspaces/quiz-flow-pro-verso-03342';
const srcDir = path.join(root, 'src');

/** @param {string} p */
function isAllowedPath(p) {
  const rel = path.relative(root, p).replace(/\\/g, '/');
  if (rel.startsWith('scripts/')) return true;
  if (rel.includes('/__tests__/')) return true;
  if (rel.startsWith('src/tests/')) return true;
  if (rel === 'src/config/propertySchemas.ts') return true;
  if (rel === 'src/config/expandedBlockSchemas.ts') return true; // self
  return false;
}

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.isFile()) {
      if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) files.push(full);
    }
  }
  return files;
}

const files = walk(srcDir);
const offenders = [];

for (const file of files) {
  if (isAllowedPath(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  // Match any import that references expandedBlockSchemas
    const hasBadImport = /from\s+['"](?:@\/config\/expandedBlockSchemas|\.\.\/.*expandedBlockSchemas|\.\/.*expandedBlockSchemas|src\/config\/expandedBlockSchemas)['"];?/.test(content);
  if (hasBadImport) {
    offenders.push(path.relative(root, file));
  }
}

if (offenders.length > 0) {
  console.error('❌ Importação direta de expandedBlockSchemas detectada em arquivos de produção:');
  for (const f of offenders) console.error(' -', f);
  console.error('Use o ponto único canônico: src/config/propertySchemas.ts ou o sistema modular SchemaAPI (src/config/schemas).');
  process.exit(1);
}

console.log('✅ Nenhuma importação direta de expandedBlockSchemas encontrada fora de testes/scripts.');
