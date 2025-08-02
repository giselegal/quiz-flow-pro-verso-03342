
import React, { createContext, useContext, useState } from 'react';

interface EditorQuizContextType {
  quizData: any;
  updateQuizData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const EditorQuizContext = createContext<EditorQuizContextType | undefined>(undefined);

export const useEditorQuizContext = () => {
  const context = useContext(EditorQuizContext);
  if (!context) {
    throw new Error('useEditorQuizContext must be used within EditorQuizProvider');
  }
  return context;
};

interface EditorQuizProviderProps {
  children: React.ReactNode;
}

export const EditorQuizProvider: React.FC<EditorQuizProviderProps> = ({ children }) => {
  const [quizData, setQuizData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  const updateQuizData = (data: any) => {
    setQuizData(prev => ({ ...prev, ...data }));
  };

  return (
    <EditorQuizContext.Provider value={{
      quizData,
      updateQuizData,
      currentStep,
      setCurrentStep
    }}>
      {children}
    </EditorQuizContext.Provider>
  );
};
