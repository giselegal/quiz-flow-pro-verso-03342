/**
 * 🧪 TESTES - UnifiedQuizStepAdapter
 * 
 * Validar conversões bidirecionais entre 3 formatos:
 * - QuizStep (runtime)
 * - Block[] (editor)
 * - JSONv3Template (templates)
 */

import { describe, it, expect } from 'vitest';
import { UnifiedQuizStepAdapter, type UnifiedQuizStep } from '@/adapters/UnifiedQuizStepAdapter';
import { QUIZ_STEPS } from '@/data/quizSteps';

describe('UnifiedQuizStepAdapter', () => {
  describe('QuizStep → UnifiedQuizStep', () => {
    it('deve converter step intro corretamente', () => {
      const quizStep = QUIZ_STEPS['step-01'];
      const unified = UnifiedQuizStepAdapter.fromQuizStep(quizStep, 'step-01');

      expect(unified.id).toBe('step-01');
      expect(unified.stepNumber).toBe(1);
      expect(unified.type).toBe('intro');
      expect(unified.metadata.source).toBe('quizstep');
      expect(unified.sections.length).toBeGreaterThan(0);
      expect(unified.raw.quizStep).toBe(quizStep);
      expect(unified.raw.blocks).toBeDefined();
    });

    it('deve converter step question corretamente', () => {
      const quizStep = QUIZ_STEPS['step-02'];
      const unified = UnifiedQuizStepAdapter.fromQuizStep(quizStep, 'step-02');

      expect(unified.id).toBe('step-02');
      expect(unified.stepNumber).toBe(2);
      expect(unified.type).toBe('question');
      expect(unified.sections.length).toBeGreaterThan(0);
    });

    it('deve preservar dados originais em raw.quizStep', () => {
      const quizStep = QUIZ_STEPS['step-13'];
      const unified = UnifiedQuizStepAdapter.fromQuizStep(quizStep, 'step-13');

      expect(unified.raw.quizStep).toEqual(quizStep);
    });
  });

  describe('Block[] → UnifiedQuizStep', () => {
    it('deve converter blocks para unified step', () => {
      const blocks = [
        {
          id: 'block-1',
          type: 'text-inline' as any,
          order: 0,
          content: { text: 'Hello' },
          properties: {}
        },
        {
          id: 'block-2',
          type: 'form-input' as any,
          order: 1,
          content: { label: 'Name' },
          properties: {}
        }
      ];

      const unified = UnifiedQuizStepAdapter.fromBlocks(blocks, 'step-test');

      expect(unified.id).toBe('step-test');
      expect(unified.sections.length).toBe(2);
      expect(unified.metadata.source).toBe('blocks');
      expect(unified.raw.blocks).toEqual(blocks);
    });

    it('deve inferir tipo baseado nos blocks', () => {
      const questionBlocks = [
        {
          id: 'block-1',
          type: 'options-grid' as any,
          order: 0,
          content: {},
          properties: {}
        }
      ];

      const unified = UnifiedQuizStepAdapter.fromBlocks(questionBlocks, 'step-test');
      expect(unified.type).toBe('question');
    });

    it('deve inferir tipo intro para form blocks', () => {
      const introBlocks = [
        {
          id: 'block-1',
          type: 'form-input' as any,
          order: 0,
          content: {},
          properties: {}
        }
      ];

      const unified = UnifiedQuizStepAdapter.fromBlocks(introBlocks, 'step-test');
      expect(unified.type).toBe('intro');
    });
  });

  describe('UnifiedQuizStep → QuizStep', () => {
    it('deve retornar QuizStep original se disponível', () => {
      const quizStep = QUIZ_STEPS['step-01'];
      const unified = UnifiedQuizStepAdapter.fromQuizStep(quizStep, 'step-01');
      const reconstructed = UnifiedQuizStepAdapter.toQuizStep(unified);

      expect(reconstructed).toBe(quizStep);
    });

    it('deve reconstruir QuizStep de blocks', () => {
      const blocks = [
        {
          id: 'block-1',
          type: 'text-inline' as any,
          order: 0,
          content: { text: 'Test' },
          properties: {}
        }
      ];

      const unified = UnifiedQuizStepAdapter.fromBlocks(blocks, 'step-test');
      const quizStep = UnifiedQuizStepAdapter.toQuizStep(unified);

      expect(quizStep.id).toBe('step-test');
      expect(quizStep.type).toBeDefined();
    });
  });

  describe('UnifiedQuizStep → Block[]', () => {
    it('deve retornar blocks originais se disponíveis', () => {
      const blocks = [
        {
          id: 'block-1',
          type: 'text-inline' as any,
          order: 0,
          content: {},
          properties: {}
        }
      ];

      const unified = UnifiedQuizStepAdapter.fromBlocks(blocks, 'step-test');
      const reconstructed = UnifiedQuizStepAdapter.toBlocks(unified);

      expect(reconstructed).toEqual(blocks);
    });

    it('deve converter sections para blocks', () => {
      const unified: UnifiedQuizStep = {
        id: 'step-test',
        stepNumber: 1,
        type: 'intro',
        sections: [
          { type: 'text-block', content: { text: 'Hello' } }
        ],
        metadata: { version: '1.0', source: 'blocks' },
        raw: {}
      };

      const blocks = UnifiedQuizStepAdapter.toBlocks(unified);
      
      expect(blocks.length).toBe(1);
      expect(blocks[0].type).toBe('text-block');
    });
  });

  describe('Round-trip conversions', () => {
    it('QuizStep → Unified → QuizStep preserva dados', () => {
      const original = QUIZ_STEPS['step-01'];
      const unified = UnifiedQuizStepAdapter.fromQuizStep(original, 'step-01');
      const reconstructed = UnifiedQuizStepAdapter.toQuizStep(unified);

      expect(reconstructed).toBe(original);
    });

    it('Blocks → Unified → Blocks preserva estrutura', () => {
      const original = [
        {
          id: 'block-1',
          type: 'text-inline' as any,
          order: 0,
          content: { text: 'Test' },
          properties: { style: 'bold' }
        }
      ];

      const unified = UnifiedQuizStepAdapter.fromBlocks(original, 'step-test');
      const reconstructed = UnifiedQuizStepAdapter.toBlocks(unified);

      expect(reconstructed).toEqual(original);
    });
  });

  describe('Metadata handling', () => {
    it('deve extrair stepNumber corretamente', () => {
      const tests = [
        { id: 'step-01', expected: 1 },
        { id: 'step-10', expected: 10 },
        { id: 'step-21', expected: 21 },
        { id: 'step1', expected: 1 }
      ];

      tests.forEach(({ id, expected }) => {
        const quizStep = QUIZ_STEPS['step-01'];
        const unified = UnifiedQuizStepAdapter.fromQuizStep(quizStep, id);
        expect(unified.stepNumber).toBe(expected);
      });
    });

    it('deve manter versão e source', () => {
      const quizStep = QUIZ_STEPS['step-01'];
      const unified = UnifiedQuizStepAdapter.fromQuizStep(quizStep, 'step-01');

      expect(unified.metadata.version).toBe('1.0');
      expect(unified.metadata.source).toBe('quizstep');
    });
  });

  describe('Error handling', () => {
    it('deve lidar com stepId inválido', () => {
      const quizStep = QUIZ_STEPS['step-01'];
      const unified = UnifiedQuizStepAdapter.fromQuizStep(quizStep, 'invalid-id');

      expect(unified.id).toBe('invalid-id');
      expect(unified.stepNumber).toBe(1); // Default fallback
    });

    it('deve lidar com blocks vazios', () => {
      const unified = UnifiedQuizStepAdapter.fromBlocks([], 'step-test');

      expect(unified.sections.length).toBe(0);
      expect(unified.type).toBe('intro'); // Default
    });
  });
});
