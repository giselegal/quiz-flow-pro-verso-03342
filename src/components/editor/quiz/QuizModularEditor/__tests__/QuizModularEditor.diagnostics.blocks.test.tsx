import React from 'react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
// Removido import direto de jest-dom; usar matchers básicos.
import QuizModularEditor from '../index';
// Substitui wrappers manuais por renderWithProviders (injeta AuthStorage, QueryClient, etc.)

// Mocks simplificados
vi.mock('../components/CanvasColumn', () => ({
    default: ({ blocks, onBlockSelect }: any) => (
        <div data-testid="canvas-column">
            {blocks.map((b: any) => (
                <div key={b.id} data-testid={`block-${b.id}`} onClick={() => onBlockSelect?.(b.id)}>{b.type}</div>
            ))}
            <div>Count:{blocks.length}</div>
        </div>
    )
}));
vi.mock('../components/ComponentLibraryColumn', () => ({ default: () => <div /> }));
vi.mock('../components/PropertiesColumn', () => ({ default: () => <div data-testid="properties-column" /> }));
vi.mock('../components/PreviewPanel', () => ({ default: () => <div /> }));
vi.mock('../components/StepNavigatorColumn', () => ({ default: () => <div data-testid="step-navigator" /> }));

// Mock do TemplateService retornando blocos reais
const mockBlocks = [
    { id: 'b1', type: 'TextBlock', order: 0, properties: {}, content: { text: 'Olá' } },
    { id: 'b2', type: 'ImageBlock', order: 1, properties: {}, content: { src: 'x.png' } },
];

vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        prepareTemplate: vi.fn().mockResolvedValue(undefined),
        steps: { list: () => ({ success: true, data: [{ id: 'step-01', name: 'Introdução', order: 1 }] }) },
        getStep: vi.fn().mockImplementation((_stepId: string) => ({ success: true, data: mockBlocks })),
        invalidateTemplate: vi.fn(),
    }
}));

vi.mock('@/hooks/useFeatureFlags', () => ({
    useFeatureFlags: () => ({ enableAutoSave: false })
}));

// Unified editor devolve vazio inicialmente; hook deve popular depois
const setStepBlocksSpy = vi.fn();
vi.mock('@/hooks/useSuperUnified', () => ({
    useSuperUnified: () => ({
        state: {
            editor: { currentStep: 1, selectedBlockId: null },
            ui: { isLoading: false }
        },
        setCurrentStep: vi.fn(),
        setStepBlocks: setStepBlocksSpy,
        addBlock: vi.fn(),
        removeBlock: vi.fn(),
        reorderBlocks: vi.fn(),
        updateBlock: vi.fn(),
        setSelectedBlock: vi.fn(),
        getStepBlocks: () => mockBlocks, // após reset esperado
        saveFunnel: vi.fn(),
        showToast: vi.fn(),
    })
}));

describe('Diagnóstico Editor - Renderização com blocos', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza blocos quando getStep retorna lista não vazia', async () => {
        renderWithProviders(<QuizModularEditor templateId="quiz21StepsComplete" />);

        await waitFor(() => expect(screen.getByTestId('step-navigator')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByTestId('canvas-column')).toBeInTheDocument());

        // Deve mostrar blocos
        expect(screen.getByTestId('block-b1')).toBeInTheDocument();
        expect(screen.getByTestId('block-b2')).toBeInTheDocument();
        expect(screen.getByText(/Count:2/)).toBeInTheDocument();

        // setStepBlocks deve ter sido chamado para injetar no unified
        expect(setStepBlocksSpy).toHaveBeenCalled();
    });
});
