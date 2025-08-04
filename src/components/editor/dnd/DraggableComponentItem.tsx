import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

// Utility function for class names
const cn = (...classes: (string | undefined | boolean)[]): string => {
  return classes.filter(Boolean).join(" ");
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
      type: "sidebar-component", // TIPO CRUCIAL que o DndProvider espera
      blockType: blockType,
      title: title,
      description: description,
      category: category || "default",
    },
    disabled,
  });

  // Debug: verificar se o draggable está sendo configurado
  React.useEffect(() => {
    console.log("🔧 DraggableComponentItem configurado:", {
      id: `sidebar-item-${blockType}`,
      blockType,
      disabled,
      isDragging,
      data: {
        type: "sidebar-component",
        blockType,
        title,
        category,
      },
    });
  }, [blockType, disabled, isDragging, title, category]);

  // Debug: eventos de mouse para testar interação
  const handleMouseDown = (e: React.MouseEvent) => {
    console.log("🖱️ MouseDown em DraggableComponentItem:", blockType, {
      disabled,
      canDrag: !disabled,
      event: e.type,
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    console.log("👆 PointerDown em DraggableComponentItem:", blockType, {
      disabled,
      canDrag: !disabled,
      event: e.type,
      pointerType: e.pointerType,
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
        "w-full h-auto p-3 flex flex-col items-start gap-2 text-left cursor-grab hover:bg-stone-50 transition-all duration-200 border border-stone-200 rounded-lg bg-white",
        // Melhorar controle de touch e pointer events
        "touch-none select-none", // touch-none para melhor controle mobile, select-none para evitar seleção de texto
        isDragging && "opacity-50 cursor-grabbing scale-105 z-50 shadow-lg", // z-50 e shadow-lg para garantir que fica por cima
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      style={style}
      onMouseDown={handleMouseDown}
      onPointerDown={handlePointerDown}
      {...attributes}
      {...listeners}
    >
      {/* Icon and Title */}
      <div className="flex items-center gap-2 w-full">
        <div className="flex-shrink-0 text-primary">{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-stone-900 truncate">{title}</h4>
          {category && (
            <span className="text-xs text-stone-500 uppercase tracking-wide">{category}</span>
          )}
        </div>
      </div>

      {/* Description */}
      {description && <p className="text-xs text-stone-600 line-clamp-2 w-full">{description}</p>}

      {/* Drag Indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-amber-500 bg-opacity-10 rounded-md border-2 border-amber-500 border-dashed" />
      )}
    </div>
  );
};
