/**
 * 🎯 UNIFIED APP PROVIDER - SPRINT 3 (TK-ED-07)
 * 
 * Consolidação final de providers:
 * ✅ Combina FunnelMasterProvider + EditorProvider
 * ✅ Estado global unificado
 * ✅ Performance otimizada com useMemo/useCallback
 * ✅ Context único para toda aplicação
 * 
 * SUBSTITUI:
 * ❌ FunnelMasterProvider
 * ❌ EditorProvider (múltiplas versões)
 * ❌ OptimizedProviderStack
 */

import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { Block } from '@/types/editor';
import type { EditableQuizStep } from '@/components/editor/quiz/types';

// ============================================================================
// TYPES
// ============================================================================

interface UnifiedAppState {
  // Editor State
  currentStep: number;
  selectedBlockId: string | null;
  blocks: Block[];
  steps: EditableQuizStep[];
  
  // Funnel State
  currentFunnelId: string | null;
  funnelMeta: {
    name: string;
    description: string;
    type: string;
  };
  
  // UI State
  isPreviewMode: boolean;
  isSaving: boolean;
  isDirty: boolean;
  
  // Validation
  stepValidation: Record<number, boolean>;
}

interface UnifiedAppActions {
  // Navigation
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  
  // Block Operations
  selectBlock: (blockId: string | null) => void;
  addBlock: (block: Block) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  
  // Step Operations
  updateSteps: (steps: EditableQuizStep[]) => void;
  
  // Funnel Operations
  setFunnelId: (id: string) => void;
  updateFunnelMeta: (meta: Partial<UnifiedAppState['funnelMeta']>) => void;
  
  // UI Operations
  togglePreview: () => void;
  setSaving: (saving: boolean) => void;
  markDirty: () => void;
  markSaved: () => void;
  
  // Validation
  validateStep: (stepNumber: number) => boolean;
  validateAllSteps: () => boolean;
}

interface UnifiedAppContextValue {
  state: UnifiedAppState;
  actions: UnifiedAppActions;
}

// ============================================================================
// CONTEXT
// ============================================================================

const UnifiedAppContext = createContext<UnifiedAppContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface UnifiedAppProviderProps {
  children: React.ReactNode;
  initialFunnelId?: string;
}

