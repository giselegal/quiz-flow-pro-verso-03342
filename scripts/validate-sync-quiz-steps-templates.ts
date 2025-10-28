#!/usr/bin/env tsx

/**
 * 🔍 VALIDAÇÃO DE SINCRONIZAÇÃO: QUIZ_STEPS vs quiz21StepsComplete
 * 
 * Compara navigation.nextStep entre as duas fontes e identifica inconsistências
 */

import { QUIZ_STEPS } from '../src/data/quizSteps';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '../src/templates/quiz21StepsComplete';

console.log('🔍 VALIDAÇÃO: Sincronização de Navegação entre Fontes\n');

// ============================================================================
// 1. EXTRAIR NAVIGATION.NEXTSTEP DE AMBAS AS FONTES
// ============================================================================

interface NavigationComparison {
  stepId: string;
  quizStepsNext: string | null | undefined;
  templateNext: string | null | undefined;
  matches: boolean;
  issue?: string;
}

const comparisons: NavigationComparison[] = [];

// Pegar todos os step IDs únicos
const allStepIds = new Set<string>();
Object.keys(QUIZ_STEPS).forEach(id => allStepIds.add(id));
Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(id => allStepIds.add(id));

// Comparar cada step
for (const stepId of Array.from(allStepIds).sort()) {
  const quizStep = QUIZ_STEPS[stepId];
  const templateBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];

  // Extrair nextStep de QUIZ_STEPS
  const quizStepsNext = quizStep?.nextStep;

  // Extrair nextStep do template (último bloco geralmente tem navigation)
  let templateNext: string | null | undefined = undefined;
  if (Array.isArray(templateBlocks)) {
    // Procurar por um bloco com navigation.nextStep
    for (const block of templateBlocks) {
      if (block.navigation?.nextStep !== undefined) {
        templateNext = block.navigation.nextStep;
        break;
      }
    }
    
    // Se não encontrou, procurar em content.nextStep (algumas implementações antigas)
    if (templateNext === undefined) {
      for (const block of templateBlocks) {
        if (block.content?.nextStep !== undefined) {
          templateNext = block.content.nextStep;
          break;
        }
      }
    }
  }

  // Comparar
  const matches = quizStepsNext === templateNext;
  const comparison: NavigationComparison = {
    stepId,
    quizStepsNext,
    templateNext,
    matches,
  };

  // Identificar tipo de problema
  if (!matches) {
    if (quizStepsNext === undefined && templateNext === undefined) {
      comparison.issue = 'Ambos sem nextStep definido';
    } else if (quizStepsNext === undefined) {
      comparison.issue = `QUIZ_STEPS faltando nextStep (template tem: ${templateNext})`;
    } else if (templateNext === undefined) {
      comparison.issue = `Template faltando nextStep (QUIZ_STEPS tem: ${quizStepsNext})`;
    } else {
      comparison.issue = `Valores diferentes (QUIZ: ${quizStepsNext} vs TEMPLATE: ${templateNext})`;
    }
  }

  comparisons.push(comparison);
}

// ============================================================================
// 2. RELATÓRIO DE SINCRONIZAÇÃO
// ============================================================================

console.log('📊 RELATÓRIO DE SINCRONIZAÇÃO:\n');

const matching = comparisons.filter(c => c.matches);
const mismatching = comparisons.filter(c => !c.matches);

console.log(`✅ Steps sincronizados: ${matching.length}/${comparisons.length}`);
console.log(`❌ Steps com inconsistências: ${mismatching.length}/${comparisons.length}`);
console.log();

if (mismatching.length > 0) {
  console.log('⚠️  INCONSISTÊNCIAS DETECTADAS:\n');
  
  for (const comp of mismatching) {
    console.log(`${comp.stepId}:`);
    console.log(`  QUIZ_STEPS.nextStep: ${comp.quizStepsNext ?? 'undefined'}`);
    console.log(`  Template.nextStep: ${comp.templateNext ?? 'undefined'}`);
    console.log(`  Problema: ${comp.issue}`);
    console.log();
  }
}

// ============================================================================
// 3. ANÁLISE DETALHADA DE STEPS CRÍTICOS
// ============================================================================

console.log('🎯 ANÁLISE DE STEPS CRÍTICOS:\n');

const criticalSteps = ['step-19', 'step-20', 'step-21'];

for (const stepId of criticalSteps) {
  const comp = comparisons.find(c => c.stepId === stepId);
  
  if (comp) {
    const status = comp.matches ? '✅' : '❌';
    console.log(`${status} ${stepId}:`);
    console.log(`  QUIZ_STEPS: ${comp.quizStepsNext ?? 'null'}`);
    console.log(`  Template: ${comp.templateNext ?? 'null'}`);
    
    if (!comp.matches) {
      console.log(`  ⚠️  ${comp.issue}`);
    }
    console.log();
  }
}

// ============================================================================
// 4. VALIDAÇÃO DE NAVEGAÇÃO COMPLETA
// ============================================================================

