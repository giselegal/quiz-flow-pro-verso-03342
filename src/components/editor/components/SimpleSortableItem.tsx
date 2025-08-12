// =====================================================================
// components/editor/components/SimpleSortableItem.tsx - Item ordenável simples
// =====================================================================

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SimpleSortableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const SimpleSortableItem: React.FC<SimpleSortableItemProps> = ({
  id,
  children,
  className = '',
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center space-x-2 p-2 bg-white border border-gray-200 rounded-md ${
        isDragging ? 'opacity-50 shadow-lg' : 'hover:shadow-sm'
      } ${className}`}
    >
      <div {...attributes} {...listeners} style={{ color: '#6B4F43' }}>
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};
