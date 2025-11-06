#!/usr/bin/env node
/**
 * 🔍 VERIFICAÇÃO DO SISTEMA HÍBRIDO
 * 
 * Verifica a completude do sistema híbrido SIMPLE (HTML) vs COMPLEX (React)
 * Identifica blocos que não podem renderizar por falta de templates HTML
 */

const fs = require('fs');
const path = require('path');

console.log('\n🎯 VERIFICAÇÃO DO SISTEMA HÍBRIDO DE RENDERIZAÇÃO\n');
console.log('='.repeat(60));

// ========================================
// 1. CARREGAR BLOCK COMPLEXITY MAP
// ========================================

const blockComplexityMapPath = path.join(__dirname, '../src/config/block-complexity-map.ts');
const blockMapContent = fs.readFileSync(blockComplexityMapPath, 'utf8');

// Extrair blocos SIMPLE (regex simples)
const simpleBlocksRegex = /'([^']+)':\s*{\s*complexity:\s*'SIMPLE'/g;
const simpleBlocks = [];
let match;
while ((match = simpleBlocksRegex.exec(blockMapContent)) !== null) {
  simpleBlocks.push(match[1]);
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
// 2. VERIFICAR TEMPLATES HTML
// ========================================

const templatesDir = path.join(__dirname, '../public/templates/html');
const availableTemplates = fs.existsSync(templatesDir)
  ? fs.readdirSync(templatesDir).filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''))
  : [];

console.log(`\n📁 TEMPLATES HTML DISPONÍVEIS: ${availableTemplates.length}`);
availableTemplates.forEach(t => console.log(`   ✅ ${t}.html`));

// ========================================
// 3. VERIFICAR COBERTURA SIMPLE BLOCKS
// ========================================

console.log(`\n🔍 COBERTURA DE TEMPLATES HTML:\n`);

const missingTemplates = [];
const matchedTemplates = [];

simpleBlocks.forEach(blockType => {
  // Verificar se há template correspondente
  // Templates podem ter nomes diferentes do tipo (ex: 'text' → 'text-inline.html')
  const possibleTemplateNames = [
    blockType,
    `${blockType}-inline`,
    blockType.replace('-inline', ''),
  ];
  
  const hasTemplate = possibleTemplateNames.some(name => 
    availableTemplates.includes(name)
  );
  
  if (hasTemplate) {
    matchedTemplates.push(blockType);
    console.log(`   ✅ ${blockType.padEnd(30)} → Template OK`);
  } else {
    missingTemplates.push(blockType);
    console.log(`   ❌ ${blockType.padEnd(30)} → Template FALTANDO`);
  }
});

// ========================================
// 4. CARREGAR QUIZ21-COMPLETE.JSON
// ========================================

const quiz21Path = path.join(__dirname, '../public/templates/quiz21-complete.json');
const quiz21 = JSON.parse(fs.readFileSync(quiz21Path, 'utf8'));

// ========================================
// 5. VERIFICAR USO NO QUIZ21
// ========================================

console.log(`\n🎮 BLOCOS USADOS NO QUIZ21:\n`);

const usedBlocks = new Set();
const problematicBlocks = [];

Object.entries(quiz21.steps).forEach(([stepKey, stepData]) => {
  const blocks = stepData.template?.blocks || [];
  
  blocks.forEach(block => {
    usedBlocks.add(block.type);
    
    // Verificar se é SIMPLE sem template
    if (simpleBlocks.includes(block.type)) {
      const possibleTemplateNames = [
        block.type,
        `${block.type}-inline`,
        block.type.replace('-inline', ''),
      ];
      
      const hasTemplate = possibleTemplateNames.some(name => 
        availableTemplates.includes(name)
      );
      
      if (!hasTemplate) {
        problematicBlocks.push({
          step: stepKey,
          blockId: block.id,
          blockType: block.type,
        });
      }
    }
  });
});

console.log(`Total de tipos únicos usados: ${usedBlocks.size}`);

// ========================================
// 6. IDENTIFICAR BLOCOS PROBLEMÁTICOS
// ========================================

if (problematicBlocks.length > 0) {
  console.log(`\n🔴 BLOCOS PROBLEMÁTICOS (SIMPLE sem template HTML):\n`);
  
  const grouped = {};
  problematicBlocks.forEach(b => {
    if (!grouped[b.blockType]) {
      grouped[b.blockType] = [];
    }
    grouped[b.blockType].push(`${b.step} (${b.blockId})`);
  });
  
  Object.entries(grouped).forEach(([type, occurrences]) => {
    console.log(`   ❌ ${type}`);
    console.log(`      Usado em: ${occurrences.join(', ')}`);
    console.log(`      Impacto: 🔴 NÃO RENDERIZA (mostra "Sem conteúdo")`);
    console.log(`      Solução: Criar public/templates/html/${type}.html`);
    console.log(`             OU reclassificar como COMPLEX\n`);
  });
} else {
  console.log(`\n✅ NENHUM BLOCO PROBLEMÁTICO ENCONTRADO!`);
  console.log(`   Todos os blocos SIMPLE usados no Quiz21 têm templates HTML.\n`);
}

// ========================================
// 7. RESUMO EXECUTIVO
// ========================================

console.log('='.repeat(60));
console.log('\n📊 RESUMO EXECUTIVO:\n');

const coveragePercentage = simpleBlocks.length > 0
  ? Math.round((matchedTemplates.length / simpleBlocks.length) * 100)
  : 100;

console.log(`   Blocos SIMPLE mapeados:       ${simpleBlocks.length}`);
console.log(`   Templates HTML disponíveis:   ${availableTemplates.length}`);
console.log(`   Blocos SIMPLE com template:   ${matchedTemplates.length}`);
console.log(`   Blocos SIMPLE sem template:   ${missingTemplates.length}`);
console.log(`   Taxa de cobertura:            ${coveragePercentage}%`);
console.log();
console.log(`   Blocos usados no Quiz21:      ${usedBlocks.size}`);
console.log(`   Blocos problemáticos:         ${problematicBlocks.length}`);

if (problematicBlocks.length > 0) {
  console.log(`\n   Status: ❌ SISTEMA INCOMPLETO`);
  console.log(`   Ação:   Criar templates HTML ou reclassificar blocos\n`);
  process.exit(1);
} else {
  console.log(`\n   Status: ✅ SISTEMA COMPLETO (para Quiz21)\n`);
  
  if (missingTemplates.length > 0) {
    console.log(`   ⚠️  Aviso: ${missingTemplates.length} templates faltando para blocos não usados`);
    console.log(`   (não impacta Quiz21 atual, mas pode causar problemas futuros)\n`);
  }
  
  process.exit(0);
}
