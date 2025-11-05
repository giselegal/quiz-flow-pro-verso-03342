import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizModularEditor from '../index';
import { templateService } from '@/services/canonical/TemplateService';

// Mocks leves
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
    StepErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('@/utils/logger', () => ({ appLogger: { info: vi.fn(), error: vi.fn() } }));

const mockPreloadTemplate = vi.fn().mockResolvedValue(undefined);
const mockGetStep = vi.fn().mockResolvedValue({
    success: true,
    data: [
        { id: 'block-1', type: 'TextBlock', order: 0, properties: {}, content: {} },
    ],
});

vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        steps: {
            list: () => ({
                success: true,
                data: [
                    { id: 'step-01', name: 'Introdução', order: 1 },
                    { id: 'step-02', name: 'Pergunta', order: 2 },
                ],
            }),
        },
        preloadTemplate: (...args: any[]) => mockPreloadTemplate(...args),
        getStep: (...args: any[]) => mockGetStep(...args),
        invalidateTemplate: vi.fn(),
    },
}));

const setStepBlocks = vi.fn();

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
        setCurrentStep: vi.fn(),
        setStepBlocks,
        addBlock: vi.fn(),
        removeBlock: vi.fn(),
        reorderBlocks: vi.fn(),
        updateBlock: vi.fn(),
        setSelectedBlock: vi.fn(),
        getStepBlocks: () => [],
        saveFunnel: vi.fn().mockResolvedValue(undefined),
        showToast: vi.fn(),
    }),
}));

vi.mock('@/hooks/useFeatureFlags', () => ({
    useFeatureFlags: () => ({ enableAutoSave: false }),
}));

describe('QuizModularEditor - Template Loading', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('carrega template quando templateId é fornecido via props', async () => {
        render(<QuizModularEditor templateId="quiz21StepsComplete" />);

        // Aguarda preload ser chamado
        await waitFor(
            () => {
                expect(mockPreloadTemplate).toHaveBeenCalledWith('quiz21StepsComplete');
            },
            { timeout: 3000 },
        );

        // Aguarda getStep ser chamado para os steps
        await waitFor(
            () => {
                expect(mockGetStep).toHaveBeenCalled();
            },
            { timeout: 3000 },
        );
    });

    it('chama setStepBlocks quando blocos do template são carregados', async () => {
        render(<QuizModularEditor templateId="quiz21StepsComplete" />);

        await waitFor(
            () => {
                expect(setStepBlocks).toHaveBeenCalled();
            },
            { timeout: 3000 },
        );
    });

    it('exibe "Modo Construção Livre" quando não há templateId', async () => {
        render(<QuizModularEditor />);

        await waitFor(() => {
            expect(screen.getByText(/Modo Construção Livre/i)).toBeInTheDocument();
        });
    });
});
