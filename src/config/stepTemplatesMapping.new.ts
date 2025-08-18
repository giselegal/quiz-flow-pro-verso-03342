// src/config/stepTemplatesMapping.ts
// ✅ SOLUÇÃO: Mapeamento simplificado SEM ciclo de dependência

import { Block } from '../types/editor';
import {
  QUIZ_QUESTIONS_COMPLETE,
  QUIZ_STYLE_21_STEPS_TEMPLATE,
} from '@/templates/quiz21StepsComplete';

// Interface para o template de etapa
export interface StepTemplate {
  stepNumber: number;
  name: string;
  description: string;
}

// ✅ MAPEAMENTO SIMPLIFICADO usando QUIZ_QUESTIONS_COMPLETE
export const STEP_TEMPLATES_MAPPING: Record<number, StepTemplate> = {
  1: {
    stepNumber: 1,
    name: QUIZ_QUESTIONS_COMPLETE[1] || 'Coleta do nome',
    description: 'Página inicial - coleta do nome',
  },
  2: {
    stepNumber: 2,
    name: QUIZ_QUESTIONS_COMPLETE[2] || 'Qual o seu tipo de roupa favorita?',
    description: 'Pergunta sobre estilo de roupa',
  },
  3: {
    stepNumber: 3,
    name: QUIZ_QUESTIONS_COMPLETE[3] || 'Como você se sente com cores vibrantes?',
    description: 'Pergunta sobre cores',
  },
  4: {
    stepNumber: 4,
    name: QUIZ_QUESTIONS_COMPLETE[4] || 'Qual acessório define você?',
    description: 'Pergunta sobre acessórios',
  },
  5: {
    stepNumber: 5,
    name: QUIZ_QUESTIONS_COMPLETE[5] || 'Em que ocasião você se sente mais você?',
    description: 'Pergunta sobre ocasiões',
  },
  6: {
    stepNumber: 6,
    name: QUIZ_QUESTIONS_COMPLETE[6] || 'Qual sapato é a sua cara?',
    description: 'Pergunta sobre calçados',
  },
  7: {
    stepNumber: 7,
    name: QUIZ_QUESTIONS_COMPLETE[7] || 'Como você definiria seu estilo?',
    description: 'Pergunta sobre definição de estilo',
  },
  8: {
    stepNumber: 8,
    name: QUIZ_QUESTIONS_COMPLETE[8] || 'Qual look você escolheria para um encontro?',
    description: 'Pergunta sobre look para encontro',
  },
  9: {
    stepNumber: 9,
    name: QUIZ_QUESTIONS_COMPLETE[9] || 'Sua peça favorita no guarda-roupa é?',
    description: 'Pergunta sobre peça favorita',
  },
  10: {
    stepNumber: 10,
    name: QUIZ_QUESTIONS_COMPLETE[10] || 'Como você se veste para trabalhar?',
    description: 'Pergunta sobre estilo profissional',
  },
  11: {
    stepNumber: 11,
    name: QUIZ_QUESTIONS_COMPLETE[11] || 'Qual sua inspiração de moda?',
    description: 'Pergunta sobre inspiração',
  },
  12: {
    stepNumber: 12,
    name: QUIZ_QUESTIONS_COMPLETE[12] || 'Seu estilo de bolsa preferido?',
    description: 'Pergunta sobre bolsas',
  },
  13: {
    stepNumber: 13,
    name: QUIZ_QUESTIONS_COMPLETE[13] || 'Como você escolhe suas roupas pela manhã?',
    description: 'Pergunta sobre processo de escolha',
  },
  14: {
    stepNumber: 14,
    name: QUIZ_QUESTIONS_COMPLETE[14] || 'Qual seu tecido favorito?',
    description: 'Pergunta sobre tecidos',
  },
  15: {
    stepNumber: 15,
    name: QUIZ_QUESTIONS_COMPLETE[15] || 'Você prefere looks minimalistas ou elaborados?',
    description: 'Pergunta sobre complexidade do look',
  },
  16: {
    stepNumber: 16,
    name: QUIZ_QUESTIONS_COMPLETE[16] || 'Sua cor favorita no guarda-roupa?',
    description: 'Pergunta sobre cor preferida',
  },
  17: {
    stepNumber: 17,
    name: QUIZ_QUESTIONS_COMPLETE[17] || 'Como você se sente mais confortável?',
    description: 'Pergunta sobre conforto',
  },
  18: {
    stepNumber: 18,
    name: QUIZ_QUESTIONS_COMPLETE[18] || 'Qual estilo de maquiagem combina com você?',
    description: 'Pergunta sobre maquiagem',
  },
  19: {
    stepNumber: 19,
    name: QUIZ_QUESTIONS_COMPLETE[19] || 'Seu estilo de cabelo ideal?',
    description: 'Pergunta sobre cabelo',
  },
  20: {
    stepNumber: 20,
    name: QUIZ_QUESTIONS_COMPLETE[20] || 'Qual look expressa sua personalidade?',
    description: 'Pergunta final sobre personalidade',
  },
  21: {
    stepNumber: 21,
    name: QUIZ_QUESTIONS_COMPLETE[21] || 'Resultado do seu estilo pessoal',
    description: 'Página de resultado final',
  },
};

// ✅ FUNÇÃO getStepTemplate SIMPLIFICADA usando QUIZ_STYLE_21_STEPS_TEMPLATE
export const getStepTemplate = (stepNumber: number): Block[] => {
  const stepId = `step-${stepNumber}`;
  
  if (QUIZ_STYLE_21_STEPS_TEMPLATE[stepId]) {
    console.log(`✅ Template real carregado para step-${stepNumber}`);
    return QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
  }
  
  console.warn(`⚠️ Template não encontrado para step-${stepNumber}`);
  return [];
};

// ✅ FUNÇÃO getAllSteps SIMPLIFICADA
export const getAllSteps = (): StepTemplate[] => {
  return Object.values(STEP_TEMPLATES_MAPPING);
};

// ✅ FUNÇÃO getStepInfo PARA COMPATIBILIDADE
export const getStepInfo = (stepNumber: number): StepTemplate | null => {
  return STEP_TEMPLATES_MAPPING[stepNumber] || null;
};
