/**
 * 🧪 Testes para CanonicalScorer
 * 
 * Testa funções de validação de seleção e acumulação de pontos
 */

import { describe, it, expect } from 'vitest';
import { validateSelection, accumulateScores, type Answers } from '@/services/core/CanonicalScorer';
import type { CanonicalQuiz, CanonicalQuestion } from '@/types/quizCanonical';

describe('CanonicalScorer', () => {
  describe('validateSelection', () => {
    it('deve validar seleção exata quando requiredSelections está definido', () => {
      const question: CanonicalQuestion = {
        id: 'q1',
        text: 'Test question',
        options: [],
        kind: 'scored',
        requiredSelections: 2,
      };

      expect(validateSelection(question, ['opt1', 'opt2'])).toBe(true);
      expect(validateSelection(question, ['opt1'])).toBe(false);
      expect(validateSelection(question, ['opt1', 'opt2', 'opt3'])).toBe(false);
    });

    it('deve validar seleção mínima quando minSelections está definido', () => {
      const question: CanonicalQuestion = {
        id: 'q2',
        text: 'Test question',
        options: [],
        kind: 'scored',
        minSelections: 1,
      };

      expect(validateSelection(question, [])).toBe(false);
      expect(validateSelection(question, ['opt1'])).toBe(true);
      expect(validateSelection(question, ['opt1', 'opt2'])).toBe(true);
    });

    it('deve validar seleção máxima quando maxSelections está definido', () => {
      const question: CanonicalQuestion = {
        id: 'q3',
        text: 'Test question',
        options: [],
        kind: 'scored',
        maxSelections: 2,
      };

      expect(validateSelection(question, ['opt1'])).toBe(true);
      expect(validateSelection(question, ['opt1', 'opt2'])).toBe(true);
      expect(validateSelection(question, ['opt1', 'opt2', 'opt3'])).toBe(false);
    });

    it('deve validar range de seleções quando min e max estão definidos', () => {
      const question: CanonicalQuestion = {
        id: 'q4',
        text: 'Test question',
        options: [],
        kind: 'scored',
        minSelections: 1,
        maxSelections: 3,
      };

      expect(validateSelection(question, [])).toBe(false);
      expect(validateSelection(question, ['opt1'])).toBe(true);
      expect(validateSelection(question, ['opt1', 'opt2'])).toBe(true);
      expect(validateSelection(question, ['opt1', 'opt2', 'opt3'])).toBe(true);
      expect(validateSelection(question, ['opt1', 'opt2', 'opt3', 'opt4'])).toBe(false);
    });

    it('deve retornar true quando não há restrições de seleção', () => {
      const question: CanonicalQuestion = {
        id: 'q5',
        text: 'Test question',
        options: [],
        kind: 'scored',
      };

      expect(validateSelection(question, [])).toBe(true);
      expect(validateSelection(question, ['opt1'])).toBe(true);
      expect(validateSelection(question, ['opt1', 'opt2', 'opt3'])).toBe(true);
    });
  });

  describe('accumulateScores', () => {
    it('deve acumular pontos corretamente para respostas válidas', () => {
      const quiz: CanonicalQuiz = {
        id: 'quiz1',
        title: 'Test Quiz',
        questions: [
          {
            id: 'q1',
            text: 'Question 1',
            kind: 'scored',
            options: [
              { id: 'opt1', text: 'Option 1', score: { styleA: 10, styleB: 5 } },
              { id: 'opt2', text: 'Option 2', score: { styleA: 5, styleC: 15 } },
            ],
          },
        ],
      };

      const answers: Answers = {
        q1: ['opt1', 'opt2'],
      };

      const scores = accumulateScores(quiz, answers);

      expect(scores).toEqual({
        styleA: 15, // 10 + 5
        styleB: 5,
        styleC: 15,
      });
    });

    it('deve ignorar respostas inválidas', () => {
      const quiz: CanonicalQuiz = {
        id: 'quiz1',
        title: 'Test Quiz',
        questions: [
          {
            id: 'q1',
            text: 'Question 1',
            kind: 'scored',
            requiredSelections: 1,
            options: [
              { id: 'opt1', text: 'Option 1', score: { styleA: 10 } },
              { id: 'opt2', text: 'Option 2', score: { styleB: 20 } },
            ],
          },
        ],
      };

      const answers: Answers = {
        q1: ['opt1', 'opt2'], // Inválido: requer exatamente 1 seleção
      };

      const scores = accumulateScores(quiz, answers);

      expect(scores).toEqual({});
    });

    it('deve ignorar questões não pontuadas', () => {
      const quiz: CanonicalQuiz = {
        id: 'quiz1',
        title: 'Test Quiz',
        questions: [
          {
            id: 'q1',
            text: 'Question 1',
            kind: 'informational', // Não pontuada
            options: [
              { id: 'opt1', text: 'Option 1', score: { styleA: 10 } },
            ],
          },
        ],
      };

      const answers: Answers = {
        q1: ['opt1'],
      };

      const scores = accumulateScores(quiz, answers);

      expect(scores).toEqual({});
    });

    it('deve lidar com respostas vazias', () => {
      const quiz: CanonicalQuiz = {
        id: 'quiz1',
        title: 'Test Quiz',
        questions: [
          {
            id: 'q1',
            text: 'Question 1',
            kind: 'scored',
            options: [
              { id: 'opt1', text: 'Option 1', score: { styleA: 10 } },
            ],
          },
        ],
      };

      const answers: Answers = {};

      const scores = accumulateScores(quiz, answers);

      expect(scores).toEqual({});
    });

    it('deve ignorar opções sem pontuação', () => {
      const quiz: CanonicalQuiz = {
        id: 'quiz1',
        title: 'Test Quiz',
        questions: [
          {
            id: 'q1',
            text: 'Question 1',
            kind: 'scored',
            options: [
              { id: 'opt1', text: 'Option 1' }, // Sem score
              { id: 'opt2', text: 'Option 2', score: { styleA: 10 } },
            ],
          },
        ],
      };

      const answers: Answers = {
        q1: ['opt1', 'opt2'],
      };

      const scores = accumulateScores(quiz, answers);

      expect(scores).toEqual({
        styleA: 10,
      });
    });

    it('deve acumular pontos de múltiplas questões', () => {
      const quiz: CanonicalQuiz = {
        id: 'quiz1',
        title: 'Test Quiz',
        questions: [
          {
            id: 'q1',
            text: 'Question 1',
            kind: 'scored',
            options: [
              { id: 'opt1', text: 'Option 1', score: { styleA: 10 } },
            ],
          },
          {
            id: 'q2',
            text: 'Question 2',
            kind: 'scored',
            options: [
              { id: 'opt3', text: 'Option 3', score: { styleA: 15, styleB: 5 } },
            ],
          },
        ],
      };

      const answers: Answers = {
        q1: ['opt1'],
        q2: ['opt3'],
      };

      const scores = accumulateScores(quiz, answers);

      expect(scores).toEqual({
        styleA: 25, // 10 + 15
        styleB: 5,
      });
    });

    it('deve ignorar IDs de opções inválidas', () => {
      const quiz: CanonicalQuiz = {
        id: 'quiz1',
        title: 'Test Quiz',
        questions: [
          {
            id: 'q1',
            text: 'Question 1',
            kind: 'scored',
            options: [
              { id: 'opt1', text: 'Option 1', score: { styleA: 10 } },
            ],
          },
        ],
      };

      const answers: Answers = {
        q1: ['invalid-option-id'],
      };

      const scores = accumulateScores(quiz, answers);

      expect(scores).toEqual({});
    });

    it('deve tratar pontos não numéricos como zero', () => {
      const quiz: Quiz = {
        blocks: [
          {
            id: 'q1',
            questionData: {
              scored: true,
              options: [
                { id: 'opt1', label: 'Opção 1', score: { styleA: 'invalid' as any } },
                { id: 'opt2', label: 'Opção 2', score: { styleB: 20 } },
              ],
            },
          },
        ],
      } as Quiz;

      const answers: Answers = {
        q1: ['opt1', 'opt2'],
      };

      const scores = accumulateScores(quiz, answers);

      // A função mantém a chave com valor 0 para scores não numéricos
      expect(scores).toEqual({
        styleA: 0,
        styleB: 20,
      });
    });
  });
});
