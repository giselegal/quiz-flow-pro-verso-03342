// 🔧 BLOCK OPERATIONS HOOK - Fase 2: Validação Unificada
import { useCallback, useMemo, useRef, useState } from 'react';
import { templateService } from '@/services/canonical/TemplateService';
import type { Block } from '@/types/editor';
import { toast } from '@/hooks/use-toast';
import { validateBlock } from '@/core/validation/UnifiedBlockValidator';
import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';
import { appLogger } from '@/lib/utils/appLogger';

export type ValidationError = {
  field: string;
  message: string;
};

export type UseBlockOperations = {
  getBlocks: (stepKey: string | null) => Block[] | null;
  ensureLoaded: (stepKey: string | null) => Promise<void>;
  loadStepFromTemplate: (stepKey: string, blocks: Block[]) => void;
  addBlock: (stepKey: string | null, block: Partial<Block> & { type: Block['type'] }) => { success: boolean; error?: ValidationError[] };
  removeBlock: (stepKey: string | null, blockId: string) => void;
  reorderBlock: (stepKey: string | null, fromIndex: number, toIndex: number) => void;
  updateBlock: (stepKey: string | null, blockId: string, patch: Partial<Block>) => void; // ✅ FASE 2.1: Sem return type para debounce
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

  const ensureLoaded = useCallback(async (stepKey: string | null, templateId?: string) => {
    if (!stepKey) return;
    if (byStep[stepKey]) {
      appLogger.info(`✅ [useBlockOperations] Step ${stepKey} já carregado (${byStep[stepKey].length} blocos)`);
      return;
    }
    if (loadingRef.current[stepKey]) {
      appLogger.info(`⏳ [useBlockOperations] Step ${stepKey} já está sendo carregado...`);
      return;
    }
    
    loadingRef.current[stepKey] = true;
    appLogger.info(`🔄 [useBlockOperations] Carregando step ${stepKey}${templateId ? ` (template: ${templateId})` : ''}...`);
    
    try {
      // Passar templateId para templateService se disponível
      const res = await templateService.getStep(stepKey, templateId);
      if (res.success) {
        appLogger.info(`✅ [useBlockOperations] Step ${stepKey} carregado (${res.data.length} blocos)`);
        setByStep((prev) => ({ ...prev, [stepKey]: res.data }));
      } else {
        appLogger.warn(`⚠️ [useBlockOperations] Step ${stepKey} não encontrado ou vazio`);
        setByStep((prev) => ({ ...prev, [stepKey]: [] }));
      }
    } finally {
      loadingRef.current[stepKey] = false;
    }
  }, [byStep]);

  // ✅ FASE 2: Carregar step sem normalização forçada
  const loadStepFromTemplate = useCallback((stepKey: string, blocks: Block[]) => {
    if (!stepKey || !blocks) return;
    
    appLogger.info(`🎨 [useBlockOperations] Carregando step ${stepKey} do template (${blocks.length} blocos)`);
    
    setByStep((prev) => ({
      ...prev,
      [stepKey]: blocks,
    }));
    
    loadingRef.current[stepKey] = false;
  }, []);

  const addBlock = useCallback((stepKey: string | null, block: Partial<Block> & { type: Block['type'] }) => {
    if (!stepKey) return { success: false, error: [{ field: 'stepKey', message: 'Step key é obrigatório' }] };

    // Criar bloco básico
    const newBlock: Block = {
      id: block.id || genId('blk'),
      type: block.type,
      order: (byStep[stepKey]?.length || 0) + 1,
      properties: (block as any).properties || {},
      content: (block as any).content || {},
    } as Block;

    // Validação unificada
    const validation = validateBlock(newBlock);
    if (!validation.valid) {
      toast({
        title: 'Erro de validação',
        description: `${validation.errors[0].message}`,
        variant: 'destructive',
      });
      return { success: false, error: validation.errors };
    }

    setByStep((prev) => ({
      ...prev,
      [stepKey]: [...(prev[stepKey] || []), newBlock],
    }));

    return { success: true };
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

  // ✅ FASE 2: Update com validação unificada
  const updateBlockImmediate = useCallback((stepKey: string | null, blockId: string, patch: Partial<Block>) => {
    if (!stepKey) return { success: false, error: [{ field: 'stepKey', message: 'Step key é obrigatório' }] };
    
    let validationError: ValidationError[] | undefined;

    setByStep((prev) => {
      const list = prev[stepKey] || [];
      const idx = list.findIndex((b) => b.id === blockId);
      if (idx === -1) return prev;

      const currentBlock = list[idx];
      
      // Merge updates
      const updated = { 
        ...currentBlock, 
        ...patch,
        properties: {
          ...(currentBlock as any).properties,
          ...(patch as any).properties,
        },
        content: {
          ...(currentBlock as any).content,
          ...(patch as any).content,
        },
      } as Block;

      // Validação unificada
      const validation = validateBlock(updated);
      if (!validation.valid) {
        validationError = validation.errors;
        toast({
          title: 'Erro de validação',
          description: `${validation.errors[0].message}`,
          variant: 'destructive',
        });
        return prev;
      }

      appLogger.info(`✅ [useBlockOperations] Bloco atualizado: ${blockId}`, { data: [{
                stepKey,
                type: updated.type,
                propertiesKeys: Object.keys(updated.properties || {}),
                contentKeys: Object.keys(updated.content || {}),
              }] });

      const next = [...list];
      next[idx] = updated;
      
      return { ...prev, [stepKey]: next };
    });

    // Emitir evento de mudança
    if (!validationError) {
      window.dispatchEvent(new CustomEvent('block-updated', { 
        detail: { stepKey, blockId, patch } 
      }));
    }

    return validationError 
      ? { success: false, error: validationError }
      : { success: true };
  }, []);

  // ✅ FASE 1: Direct update (no debounce - removes race conditions)
  const updateBlock = updateBlockImmediate;

  return useMemo(() => ({ getBlocks, ensureLoaded, loadStepFromTemplate, addBlock, removeBlock, reorderBlock, updateBlock }), [getBlocks, ensureLoaded, loadStepFromTemplate, addBlock, removeBlock, reorderBlock, updateBlock]);
}
