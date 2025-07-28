
import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EditorBlock, BlockType } from '@/types/editor';
import { ComponentRenderer } from './ComponentRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface PageEditorCanvasProps {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  onBlockSelect: (blockId: string) => void;
  onBlockAdd: (type: BlockType) => void;
  onBlockUpdate: (blockId: string, updates: Partial<EditorBlock>) => void;
  onBlockDelete: (blockId: string) => void;
  onBlockMove: (dragIndex: number, hoverIndex: number) => void;
  isPreviewMode: boolean;
}

const DraggableBlock: React.FC<{
  block: EditorBlock;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<EditorBlock>) => void;
  onDelete: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  isPreviewMode: boolean;
}> = ({ block, index, isSelected, onSelect, onUpdate, onDelete, onMove, isPreviewMode }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'block',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        relative group transition-all duration-200
        ${isDragging ? 'opacity-50' : ''}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${!isPreviewMode ? 'hover:ring-1 hover:ring-gray-300 cursor-pointer' : ''}
      `}
      onClick={!isPreviewMode ? onSelect : undefined}
    >
      <ComponentRenderer
        block={{
          id: block.id,
          type: block.type,
          content: block.content,
          properties: block.content
        }}
        isSelected={isSelected}
        onUpdate={onUpdate}
        isPreviewMode={isPreviewMode}
      />
      
      {!isPreviewMode && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white"
          >
            <GripVertical className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export const PageEditorCanvas: React.FC<PageEditorCanvasProps> = ({
  blocks,
  selectedBlockId,
  onBlockSelect,
  onBlockAdd,
  onBlockUpdate,
  onBlockDelete,
  onBlockMove,
  isPreviewMode
}) => {
  const [isAddingBlock, setIsAddingBlock] = useState(false);

  const handleAddBlock = useCallback((type: BlockType) => {
    onBlockAdd(type);
    setIsAddingBlock(false);
  }, [onBlockAdd]);

  const blockTypes: { type: BlockType; label: string }[] = [
    { type: 'text', label: 'Text' },
    { type: 'image', label: 'Image' },
    { type: 'button', label: 'Button' },
    { type: 'header', label: 'Header' },
    { type: 'spacer', label: 'Spacer' },
    { type: 'video', label: 'Video' },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {blocks.map((block, index) => (
            <DraggableBlock
              key={block.id}
              block={block}
              index={index}
              isSelected={selectedBlockId === block.id}
              onSelect={() => onBlockSelect(block.id)}
              onUpdate={(updates) => onBlockUpdate(block.id, updates)}
              onDelete={() => onBlockDelete(block.id)}
              onMove={onBlockMove}
              isPreviewMode={isPreviewMode}
            />
          ))}
          
          {!isPreviewMode && (
            <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-8">
                {isAddingBlock ? (
                  <div className="space-y-4">
                    <h3 className="font-medium">Add Component</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {blockTypes.map(({ type, label }) => (
                        <Button
                          key={type}
                          variant="outline"
                          onClick={() => handleAddBlock(type)}
                          className="h-12"
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingBlock(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingBlock(true)}
                    className="w-full h-12"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Component
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
          
          {blocks.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p>No components added yet.</p>
              <p className="text-sm">Click "Add Component" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default PageEditorCanvas;
