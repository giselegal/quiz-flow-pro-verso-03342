/**
 * 🔍 TESTE DE CARREGAMENTO DE TEMPLATES
 * 
 * Script para diagnosticar problemas no carregamento de templates
 */

import { loadFullTemplate } from '../templates/registry/index';

export async function testTemplateLoading() {
  console.log('🔍 Iniciando teste de carregamento de templates...');
  
  const templatesToTest = [
    'quiz21StepsComplete',
    'testTemplate'
  ];
  
  for (const templateId of templatesToTest) {
    console.log(`\n🎯 Testando template: ${templateId}`);
    
    try {
      const startTime = performance.now();
      const template = await loadFullTemplate(templateId);
      const loadTime = performance.now() - startTime;
      
      if (template) {
        console.log(`✅ Template ${templateId} carregado com sucesso em ${loadTime.toFixed(2)}ms`);
        console.log(`   - Nome: ${template.name}`);
        console.log(`   - Etapas: ${template.steps.length}`);
        console.log(`   - Categoria: ${template.category}`);
      } else {
        console.error(`❌ Template ${templateId} retornou null`);
      }
    } catch (error) {
      console.error(`❌ Erro ao carregar template ${templateId}:`, error);
    }
  }
  
  console.log('\n🏁 Teste de carregamento concluído');
}

// Executar teste se estiver no browser
if (typeof window !== 'undefined') {
  (window as any).testTemplateLoading = testTemplateLoading;
  console.log('🔍 Função de teste disponível em window.testTemplateLoading()');
}
