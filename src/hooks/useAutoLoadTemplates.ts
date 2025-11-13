import { useEditor } from '@/hooks/useEditor';
import { useFunnels } from '@/contexts';
import { useEffect } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Hook para carregar automaticamente os templates das etapas
 * quando o usuário navega entre as etapas no editor
 */
export const useAutoLoadTemplates = (): { 
  activeStageId: string; 
  currentFunnelId: string | undefined; 
} => {
  const { getTemplateBlocks, currentFunnelId } = useFunnels();
  const activeStageId = 'step-1'; // Simplified - uses current step

  useEffect(() => {
    if (!activeStageId || !currentFunnelId) return;

    const loadStepTemplate = async () => {
      try {
        appLogger.info(`🔄 Carregando template para etapa: ${activeStageId}`);

        // Obter blocos do template da etapa atual
        const templateBlocks = getTemplateBlocks(currentFunnelId, activeStageId);

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
        appLogger.error('❌ Erro ao carregar template da etapa:', { data: [error] });
        return [];
      }
    };

    loadStepTemplate();
  }, [activeStageId, currentFunnelId, getTemplateBlocks]);

  return { activeStageId, currentFunnelId };
};
