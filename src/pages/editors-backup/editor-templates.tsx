// import React from 'react'; - removido pois não é usado no modo atual
import { EditorProvider, useEditor } from '@/context/EditorContext';
import { useTemplateLoader } from '@/hooks/useTemplateLoader';

const EditorTemplatesPage = () => {
  const {
    // loadTemplate, - removido pois não é usado
    loadTemplateBlocks,
    // getTemplateMetadata, - removido pois não é usado
    isLoading,
    error,
    templatesMetadata,
    // cachedTemplates - removido pois não é usado
  } = useTemplateLoader();

  const { stages, activeStageId, stageActions } = useEditor();

  const handleStageClick = async (stageId: string) => {
    // Usar o sistema templates.ts para carregar
    await loadTemplateBlocks(stageId); // Carrega os blocos
    stageActions.setActiveStage(stageId);
  };

  return (
    <div className="h-screen flex">
      {/* Painel de Etapas */}
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="font-bold mb-4">21 Etapas (templates.ts)</h2>
        {stages.map(stage => (
          <div
            key={stage.id}
            onClick={() => handleStageClick(stage.id)}
            className={`p-2 mb-2 cursor-pointer rounded ${
              activeStageId === stage.id ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {stage.name}
            {templatesMetadata[stage.id] && (
              <div className="text-xs opacity-75">
                {templatesMetadata[stage.id].blocksCount} blocos
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Canvas Principal */}
      <div className="flex-1 p-4">
        {isLoading && <div>Carregando template...</div>}
        {error && <div className="text-red-500">Erro: {error.message}</div>}

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Editor usando templates.ts - {activeStageId}</h3>

          {/* Aqui renderizaria os blocos carregados */}
          <div className="space-y-4">{/* Blocos seriam renderizados aqui */}</div>
        </div>
      </div>
    </div>
  );
};

const EditorTemplatesWithProvider = () => (
  <EditorProvider>
    <EditorTemplatesPage />
  </EditorProvider>
);

export default EditorTemplatesWithProvider;
