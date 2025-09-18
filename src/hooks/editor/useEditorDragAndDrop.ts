import { useCallback, useState } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { extractDragData, getDragFeedback, logDragEvent, normalizeOverId, validateDrop } from '@/utils/dragDropUtils';
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
    removeBlock?: (stepKey: string, blockId: string) => void;
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
      // Dados do alvo normalizados
      const overData: any = (over as any)?.data?.current ?? {};
      const overIsDropZone = overData?.type === 'dropzone';
      const overPosition = typeof overData?.position === 'number' ? (overData.position as number) : null;
      const rawOverId = over?.id != null ? String(over.id) : null;
      const overId = rawOverId ? normalizeOverId(rawOverId) : null;

      switch (validation.action) {
        case 'add':
          if (dragData.type === 'sidebar-component' && dragData.blockType) {
            const newBlock = createBlockFromComponent(dragData.blockType as any, currentStepData);
            if (overIsDropZone && overPosition != null && actions.addBlockAtIndex) {
              const index = Math.max(0, Math.min(currentStepData.length, overPosition));
              actions.addBlockAtIndex(currentStepKey, newBlock, index);
            } else if (overId) {
              const insertIndex = currentStepData.findIndex(block => String(block.id) === overId);
              if (insertIndex >= 0 && actions.addBlockAtIndex) {
                actions.addBlockAtIndex(currentStepKey, newBlock, insertIndex);
              } else {
                actions.addBlock?.(currentStepKey, newBlock);
              }
            } else {
              actions.addBlock?.(currentStepKey, newBlock);
            }
            actions.setSelectedBlockId?.(newBlock.id);
            notification?.success?.(`Componente ${dragData.blockType} adicionado!`);
          }
          break;
        case 'reorder':
          if (dragData.type === 'canvas-block') {
            const activeIndex = currentStepData.findIndex(block => String(block.id) === String(dragData.blockId));
            let targetIndex: number | null = null;
            if (overIsDropZone && overPosition != null) {
              targetIndex = Math.max(0, Math.min(currentStepData.length - 1, overPosition));
            } else if (overId) {
              const idx = currentStepData.findIndex(block => String(block.id) === overId);
              if (idx !== -1) targetIndex = idx;
            }
            if (activeIndex !== -1 && targetIndex !== null && activeIndex !== targetIndex) {
              actions.reorderBlocks?.(currentStepKey, activeIndex, targetIndex);
              notification?.info?.('Blocos reordenados');
            }
          }
          break;
        case 'move': {
          // Move entre etapas dentro do mesmo editor (quando detectado por validateDrop)
          const blockId = dragData.blockId;
          const block = dragData.block || currentStepData.find(b => String(b.id) === String(blockId));
          if (!block) break;
          const index = overIsDropZone && overPosition != null
            ? Math.max(0, Math.min(currentStepData.length, overPosition))
            : (overId ? currentStepData.findIndex(b => String(b.id) === overId) : currentStepData.length);

          if (actions.addBlockAtIndex) {
            actions.addBlockAtIndex(currentStepKey, block, Math.max(0, index));
          } else {
            actions.addBlock?.(currentStepKey, block);
          }
          // Remover do step de origem se disponível e diferente
          const sourceKey = (active.data.current as any)?.sourceStepKey as string | undefined;
          if (sourceKey && sourceKey !== currentStepKey && actions.removeBlock) {
            actions.removeBlock(sourceKey, String(block.id));
          }
          actions.setSelectedBlockId?.(String(block.id));
          notification?.info?.('Bloco movido');
          break;
        }
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
