
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditorContextType {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
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
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  return (
    <EditorContext.Provider value={{
      isEditing,
      setIsEditing,
      selectedBlockId,
      setSelectedBlockId,
    }}>
      {children}
    </EditorContext.Provider>
  );
};
