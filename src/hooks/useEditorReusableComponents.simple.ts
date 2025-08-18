import React, { useCallback, useEffect, useState } from 'react';
import { ENHANCED_BLOCK_REGISTRY } from '@/components/editor/blocks/enhancedBlockRegistry';
import { useEditor } from '../context/EditorContext';
import { BlockType } from '@/types/editor';

// ============================================================================
// HOOK SIMPLIFICADO: useEditorReusableComponents (Sem Supabase)
// ============================================================================

export interface EditorComponentType {
  type_key: string;
  display_name: string;
  category: string;
  component: React.ComponentType<any>;
  is_available: boolean;
  default_properties: Record<string, any>;
}

export const useEditorReusableComponents = () => {
  const {
    blockActions: { addBlock },
  } = useEditor();
  const [availableComponents, setAvailableComponents] = useState<EditorComponentType[]>([]);
  const [stepComponents] = useState<Record<number, any[]>>({});
  const [loading] = useState(false);

  // Converter registry em componentes disponíveis
  useEffect(() => {
    const components: EditorComponentType[] = Object.entries(ENHANCED_BLOCK_REGISTRY).map(
      ([key, component]) => ({
        type_key: key,
        display_name: key
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        category: key.includes('quiz') ? 'Quiz' : key.includes('form') ? 'Forms' : 'Basic',
        component: component as React.ComponentType<any>, // ✅ Casting explícito para resolver tipo
        is_available: true,
        default_properties: {},
      })
    );

    setAvailableComponents(components);
  }, []);

  const getComponentsByCategory = useCallback(
    (category: string) => {
      return availableComponents.filter(comp => comp.category === category);
    },
    [availableComponents]
  );

  const getAvailableCategories = useCallback(() => {
    const categorySet = new Set(availableComponents.map(comp => comp.category));
    return Array.from(categorySet);
  }, [availableComponents]);

  const addReusableComponentToEditor = useCallback(
    (componentType: string, stepNumber?: number) => {
      console.log('🎯 Adicionando componente ao editor:', componentType, 'step:', stepNumber);
      if (addBlock) {
        addBlock(componentType as BlockType);
      }
    },
    [addBlock]
  );

  const applyComponentTemplate = useCallback((templateKey: string, targetStepNumber?: number) => {
    // Mock implementation - não faz nada por enquanto
    console.log('🎯 Aplicando template:', templateKey, 'step:', targetStepNumber);
    return Promise.resolve();
  }, []);

  return {
    availableComponents,
    stepComponents,
    loading,
    getComponentsByCategory,
    getAvailableCategories,
    addReusableComponentToEditor,
    applyComponentTemplate,
  };
};

export default useEditorReusableComponents;
