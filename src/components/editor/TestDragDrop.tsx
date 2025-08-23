import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as React from 'react';

interface DraggableItemProps {
  id: string;
  children: React.ReactNode;
}

function DraggableItem({ id, children }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white border border-gray-200 rounded mb-2 cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  );
}

export function TestDragDrop() {
  const [items, setItems] = React.useState(['1', '2', '3', '4']);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
    console.log('🎯 Drag iniciado:', event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems(items => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);

        const newItems = arrayMove(items, oldIndex, newIndex);
        console.log('🔄 Items reordenados:', newItems);
        return newItems;
      });
    }

    setActiveId(null);
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">🧪 Teste Drag & Drop</h2>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map(id => (
            <DraggableItem key={id} id={id}>
              <div className="flex items-center">
                <span className="mr-2">📋</span>
                Item {id}
              </div>
            </DraggableItem>
          ))}
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <div className="p-4 bg-blue-100 border border-blue-300 rounded shadow-lg">
              <div className="flex items-center">
                <span className="mr-2">📋</span>
                Item {activeId} (arrastando...)
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold text-sm">Status:</h3>
        <p className="text-sm text-gray-600">
          {activeId ? `Arrastando item ${activeId}` : 'Nada sendo arrastado'}
        </p>
      </div>
    </div>
  );
}
