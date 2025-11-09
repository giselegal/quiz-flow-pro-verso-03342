/**
 * 🔄 USE EDITOR HISTORY HOOK - FASE 6
 * 
 * Hook customizado para gerenciar undo/redo no editor
 * Conecta-se ao EditorHistoryService e fornece interface simplificada
 * 
 * @version 1.0.0
 * @phase FASE 6 - UI Undo/Redo
 */

import { useCallback, useMemo, useEffect } from 'react';
import { useEditorContext } from '@/components/editor/EditorProviderCanonical';
import { editorMetrics } from '@/lib/utils/editorMetrics';

export interface EditorHistoryState {
  canUndo: boolean;
  canRedo: boolean;
  historySize: number;
  currentIndex: number;
}

export interface UseEditorHistoryReturn extends EditorHistoryState {
  undo: () => void;
  redo: () => void;
  clear: () => void;
}

/**
 * Hook para gerenciar histórico de undo/redo do editor
 * 
 * @example
 * ```tsx
 * function EditorToolbar() {
 *   const { canUndo, canRedo, undo, redo } = useEditorHistory();
 *   
 *   return (
 *     <div>
 *       <button onClick={undo} disabled={!canUndo}>Undo</button>
 *       <button onClick={redo} disabled={!canRedo}>Redo</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useEditorHistory(): UseEditorHistoryReturn {
  const context = useEditorContext();
  
  if (!context) {
    throw new Error('useEditorHistory deve ser usado dentro de EditorProviderCanonical');
  }

  const { history, stepBlocks, updateStepBlocks } = context;

  // Estado do histórico
  const historyState: EditorHistoryState = useMemo(() => ({
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    historySize: history.size,
    currentIndex: -1, // HistoryService não expõe currentIndex publicamente
  }), [history]);

  /**
   * Desfazer última ação
   */
  const undo = useCallback(() => {
    if (!history.canUndo) {
      console.warn('[useEditorHistory] Não há ações para desfazer');
      return;
    }

    const startTime = performance.now();
    const previousState = history.undo();
    
    if (previousState) {
      // Atualizar estado do editor
      updateStepBlocks(previousState.stepBlocks);
      
      // Track telemetria
      const duration = performance.now() - startTime;
      editorMetrics.trackUndoRedo('undo', {
        historySize: history.size,
        durationMs: duration,
      });

      if (import.meta.env.DEV) {
        console.log('↩️ [useEditorHistory] Undo executado', {
          duration: `${duration.toFixed(2)}ms`,
          historySize: history.size,
        });
      }
    }
  }, [history, updateStepBlocks]);

  /**
   * Refazer última ação desfeita
   */
  const redo = useCallback(() => {
    if (!history.canRedo) {
      console.warn('[useEditorHistory] Não há ações para refazer');
      return;
    }

    const startTime = performance.now();
    const nextState = history.redo();
    
    if (nextState) {
      // Atualizar estado do editor
      updateStepBlocks(nextState.stepBlocks);
      
      // Track telemetria
      const duration = performance.now() - startTime;
      editorMetrics.trackUndoRedo('redo', {
        historySize: history.size,
        durationMs: duration,
      });

      if (import.meta.env.DEV) {
        console.log('↪️ [useEditorHistory] Redo executado', {
          duration: `${duration.toFixed(2)}ms`,
          historySize: history.size,
        });
      }
    }
  }, [history, updateStepBlocks]);

  /**
   * Limpar todo o histórico
   */
  const clear = useCallback(() => {
    history.clear();
    
    if (import.meta.env.DEV) {
      console.log('🗑️ [useEditorHistory] Histórico limpo');
    }
  }, [history]);

  /**
   * Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)
   * Suporte cross-platform (Cmd no Mac)
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      // Ignorar se estiver em campo de input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl+Z / Cmd+Z - Undo
      if (cmdOrCtrl && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      }

      // Ctrl+Y / Cmd+Y - Redo
      if (cmdOrCtrl && event.key === 'y') {
        event.preventDefault();
        redo();
      }

      // Ctrl+Shift+Z / Cmd+Shift+Z - Redo (alternativo)
      if (cmdOrCtrl && event.key === 'z' && event.shiftKey) {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);

  return {
    ...historyState,
    undo,
    redo,
    clear,
  };
}

/**
 * Hook opcional que retorna null se não estiver dentro do contexto
 * Útil para componentes que podem ou não ter histórico
 */
export function useOptionalEditorHistory(): UseEditorHistoryReturn | null {
  try {
    return useEditorHistory();
  } catch {
    return null;
  }
}
