
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useEditor } from '@/context/EditorContext';
import { ComponentsSidebar } from './sidebar/ComponentsSidebar';
import { EditorCanvas } from './canvas/EditorCanvas';
import { DynamicPropertiesPanel } from './panels/DynamicPropertiesPanel';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId,
  className = ''
}) => {
  const {
    blocks,
    selectedBlockId,
    setSelectedBlockId,
    actions
  } = useEditor();

  const [isPreviewing, setIsPreviewing] = useState(false);

  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  return (
    <div className={`h-full w-full bg-gray-50 ${className}`}>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Sidebar de componentes */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ComponentsSidebar onComponentSelect={actions.addBlock} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Canvas principal */}
        <ResizablePanel defaultSize={55}>
          <EditorCanvas
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onUpdateBlock={actions.updateBlock}
            onDeleteBlock={actions.deleteBlock}
            onReorderBlocks={actions.reorderBlocks}
            isPreviewing={isPreviewing}
            viewportSize="lg"
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Painel de propriedades */}
        <ResizablePanel defaultSize={25}>
          <DynamicPropertiesPanel
            selectedBlock={selectedBlock ? {
              id: selectedBlock.id,
              type: selectedBlock.type,
              properties: selectedBlock.content || {}
            } : null}
            funnelConfig={{
              name: 'Novo Funil',
              description: '',
              isPublished: false,
              theme: 'default'
            }}
            onBlockPropertyChange={(key: string, value: any) => {
              if (selectedBlock) {
                actions.updateBlock(selectedBlock.id, {
                  content: { ...selectedBlock.content, [key]: value }
                });
              }
            }}
            onNestedPropertyChange={(path: string, value: any) => {
              if (selectedBlock) {
                const pathParts = path.split('.');
                const newContent = { ...selectedBlock.content };
                
                // Criar estrutura aninhada se necessário
                let target = newContent;
                for (let i = 0; i < pathParts.length - 1; i++) {
                  if (!target[pathParts[i]]) {
                    target[pathParts[i]] = {};
                  }
                  target = target[pathParts[i]];
                }
                target[pathParts[pathParts.length - 1]] = value;
                
                actions.updateBlock(selectedBlock.id, { content: newContent });
              }
            }}
            onFunnelConfigChange={(configUpdates: any) => {
              console.log('Config do funil atualizada:', configUpdates);
            }}
            onDeleteBlock={(id: string) => {
              actions.deleteBlock(id);
              setSelectedBlockId(null);
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
