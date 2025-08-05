import { QuestionConfig } from './DynamicStepTemplate';

// 🎯 CONFIGURAÇÕES DOS 21 STEPS - DADOS DINÂMICOS
// Substitui todos os Step01Template.tsx → Step21Template.tsx

export const STEP_CONFIGURATIONS: Record<string, QuestionConfig> = {
  
  // STEP 01 - Introdução
  step01: {
    id: "step01",
    title: "BEM-VINDA AO SEU QUIZ PESSOAL!",
    subtitle: "Vamos descobrir qual é o seu estilo único em algumas perguntas rápidas",
    questionNumber: 1,
    totalQuestions: 10,
    options: [
      {
        id: "intro_start",
        text: "Vamos começar!",
        value: "start",
        category: "Introdução",
        styleCategory: "Inicio",
        points: 0
      }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 02 - Tipo de roupa favorita
  step02: {
    id: "step02", 
    title: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
    subtitle: "Escolha a opção que mais representa seu estilo no dia a dia",
    questionNumber: 2,
    totalQuestions: 10,
    options: [
      {
        id: "2a",
        text: "Peças confortáveis e práticas (jeans, camisetas, tênis)",
        value: "2a",
        category: "Natural",
        styleCategory: "Natural",
        points: 1
      },
      {
        id: "2b", 
        text: "Roupas clássicas e elegantes (blazers, calças sociais)",
        value: "2b",
        category: "Clássico", 
        styleCategory: "Clássico",
        points: 1
      },
      {
        id: "2c",
        text: "Looks modernos e trendy (peças da moda atual)",
        value: "2c", 
        category: "Contemporâneo",
        styleCategory: "Contemporâneo", 
        points: 1
      },
      {
        id: "2d",
        text: "Roupas sofisticadas e luxuosas (peças de marca, tecidos nobres)",
        value: "2d",
        category: "Elegante",
        styleCategory: "Elegante",
        points: 1
      }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 03 - Personalidade
  step03: {
    id: "step03",
    title: "RESUMA A SUA PERSONALIDADE:",
    subtitle: "Como você se descreveria para alguém que acabou de conhecer?",
    questionNumber: 3, 
    totalQuestions: 10,
    options: [
      {
        id: "3a",
        text: "Informal, espontânea, alegre, essencialista",
        value: "3a",
        category: "Natural",
        styleCategory: "Natural", 
        points: 1
      },
      {
        id: "3b",
        text: "Conservadora, séria, organizada",
        value: "3b", 
        category: "Clássico",
        styleCategory: "Clássico",
        points: 1
      },
      {
        id: "3c",
        text: "Informada, ativa, prática", 
        value: "3c",
        category: "Contemporâneo",
        styleCategory: "Contemporâneo",
        points: 1
      },
      {
        id: "3d",
        text: "Exigente, sofisticada, seletiva",
        value: "3d",
        category: "Elegante", 
        styleCategory: "Elegante",
        points: 1
      }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 04 - Cores favoritas  
  step04: {
    id: "step04",
    title: "QUAIS CORES VOCÊ MAIS USA?",
    subtitle: "Selecione as cores que mais aparecem no seu guarda-roupa",
    questionNumber: 4,
    totalQuestions: 10, 
    options: [
      {
        id: "4a",
        text: "Tons neutros (bege, marrom, off-white)",
        value: "4a",
        category: "Natural",
        styleCategory: "Natural",
        points: 1
      },
      {
        id: "4b",
        text: "Cores clássicas (preto, branco, azul marinho)",
        value: "4b",
        category: "Clássico", 
        styleCategory: "Clássico",
        points: 1
      },
      {
        id: "4c", 
        text: "Cores vibrantes e da moda",
        value: "4c",
        category: "Contemporâneo",
        styleCategory: "Contemporâneo",
        points: 1
      },
      {
        id: "4d",
        text: "Tons sofisticados (burgundy, dourado, prata)",
        value: "4d", 
        category: "Elegante",
        styleCategory: "Elegante",
        points: 1
      }
    ],
    layout: 'grid-2',
    allowMultiple: true,
    showImages: false
  },

  // STEP 05 - Ocasião especial
  step05: {
    id: "step05",
    title: "PARA UMA OCASIÃO ESPECIAL, VOCÊ ESCOLHERIA:",
    subtitle: "Imagine um evento importante na sua vida profissional ou pessoal",
    questionNumber: 5,
    totalQuestions: 10,
    options: [
      {
        id: "5a", 
        text: "Um look confortável mas arrumado",
        value: "5a",
        category: "Natural",
        styleCategory: "Natural",
        points: 1
      },
      {
        id: "5b",
        text: "Uma peça clássica e atemporal", 
        value: "5b",
        category: "Clássico",
        styleCategory: "Clássico", 
        points: 1
      },
      {
        id: "5c",
        text: "Algo moderno e estiloso",
        value: "5c",
        category: "Contemporâneo",
        styleCategory: "Contemporâneo",
        points: 1
      },
      {
        id: "5d",
        text: "Uma peça sofisticada e impactante",
        value: "5d",
        category: "Elegante",
        styleCategory: "Elegante", 
        points: 1
      }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 06-10: Continua com mesmo padrão...
  // Por questão de espaço, vou mostrar mais alguns exemplos

  step06: {
    id: "step06",
    title: "SEU ESTILO DE VIDA É MAIS:",
    questionNumber: 6,
    totalQuestions: 10,
    options: [
      { id: "6a", text: "Descontraído e flexível", value: "6a", category: "Natural", styleCategory: "Natural", points: 1 },
      { id: "6b", text: "Estruturado e organizado", value: "6b", category: "Clássico", styleCategory: "Clássico", points: 1 },
      { id: "6c", text: "Dinâmico e conectado", value: "6c", category: "Contemporâneo", styleCategory: "Contemporâneo", points: 1 },
      { id: "6d", text: "Refinado e exclusivo", value: "6d", category: "Elegante", styleCategory: "Elegante", points: 1 }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  step07: {
    id: "step07", 
    title: "QUANDO VAI ÀS COMPRAS, VOCÊ:",
    questionNumber: 7,
    totalQuestions: 10,
    options: [
      { id: "7a", text: "Compra o que precisa, sem complicação", value: "7a", category: "Natural", styleCategory: "Natural", points: 1 },
      { id: "7b", text: "Escolhe peças que durem muito tempo", value: "7b", category: "Clássico", styleCategory: "Clássico", points: 1 },
      { id: "7c", text: "Procura as últimas tendências", value: "7c", category: "Contemporâneo", styleCategory: "Contemporâneo", points: 1 },
      { id: "7d", text: "Investe em peças especiais e únicas", value: "7d", category: "Elegante", styleCategory: "Elegante", points: 1 }
    ],
    layout: 'grid-2', 
    allowMultiple: false,
    showImages: false
  },

  step08: {
    id: "step08",
    title: "SEU ACESSÓRIO FAVORITO É:",
    questionNumber: 8,
    totalQuestions: 10,
    options: [
      { id: "8a", text: "Uma bolsa prática e confortável", value: "8a", category: "Natural", styleCategory: "Natural", points: 1 },
      { id: "8b", text: "Um relógio clássico ou pérolas", value: "8b", category: "Clássico", styleCategory: "Clássico", points: 1 },
      { id: "8c", text: "Acessórios da moda atual", value: "8c", category: "Contemporâneo", styleCategory: "Contemporâneo", points: 1 },
      { id: "8d", text: "Joias finas e exclusivas", value: "8d", category: "Elegante", styleCategory: "Elegante", points: 1 }
    ],
    layout: 'grid-2',
    allowMultiple: false, 
    showImages: false
  },

  step09: {
    id: "step09",
    title: "SEU AMBIENTE IDEAL PARA TRABALHAR É:",
    questionNumber: 9,
    totalQuestions: 10,
    options: [
      { id: "9a", text: "Um espaço aconchegante e descontraído", value: "9a", category: "Natural", styleCategory: "Natural", points: 1 },
      { id: "9b", text: "Um escritório formal e organizado", value: "9b", category: "Clássico", styleCategory: "Clássico", points: 1 },
      { id: "9c", text: "Um ambiente moderno e tecnológico", value: "9c", category: "Contemporâneo", styleCategory: "Contemporâneo", points: 1 },
      { id: "9d", text: "Um espaço luxuoso e exclusivo", value: "9d", category: "Elegante", styleCategory: "Elegante", points: 1 }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  step10: {
    id: "step10",
    title: "QUAL FRASE MAIS COMBINA COM VOCÊ?",
    questionNumber: 10, 
    totalQuestions: 10,
    options: [
      { id: "10a", text: "Simplicidade é o máximo da sofisticação", value: "10a", category: "Natural", styleCategory: "Natural", points: 1 },
      { id: "10b", text: "Elegância nunca sai de moda", value: "10b", category: "Clássico", styleCategory: "Clássico", points: 1 },
      { id: "10c", text: "Estilo é uma forma de expressar quem você é", value: "10c", category: "Contemporâneo", styleCategory: "Contemporâneo", points: 1 },
      { id: "10d", text: "Luxo é uma questão de detalhes", value: "10d", category: "Elegante", styleCategory: "Elegante", points: 1 }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 11 - Tecidos
  step11: {
    id: "step11",
    title: "VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...",
    subtitle: "Como você seleciona suas roupas?",
    questionNumber: 11,
    totalQuestions: 21,
    options: [
      { id: "11a", text: "São confortáveis e práticos", value: "11a", category: "Natural", styleCategory: "Natural", points: 1 },
      { id: "11b", text: "São elegantes e sofisticados", value: "11b", category: "Clássico", styleCategory: "Clássico", points: 1 },
      { id: "11c", text: "São modernos e inovadores", value: "11c", category: "Contemporâneo", styleCategory: "Contemporâneo", points: 1 },
      { id: "11d", text: "São luxuosos e refinados", value: "11d", category: "Elegante", styleCategory: "Elegante", points: 1 }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 12 - Transição Pessoal
  step12: {
    id: "step12",
    title: "AGORA VAMOS CONHECER VOCÊ MELHOR",
    subtitle: "Algumas perguntas sobre sua personalidade",
    questionNumber: 12,
    totalQuestions: 21,
    options: [
      { id: "12a", text: "Vamos continuar!", value: "12a", category: "Transição", styleCategory: "Transição", points: 0 }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 13 - Guarda-Roupa
  step13: {
    id: "step13",
    title: "QUANDO VOCÊ OLHA PARA O SEU GUARDA-ROUPA, QUAL DESSAS FRASES TE VEM A CABEÇA?",
    subtitle: "Como você vê suas roupas?",
    questionNumber: 13,
    totalQuestions: 21,
    options: [
      { id: "13a", text: "Tenho tudo que preciso", value: "13a", category: "Natural", styleCategory: "Natural", points: 1 },
      { id: "13b", text: "Preciso de mais variedade", value: "13b", category: "Dramático", styleCategory: "Dramático", points: 1 },
      { id: "13c", text: "Gosto de experimentar coisas novas", value: "13c", category: "Contemporâneo", styleCategory: "Contemporâneo", points: 1 },
      { id: "13d", text: "Busco peças especiais e únicas", value: "13d", category: "Elegante", styleCategory: "Elegante", points: 1 }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 14 - Pergunta Final
  step14: {
    id: "step14",
    title: "ÚLTIMA PERGUNTA!",
    subtitle: "Finalizando seu perfil de estilo",
    questionNumber: 14,
    totalQuestions: 21,
    options: [
      { id: "14a", text: "Estou pronta para o resultado!", value: "14a", category: "Final", styleCategory: "Final", points: 1 }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 15 - Transição
  step15: {
    id: "step15",
    title: "PROCESSANDO SUAS RESPOSTAS...",
    subtitle: "Analisando seu perfil único",
    questionNumber: 15,
    totalQuestions: 21,
    options: [
      { id: "15a", text: "Ver resultado", value: "15a", category: "Processamento", styleCategory: "Processamento", points: 0 }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 16 - Processamento
  step16: {
    id: "step16",
    title: "ANALISANDO SEU PERFIL...",
    subtitle: "Descobrindo seu estilo único",
    questionNumber: 16,
    totalQuestions: 21,
    options: [
      { id: "16a", text: "Continuar", value: "16a", category: "Análise", styleCategory: "Análise", points: 0 }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 17 - Resultado
  step17: {
    id: "step17",
    title: "SEU RESULTADO PERSONALIZADO",
    subtitle: "Descubra seu estilo único",
    questionNumber: 17,
    totalQuestions: 21,
    options: [
      { id: "17a", text: "Ver detalhes do meu estilo", value: "17a", category: "Resultado", styleCategory: "Resultado", points: 0 }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 18 - Detalhes
  step18: {
    id: "step18",
    title: "DETALHES DO SEU ESTILO",
    subtitle: "Características principais do seu perfil",
    questionNumber: 18,
    totalQuestions: 21,
    options: [
      { id: "18a", text: "Ver guia personalizado", value: "18a", category: "Detalhes", styleCategory: "Detalhes", points: 0 }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 19 - Guia
  step19: {
    id: "step19",
    title: "SEU GUIA PERSONALIZADO",
    subtitle: "Dicas específicas para o seu estilo",
    questionNumber: 19,
    totalQuestions: 21,
    options: [
      { id: "19a", text: "Ver oferta especial", value: "19a", category: "Guia", styleCategory: "Guia", points: 0 }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // STEP 20 - Oferta
  step20: {
    id: "step20",
    title: "OFERTA ESPECIAL PARA VOCÊ!",
    subtitle: "Consultoria personalizada com desconto",
    questionNumber: 20,
    totalQuestions: 21,
    options: [
      { id: "20a", text: "Quero aproveitar a oferta", value: "20a", category: "Oferta", styleCategory: "Oferta", points: 0 },
      { id: "20b", text: "Finalizar quiz", value: "20b", category: "Finalizar", styleCategory: "Finalizar", points: 0 }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  },

  // RESULTADO - Step 21 
  step21: {
    id: "step21",
    title: "🎉 DESCOBRINDO SEU RESULTADO...",
    subtitle: "Analisando suas respostas para revelar seu estilo único",
    questionNumber: 11,
    totalQuestions: 10,
    options: [
      {
        id: "result_loading",
        text: "Ver meu resultado agora!",
        value: "show_result", 
        category: "Resultado",
        styleCategory: "Final",
        points: 0
      }
    ],
    layout: 'grid-2',
    allowMultiple: false,
    showImages: false
  }
};

// 🎯 FUNÇÃO PARA OBTER CONFIGURAÇÃO DE UM STEP
export const getStepConfiguration = (stepId: string): QuestionConfig | null => {
  return STEP_CONFIGURATIONS[stepId] || null;
};

// 🎯 FUNÇÃO PARA OBTER TODOS OS STEPS
export const getAllSteps = (): QuestionConfig[] => {
  return Object.values(STEP_CONFIGURATIONS);
};

// 🎯 FUNÇÃO PARA CALCULAR PROGRESSO
export const calculateProgress = (currentStep: number, totalSteps: number = 10): number => {
  return Math.round((currentStep / totalSteps) * 100);
};

export default STEP_CONFIGURATIONS;
