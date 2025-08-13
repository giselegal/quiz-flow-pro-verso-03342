/**
 * 🧪 TESTE DE INVESTIGAÇÃO - CARREGAMENTO DE TEMPLATES
 *
 * Script para verificar se os templates corretos estão sendo carregados
 */

console.log('🔍 INICIANDO INVESTIGAÇÃO DOS TEMPLATES...\n');

async function investigateTemplateLoading() {
  try {
    // Testar import direto dos templates
    console.log('📋 TESTANDO IMPORTS DIRETOS:');

    // Teste Step-01
    try {
      const step01 = await import('./src/config/templates/step-01.json');
      const template01 = step01.default || step01;
      console.log(`✅ Step-01: "${template01.metadata.name}"`);
    } catch (e) {
      console.log(`❌ Step-01: Erro - ${e.message}`);
    }

    // Teste Step-03 (crítico)
    try {
      const step03 = await import('./src/config/templates/step-03.json');
      const template03 = step03.default || step03;
      console.log(`✅ Step-03: "${template03.metadata.name}"`);

      // Verificar se tem a questão correta
      const questionBlock = template03.blocks.find(block => block.id === 'step03-question-title');
      if (questionBlock) {
        console.log(`   📝 Questão: "${questionBlock.properties.content}"`);
      }
    } catch (e) {
      console.log(`❌ Step-03: Erro - ${e.message}`);
    }

    console.log('\n📋 TESTANDO SISTEMA DE TEMPLATES:');

    // Testar o sistema de templates
    try {
      const templateSystem = await import('./src/config/templates/templates.ts');
      console.log('✅ Sistema de templates carregado');

      // Testar função getStepTemplate
      if (templateSystem.getStepTemplate) {
        const template = await templateSystem.getStepTemplate(3);
        if (template) {
          console.log(`✅ getStepTemplate(3): "${template.metadata.name}"`);
        } else {
          console.log('❌ getStepTemplate(3): Retornou null');
        }
      }
    } catch (e) {
      console.log(`❌ Sistema de templates: Erro - ${e.message}`);
    }
  } catch (error) {
    console.error('❌ ERRO GERAL:', error);
  }
}

// Executar investigação
investigateTemplateLoading();
