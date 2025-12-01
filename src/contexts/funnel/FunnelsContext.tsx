/**
 * 🔄 FUNNELS CONTEXT (LEGACY)
 *
 * ⚠️ DEPRECATED: Este contexto é LEGADO. Use FunnelDataProvider ou serviços canônicos.
 * @deprecated Migre para FunnelDataProvider + useFunnelData ou FunnelService
 * @see FunnelDataProvider - Provider canônico para dados de funil
 * @see src/services/canonical/FunnelService.ts - Serviço canônico de funil
 *
 * Este arquivo será removido em uma versão futura.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { StorageService } from '@/services/core/StorageService';
// Removido uso direto do template monolítico; usar QuizDataService para obter blocos por etapa
import { QuizDataService } from '@/services/core/QuizDataService';
import { appLogger } from '@/lib/utils/appLogger';
// No imports needed for this context - legacy file

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
  'quiz-vazio': 'quiz-style-basic', // Fallback
};

// ✅ FUNÇÃO HELPER: Determinar tipo do step baseado no template (não hardcoded)
/**
 * Infere o tipo do step analisando os blocos do template
 * Substitui lógica hardcoded de stepNumber === 12/19/20
 */
const inferStepTypeFromTemplate = (
  stepId: string,
  stepNumber: number,
  template: any[],
): string => {
  // Se não há template ou está vazio, usar fallback baseado em número (temporário)
  if (!template || template.length === 0) {
    // Fallback temporário para compatibilidade (será removido quando todos templates tiverem blocks)
    if (stepNumber === 1) return 'lead-collection';
    if (stepNumber >= 2 && stepNumber <= 11) return 'scored-question';
    if (stepNumber === 12 || stepNumber === 19) return 'transition';
    if (stepNumber >= 13 && stepNumber <= 18) return 'strategic-question';
    if (stepNumber === 20) return 'result';
    return 'offer';
  }

  // Analisar blocos para inferir tipo
  const blockTypes = template.map(block => block.type);

  // Lead collection: tem form-input
  if (blockTypes.includes('form-input') || blockTypes.includes('input')) {
    return 'lead-collection';
  }

  // Transition: tem transition-* blocks
  if (blockTypes.some(type => type.startsWith('transition-'))) {
    return 'transition';
  }

  // Result: tem result-* blocks
  if (blockTypes.some(type => type.startsWith('result-'))) {
    return 'result';
  }

  // Strategic question: tem strategic-* blocks
  if (blockTypes.some(type => type.startsWith('strategic-'))) {
    return 'strategic-question';
  }

  // Scored question: tem options-grid ou question-* blocks
  if (blockTypes.includes('options-grid') || blockTypes.some(type => type.startsWith('question-'))) {
    return 'scored-question';
  }

  // Offer: tem offer-* blocks
  if (blockTypes.some(type => type.startsWith('offer-'))) {
    return 'offer';
  }

  // Fallback genérico
  return 'custom';
};

// Extrai o texto da pergunta a partir das seções v3 do template
const extractQuestionTextFromTemplateSections = (sections: any[]): string => {
  if (!Array.isArray(sections)) return '';
  // Preferência: question-text > question-hero.questionText > question-title
  const qTextSection = sections.find((s: any) => s?.type === 'question-text' && s?.content?.text);
  if (qTextSection) return String(qTextSection.content.text);

  const heroSection = sections.find(
    (s: any) => s?.type === 'question-hero' && (s?.content?.questionText || s?.content?.text),
  );
  if (heroSection) return String(heroSection.content.questionText || heroSection.content.text);

  const titleSection = sections.find((s: any) => s?.type === 'question-title' && s?.content?.text);
  if (titleSection) return String(titleSection.content.text);

  return '';
};

// 🔧 Helper: construir defaultSteps a partir das seções v3 com opções de descrição
const buildDefaultStepsFromSections = (
  options?: { useGeneratedDescription?: boolean },
) => {
  const useGeneratedDescription = !!options?.useGeneratedDescription;

  const steps: Array<{
    id: string;
    name: string;
    order: number;
    blocksCount: number;
    isActive: boolean;
    type: string;
    description: string;
  }> = [];

  // Mantemos 21 etapas como padrão do quiz de estilo
  for (let stepNumber = 1; stepNumber <= 21; stepNumber++) {
    const stepId = `step-${stepNumber}`;
    const templateSections = QuizDataService.getStepData(stepNumber) || [];
    const questionText = extractQuestionTextFromTemplateSections(templateSections) || 'Pergunta';
    const stepType = inferStepTypeFromTemplate(stepId, stepNumber, templateSections || []);

    steps.push({
      id: stepId,
      name: `Etapa ${stepNumber}`,
      order: stepNumber,
      blocksCount: templateSections.length || 1,
      isActive: true,
      type: stepType,
      description: useGeneratedDescription
        ? generateStepDescription(stepType, stepNumber, questionText)
        : questionText,
    });
  }

  return steps;
};

