/**
 * 🧪 TESTE INTEGRAÇÃO: PropertiesColumn → DynamicPropertyControls (Contexto QuizModularEditor)
 * 
 * Valida que o bug do toggle booleano (false sendo substituído por default true)
 * foi corrigido no contexto real do PropertiesColumn usado pelo QuizModularEditor.
 * 
 * CENÁRIO REAL:
 * 1. Bloco carregado do Supabase com propriedade booleana = false
 * 2. PropertiesColumn renderiza DynamicPropertyControls para o bloco selecionado
 * 3. Toggle deve mostrar DESLIGADO (false), não LIGADO (default true)
 * 4. Ao alternar toggle, deve salvar novo valor corretamente
 * 
 * Este teste foca no componente PropertiesColumn (que é usado pelo QuizModularEditor)
 * sem precisar renderizar o editor completo (2153 linhas).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import PropertiesColumn from '../components/PropertiesColumn';
import type { Block } from '@/types/editor';

// Mock do schemaInterpreter com schema realista
vi.mock('@/core/schema/SchemaInterpreter', () => ({
    schemaInterpreter: {
        getElementSchema: vi.fn((type: string) => {
            if (type === 'headline-simple') {
                return {
                    key: 'headline-simple',
                    label: 'Headline Simples',
                    category: 'presentation',
                    icon: 'Type',
                    schema: {
                        type: 'object',
                        properties: {
                            text: { type: 'string', default: 'Digite seu título' },
                            showSubtitle: {
                                type: 'boolean',
                                default: true, // ⚠️ DEFAULT TRUE - mas bloco tem FALSE
                                description: 'Mostrar subtítulo'
                            },
                            subtitle: { type: 'string', default: 'Subtítulo opcional' }
                        },
                        required: ['text']
                    },
                    propertyControls: [
                        {
                            key: 'text',
                            label: 'Texto do Título',
                            type: 'text'
                        },
                        {
                            key: 'showSubtitle',
                            label: 'Mostrar Subtítulo',
                            type: 'toggle' // 🎯 TOGGLE BOOLEANO
                        },
                        {
                            key: 'subtitle',
                            label: 'Texto do Subtítulo',
                            type: 'text'
                        }
                    ]
                };
            }
            return null;
        }),
        getBlockSchema: vi.fn(),
        getComputedSchema: vi.fn(),
        isSchemaLoaded: vi.fn(() => true)
    }
}));

// Mock do BlockDataNormalizer
vi.mock('@/core/adapters/BlockDataNormalizer', () => ({
    normalizeBlockData: vi.fn((block: Block) => block),
    createSynchronizedBlockUpdate: vi.fn((blockId: string, updates: Partial<Block>) => updates),
    normalizerLogger: {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    }
}));

// Mock do editorEventBus
vi.mock('@/lib/utils/editorEventBus', () => ({
    onBlockUpdate: vi.fn(() => vi.fn()) // Retorna função de cleanup
}));

// Mock do appLogger
vi.mock('@/lib/utils/appLogger', () => ({
    appLogger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    }
}));

// Mock do toast
vi.mock('@/components/ui/use-toast', () => ({
    toast: vi.fn()
}));

describe('PropertiesColumn - Boolean Toggle Bug Fix (QuizModularEditor Context)', () => {
    const mockOnBlockUpdate = vi.fn();
    const mockOnClearSelection = vi.fn();
    const mockOnBlockSelect = vi.fn();

    // Bloco simulando dados do Supabase com showSubtitle = FALSE
    const blockWithFalseBoolean: Block = {
        id: 'block-headline-1',
        type: 'headline-simple',
        stepId: 'step-1',
        order: 0,
        properties: {
            text: 'Meu Título',
            showSubtitle: false, // ❌ VALOR FALSE (mas schema default é true)
            subtitle: 'Subtítulo oculto'
        }
    } as any;

    // Bloco sem showSubtitle definido (deve usar default: true)
    const blockWithoutBoolean: Block = {
        id: 'block-headline-2',
        type: 'headline-simple',
        stepId: 'step-1',
        order: 0,
        properties: {
            text: 'Título sem showSubtitle',
            subtitle: 'Subtítulo padrão'
        }
    } as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve respeitar valor booleano false no toggle mesmo com schema default true', async () => {
        render(
            <PropertiesColumn
                selectedBlock={blockWithFalseBoolean}
                blocks={[blockWithFalseBoolean]}
                onBlockUpdate={mockOnBlockUpdate}
                onClearSelection={mockOnClearSelection}
                onBlockSelect={mockOnBlockSelect}
            />
        );

        // Aguarda DynamicPropertyControls renderizar
        await waitFor(() => {
            expect(screen.getByText(/Mostrar Subtítulo/i)).toBeInTheDocument();
        });

        // 🎯 VALIDAÇÃO CRÍTICA: Toggle deve estar DESLIGADO (false)
        // mesmo que o schema tenha default: true
        const toggleSwitch = screen.getByRole('switch', { name: /Mostrar Subtítulo/i });
        expect(toggleSwitch).not.toBeChecked(); // ✅ FALSE deve prevalecer sobre default

        // Valida aria-checked explicitamente
        expect(toggleSwitch).toHaveAttribute('aria-checked', 'false');
    });

    it('deve usar schema default true quando valor booleano não está definido', async () => {
        render(
            <PropertiesColumn
                selectedBlock={blockWithoutBoolean}
                blocks={[blockWithoutBoolean]}
                onBlockUpdate={mockOnBlockUpdate}
                onClearSelection={mockOnClearSelection}
                onBlockSelect={mockOnBlockSelect}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Mostrar Subtítulo/i)).toBeInTheDocument();
        });

        // Quando showSubtitle não está definido, deve usar schema default: true
        const toggleSwitch = screen.getByRole('switch', { name: /Mostrar Subtítulo/i });
        expect(toggleSwitch).toBeChecked(); // ✅ DEFAULT TRUE aplicado
        expect(toggleSwitch).toHaveAttribute('aria-checked', 'true');
    });

    it('deve permitir alternar toggle de false para true', async () => {
        const user = userEvent.setup();

        render(
            <PropertiesColumn
                selectedBlock={blockWithFalseBoolean}
                blocks={[blockWithFalseBoolean]}
                onBlockUpdate={mockOnBlockUpdate}
                onClearSelection={mockOnClearSelection}
                onBlockSelect={mockOnBlockSelect}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Mostrar Subtítulo/i)).toBeInTheDocument();
        });

        const toggleSwitch = screen.getByRole('switch', { name: /Mostrar Subtítulo/i });

        // Estado inicial: false
        expect(toggleSwitch).not.toBeChecked();

        // Clica para ligar (false → true)
        await user.click(toggleSwitch);

        // DynamicPropertyControls chama onChange imediatamente
        // PropertiesColumn atualiza editedProperties mas não salva ainda
        await waitFor(() => {
            expect(toggleSwitch).toBeChecked();
        });
    });

    it('deve persistir mudança de toggle após clicar em Salvar', async () => {
        const user = userEvent.setup();

        render(
            <PropertiesColumn
                selectedBlock={blockWithFalseBoolean}
                blocks={[blockWithFalseBoolean]}
                onBlockUpdate={mockOnBlockUpdate}
                onClearSelection={mockOnClearSelection}
                onBlockSelect={mockOnBlockSelect}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Mostrar Subtítulo/i)).toBeInTheDocument();
        });

        const toggleSwitch = screen.getByRole('switch', { name: /Mostrar Subtítulo/i });

        // Alterna toggle (false → true)
        await user.click(toggleSwitch);

        // Botão Salvar deve aparecer quando há mudanças
        const saveButton = await screen.findByText(/Salvar/i);
        expect(saveButton).toBeInTheDocument();

        // Clica em Salvar
        await user.click(saveButton);

        // Valida que onBlockUpdate foi chamado com showSubtitle: true
        await waitFor(() => {
            expect(mockOnBlockUpdate).toHaveBeenCalledWith(
                'block-headline-1',
                expect.objectContaining({
                    properties: expect.objectContaining({
                        showSubtitle: true
                    })
                })
            );
        });
    });

    it('deve resetar toggle para valor original ao clicar em Resetar', async () => {
        const user = userEvent.setup();

        render(
            <PropertiesColumn
                selectedBlock={blockWithFalseBoolean}
                blocks={[blockWithFalseBoolean]}
                onBlockUpdate={mockOnBlockUpdate}
                onClearSelection={mockOnClearSelection}
                onBlockSelect={mockOnBlockSelect}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Mostrar Subtítulo/i)).toBeInTheDocument();
        });

        const toggleSwitch = screen.getByRole('switch', { name: /Mostrar Subtítulo/i });

        // Estado inicial: false
        expect(toggleSwitch).not.toBeChecked();

        // Alterna para true
        await user.click(toggleSwitch);
        expect(toggleSwitch).toBeChecked();

        // Clica em Resetar
        const resetButton = await screen.findByRole('button', { name: /resetar/i });
        await user.click(resetButton);

        // Toggle deve voltar para false (valor original)
        await waitFor(() => {
            expect(toggleSwitch).not.toBeChecked();
        });

        // onBlockUpdate NÃO deve ter sido chamado (apenas reset local)
        expect(mockOnBlockUpdate).not.toHaveBeenCalled();
    });
});