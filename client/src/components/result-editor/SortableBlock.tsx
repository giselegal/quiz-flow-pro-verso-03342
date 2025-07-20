
import React, { memo } from 'react';
import { Block } from '@/types/editor';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlockType } from '@/types/quiz';
import { useStandardSortable, useDragTransforms, useDragAccessibility } from '../drag-drop/hooks';

export interface SortableBlockProps {
  block: Block;
  isSelected: boolean;
  isPreviewing: boolean;
  onSelect: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
}

export const SortableBlock: React.FC<SortableBlockProps> = memo(({
  block,
  isSelected,
  isPreviewing,
  onSelect,
  onDuplicate,
  onDelete,
  onToggleVisibility
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    style,
    isDragging,
    isOver,
    canDrop
  } = useStandardSortable(block.id, isPreviewing);

  const { getDragStyle, getDropIndicatorStyle } = useDragTransforms();
  const { getDragAttributes } = useDragAccessibility();

  const dragStyle = getDragStyle(style.transform || '', style.transition || '', isDragging);
  const dropIndicatorStyle = getDropIndicatorStyle(!!isOver, !!canDrop);
  const accessibilityAttributes = getDragAttributes(isDragging, block.type);

  const getBlockPreview = () => {
    switch (block.type as BlockType) {
      case 'heading':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />
            <h2 className="text-lg font-medium truncate">
              {block.content.text || 'Título'}
            </h2>
          </div>
        );
      case 'paragraph':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
            <p className="text-sm text-gray-600 line-clamp-2">
              {block.content.text || 'Parágrafo de texto'}
            </p>
          </div>
        );
      case 'image':
        return block.content.imageUrl ? (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0" />
            <div className="h-16 w-24 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
              <img 
                src={block.content.imageUrl} 
                alt={block.content.alt || 'Imagem'} 
                className="max-h-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-600 truncate">
              {block.content.alt || 'Imagem'}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0" />
            <div className="h-16 w-24 bg-gray-100 flex items-center justify-center text-gray-400 rounded">
              Imagem
            </div>
          </div>
        );
      case 'button':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0" />
            <div className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
              {block.content.text || 'Botão'}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full flex-shrink-0" />
            <div className="text-sm text-gray-500 capitalize">{block.type}</div>
          </div>
        );
    }
  };

  if (isPreviewing) {
    return (
      <div ref={setNodeRef} style={dragStyle} className="transition-opacity duration-200">
        {getBlockPreview()}
      </div>
    );
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={{ ...dragStyle, ...dropIndicatorStyle }}
      className={cn(
        'relative transition-all duration-200 cursor-pointer', 
        isSelected ? 'border-primary shadow-md ring-2 ring-primary/20' : 'border-muted hover:border-muted-foreground/50',
        isDragging && 'opacity-50',
        block.content?.isHidden && 'opacity-60 border-dashed'
      )}
      onClick={onSelect}
      {...accessibilityAttributes}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {/* Drag Handle */}
      <div 
        className={cn(
          "absolute left-0 top-0 bottom-0 px-1 flex items-center cursor-grab active:cursor-grabbing",
          "hover:bg-gray-100 transition-colors duration-150",
          isDragging && "cursor-grabbing"
        )}
        {...attributes} 
        {...listeners}
        aria-label="Arrastar bloco"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <CardContent className="p-4 pl-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium capitalize">{block.type}</h4>
            {block.content?.isHidden && (
              <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                Oculto
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {onToggleVisibility && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onToggleVisibility(); 
                }}
                aria-label={block.content?.isHidden ? "Mostrar bloco" : "Ocultar bloco"}
              >
                {block.content?.isHidden ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
            {onDuplicate && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDuplicate(); 
                }}
                aria-label="Duplicar bloco"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete(); 
                }}
                aria-label="Deletar bloco"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-2">
          {getBlockPreview()}
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full shadow-sm" />
        )}

        {/* Drop indicator */}
        {isOver && canDrop && (
          <div className="absolute inset-0 border-2 border-dashed border-primary bg-primary/5 rounded-lg flex items-center justify-center">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
              Solte aqui
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

SortableBlock.displayName = 'SortableBlock';
