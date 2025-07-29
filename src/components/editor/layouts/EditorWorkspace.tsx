
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, Eye, Save } from 'lucide-react';
import { ComponentsSidebar } from '../sidebar/ComponentsSidebar';
import { EditPreview } from '../preview/EditPreview';
import PropertiesPanel from '../properties/PropertiesPanel';
import { FunnelConfigProvider } from '@/components/funnel-blocks/editor/FunnelConfigProvider';
import { cn } from '@/lib/utils';
import { useEditor } from '@/hooks/useEditor';

interface EditorWorkspaceProps {
  className?: string;
}

export function EditorWorkspace({ className }: EditorWorkspaceProps) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<'editor' | 'funnel'>('editor');
  const { config, addBlock, updateBlock, deleteBlock } = useEditor();

  const totalSteps = 21;

  const handleStepChange = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      setSelectedComponentId(null);
    }
  };

  const handleSave = () => {
    // Implementar lógica de salvamento
    console.log('Salvando funil...', config);
  };

  const handlePreview = () => {
    setIsPreviewing(!isPreviewing);
  };

  return (
    <FunnelConfigProvider>
      <div className={cn("h-screen flex flex-col bg-[#FAF9F7]", className)}>
        {/* Toolbar do funil */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-[#432818]">
              Editor de Funil - 21 Etapas
            </h1>
            <Badge variant="outline">
              Etapa {currentStep} de {totalSteps}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'editor' ? 'funnel' : 'editor')}
            >
              {viewMode === 'editor' ? <Play className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {viewMode === 'editor' ? 'Modo Funil' : 'Modo Editor'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
            >
              <Eye className="w-4 h-4" />
              {isPreviewing ? 'Editar' : 'Visualizar'}
            </Button>
            
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-[#B89B7A] hover:bg-[#A08A73] text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Navegação entre etapas */}
        {viewMode === 'funnel' && (
          <div className="flex items-center justify-between p-3 bg-white border-b">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStepChange(currentStep - 1)}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Etapa:</span>
              <select
                value={currentStep}
                onChange={(e) => handleStepChange(parseInt(e.target.value))}
                className="px-2 py-1 text-sm border rounded"
              >
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
                  <option key={step} value={step}>
                    {step}. {getStepName(step)}
                  </option>
                ))}
              </select>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStepChange(currentStep + 1)}
              disabled={currentStep === totalSteps}
            >
              Próxima
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Components Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <ComponentsSidebar 
              onComponentSelect={(type) => {
                const id = addBlock(type);
                setSelectedComponentId(id);
              }} 
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Preview Area */}
          <ResizablePanel defaultSize={55}>
            <EditPreview 
              isPreviewing={isPreviewing}
              onPreviewToggle={handlePreview}
              onSelectComponent={setSelectedComponentId}
              selectedComponentId={selectedComponentId}
              funnelMode={viewMode === 'funnel'}
              currentStep={currentStep}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Properties Panel */}
          <ResizablePanel defaultSize={25}>
            <PropertiesPanel
              selectedComponentId={selectedComponentId}
              onClose={() => setSelectedComponentId(null)}
              blocks={config.blocks}
              onUpdate={(content) => {
                if (selectedComponentId) {
                  updateBlock(selectedComponentId, content);
                }
              }}
              onDelete={() => {
                if (selectedComponentId) {
                  deleteBlock(selectedComponentId);
                  setSelectedComponentId(null);
                }
              }}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </FunnelConfigProvider>
  );
}

// Helper para obter o nome da etapa
function getStepName(step: number): string {
  const stepNames = {
    1: 'Introdução',
    2: 'Coleta de Nome',
    3: 'Intro Quiz',
    4: 'Pergunta 1',
    5: 'Pergunta 2',
    6: 'Pergunta 3',
    7: 'Pergunta 4',
    8: 'Pergunta 5',
    9: 'Pergunta 6',
    10: 'Pergunta 7',
    11: 'Pergunta 8',
    12: 'Pergunta 9',
    13: 'Pergunta 10',
    14: 'Pergunta 11',
    15: 'Transição Quiz',
    16: 'Processamento',
    17: 'Intro Resultado',
    18: 'Detalhes Resultado',
    19: 'Guia Resultado',
    20: 'Transição Oferta',
    21: 'Página Oferta'
  };
  
  return stepNames[step as keyof typeof stepNames] || `Etapa ${step}`;
}
