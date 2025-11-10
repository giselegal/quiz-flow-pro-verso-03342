/**
 * 🔍 TESTE DE CARREGAMENTO DE TEMPLATES
 * 
 * Script para diagnosticar problemas no carregamento de templates
 */

import { loadFullTemplate } from '../templates/registry/index';
import { appLogger } from '@/lib/utils/appLogger';

export async function testTemplateLoading() {
  appLogger.info('🔍 Iniciando teste de carregamento de templates...');
  
  const templatesToTest = [
    'quiz21StepsComplete',
    'testTemplate',
  ];
  
  for (const templateId of templatesToTest) {
    appLogger.info(`\n🎯 Testando template: ${templateId}`);
    
    try {
      const startTime = performance.now();
      const template = await loadFullTemplate(templateId);
      const loadTime = performance.now() - startTime;
      
      if (template) {
        appLogger.info(`✅ Template ${templateId} carregado com sucesso em ${loadTime.toFixed(2)}ms`);
        appLogger.info(`   - Nome: ${template.name}`);
        appLogger.info(`   - Etapas: ${template.steps.length}`);
        appLogger.info(`   - Categoria: ${template.category}`);
      } else {
        appLogger.error(`❌ Template ${templateId} retornou null`);
      }
    } catch (error) {
      appLogger.error(`❌ Erro ao carregar template ${templateId}:`, { data: [error] });
    }
  }
  
  appLogger.info('\n🏁 Teste de carregamento concluído');
}

// Executar teste se estiver no browser
if (typeof window !== 'undefined') {
  (window as any).testTemplateLoading = testTemplateLoading;
  appLogger.info('🔍 Função de teste disponível em window.testTemplateLoading()');
}
