import { useCallback, useState } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { extractDragData, getDragFeedback, logDragEvent, validateDrop } from '@/utils/dragDropUtils';
import type { Block } from '@/types/editor';
import { createBlockFromComponent } from '@/utils/editorUtils';
import { logger } from '@/utils/debugLogger';

export interface UseEditorDragAndDropParams {
  currentStepData: Block[];
  currentStepKey: string;
  actions: {
    addBlock?: (stepKey: string, block: Block) => void;
    addBlockAtIndex?: (stepKey: string, block: Block, index: number) => void;
    reorderBlocks?: (stepKey: string, from: number, to: number) => void;
    setSelectedBlockId?: (id: string | null) => void;
  };
  notification?: {
    success?: (msg: string) => void;
    info?: (msg: string) => void;
    warning?: (msg: string) => void;
    error?: (msg: string) => void;
  } | null;
}

export function useEditorDragAndDrop({ currentStepData, currentStepKey, actions, notification }: UseEditorDragAndDropParams) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const dragData = extractDragData(active);
    if (process.env.NODE_ENV === 'development') {
      logger.debug('🚀 DRAG START CAPTURADO!', {
        activeId: active.id,
        dragData,
        activeDataCurrent: active.data.current,
      });
    }
    setIsDragging(true);
    logDragEvent('start', active);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (process.env.NODE_ENV === 'development') {
      logger.debug('🏯 DRAG END CAPTURADO!', {
        activeId: active.id,
        overId: over?.id,
        overData: over?.data?.current,
      });
    }

    setIsDragging(false);

    if (!over) {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('❌ Drop cancelado - sem alvo');
      }
      const dragData = extractDragData(active);
      const feedback = getDragFeedback(dragData, {
        isValid: false,
        message: 'Sem alvo de drop',
      } as any);
      notification?.warning?.(feedback.message);
      return;
    }

    const validation = validateDrop(active, over, currentStepData);
    logDragEvent('end', active, over, validation);

    if (!validation.isValid) {
      const feedback = getDragFeedback(extractDragData(active), validation);
      notification?.warning?.(feedback.message);
      return;
    }

    const dragData = extractDragData(active);
    if (!dragData) {
      notification?.error?.('Dados de drag corrompidos');
      return;
    }

    try {
      switch (validation.action) {
        case 'add':
          if (dragData.type === 'sidebar-component' && dragData.blockType) {
            const newBlock = createBlockFromComponent(dragData.blockType as any, currentStepData);
            actions.addBlock?.(currentStepKey, newBlock);
            actions.setSelectedBlockId?.(newBlock.id);
            notification?.success?.(`Componente ${dragData.blockType} adicionado!`);
          }
          break;
        case 'reorder':
          if (dragData.type === 'canvas-block' && typeof over.id === 'string') {
            const activeIndex = currentStepData.findIndex(block => block.id === active.id);
            const overIndex = currentStepData.findIndex(block => block.id === over.id);
            if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
              actions.reorderBlocks?.(currentStepKey, activeIndex, overIndex);
              notification?.info?.('Blocos reordenados');
            }
          }
          break;
        default:
          if (process.env.NODE_ENV === 'development') logger.debug('Ação de drop não implementada:', (validation as any).action);
      }
    } catch (error) {
      logger.error('Erro durante drag & drop:', error);
      notification?.error?.('Erro ao processar drag & drop');
    }
  }, [actions, currentStepData, currentStepKey, notification]);

  return { isDragging, setIsDragging, handleDragStart, handleDragEnd } as const;
}

export default useEditorDragAndDrop;
