import type { Block } from '@/types/editor';

// Local publish storage keys
const ROOT_KEY = 'quiz-published:all';
const META_KEY = 'quiz-published:meta';

type StepBlocksMap = Record<string, Block[]>; // keys like 'step-1'

interface PublishMeta {
  publishedAt: string;
  steps: number[]; // list of published step numbers
  version?: string;
}

const safeGetStorage = (): Storage | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch (_e) {
    // ignore
  }
  return null;
};

export const localPublishStore = {
  saveAll(stepBlocks: StepBlocksMap, version?: string): boolean {
    const ls = safeGetStorage();
    if (!ls) return false;
    try {
      // Only persist plain JSON (no functions)
      const clean: StepBlocksMap = {};
      const steps: number[] = [];
      Object.entries(stepBlocks).forEach(([key, blocks]) => {
        const arr = Array.isArray(blocks) ? blocks : [];
        if (arr.length > 0) {
          clean[key] = arr.map((b, idx) => ({
            id: b.id,
            type: b.type,
            order: typeof b.order === 'number' ? b.order : idx,
            content: b.content || {},
            properties: b.properties || {},
          }));
          const n = parseInt(key.replace(/[^0-9]/g, ''), 10);
          if (!Number.isNaN(n)) steps.push(n);
        }
      });

      ls.setItem(ROOT_KEY, JSON.stringify(clean));
      const meta: PublishMeta = {
        publishedAt: new Date().toISOString(),
        steps: Array.from(new Set(steps)).sort((a, b) => a - b),
        version,
      };
      ls.setItem(META_KEY, JSON.stringify(meta));

      // Notify listeners that a new publication is available
      try {
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
          window.dispatchEvent(
            new CustomEvent('quiz-published', { detail: { steps: meta.steps, version } })
          );
        }
      } catch (_e) {
        // ignore
      }
      return true;
    } catch (e) {
      console.warn('localPublishStore.saveAll failed:', e);
      return false;
    }
  },

  getAll(): StepBlocksMap | null {
    const ls = safeGetStorage();
    if (!ls) return null;
    try {
      const raw = ls.getItem(ROOT_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data && typeof data === 'object' ? (data as StepBlocksMap) : null;
    } catch (e) {
      console.warn('localPublishStore.getAll failed:', e);
      return null;
    }
  },

  getMeta(): PublishMeta | null {
    const ls = safeGetStorage();
    if (!ls) return null;
    try {
      const raw = ls.getItem(META_KEY);
      return raw ? (JSON.parse(raw) as PublishMeta) : null;
    } catch (e) {
      return null;
    }
  },

  getBlocks(stepId: string): Block[] | null {
    const all = this.getAll();
    if (!all) return null;
    const arr = all[stepId];
    return Array.isArray(arr) && arr.length > 0 ? arr : null;
  },

  clear(): void {
    const ls = safeGetStorage();
    if (!ls) return;
    ls.removeItem(ROOT_KEY);
    ls.removeItem(META_KEY);
  },

  hasPublication(): boolean {
    const ls = safeGetStorage();
    if (!ls) return false;
    return !!ls.getItem(ROOT_KEY);
  },
};

export type { StepBlocksMap };
