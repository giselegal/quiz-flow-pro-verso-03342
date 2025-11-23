import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock do logger para evitar resolução de alias durante os testes
vi.mock('@/lib/utils/appLogger', () => ({ appLogger: { info: () => { }, warn: () => { }, error: () => { } } }));

// Mocks essenciais para evitar tree of providers complexos
vi.mock('../contexts/providers/SuperUnifiedProvider', () => ({
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
    }),
}));

vi.mock('../hooks/useFeatureFlags', () => ({ useFeatureFlags: () => ({ enableAutoSave: false }) }));
vi.mock('../hooks/useStepPrefetch', () => ({ useStepPrefetch: () => { } }));
vi.mock('../services/canonical/TemplateService', () => ({ templateService: { setActiveFunnel: () => { } } }));
vi.mock('@tanstack/react-query', () => ({ useQueryClient: () => ({}) }));
vi.mock('../contexts/providers/UIProvider', () => ({ useUI: () => ({ state: {} }) }));
vi.mock('../components/editor/EditorLoadingProgress', () => ({ EditorLoadingProgress: () => <div data-testid="editor-loading" /> }));

// Import do componente sob teste após os mocks (caminho relativo)
import QuizModularEditor from '../components/editor/quiz/QuizModularEditor';

describe('QuizModularEditor (smoke)', () => {
    it('renders without crashing (DEV/test mode)', () => {
        render(<QuizModularEditor />);
        expect(true).toBe(true);
    });
});
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mocks essenciais para evitar tree of providers complexos
vi.mock('../contexts/providers/SuperUnifiedProvider', () => ({
    useSuperUnified: () => ({
        state: { editor: { currentStep: 1, selectedBlockId: null, isDirty: false }, currentFunnel: null },
        setCurrentStep: () => { },
        addBlock: () => { },
        import React from 'react';
        import { describe, it, expect, vi } from 'vitest';
        import { render } from '@testing-library/react';

        // Mock do logger para evitar resolução de alias durante os testes
        vi.mock('@/lib/utils/appLogger', () => ({ appLogger: { info: () => { }, warn: () => { }, error: () => { } } }));

        // Mocks essenciais para evitar tree of providers complexos
        vi.mock('../contexts/providers/SuperUnifiedProvider', () => ({
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
            }),
        }));

        // Outros mocks leves
        vi.mock('../hooks/useFeatureFlags', () => ({ useFeatureFlags: () => ({ enableAutoSave: false }) }));
        vi.mock('../hooks/useStepPrefetch', () => ({ useStepPrefetch: () => { } }));
        vi.mock('../services/canonical/TemplateService', () => ({ templateService: { setActiveFunnel: () => { } } }));
        vi.mock('@tanstack/react-query', () => ({ useQueryClient: () => ({}) }));
        vi.mock('../contexts/providers/UIProvider', () => ({ useUI: () => ({ state: {} }) }));
        vi.mock('../components/editor/EditorLoadingProgress', () => ({ EditorLoadingProgress: () => <div data-testid="editor-loading" /> }));

        // Import do componente sob teste após os mocks (caminho relativo)
        import QuizModularEditor from '../components/editor/quiz/QuizModularEditor';

        describe('QuizModularEditor (smoke)', () => {
            it('renders without crashing (DEV/test mode)', () => {
                render(<QuizModularEditor />);
// Se renderizar sem throws, consideramos o smoke bem-sucedido
expect(true).toBe(true);
            });
        });
it('renders without crashing (DEV/test mode)', () => {
