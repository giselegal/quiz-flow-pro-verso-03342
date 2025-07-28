
import React, { useState } from 'react';
import { StyleResult } from '@/types/quiz';
import { ComponentsSidebar } from './sidebar/ComponentsSidebar';
import PropertiesPanel from './properties/PropertiesPanel';
import PagePreview from './preview/PagePreview';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { EditorBlock, BlockType } from '@/types/editor';
import { useEditor } from '@/hooks/useEditor';

interface EditorLayoutProps {
  primaryStyle?: StyleResult;
}

const EditorLayout = ({ primaryStyle }: EditorLayoutProps) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const { config, addBlock, updateBlock, deleteBlock } = useEditor();

  // Función para adicionar um bloco quando um componente é selecionado do sidebar
  const handleComponentSelect = (componentType: string) => {
    const newBlockId = addBlock(componentType as BlockType);
    setSelectedComponent(newBlockId);
  };

  // Função para mostrar as propriedades de um bloco
  const handleSelectComponent = (blockId: string) => {
    setSelectedComponent(blockId);
  };

  // Ensure we have a valid StyleResult with proper type handling
  const validPrimaryStyle: StyleResult = primaryStyle || {
    category: 'Natural' as unknown as StyleResult['category'],
    score: 0,
    percentage: 100
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Sidebar - Components */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full border-r border-[#B89B7A]/20 bg-white overflow-y-auto">
            <ComponentsSidebar onComponentSelect={handleComponentSelect} />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Central Area - Page Preview */}
        <ResizablePanel defaultSize={55}>
          <PagePreview
            primaryStyle={validPrimaryStyle}
            onSelectComponent={handleSelectComponent}
            blocks={config.blocks}
            onAddBlock={() => handleComponentSelect('headline')}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Right Sidebar - Properties */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <div className="h-full border-l border-[#B89B7A]/20 bg-white overflow-y-auto">
            <PropertiesPanel
              selectedComponentId={selectedComponent}
              onClose={() => setSelectedComponent(null)}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default EditorLayout;
