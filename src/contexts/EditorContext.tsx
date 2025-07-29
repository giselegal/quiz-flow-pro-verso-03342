
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { EditorBlock, EditableContent } from '@/types/editor';
import { EditorActions } from '@/types/editorActions';
import { getDefaultContentForType } from '@/utils/editorDefaults';
import { getDefaultContentForFunnelStep } from '@/config/funnelSteps';
import { generateId } from '@/utils/idGenerator';

interface EditorContextType {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  activeTab: string;
  blockSearch: string;
  availableBlocks: any[];
  actions: EditorActions;
  setActiveTab: (tab: string) => void;
  setBlockSearch: (search: string) => void;
  handleAddBlock: (type: string) => void;
  setSelectedBlockId: (id: string | null) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

interface EditorProviderProps {
  children: ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [blockSearch, setBlockSearch] = useState('');

  const availableBlocks = [
    { type: 'header', name: 'Cabeçalho', icon: '📄', category: 'content' },
    { type: 'text', name: 'Texto', icon: '📝', category: 'content' },
    { type: 'image', name: 'Imagem', icon: '🖼️', category: 'content' },
    { type: 'button', name: 'Botão', icon: '🔘', category: 'content' },
    { type: 'spacer', name: 'Espaçador', icon: '⬜', category: 'layout' },
    { type: 'quiz-question', name: 'Questão Quiz', icon: '❓', category: 'quiz' },
    { type: 'testimonial', name: 'Depoimento', icon: '💬', category: 'content' }
  ];

  const addBlock = useCallback((type: EditorBlock['type']) => {
    let content;
    let stepNumber = 1;
    
    // Check if it's a funnel step
    if (type.startsWith('funnel-step-')) {
      const stepType = type.replace('funnel-step-', '');
      content = getDefaultContentForFunnelStep(stepType);
      
      // Calculate step number based on existing blocks
      const existingSteps = blocks.filter(b => b.type?.startsWith('funnel-step-'));
      stepNumber = existingSteps.length + 1;
    } else {
      content = getDefaultContentForType(type);
    }
    
    const newBlock: EditorBlock = {
      id: generateId(),
      type,
      content,
      order: blocks.length,
      stepNumber: type.startsWith('funnel-step-') ? stepNumber : undefined
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
    return newBlock.id;
  }, [blocks]);

  const updateBlock = useCallback((id: string, content: Partial<EditableContent>) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === id 
          ? { ...block, content: { ...block.content, ...content } }
          : block
      )
    );
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

  const handleAddBlock = useCallback((type: string) => {
    console.log('EditorContext: Adicionando bloco do tipo:', type);
    addBlock(type as EditorBlock['type']);
  }, [addBlock]);

  const actions: EditorActions = {
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks
  };

  return (
    <EditorContext.Provider value={{
      blocks,
      selectedBlockId,
      activeTab,
      blockSearch,
      availableBlocks,
      actions,
      setActiveTab,
      setBlockSearch,
      handleAddBlock,
      setSelectedBlockId
    }}>
      {children}
    </EditorContext.Provider>
  );
};
