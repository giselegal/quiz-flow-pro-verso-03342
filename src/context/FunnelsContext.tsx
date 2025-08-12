import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
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
  'quiz-estilo': {
    name: 'Quiz de Estilo',
    description: 'Quiz para descobrir o estilo pessoal',
    defaultSteps: [
      {
        id: 'step-1',
        name: 'Introdução',
        order: 1,
        blocksCount: 3,
        isActive: true,
        type: 'intro',
        description: 'Página inicial do quiz',
      },
      {
        id: 'step-2',
        name: 'Pergunta 1',
        order: 2,
        blocksCount: 2,
        isActive: true,
        type: 'question',
        description: 'Primeira pergunta',
      },
      {
        id: 'step-3',
        name: 'Pergunta 2',
        order: 3,
        blocksCount: 2,
        isActive: true,
        type: 'question',
        description: 'Segunda pergunta',
      },
      {
        id: 'step-4',
        name: 'Resultado',
        order: 4,
        blocksCount: 4,
        isActive: true,
        type: 'result',
        description: 'Página de resultado',
      },
    ],
  },
  'quiz-personalidade': {
    name: 'Quiz de Personalidade',
    description: 'Quiz para descobrir traços de personalidade',
    defaultSteps: [
      {
        id: 'step-1',
        name: 'Boas-vindas',
        order: 1,
        blocksCount: 2,
        isActive: true,
        type: 'intro',
        description: 'Página de boas-vindas',
      },
      {
        id: 'step-2',
        name: 'Pergunta A',
        order: 2,
        blocksCount: 3,
        isActive: true,
        type: 'question',
        description: 'Pergunta sobre comportamento',
      },
      {
        id: 'step-3',
        name: 'Pergunta B',
        order: 3,
        blocksCount: 3,
        isActive: true,
        type: 'question',
        description: 'Pergunta sobre preferências',
      },
      {
        id: 'step-4',
        name: 'Análise',
        order: 4,
        blocksCount: 5,
        isActive: true,
        type: 'result',
        description: 'Análise da personalidade',
      },
    ],
  },
  'quiz-vazio': {
    name: 'Quiz Vazio',
    description: 'Template básico para começar do zero',
    defaultSteps: [
      {
        id: 'step-1',
        name: 'Etapa 1',
        order: 1,
        blocksCount: 1,
        isActive: true,
        type: 'intro',
        description: 'Primeira etapa',
      },
    ],
  },
  'funil-21-etapas': {
    name: 'Funil Completo 21 Etapas',
    description: 'Funil completo com todas as 21 etapas do quiz',
    defaultSteps: [
      {
        id: 'step-1',
        name: 'Introdução',
        order: 1,
        blocksCount: 3,
        isActive: true,
        type: 'intro',
        description: 'Página de apresentação do quiz',
      },
      {
        id: 'step-2',
        name: 'Q1 - Profissão',
        order: 2,
        blocksCount: 4,
        isActive: false,
        type: 'question',
        description: 'Qual é a sua profissão atual?',
      },
      {
        id: 'step-3',
        name: 'Q2 - Experiência',
        order: 3,
        blocksCount: 4,
        isActive: false,
        type: 'question',
        description: 'Anos de experiência profissional',
      },
      {
        id: 'step-4',
        name: 'Q3 - Setor',
        order: 4,
        blocksCount: 4,
        isActive: false,
        type: 'question',
        description: 'Em qual setor você trabalha?',
      },
      {
        id: 'step-5',
        name: 'Q4 - Desafios',
        order: 5,
        blocksCount: 4,
        isActive: false,
        type: 'question',
        description: 'Principais desafios profissionais',
      },
      {
        id: 'step-6',
        name: 'Q5 - Objetivos',
        order: 6,
        blocksCount: 4,
        isActive: false,
        type: 'question',
        description: 'Objetivos de carreira',
      },
      {
        id: 'step-7',
        name: 'Q6 - Habilidades',
        order: 7,
        blocksCount: 4,
        isActive: false,
        type: 'question',
        description: 'Habilidades que deseja desenvolver',
      },
      {
        id: 'step-8',
        name: 'Q7 - Motivação',
        order: 8,
        blocksCount: 4,
        isActive: false,
        type: 'question',
        description: 'O que mais te motiva no trabalho?',
      },
      {
        id: 'step-9',
        name: 'Q8 - Aprendizado',
        order: 9,
        blocksCount: 4,
        isActive: false,
        type: 'question',
        description: 'Preferência de aprendizado',
      },
      {
        id: 'step-10',
        name: 'Q9 - Liderança',
        order: 10,
        blocksCount: 4,
        isActive: false,
        type: 'question',
        description: 'Experiência em liderança',
      },
      {
        id: 'step-11',
        name: 'Q10 - Futuro',
        order: 11,
        blocksCount: 4,
        isActive: false,
        type: 'question',
        description: 'Visão de futuro profissional',
      },
      {
        id: 'step-12',
        name: 'Transição',
        order: 12,
        blocksCount: 2,
        isActive: false,
        type: 'transition',
        description: 'Preparando seus resultados...',
      },
      {
        id: 'step-13',
        name: 'Resultado 1',
        order: 13,
        blocksCount: 5,
        isActive: false,
        type: 'result',
        description: 'Resultado Inovador',
      },
      {
        id: 'step-14',
        name: 'Resultado 2',
        order: 14,
        blocksCount: 5,
        isActive: false,
        type: 'result',
        description: 'Resultado Estratégico',
      },
      {
        id: 'step-15',
        name: 'Resultado 3',
        order: 15,
        blocksCount: 5,
        isActive: false,
        type: 'result',
        description: 'Resultado Executivo',
      },
      {
        id: 'step-16',
        name: 'Resultado 4',
        order: 16,
        blocksCount: 5,
        isActive: false,
        type: 'result',
        description: 'Resultado Colaborativo',
      },
      {
        id: 'step-17',
        name: 'Resultado 5',
        order: 17,
        blocksCount: 5,
        isActive: false,
        type: 'result',
        description: 'Resultado Técnico',
      },
      {
        id: 'step-18',
        name: 'Resultado 6',
        order: 18,
        blocksCount: 5,
        isActive: false,
        type: 'result',
        description: 'Resultado Analítico',
      },
      {
        id: 'step-19',
        name: 'Lead Magnet',
        order: 19,
        blocksCount: 3,
        isActive: false,
        type: 'lead',
        description: 'Captura de email',
      },
      {
        id: 'step-20',
        name: 'Oferta',
        order: 20,
        blocksCount: 6,
        isActive: false,
        type: 'offer',
        description: 'Página de vendas',
      },
      {
        id: 'step-21',
        name: 'Finalização',
        order: 21,
        blocksCount: 4,
        isActive: false,
        type: 'final',
        description: 'Conclusão e próximos passos',
      },
    ],
  },
};

