/**
 * 🔍 TESTE REAL: PropertiesColumn Component
 * 
 * Testa o componente REAL que é usado no /editor
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

// ⚠️ IMPORTANTE: Testar o componente REAL usado no editor
import PropertiesColumn from '@/components/editor/quiz/QuizModularEditor/components/PropertiesColumn';

// Mock dos componentes UI para evitar erros de renderização
vi.mock('@/components/ui/card', () => ({
    Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>
}));

vi.mock('@/components/ui/separator', () => ({
    Separator: () => <hr data-testid="separator" />
}));

vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>{children}</button>
    )
}));

vi.mock('@/components/ui/label', () => ({
    Label: ({ children, ...props }: any) => <label {...props}>{children}</label>
}));

vi.mock('@/components/ui/badge', () => ({
    Badge: ({ children, ...props }: any) => <span data-testid="badge" {...props}>{children}</span>
}));

vi.mock('@/components/ui/collapsible', () => ({
    Collapsible: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CollapsibleContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CollapsibleTrigger: ({ children, ...props }: any) => <div {...props}>{children}</div>
}));

vi.mock('@/components/ui/tooltip', () => ({
    TooltipProvider: ({ children }: any) => <>{children}</>,
    Tooltip: ({ children }: any) => <>{children}</>,
    TooltipTrigger: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    TooltipContent: ({ children, ...props }: any) => <div {...props}>{children}</div>
}));

vi.mock('@/components/editor/DynamicPropertyControls', () => ({
    DynamicPropertyControls: () => <div data-testid="dynamic-property-controls">Property Controls</div>
}));

vi.mock('@/core/schema/SchemaInterpreter', () => ({
    schemaInterpreter: {
        getBlockSchema: vi.fn(() => ({
            type: 'object',
            properties: {
                text: { type: 'string', label: 'Text', default: '' }
            }
        }))
    }
}));

vi.mock('@/lib/utils/editorEventBus', () => ({
    onBlockUpdate: vi.fn(() => vi.fn())
}));

vi.mock('@/core/adapters/BlockDataNormalizer', () => ({
    normalizeBlockData: vi.fn((block) => block),
    createSynchronizedBlockUpdate: vi.fn((block, props) => ({ properties: props })),
    normalizerLogger: {
        debug: vi.fn()
    }
}));

describe('🔍 PropertiesColumn - Componente REAL usado no /editor', () => {
    const mockBlocks = [
        {
            id: 'block-1',
            type: 'text',
            properties: { text: 'Hello World' },
            content: { text: 'Hello World' }
        },
        {
            id: 'block-2',
            type: 'heading',
            properties: { text: 'Title', level: 1 },
            content: { text: 'Title' }
        }
    ];

    it('❌ DEVE renderizar "Nenhum bloco disponível" quando selectedBlock é undefined', () => {
        const { container } = render(
            <PropertiesColumn
                selectedBlock={undefined}
                onBlockUpdate={vi.fn()}
                onClearSelection={vi.fn()}
                blocks={[]}
                onBlockSelect={vi.fn()}
            />
        );

        // Verificar se mostra mensagem
        expect(container.textContent).toContain('Nenhum bloco disponível');
    });

    it('✅ DEVE renderizar propriedades quando selectedBlock existe', async () => {
        const selectedBlock = mockBlocks[0];
        const mockOnBlockUpdate = vi.fn();
        const mockOnClearSelection = vi.fn();

        const { container } = render(
            <PropertiesColumn
                selectedBlock={selectedBlock}
                onBlockUpdate={mockOnBlockUpdate}
                onClearSelection={mockOnClearSelection}
                blocks={mockBlocks}
            />
        );

        // Verificar se header aparece
        await waitFor(() => {
            expect(container.textContent).toContain('Propriedades');
        });

        // Verificar se mostra o tipo do bloco
        expect(screen.getAllByTestId('badge')[0].textContent).toBe('text');

        // Verificar se mostra o ID do bloco
        expect(container.textContent).toContain('block-1');
    });

    it('⚠️ DEVE auto-selecionar primeiro bloco se selectedBlock é undefined mas há blocos', async () => {
        const mockOnBlockSelect = vi.fn();

        render(
            <PropertiesColumn
                selectedBlock={undefined}
                onBlockUpdate={vi.fn()}
                onClearSelection={vi.fn()}
                blocks={mockBlocks}
                onBlockSelect={mockOnBlockSelect}
            />
        );

        // Verificar se tentou auto-selecionar
        await waitFor(() => {
            expect(mockOnBlockSelect).toHaveBeenCalledWith('block-1');
        }, { timeout: 100 });
    });

    it('🔍 DEVE logar props recebidas (debug)', () => {
        const consoleSpy = vi.spyOn(console, 'log');

        render(
            <PropertiesColumn
                selectedBlock={mockBlocks[0]}
                onBlockUpdate={vi.fn()}
                onClearSelection={vi.fn()}
                blocks={mockBlocks}
                onBlockSelect={vi.fn()}
            />
        );

        // Verificar se logs de debug foram chamados
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('[PropertiesColumn] Props recebidas'),
            expect.any(Object)
        );

        consoleSpy.mockRestore();
    });

    it('❌ PROBLEMA REAL: selectedBlock undefined mesmo com blocks disponíveis', () => {
        console.log('=== SIMULANDO SITUAÇÃO REAL DO EDITOR ===');

        // Simular QuizModularEditor passando undefined
        const blocks = mockBlocks;
        const selectedBlockId = 'block-1';
        const selectedBlock = blocks.find(b => b.id === selectedBlockId);

        console.log('📊 Estado simulado:', {
            blocksCount: blocks.length,
            selectedBlockId,
            selectedBlockFound: selectedBlock,
            willRenderPanel: !!selectedBlock
        });

        // ✅ Se find() encontrar, selectedBlock existe
        if (selectedBlock) {
            const { container } = render(
                <PropertiesColumn
                    selectedBlock={selectedBlock}
                    onBlockUpdate={vi.fn()}
                    onClearSelection={vi.fn()}
                    blocks={blocks}
                />
            );

            expect(container.textContent).toContain('Propriedades');
            console.log('✅ Painel renderizado corretamente');
        }

        // ❌ Se find() NÃO encontrar, selectedBlock é undefined
        const wrongSelectedBlock = blocks.find(b => b.id === 'block-999');

        if (!wrongSelectedBlock) {
            const { container } = render(
                <PropertiesColumn
                    selectedBlock={wrongSelectedBlock}
                    onBlockUpdate={vi.fn()}
                    onClearSelection={vi.fn()}
                    blocks={blocks}
                />
            );

            expect(container.textContent).toContain('Nenhum bloco disponível');
            console.log('❌ Painel mostra mensagem de erro');
        }

        console.log('=== CONCLUSÃO: O problema está no blocks.find() ===');
    });
});
