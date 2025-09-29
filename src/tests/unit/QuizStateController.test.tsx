/**
 * 🧪 SUITE DE TESTES: QUIZ STATE CONTROLLER
 * 
 * Testes de sincronização em tempo real e controle de estado
 * entre Quiz e Editor com validação completa de funcionalidades
 */

import React from 'react';
import { render, renderHook, act, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { QuizFlowController, useQuizFlow } from '../src/components/editor/quiz/QuizStateController';
import { useEditor } from '../src/hooks/useEditor';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '../src/templates/quiz21StepsComplete';

// Mock do hook do editor
jest.mock('../src/hooks/useEditor');
jest.mock('../src/templates/quiz21StepsComplete');

const mockUseEditor = useEditor as jest.MockedFunction<typeof useEditor>;

describe('🎯 QuizStateController - Testes Unitários', () => {

    const defaultProps = {
        mode: 'quiz' as const,
        initialStep: 1,
        onStepChange: jest.fn()
    };

    const mockEditorContext = {
        selectedBlock: null,
        setSelectedBlock: jest.fn(),
        updateBlock: jest.fn(),
        addBlock: jest.fn(),
        deleteBlock: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock template
        (QUIZ_STYLE_21_STEPS_TEMPLATE as any) = {
            'step-1': [{ type: 'intro', content: {} }],
            'step-2': [{
                type: 'options-grid',
                content: {
                    options: [
                        { id: '1', text: 'Opção 1', points: { classico: 10 } },
                        { id: '2', text: 'Opção 2', points: { romantico: 8 } }
                    ]
                }
            }]
        };

        // Setup mock editor
        mockUseEditor.mockReturnValue(mockEditorContext);
    });

    describe('📊 Estado Inicial', () => {

        test('deve inicializar com estado correto', () => {
            // ARRANGE & ACT
            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                return <div data-testid="current-step">{quizFlow.currentStepNumber}</div>;
            };

            const { getByTestId } = render(
                <QuizFlowController {...defaultProps}>
                    <TestComponent />
                </QuizFlowController>
            );

            // ASSERT
            expect(getByTestId('current-step')).toHaveTextContent('1');
        });

        test('deve usar step inicial fornecido', () => {
            // ARRANGE
            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                return <div data-testid="current-step">{quizFlow.currentStepNumber}</div>;
            };

            // ACT
            const { getByTestId } = render(
                <QuizFlowController {...defaultProps} initialStep={5}>
                    <TestComponent />
                </QuizFlowController>
            );

            // ASSERT
            expect(getByTestId('current-step')).toHaveTextContent('5');
        });

        test('deve calcular totalSteps corretamente', () => {
            // ARRANGE
            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                return <div data-testid="total-steps">{quizFlow.totalSteps}</div>;
            };

            // ACT
            const { getByTestId } = render(
                <QuizFlowController {...defaultProps}>
                    <TestComponent />
                </QuizFlowController>
            );

            // ASSERT
            expect(getByTestId('total-steps')).toHaveTextContent('21');
        });
    });

    describe('🔄 Navegação de Etapas', () => {

        test('deve navegar para próxima etapa', () => {
            // ARRANGE
            let quizFlowRef: any = null;

            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                quizFlowRef = quizFlow;
                return <div data-testid="current-step">{quizFlow.currentStepNumber}</div>;
            };

            const { getByTestId } = render(
                <QuizFlowController {...defaultProps}>
                    <TestComponent />
                </QuizFlowController>
            );

            // ACT
            act(() => {
                quizFlowRef.nextStep();
            });

            // ASSERT
            expect(getByTestId('current-step')).toHaveTextContent('2');
            expect(defaultProps.onStepChange).toHaveBeenCalledWith(2);
        });

        test('deve navegar para etapa anterior', () => {
            // ARRANGE
            let quizFlowRef: any = null;

            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                quizFlowRef = quizFlow;
                return <div data-testid="current-step">{quizFlow.currentStepNumber}</div>;
            };

            const { getByTestId } = render(
                <QuizFlowController {...defaultProps} initialStep={3}>
                    <TestComponent />
                </QuizFlowController>
            );

            // ACT
            act(() => {
                quizFlowRef.previousStep();
            });

            // ASSERT
            expect(getByTestId('current-step')).toHaveTextContent('2');
        });

        test('deve ir para etapa específica', () => {
            // ARRANGE
            let quizFlowRef: any = null;

            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                quizFlowRef = quizFlow;
                return <div data-testid="current-step">{quizFlow.currentStepNumber}</div>;
            };

            const { getByTestId } = render(
                <QuizFlowController {...defaultProps}>
                    <TestComponent />
                </QuizFlowController>
            );

            // ACT
            act(() => {
                quizFlowRef.goToStep(10);
            });

            // ASSERT
            expect(getByTestId('current-step')).toHaveTextContent('10');
            expect(defaultProps.onStepChange).toHaveBeenCalledWith(10);
        });
    });

    describe('📝 Gerenciamento de Respostas', () => {

        test('deve definir resposta para etapa', () => {
            // ARRANGE
            let quizFlowRef: any = null;

            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                quizFlowRef = quizFlow;
                return null;
            };

            render(
                <QuizFlowController {...defaultProps}>
                    <TestComponent />
                </QuizFlowController>
            );

            // ACT
            act(() => {
                quizFlowRef.setAnswer('step-2', ['option-1', 'option-2']);
            });

            // ASSERT
            expect(quizFlowRef.getAnswer('step-2')).toEqual(['option-1', 'option-2']);
        });

        test('deve obter resposta vazia para etapa sem resposta', () => {
            // ARRANGE
            let quizFlowRef: any = null;

            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                quizFlowRef = quizFlow;
                return null;
            };

            render(
                <QuizFlowController {...defaultProps}>
                    <TestComponent />
                </QuizFlowController>
            );

            // ACT & ASSERT
            expect(quizFlowRef.getAnswer('step-99')).toEqual([]);
        });

        test('deve calcular pontuações baseadas nas respostas', () => {
            // ARRANGE
            let quizFlowRef: any = null;

            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                quizFlowRef = quizFlow;
                return null;
            };

            render(
                <QuizFlowController {...defaultProps}>
                    <TestComponent />
                </QuizFlowController>
            );

            // ACT
            act(() => {
                quizFlowRef.setAnswer('step-2', ['1']); // Opção com 10 pontos clássico
            });

            const scores = quizFlowRef.calculateScores();

            // ASSERT
            expect(scores).toEqual(expect.objectContaining({
                classico: 10
            }));
        });
    });

    describe('✅ Validação de Etapas', () => {

        test('deve validar etapa com resposta obrigatória', () => {
            // ARRANGE
            let quizFlowRef: any = null;

            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                quizFlowRef = quizFlow;
                return null;
            };

            render(
                <QuizFlowController {...defaultProps}>
                    <TestComponent />
                </QuizFlowController>
            );

            // ACT - Sem resposta
            let isValid = quizFlowRef.isStepValid('step-2');
            expect(isValid).toBe(false);

            // ACT - Com resposta
            act(() => {
                quizFlowRef.setAnswer('step-2', ['1']);
            });

            isValid = quizFlowRef.isStepValid('step-2');
            expect(isValid).toBe(true);
        });

        test('deve permitir navegação apenas se etapa válida', () => {
            // ARRANGE
            let quizFlowRef: any = null;

            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                quizFlowRef = quizFlow;
                return <div data-testid="can-next">{quizFlow.canGoNext.toString()}</div>;
            };

            const { getByTestId } = render(
                <QuizFlowController {...defaultProps} initialStep={2}>
                    <TestComponent />
                </QuizFlowController>
            );

            // ACT & ASSERT - Sem resposta
            expect(getByTestId('can-next')).toHaveTextContent('false');

            // ACT - Com resposta
            act(() => {
                quizFlowRef.setAnswer('step-2', ['1']);
            });

            expect(getByTestId('can-next')).toHaveTextContent('true');
        });
    });

    describe('🔗 Integração com Editor', () => {

        test('deve habilitar sincronização no modo editor', () => {
            // ARRANGE
            let quizFlowRef: any = null;

            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                quizFlowRef = quizFlow;
                return <div data-testid="sync">{quizFlow.syncWithEditor.toString()}</div>;
            };

            // ACT
            const { getByTestId } = render(
                <QuizFlowController {...defaultProps} mode="editor">
                    <TestComponent />
                </QuizFlowController>
            );

            // ASSERT
            expect(getByTestId('sync')).toHaveTextContent('true');
        });

        test('deve desabilitar sincronização no modo quiz', () => {
            // ARRANGE
            let quizFlowRef: any = null;

            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                quizFlowRef = quizFlow;
                return <div data-testid="sync">{quizFlow.syncWithEditor.toString()}</div>;
            };

            // ACT
            const { getByTestId } = render(
                <QuizFlowController {...defaultProps} mode="quiz">
                    <TestComponent />
                </QuizFlowController>
            );

            // ASSERT
            expect(getByTestId('sync')).toHaveTextContent('false');
        });

        test('deve carregar etapa no editor quando sincronizado', async () => {
            // ARRANGE
            const mockLoadStepIntoEditor = jest.fn();

            let quizFlowRef: any = null;

            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                quizFlowRef = quizFlow;
                // Simular função loadStepIntoEditor
                quizFlowRef.loadStepIntoEditor = mockLoadStepIntoEditor;
                return null;
            };

            render(
                <QuizFlowController {...defaultProps} mode="editor">
                    <TestComponent />
                </QuizFlowController>
            );

            // ACT
            act(() => {
                quizFlowRef.setSyncWithEditor(true);
                quizFlowRef.goToStep(3);
            });

            // ASSERT
            await waitFor(() => {
                expect(mockLoadStepIntoEditor).toHaveBeenCalledWith(3);
            });
        });

        test('deve lidar com editor indisponível', () => {
            // ARRANGE
            mockUseEditor.mockImplementation(() => {
                throw new Error('Editor não disponível');
            });

            // ACT & ASSERT
            expect(() => {
                render(
                    <QuizFlowController {...defaultProps} mode="editor">
                        <div>Test</div>
                    </QuizFlowController>
                );
            }).not.toThrow();
        });
    });

    describe('🎮 Controle de Modo', () => {

        test('deve alternar entre modos', () => {
            // ARRANGE
            let quizFlowRef: any = null;

            const TestComponent = () => {
                const quizFlow = useQuizFlow();
                quizFlowRef = quizFlow;
                return <div data-testid="mode">{quizFlow.mode}</div>;
            };

            const { getByTestId } = render(
                <QuizFlowController {...defaultProps} mode="quiz">
                    <TestComponent />
                </QuizFlowController>
            );

            // ACT
            act(() => {
                quizFlowRef.setMode('editor');
            });

            // ASSERT
            expect(getByTestId('mode')).toHaveTextContent('editor');
        });
    });
});

