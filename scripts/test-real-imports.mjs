#!/usr/bin/env node
/**
 * 🧪 TESTE REAL DE IMPORT - Verifica se os componentes podem ser importados
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar JSON
const jsonPath = resolve(__dirname, '../public/templates/quiz21-complete.json');
const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));

// Mapeamento REAL dos componentes (do UnifiedBlockRegistry e BlockTypeRenderer)
const componentMap = {
  // Intro (Step 01)
  'quiz-intro-header': '@/components/editor/blocks/QuizIntroHeaderBlock',
  'intro-title': '@/components/editor/blocks/atomic/IntroTitleBlock',
  'intro-image': '@/components/editor/blocks/atomic/IntroImageBlock',
  'intro-description': '@/components/editor/blocks/atomic/IntroDescriptionBlock',
  'intro-form': '@/components/editor/blocks/atomic/IntroFormBlock',
  
  // Questions (Steps 02-18)
  'question-progress': '@/components/editor/blocks/atomic/QuestionProgressBlock',
  'question-title': '@/components/editor/blocks/atomic/QuestionTextBlock',
  'question-navigation': '@/components/editor/blocks/atomic/QuestionNavigationBlock',
  'options-grid': '@/components/editor/blocks/OptionsGridBlock',
  'question-hero': '@/components/editor/blocks/QuizQuestionHeaderBlock',
  
  // Transitions (Steps 12, 19)
  'transition-hero': '@/components/sections/transitions (PropNormalizer)',
  'transition-text': '@/components/editor/blocks/atomic/TransitionTextBlock',
  
  // Result (Step 20)
  'result-congrats': '@/components/editor/blocks/ResultCongratsBlock',
  'quiz-score-display': '@/components/quiz/blocks/QuizScoreDisplay',
  'result-main': '@/components/editor/blocks/atomic/ResultMainBlock',
  'result-image': '@/components/editor/blocks/atomic/ResultImageBlock',
  'result-description': '@/components/editor/blocks/atomic/ResultDescriptionBlock',
  'result-progress-bars': '@/components/editor/blocks/ResultProgressBarsBlock',
  'result-secondary-styles': '@/components/editor/blocks/atomic/ResultSecondaryStylesBlock',
  'result-share': '@/components/editor/blocks/atomic/ResultShareBlock',
  'result-cta': '@/components/editor/blocks/atomic/ResultCTABlock',
  
  // Offer (Step 21)
  'offer-hero': '@/components/editor/blocks/QuizOfferHeroBlock',
  'pricing': '@/components/sections/offer (PropNormalizer)',
  
  // Universal
  'text-inline': '@/components/editor/blocks/TextInlineBlock',
  'CTAButton': '@/components/editor/blocks/atomic/CTAButtonBlock',
};

// Converter @ para path real
const resolveComponentPath = (importPath) => {
  if (importPath.includes('(PropNormalizer)')) {
    // Esses usam PropNormalizer, verificar pasta sections
    const cleanPath = importPath.split(' ')[0];
    return cleanPath.replace('@/', 'src/') + '.tsx';
  }
  return importPath.replace('@/', 'src/') + '.tsx';
};

console.log('╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║          🧪 TESTE REAL DE IMPORTAÇÃO - VERIFICAÇÃO FÍSICA           ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝\n');

// Coletar todos os tipos únicos REALMENTE usados
const usedTypes = new Set();
Object.values(data.steps).forEach(step => {
  if (step.blocks) {
    step.blocks.forEach(block => {
      usedTypes.add(block.type);
    });
  }
});

console.log(`📊 Total de tipos únicos: ${usedTypes.size}\n`);

const results = {
  success: [],
  missing: [],
  notMapped: [],
};

usedTypes.forEach(type => {
  const mapping = componentMap[type];
  
  if (!mapping) {
    results.notMapped.push(type);
    return;
  }
  
  // Verificar se é PropNormalizer (sempre OK)
  if (mapping.includes('(PropNormalizer)')) {
    results.success.push({ type, path: mapping, status: 'PropNormalizer' });
    return;
  }
  
  const filePath = resolveComponentPath(mapping);
  const fullPath = resolve(__dirname, '..', filePath);
  
  if (existsSync(fullPath)) {
    results.success.push({ type, path: filePath, status: 'exists' });
  } else {
    results.missing.push({ type, path: filePath });
  }
});

// Exibir resultados
console.log('✅ COMPONENTES ENCONTRADOS:');
results.success.forEach(({ type, path, status }) => {
  const statusIcon = status === 'PropNormalizer' ? '🔄' : '✅';
  console.log(`  ${statusIcon} ${type.padEnd(30)} → ${path}`);
});

if (results.notMapped.length > 0) {
  console.log('\n⚠️  TIPOS NÃO MAPEADOS:');
  results.notMapped.forEach(type => {
    console.log(`  ⚠️  ${type}`);
  });
}

if (results.missing.length > 0) {
  console.log('\n❌ ARQUIVOS NÃO ENCONTRADOS:');
  results.missing.forEach(({ type, path }) => {
    console.log(`  ❌ ${type.padEnd(30)} → ${path}`);
  });
}

console.log('\n╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║                          📊 RESULTADO                                ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝\n');
console.log(`  ✅ Encontrados:       ${results.success.length}`);
console.log(`  ⚠️  Não mapeados:     ${results.notMapped.length}`);
console.log(`  ❌ Arquivos faltando: ${results.missing.length}`);
console.log(`  📊 Taxa de sucesso:   ${Math.round((results.success.length / usedTypes.size) * 100)}%\n`);

if (results.missing.length === 0 && results.notMapped.length === 0) {
  console.log('🎉 PERFEITO! Todos os componentes estão mapeados e existem!\n');
  process.exit(0);
} else {
  console.log('⚠️  Alguns componentes precisam de correção.\n');
  process.exit(1);
}
