import { useCallback, useRef, useState } from 'react';

export interface EditorAction {
  type: 'add' | 'delete' | 'move' | 'edit' | 'bulk';
  timestamp: number;
  data: {
    stepKey?: string;
    blockId?: string;
    blockIds?: string[];
    fromIndex?: number;
    toIndex?: number;
    fromStep?: string;
    toStep?: string;
    oldValue?: any;
    newValue?: any;
    blocks?: any[];
  };
  undo: () => void;
  redo: () => void;
}

export interface UndoRedoState {
  history: EditorAction[];
  currentIndex: number;
  maxHistorySize: number;
}

export const useUndoRedo = (maxHistorySize: number = 50) => {
  const [state, setState] = useState<UndoRedoState>({
    history: [],
    currentIndex: -1,
    maxHistorySize,
  });

  const isUndoing = useRef(false);
  const isRedoing = useRef(false);

  // 🚀 Adicionar ação ao histórico
  const addAction = useCallback((action: Omit<EditorAction, 'timestamp'>) => {
    if (isUndoing.current || isRedoing.current) return;

    setState(prev => {
      const newHistory = prev.history.slice(0, prev.currentIndex + 1);
      const newAction: EditorAction = {
        ...action,
        timestamp: Date.now(),
      };

      newHistory.push(newAction);

      // Limitar tamanho do histórico
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }

      return {
        ...prev,
        history: newHistory,
        currentIndex: newHistory.length - 1,
      };
    });
  }, [maxHistorySize]);

  // 🔄 Desfazer última ação
  const undo = useCallback(() => {
    if (state.currentIndex < 0) return;

    const action = state.history[state.currentIndex];
    if (!action) return;

    isUndoing.current = true;
    try {
      action.undo();
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
      }));
    } catch (error) {
      console.error('Erro ao desfazer ação:', error);
    } finally {
      isUndoing.current = false;
    }
  }, [state.currentIndex, state.history]);

  // ↩️ Refazer próxima ação
  const redo = useCallback(() => {
    if (state.currentIndex >= state.history.length - 1) return;

    const nextIndex = state.currentIndex + 1;
    const action = state.history[nextIndex];
    if (!action) return;

    isRedoing.current = true;
    try {
      action.redo();
      setState(prev => ({
        ...prev,
        currentIndex: nextIndex,
      }));
    } catch (error) {
      console.error('Erro ao refazer ação:', error);
    } finally {
      isRedoing.current = false;
    }
  }, [state.currentIndex, state.history]);

  // 🗑️ Limpar histórico
  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      history: [],
      currentIndex: -1,
    }));
  }, []);

  // 📊 Estado do sistema
  const canUndo = state.currentIndex >= 0;
  const canRedo = state.currentIndex < state.history.length - 1;
  const historySize = state.history.length;

  // 📝 Obter descrição da última ação
  const getLastActionDescription = useCallback(() => {
    if (state.currentIndex < 0) return null;
    const action = state.history[state.currentIndex];
    if (!action) return null;

    switch (action.type) {
      case 'add':
        return `Adicionar bloco`;
      case 'delete':
        return `Excluir bloco${action.data.blockIds?.length > 1 ? 's' : ''}`;
      case 'move':
        return `Mover bloco${action.data.blockIds?.length > 1 ? 's' : ''}`;
      case 'edit':
        return `Editar bloco`;
      case 'bulk':
        return `Ação em lote`;
      default:
        return 'Ação desconhecida';
    }
  }, [state.currentIndex, state.history]);

  // 📝 Obter descrição da próxima ação
  const getNextActionDescription = useCallback(() => {
    const nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.history.length) return null;
    
    const action = state.history[nextIndex];
    if (!action) return null;

    switch (action.type) {
      case 'add':
        return `Refazer: Adicionar bloco`;
      case 'delete':
        return `Refazer: Excluir bloco${action.data.blockIds?.length > 1 ? 's' : ''}`;
      case 'move':
        return `Refazer: Mover bloco${action.data.blockIds?.length > 1 ? 's' : ''}`;
      case 'edit':
        return `Refazer: Editar bloco`;
      case 'bulk':
        return `Refazer: Ação em lote`;
      default:
        return 'Refazer: Ação desconhecida';
    }
  }, [state.currentIndex, state.history]);

  return {
    // Actions
    addAction,
    undo,
    redo,
    clearHistory,
    
    // State
    canUndo,
    canRedo,
    historySize,
    currentIndex: state.currentIndex,
    
    // Descriptions
    getLastActionDescription,
    getNextActionDescription,
    
    // Debug
    history: state.history,
  };
};

export default useUndoRedo;
