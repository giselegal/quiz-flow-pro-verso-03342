import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  QUIZ_QUESTIONS_COMPLETE,
  QUIZ_STYLE_21_STEPS_TEMPLATE,
} from '../templates/quiz21StepsComplete';

// Adaptação temporária para compatibilidade
interface LegacyFunnelStep {
  id: string;
  name: string;
  order: number;
  blocksCount: number;
  isActive: boolean;
  type: string;
  description: string;
}

interface FunnelsContextType {
  currentFunnelId: string;
  setCurrentFunnelId: (id: string) => void;
  steps: LegacyFunnelStep[];
  setSteps: React.Dispatch<React.SetStateAction<LegacyFunnelStep[]>>;
  getTemplate: (templateId: string) => any;
  getTemplateBlocks: (templateId: string, stepId: string) => any[];
  updateFunnelStep: (stepId: string, updates: any) => void;
  addStepBlock: (stepId: string, blockData: any) => void;
  saveFunnelToDatabase: (funnelData: any) => Promise<void>;
  setActiveStageId?: (id: string) => void;
  loading: boolean;
  error: string | null;
}

interface FunnelsProviderProps {
  children: React.ReactNode;
  debug?: boolean;
}

const FunnelsContext = createContext<FunnelsContextType | undefined>(undefined);

// ✅ TEMPLATE ÚNICO - Apenas quiz21StepsComplete ativo
const FUNNEL_TEMPLATES: Record<
  string,
  {
    name: string;
    description: string;
    defaultSteps: Array<{
      id: string;
      name: string;
      order: number;
      blocksCount: number;
      isActive: boolean;
      type: string;
      description: string;
    }>;
  }
> = {
  'quiz21StepsComplete': {
    name: 'Quiz de Estilo Pessoal (21 Etapas)',
    description: 'Template único e completo do quiz de estilo pessoal',
    defaultSteps: Object.keys(QUIZ_QUESTIONS_COMPLETE).map(stepNum => {
      const stepNumber = parseInt(stepNum);
      const stepId = `step-${stepNumber}`;
      const questionText =
        QUIZ_QUESTIONS_COMPLETE[stepNumber as keyof typeof QUIZ_QUESTIONS_COMPLETE];

      return {
        id: stepId,
        name: `Etapa ${stepNumber}`,
        order: stepNumber,
        blocksCount: QUIZ_STYLE_21_STEPS_TEMPLATE[stepId]?.length || 1,
        isActive: true,
        type:
          stepNumber === 1
            ? 'lead-collection'
            : stepNumber >= 2 && stepNumber <= 11
              ? 'scored-question'
              : stepNumber === 12
                ? 'transition'
                : stepNumber >= 13 && stepNumber <= 18
                  ? 'strategic-question'
                  : stepNumber === 19
                    ? 'transition'
                    : stepNumber === 20
                      ? 'result'
                      : 'offer',
        description: questionText,
      };
    }),
  }
};

const FunnelsProvider: React.FC<FunnelsProviderProps> = ({ children, debug = false }) => {
  // ✅ CORRIGIDO: Obter funnelId dinamicamente da URL ou fallback
  const [currentFunnelId, setCurrentFunnelId] = useState<string>(() => {
    try {
      // Primeiro, tentar obter da URL
      const url = new URL(window.location.href);
      const funnelFromUrl = url.searchParams.get('funnel');
      if (funnelFromUrl) {
        console.log('🔍 FunnelsContext: funnelId da URL:', funnelFromUrl);
        return funnelFromUrl;
      }

      // Segundo, tentar obter do localStorage
      const funnelFromStorage = localStorage.getItem('editor:funnelId');
      if (funnelFromStorage) {
        console.log('🔍 FunnelsContext: funnelId do localStorage:', funnelFromStorage);
        return funnelFromStorage;
      }

      // Fallback para template único
      console.log('🔍 FunnelsContext: usando template padrão');
      return 'quiz21StepsComplete';
    } catch (e) {
      console.warn('🔍 FunnelsContext: erro ao obter funnelId, usando padrão');
      return 'quiz21StepsComplete';
    }
  });

  const [steps, setSteps] = useState<LegacyFunnelStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ CORRIGIDO: Inicializar steps do template único
  useEffect(() => {
    const template = FUNNEL_TEMPLATES[currentFunnelId] || FUNNEL_TEMPLATES['quiz21StepsComplete'];
    setSteps(template.defaultSteps);

    if (debug) {
      console.log('📋 FunnelsContext: inicializando steps', {
        funnelId: currentFunnelId,
        stepsCount: template.defaultSteps.length,
        template: template.name
      });
    }
  }, [currentFunnelId, debug]);

  // ✅ Função para obter template único
  const getTemplate = useCallback((templateId: string) => {
    // Sempre retornar o template único
    const template = FUNNEL_TEMPLATES['quiz21StepsComplete'];

    if (debug) {
      console.log('📖 FunnelsContext: getTemplate', {
        requested: templateId,
        returned: 'quiz21StepsComplete',
        stepsCount: template.defaultSteps.length
      });
    }

    return template;
  }, [debug]);

  // ✅ Função para obter blocos do template único
  const getTemplateBlocks = useCallback((templateId: string, stepId: string) => {
    const blocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId] || [];

    if (debug) {
      console.log('🧱 FunnelsContext: getTemplateBlocks', {
        templateId,
        stepId,
        blocksCount: blocks.length
      });
    }

    return blocks;
  }, [debug]);

  // ✅ Função para atualizar etapa
  const updateFunnelStep = useCallback((stepId: string, updates: any) => {
    setSteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    ));

    if (debug) {
      console.log('✏️ FunnelsContext: updateFunnelStep', { stepId, updates });
    }
  }, [debug]);

  // ✅ Função para adicionar bloco
  const addStepBlock = useCallback((stepId: string, blockData: any) => {
    // Lógica simplificada para adicionar bloco
    if (debug) {
      console.log('➕ FunnelsContext: addStepBlock', { stepId, blockData });
    }
  }, [debug]);

  // ✅ Função para salvar no banco
  const saveFunnelToDatabase = useCallback(async (funnelData: any) => {
    setLoading(true);
    setError(null);

    try {
      const { error: saveError } = await supabase
        .from('funnels')
        .upsert(funnelData);

      if (saveError) throw saveError;

      if (debug) {
        console.log('💾 FunnelsContext: saveFunnelToDatabase - sucesso');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao salvar funil';
      setError(errorMessage);

      if (debug) {
        console.error('💾 FunnelsContext: saveFunnelToDatabase - erro:', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [debug]);

  const value: FunnelsContextType = {
    currentFunnelId,
    setCurrentFunnelId,
    steps,
    setSteps,
    getTemplate,
    getTemplateBlocks,
    updateFunnelStep,
    addStepBlock,
    saveFunnelToDatabase,
    loading,
    error,
  };

  return (
    <FunnelsContext.Provider value={value}>
      {children}
    </FunnelsContext.Provider>
  );
};

export { FunnelsProvider };

export const useFunnels = () => {
  const context = useContext(FunnelsContext);
  if (context === undefined) {
    throw new Error('useFunnels deve ser usado dentro de um FunnelsProvider');
  }
  return context;
};
