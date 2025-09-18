import React, { createContext, useContext, ReactNode } from 'react';
import { useQuizResult } from '@/hooks/useQuizResult';
import { getBestUserName } from '@/core/user/name';
import { mapToFriendlyStyle } from '@/core/style/naming';
import { computeEffectivePrimaryPercentage } from '@/core/result/percentage';

interface QuizDataContextType {
  // Dados principais
  userName: string;
  primaryStyle: {
    style: string;
    category: string;
    description: string;
    percentage: number;
  } | null;
  secondaryStyles: Array<{
    style: string;
    category: string;
    percentage: number;
  }>;
  
  // Estados
  isLoading: boolean;
  error: string | null;
  hasResult: boolean;
  
  // Métodos
  retry: () => void;
  refreshData: () => void;
  setPreviewMode: (enabled: boolean) => void;
}

const QuizDataContext = createContext<QuizDataContextType | null>(null);

interface QuizDataProviderProps {
  children: ReactNode;
  block?: any;
  fallbackUserName?: string;
}

export const QuizDataProvider: React.FC<QuizDataProviderProps> = ({
  children,
  block,
  fallbackUserName = 'Participante'
}) => {
  const { primaryStyle, secondaryStyles, isLoading, error, retry, hasResult } = useQuizResult();

  // Dados processados para consumo fácil
  const userName = getBestUserName(block) || fallbackUserName;
  
  const processedPrimaryStyle = primaryStyle ? {
    style: mapToFriendlyStyle(primaryStyle.style || primaryStyle.category || 'Natural'),
    category: primaryStyle.category || primaryStyle.style || 'Natural',
    description: (primaryStyle as any).description || `Seu estilo ${primaryStyle.category || 'único'} reflete sua personalidade e forma de expressão.`,
    percentage: computeEffectivePrimaryPercentage(
      primaryStyle as any,
      secondaryStyles as any[],
      primaryStyle.percentage || 85
    )
  } : null;

  const processedSecondaryStyles = (secondaryStyles || []).map(style => ({
    style: mapToFriendlyStyle(style.style || style.category || 'Complementar'),
    category: style.category || style.style || 'Complementar',
    percentage: style.percentage || 0
  }));

  // Método para atualizar dados (placeholder para futuras funcionalidades)
  const refreshData = () => {
    retry();
  };

  const setPreviewMode = (enabled: boolean) => {
    // Placeholder para modo de preview
    console.log('Preview mode:', enabled);
  };

  const contextValue: QuizDataContextType = {
    userName,
    primaryStyle: processedPrimaryStyle,
    secondaryStyles: processedSecondaryStyles,
    isLoading,
    error,
    hasResult,
    retry,
    refreshData,
    setPreviewMode
  };

  return (
    <QuizDataContext.Provider value={contextValue}>
      {children}
    </QuizDataContext.Provider>
  );
};

export const useQuizData = () => {
  const context = useContext(QuizDataContext);
  if (!context) {
    throw new Error('useQuizData deve ser usado dentro de QuizDataProvider');
  }
  return context;
};

export default QuizDataProvider;