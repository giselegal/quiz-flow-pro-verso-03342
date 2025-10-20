/**
 * 🎯 QUIZ STEPS - Fonte Canônica de Dados (FASE 1)
 * 
 * Dados extraídos de quiz21StepsComplete.ts
 * Serve como single source of truth para options, validações e metadata
 */

export interface QuizOption {
  id: string;
  text: string;
  imageUrl: string;
  value: string;
  category: string;
  points: number;
}

export interface QuizStepData {
  id: string;
  stepNumber: number;
  question: string;
  options: QuizOption[];
  requiredSelections: number;
  maxSelections: number;
  multipleSelection: boolean;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

export const QUIZ_STEPS: Record<string, QuizStepData> = {
  'step-02': {
    id: 'step-02',
    stepNumber: 2,
    question: 'Qual tipo de roupa você mais se identifica?',
    requiredSelections: 3,
    maxSelections: 3,
    multipleSelection: true,
    autoAdvance: true,
    autoAdvanceDelay: 1500,
    options: [
      {
        id: '2a',
        text: 'Vestidos fluidos e confortáveis',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
        value: '2a',
        category: 'Natural',
        points: 1
      },
      {
        id: '2b',
        text: 'Blazers estruturados e calças alfaiataria',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
        value: '2b',
        category: 'Clássico',
        points: 2
      },
      {
        id: '2c',
        text: 'Peças modernas com toque minimalista',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
        value: '2c',
        category: 'Contemporâneo',
        points: 2
      },
      {
        id: '2d',
        text: 'Vestidos sofisticados e acessórios marcantes',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
        value: '2d',
        category: 'Elegante',
        points: 3
      }
    ]
  },

  'step-03': {
    id: 'step-03',
    stepNumber: 3,
    question: 'Como você prefere que as pessoas te chamem no dia a dia?',
    requiredSelections: 3,
    maxSelections: 3,
    multipleSelection: true,
    autoAdvance: true,
    autoAdvanceDelay: 1500,
    options: [
      { id: '3a', text: 'Opção A para Q2', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp', value: '3a', category: 'Natural', points: 1 },
      { id: '3b', text: 'Opção B para Q2', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp', value: '3b', category: 'Clássico', points: 2 },
      { id: '3c', text: 'Opção C para Q2', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp', value: '3c', category: 'Contemporâneo', points: 2 },
      { id: '3d', text: 'Opção D para Q2', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp', value: '3d', category: 'Elegante', points: 3 }
    ]
  },

  // Steps 4-11 (placeholder - mesma estrutura)
  ...Array.from({ length: 8 }, (_, i) => {
    const stepNum = i + 4;
    const stepId = `step-${String(stepNum).padStart(2, '0')}`;
    return {
      [stepId]: {
        id: stepId,
        stepNumber: stepNum,
        question: `Questão ${stepNum - 1}`,
        requiredSelections: 3,
        maxSelections: 3,
        multipleSelection: true,
        autoAdvance: true,
        autoAdvanceDelay: 1500,
        options: [
          { id: `${stepNum}a`, text: `Opção A Q${stepNum - 1}`, imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp', value: `${stepNum}a`, category: 'Natural', points: 1 },
          { id: `${stepNum}b`, text: `Opção B Q${stepNum - 1}`, imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp', value: `${stepNum}b`, category: 'Clássico', points: 2 },
          { id: `${stepNum}c`, text: `Opção C Q${stepNum - 1}`, imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp', value: `${stepNum}c`, category: 'Contemporâneo', points: 2 },
          { id: `${stepNum}d`, text: `Opção D Q${stepNum - 1}`, imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp', value: `${stepNum}d`, category: 'Elegante', points: 3 }
        ]
      }
    };
  }).reduce((acc, curr) => ({ ...acc, ...curr }), {}),

  // Steps 13-18 (strategic questions)
  ...Array.from({ length: 6 }, (_, i) => {
    const stepNum = i + 13;
    const stepId = `step-${String(stepNum).padStart(2, '0')}`;
    return {
      [stepId]: {
        id: stepId,
        stepNumber: stepNum,
        question: `Questão Estratégica ${stepNum - 11}`,
        requiredSelections: 3,
        maxSelections: 3,
        multipleSelection: true,
        autoAdvance: true,
        autoAdvanceDelay: 1500,
        options: [
          { id: `${stepNum}a`, text: `Opção A QE${stepNum - 11}`, imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp', value: `${stepNum}a`, category: 'Natural', points: 1 },
          { id: `${stepNum}b`, text: `Opção B QE${stepNum - 11}`, imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp', value: `${stepNum}b`, category: 'Clássico', points: 2 },
          { id: `${stepNum}c`, text: `Opção C QE${stepNum - 11}`, imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp', value: `${stepNum}c`, category: 'Contemporâneo', points: 2 },
          { id: `${stepNum}d`, text: `Opção D QE${stepNum - 11}`, imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp', value: `${stepNum}d`, category: 'Elegante', points: 3 }
        ]
      }
    };
  }).reduce((acc, curr) => ({ ...acc, ...curr }), {})
};
