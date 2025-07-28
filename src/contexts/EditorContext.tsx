
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditorContextType {
  currentFunnel: string | null;
  setCurrentFunnel: (id: string | null) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
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
  const [currentFunnel, setCurrentFunnel] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <EditorContext.Provider value={{ 
      currentFunnel, 
      setCurrentFunnel, 
      isEditing, 
      setIsEditing 
    }}>
      {children}
    </EditorContext.Provider>
  );
};
