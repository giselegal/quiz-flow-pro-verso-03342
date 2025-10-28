#!/usr/bin/env tsx

/**
 * 🧪 TESTE DA CONFIGURAÇÃO DE NAVEGAÇÃO
 * 
 * Valida o comportamento da configuração de steps opcionais
 */

import { QUIZ_STEPS } from '../src/data/quizSteps';
import { getNavigationService } from '../src/services/NavigationService';
import {
  QUIZ_NAV_CONFIG,
  getConfiguredNextStep,
  isOptionalStep,
  getEnabledSteps,
  isStepEnabled,
} from '../src/config/quizNavigation';

console.log('🧪 TESTE: Configuração de Navegação do Quiz\n');

// ============================================================================
// 1. CONFIGURAÇÃO ATUAL
// ============================================================================
console.log('📋 CONFIGURAÇÃO ATUAL:');
console.log(`  ENABLE_OFFER_STEP: ${QUIZ_NAV_CONFIG.ENABLE_OFFER_STEP}`);
console.log(`  CUSTOM_STEPS_ENABLED: ${QUIZ_NAV_CONFIG.CUSTOM_STEPS_ENABLED}`);
console.log(`  OFFER_STEP_ID: ${QUIZ_NAV_CONFIG.OFFER_STEP_ID}`);
console.log(`  RESULT_STEP_ID: ${QUIZ_NAV_CONFIG.RESULT_STEP_ID}`);
console.log();

// ============================================================================
// 2. STEPS HABILITADOS
// ============================================================================
const enabledSteps = getEnabledSteps();
console.log(`✅ STEPS HABILITADOS (${enabledSteps.length} total):`);
console.log(`  ${enabledSteps.join(', ')}`);
console.log();

// ============================================================================
// 3. TESTE DE NAVEGAÇÃO STEP-20
// ============================================================================
console.log('🎯 TESTE: Navegação do step-20 (resultado)');
const step20 = QUIZ_STEPS['step-20'];
console.log(`  step-20.nextStep (original): ${step20?.nextStep}`);

const configuredNext20 = getConfiguredNextStep('step-20', step20?.nextStep || null);
console.log(`  step-20.nextStep (configurado): ${configuredNext20}`);

if (QUIZ_NAV_CONFIG.ENABLE_OFFER_STEP) {
  console.log(`  ✅ Oferta HABILITADA → step-20 vai para step-21`);
} else {
  console.log(`  ⏹️  Oferta DESABILITADA → step-20 é TERMINAL`);
}
console.log();

// ============================================================================
// 4. TESTE DE NAVEGAÇÃO STEP-21
// ============================================================================
console.log('🎯 TESTE: Navegação do step-21 (oferta)');
const step21 = QUIZ_STEPS['step-21'];
console.log(`  step-21.nextStep (original): ${step21?.nextStep ?? 'null'}`);

const configuredNext21 = getConfiguredNextStep('step-21', step21?.nextStep || null);
console.log(`  step-21.nextStep (configurado): ${configuredNext21}`);

const isStep21Optional = isOptionalStep('step-21');
console.log(`  step-21 é opcional? ${isStep21Optional ? '✅ SIM' : '❌ NÃO'}`);
console.log();

// ============================================================================
// 5. TESTE DO NAVIGATION SERVICE
// ============================================================================
console.log('🔧 TESTE: NavigationService com configuração');
const navService = getNavigationService();
// Converter objeto QUIZ_STEPS em array
const quizStepsArray = Object.values(QUIZ_STEPS).map((step, index) => ({
  id: step.id || `step-${String(index + 1).padStart(2, '0')}`,
  nextStep: step.nextStep,
  order: index,
  type: step.type,
}));
navService.buildNavigationMap(quizStepsArray);

const resolvedNext20 = navService.resolveNextStep('step-20');
const resolvedNext21 = navService.resolveNextStep('step-21');

console.log(`  NavigationService.resolveNextStep('step-20'): ${resolvedNext20}`);
console.log(`  NavigationService.resolveNextStep('step-21'): ${resolvedNext21}`);
console.log();

// ============================================================================
// 6. VALIDAÇÃO DE NAVEGAÇÃO
// ============================================================================
console.log('✅ VALIDAÇÃO DE NAVEGAÇÃO:');
const validation = navService.validateNavigation();

console.log(`  Total de steps: ${validation.totalSteps}`);
console.log(`  Steps com nextStep: ${validation.stepsWithNext}`);
console.log(`  Steps terminais: ${validation.terminalSteps.length}`);
console.log(`    → ${validation.terminalSteps.join(', ')}`);
console.log(`  Steps órfãos: ${validation.orphanedSteps.length}`);
if (validation.orphanedSteps.length > 0) {
  console.log(`    → ${validation.orphanedSteps.join(', ')}`);
}
console.log(`  Ciclos detectados: ${validation.cycles.length}`);
console.log(`  Navegação válida? ${validation.valid ? '✅ SIM' : '❌ NÃO'}`);
console.log();

// ============================================================================
// 7. TESTE DE HABILITAÇÃO DE STEPS
// ============================================================================
console.log('🔍 TESTE: Verificação de steps habilitados');
const testSteps = ['step-01', 'step-20', 'step-21', 'step-22'];
for (const stepId of testSteps) {
  const enabled = isStepEnabled(stepId);
  const optional = isOptionalStep(stepId);
  console.log(`  ${stepId}: ${enabled ? '✅' : '❌'} habilitado | ${optional ? '📌' : '⚪'} opcional`);
}
console.log();

// ============================================================================
// 8. RESUMO
// ============================================================================
console.log('📊 RESUMO:');
if (QUIZ_NAV_CONFIG.ENABLE_OFFER_STEP) {
  console.log(`  ✅ Funil completo: step-01 → step-20 (resultado) → step-21 (oferta)`);
  console.log(`  📊 Total de steps no funil: 21`);
} else {
  console.log(`  ⏹️  Funil até resultado: step-01 → step-20 (resultado) [FIM]`);
  console.log(`  📊 Total de steps no funil: 20`);
  console.log(`  ⚠️  step-21 (oferta) está DESABILITADO`);
}

if (QUIZ_NAV_CONFIG.CUSTOM_STEPS_ENABLED) {
  console.log(`  🔧 Steps customizados HABILITADOS (step-22+)`);
} else {
  console.log(`  🔒 Steps customizados DESABILITADOS`);
}

console.log('\n✨ Teste concluído!');
