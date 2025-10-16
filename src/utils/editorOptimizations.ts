/**
 * 🎯 EDITOR OPTIMIZATIONS (Sprint 2 - TK-ED-06)
 * 
 * Utilitários para otimização de performance do editor
 */

/**
 * Tree-shaking friendly icon imports - SIMPLIFICADO
 * Imports diretos são mais confiáveis que dinâmicos
 */
import {
  Save,
  Upload,
  Eye,
  Undo,
  Redo,
  Type,
  Image,
  Layout,
  List,
  Plus,
  Trash2,
  Copy,
  Settings,
} from 'lucide-react';

export const EditorIcons = {
  Save,
  Upload,
  Eye,
  Undo,
  Redo,
  Type,
  Image,
  Layout,
  List,
  Plus,
  Trash: Trash2,
  Copy,
  Settings,
};

/**
 * Debounce para operações de salvamento
 */
export function createSaveDebounce(callback: () => void, delay: number = 2000) {
  let timeoutId: NodeJS.Timeout;

  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
}

/**
 * Throttle para operações de renderização
 */
export function createRenderThrottle(callback: () => void, delay: number = 100) {
  let lastRun = 0;
  let timeoutId: NodeJS.Timeout;

  return () => {
    const now = Date.now();

    if (now - lastRun >= delay) {
      callback();
      lastRun = now;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback();
        lastRun = Date.now();
      }, delay - (now - lastRun));
    }
  };
}

/**
 * Memoização de blocos para evitar re-renders desnecessários
 */
export function createBlockMemoizer<T extends { id: string }>(blocks: T[]): Map<string, T> {
  const map = new Map<string, T>();
  blocks.forEach(block => map.set(block.id, block));
  return map;
}

/**
 * Virtualização simples para lista de blocos
 * Renderiza apenas blocos visíveis no viewport
 */
export function calculateVisibleBlocks<T>(
  blocks: T[],
  scrollTop: number,
  containerHeight: number,
  itemHeight: number = 100,
  overscan: number = 3
): { visibleBlocks: T[]; startIndex: number; endIndex: number } {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    blocks.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  return {
    visibleBlocks: blocks.slice(startIndex, endIndex),
    startIndex,
    endIndex,
  };
}

/**
 * Batch updates para múltiplas operações
 * Agrupa mudanças para evitar múltiplos re-renders
 */
export class BatchUpdater<T> {
  private pending: T[] = [];
  private timeoutId: NodeJS.Timeout | null = null;
  private callback: (items: T[]) => void;
  private delay: number;

  constructor(callback: (items: T[]) => void, delay: number = 50) {
    this.callback = callback;
    this.delay = delay;
  }

  add(item: T) {
    this.pending.push(item);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.flush();
    }, this.delay);
  }

  flush() {
    if (this.pending.length > 0) {
      this.callback([...this.pending]);
      this.pending = [];
    }
    this.timeoutId = null;
  }
}
