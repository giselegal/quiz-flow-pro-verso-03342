#!/usr/bin/env node
/**
 * 🧪 TESTE DE COBERTURA DO SISTEMA HÍBRIDO
 * 
 * Valida que:
 * 1. Todo bloco SIMPLE tem template HTML
 * 2. Todo bloco COMPLEX tem componente React
 * 3. Todo tipo no JSON está mapeado
 * 4. Nenhum tipo duplicado
 */

const fs = require('fs');
const path = require('path');

console.log('\n🧪 TESTE DE COBERTURA DO SISTEMA HÍBRIDO\n');
console.log('='.repeat(70));

let hasErrors = false;

// ========================================
// 1. CARREGAR BLOCK COMPLEXITY MAP
// ========================================

const blockMapPath = path.join(__dirname, '../src/config/block-complexity-map.ts');
const blockMapContent = fs.readFileSync(blockMapPath, 'utf8');

// Extrair blocos SIMPLE
const simpleBlocksRegex = /'([^']+)':\s*{\s*complexity:\s*'SIMPLE',?\s*.*?template:\s*'([^']+)'/gs;
const simpleBlocks = [];
let match;

while ((match = simpleBlocksRegex.exec(blockMapContent)) !== null) {
  simpleBlocks.push({
    type: match[1],
    template: match[2],
  });
}

// Extrair blocos COMPLEX
const complexBlocksRegex = /'([^']+)':\s*{\s*complexity:\s*'COMPLEX'/g;
const complexBlocks = [];

while ((match = complexBlocksRegex.exec(blockMapContent)) !== null) {
  complexBlocks.push(match[1]);
}

console.log(`\n📊 BLOCOS MAPEADOS:`);
console.log(`   SIMPLE:  ${simpleBlocks.length}`);
console.log(`   COMPLEX: ${complexBlocks.length}`);
console.log(`   TOTAL:   ${simpleBlocks.length + complexBlocks.length}`);

// ========================================
// 2. VERIFICAR TEMPLATES HTML (SIMPLE)
// ========================================

console.log(`\n\n🔍 VALIDAÇÃO: Templates HTML para blocos SIMPLE\n`);

const templatesDir = path.join(__dirname, '../public/templates/html');
const availableTemplates = fs.existsSync(templatesDir)
  ? fs.readdirSync(templatesDir).filter(f => f.endsWith('.html'))
  : [];

let simpleMissing = 0;

simpleBlocks.forEach(block => {
  const templateExists = availableTemplates.includes(block.template);
  
  if (templateExists) {
    console.log(`   ✅ ${block.type.padEnd(30)} → ${block.template}`);
  } else {
    console.log(`   ❌ ${block.type.padEnd(30)} → ${block.template} (FALTANDO)`);
    hasErrors = true;
    simpleMissing++;
  }
});

if (simpleMissing > 0) {
  console.log(`\n   ⚠️  ${simpleMissing} template(s) HTML faltando!`);
}

// ========================================
// 3. VERIFICAR COMPONENTES (COMPLEX)
// ========================================

console.log(`\n\n🔍 VALIDAÇÃO: Componentes React para blocos COMPLEX\n`);

const registryPath = path.join(__dirname, '../src/registry/UnifiedBlockRegistry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');

let complexMissing = 0;

complexBlocks.forEach(type => {
  // Verificar se está no lazyRegistry
  const inLazyRegistry = registryContent.includes(`'${type}': () => import(`);
  const inPromiseAll = registryContent.includes(`'${type}': () => Promise.all(`);
  
  if (inLazyRegistry || inPromiseAll) {
    console.log(`   ✅ ${type.padEnd(30)} → Registrado`);
  } else {
    console.log(`   ❌ ${type.padEnd(30)} → NÃO REGISTRADO`);
    hasErrors = true;
    complexMissing++;
  }
});

if (complexMissing > 0) {
  console.log(`\n   ⚠️  ${complexMissing} componente(s) não registrado(s)!`);
}

// ========================================
// 4. VERIFICAR JSON (Quiz21)
// ========================================

