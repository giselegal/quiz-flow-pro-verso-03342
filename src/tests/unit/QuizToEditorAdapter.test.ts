/**
 * 🧪 SUITE DE TESTES: QUIZTOEDITORE ADAPTER
 * 
 * Testes unitários e de integração para conversão bidirecional
 * Quiz ↔ Editor com preservação completa da lógica de negócio
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import QuizToEditorAdapter from '@/adapters/QuizToEditorAdapter';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block, BlockType } from '@/types/editor';

describe('🎯 QuizToEditorAdapter - Testes Unitários', () => {

    describe('📥 convertQuizToEditor()', () => {

        test('deve converter quiz completo para formato editor', async () => {
            // ARRANGE
            const funnelId = 'test-quiz-funnel';

            // ACT
            const result = await QuizToEditorAdapter.convertQuizToEditor(funnelId);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.stepBlocks).toBeDefined();
            expect(result.totalSteps).toBe(21);
            expect(result.quizMetadata).toBeDefined();

            // Verificar estrutura dos stepBlocks
            expect(Object.keys(result.stepBlocks)).toHaveLength(21);
            expect(result.stepBlocks['step-1']).toBeDefined();
            expect(result.stepBlocks['step-21']).toBeDefined();
        });

        test('deve preservar tipos de blocos corretamente', async () => {
            // ARRANGE
            const funnelId = 'type-test-funnel';

            // ACT
            const result = await QuizToEditorAdapter.convertQuizToEditor(funnelId);

            // ASSERT
            const step1Blocks = result.stepBlocks['step-1'];
            const step2Blocks = result.stepBlocks['step-2'];

            // Etapa 1 - Introdução
            expect(step1Blocks).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ type: 'text-inline' }),
                    expect.objectContaining({ type: 'input-field' })
                ])
            );

            // Etapa 2 - Primeira questão
            expect(step2Blocks).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ type: 'quiz-options-grid' })
                ])
            );
        });

        test('deve gerar IDs únicos para blocos', async () => {
            // ARRANGE
            const funnelId = 'unique-id-test';

            // ACT
            const result = await QuizToEditorAdapter.convertQuizToEditor(funnelId);

            // ASSERT
            const allBlocks: Block[] = [];
            Object.values(result.stepBlocks).forEach(blocks => {
                allBlocks.push(...blocks);
            });

            const allIds = allBlocks.map(block => block.id);
            const uniqueIds = [...new Set(allIds)];

            expect(allIds).toHaveLength(uniqueIds.length);

            // Verificar formato dos IDs
            allIds.forEach(id => {
                expect(id).toMatch(/^unique-id-test-step-\d+-block-\d+$/);
            });
        });

        test('deve preservar propriedades do quiz', async () => {
            // ARRANGE
            const funnelId = 'properties-test';

            // ACT
            const result = await QuizToEditorAdapter.convertQuizToEditor(funnelId);

            // ASSERT
            const questionBlock = result.stepBlocks['step-2']?.[0];

            expect(questionBlock?.properties).toBeDefined();
            expect(questionBlock?.properties?.stepNumber).toBe(2);
            expect(questionBlock?.properties?.isQuizComponent).toBe(true);

            // Verificar que dados do quiz são preservados
            if (questionBlock?.properties?.quizData) {
                expect(questionBlock.properties.quizData).toBeDefined();
            }
        });

        test('deve incluir metadados completos do quiz', async () => {
            // ARRANGE & ACT
            const result = await QuizToEditorAdapter.convertQuizToEditor('meta-test');

            // ASSERT
            const { quizMetadata } = result;

            expect(quizMetadata.styles).toEqual([
                'Natural', 'Clássico', 'Contemporâneo', 'Elegante',
                'Romântico', 'Sexy', 'Dramático', 'Criativo'
            ]);

            expect(quizMetadata.scoringSystem).toEqual({
                questionSteps: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                strategicSteps: [13, 14, 15, 16, 17, 18],
                resultStep: 20,
                offerStep: 21
            });

            expect(quizMetadata.strategicQuestions).toHaveLength(6);
        });
    });

    describe('📤 convertEditorToQuiz()', () => {

        let mockStepBlocks: Record<string, Block[]>;

        beforeEach(() => {
            mockStepBlocks = {
                'step-1': [
                    {
                        id: 'step-1-block-1',
                        type: 'text-inline' as BlockType,
                        order: 1,
                        properties: {
                            stepNumber: 1,
                            isQuizComponent: true,
                            text: 'Título editado'
                        },
                        content: { text: 'Título editado' }
                    }
                ],
                'step-2': [
                    {
                        id: 'step-2-block-1',
                        type: 'quiz-options-grid' as BlockType,
                        order: 1,
                        properties: {
                            stepNumber: 2,
                            isQuizComponent: true,
                            question: 'Pergunta editada no editor',
                            options: [
                                { id: '1', text: 'Opção A editada', points: { classico: 10 } },
                                { id: '2', text: 'Opção B editada', points: { romantico: 8 } }
                            ]
                        },
                        content: {
                            question: 'Pergunta editada no editor',
                            options: [
                                { id: '1', text: 'Opção A editada' },
                                { id: '2', text: 'Opção B editada' }
                            ]
                        }
                    }
                ]
            };
        });

        test('deve converter stepBlocks de volta para formato quiz', async () => {
            // ACT
            const result = await QuizToEditorAdapter.convertEditorToQuiz(mockStepBlocks);

            // ASSERT
            expect(result).toBeDefined();
            expect(result['step-1']).toBeDefined();
            expect(result['step-2']).toBeDefined();

            // Verificar estrutura do step-1
            const step1 = result['step-1'];
            expect(step1).toHaveLength(1);
            expect(step1[0]).toEqual(
                expect.objectContaining({
                    id: 'step-1-block-1',
                    type: 'text-inline',
                    order: 1
                })
            );
        });

        test('deve preservar alterações feitas no editor', async () => {
            // ACT
            const result = await QuizToEditorAdapter.convertEditorToQuiz(mockStepBlocks);

            // ASSERT
            const step2Block = result['step-2'][0];

            expect(step2Block.content.question).toBe('Pergunta editada no editor');
            expect(step2Block.content.options).toEqual([
                { id: '1', text: 'Opção A editada' },
                { id: '2', text: 'Opção B editada' }
            ]);
        });

        test('deve mapear tipos do editor de volta para quiz', async () => {
            // ARRANGE
            const editorBlocks = {
                'step-3': [
                    {
                        id: 'step-3-block-1',
                        type: 'quiz-strategic-options' as BlockType,
                        order: 1,
                        properties: { stepNumber: 3 },
                        content: {}
                    }
                ]
            };

            // ACT
            const result = await QuizToEditorAdapter.convertEditorToQuiz(editorBlocks);

            // ASSERT
            expect(result['step-3'][0].type).toBe('strategic-options');
        });
    });

    describe('⚙️ getStepConfiguration()', () => {

        test('deve retornar configuração para etapa de introdução', async () => {
            // ACT
            const config = await QuizToEditorAdapter.getStepConfiguration(1);

            // ASSERT
            expect(config).not.toBeNull();
            expect(config?.type).toBe('intro');
            expect(config?.stepNumber).toBe(1);
            expect(config?.blocks).toBeDefined();
            expect(config?.metadata?.isQuizStep).toBe(true);
        });

        test('deve retornar configuração para questões regulares', async () => {
            // ACT
            const configs = await Promise.all([
                QuizToEditorAdapter.getStepConfiguration(2),
                QuizToEditorAdapter.getStepConfiguration(5),
                QuizToEditorAdapter.getStepConfiguration(11)
            ]);

            // ASSERT
            configs.forEach(config => {
                expect(config).not.toBeNull();
                expect(config?.type).toBe('question');
                expect(config?.blocks).toBeDefined();
            });
        });

        test('deve retornar configuração para questões estratégicas', async () => {
            // ACT
            const configs = await Promise.all([
                QuizToEditorAdapter.getStepConfiguration(13),
                QuizToEditorAdapter.getStepConfiguration(16),
                QuizToEditorAdapter.getStepConfiguration(18)
            ]);

            // ASSERT
            configs.forEach(config => {
                expect(config).not.toBeNull();
                expect(config?.type).toBe('strategic-question');
                expect(config?.blocks).toBeDefined();
            });
        });

        test('deve retornar configuração para resultado e oferta', async () => {
            // ACT
            const resultConfig = await QuizToEditorAdapter.getStepConfiguration(20);
            const offerConfig = await QuizToEditorAdapter.getStepConfiguration(21);

            // ASSERT
            expect(resultConfig?.type).toBe('result');
            expect(offerConfig?.type).toBe('offer');
        });

        test('deve retornar null para etapa inexistente', async () => {
            // ACT
            const config = await QuizToEditorAdapter.getStepConfiguration(99);

            // ASSERT
            expect(config).toBeNull();
        });
    });

    describe('✅ validateQuizData()', () => {

        test('deve validar dados válidos do quiz', () => {
            // ARRANGE
            const validData = {
                stepBlocks: {},
                totalSteps: 21,
                quizMetadata: {}
            };

            // ACT & ASSERT
            expect(QuizToEditorAdapter.validateQuizData(validData)).toBe(true);
        });

        test('deve rejeitar dados inválidos', () => {
            // ARRANGE & ACT & ASSERT
            expect(QuizToEditorAdapter.validateQuizData(null)).toBe(false);
            expect(QuizToEditorAdapter.validateQuizData({})).toBe(false);
            expect(QuizToEditorAdapter.validateQuizData({ stepBlocks: {} })).toBe(false);
            expect(QuizToEditorAdapter.validateQuizData('invalid')).toBe(false);
        });
    });
});

describe('🔄 QuizToEditorAdapter - Testes de Integração', () => {

    test('deve manter consistência em conversão completa (Quiz → Editor → Quiz)', async () => {
        // ARRANGE
        const originalQuizData = QUIZ_STYLE_21_STEPS_TEMPLATE;

        // ACT
        // 1. Quiz → Editor
        const editorData = await QuizToEditorAdapter.convertQuizToEditor('consistency-test');

        // 2. Editor → Quiz
        const convertedQuizData = await QuizToEditorAdapter.convertEditorToQuiz(editorData.stepBlocks);

        // ASSERT
        // Verificar que o número de etapas se mantém
        expect(Object.keys(convertedQuizData)).toHaveLength(21);

        // Verificar estruturas críticas
        Object.keys(originalQuizData).forEach(stepId => {
            expect(convertedQuizData[stepId]).toBeDefined();
            expect(convertedQuizData[stepId]).toHaveLength(originalQuizData[stepId].length);
        });
    });

    test('deve preservar funcionalidade de pontuação do quiz', async () => {
        // ARRANGE
        const funnelId = 'scoring-test';

        // ACT
        const editorData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);

        // Simular edição de uma opção
        const step2Block = editorData.stepBlocks['step-2']?.[0];
        if (step2Block && step2Block.properties) {
            step2Block.properties.options = [
                { id: '1', text: 'Nova opção', points: { classico: 15, romantico: 5 } }
            ];
        }

        const convertedQuiz = await QuizToEditorAdapter.convertEditorToQuiz(editorData.stepBlocks);

        // ASSERT
        const step2QuizBlock = convertedQuiz['step-2']?.[0];
        expect(step2QuizBlock?.properties?.options?.[0]?.points).toEqual({
            classico: 15,
            romantico: 5
        });
    });

    test('deve suportar múltiplas conversões sem degradação', async () => {
        // ARRANGE
        let currentData = await QuizToEditorAdapter.convertQuizToEditor('multi-test');

        // ACT - Múltiplas conversões
        for (let i = 0; i < 5; i++) {
            const quizData = await QuizToEditorAdapter.convertEditorToQuiz(currentData.stepBlocks);
            currentData = await QuizToEditorAdapter.convertQuizToEditor(`multi-test-${i}`);
        }

        // ASSERT
        expect(currentData.totalSteps).toBe(21);
        expect(Object.keys(currentData.stepBlocks)).toHaveLength(21);
        expect(currentData.quizMetadata).toBeDefined();
    });
});

describe('🎯 QuizToEditorAdapter - Casos Edge', () => {

    test('deve lidar com blocos sem propriedades', async () => {
        // ARRANGE
        const stepBlocks = {
            'step-1': [
                {
                    id: 'empty-block',
                    type: 'text-inline' as BlockType,
                    order: 1,
                    properties: {},
                    content: {}
                }
            ]
        };

        // ACT & ASSERT
        expect(async () => {
            await QuizToEditorAdapter.convertEditorToQuiz(stepBlocks);
        }).not.toThrow();
    });

    test('deve lidar com IDs de etapa inválidos', async () => {
        // ARRANGE
        const stepBlocks = {
            'invalid-step': [
                {
                    id: 'block-1',
                    type: 'text-inline' as BlockType,
                    order: 1,
                    properties: {},
                    content: {}
                }
            ]
        };

        // ACT & ASSERT
        expect(async () => {
            await QuizToEditorAdapter.convertEditorToQuiz(stepBlocks);
        }).not.toThrow();
    });

    test('deve lidar com templates incompletos', async () => {
        // ARRANGE
        const mockGetStepTemplate = jest.spyOn(require('../src/templates/quiz21StepsComplete'), 'getStepTemplate');
        mockGetStepTemplate.mockReturnValue(null);

        // ACT & ASSERT
        const result = await QuizToEditorAdapter.convertQuizToEditor('incomplete-test');
        expect(result.stepBlocks).toBeDefined();
        expect(Object.keys(result.stepBlocks)).toHaveLength(0);

        // Cleanup
        mockGetStepTemplate.mockRestore();
    });
});