console.log('🔗 VALIDAÇÃO DE NAVEGAÇÃO COMPLETA:\n');

// Construir cadeia de navegação de ambas as fontes
function buildNavigationChain(
  source: Record<string, any>,
  extractNext: (step: any) => string | null | undefined,
  startStepId: string = 'step-01',
  maxSteps: number = 30
): string[] {
  const chain: string[] = [startStepId];
  let currentStepId = startStepId;
  let iterations = 0;

  while (iterations < maxSteps) {
    const step = source[currentStepId];
    if (!step) break;

    const nextStep = extractNext(step);
    if (!nextStep) break;

    chain.push(nextStep);
    currentStepId = nextStep;
    iterations++;

    // Detectar ciclo
    if (chain.filter(id => id === currentStepId).length > 1) {
      chain.push('[CICLO DETECTADO]');
      break;
    }
  }

  return chain;
}

// Cadeia de QUIZ_STEPS
const quizStepsChain = buildNavigationChain(
  QUIZ_STEPS,
  (step) => step?.nextStep,
  'step-01'
);

// Cadeia de Template (mais complexo porque precisa procurar em blocos)
const templateChain = buildNavigationChain(
  QUIZ_STYLE_21_STEPS_TEMPLATE,
  (blocks) => {
    if (!Array.isArray(blocks)) return null;
    for (const block of blocks) {
      if (block.navigation?.nextStep) return block.navigation.nextStep;
      if (block.content?.nextStep) return block.content.nextStep;
    }
    return null;
  },
  'step-01'
);

console.log(`QUIZ_STEPS navegação (${quizStepsChain.length} steps):`);
console.log(`  ${quizStepsChain.join(' → ')}`);
console.log();

console.log(`Template navegação (${templateChain.length} steps):`);
console.log(`  ${templateChain.join(' → ')}`);
console.log();

// Comparar cadeias
const chainsMatch = JSON.stringify(quizStepsChain) === JSON.stringify(templateChain);

if (chainsMatch) {
  console.log('✅ Cadeias de navegação idênticas!');
} else {
  console.log('❌ Cadeias de navegação DIVERGENTES!');
  
  // Encontrar onde divergem
  const minLength = Math.min(quizStepsChain.length, templateChain.length);
  for (let i = 0; i < minLength; i++) {
    if (quizStepsChain[i] !== templateChain[i]) {
      console.log(`\n  Divergência na posição ${i}:`);
      console.log(`    QUIZ_STEPS: ${quizStepsChain[i]}`);
      console.log(`    Template: ${templateChain[i]}`);
      break;
    }
  }
  
  if (quizStepsChain.length !== templateChain.length) {
    console.log(`\n  Comprimento diferente:`);
    console.log(`    QUIZ_STEPS: ${quizStepsChain.length} steps`);
    console.log(`    Template: ${templateChain.length} steps`);
  }
}

console.log();

// ============================================================================
// 5. RECOMENDAÇÕES
// ============================================================================

console.log('💡 RECOMENDAÇÕES:\n');

if (mismatching.length === 0 && chainsMatch) {
  console.log('✅ Todas as fontes estão sincronizadas!');
  console.log('✅ Navegação completa e consistente.');
  console.log('\nNenhuma ação necessária. 🎉');
} else {
  console.log('⚠️  AÇÕES NECESSÁRIAS:\n');
  
  if (mismatching.length > 0) {
    console.log(`1. Corrigir ${mismatching.length} inconsistências de nextStep:`);
    for (const comp of mismatching.slice(0, 5)) {
      console.log(`   - ${comp.stepId}: ${comp.issue}`);
    }
    if (mismatching.length > 5) {
      console.log(`   ... e mais ${mismatching.length - 5} inconsistências`);
    }
    console.log();
  }
  
  if (!chainsMatch) {
    console.log('2. Revisar cadeia de navegação completa');
    console.log('   - QUIZ_STEPS deve ser a fonte autoritativa');
    console.log('   - Atualizar templates para corresponder');
    console.log();
  }
  
  console.log('3. Executar comandos de sincronização:');
  console.log('   npm run generate:templates');
  console.log('   npm run build:templates');
  console.log();
  
  console.log('4. Re-validar após correções:');
  console.log('   npx tsx scripts/validate-sync-quiz-steps-templates.ts');
}

console.log('\n✨ Validação concluída!');

// ============================================================================
// 6. ESTATÍSTICAS FINAIS
// ============================================================================

console.log('\n📈 ESTATÍSTICAS:\n');
console.log(`Total de steps analisados: ${comparisons.length}`);
console.log(`Steps em QUIZ_STEPS: ${Object.keys(QUIZ_STEPS).length}`);
console.log(`Steps em Template: ${Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length}`);
console.log(`Taxa de sincronização: ${((matching.length / comparisons.length) * 100).toFixed(1)}%`);

// Exit code
process.exit(mismatching.length > 0 || !chainsMatch ? 1 : 0);
