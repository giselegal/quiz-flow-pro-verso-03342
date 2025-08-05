// src/config/stepTemplatesMapping.ts
// ✅ SISTEMA DINÂMICO - Mapeamento atualizado para usar DynamicStepTemplate

// Importação do sistema dinâmico
import { DynamicStepTemplate, QuestionConfig } from "@/components/steps/DynamicStepTemplate";
import { STEP_CONFIGURATIONS } from "@/components/steps/StepConfigurations";

// Interface para o template de etapa - NOVA ESTRUTURA DINÂMICA
export interface StepTemplate {
  stepNumber: number;
  questionConfig: QuestionConfig; // Mudança: agora usa configuração JSON
  name: string;
  description: string;
  component: typeof DynamicStepTemplate; // Mudança: todos usam o mesmo componente
}

// ✅ MAPEAMENTO DINÂMICO - SUBSTITUI OS 21 TEMPLATES INDIVIDUAIS
export const STEP_TEMPLATES_MAPPING: Record<number, StepTemplate> = {
  1: {
    stepNumber: 1,
    questionConfig: STEP_CONFIGURATIONS.step01,
    name: "Introdução",
    description: "Página inicial do quiz",
    component: DynamicStepTemplate,
  },
  2: {
    stepNumber: 2,
    questionConfig: STEP_CONFIGURATIONS.step02,
    name: "Q1 - Tipo de Roupa",
    description: "Qual o seu tipo de roupa favorita?",
    component: DynamicStepTemplate,
  },
  3: {
    stepNumber: 3,
    questionConfig: STEP_CONFIGURATIONS.step03,
    name: "Q2 - Personalidade",
    description: "RESUMA A SUA PERSONALIDADE:",
    component: DynamicStepTemplate,
  },
  4: {
    stepNumber: 4,
    questionConfig: STEP_CONFIGURATIONS.step04,
    name: "Q3 - Visual",
    description: "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?",
    component: DynamicStepTemplate,
  },
  5: {
    stepNumber: 5,
    questionConfig: STEP_CONFIGURATIONS.step05,
    name: "Q4 - Detalhes",
    description: "QUAIS DETALHES VOCÊ GOSTA?",
    component: DynamicStepTemplate,
  },
  6: {
    stepNumber: 6,
    questionConfig: STEP_CONFIGURATIONS.step06,
    name: "Q5 - Estampas",
    description: "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?",
    component: DynamicStepTemplate,
  },
  7: {
    stepNumber: 7,
    questionConfig: STEP_CONFIGURATIONS.step07,
    name: "Q6 - Casacos",
    description: "QUAL CASACO É SEU FAVORITO?",
    component: DynamicStepTemplate,
  },
  8: {
    stepNumber: 8,
    questionConfig: STEP_CONFIGURATIONS.step08,
    name: "Q7 - Calças",
    description: "QUAL SUA CALÇA FAVORITA?",
    component: DynamicStepTemplate,
  },
  9: {
    stepNumber: 9,
    questionConfig: STEP_CONFIGURATIONS.step09,
    name: "Q8 - Sapatos",
    description: "QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?",
    component: DynamicStepTemplate,
  },
  10: {
    stepNumber: 10,
    questionConfig: STEP_CONFIGURATIONS.step10,
    name: "Q9 - Acessórios",
    description: "QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?",
    component: DynamicStepTemplate,
  },
  11: {
    stepNumber: 11,
    questionConfig: STEP_CONFIGURATIONS.step11,
    name: "Q10 - Tecidos",
    description: "VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...",
    component: DynamicStepTemplate,
  },
  12: {
    stepNumber: 12,
    questionConfig: STEP_CONFIGURATIONS.step12,
    name: "Transição Pessoal",
    description: "Agora vamos conhecer você melhor",
    component: DynamicStepTemplate,
  },
  13: {
    stepNumber: 13,
    questionConfig: STEP_CONFIGURATIONS.step13,
    name: "Q11 - Guarda-Roupa",
    description: "QUANDO VOCÊ OLHA PARA O SEU GUARDA-ROUPA, QUAL DESSAS FRASES TE VEM A CABEÇA?",
    component: DynamicStepTemplate,
  },
  14: {
    stepNumber: 14,
    questionConfig: STEP_CONFIGURATIONS.step14,
    name: "Q13 - Final",
    description: "Última pergunta do quiz",
    component: DynamicStepTemplate,
  },
  15: {
    stepNumber: 15,
    questionConfig: STEP_CONFIGURATIONS.step15,
    name: "Transição",
    description: "Processando suas respostas...",
    component: DynamicStepTemplate,
  },
  16: {
    stepNumber: 16,
    questionConfig: STEP_CONFIGURATIONS.step16,
    name: "Processamento",
    description: "Analisando seu perfil...",
    component: DynamicStepTemplate,
  },
  17: {
    stepNumber: 17,
    questionConfig: STEP_CONFIGURATIONS.step17,
    name: "Resultado",
    description: "Seu resultado personalizado",
    component: DynamicStepTemplate,
  },
  18: {
    stepNumber: 18,
    questionConfig: STEP_CONFIGURATIONS.step18,
    name: "Detalhes",
    description: "Detalhes do seu estilo",
    component: DynamicStepTemplate,
  },
  19: {
    stepNumber: 19,
    questionConfig: STEP_CONFIGURATIONS.step19,
    name: "Guia",
    description: "Guia personalizado",
    component: DynamicStepTemplate,
  },
  20: {
    stepNumber: 20,
    questionConfig: STEP_CONFIGURATIONS.step20,
    name: "Oferta",
    description: "Oferta especial",
    component: DynamicStepTemplate,
  },
  21: {
    stepNumber: 21,
    questionConfig: STEP_CONFIGURATIONS.step21,
    name: "Finalização",
    description: "Conclusão e próximos passos",
    component: DynamicStepTemplate,
  },
};

// ✅ FUNÇÕES UTILITÁRIAS - ATUALIZADAS PARA SISTEMA DINÂMICO

/**
 * Obtém a configuração de uma etapa específica (substitui templateFunction)
 */
export const getStepTemplate = (stepNumber: number): QuestionConfig | null => {
  const stepTemplate = STEP_TEMPLATES_MAPPING[stepNumber];
  if (!stepTemplate) {
    console.warn(`Template não encontrado para a etapa ${stepNumber}`);
    return null;
  }

  try {
    return stepTemplate.questionConfig;
  } catch (error) {
    console.error(`Erro ao carregar configuração da etapa ${stepNumber}:`, error);
    return null;
  }
};

/**
 * Obtém o componente React para uma etapa (sempre DynamicStepTemplate)
 */
export const getStepComponent = (stepNumber: number): typeof DynamicStepTemplate | null => {
  const stepTemplate = STEP_TEMPLATES_MAPPING[stepNumber];
  return stepTemplate?.component || null;
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

/**
 * NOVA: Obtém props completas para renderizar uma etapa
 */
export const getStepProps = (stepNumber: number, progressValue: number = 0) => {
  const stepTemplate = STEP_TEMPLATES_MAPPING[stepNumber];
  if (!stepTemplate) return null;

  return {
    stepNumber,
    questionData: stepTemplate.questionConfig,
    progressValue,
    logoUrl:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
    brandColors: {
      primary: "#B89B7A",
      secondary: "#432818",
      accent: "#E8D5C4",
    },
  };
};
