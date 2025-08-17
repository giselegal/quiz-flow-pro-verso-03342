import { EditorContext } from '@/context/EditorContext';
import { useTemplateValidation } from '@/hooks/useTemplateValidation';
import { EditorConfig } from '@/types/editor';
import React from 'react';

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
