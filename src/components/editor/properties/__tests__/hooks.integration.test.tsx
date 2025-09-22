/**
 * 🧪 TESTES DE INTEGRAÇÃO - Hooks useUserName e useQuizResult
 * 
 * Testa a integração real dos hooks utilizados no sistema de interpolação
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserName } from '@/hooks/useUserName';
import { useQuizResult } from '@/hooks/useQuizResult';

// Mock do AuthContext
const mockAuthContext = {
    user: {
        name: 'Ana Costa',
        email: 'ana.costa@example.com'
    }
};

vi.mock('@/context/AuthContext', () => ({
    useAuth: () => mockAuthContext
}));

describe('Hooks Integration Tests', () => {
    beforeEach(() => {
        // Limpa localStorage antes de cada teste
        localStorage.clear();
        vi.clearAllMocks();
    });

    describe('useUserName Hook', () => {
        it('deve retornar nome do localStorage.quizUserName quando disponível', () => {
            localStorage.setItem('quizUserName', 'Maria Silva');

            const { result } = renderHook(() => useUserName());

            expect(result.current).toBe('Maria Silva');
        });

        it('deve usar localStorage.userName como fallback', () => {
            localStorage.setItem('userName', 'João Santos');

            const { result } = renderHook(() => useUserName());

            expect(result.current).toBe('João Santos');
        });

        it('deve usar AuthContext user.name quando não há localStorage', () => {
            const { result } = renderHook(() => useUserName());

            expect(result.current).toBe('Ana Costa');
        });

        it('deve usar email como fallback quando name não existe', () => {
            mockAuthContext.user.name = '';

            const { result } = renderHook(() => useUserName());

            expect(result.current).toBe('ana.costa');
        });

        it('deve retornar "Usuário" quando nada está disponível', () => {
            mockAuthContext.user.name = '';
            mockAuthContext.user.email = '';

            const { result } = renderHook(() => useUserName());

            expect(result.current).toBe('Usuário');
        });

        it('deve seguir ordem de prioridade correta', () => {
            // Setup com todas as opções disponíveis
            localStorage.setItem('quizUserName', 'Quiz User');
            localStorage.setItem('userName', 'General User');
            mockAuthContext.user.name = 'Auth User';
            mockAuthContext.user.email = 'email@test.com';

            const { result } = renderHook(() => useUserName());

            // Deve usar a primeira opção (prioridade mais alta)
            expect(result.current).toBe('Quiz User');
        });
    });

    describe('useQuizResult Hook', () => {
        it('deve retornar dados válidos do resultado do quiz', async () => {
            const { result } = renderHook(() => useQuizResult());

            // Aguarda o carregamento inicial
            await waitFor(() => {
                expect(result.current.primaryStyle).toBeDefined();
            });

            // Verifica estrutura dos dados
            if (result.current.primaryStyle) {
                expect(result.current.primaryStyle).toHaveProperty('style');
                expect(result.current.primaryStyle).toHaveProperty('percentage');
                expect(typeof result.current.primaryStyle.style).toBe('string');
                expect(typeof result.current.primaryStyle.percentage).toBe('number');
            }
        });

        it('deve ter estado de loading durante carregamento', () => {
            const { result } = renderHook(() => useQuizResult());

            // No início, deve estar carregando ou ter resultado
            expect(typeof result.current.isLoading).toBe('boolean');
        });

        it('deve gerenciar errors quando necessário', async () => {
            const { result } = renderHook(() => useQuizResult());

            await waitFor(() => {
                expect(result.current.error).toBeDefined();
            });

            // Error deve ser null ou string
            expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
        });
    });

    describe('Integration with Interpolation System', () => {
        it('deve fornecer dados válidos para sistema de interpolação', async () => {
            // Setup test data
            localStorage.setItem('quizUserName', 'Test User');

            const userNameHook = renderHook(() => useUserName());
            const quizResultHook = renderHook(() => useQuizResult());

            // Wait for data to load
            await waitFor(() => {
                expect(userNameHook.result.current).toBeDefined();
            });

            const userName = userNameHook.result.current;
            const quizResult = quizResultHook.result.current;

            // Verifica se dados são adequados para interpolação
            expect(typeof userName).toBe('string');
            expect(userName.length).toBeGreaterThan(0);

            // Se houver resultado, deve ter a estrutura correta
            if (quizResult.primaryStyle) {
                expect(typeof quizResult.primaryStyle.style).toBe('string');
                expect(typeof quizResult.primaryStyle.percentage).toBe('number');
                expect(quizResult.primaryStyle.percentage).toBeGreaterThanOrEqual(0);
                expect(quizResult.primaryStyle.percentage).toBeLessThanOrEqual(100);
            }
        });

        it('deve simular cenário real de uso no NoCodePropertiesPanel', async () => {
            // Simula um usuário real com dados completos
            localStorage.setItem('quizUserName', 'Maria da Silva');

            const userName = renderHook(() => useUserName()).result.current;
            const { result: quizResult } = renderHook(() => useQuizResult());

            // Simula como seria usado no sistema de interpolação
            const availableVariables = [
                {
                    key: 'userName',
                    value: userName || 'Usuário'
                },
                {
                    key: 'resultStyle',
                    value: quizResult.current.primaryStyle?.style || 'Seu Estilo'
                },
                {
                    key: 'resultPercentage',
                    value: quizResult.current.primaryStyle?.percentage
                        ? `${Math.round(quizResult.current.primaryStyle.percentage)}%`
                        : '0%'
                }
            ];

            // Testa interpolação como seria feita no componente real
            const interpolateText = (text: string): string => {
                let interpolated = text;
                availableVariables.forEach(variable => {
                    const pattern = new RegExp(`\\{${variable.key}\\}`, 'g');
                    interpolated = interpolated.replace(pattern, variable.value);
                });
                return interpolated;
            };

            // Testa casos de uso reais
            const greeting = interpolateText('Olá {userName}!');
            expect(greeting).toBe('Olá Maria da Silva!');

            const progressMessage = 'Você selecionou {count} de {required} opções';
            // Mesmo sem count/required definidos, não deve quebrar
            expect(() => interpolateText(progressMessage)).not.toThrow();
        });
    });
});