/**
 * 🆕 CREATE BLANK QUIZ
 * 
 * Cria um QuizSchema vazio para o canvas em branco.
 * Usado quando /editor é acessado sem parâmetros.
 */

import type { QuizSchema } from '@/schemas/quiz-schema.zod';
import { nanoid } from 'nanoid';

/**
 * Cria um quiz em branco com estrutura mínima válida
 */
export function createBlankQuiz(): QuizSchema {
  const quizId = `new-quiz-${nanoid(8)}`;
  const now = new Date().toISOString();

  return {
    version: '4.1.0',
    schemaVersion: '4.1',
    metadata: {
      id: quizId,
      name: 'Novo Funil',
      description: 'Funil criado do zero',
      author: 'Usuário',
      createdAt: now,
      updatedAt: now,
    },
    theme: {
      colors: {
        primary: '#7C3AED',
        secondary: '#A78BFA',
        background: '#FFFFFF',
        text: '#1F2937',
        border: '#E5E7EB',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
      },
      borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
      },
    },
    settings: {
      scoring: {
        enabled: false,
        method: 'sum',
      },
      navigation: {
        showProgress: true,
        allowBack: true,
        autoAdvance: false,
      },
      validation: {
        required: false,
        strictMode: false,
      },
    },
    steps: [
      {
        id: 'step-01',
        type: 'intro',
        order: 1,
        title: 'Step 1',
        blocks: [], // ✅ Canvas vazio - sem blocos
        navigation: {
          nextStep: null,
          conditions: [],
        },
        validation: {
          required: false,
          rules: {},
        },
        version: 1,
      },
    ],
  };
}
