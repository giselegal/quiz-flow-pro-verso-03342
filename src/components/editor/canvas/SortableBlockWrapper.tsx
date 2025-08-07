import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBlockComponent } from "@/config/enhancedBlockRegistry";
import { useContainerProperties } from "@/hooks/useContainerProperties";
import { cn } from "@/lib/utils";
import { Block } from "@/types/editor";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import React from "react";

interface SortableBlockWrapperProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
}

export const SortableBlockWrapper: React.FC<SortableBlockWrapperProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  // 🔧 Integrar propriedades de container diretamente
  const { containerClasses, inlineStyles, processedProperties } = useContainerProperties(
    block.properties
  );

  // Buscar componente no registry (eliminando UniversalBlockRenderer)
  const Component = getBlockComponent(block.type);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: {
      type: "canvas-block", // TIPO CRUCIAL que o DndProvider espera
      blockId: block.id,
      block: block,
    },
  });

  // Debug: verificar se o sortable está sendo configurado
  React.useEffect(() => {
    console.log("🔧 SortableBlockWrapper configurado:", {
      id: block.id,
      blockType: block.type,
      isDragging,
      containerClasses, // Agora integrado diretamente
      processedProperties,
      data: {
        type: "canvas-block",
        blockId: block.id,
      },
    });
  }, [block.id, block.type, isDragging, containerClasses, processedProperties]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto", // Z-index maior durante drag
  };

  const handlePropertyChange = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  // Fallback se componente não for encontrado
  if (!Component) {
    return (
      <div ref={setNodeRef} style={style} className="my-2">
        <Card className="relative group border-red-300">
          <div className="p-4 text-center text-red-500">
            <p>Componente não encontrado: {block.type}</p>
            <p className="text-xs mt-1">Verifique se o tipo está registrado</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="my-2">
      <Card
        className={cn(
          "relative group transition-all duration-200 border-transparent", // 🎯 Borda transparente por padrão
          // 🎯 Aplicar classes de container diretamente no Card
          containerClasses,
          // 🎯 Apenas borda tracejada discreta quando selecionado
          isSelected && "border-dashed border-[#B89B7A]/60 border-2"
        )}
        style={inlineStyles} // 🎯 Aplicar estilos inline (scale) diretamente
      >
        {/* Drag handle and controls - only show on hover */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing touch-none"
            style={{ touchAction: "none" }} // Importante para dispositivos touch
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3 w-3" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-6 w-6 p-0 text-amber-700 hover:text-amber-800"
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* 🎯 Container 2: Componente Individual sem bordas extras */}
        <div 
          className="p-2" // 🎯 Removido todas as bordas do container 2
          onClick={onSelect}
        >
          <Component
            block={block}
            isSelected={isSelected}
            onClick={onSelect}
            onPropertyChange={handlePropertyChange}
          />
        </div>
      </Card>
    </div>
  );
};
