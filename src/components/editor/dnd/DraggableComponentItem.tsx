import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

// Utility function for class names (local, não depende de '@/lib/utils')
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
  console.log(`🧩 DraggableComponentItem renderizado: ${blockType}`);

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

  console.log(`🔧 useDraggable config para ${blockType}:`, {
    id: `sidebar-item-${blockType}`,
    disabled,
    hasListeners: !!listeners,
    hasAttributes: !!attributes,
    hasSetNodeRef: !!setNodeRef,
  });

  // Debug: verificar se o draggable está sendo configurado
  React.useEffect(() => {
    console.log('🔧 Item configurado:', blockType, 'disabled:', disabled);

    // 🔧 DEBUG: Verificar se ref foi aplicada
    console.log('✅ setNodeRef disponível para', blockType);
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

  // ✅ CORRIGIDO: CSS Transform sem zoom indesejado
  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
        zIndex: isDragging ? 999 : 'auto',
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'ToolbarButton w-full h-auto p-3 flex flex-col items-start gap-2 text-left transition-all duration-200 border border-stone-200 rounded-lg bg-white group',
        // ✅ CURSOR: Indicação visual clara de que é draggable
        'cursor-grab hover:bg-blue-50 hover:border-blue-400',
        // ✅ FEEDBACK: Estados visuais distintos
        isDragging && 'opacity-50 cursor-grabbing shadow-2xl bg-blue-100 border-blue-500',
        // 🔧 DEBUG: Ring azul forte para identificar draggables
        'ring-2 ring-blue-200 hover:ring-blue-400',
        disabled && 'opacity-30 cursor-not-allowed bg-gray-100',
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
