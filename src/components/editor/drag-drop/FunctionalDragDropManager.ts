/**
 * 🖱️ FUNCTIONAL DRAG AND DROP MANAGER
 * 
 * Sistema de arrastar e soltar integrado ao editor.
 * Resolve GARGALO #3: Sistema de reordenação incompleto
 * 
 * BENEFÍCIOS:
 * ✅ Arrastar e soltar intuitivo
 * ✅ Feedback visual de zonas de drop
 * ✅ Reordenação eficiente O(1) com Map
 * ✅ Animações suaves
 */

import React, { useState, useCallback, useRef } from 'react';
import type { StepsStore } from '../hooks/useStepsStore';

// 🎯 Estados do drag and drop
export type DragState = 'idle' | 'dragging' | 'dropping';

// 📦 Dados do item sendo arrastado
export interface DragData {
  stepId: string;
  stepType: string;
  startIndex: number;
  currentIndex: number;
}

// 🎨 Configuração visual do drag and drop
export interface DragDropConfig {
  dragHandleSelector: string;
  dropZoneSelector: string;
  dragPreviewClass: string;
  dragOverClass: string;
  animationDuration: number;
}

// ⚙️ Configuração padrão
const DEFAULT_CONFIG: DragDropConfig = {
  dragHandleSelector: '.drag-handle',
  dropZoneSelector: '.drop-zone',
  dragPreviewClass: 'dragging',
  dragOverClass: 'drag-over',
  animationDuration: 200
};

// 🎣 Hook principal para drag and drop
export function useFunctionalDragDrop(
  stepsStore: StepsStore,
  config: Partial<DragDropConfig> = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // 🎛️ Estados do drag and drop
  const [dragState, setDragState] = useState<DragState>('idle');
  const [dragData, setDragData] = useState<DragData | null>(null);
  const [dropZoneId, setDropZoneId] = useState<string | null>(null);
  
  // 📱 Refs para elementos DOM
  const dragPreviewRef = useRef<HTMLElement | null>(null);
  const dropZoneRefs = useRef<Map<string, HTMLElement>>(new Map());

  // 🚀 Iniciar drag
  const handleDragStart = useCallback((
    stepId: string,
    stepType: string,
    event: React.DragEvent
  ) => {
    const startIndex = stepsStore.stepOrder.indexOf(stepId);
    
    const dragData: DragData = {
      stepId,
      stepType,
      startIndex,
      currentIndex: startIndex
    };
    
    setDragState('dragging');
    setDragData(dragData);
    
    // Configurar dados de transferência
    event.dataTransfer.setData('application/json', JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = 'move';
    
    // Adicionar classe visual ao elemento
    const target = event.target as HTMLElement;
    target.classList.add(finalConfig.dragPreviewClass);
    dragPreviewRef.current = target;
    
    console.log(`🚀 Drag started for step: ${stepId}`);
  }, [stepsStore.stepOrder, finalConfig.dragPreviewClass]);

  // 🎯 Drag over (hover em zona de drop)
  const handleDragOver = useCallback((
    targetStepId: string,
    event: React.DragEvent
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    // Atualizar zona de drop ativa
    if (dropZoneId !== targetStepId) {
      setDropZoneId(targetStepId);
      
      // Adicionar feedback visual
      const targetElement = dropZoneRefs.current.get(targetStepId);
      if (targetElement) {
        targetElement.classList.add(finalConfig.dragOverClass);
      }
    }
  }, [dropZoneId, finalConfig.dragOverClass]);

  // 🚪 Drag leave (sair da zona de drop)
  const handleDragLeave = useCallback((
    targetStepId: string,
    event: React.DragEvent
  ) => {
    // Verificar se realmente saiu da zona (não apenas mudou elemento filho)
    const targetElement = dropZoneRefs.current.get(targetStepId);
    if (targetElement && !targetElement.contains(event.relatedTarget as Node)) {
      targetElement.classList.remove(finalConfig.dragOverClass);
      
      if (dropZoneId === targetStepId) {
        setDropZoneId(null);
      }
    }
  }, [dropZoneId, finalConfig.dragOverClass]);

  // 📥 Drop (soltar)
  const handleDrop = useCallback((
    targetStepId: string,
    event: React.DragEvent
  ) => {
    event.preventDefault();
    
    try {
      const transferData = event.dataTransfer.getData('application/json');
      const dropData: DragData = JSON.parse(transferData);
      
      if (dropData.stepId === targetStepId) {
        console.log('🚫 Drop on same element, ignoring');
        return;
      }
      
      setDragState('dropping');
      
      // 🔄 Executar reordenação no store
      stepsStore.reorderStep(dropData.stepId, targetStepId);
      
      console.log(`📥 Dropped step ${dropData.stepId} onto ${targetStepId}`);
      
      // ✨ Animação de sucesso
      setTimeout(() => {
        setDragState('idle');
        setDragData(null);
        setDropZoneId(null);
      }, finalConfig.animationDuration);
      
    } catch (error) {
      console.error('❌ Error handling drop:', error);
      setDragState('idle');
      setDragData(null);
      setDropZoneId(null);
    }
  }, [stepsStore, finalConfig.animationDuration]);

  // 🔚 Finalizar drag
  const handleDragEnd = useCallback((event: React.DragEvent) => {
    // Limpar classes visuais
    if (dragPreviewRef.current) {
      dragPreviewRef.current.classList.remove(finalConfig.dragPreviewClass);
      dragPreviewRef.current = null;
    }
    
    // Limpar todas as zonas de drop
    dropZoneRefs.current.forEach(element => {
      element.classList.remove(finalConfig.dragOverClass);
    });
    
    // Reset state se não foi drop bem-sucedido
    if (dragState !== 'dropping') {
      setDragState('idle');
      setDragData(null);
      setDropZoneId(null);
    }
    
    console.log('🔚 Drag ended');
  }, [dragState, finalConfig.dragPreviewClass, finalConfig.dragOverClass]);

  // 📌 Registrar zona de drop
  const registerDropZone = useCallback((stepId: string, element: HTMLElement) => {
    dropZoneRefs.current.set(stepId, element);
  }, []);

  // 🗑️ Desregistrar zona de drop
  const unregisterDropZone = useCallback((stepId: string) => {
    dropZoneRefs.current.delete(stepId);
  }, []);

  // 🎯 Props para elemento arrastável
  const getDraggableProps = useCallback((stepId: string, stepType: string) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => handleDragStart(stepId, stepType, e),
    onDragEnd: handleDragEnd,
    'data-step-id': stepId,
    'data-step-type': stepType
  }), [handleDragStart, handleDragEnd]);

  // 🎯 Props para zona de drop
  const getDropZoneProps = useCallback((stepId: string) => ({
    onDragOver: (e: React.DragEvent) => handleDragOver(stepId, e),
    onDragLeave: (e: React.DragEvent) => handleDragLeave(stepId, e),
    onDrop: (e: React.DragEvent) => handleDrop(stepId, e),
    'data-drop-zone': stepId,
    className: dropZoneId === stepId ? finalConfig.dragOverClass : ''
  }), [handleDragOver, handleDragLeave, handleDrop, dropZoneId, finalConfig.dragOverClass]);

  return {
    // Estados
    dragState,
    dragData,
    dropZoneId,
    
    // Handlers
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    
    // Utilitários
    registerDropZone,
    unregisterDropZone,
    getDraggableProps,
    getDropZoneProps,
    
    // Status
    isDragging: dragState === 'dragging',
    isDropping: dragState === 'dropping'
  };
}

