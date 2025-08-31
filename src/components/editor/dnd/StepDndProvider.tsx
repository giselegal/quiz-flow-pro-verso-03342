import React, { useMemo } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, rectIntersection, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { generateUniqueId } from '@/utils/generateUniqueId';

/**
 * 🎯 CONTEXTO DND ISOLADO POR ETAPA
 * 
 * Resolve conflitos de seleção entre etapas 2-21 isolando cada contexto DnD
 */

interface StepDndProviderProps {
  stepNumber: number;
  children: React.ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragCancel?: () => void;
}

export const StepDndProvider: React.FC<StepDndProviderProps> = ({
  stepNumber,
  children,
  onDragStart,
  onDragEnd,
  onDragCancel
}) => {
  // Sensores otimizados para performance
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Evita ativação acidental
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Algoritmo de colisão híbrido otimizado
  const collisionDetection = useMemo(() => {
    return (args: any) => {
      // Usar closestCenter para precisão em espaços pequenos
      const closestCenterCollisions = closestCenter(args);
      if (closestCenterCollisions.length > 0) {
        return closestCenterCollisions;
      }
      
      // Fallback para rectIntersection para áreas maiores
      return rectIntersection(args);
    };
  }, []);

  // Key única forçada para resetar contexto quando trocar de etapa
  const contextKey = useMemo(() => 
    generateUniqueId({ stepNumber, type: 'block' }), 
    [stepNumber]
  );

  return (
    <DndContext
      key={contextKey} // 🔑 CRÍTICO: Force context reset
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      {children}
    </DndContext>
  );
};