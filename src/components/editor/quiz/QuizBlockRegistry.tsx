// src/components/editor/quiz/QuizBlockRegistry.tsx
// Registro e mapeamento dos blocos específicos do quiz

import React from 'react';
import { IntroBlock } from '@/components/steps/step01/IntroBlock';
import { QuizIntroHeaderBlock } from '@/components/editor/quiz/QuizIntroHeaderBlock';
import QuizQuestionBlock from './QuizQuestionBlock';
import OptionsGridBlock from '@/components/editor/blocks/OptionsGridBlock';
import FormContainerBlock from '@/components/editor/blocks/FormContainerBlock';
import TestimonialsBlock from '@/components/editor/blocks/TestimonialsBlock';
import GuaranteeBlock from '@/components/editor/blocks/GuaranteeBlock';
import StyleCardInlineBlock from '@/components/editor/blocks/StyleCardInlineBlock';
import ResultHeaderInlineBlock from '@/components/editor/blocks/ResultHeaderInlineBlock';
import SecondaryStylesBlockEditor from '@/components/editor/blocks/SecondaryStylesBlockEditor';
import ButtonBlock from '@/components/editor/blocks/ButtonBlock';
import TextBlock from '@/components/editor/blocks/TextBlock';
// Note: HeroOfferBlock and BenefitsBlockEditor may need fallbacks

// Mapeamento de componentes do quiz - Expandido com todos os tipos do template
export const QUIZ_BLOCK_COMPONENTS = {
  // Core quiz components
  QuizQuestionBlock: QuizQuestionBlock,
  QuizIntroHeaderBlock: QuizIntroHeaderBlock,
  IntroBlock: IntroBlock,

  // Main quiz block types from template
  'quiz-intro-header': QuizIntroHeaderBlock,
  'options-grid': OptionsGridBlock,
  'form-container': FormContainerBlock,
  button: ButtonBlock,
  text: TextBlock,

  // Result page components
  'result-header-inline': ResultHeaderInlineBlock,
  'style-card-inline': StyleCardInlineBlock,
  'secondary-styles': SecondaryStylesBlockEditor,

  // Offer page components
  hero: TextBlock, // Fallback to text block for now
  benefits: TextBlock, // Fallback to text block for now
  testimonials: TestimonialsBlock,
  guarantee: GuaranteeBlock,
  'quiz-offer-cta-inline': ButtonBlock, // Reuse button for CTA

  // Legacy mappings
  'quiz-intro': QuizQuestionBlock,
  'quiz-questions': OptionsGridBlock, // Use OptionsGrid for questions
  'quiz-strategicQuestions': OptionsGridBlock, // Use OptionsGrid for strategic questions
  'quiz-result': QuizQuestionBlock,
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

// Obter informações do bloco de quiz - Expandido com todos os tipos
export const getQuizBlockInfo = (type: string) => {
  const quizType = type.replace('quiz-', '');

  const typeLabels: Record<string, { name: string; description: string }> = {
    // Core quiz types
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

    // Block types from template
    'quiz-intro-header': {
      name: 'Cabeçalho do Quiz',
      description: 'Cabeçalho introdutório com título e descrição',
    },
    'options-grid': {
      name: 'Grade de Opções',
      description: 'Grid de opções para seleção múltipla ou única',
    },
    'form-container': {
      name: 'Formulário',
      description: 'Container para formulários de coleta de dados',
    },
    button: {
      name: 'Botão',
      description: 'Botão de ação para navegação',
    },
    text: {
      name: 'Texto',
      description: 'Bloco de texto simples',
    },
    'result-header-inline': {
      name: 'Cabeçalho do Resultado',
      description: 'Cabeçalho da página de resultado',
    },
    'style-card-inline': {
      name: 'Cartão de Estilo',
      description: 'Cartão exibindo o estilo predominante',
    },
    'secondary-styles': {
      name: 'Estilos Secundários',
      description: 'Exibição dos estilos secundários',
    },
    hero: {
      name: 'Hero Section',
      description: 'Seção hero da página de oferta',
    },
    benefits: {
      name: 'Benefícios',
      description: 'Lista de benefícios do produto/serviço',
    },
    testimonials: {
      name: 'Depoimentos',
      description: 'Seção de depoimentos de clientes',
    },
    guarantee: {
      name: 'Garantia',
      description: 'Seção de garantia do produto',
    },
    'quiz-offer-cta-inline': {
      name: 'CTA da Oferta',
      description: 'Call-to-action da página de oferta',
    },
  };

  return typeLabels[quizType] || typeLabels[type] || { name: type, description: 'Bloco do quiz' };
};

export default QUIZ_BLOCK_COMPONENTS;
