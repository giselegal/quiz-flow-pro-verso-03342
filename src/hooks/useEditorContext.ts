/**
 * 🔧 UNIFIED EDITOR CONTEXT - Fase 1 Clean Architecture
 * 
 * Hook unificado que resolve conflitos de contexto do editor.
 * Prioriza o contexto moderno e fallback graceful para legacy.
 */

import { useContext } from 'react';

// Import direto para evitar problemas de tipos
import { EditorContext } from '@/components/editor/EditorProvider';
import type { EditorContextValue } from '@/components/editor/EditorProvider';

/**
 * Hook unificado que resolve automaticamente conflitos de contexto
 */
export const useUnifiedEditor = (): EditorContextValue => {
  try {
    const context = useContext(EditorContext);
    if (context) {
      console.debug('✅ Using modern EditorContext');
      return context;
    }
  } catch (error) {
    console.debug('⚠️ EditorContext failed:', error);
  }

  // Último recurso - contexto vazio com avisos
  console.error('🚨 No EditorContext available - returning mock context');
  
  const mockContext: EditorContextValue = {
    state: {
      stepBlocks: {},
      currentStep: 1,
      selectedBlockId: null,
      stepValidation: {},
      isSupabaseEnabled: false,
      databaseMode: 'local' as const,
      isLoading: false,
    },
    actions: {
      setCurrentStep: () => console.warn('Mock setCurrentStep'),
      setSelectedBlockId: () => console.warn('Mock setSelectedBlockId'),
      setStepValid: () => console.warn('Mock setStepValid'),
      loadDefaultTemplate: () => console.warn('Mock loadDefaultTemplate'),
      addBlock: async () => console.warn('Mock addBlock'),
      addBlockAtIndex: async () => console.warn('Mock addBlockAtIndex'),
      removeBlock: async () => console.warn('Mock removeBlock'),
      reorderBlocks: async () => console.warn('Mock reorderBlocks'),
      updateBlock: async () => console.warn('Mock updateBlock'),
      ensureStepLoaded: async () => console.warn('Mock ensureStepLoaded'),
      undo: () => console.warn('Mock undo'),
      redo: () => console.warn('Mock redo'),
      canUndo: false,
      canRedo: false,
      exportJSON: () => '{}',
      importJSON: () => console.warn('Mock importJSON'),
    },
  };

  return mockContext;
};

export default useUnifiedEditor;