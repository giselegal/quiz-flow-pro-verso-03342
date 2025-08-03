import React, { useEffect } from 'react';
import { useFunnels } from '../context/FunnelsContext';
import { useEditor } from '../context/EditorContext';
import { generateBlockDefinitions } from '../config/enhancedBlockRegistry';
// ...existing imports...

const EditorFixedPage: React.FC = () => {
  const { 
    steps, 
    loading: funnelsLoading, 
    error: funnelsError 
  } = useFunnels();
  
  const {
    stageBlocks,
    activeStageId,
    selectedBlockId,
    isPreviewing,
    setIsPreviewing,
    actions: {
      setActiveStage,
      addBlock,
      getBlocksForStage,
      setSelectedBlockId
    }
  } = useEditor();

  // Estado local simplificado - apenas UI
  const [viewportSize, setViewportSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  // Inicialização: garantir que etapa ativa é válida
  useEffect(() => {
    if (steps.length > 0 && !steps.find(step => step.id === activeStageId)) {
      console.log('🔧 EditorFixed: Corrigindo etapa ativa inválida');
      setActiveStage(steps[0].id);
    }
  }, [steps, activeStageId, setActiveStage]);

  // Handler simplificado para mudança de etapa
  const handleStageSelect = (stageId: string) => {
    console.log('🎯 EditorFixed: Selecionando etapa:', stageId);
    setActiveStage(stageId); // Context já faz todas as validações
  };

  // Handler para adicionar componente
  const handleAddComponent = (componentType: string) => {
    console.log('➕ EditorFixed: Adicionando componente:', componentType);
    const blockId = addBlock(componentType);
    if (blockId) {
      setSelectedBlockId(blockId);
    }
  };

  // Handler para seleção de bloco
  const handleBlockSelect = (blockId: string | null) => {
    console.log('🎯 EditorFixed: Selecionando bloco:', blockId);
    setSelectedBlockId(blockId);
  };

  // Obter blocos da etapa ativa
  const currentBlocks = getBlocksForStage(activeStageId);

  // Estados de loading e erro
  if (funnelsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando Editor Fixed...</p>
        </div>
      </div>
    );
  }

  if (funnelsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-bold mb-2">Erro no Editor</h2>
          <p>{funnelsError}</p>
        </div>
      </div>
    );
  }

  // Dados para componentes
  const allBlockDefinitions = generateBlockDefinitions();
  const activeStep = steps.find(step => step.id === activeStageId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Header */}
      <BrandHeader />
      
      {/* Editor Toolbar */}
      <EditorToolbar 
        isPreviewing={isPreviewing}
        onPreviewToggle={setIsPreviewing}
        viewportSize={viewportSize}
        onViewportChange={setViewportSize}
      />
      
      {/* Status Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Editor Ativo
          </span>
          <span>• {allBlockDefinitions.length} componentes</span>
          <span>• Etapa: {activeStageId}</span>
          <span>• Blocos: {currentBlocks.length}</span>
          <span>• Viewport: {viewportSize.toUpperCase()}</span>
        </div>
      </div>

      {/* Layout em 4 Colunas */}
      <FourColumnLayout
        stagesPanel={
          <FunnelStagesPanel
            steps={steps}
            activeStageId={activeStageId}
            onStageSelect={handleStageSelect}
            stageBlocks={stageBlocks}
          />
        }
        componentsPanel={
          <EnhancedComponentsSidebar
            onAddComponent={handleAddComponent}
            blockDefinitions={allBlockDefinitions}
          />
        }
        canvas={
          <div className="p-6">
            <div className={`
              mx-auto bg-white shadow-lg rounded-lg overflow-hidden
              ${viewportSize === 'sm' ? 'max-w-sm' : ''}
              ${viewportSize === 'md' ? 'max-w-md' : ''}
              ${viewportSize === 'lg' ? 'max-w-4xl' : ''}
              ${viewportSize === 'xl' ? 'max-w-full' : ''}
            `}>
              {/* Canvas Header */}
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-700">
                    {activeStep?.name || `Etapa ${activeStageId}`}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {currentBlocks.length} blocos
                  </span>
                </div>
              </div>
              
              {/* Canvas Content */}
              <div className="min-h-96 p-4">
                {currentBlocks.length === 0 ? (
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">📦</div>
                      <p>Arraste componentes aqui para começar</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentBlocks.map((block) => (
                      <div
                        key={block.id}
                        onClick={() => handleBlockSelect(block.id)}
                        className={`
                          cursor-pointer border-2 rounded-lg p-2 transition-all
                          ${selectedBlockId === block.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-transparent hover:border-gray-300'
                          }
                        `}
                      >
                        <UniversalBlockRenderer
                          block={block}
                          isSelected={selectedBlockId === block.id}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        }
        propertiesPanel={
          <DynamicPropertiesPanel
            selectedBlockId={selectedBlockId}
            blocks={currentBlocks}
            allBlockDefinitions={allBlockDefinitions}
          />
        }
      />
    </div>
  );
};

export default EditorFixedPage;
