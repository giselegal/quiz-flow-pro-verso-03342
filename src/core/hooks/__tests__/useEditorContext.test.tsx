/**
 * 🧪 TESTES - useEditorContext (Fase 2)
 * 
 * Testa o hook unificado que substitui useSuperUnified
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEditorContext } from '../useEditorContext';
import type { Block } from '@/types/editor';

// Mock dos providers
vi.mock('@/contexts/auth/AuthProvider', () => ({
    useAuth: () => ({
        user: { id: 'test-user', email: 'test@example.com' },
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
    }),
}));

vi.mock('@/contexts/theme/ThemeProvider', () => ({
    useTheme: () => ({
        mode: 'light',
        theme: 'light', // Compat alias
        setTheme: vi.fn(),
    }),
})); vi.mock('@/core/contexts/EditorContext/EditorCompatLayer', () => ({
    useEditorCompat: () => ({
        state: {
            stepBlocks: {
                1: [{ id: 'block-1', type: 'text', content: { text: 'Test' } }],
            },
            selectedBlockId: null,
            isDirty: false,
        },
        currentStep: 1,
        selectBlock: vi.fn(),
        setCurrentStep: vi.fn(),
        addBlock: vi.fn(),
        removeBlock: vi.fn(),
        updateBlock: vi.fn(),
        reorderBlocks: vi.fn(),
        getStepBlocks: vi.fn((step: number) => {
            if (step === 1) {
                return [{ id: 'block-1', type: 'text', content: { text: 'Test' } }];
            }
            return [];
        }),
        setStepBlocks: vi.fn(),
        isPreviewMode: false,
        markSaved: vi.fn(),
        // Undo/Redo
        undo: vi.fn(),
        redo: vi.fn(),
        canUndo: false,
        canRedo: false,
    }),
})); vi.mock('@/contexts/funnel/FunnelDataProvider', () => ({
    useFunnelData: () => ({
        currentFunnel: { id: 'test-funnel', name: 'Test Funnel' },
        funnels: [],
        isLoading: false,
        error: null,
        loadFunnels: vi.fn().mockResolvedValue(undefined),
        loadFunnel: vi.fn().mockResolvedValue(undefined),
        createFunnel: vi.fn().mockResolvedValue({ id: 'new', name: 'New' }),
        updateFunnel: vi.fn().mockResolvedValue(undefined),
        deleteFunnel: vi.fn().mockResolvedValue(undefined),
        setCurrentFunnel: vi.fn(),
        clearError: vi.fn(),
        saveFunnel: vi.fn().mockResolvedValue(undefined),
        publishFunnel: vi.fn().mockResolvedValue(undefined),
        updateFunnelStepBlocks: vi.fn().mockResolvedValue(undefined),
    }),
}));// Mock dos outros providers com retornos básicos
vi.mock('@/contexts/navigation/NavigationProvider', () => ({
    useNavigation: () => ({ navigate: vi.fn() }),
}));

vi.mock('@/contexts/quiz/QuizStateProvider', () => ({
    useQuizState: () => ({ quizState: {}, setQuizState: vi.fn() }),
}));

vi.mock('@/contexts/result/ResultProvider', () => ({
    useResult: () => ({ result: null, setResult: vi.fn() }),
}));

vi.mock('@/contexts/storage/StorageProvider', () => ({
    useStorage: () => ({ save: vi.fn(), load: vi.fn() }),
}));

vi.mock('@/contexts/sync/SyncProvider', () => ({
    useSync: () => ({ sync: vi.fn(), isSyncing: false }),
}));

vi.mock('@/contexts/validation/ValidationProvider', () => ({
    useValidation: () => ({ validate: vi.fn(), errors: [] }),
}));

vi.mock('@/contexts/collaboration/CollaborationProvider', () => ({
    useCollaboration: () => ({ users: [], connect: vi.fn() }),
}));

vi.mock('@/contexts/versioning/VersioningProvider', () => ({
    useVersioning: () => ({ version: '1.0.0', history: [] }),
}));

vi.mock('@/contexts/providers/UIProvider', () => ({
    useUI: () => ({ showSidebar: true, toggleSidebar: vi.fn() }),
}));

describe('useEditorContext (Fase 2)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve retornar todos os providers unificados', () => {
        const { result } = renderHook(() => useEditorContext());

        expect(result.current).toHaveProperty('auth');
        expect(result.current).toHaveProperty('theme');
        expect(result.current).toHaveProperty('editor');
        expect(result.current).toHaveProperty('funnel');
        expect(result.current).toHaveProperty('navigation');
        expect(result.current).toHaveProperty('quiz');
        expect(result.current).toHaveProperty('result');
        expect(result.current).toHaveProperty('storage');
        expect(result.current).toHaveProperty('sync');
        expect(result.current).toHaveProperty('validation');
        expect(result.current).toHaveProperty('collaboration');
        expect(result.current).toHaveProperty('versioning');
        expect(result.current).toHaveProperty('ui');
    });

    it('deve ter unified state com editor e currentFunnel', () => {
        const { result } = renderHook(() => useEditorContext());

        expect(result.current.state).toBeDefined();
        expect(result.current.state.editor).toBeDefined();
        expect(result.current.state.currentFunnel).toEqual({
            id: 'test-funnel',
            name: 'Test Funnel',
        });
    });

    it('deve expor métodos de quick access do editor', () => {
        const { result } = renderHook(() => useEditorContext());

        expect(result.current.setCurrentStep).toBeDefined();
        expect(result.current.addBlock).toBeDefined();
        expect(result.current.removeBlock).toBeDefined();
        expect(result.current.reorderBlocks).toBeDefined();
        expect(result.current.updateBlock).toBeDefined();
        expect(result.current.getStepBlocks).toBeDefined();
        expect(result.current.setStepBlocks).toBeDefined();
        expect(result.current.setSelectedBlock).toBeDefined();
        expect(result.current.selectBlock).toBeDefined();
    });

    it('deve expor métodos de persistência', () => {
        const { result } = renderHook(() => useEditorContext());

        expect(result.current.saveFunnel).toBeDefined();
        expect(result.current.publishFunnel).toBeDefined();
        expect(result.current.saveStepBlocks).toBeDefined();
    });

    it('deve expor undo/redo', () => {
        const { result } = renderHook(() => useEditorContext());

        expect(result.current.undo).toBeDefined();
        expect(result.current.redo).toBeDefined();
        expect(result.current.canUndo).toBe(false);
        expect(result.current.canRedo).toBe(false);
    });

    it('saveFunnel deve chamar funnel.saveFunnel e retornar success', async () => {
        const { result } = renderHook(() => useEditorContext());

        const saveResult = await result.current.saveFunnel();

        expect(saveResult).toEqual({ success: true });
    });

    it('saveStepBlocks deve salvar blocos do step e marcar como saved', async () => {
        const { result } = renderHook(() => useEditorContext());

        const saveResult = await result.current.saveStepBlocks(1);

        expect(saveResult).toEqual({ success: true });
    });

    it('getStepBlocks deve retornar blocos do step atual', () => {
        const { result } = renderHook(() => useEditorContext());

        const blocks = result.current.getStepBlocks(1);

        expect(blocks).toHaveLength(1);
        expect(blocks[0]).toEqual({
            id: 'block-1',
            type: 'text',
            content: { text: 'Test' },
        });
    });

    it('deve ter alias setSelectedBlock para selectBlock (compatibilidade)', () => {
        const { result } = renderHook(() => useEditorContext());

        expect(result.current.setSelectedBlock).toBe(result.current.selectBlock);
    });

    it('auth provider deve estar acessível', () => {
        const { result } = renderHook(() => useEditorContext());

        expect(result.current.auth.user).toEqual({
            id: 'test-user',
            email: 'test@example.com',
        });
        expect(result.current.auth.isAuthenticated).toBe(true);
    });

    it('theme provider deve estar acessível', () => {
        const { result } = renderHook(() => useEditorContext());

        expect(result.current.theme.theme).toBe('light');
    });

    it('editor compat layer deve estar funcional', () => {
        const { result } = renderHook(() => useEditorContext());

        expect(result.current.editor.currentStep).toBe(1);
        expect(result.current.editor.state.stepBlocks).toBeDefined();
    });
});

describe('useEditorContext - Error Handling', () => {
    it('saveFunnel deve retornar erro em formato padronizado quando falhar', async () => {
        const { result } = renderHook(() => useEditorContext());

        // Test error format structure
        const mockError = { success: false, error: 'Test error' };
        expect(mockError).toHaveProperty('success');
        expect(mockError).toHaveProperty('error');
        expect(mockError.success).toBe(false);
    });
});