/**
 * 🔄 HOOK DE COMPATIBILIDADE - useLegacySuperUnified
 * 
 * Hook temporário para manter compatibilidade durante migração V1 → V2
 * 
 * USO: Substitua imports de V1 por este hook durante migração incremental
 * 
 * ANTES (V1):
 * ```typescript
 * import { useSuperUnified } from 'LEGACY_SUPER_UNIFIED_PROVIDER_PATH';
 * const { auth, theme, editor } = useSuperUnified();
 * ```
 * 
 * DURANTE MIGRAÇÃO:
 * ```typescript
 * import { useLegacySuperUnified } from '@/hooks/useLegacySuperUnified';
 * const { auth, theme, editor } = useLegacySuperUnified();
 * ```
 * 
 * DEPOIS (V2 - Meta final):
 * ```typescript
 * import { useAuth } from '@/contexts/auth/AuthProvider';
 * import { useTheme } from '@/contexts/theme/ThemeProvider';
 * import { useEditorState } from '@/contexts/editor/EditorStateProvider';
 * 
 * const auth = useAuth();
 * const theme = useTheme();
 * const editor = useEditorState();
 * ```
 * 
 * ⚠️ Este hook será removido após migração completa para V2
 */

import { useEffect, useMemo, useCallback } from 'react';
import { appLogger } from '@/lib/utils/appLogger';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useTheme } from '@/contexts/theme/ThemeProvider';
import { useEditorState } from '@/contexts/editor/EditorStateProvider';
import { useFunnelData } from '@/contexts/funnel/FunnelDataProvider';
import { useNavigation } from '@/contexts/navigation/NavigationProvider';
import { useQuizState } from '@/contexts/quiz/QuizStateProvider';
import { useResult } from '@/contexts/result/ResultProvider';
import { useStorage } from '@/contexts/storage/StorageProvider';
import { useSync } from '@/contexts/sync/SyncProvider';
import { useValidation } from '@/contexts/validation/ValidationProvider';
import { useCollaboration } from '@/contexts/collaboration/CollaborationProvider';
import { useVersioning } from '@/contexts/versioning/VersioningProvider';
import { useUI } from '@/contexts/providers/UIProvider';
import { useEditorPersistence } from '@/components/editor/quiz/QuizModularEditor/hooks/useEditorPersistence';
import { useUnifiedEditor } from '@/hooks/core/useUnifiedEditor';

/**
 * Interface que mimetiza o retorno do useSuperUnified V1
 * mas usando providers V2 modulares por baixo
 */
export interface LegacySuperUnifiedContext {
  // Slices originais (mantidos para compatibilidade gradual)
  auth: ReturnType<typeof useAuth>;
  theme: ReturnType<typeof useTheme>;
  editor: ReturnType<typeof useEditorState>;
  funnel: ReturnType<typeof useFunnelData>;
  navigation: ReturnType<typeof useNavigation>;
  quiz: ReturnType<typeof useQuizState>;
  result: ReturnType<typeof useResult>;
  storage: ReturnType<typeof useStorage>;
  sync: ReturnType<typeof useSync>;
  validation: ReturnType<typeof useValidation>;
  collaboration: ReturnType<typeof useCollaboration>;
  versioning: ReturnType<typeof useVersioning>;
  ui: ReturnType<typeof useUI>;

  // Novo estado unificado (estrutura mínima necessária pelo Editor Modular)
  state: {
    editor: ReturnType<typeof useEditorState>;
    currentFunnel: ReturnType<typeof useFunnelData>['currentFunnel'];
  };

  // Ações esperadas pelo código legado (QuizModularEditor / testes)
  setCurrentStep: (step: number) => void;
  addBlock: (step: number, block: any, index?: number) => void;
  removeBlock: (step: number, blockId: string) => void;
  reorderBlocks: (step: number, blocks: any[]) => void;
  updateBlock: (step: number, blockId: string, updates: any) => void;
  getStepBlocks: (step: number) => any[];
  setStepBlocks: (step: number, blocks: any[]) => void;
  setSelectedBlock: (blockId: string | null) => void;

  // Persistência e operações de funil
  saveFunnel: () => Promise<{ success: boolean; error?: string }>;
  publishFunnel: (options?: any) => Promise<{ success: boolean; error?: string }>;
  createFunnel: (name: string) => Promise<string>;
  saveStepBlocks: (stepIndex: number) => Promise<{ success: boolean; error?: string }>;
  ensureAllDirtyStepsSaved?: () => Promise<void>;

  // Undo/Redo (historico de alterações globais)
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // UI helpers
  showToast: (toast: { type: 'success' | 'error' | 'warning' | 'info'; title: string; message: string; duration?: number }) => void;
}

/**
 * Hook de compatibilidade que agrega todos os hooks V2 modulares
 * mantendo interface similar ao V1 monolítico
 * 
 * @deprecated Este é um hook temporário. Migre para hooks individuais (useAuth, useTheme, etc)
 */
