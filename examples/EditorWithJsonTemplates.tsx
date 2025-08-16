// Exemplo de como modificar o EditorContext para usar templates JSON

import React, { ReactNode, useState } from "react";
// import { useJsonTemplate, useMultiJsonTemplate } from "@/hooks/useJsonTemplate";
// import { EditorContext } from "@/context/EditorContext";

// ANTES - no EditorContext atual:
/*
const { blocks } = useEffect(() => {
  const template = getStepTemplate(stepNumber);
  setBlocks(template);
}, [stepNumber]);
*/

// DEPOIS - usando templates JSON:

export const EditorProviderWithJsonTemplates: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeStepId, setActiveStepId] = useState("step-1");

  // Opção 1: Carregar template individual
  const {
    blocks: currentBlocks,
    loading,
    error,
    loadStep,
  } = useJsonTemplate(activeStepId, {
    preload: true,
    onLoad: (stepId, blocks) => {
      console.log(`✅ Template ${stepId} carregado com ${blocks.length} blocos`);
    },
    onError: (stepId, error) => {
      console.error(`❌ Erro no template ${stepId}:`, error);
    },
  });

  // Opção 2: Pre-carregar múltiplos templates
  const {
    templatesData,
    loading: multiLoading,
    getBlocks,
  } = useMultiJsonTemplate(["step-1", "step-2", "step-3", "step-4", "step-5"]);

  const handleStageChange = async (newStepId: string) => {
    setActiveStepId(newStepId);

    // Carrega template se não estiver em cache
    if (multiLoading) {
      await loadStep(newStepId);
    }
  };

  const contextValue = {
    // Estado atual
    activeStepId,
    currentBlocks: getBlocks(activeStepId), // Usa template JSON
    loading: loading || multiLoading,
    error,

    // Actions
    setActiveStageId: handleStageChange,

    // Template actions
    reloadCurrentTemplate: () => loadStep(activeStepId),

    // ... resto do context
  };

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};

// Exemplo de uso em um componente:
export const ExampleUsage = () => {
  const { blocks, loading, loadStep } = useJsonTemplate();

  const handleLoadStep2 = () => {
    loadStep("step-2");
  };

  if (loading) {
    return <div>Carregando template...</div>;
  }

  return (
    <div>
      <button onClick={handleLoadStep2}>Carregar Etapa 2</button>

      <div className="blocks-container">
        {blocks.map(block => (
          <div key={block.id}>
            Bloco: {block.type} - {JSON.stringify(block.properties)}
          </div>
        ))}
      </div>
    </div>
  );
};
