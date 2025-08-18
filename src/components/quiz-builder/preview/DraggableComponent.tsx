import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { QuizComponentData } from '@/types/quizBuilder';
import ComponentRenderer from './ComponentRenderer';

interface DraggableComponentProps {
  component: QuizComponentData;
  isSelected?: boolean;
  onSelect?: () => void;
  onMove?: (draggedId: string, targetId: string) => void;
  isPreviewing?: boolean;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
  isSelected = false,
  onSelect,
  onMove,
  isPreviewing = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDragNodeRef,
    transform,
  } = useDraggable({
    id: component.id,
    disabled: isPreviewing,
  });

  const { setNodeRef: setDropNodeRef } = useDroppable({
    id: component.id,
  });

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
        zIndex: 999,
      }
    : undefined;

  const setNodeRef = (node: HTMLElement | null) => {
    setDragNodeRef(node);
    setDropNodeRef(node);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <ComponentRenderer
        component={component}
        isSelected={isSelected}
        onSelect={onSelect}
        onMove={onMove}
        isPreviewing={isPreviewing}
      />
    </div>
  );
};
