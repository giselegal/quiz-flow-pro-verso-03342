/**
 * 🎯 DADOS DAS ETAPAS DO FUNIL
 *
 * Este arquivo define as 21 etapas do quiz de estilo pessoal.
 * As etapas são carregadas dinamicamente no EditorContext.
 */

// @ts-nocheck
import type { FunnelStep as FunnelStage } from "@/types/funnel";

// 🚀 ETAPAS PADRÃO DO QUIZ
export const defaultFunnelStages: FunnelStage[] = [
  // Step 1 - Introdução
  {
    id: "step-1",
    name: "Introdução",
    description: "Página inicial do quiz",
    order: 1,
    type: "intro",
    isActive: true,
    metadata: {
      blocksCount: 8,
      lastModified: new Date(),
      isCustom: false,
    },
  },

  // Steps 2-14 - Questões do Quiz
  {
    id: "step-2",
    name: "Q1 - Tipo de Roupa",
    description: "Qual o seu tipo de roupa favorita?",
    order: 2,
    type: "question",
    isActive: false,
    metadata: {
      blocksCount: 6,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-3",
    name: "Q2 - Personalidade",
    description: "Resuma a sua personalidade:",
    order: 3,
    type: "question",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-4",
    name: "Q3 - Visual",
    description: "Qual visual você mais se identifica?",
    order: 4,
    type: "question",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-5",
    name: "Q4 - Detalhes",
    description: "Quais detalhes você gosta?",
    order: 5,
    type: "question",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-6",
    name: "Q5 - Estampas",
    description: "Quais estampas você mais se identifica?",
    order: 6,
    type: "question",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-7",
    name: "Q6 - Casacos",
    description: "Qual casaco é seu favorito?",
    order: 7,
    type: "question",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-8",
    name: "Q7 - Calças",
    description: "Qual sua calça favorita?",
    order: 8,
    type: "question",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-9",
    name: "Q8 - Sapatos",
    description: "Qual desses sapatos você tem ou mais gosta?",
    order: 9,
    type: "question",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-10",
    name: "Q9 - Acessórios",
    description: "Que tipo de acessórios você gosta?",
    order: 10,
    type: "question",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-11",
    name: "Q10 - Tecidos",
    description: "Você escolhe certos tecidos, principalmente porque eles...",
    order: 11,
    type: "question",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-12",
    name: "Transição Pessoal",
    description: "Agora vamos conhecer você melhor",
    order: 12,
    type: "transition",
    isActive: false,
    metadata: {
      blocksCount: 4,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-13",
    name: "Q11 - Guarda-Roupa",
    description: "Quando você olha para o seu guarda-roupa, qual dessas frases te vem à cabeça?",
    order: 13,
    type: "question",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-14",
    name: "Q13 - Final",
    description: "Última pergunta do quiz",
    order: 14,
    type: "question",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },

  // Steps 15-16 - Processamento
  {
    id: "step-15",
    name: "Transição",
    description: "Processando suas respostas...",
    order: 15,
    type: "transition",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-16",
    name: "Processamento",
    description: "Analisando seu perfil...",
    order: 16,
    type: "processing",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },

  // Steps 17-19 - Resultado
  {
    id: "step-17",
    name: "Resultado",
    description: "Seu resultado personalizado",
    order: 17,
    type: "result",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-18",
    name: "Detalhes",
    description: "Detalhes do seu estilo",
    order: 18,
    type: "result",
    isActive: false,
    metadata: {
      blocksCount: 5,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-19",
    name: "Guia",
    description: "Guia personalizado",
    order: 19,
    type: "result",
    isActive: false,
    metadata: {
      blocksCount: 6,
      lastModified: new Date(),
      isCustom: false,
    },
  },

  // Steps 20-21 - Oferta
  {
    id: "step-20",
    name: "Oferta",
    description: "Oferta especial",
    order: 20,
    type: "lead",
    isActive: false,
    metadata: {
      blocksCount: 4,
      lastModified: new Date(),
      isCustom: false,
    },
  },
  {
    id: "step-21",
    name: "Finalização",
    description: "Conclusão e próximos passos",
    order: 21,
    type: "offer",
    isActive: false,
    metadata: {
      blocksCount: 4,
      lastModified: new Date(),
      isCustom: false,
    },
  },
];

// 🎯 FUNÇÃO PARA OBTER ETAPAS
export const getFunnelStages = (): FunnelStage[] => {
  return defaultFunnelStages;
};

// 🎯 FUNÇÃO PARA OBTER ETAPA POR ID
export const getFunnelStageById = (id: string): FunnelStage | undefined => {
  return defaultFunnelStages.find(stage => stage.id === id);
};

// 🎯 FUNÇÃO PARA OBTER ETAPA POR ORDEM
export const getFunnelStageByOrder = (order: number): FunnelStage | undefined => {
  return defaultFunnelStages.find(stage => stage.order === order);
};

// 🎯 ESTATÍSTICAS DAS ETAPAS
export const getFunnelStagesStats = () => {
  const stages = defaultFunnelStages;
  return {
    total: stages.length,
    intro: stages.filter(s => s.type === "intro").length,
    questions: stages.filter(s => s.type === "question").length,
    transitions: stages.filter(s => s.type === "transition").length,
    processing: stages.filter(s => s.type === "processing").length,
    results: stages.filter(s => s.type === "result").length,
    leads: stages.filter(s => s.type === "lead").length,
    offers: stages.filter(s => s.type === "offer").length,
  };
};
