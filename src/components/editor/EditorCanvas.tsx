import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { ChevronDown, ChevronUp, Copy, Grip, Trash } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface EditorCanvasProps {
  className?: string;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ className }) => {
  const {
    state: { blocks },
    computed: { selectedBlock },
    blockActions: { deleteBlock, reorderBlocks },
    dispatch,
    selectBlock,
  } = useEditor();

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    // TODO: Implementar upload de arquivos
    console.log('Arquivos recebidos:', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  // Gerenciamento de arrasto
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragEnd = useCallback(
    (result: any) => {
      setIsDragging(false);

      if (!result.destination) return;

      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;

      if (sourceIndex === destinationIndex) return;

      reorderBlocks(sourceIndex, destinationIndex);
    },
    [reorderBlocks]
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
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

  const renderBlock = (block: Block, index: number) => {
    const isSelected = selectedBlock?.id === block.id;

    return (
      <Draggable key={block.id} draggableId={block.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={cn(
              'mb-4 transition-all',
              isSelected ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-muted',
              snapshot.isDragging && 'opacity-50'
            )}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div {...provided.dragHandleProps}>
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
                    disabled={index === blocks.length - 1}
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
        )}
      </Draggable>
    );
  };

  return (
    <div {...getRootProps()} className={cn('editor-canvas min-h-screen p-8', className)}>
      <input {...getInputProps()} />

      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Droppable droppableId="editor-blocks">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
              {blocks.map((block, index) => renderBlock(block, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
