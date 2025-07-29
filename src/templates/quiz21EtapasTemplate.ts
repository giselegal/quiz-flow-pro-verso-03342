import { EditorConfig, EditorBlock } from '../types/editor';

/**
 * Template inicial com as 21 etapas do quiz completas
 * Baseado no sistema real de quiz de estilo pessoal
 */
export const getInitialQuiz21EtapasTemplate = (): EditorConfig => {
  const blocks: EditorBlock[] = [
    // === ETAPA 1: INTRODUÇÃO ===
    {
      id: 'etapa-1-intro',
      type: 'quiz-start-page-inline',
      content: {
        title: 'Descubra Seu Estilo Pessoal',
        subtitle: 'Um quiz completo para descobrir o estilo que combina com você',
        description: 'Responda 21 perguntas e receba um guia personalizado baseado no seu perfil único',
        ctaText: 'Começar Quiz',
        backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        showProgress: true,
        progressValue: 5
      },
      order: 1
    },

    // === ETAPAS 2-11: QUESTÕES PRINCIPAIS ===
    ...Array.from({ length: 10 }, (_, index) => ({
      id: `etapa-${index + 2}-questao`,
      type: 'quiz-question',
      content: {
        title: `Questão ${index + 1}`,
        question: getQuizQuestion(index + 1),
        options: getQuizOptions(index + 1),
        allowMultiple: false,
        showImages: true,
        progressValue: 10 + (index * 5),
        category: 'quiz-principal'
      },
      order: index + 2
    })) as EditorBlock[],

    // === ETAPA 12: TRANSIÇÃO ===
    {
      id: 'etapa-12-transicao',
      type: 'quiz-transition',
      content: {
        title: 'Analisando suas respostas...',
        description: 'Agora vamos aprofundar um pouco mais para criar seu perfil personalizado',
        loadingText: 'Processando dados',
        progressValue: 60
      },
      order: 12
    },

    // === ETAPAS 13-18: QUESTÕES ESTRATÉGICAS ===
    ...Array.from({ length: 6 }, (_, index) => ({
      id: `etapa-${index + 13}-estrategica`,
      type: 'strategic-question-main',
      content: {
        title: `Questão Estratégica ${index + 1}`,
        question: getStrategicQuestion(index + 1),
        options: getStrategicOptions(index + 1),
        allowMultiple: false,
        showImages: false,
        progressValue: 65 + (index * 5),
        category: 'estrategica'
      },
      order: index + 13
    })) as EditorBlock[],

    // === ETAPA 19: TRANSIÇÃO FINAL ===
    {
      id: 'etapa-19-transicao-final',
      type: 'quiz-transition',
      content: {
        title: 'Quase lá!',
        description: 'Calculando seu resultado personalizado...',
        loadingText: 'Finalizando análise',
        progressValue: 95
      },
      order: 19
    },

    // === ETAPA 20: RESULTADO ===
    {
      id: 'etapa-20-resultado',
      type: 'quiz-final-results-inline',
      content: {
        title: 'Seu Estilo Pessoal',
        resultType: 'dinamico',
        showPrimaryStyle: true,
        showSecondaryStyles: true,
        showPercentages: true,
        showRecommendations: true,
        showBeforeAfter: true,
        ctaText: 'Quero Aprender Mais',
        progressValue: 100
      },
      order: 20
    },

    // === ETAPA 21: OFERTA ===
    {
      id: 'etapa-21-oferta',
      type: 'quiz-offer-pricing-inline',
      content: {
        title: 'Transforme Seu Estilo Agora',
        subtitle: 'Consultoria personalizada baseada no seu resultado',
        originalPrice: 'R$ 497,00',
        salePrice: 'R$ 197,00',
        discount: '60% OFF',
        features: [
          'Análise completa do seu estilo',
          'Guia de combinações personalizado',
          'Lista de compras inteligente',
          'Consultoria de 1 hora',
          'Suporte por 30 dias'
        ],
        ctaText: 'Quero Minha Consultoria',
        urgencyText: 'Oferta válida apenas hoje!',
        showTestimonials: true,
        showGuarantee: true
      },
      order: 21
    }
  ].flat();

  return {
    blocks,
    globalStyles: {
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
      textColor: '#1f2937',
      accentColor: '#3b82f6',
      secondaryColor: '#6b7280'
    },
    settings: {
      showLogo: true,
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      siteTitle: 'Quiz de Estilo Pessoal',
      favicon: '/favicon.ico'
    }
  };
};

