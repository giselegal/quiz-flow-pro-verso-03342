/**
 * 🎯 REAL STAGES PROVIDER - PIPELINE DE ETAPAS ROBUSTO
 * 
 * Provider unificado para gerenciar etapas (stages) reais do editor,
 * substituindo as implementações fragmentadas existentes.
 * 
 * FUNCIONALIDADES:
 * ✅ realStages completos com cache inteligente
 * ✅ stageActions unificados e consistentes
 * ✅ Navegação entre etapas otimizada
 * ✅ Preload de etapas adjacentes
 * ✅ Fallbacks robustos para dados ausentes
 * ✅ Integração com TemplatesCacheService
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Block } from '@/types/editor';
import { templatesCacheService } from '@/services/TemplatesCacheService';

// Tipos
interface QuizStage {
  id: string;
  name: string;
  description: string;
  order: number;
  blocksCount: number;
  isActive: boolean;
  isCompleted: boolean;
  hasData: boolean;
  metadata: {
    templateLoaded: boolean;
    lastAccessed?: number;
    cacheStatus: 'loading' | 'cached' | 'error' | 'empty';
    fallback: boolean;
  };
}

interface StageActions {
  setActiveStage: (stageId: string) => Promise<void>;
  addStage: () => Promise<string>;
  removeStage: (stageId: string) => Promise<void>;
  reorderStages: (startIndex: number, endIndex: number) => Promise<void>;
  refreshStage: (stageId: string) => Promise<void>;
  preloadAdjacentStages: (currentStageId: string) => Promise<void>;
  validateStage: (stageId: string) => Promise<boolean>;
  duplicateStage: (stageId: string) => Promise<string>;
  getStageBlocks: (stageId: string) => Promise<Block[]>;
  updateStageBlocks: (stageId: string, blocks: Block[]) => Promise<void>;
}

interface RealStagesContextType {
  // Estado das etapas
  realStages: QuizStage[];
  activeStageId: string;
  totalStages: number;
  loadedStages: Set<string>;

  // Ações unificadas
  stageActions: StageActions;

  // Status e métricas
  isLoading: boolean;
  error: string | null;
  cacheStats: {
    hitRate: number;
    totalCached: number;
    memoryUsage: number;
  };

  // Configurações
  config: {
    maxStages: number;
    enablePreload: boolean;
    enableCache: boolean;
    funnelId: string;
  };
}

const RealStagesContext = createContext<RealStagesContextType | null>(null);

// Props do provider
interface RealStagesProviderProps {
  children: React.ReactNode;
  funnelId?: string;
  maxStages?: number;
  enablePreload?: boolean;
  enableCache?: boolean;
}

/**
 * 🏗️ PROVIDER PRINCIPAL
 */
