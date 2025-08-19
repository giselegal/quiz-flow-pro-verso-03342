import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronUp, Copy, Grip, Trash } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface EditorCanvasProps {
  className?: string;
}

// ========================================
// Componente SortableBlock para EditorCanvas
// ========================================
interface SortableEditorBlockProps {
  block: Block;
  index: number;
  selectedBlock: Block | null;
  selectBlock: (blockId: string) => void;
  moveBlock: (blockId: string, direction: 'up' | 'down') => void;
  duplicateBlock: (blockId: string) => void;
  deleteBlock: (blockId: string) => void;
  totalBlocks: number;
}

const SortableEditorBlock: React.FC<SortableEditorBlockProps> = ({
  block,
  index,
  selectedBlock,
  selectBlock,
  moveBlock,
  duplicateBlock,
  deleteBlock,
  totalBlocks,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedBlock?.id === block.id;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'mb-4 transition-all',
        isSelected ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-muted',
        isDragging && 'shadow-lg z-10'
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div {...attributes} {...listeners}>
            <Grip className="h-4 w-4 text-muted-foreground cursor-grab" />
          </div>

          <div className="flex-1" onClick={() => selectBlock(block.id)}>
            <BlockRenderer block={block} selected={isSelected} />
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => moveBlock(block.id, 'up')}
              disabled={index === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => moveBlock(block.id, 'down')}
              disabled={index === totalBlocks - 1}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => duplicateBlock(block.id)}
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => deleteBlock(block.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ========================================
// Componente Principal - EditorCanvas
// ========================================
export const EditorCanvas: React.FC<EditorCanvasProps> = ({ className }) => {
  const {
    state: { blocks },
    computed: { selectedBlock },
    blockActions: { deleteBlock, reorderBlocks },
    dispatch,
    selectBlock,
  } = useEditor();

  // Estado do drag & drop
  const [activeId, setActiveId] = useState<string | null>(null);

  // Sensors para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Dropzone para upload de arquivos
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    // TODO: Implementar upload de arquivos
    console.log('Arquivos recebidos:', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  // ========================================
  // Event Handlers
  // ========================================
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = blocks.findIndex(block => block.id === active.id);
        const newIndex = blocks.findIndex(block => block.id === over?.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          reorderBlocks(oldIndex, newIndex);
        }
      }

      setActiveId(null);
    },
    [blocks, reorderBlocks]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const moveBlock = useCallback(
    (blockId: string, direction: 'up' | 'down') => {
      const blockIndex = blocks.findIndex(b => b.id === blockId);
      if (blockIndex === -1) return;

      let newIndex = blockIndex;
      if (direction === 'up' && blockIndex > 0) {
        newIndex = blockIndex - 1;
      } else if (direction === 'down' && blockIndex < blocks.length - 1) {
        newIndex = blockIndex + 1;
      }

      reorderBlocks(blockIndex, newIndex);
    },
    [blocks, reorderBlocks]
  );

  const duplicateBlock = useCallback(
    (blockId: string) => {
      const block = blocks.find(b => b.id === blockId);
      if (!block) return;

      const duplicatedBlock: Block = {
        ...block,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order: block.order + 1,
      };

      dispatch({
        type: 'SET_BLOCKS',
        payload: [...blocks, duplicatedBlock].map((b, idx) => ({ ...b, order: idx })),
      });
    },
    [blocks, dispatch]
  );

  // Preparar dados para DndContext
  const blockIds = blocks.map(block => block.id);

  return (
    <div {...getRootProps()} className={cn('editor-canvas min-h-screen p-8', className)}>
      <input {...getInputProps()} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <SortableEditorBlock
                key={block.id}
                block={block}
                index={index}
                selectedBlock={selectedBlock}
                selectBlock={selectBlock}
                moveBlock={moveBlock}
                duplicateBlock={duplicateBlock}
                deleteBlock={deleteBlock}
                totalBlocks={blocks.length}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <Card className="opacity-50 bg-white shadow-lg border">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Grip className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Arrastando bloco: {activeId}</span>
                </div>
              </div>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {isDragActive && (
        <div className="dropzone-overlay absolute inset-0 bg-blue-500/10 border-2 border-blue-500 border-dashed rounded-lg">
          <div className="flex items-center justify-center h-full">
            <p className="text-blue-500 font-medium">Solte os arquivos aqui...</p>
          </div>
        </div>
      )}

      {blocks.length === 0 && (
        <Card className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed">
          <p className="text-muted-foreground mb-4">Nenhum bloco adicionado</p>
          <p className="text-sm text-muted-foreground/60">
            Use o painel lateral para adicionar blocos
          </p>
        </Card>
      )}
    </div>
  );
};