// Funções auxiliares para gerar conteúdo das questões
function getQuizQuestion(index: number): string {
  const questions = [
    'Qual dessas opções melhor descreve seu estilo atual?',
    'Em que ocasião você se sente mais confiante?',
    'Qual peça de roupa você nunca tiraria do guarda-roupa?',
    'Como você gosta de se expressar através da moda?',
    'Qual é sua prioridade ao escolher um look?',
    'Que tipo de cores você mais usa?',
    'Como você se veste para trabalhar?',
    'Qual acessório é indispensável para você?',
    'Como você escolhe suas roupas pela manhã?',
    'Qual estilo mais combina com sua personalidade?'
  ];
  return questions[index - 1] || `Questão ${index}`;
}

function getQuizOptions(index: number): Array<{ id: string; text: string; image?: string; category: string; weight: number }> {
  const allOptions = [
    // Questão 1
    [
      { id: 'q1-a', text: 'Elegante e sofisticado', category: 'elegante', weight: 3 },
      { id: 'q1-b', text: 'Casual e confortável', category: 'casual', weight: 3 },
      { id: 'q1-c', text: 'Criativo e único', category: 'criativo', weight: 3 },
      { id: 'q1-d', text: 'Clássico e atemporal', category: 'classico', weight: 3 }
    ],
    // Questão 2
    [
      { id: 'q2-a', text: 'Em eventos formais', category: 'elegante', weight: 2 },
      { id: 'q2-b', text: 'No dia a dia relaxado', category: 'casual', weight: 2 },
      { id: 'q2-c', text: 'Em situações criativas', category: 'criativo', weight: 2 },
      { id: 'q2-d', text: 'Em ambientes profissionais', category: 'classico', weight: 2 }
    ],
    // Adicionar mais questões conforme necessário...
  ];
  
  return allOptions[index - 1] || [
    { id: `q${index}-a`, text: 'Opção A', category: 'default', weight: 1 },
    { id: `q${index}-b`, text: 'Opção B', category: 'default', weight: 1 },
    { id: `q${index}-c`, text: 'Opção C', category: 'default', weight: 1 },
    { id: `q${index}-d`, text: 'Opção D', category: 'default', weight: 1 }
  ];
}

function getStrategicQuestion(index: number): string {
  const questions = [
    'Qual é seu maior desafio com o guarda-roupa?',
    'Como seria sua situação ideal?',
    'Quanto investiria para transformar seu estilo?',
    'O que mais te motiva a mudar?',
    'Quão urgente é essa transformação?',
    'Qual resultado você mais espera?'
  ];
  return questions[index - 1] || `Questão Estratégica ${index}`;
}

function getStrategicOptions(index: number): Array<{ id: string; text: string; category: string; weight: number }> {
  const allOptions = [
    // Questão Estratégica 1
    [
      { id: `s1-a`, text: 'Não sei combinar as peças', category: 'conhecimento', weight: 2 },
      { id: `s1-b`, text: 'Compro coisas que não uso', category: 'planejamento', weight: 2 },
      { id: `s1-c`, text: 'Sempre me sinto inadequada', category: 'confianca', weight: 2 },
      { id: `s1-d`, text: 'Não sei qual é meu estilo', category: 'identidade', weight: 2 }
    ],
    // Adicionar mais questões estratégicas...
  ];
  
  return allOptions[index - 1] || [
    { id: `s${index}-a`, text: 'Opção A', category: 'default', weight: 1 },
    { id: `s${index}-b`, text: 'Opção B', category: 'default', weight: 1 },
    { id: `s${index}-c`, text: 'Opção C', category: 'default', weight: 1 },
    { id: `s${index}-d`, text: 'Opção D', category: 'default', weight: 1 }
  ];
}
