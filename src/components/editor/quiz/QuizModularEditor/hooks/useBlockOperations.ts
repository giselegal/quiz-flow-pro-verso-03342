// 🔧 BLOCK OPERATIONS HOOK - Integração com Schema-Driven Validation
import { useCallback, useMemo, useRef, useState } from 'react';
import { templateService } from '@/services/canonical/TemplateService';
import type { Block } from '@/services/UnifiedTemplateRegistry';
import { validateBlockData, safeValidateBlockData, type BlockType } from '@/schemas/blockSchemas';
import { toast } from '@/hooks/use-toast';
import { createElementFromSchema, validateElement } from '@/core/editor/SchemaComponentAdapter';
import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';

export type ValidationError = {
  field: string;
  message: string;
};

export type UseBlockOperations = {
  getBlocks: (stepKey: string | null) => Block[] | null;
  ensureLoaded: (stepKey: string | null) => Promise<void>;
  addBlock: (stepKey: string | null, block: Partial<Block> & { type: Block['type'] }) => { success: boolean; error?: ValidationError[] };
  removeBlock: (stepKey: string | null, blockId: string) => void;
  reorderBlock: (stepKey: string | null, fromIndex: number, toIndex: number) => void;
  updateBlock: (stepKey: string | null, blockId: string, patch: Partial<Block>) => { success: boolean; error?: ValidationError[] };
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
    if (!stepKey) return { success: false, error: [{ field: 'stepKey', message: 'Step key é obrigatório' }] };

    // Verificar se existe schema para o tipo
    const hasSchema = schemaInterpreter.getBlockSchema(block.type) !== null;

    if (hasSchema) {
      // Usar Schema-Driven Creation
      try {
        const newElement = createElementFromSchema(block.type, {
          id: block.id || genId('blk'),
          properties: (block as any).properties,
          content: (block as any).content,
        });

        // Validar elemento criado
        const validation = validateElement(newElement);
        if (!validation.valid) {
          const errors: ValidationError[] = validation.errors.map(err => ({
            field: 'schema',
            message: err,
          }));

          toast({
            title: 'Erro de validação (schema)',
            description: `Bloco ${block.type}: ${errors[0].message}`,
            variant: 'destructive',
          });

          return { success: false, error: errors };
        }

        // Converter para formato Block
        const newBlock: Block = {
          id: newElement.id,
          type: newElement.type as Block['type'],
          order: (byStep[stepKey]?.length || 0) + 1,
          properties: newElement.properties || {},
          content: newElement.content || {},
        } as Block;

        setByStep((prev) => ({
          ...prev,
          [stepKey]: [...(prev[stepKey] || []), newBlock],
        }));

        return { success: true };
      } catch (error: any) {
        toast({
          title: 'Erro ao criar bloco',
          description: error.message || 'Falha ao criar elemento do schema',
          variant: 'destructive',
        });
        return { success: false, error: [{ field: 'creation', message: error.message }] };
      }
    }

    // Fallback: Validação legada para blocos sem schema
    const blockData = (block as any).properties || (block as any).content || {};
    const validation = safeValidateBlockData(block.type as BlockType, blockData);
    
    if (!validation.success) {
      const zodError = validation.error as any;
      const errors: ValidationError[] = zodError?.issues?.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })) || [{ field: 'validation', message: zodError?.message || 'Validação falhou' }];

      toast({
        title: 'Erro de validação (legado)',
        description: `Bloco ${block.type}: ${errors[0].message}`,
        variant: 'destructive',
      });

      return { success: false, error: errors };
    }

    // Criar bloco legado
    const newBlock: Block = {
      id: block.id || genId('blk'),
      type: block.type,
      order: (byStep[stepKey]?.length || 0) + 1,
      properties: validation.data || blockData,
      content: validation.data || (block as any).content,
    } as Block;

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

  const updateBlock = useCallback((stepKey: string | null, blockId: string, patch: Partial<Block>) => {
    if (!stepKey) return { success: false, error: [{ field: 'stepKey', message: 'Step key é obrigatório' }] };
    
    let validationError: ValidationError[] | undefined;

    setByStep((prev) => {
      const list = prev[stepKey] || [];
      const idx = list.findIndex((b) => b.id === blockId);
      if (idx === -1) return prev;

      const currentBlock = list[idx];
      const hasSchema = schemaInterpreter.getBlockSchema(currentBlock.type) !== null;

      if (hasSchema) {
        // Usar Schema-Driven Validation
        const mergedElement = {
          id: currentBlock.id,
          type: currentBlock.type,
          name: currentBlock.type,
          properties: {
            ...(currentBlock as any).properties,
            ...(patch as any).properties,
          },
          content: {
            ...(currentBlock as any).content,
            ...(patch as any).content,
          },
        };

        const validation = validateElement(mergedElement as any);
        if (!validation.valid) {
          validationError = validation.errors.map(err => ({
            field: 'schema',
            message: err,
          }));

          toast({
            title: 'Erro de validação (schema)',
            description: `Bloco ${currentBlock.type}: ${validationError![0].message}`,
            variant: 'destructive',
          });

          return prev;
        }

        // Atualizar bloco
        const updated = { 
          ...currentBlock, 
          ...patch, 
          properties: mergedElement.properties,
          content: mergedElement.content,
        } as Block;

        const next = [...list];
        next[idx] = updated;
        return { ...prev, [stepKey]: next };
      }

      // Fallback: Validação legada
      const mergedData = { 
        ...(currentBlock as any).content, 
        ...(currentBlock as any).properties,
        ...(patch as any).content, 
        ...(patch as any).properties 
      };

      const validation = safeValidateBlockData(currentBlock.type as BlockType, mergedData);

      if (!validation.success) {
        const zodError = validation.error as any;
        validationError = zodError?.issues?.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })) || [{ field: 'validation', message: zodError?.message || 'Validação falhou' }];

        toast({
          title: 'Erro de validação (legado)',
          description: `Bloco ${currentBlock.type}: ${validationError![0].message}`,
          variant: 'destructive',
        });

        return prev;
      }

      const updated = { 
        ...currentBlock, 
        ...patch, 
        content: validation.data || { ...mergedData }, 
        properties: validation.data || { ...mergedData } 
      } as Block;

      const next = [...list];
      next[idx] = updated;
      return { ...prev, [stepKey]: next };
    });

    // 🔧 CORREÇÃO FASE 4: Emitir evento de mudança para forçar re-renders
    if (!validationError) {
      window.dispatchEvent(new CustomEvent('block-updated', { 
        detail: { stepKey, blockId, patch } 
      }));
    }

    if (validationError) {
      return { success: false, error: validationError };
    }

    return { success: true };
  }, []);

  return useMemo(() => ({ getBlocks, ensureLoaded, addBlock, removeBlock, reorderBlock, updateBlock }), [getBlocks, ensureLoaded, addBlock, removeBlock, reorderBlock, updateBlock]);
}
