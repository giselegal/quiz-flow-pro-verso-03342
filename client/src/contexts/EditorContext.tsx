
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface EditorContextType {
  activeTab: string;
  blockSearch: string;
  availableBlocks: any[];
  setActiveTab: (tab: string) => void;
  setBlockSearch: (search: string) => void;
  handleAddBlock: (type: string) => void;
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

  const handleAddBlock = useCallback((type: string) => {
    console.log('Adding block:', type);
  }, []);

  return (
    <EditorContext.Provider value={{
      activeTab,
      blockSearch,
      availableBlocks,
      setActiveTab,
      setBlockSearch,
      handleAddBlock
    }}>
      {children}
    </EditorContext.Provider>
  );
};
