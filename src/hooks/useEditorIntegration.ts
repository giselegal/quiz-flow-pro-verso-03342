import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import { Block } from '@/types/editor';
import { useInlineEditor } from './useInlineEditor';
import { useStepValidation } from './useStepValidation';

interface EditorIntegrationState {
  isInteractiveMode: boolean;
  isDraftMode: boolean;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
}

interface UseEditorIntegrationReturn {
  // Estado
  integrationState: EditorIntegrationState;
  
  // Hooks integrados
  inlineEditor: ReturnType<typeof useInlineEditor>;
  stepValidation: ReturnType<typeof useStepValidation>;
  
  // Ações
  toggleInteractiveMode: () => void;
  toggleDraftMode: () => void;
  saveChanges: () => Promise<void>;
  publishChanges: () => Promise<void>;
  resetToLastSaved: () => void;
  
  // Editor Provider Integration
  currentStepBlocks: Block[];
  updateStepBlocks: (blocks: Block[]) => void;
  addBlockToCurrentStep: (blockType: string, properties?: any) => void;
  removeBlockFromCurrentStep: (blockId: string) => void;
}

export const useEditorIntegration = (): UseEditorIntegrationReturn => {
  const editorContext = useEditor({ optional: true });
  
  if (!editorContext) {
    throw new Error('useEditorIntegration must be used within EditorProvider');
  }
  
  const { state } = editorContext;
  const { currentStep, stepBlocks } = state;

  const [integrationState, setIntegrationState] = useState<EditorIntegrationState>({
    isInteractiveMode: false,
    isDraftMode: true,
    hasUnsavedChanges: false,
    lastSaved: null,
    syncStatus: 'idle',
  });

  const currentStepId = `step-${currentStep}`;
  const currentStepBlocks = stepBlocks[currentStepId] || [];

  // Initialize integrated hooks
  const inlineEditor = useInlineEditor((blockId: string, changes: Partial<Block>) => {
    updateStepBlocks(
      currentStepBlocks.map((block: Block) => 
        block.id === blockId ? { ...block, ...changes } : block
      )
    );
    setIntegrationState(prev => ({ ...prev, hasUnsavedChanges: true }));
  });

  const stepValidation = useStepValidation({
    stepNumber: currentStep,
  });

  // Actions
  const toggleInteractiveMode = useCallback(() => {
    setIntegrationState(prev => ({
      ...prev,
      isInteractiveMode: !prev.isInteractiveMode
    }));
  }, []);

  const toggleDraftMode = useCallback(() => {
    setIntegrationState(prev => ({
      ...prev,
      isDraftMode: !prev.isDraftMode
    }));
  }, []);

  const updateStepBlocks = useCallback((blocks: Block[]) => {
    // In a real implementation, this would update via EditorProvider actions
    console.log('🔄 Updating step blocks:', blocks.length);
    setIntegrationState(prev => ({ 
      ...prev, 
      hasUnsavedChanges: true,
      syncStatus: 'idle'
    }));
  }, []);

  const addBlockToCurrentStep = useCallback((blockType: string, properties?: any) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: blockType as any, // Type assertion for demo
      order: currentStepBlocks.length + 1,
      properties: properties || {},
      content: {},
    };

    updateStepBlocks([...currentStepBlocks, newBlock]);
  }, [currentStepBlocks, updateStepBlocks]);

  const removeBlockFromCurrentStep = useCallback((blockId: string) => {
    updateStepBlocks(currentStepBlocks.filter((block: Block) => block.id !== blockId));
  }, [currentStepBlocks, updateStepBlocks]);

  const saveChanges = useCallback(async () => {
    setIntegrationState(prev => ({ ...prev, syncStatus: 'syncing' }));
    
    try {
      // In a real app, this would sync with backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIntegrationState(prev => ({ 
        ...prev, 
        hasUnsavedChanges: false,
        lastSaved: new Date(),
        syncStatus: 'success'
      }));

      // Reset sync status after 2 seconds
      setTimeout(() => {
        setIntegrationState(prev => ({ ...prev, syncStatus: 'idle' }));
      }, 2000);
    } catch (error) {
      setIntegrationState(prev => ({ ...prev, syncStatus: 'error' }));
      console.error('Error saving changes:', error);
    }
  }, []);

  const publishChanges = useCallback(async () => {
    await saveChanges();
    
    setIntegrationState(prev => ({ 
      ...prev, 
      isDraftMode: false 
    }));
    
    console.log('🚀 Publishing changes to production...');
  }, [saveChanges]);

  const resetToLastSaved = useCallback(() => {
    // In a real app, this would reload from backend
    setIntegrationState(prev => ({ 
      ...prev, 
      hasUnsavedChanges: false,
      syncStatus: 'idle'
    }));
    
    console.log('🔄 Resetting to last saved state...');
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (integrationState.hasUnsavedChanges && integrationState.isDraftMode) {
      const autoSaveTimer = setTimeout(() => {
        saveChanges();
      }, 3000); // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [integrationState.hasUnsavedChanges, integrationState.isDraftMode, saveChanges]);

  return {
    integrationState,
    inlineEditor,
    stepValidation,
    toggleInteractiveMode,
    toggleDraftMode,
    saveChanges,
    publishChanges,
    resetToLastSaved,
    currentStepBlocks,
    updateStepBlocks,
    addBlockToCurrentStep,
    removeBlockFromCurrentStep,
  };
};