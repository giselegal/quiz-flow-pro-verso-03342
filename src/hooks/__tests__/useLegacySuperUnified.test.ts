import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mocks: substituir hooks/providers usados internamente por versões mínimas
vi.mock('../../contexts/auth/AuthProvider', () => ({ useAuth: () => ({ user: { id: 'u1' }, isLogged: true }) }));
vi.mock('../../contexts/theme/ThemeProvider', () => ({ useTheme: () => ({ theme: 'light' }) }));
vi.mock('../../contexts/editor/EditorStateProvider', () => ({ useEditorState: () => ({ currentStep: 1, selectBlock: () => {}, dirtySteps: {}, setCurrentStep: () => {}, addBlock: () => {}, removeBlock: () => {}, reorderBlocks: () => {}, updateBlock: () => {}, setStepBlocks: () => {}, setSelectedBlock: () => {} }) }));
vi.mock('../../contexts/funnel/FunnelDataProvider', () => ({ useFunnelData: () => ({ currentFunnel: null }) }));
vi.mock('../../contexts/navigation/NavigationProvider', () => ({ useNavigation: () => ({ navigate: () => {} }) }));
vi.mock('../../contexts/quiz/QuizStateProvider', () => ({ useQuizState: () => ({}) }));
vi.mock('../../contexts/result/ResultProvider', () => ({ useResult: () => ({}) }));
vi.mock('../../contexts/storage/StorageProvider', () => ({ useStorage: () => ({}) }));
vi.mock('../../contexts/sync/SyncProvider', () => ({ useSync: () => ({}) }));
vi.mock('../../contexts/validation/ValidationProvider', () => ({ useValidation: () => ({}) }));
vi.mock('../../contexts/collaboration/CollaborationProvider', () => ({ useCollaboration: () => ({}) }));
vi.mock('../../contexts/versioning/VersioningProvider', () => ({ useVersioning: () => ({}) }));
vi.mock('../../contexts/providers/UIProvider', () => ({ useUI: () => ({ state: {}, showToast: () => {} }) }));
vi.mock('../../components/editor/quiz/QuizModularEditor/hooks/useEditorPersistence', () => ({ useEditorPersistence: () => ({ saveStepBlocks: async () => ({ success: true }) }) }));
vi.mock('../../hooks/core/useUnifiedEditor', () => ({ useUnifiedEditor: () => ({ saveFunnel: async () => ({ success: true }), createFunnel: async () => 'id', undo: () => {}, redo: () => {}, canUndo: false, canRedo: false }) }));

// Now import the hook under test (path relativo)
import { useLegacySuperUnified } from '../useLegacySuperUnified';

describe('useLegacySuperUnified (smoke)', () => {
  it('should return an object with expected shape', () => {
    const { result } = renderHook(() => useLegacySuperUnified());
    const value = result.current;

    expect(value).toBeDefined();
    expect(typeof value.setCurrentStep).toBe('function');
    expect(typeof value.saveFunnel).toBe('function');
    expect(value.state).toBeDefined();
    expect(value.state.editor).toBeDefined();
  });
});
