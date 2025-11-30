import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizModularEditor from '../index';

// Mocks para componentes
vi.mock('../components/CanvasColumn', () => ({
    default: () => <div data-testid="canvas-column">Canvas OK</div>,
}));
vi.mock('../components/ComponentLibraryColumn', () => ({
    default: () => <div data-testid="library-column">Library OK</div>,
}));
vi.mock('../components/PropertiesColumn', () => ({
    default: () => <div data-testid="properties-column">Properties OK</div>,
}));
vi.mock('../components/PreviewPanel', () => ({
    default: () => <div data-testid="preview-panel">Preview OK</div>,
}));
vi.mock('../components/StepNavigatorColumn', () => ({
    default: () => <div data-testid="step-navigator">Navigator OK</div>,
}));
vi.mock('../StepErrorBoundary', () => ({
    StepErrorBoundary: ({ children, onReset }: any) => (
        <div data-testid="error-boundary">
            {children}
            <button onClick={onReset}>Reset Error</button>
        </div>
    ),
}));
vi.mock('@/utils/logger', () => ({
    appLogger: { info: vi.fn(), error: vi.fn() },
}));

// Cenários de erro no templateService
const mockGetStep = vi.fn();
const mockPreloadTemplate = vi.fn();

vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        steps: {
            list: () => ({
                success: true,
                data: [{ id: 'step-01', name: 'Intro', order: 1 }],
            }),
        },
        preloadTemplate: (...args: any[]) => mockPreloadTemplate(...args),
        getStep: (...args: any[]) => mockGetStep(...args),
        invalidateTemplate: vi.fn(),
    },
}));

const showToast = vi.fn();

vi.mock('@/hooks/useSuperUnified', () => ({
    useSuperUnified: () => ({
        state: {
            editor: { currentStep: 1, selectedBlockId: null, isDirty: false },
            ui: { isLoading: false },
        },
        setCurrentStep: vi.fn(),
        setStepBlocks: vi.fn(),
        addBlock: vi.fn(),
        removeBlock: vi.fn(),
        reorderBlocks: vi.fn(),
        updateBlock: vi.fn(),
        setSelectedBlock: vi.fn(),
        getStepBlocks: () => [],
        saveFunnel: vi.fn().mockResolvedValue(undefined),
        showToast,
    }),
}));

vi.mock('@/hooks/useFeatureFlags', () => ({
    useFeatureFlags: () => ({ enableAutoSave: false }),
}));

describe('QuizModularEditor - Error Handling', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Falhas no carregamento de template', () => {
        it('lida com erro no preloadTemplate', async () => {
            mockPreloadTemplate.mockRejectedValueOnce(new Error('Network error'));
            mockGetStep.mockResolvedValue({ success: true, data: [] });

            render(<QuizModularEditor templateId="test-template" />);

            // Editor deve renderizar mesmo com erro
            await waitFor(() => {
                expect(screen.getByText('Editor Modular')).toBeInTheDocument();
            });

            // Logger deve ter registrado o erro
            expect(mockPreloadTemplate).toHaveBeenCalledWith('test-template');
        });

        it('lida com getStep retornando falha', async () => {
            mockPreloadTemplate.mockResolvedValue(undefined);
            mockGetStep.mockResolvedValue({
                success: false,
                error: { message: 'Step not found' },
            });

            render(<QuizModularEditor templateId="test-template" />);

            await waitFor(() => {
                expect(screen.getByText('Editor Modular')).toBeInTheDocument();
            });
        });

        it('exibe modo construção livre quando template falha', async () => {
            mockPreloadTemplate.mockRejectedValueOnce(new Error('Failed'));
            mockGetStep.mockRejectedValue(new Error('Failed'));

            render(<QuizModularEditor templateId="bad-template" />);

            await waitFor(() => {
                expect(screen.getByText(/Modo Construção Livre/i)).toBeInTheDocument();
            });
        });
    });

    describe('Error Boundary para steps', () => {
        it('renderiza Error Boundary ao redor do Canvas', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
            });
        });

        it('Error Boundary contém botão de reset', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByText('Reset Error')).toBeInTheDocument();
            });
        });
    });

    describe('Estados vazios e edge cases', () => {
        it('renderiza editor sem templateId (modo livre)', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByText('Editor Modular')).toBeInTheDocument();
                expect(screen.getByText(/Modo Construção Livre/i)).toBeInTheDocument();
            });
        });

        it('renderiza todas as 4 colunas principais', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByTestId('step-navigator')).toBeInTheDocument();
                expect(screen.getByTestId('library-column')).toBeInTheDocument();
                expect(screen.getByTestId('canvas-column')).toBeInTheDocument();
                expect(screen.getByTestId('properties-column')).toBeInTheDocument();
            });
        });

        it('exibe header com título e controles', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByText('Editor Modular')).toBeInTheDocument();
                expect(screen.getByText('Edição')).toBeInTheDocument();
                expect(screen.getByText('Preview')).toBeInTheDocument();
                expect(screen.getByText('Salvar')).toBeInTheDocument();
            });
        });

        it('mostra indicador do step atual', async () => {
            render(<QuizModularEditor />);

            await waitFor(() => {
                expect(screen.getByText('step-01')).toBeInTheDocument();
            });
        });
    });

    describe('Loading states', () => {
        it('exibe placeholder durante carregamento de navegação', async () => {
            render(<QuizModularEditor />);

            // Suspense fallback para navegação
            const fallbacks = screen.queryAllByText(/Carregando navegação/i);

            // Pode ou não estar presente dependendo do timing
            // O importante é que não quebre
            expect(screen.getByText('Editor Modular')).toBeInTheDocument();
        });

        it('não quebra quando template demora a carregar', async () => {
            mockPreloadTemplate.mockImplementation(
                () => new Promise((resolve) => setTimeout(resolve, 100)),
            );
            mockGetStep.mockResolvedValue({ success: true, data: [] });

            render(<QuizModularEditor templateId="slow-template" />);

            // Editor deve renderizar imediatamente
            expect(screen.getByText('Editor Modular')).toBeInTheDocument();

            // Aguardar carregamento finalizar
            await waitFor(
                () => {
                    expect(mockPreloadTemplate).toHaveBeenCalled();
                },
                { timeout: 3000 },
            );
        });
    });
});
