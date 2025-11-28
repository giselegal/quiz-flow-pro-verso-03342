import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';

// Mock duplicateFunnel adapter
vi.mock('@/features/editor/model/editorAdapter', () => ({
    duplicateFunnel: vi.fn(async () => ({ success: true, clonedFunnel: { id: 'cloned-123' }, stats: { clonedBlocks: 10, durationMs: 50 } })),
    createEditorCommandsAdapter: (legacy: any) => legacy,
}));

// Mock feature flags to ensure button uses new flow
vi.mock('@/core/utils/featureFlags', () => ({
    getFeatureFlag: (k: string) => (k === 'useFunnelCloneService' ? true : false),
}));

// Mock editor adapter hook to avoid TDZ issues and provide actions
vi.mock('@/hooks/useEditorAdapter', () => ({
    default: () => ({ actions: { addBlock: vi.fn(), updateBlock: vi.fn() } })
}));

// Mock EditorLoadingProvider deps to simplify rendering
vi.mock('@/contexts/EditorLoadingContext', () => ({
    EditorLoadingProvider: ({ children }: any) => <div>{children}</div>,
    useEditorLoading: () => ({ isLoadingTemplate: false, isLoadingStep: false, setTemplateLoading: () => { }, setStepLoading: () => { } }),
}));

// Mock core unified editor context minimally
vi.mock('@/core', () => ({
    useEditorContext: () => ({
        state: {
            editor: {
                currentStep: 1,
                selectedBlockId: null,
                isDirty: false,
                stepBlocks: { 1: [] },
            },
            currentFunnel: { id: 'funnel-abc' },
        },
        setCurrentStep: () => { },
        addBlock: () => { },
        saveFunnel: async () => { },
        saveStepBlocks: async () => { },
        publishFunnel: async () => { },
        getStepBlocks: () => [],
        setStepBlocks: () => { },
        setSelectedBlock: () => { },
        undo: () => { },
        redo: () => { },
        canUndo: false,
        canRedo: false,
        removeBlock: () => { },
        reorderBlocks: () => { },
        updateBlock: () => { },
        funnel: { createFunnel: async () => ({ id: 'new-funnel' }) },
        ux: { showToast: () => { } },
    }),
    persistenceService: { saveBlocks: async () => ({ success: true }) },
    validateBlock: () => ({ success: true }),
    useAutoSave: () => ({ isSaving: false, lastSaved: null, error: null, forceSave: async () => { } }),
}));

// Mock template service
vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        getStep: async () => ({ success: true, data: [] }),
        steps: { list: async () => ({ success: true, data: [] }) },
    },
}));

// Simplify StepNavigatorColumn to avoid internal query dependencies
vi.mock('@/components/editor/quiz/QuizModularEditor/components/StepNavigatorColumn', () => ({
    default: () => (<div role="navigation">Step Navigator</div>)
}));

// Prevent navigation side-effect
const originalLocation = window.location;
beforeEach(() => {
    Object.defineProperty(window, 'location', {
        configurable: true,
        value: { href: '', assign: vi.fn() },
    });
});

import QuizModularEditor from '@/components/editor/quiz/QuizModularEditor';

describe('QuizModularEditor - Duplicar smoke', () => {
    it('clica no botão Duplicar e chama fluxo com sucesso', async () => {
        const user = userEvent.setup();
        const qc = new QueryClient();
        render(
            <QueryClientProvider client={qc}>
                <QuizModularEditor resourceId="funnel-abc" />
            </QueryClientProvider>
        );

        const btn = await screen.findByRole('button', { name: /duplicar/i });
        await user.click(btn);

        // Navegação deve ser acionada para o novo funil
        expect((window.location as any).href).toContain('/editor/');
    });
});
