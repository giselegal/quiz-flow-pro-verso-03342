import {
  closestCenter,
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';
import { Block } from '../../types/editor';
import { useEditor } from './EditorProvider';

interface DndProviderProps {
  children: React.ReactNode;
  currentStepData: Block[];
  currentStepKey: string;
}

export const DndProvider: React.FC<DndProviderProps> = ({
  children,
  currentStepData,
  currentStepKey,
}) => {
  const { actions } = useEditor();

  // Configuração dos sensores
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Estratégia de detecção de colisão
  const collisionDetectionStrategy: CollisionDetection = args => {
    try {
      return closestCenter(args);
    } catch (err) {
      console.debug('collisionDetectionStrategy error, fallback to closestCenter:', err);
      return closestCenter(args);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.log('🎯 Drag iniciado:', active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    console.log('🎯 Drag over:', {
      active: active.id,
      over: over.id,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      console.log('🎯 Drag finalizado sem drop válido');
      return;
    }

    console.log('🎯 Drag finalizado:', {
      active: active.id,
      over: over.id,
      activeData: active.data.current,
      overData: over.data.current,
    });

    // Se for componente da sidebar sendo dropado no canvas
    if (active.data.current?.type === 'sidebar-component' && over.id === 'canvas-drop-zone') {
      const componentType = active.data.current.componentType;
      console.log('🎯 Adicionando componente ao canvas:', componentType);

      // Criar novo bloco
      const newBlock: Block = {
        id: `block-${Date.now()}`,
        type: componentType,
        content: {} as any,
        order: currentStepData.length,
        properties: {},
      };

      actions.addBlock(currentStepKey, newBlock);
      return;
    }

    // Se for reordenação de blocos dentro do canvas
    if (active.data.current?.sortable && over.data.current?.sortable) {
      const activeIndex = currentStepData.findIndex(block => block.id === active.id);
      const overIndex = currentStepData.findIndex(block => block.id === over.id);

      if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
        console.log('🎯 Reordenando blocos:', { activeIndex, overIndex });
        actions.reorderBlocks(currentStepKey, activeIndex, overIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={currentStepData.map(b => b.id || `block-${currentStepData.indexOf(b)}`)}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};
