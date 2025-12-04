/**
 * 🎹 useKeyboardShortcuts - Atalhos de teclado premium para o editor
 * 
 * Shortcuts:
 * - Ctrl+Z: Undo
 * - Ctrl+Y / Ctrl+Shift+Z: Redo
 * - Ctrl+S: Save
 * - Delete/Backspace: Delete block
 * - Ctrl+D: Duplicate block
 * - Escape: Clear selection
 * - Ctrl+A: Select all blocks
 * - Arrow Up/Down: Navigate blocks
 * - Ctrl+K: Open command palette
 */

import { useEffect, useCallback } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useQuizStore } from '../store/quizStore';

interface UseKeyboardShortcutsOptions {
  onSave?: () => void;
  onOpenCommandPalette?: () => void;
  disabled?: boolean;
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions = {}) {
  const { onSave, onOpenCommandPalette, disabled = false } = options;

  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectedBlockIds = useEditorStore((s) => s.selectedBlockIds);
  const selectedStepId = useEditorStore((s) => s.selectedStepId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const selectAllBlocks = useEditorStore((s) => s.selectAllBlocks);

  const quiz = useQuizStore((s) => s.quiz);
  const undo = useQuizStore((s) => s.undo);
  const redo = useQuizStore((s) => s.redo);
  const history = useQuizStore((s) => s.history);
  const historyIndex = useQuizStore((s) => s.historyIndex);
  const deleteBlock = useQuizStore((s) => s.deleteBlock);
  const duplicateBlock = useQuizStore((s) => s.duplicateBlock);

  // Computed values for undo/redo capability
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Get current step blocks
  const getCurrentStepBlocks = useCallback(() => {
    if (!quiz || !selectedStepId) return [];
    const step = quiz.steps?.find((s: any) => s.id === selectedStepId);
    return step?.blocks || [];
  }, [quiz, selectedStepId]);

  // Navigate to adjacent block
  const navigateBlock = useCallback((direction: 'up' | 'down') => {
    const blocks = getCurrentStepBlocks();
    if (blocks.length === 0) return;

    const currentIndex = blocks.findIndex((b: any) => b.id === selectedBlockId);
    
    if (currentIndex === -1) {
      // Select first or last block
      const targetBlock = direction === 'up' ? blocks[blocks.length - 1] : blocks[0];
      selectBlock(targetBlock.id);
      return;
    }

    const newIndex = direction === 'up' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(blocks.length - 1, currentIndex + 1);

    selectBlock(blocks[newIndex].id);
  }, [getCurrentStepBlocks, selectedBlockId, selectBlock]);

  // Delete selected blocks
  const handleDelete = useCallback(() => {
    if (!selectedStepId) return;

    const blocksToDelete = selectedBlockIds.length > 0 
      ? selectedBlockIds 
      : selectedBlockId 
        ? [selectedBlockId] 
        : [];

    blocksToDelete.forEach(blockId => {
      deleteBlock(selectedStepId, blockId);
    });

    clearSelection();
  }, [selectedStepId, selectedBlockId, selectedBlockIds, deleteBlock, clearSelection]);

  // Duplicate selected block
  const handleDuplicate = useCallback(() => {
    if (!selectedStepId || !selectedBlockId) return;
    duplicateBlock(selectedStepId, selectedBlockId);
  }, [selectedStepId, selectedBlockId, duplicateBlock]);

  // Main keyboard handler
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      // Ctrl+K - Command Palette
      if (isCtrlOrCmd && event.key === 'k') {
        event.preventDefault();
        onOpenCommandPalette?.();
        return;
      }

      // Ctrl+S - Save
      if (isCtrlOrCmd && event.key === 's') {
        event.preventDefault();
        onSave?.();
        return;
      }

      // Ctrl+Z - Undo
      if (isCtrlOrCmd && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) undo();
        return;
      }

      // Ctrl+Y or Ctrl+Shift+Z - Redo
      if ((isCtrlOrCmd && event.key === 'y') || (isCtrlOrCmd && event.shiftKey && event.key === 'z')) {
        event.preventDefault();
        if (canRedo) redo();
        return;
      }

      // Ctrl+A - Select all blocks
      if (isCtrlOrCmd && event.key === 'a') {
        event.preventDefault();
        if (selectedStepId) {
          const blocks = getCurrentStepBlocks();
          selectAllBlocks(blocks.map((b: any) => b.id));
        }
        return;
      }

      // Ctrl+D - Duplicate
      if (isCtrlOrCmd && event.key === 'd') {
        event.preventDefault();
        handleDuplicate();
        return;
      }

      // Delete/Backspace - Delete block
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedBlockId || selectedBlockIds.length > 0) {
          event.preventDefault();
          handleDelete();
        }
        return;
      }

      // Escape - Clear selection
      if (event.key === 'Escape') {
        event.preventDefault();
        clearSelection();
        return;
      }

      // Arrow Up - Navigate up
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        navigateBlock('up');
        return;
      }

      // Arrow Down - Navigate down
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        navigateBlock('down');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    disabled,
    onSave,
    onOpenCommandPalette,
    canUndo,
    canRedo,
    undo,
    redo,
    selectedBlockId,
    selectedBlockIds,
    selectedStepId,
    clearSelection,
    selectAllBlocks,
    getCurrentStepBlocks,
    handleDelete,
    handleDuplicate,
    navigateBlock,
  ]);

  return {
    shortcuts: {
      save: 'Ctrl+S',
      undo: 'Ctrl+Z',
      redo: 'Ctrl+Y',
      delete: 'Delete',
      duplicate: 'Ctrl+D',
      selectAll: 'Ctrl+A',
      escape: 'Escape',
      commandPalette: 'Ctrl+K',
      navigateUp: '↑',
      navigateDown: '↓',
    },
  };
}