export const RealStagesProvider: React.FC<RealStagesProviderProps> = ({
  children,
  funnelId = 'quiz21StepsComplete',
  maxStages = 21,
  enablePreload = true,
  enableCache = true,
}) => {
  // Estados principais
  const [realStages, setRealStages] = useState<QuizStage[]>([]);
  const [activeStageId, setActiveStageId] = useState<string>('step-1');
  const [loadedStages, setLoadedStages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configurações
  const config = useMemo(() => ({
    maxStages,
    enablePreload,
    enableCache,
    funnelId,
  }), [maxStages, enablePreload, enableCache, funnelId]);

  /**
   * 🏗️ INICIALIZAR ETAPAS
   */
  const initializeStages = useCallback(async () => {
    console.log('🚀 Inicializando realStages...');
    setIsLoading(true);
    setError(null);

    try {
      const stages: QuizStage[] = [];

      for (let i = 1; i <= config.maxStages; i++) {
        const stageId = `step-${i}`;
        const stageName = getStageName(i);

        stages.push({
          id: stageId,
          name: stageName,
          description: getStageDescription(i),
          order: i,
          blocksCount: 0, // Será atualizado conforme templates são carregados
          isActive: i === 1,
          isCompleted: false,
          hasData: false,
          metadata: {
            templateLoaded: false,
            cacheStatus: 'loading',
            fallback: false,
          },
        });
      }

      setRealStages(stages);
      console.log(`✅ ${config.maxStages} etapas inicializadas`);

      // Carregar a primeira etapa
      if (enableCache) {
        await loadStageData('step-1');
      }

    } catch (error) {
      console.error('❌ Erro ao inicializar etapas:', error);
      setError('Falha ao inicializar etapas');
    } finally {
      setIsLoading(false);
    }
  }, [config.maxStages, config.funnelId, enableCache]);

  /**
   * 📥 CARREGAR DADOS DE UMA ETAPA
   */
  const loadStageData = useCallback(async (stageId: string): Promise<Block[]> => {
    console.log(`🔄 Carregando dados para ${stageId}...`);

    try {
      const stepNumber = extractStepNumber(stageId);
      let blocks: Block[] = [];

      if (enableCache) {
        blocks = await templatesCacheService.getStepTemplate(stepNumber, config.funnelId);
      } else {
        // Carregamento direto sem cache
        blocks = await loadStepDirect(stepNumber);
      }

      // Atualizar status da etapa
      setRealStages(prev => prev.map(stage =>
        stage.id === stageId
          ? {
            ...stage,
            blocksCount: blocks.length,
            hasData: blocks.length > 0,
            metadata: {
              ...stage.metadata,
              templateLoaded: true,
              cacheStatus: blocks.length > 0 ? 'cached' : 'empty',
              lastAccessed: Date.now(),
              fallback: blocks.some(b => b.metadata?.isFallback),
            },
          }
          : stage
      ));

      setLoadedStages(prev => new Set([...prev, stageId]));
      console.log(`✅ ${stageId} carregado: ${blocks.length} blocos`);

      return blocks;

    } catch (error) {
      console.error(`❌ Erro ao carregar ${stageId}:`, error);

      // Atualizar status como erro
      setRealStages(prev => prev.map(stage =>
        stage.id === stageId
          ? {
            ...stage,
            metadata: {
              ...stage.metadata,
              cacheStatus: 'error',
              fallback: true,
            },
          }
          : stage
      ));

      // Retornar fallback
      return createFallbackBlocks(extractStepNumber(stageId));
    }
  }, [enableCache, config.funnelId]);

  /**
   * 🎯 AÇÕES DE ETAPAS UNIFICADAS
   */
  const stageActions: StageActions = useMemo(() => ({
    setActiveStage: async (stageId: string) => {
      console.log(`🎯 Mudando para etapa: ${stageId}`);

      try {
        setIsLoading(true);

        // Carregar dados da etapa se necessário
        if (!loadedStages.has(stageId)) {
          await loadStageData(stageId);
        }

        // Atualizar etapa ativa
        setRealStages(prev => prev.map(stage => ({
          ...stage,
          isActive: stage.id === stageId,
        })));

        setActiveStageId(stageId);

        // Preload etapas adjacentes se habilitado
        if (config.enablePreload) {
          await stageActions.preloadAdjacentStages(stageId);
        }

        console.log(`✅ Etapa ativa: ${stageId}`);

      } catch (error) {
        console.error(`❌ Erro ao mudar para ${stageId}:`, error);
        setError(`Falha ao carregar etapa ${stageId}`);
      } finally {
        setIsLoading(false);
      }
    },

    addStage: async () => {
      const newStageNumber = realStages.length + 1;
      const newStageId = `step-${newStageNumber}`;

      if (newStageNumber > config.maxStages) {
        throw new Error(`Limite máximo de ${config.maxStages} etapas atingido`);
      }

      const newStage: QuizStage = {
        id: newStageId,
        name: getStageName(newStageNumber),
        description: getStageDescription(newStageNumber),
        order: newStageNumber,
        blocksCount: 0,
        isActive: false,
        isCompleted: false,
        hasData: false,
        metadata: {
          templateLoaded: false,
          cacheStatus: 'loading',
          fallback: false,
        },
      };

      setRealStages(prev => [...prev, newStage]);
      console.log(`✅ Nova etapa adicionada: ${newStageId}`);

      return newStageId;
    },

    removeStage: async (stageId: string) => {
      if (realStages.length <= 1) {
        throw new Error('Não é possível remover a última etapa');
      }

      setRealStages(prev => prev.filter(stage => stage.id !== stageId));
      setLoadedStages(prev => {
        const newSet = new Set(prev);
        newSet.delete(stageId);
        return newSet;
      });

      // Invalidar cache
      if (enableCache) {
        const stepNumber = extractStepNumber(stageId);
        templatesCacheService.invalidateStep(stepNumber, config.funnelId);
      }

      console.log(`✅ Etapa removida: ${stageId}`);
    },

    reorderStages: async (startIndex: number, endIndex: number) => {
      const newStages = [...realStages];
      const [movedStage] = newStages.splice(startIndex, 1);
      newStages.splice(endIndex, 0, movedStage);

      // Atualizar orders
      const reorderedStages = newStages.map((stage, index) => ({
        ...stage,
        order: index + 1,
        id: `step-${index + 1}`, // Recriar IDs baseados na nova ordem
      }));

      setRealStages(reorderedStages);
      console.log(`✅ Etapas reordenadas: ${startIndex} → ${endIndex}`);
    },

    refreshStage: async (stageId: string) => {
      // Invalidar cache e recarregar
      if (enableCache) {
        const stepNumber = extractStepNumber(stageId);
        templatesCacheService.invalidateStep(stepNumber, config.funnelId);
      }

      setLoadedStages(prev => {
        const newSet = new Set(prev);
        newSet.delete(stageId);
        return newSet;
      });

      await loadStageData(stageId);
      console.log(`✅ Etapa atualizada: ${stageId}`);
    },

    preloadAdjacentStages: async (currentStageId: string) => {
      if (!config.enablePreload) return;

      const currentStep = extractStepNumber(currentStageId);
      const adjacentSteps = [
        Math.max(1, currentStep - 1),
        Math.min(config.maxStages, currentStep + 1),
      ].filter(step => step !== currentStep);

      const preloadPromises = adjacentSteps.map(async (stepNum) => {
        const stageId = `step-${stepNum}`;
        if (!loadedStages.has(stageId)) {
          try {
            await loadStageData(stageId);
          } catch (error) {
            console.warn(`⚠️ Preload falhou para ${stageId}:`, error);
          }
        }
      });

      await Promise.all(preloadPromises);
      console.log(`✅ Preload concluído para etapas adjacentes de ${currentStageId}`);
    },

    validateStage: async (stageId: string) => {
      const stage = realStages.find(s => s.id === stageId);
      if (!stage) return false;

      // Validação básica: etapa tem dados e não é fallback
      return stage.hasData && !stage.metadata.fallback;
    },

    duplicateStage: async (stageId: string) => {
      const sourceStage = realStages.find(s => s.id === stageId);
      if (!sourceStage) {
        throw new Error(`Etapa ${stageId} não encontrada`);
      }

      const newStageId = await stageActions.addStage();

      // Copiar dados da etapa original
      if (loadedStages.has(stageId)) {
        const sourceBlocks = await stageActions.getStageBlocks(stageId);
        await stageActions.updateStageBlocks(newStageId, sourceBlocks);
      }

      console.log(`✅ Etapa duplicada: ${stageId} → ${newStageId}`);
      return newStageId;
    },

    getStageBlocks: async (stageId: string) => {
      if (!loadedStages.has(stageId)) {
        return await loadStageData(stageId);
      }

      const stepNumber = extractStepNumber(stageId);
      return await templatesCacheService.getStepTemplate(stepNumber, config.funnelId);
    },

    updateStageBlocks: async (stageId: string, blocks: Block[]) => {
      // Atualizar cache se habilitado
      if (enableCache) {
        const stepNumber = extractStepNumber(stageId);
        templatesCacheService.invalidateStep(stepNumber, config.funnelId);
      }

      // Atualizar estado da etapa
      setRealStages(prev => prev.map(stage =>
        stage.id === stageId
          ? {
            ...stage,
            blocksCount: blocks.length,
            hasData: blocks.length > 0,
            metadata: {
              ...stage.metadata,
              templateLoaded: true,
              cacheStatus: 'cached',
              lastAccessed: Date.now(),
            },
          }
          : stage
      ));

      console.log(`✅ Blocos atualizados para ${stageId}: ${blocks.length} blocos`);
    },

  }), [realStages, loadedStages, config, enableCache, loadStageData]);

  /**
   * 📊 ESTATÍSTICAS DO CACHE
   */
  const cacheStats = useMemo(() => {
    if (!enableCache) {
      return { hitRate: 0, totalCached: 0, memoryUsage: 0 };
    }

    const stats = templatesCacheService.getStats();
    return {
      hitRate: templatesCacheService.getHitRate(),
      totalCached: stats.totalEntries,
      memoryUsage: stats.memoryUsage,
    };
  }, [enableCache, loadedStages]);

  // Inicializar ao montar
  useEffect(() => {
    initializeStages();
  }, [initializeStages]);

  // Context value
  const contextValue: RealStagesContextType = {
    realStages,
    activeStageId,
    totalStages: realStages.length,
    loadedStages,
    stageActions,
    isLoading,
    error,
    cacheStats,
    config,
  };

  return (
    <RealStagesContext.Provider value={contextValue}>
      {children}
    </RealStagesContext.Provider>
  );
};

/**
 * 🎯 HOOK PARA USAR O CONTEXTO
 */
export const useRealStages = (): RealStagesContextType => {
  const context = useContext(RealStagesContext);
  if (!context) {
    throw new Error('useRealStages deve ser usado dentro de RealStagesProvider');
  }
  return context;
};

/**
 * 🛠️ UTILIDADES
 */
function extractStepNumber(stageId: string): number {
  const match = stageId.match(/step-(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

function getStageName(stepNumber: number): string {
  const names: Record<number, string> = {
    1: 'Coleta de Nome',
    21: 'Resultado Final',
  };

  return names[stepNumber] || `Questão ${stepNumber - 1}`;
}

function getStageDescription(stepNumber: number): string {
  const descriptions: Record<number, string> = {
    1: 'Etapa inicial para coleta do nome do usuário',
    21: 'Apresentação do resultado personalizado',
  };

  return descriptions[stepNumber] || `Questão ${stepNumber - 1} do quiz de estilo`;
}

import { QUIZ_STYLE_21_STEPS_TEMPLATE as QUIZ_STYLE_21_STEPS_TEMPLATE_STATIC } from '@/templates/quiz21StepsComplete';

async function loadStepDirect(stepNumber: number): Promise<Block[]> {
  // Implementação direta sem cache (fallback)
  console.log(`🔄 Carregamento direto para step ${stepNumber}`);

  try {
    const stepKey = `step-${stepNumber}`;
    const stepBlocks = (QUIZ_STYLE_21_STEPS_TEMPLATE_STATIC as any)[stepKey] || [];
    return Array.isArray(stepBlocks) ? stepBlocks : [];
  } catch (error) {
    console.error(`❌ Carregamento direto falhou para step ${stepNumber}:`, error);
    return createFallbackBlocks(stepNumber);
  }
}

function createFallbackBlocks(stepNumber: number): Block[] {
  return [{
    id: `fallback-step-${stepNumber}`,
    type: 'heading-inline',
    order: 0,
    content: {
      title: `Etapa ${stepNumber}`,
      subtitle: 'Conteúdo não disponível',
    },
    properties: {
      stageId: `step-${stepNumber}`,
      fallback: true,
    },
    metadata: {
      isFallback: true,
      timestamp: Date.now(),
    },
  }];
}

// Exports
export type { QuizStage, StageActions, RealStagesContextType };