describe('🔄 QuizStateController - Testes de Integração', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseEditor.mockReturnValue({
            selectedBlock: null,
            setSelectedBlock: jest.fn(),
            updateBlock: jest.fn(),
            addBlock: jest.fn(),
            deleteBlock: jest.fn()
        });
    });

    test('deve manter estado consistente durante navegação completa', () => {
        // ARRANGE
        let quizFlowRef: any = null;
        const stepChanges: number[] = [];

        const TestComponent = () => {
            const quizFlow = useQuizFlow();
            quizFlowRef = quizFlow;
            return null;
        };

        render(
            <QuizFlowController
                mode="quiz"
                initialStep={1}
                onStepChange={(step) => stepChanges.push(step)}
            >
                <TestComponent />
            </QuizFlowController>
        );

        // ACT - Navegação sequencial
        const steps = [2, 3, 4, 5];
        steps.forEach(step => {
            act(() => {
                quizFlowRef.setAnswer(`step-${step}`, [`option-${step}`]);
                quizFlowRef.goToStep(step);
            });
        });

        // ASSERT
        expect(stepChanges).toEqual([2, 3, 4, 5]);
        expect(quizFlowRef.currentStepNumber).toBe(5);

        // Verificar que respostas foram mantidas
        steps.forEach(step => {
            expect(quizFlowRef.getAnswer(`step-${step}`)).toEqual([`option-${step}`]);
        });
    });

    test('deve sincronizar corretamente entre quiz e editor', async () => {
        // ARRANGE
        const mockLoadStepIntoEditor = jest.fn();
        let quizFlowRef: any = null;

        const TestComponent = () => {
            const quizFlow = useQuizFlow();
            quizFlowRef = quizFlow;
            quizFlowRef.loadStepIntoEditor = mockLoadStepIntoEditor;
            return null;
        };

        render(
            <QuizFlowController mode="editor" initialStep={1}>
                <TestComponent />
            </QuizFlowController>
        );

        // ACT - Alternar sincronização e navegar
        act(() => {
            quizFlowRef.setSyncWithEditor(true);
        });

        await act(async () => {
            quizFlowRef.goToStep(5);
            quizFlowRef.goToStep(10);
            quizFlowRef.goToStep(15);
        });

        // ASSERT
        await waitFor(() => {
            expect(mockLoadStepIntoEditor).toHaveBeenCalledTimes(3);
            expect(mockLoadStepIntoEditor).toHaveBeenCalledWith(5);
            expect(mockLoadStepIntoEditor).toHaveBeenCalledWith(10);
            expect(mockLoadStepIntoEditor).toHaveBeenCalledWith(15);
        });
    });

    test('deve calcular pontuações corretas com múltiplas respostas', () => {
        // ARRANGE
        const mockTemplate = {
            'step-2': [{
                type: 'options-grid',
                content: {
                    options: [
                        { id: 'a', text: 'A', points: { classico: 10, romantico: 5 } },
                        { id: 'b', text: 'B', points: { classico: 5, romantico: 10 } }
                    ]
                }
            }],
            'step-3': [{
                type: 'options-grid',
                content: {
                    options: [
                        { id: 'c', text: 'C', points: { classico: 8, criativo: 12 } },
                        { id: 'd', text: 'D', points: { romantico: 7, criativo: 3 } }
                    ]
                }
            }]
        };

        (QUIZ_STYLE_21_STEPS_TEMPLATE as any) = mockTemplate;

        let quizFlowRef: any = null;

        const TestComponent = () => {
            const quizFlow = useQuizFlow();
            quizFlowRef = quizFlow;
            return null;
        };

        render(
            <QuizFlowController mode="quiz" initialStep={1}>
                <TestComponent />
            </QuizFlowController>
        );

        // ACT
        act(() => {
            quizFlowRef.setAnswer('step-2', ['a']); // classico: 10, romantico: 5
            quizFlowRef.setAnswer('step-3', ['c']); // classico: 8, criativo: 12
        });

        const scores = quizFlowRef.calculateScores();

        // ASSERT
        expect(scores).toEqual({
            classico: 18,  // 10 + 8
            romantico: 5,  // 5 + 0
            criativo: 12   // 0 + 12
        });
    });
});

