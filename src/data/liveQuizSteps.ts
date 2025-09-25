/**
 * ETAPAS REAIS DO QUIZ MAPEADAS DIRETAMENTE DAS ROTAS FUNCIONAIS
 * Este arquivo mapeia exatamente as etapas que funcionam em /quiz, /resultado e /quiz-descubra-seu-estilo
 */

import caktoquizQuestions from './caktoquizQuestions';
import { QuizQuestion } from '@/types/quiz';

// ETAPA 1: Quiz Intro (componente QuizIntro)
export const LIVE_QUIZ_INTRO = {
  id: 'quiz-intro',
  title: 'Descubra Seu Estilo Pessoal',
  type: 'intro' as const,
  component: 'QuizIntro',
  route: '/quiz',
  liveProps: {
    onStart: '(nome: string) => void',
    showingIntro: 'useState(true)',
  },
  renderData: {
    title: 'Descubra Seu Estilo Pessoal',
    subtitle: 'Um quiz personalizado para descobrir seu estilo único',
    inputPlaceholder: 'Digite seu nome',
    buttonText: 'Iniciar Quiz',
    backgroundColor: '#faf8f5',
    textColor: '#432818',
  },
};

// ETAPAS 2-10: Questões do Quiz (componente QuizContent)
export const LIVE_QUIZ_QUESTIONS = caktoquizQuestions.map(
  (question: QuizQuestion, index: number) => ({
    id: `quiz-question-${question.id}`,
    title: question.text || 'Question',
    type: 'question' as const,
    component: 'QuizContent',
    route: '/quiz',
    questionIndex: index,
    progress: Math.round(((index + 1) / caktoquizQuestions.length) * 60), // 60% até as questões normais
    liveProps: {
      currentQuestion: question,
      currentQuestionIndex: index,
      totalQuestions: caktoquizQuestions.length,
      currentAnswers: 'string[]',
      onAnswerSubmit: '(response: UserResponse) => void',
      onNextClick: '() => void',
      onPrevious: '() => void',
    },
    renderData: {
      title: question.text || question.question || 'Question',
      type: 'both', // simplified
      multiSelect: 1,
      options: question.options?.map((opt: any) => ({
        id: opt.id,
        text: opt.text,
        imageUrl: opt.imageUrl,
        styleCategory: opt.style,
        points: opt.weight || 1,
      })),
      showImages: question.type === 'both' || question.type === 'image',
      showText: question.type === 'both' || question.type === 'text',
    },
  })
);

// ETAPA 11: Transição Principal (componente MainTransition)
export const LIVE_MAIN_TRANSITION = {
  id: 'main-transition',
  title: 'Analisando suas respostas...',
  type: 'transition' as const,
  component: 'MainTransition',
  route: '/quiz',
  progress: 65,
  liveProps: {
    showingTransition: 'useState(false)',
    onContinue: '() => void',
  },
  renderData: {
    title: 'Analisando suas respostas...',
    subtitle: 'Vamos agora entender melhor seu perfil',
    loadingText: 'Calculando resultado...',
    nextStepText: 'Continuar',
    animationType: 'fade',
    backgroundColor: '#f8f9fa',
  },
};

// ETAPAS 12-17: Questões Estratégicas (componente QuizTransition)
export const LIVE_STRATEGIC_QUESTIONS = caktoquizQuestions
  .slice(0, 6)
  .map((question: QuizQuestion, index: number) => ({
    id: `strategic-question-${index + 1}`,
    title: `Questão Estratégica ${index + 1}`,
    type: 'strategic-question' as const,
    component: 'QuizTransition',
    route: '/quiz',
    questionIndex: index,
    progress: 70 + index * 5, // 70% a 95%
    liveProps: {
      currentStrategicQuestionIndex: index,
      showingStrategicQuestions: 'useState(false)',
      onAnswer: '(response: UserResponse) => void',
      currentAnswers: 'string[]',
    },
    renderData: {
      text: `Questão estratégica ${index + 1}`,
      options: question.options || [],
      isStrategic: true,
      category: 'general',
      maxSelections: 1, // Questões estratégicas são single choice
    },
  }));

