import React from 'react';
import { useDraggable } from '@dnd-kit/core';

// Utility function for class names
const cn = (...classes: (string | undefined | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface DraggableComponentItemProps {
  blockType: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  category?: string;
  disabled?: boolean;
  className?: string;
}

export const DraggableComponentItem: React.FC<DraggableComponentItemProps> = ({
  blockType,
  title,
  description,
  icon,
  category,
  disabled = false,
  className
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: `sidebar-${blockType}`,
    data: {
      type: 'sidebar-component',
      blockType,
      title,
      category
    },
    disabled
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'w-full h-auto p-3 flex flex-col items-start gap-2 text-left cursor-grab hover:bg-gray-50 transition-all duration-200 border border-gray-200 rounded-lg bg-white',
        isDragging && 'opacity-50 cursor-grabbing scale-105',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={style}
      {...attributes}
      {...listeners}
    >
      {/* Icon and Title */}
      <div className="flex items-center gap-2 w-full">
        <div className="flex-shrink-0 text-primary">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {title}
          </h4>
          {category && (
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-600 line-clamp-2 w-full">
          {description}
        </p>
      )}

      {/* Drag Indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-md border-2 border-blue-500 border-dashed" />
      )}
    </div>
  );
};