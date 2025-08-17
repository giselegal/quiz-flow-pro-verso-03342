import React from 'react';
import { EditorConfig } from '@/types/editor';
import { EditorContext } from '@/context/EditorContext';
import { useTemplateValidation } from '@/hooks/useTemplateValidation';

interface EditorProviderProps {
  children: React.ReactNode;
  config?: EditorConfig;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children, config }) => {
  const validation = useTemplateValidation();

  return (
    <EditorContext.Provider 
      value={{
        config,
        validation,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
