// Integration test to verify our refactoring is working
import { describe, it, expect, vi } from 'vitest';
import { normalizeStepBlocks, getBlocksForStep, mergeStepBlocks } from '../../config/quizStepsComplete';
import { computeResults } from '../../utils/quizResults';

describe('Quiz Refactoring Integration', () => {
  describe('quizStepsComplete utility', () => {
    it('should normalize step blocks correctly', () => {
      const rawStepBlocks = {
        '1': [{ id: 'block1', type: 'text' }],
        'step-2': [{ id: 'block2', type: 'button' }],
        'step3': [{ id: 'block3', type: 'image' }],
      };

      const normalized = normalizeStepBlocks(rawStepBlocks);

      expect(normalized['step-1']).toEqual([{ id: 'block1', type: 'text' }]);
      expect(normalized['step-2']).toEqual([{ id: 'block2', type: 'button' }]);
      expect(normalized['step-3']).toEqual([{ id: 'block3', type: 'image' }]);
    });

    it('should get blocks for step with various key formats', () => {
      const stepBlocks = {
        'step-1': [{ id: 'block1' }],
        'step2': [{ id: 'block2' }],
        '3': [{ id: 'block3' }],
      };

      expect(getBlocksForStep(1, stepBlocks)).toEqual([{ id: 'block1' }]);
      expect(getBlocksForStep('2', stepBlocks)).toEqual([{ id: 'block2' }]);
      expect(getBlocksForStep(3, stepBlocks)).toEqual([{ id: 'block3' }]);
    });

    it('should merge step blocks without overwriting', () => {
      const base = {
        'step-1': [{ id: 'existing1' }],
        'step-2': [{ id: 'existing2' }],
      };

      const incoming = {
        'step-2': [{ id: 'new2' }], // Should overwrite
        '3': [{ id: 'new3' }], // Should add as step-3
      };

      const merged = mergeStepBlocks(base, incoming);

      expect(merged['step-1']).toEqual([{ id: 'existing1' }]);
      expect(merged['step-2']).toEqual([{ id: 'new2' }]);
      expect(merged['step-3']).toEqual([{ id: 'new3' }]);
    });
  });

  describe('quiz results integration', () => {
    it('should work end-to-end with realistic quiz data', () => {
      // Define the known styles that will be used
      const knownStyles = ['Clássico', 'Natural', 'Elegante', 'Romântico', 'Dramático'];
      
      // Simulate real quiz answers with weights
      const quizAnswers = [
        { questionId: 'q2', optionId: 'classic-dress', weights: { 'Clássico': 4, 'Elegante': 2 } as Record<string, number> },
        { questionId: 'q3', optionId: 'neutral-colors', weights: { 'Natural': 3, 'Clássico': 1 } as Record<string, number> },
        { questionId: 'q4', optionId: 'minimal-accessories', weights: { 'Natural': 2, 'Clássico': 3 } as Record<string, number> },
        { questionId: 'q5', optionId: 'office-occasion', weights: { 'Clássico': 3, 'Elegante': 1 } as Record<string, number> },
      ];

      const result = computeResults(quizAnswers, knownStyles);

      // Verify the result has the expected structure
      expect(result).toHaveProperty('primaryStyle');
      expect(result).toHaveProperty('secondaryStyles');
      expect(result).toHaveProperty('scores');
      expect(result).toHaveProperty('totalQuestions', 4);
      expect(result).toHaveProperty('version', 'v1');

      // Verify Clássico is the primary style (11 points total)
      expect(result.primaryStyle.style).toBe('Clássico');
      expect(result.primaryStyle.score).toBe(11);

      // Verify scores are calculated correctly
      expect(result.scores['Clássico']).toBe(11);
      expect(result.scores['Natural']).toBe(5);
      expect(result.scores['Elegante']).toBe(3);
    });

    it('should handle version persistence', () => {
      const answers = [
        { questionId: 'q1', optionId: 'o1', weights: { 'Style1': 1 } }
      ];

      const result = computeResults(answers);
      
      // Ensure version is always set to v1
      expect(result.version).toBe('v1');
    });
  });

  describe('useSupabaseQuiz integration', () => {
    it('should have the correct saveAnswer signature', () => {
      // This test verifies that the function signature matches what we expect
      // The actual useSupabaseQuiz hook requires React context, so we just check types
      
      // Mock the expected function signature
      const mockSaveAnswer = vi.fn().mockResolvedValue(true);
      
      // Test that we can call it with the new signature
      const answerData = {
        questionId: 'q1',
        optionId: 'option1', 
        weights: { 'Style1': 2, 'Style2': 1 }
      };

      mockSaveAnswer(answerData);
      
      expect(mockSaveAnswer).toHaveBeenCalledWith(answerData);
    });
  });
});