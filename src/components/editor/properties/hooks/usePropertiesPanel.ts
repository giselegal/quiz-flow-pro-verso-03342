import { Block } from '@/types/editor';
import { useCallback, useState } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Hook para gerenciar a lógica do painel de propriedades
 */
export const usePropertiesPanel = (
  selectedBlock: Block | null,
  onUpdateBlock: (blockId: string, updates: Record<string, any>) => void,
) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handlePropertyUpdate = useCallback(
    (updates: Record<string, any>) => {
      if (selectedBlock) {
        // Merge updates with existing properties
        const currentProperties = selectedBlock.properties || {};
        const mergedProperties = { ...currentProperties, ...updates };

        onUpdateBlock(selectedBlock.id, { properties: mergedProperties });
      }
    },
    [selectedBlock, onUpdateBlock],
  );

  const handleTogglePreview = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  const handleValidation = useCallback((isValid: boolean) => {
    // TODO: Implementar lógica de validação global
    appLogger.info('Validação do painel:', { data: [isValid] });
  }, []);

  return {
    isPreviewMode,
    handlePropertyUpdate,
    handleTogglePreview,
    handleValidation,
  };
};
