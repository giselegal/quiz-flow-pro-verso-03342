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
    getTemplate: () => [
      { type: 'vertical-canvas-header', properties: { title: 'Descubra Seu Estilo Único', subtitle: 'Quiz Personalizado de Descoberta de Estilo' } },
      { type: 'text-inline', properties: { content: 'Responda às perguntas e descubra qual estilo combina mais com você!' } },
      { type: 'button-inline', properties: { text: 'Começar Quiz', variant: 'primary' } }
    ]
  },
  2: {
    id: "2",
    name: "Questão 1: Tipo de Roupa Favorita",
    type: "question" as const,
    description: "Qual o seu tipo de roupa favorita?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 2, totalSteps: 21, progress: 10 } },
      { type: 'quiz-question', properties: { title: 'QUAL O SEU TIPO DE ROUPA FAVORITA?', subtitle: 'Selecione até 3 opções' } },
      { type: 'options-grid', properties: { layout: 'grid', columns: 2 } }
    ]
  },
  3: {
    id: "3",
    name: "Questão 2: Personalidade",
    type: "question" as const,
    description: "Como você se definiria em termos de personalidade?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 3, totalSteps: 21, progress: 15 } },
      { type: 'quiz-question', properties: { title: 'COMO VOCÊ SE DEFINIRIA EM TERMOS DE PERSONALIDADE?', subtitle: 'Selecione até 3 opções' } },
      { type: 'options-list', properties: { layout: 'vertical' } }
    ]
  },
  4: {
    id: "4",
    name: "Questão 3: Visual",
    type: "question" as const,
    description: "Qual visual você mais se identifica?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 4, totalSteps: 21, progress: 20 } },
      { type: 'quiz-question', properties: { title: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?', subtitle: 'Selecione até 3 opções' } },
      { type: 'image-grid', properties: { layout: 'grid', columns: 3 } }
    ]
  },
  5: {
    id: "5",
    name: "Questão 4: Estampas",
    type: "question" as const,
    description: "Quais estampas você mais se identifica?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 5, totalSteps: 21, progress: 25 } },
      { type: 'quiz-question', properties: { title: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?', subtitle: 'Selecione até 3 opções' } },
      { type: 'options-grid', properties: { layout: 'grid', columns: 2 } }
    ]
  },
  6: {
    id: "6",
    name: "Questão 5: Casaco Favorito",
    type: "question" as const,
    description: "Qual casaco é seu favorito?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 6, totalSteps: 21, progress: 30 } },
      { type: 'quiz-question', properties: { title: 'QUAL CASACO É SEU FAVORITO?', subtitle: 'Selecione até 3 opções' } },
      { type: 'options-list', properties: { layout: 'vertical' } }
    ]
  },
  7: {
    id: "7",
    name: "Questão 6: Calça Favorita",
    type: "question" as const,
    description: "Qual sua calça favorita?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 7, totalSteps: 21, progress: 35 } },
      { type: 'quiz-question', properties: { title: 'QUAL SUA CALÇA FAVORITA?', subtitle: 'Selecione até 3 opções' } },
      { type: 'options-grid', properties: { layout: 'grid', columns: 2 } }
    ]
  },
  8: {
    id: "8",
    name: "Questão 7: Sapatos",
    type: "question" as const,
    description: "Qual desses sapatos você tem ou mais gosta?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 8, totalSteps: 21, progress: 40 } },
      { type: 'quiz-question', properties: { title: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?', subtitle: 'Selecione até 3 opções' } },
      { type: 'image-grid', properties: { layout: 'grid', columns: 3 } }
    ]
  },
  9: {
    id: "9",
    name: "Questão 8: Acessórios",
    type: "question" as const,
    description: "Quais acessórios você mais usa ou gostaria de usar?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 9, totalSteps: 21, progress: 45 } },
      { type: 'quiz-question', properties: { title: 'QUAIS ACESSÓRIOS VOCÊ MAIS USA OU GOSTARIA DE USAR?', subtitle: 'Selecione até 3 opções' } },
      { type: 'options-list', properties: { layout: 'vertical' } }
    ]
  },
  10: {
    id: "10",
    name: "Questão 9: Tecidos",
    type: "question" as const,
    description: "Qual característica dos tecidos é mais importante para você?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 10, totalSteps: 21, progress: 50 } },
      { type: 'quiz-question', properties: { title: 'QUAL CARACTERÍSTICA DOS TECIDOS É MAIS IMPORTANTE PARA VOCÊ?', subtitle: 'Selecione até 3 opções' } },
      { type: 'options-grid', properties: { layout: 'grid', columns: 2 } }
    ]
  },
  11: {
    id: "11",
    name: "Questão 10: Características dos Tecidos",
    type: "question" as const,
    description: "O que mais valoriza nos tecidos das suas roupas?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 11, totalSteps: 21, progress: 55 } },
      { type: 'quiz-question', properties: { title: 'O QUE MAIS VALORIZA NOS TECIDOS DAS SUAS ROUPAS?', subtitle: 'Selecione até 3 opções' } },
      { type: 'options-list', properties: { layout: 'vertical' } }
    ]
  },
  12: {
    id: "12",
    name: "Meio do Caminho!",
    type: "transition" as const,
    description: "Página de transição motivacional no meio do quiz",
    getTemplate: () => [
      { type: 'vertical-canvas-header', properties: { title: 'Você está indo muito bem!', subtitle: 'Continue assim para descobrir seu estilo' } },
      { type: 'text-inline', properties: { content: 'Suas respostas estão sendo analisadas. Falta pouco para o resultado!' } },
      { type: 'button-inline', properties: { text: 'Continuar Quiz', variant: 'primary' } }
    ]
  },
  13: {
    id: "13",
    name: "Questão 11: Guarda-roupa",
    type: "strategic" as const,
    description: "Quando você olha para o seu guarda-roupa, qual dessas frases te vem à cabeça?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 13, totalSteps: 21, progress: 60 } },
      { type: 'quiz-question', properties: { title: 'QUANDO VOCÊ OLHA PARA O SEU GUARDA-ROUPA, QUAL DESSAS FRASES TE VEM À CABEÇA?', subtitle: 'Selecione uma opção' } },
      { type: 'options-list', properties: { layout: 'vertical' } }
    ]
  },
  14: {
    id: "14",
    name: "Questão 12: Dificuldades para se Arrumar",
    type: "strategic" as const,
    description: "Qual é a sua principal dificuldade na hora de se arrumar para sair?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 14, totalSteps: 21, progress: 65 } },
      { type: 'quiz-question', properties: { title: 'QUAL É A SUA PRINCIPAL DIFICULDADE NA HORA DE SE ARRUMAR PARA SAIR?', subtitle: 'Selecione uma opção' } },
      { type: 'options-list', properties: { layout: 'vertical' } }
    ]
  },
  15: {
    id: "15",
    name: "Questão 13: Prioridades nas Compras",
    type: "strategic" as const,
    description: "Quando você vai comprar roupas, o que mais prioriza?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 15, totalSteps: 21, progress: 70 } },
      { type: 'quiz-question', properties: { title: 'QUANDO VOCÊ VAI COMPRAR ROUPAS, O QUE MAIS PRIORIZA?', subtitle: 'Selecione uma opção' } },
      { type: 'options-list', properties: { layout: 'vertical' } }
    ]
  },
  16: {
    id: "16",
    name: "Questão 14: Critérios de Compra",
    type: "strategic" as const,
    description: "Qual critério é mais importante na hora de escolher uma peça?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 16, totalSteps: 21, progress: 75 } },
      { type: 'quiz-question', properties: { title: 'QUAL CRITÉRIO É MAIS IMPORTANTE NA HORA DE ESCOLHER UMA PEÇA?', subtitle: 'Selecione uma opção' } },
      { type: 'options-list', properties: { layout: 'vertical' } }
    ]
  },
  17: {
    id: "17",
    name: "Questão 15: Orçamento Mensal",
    type: "strategic" as const,
    description: "Qual orçamento você costuma destinar para roupas por mês?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 17, totalSteps: 21, progress: 80 } },
      { type: 'quiz-question', properties: { title: 'QUAL ORÇAMENTO VOCÊ COSTUMA DESTINAR PARA ROUPAS POR MÊS?', subtitle: 'Selecione uma opção' } },
      { type: 'options-list', properties: { layout: 'vertical' } }
    ]
  },
  18: {
    id: "18",
    name: "Questão 16: Investimento em Consultoria",
    type: "strategic" as const,
    description: "Você investiria em consultoria de imagem e estilo?",
    getTemplate: () => [
      { type: 'quiz-progress', properties: { currentStep: 18, totalSteps: 21, progress: 85 } },
      { type: 'quiz-question', properties: { title: 'VOCÊ INVESTIRIA EM CONSULTORIA DE IMAGEM E ESTILO?', subtitle: 'Selecione uma opção' } },
      { type: 'options-list', properties: { layout: 'vertical' } }
    ]
  },
  19: {
    id: "19",
    name: "Análise do seu Estilo",
    type: "transition" as const,
    description: "Analisando suas respostas para definir seu perfil de estilo",
    getTemplate: () => [
      { type: 'vertical-canvas-header', properties: { title: 'Analisando seu Estilo', subtitle: 'Aguarde enquanto processamos suas respostas' } },
      { type: 'text-inline', properties: { content: 'Estamos quase lá! Só mais um momento...' } },
      { type: 'button-inline', properties: { text: 'Ver Resultado', variant: 'primary' } }
    ]
  },
  20: {
    id: "20",
    name: "Seu Resultado Personalizado",
    type: "result" as const,
    description: "Resultado completo com seu perfil de estilo e dicas personalizadas",
    getTemplate: () => [
      { type: 'vertical-canvas-header', properties: { title: 'Seu Resultado Personalizado', subtitle: 'Descubra seu estilo único' } },
      { type: 'text-inline', properties: { content: 'Aqui está o seu perfil de estilo baseado nas suas respostas.' } },
      { type: 'button-inline', properties: { text: 'Baixar Resultado', variant: 'primary' } }
    ]
  },
  21: {
    id: "21",
    name: "Oferta Especial",
    type: "offer" as const,
    description: "Oferta especial do Guia de Estilo Gisele Galvão",
    getTemplate: () => [
      { type: 'vertical-canvas-header', properties: { title: 'Oferta Especial', subtitle: 'Aproveite nosso guia de estilo' } },
      { type: 'text-inline', properties: { content: 'Ganhe um desconto exclusivo no nosso guia de estilo personalizado.' } },
      { type: 'button-inline', properties: { text: 'Aproveitar Oferta', variant: 'primary' } }
    ]
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