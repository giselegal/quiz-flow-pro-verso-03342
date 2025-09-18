import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { EditorQuizProvider, useEditorQuiz } from '../EditorQuizContext';

// Mock das dependências
vi.mock('@/lib/quizEngine', () => ({
    calculateQuizResult: vi.fn().mockReturnValue({
        dominant: 'modern',
        score: { modern: 8, classic: 4, bohemian: 6 },
        profile: 'Estilo Moderno'
    })
}));

vi.mock('@/types/quiz', () => ({
    // Mock dos tipos se necessário
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <EditorQuizProvider>{children}</EditorQuizProvider>
);

describe('EditorQuizProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Estado Inicial', () => {
        it('deve inicializar com valores padrão', () => {
            const { result } = renderHook(() => useEditorQuiz(), { wrapper });

            expect(result.current.currentQuestionIndex).toBe(0);
            expect(result.current.answers).toEqual([]);
            expect(result.current.quizCompleted).toBe(false);
            expect(result.current.quizResult).toBeNull();
            expect(result.current.totalQuestions).toBe(0);
        });
    });

    describe('Inicialização do Quiz', () => {
        const mockQuestions = [
            { id: 'q1', text: 'Pergunta 1', options: [] },
            { id: 'q2', text: 'Pergunta 2', options: [] },
            { id: 'q3', text: 'Pergunta 3', options: [] }
        ];

        it('deve inicializar quiz com perguntas', () => {
            const { result } = renderHook(() => useEditorQuiz(), { wrapper });

            act(() => {
                result.current.initializeQuiz(mockQuestions);
            });

            expect(result.current.totalQuestions).toBe(3);
            expect(result.current.currentQuestionIndex).toBe(0);
            expect(result.current.answers).toEqual([]);
            expect(result.current.quizCompleted).toBe(false);
            expect(result.current.quizResult).toBeNull();
        });

        it('deve resetar estado ao reinicializar', () => {
            const { result } = renderHook(() => useEditorQuiz(), { wrapper });

            // Configurar estado inicial
            act(() => {
                result.current.initializeQuiz(mockQuestions);
                result.current.answerQuestion('q1', 'option1');
                result.current.nextQuestion();
            });

            expect(result.current.currentQuestionIndex).toBe(1);
            expect(result.current.answers).toHaveLength(1);

            // Reinicializar
            act(() => {
                result.current.initializeQuiz([{ id: 'new1', text: 'Nova pergunta', options: [] }]);
            });

            expect(result.current.totalQuestions).toBe(1);
            expect(result.current.currentQuestionIndex).toBe(0);
            expect(result.current.answers).toEqual([]);
        });
    });

    describe('Respostas', () => {
        const mockQuestions = [
            { id: 'q1', text: 'Pergunta 1', options: [] },
            { id: 'q2', text: 'Pergunta 2', options: [] }
        ];

        beforeEach(() => {
            // Setup comum para testes de resposta
        });

        it('deve adicionar nova resposta', () => {
            const { result } = renderHook(() => useEditorQuiz(), { wrapper });

            act(() => {
                result.current.initializeQuiz(mockQuestions);
                result.current.answerQuestion('q1', 'option1');
            });

            expect(result.current.answers).toEqual([
                { questionId: 'q1', optionId: 'option1' }
            ]);
        });

        it('deve atualizar resposta existente', () => {
            const { result } = renderHook(() => useEditorQuiz(), { wrapper });

            act(() => {
                result.current.initializeQuiz(mockQuestions);
                result.current.answerQuestion('q1', 'option1');
                result.current.answerQuestion('q1', 'option2'); // Alterar resposta
            });

            expect(result.current.answers).toEqual([
                { questionId: 'q1', optionId: 'option2' }
            ]);
            expect(result.current.answers).toHaveLength(1);
        });

        it('deve permitir múltiplas respostas para diferentes questões', () => {
            const { result } = renderHook(() => useEditorQuiz(), { wrapper });

            act(() => {
                result.current.initializeQuiz(mockQuestions);
                result.current.answerQuestion('q1', 'option1');
                result.current.answerQuestion('q2', 'option2');
            });

            expect(result.current.answers).toEqual([
                { questionId: 'q1', optionId: 'option1' },
                { questionId: 'q2', optionId: 'option2' }
            ]);
        });
    });

    describe('Navegação', () => {
        const mockQuestions = [
            { id: 'q1', text: 'Pergunta 1', options: [] },
            { id: 'q2', text: 'Pergunta 2', options: [] },
            { id: 'q3', text: 'Pergunta 3', options: [] }
        ];

        it('deve navegar para próxima questão', () => {
            const { result } = renderHook(() => useEditorQuiz(), { wrapper });

            act(() => {
                result.current.initializeQuiz(mockQuestions);
                result.current.nextQuestion();
            });

            expect(result.current.currentQuestionIndex).toBe(1);
        });

        it('deve navegar para questão anterior', () => {
            const { result } = renderHook(() => useEditorQuiz(), { wrapper });

            act(() => {
                result.current.initializeQuiz(mockQuestions);
                result.current.nextQuestion();
                result.current.nextQuestion(); // Ir para índice 2
                result.current.previousQuestion(); // Voltar para índice 1
            });

            expect(result.current.currentQuestionIndex).toBe(1);
        });

        it('não deve navegar além dos limites', () => {
            const { result } = renderHook(() => useEditorQuiz(), { wrapper });

            act(() => {
                result.current.initializeQuiz(mockQuestions);

                // Tentar ir antes do início
                result.current.previousQuestion();
            });

            expect(result.current.currentQuestionIndex).toBe(0);

            act(() => {
                // Ir para última questão
                result.current.nextQuestion();
                result.current.nextQuestion();

                // Tentar ir além do fim (deve ficar no índice 2)
                result.current.nextQuestion();
            });

            expect(result.current.currentQuestionIndex).toBe(2); // Índice da última questão
        });
    });

    describe('Reset do Quiz', () => {
        const mockQuestions = [
            { id: 'q1', text: 'Pergunta 1', options: [] },
            { id: 'q2', text: 'Pergunta 2', options: [] }
        ];

        it('deve resetar para estado inicial', () => {
            const { result } = renderHook(() => useEditorQuiz(), { wrapper });

            // Configurar estado
            act(() => {
                result.current.initializeQuiz(mockQuestions);
                result.current.answerQuestion('q1', 'option1');
                result.current.nextQuestion();
                result.current.completeQuiz();
            });

            expect(result.current.currentQuestionIndex).toBe(1);
            expect(result.current.answers).toHaveLength(1);
            expect(result.current.quizCompleted).toBe(true);

            // Reset
            act(() => {
                result.current.resetQuiz();
            });

            expect(result.current.currentQuestionIndex).toBe(0);
            expect(result.current.answers).toEqual([]);
            expect(result.current.quizCompleted).toBe(false);
            expect(result.current.quizResult).toBeNull();
        });
    });

    describe('Completar Quiz', () => {
        const mockQuestions = [
            { id: 'q1', text: 'Pergunta 1', options: [] },
            { id: 'q2', text: 'Pergunta 2', options: [] }
        ];

        it('deve completar quiz com respostas', async () => {
            const mockCalculateQuizResult = vi.mocked(
                (await import('@/lib/quizEngine')).calculateQuizResult
            );

            const { result } = renderHook(() => useEditorQuiz(), { wrapper });

            act(() => {
                result.current.initializeQuiz(mockQuestions);
                result.current.answerQuestion('q1', 'option1');
                result.current.answerQuestion('q2', 'option2');
                result.current.completeQuiz();
            });

            expect(result.current.quizCompleted).toBe(true);
            expect(mockCalculateQuizResult).toHaveBeenCalledWith(
                [
                    { questionId: 'q1', optionId: 'option1' },
                    { questionId: 'q2', optionId: 'option2' }
                ],
                mockQuestions
            );
            expect(result.current.quizResult).toEqual({
                dominant: 'modern',
                score: { modern: 8, classic: 4, bohemian: 6 },
                profile: 'Estilo Moderno'
            });
        });

        it('não deve completar quiz sem respostas', () => {
            const { result } = renderHook(() => useEditorQuiz(), { wrapper });

            act(() => {
                result.current.initializeQuiz(mockQuestions);
                result.current.completeQuiz();
            });

            expect(result.current.quizCompleted).toBe(false);
            expect(result.current.quizResult).toBeNull();
        });
    });

    describe('Error Handling', () => {
        it('deve lidar com erro no cálculo do resultado', async () => {
            const mockCalculateQuizResult = vi.mocked(
                (await import('@/lib/quizEngine')).calculateQuizResult
            );

            mockCalculateQuizResult.mockImplementation(() => {
                throw new Error('Calculation failed');
            });

            const { result } = renderHook(() => useEditorQuiz(), { wrapper });

            act(() => {
                result.current.initializeQuiz([{ id: 'q1', text: 'Question', options: [] }]);
                result.current.answerQuestion('q1', 'option1');
            });

            // Provider deve capturar erro graciosamente, mas o contexto não implementa tratamento de erro
            // então vamos verificar se o error bubbles up
            expect(() => {
                act(() => {
                    result.current.completeQuiz();
                });
            }).toThrow('Calculation failed');
        });

        it('deve funcionar quando usado fora do provider', () => {
            expect(() => {
                renderHook(() => useEditorQuiz());
            }).toThrow('useEditorQuiz must be used within an EditorQuizProvider');
        });
    });

    describe('Performance', () => {
        it('deve manter referências estáveis das funções', () => {
            const { result, rerender } = renderHook(() => useEditorQuiz(), { wrapper });

            const initialFunctions = {
                initializeQuiz: result.current.initializeQuiz,
                answerQuestion: result.current.answerQuestion,
                nextQuestion: result.current.nextQuestion,
                previousQuestion: result.current.previousQuestion,
                resetQuiz: result.current.resetQuiz,
                completeQuiz: result.current.completeQuiz,
            };

            rerender();

            expect(result.current.initializeQuiz).toBe(initialFunctions.initializeQuiz);
            expect(result.current.answerQuestion).toBe(initialFunctions.answerQuestion);
            expect(result.current.nextQuestion).toBe(initialFunctions.nextQuestion);
            expect(result.current.previousQuestion).toBe(initialFunctions.previousQuestion);
            expect(result.current.resetQuiz).toBe(initialFunctions.resetQuiz);
            expect(result.current.completeQuiz).toBe(initialFunctions.completeQuiz);
        });
    });
});
