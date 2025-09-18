import { Block } from '@/types/editor';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlockType } from '@/types/quiz';

export interface SortableBlockProps {
  block: Block;
  isSelected: boolean;
  isPreviewing: boolean;
  onSelect: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export const SortableBlock: React.FC<SortableBlockProps> = ({
  block,
  isSelected,
  isPreviewing,
  onSelect,
  onDuplicate,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Safely handle potentially undefined content
  const content = block.content || {};

  const getBlockPreview = () => {
    switch (block.type as BlockType) {
      case 'heading':
        return <h2 className="text-xl font-medium">{content.text || 'Título'}</h2>;
      case 'paragraph':
        return <p className="text-sm line-clamp-2">{content.text || 'Parágrafo de texto'}</p>;
      case 'image':
        return content.imageUrl ? (
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <img
              src={content.imageUrl}
              alt={content.alt || 'Imagem'}
              className="max-h-full object-cover"
            />
          </div>
        ) : (
          <div style={{ backgroundColor: '#E5DDD5' }}>Imagem</div>
        );
      case 'button':
        return (
          <div className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md">
            {content.text || 'Botão'}
          </div>
        );
      default:
        return <div style={{ color: '#8B7355' }}>{block.type}</div>;
    }
  };

  if (isPreviewing) {
    return (
      <div ref={setNodeRef} style={style}>
        {getBlockPreview()}
      </div>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn('relative', isSelected ? 'border-primary' : 'border-muted')}
      onClick={onSelect}
    >
      <div
        className="absolute left-0 top-0 bottom-0 px-1 flex items-center cursor-grab"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <CardContent className="p-4 pl-8">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium capitalize">{block.type}</h4>

          <div className="flex space-x-1">
            {onDuplicate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={e => {
                  e.stopPropagation();
                  onDuplicate();
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={e => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-2">{getBlockPreview()}</div>
      </CardContent>
    </Card>
  );
};
