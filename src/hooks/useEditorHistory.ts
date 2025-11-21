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
// Migrado para SuperUnifiedProvider: removendo dependência do provider canônico
import { useEditorState } from '@/contexts/editor/EditorStateProvider';
import { editorMetrics } from '@/lib/utils/editorMetrics';
import { appLogger } from '@/lib/utils/appLogger';

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
  const superUnified = useEditorState();

  // Novo histórico unificado via SuperUnifiedProvider (usa undo/redo internos)
  const { undo: providerUndo, redo: providerRedo, canUndo: providerCanUndo, canRedo: providerCanRedo } = superUnified;

  // stepBlocks agora é indexado por número; adaptar caso futuro precise
  const getAllStepBlocksSnapshot = useCallback(() => {
    return superUnified.state.editor.stepBlocks;
  }, [superUnified.state.editor.stepBlocks]);

  // Placeholder para compat: tamanho do histórico não exposto diretamente
  const historySize = 0; // Poderá ser integrado a useUnifiedHistory se necessário

  // Estado do histórico
  const historyState: EditorHistoryState = useMemo(() => ({
    canUndo: providerCanUndo,
    canRedo: providerCanRedo,
    historySize,
    currentIndex: -1,
  }), [providerCanUndo, providerCanRedo, historySize]);

  /**
   * Desfazer última ação
   */
  const undo = useCallback(() => {
    if (!providerCanUndo) {
      appLogger.warn('[useEditorHistory] Não há ações para desfazer');
      return;
    }
    const startTime = performance.now();
    providerUndo();
    const duration = performance.now() - startTime;
    editorMetrics.trackUndoRedo('undo', { historySize, durationMs: duration });
    if (import.meta.env.DEV) {
      appLogger.info('↩️ [useEditorHistory] Undo executado', { data: [{ duration: `${duration.toFixed(2)}ms`, historySize }] });
    }
  }, [providerCanUndo, providerUndo, historySize]);

  /**
   * Refazer última ação desfeita
   */
  const redo = useCallback(() => {
    if (!providerCanRedo) {
      appLogger.warn('[useEditorHistory] Não há ações para refazer');
      return;
    }
    const startTime = performance.now();
    providerRedo();
    const duration = performance.now() - startTime;
    editorMetrics.trackUndoRedo('redo', { historySize, durationMs: duration });
    if (import.meta.env.DEV) {
      appLogger.info('↪️ [useEditorHistory] Redo executado', { data: [{ duration: `${duration.toFixed(2)}ms`, historySize }] });
    }
  }, [providerCanRedo, providerRedo, historySize]);

  /**
   * Limpar todo o histórico
   */
  const clear = useCallback(() => {
    // Sem API nativa de clear no provider; placeholder para futura integração
    if (import.meta.env.DEV) {
      appLogger.info('🗑️ [useEditorHistory] Clear não implementado em SuperUnifiedProvider');
    }
  }, []);

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
