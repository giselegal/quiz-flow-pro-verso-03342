// src/config/stepTemplatesMapping.ts
// Mapeamento das 21 etapas para seus templates específicos

// Importações dos templates de cada etapa
import { getStep01Template } from '@/components/steps/Step01Template';
import { getStep02Template } from '@/components/steps/Step02Template';
import { getStep03Template } from '@/components/steps/Step03Template';
import { getStep04Template } from '@/components/steps/Step04Template';
import { getStep05Template } from '@/components/steps/Step05Template';
import { getStep06Template } from '@/components/steps/Step06Template';
import { getStep07Template } from '@/components/steps/Step07Template';
import { getStep08Template } from '@/components/steps/Step08Template';
import { getStep09Template } from '@/components/steps/Step09Template';
import { getStep10Template } from '@/components/steps/Step10Template';
import { getStep11Template } from '@/components/steps/Step11Template';
import { getStep12Template } from '@/components/steps/Step12Template';
import { getStep13Template } from '@/components/steps/Step13Template';
import { getStep14Template } from '@/components/steps/Step14Template';
import { getStep15Template } from '@/components/steps/Step15Template';
import { getStep16Template } from '@/components/steps/Step16Template';
import { getStep17Template } from '@/components/steps/Step17Template';
import { getStep18Template } from '@/components/steps/Step18Template';
import { getStep19Template } from '@/components/steps/Step19Template';
import { getStep20Template } from '@/components/steps/Step20Template';
import { getStep21Template } from '@/components/steps/Step21Template';

// Interface para o template de etapa
export interface StepTemplate {
  stepNumber: number;
  templateFunction: () => any[];
  name: string;
  description: string;
}

// ✅ MAPEAMENTO COMPLETO DAS 21 ETAPAS
export const STEP_TEMPLATES_MAPPING: Record<number, StepTemplate> = {
  1: {
    stepNumber: 1,
    templateFunction: getStep01Template,
    name: 'Introdução',
    description: 'Página inicial do quiz'
  },
  2: {
    stepNumber: 2,
    templateFunction: getStep02Template,
    name: 'Q1 - Tipo de Roupa',
    description: 'Qual o seu tipo de roupa favorita?'
  },
  3: {
    stepNumber: 3,
    templateFunction: getStep03Template,
    name: 'Q2 - Estilo Pessoal',
    description: 'Como você descreveria seu estilo pessoal?'
  },
  4: {
    stepNumber: 4,
    templateFunction: getStep04Template,
    name: 'Q3 - Ocasiões',
    description: 'Para quais ocasiões você mais se veste?'
  },
  5: {
    stepNumber: 5,
    templateFunction: getStep05Template,
    name: 'Q4 - Cores',
    description: 'Quais cores você mais usa?'
  },
  6: {
    stepNumber: 6,
    templateFunction: getStep06Template,
    name: 'Q5 - Conforto',
    description: 'O que é mais importante: conforto ou aparência?'
  },
  7: {
    stepNumber: 7,
    templateFunction: getStep07Template,
    name: 'Q6 - Inspiração',
    description: 'Onde você busca inspiração de moda?'
  },
  8: {
    stepNumber: 8,
    templateFunction: getStep08Template,
    name: 'Q7 - Investimento',
    description: 'Quanto você investe em roupas mensalmente?'
  },
  9: {
    stepNumber: 9,
    templateFunction: getStep09Template,
    name: 'Q8 - Dificuldades',
    description: 'Qual sua maior dificuldade com roupas?'
  },
  10: {
    stepNumber: 10,
    templateFunction: getStep10Template,
    name: 'Q9 - Biotipo',
    description: 'Como você se vê fisicamente?'
  },
  11: {
    stepNumber: 11,
    templateFunction: getStep11Template,
    name: 'Q10 - Personalidade',
    description: 'Como as pessoas te descrevem?'
  },
  12: {
    stepNumber: 12,
    templateFunction: getStep12Template,
    name: 'Q11 - Profissão',
    description: 'Qual sua área profissional?'
  },
  13: {
    stepNumber: 13,
    templateFunction: getStep13Template,
    name: 'Q12 - Objetivo',
    description: 'O que você quer alcançar com seu estilo?'
  },
  14: {
    stepNumber: 14,
    templateFunction: getStep14Template,
    name: 'Q13 - Final',
    description: 'Última pergunta do quiz'
  },
  15: {
    stepNumber: 15,
    templateFunction: getStep15Template,
    name: 'Transição',
    description: 'Processando suas respostas...'
  },
  16: {
    stepNumber: 16,
    templateFunction: getStep16Template,
    name: 'Processamento',
    description: 'Analisando seu perfil...'
  },
  17: {
    stepNumber: 17,
    templateFunction: getStep17Template,
    name: 'Resultado',
    description: 'Seu resultado personalizado'
  },
  18: {
    stepNumber: 18,
    templateFunction: getStep18Template,
    name: 'Detalhes',
    description: 'Detalhes do seu estilo'
  },
  19: {
    stepNumber: 19,
    templateFunction: getStep19Template,
    name: 'Guia',
    description: 'Guia personalizado'
  },
  20: {
    stepNumber: 20,
    templateFunction: getStep20Template,
    name: 'Oferta',
    description: 'Oferta especial'
  },
  21: {
    stepNumber: 21,
    templateFunction: getStep21Template,
    name: 'Finalização',
    description: 'Conclusão e próximos passos'
  }
};

// ✅ FUNÇÕES UTILITÁRIAS

/**
 * Obtém o template de uma etapa específica
 */
export const getStepTemplate = (stepNumber: number): any[] => {
  const stepTemplate = STEP_TEMPLATES_MAPPING[stepNumber];
  if (!stepTemplate) {
    console.warn(`Template não encontrado para a etapa ${stepNumber}`);
    return [];
  }
  
  try {
    return stepTemplate.templateFunction();
  } catch (error) {
    console.error(`Erro ao carregar template da etapa ${stepNumber}:`, error);
    return [];
  }
};

/**
 * Obtém informações de uma etapa
 */
export const getStepInfo = (stepNumber: number): StepTemplate | null => {
  return STEP_TEMPLATES_MAPPING[stepNumber] || null;
};

/**
 * Obtém todas as etapas disponíveis
 */
export const getAllSteps = (): StepTemplate[] => {
  return Object.values(STEP_TEMPLATES_MAPPING);
};

/**
 * Verifica se uma etapa existe
 */
export const stepExists = (stepNumber: number): boolean => {
  return stepNumber in STEP_TEMPLATES_MAPPING;
};

/**
 * Obtém o total de etapas
 */
export const getTotalSteps = (): number => {
  return Object.keys(STEP_TEMPLATES_MAPPING).length;
};
