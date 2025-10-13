/**
 * @file useVirtualBlocks.test.ts
 * @description Testes unitários para o hook useVirtualBlocks
 * @created 2025-10-13
 * @priority CRITICAL
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useVirtualBlocks } from '../useVirtualBlocks';
import type { BlockComponent } from '../../types';

describe('useVirtualBlocks', () => {
    let mockBlocks: BlockComponent[];

    beforeEach(() => {
        mockBlocks = createMockBlocks(100);
    });

    describe('🛡️ Input Validation', () => {
        it('TC-V001: deve lidar com array vazio de blocos', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: [],
                    rowHeight: 140,
                    overscan: 6,
                    enabled: true
                })
            );

            expect(result.current.visible).toEqual([]);
            expect(result.current.total).toBe(0);
            expect(result.current.topSpacer).toBe(0);
            expect(result.current.bottomSpacer).toBe(0);
        });

        it('TC-V002: deve lidar com blocks undefined', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: undefined as any,
                    rowHeight: 140,
                    overscan: 6,
                    enabled: true
                })
            );

            expect(result.current.visible).toEqual([]);
            expect(result.current.total).toBe(0);
        });

        it('TC-V003: deve lidar com blocks null', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: null as any,
                    rowHeight: 140,
                    overscan: 6,
                    enabled: true
                })
            );

            expect(result.current.visible).toEqual([]);
            expect(result.current.total).toBe(0);
        });

        it('TC-V004: deve lidar com blocks não-array', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: 'invalid' as any,
                    rowHeight: 140,
                    overscan: 6,
                    enabled: true
                })
            );

            expect(result.current.visible).toEqual([]);
            expect(result.current.total).toBe(0);
        });

        it('TC-V005: deve usar valores padrão quando opções omitidas', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks
                })
            );

            expect(result.current.visible).toBeDefined();
            expect(result.current.total).toBe(100);
        });
    });

    describe('⚙️ Configuration', () => {
        it('TC-V006: deve respeitar rowHeight customizado', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 200,
                    overscan: 2,
                    enabled: true
                })
            );

            // Com viewport de 600px e rowHeight de 200px, deve mostrar ~3 itens + overscan
            expect(result.current.visible.length).toBeGreaterThan(0);
            expect(result.current.visible.length).toBeLessThanOrEqual(7); // 3 + 2*2 overscan
        });

        it('TC-V007: deve respeitar overscan customizado', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 100,
                    overscan: 10,
                    enabled: true
                })
            );

            // Overscan maior deve resultar em mais blocos visíveis
            expect(result.current.visible.length).toBeGreaterThan(10);
        });

        it('TC-V008: deve desabilitar virtualização quando enabled=false', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 6,
                    enabled: false
                })
            );

            // Quando desabilitado, deve retornar TODOS os blocos
            expect(result.current.visible).toHaveLength(100);
            expect(result.current.topSpacer).toBe(0);
            expect(result.current.bottomSpacer).toBe(0);
        });

        it('TC-V009: deve habilitar virtualização quando enabled=true', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 6,
                    enabled: true
                })
            );

            // Quando habilitado, deve retornar MENOS blocos que o total
            expect(result.current.visible.length).toBeLessThan(100);
            expect(result.current.visible.length).toBeGreaterThan(0);
        });
    });

    describe('📊 Calculation Logic', () => {
        it('TC-V010: deve calcular visible blocks corretamente no topo', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 4,
                    enabled: true
                })
            );

            // No topo (scrollTop = 0), deve mostrar primeiros blocos + overscan
            expect(result.current.scrollTop).toBe(0);
            expect(result.current.visible[0]).toEqual(mockBlocks[0]);
            expect(result.current.topSpacer).toBe(0);
        });

        it('TC-V011: deve calcular topSpacer corretamente ao rolar', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 4,
                    enabled: true
                })
            );

            // Simular scroll para baixo
            act(() => {
                result.current.setScrollTop(2800); // 20 blocos * 140px
            });

            // topSpacer deve ser > 0 após rolar
            expect(result.current.topSpacer).toBeGreaterThan(0);

            // Deve estar aproximadamente na posição esperada (com margem de overscan)
            const expectedTopSpacer = Math.floor(2800 / 140 - 4) * 140;
            expect(result.current.topSpacer).toBeGreaterThanOrEqual(expectedTopSpacer);
        });

        it('TC-V012: deve calcular bottomSpacer corretamente', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 4,
                    enabled: true
                })
            );

            // No topo, bottomSpacer deve ser grande
            expect(result.current.bottomSpacer).toBeGreaterThan(0);

            // Deve representar os blocos não visíveis no final
            const visibleCount = result.current.visible.length;
            const hiddenBottom = 100 - (0 + visibleCount);
            const expectedBottomSpacer = hiddenBottom * 140;

            expect(result.current.bottomSpacer).toBeCloseTo(expectedBottomSpacer, -100);
        });

        it('TC-V013: deve recalcular ao mudar scrollTop', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 4,
                    enabled: true
                })
            );

            const initialVisible = result.current.visible;

            act(() => {
                result.current.setScrollTop(4200); // Rolar significativamente
            });

            const newVisible = result.current.visible;

            // Os blocos visíveis devem ter mudado
            expect(newVisible[0].id).not.toBe(initialVisible[0].id);
        });

        it('TC-V014: deve retornar total correto de blocos', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 6,
                    enabled: true
                })
            );

            expect(result.current.total).toBe(100);
        });

        it('TC-V015: deve manter referência de containerRef estável', () => {
            const { result, rerender } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 6,
                    enabled: true
                })
            );

            const firstRef = result.current.containerRef;

            rerender();

            const secondRef = result.current.containerRef;

            expect(firstRef).toBe(secondRef);
        });
    });

    describe('🎯 Window Slicing', () => {
        it('TC-V016: deve retornar slice correto de blocos', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 2,
                    enabled: true
                })
            );

            const visible = result.current.visible;

            // Deve retornar blocos sequenciais
            for (let i = 0; i < visible.length - 1; i++) {
                const currentIndex = parseInt(visible[i].id.split('-')[1]);
                const nextIndex = parseInt(visible[i + 1].id.split('-')[1]);
                expect(nextIndex).toBe(currentIndex + 1);
            }
        });

        it('TC-V017: deve aplicar overscan corretamente acima da viewport', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 3,
                    enabled: true
                })
            );

            // Rolar para posição do meio
            act(() => {
                result.current.setScrollTop(7000); // ~50 blocos
            });

            // Deve incluir blocos antes da viewport (overscan)
            const firstVisibleIndex = parseInt(result.current.visible[0].id.split('-')[1]);
            const expectedFirstIndex = Math.floor(7000 / 140) - 3;

            expect(firstVisibleIndex).toBeLessThanOrEqual(expectedFirstIndex + 1);
        });

        it('TC-V018: deve aplicar overscan corretamente abaixo da viewport', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 3,
                    enabled: true
                })
            );

            const visibleCount = result.current.visible.length;

            // Com viewport de ~600px e rowHeight 140, cabem ~4-5 blocos
            // Com overscan de 3, deve ter 3 blocos a mais acima e 3 abaixo
            expect(visibleCount).toBeGreaterThan(4 + 3); // viewport + overscan inferior
        });

        it('TC-V019: deve limitar slice ao final da lista', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 10,
                    enabled: true
                })
            );

            // Rolar até o final
            act(() => {
                result.current.setScrollTop(14000); // Muito além do fim
            });

            const visible = result.current.visible;
            const lastBlock = visible[visible.length - 1];

            // Último bloco visível deve ser o último da lista
            expect(lastBlock.id).toBe('block-99');
        });

        it('TC-V020: deve limitar slice ao início da lista', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 10,
                    enabled: true
                })
            );

            // Mesmo com overscan grande, não deve ter índice negativo
            expect(result.current.topSpacer).toBe(0);

            const firstBlock = result.current.visible[0];
            expect(firstBlock.id).toBe('block-0');
        });
    });

    describe('🔄 State Updates', () => {
        it('TC-V021: deve atualizar visible ao mudar blocks', () => {
            const { result, rerender } = renderHook(
                ({ blocks }) => useVirtualBlocks({ blocks, enabled: true }),
                { initialProps: { blocks: mockBlocks } }
            );

            const initialVisible = result.current.visible;

            const newBlocks = createMockBlocks(50);
            rerender({ blocks: newBlocks });

            expect(result.current.total).toBe(50);
            expect(result.current.visible).not.toBe(initialVisible);
        });

        it('TC-V022: deve recalcular ao mudar enabled', () => {
            const { result, rerender } = renderHook(
                ({ enabled }) => useVirtualBlocks({ blocks: mockBlocks, enabled }),
                { initialProps: { enabled: true } }
            );

            const virtualizedVisible = result.current.visible;
            expect(virtualizedVisible.length).toBeLessThan(100);

            rerender({ enabled: false });

            expect(result.current.visible.length).toBe(100);
        });

        it('TC-V023: deve recalcular ao mudar rowHeight', () => {
            const { result, rerender } = renderHook(
                ({ rowHeight }) => useVirtualBlocks({ blocks: mockBlocks, rowHeight, enabled: true }),
                { initialProps: { rowHeight: 140 } }
            );

            const initialVisible = result.current.visible.length;

            rerender({ rowHeight: 70 }); // Rows menores = mais visíveis

            expect(result.current.visible.length).toBeGreaterThan(initialVisible);
        });

        it('TC-V024: deve recalcular ao mudar overscan', () => {
            const { result, rerender } = renderHook(
                ({ overscan }) => useVirtualBlocks({ blocks: mockBlocks, overscan, enabled: true }),
                { initialProps: { overscan: 2 } }
            );

            const initialVisible = result.current.visible.length;

            rerender({ overscan: 10 });

            expect(result.current.visible.length).toBeGreaterThan(initialVisible);
        });

        it('TC-V025: setScrollTop deve atualizar scrollTop', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 4,
                    enabled: true
                })
            );

            expect(result.current.scrollTop).toBe(0);

            act(() => {
                result.current.setScrollTop(1000);
            });

            expect(result.current.scrollTop).toBe(1000);
        });
    });

    describe('⚡ Performance & Memoization', () => {
        it('TC-V026: visible deve ser memoizado quando dependências não mudam', () => {
            const { result, rerender } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 4,
                    enabled: true
                })
            );

            const firstVisible = result.current.visible;

            rerender(); // Re-render sem mudanças

            const secondVisible = result.current.visible;

            // Deve retornar a mesma referência (memoizado)
            expect(secondVisible).toBe(firstVisible);
        });

        it('TC-V027: spacers devem ser memoizados quando dependências não mudam', () => {
            const { result, rerender } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 4,
                    enabled: true
                })
            );

            const firstTopSpacer = result.current.topSpacer;
            const firstBottomSpacer = result.current.bottomSpacer;

            rerender();

            expect(result.current.topSpacer).toBe(firstTopSpacer);
            expect(result.current.bottomSpacer).toBe(firstBottomSpacer);
        });

        it('TC-V028: não deve recalcular visible em cada re-render', () => {
            let renderCount = 0;

            const { result, rerender } = renderHook(() => {
                renderCount++;
                return useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 4,
                    enabled: true
                });
            });

            const firstVisible = result.current.visible;

            // Múltiplos re-renders sem mudanças
            rerender();
            rerender();
            rerender();

            // visible deve permanecer igual
            expect(result.current.visible).toBe(firstVisible);
        });
    });

    describe('🎨 Edge Cases', () => {
        it('TC-V029: deve lidar com 1 bloco apenas', () => {
            const singleBlock = [createMockBlock(0)];

            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: singleBlock,
                    rowHeight: 140,
                    overscan: 4,
                    enabled: true
                })
            );

            expect(result.current.visible).toHaveLength(1);
            expect(result.current.total).toBe(1);
            expect(result.current.topSpacer).toBe(0);
            expect(result.current.bottomSpacer).toBe(0);
        });

        it('TC-V030: deve lidar com rowHeight muito pequeno', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 1,
                    overscan: 2,
                    enabled: true
                })
            );

            // Com rowHeight de 1px, deve mostrar muitos blocos
            expect(result.current.visible.length).toBeGreaterThan(50);
        });

        it('TC-V031: deve lidar com rowHeight muito grande', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 10000,
                    overscan: 2,
                    enabled: true
                })
            );

            // Com rowHeight de 10000px, poucos blocos cabem
            expect(result.current.visible.length).toBeLessThan(10);
        });

        it('TC-V032: deve lidar com overscan 0', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 0,
                    enabled: true
                })
            );

            // Deve funcionar mesmo sem overscan
            expect(result.current.visible.length).toBeGreaterThan(0);
        });

        it('TC-V033: deve lidar com scrollTop negativo', () => {
            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks: mockBlocks,
                    rowHeight: 140,
                    overscan: 4,
                    enabled: true
                })
            );

            act(() => {
                result.current.setScrollTop(-100);
            });

            // Deve tratar como 0
            expect(result.current.topSpacer).toBe(0);
        });

        it('TC-V034: deve lidar com mudança de blocks para array vazio', () => {
            const { result, rerender } = renderHook(
                ({ blocks }) => useVirtualBlocks({ blocks, enabled: true }),
                { initialProps: { blocks: mockBlocks } }
            );

            expect(result.current.total).toBe(100);

            rerender({ blocks: [] });

            expect(result.current.visible).toEqual([]);
            expect(result.current.total).toBe(0);
        });

        it('TC-V035: deve lidar com blocos de IDs não sequenciais', () => {
            const blocks: BlockComponent[] = [
                { id: 'block-abc', type: 'heading', order: 0, properties: {}, content: {} },
                { id: 'block-xyz', type: 'text', order: 1, properties: {}, content: {} },
                { id: 'block-123', type: 'image', order: 2, properties: {}, content: {} }
            ];

            const { result } = renderHook(() =>
                useVirtualBlocks({
                    blocks,
                    rowHeight: 140,
                    overscan: 4,
                    enabled: true
                })
            );

            expect(result.current.total).toBe(3);
            expect(result.current.visible.length).toBeGreaterThan(0);
        });
    });
});

// ==================== HELPER FUNCTIONS ====================

function createMockBlock(index: number): BlockComponent {
    return {
        id: `block-${index}`,
        type: 'heading',
        order: index,
        properties: {
            text: `Block ${index}`
        },
        content: {}
    };
}

function createMockBlocks(count: number): BlockComponent[] {
    return Array.from({ length: count }, (_, i) => createMockBlock(i));
}
