import { Block } from '@/types/editor';
import { DragData, extractDragData, validateDrop } from '@/utils/dragDropUtils';
import { Active, Over } from '@dnd-kit/core';
import { useCallback, useState } from 'react';

interface UseDragDropStateReturn {
  isDragActive: boolean;
  activeDragData: DragData | null;
  isValidDrop: boolean;
  dropFeedback: string;
  handleDragStart: (active: Active) => void;
  handleDragOver: (active: Active, over: Over | null, currentStepData: Block[]) => void;
  handleDragEnd: () => void;
}

/**
 * Hook customizado para gerenciar estado de drag and drop
 */
export const useDragDropState = (): UseDragDropStateReturn => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [activeDragData, setActiveDragData] = useState<DragData | null>(null);
  const [isValidDrop, setIsValidDrop] = useState(false);
  const [dropFeedback, setDropFeedback] = useState('');

  const handleDragStart = useCallback((active: Active) => {
    const dragData = extractDragData(active);
    setIsDragActive(true);
    setActiveDragData(dragData);
    setIsValidDrop(false);
    setDropFeedback('');
  }, []);

  const handleDragOver = useCallback(
    (active: Active, over: Over | null, currentStepData: Block[]) => {
      const validation = validateDrop(active, over, currentStepData);
      setIsValidDrop(validation.isValid);
      setDropFeedback(validation.reason || '');
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setIsDragActive(false);
    setActiveDragData(null);
    setIsValidDrop(false);
    setDropFeedback('');
  }, []);

  return {
    isDragActive,
    activeDragData,
    isValidDrop,
    dropFeedback,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
