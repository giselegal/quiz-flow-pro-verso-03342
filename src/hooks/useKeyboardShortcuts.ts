// =====================================================================
// hooks/useKeyboardShortcuts.ts - Hook para atalhos de teclado
// =====================================================================

import { useEffect } from 'react';

interface KeyboardShortcuts {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Verificar se está em um campo de entrada
      const target = event.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true';

      // Ctrl/Cmd + Z (Undo)
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        if (!isInputField && shortcuts.onUndo) {
          event.preventDefault();
          shortcuts.onUndo();
        }
      }

      // Ctrl/Cmd + Y ou Ctrl/Cmd + Shift + Z (Redo)
      if (((event.ctrlKey || event.metaKey) && event.key === 'y') ||
          ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Z')) {
        if (!isInputField && shortcuts.onRedo) {
          event.preventDefault();
          shortcuts.onRedo();
        }
      }

      // Ctrl/Cmd + S (Save)
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        if (shortcuts.onSave) {
          event.preventDefault();
          shortcuts.onSave();
        }
      }

      // Ctrl/Cmd + C (Copy)
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        if (!isInputField && shortcuts.onCopy) {
          event.preventDefault();
          shortcuts.onCopy();
        }
      }

      // Ctrl/Cmd + V (Paste)
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        if (!isInputField && shortcuts.onPaste) {
          event.preventDefault();
          shortcuts.onPaste();
        }
      }

      // Delete (Delete)
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (!isInputField && shortcuts.onDelete) {
          event.preventDefault();
          shortcuts.onDelete();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};
