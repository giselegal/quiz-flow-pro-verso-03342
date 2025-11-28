/**
 * 🧪 TESTES - QuizModularEditorV4
 * 
 * Testes de integração para o editor v4 com:
 * - Layout 3 colunas
 * - Adaptadores v3 ↔ v4
 * - DynamicPropertiesPanelV4
 * - EditorProvider do core
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizModularEditorV4Wrapper } from '../QuizModularEditorV4';
import { EditorProvider } from '@/core';
import type { Block } from '@/types/editor';
import type { QuizBlock } from '@/schemas/quiz-schema.zod';

// Mock dos componentes lazy
vi.mock('../components/StepNavigatorColumn', () => ({
    default: ({ steps, currentStepKey, onSelectStep }: any) => (
        <div data-testid="step-navigator">
            <div>Current Step: {currentStepKey}</div>
            <button onClick={() => onSelectStep('step2')}>Go to Step 2</button>
        </div>
    ),
}));

vi.mock('../components/CanvasColumn', () => ({
    default: ({ blocks, selectedBlockId, onBlockSelect, isEditable }: any) => (
        <div data-testid="canvas-column">
            <div>Blocks Count: {blocks.length}</div>
            <div>Editable: {isEditable ? 'Yes' : 'No'}</div>
            {blocks.map((block: Block) => (
                <div
                    key={block.id}
                    data-testid={`block-${block.id}`}
                    onClick={() => onBlockSelect(block.id)}
                    className={selectedBlockId === block.id ? 'selected' : ''}
                >
                    {block.type} - {block.id}
                </div>
            ))}
        </div>
    ),
}));

vi.mock('@/components/editor/properties/DynamicPropertiesPanelV4', () => ({
    DynamicPropertiesPanelV4: ({ block, onUpdate, onClose }: any) => (
        <div data-testid="dynamic-properties-panel">
            <div>Editing Block: {block.id}</div>
            <div>Block Type: {block.type}</div>
            <button
                onClick={() =>
                    onUpdate(block.id, {
                        properties: { ...block.properties, updated: true },
                    })
                }
            >
                Update Properties
            </button>
            <button onClick={onClose}>Close</button>
        </div>
    ),
}));

describe('QuizModularEditorV4Wrapper', () => {
    const mockBlocks: Block[] = [
        {
            id: 'block-1',
            type: 'text',
            order: 0,
            properties: { content: 'Hello' },
            content: { text: 'Hello World' },
        },
        {
            id: 'block-2',
            type: 'button',
            order: 1,
            properties: { label: 'Click me' },
            content: {},
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Layout V4', () => {
        it('deve renderizar layout v4 com 3 colunas', async () => {
            render(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId="test-funnel"
                    />
                </EditorProvider>
            );

            // Aguardar carregamento dos componentes lazy
            await waitFor(() => {
                expect(screen.getByTestId('step-navigator')).toBeInTheDocument();
            });

            // Verificar header v4
            expect(screen.getByText('Editor Modular v4')).toBeInTheDocument();
            expect(screen.getByText('✓ DynamicPropertiesV4')).toBeInTheDocument();

            // Verificar 3 colunas
            expect(screen.getByTestId('step-navigator')).toBeInTheDocument();
            expect(screen.getByTestId('canvas-column')).toBeInTheDocument();
        });

        it('deve exibir estado vazio quando nenhum bloco está selecionado', async () => {
            render(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId="test-funnel"
                    />
                </EditorProvider>
            );

            await waitFor(() => {
                expect(screen.getByText('Nenhum bloco selecionado')).toBeInTheDocument();
            });

            expect(
                screen.getByText(/Clique em um bloco no canvas/)
            ).toBeInTheDocument();
        });

        it('deve usar layout original quando useV4Layout=false', async () => {
            const { container } = render(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={false}
                        funnelId="test-funnel"
                    />
                </EditorProvider>
            );

            // Não deve ter o header v4
            expect(screen.queryByText('Editor Modular v4')).not.toBeInTheDocument();
        });
    });

    describe('Seleção de Blocos', () => {
        it('deve selecionar bloco e exibir DynamicPropertiesPanel', async () => {
            const user = userEvent.setup();

            render(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId="test-funnel"
                    />
                </EditorProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('canvas-column')).toBeInTheDocument();
            });

            // Simular clique em bloco (precisa ter blocos no contexto)
            // TODO: Adicionar setup de blocos no EditorProvider mock
        });

        it('deve limpar seleção ao clicar em Close no painel', async () => {
            const user = userEvent.setup();

            render(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId="test-funnel"
                    />
                </EditorProvider>
            );

            // TODO: Implementar teste de clear selection
        });
    });

    describe('Adaptadores v3 ↔ v4', () => {
        it('deve converter blocos v3 para v4 automaticamente', async () => {
            // Mock do EditorProvider com blocos v3
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <EditorProvider>{children}</EditorProvider>
            );

            const { rerender } = render(
                <QuizModularEditorV4Wrapper
                    useV4Layout={true}
                    funnelId="test-funnel"
                />,
                { wrapper }
            );

            // Verificar que blocos foram convertidos
            await waitFor(() => {
                // O header deve mostrar contador de blocos
                expect(screen.getByText(/0 blocos/)).toBeInTheDocument();
            });
        });

        it('deve converter updates v4 para v3 antes de salvar', async () => {
            const onBlockV4Update = vi.fn();

            render(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId="test-funnel"
                        onBlockV4Update={onBlockV4Update}
                    />
                </EditorProvider>
            );

            // TODO: Simular update de propriedade e verificar conversão
        });
    });

    describe('DynamicPropertiesPanelV4', () => {
        it('deve atualizar propriedades do bloco', async () => {
            const user = userEvent.setup();

            render(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId="test-funnel"
                    />
                </EditorProvider>
            );

            // TODO: Testar update de propriedades via painel dinâmico
        });

        it('deve validar propriedades com Zod', async () => {
            // TODO: Testar validação Zod em tempo real
        });
    });

    describe('Navegação de Steps', () => {
        it('deve alternar entre steps', async () => {
            const user = userEvent.setup();

            render(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId="test-funnel"
                        initialStepKey="step1"
                    />
                </EditorProvider>
            );

            await waitFor(() => {
                expect(screen.getByText('Current Step: step1')).toBeInTheDocument();
            });

            // Clicar para ir para step 2
            const goToStep2Button = screen.getByText('Go to Step 2');
            await user.click(goToStep2Button);

            // TODO: Verificar mudança de step
        });

        it('deve carregar blocos do step correto', async () => {
            // TODO: Testar carregamento de blocos por step
        });
    });

    describe('Performance', () => {
        it('deve usar lazy loading para componentes pesados', async () => {
            const { container } = render(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId="test-funnel"
                    />
                </EditorProvider>
            );

            // Verificar que componentes lazy têm fallback
            // TODO: Verificar suspense boundaries
        });

        it('não deve re-renderizar quando blocos não mudam', async () => {
            // TODO: Testar memoization dos adaptadores
        });
    });

    describe('Error Handling', () => {
        it('deve lidar com erro na conversão v3→v4', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            // Bloco inválido que causará erro na conversão
            const invalidBlock = {
                id: 'invalid',
                type: 'unknown-type' as any,
                order: 0,
            };

            // TODO: Simular bloco inválido e verificar handling

            consoleSpy.mockRestore();
        });

        it('deve exibir fallback quando componente falha', async () => {
            // TODO: Testar error boundaries
        });
    });

    describe('Integração com Core', () => {
        it('deve usar EditorProvider do core', () => {
            const { container } = render(
                <QuizModularEditorV4Wrapper
                    useV4Layout={true}
                    funnelId="test-funnel"
                />
            );

            // O wrapper deve criar seu próprio EditorProvider
            expect(container).toBeInTheDocument();
        });

        it('deve usar actions do EditorStateProvider', async () => {
            // TODO: Verificar que usa actions.updateBlock, actions.selectBlock, etc.
        });

        it('deve sincronizar state.currentStep com navegação', async () => {
            // TODO: Testar sincronização de step
        });
    });

    describe('Callbacks', () => {
        it('deve chamar onBlockV4Update quando propriedade muda', async () => {
            const onBlockV4Update = vi.fn();

            render(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId="test-funnel"
                        onBlockV4Update={onBlockV4Update}
                    />
                </EditorProvider>
            );

            // TODO: Simular update e verificar callback
        });
    });

    describe('Resizable Panels', () => {
        it('deve permitir redimensionar colunas', async () => {
            render(
                <EditorProvider>
                    <QuizModularEditorV4Wrapper
                        useV4Layout={true}
                        funnelId="test-funnel"
                    />
                </EditorProvider>
            );

            // TODO: Testar drag dos ResizableHandles
        });

        it('deve respeitar limites min/max dos painéis', async () => {
            // TODO: Testar limites de resize
        });

        it('deve salvar layout em localStorage', async () => {
            // TODO: Testar persistência de layout
        });
    });
});
