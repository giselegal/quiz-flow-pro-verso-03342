
/**
 * SISTEMA CENTRALIZADO DAS 21 ETAPAS DO QUIZ
 * Arquivo otimizado com todas as importações e mapeamentos corretos
 */

// Importações de todos os templates das 21 etapas
import { getStep01Template } from './Step01Template';
import { getStep02Template } from './Step02Template';
import { getStep03Template } from './Step03Template';
import { getStep04Template } from './Step04Template';
import { getStep05Template } from './Step05Template';
import { getStep06Template } from './Step06Template';
import { getStep07Template } from './Step07Template';
import { getStep08Template } from './Step08Template';
import { getStep09Template } from './Step09Template';
import { getStep10Template } from './Step10Template';
import { getStep11Template } from './Step11Template';
import { getStep12Template } from './Step12Template';
import { getStep13Template } from './Step13Template';
import { getStep14Template } from './Step14Template';
import { getStep15Template } from './Step15Template';
import { getStep16Template } from './Step16Template';
import { getStep17Template } from './Step17Template';
import { getStep18Template } from './Step18Template';
import { getStep19Template } from './Step19Template';
import { getStep20Template } from './Step20Template';
import { getStep21Template } from './Step21Template';

/**
 * MAPEAMENTO COMPLETO DAS 21 ETAPAS
 * Cada etapa tem seu template correspondente
 */
export const STEP_TEMPLATES = {
  1: getStep01Template,
  2: getStep02Template,
  3: getStep03Template,
  4: getStep04Template,
  5: getStep05Template,
  6: getStep06Template,
  7: getStep07Template,
  8: getStep08Template,
  9: getStep09Template,
  10: getStep10Template,
  11: getStep11Template,
  12: getStep12Template,
  13: getStep13Template,
  14: getStep14Template,
  15: getStep15Template,
  16: getStep16Template,
  17: getStep17Template,
  18: getStep18Template,
  19: getStep19Template,
  20: getStep20Template,
  21: getStep21Template
};

/**
 * INFORMAÇÕES DAS ETAPAS
 * Metadados para cada etapa do quiz
 */
export const STEP_INFO = {
  1: { title: 'Introdução', type: 'intro', progress: 0 },
  2: { title: 'Roupa Favorita', type: 'question', progress: 10 },
  3: { title: 'Personalidade', type: 'question', progress: 14 },
  4: { title: 'Biotipo Corporal', type: 'question', progress: 19 },
  5: { title: 'Estilo de Vida', type: 'question', progress: 24 },
  6: { title: 'Cores Favoritas', type: 'question', progress: 29 },
  7: { title: 'Inspirações', type: 'question', progress: 33 },
  8: { title: 'Acessórios', type: 'question', progress: 38 },
  9: { title: 'Tecidos', type: 'question', progress: 43 },
  10: { title: 'Ocasiões', type: 'question', progress: 48 },
  11: { title: 'Prioridade de Estilo', type: 'question', progress: 52 },
  12: { title: 'Transição Principal', type: 'transition', progress: 57 },
  13: { title: 'Questão Estratégica 1', type: 'strategic', progress: 62 },
  14: { title: 'Questão Estratégica 2', type: 'strategic', progress: 67 },
  15: { title: 'Questão Estratégica 3', type: 'strategic', progress: 71 },
  16: { title: 'Questão Estratégica 4', type: 'strategic', progress: 76 },
  17: { title: 'Questão Estratégica 5', type: 'strategic', progress: 81 },
  18: { title: 'Questão Estratégica 6', type: 'strategic', progress: 86 },
  19: { title: 'Transição Final', type: 'transition', progress: 90 },
  20: { title: 'Resultado Personalizado', type: 'result', progress: 95 },
  21: { title: 'Oferta Exclusiva', type: 'offer', progress: 100 }
};

/**
 * Função principal para obter template de uma etapa
 * @param stepNumber Número da etapa (1-21)
 * @returns Template da etapa ou null se não encontrado
 */
export const getStepTemplate = (stepNumber: number) => {
  console.log(`🎯 Carregando template da etapa ${stepNumber}`);
  
  if (stepNumber < 1 || stepNumber > 21) {
    console.error(`❌ Etapa ${stepNumber} fora do range válido (1-21)`);
    return null;
  }
  
  const templateFunction = STEP_TEMPLATES[stepNumber as keyof typeof STEP_TEMPLATES];
  
  if (!templateFunction) {
    console.error(`❌ Template da etapa ${stepNumber} não encontrado`);
    return null;
  }
  
  try {
    const template = templateFunction();
    console.log(`✅ Template da etapa ${stepNumber} carregado com sucesso`);
    return template;
  } catch (error) {
    console.error(`❌ Erro ao carregar template da etapa ${stepNumber}:`, error);
    return null;
  }
};

/**
 * Função para obter informações de uma etapa
 * @param stepNumber Número da etapa (1-21)
 * @returns Informações da etapa
 */
export const getStepInfo = (stepNumber: number) => {
  if (stepNumber < 1 || stepNumber > 21) {
    return { title: 'Etapa Inválida', type: 'unknown', progress: 0 };
  }
  
  return STEP_INFO[stepNumber as keyof typeof STEP_INFO];
};

/**
 * Função para obter lista de todas as etapas
 * @returns Array com informações de todas as 21 etapas
 */
export const getAllSteps = () => {
  return Object.keys(STEP_TEMPLATES).map(stepNum => {
    const num = parseInt(stepNum);
    return {
      stepNumber: num,
      ...getStepInfo(num)
    };
  });
};

/**
 * Função para verificar se uma etapa existe
 * @param stepNumber Número da etapa
 * @returns true se a etapa existe, false caso contrário
 */
export const stepExists = (stepNumber: number): boolean => {
  return stepNumber >= 1 && stepNumber <= 21 && !!STEP_TEMPLATES[stepNumber as keyof typeof STEP_TEMPLATES];
};

/**
 * Função para obter próxima etapa
 * @param currentStep Etapa atual
 * @returns Número da próxima etapa ou null se for a última
 */
export const getNextStep = (currentStep: number): number | null => {
  if (currentStep >= 21) return null;
  return currentStep + 1;
};

/**
 * Função para obter etapa anterior
 * @param currentStep Etapa atual
 * @returns Número da etapa anterior ou null se for a primeira
 */
export const getPreviousStep = (currentStep: number): number | null => {
  if (currentStep <= 1) return null;
  return currentStep - 1;
};

// Exportações nomeadas para compatibilidade
export {
  getStep01Template,
  getStep02Template,
  getStep03Template,
  getStep04Template,
  getStep05Template,
  getStep06Template,
  getStep07Template,
  getStep08Template,
  getStep09Template,
  getStep10Template,
  getStep11Template,
  getStep12Template,
  getStep13Template,
  getStep14Template,
  getStep15Template,
  getStep16Template,
  getStep17Template,
  getStep18Template,
  getStep19Template,
  getStep20Template,
  getStep21Template
};

// Export default para facilitar importação
export default {
  getStepTemplate,
  getStepInfo,
  getAllSteps,
  stepExists,
  getNextStep,
  getPreviousStep,
  STEP_TEMPLATES,
  STEP_INFO
};

console.log('✅ Sistema de 21 etapas carregado com sucesso!');
console.log(`📊 Total de etapas disponíveis: ${Object.keys(STEP_TEMPLATES).length}`);
