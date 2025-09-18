import React, { createContext, useContext, ReactNode } from 'react';

interface EditorContextType {
  funnelId?: string;
  enableSupabase?: boolean;
  state?: {
    blocks?: any[];
    selectedBlockId?: string | null;
    currentStep?: number;
    stepBlocks?: any[];
    isLoading?: boolean;
  };
  actions?: {
    updateBlock?: (id: string, updates: any) => void;
    selectBlock?: (id: string) => void;
    addBlock?: (block: any) => void;
    deleteBlock?: (id: string) => void;
    removeBlock?: (id: string) => void;
    setSelectedBlockId?: (id: string | null) => void;
    setCurrentStep?: (step: number) => void;
    canUndo?: boolean;
    canRedo?: boolean;
    undo?: () => void;
    redo?: () => void;
  };
}

const EditorContext = createContext<EditorContextType>({});

export const useEditor = () => useContext(EditorContext);
export const useEditorOptional = () => useContext(EditorContext);

interface EditorProviderProps {
  children: ReactNode;
  funnelId?: string;
  enableSupabase?: boolean;
  quizId?: string;
  storageKey?: string;
  initial?: any;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  funnelId,
  enableSupabase = false,
  quizId: _quizId,
  storageKey: _storageKey,
  initial
}) => {
  const value: EditorContextType = {
    funnelId,
    enableSupabase,
    state: {
      blocks: initial?.blocks || [],
      selectedBlockId: initial?.selectedBlockId || null,
      currentStep: initial?.currentStep || 1,
      stepBlocks: initial?.stepBlocks || [],
      isLoading: initial?.isLoading || false
    },
    actions: {
      updateBlock: (id: string, updates: any) => {
        console.log('Update block:', id, updates);
      },
      selectBlock: (id: string) => {
        console.log('Select block:', id);
      },
      addBlock: (block: any) => {
        console.log('Add block:', block);
      },
      deleteBlock: (id: string) => {
        console.log('Delete block:', id);
      },
      removeBlock: (id: string) => {
        console.log('Remove block:', id);
      },
      setSelectedBlockId: (id: string | null) => {
        console.log('Set selected block ID:', id);
      },
      setCurrentStep: (step: number) => {
        console.log('Set current step:', step);
      },
      canUndo: false,
      canRedo: false,
      undo: () => {
        console.log('Undo action');
      },
      redo: () => {
        console.log('Redo action');
      }
    }
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider;