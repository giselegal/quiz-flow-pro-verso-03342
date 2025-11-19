/**
 * 🧪 TESTES DE INTEGRAÇÃO: Edição NOCODE no Painel de Propriedades
 * 
 * Testa o fluxo completo de edição visual (sem código) usando o PropertiesColumn
 * Simula ações reais do usuário no /editor
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import type { Block } from '@/types/editor';

// Componentes reais
import PropertiesColumn from '@/components/editor/quiz/QuizModularEditor/components/PropertiesColumn';
import { DynamicPropertyControls } from '@/components/editor/DynamicPropertyControls';

// Mocks UI
vi.mock('@/components/ui/card', () => ({
    Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>
}));

vi.mock('@/components/ui/separator', () => ({
    Separator: () => <hr data-testid="separator" />
}));

vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, disabled, ...props }: any) => (
        <button onClick={onClick} disabled={disabled} data-testid="button" {...props}>
            {children}
        </button>
    )
}));

vi.mock('@/components/ui/label', () => ({
    Label: ({ children, ...props }: any) => <label {...props}>{children}</label>
}));

vi.mock('@/components/ui/badge', () => ({
    Badge: ({ children, ...props }: any) => <span data-testid="badge" {...props}>{children}</span>
}));

vi.mock('@/components/ui/input', () => ({
    Input: ({ value, onChange, ...props }: any) => (
        <input
            value={value}
            onChange={onChange}
            data-testid="input"
            {...props}
        />
    )
}));

vi.mock('@/components/ui/textarea', () => ({
    Textarea: ({ value, onChange, ...props }: any) => (
        <textarea
            value={value}
            onChange={onChange}
            data-testid="textarea"
            {...props}
        />
    )
}));

vi.mock('@/components/ui/switch', () => ({
    Switch: ({ checked, onCheckedChange, ...props }: any) => (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            data-testid="switch"
            {...props}
        />
    )
}));

vi.mock('@/components/ui/slider', () => ({
    Slider: ({ value, onValueChange, min, max, ...props }: any) => (
        <input
            type="range"
            value={value?.[0] || 0}
            onChange={(e) => onValueChange?.([Number(e.target.value)])}
            min={min}
            max={max}
            data-testid="slider"
            {...props}
        />
    )
}));

vi.mock('@/components/ui/select', () => ({
    Select: ({ children, value, onValueChange }: any) => (
        <select
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            data-testid="select"
        >
            {children}
        </select>
    ),
    SelectTrigger: ({ children }: any) => <>{children}</>,
    SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>
}));

vi.mock('@/components/ui/collapsible', () => ({
    Collapsible: ({ children, open }: any) => <div data-open={open}>{children}</div>,
    CollapsibleContent: ({ children }: any) => <div>{children}</div>,
    CollapsibleTrigger: ({ children, onClick }: any) => <div onClick={onClick}>{children}</div>
}));

vi.mock('@/components/ui/tooltip', () => ({
    TooltipProvider: ({ children }: any) => <>{children}</>,
    Tooltip: ({ children }: any) => <>{children}</>,
    TooltipTrigger: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    TooltipContent: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/lib/utils/editorEventBus', () => ({
    onBlockUpdate: vi.fn(() => vi.fn())
}));

vi.mock('@/core/adapters/BlockDataNormalizer', () => ({
    normalizeBlockData: vi.fn((block) => block),
    createSynchronizedBlockUpdate: vi.fn((block, props) => ({ properties: props, content: props })),
    normalizerLogger: {
        debug: vi.fn()
    }
}));

// Mock do SchemaInterpreter com schemas reais
const mockSchemas: Record<string, any> = {
    'text': {
        type: 'object',
        properties: {
            text: {
                type: 'string',
                label: 'Texto',
                control: 'textarea',
                default: ''
            },
            fontSize: {
                type: 'number',
                label: 'Tamanho da Fonte',
                control: 'range',
                default: 16,
                validation: { min: 12, max: 32, step: 1 }
            }
        }
    },
    'heading': {
        type: 'object',
        properties: {
            text: {
                type: 'string',
                label: 'Título',
                control: 'text',
                default: ''
            },
            level: {
                type: 'number',
                label: 'Nível',
                control: 'dropdown',
                default: 1,
                options: [
                    { value: 1, label: 'H1' },
                    { value: 2, label: 'H2' },
                    { value: 3, label: 'H3' }
                ]
            }
        }
    },
    'button': {
        type: 'object',
        properties: {
            text: {
                type: 'string',
                label: 'Texto do Botão',
                control: 'text',
                default: 'Clique aqui'
            },
            enabled: {
                type: 'boolean',
                label: 'Habilitado',
                control: 'toggle',
                default: true
            },
            color: {
                type: 'string',
                label: 'Cor',
                control: 'color-picker',
                default: '#0000ff'
            }
        }
    }
};

vi.mock('@/core/schema/SchemaInterpreter', () => ({
    schemaInterpreter: {
        getBlockSchema: vi.fn((type: string) => mockSchemas[type] || null)
    }
}));

describe('🧪 Edição NOCODE - Fluxo Completo no Painel de Propriedades', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
        vi.clearAllMocks();
    });

    describe('✏️ Edição de Texto', () => {
        it('DEVE editar texto em um campo de texto simples', async () => {
            const block: Block = {
                id: 'text-1',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'Título Original', level: 1 },
                content: { text: 'Título Original' }
            };

            const mockOnBlockUpdate = vi.fn();
            const mockOnClearSelection = vi.fn();

            render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={mockOnBlockUpdate}
                    onClearSelection={mockOnClearSelection}
                    blocks={[block]}
                />
            );

            // Encontrar o input de texto
            const textInputs = screen.getAllByTestId('input');
            const textInput = textInputs.find(input =>
                (input as HTMLInputElement).value === 'Título Original'
            );

            expect(textInput).toBeDefined();

            // Editar o texto
            await user.clear(textInput!);
            await user.type(textInput!, 'Novo Título Editado');

            // Verificar que o campo foi atualizado
            await waitFor(() => {
                expect((textInput as HTMLInputElement).value).toBe('Novo Título Editado');
            });

            // Clicar no botão Salvar
            const saveButtons = screen.getAllByTestId('button');
            const saveButton = saveButtons.find(btn =>
                btn.textContent?.includes('Salvar')
            );

            await user.click(saveButton!);

            // Verificar que onBlockUpdate foi chamado
            await waitFor(() => {
                expect(mockOnBlockUpdate).toHaveBeenCalledWith(
                    'text-1',
                    expect.objectContaining({
                        properties: expect.objectContaining({
                            text: 'Novo Título Editado'
                        })
                    })
                );
            });
        });

        it('DEVE editar texto em textarea (campo de texto longo)', async () => {
            const block: Block = {
                id: 'text-2',
                type: 'text' as any,
                order: 0,
                properties: { text: 'Parágrafo original', fontSize: 16 },
                content: { text: 'Parágrafo original' }
            };

            const mockOnBlockUpdate = vi.fn();

            render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={mockOnBlockUpdate}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Encontrar textarea
            const textarea = screen.getByTestId('textarea');
            expect(textarea).toBeDefined();
            expect((textarea as HTMLTextAreaElement).value).toBe('Parágrafo original');

            // Editar
            await user.clear(textarea);
            await user.type(textarea, 'Texto muito longo editado\nCom múltiplas linhas');

            // Salvar
            const saveButton = screen.getAllByTestId('button').find(btn =>
                btn.textContent?.includes('Salvar')
            );
            await user.click(saveButton!);

            // Verificar
            await waitFor(() => {
                expect(mockOnBlockUpdate).toHaveBeenCalled();
                const callArgs = mockOnBlockUpdate.mock.calls[0];
                expect(callArgs[1].properties.text).toContain('Texto muito longo editado');
            });
        });
    });

    describe('🔢 Edição de Números', () => {
        it('DEVE editar número usando slider (range)', async () => {
            const block: Block = {
                id: 'text-3',
                type: 'text' as any,
                order: 0,
                properties: { text: 'Texto', fontSize: 16 },
                content: { text: 'Texto' }
            };

            const mockOnBlockUpdate = vi.fn();

            render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={mockOnBlockUpdate}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Encontrar slider
            const slider = screen.getByTestId('slider');
            expect(slider).toBeDefined();
            expect((slider as HTMLInputElement).value).toBe('16');

            // Mover slider para 24
            fireEvent.change(slider, { target: { value: '24' } });

            await waitFor(() => {
                expect((slider as HTMLInputElement).value).toBe('24');
            });

            // Salvar
            const saveButton = screen.getAllByTestId('button').find(btn =>
                btn.textContent?.includes('Salvar')
            );
            await user.click(saveButton!);

            // Verificar
            await waitFor(() => {
                expect(mockOnBlockUpdate).toHaveBeenCalledWith(
                    'text-3',
                    expect.objectContaining({
                        properties: expect.objectContaining({
                            fontSize: 24
                        })
                    })
                );
            });
        });

        it('DEVE editar número usando dropdown (select)', async () => {
            const block: Block = {
                id: 'heading-1',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'Título', level: 1 },
                content: { text: 'Título' }
            };

            const mockOnBlockUpdate = vi.fn();

            render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={mockOnBlockUpdate}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Encontrar select
            const select = screen.getByTestId('select');
            expect(select).toBeDefined();
            expect((select as HTMLSelectElement).value).toBe('1');

            // Mudar para H2
            await user.selectOptions(select, '2');

            await waitFor(() => {
                expect((select as HTMLSelectElement).value).toBe('2');
            });

            // Salvar
            const saveButton = screen.getAllByTestId('button').find(btn =>
                btn.textContent?.includes('Salvar')
            );
            await user.click(saveButton!);

            // Verificar
            await waitFor(() => {
                expect(mockOnBlockUpdate).toHaveBeenCalledWith(
                    'heading-1',
                    expect.objectContaining({
                        properties: expect.objectContaining({
                            level: 2
                        })
                    })
                );
            });
        });
    });

    describe('🎨 Edição de Outras Propriedades', () => {
        it('DEVE renderizar toggle (switch) com valor inicial correto', async () => {
            const block: Block = {
                id: 'button-1',
                type: 'button' as any,
                order: 0,
                properties: { text: 'Botão', enabled: true, color: '#0000ff' },
                content: { text: 'Botão' }
            };

            render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={vi.fn()}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Verificar que switch está renderizado com valor correto
            const switchInput = screen.getByTestId('switch');
            expect(switchInput).toBeDefined();
            expect((switchInput as HTMLInputElement).checked).toBe(true);
            expect((switchInput as HTMLInputElement).type).toBe('checkbox');
        }); it('DEVE editar cor usando color picker', async () => {
            const block: Block = {
                id: 'button-2',
                type: 'button' as any,
                order: 0,
                properties: { text: 'Botão', enabled: true, color: '#0000ff' },
                content: { text: 'Botão' }
            };

            const mockOnBlockUpdate = vi.fn();

            render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={mockOnBlockUpdate}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Encontrar color input
            const inputs = screen.getAllByTestId('input');
            const colorInput = inputs.find(input =>
                (input as HTMLInputElement).type === 'color'
            );

            expect(colorInput).toBeDefined();
            expect((colorInput as HTMLInputElement).value).toBe('#0000ff');

            // Mudar cor
            fireEvent.change(colorInput!, { target: { value: '#ff0000' } });

            await waitFor(() => {
                expect((colorInput as HTMLInputElement).value).toBe('#ff0000');
            });

            // Salvar
            const saveButton = screen.getAllByTestId('button').find(btn =>
                btn.textContent?.includes('Salvar')
            );
            await user.click(saveButton!);

            // Verificar
            await waitFor(() => {
                expect(mockOnBlockUpdate).toHaveBeenCalledWith(
                    'button-2',
                    expect.objectContaining({
                        properties: expect.objectContaining({
                            color: '#ff0000'
                        })
                    })
                );
            });
        });
    });

    describe('💾 Fluxo de Salvamento', () => {

        it('DEVE desabilitar botão Salvar após salvar', async () => {
            const block: Block = {
                id: 'text-5',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'Título', level: 1 },
                content: { text: 'Título' }
            };

            const mockOnBlockUpdate = vi.fn();

            render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={mockOnBlockUpdate}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Editar
            const textInput = screen.getAllByTestId('input')[0];
            await user.type(textInput, ' Novo');

            // Salvar
            const saveButton = screen.getAllByTestId('button').find(btn =>
                btn.textContent?.includes('Salvar')
            );
            await user.click(saveButton!);

            // Verificar que salvou
            await waitFor(() => {
                expect(mockOnBlockUpdate).toHaveBeenCalled();
            });

            // Botão deve voltar a estar desabilitado
            await waitFor(() => {
                expect((saveButton as HTMLButtonElement).disabled).toBe(true);
            });
        });

        it('DEVE mostrar indicador de mudanças não salvas (isDirty)', async () => {
            const block: Block = {
                id: 'text-6',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'Título', level: 1 },
                content: { text: 'Título' }
            };

            const { container } = render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={vi.fn()}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Sem mudanças inicialmente
            expect(container.textContent).not.toContain('Alterações não salvas');

            // Editar
            const textInput = screen.getAllByTestId('input')[0];
            await user.type(textInput, ' Edit');

            // Deve mostrar indicador
            await waitFor(() => {
                expect(container.textContent).toContain('Alterações não salvas');
            });
        });
    });

    describe('🔄 Reset de Mudanças', () => {
        it('DEVE resetar mudanças ao clicar no botão Reset', async () => {
            const block: Block = {
                id: 'text-7',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'Título Original', level: 1 },
                content: { text: 'Título Original' }
            };

            render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={vi.fn()}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            const textInput = screen.getAllByTestId('input')[0];

            // Editar
            await user.clear(textInput);
            await user.type(textInput, 'Texto Modificado');

            await waitFor(() => {
                expect((textInput as HTMLInputElement).value).toBe('Texto Modificado');
            });

            // Clicar em Reset (botão com ícone de rotate-ccw)
            const buttons = screen.getAllByTestId('button');
            const resetButton = buttons.find(btn =>
                btn.querySelector('.lucide-rotate-ccw')
            );

            expect(resetButton).toBeDefined();
            await user.click(resetButton!);

            // Deve voltar ao valor original após reset
            await waitFor(() => {
                // Re-consultar input após reset
                const updatedInput = screen.getAllByTestId('input')[0];
                expect((updatedInput as HTMLInputElement).value).toBe('Título Original');
            }, { timeout: 2000 });
        });
    });

    describe('📊 Validação e Logs', () => {
        it('DEVE logar mudanças no console (debug)', async () => {
            const consoleSpy = vi.spyOn(console, 'log');

            const block: Block = {
                id: 'text-8',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'Título', level: 1 },
                content: { text: 'Título' }
            };

            render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={vi.fn()}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Editar
            const textInput = screen.getAllByTestId('input')[0];
            await user.type(textInput, ' X');

            // Verificar que logs foram gerados
            await waitFor(() => {
                const logs = consoleSpy.mock.calls.map(call => call[0]);
                expect(logs.some(log =>
                    typeof log === 'string' && log.includes('[PropertyControl]')
                )).toBe(true);
            });

            consoleSpy.mockRestore();
        });
    });
});
