import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useQuizLogic } from '../hooks/useQuizLogic';
import { QuizResult } from '../types/quiz';

interface EditorQuizContextType {
  // Estados do quiz
  currentQuestionIndex: number;
  currentAnswers: string[];
  quizResult: QuizResult | null;
  isPreviewMode: boolean;
  
  // Funções de navegação e controle
  handleAnswer: (questionId: string, selectedOptions: string[]) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  calculateResults: () => QuizResult | null;
  resetQuiz: () => void;
  
  // Controles do editor
  setPreviewMode: (enabled: boolean) => void;
  goToQuestion: (index: number) => void;
  
  // Estados computados
  canProceed: boolean;
  isLastQuestion: boolean;
  totalQuestions: number;
  progressPercentage: number;
  
  // Integração com editor
  isEditorMode: boolean;
  setEditorMode: (enabled: boolean) => void;
}

const EditorQuizContext = createContext<EditorQuizContextType | null>(null);

export const useEditorQuizContext = () => {
  const context = useContext(EditorQuizContext);
  if (!context) {
    throw new Error('useEditorQuizContext deve ser usado dentro de EditorQuizProvider');
  }
  return context;
};

interface EditorQuizProviderProps {
  children: React.ReactNode;
}

export const EditorQuizProvider: React.FC<EditorQuizProviderProps> = ({ children }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEditorMode, setIsEditorMode] = useState(true);
  
  // Usa o hook de lógica real do quiz
  const {
    currentQuestion,
    currentQuestionIndex,
    currentAnswers,
    canProceed,
    isLastQuestion,
    quizResult,
    handleAnswer: originalHandleAnswer,
    handleNext: originalHandleNext,
    handlePrevious: originalHandlePrevious,
    calculateResults: originalCalculateResults,
    resetQuiz: originalResetQuiz,
    totalQuestions,
  } = useQuizLogic();

  // Função para navegar diretamente para uma questão específica (modo editor)
  const goToQuestion = useCallback((index: number) => {
    if (!isPreviewMode && index >= 0 && index < totalQuestions) {
      // No modo editor, permitir navegação livre
      console.log(`Editor: Navegando para questão ${index + 1}`);
    }
  }, [isPreviewMode, totalQuestions]);

  // Wrapper das funções para adicionar logs do editor
  const handleAnswer = useCallback((questionId: string, selectedOptions: string[]) => {
    console.log(`Editor: Resposta registrada - Questão: ${questionId}, Opções: ${selectedOptions.join(', ')}`);
    originalHandleAnswer(questionId, selectedOptions);
  }, [originalHandleAnswer]);

  const handleNext = useCallback(() => {
    console.log(`Editor: Avançando da questão ${currentQuestionIndex + 1} para ${currentQuestionIndex + 2}`);
    originalHandleNext();
  }, [originalHandleNext, currentQuestionIndex]);

  const handlePrevious = useCallback(() => {
    console.log(`Editor: Voltando da questão ${currentQuestionIndex + 1} para ${currentQuestionIndex}`);
    originalHandlePrevious();
  }, [originalHandlePrevious, currentQuestionIndex]);

  const calculateResults = useCallback(() => {
    console.log('Editor: Calculando resultados do quiz');
    const result = originalCalculateResults();
    console.log('Editor: Resultado calculado:', result);
    return result;
  }, [originalCalculateResults]);

  const resetQuiz = useCallback(() => {
    console.log('Editor: Resetando quiz');
    originalResetQuiz();
  }, [originalResetQuiz]);

  const setPreviewMode = useCallback((enabled: boolean) => {
    console.log(`Editor: Modo preview ${enabled ? 'ativado' : 'desativado'}`);
    setIsPreviewMode(enabled);
    if (enabled) {
      // Quando entrar em modo preview, resetar para o início
      resetQuiz();
    }
  }, [resetQuiz]);

  // Calcular porcentagem de progresso
  const progressPercentage = Math.round((currentQuestionIndex / totalQuestions) * 100);

  const contextValue: EditorQuizContextType = {
    // Estados do quiz
    currentQuestionIndex,
    currentAnswers,
    quizResult,
    isPreviewMode,
    
    // Funções de navegação e controle
    handleAnswer,
    handleNext,
    handlePrevious,
    calculateResults,
    resetQuiz,
    
    // Controles do editor
    setPreviewMode,
    goToQuestion,
    
    // Estados computados
    canProceed,
    isLastQuestion,
    totalQuestions,
    progressPercentage,
    
    // Integração com editor
    isEditorMode,
    setEditorMode: setIsEditorMode,
  };

  return (
    <EditorQuizContext.Provider value={contextValue}>
      {children}
    </EditorQuizContext.Provider>
  );
};
