/**
 * 🎭 MOCK DATA SYSTEM - SISTEMA DE DADOS SIMULADOS PARA PREVIEW
 * 
 * Sistema crítico que estava FALTANDO - responsável por:
 * - Interpolar placeholders como {userName}, {resultStyle}
 * - Fornecer dados realísticos para preview
 * - Simular estado do quiz em diferentes etapas
 */

import { Block } from '@/types/editor';

// 🎯 DADOS MOCKADOS REALÍSTICOS
export const MOCK_USER_DATA = {
  // Dados pessoais
  userName: 'Maria Silva',
  userEmail: 'maria.silva@email.com',
  userAge: 28,
  userLocation: 'São Paulo, SP',
  
  // Resultados do quiz
  resultStyle: 'Elegante',
  secondaryStyle: 'Minimalista',
  resultColors: ['#2C3E50', '#ECF0F1', '#E74C3C'],
  resultDescription: 'Seu estilo reflete sofisticação e classe, com preferência por peças atemporais e bem estruturadas.',
  
  // Progresso do quiz
  currentStep: 8,
  totalSteps: 21,
  completionPercentage: 38,
  answeredQuestions: 7,
  
  // Pontuações por estilo
  styleScores: {
    elegante: 24,
    casual: 18,
    romantico: 15,
    minimalista: 21,
    boho: 12,
    classico: 19,
    moderno: 16,
    dramatico: 14
  },
  
  // Respostas do usuário (simuladas)
  userAnswers: {
    'step-2': ['elegante_q1', 'minimalista_q1', 'classico_q1'],
    'step-3': ['elegante_q2', 'romantico_q2', 'classico_q2'],
    'step-4': ['casual_q3', 'minimalista_q3', 'elegante_q3'],
    'step-5': ['elegante_q4', 'classico_q4', 'moderno_q4'],
    'step-6': ['minimalista_q5', 'elegante_q5', 'dramatico_q5'],
    'step-7': ['elegante_q6', 'classico_q6', 'romantico_q6'],
    'step-8': ['casual_q7', 'boho_q7', 'minimalista_q7']
  },
  
  // Questões estratégicas
  strategicAnswers: {
    'step-13': 'professional_work',
    'step-14': 'investment_quality',
    'step-15': 'versatile_pieces',
    'step-16': 'classic_colors',
    'step-17': 'structured_silhouettes',
    'step-18': 'minimalist_accessories'
  },
  
  // Dados de contexto
  device: 'desktop',
  browser: 'Chrome',
  timestamp: new Date().toISOString(),
  sessionId: 'session_' + Date.now(),
  
  // Dados para oferta
  offerValue: 'R$ 497',
  discountValue: 'R$ 297',
  discountPercentage: '40%',
  limitedTime: '48 horas',
  
  // Dados sociais
  testimonialName: 'Ana Costa',
  testimonialRole: 'Consultora de Moda',
  testimonialText: 'Descobri meu estilo pessoal e agora me visto com muito mais confiança!',
  
  // Compatibilidade (para resultados)
  compatibility: {
    workEnviroment: 95,
    casualOutings: 88,
    specialEvents: 92,
    travelStyle: 85
  }
};

// 🎯 DADOS MOCKADOS POR ETAPA (contexto específico)
export const STEP_SPECIFIC_MOCK_DATA: Record<string, Record<string, any>> = {
  'step-1': {
    welcomeMessage: 'Bem-vinda ao seu Quiz de Estilo Pessoal!',
    estimatedTime: '5 minutos',
    participantsCount: '12.847'
  },
  
  'step-2': {
    questionNumber: 1,
    questionProgress: '1 de 10',
    questionCategory: 'Preferências Básicas'
  },
  
  'step-12': {
    transitionMessage: 'Agora vamos descobrir mais sobre seu estilo de vida...',
    completedQuestions: 10,
    strategicPhaseInfo: 'Perguntas Estratégicas (6 de 6)'
  },
  
  'step-19': {
    calculatingMessage: 'Analisando suas respostas...',
    processingSteps: [
      'Avaliando preferências de cor',
      'Analisando silhuetas favoritas',
      'Identificando estilo dominante',
      'Preparando resultado personalizado'
    ]
  },
  
  'step-20': {
    congratsMessage: 'Parabéns! Descobrimos seu estilo!',
    resultAccuracy: '94%',
    personalizedTips: [
      'Invista em peças estruturadas',
      'Prefira cores neutras e sofisticadas',
      'Aposte em tecidos de qualidade'
    ]
  },
  
  'step-21': {
    offerTitle: 'Transforme Seu Guarda-Roupa Hoje!',
    urgencyMessage: 'Oferta válida por apenas 48 horas',
    bonusItems: ['E-book Guia de Cores', 'Checklist de Compras', 'Consultoria Express']
  }
};

