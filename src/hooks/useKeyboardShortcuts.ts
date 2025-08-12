/**
 * 🎹 useKeyboardShortcuts - Sistema de atalhos para o painel de propriedades
 * Implementa atalhos Ctrl+Z, Ctrl+Y, Delete para melhor UX
 */

import { useEffect } from "react";

interface UseKeyboardShortcutsOptions {
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  hasSelectedBlock?: boolean;
  disabled?: boolean;
}

export const useKeyboardShortcuts = (options: UseKeyboardShortcutsOptions) => {
  const {
    onUndo,
    onRedo,
    onDelete,
    canUndo = false,
    canRedo = false,
    hasSelectedBlock = false,
    disabled = false,
  } = options;

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      const isCtrl = event.ctrlKey || event.metaKey;

      // Ctrl+Z - Undo
      if (isCtrl && event.key === "z" && !event.shiftKey) {
        event.preventDefault();
        if (canUndo && onUndo) {
          onUndo();
        }
        return;
      }

      // Ctrl+Y ou Ctrl+Shift+Z - Redo
      if ((isCtrl && event.key === "y") || (isCtrl && event.shiftKey && event.key === "z")) {
        event.preventDefault();
        if (canRedo && onRedo) {
          onRedo();
        }
        return;
      }

      // Delete - Delete selected block
      if (event.key === "Delete" || event.key === "Backspace") {
        if (hasSelectedBlock && onDelete) {
          event.preventDefault();
          onDelete();
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onUndo, onRedo, onDelete, canUndo, canRedo, hasSelectedBlock, disabled]);

  return {
    shortcuts: {
      undo: canUndo ? "Ctrl+Z" : null,
      redo: canRedo ? "Ctrl+Y" : null,
      delete: hasSelectedBlock ? "Delete" : null,
    },
  };
};

export default useKeyboardShortcuts;
