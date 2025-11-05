import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizModularEditor from '../index';

// Mocks leves para evitar carregar componentes pesados
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
    default: ({ steps, onSelectStep }: any) => (
        <div data-testid="step-navigator">
            {steps?.map((step: any) => (
                <button key={step.key} onClick={() => onSelectStep(step.key)}>
                    {step.title}
                </button>
            ))}
        </div>
    ),
}));
vi.mock('../StepErrorBoundary', () => ({
    StepErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('@/utils/logger', () => ({ appLogger: { info: vi.fn(), error: vi.fn() } }));

// Mock do serviço canônico (lista de steps e getStep básico)
vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        steps: {
            list: () => ({
                success: true,
                data: [
                    { id: 'step-01', name: 'Introdução', order: 1 },
                    { id: 'step-02', name: 'Pergunta', order: 2 },
                    { id: 'step-03', name: 'Pergunta 2', order: 3 },
                ],
            }),
        },
        preloadTemplate: vi.fn().mockResolvedValue(undefined),
        getStep: vi.fn().mockResolvedValue({ success: true, data: [] }),
        invalidateTemplate: vi.fn(),
    },
}));

// Mock do estado unificado
const setCurrentStep = vi.fn();
const saveFunnel = vi.fn().mockResolvedValue(undefined);

vi.mock('@/hooks/useSuperUnified', () => ({
    useSuperUnified: () => ({
        state: {
            editor: {
                currentStep: 1,
                selectedBlockId: null,
                isDirty: false,
            },
            ui: { isLoading: false },
        },
        setCurrentStep,
        setStepBlocks: vi.fn(),
        addBlock: vi.fn(),
        removeBlock: vi.fn(),
        reorderBlocks: vi.fn(),
        updateBlock: vi.fn(),
        setSelectedBlock: vi.fn(),
        getStepBlocks: () => [],
        saveFunnel,
        showToast: vi.fn(),
    }),
}));

// Flags de features
vi.mock('@/hooks/useFeatureFlags', () => ({
    useFeatureFlags: () => ({ enableAutoSave: false }),
}));


describe('QuizModularEditor - Navegação', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza a coluna de navegação com steps do serviço canônico', async () => {
        render(<QuizModularEditor templateId="quiz21StepsComplete" />);

        // Aguarda o Suspense resolver e o step-navigator aparecer
        const navigator = await waitFor(() => screen.getByTestId('step-navigator'), {
            timeout: 3000,
        });

        expect(navigator).toBeInTheDocument();

        // Aguarda os itens da navegação renderizarem
        await waitFor(() => {
            expect(screen.getByText('01 - Introdução')).toBeInTheDocument();
            expect(screen.getByText('02 - Pergunta')).toBeInTheDocument();
        });
        it('ao clicar em um step, chama setCurrentStep com o índice correto', async () => {
            it('ao clicar em um step, chama setCurrentStep com o índice correto', async () => {
                render(<QuizModularEditor templateId="quiz21StepsComplete" />);

                // Garantir que os itens existam
                await waitFor(() => expect(screen.getByText('02 - Pergunta')).toBeInTheDocument());

                fireEvent.click(screen.getByText('02 - Pergunta'));

                // step-02 -> número 2
                expect(setCurrentStep).toHaveBeenCalledWith(2);
            }); it('ao clicar em Salvar, aciona saveFunnel uma vez', async () => {
                render(<QuizModularEditor />);

                const saveButton = await waitFor(() => screen.getByText('Salvar'));
                fireEvent.click(saveButton);

                await waitFor(() => {
                    expect(saveFunnel).toHaveBeenCalledTimes(1);
                });
            });
        });