// 🧠 Cache de blocos determinístico por template/funnel/step
const blocksCache = new Map<string, any[]>();

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const buildDeterministicBlocks = (
  originalBlocks: any[],
  funnelId: string,
  templateId: string,
  stepId: string,
) => {
  const cloned = (originalBlocks || []).map((block: any, index: number) => {
    const baseId = block?.id ? String(block.id) : `block-${index}`;
    const uniqueId = `${funnelId || 'nofunnel'}-${stepId}-${index}-${baseId}`;
    const content = deepClone(block?.content || {});
    const properties = deepClone(block?.properties || {});

    return {
      ...deepClone(block),
      id: uniqueId,
      content,
      properties,
      _metadata: {
        originalBlockId: block?.id,
        funnelId,
        templateId,
        stepId,
        // timestamp removido para estabilidade
      },
    };
  });
  return cloned;
};

/**
 * Gera descrição do step baseada no tipo inferido do template
 * Remove hardcoding de stepNumber === 20, etc.
 */
const generateStepDescription = (
  stepType: string,
  stepNumber: number,
  questionText: string,
): string => {
  switch (stepType) {
    case 'lead-collection':
      return 'Página de captura de leads';
    case 'scored-question':
      return `Pergunta do quiz: ${questionText}`;
    case 'strategic-question':
      return `Pergunta estratégica: ${questionText}`;
    case 'transition':
      return 'Página de transição';
    case 'result':
      return 'Página de resultado';
    case 'offer':
      return 'Página de vendas';
    default:
      return `Etapa ${stepNumber}`;
  }
};

// ✅ FUNÇÃO HELPER: Obter template unificado com fallback legacy
const getTemplateWithFallback = (templateId: string) => {
  // Primeiro, tentar buscar no registry unificado
  const mappedId = LEGACY_TEMPLATE_MAPPING[templateId] || templateId;
  const unifiedTemplate = null; // Simplified template registry

  if (unifiedTemplate) {
    appLogger.info(`✅ Template unificado encontrado: ${templateId} -> ${mappedId}`);
    return {
      unified: unifiedTemplate,
      legacy: FUNNEL_TEMPLATES[templateId] || null,
    };
  }

  // Fallback para template legacy
  const legacyTemplate = FUNNEL_TEMPLATES[templateId];
  if (legacyTemplate) {
    appLogger.info(`⚠️ Usando template legacy: ${templateId}`);
    return {
      unified: null,
      legacy: legacyTemplate,
    };
  }

  appLogger.warn(`❌ Template não encontrado: ${templateId}`);
  return { unified: null, legacy: null };
};

/**
 * ⚠️ LEGACY TEMPLATE REGISTRY - OBSOLETO
 * 
 * Este registry está DEPRECATED e será removido em breve.
 * Mantido apenas para compatibilidade com código legacy.
 * 
 * ✅ USAR: getUnifiedTemplates() de @/config/unifiedTemplatesRegistry
 * ❌ NÃO USAR: FUNNEL_TEMPLATES
 * 
 * @deprecated Use getUnifiedTemplates() ao invés deste registry
 */
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
    defaultSteps: buildDefaultStepsFromSections({ useGeneratedDescription: false }),
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
  'quiz21StepsComplete': {
    name: 'Quiz de Estilo Pessoal (21 Etapas)',
    description: 'Template completo do quiz de estilo pessoal com 21 etapas, sistema de pontuação e resultados personalizados',
    defaultSteps: buildDefaultStepsFromSections({ useGeneratedDescription: false }),
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
  'template-optimized-21-steps-funnel': {
    name: 'Funil Quiz 21 Etapas (Otimizado)',
    description: 'Template otimizado do funil de quiz com 21 etapas configuradas',
    defaultSteps: buildDefaultStepsFromSections({ useGeneratedDescription: true }),
  },
};