export const FunnelsProvider: React.FC<FunnelsProviderProps> = ({ children, debug = true }) => {
  const [currentFunnelId, setCurrentFunnelId] = useState<string>('funil-21-etapas');
  // ✅ FASE 1: Inicialização imediata com dados pré-carregados
  const [steps, setSteps] = useState<FunnelStep[]>(() => {
    const initialTemplate = FUNNEL_TEMPLATES['funil-21-etapas'];
    console.log('🚀 FunnelsContext: Inicialização IMEDIATA com template completo');
    console.log('📊 Steps carregadas na inicialização:', initialTemplate.defaultSteps.length);
    return initialTemplate.defaultSteps;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renderCount, setRenderCount] = useState(0);

  const getTemplate = useCallback((templateId: string) => {
    const template = FUNNEL_TEMPLATES[templateId as keyof typeof FUNNEL_TEMPLATES];
    if (!template) {
      console.warn(`Template ${templateId} não encontrado. Usando template padrão.`);
      return FUNNEL_TEMPLATES['quiz-vazio'];
    }
    return template;
  }, []);

  // ✅ FASE 2: Debug visual melhorado + controle de re-renders
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    setRenderCount(prev => prev + 1);

    if (FUNNEL_TEMPLATES[currentFunnelId]) {
      const template = FUNNEL_TEMPLATES[currentFunnelId];

      // ✅ FASE 3: Fallback robusto - só atualiza se realmente necessário
      if (steps.length === 0 || steps[0]?.id !== template.defaultSteps[0]?.id) {
        setSteps(template.defaultSteps);
        console.log(`🔄 [${timestamp}] FunnelsContext: Atualizando template:`, currentFunnelId);
      } else {
        console.log(`✅ [${timestamp}] FunnelsContext: Template já carregado:`, currentFunnelId);
      }

      console.log(
        `📊 [${timestamp}] Re-render #${renderCount + 1} - Steps disponíveis:`,
        template.defaultSteps.length
      );
      console.log(
        `🎯 [${timestamp}] Dados das steps:`,
        template.defaultSteps.map(s => s.name)
      );
    } else {
      console.error(`❌ [${timestamp}] FunnelsContext: Template não encontrado:`, currentFunnelId);
      console.log(`📁 [${timestamp}] Templates disponíveis:`, Object.keys(FUNNEL_TEMPLATES));

      // ✅ FASE 3: Fallback para template padrão
      const fallbackTemplate = FUNNEL_TEMPLATES['funil-21-etapas'];
      setSteps(fallbackTemplate.defaultSteps);
      console.log(`🔄 [${timestamp}] Aplicando fallback para template padrão`);
    }
  }, [currentFunnelId, debug, renderCount]);

  const updateFunnelStep = useCallback(
    (stepId: string, updates: any) => {
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
    },
    [currentFunnelId]
  );

  const addStepBlock = useCallback((stepId: string, _blockData: any) => {
    setSteps(currentSteps => {
      return currentSteps.map((step: any) => {
        if (step.id === stepId) {
          return {
            ...step,
            blocksCount: step.blocksCount + 1,
          };
        }
        return step;
      });
    });
  }, []);

  // Fix the Supabase upsert call - need to provide proper funnel data structure
  const saveFunnelToDatabase = useCallback(
    async (funnelData: any) => {
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
          updated_at: new Date().toISOString(),
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
    },
    [currentFunnelId]
  );

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
    error,
  };

  return <FunnelsContext.Provider value={contextValue}>{children}</FunnelsContext.Provider>;
};

export const useFunnels = (): FunnelsContextType => {
  const context = useContext(FunnelsContext);
  if (context === undefined) {
    throw new Error('useFunnels must be used within a FunnelsProvider');
  }
  return context;
};
