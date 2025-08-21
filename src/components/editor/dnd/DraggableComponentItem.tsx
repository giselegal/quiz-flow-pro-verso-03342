import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

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
  className,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-item-${blockType}`, // ID mais específico para evitar conflitos
    data: {
      type: 'sidebar-component', // TIPO CRUCIAL que o DndProvider espera
      blockType: blockType,
      title: title,
      description: description,
      category: category || 'default',
    },
    disabled,
  });

  // Debug: verificar se o draggable está sendo configurado
  React.useEffect(() => {
    console.log('🔧 Item configurado:', blockType, 'disabled:', disabled);
  }, [blockType, disabled]);

  // Debug simples para mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('🖱️ MouseDown no item:', {
      blockType,
      disabled,
      target: e.currentTarget,
      isDragging,
      transform,
    });
  };

  // Usar CSS Transform do @dnd-kit/utilities para melhor performance
  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'w-full h-auto p-3 flex flex-col items-start gap-2 text-left transition-all duration-200 border border-stone-200 rounded-lg bg-white',
        // Simplificar classes para debugging
        'cursor-grab hover:bg-stone-50',
        isDragging && 'opacity-50 cursor-grabbing shadow-lg',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={style}
      onMouseDown={handleMouseDown}
      {...attributes}
      {...listeners}
    >
      {/* Icon and Title */}
      <div className="flex items-center gap-2 w-full">
        <div className="flex-shrink-0 text-primary">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-stone-900 truncate">{title}</h4>
            {blockType.includes('step01') && (
              <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">STEP1</span>
            )}
          </div>
          {category && (
            <span className="text-xs text-stone-500 uppercase tracking-wide">{category}</span>
          )}
        </div>
      </div>

      {/* Description */}
      {description && <p className="text-xs text-stone-600 line-clamp-2 w-full">{description}</p>}

      {/* Drag Indicator */}
      {isDragging && <div style={{ backgroundColor: '#FAF9F7' }} />}
    </div>
  );
};
