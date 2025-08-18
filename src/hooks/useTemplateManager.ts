import { useCallback, useState } from 'react';
import type { TemplateData } from '../services/templateService';
import { templateService } from '../services/templateService';
import type { Block } from '../types/editor';

export interface UseTemplateManagerOptions {
  onAddBlock?: (blockData: Block) => void;
  onUpdateBlock?: (blockId: string, updates: Partial<Block>) => void;
}

export const useTemplateManager = (options: UseTemplateManagerOptions = {}) => {
  const [currentTemplate, setCurrentTemplate] = useState<TemplateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega template por id da etapa (step-1, step-2, etc)
  const loadTemplate = useCallback(async (templateId: string) => {
    setIsLoading(true);
    try {
      const template = await templateService.getTemplate(templateId);
      setCurrentTemplate(template);
      return template;
    } catch (error) {
      console.error('Erro ao carregar template:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carrega template por número da etapa (1, 2, etc)
  const loadTemplateByStep = useCallback(async (step: number) => {
    setIsLoading(true);
    try {
      const template = await templateService.getTemplateByStep(step);
      setCurrentTemplate(template);
      return template;
    } catch (error) {
      console.error('Erro ao carregar template por etapa:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Aplica o template na etapa atual
  const applyTemplate = useCallback(
    async (template: TemplateData) => {
      const { onAddBlock, onUpdateBlock } = options;

      if (!onAddBlock || !onUpdateBlock) {
        console.error('Handlers para addBlock/updateBlock não fornecidos');
        return;
      }

      const blocks = templateService.convertTemplateBlocksToEditorBlocks(template.blocks);

      // Adiciona os blocos em sequência
      for (const block of blocks) {
        // 1. Cria o bloco com o tipo correto
        onAddBlock(block);

        // 2. Atualiza com as propriedades do template
        if (block.id) {
          onUpdateBlock(block.id, {
            content: block.content,
            order: block.order,
          });
        }
      }
    },
    [options]
  );

  // Aplica o template atual se existir
  const applyCurrentTemplate = useCallback(async () => {
    if (!currentTemplate) {
      console.error('Nenhum template carregado para aplicar');
      return;
    }

    await applyTemplate(currentTemplate);
  }, [currentTemplate, applyTemplate]);

  return {
    currentTemplate,
    isLoading,
    loadTemplate,
    loadTemplateByStep,
    applyTemplate,
    applyCurrentTemplate,
  };
};

export default useTemplateManager;
