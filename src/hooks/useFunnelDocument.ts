import { useCallback, useEffect, useState } from 'react';
import { funnelCRUDService, type FunnelDocument } from '@/services/funnel/FunnelCRUDService';
import type { Block } from '@/types/editor';

interface UseFunnelDocumentOptions {
  autoLoad?: boolean;
}

export function useFunnelDocument(funnelId: string, options: UseFunnelDocumentOptions = {}) {
  const { autoLoad = true } = options;
  const [doc, setDoc] = useState<FunnelDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    if (!funnelId) return;
    setIsLoading(true);
    setError(null);
    try {
      const loaded = await funnelCRUDService.loadFunnel(funnelId);
      setDoc(loaded);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [funnelId]);

  useEffect(() => {
    if (autoLoad) reload();
  }, [autoLoad, reload]);

  const updateStep = useCallback((stepId: string, blocks: Block[]) => {
    if (!doc) return;
    funnelCRUDService.updateStepBlocks(doc.funnelId, stepId, blocks);
    setDoc({ ...doc, stepBlocks: { ...doc.stepBlocks, [stepId]: blocks } });
  }, [doc]);

  const save = useCallback(() => {
    if (!doc) return { success: false, persistedSteps: [] } as any;
    return funnelCRUDService.saveLocal(doc.funnelId);
  }, [doc]);

  const publish = useCallback(async () => {
    if (!doc) return { success: false } as any;
    return funnelCRUDService.publish(doc.funnelId);
  }, [doc]);

  return {
    doc,
    isLoading,
    error,
    reload,
    updateStep,
    save,
    publish,
    hasUnsaved: !!doc && doc.dirtySteps.size > 0,
  };
}
