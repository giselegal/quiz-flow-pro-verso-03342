import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEditorContext } from '@/core';
import { StyleResult } from '@/types/quiz';
import ComponentsSidebar from '../components/ComponentsSidebar';
import { PreviewPanel } from './PreviewPanel';
import { PropertiesPanel } from './PropertiesPanel';

interface ResultPageBuilderProps {
  primaryStyle: StyleResult;
}

export const ResultPageBuilder: React.FC<ResultPageBuilderProps> = ({ primaryStyle }) => {
  const { editor } = useEditorContext();
  const { state } = editor;
  const actions = {
    addBlock: (step: number, block: any) => editor.addBlock(step, block),
    updateBlock: (step: number, blockId: string, updates: any) => editor.updateBlock(step, blockId, updates),
    removeBlock: (step: number, blockId: string) => editor.removeBlock(step, blockId),
  };
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);

  const currentStepKey = `step-${state.currentStep}`;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="border-b bg-white p-4">
        <h1 className="text-2xl font-playfair text-[#432818]">Editor da Página de Resultados</h1>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Sidebar - Components */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <ComponentsSidebar
            onComponentSelect={async (type: string) => {
              // addBlock takes (step, block, index) - using step 21 for result page
              const newBlock = {
                id: `block-${Date.now()}`,
                type: type as any,
                content: {},
                order: 999,
              };
              await actions.addBlock(21, newBlock as any);
              setSelectedComponent(newBlock.id);
            }}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Central Preview */}
        <ResizablePanel defaultSize={55}>
          <PreviewPanel
            primaryStyle={primaryStyle}
            onSelectComponent={setSelectedComponent}
            selectedComponentId={selectedComponent}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Properties Panel */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <PropertiesPanel
            selectedComponentId={selectedComponent}
            onClose={() => setSelectedComponent(null)}
            onUpdate={content => {
              if (selectedComponent) {
                // updateBlock takes (step, blockId, updates)
                actions.updateBlock(21, selectedComponent, { content });
              }
            }}
            onDelete={() => {
              if (selectedComponent) {
                // removeBlock takes (step, blockId)
                actions.removeBlock(21, selectedComponent);
                setSelectedComponent(null);
              }
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
