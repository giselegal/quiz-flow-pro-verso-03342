// 🧪 TESTE MANUAL DE VALIDAÇÃO
// Cole este código no console do navegador para testar a sincronização

(async function testDataSync() {
  try {
    // Tentar importar os módulos
    const { QUIZ_QUESTIONS_COMPLETE } = await import('./src/templates/quiz21StepsComplete.js');
    const { STEP_TEMPLATES_MAPPING } = await import('./src/config/stepTemplatesMapping.js');

    console.log('🔍 === TESTE MANUAL DE SINCRONIZAÇÃO ===');

    // Contar quantos steps temos
    const quizSteps = Object.keys(QUIZ_QUESTIONS_COMPLETE);
    const mappingSteps = Object.keys(STEP_TEMPLATES_MAPPING);

    console.log(`📊 Quiz Steps: ${quizSteps.length} (${quizSteps.join(', ')})`);
    console.log(`📊 Mapping Steps: ${mappingSteps.length} (${mappingSteps.join(', ')})`);

    // Verificar os primeiros 5 steps
    for (let i = 1; i <= 5; i++) {
      const quizName = QUIZ_QUESTIONS_COMPLETE[i];
      const mappingTemplate = STEP_TEMPLATES_MAPPING[i];

      console.log(`\n🔍 Step ${i}:`);
      console.log(`   Quiz: "${quizName}"`);
      console.log(`   Mapping: "${mappingTemplate?.name || 'AUSENTE'}"`);
      console.log(`   Template Function: ${mappingTemplate?.templateFunction ? '✅' : '❌'}`);
    }

    console.log('\n🔍 === FIM DO TESTE ===');
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
})();
