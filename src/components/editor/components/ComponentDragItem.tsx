import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface ComponentDragItemProps {
  type: string;
  label: string;
  icon: string;
  description?: string;
  category?: string;
}

/**
 * 🧩 Item de componente arrastável para o painel lateral
 * Permite arrastar componentes do painel para o canvas
 */
export const ComponentDragItem: React.FC<ComponentDragItemProps> = ({
  type,
  label,
  icon,
  description,
  category,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `component-${type}`,
    data: {
      type: 'component',
      componentType: type,
      label,
      category,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'component-drag-item',
        'group cursor-grab active:cursor-grabbing',
        'bg-white border border-gray-200 rounded-lg p-3',
        'hover:border-blue-300 hover:shadow-md hover:bg-blue-50/50',
        'transition-all duration-200',
        'flex items-center gap-3',
        isDragging && 'opacity-50 scale-95 shadow-lg z-50',
        isDragging && 'border-blue-400 bg-blue-100'
      )}
    >
      {/* Ícone do componente */}
      <div className="component-icon flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md group-hover:bg-blue-100 transition-colors">
        <span className="text-sm">{icon}</span>
      </div>

      {/* Info do componente */}
      <div className="component-info flex-1 min-w-0">
        <div className="component-label text-sm font-medium text-gray-800 group-hover:text-blue-800">
          {label}
        </div>
        {description && (
          <div className="component-description text-xs text-gray-500 mt-1 line-clamp-2">
            {description}
          </div>
        )}
        <div className="component-type text-xs text-gray-400 mt-1 font-mono">
          {type}
        </div>
      </div>

      {/* Indicador de drag */}
      <div className="drag-indicator flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-4 h-4 flex items-center justify-center text-gray-400 group-hover:text-blue-600">
          <span className="text-xs">⋮⋮</span>
        </div>
      </div>

      {/* Visual feedback durante drag */}
      {isDragging && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/30 pointer-events-none" />
      )}
    </div>
  );
};

export default ComponentDragItem;
