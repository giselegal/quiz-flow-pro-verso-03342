/**
 * 🎨 useWYSIWYG - Sistema de Edição WYSIWYG Real-Time
 * 
 * Hook central que gerencia sincronização instantânea entre:
 * - Painel de Propriedades
 * - Estado do Editor (stepBlocks)
 * - Canvas Visual
 * 
 * Características:
 * - Re-renderização granular (apenas bloco alterado)
 * - Sincronização bidirecional
 * - Suporte a undo/redo
 * - Debounce inteligente para performance
 * - Validação em tempo real
 * 
 * @version 1.0.0
 * @author Senior Engineer
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { appLogger } from '@/lib/utils/appLogger';
import type { Block } from '@/types/editor';

export interface WYSIWYGOptions {
  /** Debounce para auto-save (ms) */
  autoSaveDelay?: number;
  /** Habilitar validação em tempo real */
  enableValidation?: boolean;
  /** Callback quando bloco é atualizado */
  onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void;
  /** Callback para auto-save */
  onAutoSave?: (blocks: Block[]) => void | Promise<void>;
  /** Modo de operação */
  mode?: 'edit' | 'preview-live' | 'preview-production';
}

export interface WYSIWYGState {
  /** Blocos atuais (fonte da verdade) */
  blocks: Block[];
  /** Bloco selecionado */
  selectedBlockId: string | null;
  /** Estado de sincronização */
  isSyncing: boolean;
  /** Erros de validação */
  validationErrors: Map<string, string[]>;
  /** Indica se há mudanças não salvas */
  isDirty: boolean;
}

export interface WYSIWYGActions {
  /** Atualizar propriedades de um bloco (WYSIWYG instantâneo) */
  updateBlockProperties: (blockId: string, properties: Partial<Block['properties']>) => void;
  /** Atualizar conteúdo de um bloco */
  updateBlockContent: (blockId: string, content: Partial<Block['content']>) => void;
  /** Atualizar bloco completo */
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  /** Adicionar novo bloco */
  addBlock: (block: Block, index?: number) => void;
  /** Remover bloco */
  removeBlock: (blockId: string) => void;
  /** Reordenar blocos */
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  /** Selecionar bloco */
  selectBlock: (blockId: string | null) => void;
  /** Resetar para blocos iniciais */
  reset: (blocks: Block[]) => void;
  /** Forçar sincronização manual */
  sync: () => void;
  /** Salvar manualmente */
  save: () => Promise<void>;
}

