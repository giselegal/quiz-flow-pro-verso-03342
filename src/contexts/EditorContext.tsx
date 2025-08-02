
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { EditorBlock } from '@/types/editor';

interface EditorContextType {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  actions: {
    addBlock: (type: string) => string;
    updateBlock: (id: string, updates: Partial<EditorBlock>) => void;
    deleteBlock: (id: string) => void;
    reorderBlocks: (startIndex: number, endIndex: number) => void;
  };
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = useCallback((type: string): string => {
    const newBlock: EditorBlock = {
      id: `block-${Date.now()}`,
      type: type as EditorBlock['type'],
      content: getDefaultContent(type),
      properties: {},
      order: blocks.length
    };
    setBlocks(prev => [...prev, newBlock]);
    return newBlock.id;
  }, [blocks.length]);

  const updateBlock = useCallback((id: string, updates: Partial<EditorBlock>) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  }, [selectedBlockId]);

  const reorderBlocks = useCallback((startIndex: number, endIndex: number) => {
    setBlocks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((block, index) => ({ ...block, order: index }));
    });
  }, []);

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'header':
        return { title: 'Novo Cabeçalho', subtitle: 'Subtítulo' };
      case 'text':
        return { text: 'Novo texto. Clique para editar.' };
      case 'image':
        return { imageUrl: '', imageAlt: 'Imagem', caption: '' };
      case 'button':
        return { buttonText: 'Clique aqui', buttonUrl: '#' };
      case 'quiz-question':
        return { 
          question: 'Nova pergunta?', 
          options: [
            { id: '1', text: 'Opção 1' },
            { id: '2', text: 'Opção 2' }
          ]
        };
      default:
        return { text: `Novo ${type}` };
    }
  };

  return (
    <EditorContext.Provider value={{
      blocks,
      selectedBlockId,
      setSelectedBlockId,
      actions: {
        addBlock,
        updateBlock,
        deleteBlock,
        reorderBlocks
      }
    }}>
      {children}
    </EditorContext.Provider>
  );
};