export const UnifiedAppProvider: React.FC<UnifiedAppProviderProps> = ({ 
  children, 
  initialFunnelId 
}) => {
  // Estado centralizado
  const [state, setState] = useState<UnifiedAppState>({
    currentStep: 1,
    selectedBlockId: null,
    blocks: [],
    steps: [],
    currentFunnelId: initialFunnelId || null,
    funnelMeta: {
      name: '',
      description: '',
      type: 'quiz',
    },
    isPreviewMode: false,
    isSaving: false,
    isDirty: false,
    stepValidation: {},
  });

  // ============================================================================
  // ACTIONS - Memoizados para evitar re-renders
  // ============================================================================

  const actions = useMemo<UnifiedAppActions>(() => ({
    // Navigation
    setCurrentStep: (step: number) => {
      setState(prev => ({ 
        ...prev, 
        currentStep: step,
        selectedBlockId: null // Clear selection on step change
      }));
    },

    goToNextStep: () => {
      setState(prev => {
        const maxStep = prev.steps.length;
        return {
          ...prev,
          currentStep: Math.min(prev.currentStep + 1, maxStep),
          selectedBlockId: null
        };
      });
    },

    goToPreviousStep: () => {
      setState(prev => ({
        ...prev,
        currentStep: Math.max(prev.currentStep - 1, 1),
        selectedBlockId: null
      }));
    },

    // Block Operations
    selectBlock: (blockId: string | null) => {
      setState(prev => ({ ...prev, selectedBlockId: blockId }));
    },

    addBlock: (block: Block) => {
      setState(prev => ({
        ...prev,
        blocks: [...prev.blocks, block],
        isDirty: true
      }));
    },

    updateBlock: (blockId: string, updates: Partial<Block>) => {
      setState(prev => ({
        ...prev,
        blocks: prev.blocks.map(b => 
          b.id === blockId ? { ...b, ...updates } : b
        ),
        isDirty: true
      }));
    },

    deleteBlock: (blockId: string) => {
      setState(prev => ({
        ...prev,
        blocks: prev.blocks.filter(b => b.id !== blockId),
        selectedBlockId: prev.selectedBlockId === blockId ? null : prev.selectedBlockId,
        isDirty: true
      }));
    },

    // Step Operations
    updateSteps: (steps: EditableQuizStep[]) => {
      setState(prev => ({
        ...prev,
        steps,
        isDirty: true
      }));
    },

    // Funnel Operations
    setFunnelId: (id: string) => {
      setState(prev => ({ ...prev, currentFunnelId: id }));
    },

    updateFunnelMeta: (meta: Partial<UnifiedAppState['funnelMeta']>) => {
      setState(prev => ({
        ...prev,
        funnelMeta: { ...prev.funnelMeta, ...meta },
        isDirty: true
      }));
    },

    // UI Operations
    togglePreview: () => {
      setState(prev => ({ 
        ...prev, 
        isPreviewMode: !prev.isPreviewMode,
        selectedBlockId: null // Clear selection in preview
      }));
    },

    setSaving: (saving: boolean) => {
      setState(prev => ({ ...prev, isSaving: saving }));
    },

    markDirty: () => {
      setState(prev => ({ ...prev, isDirty: true }));
    },

    markSaved: () => {
      setState(prev => ({ ...prev, isDirty: false, isSaving: false }));
    },

    // Validation
    validateStep: (stepNumber: number) => {
      const step = state.steps.find(s => s.order === stepNumber);
      const isValid = step ? step.blocks.length > 0 : false;
      
      setState(prev => ({
        ...prev,
        stepValidation: {
          ...prev.stepValidation,
          [stepNumber]: isValid
        }
      }));
      
      return isValid;
    },

    validateAllSteps: () => {
      const validation: Record<number, boolean> = {};
      let allValid = true;

      state.steps.forEach(step => {
        const isValid = step.blocks.length > 0;
        validation[step.order] = isValid;
        if (!isValid) allValid = false;
      });

      setState(prev => ({
        ...prev,
        stepValidation: validation
      }));

      return allValid;
    }
  }), [state.steps]);

  // ============================================================================
  // CONTEXT VALUE - Memoizado
  // ============================================================================

  const contextValue = useMemo<UnifiedAppContextValue>(() => ({
    state,
    actions
  }), [state, actions]);

  // ============================================================================
  // DEBUG (dev only)
  // ============================================================================

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 UnifiedAppProvider state update:', {
        step: state.currentStep,
        blocksCount: state.blocks.length,
        stepsCount: state.steps.length,
        isDirty: state.isDirty,
        funnelId: state.currentFunnelId
      });
    }
  }, [state]);

  return (
    <UnifiedAppContext.Provider value={contextValue}>
      {children}
    </UnifiedAppContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useUnifiedApp = () => {
  const context = useContext(UnifiedAppContext);
  
  if (!context) {
    throw new Error('useUnifiedApp must be used within UnifiedAppProvider');
  }
  
  return context;
};

// ============================================================================
// SELETORES OTIMIZADOS (evitar re-renders desnecessários)
// ============================================================================

export const useUnifiedAppSelector = <T,>(
  selector: (state: UnifiedAppState) => T
): T => {
  const { state } = useUnifiedApp();
  return useMemo(() => selector(state), [state, selector]);
};

// Seletores específicos otimizados
export const useCurrentStep = () => useUnifiedAppSelector(s => s.currentStep);
export const useSelectedBlockId = () => useUnifiedAppSelector(s => s.selectedBlockId);
export const useIsDirty = () => useUnifiedAppSelector(s => s.isDirty);
export const useIsPreviewMode = () => useUnifiedAppSelector(s => s.isPreviewMode);
export const useCurrentStepBlocks = () => useUnifiedAppSelector(s => {
  const currentStep = s.steps.find(step => step.order === s.currentStep);
  return currentStep?.blocks || [];
});
