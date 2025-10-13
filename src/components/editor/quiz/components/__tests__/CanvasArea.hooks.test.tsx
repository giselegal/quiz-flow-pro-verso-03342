/**
 * @file CanvasArea.hooks.test.tsx
 * @description Testes específicos para validar a correção do hook condicional
 * @created 2025-10-13
 * @priority CRITICAL
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CanvasArea } from '../CanvasArea';
import type { EditableQuizStep, BlockComponent } from '../../types';
import React from 'react';
import { useVirtualBlocks } from '../../hooks/useVirtualBlocks';

// Mock do hook useVirtualBlocks
vi.mock('../../hooks/useVirtualBlocks');

// Get mocked version
const mockUseVirtualBlocks = vi.mocked(useVirtualBlocks);

// Mock de componentes UI
vi.mock('@/components/ui/tabs', () => ({
    Tabs: ({ children, value, onValueChange }: any) => (
        <div data-testid="tabs" data-value={value}>{children}</div>
    ),
    TabsContent: ({ children, value }: any) => (
        <div data-testid={`tab-content-${value}`}>{children}</div>
    ),
    TabsList: ({ children }: any) => <div>{children}</div>,
    TabsTrigger: ({ children, value }: any) => (
        <button data-testid={`tab-trigger-${value}`}>{children}</button>
    )
}));

vi.mock('@/components/ui/card', () => ({
    Card: ({ children }: any) => <div data-testid="card">{children}</div>,
    CardContent: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@dnd-kit/sortable', () => ({
    SortableContext: ({ children }: any) => <div>{children}</div>,
    verticalListSortingStrategy: {}
}));

vi.mock('@/components/ui/tooltip', () => ({
    TooltipProvider: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick }: any) => (
        <button onClick={onClick}>{children}</button>
    )
}));

describe('CanvasArea - Hook Conditional Fix', () => {
    let mockProps: any;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();
        
        // Setup default mock return
        mockUseVirtualBlocks.mockReturnValue({
            visible: [],
            topSpacer: 0,
            bottomSpacer: 0,
            total: 0,
            scrollTop: 0,
            setScrollTop: vi.fn(),
            containerRef: { current: null }
        });

        // Props padrão
        mockProps = {
            activeTab: 'canvas',
            onTabChange: vi.fn(),
            steps: [],
            selectedStep: undefined,
            headerConfig: {},
            liveScores: {},
            BlockRow: ({ block }: any) => <div data-testid={`block-${block.id}`}>{block.type}</div>,
            byBlock: {},
            selectedBlockId: '',
            isMultiSelected: vi.fn(() => false),
            handleBlockClick: vi.fn(),
            renderBlockPreview: vi.fn((block) => <div>{block.type}</div>),
            removeBlock: vi.fn(),
            setBlockPendingDuplicate: vi.fn(),
            setTargetStepId: vi.fn(),
            setDuplicateModalOpen: vi.fn(),
            activeId: null,
            previewNode: <div>Preview</div>,
            FixedProgressHeader: () => <div>Header</div>,
            StyleResultCard: () => <div>Result</div>,
            OfferMap: () => <div>Offers</div>
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('✅ Hook Rules Compliance', () => {
        it('TC-H001: deve chamar useVirtualBlocks incondicionalmente', () => {
            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: []
            };

            render(<CanvasArea {...mockProps} selectedStep={step} />);

            // Hook deve ser chamado SEMPRE, independente de condições
            expect(mockUseVirtualBlocks).toHaveBeenCalledTimes(1);
        });

        it('TC-H002: deve chamar useVirtualBlocks com parâmetros corretos quando step está vazio', () => {
            const emptyStep: EditableQuizStep = {
                id: 'step-empty',
                order: 0,
                type: 'question',
                blocks: []
            };

            render(<CanvasArea {...mockProps} selectedStep={emptyStep} />);

            expect(mockUseVirtualBlocks).toHaveBeenCalledWith({
                blocks: [],
                rowHeight: 140,
                overscan: 6,
                enabled: false // virtualização desabilitada para lista vazia
            });
        });

        it('TC-H003: deve chamar useVirtualBlocks mesmo sem selectedStep', () => {
            render(<CanvasArea {...mockProps} selectedStep={undefined} />);

            // Hook deve ser chamado mesmo se não há step selecionado
            expect(mockUseVirtualBlocks).toHaveBeenCalledTimes(1);
            expect(mockUseVirtualBlocks).toHaveBeenCalledWith({
                blocks: [],
                rowHeight: 140,
                overscan: 6,
                enabled: false
            });
        });

        it('TC-H004: deve manter ordem de hooks consistente entre re-renders', () => {
            const step1: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: createBlocks(10)
            };

            const step2: EditableQuizStep = {
                id: 'step-2',
                order: 1,
                type: 'question',
                blocks: createBlocks(100)
            };

            const { rerender } = render(<CanvasArea {...mockProps} selectedStep={step1} />);
            const firstCallCount = mockUseVirtualBlocks.mock.calls.length;

            rerender(<CanvasArea {...mockProps} selectedStep={step2} />);
            const secondCallCount = mockUseVirtualBlocks.mock.calls.length;

            // Número de hooks deve ser consistente (apenas incrementa)
            expect(secondCallCount).toBe(firstCallCount + 1);
        });

        it('TC-H005: deve chamar useVirtualBlocks no nível superior do componente', () => {
            // Este teste verifica que o hook não está sendo chamado condicionalmente
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });

            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: createBlocks(50)
            };

            render(<CanvasArea {...mockProps} selectedStep={step} />);

            // Não deve haver erro de "Rendered more hooks than during the previous render"
            expect(consoleError).not.toHaveBeenCalledWith(
                expect.stringContaining('Rendered more hooks')
            );

            consoleError.mockRestore();
        });
    });

    describe('⚡ Virtualization Logic', () => {
        it('TC-H006: deve desabilitar virtualização com menos de 60 blocos', () => {
            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: createBlocks(59)
            };

            render(<CanvasArea {...mockProps} selectedStep={step} />);

            expect(mockUseVirtualBlocks).toHaveBeenCalledWith(
                expect.objectContaining({ enabled: false })
            );
        });

        it('TC-H007: deve habilitar virtualização com 60 ou mais blocos', () => {
            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: createBlocks(60)
            };

            render(<CanvasArea {...mockProps} selectedStep={step} />);

            expect(mockUseVirtualBlocks).toHaveBeenCalledWith(
                expect.objectContaining({ enabled: true })
            );
        });

        it('TC-H008: deve desabilitar virtualização durante drag (activeId !== null)', () => {
            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: createBlocks(100)
            };

            render(<CanvasArea {...mockProps} selectedStep={step} activeId="block-1" />);

            // Virtualização deve ser desabilitada durante drag
            expect(mockUseVirtualBlocks).toHaveBeenCalledWith(
                expect.objectContaining({ enabled: false })
            );
        });

        it('TC-H009: deve reabilitar virtualização após drag', () => {
            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: createBlocks(100)
            };

            const { rerender } = render(
                <CanvasArea {...mockProps} selectedStep={step} activeId="block-1" />
            );

            // Durante drag
            expect(mockUseVirtualBlocks).toHaveBeenLastCalledWith(
                expect.objectContaining({ enabled: false })
            );

            // Após drag
            rerender(<CanvasArea {...mockProps} selectedStep={step} activeId={null} />);

            expect(mockUseVirtualBlocks).toHaveBeenLastCalledWith(
                expect.objectContaining({ enabled: true })
            );
        });

        it('TC-H010: deve calcular rootBlocks corretamente com useMemo', () => {
            const blocks: BlockComponent[] = [
                createBlock('block-1', null, 0),
                createBlock('block-2', 'block-1', 0), // filho de block-1
                createBlock('block-3', null, 1),
                createBlock('block-4', 'block-3', 0), // filho de block-3
                createBlock('block-5', null, 2)
            ];

            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks
            };

            render(<CanvasArea {...mockProps} selectedStep={step} />);

            // Deve ter sido chamado apenas com blocos raiz (sem parentId)
            expect(mockUseVirtualBlocks).toHaveBeenCalledWith(
                expect.objectContaining({
                    blocks: expect.arrayContaining([
                        expect.objectContaining({ id: 'block-1' }),
                        expect.objectContaining({ id: 'block-3' }),
                        expect.objectContaining({ id: 'block-5' })
                    ])
                })
            );

            // Não deve incluir blocos filhos
            const calledBlocks = mockUseVirtualBlocks.mock.calls[0][0].blocks;
            expect(calledBlocks).toHaveLength(3);
            expect(calledBlocks.find((b: BlockComponent) => b.id === 'block-2')).toBeUndefined();
            expect(calledBlocks.find((b: BlockComponent) => b.id === 'block-4')).toBeUndefined();
        });

        it('TC-H011: deve ordenar rootBlocks por propriedade order', () => {
            const blocks: BlockComponent[] = [
                createBlock('block-c', null, 2),
                createBlock('block-a', null, 0),
                createBlock('block-b', null, 1)
            ];

            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks
            };

            render(<CanvasArea {...mockProps} selectedStep={step} />);

            const calledBlocks = mockUseVirtualBlocks.mock.calls[0][0].blocks;
            expect(calledBlocks[0].id).toBe('block-a');
            expect(calledBlocks[1].id).toBe('block-b');
            expect(calledBlocks[2].id).toBe('block-c');
        });
    });

    describe('🎨 Rendering Behavior', () => {
        it('TC-H012: deve renderizar badge de virtualização quando ativa', () => {
            mockUseVirtualBlocks.mockReturnValue({
                visible: createBlocks(20),
                topSpacer: 0,
                bottomSpacer: 0,
                total: 100,
                scrollTop: 0,
                setScrollTop: vi.fn(),
                containerRef: { current: null }
            });

            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: createBlocks(100)
            };

            render(<CanvasArea {...mockProps} selectedStep={step} />);

            expect(screen.getByText(/Virtualização ativa/)).toBeInTheDocument();
            expect(screen.getByText(/100 blocos/)).toBeInTheDocument();
            expect(screen.getByText(/exibindo 20/)).toBeInTheDocument();
        });

        it('TC-H013: não deve renderizar badge quando virtualização está desabilitada', () => {
            mockUseVirtualBlocks.mockReturnValue({
                visible: createBlocks(30),
                topSpacer: 0,
                bottomSpacer: 0,
                total: 30,
                scrollTop: 0,
                setScrollTop: vi.fn(),
                containerRef: { current: null }
            });

            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: createBlocks(30)
            };

            render(<CanvasArea {...mockProps} selectedStep={step} />);

            expect(screen.queryByText(/Virtualização ativa/)).not.toBeInTheDocument();
        });

        it('TC-H014: deve renderizar topSpacer quando > 0', () => {
            mockUseVirtualBlocks.mockReturnValue({
                visible: createBlocks(20),
                topSpacer: 2800,
                bottomSpacer: 0,
                total: 100,
                scrollTop: 2000,
                setScrollTop: vi.fn(),
                containerRef: { current: null }
            });

            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: createBlocks(100)
            };

            const { container } = render(<CanvasArea {...mockProps} selectedStep={step} />);

            const spacer = container.querySelector('div[style*="height: 2800"]');
            expect(spacer).toBeInTheDocument();
        });

        it('TC-H015: deve renderizar bottomSpacer quando > 0', () => {
            mockUseVirtualBlocks.mockReturnValue({
                visible: createBlocks(20),
                topSpacer: 0,
                bottomSpacer: 5600,
                total: 100,
                scrollTop: 0,
                setScrollTop: vi.fn(),
                containerRef: { current: null }
            });

            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: createBlocks(100)
            };

            const { container } = render(<CanvasArea {...mockProps} selectedStep={step} />);

            const spacer = container.querySelector('div[style*="height: 5600"]');
            expect(spacer).toBeInTheDocument();
        });

        it('TC-H016: deve renderizar apenas blocos visíveis retornados pelo hook', () => {
            const allBlocks = createBlocks(100);
            const visibleBlocks = allBlocks.slice(10, 30); // 20 blocos visíveis

            mockUseVirtualBlocks.mockReturnValue({
                visible: visibleBlocks,
                topSpacer: 1400,
                bottomSpacer: 9800,
                total: 100,
                scrollTop: 1500,
                setScrollTop: vi.fn(),
                containerRef: { current: null }
            });

            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: allBlocks
            };

            render(<CanvasArea {...mockProps} selectedStep={step} />);

            // Deve renderizar apenas os 20 blocos visíveis
            visibleBlocks.forEach(block => {
                expect(screen.getByTestId(`block-${block.id}`)).toBeInTheDocument();
            });

            // Não deve renderizar blocos fora da janela visível
            expect(screen.queryByTestId('block-block-0')).not.toBeInTheDocument();
            expect(screen.queryByTestId('block-block-99')).not.toBeInTheDocument();
        });
    });

    describe('🔄 Re-render Scenarios', () => {
        it('TC-H017: deve re-renderizar corretamente ao mudar de step', () => {
            const step1: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: createBlocks(50)
            };

            const step2: EditableQuizStep = {
                id: 'step-2',
                order: 1,
                type: 'question',
                blocks: createBlocks(80)
            };

            const { rerender } = render(<CanvasArea {...mockProps} selectedStep={step1} />);

            expect(mockUseVirtualBlocks).toHaveBeenLastCalledWith(
                expect.objectContaining({ blocks: expect.any(Array) })
            );

            rerender(<CanvasArea {...mockProps} selectedStep={step2} />);

            // Deve ter sido chamado novamente com novos blocos
            expect(mockUseVirtualBlocks).toHaveBeenCalledTimes(2);
        });

        it('TC-H018: deve lidar com mudança de blocos no mesmo step', () => {
            const initialBlocks = createBlocks(30);
            const updatedBlocks = [...initialBlocks, createBlock('new-block', null, 30)];

            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: initialBlocks
            };

            const { rerender } = render(<CanvasArea {...mockProps} selectedStep={step} />);

            const updatedStep = { ...step, blocks: updatedBlocks };
            rerender(<CanvasArea {...mockProps} selectedStep={updatedStep} />);

            // Hook deve ser chamado com novos blocos
            expect(mockUseVirtualBlocks).toHaveBeenCalledTimes(2);
            const lastCall = mockUseVirtualBlocks.mock.calls[1][0];
            expect(lastCall.blocks).toHaveLength(31);
        });

        it('TC-H019: deve lidar com remoção de blocos', () => {
            const blocks = createBlocks(100);
            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks
            };

            const { rerender } = render(<CanvasArea {...mockProps} selectedStep={step} />);

            const updatedBlocks = blocks.slice(0, 50);
            const updatedStep = { ...step, blocks: updatedBlocks };
            rerender(<CanvasArea {...mockProps} selectedStep={updatedStep} />);

            const lastCall = mockUseVirtualBlocks.mock.calls[1][0];
            expect(lastCall.blocks).toHaveLength(50);
        });

        it('TC-H020: deve lidar com troca rápida entre tabs', async () => {
            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: createBlocks(100)
            };

            const { rerender } = render(
                <CanvasArea {...mockProps} selectedStep={step} activeTab="canvas" />
            );

            rerender(
                <CanvasArea {...mockProps} selectedStep={step} activeTab="preview" />
            );

            rerender(
                <CanvasArea {...mockProps} selectedStep={step} activeTab="canvas" />
            );

            // Hook deve ser chamado consistentemente
            expect(mockUseVirtualBlocks).toHaveBeenCalledTimes(3);
        });
    });

    describe('🛡️ Edge Cases', () => {
        it('TC-H021: deve lidar com step sem propriedade blocks', () => {
            const invalidStep = {
                id: 'step-invalid',
                order: 0,
                type: 'question'
                // blocks ausente
            } as any;

            expect(() => {
                render(<CanvasArea {...mockProps} selectedStep={invalidStep} />);
            }).not.toThrow();
        });

        it('TC-H022: deve lidar com blocks null ou undefined', () => {
            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: null as any
            };

            expect(() => {
                render(<CanvasArea {...mockProps} selectedStep={step} />);
            }).not.toThrow();
        });

        it('TC-H023: deve lidar com blocks sem parentId definido', () => {
            const blocks = [
                { id: 'block-1', type: 'heading', order: 0 } as any,
                { id: 'block-2', type: 'text', order: 1 } as any
            ];

            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks
            };

            render(<CanvasArea {...mockProps} selectedStep={step} />);

            // Todos os blocos sem parentId devem ser considerados raiz
            const calledBlocks = mockUseVirtualBlocks.mock.calls[0][0].blocks;
            expect(calledBlocks).toHaveLength(2);
        });

        it('TC-H024: deve lidar com ordem de blocos inconsistente', () => {
            const blocks: BlockComponent[] = [
                createBlock('block-1', null, 5),
                createBlock('block-2', null, 2),
                createBlock('block-3', null, 8),
                createBlock('block-4', null, 1)
            ];

            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks
            };

            render(<CanvasArea {...mockProps} selectedStep={step} />);

            // Deve ordenar corretamente
            const calledBlocks = mockUseVirtualBlocks.mock.calls[0][0].blocks;
            expect(calledBlocks[0].order).toBe(1);
            expect(calledBlocks[1].order).toBe(2);
            expect(calledBlocks[2].order).toBe(5);
            expect(calledBlocks[3].order).toBe(8);
        });

        it('TC-H025: deve lidar com threshold exato de 60 blocos', () => {
            const step: EditableQuizStep = {
                id: 'step-1',
                order: 0,
                type: 'question',
                blocks: createBlocks(60)
            };

            render(<CanvasArea {...mockProps} selectedStep={step} />);

            // Exatamente 60 blocos deve HABILITAR virtualização
            expect(mockUseVirtualBlocks).toHaveBeenCalledWith(
                expect.objectContaining({ enabled: true })
            );
        });
    });
});

// ==================== HELPER FUNCTIONS ====================

function createBlock(
    id: string,
    parentId: string | null,
    order: number
): BlockComponent {
    return {
        id,
        type: 'heading',
        parentId,
        order,
        properties: {},
        content: {}
    };
}

function createBlocks(count: number): BlockComponent[] {
    return Array.from({ length: count }, (_, i) => createBlock(
        `block-${i}`,
        null,
        i
    ));
}
