import React, { useEffect } from "react";
import { useEditor } from "@/context/EditorContext";
import QuizOptionsGridBlock from "@/components/blocks/quiz/QuizOptionsGridBlock";
import { getStep02Template } from "@/components/steps/Step02Template";

const DebugStep02: React.FC = () => {
  const { 
    stageActions: { setActiveStage },
    blockActions: { getBlocksForStage },
    activeStageId,
  } = useEditor();

  useEffect(() => {
    // Forçar carregar etapa 2
    setActiveStage("step-2");
  }, [setActiveStage]);

  const step02Blocks = getBlocksForStage("step-2");
  const optionsGridBlock = step02Blocks.find(block => block.type === "options-grid");
  const step02Template = getStep02Template();
  const templateOptionsGrid = step02Template.find(block => block.type === "options-grid");

  console.log("🔍 DebugStep02 - Dados:", {
    activeStageId,
    step02BlocksCount: step02Blocks.length,
    optionsGridBlock: optionsGridBlock,
    templateOptionsGrid: templateOptionsGrid,
    templateOptionsGridProperties: templateOptionsGrid?.properties,
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Step02 - Options Grid</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Dados do Editor Context</h2>
          <div className="bg-gray-100 p-4 rounded text-sm">
            <p><strong>Etapa Ativa:</strong> {activeStageId}</p>
            <p><strong>Blocos na Etapa 2:</strong> {step02Blocks.length}</p>
            <p><strong>Options Grid Block:</strong> {optionsGridBlock ? "✅ Encontrado" : "❌ Não encontrado"}</p>
          </div>

          {optionsGridBlock && (
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Options Grid Block Properties</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(optionsGridBlock.properties, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Dados do Template</h2>
          <div className="bg-gray-100 p-4 rounded text-sm">
            <p><strong>Template Blocos:</strong> {step02Template.length}</p>
            <p><strong>Template Options Grid:</strong> {templateOptionsGrid ? "✅ Encontrado" : "❌ Não encontrado"}</p>
          </div>

          {templateOptionsGrid && (
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Template Options Grid Properties</h3>
              <pre className="text-xs overflow-auto max-h-64">
                {JSON.stringify(templateOptionsGrid.properties, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Renderização Direta do QuizOptionsGridBlock */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Teste de Renderização Direta</h2>
        <div className="border border-gray-300 p-6 rounded-lg">
          {optionsGridBlock ? (
            <QuizOptionsGridBlock
              id={optionsGridBlock.id}
              properties={optionsGridBlock.properties}
              onPropertyChange={(key, value) => {
                console.log("Property changed:", key, value);
              }}
            />
          ) : templateOptionsGrid ? (
            <QuizOptionsGridBlock
              id="test-options-grid"
              properties={templateOptionsGrid.properties}
              onPropertyChange={(key, value) => {
                console.log("Property changed:", key, value);
              }}
            />
          ) : (
            <div className="text-red-500">❌ Nenhum Options Grid encontrado</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugStep02;
