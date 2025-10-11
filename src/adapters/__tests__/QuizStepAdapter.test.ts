import { describe, it, expect } from 'vitest';
import { QuizStepAdapter } from '@/adapters/QuizStepAdapter';

describe('QuizStepAdapter', () => {
    describe('fromJSON - Conversão de JSON para QuizStep', () => {
        it('deve converter JSON válido completo para QuizStep', () => {
            const validJson = {
                templateVersion: '1.0.0',
                metadata: {
                    id: 'quiz-step-01',
                    name: 'Step step-01',
                    description: 'Template para introdução do quiz',
                    category: 'quiz-intro',
                    tags: ['intro', 'welcome'],
                    createdAt: '2025-01-01T00:00:00.000Z',
                    updatedAt: '2025-01-01T00:00:00.000Z'
                },
                layout: {
                    containerWidth: '100%',
                    spacing: 'normal',
                    backgroundColor: '#ffffff',
                    responsive: true
                },
                validation: {},
                analytics: {
                    events: ['view', 'interaction'],
                    trackingId: 'step-01-intro',
                    utmParams: true,
                    customEvents: []
                },
                blocks: [
                    {
                        id: 'title-block',
                        type: 'title',
                        content: {
                            text: 'Bem-vindo ao Quiz',
                            level: 1
                        },
                        styling: {
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: '#333333',
                            textAlign: 'center',
                            marginBottom: '24px'
                        },
                        animation: {
                            type: 'fade-in',
                            duration: 500,
                            delay: 0
                        },
                        conditions: []
                    }
                ]
            };

            const result = QuizStepAdapter.fromJSON(validJson);

            expect(result).toBeDefined();
            expect(result.stepNumber).toBe(1);
            expect(result.blocks).toBeDefined();
            expect(result.blocks.length).toBeGreaterThan(0);
        });

        it('deve extrair stepNumber corretamente de diferentes formatos de ID', () => {
            const testCases = [
                { id: 'quiz-step-01', expected: 1 },
                { id: 'quiz-step-05', expected: 5 },
                { id: 'quiz-step-10', expected: 10 },
                { id: 'quiz-step-21', expected: 21 }
            ];

            testCases.forEach(({ id, expected }) => {
                const json = {
                    templateVersion: '1.0.0',
                    metadata: {
                        id,
                        name: `Step ${id}`,
                        description: 'Test',
                        category: 'test',
                        tags: [],
                        createdAt: '2025-01-01',
                        updatedAt: '2025-01-01'
                    },
                    layout: {
                        containerWidth: '100%',
                        spacing: 'normal',
                        backgroundColor: '#ffffff',
                        responsive: true
                    },
                    validation: {},
                    analytics: {
                        events: [],
                        trackingId: '',
                        utmParams: false,
                        customEvents: []
                    },
                    blocks: []
                };

                const result = QuizStepAdapter.fromJSON(json);
                expect(result.stepNumber).toBe(expected);
            });
        });

        it('deve converter bloco de título corretamente', () => {
            const json = {
                templateVersion: '1.0.0',
                metadata: {
                    id: 'test-step',
                    name: 'Test',
                    description: 'Test',
                    category: 'test',
                    tags: [],
                    createdAt: '2025-01-01',
                    updatedAt: '2025-01-01'
                },
                layout: {
                    containerWidth: '100%',
                    spacing: 'normal',
                    backgroundColor: '#ffffff',
                    responsive: true
                },
                validation: {},
                analytics: {
                    events: [],
                    trackingId: '',
                    utmParams: false,
                    customEvents: []
                },
                blocks: [
                    {
                        id: 'title',
                        type: 'title',
                        content: {
                            text: 'Título de Teste',
                            level: 1
                        },
                        styling: {
                            fontSize: '32px',
                            textAlign: 'center'
                        },
                        animation: {
                            type: 'fade-in',
                            duration: 500,
                            delay: 0
                        },
                        conditions: []
                    }
                ]
            };

            const result = QuizStepAdapter.fromJSON(json);

            expect(result.blocks).toHaveLength(1);
            expect(result.blocks[0].type).toBe('title');
            expect(result.blocks[0].content).toContain('Título de Teste');
        });

        it('deve converter bloco de texto corretamente', () => {
            const json = {
                templateVersion: '1.0.0',
                metadata: {
                    id: 'test-step',
                    name: 'Test',
                    description: 'Test',
                    category: 'test',
                    tags: [],
                    createdAt: '2025-01-01',
                    updatedAt: '2025-01-01'
                },
                layout: {
                    containerWidth: '100%',
                    spacing: 'normal',
                    backgroundColor: '#ffffff',
                    responsive: true
                },
                validation: {},
                analytics: {
                    events: [],
                    trackingId: '',
                    utmParams: false,
                    customEvents: []
                },
                blocks: [
                    {
                        id: 'text',
                        type: 'text',
                        content: {
                            text: 'Este é um parágrafo de teste com **negrito** e *itálico*.',
                            format: 'markdown'
                        },
                        styling: {
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#666666'
                        },
                        animation: {
                            type: 'slide-up',
                            duration: 600,
                            delay: 200
                        },
                        conditions: []
                    }
                ]
            };

            const result = QuizStepAdapter.fromJSON(json);

            expect(result.blocks).toHaveLength(1);
            expect(result.blocks[0].type).toBe('text');
            expect(result.blocks[0].content).toContain('parágrafo de teste');
        });

        it('deve converter bloco de botão corretamente', () => {
            const json = {
                templateVersion: '1.0.0',
                metadata: {
                    id: 'test-step',
                    name: 'Test',
                    description: 'Test',
                    category: 'test',
                    tags: [],
                    createdAt: '2025-01-01',
                    updatedAt: '2025-01-01'
                },
                layout: {
                    containerWidth: '100%',
                    spacing: 'normal',
                    backgroundColor: '#ffffff',
                    responsive: true
                },
                validation: {},
                analytics: {
                    events: [],
                    trackingId: '',
                    utmParams: false,
                    customEvents: []
                },
                blocks: [
                    {
                        id: 'button',
                        type: 'button',
                        content: {
                            label: 'Continuar',
                            action: 'next-step'
                        },
                        styling: {
                            backgroundColor: '#007bff',
                            color: '#ffffff',
                            padding: '12px 24px',
                            borderRadius: '8px'
                        },
                        animation: {
                            type: 'scale',
                            duration: 300,
                            delay: 400
                        },
                        conditions: []
                    }
                ]
            };

            const result = QuizStepAdapter.fromJSON(json);

            expect(result.blocks).toHaveLength(1);
            expect(result.blocks[0].type).toBe('button');
            expect(result.blocks[0].content).toContain('Continuar');
        });

        it('deve converter múltiplos blocos corretamente', () => {
            const json = {
                templateVersion: '1.0.0',
                metadata: {
                    id: 'test-step',
                    name: 'Test',
                    description: 'Test',
                    category: 'test',
                    tags: [],
                    createdAt: '2025-01-01',
                    updatedAt: '2025-01-01'
                },
                layout: {
                    containerWidth: '100%',
                    spacing: 'normal',
                    backgroundColor: '#ffffff',
                    responsive: true
                },
                validation: {},
                analytics: {
                    events: [],
                    trackingId: '',
                    utmParams: false,
                    customEvents: []
                },
                blocks: [
                    {
                        id: 'title',
                        type: 'title',
                        content: { text: 'Título', level: 1 },
                        styling: {},
                        animation: { type: 'fade-in', duration: 500, delay: 0 },
                        conditions: []
                    },
                    {
                        id: 'text',
                        type: 'text',
                        content: { text: 'Texto', format: 'plain' },
                        styling: {},
                        animation: { type: 'fade-in', duration: 500, delay: 100 },
                        conditions: []
                    },
                    {
                        id: 'button',
                        type: 'button',
                        content: { label: 'Próximo', action: 'next-step' },
                        styling: {},
                        animation: { type: 'fade-in', duration: 500, delay: 200 },
                        conditions: []
                    }
                ]
            };

            const result = QuizStepAdapter.fromJSON(json);

            expect(result.blocks).toHaveLength(3);
            expect(result.blocks[0].type).toBe('title');
            expect(result.blocks[1].type).toBe('text');
            expect(result.blocks[2].type).toBe('button');
        });

        it('deve lançar erro para JSON com estrutura inválida', () => {
            const invalidJson = {
                // Faltando campos obrigatórios
                templateVersion: '1.0.0'
            };

            expect(() => {
                QuizStepAdapter.fromJSON(invalidJson as any);
            }).toThrow();
        });

        it('deve lançar erro para JSON sem metadata', () => {
            const invalidJson = {
                templateVersion: '1.0.0',
                layout: {},
                blocks: []
            };

            expect(() => {
                QuizStepAdapter.fromJSON(invalidJson as any);
            }).toThrow();
        });

        it('deve lançar erro para JSON sem blocks', () => {
            const invalidJson = {
                templateVersion: '1.0.0',
                metadata: {
                    id: 'test',
                    name: 'Test',
                    description: 'Test',
                    category: 'test',
                    tags: [],
                    createdAt: '2025-01-01',
                    updatedAt: '2025-01-01'
                }
            };

            expect(() => {
                QuizStepAdapter.fromJSON(invalidJson as any);
            }).toThrow();
        });

        it('deve lidar com blocos vazios', () => {
            const json = {
                templateVersion: '1.0.0',
                metadata: {
                    id: 'test-step',
                    name: 'Test',
                    description: 'Test',
                    category: 'test',
                    tags: [],
                    createdAt: '2025-01-01',
                    updatedAt: '2025-01-01'
                },
                layout: {
                    containerWidth: '100%',
                    spacing: 'normal',
                    backgroundColor: '#ffffff',
                    responsive: true
                },
                validation: {},
                analytics: {
                    events: [],
                    trackingId: '',
                    utmParams: false,
                    customEvents: []
                },
                blocks: []
            };

            const result = QuizStepAdapter.fromJSON(json);

            expect(result.blocks).toBeDefined();
            expect(result.blocks).toHaveLength(0);
        });

        it('deve preservar styling dos blocos', () => {
            const json = {
                templateVersion: '1.0.0',
                metadata: {
                    id: 'test-step',
                    name: 'Test',
                    description: 'Test',
                    category: 'test',
                    tags: [],
                    createdAt: '2025-01-01',
                    updatedAt: '2025-01-01'
                },
                layout: {
                    containerWidth: '100%',
                    spacing: 'normal',
                    backgroundColor: '#ffffff',
                    responsive: true
                },
                validation: {},
                analytics: {
                    events: [],
                    trackingId: '',
                    utmParams: false,
                    customEvents: []
                },
                blocks: [
                    {
                        id: 'styled-title',
                        type: 'title',
                        content: {
                            text: 'Título Estilizado',
                            level: 1
                        },
                        styling: {
                            fontSize: '48px',
                            fontWeight: '900',
                            color: '#ff0000',
                            textAlign: 'right',
                            marginTop: '20px',
                            marginBottom: '40px',
                            fontFamily: 'Arial, sans-serif'
                        },
                        animation: {
                            type: 'fade-in',
                            duration: 500,
                            delay: 0
                        },
                        conditions: []
                    }
                ]
            };

            const result = QuizStepAdapter.fromJSON(json);

            const block = result.blocks[0];
            expect(block.styling).toBeDefined();
            expect(block.styling?.fontSize).toBe('48px');
            expect(block.styling?.color).toBe('#ff0000');
            expect(block.styling?.textAlign).toBe('right');
        });

        it('deve preservar animações dos blocos', () => {
            const json = {
                templateVersion: '1.0.0',
                metadata: {
                    id: 'test-step',
                    name: 'Test',
                    description: 'Test',
                    category: 'test',
                    tags: [],
                    createdAt: '2025-01-01',
                    updatedAt: '2025-01-01'
                },
                layout: {
                    containerWidth: '100%',
                    spacing: 'normal',
                    backgroundColor: '#ffffff',
                    responsive: true
                },
                validation: {},
                analytics: {
                    events: [],
                    trackingId: '',
                    utmParams: false,
                    customEvents: []
                },
                blocks: [
                    {
                        id: 'animated-text',
                        type: 'text',
                        content: {
                            text: 'Texto com animação',
                            format: 'plain'
                        },
                        styling: {},
                        animation: {
                            type: 'bounce',
                            duration: 1000,
                            delay: 500,
                            easing: 'ease-in-out'
                        },
                        conditions: []
                    }
                ]
            };

            const result = QuizStepAdapter.fromJSON(json);

            const block = result.blocks[0];
            expect(block.animation).toBeDefined();
            expect(block.animation?.type).toBe('bounce');
            expect(block.animation?.duration).toBe(1000);
            expect(block.animation?.delay).toBe(500);
        });
    });

    describe('toJSON - Conversão de QuizStep para JSON', () => {
        it('deve converter QuizStep para JSON válido', () => {
            const quizStep = {
                stepNumber: 1,
                blocks: [
                    {
                        id: 'title',
                        type: 'title' as const,
                        content: 'Título do Quiz',
                        styling: {
                            fontSize: '32px',
                            textAlign: 'center' as const
                        },
                        animation: {
                            type: 'fade-in',
                            duration: 500,
                            delay: 0
                        }
                    }
                ]
            };

            const result = QuizStepAdapter.toJSON(quizStep);

            expect(result).toBeDefined();
            expect(result.templateVersion).toBe('1.0.0');
            expect(result.metadata).toBeDefined();
            expect(result.metadata.id).toContain('quiz-step-01');
            expect(result.blocks).toHaveLength(1);
        });

        it('deve gerar ID correto baseado no stepNumber', () => {
            const testCases = [
                { stepNumber: 1, expectedId: 'quiz-step-01' },
                { stepNumber: 5, expectedId: 'quiz-step-05' },
                { stepNumber: 15, expectedId: 'quiz-step-15' },
                { stepNumber: 21, expectedId: 'quiz-step-21' }
            ];

            testCases.forEach(({ stepNumber, expectedId }) => {
                const quizStep = {
                    stepNumber,
                    blocks: []
                };

                const result = QuizStepAdapter.toJSON(quizStep);
                expect(result.metadata.id).toBe(expectedId);
            });
        });

        it('deve preservar múltiplos blocos na conversão', () => {
            const quizStep = {
                stepNumber: 2,
                blocks: [
                    {
                        id: 'title',
                        type: 'title' as const,
                        content: 'Título',
                        styling: {},
                        animation: { type: 'fade-in', duration: 500, delay: 0 }
                    },
                    {
                        id: 'text',
                        type: 'text' as const,
                        content: 'Texto descritivo',
                        styling: {},
                        animation: { type: 'fade-in', duration: 500, delay: 100 }
                    },
                    {
                        id: 'button',
                        type: 'button' as const,
                        content: 'Avançar',
                        styling: {},
                        animation: { type: 'fade-in', duration: 500, delay: 200 }
                    }
                ]
            };

            const result = QuizStepAdapter.toJSON(quizStep);

            expect(result.blocks).toHaveLength(3);
            expect(result.blocks[0].type).toBe('title');
            expect(result.blocks[1].type).toBe('text');
            expect(result.blocks[2].type).toBe('button');
        });
    });

    describe('Validação de Estrutura', () => {
        it('deve validar templateVersion', () => {
            const json = {
                templateVersion: '2.0.0', // Versão diferente
                metadata: {
                    id: 'test-step',
                    name: 'Test',
                    description: 'Test',
                    category: 'test',
                    tags: [],
                    createdAt: '2025-01-01',
                    updatedAt: '2025-01-01'
                },
                layout: {
                    containerWidth: '100%',
                    spacing: 'normal',
                    backgroundColor: '#ffffff',
                    responsive: true
                },
                validation: {},
                analytics: {
                    events: [],
                    trackingId: '',
                    utmParams: false,
                    customEvents: []
                },
                blocks: []
            };

            // Deve aceitar ou converter versões diferentes
            const result = QuizStepAdapter.fromJSON(json);
            expect(result).toBeDefined();
        });

        it('deve validar campos obrigatórios do metadata', () => {
            const requiredFields = ['id', 'name', 'description', 'category'];

            requiredFields.forEach(field => {
                const json: any = {
                    templateVersion: '1.0.0',
                    metadata: {
                        id: 'test',
                        name: 'Test',
                        description: 'Test',
                        category: 'test',
                        tags: [],
                        createdAt: '2025-01-01',
                        updatedAt: '2025-01-01'
                    },
                    layout: {
                        containerWidth: '100%',
                        spacing: 'normal',
                        backgroundColor: '#ffffff',
                        responsive: true
                    },
                    validation: {},
                    analytics: {
                        events: [],
                        trackingId: '',
                        utmParams: false,
                        customEvents: []
                    },
                    blocks: []
                };

                // Remover campo obrigatório
                delete json.metadata[field];

                expect(() => {
                    QuizStepAdapter.fromJSON(json);
                }).toThrow();
            });
        });

        it('deve validar estrutura dos blocos', () => {
            const json = {
                templateVersion: '1.0.0',
                metadata: {
                    id: 'test-step',
                    name: 'Test',
                    description: 'Test',
                    category: 'test',
                    tags: [],
                    createdAt: '2025-01-01',
                    updatedAt: '2025-01-01'
                },
                layout: {
                    containerWidth: '100%',
                    spacing: 'normal',
                    backgroundColor: '#ffffff',
                    responsive: true
                },
                validation: {},
                analytics: {
                    events: [],
                    trackingId: '',
                    utmParams: false,
                    customEvents: []
                },
                blocks: [
                    {
                        // Bloco sem campos obrigatórios
                        id: 'invalid-block'
                        // Faltando type, content, etc.
                    }
                ]
            };

            expect(() => {
                QuizStepAdapter.fromJSON(json as any);
            }).toThrow();
        });
    });

    describe('Conversão Bidirecional', () => {
        it('deve manter dados após conversão ida e volta', () => {
            const originalJson = {
                templateVersion: '1.0.0',
                metadata: {
                    id: 'quiz-step-03',
                    name: 'Step 3',
                    description: 'Terceira etapa',
                    category: 'quiz-question',
                    tags: ['question', 'multiple-choice'],
                    createdAt: '2025-01-01T00:00:00.000Z',
                    updatedAt: '2025-01-01T00:00:00.000Z'
                },
                layout: {
                    containerWidth: '100%',
                    spacing: 'normal',
                    backgroundColor: '#f5f5f5',
                    responsive: true
                },
                validation: {},
                analytics: {
                    events: ['view', 'answer'],
                    trackingId: 'step-03',
                    utmParams: true,
                    customEvents: []
                },
                blocks: [
                    {
                        id: 'question-title',
                        type: 'title',
                        content: {
                            text: 'Pergunta 3',
                            level: 2
                        },
                        styling: {
                            fontSize: '28px',
                            color: '#333'
                        },
                        animation: {
                            type: 'fade-in',
                            duration: 500,
                            delay: 0
                        },
                        conditions: []
                    }
                ]
            };

            // JSON -> QuizStep
            const quizStep = QuizStepAdapter.fromJSON(originalJson);

            // QuizStep -> JSON
            const convertedJson = QuizStepAdapter.toJSON(quizStep);

            // Verificar que os dados essenciais foram mantidos
            expect(convertedJson.metadata.id).toContain('quiz-step-03');
            expect(convertedJson.blocks).toHaveLength(1);
            expect(convertedJson.blocks[0].type).toBe('title');
        });
    });
});
