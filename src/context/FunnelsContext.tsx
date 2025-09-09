import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  QUIZ_QUESTIONS_COMPLETE,
  QUIZ_STYLE_21_STEPS_TEMPLATE,
} from '../templates/quiz21StepsComplete';
import { type FunnelStep as CoreFunnelStep, type FunnelStepType } from '@/core/funnel/types';
import { type UnifiedTemplate, getUnifiedTemplates, TemplateRegistry } from '@/config/unifiedTemplatesRegistry';

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

// ✅ FASE 2: Mapeamento de templates legados para unificados
const LEGACY_TEMPLATE_MAPPING: Record<string, string> = {
  'quiz-estilo-completo': 'quiz-estilo-21-steps',
  'quiz-estilo': 'quiz-estilo-otimizado',
  'quiz-vazio': 'quiz-style-basic' // Fallback
};

// ✅ FUNÇÃO HELPER: Obter template unificado com fallback legacy
const getTemplateWithFallback = (templateId: string) => {
  // Primeiro, tentar buscar no registry unificado
  const mappedId = LEGACY_TEMPLATE_MAPPING[templateId] || templateId;
  const unifiedTemplate = TemplateRegistry.getById(mappedId);

  if (unifiedTemplate) {
    console.log(`✅ Template unificado encontrado: ${templateId} -> ${mappedId}`);
    return {
      unified: unifiedTemplate,
      legacy: FUNNEL_TEMPLATES[templateId] || null
    };
  }

  // Fallback para template legacy
  const legacyTemplate = FUNNEL_TEMPLATES[templateId];
  if (legacyTemplate) {
    console.log(`⚠️ Usando template legacy: ${templateId}`);
    return {
      unified: null,
      legacy: legacyTemplate
    };
  }

  console.warn(`❌ Template não encontrado: ${templateId}`);
  return { unified: null, legacy: null };
};

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
  'quiz-estilo-completo': {
    name: 'Quiz de Estilo Completo (21 Etapas)',
    description: 'Quiz completo de estilo pessoal com 21 etapas configuradas',
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
  },
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
    name: 'Quiz de Estilo Pessoal - 21 Etapas',
    description: 'Quiz completo para descobrir o estilo pessoal',
    defaultSteps: [
      {
        id: 'step-1',
        name: 'Quiz de Estilo Pessoal',
        order: 1,
        blocksCount: 5,
        isActive: true,
        type: 'intro',
        description: 'Descubra seu estilo único',
      },
      {
        id: 'step-2',
        name: 'VAMOS NOS CONHECER?',
        order: 2,
        blocksCount: 4,
        isActive: true,
        type: 'name',
        description: 'Digite seu nome para personalizar',
      },
      {
        id: 'step-3',
        name: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
        order: 3,
        blocksCount: 5,
        isActive: true,
        type: 'question',
        description: 'Primeira questão do quiz',
      },
      {
        id: 'step-4',
        name: 'RESUMA A SUA PERSONALIDADE:',
        order: 4,
        blocksCount: 5,
        isActive: true,
        type: 'question',
        description: 'Segunda questão do quiz',
      },
      {
        id: 'step-5',
        name: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
        order: 5,
        blocksCount: 5,
        isActive: true,
        type: 'question',
        description: 'Terceira questão do quiz',
      },
      {
        id: 'step-6',
        name: 'QUAIS DETALHES VOCÊ GOSTA?',
        order: 6,
        blocksCount: 5,
        isActive: true,
        type: 'question',
        description: 'Quarta questão do quiz',
      },
      {
        id: 'step-7',
        name: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
        order: 7,
        blocksCount: 5,
        isActive: true,
        type: 'question',
        description: 'Quinta questão do quiz',
      },
      {
        id: 'step-8',
        name: 'QUAL CASACO É SEU FAVORITO?',
        order: 8,
        blocksCount: 5,
        isActive: true,
        type: 'question',
        description: 'Sexta questão do quiz',
      },
      {
        id: 'step-9',
        name: 'QUAL SUA CALÇA FAVORITA?',
        order: 9,
        blocksCount: 5,
        isActive: true,
        type: 'question',
        description: 'Sétima questão do quiz',
      },
      {
        id: 'step-10',
        name: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
        order: 10,
        blocksCount: 5,
        isActive: true,
        type: 'question',
        description: 'Oitava questão do quiz',
      },
      {
        id: 'step-11',
        name: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
        order: 11,
        blocksCount: 5,
        isActive: true,
        type: 'question',
        description: 'Nona questão do quiz',
      },
      {
        id: 'step-12',
        name: 'VOCÊ ESCOLHE CERTOS TECIDOS...',
        order: 12,
        blocksCount: 5,
        isActive: true,
        type: 'question',
        description: 'Décima questão do quiz',
      },
      {
        id: 'step-13',
        name: 'Enquanto calculamos o seu resultado...',
        order: 13,
        blocksCount: 3,
        isActive: true,
        type: 'transition',
        description: 'Transição para questões estratégicas',
      },
      {
        id: 'step-14',
        name: 'Como você se vê hoje?',
        order: 14,
        blocksCount: 5,
        isActive: true,
        type: 'strategic',
        description: 'Primeira questão estratégica',
      },
      {
        id: 'step-15',
        name: 'O que mais te desafia na hora de se vestir?',
        order: 15,
        blocksCount: 5,
        isActive: true,
        type: 'strategic',
        description: 'Segunda questão estratégica',
      },
      {
        id: 'step-16',
        name: 'Com que frequência você se pega pensando...',
        order: 16,
        blocksCount: 5,
        isActive: true,
        type: 'strategic',
        description: 'Terceira questão estratégica',
      },
      {
        id: 'step-17',
        name: 'Ter acesso a um material estratégico faria diferença?',
        order: 17,
        blocksCount: 5,
        isActive: true,
        type: 'strategic',
        description: 'Quarta questão estratégica',
      },
      {
        id: 'step-18',
        name: 'Você consideraria R$ 97,00 um bom investimento?',
        order: 18,
        blocksCount: 5,
        isActive: true,
        type: 'strategic',
        description: 'Quinta questão estratégica',
      },
      {
        id: 'step-19',
        name: 'Qual resultado você mais gostaria de alcançar?',
        order: 19,
        blocksCount: 5,
        isActive: true,
        type: 'strategic',
        description: 'Sexta questão estratégica',
      },
      {
        id: 'step-20',
        name: 'SEU ESTILO PESSOAL É:',
        order: 20,
        blocksCount: 4,
        isActive: true,
        type: 'result',
        description: 'Apresentação do resultado',
      },
      {
        id: 'step-21',
        name: 'RECEBA SEU GUIA DE ESTILO COMPLETO',
        order: 21,
        blocksCount: 3,
        isActive: true,
        type: 'lead',
        description: 'Página de conversão',
      },
    ],
  },
};

