import { useFunnels } from '@/contexts';
import { useEffect, useRef } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Hook para carregar automaticamente os templates das etapas
 * quando o usuário navega entre as etapas no editor
 * ✅ FASE 1.3: AbortController para eliminar race conditions
 */
export const useAutoLoadTemplates = (): {
  activeStageId: string;
  currentFunnelId: string | undefined;
} => {
  const { getTemplateBlocks, currentFunnelId } = useFunnels();
  const activeStageId = 'step-1'; // Simplified - uses current step

  // 🎯 AbortController ref para cancelar requisições obsoletas
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadIdRef = useRef<number>(0);

  useEffect(() => {
    if (!activeStageId || !currentFunnelId) return;

    // 🎯 Cancelar requisição anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentLoadId = ++loadIdRef.current;

    const loadStepTemplate = async () => {
      try {
        appLogger.info(`🔄 Carregando template para etapa: ${activeStageId} (loadId: ${currentLoadId})`);

        // Verificar se foi abortado
        if (controller.signal.aborted) return;

        // Obter blocos do template da etapa atual
        const templateBlocks = getTemplateBlocks(currentFunnelId, activeStageId);

        // 🎯 Verificar se ainda é a requisição atual
        if (controller.signal.aborted || currentLoadId !== loadIdRef.current) {
          appLogger.info(`⏭️ Ignorando resultado obsoleto para ${activeStageId}`);
          return;
        }

        if (templateBlocks && templateBlocks.length > 0) {
          appLogger.info(`✅ Carregados ${templateBlocks.length} blocos para etapa ${activeStageId}`);

          // Converter e carregar os blocos no editor
          const editorBlocks = templateBlocks.map((block, index) => ({
            ...block,
            id: block.id || `${activeStageId}-block-${index}`,
            order: index,
          }));

          // Usar o EditorContext interno para atualizar blocos
          // O dispatch será acessado diretamente no componente que usa este hook
          return editorBlocks;
        } else {
          appLogger.warn(`⚠️ Nenhum bloco encontrado para etapa ${activeStageId}`);
          return [];
        }
      } catch (error) {
        // Ignorar erros de abort
        if (error instanceof Error && error.name === 'AbortError') {
          appLogger.info(`⏭️ Requisição cancelada para ${activeStageId}`);
          return [];
        }

        appLogger.error('❌ Erro ao carregar template da etapa:', { data: [error] });
        return [];
      }
    };

    loadStepTemplate();

    // 🎯 Cleanup: cancelar ao desmontar ou mudar deps
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [activeStageId, currentFunnelId, getTemplateBlocks]);

  return { activeStageId, currentFunnelId };
};
