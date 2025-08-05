import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "@/types/editor";
import UniversalBlockRenderer from "../blocks/UniversalBlockRenderer";

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
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <UniversalBlockRenderer
        block={block}
        isSelected={isSelected}
        onClick={onClick}
        onPropertyChange={onPropertyChange}
      />
    </div>
  );
};
