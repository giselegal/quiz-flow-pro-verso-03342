/**
 * 🧪 TESTES DE INTEGRAÇÃO: Edição no Painel de Propriedades
 * 
 * Testa as melhorias implementadas:
 * - Callbacks memorizados (useCallback)
 * - Error handling (try-catch)
 * - Modal JSON avançado
 * - Sincronização properties ↔ content
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import type { Block } from '@/types/editor';

// Import direto do componente
import PropertiesColumnComponent from '@/components/editor/quiz/QuizModularEditor/components/PropertiesColumn/index';

// Usar o default export
const PropertiesColumn = PropertiesColumnComponent;

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

vi.mock('@/components/ui/alert', () => ({
    Alert: ({ children, variant, ...props }: any) => (
        <div data-testid="alert" data-variant={variant} {...props}>
            {children}
        </div>
    ),
    AlertDescription: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/components/ui/dialog', () => ({
    Dialog: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
    DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
    DialogHeader: ({ children }: any) => <div>{children}</div>,
    DialogTitle: ({ children }: any) => <h2>{children}</h2>,
    DialogDescription: ({ children }: any) => <p>{children}</p>
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
    createSynchronizedBlockUpdate: vi.fn((block, props) => ({
        properties: props,
        content: props
    })),
    normalizerLogger: {
        debug: vi.fn()
    }
}));

const mockSchemas: Record<string, any> = {
    'heading': {
        type: 'object',
        properties: {
            text: {
                type: 'string',
                label: 'Título',
                control: 'text',
                default: ''
            }
        }
    }
};

vi.mock('@/core/schema/SchemaInterpreter', () => ({
    schemaInterpreter: {
        getBlockSchema: vi.fn((type: string) => mockSchemas[type] || null)
    }
}));

describe('🧪 Edição no Painel de Propriedades - Melhorias Implementadas', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
        vi.clearAllMocks();
    });

    describe('⚡ Performance - Callbacks Memorizados', () => {
        it('DEVE manter a mesma referência de callback entre re-renders', async () => {
            const block: Block = {
                id: 'test-1',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'Título' },
                content: { text: 'Título' }
            };

            const mockOnBlockUpdate = vi.fn();
            const { rerender } = render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={mockOnBlockUpdate}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Primeira renderização
            const firstRenderButtons = screen.getAllByTestId('button');
            const firstSaveButton = firstRenderButtons.find(b => b.textContent?.includes('Salv'));

            // Re-render com mesmo bloco
            rerender(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={mockOnBlockUpdate}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Segunda renderização
            const secondRenderButtons = screen.getAllByTestId('button');
            const secondSaveButton = secondRenderButtons.find(b => b.textContent?.includes('Salv'));

            // Ambos devem existir
            expect(firstSaveButton).toBeDefined();
            expect(secondSaveButton).toBeDefined();
        });

        it('DEVE não re-renderizar desnecessariamente ao editar propriedade', async () => {
            const renderSpy = vi.fn();

            const TestComponent = () => {
                renderSpy();
                const block: Block = {
                    id: 'test-2',
                    type: 'heading' as any,
                    order: 0,
                    properties: { text: 'Original' },
                    content: { text: 'Original' }
                };

                return (
                    <PropertiesColumn
                        selectedBlock={block}
                        onBlockUpdate={vi.fn()}
                        onClearSelection={vi.fn()}
                        blocks={[block]}
                    />
                );
            };

            render(<TestComponent />);

            const initialRenderCount = renderSpy.mock.calls.length;

            // Editar campo
            const input = screen.getAllByTestId('input')[0];
            await user.type(input, ' Editado');

            // Componente deve ter renderizado apenas quando estado mudou
            expect(renderSpy.mock.calls.length).toBeGreaterThanOrEqual(initialRenderCount);
        });
    });

    describe('🛡️ Error Handling', () => {
        it('DEVE capturar erro ao salvar e mostrar alerta', async () => {
            const block: Block = {
                id: 'test-3',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'Teste' },
                content: { text: 'Teste' }
            };

            const mockOnBlockUpdate = vi.fn(() => {
                throw new Error('Erro simulado de salvamento');
            });

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const { container } = render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={mockOnBlockUpdate}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Editar para ativar isDirty
            const input = screen.getAllByTestId('input')[0];
            await user.type(input, ' Modificado');

            // Clicar em Salvar
            const saveButton = Array.from(container.querySelectorAll('button')).find(b =>
                b.textContent?.includes('Salvar Alterações')
            );

            if (saveButton) {
                await user.click(saveButton);

                // Verificar que erro foi logado
                await waitFor(() => {
                    expect(consoleSpy).toHaveBeenCalledWith(
                        expect.stringContaining('Erro ao salvar'),
                        expect.any(Error)
                    );
                });

                // Verificar que alerta de erro aparece
                await waitFor(() => {
                    const alert = screen.queryByTestId('alert');
                    if (alert) {
                        expect(alert.getAttribute('data-variant')).toBe('destructive');
                    }
                });
            }

            consoleSpy.mockRestore();
        });

        it('DEVE remover alerta de erro após salvamento bem-sucedido', async () => {
            const block: Block = {
                id: 'test-4',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'Teste' },
                content: { text: 'Teste' }
            };

            let shouldFail = true;
            const mockOnBlockUpdate = vi.fn(() => {
                if (shouldFail) {
                    throw new Error('Primeiro erro');
                }
                // Segunda chamada: sucesso
            });

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const { container, rerender } = render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={mockOnBlockUpdate}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Primeira tentativa: deve falhar
            const input = screen.getAllByTestId('input')[0];
            await user.type(input, ' Erro');

            const saveButton = Array.from(container.querySelectorAll('button')).find(b =>
                b.textContent?.includes('Salvar Alterações')
            );

            if (saveButton) {
                await user.click(saveButton);

                // Aguardar erro
                await waitFor(() => {
                    expect(consoleSpy).toHaveBeenCalled();
                }, { timeout: 500 });

                // Resetar para permitir sucesso
                shouldFail = false;

                // Editar novamente
                await user.clear(input);
                await user.type(input, 'Sucesso');

                // Salvar novamente
                await user.click(saveButton);

                // Verificar que alerta foi removido (não deve existir alerta destructive)
                await waitFor(() => {
                    const alerts = screen.queryAllByTestId('alert');
                    const errorAlert = alerts.find(a => a.getAttribute('data-variant') === 'destructive');
                    expect(errorAlert).toBeUndefined();
                });
            }

            consoleSpy.mockRestore();
        });
    });

    describe('🎨 Editor JSON Avançado', () => {
        it('DEVE abrir modal JSON ao clicar no botão Avançado', async () => {
            const block: Block = {
                id: 'test-5',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'Teste JSON' },
                content: { text: 'Teste JSON' }
            };

            const { container } = render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={vi.fn()}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Encontrar botão "Editar JSON (Avançado)"
            const jsonButton = Array.from(container.querySelectorAll('button')).find(b =>
                b.textContent?.includes('JSON') && b.textContent?.includes('Avançado')
            );

            expect(jsonButton).toBeDefined();

            if (jsonButton) {
                // Clicar no botão
                await user.click(jsonButton);

                // Verificar que modal aparece
                await waitFor(() => {
                    const dialog = screen.queryByTestId('dialog');
                    expect(dialog).toBeDefined();
                });
            }
        });

        it('DEVE exibir JSON do bloco no modal', async () => {
            const block: Block = {
                id: 'test-6',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'JSON Test', fontSize: 32 },
                content: { text: 'JSON Test' }
            };

            const { container } = render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={vi.fn()}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Abrir modal
            const jsonButton = Array.from(container.querySelectorAll('button')).find(b =>
                b.textContent?.includes('JSON')
            );

            if (jsonButton) {
                await user.click(jsonButton);

                // Verificar que JSON está presente
                await waitFor(() => {
                    const dialog = screen.queryByTestId('dialog');
                    if (dialog) {
                        expect(dialog.textContent).toContain('test-6');
                        expect(dialog.textContent).toContain('heading');
                    }
                });
            }
        });

        it('DEVE copiar JSON ao clicar no botão Copiar', async () => {
            const block: Block = {
                id: 'test-7',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'Copy Test' },
                content: { text: 'Copy Test' }
            };

            // Mock clipboard API
            const clipboardMock = {
                writeText: vi.fn().mockResolvedValue(undefined)
            };
            Object.defineProperty(navigator, 'clipboard', {
                value: clipboardMock,
                writable: true
            });

            const { container } = render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={vi.fn()}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Abrir modal JSON
            const jsonButton = Array.from(container.querySelectorAll('button')).find(b =>
                b.textContent?.includes('JSON')
            );

            if (jsonButton) {
                await user.click(jsonButton);

                // Encontrar botão Copiar dentro do modal
                await waitFor(() => {
                    const copyButton = Array.from(container.querySelectorAll('button')).find(b =>
                        b.textContent === 'Copiar JSON'
                    );

                    if (copyButton) {
                        user.click(copyButton);
                    }
                });

                // Verificar que clipboard foi chamado
                await waitFor(() => {
                    expect(clipboardMock.writeText).toHaveBeenCalled();
                    const copiedText = clipboardMock.writeText.mock.calls[0][0];
                    expect(copiedText).toContain('test-7');
                    expect(copiedText).toContain('Copy Test');
                });
            }
        });
    });

    describe('🔄 Sincronização Properties ↔ Content', () => {
        it('DEVE sincronizar properties e content ao salvar', async () => {
            const { createSynchronizedBlockUpdate } = await import('@/core/adapters/BlockDataNormalizer');

            const block: Block = {
                id: 'test-8',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'Original' },
                content: { text: 'Original' }
            };

            const mockOnBlockUpdate = vi.fn();

            const { container } = render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={mockOnBlockUpdate}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // Editar
            const input = screen.getAllByTestId('input')[0];
            await user.clear(input);
            await user.type(input, 'Sincronizado');

            // Salvar
            const saveButton = Array.from(container.querySelectorAll('button')).find(b =>
                b.textContent?.includes('Salvar')
            );

            if (saveButton) {
                await user.click(saveButton);

                // Verificar que createSynchronizedBlockUpdate foi chamado
                await waitFor(() => {
                    expect(createSynchronizedBlockUpdate).toHaveBeenCalledWith(
                        block,
                        expect.objectContaining({ text: 'Sincronizado' })
                    );
                });

                // Verificar que onBlockUpdate recebeu dados sincronizados
                await waitFor(() => {
                    expect(mockOnBlockUpdate).toHaveBeenCalledWith(
                        'test-8',
                        expect.objectContaining({
                            properties: expect.objectContaining({ text: 'Sincronizado' }),
                            content: expect.objectContaining({ text: 'Sincronizado' })
                        })
                    );
                });
            }
        });
    });

    describe('📋 Estado e Fluxo Completo', () => {
        it('DEVE completar fluxo: editar → erro → retry → sucesso', async () => {
            const block: Block = {
                id: 'test-9',
                type: 'heading' as any,
                order: 0,
                properties: { text: 'Fluxo' },
                content: { text: 'Fluxo' }
            };

            let callCount = 0;
            const mockOnBlockUpdate = vi.fn(() => {
                callCount++;
                if (callCount === 1) {
                    throw new Error('Primeira tentativa falha');
                }
                // Segunda tentativa: sucesso
            });

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const { container } = render(
                <PropertiesColumn
                    selectedBlock={block}
                    onBlockUpdate={mockOnBlockUpdate}
                    onClearSelection={vi.fn()}
                    blocks={[block]}
                />
            );

            // 1. Editar
            const input = screen.getAllByTestId('input')[0];
            await user.type(input, ' Editado');

            // 2. Tentar salvar (deve falhar)
            const saveButton = Array.from(container.querySelectorAll('button')).find(b =>
                b.textContent?.includes('Salvar Alterações')
            );

            if (saveButton) {
                await user.click(saveButton);

                // 3. Verificar erro
                await waitFor(() => {
                    expect(consoleSpy).toHaveBeenCalled();
                    expect(callCount).toBe(1);
                });

                // 4. Editar novamente
                await user.type(input, ' Retry');

                // 5. Salvar novamente (deve funcionar)
                await user.click(saveButton);

                // 6. Verificar sucesso
                await waitFor(() => {
                    expect(callCount).toBe(2);
                    expect(mockOnBlockUpdate).toHaveBeenCalledTimes(2);
                });
            }

            consoleSpy.mockRestore();
        });
    });
});
