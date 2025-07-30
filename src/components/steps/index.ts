// 🎯 CENTRALIZADOR DE TODAS AS ETAPAS
// Este arquivo mapeia cada etapa para seu respectivo template

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
import { getStep20Template } from './Step20Template'; // Corrigido: usar Template
import { getStep21Template } from './Step21Template';

export interface StepTemplate {
  id: string;
  name: string;
  type: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer';
  description: string;
  getTemplate: () => any[];
  component?: React.ComponentType<any>;
  multiSelect?: number;
}

// ✅ MAPEAMENTO COMPLETO: 21 ETAPAS DO QUIZ
export const STEP_TEMPLATES = {
  1: {
    id: "1",
    name: "Bem-vindo ao Quiz",
    type: "intro" as const,
    description: "Página inicial de apresentação do quiz",
    getTemplate: getStep01Template
  },
  2: {
    id: "2",
    name: "Questão 1: Setor de Atuação",
    type: "question" as const,
    description: "Identificação do setor principal de atuação da empresa",
    getTemplate: getStep02Template
  },
  3: {
    id: "3",
    name: "Questão 2: Faturamento Mensal",
    type: "question" as const,
    description: "Definição da faixa de faturamento mensal da empresa",
    getTemplate: getStep03Template
  },
  4: {
    id: "4",
    name: "Questão 3: Equipe",
    type: "question" as const,
    description: "Identificação do tamanho da equipe de trabalho",
    getTemplate: getStep04Template
  },
  5: {
    id: "5",
    name: "Questão 4: Tempo no Mercado",
    type: "question" as const,
    description: "Definição do tempo de atuação no mercado",
    getTemplate: getStep05Template
  },
  6: {
    id: "6",
    name: "Questão 5: Principal Desafio",
    type: "question" as const,
    description: "Identificação do principal desafio enfrentado",
    getTemplate: getStep06Template
  },
  7: {
    id: "7",
    name: "Questão 6: Estratégia Atual",
    type: "question" as const,
    description: "Definição da estratégia de marketing atual",
    getTemplate: getStep07Template
  },
  8: {
    id: "8",
    name: "Questão 7: Orçamento Marketing",
    type: "question" as const,
    description: "Identificação do orçamento destinado ao marketing",
    getTemplate: getStep08Template
  },
  9: {
    id: "9",
    name: "Questão 8: Ferramentas Utilizadas",
    type: "question" as const,
    description: "Definição das ferramentas de marketing utilizadas",
    getTemplate: getStep09Template
  },
  10: {
    id: "10",
    name: "Questão 9: Metas Principais",
    type: "question" as const,
    description: "Identificação das principais metas do negócio",
    getTemplate: getStep10Template
  },
  11: {
    id: "11",
    name: "Questão 10: Maior Frustração",
    type: "question" as const,
    description: "Definição da maior frustração com marketing atual",
    getTemplate: getStep11Template
  },
  12: {
    id: "12",
    name: "Meio do Caminho!",
    type: "transition" as const,
    description: "Página de transição motivacional no meio do quiz",
    getTemplate: getStep12Template
  },
  13: {
    id: "13",
    name: "Questão 11: Canais de Vendas",
    type: "question" as const,
    description: "Identificação dos principais canais de vendas",
    getTemplate: getStep13Template
  },
  14: {
    id: "14",
    name: "Questão 12: Processo de Vendas",
    type: "question" as const,
    description: "Definição do processo de vendas atual",
    getTemplate: getStep14Template
  },
  15: {
    id: "15",
    name: "Questão 13: Acompanhamento Leads",
    type: "question" as const,
    description: "Identificação do processo de acompanhamento de leads",
    getTemplate: getStep15Template
  },
  16: {
    id: "16",
    name: "Questão 14: CRM Utilizado",
    type: "question" as const,
    description: "Definição do CRM ou ferramenta de gestão de clientes",
    getTemplate: getStep16Template
  },
  17: {
    id: "17",
    name: "Questão 15: Conversão de Leads",
    type: "question" as const,
    description: "Identificação da taxa de conversão de leads",
    getTemplate: getStep17Template
  },
  18: {
    id: "18",
    name: "Questão 16: Ticket Médio",
    type: "question" as const,
    description: "Definição do ticket médio de vendas",
    getTemplate: getStep18Template
  },
  19: {
    id: "19",
    name: "Questão 17: Automação",
    type: "question" as const,
    description: "Identificação do nível de automação de processos",
    getTemplate: getStep19Template
  },
  20: {
    id: "20",
    name: "Questão 18: Investimento em Marketing",
    type: "question" as const,
    description: "Definição da disposição para investir em marketing",
    getTemplate: getStep20Template
  },
  21: {
    id: "21",
    name: "Resultado Final",
    type: "result" as const,
    description: "Página de resultado personalizado do quiz",
    getTemplate: getStep21Template
  }
};

// 🔧 FUNÇÃO PARA OBTER TEMPLATE DE QUALQUER ETAPA
export const getStepTemplate = (stepId: string): any[] => {
  console.log(`🔍 [DEBUG] Buscando template para stepId: "${stepId}"`);
  console.log(`🔍 [DEBUG] Tipo de stepId: ${typeof stepId}`);
  console.log(`🔍 [DEBUG] Chaves disponíveis:`, Object.keys(STEP_TEMPLATES));
  
  // Converter stepId para número para acessar o objeto corretamente
  const stepNumber = parseInt(stepId);
  console.log(`🔍 [DEBUG] stepNumber convertido: ${stepNumber}`);
  
  const stepTemplate = STEP_TEMPLATES[stepNumber];
  console.log(`🔍 [DEBUG] Template encontrado:`, stepTemplate ? stepTemplate.name : 'NENHUM');
  
  if (!stepTemplate) {
    console.error(`❌ Template não encontrado para etapa: ${stepId} (número: ${stepNumber})`);
    console.error(`❌ Chaves disponíveis:`, Object.keys(STEP_TEMPLATES));
    return [];
  }
  
  console.log(`✅ Carregando template da ${stepTemplate.name} (${stepId})`);
  
  try {
    const template = stepTemplate.getTemplate();
    console.log(`🎯 [DEBUG] Template carregado com ${template.length} blocos`);
    return template;
  } catch (error) {
    console.error(`❌ Erro ao executar getTemplate para step ${stepId}:`, error);
    return [];
  }
};

// 🗂️ FUNÇÃO PARA OBTER INFORMAÇÕES DA ETAPA
export const getStepInfo = (stepId: string): StepTemplate | null => {
  const stepNumber = parseInt(stepId);
  return STEP_TEMPLATES[stepNumber] || null;
};

// 📊 FUNÇÃO PARA LISTAR TODAS AS ETAPAS
export const getAllSteps = (): StepTemplate[] => {
  return Object.values(STEP_TEMPLATES);
};
