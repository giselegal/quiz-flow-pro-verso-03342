import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { FunnelConfig, FunnelStepConfig } from '@/types/funnel';

// Contexto para configuração do funil
interface FunnelConfigContextType {
  config: FunnelConfig;
  currentStepIndex: number;
  updateConfig: (newConfig: Partial<FunnelConfig>) => void;
  updateStep: (stepId: string, updates: Partial<FunnelStepConfig>) => void;
  setCurrentStepIndex: (index: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  userData: Record<string, any>;
  updateUserData: (data: Record<string, any>) => void;
  answers: Record<string, any>;
  updateAnswer: (questionId: string, answer: any) => void;
  result: Record<string, any> | null;
  setResult: (result: Record<string, any>) => void;
}

// Configuração padrão
const defaultConfig: FunnelConfig = {
  steps: [],
  theme: {
    primaryColor: '#B89B7A',
    secondaryColor: '#403C34',
    backgroundColor: '#FFFFFF',
    textColor: '#333333',
    fontFamily: 'Inter, sans-serif',
  },
  settings: {
    showProgressBar: true,
    autoAdvance: false,
    enableHistory: true,
    analyticsEnabled: true,
  },
};

const FunnelConfigContext = createContext<FunnelConfigContextType>({
  config: defaultConfig,
  currentStepIndex: 0,
  updateConfig: () => {},
  updateStep: () => {},
  setCurrentStepIndex: () => {},
  nextStep: () => {},
  previousStep: () => {},
  userData: {},
  updateUserData: () => {},
  answers: {},
  updateAnswer: () => {},
  result: null,
  setResult: () => {},
});

// Provider componente
export const FunnelConfigProvider: React.FC<{
  children: ReactNode;
  initialConfig?: FunnelConfig;
}> = ({ children, initialConfig }) => {
  const [config, setConfig] = useState<FunnelConfig>(initialConfig || defaultConfig);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userData, setUserData] = useState<Record<string, any>>({});
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<Record<string, any> | null>(null);

  // Atualizar configuração
  const updateConfig = (newConfig: Partial<FunnelConfig>) => {
    setConfig(current => ({ ...current, ...newConfig }));
  };

  // Atualizar uma etapa específica
  const updateStep = (stepId: string, updates: Partial<FunnelStepConfig>) => {
    setConfig(current => ({
      ...current,
      steps: current.steps.map(step => (step.id === stepId ? { ...step, ...updates } : step)),
    }));
  };

  // Navegação
  const nextStep = () => {
    if (currentStepIndex < config.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Atualizar dados do usuário
  const updateUserData = (data: Record<string, any>) => {
    setUserData(current => ({ ...current, ...data }));
  };

  // Atualizar resposta
  const updateAnswer = (questionId: string, answer: any) => {
    setAnswers(current => ({ ...current, [questionId]: answer }));
  };

  return (
    <FunnelConfigContext.Provider
      value={{
        config,
        currentStepIndex,
        updateConfig,
        updateStep,
        setCurrentStepIndex,
        nextStep,
        previousStep,
        userData,
        updateUserData,
        answers,
        updateAnswer,
        result,
        setResult,
      }}
    >
      {children}
    </FunnelConfigContext.Provider>
  );
};

// Hook para usar o contexto
export const useFunnelConfig = () => useContext(FunnelConfigContext);

export default FunnelConfigProvider;
