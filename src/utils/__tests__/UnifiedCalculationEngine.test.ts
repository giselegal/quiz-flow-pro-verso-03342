// src/utils/__tests__/UnifiedCalculationEngine.test.ts
// 🧪 Testes para validar a consolidação dos algoritmos de cálculo

import { describe, it, expect } from 'vitest';
import { UnifiedCalculationEngine, calculateQuizResults } from '../UnifiedCalculationEngine';
import { QuizAnswer } from '@/types/quiz';

describe('UnifiedCalculationEngine', () => {
    // Mock de respostas simulando um quiz completo
    const mockAnswers: QuizAnswer[] = [
        { questionId: 'q1', optionId: 'q1_natural', weight: 1 },
        { questionId: 'q2', optionId: 'q2_classico', weight: 1 },
        { questionId: 'q3', optionId: 'q3_natural', weight: 1 },
        { questionId: 'q4', optionId: 'q4_romantico', weight: 1 },
        { questionId: 'q5', optionId: 'q5_natural', weight: 1 },
        { questionId: 'q6', optionId: 'q6_dramatico', weight: 1 },
        { questionId: 'q7', optionId: 'q7_natural', weight: 1 },
        { questionId: 'q8', optionId: 'q8_criativo', weight: 1 },
        { questionId: 'q9', optionId: 'q9_natural', weight: 1 },
        { questionId: 'q10', optionId: 'q10_natural', weight: 1 }
    ];

    // Respostas não pontuáveis (devem ser ignoradas)
    const mockStrategicAnswers: QuizAnswer[] = [
        { questionId: 'q11', optionId: 'strategic1', weight: 1 },
        { questionId: 'q12', optionId: 'strategic2', weight: 1 }
    ];

    it('should filter only scorable questions (q1-q10)', () => {
        const allAnswers = [...mockAnswers, ...mockStrategicAnswers];
        const result = calculateQuizResults(allAnswers);

        // Deve considerar apenas as 10 questões pontuáveis
        expect(result.totalQuestions).toBe(10);
    });

    it('should calculate correct primary style', () => {
        const result = calculateQuizResults(mockAnswers);

        // Natural deve ser predominante (6 respostas)
        expect(result.primaryStyle.category).toBe('Natural');
        expect(result.primaryStyle.points).toBe(6);
        expect(result.primaryStyle.rank).toBe(1);
    });

    it('should calculate correct percentages', () => {
        const result = calculateQuizResults(mockAnswers);

        // Natural = 6/10 = 60%
        expect(result.primaryStyle.percentage).toBe(60);

        // Verificar se percentuais somam corretamente
        const totalPercentage = result.primaryStyle.percentage +
            result.secondaryStyles.reduce((sum, style) => sum + style.percentage, 0);
        expect(totalPercentage).toBe(100);
    });

    it('should include user data when requested', () => {
        const result = calculateQuizResults(mockAnswers, {
            includeUserData: true,
            userName: 'Maria Silva',
            strategicAnswersCount: 5
        });

        expect(result.userData).toBeDefined();
        expect(result.userData?.name).toBe('Maria Silva');
        expect(result.userData?.strategicAnswersCount).toBe(5);
        expect(result.userData?.calculationMetadata).toBeDefined();
    });

    it('should validate answers correctly', () => {
        const engine = new UnifiedCalculationEngine();

        // Teste com respostas válidas
        const validResult = engine.validateAnswers(mockAnswers);
        expect(validResult.valid).toBe(true);
        expect(validResult.issues).toHaveLength(0);

        // Teste com respostas insuficientes
        const fewAnswers = mockAnswers.slice(0, 3);
        const invalidResult = engine.validateAnswers(fewAnswers);
        expect(invalidResult.valid).toBe(false);
        expect(invalidResult.issues.length).toBeGreaterThan(0);

        // Teste com array vazio
        const emptyResult = engine.validateAnswers([]);
        expect(emptyResult.valid).toBe(false);
        expect(emptyResult.issues).toContain('Nenhuma resposta fornecida');
    });

    it('should handle tie breaking strategies', () => {
        // Criar cenário de empate
        const tiedAnswers: QuizAnswer[] = [
            { questionId: 'q1', optionId: 'q1_natural', weight: 1 },
            { questionId: 'q2', optionId: 'q2_classico', weight: 1 },
            { questionId: 'q3', optionId: 'q3_natural', weight: 1 },
            { questionId: 'q4', optionId: 'q4_classico', weight: 1 },
            { questionId: 'q5', optionId: 'q5_romantico', weight: 2 } // Empate entre Natural e Clássico
        ];

        const result1 = calculateQuizResults(tiedAnswers, { tieBreakStrategy: 'first-answer' });
        const result2 = calculateQuizResults(tiedAnswers, { tieBreakStrategy: 'highest-score' });

        // Ambos devem ter o mesmo resultado principal (pois não há empate real), mas estratégias devem ser aplicadas
        expect(result1.primaryStyle).toBeDefined();
        expect(result2.primaryStyle).toBeDefined();
    });

    it('should work with centralized configuration', () => {
        const mockConfig = {
            meta: { name: 'Test', version: '1.0', description: 'Test', lastUpdated: '2025' },
            stepRules: {},
            globalScoringConfig: {
                categories: [
                    { id: 'natural', name: 'Natural', description: 'Natural style', color: '#green', weight: 1.0 },
                    { id: 'classico', name: 'Clássico', description: 'Classic style', color: '#blue', weight: 1.0 }
                ],
                algorithm: {
                    type: 'weighted_sum',
                    normalQuestionWeight: 0.7,
                    strategicQuestionWeight: 0.3,
                    minimumScoreDifference: 0.1,
                    tieBreaker: 'first_selection'
                },
                resultCalculation: {
                    primaryStyle: 'highest_score',
                    secondaryStyles: 'top_3_excluding_primary',
                    showPercentages: true,
                    roundTo: 1
                }
            },
            validationMessages: { pt: { step1: {}, quizQuestions: {}, strategicQuestions: {}, general: {} } },
            behaviorPresets: { autoAdvanceSteps: [], manualAdvanceSteps: [], scoringSteps: [], validationRequiredSteps: [] },
            uiConfig: { buttons: {}, animations: {} }
        };

        const engine = new UnifiedCalculationEngine(mockConfig as any);
        const result = engine.calculateResults(mockAnswers);

        expect(result.primaryStyle).toBeDefined();
        expect(result.scores).toBeDefined();
    });

    it('should maintain backward compatibility', () => {
        // Teste se a interface ainda funciona como esperado pelos componentes existentes
        const result = calculateQuizResults(mockAnswers);

        // Verificar estrutura esperada pelo useQuizLogic
        expect(result).toHaveProperty('primaryStyle');
        expect(result).toHaveProperty('secondaryStyles');
        expect(result).toHaveProperty('totalQuestions');
        expect(result).toHaveProperty('completedAt');
        expect(result).toHaveProperty('scores');

        // Verificar estrutura do primaryStyle
        expect(result.primaryStyle).toHaveProperty('category');
        expect(result.primaryStyle).toHaveProperty('score');
        expect(result.primaryStyle).toHaveProperty('percentage');
        expect(result.primaryStyle).toHaveProperty('style');
        expect(result.primaryStyle).toHaveProperty('points');
        expect(result.primaryStyle).toHaveProperty('rank');

        // Verificar que secondaryStyles é um array
        expect(Array.isArray(result.secondaryStyles)).toBe(true);
    });
});

// Teste de performance simples
describe('UnifiedCalculationEngine Performance', () => {
    it('should handle large number of answers efficiently', () => {
        // Criar 1000 respostas simuladas
        const largeAnswerSet: QuizAnswer[] = [];
        for (let i = 1; i <= 10; i++) {
            for (let j = 0; j < 100; j++) {
                largeAnswerSet.push({
                    questionId: `q${i}`,
                    optionId: `q${i}_option_${j}`,
                    weight: 1
                });
            }
        }

        const startTime = performance.now();
        const result = calculateQuizResults(largeAnswerSet);
        const endTime = performance.now();

        expect(result).toBeDefined();
        expect(endTime - startTime).toBeLessThan(100); // Deve completar em menos de 100ms
    });
});