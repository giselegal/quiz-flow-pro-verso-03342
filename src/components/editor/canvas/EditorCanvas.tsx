
import React from 'react';
import { EditorBlock } from '@/types/editor';
import { UniversalBlockRenderer } from '../blocks/UniversalBlockRenderer';

interface EditorCanvasProps {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (id: string, updates: any) => void;
  onDeleteBlock: (id: string) => void;
  onReorderBlocks: (startIndex: number, endIndex: number) => void;
  isPreviewing: boolean;
  viewportSize: 'sm' | 'md' | 'lg' | 'xl';
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  isPreviewing,
  viewportSize
}) => {
  if (blocks.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-medium mb-2">Canvas Vazio</h3>
          <p className="text-sm">Adicione componentes usando o painel lateral</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`relative ${
              selectedBlockId === block.id
                ? 'ring-2 ring-blue-500 ring-opacity-50'
                : 'hover:ring-1 hover:ring-gray-300'
            }`}
            onClick={() => onSelectBlock(block.id)}
          >
            <UniversalBlockRenderer
              block={block}
              isSelected={selectedBlockId === block.id}
              onSelect={() => onSelectBlock(block.id)}
              onUpdate={(updates) => onUpdateBlock(block.id, updates)}
              onDelete={() => onDeleteBlock(block.id)}
              isPreview={isPreviewing}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
