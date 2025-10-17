import { describe, it, expect } from 'vitest';
import { QuestionStepSchema } from '@/schemas/question.schema';

describe('QuestionStepSchema', () => {
  it('accepts minimal valid question', () => {
    const obj = QuestionStepSchema.parse({
      question: 'Pergunta?',
      options: [{ label: 'A' }]
    });
    expect(obj.question).toBe('Pergunta?');
    expect(obj.options.length).toBe(1);
  });

  it('throws when requiredSelections > maxSelections', () => {
    expect(() => QuestionStepSchema.parse({
      question: 'Pergunta?',
      requiredSelections: 2,
      maxSelections: 1,
      options: [{ label: 'A' }]
    })).toThrow();
  });
});
