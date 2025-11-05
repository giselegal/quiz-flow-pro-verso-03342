import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizModularEditor from '../index';

// Mocks dos componentes
vi.mock('../components/CanvasColumn', () => ({
    default: ({ blocks, onAddBlock, hasTemplate, onLoadTemplate, onRemoveBlock }: any) => (
        <div data-testid="canvas-column">
            <div data-testid="block-count">{blocks?.length || 0}</div>
            <div data-testid="has-template">{hasTemplate ? 'yes' : 'no'}</div>

            {/* Simular mensagem de canvas vazio */}
            {(!blocks || blocks.length === 0) && !hasTemplate && (
                <div data-testid="empty-canvas-message">
                    <p>Nenhuma etapa carregada</p>
                    <button onClick={onLoadTemplate} data-testid="load-template-btn">
                        Clique no botão + para adicionar sua primeira etapa
                    </button>
                </div>
            )}

            {/* Renderizar blocos existentes */}
            {blocks?.map((block: any) => (
                <div key={block.id} data-testid={`block-${block.id}`}>
                    <span>{block.type}</span>
                    <button onClick={() => onRemoveBlock(block.id)}>Remove</button>
                </div>
            ))}
        </div>
    ),
}));

vi.mock('../components/ComponentLibraryColumn', () => ({
    default: ({ onAddBlock }: any) => (
        <div data-testid="library-column">
            <button onClick={() => onAddBlock('HeaderBlock')} data-testid="add-header">
                + Header
            </button>
            <button onClick={() => onAddBlock('TextBlock')} data-testid="add-text">
                + Text
            </button>
            <button onClick={() => onAddBlock('ButtonBlock')} data-testid="add-button">
                + Button
            </button>
        </div>
    ),
}));

vi.mock('../components/PropertiesColumn', () => ({
    default: () => <div data-testid="properties-column" />,
}));

vi.mock('../components/PreviewPanel', () => ({
    default: () => <div data-testid="preview-panel" />,
}));

vi.mock('../components/StepNavigatorColumn', () => ({
    default: ({ steps }: any) => (
        <div data-testid="step-navigator">
            <div data-testid="nav-step-count">{steps?.length || 0}</div>
            {(!steps || steps.length === 0) && (
                <div data-testid="nav-empty-message">Sem etapas</div>
            )}
            {steps?.map((step: any) => (
                <div key={step.key} data-testid={`nav-${step.key}`}>
                    {step.title}
                </div>
            ))}
        </div>
    ),
}));

vi.mock('../StepErrorBoundary', () => ({
    StepErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/utils/logger', () => ({
    appLogger: { info: vi.fn(), error: vi.fn() },
}));

// Mock do TemplateService para modo livre (sem dados)
vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        steps: {
            list: () => ({
                success: true,
                data: [], // Array vazio = sem steps
            }),
        },
        preloadTemplate: vi.fn().mockResolvedValue(undefined),
        getStep: vi.fn().mockResolvedValue({ success: true, data: [] }),
        invalidateTemplate: vi.fn(),
    },
}));

// Estado unificado para modo livre
const mockState = {
    editor: {
        currentStep: 1, // Inicializado com 1
        selectedBlockId: null as string | null,
        isDirty: false,
    },
    ui: { isLoading: false },
};

const setCurrentStep = vi.fn();
const setStepBlocks = vi.fn();
const addBlock = vi.fn();
const removeBlock = vi.fn();
const updateBlock = vi.fn();
const reorderBlocks = vi.fn();
const setSelectedBlock = vi.fn();
const saveFunnel = vi.fn().mockResolvedValue(undefined);
const showToast = vi.fn();

vi.mock('@/hooks/useSuperUnified', () => ({
    useSuperUnified: () => ({
        state: mockState,
        setCurrentStep,
        setStepBlocks,
        addBlock,
        removeBlock,
        reorderBlocks,
        updateBlock,
        setSelectedBlock,
        getStepBlocks: () => [], // Sem blocos inicialmente
        saveFunnel,
        showToast,
    }),
}));

