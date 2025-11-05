import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizModularEditor from '../index';

// Mocks consistentes com outros testes
vi.mock('../components/CanvasColumn', () => ({
    default: ({ onRemoveBlock, onUpdateBlock }: any) => (
        <div data-testid="canvas-column">
            <button onClick={() => onRemoveBlock('block-1')}>Remove Block</button>
            <button onClick={() => onUpdateBlock('block-1', { content: { text: 'Updated' } })}>
                Update Block
            </button>
        </div>
    ),
}));
vi.mock('../components/ComponentLibraryColumn', () => ({
    default: ({ onAddBlock }: any) => (
        <div data-testid="library-column">
            <button onClick={() => onAddBlock('TextBlock')}>Add Text Block</button>
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
    default: () => <div data-testid="step-navigator" />,
}));
vi.mock('../StepErrorBoundary', () => ({
    StepErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('@/utils/logger', () => ({ appLogger: { info: vi.fn(), error: vi.fn() } }));

// Mock do serviço canônico
vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        steps: {
            list: () => ({
                success: true,
                data: [{ id: 'step-01', name: 'Introdução', order: 1 }],
            }),
        },
        preloadTemplate: vi.fn().mockResolvedValue(undefined),
        getStep: vi.fn().mockResolvedValue({ success: true, data: [] }),
        invalidateTemplate: vi.fn(),
    },
}));

// Mocks de estado unificado
const addBlock = vi.fn();
const removeBlock = vi.fn();
const updateBlock = vi.fn();
const reorderBlocks = vi.fn();

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
        addBlock,
        removeBlock,
        reorderBlocks,
        updateBlock,
        setSelectedBlock: vi.fn(),
        getStepBlocks: () => [
            { id: 'block-1', type: 'TextBlock', order: 0, properties: {}, content: {} },
        ],
        saveFunnel: vi.fn().mockResolvedValue(undefined),
        showToast: vi.fn(),
    }),
}));

vi.mock('@/hooks/useFeatureFlags', () => ({
    useFeatureFlags: () => ({ enableAutoSave: false }),
}));

describe('QuizModularEditor - Operações de Blocos', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('adiciona bloco ao clicar em "Add Text Block" da biblioteca', async () => {
        render(<QuizModularEditor />);

        const addButton = await waitFor(() => screen.getByText('Add Text Block'));
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(addBlock).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    type: 'TextBlock',
                    properties: {},
                    content: {},
                }),
            );
        });
    });

    it('remove bloco ao clicar em "Remove Block" no canvas', async () => {
        render(<QuizModularEditor />);

        const removeButton = await waitFor(() => screen.getByText('Remove Block'));
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(removeBlock).toHaveBeenCalledWith(1, 'block-1');
        });
    });

    it('atualiza bloco ao clicar em "Update Block" no canvas', async () => {
        render(<QuizModularEditor />);

        const updateButton = await waitFor(() => screen.getByText('Update Block'));
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(updateBlock).toHaveBeenCalledWith(1, 'block-1', {
                content: { text: 'Updated' },
            });
        });
    });
});
