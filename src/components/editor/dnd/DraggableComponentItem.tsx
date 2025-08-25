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
  const isDebug = () => {
    try {
      return (
        ((import.meta as any)?.env?.DEV ?? false) ||
        (typeof process !== 'undefined' && (process as any)?.env?.NODE_ENV === 'development') ||
        (typeof window !== 'undefined' && (window as any).__DND_DEBUG === true)
      );
    } catch {
      return false;
    }
  };
  if (isDebug()) {
    // eslint-disable-next-line no-console
    console.log(`🧩 DraggableComponentItem renderizado: ${blockType}`);
  }

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-item-${blockType}`,
    data: {
      type: 'sidebar-component',
      blockType: String(blockType),
      title: title,
      description: description,
      category: category || 'default',
      source: 'sidebar',
    },
    disabled,
  });

  if (isDebug()) {
    // eslint-disable-next-line no-console
    console.log(`🔧 useDraggable config para ${blockType}:`, {
      id: `sidebar-item-${blockType}`,
      disabled,
      hasListeners: !!listeners,
      hasAttributes: !!attributes,
      hasSetNodeRef: !!setNodeRef,
    });
  }

  // Debug: verificar se o draggable está sendo configurado
  React.useEffect(() => {
    if (!isDebug()) return;
    // eslint-disable-next-line no-console
    console.log('🔧 Item configurado:', blockType, 'disabled:', disabled);
    // eslint-disable-next-line no-console
    console.log('✅ setNodeRef disponível para', blockType);
  }, [blockType, disabled]);

  // Debug simples para mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDebug()) return;
    // eslint-disable-next-line no-console
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
