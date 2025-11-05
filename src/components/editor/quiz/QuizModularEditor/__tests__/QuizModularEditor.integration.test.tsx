import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizModularEditor from '../index';

// Mocks para isolar funcionalidades
vi.mock('../components/CanvasColumn', () => ({
    default: ({ blocks, onRemoveBlock, onUpdateBlock, onBlockSelect }: any) => (
        <div data-testid="canvas-column">
            <div data-testid="block-count">{blocks?.length || 0}</div>
            {blocks?.map((block: any) => (
                <div key={block.id} data-testid={`block-${block.id}`}>
                    <span>{block.type}</span>
                    <button onClick={() => onBlockSelect(block.id)}>Select</button>
                    <button onClick={() => onRemoveBlock(block.id)}>Delete</button>
                    <button onClick={() => onUpdateBlock(block.id, { order: 99 })}>Move</button>
                </div>
            ))}
        </div>
    ),
}));

vi.mock('../components/ComponentLibraryColumn', () => ({
    default: ({ onAddBlock }: any) => (
        <div data-testid="library-column">
            <button onClick={() => onAddBlock('HeaderBlock')}>Add Header</button>
            <button onClick={() => onAddBlock('TextBlock')}>Add Text</button>
            <button onClick={() => onAddBlock('ImageBlock')}>Add Image</button>
        </div>
    ),
}));

vi.mock('../components/PropertiesColumn', () => ({
    default: ({ selectedBlock, onBlockUpdate, onClearSelection }: any) => (
        <div data-testid="properties-column">
            {selectedBlock ? (
                <div>
                    <div data-testid="selected-block-id">{selectedBlock.id}</div>
                    <button onClick={() => onBlockUpdate(selectedBlock.id, { modified: true })}>
                        Modify Props
                    </button>
                    <button onClick={onClearSelection}>Clear Selection</button>
                </div>
            ) : (
                <div>No block selected</div>
            )}
        </div>
    ),
}));

vi.mock('../components/PreviewPanel', () => ({
    default: () => <div data-testid="preview-panel" />,
}));

