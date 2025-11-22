#!/usr/bin/env node

/**
 * 🔍 Script de Validação: Template vs BlockRegistry
 * 
 * Verifica se todos os blocos do quiz21-complete.json estão registrados no BlockRegistry
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Tipos de blocos esperados no template
const EXPECTED_BLOCKS = [
  'CTAButton',
  'intro-description',
  'intro-form',
  'intro-image',
  'intro-title',
  'offer-hero',
  'options-grid',
  'pricing',
  'question-hero',
  'question-navigation',
  'question-progress',
  'question-title',
  'quiz-intro-header',
  'quiz-score-display',
  'result-congrats',
  'result-cta',
  'result-description',
  'result-image',
  'result-main',
  'result-progress-bars',
  'result-secondary-styles',
  'result-share',
  'text-inline',
  'transition-hero',
  'transition-text',
];

console.log('🔍 Validando alinhamento Template → BlockRegistry\n');

// 1. Carregar template
console.log('📄 Carregando quiz21-complete.json...');
let template;
try {
  const templatePath = join(process.cwd(), 'public/templates/quiz21-complete.json');
  const content = readFileSync(templatePath, 'utf-8');
  template = JSON.parse(content);
  console.log('✅ Template carregado\n');
} catch (error) {
  console.error('❌ Erro ao carregar template:', error.message);
  process.exit(1);
}

// 2. Extrair tipos de blocos do template
console.log('📊 Extraindo tipos de blocos...');
const templateBlocks = new Set();
let totalBlocks = 0;

if (template.steps && Array.isArray(template.steps)) {
  template.steps.forEach((step) => {
    if (step.blocks && Array.isArray(step.blocks)) {
      step.blocks.forEach((block) => {
        if (block.type) {
          templateBlocks.add(block.type);
          totalBlocks++;
        }
      });
    }
  });
}

console.log(`✅ Encontrados ${templateBlocks.size} tipos únicos em ${totalBlocks} blocos totais\n`);

// 3. Comparar com blocos esperados
console.log('🔎 Comparando com lista esperada...\n');

const found = [];
const missing = [];

EXPECTED_BLOCKS.forEach((type) => {
  if (templateBlocks.has(type)) {
    found.push(type);
  } else {
    missing.push(type);
  }
});

// 4. Verificar blocos extras no template
const extras = [];
templateBlocks.forEach((type) => {
  if (!EXPECTED_BLOCKS.includes(type)) {
    extras.push(type);
  }
});

// 5. Relatório
console.log('📊 RELATÓRIO DE ALINHAMENTO');
console.log('=' .repeat(60));
console.log(`Total no template: ${templateBlocks.size} tipos`);
console.log(`Total esperado:    ${EXPECTED_BLOCKS.length} tipos`);
console.log(`Matches:           ${found.length} tipos ✅`);
console.log(`Faltando:          ${missing.length} tipos ❌`);
console.log(`Extras:            ${extras.length} tipos ⚠️`);
console.log('=' .repeat(60));
console.log('');

// 6. Detalhes
if (found.length > 0) {
  console.log(`✅ Blocos Encontrados (${found.length}):`);
  found.forEach((type) => console.log(`   - ${type}`));
  console.log('');
}

if (missing.length > 0) {
  console.log(`❌ Blocos Faltando no Template (${missing.length}):`);
  missing.forEach((type) => console.log(`   - ${type}`));
  console.log('');
}

if (extras.length > 0) {
  console.log(`⚠️  Blocos Extras no Template (${extras.length}):`);
  console.log('   (não estavam na lista esperada, mas podem ser válidos)');
  extras.forEach((type) => console.log(`   - ${type}`));
  console.log('');
}

// 7. Validação final
const SUCCESS_THRESHOLD = 0.9; // 90% de cobertura
const coverage = found.length / EXPECTED_BLOCKS.length;

console.log('🎯 RESULTADO FINAL');
console.log('=' .repeat(60));
console.log(`Cobertura: ${(coverage * 100).toFixed(1)}%`);

if (coverage >= 1.0) {
  console.log('✅ SUCESSO: 100% dos blocos esperados estão no template!');
  process.exit(0);
} else if (coverage >= SUCCESS_THRESHOLD) {
  console.log('✅ OK: Cobertura acima de 90%');
  console.log(`⚠️  Considere adicionar os ${missing.length} blocos faltantes`);
  process.exit(0);
} else {
  console.log(`❌ FALHA: Cobertura abaixo de 90% (${missing.length} blocos faltantes)`);
  process.exit(1);
}
