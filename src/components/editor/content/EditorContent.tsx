
import React from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { EditorBlock } from '@/types/editor';
import { AddBlockButton } from '../AddBlockButton';
import { EmptyEditor } from '../EmptyEditor';
import UniversalBlockRenderer from '../blocks/UniversalBlockRenderer';

interface EditorContentProps {
  blocks: EditorBlock[];
  onDragEnd: (event: DragEndEvent) => void;
  onAddBlock: (type: EditorBlock['type']) => void;
  onUpdateBlock: (id: string, content: any) => void;
  onDeleteBlock: (id: string) => void;
  isPreviewing: boolean;
}

// Helper function to render a preview of a block
const renderBlockPreview = (block: EditorBlock) => {
  switch (block.type) {
    case 'headline':
      return (
        <div className="mb-4">
          {block.content.title && <h2 className="text-2xl font-bold">{block.content.title}</h2>}
          {block.content.subtitle && <p className="text-gray-600">{block.content.subtitle}</p>}
        </div>
      );
    case 'text':
      return <p className="mb-4">{block.content.text}</p>;
    case 'image':
      return block.content.imageUrl ? (
        <img 
          src={block.content.imageUrl} 
          alt={block.content.imageAlt || ''} 
          className="mb-4 rounded-md max-w-full"
        />
      ) : (
        <div className="h-48 bg-gray-100 flex items-center justify-center mb-4 rounded-md">
          <p className="text-gray-400">Imagem</p>
        </div>
      );
    case 'benefits':
      return (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">{block.content.title || 'Benefícios'}</h3>
          <ul className="list-disc pl-5">
            {(block.content.items || []).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      );
    default:
      return <div className="p-4 border rounded mb-4">Bloco: {block.type}</div>;
  }
};

export const EditorContent: React.FC<EditorContentProps> = ({
  blocks,
  onDragEnd,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  isPreviewing
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  if (isPreviewing) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 min-h-96">
        {blocks.map(block => (
          <div key={block.id} className="mb-4">
            {renderBlockPreview(block)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
        {blocks.length === 0 ? (
          <EmptyEditor onAddBlock={onAddBlock} />
        ) : (
          <>
            <div className="space-y-4">
              {blocks.map((block) => (
                <div key={block.id} className="p-4 border rounded-lg">
                  <UniversalBlockRenderer
                    block={block}
                    onPropertyChange={(key: string, value: any) => {
                      onUpdateBlock(block.id, { [key]: value });
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <AddBlockButton onAddBlock={onAddBlock} />
            </div>
          </>
        )}
      </SortableContext>
    </DndContext>
  );
};
