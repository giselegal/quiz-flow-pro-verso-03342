import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import React from 'react';

type Props = {
  blockType: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
  className?: string;
};

export const DraggableComponentItem: React.FC<Props> = ({
  blockType,
  title,
  description,
  icon,
  className = '',
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-item-${blockType}`,
    data: {
      type: 'sidebar-component',
      blockType,
    },
  });

  const style: React.CSSProperties = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 1000 : 'auto',
      }
    : {};

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        'cursor-move rounded-md p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200',
        isDragging && 'opacity-50',
        className
      )}
      title={description}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div className="flex flex-col">
          <span className="text-sm font-medium">{title}</span>
          {description ? <span className="text-xs text-gray-500">{description}</span> : null}
        </div>
      </div>
    </div>
  );
};

export default DraggableComponentItem;
