#!/usr/bin/env node
// Verifica arquivos que importam simultaneamente '@/types/editor' e '@/types/block.types'
// para evitar mistura de modelos de Block no mesmo módulo.

import { readFileSync } from 'node:fs';
import { glob } from 'glob';

const files = await glob('src/**/*.{ts,tsx,js,jsx}', { ignore: ['**/__tests__/**', '**/dnd/**'] });
let violations = [];

for (const file of files) {
  const txt = readFileSync(file, 'utf8');
  const importsEditor = /from\s+['"]@\/types\/editor['"]/.test(txt);
  const importsCanonical = /from\s+['"]@\/types\/block\.types['"]/.test(txt);
  // Exceção: arquivo 'src/types/blocks.ts' atua como ponte de reexports controlados
  if (importsEditor && importsCanonical && file.endsWith('src/types/blocks.ts')) continue;
  if (importsEditor && importsCanonical) {
    violations.push(file);
  }
}

if (violations.length) {
  console.error('⚠️  Mistura de tipos de Block detectada nos arquivos:');
  for (const v of violations) console.error(' -', v);
  process.exit(2);
} else {
  console.log('✅ Sem mistura de tipos de Block nos módulos verificados.');
}
