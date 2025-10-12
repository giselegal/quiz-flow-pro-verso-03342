// @ts-nocheck - Arquivo de debug com incompatibilidades de tipo
/**
 * 🔍 DEBUG ESPECÍFICO PARA TEMPLATE QUIZ21STEPSCOMPLETE
 */

import { loadFullTemplate } from '../templates/registry/index';

export async function debugQuiz21Template() {
  console.log('🔍 Debug específico para quiz21StepsComplete...');
  
  try {
    // Testar carregamento direto
    console.log('1. Testando import direto...');
    const directImport = await import('../templates/quiz21StepsComplete.ts');
    console.log('✅ Import direto funcionou:', {
      hasDefault: !!directImport.default,
      hasNamed: !!directImport.quiz21StepsCompleteTemplate,
      keys: Object.keys(directImport)
    });
    
    // Testar carregamento via registry
    console.log('2. Testando carregamento via registry...');
    const template = await loadFullTemplate('quiz21StepsComplete');
    
    if (template) {
      console.log('✅ Template carregado via registry:', {
        name: template.name,
        steps: template.steps?.length || 0,
        category: template.category
      });
    } else {
      console.error('❌ Template retornou null via registry');
    }
    
  } catch (error) {
    console.error('❌ Erro no debug:', error);
  }
}

// Executar se estiver no browser
if (typeof window !== 'undefined') {
  (window as any).debugQuiz21Template = debugQuiz21Template;
  console.log('🔍 Função de debug disponível em window.debugQuiz21Template()');
}