describe('⚡ QuizStateController - Testes de Performance', () => {

    beforeEach(() => {
        mockUseEditor.mockReturnValue({
            selectedBlock: null,
            setSelectedBlock: jest.fn(),
            updateBlock: jest.fn(),
            addBlock: jest.fn(),
            deleteBlock: jest.fn()
        });
    });

    test('deve lidar com navegação rápida entre etapas', () => {
        // ARRANGE
        let quizFlowRef: any = null;
        const startTime = Date.now();

        const TestComponent = () => {
            const quizFlow = useQuizFlow();
            quizFlowRef = quizFlow;
            return null;
        };

        render(
            <QuizFlowController mode="quiz" initialStep={1}>
                <TestComponent />
            </QuizFlowController>
        );

        // ACT - Navegação rápida
        act(() => {
            for (let i = 1; i <= 21; i++) {
                quizFlowRef.goToStep(i);
                quizFlowRef.setAnswer(`step-${i}`, [`option-${i}`]);
            }
        });

        const endTime = Date.now();

        // ASSERT
        expect(endTime - startTime).toBeLessThan(100); // < 100ms
        expect(quizFlowRef.currentStepNumber).toBe(21);
    });

    test('deve calcular pontuações rapidamente com muitas respostas', () => {
        // ARRANGE
        let quizFlowRef: any = null;

        const TestComponent = () => {
            const quizFlow = useQuizFlow();
            quizFlowRef = quizFlow;
            return null;
        };

        render(
            <QuizFlowController mode="quiz" initialStep={1}>
                <TestComponent />
            </QuizFlowController>
        );

        // ACT - Adicionar muitas respostas
        act(() => {
            for (let i = 2; i <= 21; i++) {
                quizFlowRef.setAnswer(`step-${i}`, [`option-${i}-1`, `option-${i}-2`]);
            }
        });

        const startTime = Date.now();
        const scores = quizFlowRef.calculateScores();
        const endTime = Date.now();

        // ASSERT
        expect(endTime - startTime).toBeLessThan(50); // < 50ms
        expect(scores).toBeDefined();
    });
});

