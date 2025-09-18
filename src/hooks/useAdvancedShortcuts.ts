import { useCallback, useEffect, useRef } from 'react';

export interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  description?: string;
}

export interface ShortcutHandler {
  (event: KeyboardEvent): void;
}

export interface UseAdvancedShortcutsProps {
  shortcuts: Record<string, ShortcutConfig & { handler: ShortcutHandler }>;
  enabled?: boolean;
  target?: HTMLElement | Document;
}

export const useAdvancedShortcuts = ({
  shortcuts,
  enabled = true,
  target = document,
}: UseAdvancedShortcutsProps) => {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback(
    (event: Event) => {
      if (!enabled) return;

      const keyEvent = event as KeyboardEvent;

      // Ignorar se estiver em input/textarea
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      // Procurar shortcut correspondente
      for (const [name, config] of Object.entries(shortcutsRef.current)) {
        const {
          key,
          ctrlKey = false,
          shiftKey = false,
          altKey = false,
          metaKey = false,
          preventDefault = true,
          stopPropagation = true,
          handler,
        } = config;

        // Verificar se as teclas modificadoras correspondem
        const modifiersMatch =
          keyEvent.ctrlKey === ctrlKey &&
          keyEvent.shiftKey === shiftKey &&
          keyEvent.altKey === altKey &&
          keyEvent.metaKey === metaKey;

        // Verificar se a tecla principal corresponde
        const keyMatches = keyEvent.key.toLowerCase() === key.toLowerCase();

        if (modifiersMatch && keyMatches) {
          if (preventDefault) keyEvent.preventDefault();
          if (stopPropagation) keyEvent.stopPropagation();

          try {
            handler(keyEvent);
          } catch (error) {
            console.error(`Erro ao executar shortcut "${name}":`, error);
          }
          break;
        }
      }
    },
    [enabled]
  );

  useEffect(() => {
    const targetElement = target as HTMLElement | Document;
    targetElement.addEventListener('keydown', handleKeyDown);

    return () => {
      targetElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [target, handleKeyDown]);

  // 📝 Obter lista de shortcuts ativos
  const getActiveShortcuts = useCallback(() => {
    return Object.entries(shortcutsRef.current).map(([name, config]) => ({
      name,
      ...config,
    }));
  }, []);

  // 🔍 Obter descrição formatada do shortcut
  const formatShortcut = useCallback((config: ShortcutConfig) => {
    const parts: string[] = [];

    if (config.ctrlKey) parts.push('Ctrl');
    if (config.shiftKey) parts.push('Shift');
    if (config.altKey) parts.push('Alt');
    if (config.metaKey) parts.push('Cmd');

    parts.push(config.key.toUpperCase());

    return parts.join(' + ');
  }, []);

  return {
    getActiveShortcuts,
    formatShortcut,
  };
};

// 🎯 Hook específico para EditorPro P3
export const useEditorP3Shortcuts = ({
  onUndo,
  onRedo,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  onDuplicateSelected,
  onCopy,
  onPaste,
  enabled = true,
}: {
  onUndo?: () => void;
  onRedo?: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onDeleteSelected?: () => void;
  onDuplicateSelected?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  enabled?: boolean;
}) => {
  const shortcuts = {
    undo: {
      key: 'z',
      ctrlKey: true,
      description: 'Desfazer última ação',
      handler: () => onUndo?.(),
    },
    redo: {
      key: 'y',
      ctrlKey: true,
      description: 'Refazer ação',
      handler: () => onRedo?.(),
    },
    redoAlt: {
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      description: 'Refazer ação (alternativo)',
      handler: () => onRedo?.(),
    },
    selectAll: {
      key: 'a',
      ctrlKey: true,
      description: 'Selecionar todos os blocos',
      handler: () => onSelectAll?.(),
    },
    deselectAll: {
      key: 'Escape',
      description: 'Desselecionar todos',
      handler: () => onDeselectAll?.(),
    },
    delete: {
      key: 'Delete',
      description: 'Excluir blocos selecionados',
      handler: () => onDeleteSelected?.(),
    },
    duplicate: {
      key: 'd',
      ctrlKey: true,
      description: 'Duplicar blocos selecionados',
      handler: () => onDuplicateSelected?.(),
    },
    copy: {
      key: 'c',
      ctrlKey: true,
      description: 'Copiar blocos selecionados',
      handler: () => onCopy?.(),
    },
    paste: {
      key: 'v',
      ctrlKey: true,
      description: 'Colar blocos',
      handler: () => onPaste?.(),
    },
  };

  return useAdvancedShortcuts({
    shortcuts,
    enabled,
  });
};

export default useAdvancedShortcuts;
