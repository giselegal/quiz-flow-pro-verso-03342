#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve } from 'path';

const jsonPath = resolve(process.cwd(), 'public/templates/quiz21-complete.json');
const quizData = JSON.parse(readFileSync(jsonPath, 'utf-8'));

console.log('╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║     🧪 ANÁLISE COMPLETA: BLOCOS vs REGISTRY vs RENDERER             ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝');
console.log('');

// 1. Extrair todos os block.type do JSON
const blockTypesInJSON = new Set();
Object.entries(quizData.steps).forEach(([stepId, step]) => {
  if (step.blocks) {
    step.blocks.forEach(block => {
      if (block.type) {
        blockTypesInJSON.add(block.type);
      }
    });
  }
});

console.log(`📄 Block types no JSON: ${blockTypesInJSON.size}`);
const sortedJSONTypes = Array.from(blockTypesInJSON).sort();
sortedJSONTypes.forEach(type => console.log(`   - ${type}`));
console.log('');

// 2. Verificar no UnifiedBlockRegistry.ts
const registryPath = resolve(process.cwd(), 'src/registry/UnifiedBlockRegistry.ts');
const registryContent = readFileSync(registryPath, 'utf-8');

console.log('🔍 VERIFICANDO NO UnifiedBlockRegistry.ts:');
console.log('');

const inRegistry = [];
const notInRegistry = [];

sortedJSONTypes.forEach(type => {
  // Procurar por 'type': () => import ou "type": () => import
  const pattern1 = new RegExp(`['"]${type}['"]\\s*:\\s*\\(\\)\\s*=>\\s*import`, 'i');
  // Também procurar em registry.set('type',
  const pattern2 = new RegExp(`registry\\.set\\(['"]${type}['"]`, 'i');
  // Também procurar em criticalBlocks
  const pattern3 = new RegExp(`['"]${type}['"]\\s*:`, 'i');
  
  if (pattern1.test(registryContent) || pattern2.test(registryContent) || pattern3.test(registryContent)) {
    console.log(`  ✅ ${type.padEnd(30)} → Registrado`);
    inRegistry.push(type);
  } else {
    console.log(`  ❌ ${type.padEnd(30)} → NÃO ENCONTRADO`);
    notInRegistry.push(type);
  }
});

console.log('');

// 3. Verificar no BlockTypeRenderer.tsx
const rendererPath = resolve(process.cwd(), 'src/components/editor/quiz/renderers/BlockTypeRenderer.tsx');
const rendererContent = readFileSync(rendererPath, 'utf-8');

console.log('🎨 VERIFICANDO NO BlockTypeRenderer.tsx:');
console.log('');

const inRenderer = [];
const notInRenderer = [];

sortedJSONTypes.forEach(type => {
  // Procurar por case 'type':
  const pattern = new RegExp(`case\\s+['"]${type}['"]\\s*:`, 'i');
  
  if (pattern.test(rendererContent)) {
    console.log(`  ✅ ${type.padEnd(30)} → Tem case`);
    inRenderer.push(type);
  } else {
    console.log(`  ❌ ${type.padEnd(30)} → SEM CASE`);
    notInRenderer.push(type);
  }
});

console.log('');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log('📊 RESUMO FINAL:');
console.log('');
console.log(`  Block types no JSON:          ${blockTypesInJSON.size}`);
console.log(`  ✅ Registrados (Registry):    ${inRegistry.length}`);
console.log(`  ❌ NÃO registrados:           ${notInRegistry.length}`);
console.log(`  ✅ Com case (Renderer):       ${inRenderer.length}`);
console.log(`  ❌ SEM case:                  ${notInRenderer.length}`);
console.log('');

if (notInRegistry.length > 0) {
  console.log('❌ BLOCOS FALTANDO NO REGISTRY:');
  notInRegistry.forEach(type => console.log(`   - ${type}`));
  console.log('');
}

if (notInRenderer.length > 0) {
  console.log('❌ BLOCOS FALTANDO NO RENDERER:');
  notInRenderer.forEach(type => console.log(`   - ${type}`));
  console.log('');
}

if (notInRegistry.length === 0 && notInRenderer.length === 0) {
  console.log('🎉 PERFEITO! Todos os blocos estão registrados E têm renderer!');
  process.exit(0);
} else {
  console.log('⚠️  Alguns blocos precisam ser adicionados ao Registry/Renderer.');
  process.exit(1);
}
