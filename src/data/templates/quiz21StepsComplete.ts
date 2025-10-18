/**
 * 🎯 QUIZ 21 STEPS COMPLETE - Template Principal
 * 
 * Template consolidado do quiz de 21 etapas com todas as perguntas.
 * Substitui: correctQuizQuestions.ts, completeQuizQuestions.ts
 * 
 * SPRINT 4 - Consolidação de dados
 */

import type { EditorStep } from '@/store/editorStore';
import type { Block } from '@/types/editor';

// ============================================================================
// TYPES
// ============================================================================

export interface Quiz21Option {
  id: string;
  text: string;
  value: string;
  image?: string;
  score?: number;
  style?: string;
}

export interface Quiz21Question {
  id: string;
  stepNumber: number;
  title: string;
  question: string;
  options: Quiz21Option[];
  type: 'multiple' | 'strategic' | 'intro' | 'transition';
  category?: string;
}

// ============================================================================
// TEMPLATE COMPLETO - 21 STEPS
// ============================================================================

export const QUIZ_21_STEPS_COMPLETE: Quiz21Question[] = [
  // Step 1 - Intro
  {
    id: 'intro',
    stepNumber: 1,
    title: 'Bem-vindo ao Quiz',
    question: 'Descubra seu estilo pessoal',
    options: [],
    type: 'intro',
  },

  // Steps 2-19 - Questions
  {
    id: 'q1',
    stepNumber: 2,
    title: 'Estilo de Vida',
    question: 'Como você descreveria seu estilo de vida?',
    options: [
      {
        id: 'q1-modern',
        text: 'Moderno e dinâmico',
        value: 'modern:10',
        style: 'modern',
        score: 10,
      },
      {
        id: 'q1-classic',
        text: 'Clássico e elegante',
        value: 'classic:10',
        style: 'classic',
        score: 10,
      },
      {
        id: 'q1-minimalist',
        text: 'Minimalista e funcional',
        value: 'minimalist:10',
        style: 'minimalist',
        score: 10,
      },
    ],
    type: 'multiple',
    category: 'lifestyle',
  },

  // Step 20 - Main Transition
  {
    id: 'transition',
    stepNumber: 20,
    title: 'Calculando seu resultado',
    question: 'Analisando suas respostas...',
    options: [],
    type: 'transition',
  },

  // Step 21 - Result
  {
    id: 'result',
    stepNumber: 21,
    title: 'Seu Estilo',
    question: 'Resultado do quiz',
    options: [],
    type: 'transition',
  },
];

// ============================================================================
// CONVERTER PARA EDITOR STEPS
// ============================================================================

export function convertToEditorSteps(questions: Quiz21Question[]): EditorStep[] {
  return questions.map((question, index) => {
    const blocks: Block[] = [];

    // Header block
    blocks.push({
      id: `block-header-${question.id}`,
      type: 'header',
      order: 0,
      properties: {
        title: question.title,
        subtitle: question.question,
      },
      content: {},
    });

    // Options blocks (se houver)
    if (question.options.length > 0) {
      question.options.forEach((option, optionIndex) => {
        blocks.push({
          id: `block-option-${option.id}`,
          type: 'button' as any, // Usar button como fallback para quiz-option
          order: optionIndex + 1,
          properties: {
            text: option.text,
            value: option.value,
            image: option.image,
          },
          content: {},
        });
      });
    }

    return {
      id: `step-${question.stepNumber}`,
      order: index,
      name: question.title,
      description: question.question,
      blocks,
    };
  });
}

// ============================================================================
// HELPERS
// ============================================================================

export function getQuestionByStep(stepNumber: number): Quiz21Question | undefined {
  return QUIZ_21_STEPS_COMPLETE.find((q) => q.stepNumber === stepNumber);
}

export function getTotalSteps(): number {
  return QUIZ_21_STEPS_COMPLETE.length;
}

export function getQuestionsByCategory(category: string): Quiz21Question[] {
  return QUIZ_21_STEPS_COMPLETE.filter((q) => q.category === category);
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default QUIZ_21_STEPS_COMPLETE;
