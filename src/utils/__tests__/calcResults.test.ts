import { describe, it, expect, beforeEach } from 'vitest';
import {
  CalculationEngine,
  calculateQuizResults,
  validateQuizData,
  ENGINE_VERSION,
  QuizDefinition,
  UserResponses
} from '../calcResults';

describe('Enhanced Calculation Engine', () => {
  let engine: CalculationEngine;
  let mockQuizDefinition: QuizDefinition;
  let mockUserResponses: UserResponses;

  beforeEach(() => {
    engine = new CalculationEngine();
    
    mockQuizDefinition = {
      id: 'test-quiz',
      questions: [
        {
          id: 'q1',
          type: 'single-choice',
          options: [
            { id: 'o1', weights: { 'Clássico': 3, 'Romântico': 1 } as Record<string, number> },
            { id: 'o2', weights: { 'Dramático': 2, 'Natural': 2 } as Record<string, number> }
          ]
        },
        {
          id: 'q2',
          type: 'single-choice',
          options: [
            { id: 'o3', weights: { 'Clássico': 2, 'Criativo': 3 } as Record<string, number> },
            { id: 'o4', weights: { 'Romântico': 4, 'Natural': 1 } as Record<string, number> }
          ]
        }
      ],
      outcomes: [
        {
          id: 'classic-outcome',
          name: 'Estilo Clássico',
          description: 'Você tem um estilo clássico predominante',
          conditions: [
            {
              type: 'style_score',
              operator: 'gte',
              value: 4,
              styleId: 'Clássico'
            }
          ],
          template: {
            title: 'Seu Estilo é Clássico',
            description: 'Você tem preferência por elementos atemporais e elegantes',
            recommendations: [
              'Invista em peças básicas de qualidade',
              'Prefira cores neutras e combinações tradicionais'
            ]
          }
        }
      ]
    };

    mockUserResponses = {
      sessionId: 'test-session',
      userId: 'test-user',
      funnelId: 'test-funnel',
      responses: [
        { questionId: 'q1', optionId: 'o1', weights: { 'Clássico': 3, 'Romântico': 1 } as Record<string, number> },
        { questionId: 'q2', optionId: 'o3', weights: { 'Clássico': 2, 'Criativo': 3 } as Record<string, number> }
      ],
      metadata: {
        startTime: new Date(),
        endTime: new Date(),
        userAgent: 'test-agent'
      }
    };
  });

  describe('computeResult', () => {
    it('should calculate results with proper metadata', () => {
      const result = engine.computeResult(mockQuizDefinition, mockUserResponses);

      expect(result).toHaveProperty('engineVersion', ENGINE_VERSION);
      expect(result).toHaveProperty('schemaHash');
      expect(result).toHaveProperty('calculatedAt');
      expect(result.calculatedAt).toBeInstanceOf(Date);
    });

    it('should calculate correct scores and breakdown', () => {
      const result = engine.computeResult(mockQuizDefinition, mockUserResponses);

      expect(result.scores.Clássico).toBe(5); // 3 + 2
      expect(result.scores.Romântico).toBe(1);
      expect(result.scores.Criativo).toBe(3);
      expect(result.primaryStyle.style).toBe('Clássico');
      
      expect(result.breakdown.totalResponses).toBe(2);
      expect(result.breakdown.validResponses).toBe(2);
      expect(result.breakdown.invalidResponses).toBe(0);
    });

    it('should match outcomes correctly', () => {
      const result = engine.computeResult(mockQuizDefinition, mockUserResponses);

      expect(result.matchedOutcome).toBeDefined();
      expect(result.matchedOutcome?.id).toBe('classic-outcome');
      expect(result.matchedOutcome?.name).toBe('Estilo Clássico');
      expect(result.matchedOutcome?.confidence).toBeGreaterThan(0);
    });

    it('should calculate quality metrics', () => {
      const result = engine.computeResult(mockQuizDefinition, mockUserResponses);

      expect(result.quality.completeness).toBe(100);
      expect(result.quality.consistency).toBeGreaterThan(0);
      expect(result.quality.confidence).toBeGreaterThan(0);
    });

    it('should handle invalid responses gracefully', () => {
      const invalidResponses: UserResponses = {
        ...mockUserResponses,
        responses: [
          { questionId: '', optionId: '', weights: {} },
          { questionId: 'q1', optionId: 'o1', weights: { 'Clássico': 3 } as Record<string, number> }
        ]
      };

      const result = engine.computeResult(mockQuizDefinition, invalidResponses);

      expect(result.breakdown.validResponses).toBe(1);
      expect(result.breakdown.invalidResponses).toBe(1);
      expect(result.quality.completeness).toBe(50);
    });

    it('should fallback to basic calculation on error', () => {
      const invalidDefinition = {} as QuizDefinition;

      const result = engine.computeResult(invalidDefinition, mockUserResponses);

      expect(result.engineVersion).toBe(ENGINE_VERSION);
      expect(result.schemaHash).toBe('fallback');
    });
  });

  describe('validateStepResponse', () => {
    it('should validate correct responses', () => {
      const response = {
        questionId: 'q1',
        optionId: 'o1',
        weights: { 'Clássico': 3 }
      };

      const validation = engine.validateStepResponse('step-1', response);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const response = {
        optionId: 'o1'
        // missing questionId
      };

      const validation = engine.validateStepResponse('step-1', response);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Response for step step-1 missing questionId');
    });

    it('should warn about missing optional fields', () => {
      const response = {
        questionId: 'q1'
        // missing optionId
      };

      const validation = engine.validateStepResponse('step-1', response);

      expect(validation.warnings).toContain('Response for step step-1 missing optionId');
    });

    it('should handle null/undefined responses', () => {
      const validation = engine.validateStepResponse('step-1', null);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Response for step step-1 is missing');
    });
  });

  describe('getOutcomeTemplate', () => {
    it('should return outcome template for valid ID', () => {
      const template = engine.getOutcomeTemplate('test-outcome');

      expect(template).toBeDefined();
      expect(template?.title).toBeDefined();
      expect(template?.description).toBeDefined();
      expect(template?.recommendations).toBeDefined();
    });
  });

  describe('Utility Functions', () => {
    it('calculateQuizResults should work with singleton', () => {
      const result = calculateQuizResults(mockQuizDefinition, mockUserResponses);

      expect(result).toBeDefined();
      expect(result.engineVersion).toBe(ENGINE_VERSION);
    });

    it('validateQuizData should validate inputs', () => {
      const validation = validateQuizData(mockQuizDefinition, mockUserResponses);

      expect(validation.isValid).toBe(true);
    });

    it('should validate invalid quiz definition', () => {
      const invalidDefinition = {} as QuizDefinition;
      const validation = validateQuizData(invalidDefinition, mockUserResponses);

      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty responses', () => {
      const emptyResponses: UserResponses = {
        ...mockUserResponses,
        responses: []
      };

      const result = engine.computeResult(mockQuizDefinition, emptyResponses);

      expect(result.breakdown.totalResponses).toBe(0);
      expect(result.quality.completeness).toBe(0);
    });

    it('should handle responses without weights', () => {
      const noWeightResponses: UserResponses = {
        ...mockUserResponses,
        responses: [
          { questionId: 'q1', optionId: 'o1' }, // no weights
          { questionId: 'q2', optionId: 'o2' }  // no weights
        ]
      };

      const result = engine.computeResult(mockQuizDefinition, noWeightResponses);

      expect(result.breakdown.validResponses).toBe(2);
      expect(Object.values(result.scores).some(score => score > 0)).toBe(true);
    });

    it('should handle quiz with no outcomes defined', () => {
      const noOutcomesDefinition: QuizDefinition = {
        ...mockQuizDefinition,
        outcomes: []
      };

      const result = engine.computeResult(noOutcomesDefinition, mockUserResponses);

      expect(result.matchedOutcome).toBeUndefined();
    });
  });

  describe('Performance and Consistency', () => {
    it('should produce consistent results for same inputs', () => {
      const result1 = engine.computeResult(mockQuizDefinition, mockUserResponses);
      const result2 = engine.computeResult(mockQuizDefinition, mockUserResponses);

      expect(result1.scores).toEqual(result2.scores);
      expect(result1.primaryStyle.style).toBe(result2.primaryStyle.style);
      expect(result1.schemaHash).toBe(result2.schemaHash);
    });

    it('should handle large datasets efficiently', () => {
      const largeResponses: UserResponses = {
        ...mockUserResponses,
        responses: Array.from({ length: 1000 }, (_, i) => ({
          questionId: `q${i % 10}`,
          optionId: `o${i % 4}`,
          weights: { 'Clássico': 1, 'Romântico': 1 } as Record<string, number>
        }))
      };

      const startTime = Date.now();
      const result = engine.computeResult(mockQuizDefinition, largeResponses);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
      expect(result.breakdown.totalResponses).toBe(1000);
    });
  });
});

