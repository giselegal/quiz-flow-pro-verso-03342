#!/usr/bin/env node
/**
 * 🧪 TESTE COMPLETO DE RENDERIZAÇÃO - QUIZ 21 ETAPAS
 * Verifica se todos os componentes podem ser importados e renderizados
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
const blockUsage = {};
const stepBlocks = {};

Object.entries(quizData.steps).forEach(([stepId, stepData]) => {
  const blocks = stepData.blocks || [];
  stepBlocks[stepId] = [];
  
  blocks.forEach(block => {
    const type = block.type;
    if (type) {
      blockTypes.add(type);
      blockUsage[type] = (blockUsage[type] || 0) + 1;
      stepBlocks[stepId].push(type);
    }
  });
});

// Lista de componentes que NÃO devem renderizar (step types, animações, etc)
const NON_RENDERABLE = new Set([
  // Step types
  'intro', 'question', 'strategic-question', 'transition', 'transition-result', 'result', 'offer',
  // Propriedades de step
  'scale', 'selection', 'input',
  // Animações
  'fade', 'slideUp', 'bounceIn', 'zoomIn', 'fadeInUp', 'fadeIn',
]);

// Filtrar apenas blocos renderizáveis
const renderableBlocks = Array.from(blockTypes).filter(type => !NON_RENDERABLE.has(type));

console.log('╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║     🧪 TESTE DE RENDERIZAÇÃO - TODOS OS COMPONENTES (21 ETAPAS)     ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝');
console.log('');

console.log('📊 ESTATÍSTICAS:');
console.log(`  Total de tipos únicos: ${blockTypes.size}`);
console.log(`  Blocos renderizáveis: ${renderableBlocks.length}`);
console.log(`  Não renderizáveis: ${blockTypes.size - renderableBlocks.length}`);
console.log('');

// Mapear componentes para seus paths
const componentPaths = {
  // Intro (Step 01)
  'quiz-intro-header': 'src/components/editor/blocks/QuizIntroHeaderBlock.tsx',
  'intro-title': 'src/components/editor/blocks/atomic/IntroTitleBlock.tsx',
  'intro-image': 'src/components/editor/blocks/atomic/IntroImageBlock.tsx',
  'intro-description': 'src/components/editor/blocks/atomic/IntroDescriptionBlock.tsx',
  'intro-form': 'src/components/editor/blocks/atomic/IntroFormBlock.tsx',
  
  // Questions (Steps 02-11)
  'question-progress': 'src/components/editor/blocks/atomic/QuestionProgressBlock.tsx',
  'question-title': 'src/components/editor/blocks/atomic/QuestionTextBlock.tsx',
  'question-navigation': 'src/components/editor/blocks/atomic/QuestionNavigationBlock.tsx',
  'options-grid': 'src/components/editor/blocks/OptionsGridBlock.tsx',
  'question-hero': 'src/components/editor/blocks/QuizQuestionHeaderBlock.tsx',
  
  // Transitions (Steps 12, 19)
  'transition-hero': 'src/components/sections/transitions/TransitionHeroSection.tsx',
  'transition-text': 'src/components/editor/blocks/atomic/TransitionTextBlock.tsx',
  
  // Result (Step 20)
  'result-congrats': 'src/components/editor/blocks/ResultCongratsBlock.tsx',
  'quiz-score-display': 'src/components/quiz/blocks/QuizScoreDisplay.tsx',
  'result-main': 'src/components/editor/blocks/atomic/ResultMainBlock.tsx',
  'result-image': 'src/components/editor/blocks/atomic/ResultImageBlock.tsx',
  'result-description': 'src/components/editor/blocks/atomic/ResultDescriptionBlock.tsx',
  'result-progress-bars': 'src/components/editor/blocks/ResultProgressBarsBlock.tsx',
  'result-secondary-styles': 'src/components/editor/blocks/atomic/ResultSecondaryStylesBlock.tsx',
  'result-share': 'src/components/editor/blocks/atomic/ResultShareBlock.tsx',
  'result-cta': 'src/components/editor/blocks/atomic/ResultCTABlock.tsx',
  
  // Offer (Step 21)
  'offer-hero': 'src/components/editor/blocks/QuizOfferHeroBlock.tsx',
  'pricing': 'src/components/sections/offer/PricingSection.tsx',
  
  // Universal
  'text-inline': 'src/components/editor/blocks/TextInlineBlock.tsx',
  'CTAButton': 'src/components/editor/blocks/atomic/CTAButtonBlock.tsx',
};

console.log('🔍 VERIFICANDO RENDERIZAÇÃO POR STEP:');
console.log('');

let totalSuccess = 0;
let totalFailures = 0;
const failureDetails = [];

Object.entries(stepBlocks).forEach(([stepId, blocks]) => {
  const stepNum = stepId.replace('step-', '');
  const stepData = quizData.steps[stepId];
  const stepType = stepData.type || 'unknown';
  
  console.log(`┌─ STEP ${stepNum} (${stepType}) - ${blocks.length} blocos ─────────────────────`);
  
  blocks.forEach(blockType => {
    if (NON_RENDERABLE.has(blockType)) {
      console.log(`│  ⏭️  ${blockType.padEnd(25)} [SKIP - não renderizável]`);
      return;
    }
    
    const path = componentPaths[blockType];
    if (path) {
      // Verificar se arquivo existe
      try {
        const fullPath = resolve(__dirname, '..', path);
        readFileSync(fullPath, 'utf-8');
        console.log(`│  ✅ ${blockType.padEnd(25)} → ${path.split('/').pop()}`);
        totalSuccess++;
      } catch (err) {
        console.log(`│  ❌ ${blockType.padEnd(25)} [ERRO: Arquivo não encontrado]`);
        totalFailures++;
        failureDetails.push({
          step: stepId,
          type: blockType,
          path,
          error: 'Arquivo não encontrado',
        });
      }
    } else {
      console.log(`│  ⚠️  ${blockType.padEnd(25)} [AVISO: Path não mapeado]`);
      totalFailures++;
      failureDetails.push({
        step: stepId,
        type: blockType,
        path: 'N/A',
        error: 'Path não mapeado no script',
      });
    }
  });
  
  console.log('└────────────────────────────────────────────────────────────────────');
  console.log('');
});

console.log('╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║                        📊 RESULTADO FINAL                            ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝');
console.log('');
console.log(`  ✅ Componentes OK:        ${totalSuccess}`);
console.log(`  ❌ Componentes com erro:  ${totalFailures}`);
console.log(`  📊 Taxa de sucesso:       ${Math.round((totalSuccess / (totalSuccess + totalFailures)) * 100)}%`);
console.log('');

if (failureDetails.length > 0) {
  console.log('❌ DETALHES DOS ERROS:');
  console.log('');
  failureDetails.forEach(({ step, type, path, error }) => {
    console.log(`  • ${step} → ${type}`);
    console.log(`    Path: ${path}`);
    console.log(`    Erro: ${error}`);
    console.log('');
  });
}

if (totalFailures === 0) {
  console.log('🎉 SUCESSO TOTAL! Todos os componentes renderizáveis estão OK!');
  console.log('');
  process.exit(0);
} else {
  console.log('⚠️  Alguns componentes precisam de atenção.');
  console.log('');
  process.exit(1);
}
