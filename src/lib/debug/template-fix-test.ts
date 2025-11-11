/**
 * 🔧 TESTE DE CORREÇÃO DE TEMPLATES
 */

import { loadFullTemplate } from '@/templates/registry';
import { appLogger } from '@/lib/utils/appLogger';

export async function testTemplateFix() {
  appLogger.info('🔧 Testando correção de templates...');
  
  const templates = ['simpleTestTemplate', 'quiz21StepsComplete'];
  
  for (const templateId of templates) {
    appLogger.info(`\n🎯 Testando ${templateId}:`);
    
    try {
      const template = await loadFullTemplate(templateId);
      
      if (template) {
        const t: any = template as any;
        appLogger.info(`✅ ${templateId} carregado:`, { data: [{
                    name: t.name,
                    steps: t.steps?.length || 0,
                    hasConfig: !!t.config,
                  }] });
      } else {
        appLogger.error(`❌ ${templateId} retornou null`);
      }
    } catch (error) {
      appLogger.error(`❌ Erro em ${templateId}:`, { data: [error] });
    }
  }
}

// Executar no browser
if (typeof window !== 'undefined') {
  (window as any).testTemplateFix = testTemplateFix;
  appLogger.info('🔧 Função de teste disponível em window.testTemplateFix()');
}