export const FunnelsProvider: React.FC<FunnelsProviderProps> = ({ children, debug = true }) => {
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

      // Fallback para o template padrão
      console.log('🔍 FunnelsContext: usando fallback template-optimized-21-steps-funnel');
      return 'template-optimized-21-steps-funnel';
    } catch (error) {
      console.error('❌ Erro ao obter funnelId:', error);
      return 'template-optimized-21-steps-funnel';
    }
  });

  // ✅ FASE 2: Inicialização com mapeamento unificado
  const [steps, setSteps] = useState<LegacyFunnelStep[]>(() => {
    const { unified, legacy } = getTemplateWithFallback('quiz-estilo-completo');
    const initialTemplate = legacy || {
      name: 'Template Padrão',
      description: 'Template padrão de inicialização',
      defaultSteps: []
    };

    console.log('� FunnelsContext: Inicialização com template unificado');
    console.log('📊 Template unificado:', unified?.name || 'N/A');
    console.log('� Template legacy:', initialTemplate.name);
    console.log('🎯 Steps carregadas:', initialTemplate.defaultSteps.length);

    return initialTemplate.defaultSteps;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔍 DEBUG CRÍTICO: Monitor de contexto
  React.useEffect(() => {
    if (debug) {
      console.log('🔍 FUNNELS CONTEXT DEBUG:', {
        currentFunnelId,
        stepsLength: steps.length,
        loading,
        error,
        stepsIds: steps.map(s => s.id),
        stepsNames: steps.map(s => s.name),
      });
    }
  }, [steps, currentFunnelId, loading, error, debug]);

  const getTemplate = useCallback((templateId: string) => {
    // ✅ FASE 2: Usar mapeamento unificado com fallback legacy
    const { unified, legacy } = getTemplateWithFallback(templateId);

    if (unified) {
      return {
        name: unified.name,
        description: unified.description,
        // Manter compatibilidade com estrutura legacy para defaultSteps
        defaultSteps: legacy?.defaultSteps || []
      };
    }

    if (legacy) {
      return legacy;
    }

    // Fallback final
    console.warn(`❌ Nenhum template encontrado para ${templateId}. Usando fallback.`);
    return FUNNEL_TEMPLATES['quiz-vazio'] || {
      name: 'Template Básico',
      description: 'Template básico de fallback',
      defaultSteps: []
    };
  }, []);

  // Função para obter blocos de um template específico
  const getTemplateBlocks = useCallback((templateId: string, stepId: string) => {
    // 🛡️ FUNÇÃO HELPER: Clone profundo REAL dos blocos para evitar mutação compartilhada
    const cloneBlocks = (blocks: any[], funnelId: string) => {
      return blocks.map((block, index) => {
        // Gerar ID único baseado no funnelId atual para garantir isolamento
        const uniqueId = `${funnelId}-${stepId}-${block.id || `block-${index}`}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        return {
          ...JSON.parse(JSON.stringify(block)), // Clone profundo real
          id: uniqueId,
          content: JSON.parse(JSON.stringify(block.content || {})),
          properties: JSON.parse(JSON.stringify(block.properties || {})),
          // Marcar com metadados para tracking
          _metadata: {
            originalBlockId: block.id,
            funnelId: currentFunnelId,
            templateId,
            stepId,
            clonedAt: new Date().toISOString()
          }
        };
      });
    };

    // Verifica se é o template optimized (que existe)
    if (templateId === 'template-optimized-21-steps-funnel' || templateId === 'optimized-21-steps-funnel') {
      const originalBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId] || [];
      const clonedBlocks = cloneBlocks(originalBlocks, currentFunnelId);
      console.log(`🔄 [${currentFunnelId}] Template quiz-estilo-completo: ${clonedBlocks.length} blocos únicos para ${stepId}`);
      return clonedBlocks;
    }

    // ✅ CORREÇÃO: Template funil-21-etapas também deve usar QUIZ_STYLE_21_STEPS_TEMPLATE
    if (templateId === 'funil-21-etapas' || templateId === 'template-optimized-21-steps-funnel') {
      console.log(`🔄 [${currentFunnelId}] Carregando blocos para template funil-21-etapas, etapa ${stepId}`);
      const originalBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId] || [];
      const clonedBlocks = cloneBlocks(originalBlocks, currentFunnelId);
      console.log(`📦 [${currentFunnelId}] Clonados ${clonedBlocks.length} blocos únicos para a etapa ${stepId}`);
      return clonedBlocks;
    }

    // Para outros templates, retorna array vazio (implementação futura)
    console.warn(
      `⚠️ [${currentFunnelId}] Template não suportado: ${templateId}, retornando array vazio para etapa ${stepId}`
    );
    return [];
  }, []);

  // ✅ FASE 2: Debug visual melhorado + controle de re-renders
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();

    console.log(`🔍 [${timestamp}] FunnelsContext Debug Completo:`);
    console.log(`📂 currentFunnelId:`, currentFunnelId);
    console.log(`📊 FUNNEL_TEMPLATES keys:`, Object.keys(FUNNEL_TEMPLATES));
    console.log(`📋 QUIZ_STYLE_21_STEPS_TEMPLATE keys:`, Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE));
    console.log(`🎯 Template existe?`, !!FUNNEL_TEMPLATES[currentFunnelId]);

    if (FUNNEL_TEMPLATES[currentFunnelId]) {
      const template = FUNNEL_TEMPLATES[currentFunnelId];
      console.log(`✅ [${timestamp}] Template encontrado:`, template.name);
      console.log(`📊 [${timestamp}] Steps no template:`, template.defaultSteps.length);

      // ✅ FASE 3: Fallback robusto - só atualiza se realmente necessário
      if (steps.length === 0 || steps[0]?.id !== template.defaultSteps[0]?.id) {
        setSteps(template.defaultSteps);
        console.log(`🔄 [${timestamp}] FunnelsContext: Atualizando template:`, currentFunnelId);
      } else {
        console.log(`✅ [${timestamp}] FunnelsContext: Template já carregado:`, currentFunnelId);
      }

      console.log(`📊 [${timestamp}] Steps disponíveis:`, template.defaultSteps.length);
      console.log(
        `🎯 [${timestamp}] Dados das steps:`,
        template.defaultSteps.map(s => `${s.id}: ${s.name}`)
      );
    } else {
      console.error(`❌ [${timestamp}] FunnelsContext: Template não encontrado:`, currentFunnelId);
      console.log(`📁 [${timestamp}] Templates disponíveis:`, Object.keys(FUNNEL_TEMPLATES));

      // ✅ FASE 3: Fallback para template padrão
      const fallbackTemplate = FUNNEL_TEMPLATES['funil-21-etapas'];
      if (fallbackTemplate) {
        setSteps(fallbackTemplate.defaultSteps);
        console.log(`🔄 [${timestamp}] Aplicando fallback para template padrão`);
      } else {
        console.error(`❌ [${timestamp}] Template de fallback também não encontrado!`);
      }
    }
  }, [currentFunnelId, debug]);

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
    getTemplateBlocks,
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
  console.log('🔍 useFunnels called:', {
    contextExists: !!context,
    contextType: typeof context,
    contextKeys: context ? Object.keys(context) : 'null',
  });
  if (context === undefined) {
    console.error('🔴 useFunnels: Context is undefined!');
    throw new Error('useFunnels must be used within a FunnelsProvider');
  }
  return context;
};
