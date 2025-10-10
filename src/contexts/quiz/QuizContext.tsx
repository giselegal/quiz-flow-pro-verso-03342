import React, { createContext, useContext, ReactNode, useEffect, useRef } from 'react';
import { useQuizLogic } from '../../hooks/useQuizLogic';
import { useToast } from '@/components/ui/use-toast';
import { QuizResult, StyleResult } from '@/types/quiz';
import { QuizFlowProvider } from '@/contexts';

// Define the context type
type QuizContextType = ReturnType<typeof useQuizLogic> & {
  startQuiz: (name: string, email: string, quizId: string) => Promise<any>;
  submitAnswers: (
    answers: Array<{ questionId: string; optionId: string; points: number }>
  ) => Promise<void>;
  submitResults: (results: QuizResult) => Promise<void>;
};

// Create context with undefined default
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Provider component
/**
 * DEPRECATION NOTICE
 * QuizProvider é legado. Prefira usar QuizFlowProvider + serviços de resultado.
 * Este provedor agora compõe QuizFlowProvider para compatibilidade.
 */
export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const quizLogic = useQuizLogic();
  const { toast } = useToast();
  const warnedRef = useRef(false);

  // Aviso de depreciação em desenvolvimento (uma vez)
  useEffect(() => {
    if (warnedRef.current) return;
    warnedRef.current = true;
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        '[Deprecation] QuizProvider está obsoleto. Migre para QuizFlowProvider e use os hooks/serviços de resultado atuais.'
      );
    }
  }, []);

  // Define all context functions before returning the provider
  const startQuiz = async (name: string, email: string, quizId: string) => {
    try {
      console.log(`Starting quiz for ${name} (${email}) with quiz ID ${quizId}`);
      return { id: '1', name, email };
    } catch (error) {
      toast({
        title: 'Erro ao iniciar o quiz',
        description: 'Por favor, tente novamente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const submitAnswers = async (
    answers: Array<{ questionId: string; optionId: string; points: number }>
  ) => {
    try {
      console.log('Submitting answers:', answers);
    } catch (error) {
      toast({
        title: 'Erro ao salvar respostas',
        description: 'Por favor, tente novamente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const submitResults = async (results: QuizResult) => {
    try {
      console.log('Results submitted:', results);
      // Persistência local para compatibilidade com componentes que leem quizResult
      try {
        localStorage.setItem('quizResult', JSON.stringify(results));
        window.dispatchEvent(new Event('quiz-result-updated'));
      } catch (e) {
        console.debug('QuizProvider: falha ao persistir quizResult localmente', e);
      }
      window.location.href = '/resultado';
    } catch (error) {
      toast({
        title: 'Erro ao salvar resultados',
        description: 'Por favor, tente novamente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Spread quizLogic and add our additional functions
  const contextValue = {
    ...quizLogic,
    startQuiz,
    submitAnswers,
    submitResults,
  };

  // Return the provider
  // Compor com QuizFlowProvider para garantir que o fluxo de etapas esteja disponível
  return (
    <QuizFlowProvider>
      <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
    </QuizFlowProvider>
  );
};

// Hook for using the context
export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};

// Export a simplification of the context
export const useQuiz = () => {
  const { toast } = useToast();

  const getQuizResult = (): {
    primaryStyle: StyleResult;
    secondaryStyles: StyleResult[];
  } | null => {
    try {
      const savedResult = localStorage.getItem('quizResult');
      if (savedResult) {
        const parsedResult = JSON.parse(savedResult);
        return {
          primaryStyle: parsedResult.primaryStyle,
          secondaryStyles: parsedResult.secondaryStyles || [],
        };
      }
      return null;
    } catch (error) {
      console.error('Error loading quiz result:', error);
      return null;
    }
  };

  const quizResult = getQuizResult();

  return {
    ...quizResult,
    startQuiz: async (name: string, email: string, quizId: string) => {
      try {
        console.log(`Starting quiz for ${name} (${email}) with quiz ID ${quizId}`);
        return { id: '1', name, email };
      } catch (error) {
        toast({
          title: 'Erro ao iniciar o quiz',
          description: 'Por favor, tente novamente.',
          variant: 'destructive',
        });
        throw error;
      }
    },

    submitAnswers: async (
      answers: Array<{ questionId: string; optionId: string; points: number }>
    ) => {
      try {
        console.log('Submitting answers:', answers);
      } catch (error) {
        toast({
          title: 'Erro ao salvar respostas',
          description: 'Por favor, tente novamente.',
          variant: 'destructive',
        });
        throw error;
      }
    },

    submitResults: async (results: QuizResult) => {
      try {
        console.log('Results submitted:', results);
        // Persistência local + evento para compatibilidade
        try {
          localStorage.setItem('quizResult', JSON.stringify(results));
          window.dispatchEvent(new Event('quiz-result-updated'));
        } catch (e) {
          console.debug('useQuiz: falha ao persistir quizResult localmente', e);
        }
        window.location.href = '/resultado';
      } catch (error) {
        toast({
          title: 'Erro ao salvar resultados',
          description: 'Por favor, tente novamente.',
          variant: 'destructive',
        });
        throw error;
      }
    },
  };
};
