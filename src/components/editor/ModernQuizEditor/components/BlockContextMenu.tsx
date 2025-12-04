/**
 * 🖱️ BlockContextMenu - Right-click context menu for blocks
 * 
 * Actions:
 * - Duplicate
 * - Delete
 * - Move up/down
 * - Copy/Cut/Paste
 * - Save to library
 */

import { memo, useCallback } from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { useEditorStore } from '../store/editorStore';
import { useQuizStore } from '../store/quizStore';
import { 
  Copy, 
  Scissors, 
  Clipboard, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  CopyPlus,
  BookMarked
} from 'lucide-react';

interface BlockContextMenuProps {
  children: React.ReactNode;
  blockId: string;
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
  canPaste?: boolean;
}

export const BlockContextMenu = memo(({ 
  children, 
  blockId,
  onCopy,
  onCut,
  onPaste,
  canPaste = false,
}: BlockContextMenuProps) => {
  const selectedStepId = useEditorStore((s) => s.selectedStepId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const openSaveToLibrary = useEditorStore((s) => s.openSaveToLibrary);

  const quiz = useQuizStore((s) => s.quiz);
  const deleteBlock = useQuizStore((s) => s.deleteBlock);
  const duplicateBlock = useQuizStore((s) => s.duplicateBlock);
  const reorderBlocks = useQuizStore((s) => s.reorderBlocks);

  // Get current block
  const getBlock = useCallback(() => {
    if (!quiz || !selectedStepId) return null;
    const step = quiz.steps?.find((s: any) => s.id === selectedStepId);
    return step?.blocks?.find((b: any) => b.id === blockId);
  }, [quiz, selectedStepId, blockId]);

  // Get block index
  const getBlockIndex = useCallback(() => {
    if (!quiz || !selectedStepId) return -1;
    const step = quiz.steps?.find((s: any) => s.id === selectedStepId);
    return step?.blocks?.findIndex((b: any) => b.id === blockId) ?? -1;
  }, [quiz, selectedStepId, blockId]);

  // Get total blocks
  const getTotalBlocks = useCallback(() => {
    if (!quiz || !selectedStepId) return 0;
    const step = quiz.steps?.find((s: any) => s.id === selectedStepId);
    return step?.blocks?.length ?? 0;
  }, [quiz, selectedStepId]);

  const handleDuplicate = useCallback(() => {
    if (!selectedStepId) return;
    duplicateBlock(selectedStepId, blockId);
  }, [selectedStepId, blockId, duplicateBlock]);

  const handleDelete = useCallback(() => {
    if (!selectedStepId) return;
    deleteBlock(selectedStepId, blockId);
    clearSelection();
  }, [selectedStepId, blockId, deleteBlock, clearSelection]);

  const handleMoveUp = useCallback(() => {
    if (!selectedStepId) return;
    const idx = getBlockIndex();
    if (idx <= 0) return;
    reorderBlocks(selectedStepId, idx, idx - 1);
  }, [selectedStepId, getBlockIndex, reorderBlocks]);

  const handleMoveDown = useCallback(() => {
    if (!selectedStepId) return;
    const idx = getBlockIndex();
    const total = getTotalBlocks();
    if (idx === -1 || idx >= total - 1) return;
    reorderBlocks(selectedStepId, idx, idx + 1);
  }, [selectedStepId, getBlockIndex, getTotalBlocks, reorderBlocks]);

  const handleSaveToLibrary = useCallback(() => {
    const block = getBlock();
    if (!block) return;
    openSaveToLibrary(block.type, block.properties || {});
  }, [getBlock, openSaveToLibrary]);

  const handleCopy = useCallback(() => {
    selectBlock(blockId);
    onCopy?.();
  }, [blockId, selectBlock, onCopy]);

  const handleCut = useCallback(() => {
    selectBlock(blockId);
    onCut?.();
  }, [blockId, selectBlock, onCut]);

  const blockIndex = getBlockIndex();
  const totalBlocks = getTotalBlocks();
  const canMoveUp = blockIndex > 0;
  const canMoveDown = blockIndex < totalBlocks - 1;

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        {children}
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content
          className="min-w-[200px] bg-popover border border-border rounded-lg shadow-lg p-1 z-50"
        >
          {/* Clipboard Actions */}
          <ContextMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted outline-none"
            onSelect={handleCopy}
          >
            <Copy className="w-4 h-4 text-muted-foreground" />
            Copiar
            <span className="ml-auto text-xs text-muted-foreground">⌘C</span>
          </ContextMenu.Item>

          <ContextMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted outline-none"
            onSelect={handleCut}
          >
            <Scissors className="w-4 h-4 text-muted-foreground" />
            Recortar
            <span className="ml-auto text-xs text-muted-foreground">⌘X</span>
          </ContextMenu.Item>

          <ContextMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            onSelect={onPaste}
            disabled={!canPaste}
          >
            <Clipboard className="w-4 h-4 text-muted-foreground" />
            Colar
            <span className="ml-auto text-xs text-muted-foreground">⌘V</span>
          </ContextMenu.Item>

          <ContextMenu.Separator className="h-px bg-border my-1" />

          {/* Block Actions */}
          <ContextMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted outline-none"
            onSelect={handleDuplicate}
          >
            <CopyPlus className="w-4 h-4 text-muted-foreground" />
            Duplicar
            <span className="ml-auto text-xs text-muted-foreground">⌘D</span>
          </ContextMenu.Item>

          <ContextMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted outline-none"
            onSelect={handleSaveToLibrary}
          >
            <BookMarked className="w-4 h-4 text-muted-foreground" />
            Salvar na biblioteca
          </ContextMenu.Item>

          <ContextMenu.Separator className="h-px bg-border my-1" />

          {/* Move Actions */}
          <ContextMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            onSelect={handleMoveUp}
            disabled={!canMoveUp}
          >
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
            Mover para cima
          </ContextMenu.Item>

          <ContextMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            onSelect={handleMoveDown}
            disabled={!canMoveDown}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
            Mover para baixo
          </ContextMenu.Item>

          <ContextMenu.Separator className="h-px bg-border my-1" />

          {/* Delete */}
          <ContextMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-destructive/10 text-destructive outline-none"
            onSelect={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
            Excluir
            <span className="ml-auto text-xs">Del</span>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
});

BlockContextMenu.displayName = 'BlockContextMenu';
