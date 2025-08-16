import { useEffect } from 'react';

interface KeyboardShortcutsOptions {
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  hasSelectedBlock?: boolean;
}

export const useKeyboardShortcuts = (options: KeyboardShortcutsOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Z para desfazer
      if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (options.canUndo && options.onUndo) {
          options.onUndo();
        }
      }

      // Ctrl+Y ou Ctrl+Shift+Z para refazer
      if ((event.ctrlKey && event.key === 'y') || (event.ctrlKey && event.shiftKey && event.key === 'z')) {
        event.preventDefault();
        if (options.canRedo && options.onRedo) {
          options.onRedo();
        }
      }

      // Delete para deletar bloco selecionado
      if (event.key === 'Delete' && options.hasSelectedBlock) {
        event.preventDefault();
        if (options.onDelete) {
          options.onDelete();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [options]);

  return null;
};

export default useKeyboardShortcuts;