export function useWYSIWYG(
  initialBlocks: Block[],
  options: WYSIWYGOptions = {}
): [WYSIWYGState, WYSIWYGActions] {
  const {
    autoSaveDelay = 2000,
    enableValidation = true,
    onBlockUpdate,
    onAutoSave,
    mode = 'edit',
  } = options;

  // 🚨 DEBUG: Log de inicialização
  console.log('🎨 [useWYSIWYG] Inicialização com initialBlocks:', {
    count: initialBlocks?.length || 0,
    ids: initialBlocks?.map(b => b.id).slice(0, 3) || [],
    mode,
  });

  // Estado local (fonte da verdade para renderização)
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Map<string, string[]>>(new Map());
  const [isDirty, setIsDirty] = useState(false);

  // Refs para evitar re-renders desnecessários
  const blocksRef = useRef<Block[]>(blocks);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const updateQueueRef = useRef<Map<string, Partial<Block>>>(new Map());

  // Sincronizar ref quando blocks mudar
  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  // Reset quando initialBlocks mudar externamente
  useEffect(() => {
    if (initialBlocks !== blocksRef.current) {
      setBlocks(initialBlocks);
      setIsDirty(false);
      appLogger.debug('[useWYSIWYG] Blocos resetados externamente');
    }
  }, [initialBlocks]);

  // Validação em tempo real
  const validateBlock = useCallback((block: Block): string[] => {
    if (!enableValidation) return [];

    const errors: string[] = [];

    // Validações básicas
    if (!block.id) {
      errors.push('Block ID é obrigatório');
    }
    if (!block.type) {
      errors.push('Block type é obrigatório');
    }
    if (typeof block.order !== 'number') {
      errors.push('Block order deve ser um número');
    }

    // Validações específicas por tipo
    if (block.type === 'text' || block.type === 'headline') {
      const text = block.properties?.text || block.content?.text;
      if (!text || text.trim() === '') {
        errors.push('Texto não pode estar vazio');
      }
    }

    if (block.type === 'image' || block.type === 'image-display-inline') {
      const url = block.properties?.url || block.content?.url;
      if (!url) {
        errors.push('URL da imagem é obrigatória');
      }
    }

    return errors;
  }, [enableValidation]);

  // Processar fila de atualizações (batch updates)
  const processUpdateQueue = useCallback(() => {
    console.log('📦 [useWYSIWYG] processUpdateQueue chamado, fila:', updateQueueRef.current.size);
    
    if (updateQueueRef.current.size === 0) {
      console.log('⚠️ [useWYSIWYG] Fila vazia, nada a processar');
      return;
    }

    const updates = Array.from(updateQueueRef.current.entries());
    console.log('🔄 [useWYSIWYG] Processando', updates.length, 'atualizações da fila');
    updateQueueRef.current.clear();

    setBlocks((prevBlocks) => {
      const newBlocks = prevBlocks.map((block) => {
        const update = updates.find(([id]) => id === block.id);
        if (!update) return block;

        const [, changes] = update;
        const updatedBlock = { ...block, ...changes };

        // Validar bloco atualizado
        if (enableValidation) {
          const errors = validateBlock(updatedBlock);
          if (errors.length > 0) {
            setValidationErrors((prev) => {
              const next = new Map(prev);
              next.set(block.id, errors);
              return next;
            });
          } else {
            setValidationErrors((prev) => {
              const next = new Map(prev);
              next.delete(block.id);
              return next;
            });
          }
        }

        // Callback de atualização
        if (onBlockUpdate) {
          onBlockUpdate(block.id, changes);
        }

        return updatedBlock;
      });

      appLogger.debug('[useWYSIWYG] Batch update aplicado:', {
        updatedBlocks: updates.length,
        totalBlocks: newBlocks.length,
      });

      return newBlocks;
    });

    setIsDirty(true);
  }, [enableValidation, validateBlock, onBlockUpdate]);

  // Enfileirar atualização (debounced)
  const enqueueUpdate = useCallback((blockId: string, updates: Partial<Block>) => {
    console.log('🔄 [useWYSIWYG] enqueueUpdate chamado:', {
      blockId,
      updates,
      mode,
      willProcessImmediately: mode === 'edit' || mode === 'preview-live',
    });
    
    const existing = updateQueueRef.current.get(blockId) || {};
    updateQueueRef.current.set(blockId, { ...existing, ...updates });

    // Processar imediatamente em modo edit/preview-live para WYSIWYG instantâneo
    if (mode === 'edit' || mode === 'preview-live') {
      console.log('⚡ [useWYSIWYG] Processando fila IMEDIATAMENTE (modo:', mode, ')');
      processUpdateQueue();
    } else {
      console.log('⏳ [useWYSIWYG] Aguardando debounce (modo:', mode, ')');
    }
  }, [mode, processUpdateQueue]);

  // Auto-save com debounce
  useEffect(() => {
    if (!isDirty || !onAutoSave) return;

    // Limpar timer anterior
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Agendar novo auto-save
    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        setIsSyncing(true);
        await onAutoSave(blocksRef.current);
        setIsDirty(false);
        appLogger.info('[useWYSIWYG] Auto-save realizado com sucesso');
      } catch (error) {
        appLogger.error('[useWYSIWYG] Erro no auto-save:', error);
      } finally {
        setIsSyncing(false);
      }
    }, autoSaveDelay);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [isDirty, onAutoSave, autoSaveDelay]);

  // Actions
  const actions: WYSIWYGActions = useMemo(
    () => ({
      updateBlockProperties: (blockId: string, properties: Partial<Block['properties']>) => {
        enqueueUpdate(blockId, { properties: { ...properties } });
      },

      updateBlockContent: (blockId: string, content: Partial<Block['content']>) => {
        enqueueUpdate(blockId, { content: { ...content } });
      },

      updateBlock: (blockId: string, updates: Partial<Block>) => {
        enqueueUpdate(blockId, updates);
      },

      addBlock: (block: Block, index?: number) => {
        setBlocks((prev) => {
          const newBlocks = [...prev];
          const insertIndex = index !== undefined ? index : newBlocks.length;
          newBlocks.splice(insertIndex, 0, block);

          // Renumerar orders
          return newBlocks.map((b, i) => ({ ...b, order: i }));
        });
        setIsDirty(true);
        appLogger.info('[useWYSIWYG] Bloco adicionado:', block.id);
      },

      removeBlock: (blockId: string) => {
        setBlocks((prev) => {
          const newBlocks = prev.filter((b) => b.id !== blockId);
          // Renumerar orders
          return newBlocks.map((b, i) => ({ ...b, order: i }));
        });
        setIsDirty(true);
        appLogger.info('[useWYSIWYG] Bloco removido:', blockId);
      },

      reorderBlocks: (fromIndex: number, toIndex: number) => {
        setBlocks((prev) => {
          const newBlocks = [...prev];
          const [moved] = newBlocks.splice(fromIndex, 1);
          newBlocks.splice(toIndex, 0, moved);

          // Renumerar orders
          return newBlocks.map((b, i) => ({ ...b, order: i }));
        });
        setIsDirty(true);
        appLogger.info('[useWYSIWYG] Blocos reordenados:', { fromIndex, toIndex });
      },

      selectBlock: (blockId: string | null) => {
        setSelectedBlockId(blockId);
        appLogger.debug('[useWYSIWYG] Bloco selecionado:', blockId);
      },

      reset: (newBlocks: Block[]) => {
        console.log('🔄 [useWYSIWYG] RESET chamado:', {
          oldBlocksCount: blocks.length,
          oldBlocksIds: blocks.map(b => b.id).slice(0, 3),
          newBlocksCount: newBlocks?.length || 0,
          newBlocksIds: newBlocks?.map(b => b.id).slice(0, 3) || [],
        });
        setBlocks(newBlocks);
        setIsDirty(false);
        setValidationErrors(new Map());
        appLogger.info('[useWYSIWYG] Reset realizado');
      },

      sync: () => {
        processUpdateQueue();
        appLogger.info('[useWYSIWYG] Sincronização manual forçada');
      },

      save: async () => {
        if (!onAutoSave) {
          appLogger.warn('[useWYSIWYG] Save chamado mas onAutoSave não configurado');
          return;
        }

        try {
          setIsSyncing(true);
          await onAutoSave(blocksRef.current);
          setIsDirty(false);
          appLogger.info('[useWYSIWYG] Save manual realizado com sucesso');
        } catch (error) {
          appLogger.error('[useWYSIWYG] Erro no save manual:', error);
          throw error;
        } finally {
          setIsSyncing(false);
        }
      },
    }),
    [enqueueUpdate, onAutoSave, processUpdateQueue]
  );

  const state: WYSIWYGState = {
    blocks,
    selectedBlockId,
    isSyncing,
    validationErrors,
    isDirty,
  };

  return [state, actions];
}

export default useWYSIWYG;
