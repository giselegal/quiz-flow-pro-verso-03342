// @ts-nocheck
import { ENHANCED_BLOCK_REGISTRY } from "@/config/enhancedBlockRegistry";
import { useEditor } from "@/context/EditorContext";
import { useCallback, useEffect, useState } from "react";

// ============================================================================
// HOOK INTEGRADO: useEditorReusableComponents (Versão Simplificada)
// Conecta o sistema de componentes reutilizáveis com o editor sem Supabase
// ============================================================================

export interface EditorComponentType {
  type_key: string;
  display_name: string;
  category: string;
  component_path: string;
  default_properties: Record<string, any>;
  validation_schema: Record<string, any>;
  component: React.ComponentType<any>; // Referência ao componente React
  is_available: boolean; // Se está disponível no ENHANCED_BLOCK_REGISTRY
}

export interface EditorComponentInstance {
  id: string;
  instance_key: string;
  component_type: string;
  quiz_id: string;
  step_number: number;
  order_index: number;
  properties: Record<string, any>;
  custom_styling: Record<string, any>;
  is_active: boolean;
  display_name: string;
  category: string;
}

export const useEditorReusableComponents = () => {
  const {
    stages,
    activeStageId,
    blockActions: { addBlock, updateBlock, deleteBlock, reorderBlocks },
  } = useEditor();

  const {
    componentTypes,
    stepComponents,
    loading,
    error,
    addComponent,
    updateComponent,
    deleteComponent,
    reorderComponents,
    loadStepComponents,
    loadAllQuizComponents,
  } = useReusableComponents("editor-quiz");

  const [availableComponents, setAvailableComponents] = useState<EditorComponentType[]>([]);

  // ============================================================================
  // SINCRONIZAR COMPONENTES DO REGISTRY COM SUPABASE
  // ============================================================================

  const syncRegistryWithDatabase = useCallback(async () => {
    const registryComponents: EditorComponentType[] = [];

    // Iterar sobre o ENHANCED_BLOCK_REGISTRY
    Object.entries(ENHANCED_BLOCK_REGISTRY).forEach(([typeKey, component]) => {
      const dbComponent = componentTypes.find(ct => ct.type_key === typeKey);

      registryComponents.push({
        type_key: typeKey,
        display_name: dbComponent?.display_name || formatTypeKeyToDisplayName(typeKey),
        category: dbComponent?.category || getCategoryFromTypeKey(typeKey),
        component_path: `/components/registry/${typeKey}`,
        default_properties: dbComponent?.default_properties || {},
        validation_schema: dbComponent?.validation_schema || {},
        component: component,
        is_available: true,
      });
    });

    // Adicionar componentes do database que não estão no registry (marcados como indisponíveis)
    componentTypes.forEach(dbComponent => {
      if (!ENHANCED_BLOCK_REGISTRY[dbComponent.type_key]) {
        registryComponents.push({
          type_key: dbComponent.type_key,
          display_name: dbComponent.display_name,
          category: dbComponent.category,
          component_path: dbComponent.component_path,
          default_properties: dbComponent.default_properties,
          validation_schema: dbComponent.validation_schema,
          component: null as any,
          is_available: false,
        });
      }
    });

    setAvailableComponents(registryComponents);
  }, [componentTypes]);

  useEffect(() => {
    syncRegistryWithDatabase();
  }, [syncRegistryWithDatabase]);

  // ============================================================================
  // UTILITÁRIOS PARA FORMATAÇÃO
  // ============================================================================

  const formatTypeKeyToDisplayName = (typeKey: string): string => {
    return typeKey
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getCategoryFromTypeKey = (typeKey: string): string => {
    if (typeKey.includes("text") || typeKey.includes("heading")) return "content";
    if (typeKey.includes("button") || typeKey.includes("options")) return "interactive";
    if (typeKey.includes("image")) return "media";
    if (typeKey.includes("header") || typeKey.includes("quiz")) return "headers";
    if (typeKey.includes("form") || typeKey.includes("input")) return "forms";
    if (typeKey.includes("decorative") || typeKey.includes("divider")) return "visual";
    if (typeKey.includes("legal")) return "legal";
    return "other";
  };

  // ============================================================================
  // BRIDGE: CONVERTER ENTRE FORMATOS EDITOR E REUSABLE COMPONENTS
  // ============================================================================

  const convertEditorBlockToReusableComponent = (block: any) => {
    return {
      component_type_key: block.type,
      properties: block.properties || {},
      custom_styling: block.customStyling || {},
      order_index: block.order || 1,
    };
  };

  const convertReusableComponentToEditorBlock = (component: EditorComponentInstance) => {
    return {
      id: component.instance_key,
      type: component.component_type,
      properties: component.properties,
      customStyling: component.custom_styling,
      order: component.order_index,
      stageId: activeStageId || "stage-1",
    };
  };

  // ============================================================================
  // ACTIONS INTEGRADAS COM O EDITOR
  // ============================================================================

  const addReusableComponentToEditor = useCallback(
    async (
      componentTypeKey: string,
      stepNumber: number,
      customProperties?: Record<string, any>
    ) => {
      try {
        const componentType = availableComponents.find(c => c.type_key === componentTypeKey);
        if (!componentType?.is_available) {
          throw new Error(`Componente ${componentTypeKey} não está disponível no registry`);
        }

        // Adicionar ao database via useReusableComponents
        const dbComponent = await addComponent(componentTypeKey, stepNumber, {
          ...componentType.default_properties,
          ...customProperties,
        });

        // Converter para formato do editor e adicionar ao EditorContext
        const editorBlock = convertReusableComponentToEditorBlock({
          id: dbComponent.id,
          instance_key: dbComponent.instance_key,
          component_type: componentTypeKey,
          quiz_id: "editor-quiz",
          step_number: stepNumber,
          order_index: dbComponent.order_index,
          properties: dbComponent.properties,
          custom_styling: dbComponent.custom_styling,
          is_active: true,
          display_name: componentType.display_name,
          category: componentType.category,
        });

        addBlock(editorBlock);
        return dbComponent;
      } catch (error) {
        console.error("Erro ao adicionar componente reutilizável ao editor:", error);
        throw error;
      }
    },
    [availableComponents, addComponent, addBlock, activeStageId]
  );

  const updateReusableComponentInEditor = useCallback(
    async (instanceId: string, updates: Record<string, any>) => {
      try {
        // Atualizar no database
        const updatedComponent = await updateComponent(instanceId, {
          properties: updates.properties,
          custom_styling: updates.custom_styling,
        });

        // Atualizar no editor
        const editorBlock = convertReusableComponentToEditorBlock(updatedComponent);
        updateBlock(editorBlock.id, editorBlock);

        return updatedComponent;
      } catch (error) {
        console.error("Erro ao atualizar componente reutilizável:", error);
        throw error;
      }
    },
    [updateComponent, updateBlock]
  );

  const deleteReusableComponentFromEditor = useCallback(
    async (instanceId: string) => {
      try {
        // Deletar do database
        await deleteComponent(instanceId);

        // Deletar do editor
        deleteBlock(instanceId);
      } catch (error) {
        console.error("Erro ao deletar componente reutilizável:", error);
        throw error;
      }
    },
    [deleteComponent, deleteBlock]
  );

  // ============================================================================
  // TEMPLATES INTELIGENTES PARA O EDITOR
  // ============================================================================

  const applyComponentTemplate = useCallback(
    async (templateKey: string, stepNumber: number) => {
      const templates: Record<string, any[]> = {
        "gisele-step-header": [
          { type: "gisele-header", properties: { progressValue: (stepNumber / 21) * 100 } },
          { type: "style-question", properties: { content: `Questão ${stepNumber} de 21` } },
        ],
        "gisele-question-step": [
          { type: "gisele-header", properties: { progressValue: (stepNumber / 21) * 100 } },
          { type: "style-question", properties: { content: "SUA PERGUNTA AQUI" } },
          { type: "style-options-grid", properties: { options: [] } },
          { type: "gisele-button", properties: { text: "Continuar" } },
        ],
        "gisele-input-step": [
          { type: "gisele-header", properties: { progressValue: (stepNumber / 21) * 100 } },
          { type: "style-question", properties: { content: "COMO VOCÊ GOSTARIA DE SER CHAMADA?" } },
          { type: "form-input", properties: { placeholder: "Digite seu nome aqui..." } },
          { type: "gisele-button", properties: { text: "Continuar" } },
        ],
      };

      const template = templates[templateKey];
      if (!template) {
        throw new Error(`Template ${templateKey} não encontrado`);
      }

      // Aplicar cada componente do template
      for (const [index, componentConfig] of template.entries()) {
        await addReusableComponentToEditor(componentConfig.type, stepNumber, {
          ...componentConfig.properties,
          order_index: index + 1,
        });
      }
    },
    [addReusableComponentToEditor]
  );

  // ============================================================================
  // GERENCIAMENTO DE CATEGORIAS
  // ============================================================================

  const getComponentsByCategory = useCallback(
    (category: string) => {
      return availableComponents.filter(c => c.category === category && c.is_available);
    },
    [availableComponents]
  );

  const getAvailableCategories = useCallback(() => {
    const categories = new Set(availableComponents.map(c => c.category));
    return Array.from(categories);
  }, [availableComponents]);

  // ============================================================================
  // RETORNO DA API
  // ============================================================================

  return {
    // Estados
    availableComponents: availableComponents.filter(c => c.is_available),
    unavailableComponents: availableComponents.filter(c => !c.is_available),
    stepComponents,
    loading,
    error,

    // Actions integradas com editor
    addReusableComponentToEditor,
    updateReusableComponentInEditor,
    deleteReusableComponentFromEditor,

    // Templates
    applyComponentTemplate,

    // Utilitários
    getComponentsByCategory,
    getAvailableCategories,
    syncRegistryWithDatabase,

    // Bridge functions
    convertEditorBlockToReusableComponent,
    convertReusableComponentToEditorBlock,

    // Raw hooks (para casos avançados)
    rawReusableHook: {
      componentTypes,
      addComponent,
      updateComponent,
      deleteComponent,
      reorderComponents,
      loadStepComponents,
      loadAllQuizComponents,
    },
  };
};

export default useEditorReusableComponents;
