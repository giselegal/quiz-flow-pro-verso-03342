// 🎯 CENTRALIZADOR DE TODAS AS ETAPAS
// Este arquivo mapeia cada etapa para seu respectivo template

import { getStep01Template } from './Step01Intro';
import { getStep02Template } from './Step02Question01';
// import { getStep03Template } from './Step03Question02';
// ... outros imports quando criarmos

export interface StepTemplate {
  id: string;
  name: string;
  type: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer';
  description: string;
  getTemplate: () => any[];
  component?: React.ComponentType<any>;
  multiSelect?: number;
}

// 🗺️ MAPA COMPLETO DAS 21 ETAPAS
export const STEP_TEMPLATES: Record<string, StepTemplate> = {
  'etapa-1': {
    id: 'etapa-1',
    name: 'Introdução',
    type: 'intro',
    description: 'Apresentação do Quiz de Estilo',
    getTemplate: getStep01Template
  },
  'etapa-2': {
    id: 'etapa-2',
    name: 'Q1: Tipo de Roupa',
    type: 'question',
    description: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
    multiSelect: 3,
    getTemplate: getStep02Template
  },
  'etapa-3': {
    id: 'etapa-3',
    name: 'Q2: Personalidade',
    type: 'question',
    description: 'RESUMA A SUA PERSONALIDADE:',
    multiSelect: 3,
    getTemplate: () => [] // TODO: Criar Step03Question02.tsx
  },
  'etapa-4': {
    id: 'etapa-4',
    name: 'Q3: Visual',
    type: 'question',
    description: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
    multiSelect: 3,
    getTemplate: () => [] // TODO: Criar Step04Question03.tsx
  },
  'etapa-5': {
    id: 'etapa-5',
    name: 'Q4: Detalhes',
    type: 'question',
    description: 'QUAIS DETALHES VOCÊ GOSTA?',
    multiSelect: 3,
    getTemplate: () => [] // TODO: Criar Step05Question04.tsx
  },
  'etapa-6': {
    id: 'etapa-6',
    name: 'Q5: Estampas',
    type: 'question',
    description: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
    multiSelect: 3,
    getTemplate: () => [] // TODO: Criar Step06Question05.tsx
  },
  'etapa-7': {
    id: 'etapa-7',
    name: 'Q6: Casacos',
    type: 'question',
    description: 'QUAL CASACO É SEU FAVORITO?',
    multiSelect: 3,
    getTemplate: () => [] // TODO: Criar Step07Question06.tsx
  },
  'etapa-8': {
    id: 'etapa-8',
    name: 'Q7: Calças',
    type: 'question',
    description: 'QUAL SUA CALÇA FAVORITA?',
    multiSelect: 3,
    getTemplate: () => [] // TODO: Criar Step08Question07.tsx
  },
  'etapa-9': {
    id: 'etapa-9',
    name: 'Q8: Sapatos',
    type: 'question',
    description: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
    multiSelect: 3,
    getTemplate: () => [] // TODO: Criar Step09Question08.tsx
  },
  'etapa-10': {
    id: 'etapa-10',
    name: 'Q9: Acessórios',
    type: 'question',
    description: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
    multiSelect: 3,
    getTemplate: () => [] // TODO: Criar Step10Question09.tsx
  },
  'etapa-11': {
    id: 'etapa-11',
    name: 'Q10: Tecidos',
    type: 'question',
    description: 'O QUE MAIS VALORIZAS NOS ACESSÓRIOS?',
    multiSelect: 3,
    getTemplate: () => [] // TODO: Criar Step11Question10.tsx
  },
  'etapa-12': {
    id: 'etapa-12',
    name: 'Transição',
    type: 'transition',
    description: 'Análise dos resultados parciais',
    getTemplate: () => [] // TODO: Criar Step12Transition.tsx
  },
  'etapa-13': {
    id: 'etapa-13',
    name: 'S1: Dificuldades',
    type: 'strategic',
    description: 'Principal dificuldade com roupas',
    getTemplate: () => [] // TODO: Criar Step13Strategic01.tsx
  },
  'etapa-14': {
    id: 'etapa-14',
    name: 'S2: Problemas',
    type: 'strategic',
    description: 'Problemas frequentes de estilo',
    getTemplate: () => [] // TODO: Criar Step14Strategic02.tsx
  },
  'etapa-15': {
    id: 'etapa-15',
    name: 'S3: Frequência',
    type: 'strategic',
    description: '"Com que roupa eu vou?" - frequência',
    getTemplate: () => [] // TODO: Criar Step15Strategic03.tsx
  },
  'etapa-16': {
    id: 'etapa-16',
    name: 'S4: Guia de Estilo',
    type: 'strategic',
    description: 'O que valoriza em um guia',
    getTemplate: () => [] // TODO: Criar Step16Strategic04.tsx
  },
  'etapa-17': {
    id: 'etapa-17',
    name: 'S5: Investimento',
    type: 'strategic',
    description: 'Quanto investiria em consultoria',
    getTemplate: () => [] // TODO: Criar Step17Strategic05.tsx
  },
  'etapa-18': {
    id: 'etapa-18',
    name: 'S6: Ajuda Imediata',
    type: 'strategic',
    description: 'O que mais precisa de ajuda',
    getTemplate: () => [] // TODO: Criar Step18Strategic06.tsx
  },
  'etapa-19': {
    id: 'etapa-19',
    name: 'Transição Final',
    type: 'transition',
    description: 'Analisando suas respostas...',
    getTemplate: () => [] // TODO: Criar Step19TransitionFinal.tsx
  },
  'etapa-20': {
    id: 'etapa-20',
    name: 'Resultado',
    type: 'result',
    description: 'Página de resultado personalizada',
    getTemplate: () => [] // TODO: Criar Step20Results.tsx
  },
  'etapa-21': {
    id: 'etapa-21',
    name: 'Oferta',
    type: 'offer',
    description: 'Apresentação da oferta final',
    getTemplate: () => [] // TODO: Criar Step21Offer.tsx
  }
};

// 🔧 FUNÇÃO PARA OBTER TEMPLATE DE QUALQUER ETAPA
export const getStepTemplate = (stepId: string): any[] => {
  const stepTemplate = STEP_TEMPLATES[stepId];
  if (!stepTemplate) {
    console.error(`❌ Template não encontrado para etapa: ${stepId}`);
    return [];
  }
  
  console.log(`✅ Carregando template da ${stepTemplate.name} (${stepId})`);
  return stepTemplate.getTemplate();
};

// 🗂️ FUNÇÃO PARA OBTER INFORMAÇÕES DA ETAPA
export const getStepInfo = (stepId: string): StepTemplate | null => {
  return STEP_TEMPLATES[stepId] || null;
};

// 📊 FUNÇÃO PARA LISTAR TODAS AS ETAPAS
export const getAllSteps = (): StepTemplate[] => {
  return Object.values(STEP_TEMPLATES);
};
