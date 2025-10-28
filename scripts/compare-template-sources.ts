/**
 * Script para comparar todas as fontes de dados de templates
 */

import { QUIZ_STEPS } from '../src/data/quizSteps';
import { getQuiz21StepsTemplate } from '../src/templates/imports';

console.log('🔍 COMPARANDO FONTES DE DADOS\n');
console.log('='*60);

// Fonte 1: QUIZ_STEPS (quizSteps.ts)
console.log('\n📘 FONTE 1: QUIZ_STEPS (src/data/quizSteps.ts)');
console.log('-'.repeat(60));

let quiz1WithNext = 0;
let quiz1Terminal = 0;
const quiz1Steps = Object.keys(QUIZ_STEPS);

console.log(`Total: ${quiz1Steps.length} steps\n`);

quiz1Steps.forEach(id => {
  const step = QUIZ_STEPS[id];
  if (step.nextStep) {
    quiz1WithNext++;
  } else {
    quiz1Terminal++;
    console.log(`⚠️  ${id} → (sem nextStep)`);
  }
});

console.log(`\n✅ Steps com nextStep: ${quiz1WithNext}`);
console.log(`🏁 Steps terminais: ${quiz1Terminal}`);

// Fonte 2: quiz21StepsComplete (QUIZ_STYLE_21_STEPS_TEMPLATE)
console.log('\n📗 FONTE 2: quiz21StepsComplete.ts');
console.log('-'.repeat(60));

const quiz21Template = getQuiz21StepsTemplate();
const quiz21Steps = Object.keys(quiz21Template);

let quiz21WithNext = 0;
let quiz21Terminal = 0;

console.log(`Total: ${quiz21Steps.length} steps\n`);

quiz21Steps.forEach(id => {
  const step = quiz21Template[id];
  const nextStep = step.nextStep ?? step.navigation?.nextStep;
  
  if (nextStep) {
    quiz21WithNext++;
  } else {
    quiz21Terminal++;
    console.log(`⚠️  ${id} → (sem nextStep)`);
  }
});

console.log(`\n✅ Steps com nextStep: ${quiz21WithNext}`);
console.log(`🏁 Steps terminais: ${quiz21Terminal}`);

// Comparação
console.log('\n🔬 COMPARAÇÃO');
console.log('='.repeat(60));

console.log('\n📊 Diferenças encontradas:');

if (quiz1Steps.length !== quiz21Steps.length) {
  console.log(`❌ Quantidade diferente: ${quiz1Steps.length} vs ${quiz21Steps.length}`);
} else {
  console.log(`✅ Mesma quantidade: ${quiz1Steps.length} steps`);
}

if (quiz1WithNext !== quiz21WithNext) {
  console.log(`❌ Steps com nextStep: ${quiz1WithNext} vs ${quiz21WithNext}`);
} else {
  console.log(`✅ Steps com nextStep: ${quiz1WithNext}`);
}

if (quiz1Terminal !== quiz21Terminal) {
  console.log(`❌ Steps terminais: ${quiz1Terminal} vs ${quiz21Terminal}`);
} else {
  console.log(`✅ Steps terminais: ${quiz1Terminal}`);
}

// Verificar diferenças específicas
console.log('\n🔎 Verificando diferenças específicas:');

for (const id of quiz1Steps) {
  const step1 = QUIZ_STEPS[id];
  const step2 = quiz21Template[id];
  
  if (!step2) {
    console.log(`❌ ${id} existe em QUIZ_STEPS mas não em quiz21StepsComplete`);
    continue;
  }
  
  const next1 = step1.nextStep;
  const next2 = step2.nextStep ?? step2.navigation?.nextStep;
  
  if (next1 !== next2) {
    console.log(`⚠️  ${id}:`);
    console.log(`   QUIZ_STEPS: ${next1 || '(null)'}`);
    console.log(`   quiz21StepsComplete: ${next2 || '(null)'}`);
  }
}

console.log('\n✅ Análise concluída!');
