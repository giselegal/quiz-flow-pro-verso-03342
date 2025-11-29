import React from 'react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
// Vitest já injeta expect; garantir extensão jest-dom via setup global ou usar assertions básicas.
import QuizModularEditor from '../index';
// Usamos renderWithProviders para injetar todos os providers (AuthStorage, QueryClient, etc.)

// Canvas / Library / Properties simplificados para acelerar teste e isolar lógica de carregamento
vi.mock('../components/CanvasColumn', () => ({
    default: ({ blocks }: any) => (
        <div data-testid="canvas-column">Canvas Blocks: {blocks?.length}</div>
    )
}));
vi.mock('../components/ComponentLibraryColumn', () => ({
    default: () => <div data-testid="library-column" />
}));
vi.mock('../components/PropertiesColumn', () => ({
    default: () => <div data-testid="properties-column" />
}));
vi.mock('../components/PreviewPanel', () => ({
    default: () => <div data-testid="preview-panel" />
}));
vi.mock('../components/StepNavigatorColumn', () => ({
    default: () => <div data-testid="step-navigator" />
}));

// Mock do TemplateService retornando SEM blocos → força placeholder ou estado vazio
vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        prepareTemplate: vi.fn().mockResolvedValue(undefined),
        steps: {
            list: () => ({ success: true, data: [{ id: 'step-01', name: 'Introdução', order: 1 }] })
        },
        getStep: vi.fn().mockResolvedValue({ success: true, data: [] }),
        invalidateTemplate: vi.fn(),
    }
}));

// Mock de feature flags para evitar autosave interferindo
vi.mock('@/hooks/useFeatureFlags', () => ({
    useFeatureFlags: () => ({ enableAutoSave: false })
}));

// Mock de unified editor (simplificado) devolvendo vazio inicialmente
vi.mock('@/hooks/useSuperUnified', () => ({
    useSuperUnified: () => ({
        state: {
            editor: { currentStep: 1, selectedBlockId: null },
            ui: { isLoading: false }
        },
        setCurrentStep: vi.fn(),
        setStepBlocks: vi.fn(),
        addBlock: vi.fn(),
        removeBlock: vi.fn(),
        reorderBlocks: vi.fn(),
        updateBlock: vi.fn(),
        setSelectedBlock: vi.fn(),
        getStepBlocks: () => [],
        saveFunnel: vi.fn(),
        showToast: vi.fn(),
    })
}));

describe('Diagnóstico Editor - Canvas Vazio', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza estado vazio (sem templateId) e mostra canvas em branco', async () => {
        renderWithProviders(<QuizModularEditor />);

        // Coluna de steps deve existir
        await screen.findByTestId('step-navigator');

        // Sem resource/template → showEmptyState deve aparecer (string "Canvas em branco")
        await screen.findByText(/Canvas em branco/i);
    });

    it('carrega step vazio e exibe placeholder (blocks length = 1) quando hook injeta bloco automático', async () => {
        // Fornecer templateId para disparar carregamento via hook
        renderWithProviders(<QuizModularEditor templateId="quiz21StepsComplete" />);

        await screen.findByTestId('step-navigator');

        // Canvas column deve aparecer
        await screen.findByTestId('canvas-column');

        // Como getStep retorna [], hook cria placeholder → blocks.length esperado = 1
        expect(screen.getByTestId('canvas-column')).toHaveTextContent('Canvas Blocks: 1');
    });
});
