import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '../../ui/button';
import { GripVertical, Copy, Trash2 } from 'lucide-react';

interface SortableItemProps {
  id: string;
  component: any;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  children: React.ReactNode;
}

export function SortableItem({
  id,
  component,
  isSelected,
  onClick,
  onDelete,
  onDuplicate,
  children,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-[#B89B7A] bg-[#B89B7A]/10 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      {/* Barra de ferramentas do componente */}
      <div className="absolute -top-3 left-2 hidden group-hover:flex items-center gap-1 bg-white border rounded px-2 py-1 shadow-sm z-10">
        <button {...attributes} {...listeners} style={{ color: '#6B4F43' }}>
          <GripVertical className="h-4 w-4" />
        </button>

        <span style={{ color: '#8B7355' }}>{component.type}</span>

        <Button
          variant="ghost"
          size="sm"
          onClick={e => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="h-6 w-6 p-0"
        >
          <Copy className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          style={{ color: '#432818' }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Conteúdo do componente */}
      <div className="p-4">{children}</div>

      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-[#B89B7A] bg-[#B89B7A]/100/5"></div>
      )}
    </div>
  );
}
