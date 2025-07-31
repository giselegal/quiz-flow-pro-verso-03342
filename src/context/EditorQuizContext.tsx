/**
 * INTEGRAÇÃO DE LÓGICA DE CÁLCULOS NO EDITOR
 * Conecta os componentes do editor com a mesma lógica do funil em produção
 */

import React, { useState, useCallback, useContext, createContext } from 'react';
import { useQuizLogic } from '../hooks/useQuizLogic';
import { QuizResult, StyleResult } from '../types/quiz';

// Context para compartilhar lógica de cálculo entre componentes do editor
export interface EditorQuizContext {
  // Estados do quiz
  answers: Record<string, string[]>;
  strategicAnswers: Record<string, string[]>;
  currentResults: QuizResult | null;
  
  // Funções de cálculo (mesmas do produção)
  handleAnswer: (questionId: string, selectedOptions: string[]) => void;
  handleStrategicAnswer: (questionId: string, selectedOptions: string[]) => void;
  calculateResults: (clickOrder?: string[]) => QuizResult;
  
  // Estados de UI
  isCalculating: boolean;
  resultsReady: boolean;
}

// Hook personalizado para usar no editor
export const useEditorQuizLogic = (): EditorQuizContext => {
  const {
    strategicAnswers,
    quizResult,
    handleAnswer,
    handleStrategicAnswer,
    calculateResults,
    isInitialLoadComplete
  } = useQuizLogic();

  // Extrair answers do localStorage ou state interno
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const handleAnswerWithPreview = useCallback(
    (questionId: string, selectedOptions: string[]) => {
      // Atualizar state local
      setAnswers(prev => ({
        ...prev,
        [questionId]: selectedOptions
      }));
      
      // Chamar função original
      handleAnswer(questionId, selectedOptions);
      
      // Calcular resultados em tempo real para preview
      setIsCalculating(true);
      setTimeout(() => {
        calculateResults();
        setIsCalculating(false);
      }, 100);
    },
    [handleAnswer, calculateResults]
  );

  const handleStrategicAnswerWithPreview = useCallback(
    (questionId: string, selectedOptions: string[]) => {
      handleStrategicAnswer(questionId, selectedOptions);
    },
    [handleStrategicAnswer]
  );

  return {
    answers,
    strategicAnswers,
    currentResults: quizResult,
    handleAnswer: handleAnswerWithPreview,
    handleStrategicAnswer: handleStrategicAnswerWithPreview,
    calculateResults,
    isCalculating,
    resultsReady: !!quizResult && isInitialLoadComplete
  };
};

// Provider para compartilhar context entre componentes
export const EditorQuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextValue = useEditorQuizLogic();
  
  return (
    <EditorQuizContext.Provider value={contextValue}>
      {children}
    </EditorQuizContext.Provider>
  );
};

export const EditorQuizContext = createContext<EditorQuizContext | null>(null);

export const useEditorQuizContext = () => {
  const context = useContext(EditorQuizContext);
  if (!context) {
    throw new Error('useEditorQuizContext must be used within EditorQuizProvider');
  }
  return context;
};
