
import React, { useState, useMemo, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { StepsPanel } from './sidebar/StepsPanel';
import { ComponentsPanel } from './ComponentsPanel';
import { AdvancedPropertyPanel } from './AdvancedPropertyPanel';
import { EditorCanvas } from './canvas/EditorCanvas';
import { useSchemaEditor } from '@/hooks/useSchemaEditor';
import { EditorToolbar } from './toolbar/EditorToolbar';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

export const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId,
  className = ''
}) => {
  const {
    steps,
    currentStepIndex,
    selectedBlockId,
    isLoading,
    error,
    actions
  } = useSchemaEditor(funnelId);

  const [viewportSize, setViewportSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Get current step
  const currentStep = useMemo(() => {
    return steps[currentStepIndex] || null;
  }, [steps, currentStepIndex]);

  // Get current step blocks
  const currentBlocks = useMemo(() => {
    return currentStep?.blocks || [];
  }, [currentStep]);

  // Get selected block
  const selectedBlock = useMemo(() => {
    return currentBlocks.find(block => block.id === selectedBlockId) || null;
  }, [currentBlocks, selectedBlockId]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89B7A] mx-auto mb-4"></div>
          <p className="text-[#8F7A6A]">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar editor:</p>
          <p className="text-[#8F7A6A]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col overflow-hidden bg-gray-50 ${className}`}>
      <EditorToolbar 
        isPreviewing={isPreviewing}
        viewportSize={viewportSize}
        onViewportSizeChange={setViewportSize}
        onTogglePreview={() => setIsPreviewing(!isPreviewing)}
        onSave={actions.saveFunnel}
      />

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Steps */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <StepsPanel
            steps={steps}
            currentStepIndex={currentStepIndex}
            onStepSelect={actions.setCurrentStep}
            onPopulateStep={actions.populateStep}
            onAddStep={actions.addStep}
            onDeleteStep={actions.deleteStep}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Center Panel - Canvas */}
        <ResizablePanel defaultSize={45}>
          <EditorCanvas
            step={currentStep}
            blocks={currentBlocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={actions.selectBlock}
            onUpdateBlock={actions.updateBlock}
            onDeleteBlock={actions.deleteBlock}
            onReorderBlocks={actions.reorderBlocks}
            isPreviewing={isPreviewing}
            viewportSize={viewportSize}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Right Panel - Components/Properties */}
        <ResizablePanel defaultSize={35} minSize={25} maxSize={45}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60}>
              <ComponentsPanel
                onAddBlock={(type, position) => {
                  const newBlockId = actions.addBlock(type, position);
                  actions.selectBlock(newBlockId);
                }}
                currentStepType={currentStep?.type}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={40}>
              <AdvancedPropertyPanel
                selectedBlock={selectedBlock}
                onUpdateBlock={actions.updateBlock}
                onDeleteBlock={(blockId) => {
                  actions.deleteBlock(blockId);
                  actions.selectBlock(null);
                }}
                onClose={() => actions.selectBlock(null)}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
