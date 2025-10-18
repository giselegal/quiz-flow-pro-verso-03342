/**
 * 🔄 EDITOR PROVIDER ADAPTER - Wrapper de Compatibilidade
 * 
 * Adapter temporário que permite componentes legados usarem
 * as novas stores Zustand através da API antiga de EditorProvider.
 * 
 * SPRINT 3 - Facilita migração gradual
 * 
 * USO:
 * ```tsx
 * // Código legado continua funcionando
 * <EditorProviderAdapter>
 *   <ComponentQueUsaUseEditor />
 * </EditorProviderAdapter>
 * ```
 */

import React, { createContext, useContext, useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useEditorConsolidated } from '@/hooks/useEditorConsolidated';
import type { EditorStep } from '@/store/editorStore';

// ============================================================================
// TYPES - Mantém API antiga para compatibilidade
// ============================================================================

export interface EditorContextValue {
  // Estado
  stages: EditorStep[];
  activeStageId: string | null;
  selectedBlockId: string | null;
  
  // UI
  isPreviewing: boolean;
  setIsPreviewing: (value: boolean) => void;
  
  // Actions
  stageActions: {
    setActiveStage: (stageId: string) => void;
  };
  
  blockActions: {
    addBlock: (type: string) => Promise<string>;
    updateBlock: (id: string, updates: any) => Promise<void>;
    deleteBlock: (id: string) => Promise<void>;
    reorderBlocks: (startIndex: number, endIndex: number) => Promise<void>;
    setSelectedBlockId: (id: string | null) => void;
  };
  
  persistenceActions: {
    saveFunnel: () => Promise<void>;
  };
  
  uiState: {
    isPreviewing: boolean;
    setIsPreviewing: (value: boolean) => void;
  };
  
  // State para compatibilidade adicional
  state?: {
    currentStep: number;
    stepBlocks: Record<string, any[]>;
  };
}

// ============================================================================
// CONTEXT
// ============================================================================

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

// ============================================================================
// HOOK
// ============================================================================

export function useEditor(): EditorContextValue;
export function useEditor(options: { optional: true }): EditorContextValue | undefined;
export function useEditor(options?: { optional?: boolean }): EditorContextValue | undefined {
  const context = useContext(EditorContext);
  
  if (!context && !options?.optional) {
    throw new Error('useEditor must be used within EditorProviderAdapter');
  }
  
  return context;
}

// ============================================================================
// PROVIDER ADAPTER
// ============================================================================

export interface EditorProviderAdapterProps {
  children: React.ReactNode;
  funnelId?: string;
  enableSupabase?: boolean;
  autoLoad?: boolean;
}

export const EditorProviderAdapter: React.FC<EditorProviderAdapterProps> = ({
  children,
  funnelId,
  enableSupabase = false,
  autoLoad = true,
}) => {
  const editor = useEditorConsolidated();
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const setPreviewMode = useEditorStore((state) => state.setPreviewMode);

  // Carregar funnel se funnelId fornecido
  useEffect(() => {
    if (funnelId && enableSupabase && autoLoad) {
      // TODO: Implementar carregamento de funnel via service
      console.log('📥 Loading funnel:', funnelId);
    }
  }, [funnelId, enableSupabase, autoLoad]);

  // Criar valor do contexto compatível com API antiga
  const contextValue: EditorContextValue = {
    stages: editor.steps,
    activeStageId: editor.currentStep?.id || null,
    selectedBlockId: editor.selectedBlockId,
    
    isPreviewing: isPreviewMode,
    setIsPreviewing: setPreviewMode,
    
    stageActions: {
      setActiveStage: editor.goToStep,
    },
    
    blockActions: {
      addBlock: async (type: string) => {
        return editor.addBlock(type as any);
      },
      updateBlock: async (id: string, updates: any) => {
        editor.updateBlock(id, updates);
      },
      deleteBlock: async (id: string) => {
        editor.removeBlock(id);
      },
      reorderBlocks: async (startIndex: number, endIndex: number) => {
        editor.reorderBlocks(startIndex, endIndex);
      },
      setSelectedBlockId: editor.selectBlock,
    },
    
    persistenceActions: {
      saveFunnel: async () => {
        await editor.save();
      },
    },
    
    uiState: {
      isPreviewing: isPreviewMode,
      setIsPreviewing: setPreviewMode,
    },
    
    // Compatibilidade adicional
    state: {
      currentStep: editor.currentStepIndex + 1,
      stepBlocks: editor.steps.reduce((acc, step) => {
        acc[`step-${step.order + 1}`] = step.blocks;
        return acc;
      }, {} as Record<string, any[]>),
    },
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

// ============================================================================
// EXPORTS para compatibilidade
// ============================================================================

export { EditorProviderAdapter as EditorProvider };
export { EditorProviderAdapter as EditorProviderUnified };
export { EditorProviderAdapter as MigrationEditorProvider };
export default EditorProviderAdapter;
