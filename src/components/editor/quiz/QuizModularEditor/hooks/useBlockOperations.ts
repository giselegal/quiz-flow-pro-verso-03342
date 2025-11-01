import { useCallback, useMemo, useRef, useState } from 'react';
import { templateService } from '@/services/canonical/TemplateService';
import type { Block } from '@/services/UnifiedTemplateRegistry';

export type UseBlockOperations = {
  getBlocks: (stepKey: string | null) => Block[] | null;
  ensureLoaded: (stepKey: string | null) => Promise<void>;
  addBlock: (stepKey: string | null, block: Partial<Block> & { type: Block['type'] }) => void;
  removeBlock: (stepKey: string | null, blockId: string) => void;
  reorderBlock: (stepKey: string | null, fromIndex: number, toIndex: number) => void;
};

function genId(prefix = 'blk'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function useBlockOperations(): UseBlockOperations {
  const [byStep, setByStep] = useState<Record<string, Block[]>>({});
  const loadingRef = useRef<Record<string, boolean>>({});

  const getBlocks = useCallback((stepKey: string | null) => {
    if (!stepKey) return null;
    return byStep[stepKey] ?? null;
  }, [byStep]);

  const ensureLoaded = useCallback(async (stepKey: string | null) => {
    if (!stepKey) return;
    if (byStep[stepKey] || loadingRef.current[stepKey]) return;
    loadingRef.current[stepKey] = true;
    try {
      const res = await templateService.getStep(stepKey);
      if (res.success) {
        setByStep((prev) => ({ ...prev, [stepKey]: res.data }));
      } else {
        setByStep((prev) => ({ ...prev, [stepKey]: [] }));
      }
    } finally {
      loadingRef.current[stepKey] = false;
    }
  }, [byStep]);

  const addBlock = useCallback((stepKey: string | null, block: Partial<Block> & { type: Block['type'] }) => {
    if (!stepKey) return;
    const newBlock: Block = {
      id: block.id || genId('blk'),
      type: block.type,
      order: (byStep[stepKey]?.length || 0) + 1,
      properties: (block as any).properties || (block as any).content || {},
      content: (block as any).content,
    } as Block;
    setByStep((prev) => ({
      ...prev,
      [stepKey]: [...(prev[stepKey] || []), newBlock],
    }));
  }, [byStep]);

  const removeBlock = useCallback((stepKey: string | null, blockId: string) => {
    if (!stepKey) return;
    setByStep((prev) => ({
      ...prev,
      [stepKey]: (prev[stepKey] || []).filter((b) => b.id !== blockId),
    }));
  }, []);

  const reorderBlock = useCallback((stepKey: string | null, fromIndex: number, toIndex: number) => {
    if (!stepKey) return;
    setByStep((prev) => {
      const arr = [...(prev[stepKey] || [])];
      if (fromIndex < 0 || fromIndex >= arr.length || toIndex < 0 || toIndex >= arr.length) return prev;
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      // reatribuir order
      const normalized = arr.map((b, idx) => ({ ...b, order: idx + 1 } as Block));
      return { ...prev, [stepKey]: normalized };
    });
  }, []);

  return useMemo(() => ({ getBlocks, ensureLoaded, addBlock, removeBlock, reorderBlock }), [getBlocks, ensureLoaded, addBlock, removeBlock, reorderBlock]);
}
