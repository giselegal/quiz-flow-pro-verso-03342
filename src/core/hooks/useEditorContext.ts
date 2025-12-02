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

// ✅ FASE 3: Usando providers consolidados
import { useAuthStorage } from '@/contexts/consolidated/AuthStorageProvider';
import { useRealTime } from '@/contexts/consolidated/RealTimeProvider';
import { useValidationResult } from '@/contexts/consolidated/ValidationResultProvider';
import { useUX } from '@/contexts/consolidated/UXProvider';

// Providers que permanecem separados
import { useEditor as useEditorCanonical, type EditorContextValue } from '@/core/contexts/EditorContext/EditorStateProvider';
import { useFunnelData } from '@/contexts/funnel/FunnelDataProvider';
import { useQuizState } from '@/contexts/quiz/QuizStateProvider';
import { useVersioning } from '@/contexts/versioning/VersioningProvider';

import { useMemo } from 'react';

export interface UnifiedEditorContext {
  // ✅ FASE 3: Providers consolidados (8 → 4)
  authStorage: ReturnType<typeof useAuthStorage>;
  realTime: ReturnType<typeof useRealTime>;
  validationResult: ReturnType<typeof useValidationResult>;
  ux: ReturnType<typeof useUX>;

  // Providers mantidos separados (4)
  editor: EditorContextValue;
  funnel: ReturnType<typeof useFunnelData>;
  quiz: ReturnType<typeof useQuizState>;
  versioning: ReturnType<typeof useVersioning>;

  // Aliases para compatibilidade com código legado
  auth: ReturnType<typeof useAuthStorage>;
  storage: ReturnType<typeof useAuthStorage>;
  sync: ReturnType<typeof useRealTime>;
  collaboration: ReturnType<typeof useRealTime>;
  validation: ReturnType<typeof useValidationResult>;
  result: ReturnType<typeof useValidationResult>;
  theme: ReturnType<typeof useUX>;
  ui: ReturnType<typeof useUX>;
  navigation: ReturnType<typeof useUX>;

  // Unified state (for compatibility)
  state: {
    editor: EditorContextValue['state'];
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
 * ✅ FASE 3: Reduzido de 13 para 8 providers (4 consolidados + 4 separados)
 */
export function useEditorContext(): UnifiedEditorContext {
  // Providers consolidados
  const authStorage = useAuthStorage();
  const realTime = useRealTime();
  const validationResult = useValidationResult();
  const ux = useUX();

  // Providers separados
  const editor = useEditorCanonical() as EditorContextValue;
  const funnel = useFunnelData();
  const quiz = useQuizState();
  const versioning = useVersioning();

  const context = useMemo<UnifiedEditorContext>(() => {
    return {
      // ✅ FASE 3: Providers consolidados
      authStorage,
      realTime,
      validationResult,
      ux,

      // Providers separados
      editor,
      funnel,
      quiz,
      versioning,

      // Aliases para compatibilidade
      auth: authStorage,
      storage: authStorage,
      sync: realTime,
      collaboration: realTime,
      validation: validationResult,
      result: validationResult,
      theme: ux,
      ui: ux,
      navigation: ux,

      // Unified state
      state: {
        editor: editor.state || editor,
        currentFunnel: funnel.currentFunnel,
      },

      // Quick access methods (delegate to editor) - suporta ambas APIs
      setCurrentStep: (editor as any).actions?.setCurrentStep || (editor as any).setCurrentStep,
      addBlock: (editor as any).actions?.addBlock || (editor as any).addBlock,
      removeBlock: (editor as any).actions?.removeBlock || (editor as any).removeBlock,
      reorderBlocks: (editor as any).actions?.reorderBlocks || (editor as any).reorderBlocks,
      updateBlock: (editor as any).actions?.updateBlock || (editor as any).updateBlock,
      getStepBlocks: (editor as any).actions?.getStepBlocks || (editor as any).getStepBlocks,
      setStepBlocks: (editor as any).actions?.setStepBlocks || (editor as any).setStepBlocks,
      setSelectedBlock: (editor as any).actions?.selectBlock || (editor as any).selectBlock, // Legacy method name
      selectBlock: (editor as any).actions?.selectBlock || (editor as any).selectBlock,

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
          const getStepBlocksFn = (editor as any).actions?.getStepBlocks || (editor as any).getStepBlocks;
          const markSavedFn = (editor as any).actions?.markSaved || (editor as any).markSaved;
          const blocks = getStepBlocksFn ? getStepBlocksFn(stepIndex) : [];
          await funnel.updateFunnelStepBlocks(stepIndex, blocks);
          if (markSavedFn) markSavedFn();
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      },

      // Undo/Redo (delegate to editor)
      undo: (editor as any).actions?.undo || (editor as any).undo || (() => {}),
      redo: (editor as any).actions?.redo || (editor as any).redo || (() => {}),
      canUndo: (editor as any).actions?.canUndo || (editor as any).canUndo || false,
      canRedo: (editor as any).actions?.canRedo || (editor as any).canRedo || false,
    };
  }, [
    authStorage,
    realTime,
    validationResult,
    ux,
    editor,
    funnel,
    quiz,
    versioning,
  ]);

  return context;
}

/**
 * Alias para compatibilidade com código existente
 * @deprecated Use useEditorContext() diretamente
 */
export const useUnifiedEditor = useEditorContext;
