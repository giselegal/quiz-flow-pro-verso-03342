// src/hooks/editor/useStepBlocksLoader.ts
import { useEffect, useRef } from 'react';
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
 * ✅ P10 FIX: Não gera placeholder silencioso - deixa canvas vazio com logging
 * ✅ P11 FIX: Usa ref para controlar estado de loading após abort
 */
export function useStepBlocksLoader({
  templateOrFunnelId,
  stepIndex,
  setStepBlocks,
  setStepLoading
}: UseStepBlocksLoaderParams) {
  // ✅ P11 FIX: Usar ref para evitar chamadas após unmount/abort
  const isMountedRef = useRef(true);
  const loadedStepRef = useRef<string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (!templateOrFunnelId || !stepIndex) {
      appLogger.debug('[useStepBlocksLoader] Early return: id ou step ausente', {
        templateOrFunnelId,
        stepIndex
      });
      return;
    }

    const stepId = `step-${String(stepIndex).padStart(2, '0')}`;
    
    // ✅ P1: Cache key explícito com funnelId (previne mistura de dados entre funnels)
    // Estrutura: "funnel:<funnelId>:step:<stepId>" ou "template:<templateId>:step:<stepId>"
    const resourceType = templateOrFunnelId.startsWith('funnel-') ? 'funnel' : 'template';
    const loadKey = `${resourceType}:${templateOrFunnelId}:step:${stepId}`;
    
    if (loadedStepRef.current === loadKey) {
      appLogger.debug('[useStepBlocksLoader] Step já carregado, ignorando', { 
        stepId, 
        resourceType,
        loadKey 
      });
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    // ✅ CORREÇÃO: Setar loading ANTES da função async
    setStepLoading(true);

    // ⏱️ Safety: marcar lentidão sem resetar loading
    const safetyTimeout = setTimeout(() => {
      if (!signal.aborted && isMountedRef.current) {
        appLogger.warn('⚠️ [useStepBlocksLoader] Loading lento (> 8s)', { stepId, templateOrFunnelId });
      }
    }, 8000);

    async function loadStep() {
      try {
        appLogger.info('[useStepBlocksLoader] Carregando step', {
          stepId,
          templateOrFunnelId
        });

        // Usar loader unificado (já faz cache, validação e hierarquia de fontes)
        let blocks: Block[] = [];
        let loadSource = 'unknown';
        
        try {
          // ✅ FIX: Encaminhar sempre o identificador como funnelId para permitir seleção de JSON v4 por chave (ex: 'quiz21-v4-gold')
          const loadResult = await unifiedTemplateLoader.loadStep(stepId, { 
            useCache: true, 
            signal,
            funnelId: templateOrFunnelId || undefined
          });
          blocks = loadResult.data as Block[];
          loadSource = loadResult.source;
          
          // ✅ P10 FIX: Não gerar placeholder silencioso
          // Apenas logar e deixar array vazio - UX consistente
          if (!blocks || blocks.length === 0) {
            appLogger.warn('[useStepBlocksLoader] Step vazio retornado - verificar template', { 
              stepId, 
              source: loadSource,
              templateOrFunnelId 
            });
            blocks = []; // Explicitamente vazio
          }
        } catch (loaderErr) {
          // ✅ P10 FIX: Logar erro mas não criar placeholder
          appLogger.error('[useStepBlocksLoader] Falha ao carregar step', { 
            stepId, 
            error: (loaderErr as Error)?.message,
            templateOrFunnelId 
          });
          blocks = []; // Vazio em caso de erro
        }

        // ✅ P11 FIX: Verificar mount status via ref
        if (!signal.aborted && isMountedRef.current) {
          setStepBlocks(stepIndex, blocks);
          loadedStepRef.current = loadKey;
          appLogger.info('[useStepBlocksLoader] Step carregado', { 
            stepId, 
            count: blocks.length,
            source: loadSource
          });
        }
      } catch (error) {
        if (!signal.aborted && isMountedRef.current) {
          appLogger.error('[useStepBlocksLoader] Erro inesperado', { 
            error: (error as Error)?.message 
          });
        }
      } finally {
        // ✅ P11 FIX: Verificar mount status antes de atualizar estado
        if (!signal.aborted && isMountedRef.current) {
          clearTimeout(safetyTimeout);
          setStepLoading(false);
        }
      }
    }

    loadStep();

    return () => {
      isMountedRef.current = false;
      controller.abort();
      clearTimeout(safetyTimeout);
      // ✅ P11 FIX: Não chamar setStepLoading aqui - pode causar warning
    };
  }, [templateOrFunnelId, stepIndex, setStepBlocks, setStepLoading]);
}
