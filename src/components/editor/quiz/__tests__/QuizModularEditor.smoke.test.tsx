import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mocks essenciais para evitar tree of providers complexos
vi.mock('@/hooks/useSuperUnified', () => ({
    useSuperUnified: () => ({
        state: { editor: { currentStep: 1, selectedBlockId: null, isDirty: false }, currentFunnel: null },
        setCurrentStep: () => { },
        addBlock: () => { },
        removeBlock: () => { },
        reorderBlocks: () => { },
        updateBlock: () => { },
        getStepBlocks: () => [],
        setStepBlocks: () => { },
        setSelectedBlock: () => { },
        saveFunnel: async () => ({ success: true }),
        publishFunnel: async () => ({ success: true }),
        saveStepBlocks: async () => ({ success: true }),
        undo: () => { },
        redo: () => { },
        canUndo: false,
        canRedo: false,
        showToast: () => { },
    }));

// Other lightweight mocks
vi.mock('@/hooks/useFeatureFlags', () => ({ useFeatureFlags: () => ({ enableAutoSave: false }) }));
vi.mock('@/hooks/useStepPrefetch', () => ({ useStepPrefetch: () => { } }));
vi.mock('@/services/canonical/TemplateService', () => ({ templateService: { setActiveFunnel: () => { } } }));
vi.mock('@tanstack/react-query', () => ({ useQueryClient: () => ({}) }));
vi.mock('@/contexts/providers/UIProvider', () => ({ useUI: () => ({ state: {} }) }));
vi.mock('@/components/editor/EditorLoadingProgress', () => ({ EditorLoadingProgress: () => <div data-testid="editor-loading" /> }));

// Import component under test after mocks
import QuizModularEditor from '@/components/editor/quiz/QuizModularEditor';

describe('QuizModularEditor (smoke)', () => {
    it('renders without crashing (DEV/test mode)', () => {
        render(<QuizModularEditor />);
        // If render completes without error, we consider smoke successful
        expect(true).toBe(true);
    });
});
