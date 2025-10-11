// @ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { useUnifiedCRUDOptional } from '@/contexts';
import { safeGetItem as getCtx, safeSetItem as setCtx, safeRemoveItem as removeCtx } from '@/utils/contextualStorage';

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export interface UseHistoryStateOptions {
  historyLimit?: number;
  storageKey?: string;
  enablePersistence?: boolean;
  // Persist only the current present state (reduces payload drastically)
  persistPresentOnly?: boolean;
  // Debounce persistence to avoid excessive writes
  persistDebounceMs?: number;
  // Optional custom serializer to trim the present state
  serialize?: (present: any) => any;
}

export const useHistoryState = <T>(initialState: T, options: UseHistoryStateOptions = {}) => {
  // Determinar contexto ativo (fallback EDITOR) no topo do hook
  let activeContext: FunnelContext = FunnelContext.EDITOR;
  try {
    const crud = useUnifiedCRUDOptional();
    if (crud?.funnelContext) activeContext = crud.funnelContext;
  } catch { }
  const {
    historyLimit = 50,
    storageKey,
    enablePersistence = false,
    persistPresentOnly = false,
    persistDebounceMs = 0,
    serialize,
  } = options;

  // Initialize state from localStorage if persistence is enabled
  const getInitialState = useCallback((): HistoryState<T> => {
    if (enablePersistence && storageKey && typeof window !== 'undefined') {
      try {
        // Tentar chave contextualizada primeiro
        const saved = getCtx(storageKey, activeContext) ?? localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            past: parsed.past || [],
            present: parsed.present || initialState,
            future: parsed.future || [],
          };
        }
      } catch (error) {
        console.warn('Failed to load history state from localStorage:', error);
      }
    }
    return {
      past: [],
      present: initialState,
      future: [],
    };
  }, [initialState, storageKey, enablePersistence, activeContext]);

  const [history, setHistory] = useState<HistoryState<T>>(getInitialState);

  // Persist state to localStorage when it changes
  useEffect(() => {
    if (!enablePersistence || !storageKey || typeof window === 'undefined') return;
    // Allow runtime kill-switch
    if ((window as any).__DISABLE_EDITOR_PERSISTENCE__ === true) return;

    const toPersist = persistPresentOnly
      ? { present: serialize ? serialize(history.present) : history.present }
      : serialize
        ? serialize(history as any)
        : history;

    let timer: number | null = null;
    const save = () => {
      try {
        const serialized = JSON.stringify(toPersist);
        // Guardar: evita salvar estados grandes demais
        if (serialized.length > 500_000) {
          console.warn('History persistence skipped: payload too large (~', serialized.length, 'bytes)');
          (window as any).__DISABLE_EDITOR_PERSISTENCE__ = true;
          return;
        }
        // Salvar na chave contextualizada e limpar a antiga para evitar duplicidade
        setCtx(storageKey, serialized, activeContext);
        try { localStorage.removeItem(storageKey); } catch { }
      } catch (error: any) {
        console.warn('Failed to save history state to localStorage:', error);
        // Disable further attempts to prevent spam
        try {
          (window as any).__DISABLE_EDITOR_PERSISTENCE__ = true;
          // Limpa chave problemática para recuperar espaço
          try { localStorage.removeItem(storageKey); } catch { }
          try { removeCtx(storageKey, activeContext); } catch { }
        } catch { }
      }
    };

    if (persistDebounceMs && persistDebounceMs > 0) {
      timer = window.setTimeout(save, persistDebounceMs);
    } else {
      save();
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [history, storageKey, enablePersistence, persistPresentOnly, persistDebounceMs, serialize]);

  const setPresent = useCallback(
    (newStateOrUpdater: T | ((prev: T) => T)) => {
      setHistory(currentHistory => {
        const newPast = [...currentHistory.past, currentHistory.present];

        // Apply history limit
        if (newPast.length > historyLimit) {
          newPast.splice(0, newPast.length - historyLimit);
        }

        const nextPresent =
          typeof newStateOrUpdater === 'function'
            ? (newStateOrUpdater as (prev: T) => T)(currentHistory.present)
            : newStateOrUpdater;

        return {
          past: newPast,
          present: nextPresent,
          future: [],
        };
      });
    },
    [historyLimit]
  );

  const undo = useCallback(() => {
    setHistory(currentHistory => {
      if (currentHistory.past.length === 0) return currentHistory;

      const previous = currentHistory.past[currentHistory.past.length - 1];
      const newPast = currentHistory.past.slice(0, currentHistory.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [currentHistory.present, ...currentHistory.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(currentHistory => {
      if (currentHistory.future.length === 0) return currentHistory;

      const next = currentHistory.future[0];
      const newFuture = currentHistory.future.slice(1);

      return {
        past: [...currentHistory.past, currentHistory.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setHistory({
      past: [],
      present: initialState,
      future: [],
    });
  }, [initialState]);

  const getPresent = useCallback(() => {
    return history.present;
  }, [history.present]);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return {
    present: history.present,
    setPresent,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    getPresent,
    history,
  };
};
