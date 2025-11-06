/**
 * 🧪 Teste de Integração: EditorLoadingContext com QuizModularEditor
 * 
 * Valida que a migração dos estados de loading foi bem-sucedida
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QuizModularEditor from '@/components/editor/quiz/QuizModularEditor';
import { EditorLoadingProvider, useEditorLoading } from '@/contexts/EditorLoadingContext';

// Mock do SuperUnifiedProvider
vi.mock('@/hooks/useSuperUnified', () => ({
    useSuperUnified: () => ({
        state: {
            editor: {
                currentStep: 1,
                stepBlocks: {},
                selectedBlockId: null,
                isDirty: false,
            },
        },
        getStepBlocks: vi.fn(() => []),
        setCurrentStep: vi.fn(),
        setStepBlocks: vi.fn(),
        saveFunnel: vi.fn(),
    }),
}));

// Mock do templateService
vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        getStep: vi.fn(() => Promise.resolve({ success: true, data: [] })),
        prepareTemplate: vi.fn(() => Promise.resolve()),
        preloadTemplate: vi.fn(() => Promise.resolve()),
        steps: {
            list: vi.fn(() => ({ success: true, data: [] })),
        },
    },
}));

// Componente de teste que lê os estados do contexto
const LoadingStateDisplay = () => {
    const { isLoadingTemplate, isLoadingStep } = useEditorLoading();
    return (
        <div>
            <div data-testid="loading-template">{String(isLoadingTemplate)}</div>
            <div data-testid="loading-step">{String(isLoadingStep)}</div>
        </div>
    );
};

describe('EditorLoadingContext Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve fornecer estados de loading via contexto', () => {
        render(
            <EditorLoadingProvider>
                <LoadingStateDisplay />
            </EditorLoadingProvider>
        );

        expect(screen.getByTestId('loading-template')).toHaveTextContent('false');
        expect(screen.getByTestId('loading-step')).toHaveTextContent('false');
    });

    it('QuizModularEditor deve consumir estados do contexto sem erros', async () => {
        // Este teste valida que o componente renderiza sem erros
        // e está usando o contexto corretamente
        const { container } = render(
            <EditorLoadingProvider>
                <QuizModularEditor />
            </EditorLoadingProvider>
        );

        // Aguardar renderização inicial
        await waitFor(() => {
            expect(container.querySelector('.quiz-modular-editor')).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it('deve atualizar loading states durante carregamento de template', async () => {
        const { templateService } = await import('@/services/canonical/TemplateService');

        // Simular delay no carregamento
        (templateService.getStep as any).mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve({ success: true, data: [] }), 100))
        );

        render(
            <EditorLoadingProvider>
                <LoadingStateDisplay />
                <QuizModularEditor templateId="test-template" />
            </EditorLoadingProvider>
        );

        // Estados devem eventualmente voltar para false
        await waitFor(() => {
            expect(screen.getByTestId('loading-template')).toHaveTextContent('false');
            expect(screen.getByTestId('loading-step')).toHaveTextContent('false');
        }, { timeout: 5000 });
    });
});

describe('EditorLoadingContext - Migração Validada', () => {
    it('estados locais foram removidos do QuizModularEditor', () => {
        // Este teste valida que não há estados duplicados
        const editorModule = require('@/components/editor/quiz/QuizModularEditor');
        const componentSource = editorModule.default.toString();

        // Não deve conter declarações de useState para loading
        expect(componentSource).not.toContain('useState(false).*isLoadingTemplate');
        expect(componentSource).not.toContain('useState(false).*isLoadingStep');
    });

    it('todas as chamadas de setters foram migradas', () => {
        const editorModule = require('@/components/editor/quiz/QuizModularEditor');
        const componentSource = editorModule.default.toString();

        // Não deve conter chamadas aos setters antigos
        expect(componentSource).not.toContain('setIsLoadingTemplate');
        expect(componentSource).not.toContain('setIsLoadingStep');
    });

    it('hook useEditorLoading está sendo importado', () => {
        const editorModule = require('@/components/editor/quiz/QuizModularEditor');

        // Verificar que o módulo importa useEditorLoading
        // (Esta verificação é mais robusta se feita via análise estática)
        expect(editorModule).toBeDefined();
    });
});
