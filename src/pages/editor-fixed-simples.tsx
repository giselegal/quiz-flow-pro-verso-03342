import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEditor } from '@/context/EditorContext.simple';
import FunnelStagesPanel from '@/components/editor/funnel/FunnelStagesPanel.simple';
import { BlockType } from '@/types/BlockType';

interface Block {
  id: string;
  type: string;
  stageId: string;
  order: number;
  properties?: any;
}

interface Stage {
  id: string;
  name: string;
  description: string;
}

interface EditorContextType {
  stages: Stage[];
  blocks: Block[];
  selectedBlock: Block | null;
  stageActions: {
    addStage: (stage: Stage) => void;
    updateStage: (id: string, updates: Partial<Stage>) => void;
    deleteStage: (id: string) => void;
    setActiveStage: (id: string) => void;
    activeStageId: string | null;
  };
  blockActions: {
    addBlock: (block: Block) => void;
    updateBlock: (id: string, updates: Partial<Block>) => void;
    deleteBlock: (id: string) => void;
    selectBlock: (id: string) => void;
  };
}

const EditorFixedSimplePage: React.FC = () => {
  const { stages, blocks, selectedBlock, stageActions, blockActions } = useEditor();

  const currentStage = stages.find(stage => stage.id === stageActions.activeStageId);
  const currentBlocks = blocks.filter((block: any) => block.stageId === stageActions.activeStageId);

  const handleAddBlock = (type: BlockType) => {
    if (!stageActions.activeStageId) return;

    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      stageId: stageActions.activeStageId,
      order: currentBlocks.length,
      properties: getDefaultProperties(type),
    };

    blockActions.addBlock(newBlock);
  };

  const getDefaultProperties = (type: BlockType) => {
    switch (type) {
      case 'text':
        return { content: 'Digite seu texto aqui...', fontSize: 16, color: '#000000' };
      case 'image':
        return { src: '', alt: 'Imagem', width: 400, height: 300 };
      case 'button':
        return { text: 'Clique aqui', variant: 'primary' };
      default:
        return {};
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Panel - Stages */}
      <div className="w-80 bg-white border-r border-gray-200">
        <FunnelStagesPanel />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {currentStage?.name || 'Editor de Quiz'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {currentStage?.description || 'Selecione uma etapa para começar'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Preview
              </Button>
              <Button size="sm">
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex">
          {/* Component Library */}
          <div className="w-64 bg-white border-r border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-800 mb-4">Componentes</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleAddBlock('text' as BlockType)}
              >
                📝 Texto
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleAddBlock('image' as BlockType)}
              >
                🖼️ Imagem
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleAddBlock('button' as BlockType)}
              >
                🔘 Botão
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 p-8 overflow-auto">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {currentStage?.name || 'Selecione uma etapa'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentBlocks.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <p>Nenhum componente adicionado ainda.</p>
                        <p className="text-sm mt-1">
                          Use a biblioteca de componentes para adicionar elementos.
                        </p>
                      </div>
                    ) : (
                      currentBlocks.map((block: any) => (
                        <div
                          key={block.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedBlock?.id === block.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => blockActions.selectBlock(block.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              {block.type}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                blockActions.deleteBlock(block.id);
                              }}
                            >
                              ❌
                            </Button>
                          </div>
                          <div className="preview-content">
                            {renderBlockPreview(block)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-80 bg-white border-l border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-800 mb-4">Propriedades</h3>
            {selectedBlock ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Tipo</label>
                  <p className="font-medium">{selectedBlock.type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">ID</label>
                  <p className="text-xs text-gray-500">{selectedBlock.id}</p>
                </div>
                {/* Add more property editors based on block type */}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Selecione um componente para editar suas propriedades.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const renderBlockPreview = (block: any) => {
  switch (block.type) {
    case 'text':
      return (
        <p style={{ fontSize: block.properties?.fontSize, color: block.properties?.color }}>
          {block.properties?.content || 'Texto exemplo'}
        </p>
      );
    case 'image':
      return (
        <div className="bg-gray-100 rounded p-4 text-center">
          {block.properties?.src ? (
            <img
              src={block.properties.src}
              alt={block.properties?.alt}
              className="max-w-full h-auto"
            />
          ) : (
            <span className="text-gray-500">🖼️ Imagem</span>
          )}
        </div>
      );
    case 'button':
      return (
        <Button variant={block.properties?.variant || 'default'}>
          {block.properties?.text || 'Botão'}
        </Button>
      );
    default:
      return <div className="text-gray-500">Componente desconhecido</div>;
  }
};

export default EditorFixedSimplePage;
