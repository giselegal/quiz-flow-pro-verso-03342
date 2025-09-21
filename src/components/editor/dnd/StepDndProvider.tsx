import React from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

/**
 * 🎯 WRAPPER SIMPLES SEM DND CONTEXT
 * 
 * Simplificado para usar apenas o DndContext do PureBuilderProvider
 * Remove aninhamento e conflitos de contexto
 */

interface StepDndProviderProps {
  stepNumber: number;
  children: React.ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragCancel?: () => void;
}

export const StepDndProvider: React.FC<StepDndProviderProps> = React.memo(({
  stepNumber,
  children,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onDragCancel: _onDragCancel
}) => {
  // 🎯 SIMPLIFICADO: Apenas wrapper sem DndContext duplicado
  // O DndContext é fornecido pelo PureBuilderProvider
  
  console.log('🔄 StepDndProvider wrapper para step:', stepNumber);

  return (
    <div data-step-wrapper={stepNumber} className="step-dnd-wrapper">
      {children}
    </div>
  );
});

// Display name for debugging
StepDndProvider.displayName = 'StepDndProvider';