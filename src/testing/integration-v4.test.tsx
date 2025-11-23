/**
 * 🎯 TESTES E2E - INTEGRAÇÃO V4
 * 
 * Testa integração completa:
 * - Carregamento de quiz21-v4.json
 * - Validação Zod
 * - Logic Engine
 * - Navegação entre steps
 * - Renderização de blocks
 * 
 * FASE 4: Integração E2E
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, renderHook, act } from '@testing-library/react';
import { QuizV4Provider, useQuizV4 } from '@/contexts/quiz/QuizV4Provider';
import { QuizFlowV4 } from '@/components/quiz/QuizFlowV4';
import { useQuizV4Loader } from '@/hooks/useQuizV4Loader';
import { validateQuizSchema } from '@/schemas/quiz-schema.zod';

describe('FASE 4: Integração E2E v4', () => {

    describe('1. Carregamento de quiz21-v4.json', () => {
        it('deve carregar o arquivo sem erros', async () => {
            const response = await fetch('/templates/quiz21-v4.json');
            expect(response.ok).toBe(true);

            const data = await response.json();
            expect(data).toBeDefined();
            expect(data.version).toBe('4.0.0');
        });

        it('deve ter estrutura v4 completa', async () => {
            const response = await fetch('/templates/quiz21-v4.json');
            const data = await response.json();

            expect(data).toHaveProperty('version');
            expect(data).toHaveProperty('schemaVersion');
            expect(data).toHaveProperty('metadata');
            expect(data).toHaveProperty('theme');
            expect(data).toHaveProperty('settings');
            expect(data).toHaveProperty('steps');
            expect(data).toHaveProperty('blockLibrary');
        });

        it('deve ter 21 steps', async () => {
            const response = await fetch('/templates/quiz21-v4.json');
            const data = await response.json();

            expect(data.steps).toHaveLength(21);
        });

        it('deve ter blocks em cada step', async () => {
            const response = await fetch('/templates/quiz21-v4.json');
            const data = await response.json();

            data.steps.forEach((step: any) => {
                expect(step.blocks).toBeDefined();
                expect(Array.isArray(step.blocks)).toBe(true);
                expect(step.blocks.length).toBeGreaterThan(0);
            });
        });
    });

    describe('2. Validação Zod', () => {
        it('deve validar quiz21-v4.json com Zod', async () => {
            const response = await fetch('/templates/quiz21-v4.json');
            const data = await response.json();

            const result = validateQuizSchema(data);

            if (!result.success) {
                console.error('Erros de validação:', result.errors.errors);
            }

            expect(result.success).toBe(true);
        });

        it('deve validar metadados', async () => {
            const response = await fetch('/templates/quiz21-v4.json');
            const data = await response.json();

            const result = validateQuizSchema(data);
            expect(result.success).toBe(true);

            if (result.success) {
                const quiz = result.data;
                expect(quiz.metadata.id).toBeDefined();
                expect(quiz.metadata.name).toBeDefined();
                expect(quiz.metadata.version).toMatch(/^\d+\.\d+\.\d+$/);
            }
        });

        it('deve validar steps com IDs corretos', async () => {
            const response = await fetch('/templates/quiz21-v4.json');
            const data = await response.json();

            const result = validateQuizSchema(data);
            expect(result.success).toBe(true);

            if (result.success) {
                const quiz = result.data;
                quiz.steps.forEach((step, index) => {
                    const expectedId = `step-${String(index + 1).padStart(2, '0')}`;
                    expect(step.id).toBe(expectedId);
                    expect(step.order).toBe(index + 1);
                });
            }
        });

        it('deve validar blocks com tipos válidos', async () => {
            const response = await fetch('/templates/quiz21-v4.json');
            const data = await response.json();

            const result = validateQuizSchema(data);
            expect(result.success).toBe(true);

            if (result.success) {
                const quiz = result.data;
                const validBlockTypes = [
                    'question-progress',
                    'question-navigation',
                    'question-title',
                    'text-inline',
                    'quiz-intro-header',
                    'form-input',
                    'options-grid',
                    'result-display',
                    'offer-card',
                    'intro-logo',
                    'intro-title',
                    'intro-subtitle',
                    'intro-description',
                    'intro-form',
                    'intro-button'
                ];

                quiz.steps.forEach(step => {
                    step.blocks.forEach(block => {
                        expect(validBlockTypes).toContain(block.type);
                    });
                });
            }
        });
    });

    describe('3. Hook useQuizV4Loader', () => {
        it('deve carregar quiz com autoLoad=true', async () => {
            const { result } = renderHook(() => useQuizV4Loader({ autoLoad: true }));

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.quiz).toBeDefined();
            expect(result.current.steps).toHaveLength(21);
            expect(result.current.isValid).toBe(true);
            expect(result.current.error).toBeNull();
        });

        it('deve buscar step por ID', async () => {
            const { result } = renderHook(() => useQuizV4Loader());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const step01 = result.current.getStep('step-01');
            expect(step01).toBeDefined();
            expect(step01?.id).toBe('step-01');
            expect(step01?.order).toBe(1);
        });

        it('deve buscar step por ordem', async () => {
            const { result } = renderHook(() => useQuizV4Loader());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const firstStep = result.current.getStepByOrder(1);
            expect(firstStep).toBeDefined();
            expect(firstStep?.id).toBe('step-01');
        });

        it('deve validar schema após carregamento', async () => {
            const { result } = renderHook(() => useQuizV4Loader());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const isValid = result.current.validateSchema();
            expect(isValid).toBe(true);
        });
    });

    describe('4. QuizV4Provider', () => {
        it('deve inicializar com step-01', async () => {
            const { result } = renderHook(() => useQuizV4(), {
                wrapper: ({ children }) => <QuizV4Provider>{children}</QuizV4Provider>
            });

            await waitFor(() => {
                expect(result.current.state.isLoading).toBe(false);
            });

            expect(result.current.state.currentStep?.id).toBe('step-01');
            expect(result.current.state.progress.currentStepOrder).toBe(1);
        });

        it('deve navegar para próximo step', async () => {
            const { result } = renderHook(() => useQuizV4(), {
                wrapper: ({ children }) => <QuizV4Provider>{children}</QuizV4Provider>
            });

            await waitFor(() => {
                expect(result.current.state.isLoading).toBe(false);
            });

            act(() => {
                result.current.goToNextStep();
            });

            await waitFor(() => {
                expect(result.current.state.currentStep?.id).toBe('step-02');
            });
        });

        it('deve registrar respostas', async () => {
            const { result } = renderHook(() => useQuizV4(), {
                wrapper: ({ children }) => <QuizV4Provider>{children}</QuizV4Provider>
            });

            await waitFor(() => {
                expect(result.current.state.isLoading).toBe(false);
            });

            act(() => {
                result.current.setAnswer('question-1', 'Resposta teste');
            });

            const answer = result.current.getAnswer('question-1');
            expect(answer).toBeDefined();
            expect(answer?.value).toBe('Resposta teste');
            expect(answer?.stepId).toBe('step-01');
        });

        it('deve calcular progresso corretamente', async () => {
            const { result } = renderHook(() => useQuizV4(), {
                wrapper: ({ children }) => <QuizV4Provider>{children}</QuizV4Provider>
            });

            await waitFor(() => {
                expect(result.current.state.isLoading).toBe(false);
            });

            expect(result.current.state.progress.totalSteps).toBe(21);
            expect(result.current.state.progress.completionPercentage).toBeGreaterThanOrEqual(0);
            expect(result.current.state.progress.completionPercentage).toBeLessThanOrEqual(100);
        });

        it('deve controlar início e conclusão do quiz', async () => {
            const onComplete = vi.fn();
            const { result } = renderHook(() => useQuizV4(), {
                wrapper: ({ children }) => (
                    <QuizV4Provider onQuizComplete={onComplete}>
                        {children}
                    </QuizV4Provider>
                )
            });

            await waitFor(() => {
                expect(result.current.state.isLoading).toBe(false);
            });

            act(() => {
                result.current.startQuiz();
            });

            expect(result.current.state.isStarted).toBe(true);
            expect(result.current.state.startedAt).toBeDefined();

            act(() => {
                result.current.completeQuiz();
            });

            expect(result.current.state.isCompleted).toBe(true);
            expect(result.current.state.completedAt).toBeDefined();
            expect(onComplete).toHaveBeenCalled();
        });
    });

    describe('5. Logic Engine Integration', () => {
        it('deve avaliar navegação condicional', async () => {
            const { result } = renderHook(() => useQuizV4(), {
                wrapper: ({ children }) => <QuizV4Provider>{children}</QuizV4Provider>
            });

            await waitFor(() => {
                expect(result.current.state.isLoading).toBe(false);
            });

            // Set answer that triggers condition
            act(() => {
                result.current.setAnswer('test-field', 'test-value');
            });

            const conditions = [
                {
                    id: 'cond-1',
                    if: {
                        operator: 'equals' as const,
                        field: 'test-field',
                        value: 'test-value'
                    },
                    then: {
                        action: 'goto' as const,
                        target: 'step-05'
                    }
                }
            ];

            const nextStepId = result.current.evaluateNavigation(conditions);
            expect(nextStepId).toBe('step-05');
        });

        it('deve usar Logic Engine em navegação', async () => {
            const { result } = renderHook(() => useQuizV4(), {
                wrapper: ({ children }) => <QuizV4Provider>{children}</QuizV4Provider>
            });

            await waitFor(() => {
                expect(result.current.state.isLoading).toBe(false);
            });

            expect(result.current.logicEngine).toBeDefined();
        });
    });

    describe('6. Renderização de Components', () => {
        it('deve renderizar QuizFlowV4', async () => {
            render(
                <QuizV4Provider>
                    <QuizFlowV4 />
                </QuizV4Provider>
            );

            await waitFor(() => {
                expect(screen.queryByText('Carregando quiz...')).not.toBeInTheDocument();
            });
        });

        it('deve mostrar barra de progresso', async () => {
            render(
                <QuizV4Provider>
                    <QuizFlowV4 />
                </QuizV4Provider>
            );

            await waitFor(() => {
                expect(screen.getByText(/Etapa \d+ de \d+/)).toBeInTheDocument();
            });
        });

        it('deve renderizar blocks do step atual', async () => {
            render(
                <QuizV4Provider>
                    <QuizFlowV4 />
                </QuizV4Provider>
            );

            await waitFor(() => {
                const blocks = document.querySelectorAll('[data-block-id]');
                expect(blocks.length).toBeGreaterThan(0);
            });
        });
    });
});
