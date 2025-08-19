/**
 * 🎪 QUIZ FLOW ORCHESTRATOR
 * Orquestrador principal do fluxo de 21 etapas
 * Conecta produção e editor com mesma fonte de dados
 */

import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

// 📊 TIPOS DO ORQUESTRADOR
interface QuizFlowState {
  currentStep: number;
  userName: string;
  answers: QuizAnswer[];
  strategicAnswers: StrategicAnswer[];
  quizResult: QuizResult | null;
  isLoading: boolean;
  isCompleted: boolean;
  stepData: Record<string, Block[]>;
}

interface QuizAnswer {
  questionId: string;
  optionId: string;
  timestamp: number;
  stepNumber: number;
}

interface StrategicAnswer {
  questionId: string;
  optionId: string;
  category: string;
  timestamp: number;
}

interface QuizResult {
  predominantStyle: string;
  secondaryStyles: Array<{
    style: string;
    percentage: number;
  }>;
  recommendations: string[];
}

// 🔄 AÇÕES DO REDUCER
type QuizFlowAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_USER_NAME'; payload: string }
  | { type: 'ADD_ANSWER'; payload: QuizAnswer }
  | { type: 'ADD_STRATEGIC_ANSWER'; payload: StrategicAnswer }
  | { type: 'SET_RESULT'; payload: QuizResult }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_QUIZ' }
  | { type: 'LOAD_STEP_DATA'; payload: Record<string, Block[]> };

// 🎯 ESTADO INICIAL
const initialState: QuizFlowState = {
  currentStep: 1,
  userName: '',
  answers: [],
  strategicAnswers: [],
  quizResult: null,
  isLoading: false,
  isCompleted: false,
  stepData: {},
};

// 🔄 REDUCER PRINCIPAL
const quizFlowReducer = (state: QuizFlowState, action: QuizFlowAction): QuizFlowState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'SET_USER_NAME':
      return { ...state, userName: action.payload };

    case 'ADD_ANSWER':
      return {
        ...state,
        answers: [
          ...state.answers.filter(a => a.questionId !== action.payload.questionId),
          action.payload,
        ],
      };

    case 'ADD_STRATEGIC_ANSWER':
      return {
        ...state,
        strategicAnswers: [
          ...state.strategicAnswers.filter(a => a.questionId !== action.payload.questionId),
          action.payload,
        ],
      };

    case 'SET_RESULT':
      return { ...state, quizResult: action.payload, isCompleted: true };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'LOAD_STEP_DATA':
      return { ...state, stepData: action.payload };

    case 'RESET_QUIZ':
      return initialState;

    default:
      return state;
  }
};

// 🎪 CONTEXT DO ORQUESTRADOR
const QuizFlowContext = createContext<{
  state: QuizFlowState;
  actions: {
    setStep: (step: number) => void;
    setUserName: (name: string) => void;
    addAnswer: (questionId: string, optionId: string, stepNumber: number) => void;
    addStrategicAnswer: (questionId: string, optionId: string, category: string) => void;
    nextStep: () => void;
    prevStep: () => void;
    calculateResult: () => void;
    resetQuiz: () => void;
    getStepBlocks: (step: number) => Block[];
  };
} | null>(null);

// 🔧 PROVIDER DO ORQUESTRADOR
export const QuizFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizFlowReducer, initialState);

  // 📊 CARREGAR DADOS DAS ETAPAS
  useEffect(() => {
    dispatch({ type: 'LOAD_STEP_DATA', payload: QUIZ_STYLE_21_STEPS_TEMPLATE });
  }, []);

  // 🎯 AÇÕES DO ORQUESTRADOR
  const actions = {
    setStep: useCallback((step: number) => {
      dispatch({ type: 'SET_STEP', payload: step });
    }, []),

    setUserName: useCallback((name: string) => {
      dispatch({ type: 'SET_USER_NAME', payload: name });
    }, []),

    addAnswer: useCallback((questionId: string, optionId: string, stepNumber: number) => {
      const answer: QuizAnswer = {
        questionId,
        optionId,
        timestamp: Date.now(),
        stepNumber,
      };
      dispatch({ type: 'ADD_ANSWER', payload: answer });
    }, []),

    addStrategicAnswer: useCallback((questionId: string, optionId: string, category: string) => {
      const strategicAnswer: StrategicAnswer = {
        questionId,
        optionId,
        category,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_STRATEGIC_ANSWER', payload: strategicAnswer });
    }, []),

    nextStep: useCallback(() => {
      if (state.currentStep < 21) {
        dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
      }
    }, [state.currentStep]),

    prevStep: useCallback(() => {
      if (state.currentStep > 1) {
        dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
      }
    }, [state.currentStep]),

    calculateResult: useCallback(() => {
      dispatch({ type: 'SET_LOADING', payload: true });

      // 🧮 ALGORITMO DE CÁLCULO
      const styleScores: Record<string, number> = {};

      // Processar respostas das questões pontuadas (etapas 2-11)
      state.answers.forEach(answer => {
        const style = answer.optionId.split('_')[0]; // natural_q1 -> natural
        styleScores[style] = (styleScores[style] || 0) + 1;
      });

      // Encontrar estilo predominante
      const sortedStyles = Object.entries(styleScores).sort(([, a], [, b]) => b - a);

      const predominantStyle = sortedStyles[0]?.[0] || 'natural';
      const secondaryStyles = sortedStyles.slice(1, 3).map(([style, score]) => ({
        style,
        percentage: Math.round((score / state.answers.length) * 100),
      }));

      const result: QuizResult = {
        predominantStyle,
        secondaryStyles,
        recommendations: [
          `Seu estilo ${predominantStyle} reflete sua personalidade única`,
          'Invista em peças que valorizem suas características naturais',
          'Combine elementos dos estilos secundários para criar looks únicos',
        ],
      };

      setTimeout(() => {
        dispatch({ type: 'SET_RESULT', payload: result });
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 2000);
    }, [state.answers]),

    resetQuiz: useCallback(() => {
      dispatch({ type: 'RESET_QUIZ' });
    }, []),

    getStepBlocks: useCallback(
      (step: number): Block[] => {
        const stepKey = `step-${step}`;
        return state.stepData[stepKey] || [];
      },
      [state.stepData]
    ),
  };

  return <QuizFlowContext.Provider value={{ state, actions }}>{children}</QuizFlowContext.Provider>;
};

// 🎯 HOOK PARA USAR O ORQUESTRADOR
export const useQuizFlow = () => {
  const context = useContext(QuizFlowContext);
  if (!context) {
    throw new Error('useQuizFlow must be used within QuizFlowProvider');
  }
  return context;
};

// 📊 HOOK PARA DADOS DA ETAPA ATUAL
export const useCurrentStepData = () => {
  const { state, actions } = useQuizFlow();

  return {
    stepNumber: state.currentStep,
    blocks: actions.getStepBlocks(state.currentStep),
    progress: Math.round((state.currentStep / 21) * 100),
    canGoNext: state.currentStep < 21,
    canGoPrev: state.currentStep > 1,
  };
};

export default QuizFlowProvider;