// 🎨 Componente de handle de drag visual
interface DragHandleProps {
  stepId: string;
  stepType: string;
  onDragStart: (stepId: string, stepType: string, event: React.DragEvent) => void;
  className?: string;
}

export const DragHandle: React.FC<DragHandleProps> = ({
  stepId,
  stepType,
  onDragStart,
  className = ''
}) => {
  return (
    <div
      className={`drag-handle cursor-move p-1 hover:bg-gray-200 rounded ${className}`}
      draggable
      onDragStart={(e) => onDragStart(stepId, stepType, e)}
      title="Arrastar para reordenar"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 3C6 2.44772 5.55228 2 5 2C4.44772 2 4 2.44772 4 3C4 3.55228 4.44772 4 5 4C5.55228 4 6 3.55228 6 3Z"
          fill="currentColor"
        />
        <path
          d="M12 3C12 2.44772 11.5523 2 11 2C10.4477 2 10 2.44772 10 3C10 3.55228 10.4477 4 11 4C11.5523 4 12 3.55228 12 3Z"
          fill="currentColor"
        />
        <path
          d="M6 8C6 7.44772 5.55228 7 5 7C4.44772 7 4 7.44772 4 8C4 8.55228 4.44772 9 5 9C5.55228 9 6 8.55228 6 8Z"
          fill="currentColor"
        />
        <path
          d="M12 8C12 7.44772 11.5523 7 11 7C10.4477 7 10 7.44772 10 8C10 8.55228 10.4477 9 11 9C11.5523 9 12 8.55228 12 8Z"
          fill="currentColor"
        />
        <path
          d="M6 13C6 12.4477 5.55228 12 5 12C4.44772 12 4 12.4477 4 13C4 13.5523 4.44772 14 5 14C5.55228 14 6 13.5523 6 13Z"
          fill="currentColor"
        />
        <path
          d="M12 13C12 12.4477 11.5523 12 11 12C10.4477 12 10 12.4477 10 13C10 13.5523 10.4477 14 11 14C11.5523 14 12 13.5523 12 13Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};