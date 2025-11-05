#!/usr/bin/env node
/**
 * 🧪 TESTE REAL DE IMPORTS - Tenta importar cada componente dinamicamente
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar quiz21-complete.json
const jsonPath = resolve(__dirname, '../public/templates/quiz21-complete.json');
const quizData = JSON.parse(readFileSync(jsonPath, 'utf-8'));

// Extrair todos os tipos de blocos únicos
const blockTypes = new Set();

Object.values(quizData.steps).forEach(stepData => {
  const blocks = stepData.blocks || [];
  blocks.forEach(block => {
    if (block.type) {
      blockTypes.add(block.type);
    }
  });
});

console.log('╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║          🧪 TESTE REAL DE IMPORTS - COMPONENTES DINÂMICOS           ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝');
console.log('');

// Mapear para imports reais do UnifiedBlockRegistry
const importMap = {
  // Intro
  'quiz-intro-header': () => import('../src/components/editor/blocks/QuizIntroHeaderBlock.tsx'),
  'intro-title': () => import('../src/components/editor/blocks/atomic/IntroTitleBlock.tsx'),
  'intro-image': () => import('../src/components/editor/blocks/atomic/IntroImageBlock.tsx'),
  'intro-description': () => import('../src/components/editor/blocks/atomic/IntroDescriptionBlock.tsx'),
  'intro-form': () => import('../src/components/editor/blocks/atomic/IntroFormBlock.tsx'),
  
  // Questions
  'question-progress': () => import('../src/components/editor/blocks/atomic/QuestionProgressBlock.tsx'),
  'question-title': () => import('../src/components/editor/blocks/atomic/QuestionTextBlock.tsx'),
  'question-navigation': () => import('../src/components/editor/blocks/atomic/QuestionNavigationBlock.tsx'),
  'options-grid': () => import('../src/components/editor/blocks/OptionsGridBlock.tsx'),
  'question-hero': () => import('../src/components/editor/blocks/QuizQuestionHeaderBlock.tsx'),
  
  // Transitions
  'transition-hero': () => import('../src/components/sections/transitions/index.ts').then(m => ({ default: m.TransitionHeroSection })),
  'transition-text': () => import('../src/components/editor/blocks/atomic/TransitionTextBlock.tsx'),
  
  // Result
  'result-congrats': () => import('../src/components/editor/blocks/ResultCongratsBlock.tsx'),
  'quiz-score-display': () => import('../src/components/quiz/blocks/QuizScoreDisplay.tsx'),
  'result-main': () => import('../src/components/editor/blocks/atomic/ResultMainBlock.tsx'),
  'result-image': () => import('../src/components/editor/blocks/atomic/ResultImageBlock.tsx'),
  'result-description': () => import('../src/components/editor/blocks/atomic/ResultDescriptionBlock.tsx'),
  'result-progress-bars': () => import('../src/components/editor/blocks/ResultProgressBarsBlock.tsx'),
  'result-secondary-styles': () => import('../src/components/editor/blocks/atomic/ResultSecondaryStylesBlock.tsx'),
  'result-share': () => import('../src/components/editor/blocks/atomic/ResultShareBlock.tsx'),
  'result-cta': () => import('../src/components/editor/blocks/atomic/ResultCTABlock.tsx'),
  
  // Offer
  'offer-hero': () => import('../src/components/editor/blocks/QuizOfferHeroBlock.tsx'),
  'pricing': () => import('../src/components/sections/offer/index.ts').then(m => ({ default: m.PricingSection })),
  
  // Universal
  'text-inline': () => import('../src/components/editor/blocks/TextInlineBlock.tsx'),
  'CTAButton': () => import('../src/components/editor/blocks/atomic/CTAButtonBlock.tsx'),
};

console.log(`📦 Testando ${Object.keys(importMap).length} imports dinâmicos...`);
console.log('');

let successCount = 0;
let failCount = 0;
const failures = [];

for (const [type, importFn] of Object.entries(importMap)) {
  try {
    const module = await importFn();
    
    if (module && module.default) {
      console.log(`✅ ${type.padEnd(30)} → Import OK`);
      successCount++;
    } else {
      console.log(`❌ ${type.padEnd(30)} → Sem export default`);
      failCount++;
      failures.push({ type, error: 'Sem export default', module });
    }
  } catch (err) {
    console.log(`❌ ${type.padEnd(30)} → ${err.message}`);
    failCount++;
    failures.push({ type, error: err.message });
  }
}

console.log('');
console.log('╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║                           📊 RESULTADO                               ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝');
console.log('');
console.log(`  ✅ Imports bem-sucedidos: ${successCount}`);
console.log(`  ❌ Imports com falha:     ${failCount}`);
console.log(`  📊 Taxa de sucesso:       ${Math.round((successCount / (successCount + failCount)) * 100)}%`);
console.log('');

if (failures.length > 0) {
  console.log('❌ DETALHES DAS FALHAS:');
  console.log('');
  failures.forEach(({ type, error, module }) => {
    console.log(`  • ${type}`);
    console.log(`    Erro: ${error}`);
    if (module) {
      console.log(`    Module keys: ${Object.keys(module).join(', ')}`);
    }
    console.log('');
  });
  process.exit(1);
} else {
  console.log('🎉 TODOS OS IMPORTS FUNCIONAM CORRETAMENTE!');
  console.log('');
  process.exit(0);
}
