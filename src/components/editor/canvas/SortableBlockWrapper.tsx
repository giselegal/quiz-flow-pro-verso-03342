import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Block } from "@/types/editor";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import React from "react";
import UniversalBlockRenderer from "../blocks/UniversalBlockRenderer";

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
      data: {
        type: "canvas-block",
        blockId: block.id,
      },
    });
  }, [block.id, block.type, isDragging]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto', // Z-index maior durante drag
  };

  const handlePropertyChange = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  return (
    <div ref={setNodeRef} style={style} className="my-2">
      <Card
        className={`relative group ${isSelected ? "ring-2 ring-[#B89B7A]" : ""} transition-all duration-200`}
      >
        {/* Drag handle and controls - only show on hover */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing touch-none"
            style={{ touchAction: 'none' }} // Importante para dispositivos touch
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

        {/* Block content */}
        <div className="p-2" onClick={onSelect}>
          <UniversalBlockRenderer
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
