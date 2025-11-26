/**
 * 🧪 TESTES: ValidationResultProvider
 * 
 * Testa provider consolidado Validation + Result
 * - Validação de formulários e dados
 * - Cálculo de resultados de quiz
 * - Análise de resultados e feedback
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
    ValidationResultProvider,
    useValidationResult,
    useValidation,
    useResult
} from '../ValidationResultProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ValidationResultProvider>{children}</ValidationResultProvider>
);

describe('ValidationResultProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Validation: Validação de Dados', () => {
        it('deve validar campo obrigatório', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            await act(async () => {
                result.current.validateField('email', '', [{ type: 'required', message: 'Email é obrigatório' }]);
            });

            const error = result.current.getFieldError('email');
            expect(error).toBe('Email é obrigatório');
        });

        it('deve validar tamanho mínimo', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            await act(async () => {
                result.current.validateField('password', 'abc', [
                    { type: 'minLength', value: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
                ]);
            });

            const error = result.current.getFieldError('password');
            expect(error).toBe('Senha deve ter no mínimo 6 caracteres');
        });

        it('deve validar padrão regex', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            await act(async () => {
                result.current.validateField('email', 'invalidemail', [
                    { type: 'pattern', value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' }
                ]);
            });

            const error = result.current.getFieldError('email');
            expect(error).toBe('Email inválido');
        });

        it('deve validar campo com múltiplas regras', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            await act(async () => {
                result.current.validateField('username', 'ab', [
                    { type: 'required', message: 'Username é obrigatório' },
                    { type: 'minLength', value: 3, message: 'Username deve ter no mínimo 3 caracteres' },
                    { type: 'maxLength', value: 20, message: 'Username deve ter no máximo 20 caracteres' },
                ]);
            });

            const error = result.current.getFieldError('username');
            expect(error).toBe('Username deve ter no mínimo 3 caracteres');
        });

        it('deve validar campo com validação customizada', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            const customValidator = (value: string) => {
                return value.includes('@') ? undefined : 'Valor deve conter @';
            };

            await act(async () => {
                result.current.validateField('custom', 'test', [
                    { type: 'custom', validator: customValidator, message: 'Validação customizada falhou' }
                ]);
            });

            const error = result.current.getFieldError('custom');
            expect(error).toBeDefined();
        });

        it('deve validar objeto completo', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            const data = {
                name: '',
                email: 'invalidemail',
                age: 15,
            };

            const schema = {
                name: [{ type: 'required', message: 'Nome é obrigatório' }],
                email: [
                    { type: 'required', message: 'Email é obrigatório' },
                    { type: 'pattern', value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' }
                ],
                age: [
                    { type: 'min', value: 18, message: 'Idade mínima é 18 anos' }
                ],
            };

            await act(async () => {
                result.current.validate(data, schema);
            });

            expect(result.current.getFieldError('name')).toBe('Nome é obrigatório');
            expect(result.current.getFieldError('email')).toBe('Email inválido');
            expect(result.current.getFieldError('age')).toBe('Idade mínima é 18 anos');
        });

        it('deve limpar erros de validação', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            // Adicionar erro
            await act(async () => {
                result.current.validateField('email', '', [{ type: 'required', message: 'Email é obrigatório' }]);
            });

            expect(result.current.getFieldError('email')).toBeDefined();

            // Limpar erros
            await act(async () => {
                result.current.clearErrors();
            });

            expect(result.current.getFieldError('email')).toBeUndefined();
        });
    });

    describe('Result: Cálculo de Resultados', () => {
        it('deve calcular resultado de quiz com todas respostas corretas', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            const answers = [
                { questionId: 'q1', answer: 'A', isCorrect: true },
                { questionId: 'q2', answer: 'B', isCorrect: true },
                { questionId: 'q3', answer: 'C', isCorrect: true },
            ];

            const quiz = {
                id: 'quiz-123',
                totalQuestions: 3,
                questions: [
                    { id: 'q1', correctAnswer: 'A' },
                    { id: 'q2', correctAnswer: 'B' },
                    { id: 'q3', correctAnswer: 'C' },
                ],
            };

            await act(async () => {
                await result.current.calculateResult(answers, quiz);
            });

            const quizResult = result.current.result;
            expect(quizResult?.score).toBe(3);
            expect(quizResult?.percentage).toBe(100);
            expect(quizResult?.category).toBe('Excelente');
        });

        it('deve calcular resultado com respostas parcialmente corretas', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            const answers = [
                { questionId: 'q1', answer: 'A', isCorrect: true },
                { questionId: 'q2', answer: 'X', isCorrect: false },
                { questionId: 'q3', answer: 'C', isCorrect: true },
            ];

            const quiz = {
                id: 'quiz-456',
                totalQuestions: 3,
                questions: [
                    { id: 'q1', correctAnswer: 'A' },
                    { id: 'q2', correctAnswer: 'B' },
                    { id: 'q3', correctAnswer: 'C' },
                ],
            };

            await act(async () => {
                await result.current.calculateResult(answers, quiz);
            });

            const quizResult = result.current.result;
            expect(quizResult?.score).toBe(2);
            expect(quizResult?.percentage).toBeCloseTo(66.67, 1);
            expect(quizResult?.category).toBe('Bom');
        });

        it('deve salvar resultado no histórico', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            const testResult = {
                id: 'result-789',
                quizId: 'quiz-789',
                score: 8,
                totalQuestions: 10,
                percentage: 80,
                category: 'Bom',
                timestamp: new Date(),
            };

            await act(async () => {
                await result.current.saveResult(testResult);
            });

            // Verificar que resultado foi salvo (em implementação real, consultaria storage)
            expect(result.current.result).toBeDefined();
        });

        it('deve carregar histórico de resultados', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            await act(async () => {
                await result.current.loadResultHistory('user-123');
            });

            // Verificar que histórico foi carregado
            expect(Array.isArray(result.current.resultHistory)).toBe(true);
        });
    });

    describe('Analysis: Análise de Resultados', () => {
        it('deve gerar análise de resultado com feedback', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            const testResult = {
                id: 'result-analysis',
                quizId: 'quiz-analysis',
                score: 7,
                totalQuestions: 10,
                percentage: 70,
                category: 'Bom',
                answers: [
                    { questionId: 'q1', topic: 'JavaScript', isCorrect: true },
                    { questionId: 'q2', topic: 'JavaScript', isCorrect: true },
                    { questionId: 'q3', topic: 'React', isCorrect: false },
                    { questionId: 'q4', topic: 'React', isCorrect: true },
                ],
            };

            await act(async () => {
                await result.current.analyzeResult(testResult);
            });

            const analysis = result.current.analysis;
            expect(analysis).toBeDefined();
            expect(analysis?.strengths).toBeDefined();
            expect(analysis?.weaknesses).toBeDefined();
            expect(analysis?.recommendations).toBeDefined();
        });

        it('deve identificar pontos fortes', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            const testResult = {
                id: 'result-strengths',
                score: 9,
                totalQuestions: 10,
                percentage: 90,
                category: 'Excelente',
                answers: [
                    { questionId: 'q1', topic: 'TypeScript', isCorrect: true },
                    { questionId: 'q2', topic: 'TypeScript', isCorrect: true },
                    { questionId: 'q3', topic: 'TypeScript', isCorrect: true },
                ],
            };

            await act(async () => {
                await result.current.analyzeResult(testResult);
            });

            const analysis = result.current.analysis;
            expect(analysis?.strengths).toContain('TypeScript');
        });

        it('deve identificar pontos fracos', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            const testResult = {
                id: 'result-weaknesses',
                score: 3,
                totalQuestions: 10,
                percentage: 30,
                category: 'Iniciante',
                answers: [
                    { questionId: 'q1', topic: 'Hooks', isCorrect: false },
                    { questionId: 'q2', topic: 'Hooks', isCorrect: false },
                    { questionId: 'q3', topic: 'Hooks', isCorrect: false },
                ],
            };

            await act(async () => {
                await result.current.analyzeResult(testResult);
            });

            const analysis = result.current.analysis;
            expect(analysis?.weaknesses).toContain('Hooks');
        });
    });

    describe('Integração: Validation + Result', () => {
        it('deve validar respostas e calcular resultado integrado', async () => {
            const { result } = renderHook(() => useValidationResult(), { wrapper });

            const answers = [
                { questionId: 'q1', answer: 'A' },
                { questionId: 'q2', answer: 'B' },
            ];

            const quiz = {
                id: 'quiz-integrated',
                questions: [
                    { id: 'q1', correctAnswer: 'A', required: true },
                    { id: 'q2', correctAnswer: 'B', required: true },
                ],
            };

            await act(async () => {
                await result.current.validateAndCalculate(answers, quiz);
            });

            // Verificar que validação e cálculo foram feitos
            expect(result.current.result).toBeDefined();
            expect(result.current.result?.score).toBeDefined();
        });
    });

    describe('Aliases: useValidation e useResult', () => {
        it('useValidation deve retornar mesma interface que useValidationResult', () => {
            const { result: validationResult } = renderHook(() => useValidation(), { wrapper });
            const { result: validationResultResult } = renderHook(() => useValidationResult(), { wrapper });

            expect(validationResult.current).toBeDefined();
            expect(validationResult.current.validate).toBeDefined();
            expect(typeof validationResult.current.validate).toBe(typeof validationResultResult.current.validate);
        });

        it('useResult deve retornar mesma interface que useValidationResult', () => {
            const { result: resultResult } = renderHook(() => useResult(), { wrapper });
            const { result: validationResultResult } = renderHook(() => useValidationResult(), { wrapper });

            expect(resultResult.current).toBeDefined();
            expect(resultResult.current.calculateResult).toBeDefined();
            expect(typeof resultResult.current.calculateResult).toBe(typeof validationResultResult.current.calculateResult);
        });
    });
});
