
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface FunnelStep {
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
  steps: FunnelStep[];
  setSteps: React.Dispatch<React.SetStateAction<FunnelStep[]>>;
  getTemplate: (templateId: string) => any;
  updateFunnelStep: (stepId: string, updates: any) => void;
  addStepBlock: (stepId: string, blockData: any) => void;
  saveFunnelToDatabase: (funnelData: any) => Promise<void>;
  loading: boolean;
  error: string | null;
}

interface FunnelsProviderProps {
  children: React.ReactNode;
  debug?: boolean;
}

const FunnelsContext = createContext<FunnelsContextType | undefined>(undefined);

const FUNNEL_TEMPLATES: Record<string, {
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
}> = {
  'quiz-estilo': {
    name: 'Quiz de Estilo',
    description: 'Quiz para descobrir o estilo pessoal',
    defaultSteps: [
      { id: 'step-1', name: 'Introdução', order: 1, blocksCount: 3, isActive: true, type: 'intro', description: 'Página inicial do quiz' },
      { id: 'step-2', name: 'Pergunta 1', order: 2, blocksCount: 2, isActive: true, type: 'question', description: 'Primeira pergunta' },
      { id: 'step-3', name: 'Pergunta 2', order: 3, blocksCount: 2, isActive: true, type: 'question', description: 'Segunda pergunta' },
      { id: 'step-4', name: 'Resultado', order: 4, blocksCount: 4, isActive: true, type: 'result', description: 'Página de resultado' }
    ]
  },
  'quiz-personalidade': {
    name: 'Quiz de Personalidade',
    description: 'Quiz para descobrir traços de personalidade',
    defaultSteps: [
      { id: 'step-1', name: 'Boas-vindas', order: 1, blocksCount: 2, isActive: true, type: 'intro', description: 'Página de boas-vindas' },
      { id: 'step-2', name: 'Pergunta A', order: 2, blocksCount: 3, isActive: true, type: 'question', description: 'Pergunta sobre comportamento' },
      { id: 'step-3', name: 'Pergunta B', order: 3, blocksCount: 3, isActive: true, type: 'question', description: 'Pergunta sobre preferências' },
      { id: 'step-4', name: 'Análise', order: 4, blocksCount: 5, isActive: true, type: 'result', description: 'Análise da personalidade' }
    ]
  },
  'quiz-vazio': {
    name: 'Quiz Vazio',
    description: 'Template básico para começar do zero',
    defaultSteps: [
      { id: 'step-1', name: 'Etapa 1', order: 1, blocksCount: 1, isActive: true, type: 'intro', description: 'Primeira etapa' }
    ]
  }
};

export const FunnelsProvider: React.FC<FunnelsProviderProps> = ({ children, debug = false }) => {
  const [currentFunnelId, setCurrentFunnelId] = useState<string>('quiz-vazio');
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTemplate = useCallback((templateId: string) => {
    const template = FUNNEL_TEMPLATES[templateId as keyof typeof FUNNEL_TEMPLATES];
    if (!template) {
      console.warn(`Template ${templateId} não encontrado. Usando template padrão.`);
      return FUNNEL_TEMPLATES['quiz-vazio'];
    }
    return template;
  }, []);

  useEffect(() => {
    if (debug) {
      console.log('[FunnelsContext] Carregando template:', currentFunnelId);
    }
    
    const template = getTemplate(currentFunnelId);
    setSteps(template.defaultSteps);
    
    if (debug) {
      console.log('[FunnelsContext] Steps carregados:', template.defaultSteps);
    }
  }, [currentFunnelId, getTemplate, debug]);

  const updateFunnelStep = useCallback((stepId: string, updates: any) => {
    const template = FUNNEL_TEMPLATES[currentFunnelId as keyof typeof FUNNEL_TEMPLATES];
    if (!template) return;

    setSteps(currentSteps => {
      return currentSteps.map((step: any) => {
        if (step.id === stepId) {
          return { ...step, ...updates };
        }
        return step;
      });
    });
  }, [currentFunnelId]);

  const addStepBlock = useCallback((stepId: string, blockData: any) => {
    setSteps(currentSteps => {
      return currentSteps.map((step: any) => {
        if (step.id === stepId) {
          return {
            ...step,
            blocksCount: step.blocksCount + 1
          };
        }
        return step;
      });
    });
  }, []);

  // Fix the Supabase upsert call - need to provide proper funnel data structure
  const saveFunnelToDatabase = useCallback(async (funnelData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const funnelRecord = {
        id: currentFunnelId,
        name: funnelData.name || 'Funnel sem nome',
        description: funnelData.description || '',
        is_published: funnelData.isPublished || false,
        settings: { theme: funnelData.theme || 'default' },
        user_id: 'anonymous', // This should come from auth in real implementation
        updated_at: new Date().toISOString()
      };

      const { data, error: supabaseError } = await supabase
        .from('funnels')
        .upsert([funnelRecord])
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      console.log('Funil salvo com sucesso:', data);
    } catch (error) {
      console.error('Erro ao salvar funil:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [currentFunnelId]);

  const contextValue: FunnelsContextType = {
    currentFunnelId,
    setCurrentFunnelId,
    steps,
    setSteps,
    getTemplate,
    updateFunnelStep,
    addStepBlock,
    saveFunnelToDatabase,
    loading,
    error
  };

  return (
    <FunnelsContext.Provider value={contextValue}>
      {children}
    </FunnelsContext.Provider>
  );
};

export const useFunnels = (): FunnelsContextType => {
  const context = useContext(FunnelsContext);
  if (context === undefined) {
    throw new Error('useFunnels must be used within a FunnelsProvider');
  }
  return context;
};
