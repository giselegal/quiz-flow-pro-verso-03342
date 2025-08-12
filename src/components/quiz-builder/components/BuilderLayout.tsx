// @ts-nocheck
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { QuizComponentData, QuizStage, QuizComponentType } from '@/types/quizBuilder';
import { ComponentsSidebar } from '../ComponentsSidebar';
import PreviewPanel from '../PreviewPanel';
import { PropertyPanel } from './PropertyPanel';

interface BuilderLayoutProps {
  components: QuizComponentData[];
  stages: QuizStage[];
  activeStageId: string;
  onComponentAdd: (type: QuizComponentType) => void;
  onComponentUpdate: (id: string, updates: Partial<QuizComponentData>) => void;
  onComponentDelete: (id: string) => void;
  onComponentSelect: (id: string | null) => void;
}

export const BuilderLayout: React.FC<BuilderLayoutProps> = ({
  components,
  stages,
  activeStageId,
  onComponentAdd,
  onComponentUpdate,
  onComponentDelete,
  onComponentSelect,
}) => {
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Filter components for the active stage
  const stageComponents = components.filter(c => c.stageId === activeStageId);

  // Find the selected component
  const selectedComponent = selectedComponentId
    ? components.find(c => c.id === selectedComponentId) || null
    : null;

  const handleComponentSelect = (id: string | null) => {
    setSelectedComponentId(id);
    onComponentSelect(id);
  };

  const handleComponentAdd = (type: QuizComponentType) => {
    onComponentAdd(type);
  };

  return (
    <div className="h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ComponentsSidebar onComponentSelect={handleComponentAdd} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={55}>
          <PreviewPanel
            components={stageComponents}
            selectedComponentId={selectedComponentId || undefined}
            onComponentSelect={handleComponentSelect}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={25}>
          <PropertyPanel
            selectedComponentId={selectedComponentId}
            components={components}
            onUpdate={(id, data) => onComponentUpdate(id, { data })}
            onDelete={onComponentDelete}
            onClose={() => handleComponentSelect(null)}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default BuilderLayout;
