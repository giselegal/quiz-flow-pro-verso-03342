import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import { StyleResult } from '@/types/quiz';
import ComponentsSidebar from '../components/ComponentsSidebar';
import { PreviewPanel } from './PreviewPanel';
import { PropertiesPanel } from './PropertiesPanel';

interface ResultPageBuilderProps {
  primaryStyle: StyleResult;
}

export const ResultPageBuilder: React.FC<ResultPageBuilderProps> = ({ primaryStyle }) => {
  const editorContext = useEditor({ optional: true });
  if (!editorContext) return null;
  const { actions, state } = editorContext;
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
              const newBlock = {
                id: `result-${Date.now()}`,
                type: type as any,
                content: {},
                properties: {},
                order: 0
              };
              await actions.addBlock(currentStepKey, newBlock);
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
                actions.updateBlock(currentStepKey, selectedComponent, content);
              }
            }}
            onDelete={() => {
              if (selectedComponent) {
                actions.removeBlock(currentStepKey, selectedComponent);
                setSelectedComponent(null);
              }
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
