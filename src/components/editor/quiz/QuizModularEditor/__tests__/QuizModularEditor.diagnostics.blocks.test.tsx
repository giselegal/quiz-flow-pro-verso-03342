import React from 'react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
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

// Mock do unifiedTemplateLoader retornando blocos reais
const mockBlocks = [
    { id: 'b1', type: 'text', order: 0, properties: {}, content: { text: 'Olá' } },
    { id: 'b2', type: 'image', order: 1, properties: {}, content: { src: 'x.png' } },
];

vi.mock('@/services/templates/UnifiedTemplateLoader', () => ({
    unifiedTemplateLoader: {
        loadStep: vi.fn().mockImplementation(async (_stepId: string) => ({
            data: mockBlocks,
            source: 'v4',
            loadTime: 2,
            fromCache: false,
        })),
    },
}));

vi.mock('@/hooks/useFeatureFlags', () => ({
    useFeatureFlags: () => ({ enableAutoSave: false })
}));

// Unified editor devolve bloco via getStepBlocks após setStepBlocks
const setStepBlocksSpy = vi.fn();
vi.mock('@/hooks/useSuperUnified', () => ({
    useSuperUnified: () => ({
        state: {
            editor: { currentStep: 1, selectedBlockId: null },
            ui: { isLoading: false },
        },
        setCurrentStep: vi.fn(),
        setStepBlocks: setStepBlocksSpy,
        addBlock: vi.fn(),
        removeBlock: vi.fn(),
        reorderBlocks: vi.fn(),
        updateBlock: vi.fn(),
        setSelectedBlock: vi.fn(),
        getStepBlocks: () => mockBlocks,
        saveFunnel: vi.fn(),
        showToast: vi.fn(),
    }),
}));

describe('Diagnóstico Editor - Renderização com blocos', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza blocos quando getStep retorna lista não vazia', async () => {
        renderWithProviders(<QuizModularEditor templateId="quiz21StepsComplete" />);

        // Pode haver múltiplos navegadores (layout + colunas) -> usar findAll
        await screen.findAllByTestId('step-navigator');
        await screen.findByTestId('canvas-column');

        // Deve mostrar blocos
        expect(screen.getByTestId('block-b1')).toBeInTheDocument();
        expect(screen.getByTestId('block-b2')).toBeInTheDocument();
        expect(screen.getByText(/Count:2/)).toBeInTheDocument();

        // setStepBlocks deve ter sido chamado para injetar no unified
        expect(setStepBlocksSpy).toHaveBeenCalled();
    });
});
