
import React from 'react';
import { useEditor } from '@/hooks/useEditor';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PreviewBlock } from './PreviewBlock';
import { EditorBlock } from '@/types/editor';

interface PreviewContentProps {
  isPreviewing: boolean;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  viewMode: 'desktop' | 'mobile';
}

export function PreviewContent({
  isPreviewing,
  selectedComponentId,
  onSelectComponent,
  viewMode
}: PreviewContentProps) {
  const { blocks, addBlock } = useEditor();

  if (!blocks.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#8F7A6A] text-sm border-2 border-dashed border-[#B89B7A]/40 rounded-lg">
        <p className="mb-4">Arraste componentes para esta área ou clique no botão abaixo</p>
        <Button 
          variant="outline"
          onClick={() => {
            const id = addBlock('headline');
            onSelectComponent(id);
          }}
          className="border-[#B89B7A] text-[#B89B7A]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Componente
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-full bg-white rounded-lg shadow-sm border border-[#B89B7A]/20 p-6",
      "transition-all duration-300"
    )}>
      <div className="space-y-6">
        {blocks.map((block) => {
          // Convert Block to EditorBlock format
          const editorBlock: EditorBlock = {
            id: block.id,
            type: block.type,
            content: block.content || {},
            order: block.order,
            properties: block.properties || {}
          };
          
          return (
            <PreviewBlock
              key={block.id}
              block={editorBlock}
              isSelected={block.id === selectedComponentId}
              onSelect={() => !isPreviewing && onSelectComponent(block.id)}
              viewMode={viewMode}
              isPreview={isPreviewing}
            />
          );
        })}
      </div>
    </div>
  );
}