vi.mock('@/hooks/useFeatureFlags', () => ({
    useFeatureFlags: () => ({ enableAutoSave: false }),
}));

describe('QuizModularEditor - Modo Construção Livre (Free Mode)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState.editor.currentStep = 1;
        mockState.editor.selectedBlockId = null;
        mockState.editor.isDirty = false;
    });

    describe('Inicialização em modo livre (sem templateId)', () => {
        it('exibe badge "Modo Construção Livre" quando não há template', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                const badge = screen.getByText(/Modo Construção Livre/i);
                expect(badge).toBeInTheDocument();
                expect(badge).toHaveClass('bg-gradient-to-r');
            });
        });

        it('mostra currentStep como "step-01" mesmo sem template', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                const stepBadge = screen.getByText('step-01');
                expect(stepBadge).toBeInTheDocument();
            });
        });

        it('navegação não exibe steps (array vazio)', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                const navStepCount = screen.getByTestId('nav-step-count');
                expect(navStepCount).toHaveTextContent('0');
            });

            const emptyMessage = await screen.findByTestId('nav-empty-message');
            expect(emptyMessage).toHaveTextContent('Sem etapas');
        });

        it('canvas exibe mensagem "Nenhuma etapa carregada"', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                const message = screen.getByTestId('empty-canvas-message');
                expect(message).toBeInTheDocument();
            });

            expect(screen.getByText('Nenhuma etapa carregada')).toBeInTheDocument();
        });

        it('exibe botão "Clique no botão + para adicionar sua primeira etapa"', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                const button = screen.getByTestId('load-template-btn');
                expect(button).toBeInTheDocument();
                expect(button).toHaveTextContent(/adicionar sua primeira etapa/i);
            });
        });
    });

    describe('Adicionar blocos em modo livre', () => {
        it('permite adicionar blocos mesmo sem template carregado', async () => {
            render(<QuizModularEditor />);

            // Verificar que canvas está vazio
            await waitFor(() => {
                expect(screen.getByTestId('block-count')).toHaveTextContent('0');
            });

            // Adicionar header da biblioteca
            const addHeaderBtn = await screen.findByTestId('add-header');
            fireEvent.click(addHeaderBtn);

            expect(addBlock).toHaveBeenCalledWith(
                1, // currentStep = 1
                expect.objectContaining({
                    type: 'HeaderBlock',
                    properties: {},
                    content: {},
                    order: 0,
                })
            );
        });

        it('adiciona múltiplos blocos em sequência', async () => {
            render(<QuizModularEditor />);

            const addHeaderBtn = await screen.findByTestId('add-header');
            const addTextBtn = await screen.findByTestId('add-text');
            const addButtonBtn = await screen.findByTestId('add-button');

            // Adicionar 3 blocos
            fireEvent.click(addHeaderBtn);
            fireEvent.click(addTextBtn);
            fireEvent.click(addButtonBtn);

            expect(addBlock).toHaveBeenCalledTimes(3);

            // Verificar que todos têm currentStep = 1
            expect(addBlock).toHaveBeenNthCalledWith(1, 1, expect.any(Object));
            expect(addBlock).toHaveBeenNthCalledWith(2, 1, expect.any(Object));
            expect(addBlock).toHaveBeenNthCalledWith(3, 1, expect.any(Object));
        });

        it('blocos adicionados têm IDs únicos', async () => {
            render(<QuizModularEditor />);

            const addHeaderBtn = await screen.findByTestId('add-header');

            fireEvent.click(addHeaderBtn);
            await new Promise(resolve => setTimeout(resolve, 10));
            fireEvent.click(addHeaderBtn);

            const calls = addBlock.mock.calls;
            const id1 = calls[0][1].id;
            const id2 = calls[1][1].id;

            expect(id1).not.toBe(id2);
            expect(id1).toMatch(/^block-\d+$/);
            expect(id2).toMatch(/^block-\d+$/);
        });
    });

    describe('Proteção contra "step-NaN"', () => {
        it('nunca exibe "step-NaN" mesmo com currentStep inválido', async () => {
            // Simular currentStep inválido
            mockState.editor.currentStep = 0;

            render(<QuizModularEditor />);

            // Deve exibir step-01 (proteção safeCurrentStep)
            await waitFor(() => {
                const stepBadge = screen.getByText('step-01');
                expect(stepBadge).toBeInTheDocument();
            });

            // Não deve existir "step-NaN"
            expect(screen.queryByText(/step-NaN/i)).not.toBeInTheDocument();
        });

        it('chama setCurrentStep(1) quando currentStep é inválido', async () => {
            mockState.editor.currentStep = 0;

            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(setCurrentStep).toHaveBeenCalledWith(1);
            });
        });

        it('operações de bloco usam currentStep mínimo de 1', async () => {
            mockState.editor.currentStep = -5; // Valor inválido

            render(<QuizModularEditor />);

            const addHeaderBtn = await screen.findByTestId('add-header');
            fireEvent.click(addHeaderBtn);

            // Deve usar safeCurrentStep = 1, não -5
            expect(addBlock).toHaveBeenCalledWith(1, expect.any(Object));
        });
    });

    describe('Comportamento hasTemplate', () => {
        it('hasTemplate é false em modo livre', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                const hasTemplate = screen.getByTestId('has-template');
                expect(hasTemplate).toHaveTextContent('no');
            });
        });

        it('exibe botão de carregar template quando hasTemplate é false', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                const loadBtn = screen.getByTestId('load-template-btn');
                expect(loadBtn).toBeInTheDocument();
            });
        });
    });

    describe('Salvamento em modo livre', () => {
        it('permite salvar funil mesmo sem template', async () => {
            render(<QuizModularEditor />);

            const saveBtn = await screen.findByText('Salvar');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(saveFunnel).toHaveBeenCalledTimes(1);
            });
        });

        it('exibe toast de sucesso após salvar em modo livre', async () => {
            render(<QuizModularEditor />);

            const saveBtn = await screen.findByText('Salvar');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(showToast).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: 'success',
                        title: 'Salvo!',
                    })
                );
            });
        });
    });

    describe('Estado do editor em modo livre', () => {
        it('componentes principais são renderizados', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByTestId('canvas-column')).toBeInTheDocument();
                expect(screen.getByTestId('library-column')).toBeInTheDocument();
                expect(screen.getByTestId('properties-column')).toBeInTheDocument();
                expect(screen.getByTestId('step-navigator')).toBeInTheDocument();
            });
        });

        it('título do editor está presente', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByText('Editor Modular')).toBeInTheDocument();
            });
        });

        it('botões de modo Edição/Preview estão disponíveis', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByText('Edição')).toBeInTheDocument();
                expect(screen.getByText('Preview')).toBeInTheDocument();
            });
        });
    });

    describe('Transição de modo livre para template carregado', () => {
        it('badge muda de "Modo Construção Livre" para nome do template após carregamento', async () => {
            const { rerender } = render(<QuizModularEditor />);

            // Verificar modo livre inicial
            await waitFor(() => {
                expect(screen.getByText(/Modo Construção Livre/i)).toBeInTheDocument();
            });

            // Simular carregamento de template (rerender com templateId)
            rerender(<QuizModularEditor templateId="quiz21StepsComplete" />);

            // Badge deve mudar (em implementação real, apareceria nome do template)
            // Neste teste, verificamos que o modo livre desaparece
            await waitFor(() => {
                expect(screen.queryByText(/Modo Construção Livre/i)).not.toBeInTheDocument();
            });
        });
    });
});
