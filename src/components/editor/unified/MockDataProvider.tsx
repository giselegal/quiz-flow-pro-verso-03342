/**
 * 🎯 MOCK DATA PROVIDER - Sistema de dados mockados para preview
 * 
 * Fornece dados realistas para o preview engine simular
 * o comportamento da versão de produção com dados reais
 */

import React from 'react';

export interface MockQuizState {
  userName: string;
  currentStep: number;
  totalSteps: number;
  answers: Record<number, any>;
  progress: number;
  validationStates: Record<string, boolean>;
  selectedOptions: Record<number, string[]>;
}

export interface MockResultData {
  primaryStyle: {
    style: string;
    category: string;
    percentage: number;
    description: string;
    score: number;
  };
  secondaryStyles: Array<{
    style: string;
    category: string;
    percentage: number;
    score: number;
  }>;
  userName: string;
}

interface MockDataContextType {
  quizState: MockQuizState;
  resultData: MockResultData;
  updateQuizState: (updates: Partial<MockQuizState>) => void;
  simulateAnswer: (step: number, answer: any) => void;
  simulateValidation: (blockId: string, isValid: boolean) => void;
}

const MockDataContext = React.createContext<MockDataContextType | null>(null);

/**
 * Provider de dados mockados para o editor
 */
export const MockDataProvider: React.FC<{
  children: React.ReactNode;
  funnelId?: string;
  initialStep?: number;
}> = ({ children, initialStep = 1 }) => {
  
  const [quizState, setQuizState] = React.useState<MockQuizState>(() => ({
    userName: 'Maria Silva',
    currentStep: initialStep,
    totalSteps: 21,
    answers: {
      1: { name: 'Maria Silva' },
      2: { selectedOptions: ['opcao1', 'opcao2', 'opcao3'] },
      3: { selectedOptions: ['opcao1', 'opcao4', 'opcao6'] },
    },
    progress: (initialStep / 21) * 100,
    validationStates: {
      'step-1': true,
      'step-2': true,
      'step-3': false,
    },
    selectedOptions: {
      2: ['opcao1', 'opcao2', 'opcao3'],
      3: ['opcao1', 'opcao4', 'opcao6'],
    }
  }));

  const resultData = React.useMemo((): MockResultData => ({
    primaryStyle: {
      style: 'Clássico',
      category: 'Clássico',
      percentage: 85,
      description: 'Seu estilo clássico reflete elegância e sofisticação. Você aprecia peças atemporais e bem estruturadas que transmitem confiança e profissionalismo.',
      score: 85
    },
    secondaryStyles: [
      { 
        style: 'Romântico', 
        category: 'Romântico', 
        percentage: 65, 
        score: 65 
      },
      { 
        style: 'Natural', 
        category: 'Natural', 
        percentage: 45, 
        score: 45 
      }
    ],
    userName: quizState.userName
  }), [quizState.userName]);

  const updateQuizState = React.useCallback((updates: Partial<MockQuizState>) => {
    setQuizState(prev => ({
      ...prev,
      ...updates,
      progress: updates.currentStep ? (updates.currentStep / prev.totalSteps) * 100 : prev.progress
    }));
  }, []);

  const simulateAnswer = React.useCallback((step: number, answer: any) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [step]: answer
      },
      validationStates: {
        ...prev.validationStates,
        [`step-${step}`]: true
      }
    }));
  }, []);

  const simulateValidation = React.useCallback((blockId: string, isValid: boolean) => {
    setQuizState(prev => ({
      ...prev,
      validationStates: {
        ...prev.validationStates,
        [blockId]: isValid
      }
    }));
  }, []);

  const value = React.useMemo(() => ({
    quizState,
    resultData,
    updateQuizState,
    simulateAnswer,
    simulateValidation,
  }), [quizState, resultData, updateQuizState, simulateAnswer, simulateValidation]);

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
};

/**
 * Hook para usar dados mockados no contexto do editor
 */
export const useMockData = (): MockDataContextType => {
  const context = React.useContext(MockDataContext);
  
  if (!context) {
    // Fallback case - retorna dados padrão se usado fora do provider
    console.warn('useMockData usado fora do MockDataProvider, retornando dados padrão');
    
    return {
      quizState: {
        userName: 'Usuário Teste',
        currentStep: 1,
        totalSteps: 21,
        answers: {},
        progress: 0,
        validationStates: {},
        selectedOptions: {},
      },
      resultData: {
        primaryStyle: {
          style: 'Clássico',
          category: 'Clássico',
          percentage: 85,
          description: 'Estilo clássico e elegante',
          score: 85
        },
        secondaryStyles: [],
        userName: 'Usuário Teste'
      },
      updateQuizState: () => {},
      simulateAnswer: () => {},
      simulateValidation: () => {},
    };
  }
  
  return context;
};

/**
 * Hook para obter dados mockados específicos de uma etapa
 */
export const useMockStepData = (step: number, funnelId: string = 'quiz21StepsComplete') => {
  const { quizState, resultData } = useMockData();

  return React.useMemo(() => {
    // Dados específicos para Step 20 (resultado)
    if (step === 20) {
      return {
        type: 'result',
        ...resultData,
        isPreview: true,
      };
    }

    // Dados para Step 1 (nome)
    if (step === 1) {
      return {
        type: 'input',
        value: quizState.userName,
        placeholder: 'Digite seu nome completo',
        isValid: !!quizState.answers[1]?.name,
      };
    }

    // Dados para etapas de quiz (2-11, 13-18)
    if ((step >= 2 && step <= 11) || (step >= 13 && step <= 18)) {
      return {
        type: 'selection',
        selectedOptions: quizState.selectedOptions[step] || [],
        isValid: quizState.validationStates[`step-${step}`] || false,
        mockOptions: [
          { id: 'opcao1', text: 'Opção 1 - Mockada', description: 'Descrição da opção 1' },
          { id: 'opcao2', text: 'Opção 2 - Mockada', description: 'Descrição da opção 2' },
          { id: 'opcao3', text: 'Opção 3 - Mockada', description: 'Descrição da opção 3' },
          { id: 'opcao4', text: 'Opção 4 - Mockada', description: 'Descrição da opção 4' },
          { id: 'opcao5', text: 'Opção 5 - Mockada', description: 'Descrição da opção 5' },
          { id: 'opcao6', text: 'Opção 6 - Mockada', description: 'Descrição da opção 6' },
        ]
      };
    }

    // Dados genéricos para outras etapas
    return {
      type: 'generic',
      currentStep: step,
      progress: quizState.progress,
      totalSteps: quizState.totalSteps,
      userName: quizState.userName,
    };
  }, [step, funnelId, quizState, resultData]);
};

export default MockDataProvider;