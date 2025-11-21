/**
 * 🧪 TESTES - SecurityProvider
 * 
 * Testes básicos para validação de segurança implementada
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, renderHook, act } from '@testing-library/react';
import { SecurityProvider, useSecurity } from '../SecurityProvider';
import React from 'react';

describe('SecurityProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('deve renderizar children corretamente', () => {
            const { getByText } = render(
                <SecurityProvider>
                    <div>Test Child</div>
                </SecurityProvider>
            );

            expect(getByText('Test Child')).toBeInTheDocument();
        });
    });

    describe('useSecurity Hook', () => {
        it('deve fornecer context correto', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <SecurityProvider>{children}</SecurityProvider>
            );

            const { result } = renderHook(() => useSecurity(), { wrapper });

            expect(result.current).toBeDefined();
            expect(result.current.isSecure).toBe(true);
            expect(typeof result.current.validateAccess).toBe('function');
            expect(typeof result.current.logSecurityEvent).toBe('function');
            expect(typeof result.current.getAccessHistory).toBe('function');
        });

        it('deve lançar erro se usado fora do provider', () => {
            // Suprimir console.error para este teste
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            expect(() => {
                renderHook(() => useSecurity());
            }).toThrow('useSecurity must be used within SecurityProvider');

            consoleSpy.mockRestore();
        });
    });

    describe('validateAccess', () => {
        it('deve permitir acesso a recursos não restritos', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <SecurityProvider>{children}</SecurityProvider>
            );

            const { result } = renderHook(() => useSecurity(), { wrapper });

            const canAccess = result.current.validateAccess('public-resource');
            expect(canAccess).toBe(true);
        });

        it('deve validar e logar acesso a recursos restritos', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <SecurityProvider>{children}</SecurityProvider>
            );

            const { result } = renderHook(() => useSecurity(), { wrapper });

            const canAccess = result.current.validateAccess('admin-panel', 'user123');

            // Por enquanto permite mas loga (implementação básica)
            expect(canAccess).toBe(true);

            // Verificar que foi adicionado ao histórico
            const history = result.current.getAccessHistory();
            expect(history.length).toBe(1);
            expect(history[0].resource).toBe('admin-panel');
            expect(history[0].granted).toBe(true);
        });

        it('deve implementar rate limiting', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <SecurityProvider>{children}</SecurityProvider>
            );

            const { result } = renderHook(() => useSecurity(), { wrapper });

            // Fazer 61 tentativas rápidas (limite é 60/minuto)
            const results = [];
            for (let i = 0; i < 61; i++) {
                results.push(result.current.validateAccess('test-resource', 'user123'));
            }

            // A 61ª tentativa deve ser bloqueada
            expect(results[60]).toBe(false);
        });

        it('deve manter histórico de acessos', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <SecurityProvider>{children}</SecurityProvider>
            );

            const { result } = renderHook(() => useSecurity(), { wrapper });

            act(() => {
                result.current.validateAccess('resource1');
                result.current.validateAccess('resource2');
                result.current.validateAccess('resource3');
            });

            const history = result.current.getAccessHistory();
            expect(history.length).toBe(3);
            expect(history.map(h => h.resource)).toEqual(['resource1', 'resource2', 'resource3']);
        });

        it('deve limitar histórico a 100 entradas', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <SecurityProvider>{children}</SecurityProvider>
            );

            const { result } = renderHook(() => useSecurity(), { wrapper });

            // Adicionar 150 tentativas
            act(() => {
                for (let i = 0; i < 150; i++) {
                    result.current.validateAccess(`resource${i}`, `user${i}`);
                }
            });

            const history = result.current.getAccessHistory();
            expect(history.length).toBe(100);

            // Verificar que mantém as últimas 100
            expect(history[0].resource).toBe('resource50');
            expect(history[99].resource).toBe('resource149');
        });
    });

    describe('logSecurityEvent', () => {
        it('deve logar eventos de segurança', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <SecurityProvider>{children}</SecurityProvider>
            );

            const { result } = renderHook(() => useSecurity(), { wrapper });

            // Não deve lançar erro
            expect(() => {
                result.current.logSecurityEvent('TEST_EVENT', { detail: 'test' });
            }).not.toThrow();
        });
    });

    describe('Recursos Restritos', () => {
        const restrictedResources = ['admin', 'system', 'user-data', 'payment', 'api-keys'];

        restrictedResources.forEach(resource => {
            it(`deve logar tentativa de acesso a recurso restrito: ${resource}`, () => {
                const wrapper = ({ children }: { children: React.ReactNode }) => (
                    <SecurityProvider>{children}</SecurityProvider>
                );

                const { result } = renderHook(() => useSecurity(), { wrapper });

                const canAccess = result.current.validateAccess(`${resource}-endpoint`);

                // Por enquanto permite (implementação básica)
                expect(canAccess).toBe(true);

                // Mas deve ter registrado no histórico
                const history = result.current.getAccessHistory();
                expect(history.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Integração', () => {
        it('deve funcionar com múltiplos usuários', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <SecurityProvider>{children}</SecurityProvider>
            );

            const { result } = renderHook(() => useSecurity(), { wrapper });

            act(() => {
                result.current.validateAccess('resource1', 'user1');
                result.current.validateAccess('resource2', 'user2');
                result.current.validateAccess('resource3', 'user1');
            });

            const history = result.current.getAccessHistory();
            expect(history.length).toBe(3);
        });

        it('deve resetar rate limit após 1 minuto', (done) => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <SecurityProvider>{children}</SecurityProvider>
            );

            const { result } = renderHook(() => useSecurity(), { wrapper });

            // Fazer 60 tentativas
            for (let i = 0; i < 60; i++) {
                result.current.validateAccess('test', 'user');
            }

            // 61ª deve falhar
            expect(result.current.validateAccess('test', 'user')).toBe(false);

            // Após 1 minuto, deve permitir novamente
            setTimeout(() => {
                expect(result.current.validateAccess('test', 'user')).toBe(true);
                done();
            }, 60100); // 60s + margem
        }, 65000); // Timeout de 65s para o teste
    });
});

describe('SecurityProvider - Edge Cases', () => {
    it('deve lidar com resource vazio', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SecurityProvider>{children}</SecurityProvider>
        );

        const { result } = renderHook(() => useSecurity(), { wrapper });

        expect(() => {
            result.current.validateAccess('');
        }).not.toThrow();
    });

    it('deve lidar com userId undefined', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SecurityProvider>{children}</SecurityProvider>
        );

        const { result } = renderHook(() => useSecurity(), { wrapper });

        expect(() => {
            result.current.validateAccess('resource');
        }).not.toThrow();
    });

    it('deve lidar com caracteres especiais no resource', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SecurityProvider>{children}</SecurityProvider>
        );

        const { result } = renderHook(() => useSecurity(), { wrapper });

        const specialResources = [
            'resource/with/slash',
            'resource?with=query',
            'resource#with-hash',
            'resource with spaces',
        ];

        specialResources.forEach(resource => {
            expect(() => {
                result.current.validateAccess(resource);
            }).not.toThrow();
        });
    });
});
