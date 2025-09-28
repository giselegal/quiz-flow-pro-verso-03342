import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import { useFunnels } from '@/context/FunnelsContext';
import { useEffect } from 'react';

/**
 * Hook para carregar automaticamente os templates das etapas
 * quando o usuário navega entre as etapas no editor
 */
export const useAutoLoadTemplates = () => {
  const { activeStageId } = useEditor();
  const { getTemplateBlocks, currentFunnelId } = useFunnels();

  useEffect(() => {
    if (!activeStageId || !currentFunnelId) return;

    const loadStepTemplate = async () => {
      try {
        console.log(`🔄 Carregando template para etapa: ${activeStageId}`);

        // Obter blocos do template da etapa atual
        const templateBlocks = getTemplateBlocks(currentFunnelId, activeStageId);

        if (templateBlocks && templateBlocks.length > 0) {
          console.log(`✅ Carregados ${templateBlocks.length} blocos para etapa ${activeStageId}`);

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
          console.warn(`⚠️ Nenhum bloco encontrado para etapa ${activeStageId}`);
          return [];
        }
      } catch (error) {
        console.error('❌ Erro ao carregar template da etapa:', error);
        return [];
      }
    };

    loadStepTemplate();
  }, [activeStageId, currentFunnelId, getTemplateBlocks]);

  return { activeStageId, currentFunnelId };
};
