import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getBlockComponent } from '@/config/enhancedBlockRegistry';
import { cn } from '@/lib/utils';
import type { BlockData } from '@/types/blocks';
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Copy, Eye, GripVertical, Move3D, Plus, Trash2 } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface DraggableBlockProps {
  block: BlockData;
  isSelected?: boolean;
  isOverlay?: boolean;
  onSelect?: (blockId: string) => void;
  onDuplicate?: (blockId: string) => void;
  onDelete?: (blockId: string) => void;
}

interface DragAndDropEditorProps {
  blocks: BlockData[];
  onBlocksReorder: (blocks: BlockData[]) => void;
  selectedBlockId?: string;
  onBlockSelect?: (blockId: string) => void;
  onBlockDuplicate?: (blockId: string) => void;
  onBlockDelete?: (blockId: string) => void;
  onAddNewBlock?: () => void;
  className?: string;
}

// Componente para um bloco arrastável
const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  isSelected,
  isOverlay,
  onSelect,
  onDuplicate,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: {
      type: 'Block',
      block,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSelect = useCallback(() => {
    onSelect?.(block.id);
  }, [onSelect, block.id]);

  const handleDuplicate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDuplicate?.(block.id);
    },
    [onDuplicate, block.id]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete?.(block.id);
    },
    [onDelete, block.id]
  );

  // Simular preview do bloco baseado no tipo
  const renderBlockPreview = () => {
    switch (block.type) {
      case 'text-inline':
      case 'heading-inline':
        return (
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            <div style={{ backgroundColor: '#E5DDD5' }}></div>
          </div>
        );
      case 'image-display-inline':
        return (
          <div style={{ borderColor: '#E5DDD5' }}>
            <span style={{ color: '#8B7355' }}>📷 Imagem</span>
          </div>
        );
      case 'button-inline':
        return (
          <div className="bg-[#B89B7A] text-white px-4 py-2 rounded text-center text-sm">
            {block.properties?.text || 'Botão'}
          </div>
        );
      case 'options-grid':
        return (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ backgroundColor: '#E5DDD5' }}></div>
            ))}
          </div>
        );
      default:
        return (
          <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded flex items-center justify-center">
            <span style={{ color: '#6B4F43' }}>{block.type}</span>
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative',
        isDragging && 'z-50',
        isOverlay && 'rotate-3 scale-105 shadow-2xl'
      )}
    >
      <Card
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          isSelected ? 'ring-2 ring-[#B89B7A] ring-offset-2 bg-[#B89B7A]/5' : 'hover:bg-gray-50',
          isDragging ? 'shadow-lg bg-white' : '',
          isOverlay && 'shadow-2xl bg-white border-[#B89B7A]'
        )}
        onClick={handleSelect}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Drag Handle */}
              <div
                {...attributes}
                {...listeners}
                className={cn(
                  'flex items-center justify-center w-6 h-6 rounded cursor-grab active:cursor-grabbing',
                  'hover:bg-gray-200 transition-colors',
                  isDragging && 'cursor-grabbing'
                )}
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>

              {/* Block Type Badge */}
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  isSelected ? 'bg-[#B89B7A] text-white border-[#B89B7A]' : ''
                )}
              >
                {block.type}
              </Badge>

              {/* Block Status */}
              {getBlockComponent(block.type) ? (
                <div className="w-2 h-2 bg-green-500 rounded-full" title="Componente disponível" />
              ) : (
                <div style={{ backgroundColor: '#FAF9F7' }} title="Componente não encontrado" />
              )}
            </div>

            {/* Actions */}
            <div
              className={cn(
                'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
                isSelected && 'opacity-100'
              )}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={handleDuplicate}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicar</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ color: '#432818' }}
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Excluir</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Preview do conteúdo do bloco */}
          <div className="space-y-2">
            {renderBlockPreview()}

            {/* Informações adicionais */}
            <div style={{ color: '#8B7355' }}>
              <span>ID: {block.id.slice(-8)}</span>
              {block.properties && Object.keys(block.properties).length > 0 && (
                <span>{Object.keys(block.properties).length} props</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente principal do editor drag & drop
const DragAndDropEditor: React.FC<DragAndDropEditorProps> = ({
  blocks,
  onBlocksReorder,
  selectedBlockId,
  onBlockSelect,
  onBlockDuplicate,
  onBlockDelete,
  onAddNewBlock,
  className,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = blocks.findIndex(block => block.id === active.id);
        const newIndex = blocks.findIndex(block => block.id === over?.id);

        const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
          ...block,
          position: index,
        }));

        onBlocksReorder(reorderedBlocks);
      }

      setActiveId(null);
    },
    [blocks, onBlocksReorder]
  );

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  const activeBlock = activeId ? blocks.find(block => block.id === activeId) : null;

  return (
    <div className={cn('h-full flex flex-col', className)}>
      <TooltipProvider>
        {/* Header */}
        <div style={{ borderColor: '#E5DDD5' }}>
          <div className="flex items-center gap-2">
            <Move3D className="w-5 h-5 text-[#B89B7A]" />
            <h3 className="text-lg font-medium text-[#432818]">Editor de Blocos</h3>
            <Badge variant="secondary" className="bg-[#B89B7A]/10 text-[#432818]">
              {blocks.length} blocos
            </Badge>
          </div>

          <Button onClick={onAddNewBlock} size="sm" className="bg-[#B89B7A] hover:bg-[#B89B7A]/90">
            <Plus className="w-4 h-4 mr-1" />
            Novo Bloco
          </Button>
        </div>

        {/* Lista de blocos com drag & drop */}
        <div className="flex-1 overflow-auto p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
          >
            <SortableContext
              items={blocks.map(block => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {blocks.map(block => (
                  <DraggableBlock
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={onBlockSelect}
                    onDuplicate={onBlockDuplicate}
                    onDelete={onBlockDelete}
                  />
                ))}
              </div>
            </SortableContext>

            {/* Overlay durante drag */}
            <DragOverlay dropAnimation={dropAnimation}>
              {activeBlock ? <DraggableBlock block={activeBlock} isOverlay /> : null}
            </DragOverlay>
          </DndContext>

          {/* Estado vazio */}
          {blocks.length === 0 && (
            <div style={{ color: '#8B7355' }}>
              <div className="text-center">
                <Move3D className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhum bloco adicionado</p>
                <p className="text-sm mb-4">Adicione blocos para começar a editar</p>
                <Button onClick={onAddNewBlock} className="bg-[#B89B7A] hover:bg-[#B89B7A]/90">
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Primeiro Bloco
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer com dicas */}
        <div style={{ borderColor: '#E5DDD5' }}>
          <div style={{ color: '#6B4F43' }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <GripVertical className="w-3 h-3" />
                <span>Arraste para reordenar</span>
              </div>
              <div className="flex items-center gap-1">
                <Copy className="w-3 h-3" />
                <span>Clique para duplicar</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>
                {blocks.filter(b => getBlockComponent(b.type)).length} de {blocks.length} funcionais
              </span>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default DragAndDropEditor;
