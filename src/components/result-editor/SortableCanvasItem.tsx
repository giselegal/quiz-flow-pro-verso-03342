import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableCanvasItemProps {
  id: string;
  children: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
}

export const SortableCanvasItem: React.FC<SortableCanvasItemProps> = ({
  id,
  children,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      type: 'canvas-item',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group bg-white rounded-lg transition-all duration-200
        ${isSelected ? 'ring-2 ring-[#B89B7A] shadow-lg' : 'hover:shadow-md'}
        ${isDragging ? 'opacity-50 z-50' : ''}
      `}
      onClick={e => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {isSelected && (
        <div className="absolute -top-12 left-0 right-0 flex items-center justify-between bg-white border border-[#D4C4A0] rounded-lg px-3 py-2 shadow-md z-10">
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners} style={{ backgroundColor: '#E5DDD5' }}>
              <GripVertical className="w-4 h-4 text-[#B89B7A]" />
            </div>
            <span className="text-xs font-medium text-[#432818]">Componente selecionado</span>
          </div>

          <div className="flex items-center gap-1">
            {onDuplicate && (
              <Button
                size="sm"
                variant="ghost"
                onClick={e => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className="h-8 w-8 p-0 hover:bg-[#F5F2E9]"
              >
                <Copy className="w-4 h-4 text-[#B89B7A]" />
              </Button>
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

      <div className="p-4">{children}</div>

      {!isSelected && (
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#B89B7A] rounded-lg pointer-events-none transition-colors duration-200" />
      )}
    </div>
  );
};
