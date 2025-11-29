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

        const svc: any = templateService;
        const res = await svc.getStep(stepId, templateOrFunnelId, { signal });

        if (!res.success || !res.data) {
          appLogger.warn('[useStepBlocksLoader] Step sem dados', { stepId });
          return;
        }

        // ✅ Normalização expandida (suporta múltiplos formatos)
        // Formatos aceitos:
        //  A. Array direto de blocos
        //  B. Objeto { blocks: [...] }
        //  C. Objeto { steps: { [stepId]: { blocks: [...] } } }
        //  D. Objeto { steps: { [stepId]: [ ...blocks ] } }
        //  E. Objeto { steps: [ { id: step-01, blocks: [...] }, ... ] }
        //  F. Variante sem zero à esquerda (step-1)
        let blocks: Block[] = [];
        const data: any = res.data;
        const stepIdNoPad = stepId.replace(/step-0(\d)/, 'step-$1');

        try {
          if (Array.isArray(data)) {
            blocks = data.filter((b: any) => b && b.id && b.type);
          } else if (data.blocks && Array.isArray(data.blocks)) {
            blocks = data.blocks.filter((b: any) => b && b.id && b.type);
          } else if (data.steps) {
            // C
            if (data.steps[stepId]?.blocks && Array.isArray(data.steps[stepId].blocks)) {
              blocks = data.steps[stepId].blocks.filter((b: any) => b && b.id && b.type);
            }
            // D
            else if (Array.isArray(data.steps[stepId])) {
              blocks = data.steps[stepId].filter((b: any) => b && b.id && b.type);
            }
            // F (sem zero à esquerda)
            else if (data.steps[stepIdNoPad]?.blocks && Array.isArray(data.steps[stepIdNoPad].blocks)) {
              blocks = data.steps[stepIdNoPad].blocks.filter((b: any) => b && b.id && b.type);
            } else if (Array.isArray(data.steps[stepIdNoPad])) {
              blocks = data.steps[stepIdNoPad].filter((b: any) => b && b.id && b.type);
            }
            // E (steps como array de objetos)
            else if (Array.isArray(data.steps)) {
              const found = data.steps.find((s: any) => s && (s.id === stepId || s.id === stepIdNoPad));
              if (found) {
                if (Array.isArray(found.blocks)) {
                  blocks = found.blocks.filter((b: any) => b && b.id && b.type);
                } else if (Array.isArray(found)) { // Caso degenerado onde o próprio step é array
                  blocks = found.filter((b: any) => b && b.id && b.type);
                }
              }
            }
          }
        } catch (normErr) {
          appLogger.warn('[useStepBlocksLoader] Falha na normalização de blocos', { error: normErr });
        }

        if (blocks.length === 0) {
          appLogger.warn('[useStepBlocksLoader] Nenhum formato reconhecido produziu blocos', {
            stepId,
            keys: Object.keys(data || {}),
            hasSteps: Boolean(data?.steps),
            stepsKeys: data?.steps && !Array.isArray(data.steps) ? Object.keys(data.steps).slice(0, 5) : 'array|none'
          });
        }

        // ✅ CORREÇÃO: Se vazio, criar bloco placeholder para evitar canvas totalmente vazio
        if (blocks.length === 0) {
          appLogger.warn('[useStepBlocksLoader] Step sem blocos válidos – gerando placeholder', { stepId });
          blocks = [
            {
              id: `placeholder-${stepId}`,
              type: 'TextBlock' as any,
              order: 0,
              properties: { system: true },
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
