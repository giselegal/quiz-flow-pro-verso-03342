// @ts-nocheck
import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import BlockRenderer from './BlockRenderer';

export interface EditableBlockProps {
  block: Block;
  index?: number;
  isSelected: boolean;
  onSelect?: () => void;
  onClick?: () => void;
  onUpdate: (content: any) => void;
  onDelete: () => void;
  onMove?: (direction: 'up' | 'down') => void;
  onReorderBlocks?: (sourceIndex: number, destinationIndex: number) => void;
  isPreviewMode?: boolean;
  primaryStyle?: StyleResult;
}

export const EditableBlock: React.FC<EditableBlockProps> = ({
  block,
  index = 0,
  isSelected,
  onSelect,
  onClick,
  onUpdate,
  onDelete,
  onMove,
  isPreviewMode = false,
  primaryStyle,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    disabled: isPreviewMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = () => {
    if (onSelect) onSelect();
    if (onClick) onClick();
  };

  if (isPreviewMode) {
    return (
      <div ref={setNodeRef} style={style}>
        <BlockRenderer block={block} primaryStyle={primaryStyle} />
      </div>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative border-2 cursor-pointer transition-all duration-200',
        isSelected ? 'border-[#B89B7A] shadow-lg' : 'border-gray-200 hover:border-gray-300'
      )}
      onClick={handleClick}
    >
      {/* Toolbar for selected block */}
      {isSelected && (
        <div style={{ borderColor: '#E5DDD5' }}>
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners} style={{ backgroundColor: '#E5DDD5' }}>
              <GripVertical style={{ color: '#8B7355' }} />
            </div>
            <span style={{ color: '#6B4F43' }}>{block.type}</span>
          </div>

          <div className="flex items-center gap-1">
            {onMove && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={e => {
                    e.stopPropagation();
                    onMove('up');
                  }}
                  className="h-8 w-8 p-0"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={e => {
                    e.stopPropagation();
                    onMove('down');
                  }}
                  className="h-8 w-8 p-0"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
              style={{ color: '#432818' }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="p-4">
        <BlockRenderer
          block={block}
          isEditing={isSelected}
          onUpdate={onUpdate}
          primaryStyle={primaryStyle}
        />
      </div>
    </Card>
  );
};

export default EditableBlock;
