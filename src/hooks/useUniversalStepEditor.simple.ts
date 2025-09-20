/**
 * 🎯 HOOK UNIVERSAL STEP EDITOR SIMPLE - PLACEHOLDER
 * 
 * Hook temporário para resolver dependências de imports
 */

import { useState, useCallback } from 'react';

export interface UniversalStepData {
  id: string;
  type: string;
  content: Record<string, any>;
  order: number;
}

export const useUniversalStepEditorSimple = () => {
  const [steps, setSteps] = useState<UniversalStepData[]>([]);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadStep = useCallback(async (stepId: string) => {
    setIsLoading(true);
    console.log('📥 Carregando step:', stepId);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setCurrentStep(stepId);
    setIsLoading(false);
  }, []);

  const saveStep = useCallback(async (stepId: string, data: any) => {
    setIsLoading(true);
    console.log('💾 Salvando step:', stepId, data);
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, content: data } : step
    ));
    
    setIsLoading(false);
  }, []);

  const handleError = useCallback((error: any) => {
    console.error('❌ Error in Universal Step Editor:', error);
  }, []);

  return {
    steps,
    currentStep,
    isLoading,
    loadStep,
    saveStep,
    handleError,
    totalSteps: steps.length
  };
};

export default useUniversalStepEditorSimple;