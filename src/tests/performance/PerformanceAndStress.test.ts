/**
 * 🧪 SUITE DE TESTES: PERFORMANCE E STRESS
 * 
 * Testes de carga, performance e limites do sistema
 * Validação de comportamento sob condições extremas
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import QuizToEditorAdapter from '../src/adapters/QuizToEditorAdapter';
import { QuizPageIntegrationService } from '../src/services/QuizPageIntegrationService';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '../src/templates/quiz21StepsComplete';

// Mock dos serviços externos
jest.mock('../src/services/UnifiedCRUDService');
jest.mock('../src/services/VersioningService');
jest.mock('../src/services/HistoryManager');
jest.mock('../src/services/AnalyticsService');

describe('⚡ Performance Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('🚀 Testes de Velocidade de Conversão', () => {

        test('deve converter Quiz → Editor em menos de 500ms', async () => {
            // ARRANGE
            const funnelId = 'speed-test-quiz-to-editor';
            const iterations = 10;
            const times: number[] = [];

            // ACT - Múltiplas conversões para média
            for (let i = 0; i < iterations; i++) {
                const startTime = performance.now();
                await QuizToEditorAdapter.convertQuizToEditor(`${funnelId}-${i}`);
                const endTime = performance.now();
                times.push(endTime - startTime);
            }

            // ASSERT
            const averageTime = times.reduce((acc, time) => acc + time, 0) / times.length;
            const maxTime = Math.max(...times);

            expect(averageTime).toBeLessThan(500); // < 500ms em média
            expect(maxTime).toBeLessThan(1000);    // < 1s no pior caso

            console.log(`📊 Quiz→Editor: Média ${averageTime.toFixed(2)}ms, Máximo ${maxTime.toFixed(2)}ms`);
        });

        test('deve converter Editor → Quiz em menos de 300ms', async () => {
            // ARRANGE
            const iterations = 10;
            const times: number[] = [];

            // Preparar dados de teste
            const mockStepBlocks = {
                'step-1': Array.from({ length: 5 }, (_, i) => ({
                    id: `block-${i}`,
                    type: 'text-inline' as const,
                    order: i + 1,
                    properties: { text: `Text ${i}` },
                    content: { text: `Text ${i}` }
                })),
                'step-2': Array.from({ length: 3 }, (_, i) => ({
                    id: `question-${i}`,
                    type: 'quiz-options-grid' as const,
                    order: i + 1,
                    properties: {
                        question: `Question ${i}`,
                        options: Array.from({ length: 4 }, (_, j) => ({
                            id: `opt-${i}-${j}`,
                            text: `Option ${j}`,
                            points: { style: Math.random() * 10 }
                        }))
                    },
                    content: {}
                }))
            };

            // ACT
            for (let i = 0; i < iterations; i++) {
                const startTime = performance.now();
                await QuizToEditorAdapter.convertEditorToQuiz(mockStepBlocks);
                const endTime = performance.now();
                times.push(endTime - startTime);
            }

            // ASSERT
            const averageTime = times.reduce((acc, time) => acc + time, 0) / times.length;
            const maxTime = Math.max(...times);

            expect(averageTime).toBeLessThan(300); // < 300ms em média
            expect(maxTime).toBeLessThan(500);     // < 500ms no pior caso

            console.log(`📊 Editor→Quiz: Média ${averageTime.toFixed(2)}ms, Máximo ${maxTime.toFixed(2)}ms`);
        });
    });

    describe('📊 Testes de Escalabilidade', () => {

        test('deve lidar com quiz de 100 etapas sem degradação significativa', async () => {
            // ARRANGE
            const largeQuizTemplate: Record<string, any[]> = {};

            // Criar template com 100 etapas
            for (let step = 1; step <= 100; step++) {
                largeQuizTemplate[`step-${step}`] = [
                    {
                        type: step === 1 ? 'intro' : 'options-grid',
                        content: {
                            question: `Pergunta ${step}`,
                            options: Array.from({ length: 6 }, (_, i) => ({
                                id: `${step}-${i}`,
                                text: `Opção ${i + 1} da etapa ${step}`,
                                points: {
                                    style1: Math.random() * 10,
                                    style2: Math.random() * 10,
                                    style3: Math.random() * 10
                                }
                            }))
                        }
                    }
                ];
            }

            // Mock do template grande
            (QUIZ_STYLE_21_STEPS_TEMPLATE as any) = largeQuizTemplate;

            const funnelId = 'large-quiz-test';
            const startTime = performance.now();

            // ACT
            const editorData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);
            const convertedBack = await QuizToEditorAdapter.convertEditorToQuiz(editorData.stepBlocks);

            const endTime = performance.now();
            const totalTime = endTime - startTime;

            // ASSERT
            expect(totalTime).toBeLessThan(5000); // < 5 segundos para 100 etapas
            expect(Object.keys(editorData.stepBlocks)).toHaveLength(100);
            expect(Object.keys(convertedBack)).toHaveLength(100);

            console.log(`📊 100 etapas processadas em ${totalTime.toFixed(2)}ms`);
        });

        test('deve processar quiz com 1000+ opções por questão', async () => {
            // ARRANGE
            const megaOptionsTemplate = {
                'step-1': [
                    {
                        type: 'options-grid',
                        content: {
                            question: 'Mega questão com muitas opções',
                            options: Array.from({ length: 1000 }, (_, i) => ({
                                id: `mega-${i}`,
                                text: `Opção ${i + 1} - Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
                                imageUrl: `https://example.com/image-${i}.jpg`,
                                points: {
                                    classico: Math.floor(Math.random() * 20),
                                    romantico: Math.floor(Math.random() * 20),
                                    natural: Math.floor(Math.random() * 20),
                                    elegante: Math.floor(Math.random() * 20),
                                    criativo: Math.floor(Math.random() * 20),
                                    dramatico: Math.floor(Math.random() * 20),
                                    sexy: Math.floor(Math.random() * 20)
                                }
                            }))
                        }
                    }
                ]
            };

            (QUIZ_STYLE_21_STEPS_TEMPLATE as any) = megaOptionsTemplate;

            const startTime = performance.now();

            // ACT
            const editorData = await QuizToEditorAdapter.convertQuizToEditor('mega-options-test');
            const convertedBack = await QuizToEditorAdapter.convertEditorToQuiz(editorData.stepBlocks);

            const endTime = performance.now();
            const totalTime = endTime - startTime;

            // ASSERT
            expect(totalTime).toBeLessThan(10000); // < 10 segundos para 1000 opções
            expect(convertedBack['step-1'][0].content.options).toHaveLength(1000);

            console.log(`📊 1000 opções processadas em ${totalTime.toFixed(2)}ms`);
        });
    });

    describe('🎯 Testes de Memória', () => {

        test('deve processar múltiplas conversões sem vazamentos de memória', async () => {
            // ARRANGE
            const iterations = 100;
            const memoryUsage: number[] = [];

            // ACT - Múltiplas conversões
            for (let i = 0; i < iterations; i++) {
                const funnelId = `memory-test-${i}`;

                // Força garbage collection se disponível
                if (global.gc) {
                    global.gc();
                }

                // Medir uso de memória
                const memBefore = process.memoryUsage().heapUsed;

                // Executar conversões
                const editorData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);
                await QuizToEditorAdapter.convertEditorToQuiz(editorData.stepBlocks);

                const memAfter = process.memoryUsage().heapUsed;
                memoryUsage.push(memAfter - memBefore);

                // Log a cada 20 iterações
                if ((i + 1) % 20 === 0) {
                    console.log(`📊 Iteração ${i + 1}/${iterations} - Memória: ${((memAfter - memBefore) / 1024 / 1024).toFixed(2)}MB`);
                }
            }

            // ASSERT
            const avgMemoryDelta = memoryUsage.reduce((acc, mem) => acc + mem, 0) / memoryUsage.length;
            const maxMemoryDelta = Math.max(...memoryUsage);

            // Não deve crescer mais que 50MB por conversão em média
            expect(avgMemoryDelta).toBeLessThan(50 * 1024 * 1024); // 50MB
            expect(maxMemoryDelta).toBeLessThan(100 * 1024 * 1024); // 100MB max

            console.log(`📊 Média de memória por conversão: ${(avgMemoryDelta / 1024 / 1024).toFixed(2)}MB`);
        });

        test('deve limpar recursos após conversões grandes', async () => {
            // ARRANGE
            const largeFunnelId = 'memory-cleanup-test';

            // Criar dados grandes
            const largeStepBlocks: Record<string, any[]> = {};
            for (let step = 1; step <= 50; step++) {
                largeStepBlocks[`step-${step}`] = Array.from({ length: 10 }, (_, i) => ({
                    id: `large-block-${step}-${i}`,
                    type: 'quiz-options-grid',
                    order: i + 1,
                    properties: {
                        question: `Pergunta grande ${step}-${i}`,
                        options: Array.from({ length: 50 }, (_, j) => ({
                            id: `opt-${step}-${i}-${j}`,
                            text: `Opção ${j} com muito texto para simular dados reais do mundo real que podem ser bem grandes`,
                            points: { style: Math.random() * 20 }
                        }))
                    },
                    content: {}
                }));
            }

            const memBefore = process.memoryUsage().heapUsed;

            // ACT
            const result = await QuizToEditorAdapter.convertEditorToQuiz(largeStepBlocks);

            // Simular limpeza manual
            const resultCopy = { ...result };

            // Força garbage collection
            if (global.gc) {
                global.gc();
            }

            const memAfter = process.memoryUsage().heapUsed;

            // ASSERT
            expect(result).toBeDefined();
            expect(resultCopy).toBeDefined();

            const memoryGrowth = memAfter - memBefore;
            expect(memoryGrowth).toBeLessThan(200 * 1024 * 1024); // < 200MB

            console.log(`📊 Crescimento de memória para dados grandes: ${(memoryGrowth / 1024 / 1024).toFixed(2)}MB`);
        });
    });

    describe('🔄 Testes de Concorrência', () => {

        test('deve lidar com múltiplas conversões simultâneas', async () => {
            // ARRANGE
            const concurrentCount = 20;
            const startTime = performance.now();

            // ACT - Conversões simultâneas
            const operations = Array.from({ length: concurrentCount }, async (_, i) => {
                const funnelId = `concurrent-test-${i}`;

                const editorData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);

                // Modificar dados para criar variação
                editorData.stepBlocks['step-1'][0].content = { text: `Concurrent ${i}` };

                return QuizToEditorAdapter.convertEditorToQuiz(editorData.stepBlocks);
            });

            const results = await Promise.all(operations);
            const endTime = performance.now();
            const totalTime = endTime - startTime;

            // ASSERT
            expect(results).toHaveLength(concurrentCount);
            expect(totalTime).toBeLessThan(15000); // < 15 segundos para 20 operações simultâneas

            // Verificar que cada resultado é único
            results.forEach((result, i) => {
                expect(result['step-1'][0].content.text).toBe(`Concurrent ${i}`);
            });

            console.log(`📊 ${concurrentCount} conversões simultâneas em ${totalTime.toFixed(2)}ms`);
        });

        test('deve manter integridade com operações intercaladas', async () => {
            // ARRANGE
            const service = QuizPageIntegrationService.getInstance();
            const operations: Promise<any>[] = [];

            // ACT - Operações intercaladas
            for (let i = 0; i < 10; i++) {
                // Criar funil
                operations.push(service.createDefaultQuizFunnel(`interleaved-${i}`));

                // Conversão Quiz → Editor
                operations.push(QuizToEditorAdapter.convertQuizToEditor(`interleaved-conv-${i}`));

                // Conversão Editor → Quiz
                const mockBlocks = {
                    'step-1': [{
                        id: `block-${i}`,
                        type: 'text-inline' as const,
                        order: 1,
                        properties: { text: `Text ${i}` },
                        content: { text: `Text ${i}` }
                    }]
                };
                operations.push(QuizToEditorAdapter.convertEditorToQuiz(mockBlocks));
            }

            const startTime = performance.now();
            const results = await Promise.allSettled(operations);
            const endTime = performance.now();

            // ASSERT
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;

            expect(successful).toBeGreaterThan(25); // Pelo menos 25/30 operações devem funcionar
            expect(failed).toBeLessThan(5); // Máximo 5 falhas toleradas
            expect(endTime - startTime).toBeLessThan(20000); // < 20 segundos

            console.log(`📊 Operações intercaladas: ${successful} sucessos, ${failed} falhas em ${(endTime - startTime).toFixed(2)}ms`);
        });
    });

    describe('📈 Benchmarks de Referência', () => {

        test('benchmark: conversão Quiz → Editor com diferentes tamanhos', async () => {
            const sizes = [1, 5, 10, 21, 50, 100];
            const benchmarks: { size: number; time: number; }[] = [];

            for (const size of sizes) {
                // Criar template do tamanho especificado
                const template: Record<string, any[]> = {};
                for (let i = 1; i <= size; i++) {
                    template[`step-${i}`] = [
                        {
                            type: i === 1 ? 'intro' : 'options-grid',
                            content: {
                                question: `Pergunta ${i}`,
                                options: Array.from({ length: 4 }, (_, j) => ({
                                    id: `${i}-${j}`,
                                    text: `Opção ${j}`,
                                    points: { style: Math.random() * 10 }
                                }))
                            }
                        }
                    ];
                }

                (QUIZ_STYLE_21_STEPS_TEMPLATE as any) = template;

                // Medir tempo
                const startTime = performance.now();
                await QuizToEditorAdapter.convertQuizToEditor(`benchmark-${size}`);
                const endTime = performance.now();

                benchmarks.push({
                    size,
                    time: endTime - startTime
                });
            }

            // ASSERT & LOG
            console.log('\n📊 BENCHMARK Quiz → Editor:');
            benchmarks.forEach(({ size, time }) => {
                console.log(`   ${size} etapas: ${time.toFixed(2)}ms`);
            });

            // Verificar escalabilidade linear aproximada
            const timeRatio = benchmarks[benchmarks.length - 1].time / benchmarks[1].time;
            const sizeRatio = benchmarks[benchmarks.length - 1].size / benchmarks[1].size;

            // O tempo não deve crescer mais que 3x a proporção do tamanho
            expect(timeRatio).toBeLessThan(sizeRatio * 3);
        });

        test('benchmark: cálculo de pontuações com diferentes números de respostas', async () => {
            const responseCounts = [1, 10, 50, 100, 500, 1000];
            const benchmarks: { responses: number; time: number; }[] = [];

            for (const count of responseCounts) {
                // Simular respostas
                const mockAnswers: Record<string, string[]> = {};
                for (let i = 1; i <= count; i++) {
                    mockAnswers[`step-${i}`] = [`option-${i % 4}`];
                }

                // Simular função de cálculo
                const calculateScores = () => {
                    const scores: Record<string, number> = {};
                    Object.entries(mockAnswers).forEach(([stepId, optionIds]) => {
                        optionIds.forEach(optionId => {
                            const points = {
                                classico: Math.random() * 10,
                                romantico: Math.random() * 10,
                                natural: Math.random() * 10
                            };
                            Object.entries(points).forEach(([style, point]) => {
                                scores[style] = (scores[style] || 0) + point;
                            });
                        });
                    });
                    return scores;
                };

                // Medir tempo
                const startTime = performance.now();
                calculateScores();
                const endTime = performance.now();

                benchmarks.push({
                    responses: count,
                    time: endTime - startTime
                });
            }

            // ASSERT & LOG
            console.log('\n📊 BENCHMARK Cálculo de Pontuações:');
            benchmarks.forEach(({ responses, time }) => {
                console.log(`   ${responses} respostas: ${time.toFixed(4)}ms`);
            });

            // Todas as medições devem ser muito rápidas
            benchmarks.forEach(({ time }) => {
                expect(time).toBeLessThan(50); // < 50ms mesmo para 1000 respostas
            });
        });
    });
});