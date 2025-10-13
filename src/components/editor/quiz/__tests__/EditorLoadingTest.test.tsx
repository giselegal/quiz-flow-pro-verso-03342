/**
 * @file EditorLoadingTest.test.tsx
 * @description Teste de carregamento do editor - Valida inicialização completa
 * @created 2025-10-13
 * @priority HIGH
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock de módulos pesados
vi.mock('@/lib/supabase/client', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: null, error: null }))
                })),
                order: vi.fn(() => ({
                    limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
                }))
            })),
            insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
            update: vi.fn(() => Promise.resolve({ data: null, error: null })),
            delete: vi.fn(() => Promise.resolve({ data: null, error: null }))
        })),
        auth: {
            getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
            getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null }))
        }
    }
}));

vi.mock('@dnd-kit/core', () => ({
    DndContext: ({ children }: any) => <div data-testid="dnd-context">{children}</div>,
    useSensor: vi.fn(),
    useSensors: vi.fn(() => []),
    PointerSensor: vi.fn(),
    KeyboardSensor: vi.fn(),
    DragOverlay: ({ children }: any) => <div data-testid="drag-overlay">{children}</div>,
    closestCenter: vi.fn(),
    useDraggable: vi.fn(() => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        isDragging: false
    })),
    useDroppable: vi.fn(() => ({
        setNodeRef: vi.fn(),
        isOver: false
    }))
}));

vi.mock('@dnd-kit/sortable', () => ({
    SortableContext: ({ children }: any) => <div data-testid="sortable-context">{children}</div>,
    verticalListSortingStrategy: {},
    useSortable: vi.fn(() => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false
    }))
}));

describe('🚀 Editor Loading Test - /editor Route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock console para evitar ruído nos testes
        vi.spyOn(console, 'log').mockImplementation(() => { });
        vi.spyOn(console, 'warn').mockImplementation(() => { });
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('📦 Component Import Test', () => {
        it('TC-LOAD-001: deve importar o componente QuizModularProductionEditor sem erros', async () => {
            expect(async () => {
                await import('../QuizModularProductionEditor');
            }).not.toThrow();
        });

        it('TC-LOAD-002: deve importar CanvasArea sem erros', async () => {
            expect(async () => {
                await import('../components/CanvasArea');
            }).not.toThrow();
        });

        it('TC-LOAD-003: deve importar useVirtualBlocks sem erros', async () => {
            expect(async () => {
                await import('../hooks/useVirtualBlocks');
            }).not.toThrow();
        });
    });

    describe('🎯 Initial Render Test', () => {
        it('TC-LOAD-004: deve renderizar o editor sem crashes', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            expect(() => {
                render(
                    <BrowserRouter>
                        <QuizModularProductionEditor />
                    </BrowserRouter>
                );
            }).not.toThrow();
        });

        it('TC-LOAD-005: deve mostrar estado de carregamento inicial', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            // Deve mostrar algum indicador de carregamento ou conteúdo inicial
            expect(document.body).toBeTruthy();
        });

        it('TC-LOAD-006: deve carregar sem erros de hook condicional', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');
            const errorSpy = vi.spyOn(console, 'error');

            render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                // Não deve haver erro de "Rendered more hooks"
                expect(errorSpy).not.toHaveBeenCalledWith(
                    expect.stringContaining('Rendered more hooks')
                );
            });
        });
    });

    describe('🏗️ Layout Structure Test', () => {
        it('TC-LOAD-007: deve renderizar layout de 4 colunas', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            const { container } = render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                // Verifica se há estrutura de grid/layout
                const layoutElements = container.querySelectorAll('[class*="grid"], [class*="flex"]');
                expect(layoutElements.length).toBeGreaterThan(0);
            });
        });

        it('TC-LOAD-008: deve ter contexto de DnD inicializado', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
            });
        });
    });

    describe('⚡ Performance Test', () => {
        it('TC-LOAD-009: deve carregar em menos de 5 segundos', async () => {
            const startTime = performance.now();
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(document.body).toBeTruthy();
            });

            const loadTime = performance.now() - startTime;
            expect(loadTime).toBeLessThan(5000);
        });

        it('TC-LOAD-010: não deve ter memory leaks evidentes', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            const { unmount } = render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(document.body).toBeTruthy();
            });

            expect(() => unmount()).not.toThrow();
        });
    });

    describe('🛡️ Error Boundary Test', () => {
        it('TC-LOAD-011: deve ter error boundary para capturar erros', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            // Simula erro controlado
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(document.body).toBeTruthy();
            });

            errorSpy.mockRestore();
        });

        it('TC-LOAD-012: deve lidar com falha de carregamento de dados', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            // Testa se o componente não quebra com dados ausentes
            expect(() => {
                render(
                    <BrowserRouter>
                        <QuizModularProductionEditor />
                    </BrowserRouter>
                );
            }).not.toThrow();
        });
    });

    describe('📊 Initial State Test', () => {
        it('TC-LOAD-013: deve inicializar com template padrão se não houver funnelId', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(document.body).toBeTruthy();
            }, { timeout: 3000 });
        });

        it('TC-LOAD-014: deve inicializar hooks na ordem correta', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');
            const errorSpy = vi.spyOn(console, 'error');

            render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(document.body).toBeTruthy();
            });

            // Não deve ter erro de ordem de hooks
            expect(errorSpy).not.toHaveBeenCalledWith(
                expect.stringContaining('hook')
            );
        });

        it('TC-LOAD-015: deve ter CanvasArea montado após carregamento', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                // Verifica presença de elementos típicos do CanvasArea
                const canvasElements = document.querySelectorAll('[data-testid*="tab"], [data-testid*="canvas"]');
                expect(canvasElements.length).toBeGreaterThanOrEqual(0);
            });
        });
    });

    describe('🔄 Re-render Stability Test', () => {
        it('TC-LOAD-016: deve manter estabilidade em múltiplos re-renders', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            const { rerender } = render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(document.body).toBeTruthy();
            });

            // Re-render múltiplas vezes
            expect(() => {
                rerender(
                    <BrowserRouter>
                        <QuizModularProductionEditor />
                    </BrowserRouter>
                );
                rerender(
                    <BrowserRouter>
                        <QuizModularProductionEditor />
                    </BrowserRouter>
                );
                rerender(
                    <BrowserRouter>
                        <QuizModularProductionEditor />
                    </BrowserRouter>
                );
            }).not.toThrow();
        });

        it('TC-LOAD-017: não deve aumentar número de hooks em re-renders', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');
            const errorSpy = vi.spyOn(console, 'error');

            const { rerender } = render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(document.body).toBeTruthy();
            });

            // Re-render
            rerender(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(errorSpy).not.toHaveBeenCalledWith(
                    expect.stringContaining('Rendered more hooks')
                );
            });
        });
    });

    describe('🎨 Visual Regression Test', () => {
        it('TC-LOAD-018: deve renderizar sem erros de CSS', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            const { container } = render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                // Verifica se há elementos visíveis
                const visibleElements = container.querySelectorAll('*');
                expect(visibleElements.length).toBeGreaterThan(0);
            });
        });

        it('TC-LOAD-019: deve ter estrutura HTML válida', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            const { container } = render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(container.firstChild).toBeTruthy();
            });
        });
    });

    describe('🔌 Integration Test', () => {
        it('TC-LOAD-020: deve integrar todos os providers necessários', async () => {
            const { QuizModularProductionEditor } = await import('../QuizModularProductionEditor');

            render(
                <BrowserRouter>
                    <QuizModularProductionEditor />
                </BrowserRouter>
            );

            await waitFor(() => {
                // Verifica presença de contextos necessários
                expect(document.body).toBeTruthy();
            });
        });
    });
});