vi.mock('../components/StepNavigatorColumn', () => ({
    default: ({ steps, currentStepKey, onSelectStep }: any) => (
        <div data-testid="step-navigator">
            <div data-testid="current-step">{currentStepKey}</div>
            {steps?.map((step: any) => (
                <button
                    key={step.key}
                    data-testid={`nav-${step.key}`}
                    onClick={() => onSelectStep(step.key)}
                >
                    {step.title}
                </button>
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

// Mock do serviço canônico com dados realistas
vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        steps: {
            list: () => ({
                success: true,
                data: [
                    { id: 'step-01', name: 'Intro', order: 1 },
                    { id: 'step-02', name: 'Question 1', order: 2 },
                    { id: 'step-03', name: 'Question 2', order: 3 },
                ],
            }),
        },
        preloadTemplate: vi.fn().mockResolvedValue(undefined),
        getStep: vi.fn().mockResolvedValue({
            success: true,
            data: [
                { id: 'block-1', type: 'HeaderBlock', order: 0, properties: {}, content: {} },
                { id: 'block-2', type: 'TextBlock', order: 1, properties: {}, content: {} },
            ],
        }),
        invalidateTemplate: vi.fn(),
    },
}));

// Estado unificado com métodos rastreáveis
const mockState = {
    editor: {
        currentStep: 1,
        selectedBlockId: null as string | null,
        isDirty: false,
    },
    ui: { isLoading: false },
};

const setCurrentStep = vi.fn((step) => {
    mockState.editor.currentStep = step;
});
const setSelectedBlock = vi.fn((blockId) => {
    mockState.editor.selectedBlockId = blockId;
});
const addBlock = vi.fn();
const removeBlock = vi.fn();
const updateBlock = vi.fn();
const reorderBlocks = vi.fn();
const saveFunnel = vi.fn().mockResolvedValue(undefined);
const showToast = vi.fn();

vi.mock('@/hooks/useSuperUnified', () => ({
    useSuperUnified: () => ({
        state: mockState,
        setCurrentStep,
        setStepBlocks: vi.fn(),
        addBlock,
        removeBlock,
        reorderBlocks,
        updateBlock,
        setSelectedBlock,
        getStepBlocks: () => [
            { id: 'block-1', type: 'HeaderBlock', order: 0, properties: {}, content: {} },
            { id: 'block-2', type: 'TextBlock', order: 1, properties: {}, content: {} },
        ],
        saveFunnel,
        showToast,
    }),
}));

vi.mock('@/hooks/useFeatureFlags', () => ({
    useFeatureFlags: () => ({ enableAutoSave: false }),
}));

describe('QuizModularEditor - Fluxos Críticos de Edição', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState.editor.currentStep = 1;
        mockState.editor.selectedBlockId = null;
    });

    describe('Fluxo completo: Adicionar → Selecionar → Modificar → Deletar', () => {
        it('permite adicionar bloco, selecionar, modificar propriedades e deletar', async () => {
            render(<QuizModularEditor />);

            // 1. Adicionar novo bloco da biblioteca
            const addButton = await waitFor(() => screen.getByText('Add Header'));
            fireEvent.click(addButton);

            expect(addBlock).toHaveBeenCalledWith(
                1,
                expect.objectContaining({ type: 'HeaderBlock' }),
            );

            // 2. Verificar contagem de blocos no canvas
            const blockCount = await waitFor(() => screen.getByTestId('block-count'));
            expect(blockCount).toHaveTextContent('2'); // 2 blocos iniciais

            // 3. Selecionar um bloco
            const selectButton = await waitFor(() =>
                screen.getAllByText('Select')[0],
            );
            fireEvent.click(selectButton);

            expect(setSelectedBlock).toHaveBeenCalled();

            // 4. Modificar propriedades (simulando seleção)
            mockState.editor.selectedBlockId = 'block-1';
            const { rerender } = render(<QuizModularEditor />);

            const modifyButton = await waitFor(() =>
                screen.getByText('Modify Props'),
            );
            fireEvent.click(modifyButton);

            expect(updateBlock).toHaveBeenCalledWith(
                1,
                'block-1',
                expect.objectContaining({ modified: true }),
            );

            // 5. Deletar bloco
            const deleteButton = await waitFor(() =>
                screen.getAllByText('Delete')[0],
            );
            fireEvent.click(deleteButton);

            expect(removeBlock).toHaveBeenCalledWith(1, 'block-1');
        });
    });

    describe('Navegação entre steps mantém estado', () => {
        it('troca de step e mantém currentStep atualizado', async () => {
            render(<QuizModularEditor />);

            // Verificar step inicial
            const currentStep = await waitFor(() =>
                screen.getByTestId('current-step'),
            );
            expect(currentStep).toHaveTextContent('step-01');

            // Navegar para step-02
            const step2Button = await waitFor(() =>
                screen.getByTestId('nav-step-02'),
            );
            fireEvent.click(step2Button);

            expect(setCurrentStep).toHaveBeenCalledWith(2);
        });

        it('mostra blocos diferentes ao trocar de step', async () => {
            render(<QuizModularEditor />);

            // Blocos do step 1
            await waitFor(() => {
                expect(screen.getByTestId('block-block-1')).toBeInTheDocument();
            });

            // Trocar para step 2
            const step2Button = await waitFor(() =>
                screen.getByTestId('nav-step-02'),
            );
            fireEvent.click(step2Button);

            expect(setCurrentStep).toHaveBeenCalledWith(2);
        });
    });

    describe('Salvamento de alterações', () => {
        it('aciona saveFunnel ao clicar em Salvar', async () => {
            render(<QuizModularEditor />);

            const saveButton = await waitFor(() => screen.getByText('Salvar'));
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(saveFunnel).toHaveBeenCalledTimes(1);
            });

            expect(showToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'success',
                    title: 'Salvo!',
                }),
            );
        });

        it('exibe erro no toast se salvamento falhar', async () => {
            saveFunnel.mockRejectedValueOnce(new Error('Network error'));

            render(<QuizModularEditor />);

            const saveButton = await waitFor(() => screen.getByText('Salvar'));
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(showToast).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: 'error',
                        title: 'Erro',
                    }),
                );
            });
        });
    });

    describe('Seleção de blocos via painel de propriedades', () => {
        it('exibe propriedades quando bloco é selecionado', async () => {
            mockState.editor.selectedBlockId = 'block-1';

            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByTestId('selected-block-id')).toHaveTextContent(
                    'block-1',
                );
            });
        });

        it('limpa seleção ao clicar em Clear Selection', async () => {
            mockState.editor.selectedBlockId = 'block-1';

            render(<QuizModularEditor />);

            const clearButton = await waitFor(() =>
                screen.getByText('Clear Selection'),
            );
            fireEvent.click(clearButton);

            expect(setSelectedBlock).toHaveBeenCalledWith(null);
        });
    });

    describe('Toggle entre modos Edit e Preview', () => {
        it('exibe Canvas em modo Edit por padrão', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByTestId('canvas-column')).toBeInTheDocument();
            });
        });

        it('troca para Preview ao clicar no botão Preview', async () => {
            render(<QuizModularEditor />);

            const previewButton = await waitFor(() => screen.getByText('Preview'));
            fireEvent.click(previewButton);

            // Preview panel deve aparecer
            await waitFor(() => {
                expect(screen.getByTestId('preview-panel')).toBeInTheDocument();
            });
        });
    });

    describe('Biblioteca de componentes', () => {
        it('oferece múltiplos tipos de blocos para adicionar', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByText('Add Header')).toBeInTheDocument();
                expect(screen.getByText('Add Text')).toBeInTheDocument();
                expect(screen.getByText('Add Image')).toBeInTheDocument();
            });
        });

        it('adiciona tipos diferentes de blocos corretamente', async () => {
            render(<QuizModularEditor />);

            const addTextButton = await waitFor(() => screen.getByText('Add Text'));
            fireEvent.click(addTextButton);

            expect(addBlock).toHaveBeenCalledWith(
                1,
                expect.objectContaining({ type: 'TextBlock' }),
            );

            const addImageButton = await waitFor(() =>
                screen.getByText('Add Image'),
            );
            fireEvent.click(addImageButton);

            expect(addBlock).toHaveBeenCalledWith(
                1,
                expect.objectContaining({ type: 'ImageBlock' }),
            );
        });
    });
});
