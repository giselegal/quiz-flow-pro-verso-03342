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
      return {
        template: QUIZ_STYLE_21_STEPS_TEMPLATE,
        source: 'static-import'
      };
    default:
      return null;
  }
};

// Export do template para compatibilidade
export { QUIZ_STYLE_21_STEPS_TEMPLATE };
