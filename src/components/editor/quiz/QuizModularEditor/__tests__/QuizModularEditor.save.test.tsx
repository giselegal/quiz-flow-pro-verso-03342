import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizModularEditor from '../index';

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
    default: () => <div data-testid="nav-column" />,
}));
vi.mock('../StepErrorBoundary', () => ({
    StepErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('@/utils/logger', () => ({ appLogger: { info: vi.fn(), error: vi.fn() } }));

// Mock do serviço canônico mínimo
vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        steps: { list: () => ({ success: true, data: [] }) },
        preloadTemplate: vi.fn(),
        getStep: vi.fn(),
        invalidateTemplate: vi.fn(),
    },
}));

// Mock do estado unificado com spies
const saveFunnel = vi.fn().mockResolvedValue(undefined);
const showToast = vi.fn();

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
        setStepBlocks: vi.fn(),
        addBlock: vi.fn(),
        removeBlock: vi.fn(),
        reorderBlocks: vi.fn(),
        updateBlock: vi.fn(),
        setSelectedBlock: vi.fn(),
        getStepBlocks: () => [],
        saveFunnel,
        showToast,
    }),
}));

vi.mock('@/hooks/useFeatureFlags', () => ({
    useFeatureFlags: () => ({ enableAutoSave: false }),
}));


describe('QuizModularEditor - Save manual', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('clica em Salvar e dispara saveFunnel + showToast de sucesso', async () => {
        render(<QuizModularEditor />);

        const saveButton = screen.getByRole('button', { name: /Salvar/i });
        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        expect(saveFunnel).toHaveBeenCalledTimes(1);

        // showToast deve ser chamado com sucesso; validamos o shape básico
        expect(showToast).toHaveBeenCalled();
        const payload = showToast.mock.calls[0][0];
        expect(payload?.type).toBe('success');
        expect(payload?.title).toBeTruthy();
    });
});
