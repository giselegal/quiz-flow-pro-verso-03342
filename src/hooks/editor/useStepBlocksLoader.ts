// src/hooks/editor/useStepBlocksLoader.ts
import { useEffect } from 'react';
// Substitui acesso direto ao templateService pelo loader unificado com validação/caching
import { unifiedTemplateLoader } from '@/services/templates/UnifiedTemplateLoader';
import type { Block } from '@/types/editor';
import { appLogger } from '@/lib/utils/appLogger';

interface UseStepBlocksLoaderParams {
  templateOrFunnelId: string | null;
  stepIndex: number;
  setStepBlocks: (stepIndex: number, blocks: Block[]) => void;
  setStepLoading: (value: boolean) => void;
}

/**
 * Hook unificado para carregamento de steps
 * ✅ ARQUITETURA: Substitui lógica fragmentada no useEffect principal
 * ✅ BENEFÍCIO: Separação de responsabilidades, testabilidade
 * ✅ CORREÇÕES: Safety timeout de 3s, validação de array vazio, normalização simplificada
 */
export function useStepBlocksLoader({
  templateOrFunnelId,
  stepIndex,
  setStepBlocks,
  setStepLoading
}: UseStepBlocksLoaderParams) {
  useEffect(() => {
    if (!templateOrFunnelId || !stepIndex) {
      appLogger.warn('[useStepBlocksLoader] Early return: id ou step ausente', {
        templateOrFunnelId,
        stepIndex
      });
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    // ✅ CORREÇÃO: Setar loading ANTES da função async
    setStepLoading(true);

    // ⏱️ Safety: marcar lentidão sem resetar loading
    // Evita interrupção indevida em redes lentas ou templates maiores
    const safetyTimeout = setTimeout(() => {
      if (!signal.aborted) {
        appLogger.warn('⚠️ [useStepBlocksLoader] Loading lento (> 8s), mantendo estado de loading');
        // Não chamamos setStepLoading(false) aqui para evitar reset prematuro.
      }
    }, 8000);

    async function loadStep() {
      try {
        const stepId = `step-${String(stepIndex).padStart(2, '0')}`;

        appLogger.info('[useStepBlocksLoader] Carregando step', {
          stepId,
          templateOrFunnelId
        });

        // Usar loader unificado (já faz cache, validação e hierarquia de fontes)
        let blocks: Block[] = [];
        try {
          const loadResult = await unifiedTemplateLoader.loadStep(stepId, { useCache: true, signal });
          blocks = loadResult.data as Block[];
          if (!blocks || blocks.length === 0) {
            appLogger.warn('[useStepBlocksLoader] Loader retornou vazio – gerando placeholder', { stepId, source: loadResult.source });
          }
        } catch (loaderErr) {
          appLogger.warn('[useStepBlocksLoader] Falha loader unificado, usando placeholder', { stepId, error: loaderErr });
        }

        if (!blocks || blocks.length === 0) {
          blocks = [
            {
              id: `placeholder-${stepId}`,
              type: 'text' as any, // alinhar com BlockType canônico
              order: 0,
              properties: { system: true, ephemeral: true },
              content: { text: 'Bloco inicial automático – clique para editar.' },
              ephemeral: true,
            } as Block,
          ];
        }

        if (!signal.aborted) {
          setStepBlocks(stepIndex, blocks);
          appLogger.info('[useStepBlocksLoader] Step carregado', { 
            stepId, 
            count: blocks.length 
          });
        }
      } catch (error) {
        if (!signal.aborted) {
          appLogger.error('[useStepBlocksLoader] Erro ao carregar', { error });
        }
      } finally {
        if (!signal.aborted) {
          clearTimeout(safetyTimeout);
          setStepLoading(false);
        }
      }
    }

    loadStep();

    return () => {
      controller.abort();
      clearTimeout(safetyTimeout);
      setStepLoading(false);
    };
  }, [templateOrFunnelId, stepIndex, setStepBlocks, setStepLoading]);
}
