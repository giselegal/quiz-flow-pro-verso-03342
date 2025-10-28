/**
 * Script de teste para demonstrar a integração do NavigationService
 * 
 * Execute com: npx tsx scripts/test-navigation-integration.ts
 */

import { getNavigationService } from '../src/services/NavigationService';
import { QUIZ_STEPS } from '../src/data/quizSteps';

console.log('🧪 Testando integração do NavigationService\n');

// 1. Criar instância do NavigationService
const navService = getNavigationService();

// 2. Preparar steps do QUIZ_STEPS
const steps = Object.entries(QUIZ_STEPS).map(([id, step], index) => ({
  id,
  nextStep: (step as any).nextStep,
  order: index,
  type: (step as any).type,
}));

console.log(`📊 Total de steps: ${steps.length}\n`);

// 3. Construir mapa de navegação
navService.buildNavigationMap(steps);
const navMap = navService.getNavigationMap();

// 4. Testar resolução de nextStep
console.log('🔍 Testando resolução de nextStep:\n');

const testSteps = ['step-01', 'step-05', 'step-10', 'step-20', 'step-21'];
for (const stepId of testSteps) {
  const nextStep = navService.resolveNextStep(stepId, steps);
  const emoji = nextStep ? '→' : '🏁';
  console.log(`   ${stepId} ${emoji} ${nextStep || '(terminal)'}`);
}

// 5. Validar navegação
console.log('\n✅ Validação de navegação:\n');
const validation = navService.validateNavigation();

console.log(`   Total de steps:       ${validation.totalSteps}`);
console.log(`   Steps com nextStep:   ${validation.stepsWithNext}`);
console.log(`   Steps terminais:      ${validation.terminalSteps.length}`);
console.log(`   Steps órfãos:         ${validation.orphanedSteps.length}`);
console.log(`   Ciclos detectados:    ${validation.cycles.length}`);
console.log(`   Targets ausentes:     ${validation.missingTargets.length}`);
console.log(`   Grafo válido:         ${validation.valid ? '✅' : '❌'}`);

// 6. Estatísticas
console.log('\n📈 Estatísticas do grafo:\n');
const stats = navService.getStats();

console.log(`   Total de steps:       ${stats.totalSteps}`);
console.log(`   Steps com nextStep:   ${stats.stepsWithNext}`);
console.log(`   Steps terminais:      ${stats.terminalSteps}`);
console.log(`   Steps órfãos:         ${stats.orphanedSteps}`);
console.log(`   Ciclos:               ${stats.cycles}`);
console.log(`   Targets ausentes:     ${stats.missingTargets}`);
console.log(`   Grafo válido:         ${stats.isValid ? '✅' : '❌'}`);

// 7. Testar autoFillNextSteps
console.log('\n🔧 Testando autoFillNextSteps:\n');

const incompleteSteps = [
  { id: 'step-01', order: 0, type: 'intro' },
  { id: 'step-02', order: 1, type: 'question', nextStep: 'step-03' }, // já tem nextStep
  { id: 'step-03', order: 2, type: 'question' }, // sem nextStep
];

const filledSteps = navService.autoFillNextSteps(incompleteSteps);

for (const step of filledSteps) {
  console.log(`   ${step.id} → ${step.nextStep || '(null)'}`);
}

console.log('\n✨ Teste concluído com sucesso!\n');
