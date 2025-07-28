
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ComponentsSidebar } from '@/components/result-editor/ComponentsSidebar';
import { EditorPreview } from '@/components/result-editor/EditorPreview';
import { PropertiesPanel } from '@/components/result-editor/PropertiesPanel';
import { StyleResult } from '@/types/quiz';

interface EditorLayoutProps {
  selectedStyle: StyleResult | { category: string; score: number; percentage: number; };
  onShowTemplates?: () => void;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({ 
  selectedStyle, 
  onShowTemplates 
}) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Normalize selectedStyle to string format
  const normalizedStyle: string = typeof selectedStyle === 'string' 
    ? selectedStyle 
    : selectedStyle.category || 'natural';

  const handleComponentSelect = (componentId: string) => {
    setSelectedBlockId(componentId);
  };

  const handleBlockAdd = (blockType: string) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      content: {},
      properties: {}
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const handleBlockUpdate = (blockId: string, updates: any) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, content: { ...block.content, ...updates } }
        : block
    ));
  };

  const handleBlockDelete = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setSelectedBlockId(null);
  };

  const handleBlockReorder = (sourceIndex: number, destinationIndex: number) => {
    setBlocks(prev => {
      const newBlocks = [...prev];
      const [removed] = newBlocks.splice(sourceIndex, 1);
      newBlocks.splice(destinationIndex, 0, removed);
      return newBlocks;
    });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ComponentsSidebar onComponentSelect={handleBlockAdd} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={55}>
          <EditorPreview
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            isPreviewing={isPreviewing}
            primaryStyle={normalizedStyle}
            onReorderBlocks={handleBlockReorder}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={25}>
          <PropertiesPanel
            selectedBlockId={selectedBlockId}
            blocks={blocks}
            onClose={() => setSelectedBlockId(null)}
            onUpdate={handleBlockUpdate}
            onDelete={handleBlockDelete}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
