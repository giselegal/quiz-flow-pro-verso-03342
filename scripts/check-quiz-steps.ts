/**
 * Script para verificar QUIZ_STEPS
 * 
 * ⚠️ DEPRECATED: Este script usa quizSteps.ts (obsoleto)
 * @see ARQUITETURA_TEMPLATES_DEFINITIVA.md
 */

console.warn('⚠️ AVISO: Este script usa quizSteps.ts (DEPRECATED)\n');

import { QUIZ_STEPS } from '../src/data/quizSteps';

console.log('📊 Verificando QUIZ_STEPS:\n');

const steps = Object.keys(QUIZ_STEPS);
console.log(`Total de steps: ${steps.length}\n`);

let withNextStep = 0;
let terminal = 0;

steps.forEach(id => {
  const step = QUIZ_STEPS[id];
  if (step.nextStep) {
    withNextStep++;
    console.log(`${id} → ${step.nextStep}`);
  } else {
    terminal++;
    console.log(`${id} → (null/undefined)`);
  }
});

console.log(`\n📈 Resumo:`);
console.log(`   Steps com nextStep: ${withNextStep}`);
console.log(`   Steps terminais: ${terminal}`);
console.log(`   Total: ${withNextStep + terminal}`);