console.log(`\n\n🔍 VALIDAÇÃO: Tipos usados no quiz21-complete.json\n`);

const quiz21Path = path.join(__dirname, '../public/templates/quiz21-complete.json');
const quiz21 = JSON.parse(fs.readFileSync(quiz21Path, 'utf8'));

const usedTypes = new Set();
const unmappedTypes = [];

Object.entries(quiz21.steps).forEach(([stepKey, stepData]) => {
  const blocks = stepData.template?.blocks || [];
  
  blocks.forEach(block => {
    usedTypes.add(block.type);
    
    // Verificar se está mapeado
    const isSimple = simpleBlocks.some(b => b.type === block.type);
    const isComplex = complexBlocks.includes(block.type);
    
    if (!isSimple && !isComplex) {
      unmappedTypes.push({
        step: stepKey,
        type: block.type,
        blockId: block.id,
      });
    }
  });
});

console.log(`   Total de tipos únicos usados: ${usedTypes.size}`);

if (unmappedTypes.length > 0) {
  console.log(`\n   ❌ Tipos NÃO MAPEADOS encontrados:\n`);
  
  const grouped = {};
  unmappedTypes.forEach(item => {
    if (!grouped[item.type]) {
      grouped[item.type] = [];
    }
    grouped[item.type].push(`${item.step} (${item.blockId})`);
  });
  
  Object.entries(grouped).forEach(([type, occurrences]) => {
    console.log(`      • ${type}`);
    console.log(`        Usado em: ${occurrences.slice(0, 3).join(', ')}${occurrences.length > 3 ? '...' : ''}`);
  });
  
  hasErrors = true;
} else {
  console.log(`   ✅ Todos os tipos usados estão mapeados!`);
}

// ========================================
// 5. VERIFICAR DUPLICATAS
// ========================================

console.log(`\n\n🔍 VALIDAÇÃO: Tipos duplicados no mapeamento\n`);

const allTypes = [...simpleBlocks.map(b => b.type), ...complexBlocks];
const typeCounts = {};

allTypes.forEach(type => {
  typeCounts[type] = (typeCounts[type] || 0) + 1;
});

const duplicates = Object.entries(typeCounts).filter(([_, count]) => count > 1);

if (duplicates.length > 0) {
  console.log(`   ❌ Tipos DUPLICADOS encontrados:\n`);
  duplicates.forEach(([type, count]) => {
    console.log(`      • ${type} (${count}x)`);
  });
  hasErrors = true;
} else {
  console.log(`   ✅ Nenhum tipo duplicado!`);
}

// ========================================
// 6. RESUMO FINAL
// ========================================

console.log('\n' + '='.repeat(70));
console.log('\n📊 RESUMO FINAL:\n');

const simpleWithTemplate = simpleBlocks.length - simpleMissing;
const complexRegistered = complexBlocks.length - complexMissing;

console.log(`   Blocos SIMPLE:                ${simpleBlocks.length}`);
console.log(`   ├─ Com template HTML:         ${simpleWithTemplate} (${Math.round(simpleWithTemplate/simpleBlocks.length*100)}%)`);
console.log(`   └─ Sem template HTML:         ${simpleMissing}`);
console.log();
console.log(`   Blocos COMPLEX:               ${complexBlocks.length}`);
console.log(`   ├─ Registrados:               ${complexRegistered} (${Math.round(complexRegistered/complexBlocks.length*100)}%)`);
console.log(`   └─ Não registrados:           ${complexMissing}`);
console.log();
console.log(`   Tipos usados no Quiz21:       ${usedTypes.size}`);
console.log(`   Tipos não mapeados:           ${unmappedTypes.length}`);
console.log(`   Tipos duplicados:             ${duplicates.length}`);

if (hasErrors) {
  console.log(`\n   Status: ❌ FALHOU - Corrija os erros acima\n`);
  process.exit(1);
} else {
  console.log(`\n   Status: ✅ PASSOU - Sistema híbrido está completo!\n`);
  process.exit(0);
}