// 🎯 FUNÇÕES DE INTERPOLAÇÃO

/**
 * Interpola placeholders em texto
 */
export function interpolateText(text: string, mockData = MOCK_USER_DATA, stepData = {}): string {
  if (!text || typeof text !== 'string') return text;
  
  const allData = { ...mockData, ...stepData };
  
  return text.replace(/\{([^}]+)\}/g, (match, key) => {
    const value = getNestedValue(allData, key);
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Interpola placeholders em objeto de conteúdo
 */
export function interpolateContent(content: any, mockData = MOCK_USER_DATA, stepData = {}): any {
  if (!content) return content;
  
  if (typeof content === 'string') {
    return interpolateText(content, mockData, stepData);
  }
  
  if (Array.isArray(content)) {
    return content.map(item => interpolateContent(item, mockData, stepData));
  }
  
  if (typeof content === 'object') {
    const interpolated: any = {};
    for (const [key, value] of Object.entries(content)) {
      interpolated[key] = interpolateContent(value, mockData, stepData);
    }
    return interpolated;
  }
  
  return content;
}

/**
 * Interpola bloco completo para preview
 */
export function interpolateBlockForPreview(block: Block, stepId?: string): Block {
  const stepData = stepId ? STEP_SPECIFIC_MOCK_DATA[stepId] || {} : {};
  
  return {
    ...block,
    content: interpolateContent(block.content, MOCK_USER_DATA, stepData),
    properties: interpolateContent(block.properties, MOCK_USER_DATA, stepData)
  };
}

/**
 * Interpola array de blocos para preview
 */
export function interpolateBlocksForPreview(blocks: Block[], stepId?: string): Block[] {
  return blocks.map(block => interpolateBlockForPreview(block, stepId));
}

/**
 * Obtém dados mockados específicos para uma etapa
 */
export function getMockDataForStep(stepId: string): Record<string, any> {
  const stepNumber = parseInt(stepId.replace('step-', ''));
  const stepData = STEP_SPECIFIC_MOCK_DATA[stepId] || {};
  
  return {
    ...MOCK_USER_DATA,
    ...stepData,
    currentStep: stepNumber,
    completionPercentage: Math.round((stepNumber / 21) * 100)
  };
}

/**
 * Simula progresso do quiz até determinada etapa
 */
export function simulateQuizProgress(upToStep: number): Record<string, any> {
  const progress = Math.min(upToStep / 21, 1);
  const answeredQuestions = Math.min(upToStep - 1, 16); // Máximo 16 questões (10 + 6)
  
  return {
    ...MOCK_USER_DATA,
    currentStep: upToStep,
    completionPercentage: Math.round(progress * 100),
    answeredQuestions,
    isComplete: upToStep >= 21,
    canProceed: true,
    timeSpent: Math.round(progress * 300) // 5 minutos total simulado
  };
}

// 🎯 FUNÇÕES UTILITÁRIAS

/**
 * Obtém valor aninhado do objeto usando dot notation
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Gera dados mockados personalizados baseados em seed
 */
export function generateCustomMockData(seed: string): Record<string, any> {
  const names = ['Ana Silva', 'Maria Santos', 'Julia Costa', 'Carla Oliveira'];
  const styles = ['Elegante', 'Casual', 'Romântico', 'Minimalista', 'Boho'];
  const locations = ['São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Porto Alegre, RS'];
  
  const seedNum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return {
    ...MOCK_USER_DATA,
    userName: names[seedNum % names.length],
    resultStyle: styles[seedNum % styles.length],
    userLocation: locations[seedNum % locations.length],
    sessionId: `session_${seed}_${Date.now()}`
  };
}

/**
 * Verifica se um texto contém placeholders
 */
export function hasPlaceholders(text: string): boolean {
  return typeof text === 'string' && /\{[^}]+\}/.test(text);
}

/**
 * Lista todos os placeholders em um texto
 */
export function extractPlaceholders(text: string): string[] {
  if (typeof text !== 'string') return [];
  
  const matches = text.match(/\{([^}]+)\}/g);
  return matches ? matches.map(match => match.slice(1, -1)) : [];
}