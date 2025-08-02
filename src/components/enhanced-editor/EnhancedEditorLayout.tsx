
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ComponentsSidebar } from './sidebar/ComponentsSidebar';
import { EditorCanvas } from './canvas/EditorCanvas';
import { PropertiesPanel } from './properties/PropertiesPanel';
import { EditorProvider } from '@/contexts/EditorContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Block } from '@/types/editor';

interface EnhancedEditorLayoutProps {
  className?: string;
}

export const EnhancedEditorLayout: React.FC<EnhancedEditorLayoutProps> = ({ className = '' }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleComponentSelect = (type: string) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      order: blocks.length,
      properties: {}
    };
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const handleBlockUpdate = (updates: any) => {
    if (selectedBlockId) {
      setBlocks(prev => prev.map(block => 
        block.id === selectedBlockId ? { ...block, ...updates } : block
      ));
    }
  };

  const handleBlockDelete = () => {
    if (selectedBlockId) {
      setBlocks(prev => prev.filter(block => block.id !== selectedBlockId));
      setSelectedBlockId(null);
    }
  };

  const handleReorderBlocks = (sourceIndex: number, destinationIndex: number) => {
    setBlocks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      return result;
    });
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'header':
        return { title: 'Novo Cabeçalho', subtitle: 'Subtítulo' };
      case 'text':
        return { text: 'Novo texto. Clique para editar.' };
      case 'image':
        return { imageUrl: '', imageAlt: 'Imagem', caption: '' };
      default:
        return {};
    }
  };

  const selectedBlock = selectedBlockId ? blocks.find((b: any) => b.id === selectedBlockId) || null : null;

  if (isMobile) {
    return (
      <EditorProvider>
        <div className={`h-screen flex flex-col ${className}`}>
          <div className="flex-1 overflow-hidden">
            <EditorCanvas
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onUpdateBlock={handleBlockUpdate}
              onDeleteBlock={handleBlockDelete}
              onReorderBlocks={handleReorderBlocks}
              isPreviewing={isPreviewing}
              viewportSize="sm"
            />
          </div>
        </div>
      </EditorProvider>
    );
  }

  return (
    <EditorProvider>
      <div className={`h-screen flex ${className}`}>
        <Card className="w-64 h-full rounded-none border-r">
          <ComponentsSidebar onComponentSelect={handleComponentSelect} />
        </Card>

        <div className="flex-1 flex">
          <div className="flex-1">
            <EditorCanvas
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onUpdateBlock={handleBlockUpdate}
              onDeleteBlock={handleBlockDelete}
              onReorderBlocks={handleReorderBlocks}
              isPreviewing={isPreviewing}
              viewportSize="lg"
            />
          </div>

          <Card className="w-80 h-full rounded-none border-l">
            <PropertiesPanel
              selectedBlock={selectedBlock}
              onUpdate={handleBlockUpdate}
              onDelete={handleBlockDelete}
              onClose={() => setSelectedBlockId(null)}
            />
          </Card>
        </div>
      </div>
    </EditorProvider>
  );
};
