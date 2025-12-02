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
  // Exceções: arquivos que atuam como ponte de reexports ou integração controlada
  if (importsEditor && importsCanonical && (
    file.endsWith('src/types/blocks.ts') ||
    file.endsWith('src/components/preview/SortablePreviewBlockWrapper.tsx')
  )) continue;
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
