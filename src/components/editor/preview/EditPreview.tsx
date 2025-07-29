
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Smartphone, Tablet, Monitor } from 'lucide-react';
import { useEditor } from '@/hooks/useEditor';
import { FunnelStepBlock } from '@/components/funnel-blocks/editor/FunnelStepBlock';
import { useFunnelConfig } from '@/components/funnel-blocks/editor/FunnelConfigProvider';
import { cn } from '@/lib/utils';

interface EditPreviewProps {
  isPreviewing: boolean;
  onPreviewToggle: () => void;
  onSelectComponent: (id: string | null) => void;
  selectedComponentId: string | null;
  funnelMode?: boolean;
  currentStep?: number;
}

export const EditPreview: React.FC<EditPreviewProps> = ({
  isPreviewing,
  onPreviewToggle,
  onSelectComponent,
  selectedComponentId,
  funnelMode = false,
  currentStep = 1
}) => {
  const { config, reorderBlocks } = useEditor();
  const { currentStepIndex, nextStep, previousStep } = useFunnelConfig();
  const [deviceMode, setDeviceMode] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const handleDragEnd = (result: any) => {
    if (!result.destination || isPreviewing) return;
    
    reorderBlocks(result.source.index, result.destination.index);
  };

  const renderBlock = (block: any, index: number) => {
    // Check if it's a funnel step block
    if (block.type && block.type.startsWith('funnel-step-')) {
      const stepType = block.type.replace('funnel-step-', '');
      
      return (
        <div
          key={block.id}
          className={cn(
            "relative transition-all duration-200 rounded-lg mb-4",
            selectedComponentId === block.id && !isPreviewing && "ring-2 ring-blue-500",
            !isPreviewing && "hover:shadow-sm cursor-pointer"
          )}
          onClick={() => !isPreviewing && onSelectComponent(block.id)}
        >
          <FunnelStepBlock
            block={{
              id: block.id,
              type: 'funnel-step',
              properties: {
                stepType: stepType as any,
                stepNumber: block.stepNumber || currentStep,
                totalSteps: 21,
                ...block.content
              }
            }}
            isSelected={selectedComponentId === block.id}
            onClick={() => !isPreviewing && onSelectComponent(block.id)}
          />
        </div>
      );
    }
    
    // Fallback for other block types
    return (
      <div
        key={block.id}
        className={cn(
          "relative transition-all duration-200 rounded-lg mb-4 p-4 border border-gray-200 bg-white",
          selectedComponentId === block.id && !isPreviewing && "ring-2 ring-blue-500",
          !isPreviewing && "hover:shadow-sm cursor-pointer"
        )}
        onClick={() => !isPreviewing && onSelectComponent(block.id)}
      >
        <h3 className="font-medium text-gray-800 mb-2">
          {block.content?.title || block.content?.text || `Bloco ${block.type}`}
        </h3>
        <p className="text-sm text-gray-600">
          Tipo: {block.type}
        </p>
      </div>
    );
  };

  const getDeviceStyles = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'max-w-full';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviewToggle}
          >
            {isPreviewing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreviewing ? 'Modo Edição' : 'Visualizar'}
          </Button>
          
          {funnelMode && (
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={previousStep}
                disabled={currentStepIndex === 0}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                Etapa {currentStep} de 21
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextStep}
                disabled={currentStepIndex === 20}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={deviceMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('mobile')}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
          <Button
            variant={deviceMode === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('tablet')}
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={deviceMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('desktop')}
          >
            <Monitor className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-gray-50 p-4">
        <div className={cn(getDeviceStyles(), "bg-white rounded-lg shadow-sm min-h-full")}>
          {funnelMode ? (
            // Modo funil - mostra apenas a etapa atual
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-[#432818]">
                  Etapa {currentStep} de 21
                </h2>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div 
                    className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 21) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Renderizar componentes da etapa atual */}
              {config.blocks
                .filter(block => block.stepNumber === currentStep)
                .map((block, index) => renderBlock(block, index))}
              
              {/* Mostrar mensagem se não há componentes para esta etapa */}
              {config.blocks.filter(block => block.stepNumber === currentStep).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>Nenhum componente adicionado para esta etapa.</p>
                  <p className="text-sm mt-2">Use o painel lateral para adicionar componentes.</p>
                </div>
              )}
            </div>
          ) : (
            // Modo editor - mostra todos os blocos
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="blocks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4 p-6 min-h-screen"
                  >
                    {config.blocks.map((block, index) => (
                      <Draggable
                        key={block.id}
                        draggableId={block.id}
                        index={index}
                        isDragDisabled={isPreviewing}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {renderBlock(block, index)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {config.blocks.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <div className="mb-4 text-6xl">🎨</div>
                        <h3 className="mb-2 text-lg font-medium">Canvas Vazio</h3>
                        <p className="text-center">
                          Adicione componentes do painel lateral para começar a construir seu funil
                        </p>
                        <div className="mt-4 text-sm">
                          💡 Dica: Comece com uma etapa de introdução para dar boas-vindas aos seus visitantes
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );
};
