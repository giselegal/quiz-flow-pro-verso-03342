const { CLEAN_21_STEPS } = require('./src/config/clean21Steps');

console.log('🔍 Teste CLEAN_21_STEPS:');
console.log('- Quantidade:', CLEAN_21_STEPS.length);

if (CLEAN_21_STEPS.length > 0) {
  console.log('- Primeira etapa:', CLEAN_21_STEPS[0]);
  console.log('- Última etapa:', CLEAN_21_STEPS[CLEAN_21_STEPS.length - 1]);
  console.log('- Todas as etapas:');
  CLEAN_21_STEPS.forEach(step => {
    console.log(`  ${step.stepNumber}: ${step.name} (${step.type})`);
  });
} else {
  console.log('❌ Array vazio!');
}