describe('🛠️ QuizStateController - Casos Edge', () => {

    beforeEach(() => {
        mockUseEditor.mockReturnValue({
            selectedBlock: null,
            setSelectedBlock: jest.fn(),
            updateBlock: jest.fn(),
            addBlock: jest.fn(),
            deleteBlock: jest.fn()
        });
    });

    test('deve lidar com template vazio', () => {
        // ARRANGE
        (QUIZ_STYLE_21_STEPS_TEMPLATE as any) = {};

        // ACT & ASSERT
        expect(() => {
            render(
                <QuizFlowController mode="quiz" initialStep={1}>
                    <div>Test</div>
                </QuizFlowController>
            );
        }).not.toThrow();
    });

    test('deve lidar com etapa sem opções', () => {
        // ARRANGE
        (QUIZ_STYLE_21_STEPS_TEMPLATE as any) = {
            'step-2': [{ type: 'options-grid', content: {} }]
        };

        let quizFlowRef: any = null;

        const TestComponent = () => {
            const quizFlow = useQuizFlow();
            quizFlowRef = quizFlow;
            return null;
        };

        render(
            <QuizFlowController mode="quiz" initialStep={1}>
                <TestComponent />
            </QuizFlowController>
        );

        // ACT & ASSERT
        expect(() => {
            act(() => {
                quizFlowRef.setAnswer('step-2', ['option-1']);
            });
        }).not.toThrow();

        const scores = quizFlowRef.calculateScores();
        expect(scores).toEqual({});
    });

    test('deve lidar com hook useQuizFlow fora do provider', () => {
        // ARRANGE & ACT & ASSERT
        expect(() => {
            renderHook(() => useQuizFlow());
        }).toThrow('useQuizFlow must be used within QuizFlowController');
    });

    test('deve lidar com mudanças rápidas de modo', () => {
        // ARRANGE
        let quizFlowRef: any = null;

        const TestComponent = () => {
            const quizFlow = useQuizFlow();
            quizFlowRef = quizFlow;
            return <div data-testid="mode">{quizFlow.mode}</div>;
        };

        const { getByTestId } = render(
            <QuizFlowController mode="quiz" initialStep={1}>
                <TestComponent />
            </QuizFlowController>
        );

        // ACT - Mudanças rápidas de modo
        act(() => {
            quizFlowRef.setMode('editor');
            quizFlowRef.setMode('quiz');
            quizFlowRef.setMode('editor');
            quizFlowRef.setMode('quiz');
        });

        // ASSERT
        expect(getByTestId('mode')).toHaveTextContent('quiz');
    });
});