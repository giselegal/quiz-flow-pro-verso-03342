/**
 * 🎯 CENTRALIZED TEMPLATE IMPORTS
 * 
 * Este arquivo centraliza todos os imports de templates para evitar
 * warnings do Vite sobre imports dinâmicos/estáticos misturados.
 */

// Import estático do template principal
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from './quiz21StepsComplete';

// Export centralizado para uso em imports dinâmicos
export const getQuiz21StepsTemplate = () => QUIZ_STYLE_21_STEPS_TEMPLATE;

// Função para carregar template de forma consistente
export const loadTemplate = async (templateId: string) => {
  // 🎯 CORREÇÃO: Carregar JSONs V2 do src/config/templates/ que têm "blocks"
  // em vez de sempre retornar QUIZ_STYLE_21_STEPS_TEMPLATE que tem "sections"
  
  // Normalizar stepId (aceitar "step-12" ou "12")
  const stepNumber = templateId.replace(/^step-/, '').padStart(2, '0');
  const stepId = `step-${stepNumber}`;
  
  try {
    // Tentar carregar JSON V2 com blocks[]
    const jsonTemplate = await import(`@/config/templates/${stepId}.json`);
    
    if (jsonTemplate.default && jsonTemplate.default.blocks) {
      console.log(`✅ [loadTemplate] Carregando JSON V2 com blocks: ${stepId}`);
      return {
        template: { [stepId]: jsonTemplate.default },
        source: 'json-v2-blocks'
      };
    }
  } catch (error) {
    console.warn(`⚠️  [loadTemplate] JSON V2 não encontrado para ${stepId}, usando fallback TS`);
  }
  
  // Fallback: template TypeScript (tem sections, não blocks)
  switch (templateId) {
    case 'quiz21StepsComplete':
    case 'step-1':
    case 'step-2':
    case 'step-3':
    case 'step-4':
    case 'step-5':
    case 'step-6':
    case 'step-7':
    case 'step-8':
    case 'step-9':
    case 'step-10':
    case 'step-11':
    case 'step-12':
    case 'step-13':
    case 'step-14':
    case 'step-15':
    case 'step-16':
    case 'step-17':
    case 'step-18':
    case 'step-19':
    case 'step-20':
    case 'step-21':
      console.log(`⚠️  [loadTemplate] Usando fallback TS (sections) para ${templateId}`);
      return {
        template: QUIZ_STYLE_21_STEPS_TEMPLATE,
        source: 'static-import-sections'
      };
    default:
      return null;
  }
};

// Export do template para compatibilidade
export { QUIZ_STYLE_21_STEPS_TEMPLATE };