describe('Integration with existing quizResults', () => {
  it('should maintain compatibility with existing interface', () => {
    const responses = [
      { questionId: 'q1', optionId: 'o1', weights: { 'Clássico': 3, 'Romântico': 1 } as Record<string, number> },
      { questionId: 'q2', optionId: 'o2', weights: { 'Dramático': 2, 'Natural': 2 } as Record<string, number> }
    ];

    const quizDefinition: QuizDefinition = {
      id: 'compat-test',
      questions: [
        {
          id: 'q1',
          type: 'choice',
          options: [{ id: 'o1', weights: { 'Clássico': 3, 'Romântico': 1 } }]
        }
      ],
      outcomes: []
    };

    const userResponses: UserResponses = {
      sessionId: 'compat-session',
      funnelId: 'compat-funnel',
      responses
    };

    const result = calculateQuizResults(quizDefinition, userResponses);

    // Should have all the basic properties that existing code expects
    expect(result).toHaveProperty('primaryStyle');
    expect(result).toHaveProperty('secondaryStyles');
    expect(result).toHaveProperty('scores');
    expect(result).toHaveProperty('totalQuestions');
    expect(result).toHaveProperty('version');

    // Should also have enhanced properties
    expect(result).toHaveProperty('engineVersion');
    expect(result).toHaveProperty('breakdown');
    expect(result).toHaveProperty('quality');
  });
});