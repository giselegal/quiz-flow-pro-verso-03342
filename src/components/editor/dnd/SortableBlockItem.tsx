import { getBlockComponent } from "@/config/enhancedBlockRegistry";
import { useContainerProperties } from "@/hooks/useContainerProperties";
import { cn } from "@/lib/utils";
import { Block } from "@/types/editor";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface SortableBlockItemProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}

export const SortableBlockItem: React.FC<SortableBlockItemProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
}) => {
  // 🎯 Integrar propriedades de container diretamente
  const { containerClasses, inlineStyles } = useContainerProperties(block.properties);
  const Component = getBlockComponent(block.type);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...inlineStyles, // 🎯 Combinar estilos de sortable com container
  };

  // Fallback se componente não for encontrado
  if (!Component) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          <p>Componente não encontrado: {block.type}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-all duration-200 border-transparent rounded", // 🎯 Container 1: Borda transparente por padrão
        containerClasses,
        // 🎯 Apenas borda tracejada discreta quando selecionado
        isSelected && "border-dashed border-[#B89B7A]/60 border-2"
      )}
      {...attributes}
      {...listeners}
    >
      {/* 🎯 Container 2: Componente Individual sem bordas extras */}
      <Component
        block={block}
        isSelected={isSelected}
        onClick={onClick}
        onPropertyChange={onPropertyChange}
      />
    </div>
  );
};
