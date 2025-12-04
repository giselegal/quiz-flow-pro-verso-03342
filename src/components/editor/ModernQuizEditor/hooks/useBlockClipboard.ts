/**
 * 📋 useBlockClipboard - Clipboard operations for blocks
 * 
 * Features:
 * - Ctrl+C: Copy block(s)
 * - Ctrl+X: Cut block(s)
 * - Ctrl+V: Paste block(s)
 * - Multi-block copy/paste support
 */

import { useCallback, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useQuizStore } from '../store/quizStore';

const CLIPBOARD_KEY = 'quiz-editor-clipboard';

interface ClipboardData {
  blocks: any[];
  copiedAt: number;
}

export function useBlockClipboard(disabled = false) {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectedBlockIds = useEditorStore((s) => s.selectedBlockIds);
  const selectedStepId = useEditorStore((s) => s.selectedStepId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const clearSelection = useEditorStore((s) => s.clearSelection);

  const quiz = useQuizStore((s) => s.quiz);
  const addBlock = useQuizStore((s) => s.addBlock);
  const deleteBlock = useQuizStore((s) => s.deleteBlock);

  // Get block by ID
  const getBlockById = useCallback((blockId: string) => {
    if (!quiz) return null;
    for (const step of quiz.steps || []) {
      const block = step.blocks?.find((b: any) => b.id === blockId);
      if (block) return block;
    }
    return null;
  }, [quiz]);

  // Copy blocks to clipboard
  const copyBlocks = useCallback(() => {
    const blockIdsToCopy = selectedBlockIds.length > 0 
      ? selectedBlockIds 
      : selectedBlockId 
        ? [selectedBlockId] 
        : [];

    if (blockIdsToCopy.length === 0) return false;

    const blocks = blockIdsToCopy
      .map(id => getBlockById(id))
      .filter(Boolean);

    if (blocks.length === 0) return false;

    const clipboardData: ClipboardData = {
      blocks,
      copiedAt: Date.now(),
    };

    localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(clipboardData));
    console.log('📋 Copiado:', blocks.length, 'bloco(s)');
    return true;
  }, [selectedBlockId, selectedBlockIds, getBlockById]);

  // Cut blocks (copy + delete)
  const cutBlocks = useCallback(() => {
    if (!selectedStepId) return false;

    const success = copyBlocks();
    if (!success) return false;

    const blockIdsToDelete = selectedBlockIds.length > 0 
      ? selectedBlockIds 
      : selectedBlockId 
        ? [selectedBlockId] 
        : [];

    blockIdsToDelete.forEach(blockId => {
      deleteBlock(selectedStepId, blockId);
    });

    clearSelection();
    console.log('✂️ Cortado:', blockIdsToDelete.length, 'bloco(s)');
    return true;
  }, [selectedStepId, selectedBlockId, selectedBlockIds, copyBlocks, deleteBlock, clearSelection]);

  // Paste blocks from clipboard
  const pasteBlocks = useCallback(() => {
    if (!selectedStepId) return false;

    const stored = localStorage.getItem(CLIPBOARD_KEY);
    if (!stored) {
      console.warn('📋 Clipboard vazio');
      return false;
    }

    try {
      const clipboardData: ClipboardData = JSON.parse(stored);
      
      // Check if clipboard is too old (1 hour)
      if (Date.now() - clipboardData.copiedAt > 3600000) {
        console.warn('📋 Clipboard expirado');
        localStorage.removeItem(CLIPBOARD_KEY);
        return false;
      }

      let lastBlockId: string | null = null;

      clipboardData.blocks.forEach((block, index) => {
        // Calculate order for new block
        const currentBlocksCount = quiz?.steps?.find((s: any) => s.id === selectedStepId)?.blocks?.length || 0;
        const newOrder = currentBlocksCount + index + 1;
        
        // addBlock creates a new block with the type and order
        addBlock(selectedStepId, block.type, newOrder);
        
        // Get the newly created block and update its properties
        const updatedQuiz = useQuizStore.getState().quiz;
        const step = updatedQuiz?.steps?.find((s: any) => s.id === selectedStepId);
        const newBlock = step?.blocks?.[step.blocks.length - 1];
        
        if (newBlock && block.properties) {
          useQuizStore.getState().updateBlock(selectedStepId, newBlock.id, block.properties);
        }
        
        lastBlockId = newBlock?.id || null;
      });

      // Select last pasted block
      if (lastBlockId) {
        selectBlock(lastBlockId);
      }

      console.log('📋 Colado:', clipboardData.blocks.length, 'bloco(s)');
      return true;
    } catch (error) {
      console.error('❌ Erro ao colar:', error);
      return false;
    }
  }, [selectedStepId, quiz, addBlock, selectBlock]);

  // Check if clipboard has content
  const hasClipboardContent = useCallback(() => {
    const stored = localStorage.getItem(CLIPBOARD_KEY);
    if (!stored) return false;

    try {
      const clipboardData: ClipboardData = JSON.parse(stored);
      return Date.now() - clipboardData.copiedAt < 3600000;
    } catch {
      return false;
    }
  }, []);

  // Keyboard handler
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      // Ctrl+C - Copy
      if (isCtrlOrCmd && event.key === 'c') {
        if (selectedBlockId || selectedBlockIds.length > 0) {
          event.preventDefault();
          copyBlocks();
        }
        return;
      }

      // Ctrl+X - Cut
      if (isCtrlOrCmd && event.key === 'x') {
        if (selectedBlockId || selectedBlockIds.length > 0) {
          event.preventDefault();
          cutBlocks();
        }
        return;
      }

      // Ctrl+V - Paste
      if (isCtrlOrCmd && event.key === 'v') {
        if (hasClipboardContent()) {
          event.preventDefault();
          pasteBlocks();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    disabled,
    selectedBlockId,
    selectedBlockIds,
    copyBlocks,
    cutBlocks,
    pasteBlocks,
    hasClipboardContent,
  ]);

  return {
    copyBlocks,
    cutBlocks,
    pasteBlocks,
    hasClipboardContent,
  };
}
