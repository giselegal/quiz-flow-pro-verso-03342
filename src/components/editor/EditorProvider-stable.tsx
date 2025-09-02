import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { EditorState, EditorActions, EditorContextType, Block } from '@/types/editor';
import { templateLibraryService } from '@/services/templateLibraryService';
import { useSupabaseIntegration } from '@/services/supabaseIntegration';

// Create context
const EditorContext = createContext<EditorContextType | null>(null);

// Initial state
const createInitialState = (): EditorState => ({
  currentStep: 1,
  stepBlocks: {},
  selectedBlockId: null,
  isLoading: false,
  hasUnsavedChanges: false,
  isSupabaseEnabled: false,
  funnelId: null,
  stepValidation: {},
  history: {
    past: [],
    present: {},
    future: []
  }
});

interface EditorProviderProps {
  children: ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  // Use refs to break render cycles
  const [rawState, setRawState] = React.useState<EditorState>(createInitialState);
  const stateRef = useRef(rawState);
  const setStateRef = useRef(setRawState);
  
  // Update refs when state changes, but don't trigger re-renders
  React.useLayoutEffect(() => {
    stateRef.current = rawState;
  }, [rawState]);

  // Memoize template loading to prevent re-computation
  const templateBlocks = useMemo(() => {
    try {
      const template = templateLibraryService.getById('quiz-estilo-completo');
      if (!template) return {};
      
      const blocks: { [key: string]: Block[] } = {};
      Object.entries(template.steps).forEach(([stepKey, stepBlocks]) => {
        blocks[stepKey] = (stepBlocks as any[]).map((block: any, index: number) => ({
          id: `${stepKey}-${block.type}-${index}`,
          type: block.type,
          order: index,
          properties: block.properties || {},
          content: block.properties || {},
        }));
      });
      return blocks;
    } catch (error) {
      console.warn('Failed to load template blocks:', error);
      return {};
    }
  }, []); // Empty deps - load once

  // Initialize template blocks only once
  useEffect(() => {
    if (Object.keys(templateBlocks).length > 0 && Object.keys(rawState.stepBlocks).length === 0) {
      setRawState(prev => ({
        ...prev,
        stepBlocks: templateBlocks
      }));
    }
  }, []); // Run only once on mount

  // Supabase integration (stable)
  const supabaseIntegration = useSupabaseIntegration();

  // Actions (memoized to prevent re-creation)
  const actions: EditorActions = useMemo(() => ({
    setCurrentStep: (step: number) => {
      if (step >= 1 && step <= 21 && step !== stateRef.current.currentStep) {
        setRawState(prev => ({ ...prev, currentStep: step }));
      }
    },

    updateBlock: (blockId: string, updates: Partial<Block>) => {
      setRawState(prev => {
        const newStepBlocks = { ...prev.stepBlocks };
        Object.keys(newStepBlocks).forEach(stepKey => {
          newStepBlocks[stepKey] = newStepBlocks[stepKey].map(block =>
            block.id === blockId ? { ...block, ...updates } : block
          );
        });
        return {
          ...prev,
          stepBlocks: newStepBlocks,
          hasUnsavedChanges: true
        };
      });
    },

    addBlock: (stepKey: string, block: Omit<Block, 'id' | 'order'>) => {
      setRawState(prev => {
        const stepBlocks = prev.stepBlocks[stepKey] || [];
        const newBlock: Block = {
          ...block,
          id: `${stepKey}-${block.type}-${Date.now()}`,
          order: stepBlocks.length
        };
        
        return {
          ...prev,
          stepBlocks: {
            ...prev.stepBlocks,
            [stepKey]: [...stepBlocks, newBlock]
          },
          hasUnsavedChanges: true
        };
      });
    },

    deleteBlock: (blockId: string) => {
      setRawState(prev => {
        const newStepBlocks = { ...prev.stepBlocks };
        Object.keys(newStepBlocks).forEach(stepKey => {
          newStepBlocks[stepKey] = newStepBlocks[stepKey].filter(block => block.id !== blockId);
        });
        return {
          ...prev,
          stepBlocks: newStepBlocks,
          selectedBlockId: prev.selectedBlockId === blockId ? null : prev.selectedBlockId,
          hasUnsavedChanges: true
        };
      });
    },

    selectBlock: (blockId: string | null) => {
      if (blockId !== stateRef.current.selectedBlockId) {
        setRawState(prev => ({ ...prev, selectedBlockId: blockId }));
      }
    },

    reorderBlocks: (stepKey: string, startIndex: number, endIndex: number) => {
      setRawState(prev => {
        const stepBlocks = [...(prev.stepBlocks[stepKey] || [])];
        const [removed] = stepBlocks.splice(startIndex, 1);
        stepBlocks.splice(endIndex, 0, removed);
        
        // Update order property
        stepBlocks.forEach((block, index) => {
          block.order = index;
        });

        return {
          ...prev,
          stepBlocks: {
            ...prev.stepBlocks,
            [stepKey]: stepBlocks
          },
          hasUnsavedChanges: true
        };
      });
    },

    save: async () => {
      setRawState(prev => ({ ...prev, isLoading: true }));
      try {
        // Implement save logic here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save
        setRawState(prev => ({ 
          ...prev, 
          isLoading: false, 
          hasUnsavedChanges: false 
        }));
      } catch (error) {
        setRawState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }
    },

    undo: () => {
      // Implement undo logic
      console.log('Undo not implemented yet');
    },

    redo: () => {
      // Implement redo logic  
      console.log('Redo not implemented yet');
    },

    canUndo: false,
    canRedo: false
  }), []);

  // Context value (stable)
  const contextValue = useMemo(() => ({
    state: rawState,
    actions
  }), [rawState, actions]);

  // Debug logging (minimal, non-triggering)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const timer = setTimeout(() => {
        console.log('🔧 Editor State Update:', {
          currentStep: rawState.currentStep,
          stepBlocksCount: Object.keys(rawState.stepBlocks).length,
          selectedBlock: rawState.selectedBlockId,
          timestamp: new Date().toISOString()
        });
      }, 500); // Debounced logging
      
      return () => clearTimeout(timer);
    }
  }, [rawState.currentStep, rawState.selectedBlockId]); // Only log on meaningful changes

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

// Hook to use editor context
export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export default EditorProvider;