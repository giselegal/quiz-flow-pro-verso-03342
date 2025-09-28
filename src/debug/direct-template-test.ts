/**
 * 🔍 TESTE DIRETO DO TEMPLATE
 */

export async function testDirectTemplate() {
  console.log('🔍 Testando carregamento direto do template...');
  
  try {
    // Import direto
    console.log('1. Import direto...');
    const directImport = await import('../templates/quiz21StepsComplete.ts');
    console.log('✅ Import direto:', {
      hasDefault: !!directImport.default,
      hasNamed: !!directImport.quiz21StepsCompleteTemplate,
      hasTemplate: !!directImport.QUIZ_STYLE_21_STEPS_TEMPLATE,
      keys: Object.keys(directImport)
    });
    
    // Verificar estrutura do template
    if (directImport.default) {
      console.log('2. Estrutura do template default:');
      console.log('   - hasConfig:', !!directImport.default.config);
      console.log('   - hasSteps:', !!directImport.default.steps);
      console.log('   - stepsLength:', directImport.default.steps?.length || 0);
      
      if (directImport.default.steps && directImport.default.steps.length > 0) {
        console.log('   - firstStep:', directImport.default.steps[0]);
      }
    }
    
    // Verificar template original
    if (directImport.QUIZ_STYLE_21_STEPS_TEMPLATE) {
      console.log('3. Template original:');
      const keys = Object.keys(directImport.QUIZ_STYLE_21_STEPS_TEMPLATE);
      console.log('   - keys:', keys.length);
      console.log('   - firstKey:', keys[0]);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste direto:', error);
  }
}

// Executar no browser
if (typeof window !== 'undefined') {
  (window as any).testDirectTemplate = testDirectTemplate;
  console.log('🔍 Função de teste disponível em window.testDirectTemplate()');
}
