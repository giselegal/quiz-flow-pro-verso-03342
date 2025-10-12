import React, { ReactNode } from 'react';

interface EditorQuizProviderProps {
  children: ReactNode;
}

export const EditorQuizProvider: React.FC<EditorQuizProviderProps> = ({ children }) => <>{children}</>;

export const useEditorQuiz = () => ({});

export default {};