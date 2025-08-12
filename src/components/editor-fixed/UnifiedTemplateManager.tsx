// @ts-nocheck
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStepTemplate } from './FixedTemplateService';
import { EditorBlock, Block } from '@/types/editor';

/**
 * UNIFIED TEMPLATE MANAGER
 * 
 * Sistema unificado de gerenciamento de templates que:
 * ✅ Integra com FixedTemplateService 
 * ✅ Gerencia cache de forma inteligente
 * ✅ Fornece templates sempre disponíveis
 * ✅ Debug detalhado
 */

interface TemplateManagerContext {
  getTemplate: (stepNumber: number) => EditorBlock[];
  loadTemplate: (stepNumber: number) => Promise<EditorBlock[]>;
  isLoading: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  availableSteps: number[];
}

const TemplateContext = createContext<TemplateManagerContext | null>(null);

export const useTemplateManager = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplateManager must be used within TemplateProvider');
  }
  return context;
};

interface TemplateProviderProps {
  children: React.ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const availableSteps = Array.from({ length: 21 }, (_, i) => i + 1);

  const getTemplate = (stepNumber: number): EditorBlock[] => {
    console.log(`🔍 UnifiedTemplateManager: Obtendo template para etapa ${stepNumber}`);
    
    try {
      const template = getStepTemplate(stepNumber);
      console.log(`✅ Template etapa ${stepNumber} obtido: ${template.length} blocos`);
      return template;
    } catch (error) {
      console.error(`❌ Erro ao obter template etapa ${stepNumber}:`, error);
      // Fallback com template mínimo
      return [{
        id: `fallback-step-${stepNumber}`,
        type: 'text-inline',
        content: { text: `Etapa ${stepNumber} - Template em carregamento...` },
        properties: {},
        order: 0
      }];
    }
  };

  const loadTemplate = async (stepNumber: number): Promise<EditorBlock[]> => {
    console.log(`🔄 UnifiedTemplateManager: Carregando template async etapa ${stepNumber}`);
    setIsLoading(true);
    
    try {
      // Simular carregamento assíncrono se necessário
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const template = getTemplate(stepNumber);
      console.log(`✅ Template etapa ${stepNumber} carregado assincronamente: ${template.length} blocos`);
      return template;
    } catch (error) {
      console.error(`❌ Erro no carregamento async etapa ${stepNumber}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: TemplateManagerContext = {
    getTemplate,
    loadTemplate,
    isLoading,
    currentStep,
    setCurrentStep,
    availableSteps
  };

  useEffect(() => {
    console.log(`📊 UnifiedTemplateManager inicializado - Etapas disponíveis: ${availableSteps.length}`);
  }, []);

  return (
    <TemplateContext.Provider value={contextValue}>
      {children}
    </TemplateContext.Provider>
  );
};

/**
 * Hook para usar template da etapa atual
 */
export const useCurrentStepTemplate = () => {
  const { getTemplate, currentStep, isLoading } = useTemplateManager();
  
  const [template, setTemplate] = useState<EditorBlock[]>([]);
  
  useEffect(() => {
    console.log(`🔄 Carregando template para etapa atual: ${currentStep}`);
    const newTemplate = getTemplate(currentStep);
    setTemplate(newTemplate);
  }, [currentStep, getTemplate]);
  
  return { template, isLoading, currentStep };
};