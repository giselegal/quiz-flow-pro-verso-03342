import { describe, it, expect } from 'vitest';
import { computeResults, normalizeUserName, interpolateTemplate } from '../quizResults';

describe('quizResults', () => {
  describe('computeResults', () => {
    it('should calculate correct scores when answers have weights', () => {
      const answers = [
        { questionId: 'q1', optionId: 'o1', weights: { 'Clássico': 3, 'Romântico': 1 } as Record<string, number> },
        { questionId: 'q2', optionId: 'o2', weights: { 'Clássico': 2, 'Dramático': 2 } as Record<string, number> },
        { questionId: 'q3', optionId: 'o3', weights: { 'Romântico': 3, 'Natural': 1 } as Record<string, number> },
      ];

      const result = computeResults(answers);

      expect(result.primaryStyle.style).toBe('Clássico');
      expect(result.primaryStyle.score).toBe(5);
      expect(result.primaryStyle.percentage).toBe(42); // 5 out of 12 total
      expect(result.scores.Clássico).toBe(5);
      expect(result.scores.Romântico).toBe(4);
      expect(result.scores.Dramático).toBe(2);
      expect(result.scores.Natural).toBe(1);
      expect(result.totalQuestions).toBe(3);
      expect(result.version).toBe('v1');
    });

    it('should handle tie by returning first style with highest score', () => {
      const answers = [
        { questionId: 'q1', optionId: 'o1', weights: { 'Clássico': 2, 'Romântico': 2 } },
      ];

      const result = computeResults(answers);

      expect(result.primaryStyle.score).toBe(2);
      expect(result.primaryStyle.percentage).toBe(50); // Tied at 50%
    });

    it('should handle zero total score by giving default style 1 point', () => {
      const answers = [
        { questionId: 'q1', optionId: 'o1' }, // No weights
      ];

      const result = computeResults(answers);

      expect(result.totalQuestions).toBe(1);
      expect(result.primaryStyle.score).toBeGreaterThan(0);
    });

    it('should work with custom known styles', () => {
      const answers = [
        { questionId: 'q1', optionId: 'o1', weights: { 'Custom1': 3, 'Custom2': 1 } },
      ];
      const knownStyles = ['Custom1', 'Custom2', 'Custom3'];

      const result = computeResults(answers, knownStyles);

      expect(result.primaryStyle.style).toBe('Custom1');
      expect(result.primaryStyle.score).toBe(3);
      expect(result.scores.Custom1).toBe(3);
      expect(result.scores.Custom2).toBe(1);
      expect(result.scores.Custom3).toBe(0);
    });

    it('should calculate correct percentages', () => {
      const answers = [
        { questionId: 'q1', optionId: 'o1', weights: { 'Clássico': 7, 'Romântico': 3 } },
      ];

      const result = computeResults(answers);

      expect(result.primaryStyle.percentage).toBe(70); // 7 out of 10
      expect(result.secondaryStyles.find(s => s.style === 'Romântico')?.percentage).toBe(30); // 3 out of 10
    });
  });

  describe('normalizeUserName', () => {
    it('should capitalize first letters and trim whitespace', () => {
      expect(normalizeUserName('  joão silva  ')).toBe('João Silva');
      expect(normalizeUserName('MARIA DOS SANTOS')).toBe('Maria Dos Santos');
      expect(normalizeUserName('ana')).toBe('Ana');
    });

    it('should handle empty or invalid input', () => {
      expect(normalizeUserName('')).toBe('');
      expect(normalizeUserName('   ')).toBe('');
      expect(normalizeUserName(null as any)).toBe('');
      expect(normalizeUserName(undefined as any)).toBe('');
    });
  });

  describe('interpolateTemplate', () => {
    it('should replace template variables correctly', () => {
      const template = 'Olá {{name}}, seu estilo é {{style}} com {{percentage}}% de compatibilidade.';
      const variables = { name: 'João', style: 'Clássico', percentage: 85 };

      const result = interpolateTemplate(template, variables);

      expect(result).toBe('Olá João, seu estilo é Clássico com 85% de compatibilidade.');
    });

    it('should handle missing variables by replacing with empty string', () => {
      const template = 'Olá {{name}}, {{missing}} variável.';
      const variables = { name: 'Ana' };

      const result = interpolateTemplate(template, variables);

      expect(result).toBe('Olá Ana,  variável.');
    });

    it('should handle empty or invalid input', () => {
      expect(interpolateTemplate('', {})).toBe('');
      expect(interpolateTemplate(null as any, {})).toBe('');
      expect(interpolateTemplate(undefined as any, {})).toBe('');
    });

    it('should handle variables with spaces in template', () => {
      const template = 'Hello {{ name }}, your score is {{ score }}.';
      const variables = { name: 'User', score: 100 };

      const result = interpolateTemplate(template, variables);

      expect(result).toBe('Hello User, your score is 100.');
    });
  });
});