export interface StepTemplate {
  id: string;
  name: string;
  type: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer';
  description: string;
  getTemplate: () => any[];
  component?: React.ComponentType<any>;
  multiSelect?: number;
}

// ✅ MAPEAMENTO COMPLETO: 21 ETAPAS DO QUIZ DE ESTILO GISELE GALVÃO
export const STEP_TEMPLATES = {
  1: {
    id: "1",
    name: "Bem-vinda ao Quiz",
    type: "intro" as const,
    description: "Página inicial de apresentação do quiz de estilo",
    getTemplate: getStep01Template
  },
  2: {
    id: "2",
    name: "Questão 1: Tipo de Roupa Favorita",
    type: "question" as const,
    description: "Qual o seu tipo de roupa favorita?",
    getTemplate: getStep02Template
  },
  3: {
    id: "3",
    name: "Questão 2: Personalidade",
    type: "question" as const,
    description: "Como você se definiria em termos de personalidade?",
    getTemplate: getStep03Template
  },
  4: {
    id: "4",
    name: "Questão 3: Visual",
    type: "question" as const,
    description: "Qual visual você mais se identifica?",
    getTemplate: getStep04Template
  },
  5: {
    id: "5",
    name: "Questão 4: Estampas",
    type: "question" as const,
    description: "Quais estampas você mais se identifica?",
    getTemplate: getStep05Template
  },
  6: {
    id: "6",
    name: "Questão 5: Casaco Favorito",
    type: "question" as const,
    description: "Qual casaco é seu favorito?",
    getTemplate: getStep06Template
  },
  7: {
    id: "7",
    name: "Questão 6: Calça Favorita",
    type: "question" as const,
    description: "Qual sua calça favorita?",
    getTemplate: getStep07Template
  },
  8: {
    id: "8",
    name: "Questão 7: Sapatos",
    type: "question" as const,
    description: "Qual desses sapatos você tem ou mais gosta?",
    getTemplate: getStep08Template
  },
  9: {
    id: "9",
    name: "Questão 8: Acessórios",
    type: "question" as const,
    description: "Quais acessórios você mais usa ou gostaria de usar?",
    getTemplate: getStep09Template
  },
  10: {
    id: "10",
    name: "Questão 9: Tecidos",
    type: "question" as const,
    description: "Qual característica dos tecidos é mais importante para você?",
    getTemplate: getStep10Template
  },
  11: {
    id: "11",
    name: "Questão 10: Características dos Tecidos",
    type: "question" as const,
    description: "O que mais valoriza nos tecidos das suas roupas?",
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
    name: "Questão 11: Guarda-roupa",
    type: "strategic" as const,
    description: "Quando você olha para o seu guarda-roupa, qual dessas frases te vem à cabeça?",
    getTemplate: getStep13Template
  },
  14: {
    id: "14",
    name: "Questão 12: Dificuldades para se Arrumar",
    type: "strategic" as const,
    description: "Qual é a sua principal dificuldade na hora de se arrumar para sair?",
    getTemplate: getStep14Template
  },
  15: {
    id: "15",
    name: "Questão 13: Prioridades nas Compras",
    type: "strategic" as const,
    description: "Quando você vai comprar roupas, o que mais prioriza?",
    getTemplate: getStep15Template
  },
  16: {
    id: "16",
    name: "Questão 14: Critérios de Compra",
    type: "strategic" as const,
    description: "Qual critério é mais importante na hora de escolher uma peça?",
    getTemplate: getStep16Template
  },
  17: {
    id: "17",
    name: "Questão 15: Orçamento Mensal",
    type: "strategic" as const,
    description: "Qual orçamento você costuma destinar para roupas por mês?",
    getTemplate: getStep17Template
  },
  18: {
    id: "18",
    name: "Questão 16: Investimento em Consultoria",
    type: "strategic" as const,
    description: "Você investiria em consultoria de imagem e estilo?",
    getTemplate: getStep18Template
  },
  19: {
    id: "19",
    name: "Análise do seu Estilo",
    type: "transition" as const,
    description: "Analisando suas respostas para definir seu perfil de estilo",
    getTemplate: getStep19Template
  },
  20: {
    id: "20",
    name: "Seu Resultado Personalizado",
    type: "result" as const,
    description: "Resultado completo com seu perfil de estilo e dicas personalizadas",
    getTemplate: getStep20Template
  },
  21: {
    id: "21",
    name: "Oferta Especial",
    type: "offer" as const,
    description: "Oferta especial do Guia de Estilo Gisele Galvão",
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