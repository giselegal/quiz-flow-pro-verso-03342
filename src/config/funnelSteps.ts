import type { FunnelStepType } from '@/types/funnel';

export interface FunnelStepConfig {
  id: string;
  stepNumber: number;
  stepType: FunnelStepType;
  title: string;
  description: string;
  defaultContent: any;
  requiredFields: string[];
  nextStepConditions?: any;
}

export const FUNNEL_STEPS_CONFIG: FunnelStepConfig[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    stepType: 'intro',
    title: 'Introdução ao Quiz',
    description: 'Página inicial que apresenta o quiz e motiva o usuário a começar',
    defaultContent: {
      title: 'Descubra Seu Estilo Pessoal',
      subtitle: 'Um quiz personalizado para descobrir seu estilo único',
      buttonText: 'Iniciar Quiz',
      backgroundColor: '#faf8f5',
      textColor: '#432818',
    },
    requiredFields: ['title', 'buttonText'],
  },
  {
    id: 'step-2',
    stepNumber: 2,
    stepType: 'name-collect',
    title: 'Coleta de Nome',
    description: 'Coleta o nome do usuário para personalização',
    defaultContent: {
      title: 'Vamos começar!',
      subtitle: 'Como podemos te chamar?',
      placeholder: 'Digite seu nome',
      buttonText: 'Continuar',
      isRequired: true,
    },
    requiredFields: ['title', 'placeholder'],
  },
  {
    id: 'step-3',
    stepNumber: 3,
    stepType: 'quiz-intro',
    title: 'Introdução às Perguntas',
    description: 'Prepara o usuário para as perguntas do quiz',
    defaultContent: {
      title: 'Agora vamos descobrir seu estilo!',
      subtitle: 'Responda às próximas perguntas com sinceridade',
      buttonText: 'Começar Perguntas',
      estimatedTime: '3 minutos',
    },
    requiredFields: ['title', 'buttonText'],
  },
  // Etapas 4-14: Perguntas múltiplas
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `step-${i + 4}`,
    stepNumber: i + 4,
    stepType: 'question-multiple' as FunnelStepType,
    title: `Pergunta ${i + 1}`,
    description: `Pergunta ${i + 1} do quiz principal`,
    defaultContent: {
      question: `Qual é sua pergunta ${i + 1}?`,
      options: [
        { id: '1', text: 'Opção A', value: 'a' },
        { id: '2', text: 'Opção B', value: 'b' },
        { id: '3', text: 'Opção C', value: 'c' },
        { id: '4', text: 'Opção D', value: 'd' },
      ],
      multiSelect: false,
      isRequired: true,
    },
    requiredFields: ['question', 'options'],
  })),
  {
    id: 'step-15',
    stepNumber: 15,
    stepType: 'quiz-transition',
    title: 'Transição do Quiz',
    description: 'Transição entre as perguntas principais e estratégicas',
    defaultContent: {
      title: 'Analisando suas respostas...',
      subtitle: 'Vamos agora entender melhor seu perfil',
      loadingText: 'Calculando compatibilidade...',
      duration: 3000,
    },
    requiredFields: ['title'],
  },
  {
    id: 'step-16',
    stepNumber: 16,
    stepType: 'processing',
    title: 'Processamento',
    description: 'Simula o processamento dos dados do quiz',
    defaultContent: {
      title: 'Processando seu resultado...',
      messages: [
        'Analisando suas preferências...',
        'Calculando compatibilidade...',
        'Preparando resultado personalizado...',
      ],
      showProgress: true,
      duration: 5000,
    },
    requiredFields: ['title', 'messages'],
  },
  {
    id: 'step-17',
    stepNumber: 17,
    stepType: 'result-intro',
    title: 'Introdução ao Resultado',
    description: 'Apresenta o resultado do quiz',
    defaultContent: {
      title: 'Seu resultado está pronto!',
      subtitle: 'Descobrimos muito sobre seu estilo pessoal',
      buttonText: 'Ver Meu Resultado',
      showAnimation: true,
    },
    requiredFields: ['title', 'buttonText'],
  },
  {
    id: 'step-18',
    stepNumber: 18,
    stepType: 'result-details',
    title: 'Detalhes do Resultado',
    description: 'Mostra os detalhes do estilo identificado',
    defaultContent: {
      showStyleName: true,
      showPercentage: true,
      showCharacteristics: true,
      showRecommendations: true,
      ctaText: 'Quero Saber Mais',
      ctaButtonStyle: 'primary',
    },
    requiredFields: ['ctaText'],
  },
  {
    id: 'step-19',
    stepNumber: 19,
    stepType: 'result-guide',
    title: 'Guia do Resultado',
    description: 'Oferece um guia baseado no resultado',
    defaultContent: {
      title: 'Seu Guia Personalizado',
      subtitle: 'Dicas específicas para seu estilo',
      guidePreview: true,
      showBenefits: true,
      ctaText: 'Quero Meu Guia Completo',
    },
    requiredFields: ['title', 'ctaText'],
  },
  {
    id: 'step-20',
    stepNumber: 20,
    stepType: 'offer-transition',
    title: 'Transição para Oferta',
    description: 'Prepara a apresentação da oferta',
    defaultContent: {
      title: 'Oferta Especial Para Você',
      subtitle: 'Baseada no seu resultado personalizado',
      urgencyText: 'Oferta limitada',
      buttonText: 'Ver Oferta',
      showCountdown: true,
    },
    requiredFields: ['title', 'buttonText'],
  },
  {
    id: 'step-21',
    stepNumber: 21,
    stepType: 'offer-page',
    title: 'Página da Oferta',
    description: 'Apresenta a oferta final com call-to-action',
    defaultContent: {
      title: 'Transforme Seu Estilo Hoje',
      subtitle: 'Guia Completo Personalizado',
      price: 'R$ 97,00',
      originalPrice: 'R$ 197,00',
      discount: '50% OFF',
      benefits: [
        'Análise completa do seu estilo',
        'Guia de combinações personalizadas',
        'Dicas de compras inteligentes',
        'Suporte por 30 dias',
      ],
      ctaText: 'Quero Transformar Meu Estilo',
      guarantee: '7 dias de garantia',
      showCountdown: true,
      countdownMinutes: 15,
    },
    requiredFields: ['title', 'price', 'ctaText'],
  },
];

export const getStepConfig = (stepNumber: number): FunnelStepConfig | undefined => {
  return FUNNEL_STEPS_CONFIG.find(step => step.stepNumber === stepNumber);
};

export const getStepsByType = (stepType: FunnelStepType): FunnelStepConfig[] => {
  return FUNNEL_STEPS_CONFIG.filter(step => step.stepType === stepType);
};

export const getTotalSteps = (): number => {
  return FUNNEL_STEPS_CONFIG.length;
};

export const getDefaultContentForFunnelStep = (stepType: string) => {
  const stepConfig = FUNNEL_STEPS_CONFIG.find(step => step.stepType === stepType);
  return stepConfig ? stepConfig.defaultContent : {};
};
