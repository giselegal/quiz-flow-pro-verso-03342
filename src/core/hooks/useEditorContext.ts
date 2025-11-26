/**
 * 🎯 USE EDITOR CONTEXT - Hook Modernizado (Fase 2)
 * 
 * Hook unificado que substitui useSuperUnified com API consolidada.
 * Usa EditorCompatLayer para manter compatibilidade durante migração.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ANTES
 * import { useSuperUnified } from '@/hooks/useSuperUnified';
 * const { editor, auth, theme } = useSuperUnified();
 * 
 * // DEPOIS
 * import { useEditorContext } from '@/core/hooks/useEditorContext';
 * const { editor, auth, theme } = useEditorContext();
 * ```
 * 
 * VANTAGENS:
 * - API unificada e consistente
 * - Tipagem forte com TypeScript
 * - Compatibilidade com código legado via EditorCompatLayer
 * - Fácil refatoração futura para providers modulares
 * 
 * @version 2.0.0
 * @phase FASE-2
 */

import { useAuth } from '@/contexts/auth/AuthProvider';
import { useTheme } from '@/contexts/theme/ThemeProvider';
import { useEditorCompat } from '@/core/contexts/EditorContext/EditorCompatLayer';
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
import { useMemo } from 'react';

export interface UnifiedEditorContext {
  // Core providers
  auth: ReturnType<typeof useAuth>;
  theme: ReturnType<typeof useTheme>;
  editor: ReturnType<typeof useEditorCompat>;
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

  // Unified state (for compatibility)
  state: {
    editor: ReturnType<typeof useEditorCompat>['state'];
    currentFunnel: ReturnType<typeof useFunnelData>['currentFunnel'];
  };

  // Quick access methods (delegated to editor)
  setCurrentStep: (step: number) => void;
  addBlock: (step: number, block: any, index?: number) => void;
  removeBlock: (step: number, blockId: string) => void;
  reorderBlocks: (step: number, blocks: any[]) => void;
  updateBlock: (step: number, blockId: string, updates: any) => void;
  getStepBlocks: (step: number) => any[];
  setStepBlocks: (step: number, blocks: any[]) => void;
  setSelectedBlock: (blockId: string | null) => void;
  selectBlock: (blockId: string | null) => void;

  // Persistence operations
  saveFunnel: () => Promise<{ success: boolean; error?: string }>;
  publishFunnel: (options?: any) => Promise<{ success: boolean; error?: string }>;
  saveStepBlocks: (stepIndex: number) => Promise<{ success: boolean; error?: string }>;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * Hook principal - substitui useSuperUnified com API modernizada
 */
export function useEditorContext(): UnifiedEditorContext {
  const auth = useAuth();
  const theme = useTheme();
  const editor = useEditorCompat();
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

  const context = useMemo<UnifiedEditorContext>(() => {
    return {
      // Providers
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

      // Unified state
      state: {
        editor: editor.state,
        currentFunnel: funnel.currentFunnel,
      },

      // Quick access methods (delegate to editor)
      setCurrentStep: editor.setCurrentStep,
      addBlock: editor.addBlock,
      removeBlock: editor.removeBlock,
      reorderBlocks: editor.reorderBlocks,
      updateBlock: editor.updateBlock,
      getStepBlocks: editor.getStepBlocks,
      setStepBlocks: editor.setStepBlocks,
      setSelectedBlock: editor.selectBlock, // Legacy method name
      selectBlock: editor.selectBlock,

      // Persistence (delegate to funnel/editor)
      saveFunnel: async () => {
        try {
          await funnel.saveFunnel();
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      },
      publishFunnel: async (options?: any) => {
        try {
          await funnel.publishFunnel(options);
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      },
      saveStepBlocks: async (stepIndex: number) => {
        try {
          const blocks = editor.getStepBlocks(stepIndex);
          await funnel.updateFunnelStepBlocks(stepIndex, blocks);
          editor.markSaved();
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      },

      // Undo/Redo (delegate to editor)
      undo: editor.undo,
      redo: editor.redo,
      canUndo: editor.canUndo,
      canRedo: editor.canRedo,
    };
  }, [
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
  ]);

  return context;
}

/**
 * Alias para compatibilidade com código existente
 * @deprecated Use useEditorContext() diretamente
 */
export const useUnifiedEditor = useEditorContext;
