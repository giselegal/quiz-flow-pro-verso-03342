// =====================================================================
// hooks/usePropertyHistory.ts - Hook para histórico de propriedades
// =====================================================================

import { useState, useCallback, useRef } from "react";

interface HistoryEntry {
  id: string;
  timestamp: number;
  properties: Record<string, any>;
  description: string;
}

export function usePropertyHistory(initialProperties: Record<string, any> = {}) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: "initial",
      timestamp: Date.now(),
      properties: initialProperties,
      description: "Estado inicial",
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastSaveTime = useRef(Date.now());

  const saveToHistory = useCallback(
    (properties: Record<string, any>, description: string = "Alteração de propriedade") => {
      const now = Date.now();

      // Evitar salvar mudanças muito frequentes (debounce de 1 segundo)
      if (now - lastSaveTime.current < 1000) {
        return;
      }

      const newEntry: HistoryEntry = {
        id: `entry-${now}`,
        timestamp: now,
        properties: { ...properties },
        description,
      };

      setHistory(prev => {
        // Remove entradas futuras se estivermos no meio do histórico
        const truncatedHistory = prev.slice(0, currentIndex + 1);

        // Adiciona nova entrada
        const newHistory = [...truncatedHistory, newEntry];

        // Limita o histórico a 50 entradas
        return newHistory.slice(-50);
      });

      setCurrentIndex(prev => {
        const truncatedLength = history.slice(0, prev + 1).length;
        return truncatedLength; // Nova posição será o final
      });

      lastSaveTime.current = now;
    },
    [currentIndex, history]
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1].properties;
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1].properties;
    }
    return null;
  }, [currentIndex, history]);

  const goToEntry = useCallback(
    (index: number) => {
      if (index >= 0 && index < history.length) {
        setCurrentIndex(index);
        return history[index].properties;
      }
      return null;
    },
    [history]
  );

  const clearHistory = useCallback(() => {
    const currentEntry = history[currentIndex];
    setHistory([currentEntry]);
    setCurrentIndex(0);
  }, [history, currentIndex]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  const currentEntry = history[currentIndex];

  return {
    history,
    currentIndex,
    currentEntry,
    canUndo,
    canRedo,
    saveToHistory,
    undo,
    redo,
    goToEntry,
    clearHistory,
  };
}
