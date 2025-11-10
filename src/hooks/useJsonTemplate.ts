import type { Block } from '@/types/editor';
import { TemplateManager } from '@/lib/utils/TemplateManager';
import { useCallback, useEffect, useState } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

interface UseJsonTemplateOptions {
  preload?: boolean;
  fallback?: Block[];
  onLoad?: (stepId: string, blocks: Block[]) => void;
  onError?: (stepId: string, error: Error) => void;
}

interface UseJsonTemplateReturn {
  blocks: Block[];
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
  loadStep: (stepId: string) => Promise<void>;
}

/**
 * Hook para carregar e gerenciar templates JSON
 */
export const useJsonTemplate = (
  initialStepId?: string,
  options: UseJsonTemplateOptions = {},
): UseJsonTemplateReturn => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string | null>(initialStepId || null);

  const { preload = false, fallback = [], onLoad, onError } = options;

  /**
   * Carrega blocos de uma etapa
   */
  const loadStep = useCallback(
    async (stepId: string) => {
      if (!stepId) return;

      setLoading(true);
      setError(null);
      setCurrentStepId(stepId);

      try {
        appLogger.info(`🔄 useJsonTemplate: Carregando ${stepId}...`);
        const stepBlocks = await TemplateManager.loadStepBlocks(stepId);

        setBlocks(stepBlocks);
        onLoad?.(stepId, stepBlocks);

        appLogger.info(`✅ useJsonTemplate: ${stepId} carregado com ${stepBlocks.length} blocos`);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setBlocks(fallback);
        onError?.(stepId, error);

        appLogger.error(`❌ useJsonTemplate: Erro ao carregar ${stepId}:`, { data: [error] });
      } finally {
        setLoading(false);
      }
    },
    [fallback, onLoad, onError],
  );

  /**
   * Recarrega template atual
   */
  const reload = useCallback(async () => {
    if (currentStepId) {
      await loadStep(currentStepId);
    }
  }, [currentStepId, loadStep]);

  /**
   * Efeito de inicialização
   */
  useEffect(() => {
    if (initialStepId) {
      loadStep(initialStepId);
    }

    // Pre-carregamento opcional
    if (preload) {
      TemplateManager.preloadCommonTemplates().catch(err => {
        appLogger.warn('⚠️ Falha no pre-carregamento:', { data: [err] });
      });
    }
  }, [initialStepId, preload, loadStep]);

  return {
    blocks,
    loading,
    error,
    reload,
    loadStep,
  };
};

/**
 * Hook específico para múltiplas etapas
 */
export const useMultiJsonTemplate = (stepIds: string[]) => {
  const [templatesData, setTemplatesData] = useState<Record<string, Block[]>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, Error>>({});

  const loadAllSteps = useCallback(async () => {
    if (stepIds.length === 0) return;

    setLoading(true);
    setErrors({});

    const results: Record<string, Block[]> = {};
    const errors: Record<string, Error> = {};

    // Carrega todos os templates em paralelo
    await Promise.allSettled(
      stepIds.map(async stepId => {
        try {
          const blocks = await TemplateManager.loadStepBlocks(stepId);
          results[stepId] = blocks;
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          errors[stepId] = error;
        }
      }),
    );

    setTemplatesData(results);
    setErrors(errors);
    setLoading(false);

    appLogger.info('📊 useMultiJsonTemplate: Carregados', { data: [Object.keys(results).length, 'templates'] });
  }, [stepIds]);

  useEffect(() => {
    loadAllSteps();
  }, [loadAllSteps]);

  return {
    templatesData,
    loading,
    errors,
    reload: loadAllSteps,
    getBlocks: (stepId: string) => templatesData[stepId] || [],
    hasError: (stepId: string) => stepId in errors,
    getError: (stepId: string) => errors[stepId] || null,
  };
};

export default useJsonTemplate;
