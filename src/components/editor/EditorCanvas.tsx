import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { EditorBlock } from '@/types/editor';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Grip, ChevronUp, ChevronDown, Copy, Trash } from 'lucide-react';
import { BlockRenderer } from '@/components/blocks';

interface EditorCanvasProps {
  className?: string;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ className }) => {
  const { 
    blocks, 
    selectedBlock, 
    selectBlock,
    moveBlock,
    duplicateBlock,
    deleteBlock,
    reorderBlocks,
    setIsDragging
  } = useEditor();

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    // TODO: Implementar upload de arquivos
    console.log('Arquivos recebidos:', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });

  const handleDragEnd = React.useCallback((result: any) => {
    setIsDragging(false);

    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    reorderBlocks(sourceIndex, destinationIndex);
  }, [reorderBlocks, setIsDragging]);

  const handleDragStart = React.useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  const renderBlock = (block: EditorBlock, index: number) => {
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
                
                <div className="flex-1" onClick={() => selectBlock(block)}>
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
    <div
      {...getRootProps()}
      className={cn('editor-canvas min-h-screen p-8', className)}
    >
      <input {...getInputProps()} />
      
      <DragDropContext 
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <Droppable droppableId="editor-blocks">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              {blocks.map((block, index) => renderBlock(block, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isDragActive && (
        <div className="dropzone-overlay absolute inset-0 bg-blue-500/10 border-2 border-blue-500 border-dashed rounded-lg">
          <div className="flex items-center justify-center h-full">
            <p className="text-blue-500 font-medium">
              Solte os arquivos aqui...
            </p>
          </div>
        </div>
      )}

      {blocks.length === 0 && (
        <Card className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed">
          <p className="text-muted-foreground mb-4">
            Nenhum bloco adicionado
          </p>
          <p className="text-sm text-muted-foreground/60">
            Use o painel lateral para adicionar blocos
          </p>
        </Card>
      )}
    </div>
  );
};
