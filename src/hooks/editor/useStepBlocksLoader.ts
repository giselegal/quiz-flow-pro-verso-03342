// src/hooks/editor/useStepBlocksLoader.ts
import { useEffect } from 'react';
import { templateService } from '@/services/canonical/TemplateService';
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
    if (!templateOrFunnelId || !stepIndex) return;

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

        const svc: any = templateService;
        const res = await svc.getStep(stepId, templateOrFunnelId, { signal });

        if (!res.success || !res.data) {
          appLogger.warn('[useStepBlocksLoader] Step sem dados', { stepId });
          return;
        }

        // ✅ Normalização simplificada (3 formatos)
        let blocks: Block[] = [];
        
        if (Array.isArray(res.data)) {
          blocks = res.data.filter((b: any) => b && b.id && b.type);
        } else if (res.data.blocks && Array.isArray(res.data.blocks)) {
          blocks = res.data.blocks.filter((b: any) => b && b.id && b.type);
        } else if (res.data.steps && res.data.steps[stepId]?.blocks) {
          blocks = res.data.steps[stepId].blocks.filter((b: any) => b && b.id && b.type);
        }

        // ✅ CORREÇÃO: Se vazio, criar bloco placeholder para evitar canvas em branco silencioso
        if (blocks.length === 0) {
          appLogger.warn('[useStepBlocksLoader] Step sem blocos válidos – gerando placeholder', { stepId });
          blocks = [
            {
              id: `placeholder-${stepId}`,
              type: 'text',
              order: 0,
              properties: {},
              content: { text: 'Bloco inicial automático – clique para editar.' },
            } as Block
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
