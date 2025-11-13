/**
 * 🔄 COMPATIBILITY LAYER - useEditorIntegration
 * 
 * Re-export do useEditor consolidado.
 * Hook legado - use useEditor() diretamente.
 */

import { useEditor } from './useEditor';

/**
 * @deprecated Use useEditor() directly instead
 */
export const useEditorIntegration = () => {
  const editor = useEditor();
  
  return {
    integrationState: {
      isInteractiveMode: false,
      isDraftMode: true,
      hasUnsavedChanges: editor.state.isDirty,
      lastSaved: editor.state.lastSaved ? new Date(editor.state.lastSaved) : null,
      syncStatus: (editor.state.isLoading ? 'syncing' : 'idle') as 'idle' | 'syncing' | 'error' | 'success',
    },
    inlineEditor: {} as any,
    stepValidation: {} as any,
    toggleInteractiveMode: () => {},
    toggleDraftMode: () => {},
    saveChanges: async () => await editor.actions.saveFunnel(),
    publishChanges: async () => await editor.actions.saveFunnel(),
    resetToLastSaved: () => {},
    currentStepBlocks: editor.blocks,
    updateStepBlocks: (blocks: any[]) => editor.actions.setStepBlocks(editor.currentStep, blocks),
    addBlockToCurrentStep: (blockType: string, properties?: any) => {
      const block = {
        id: `block-${Date.now()}`,
        type: blockType,
        properties: properties || {},
        order: editor.blocks.length,
      };
      editor.actions.addBlock(editor.currentStep, block);
    },
    removeBlockFromCurrentStep: (blockId: string) => {
      editor.actions.removeBlock(editor.currentStep, blockId);
    },
  };
};

export default useEditorIntegration;
