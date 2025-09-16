/**
 * 🌉 UNIFIED EDITOR HOOK - Fase 3
 * 
 * Hook ponte que funciona com:
 * ✅ Legacy EditorContext
 * ✅ Fallback Mock para desenvolvimento
 * 
 * Fornece API consistente para migração gradual
 */

import { useEditor as useLegacyEditor } from '@/context/EditorContext';
import { BlockType } from '@/types/editor';

interface UnifiedEditorHook {
  // Estado básico
  blocks: any[];
  selectedBlockId: string | null;
  activeStageId: string;
  isPreviewing: boolean;
  isLoading?: boolean;
  
  // Ações de bloco
  addBlock: (type: BlockType) => Promise<string>;
  updateBlock: (id: string, content: any) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  setSelectedBlockId: (id: string | null) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  
  // Ações de estágio
  setActiveStage: (id: string) => void;
  
  // UI
  setIsPreviewing: (preview: boolean) => void;
  
  // Template actions
  templateActions?: {
    loadTemplateByStep: (step: number) => Promise<boolean | undefined>;
  };
  
  // Quiz state (for compatibility)
  quizState?: {
    userName: string;
    answers: any[];
    isQuizCompleted: boolean;
  };
  
  // Meta
  contextType: 'legacy' | 'none';
  isLegacy: boolean;
}

/**
 * 🌉 Hook Unificado - Ponte para Legacy Context
 */
export const useUnifiedEditor = (): UnifiedEditorHook => {
  // Tentar usar contexto legacy
  let legacyContext;
  try {
    legacyContext = useLegacyEditor();
  } catch {
    legacyContext = null;
  }
  
  if (legacyContext) {
    console.log('🌉 useUnifiedEditor: Usando contexto legacy');
    
    return {
      // Estado
      blocks: legacyContext.computed?.currentBlocks || legacyContext.state?.blocks || [],
      selectedBlockId: legacyContext.selectedBlockId || legacyContext.state?.selectedBlockId || null,
      activeStageId: legacyContext.activeStageId || 'step-1',
      isPreviewing: legacyContext.isPreviewing || legacyContext.state?.isPreviewing || false,
      isLoading: legacyContext.isLoading,
      
      // Ações de bloco
      addBlock: legacyContext.addBlock || legacyContext.blockActions?.addBlock || (async () => ''),
      updateBlock: legacyContext.updateBlock || legacyContext.blockActions?.updateBlock || (async () => {}),
      deleteBlock: legacyContext.deleteBlock || legacyContext.blockActions?.deleteBlock || (async () => {}),
      setSelectedBlockId: legacyContext.setSelectedBlockId || legacyContext.blockActions?.setSelectedBlockId || (() => {}),
      reorderBlocks: legacyContext.reorderBlocks || legacyContext.blockActions?.reorderBlocks || (() => {}),
      
      // Ações de estágio
      setActiveStage: legacyContext.stageActions?.setActiveStage || (() => {}),
      
      // UI
      setIsPreviewing: legacyContext.setIsPreviewing || legacyContext.uiState?.setIsPreviewing || (() => {}),
      
      // Template actions
      templateActions: legacyContext.templateActions ? {
        loadTemplateByStep: async (step: number) => {
          try {
            legacyContext.templateActions?.loadTemplateByStep?.(step);
            return true;
          } catch {
            return false;
          }
        }
      } : undefined,
      
      // Quiz state
      quizState: legacyContext.quizState,
      
      // Meta
      contextType: 'legacy',
      isLegacy: true,
    };
  }
  
  // Fallback mock para desenvolvimento
  console.warn('🌉 useUnifiedEditor: Nenhum contexto disponível, usando mock');
  
  return {
    blocks: [],
    selectedBlockId: null,
    activeStageId: 'step-1',
    isPreviewing: false,
    isLoading: false,
    
    addBlock: async () => '',
    updateBlock: async () => {},
    deleteBlock: async () => {},
    setSelectedBlockId: () => {},
    reorderBlocks: () => {},
    setActiveStage: () => {},
    setIsPreviewing: () => {},
    
    contextType: 'none',
    isLegacy: false,
  };
};

export default useUnifiedEditor;