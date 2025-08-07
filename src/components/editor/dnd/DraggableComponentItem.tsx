import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

// Utility function for class names

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === "string" ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return "";

  const prefix = type === "top" ? "mt" : type === "bottom" ? "mb" : type === "left" ? "ml" : "mr";

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

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
    console.log("🔧 Item configurado:", blockType, "disabled:", disabled);
  }, [blockType, disabled]);

  // Debug simples para mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    console.log("🖱️ MouseDown:", blockType, "disabled:", disabled);
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
        "w-full h-auto p-3 flex flex-col items-start gap-2 text-left transition-all duration-200 border border-stone-200 rounded-lg bg-white",
        // Simplificar classes para debugging
        "cursor-grab hover:bg-stone-50",
        isDragging && "opacity-50 cursor-grabbing shadow-lg",
        disabled && "opacity-50 cursor-not-allowed",
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, "top"),
        getMarginClass(marginBottom, "bottom"),
        getMarginClass(marginLeft, "left"),
        getMarginClass(marginRight, "right")
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