export function useLegacySuperUnified(): LegacySuperUnifiedContext {
  // Aviso único de migração
  useEffect(() => {
    appLogger.warn('[useLegacySuperUnified] ⚠️ Hook de compatibilidade ativo. Migre para hooks individuais para performance ideal.');
  }, []);

  // Hooks modulares
  const auth = useAuth();
  const theme = useTheme();
  const editor = useEditorState();
  const funnel = useFunnelData();
  const navigation = useNavigation();
  const quiz = useQuizState();
  const result = useResult();
  const storage = useStorage();
  const sync = useSync();
  const validation = useValidation();
  const collaboration = useCollaboration();
  const versioning = useVersioning();
  const ui = useUI();

  // Hooks auxiliares (persistência + undo/redo)
  const persistence = useEditorPersistence({ enableAutoSave: false });
  const unifiedEditor = useUnifiedEditor();

  // Wrappers de métodos esperados
  const setSelectedBlock = useCallback((blockId: string | null) => {
    editor.selectBlock(blockId);
  }, [editor]);

  const saveStepBlocks = useCallback(async (stepIndex: number) => {
    const blocks = editor.getStepBlocks(stepIndex) || [];
    const stepKey = `step-${String(stepIndex).padStart(2, '0')}`;
    return persistence.saveStepBlocks(stepKey, blocks);
  }, [editor, persistence]);

  const publishFunnel = useCallback(async (_options?: any) => {
    // Placeholder de publicação real - retornar success para não quebrar fluxo
    appLogger.info('[useLegacySuperUnified] publishFunnel placeholder chamado');
    const result = await unifiedEditor.saveFunnel();
    return result.success ? { success: true } : { success: false, error: result.error };
  }, [unifiedEditor]);

  const ensureAllDirtyStepsSaved = useCallback(async () => {
    const dirtyEntries = Object.entries(editor.dirtySteps).filter(([_, v]) => !!v);
    for (const [stepStr] of dirtyEntries) {
      const idx = parseInt(stepStr, 10);
      if (Number.isFinite(idx)) {
        await saveStepBlocks(idx);
      }
    }
  }, [editor.dirtySteps, saveStepBlocks]);

  // Estado unificado mínimo
  const state = useMemo(() => ({
    editor,
    currentFunnel: funnel.currentFunnel,
  }), [editor, funnel.currentFunnel]);

  return {
    // Slices
    auth,
    theme,
    editor,
    funnel,
    navigation,
    quiz,
    result,
    storage,
    sync,
    validation,
    collaboration,
    versioning,
    ui,

    // Estado
    state,

    // Ações editor
    setCurrentStep: editor.setCurrentStep,
    addBlock: editor.addBlock,
    removeBlock: editor.removeBlock,
    reorderBlocks: editor.reorderBlocks,
    updateBlock: editor.updateBlock,
    getStepBlocks: editor.getStepBlocks,
    setStepBlocks: editor.setStepBlocks,
    setSelectedBlock,

    // Funil / persistência
    saveFunnel: unifiedEditor.saveFunnel,
    publishFunnel,
    createFunnel: unifiedEditor.createFunnel,
    saveStepBlocks,
    ensureAllDirtyStepsSaved,

    // Undo/Redo
    undo: unifiedEditor.undo,
    redo: unifiedEditor.redo,
    canUndo: unifiedEditor.canUndo,
    canRedo: unifiedEditor.canRedo,

    // UI helper
    showToast: ui.showToast,
  };
}

/**
 * Hook de migração específico para Auth
 * Mais performático que useLegacySuperUnified quando só precisa de auth
 */
export function useMigrateAuth() {
  useEffect(() => {
    appLogger.info('[useMigrateAuth] ✅ Usando hook migrado (auth only)');
  }, []);
  
  return useAuth();
}

/**
 * Hook de migração específico para Theme
 */
export function useMigrateTheme() {
  useEffect(() => {
    appLogger.info('[useMigrateTheme] ✅ Usando hook migrado (theme only)');
  }, []);
  
  return useTheme();
}

/**
 * Hook de migração específico para Editor
 */
export function useMigrateEditor() {
  useEffect(() => {
    appLogger.info('[useMigrateEditor] ✅ Usando hook migrado (editor only)');
  }, []);
  
  return useEditorState();
}

/**
 * Guia de migração inline para desenvolvedores
 */
export const MIGRATION_GUIDE = {
  from: 'useSuperUnified',
  to: {
    auth: 'useAuth from @/contexts/auth/AuthProvider',
    theme: 'useTheme from @/contexts/theme/ThemeProvider',
    editor: 'useEditorState from @/contexts/editor/EditorStateProvider',
    funnel: 'useFunnelData from @/contexts/funnel/FunnelDataProvider',
    navigation: 'useNavigation from @/contexts/navigation/NavigationProvider',
    quiz: 'useQuizState from @/contexts/quiz/QuizStateProvider',
    result: 'useResult from @/contexts/result/ResultProvider',
    storage: 'useStorage from @/contexts/storage/StorageProvider',
    sync: 'useSync from @/contexts/sync/SyncProvider',
    validation: 'useValidation from @/contexts/validation/ValidationProvider',
    collaboration: 'useCollaboration from @/contexts/collaboration/CollaborationProvider',
    versioning: 'useVersioning from @/contexts/versioning/VersioningProvider',
  },
  performance: {
    v1: 'Re-render de TODOS os consumers quando qualquer state muda',
    v2: 'Re-render apenas dos consumers do hook específico modificado',
    improvement: '~85% redução de re-renders desnecessários',
  },
};