export const FunnelsProvider: React.FC<FunnelsProviderProps> = ({ children, debug = true }) => {
  // BYPASS: Não inicializar contexto legacy em rotas do Template Engine modular
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isTemplateEngineRoute = pathname.startsWith('/template-engine');
  if (isTemplateEngineRoute) {
    if (debug) appLogger.info('[FunnelsProvider] Bypass legacy para rota modular:', { data: [pathname] });
    return <>{children}</>;
  }
  // ✅ CORRIGIDO: Obter funnelId dinamicamente da URL SEM fallback forçado
  const [currentFunnelId, setCurrentFunnelId] = useState<string>(() => {
    try {
      // Primeiro, tentar obter da URL
      const url = new URL(window.location.href);
      const funnelFromUrl = url.searchParams.get('funnel');
      if (funnelFromUrl) {
        appLogger.info('🔍 FunnelsContext: funnelId da URL:', { data: [funnelFromUrl] });
        return funnelFromUrl;
      }

      // Se for uma sessão ad-hoc aberta via ?template=, evitar setar um funnelId inválido aqui
      const templateFromUrl = url.searchParams.get('template');
      if (templateFromUrl) {
        appLogger.info('🔍 FunnelsContext: sessão ad-hoc via template:', { data: [templateFromUrl, '— mantendo currentFunnelId vazio para evitar conflito'] });
        return '';
      }

      // Segundo, tentar obter do localStorage
      const funnelFromStorage = StorageService.safeGetString('editor:funnelId');
      if (funnelFromStorage) {
        appLogger.info('🔍 FunnelsContext: funnelId do localStorage:', { data: [funnelFromStorage] });
        return funnelFromStorage;
      }

      // ❌ REMOVIDO: Fallback automático para template de 21 etapas
      appLogger.info('🔍 FunnelsContext: sem funnelId inicial — aguardando seleção ou import. (estado inicial neutro)');
      return ''; // Mantém vazio para evitar fallback prematuro
    } catch (error) {
      appLogger.error('❌ Erro ao obter funnelId:', { data: [error] });
      return ''; // Vazio ao invés de forçar template específico
    }
  });

  // ✅ FASE 2: Inicialização com mapeamento unificado
  const [steps, setSteps] = useState<LegacyFunnelStep[]>(() => {
    const { legacy } = getTemplateWithFallback('quiz-estilo-completo');
    const initialTemplate = legacy || {
      name: 'Template Padrão',
      description: 'Template padrão de inicialização',
      defaultSteps: [],
    };

    appLogger.info('� FunnelsContext: Inicialização com template unificado');
    appLogger.info('📊 Template: Usando template padrão');
    appLogger.info('� Template legacy:', { data: [initialTemplate.name] });
    appLogger.info('🎯 Steps carregadas:', { data: [initialTemplate.defaultSteps.length] });

    // Marcar origem das steps carregadas
    const marked = (initialTemplate.defaultSteps || []).map((s: any) => ({ ...s, _source: 'ts' }));
    appLogger.info('🧭 FunnelsContext: origem das steps inicializadas = ts');
    return marked;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔍 DEBUG CRÍTICO: Monitor de contexto
  React.useEffect(() => {
    if (debug) {
      appLogger.info('🔍 FUNNELS CONTEXT DEBUG:', {
        data: [{
          currentFunnelId,
          stepsLength: steps.length,
          loading,
          error,
          stepsIds: steps.map(s => s.id),
          stepsNames: steps.map(s => s.name),
        }]
      });
    }
  }, [steps, currentFunnelId, loading, error, debug]);

  const getTemplate = useCallback((templateId: string) => {
    // ✅ FASE 2: Usar mapeamento unificado com fallback legacy
    const { unified, legacy } = getTemplateWithFallback(templateId);

    if (unified) {
      return {
        name: 'Default Template',
        description: 'Default description',
        // Manter compatibilidade com estrutura legacy para defaultSteps
        defaultSteps: legacy?.defaultSteps || [],
      };
    }

    if (legacy) {
      return legacy;
    }

    // Fallback final
    appLogger.warn(`❌ Nenhum template encontrado para ${templateId}. Usando fallback.`);
    return FUNNEL_TEMPLATES['quiz-vazio'] || {
      name: 'Template Básico',
      description: 'Template básico de fallback',
      defaultSteps: [],
    };
  }, []);

  // Função para obter blocos de um template específico
  const getTemplateBlocks = useCallback((templateId: string, stepId: string) => {
    // Cache key por template/funnel/step
    const cacheKey = `${templateId}::${currentFunnelId || 'nofunnel'}::${stepId}`;
    const cached = blocksCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Verifica se é o template optimized (que existe)
    if (templateId === 'template-optimized-21-steps-funnel' || templateId === 'optimized-21-steps-funnel') {
      const n = parseInt(stepId.replace(/\D+/g, ''), 10) || 0;
      const originalBlocks = n ? QuizDataService.getStepData(n) : [];
      const clonedBlocks = buildDeterministicBlocks(originalBlocks, currentFunnelId, templateId, stepId);
      blocksCache.set(cacheKey, clonedBlocks);
      appLogger.info(`🔄 [${currentFunnelId}] Template quiz-estilo-completo: ${clonedBlocks.length} blocos únicos para ${stepId}`);
      return clonedBlocks;
    }

    // ✅ CORREÇÃO: Template funil-21-etapas também deve usar QUIZ_STYLE_21_STEPS_TEMPLATE
    if (templateId === 'funil-21-etapas' || templateId === 'template-optimized-21-steps-funnel') {
      appLogger.info(`🔄 [${currentFunnelId}] Carregando blocos para template funil-21-etapas, etapa ${stepId}`);
      const n = parseInt(stepId.replace(/\D+/g, ''), 10) || 0;
      const originalBlocks = n ? QuizDataService.getStepData(n) : [];
      const clonedBlocks = buildDeterministicBlocks(originalBlocks, currentFunnelId, templateId, stepId);
      blocksCache.set(cacheKey, clonedBlocks);
      appLogger.info(`📦 [${currentFunnelId}] Clonados ${clonedBlocks.length} blocos únicos para a etapa ${stepId}`);
      return clonedBlocks;
    }

    // Para outros templates, retorna array vazio (implementação futura)
    appLogger.warn(`⚠️ [${currentFunnelId}] Template não suportado: ${templateId}, retornando array vazio para etapa ${stepId}`);
    return [];
  }, []);

  // ✅ FASE 2: Debug visual melhorado + controle de re-renders
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    const verbose = false; // reduzir logs pesados por padrão

    // 🛡️ GUARD: Se provider ainda não tem funnelId definido, apenas log leve e aborta
    if (!currentFunnelId) {
      if (debug) {
        appLogger.info(`⚠️ [${timestamp}] FunnelsContext: currentFunnelId vazio - aguardando seleção antes de resolver templates.`);
      }
      return; // Evita acessar Object.keys em cenários de inicialização parcial
    }

    const safeFunnelTemplates = FUNNEL_TEMPLATES || ({} as typeof FUNNEL_TEMPLATES);

    if (debug) {
      appLogger.info(`🔍 [${timestamp}] FunnelsContext Debug Completo:`);
      appLogger.info('📂 currentFunnelId:', { data: [currentFunnelId] });
      if (verbose) {
        try { appLogger.info('📊 FUNNEL_TEMPLATES keys:', { data: [Object.keys(safeFunnelTemplates)] }); } catch { appLogger.warn('⚠️ Não foi possível ler keys de FUNNEL_TEMPLATES'); }
      }
    }
    // Resolver ID base quando for sessão ad-hoc (ex.: funnel-quiz21StepsComplete-<timestamp>)
    let resolvedId = currentFunnelId;
    try {
      const url = new URL(window.location.href);
      const templateFromUrl = url.searchParams.get('template');
      if ((!resolvedId || resolvedId.startsWith('funnel-')) && templateFromUrl) {
        // Mapear template conhecido para chave de FUNNEL_TEMPLATES
        const map: Record<string, string> = {
          'quiz21StepsComplete': 'quiz21StepsComplete',
          'fashionStyle21PtBR': 'funil-21-etapas',
          'quiz-estilo-completo': 'quiz-estilo-completo',
        };
        const baseId = map[templateFromUrl] || 'funil-21-etapas';
        if (debug) appLogger.info('🧭 FunnelsContext: Resolvendo sessão ad-hoc', { data: [{ currentFunnelId, templateFromUrl, resolvedBase: baseId }] });
        resolvedId = baseId;
      }
    } catch { /* ignore */ }

    if (debug) appLogger.info('🎯 Template existe?', { data: [!!safeFunnelTemplates[resolvedId]] });

    if (safeFunnelTemplates[resolvedId]) {
      const template = safeFunnelTemplates[resolvedId];
      if (debug) {
        appLogger.info(`✅ [${timestamp}] Template encontrado:`, { data: [template.name] });
        appLogger.info(`📊 [${timestamp}] Steps no template:`, { data: [template.defaultSteps.length] });
      }

      // ✅ FASE 3: Fallback robusto - só atualiza se realmente necessário
      if (steps.length === 0 || steps[0]?.id !== template.defaultSteps[0]?.id) {
        setSteps(template.defaultSteps);
        if (debug) appLogger.info(`🔄 [${timestamp}] FunnelsContext: Atualizando template:`, { data: [resolvedId] });
      } else {
        if (debug) appLogger.info(`✅ [${timestamp}] FunnelsContext: Template já carregado:`, { data: [resolvedId] });
      }

      if (verbose) {
        appLogger.info(`📊 [${timestamp}] Steps disponíveis:`, { data: [template.defaultSteps.length] });
        appLogger.info(`🎯 [${timestamp}] Dados das steps:`, { data: [template.defaultSteps.map(s => `${s.id}: ${s.name}`)] });
      }
    } else if (currentFunnelId) {
      // Se currentFunnelId é ad-hoc e não foi resolvido, preferir não logar erro ruidoso
      if (!(currentFunnelId.startsWith('funnel-'))) {
        appLogger.error(`❌ [${timestamp}] FunnelsContext: Template não encontrado:`, { data: [currentFunnelId] });
      } else if (debug) {
        appLogger.warn(`⚠️ [${timestamp}] FunnelsContext: ID ad-hoc sem resolução direta, aplicando fallback silencioso.`);
      }
      try { appLogger.info(`📁 [${timestamp}] Templates disponíveis:`, { data: [Object.keys(safeFunnelTemplates)] }); } catch { }

      // ✅ FASE 3: Fallback para template padrão
      const fallbackTemplate = safeFunnelTemplates['funil-21-etapas'];
      if (fallbackTemplate) {
        setSteps(fallbackTemplate.defaultSteps);
        appLogger.info(`🔄 [${timestamp}] Aplicando fallback para template padrão`);
      } else {
        appLogger.error(`❌ [${timestamp}] Template de fallback também não encontrado!`);
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
    [currentFunnelId],
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
        // ✅ CORREÇÃO: Obter usuário autenticado corretamente
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || 'anonymous';

        const funnelRecord = {
          id: currentFunnelId,
          name: funnelData.name || 'Funnel sem nome',
          description: funnelData.description || '',
          is_published: funnelData.isPublished || false,
          // ✅ CORREÇÃO: Incluir context nos settings para compatibilidade com listagem
          settings: {
            theme: funnelData.theme || 'default',
            context: 'MY_FUNNELS', // Context para "Meus Funis"
          },
          user_id: userId, // ✅ CORREÇÃO: Usar ID do usuário real
          updated_at: new Date().toISOString(),
        };

        const { data, error: supabaseError } = await supabase
          .from('funnels')
          .upsert([funnelRecord])
          .select();

        if (supabaseError) {
          throw supabaseError;
        }

        appLogger.info('✅ Funil salvo com sucesso no contexto MY_FUNNELS:', { data: [data] });
      } catch (error) {
        appLogger.error('❌ Erro ao salvar funil:', { data: [error] });
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    },
    [currentFunnelId],
  );

  // Wrap do setSteps para sempre marcar _source
  const setStepsWithSource: React.Dispatch<React.SetStateAction<LegacyFunnelStep[]>> = (updater) => {
    setSteps((prev) => {
      const next = typeof updater === 'function' ? (updater as any)(prev) : updater;
      const marked = (next || []).map((s: any) => ({ ...s, _source: s?._source || 'ts' }));
      appLogger.info('🧭 FunnelsContext: setSteps chamado. Origem marcada como ts para', { data: [marked.length, 'steps'] });
      return marked;
    });
  };

  const contextValue: FunnelsContextType = {
    currentFunnelId,
    setCurrentFunnelId,
    steps,
    setSteps: setStepsWithSource,
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
  appLogger.info('🔍 useFunnels called:', {
    data: [{
      contextExists: !!context,
      contextType: typeof context,
      contextKeys: context ? Object.keys(context) : 'null',
    }]
  });
  if (context === undefined) {
    appLogger.error('🔴 useFunnels: Context is undefined!');
    throw new Error('useFunnels must be used within a FunnelsProvider');
  }
  return context;
};
