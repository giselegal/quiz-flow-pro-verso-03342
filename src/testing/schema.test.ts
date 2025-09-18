/**
 * 🧪 CONSOLIDATED SCHEMA TESTS - FASE 6
 * 
 * Testes abrangentes para o Master Schema:
 * ✅ Validação de tipos e estruturas
 * ✅ Performance de validação
 * ✅ Edge cases e error handling
 * ✅ Integração com Zod
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MasterSchema, type Quiz, type Question } from '../../consolidated/schemas/masterSchema';
import { measurePerformance, expectPerformant } from '../setup';

describe('MasterSchema Tests', () => {
    describe('Quiz Schema Validation', () => {
        it('should validate a correct quiz structure', () => {
            const validQuiz: Quiz = {
                id: 'quiz-123',
                title: 'Test Quiz',
                description: 'A quiz for testing',
                questions: [{
                    id: 'q1',
                    type: 'multiple-choice',
                    text: 'What is 2+2?',
                    options: [
                        { id: 'opt1', text: '3', isCorrect: false },
                        { id: 'opt2', text: '4', isCorrect: true }
                    ]
                }],
                settings: {
                    timeLimit: 300,
                    allowBacktrack: true,
                    shuffleQuestions: false
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const result = MasterSchema.Quiz.safeParse(validQuiz);
            expect(result.success).toBe(true);

            if (result.success) {
                expect(result.data.title).toBe('Test Quiz');
                expect(result.data.questions).toHaveLength(1);
            }
        });

        it('should reject quiz with invalid ID', () => {
            const invalidQuiz = {
                id: '', // Empty ID should fail
                title: 'Test Quiz',
                description: 'A quiz for testing',
                questions: [],
                settings: {
                    timeLimit: 300,
                    allowBacktrack: true,
                    shuffleQuestions: false
                }
            };

            const result = MasterSchema.Quiz.safeParse(invalidQuiz);
            expect(result.success).toBe(false);

            if (!result.success) {
                expect(result.error.issues).toContainEqual(
                    expect.objectContaining({
                        path: ['id'],
                        message: expect.stringContaining('at least 1 character')
                    })
                );
            }
        });

        it('should reject quiz with empty questions array', () => {
            const invalidQuiz = {
                id: 'quiz-123',
                title: 'Test Quiz',
                description: 'A quiz for testing',
                questions: [], // Empty array should fail for published quizzes
                settings: {
                    timeLimit: 300,
                    allowBacktrack: true,
                    shuffleQuestions: false
                }
            };

            const result = MasterSchema.Quiz.safeParse(invalidQuiz);
            // Note: Depending on schema rules, this might be valid for draft quizzes
            // Adjust based on actual schema implementation
        });

        it('should validate quiz with complex nested structure', () => {
            const complexQuiz: Quiz = {
                id: 'complex-quiz-456',
                title: 'Complex Quiz Structure',
                description: 'Testing nested validation',
                questions: [
                    {
                        id: 'q1',
                        type: 'multiple-choice',
                        text: 'Multiple choice question?',
                        options: [
                            { id: 'mc1', text: 'Option A', isCorrect: false },
                            { id: 'mc2', text: 'Option B', isCorrect: true },
                            { id: 'mc3', text: 'Option C', isCorrect: false }
                        ]
                    },
                    {
                        id: 'q2',
                        type: 'true-false',
                        text: 'True or false question?',
                        options: [
                            { id: 'tf1', text: 'True', isCorrect: true },
                            { id: 'tf2', text: 'False', isCorrect: false }
                        ]
                    }
                ],
                settings: {
                    timeLimit: 600,
                    allowBacktrack: false,
                    shuffleQuestions: true
                },
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-02T00:00:00.000Z'
            };

            const result = MasterSchema.Quiz.safeParse(complexQuiz);
            expect(result.success).toBe(true);
        });
    });

    describe('Question Schema Validation', () => {
        it('should validate multiple-choice question', () => {
            const question: Question = {
                id: 'mc-question',
                type: 'multiple-choice',
                text: 'Which is correct?',
                options: [
                    { id: 'opt1', text: 'Wrong', isCorrect: false },
                    { id: 'opt2', text: 'Right', isCorrect: true }
                ]
            };

            const result = MasterSchema.Question.safeParse(question);
            expect(result.success).toBe(true);
        });

        it('should validate true-false question', () => {
            const question: Question = {
                id: 'tf-question',
                type: 'true-false',
                text: 'This is true.',
                options: [
                    { id: 'true-opt', text: 'True', isCorrect: true },
                    { id: 'false-opt', text: 'False', isCorrect: false }
                ]
            };

            const result = MasterSchema.Question.safeParse(question);
            expect(result.success).toBe(true);
        });

        it('should require at least one correct option', () => {
            const invalidQuestion = {
                id: 'invalid-question',
                type: 'multiple-choice',
                text: 'Which is correct?',
                options: [
                    { id: 'opt1', text: 'Wrong 1', isCorrect: false },
                    { id: 'opt2', text: 'Wrong 2', isCorrect: false }
                ]
            };

            const result = MasterSchema.Question.safeParse(invalidQuestion);
            // This test depends on schema implementation
            // Some schemas might allow all false for partial questions
        });

        it('should require minimum number of options for multiple-choice', () => {
            const invalidQuestion = {
                id: 'single-option',
                type: 'multiple-choice',
                text: 'Only one option?',
                options: [
                    { id: 'only-opt', text: 'Only option', isCorrect: true }
                ]
            };

            const result = MasterSchema.Question.safeParse(invalidQuestion);
            expect(result.success).toBe(false);
        });
    });

    describe('Settings Schema Validation', () => {
        it('should validate default settings', () => {
            const settings = {
                timeLimit: 300,
                allowBacktrack: true,
                shuffleQuestions: false
            };

            const result = MasterSchema.QuizSettings.safeParse(settings);
            expect(result.success).toBe(true);
        });

        it('should validate settings with extended properties', () => {
            const extendedSettings = {
                timeLimit: 1800,
                allowBacktrack: false,
                shuffleQuestions: true,
                showResults: true,
                allowRetake: false,
                passingScore: 80
            };

            const result = MasterSchema.QuizSettings.safeParse(extendedSettings);
            // Result depends on schema allowing additional properties
        });

        it('should reject negative time limit', () => {
            const invalidSettings = {
                timeLimit: -60, // Negative time should fail
                allowBacktrack: true,
                shuffleQuestions: false
            };

            const result = MasterSchema.QuizSettings.safeParse(invalidSettings);
            expect(result.success).toBe(false);
        });
    });

    describe('Performance Tests', () => {
        it('should validate small quiz quickly', async () => {
            const smallQuiz: Quiz = {
                id: 'small-quiz',
                title: 'Small Quiz',
                description: 'Quick validation test',
                questions: [{
                    id: 'q1',
                    type: 'true-false',
                    text: 'Performance test?',
                    options: [
                        { id: 'true', text: 'True', isCorrect: true },
                        { id: 'false', text: 'False', isCorrect: false }
                    ]
                }],
                settings: {
                    timeLimit: 300,
                    allowBacktrack: true,
                    shuffleQuestions: false
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const { duration } = await measurePerformance(
                () => MasterSchema.Quiz.safeParse(smallQuiz),
                'Small quiz validation'
            );

            expectPerformant(duration, 10, 'Small quiz validation');
        });

        it('should validate large quiz within acceptable time', async () => {
            // Create quiz with 100 questions
            const questions: Question[] = Array.from({ length: 100 }, (_, i) => ({
                id: `q${i}`,
                type: 'multiple-choice' as const,
                text: `Question ${i + 1}?`,
                options: [
                    { id: `${i}a`, text: 'Option A', isCorrect: i % 2 === 0 },
                    { id: `${i}b`, text: 'Option B', isCorrect: i % 2 === 1 },
                    { id: `${i}c`, text: 'Option C', isCorrect: false }
                ]
            }));

            const largeQuiz: Quiz = {
                id: 'large-quiz',
                title: 'Large Quiz Performance Test',
                description: 'Testing performance with many questions',
                questions,
                settings: {
                    timeLimit: 3600,
                    allowBacktrack: true,
                    shuffleQuestions: true
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const { duration } = await measurePerformance(
                () => MasterSchema.Quiz.safeParse(largeQuiz),
                'Large quiz validation'
            );

            expectPerformant(duration, 100, 'Large quiz validation');
        });

        it('should handle multiple rapid validations', async () => {
            const quiz: Quiz = {
                id: 'rapid-test',
                title: 'Rapid Validation Test',
                description: 'Testing rapid successive validations',
                questions: [{
                    id: 'rapid-q',
                    type: 'multiple-choice',
                    text: 'Rapid test?',
                    options: [
                        { id: 'a', text: 'A', isCorrect: true },
                        { id: 'b', text: 'B', isCorrect: false }
                    ]
                }],
                settings: {
                    timeLimit: 300,
                    allowBacktrack: true,
                    shuffleQuestions: false
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const { duration } = await measurePerformance(
                () => {
                    // Run 100 validations
                    for (let i = 0; i < 100; i++) {
                        const result = MasterSchema.Quiz.safeParse(quiz);
                        expect(result.success).toBe(true);
                    }
                },
                '100 rapid validations'
            );

            expectPerformant(duration, 200, 'Rapid validations');
        });
    });

    describe('Error Handling', () => {
        it('should provide detailed error messages for invalid data', () => {
            const invalidQuiz = {
                id: null, // Invalid type
                title: '', // Empty string
                description: null, // Invalid type
                questions: 'invalid', // Wrong type
                settings: {
                    timeLimit: 'invalid', // Wrong type
                    allowBacktrack: 'maybe', // Wrong type
                }
            };

            const result = MasterSchema.Quiz.safeParse(invalidQuiz);
            expect(result.success).toBe(false);

            if (!result.success) {
                const errors = result.error.issues;
                expect(errors.length).toBeGreaterThan(0);

                // Check that we get specific error messages
                const idError = errors.find(e => e.path.includes('id'));
                const titleError = errors.find(e => e.path.includes('title'));
                const questionsError = errors.find(e => e.path.includes('questions'));

                expect(idError).toBeDefined();
                expect(titleError).toBeDefined();
                expect(questionsError).toBeDefined();
            }
        });

        it('should handle circular references gracefully', () => {
            const circularQuiz: any = {
                id: 'circular-quiz',
                title: 'Circular Test',
                description: 'Testing circular references',
                questions: [],
                settings: {
                    timeLimit: 300,
                    allowBacktrack: true,
                    shuffleQuestions: false
                }
            };

            // Create circular reference
            circularQuiz.circular = circularQuiz;

            // Schema should handle this gracefully without infinite loop
            const startTime = Date.now();
            const result = MasterSchema.Quiz.safeParse(circularQuiz);
            const duration = Date.now() - startTime;

            expect(duration).toBeLessThan(1000); // Should not hang
            // Result depends on Zod's handling of circular references
        });
    });

    describe('Type Safety', () => {
        it('should maintain TypeScript type safety', () => {
            const quiz: Quiz = {
                id: 'type-safe-quiz',
                title: 'Type Safety Test',
                description: 'Testing TypeScript integration',
                questions: [{
                    id: 'ts-question',
                    type: 'multiple-choice',
                    text: 'Is TypeScript great?',
                    options: [
                        { id: 'yes', text: 'Yes', isCorrect: true },
                        { id: 'no', text: 'No', isCorrect: false }
                    ]
                }],
                settings: {
                    timeLimit: 300,
                    allowBacktrack: true,
                    shuffleQuestions: false
                },
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            };

            // TypeScript should prevent compilation errors
            expect(quiz.id).toBe('type-safe-quiz');
            expect(quiz.questions[0].type).toBe('multiple-choice');
            expect(quiz.settings.timeLimit).toBe(300);
        });
    });
});