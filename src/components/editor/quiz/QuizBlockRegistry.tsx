// src/components/editor/quiz/QuizBlockRegistry.tsx
// Registro e mapeamento dos blocos específicos do quiz

import React from 'react';
import { IntroBlock } from '@/components/steps/step01/IntroBlock';
import { QuizIntroHeaderBlock } from '@/components/blocks/unified/UnifiedHeaderVariant';
import QuizQuestionBlock from './QuizQuestionBlock';

// Mapeamento de componentes do quiz
export const QUIZ_BLOCK_COMPONENTS = {
  QuizQuestionBlock: QuizQuestionBlock,
  QuizIntroHeaderBlock: QuizIntroHeaderBlock,
  IntroBlock: IntroBlock,
  'quiz-intro': QuizQuestionBlock,
  'quiz-questions': QuizQuestionBlock,
  'quiz-strategicQuestions': QuizQuestionBlock,
  'quiz-result': QuizQuestionBlock,
  'quiz-intro-header': QuizIntroHeaderBlock,
  'step01-intro': IntroBlock,
} as const;

// Função para renderizar componentes do quiz
export const renderQuizBlock = (type: string, props: any) => {
  const Component = QUIZ_BLOCK_COMPONENTS[type as keyof typeof QUIZ_BLOCK_COMPONENTS];

  if (Component) {
    return React.createElement(Component as any, props);
  }

  // Fallback para tipos de quiz não reconhecidos
  if (type.startsWith('quiz-')) {
    if (type.includes('header')) {
      return React.createElement(QuizIntroHeaderBlock, props);
    }
    return React.createElement(QuizQuestionBlock, props);
  }

  return null;
};

// Verificar se um tipo é um bloco de quiz
export const isQuizBlock = (type: string): boolean => {
  return type.startsWith('quiz-') || Object.keys(QUIZ_BLOCK_COMPONENTS).includes(type);
};

// Obter informações do bloco de quiz
export const getQuizBlockInfo = (type: string) => {
  const quizType = type.replace('quiz-', '');

  const typeLabels: Record<string, { name: string; description: string }> = {
    intro: {
      name: 'Introdução',
      description: 'Tela de boas-vindas e coleta de nome',
    },
    questions: {
      name: 'Questões Principais',
      description: 'Perguntas com multi-seleção sobre preferências',
    },
    strategicQuestions: {
      name: 'Questões Estratégicas',
      description: 'Perguntas com seleção única sobre contexto',
    },
    result: {
      name: 'Resultado',
      description: 'Exibição do resultado personalizado',
    },
  };

  return typeLabels[quizType] || { name: type, description: 'Bloco do quiz' };
};

export default QUIZ_BLOCK_COMPONENTS;
