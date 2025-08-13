import { useCallback, useState } from 'react';
import { Block } from '@/types/editor';

/**
 * Hook para gerenciar a lógica do painel de propriedades
 */
export const usePropertiesPanel = (
  selectedBlock: Block | null,
  onUpdateBlock: (blockId: string, updates: Record<string, any>) => void
) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handlePropertyUpdate = useCallback((updates: Record<string, any>) => {
    if (selectedBlock) {
      // Merge updates with existing properties
      const currentProperties = selectedBlock.properties || {};
      const mergedProperties = { ...currentProperties, ...updates };
      
      onUpdateBlock(selectedBlock.id, { properties: mergedProperties });
    }
  }, [selectedBlock, onUpdateBlock]);

  const handleTogglePreview = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  const handleValidation = useCallback((isValid: boolean) => {
    // TODO: Implementar lógica de validação global
    console.log('Validação do painel:', isValid);
  }, []);

  return {
    isPreviewMode,
    handlePropertyUpdate,
    handleTogglePreview,
    handleValidation,
  };
};
