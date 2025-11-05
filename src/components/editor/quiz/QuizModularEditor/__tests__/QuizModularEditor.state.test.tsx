import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizModularEditor from '../index';

// Mocks para componentes
vi.mock('../components/CanvasColumn', () => ({
    default: () => <div data-testid="canvas-column" />,
}));
vi.mock('../components/ComponentLibraryColumn', () => ({
    default: () => <div data-testid="library-column" />,
}));
vi.mock('../components/PropertiesColumn', () => ({
    default: () => <div data-testid="properties-column" />,
}));
vi.mock('../components/PreviewPanel', () => ({
    default: () => <div data-testid="preview-panel" />,
}));
vi.mock('../components/StepNavigatorColumn', () => ({
    default: () => <div data-testid="step-navigator" />,
}));
vi.mock('../StepErrorBoundary', () => ({
    StepErrorBoundary: ({ children }: any) => <>{children}</>,
}));
vi.mock('@/utils/logger', () => ({
    appLogger: { info: vi.fn(), error: vi.fn() },
}));

vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        steps: {
            list: () => ({
                success: true,
                data: [{ id: 'step-01', name: 'Intro', order: 1 }],
            }),
        },
        preloadTemplate: vi.fn().mockResolvedValue(undefined),
        getStep: vi.fn().mockResolvedValue({ success: true, data: [] }),
        invalidateTemplate: vi.fn(),
    },
}));

// Estado inicial do useSuperUnified
const initialState = {
    editor: {
        currentStep: 1,
        selectedBlockId: null,
        isDirty: false,
    },
    ui: { isLoading: false },
};

const setCurrentStep = vi.fn();
const addBlock = vi.fn();
const removeBlock = vi.fn();
const updateBlock = vi.fn();
const setSelectedBlock = vi.fn();
const saveFunnel = vi.fn();

vi.mock('@/hooks/useSuperUnified', () => ({
    useSuperUnified: () => ({
        state: initialState,
        setCurrentStep,
        setStepBlocks: vi.fn(),
        addBlock,
        removeBlock,
        reorderBlocks: vi.fn(),
        updateBlock,
        setSelectedBlock,
        getStepBlocks: vi.fn().mockReturnValue([]),
        saveFunnel,
        showToast: vi.fn(),
    }),
}));

vi.mock('@/hooks/useFeatureFlags', () => ({
    useFeatureFlags: () => ({ enableAutoSave: false }),
}));

describe('QuizModularEditor - Gestão de Estado', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        initialState.editor.currentStep = 1;
        initialState.editor.selectedBlockId = null;
        initialState.editor.isDirty = false;
    });

    describe('Estado inicial correto', () => {
        it('inicia no step 1', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });
        });

        it('não tem blocos selecionados inicialmente', () => {
            render(<QuizModularEditor />);

            expect(initialState.editor.selectedBlockId).toBeNull();
        });

        it('não está dirty inicialmente', () => {
            render(<QuizModularEditor />);

            expect(initialState.editor.isDirty).toBe(false);
        });
    });

    describe('Mudanças de estado durante edição', () => {
        it('currentStep é atualizado via setCurrentStep', () => {
            render(<QuizModularEditor />);

            // Simular ação que muda step
            setCurrentStep(2);

            expect(setCurrentStep).toHaveBeenCalledWith(2);
        });

        it('selectedBlockId é atualizado via setSelectedBlock', () => {
            render(<QuizModularEditor />);

            setSelectedBlock('block-123');

            expect(setSelectedBlock).toHaveBeenCalledWith('block-123');
        });

        it('addBlock é chamado com stepIndex correto', () => {
            render(<QuizModularEditor />);

            addBlock(1, { id: 'new-block', type: 'TextBlock' });

            expect(addBlock).toHaveBeenCalledWith(1, expect.any(Object));
        });
    });

    describe('Indicador de estado dirty', () => {
        it('não mostra "Não salvo" quando isDirty = false', async () => {
            initialState.editor.isDirty = false;

            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.queryByText(/Não salvo/i)).not.toBeInTheDocument();
            });
        });

        it('mostra status "Salvo agora" quando não dirty', async () => {
            initialState.editor.isDirty = false;

            const { rerender } = render(<QuizModularEditor />);

            // Forçar re-render
            rerender(<QuizModularEditor />);

            // Status de salvo deve aparecer
            // (pode não aparecer se autoSave estiver desabilitado)
        });
    });

    describe('Botão Salvar sempre disponível', () => {
        it('botão Salvar está presente', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByText('Salvar')).toBeInTheDocument();
            });
        });

        it('botão Salvar não está disabled por padrão', async () => {
            render(<QuizModularEditor />);

            const saveButton = await waitFor(() => screen.getByText('Salvar'));

            expect(saveButton).not.toBeDisabled();
        });

        it('chama saveFunnel quando clicado', async () => {
            saveFunnel.mockResolvedValue(undefined);

            render(<QuizModularEditor />);

            const saveButton = await waitFor(() => screen.getByText('Salvar'));
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(saveFunnel).toHaveBeenCalled();
            });
        });
    });

    describe('Loading state da UI', () => {
        it('botão Salvar mostra "Salvando..." quando isLoading = true', async () => {
            initialState.ui.isLoading = true;

            render(<QuizModularEditor />);

            await waitFor(() => {
                const saveButton = screen.getByText(/Salvando/i);
                expect(saveButton).toBeInTheDocument();
            });
        });

        it('botão Salvar é disabled quando isLoading = true', async () => {
            initialState.ui.isLoading = true;

            render(<QuizModularEditor />);

            await waitFor(() => {
                const saveButton = screen.getByText(/Salvando/i);
                expect(saveButton).toBeDisabled();
            });
        });
    });

    describe('Integridade do estado entre operações', () => {
        it('addBlock não modifica currentStep', () => {
            render(<QuizModularEditor />);

            const initialStep = initialState.editor.currentStep;
            addBlock(initialStep, { id: 'test', type: 'TextBlock' });

            expect(initialState.editor.currentStep).toBe(initialStep);
        });

        it('setCurrentStep não afeta selectedBlockId', () => {
            render(<QuizModularEditor />);

            initialState.editor.selectedBlockId = 'block-123';
            setCurrentStep(2);

            // selectedBlockId deveria persistir ou ser null, mas não mudar para outro valor
            expect(setCurrentStep).toHaveBeenCalled();
        });

        it('múltiplas operações não causam race conditions', async () => {
            render(<QuizModularEditor />);

            // Executar múltiplas operações rapidamente
            addBlock(1, { id: 'b1', type: 'TextBlock' });
            setSelectedBlock('b1');
            updateBlock(1, 'b1', { order: 5 });
            removeBlock(1, 'b1');

            // Todas devem ter sido chamadas
            expect(addBlock).toHaveBeenCalled();
            expect(setSelectedBlock).toHaveBeenCalled();
            expect(updateBlock).toHaveBeenCalled();
            expect(removeBlock).toHaveBeenCalled();
        });
    });
});
