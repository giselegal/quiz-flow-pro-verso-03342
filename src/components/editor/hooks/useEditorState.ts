import { EditorBlock } from '@/types/editor';
import { useCallback, useState } from 'react';
import { generateSemanticId } from '@/utils/semanticIdGenerator';

interface EditorState {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  isPreviewing: boolean;
}

export const useEditorState = (initialBlocks: EditorBlock[] = []) => {
  const [state, setState] = useState<EditorState>({
    blocks: initialBlocks,
    selectedBlockId: null,
    isPreviewing: false,
  });

  const updateBlocks = useCallback((blocks: EditorBlock[]) => {
    setState(prev => ({ ...prev, blocks }));
  }, []);

  const selectBlock = useCallback((blockId: string | null) => {
    setState(prev => ({ ...prev, selectedBlockId: blockId }));
  }, []);

  const togglePreview = useCallback(() => {
    setState(prev => ({ ...prev, isPreviewing: !prev.isPreviewing }));
  }, []);

  const addBlock = useCallback(
    (type: EditorBlock['type']) => {
      const newBlock: EditorBlock = {
        id: generateSemanticId({
          context: 'editor',
          type: 'block',
          identifier: 'block',
          index: Math.floor(Math.random() * 1000),
        }),
        type,
        content: getDefaultContent(type),
        properties: {}, // Add missing properties field
        order: state.blocks.length,
      };

      setState(prev => ({
        ...prev,
        blocks: [...prev.blocks, newBlock],
      }));

      return newBlock.id;
    },
    [state.blocks.length]
  );

  const updateBlock = useCallback((id: string, updates: Partial<EditorBlock>) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => (block.id === id ? { ...block, ...updates } : block)),
    }));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== id),
      selectedBlockId: prev.selectedBlockId === id ? null : prev.selectedBlockId,
    }));
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    // Implementation for step navigation if needed
    console.log('Setting current step:', step);
  }, []);

  return {
    ...state,
    updateBlocks,
    selectBlock,
    togglePreview,
    addBlock,
    updateBlock,
    deleteBlock,
    setCurrentStep,
  };
};

const getDefaultContent = (type: EditorBlock['type']) => {
  switch (type) {
    case 'headline':
      return { title: 'Novo Título', subtitle: '' };
    case 'text':
      return { text: 'Novo texto' };
    case 'image':
      return { imageUrl: '', imageAlt: '', caption: '' };
    case 'benefits':
      return { title: 'Benefícios', items: [] };
    default:
      return {};
  }
};
