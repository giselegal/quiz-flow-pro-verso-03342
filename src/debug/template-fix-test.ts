/**
 * 🔧 TESTE DE CORREÇÃO DE TEMPLATES
 */

import { loadFullTemplate } from '../templates/registry/index';

export async function testTemplateFix() {
  console.log('🔧 Testando correção de templates...');
  
  const templates = ['simpleTestTemplate', 'quiz21StepsComplete'];
  
  for (const templateId of templates) {
    console.log(`\n🎯 Testando ${templateId}:`);
    
    try {
      const template = await loadFullTemplate(templateId);
      
      if (template) {
        console.log(`✅ ${templateId} carregado:`, {
          name: template.name,
          steps: template.steps?.length || 0,
          hasConfig: !!template.config
        });
      } else {
        console.error(`❌ ${templateId} retornou null`);
      }
    } catch (error) {
      console.error(`❌ Erro em ${templateId}:`, error);
    }
  }
}

// Executar no browser
if (typeof window !== 'undefined') {
  (window as any).testTemplateFix = testTemplateFix;
  console.log('🔧 Função de teste disponível em window.testTemplateFix()');
}
