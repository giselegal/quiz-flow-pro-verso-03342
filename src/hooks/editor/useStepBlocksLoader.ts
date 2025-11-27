// src/hooks/editor/useStepBlocksLoader.ts
import { useEffect } from 'react';
import { templateService } from '@/services/template/TemplateService';
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

    // 🔥 SAFETY: Timeout agressivo de 3s
    const safetyTimeout = setTimeout(() => {
      if (!signal.aborted) {
        console.error('⚠️ [useStepBlocksLoader] Loading > 3s, forçando reset');
        setStepLoading(false);
      }
    }, 3000);

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

        // ✅ CORREÇÃO: Validar array não-vazio
        if (blocks.length === 0) {
          appLogger.warn('[useStepBlocksLoader] Step sem blocos válidos', { stepId });
          return;
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
