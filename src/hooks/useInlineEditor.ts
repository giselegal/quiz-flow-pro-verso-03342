import { useCallback, useState } from 'react';
import { Block } from '@/types/editor';

interface InlineEditorState {
  activeBlockId: string | null;
  editMode: 'text' | 'properties' | 'style' | null;
  isEditing: boolean;
  tempValue: any;
}

interface UseInlineEditorReturn {
  // Estado
  editorState: InlineEditorState;
  
  // Ações
  startEditing: (blockId: string, mode: 'text' | 'properties' | 'style', initialValue?: any) => void;
  stopEditing: () => void;
  saveChanges: (blockId: string, changes: Partial<Block>) => void;
  cancelEditing: () => void;
  updateTempValue: (value: any) => void;
  
  // Checkers
  isBlockActive: (blockId: string) => boolean;
  isInEditMode: (mode: 'text' | 'properties' | 'style') => boolean;
}

export const useInlineEditor = (
  onBlockUpdate?: (blockId: string, changes: Partial<Block>) => void
): UseInlineEditorReturn => {
  const [editorState, setEditorState] = useState<InlineEditorState>({
    activeBlockId: null,
    editMode: null,
    isEditing: false,
    tempValue: null,
  });

  const startEditing = useCallback((
    blockId: string, 
    mode: 'text' | 'properties' | 'style',
    initialValue?: any
  ) => {
    setEditorState({
      activeBlockId: blockId,
      editMode: mode,
      isEditing: true,
      tempValue: initialValue,
    });
  }, []);

  const stopEditing = useCallback(() => {
    setEditorState({
      activeBlockId: null,
      editMode: null,
      isEditing: false,
      tempValue: null,
    });
  }, []);

  const saveChanges = useCallback((blockId: string, changes: Partial<Block>) => {
    if (onBlockUpdate) {
      onBlockUpdate(blockId, changes);
    }
    stopEditing();
  }, [onBlockUpdate, stopEditing]);

  const cancelEditing = useCallback(() => {
    stopEditing();
  }, [stopEditing]);

  const updateTempValue = useCallback((value: any) => {
    setEditorState(prev => ({
      ...prev,
      tempValue: value,
    }));
  }, []);

  const isBlockActive = useCallback((blockId: string) => {
    return editorState.activeBlockId === blockId;
  }, [editorState.activeBlockId]);

  const isInEditMode = useCallback((mode: 'text' | 'properties' | 'style') => {
    return editorState.editMode === mode && editorState.isEditing;
  }, [editorState.editMode, editorState.isEditing]);

  return {
    editorState,
    startEditing,
    stopEditing,
    saveChanges,
    cancelEditing,
    updateTempValue,
    isBlockActive,
    isInEditMode,
  };
};