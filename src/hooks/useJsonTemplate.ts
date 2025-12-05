import type { Block } from '@/types/editor';
import { TemplateManager } from '@/lib/utils/TemplateManager';
import { useCallback, useEffect, useRef, useState } from 'react';
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
 * ✅ FASE 1.3: AbortController para eliminar race conditions
 */
export const useJsonTemplate = (
  initialStepId?: string,
  options: UseJsonTemplateOptions = {},
): UseJsonTemplateReturn => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string | null>(initialStepId || null);

  // 🎯 AbortController ref para cancelar requisições obsoletas
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadIdRef = useRef<number>(0);

  const { preload = false, fallback = [], onLoad, onError } = options;

  /**
   * Carrega blocos de uma etapa com suporte a cancelamento
   */
  const loadStep = useCallback(
    async (stepId: string) => {
      if (!stepId) return;

      // 🎯 Cancelar requisição anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Criar novo AbortController
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const currentLoadId = ++loadIdRef.current;

      setLoading(true);
      setError(null);
      setCurrentStepId(stepId);

      try {
        appLogger.info(`🔄 useJsonTemplate: Carregando ${stepId} (loadId: ${currentLoadId})...`);
        
        // Passar signal para TemplateManager se suportado
        const stepBlocks = await TemplateManager.loadStepBlocks(stepId, controller.signal);

        // 🎯 Verificar se esta requisição ainda é válida
        if (controller.signal.aborted || currentLoadId !== loadIdRef.current) {
          appLogger.info(`⏭️ useJsonTemplate: Ignorando resultado obsoleto de ${stepId}`);
          return;
        }

        setBlocks(stepBlocks);
        onLoad?.(stepId, stepBlocks);

        appLogger.info(`✅ useJsonTemplate: ${stepId} carregado com ${stepBlocks.length} blocos`);
      } catch (err) {
        // Ignorar erros de abort
        if (err instanceof Error && err.name === 'AbortError') {
          appLogger.info(`⏭️ useJsonTemplate: Requisição cancelada para ${stepId}`);
          return;
        }

        // Verificar se ainda é a requisição atual
        if (currentLoadId !== loadIdRef.current) {
          return;
        }

        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setBlocks(fallback);
        onError?.(stepId, error);

        appLogger.error(`❌ useJsonTemplate: Erro ao carregar ${stepId}:`, { data: [error] });
      } finally {
        // Só atualizar loading se for a requisição atual
        if (currentLoadId === loadIdRef.current) {
          setLoading(false);
        }
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

    // 🎯 Cleanup: cancelar requisição pendente ao desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
 * ✅ FASE 1.3: AbortController para eliminar race conditions
 */
export const useMultiJsonTemplate = (stepIds: string[]) => {
  const [templatesData, setTemplatesData] = useState<Record<string, Block[]>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, Error>>({});
  
  // 🎯 AbortController ref
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadAllSteps = useCallback(async () => {
    if (stepIds.length === 0) return;

    // 🎯 Cancelar requisições anteriores
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setErrors({});

    const results: Record<string, Block[]> = {};
    const loadErrors: Record<string, Error> = {};

    // Carrega todos os templates em paralelo com AbortSignal
    await Promise.allSettled(
      stepIds.map(async stepId => {
        try {
          // Verificar se foi abortado antes de cada requisição
          if (controller.signal.aborted) return;
          
          const blocks = await TemplateManager.loadStepBlocks(stepId, controller.signal);
          
          // Verificar se foi abortado após requisição
          if (!controller.signal.aborted) {
            results[stepId] = blocks;
          }
        } catch (err) {
          // Ignorar erros de abort
          if (err instanceof Error && err.name === 'AbortError') return;
          
          const error = err instanceof Error ? err : new Error(String(err));
          loadErrors[stepId] = error;
        }
      }),
    );

    // Só atualizar estado se não foi abortado
    if (!controller.signal.aborted) {
      setTemplatesData(results);
      setErrors(loadErrors);
      setLoading(false);
      appLogger.info('📊 useMultiJsonTemplate: Carregados', { data: [Object.keys(results).length, 'templates'] });
    }
  }, [stepIds]);

  useEffect(() => {
    loadAllSteps();
    
    // 🎯 Cleanup: cancelar ao desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