// ETAPA 18: Loading Final (componente LoadingManager)
export const LIVE_FINAL_LOADING = {
  id: 'final-loading',
  title: 'Preparando seu resultado...',
  type: 'loading' as const,
  component: 'LoadingManager',
  route: '/quiz',
  progress: 95,
  liveProps: {
    showingFinalTransition: 'useState(false)',
    onComplete: '() => void',
  },
  renderData: {
    title: 'Preparando seu resultado...',
    messages: [
      'Analisando suas preferências de estilo...',
      'Calculando compatibilidade...',
      'Finalizando análise personalizada...',
    ],
    duration: 3000,
    showProgress: true,
  },
};

// ETAPA 19: Página de Resultado (rota /resultado)
export const LIVE_RESULT_PAGE = {
  id: 'result-page',
  title: 'Seu Resultado',
  type: 'result' as const,
  component: 'ResultPage',
  route: '/resultado',
  progress: 100,
  liveProps: {
    primaryStyle: 'StyleResult',
    secondaryStyles: 'StyleResult[]',
    onReset: '() => void',
  },
  renderData: {
    title: 'Seu Estilo é...',
    showStyleName: true,
    showDescription: true,
    showRecommendations: true,
    showSecondaryStyles: true,
    ctaText: 'Quero Saber Mais',
    ctaUrl: '/quiz-descubra-seu-estilo',
  },
};

// ETAPA 20: Quiz Descubra Seu Estilo (rota /quiz-descubra-seu-estilo)
export const LIVE_DISCOVER_STYLE = {
  id: 'discover-style',
  title: 'Descubra Seu Estilo',
  type: 'offer' as const,
  component: 'QuizDescubraSeuEstilo',
  route: '/quiz-descubra-seu-estilo',
  progress: 100,
  liveProps: {
    userStyle: 'string',
    userName: 'string',
  },
  renderData: {
    title: 'Transforme Seu Estilo',
    subtitle: 'Guia Completo Personalizado',
    price: 'R$ 97,00',
    originalPrice: 'R$ 197,00',
    benefits: [
      'Análise completa do seu estilo',
      'Guia de combinações personalizadas',
      'Dicas de compras inteligentes',
      'Acesso vitalício ao conteúdo',
    ],
    ctaText: 'Quero Transformar Meu Estilo',
    guarantee: '7 dias de garantia total',
  },
};

// TODAS AS ETAPAS REAIS EM ORDEM
export const ALL_LIVE_QUIZ_STEPS = [
  LIVE_QUIZ_INTRO,
  ...LIVE_QUIZ_QUESTIONS,
  LIVE_MAIN_TRANSITION,
  ...LIVE_STRATEGIC_QUESTIONS,
  LIVE_FINAL_LOADING,
  LIVE_RESULT_PAGE,
  LIVE_DISCOVER_STYLE,
];

// MAPEAMENTO POR ROTA
export const STEPS_BY_ROUTE = {
  '/quiz': [
    LIVE_QUIZ_INTRO,
    ...LIVE_QUIZ_QUESTIONS,
    LIVE_MAIN_TRANSITION,
    ...LIVE_STRATEGIC_QUESTIONS,
    LIVE_FINAL_LOADING,
  ],
  '/resultado': [LIVE_RESULT_PAGE],
  '/quiz-descubra-seu-estilo': [LIVE_DISCOVER_STYLE],
};

// UTILITÁRIOS
export const getTotalSteps = () => ALL_LIVE_QUIZ_STEPS.length;
export const getStepByRoute = (route: string) =>
  STEPS_BY_ROUTE[route as keyof typeof STEPS_BY_ROUTE] || [];
export const getStepById = (id: string) => ALL_LIVE_QUIZ_STEPS.find(step => step.id === id);
export const getQuizSteps = () => STEPS_BY_ROUTE['/quiz'];
export const getResultSteps = () => STEPS_BY_ROUTE['/resultado'];
export const getOfferSteps = () => STEPS_BY_ROUTE['/quiz-descubra-seu-estilo'];
