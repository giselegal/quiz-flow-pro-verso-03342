
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useSchemaEditor } from '@/hooks/useSchemaEditor';
import { StepsPanel } from './sidebar/StepsPanel';
import { EditorCanvas } from './canvas/EditorCanvas';
import { AdvancedPropertyPanel } from './AdvancedPropertyPanel';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId,
  className = ''
}) => {
  const {
    steps,
    currentStepIndex,
    selectedBlockId,
    actions
  } = useSchemaEditor(funnelId);

  const currentStep = steps[currentStepIndex];
  const currentBlocks = currentStep?.blocks || [];

  return (
    <div className={`h-full w-full ${className}`}>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Sidebar com steps */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <StepsPanel
            steps={steps}
            currentStepIndex={currentStepIndex}
            onSelectStep={actions.setCurrentStep}
            onAddStep={actions.addStep}
            onDeleteStep={actions.deleteStep}
            onPopulateStep={actions.populateStep}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Canvas principal */}
        <ResizablePanel defaultSize={55}>
          <EditorCanvas
            step={currentStep}
            blocks={currentBlocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={actions.selectBlock}
            onUpdateBlock={actions.updateBlock}
            onDeleteBlock={actions.deleteBlock}
            onReorderBlocks={(stepId, startIndex, endIndex) => actions.reorderBlocks(startIndex, endIndex)}
            isPreviewing={false}
            viewportSize="lg"
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Panel de propriedades */}
        <ResizablePanel defaultSize={25}>
          <AdvancedPropertyPanel
            selectedBlock={currentBlocks.find(b => b.id === selectedBlockId) || null}
            onUpdateBlock={actions.updateBlock}
            onDeleteBlock={actions.deleteBlock}
            onClose={() => actions.selectBlock(null)}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
