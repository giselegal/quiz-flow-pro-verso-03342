/**
 * 🎯 USE BLOCK LOADING - SPRINT 2 Fase 2
 * 
 * Hook para gerenciar loading de blocos individuais
 * Integra com EditorLoadingContext para tracking centralizado
 * 
 * Funcionalidades:
 * ✅ Tracking de loading por bloco individual
 * ✅ Batch loading de múltiplos blocos
 * ✅ Cálculo de progresso
 * ✅ Integração opcional com contexto global
 */

import { useCallback, useState, useMemo } from 'react';
import { useOptionalEditorLoading } from '@/contexts/EditorLoadingContext';

export interface BlockLoadingState {
  // Estado local
  loadingBlocks: Set<string>;
  isLoading: boolean;
  progress: number;

  // Ações
  setBlockLoading: (blockId: string, loading: boolean) => void;
  setBatchLoading: (blockIds: string[], loading: boolean) => void;
  clearAllLoading: () => void;

  // Queries
  isBlockLoading: (blockId: string) => boolean;
  getLoadingBlockIds: () => string[];
  getTotalLoadingBlocks: () => number;
}

/**
 * Hook principal para gerenciar loading de blocos
 * 
 * Se usado dentro de EditorLoadingProvider, integra automaticamente
 * Caso contrário, funciona de forma standalone
 */
export const useBlockLoading = (): BlockLoadingState => {
  // Tenta usar contexto global (opcional)
  const editorLoading = useOptionalEditorLoading();

  // Estado local (fallback se não houver contexto)
  const [localLoadingBlocks, setLocalLoadingBlocks] = useState<Set<string>>(new Set());

  // 🎯 Determinar qual fonte de estado usar
  const loadingBlocks = useMemo(
    () => editorLoading?.loadingBlocks ?? localLoadingBlocks,
    [editorLoading?.loadingBlocks, localLoadingBlocks],
  );

  // 🎯 Setter unificado (usa contexto se disponível, senão local)
  const setBlockLoading = useCallback(
    (blockId: string, loading: boolean) => {
      if (editorLoading) {
        // Usa contexto global
        editorLoading.setBlockLoading(blockId, loading);
      } else {
        // Usa estado local
        setLocalLoadingBlocks((prev) => {
          const next = new Set(prev);
          if (loading) {
            next.add(blockId);
          } else {
            next.delete(blockId);
          }
          return next;
        });
      }
    },
    [editorLoading],
  );

  // 🎯 Batch loading (múltiplos blocos de uma vez)
  const setBatchLoading = useCallback(
    (blockIds: string[], loading: boolean) => {
      if (editorLoading) {
        // Usa contexto global - aplicar um por um
        blockIds.forEach((blockId) => {
          editorLoading.setBlockLoading(blockId, loading);
        });
      } else {
        // Usa estado local - batch otimizado
        setLocalLoadingBlocks((prev) => {
          const next = new Set(prev);
          blockIds.forEach((blockId) => {
            if (loading) {
              next.add(blockId);
            } else {
              next.delete(blockId);
            }
          });
          return next;
        });
      }
    },
    [editorLoading],
  );

  // 🎯 Limpar todos os loadings
  const clearAllLoading = useCallback(() => {
    if (editorLoading) {
      // Limpar todos do contexto
      Array.from(editorLoading.loadingBlocks).forEach((blockId) => {
        editorLoading.setBlockLoading(blockId, false);
      });
    } else {
      // Limpar estado local
      setLocalLoadingBlocks(new Set());
    }
  }, [editorLoading]);

  // 📊 Queries
  const isBlockLoading = useCallback(
    (blockId: string): boolean => {
      return loadingBlocks.has(blockId);
    },
    [loadingBlocks],
  );

  const getLoadingBlockIds = useCallback((): string[] => {
    return Array.from(loadingBlocks);
  }, [loadingBlocks]);

  const getTotalLoadingBlocks = useCallback((): number => {
    return loadingBlocks.size;
  }, [loadingBlocks.size]);

  // 📊 Estado derivado
  const isLoading = useMemo(() => loadingBlocks.size > 0, [loadingBlocks.size]);

  const progress = useMemo(() => {
    // Se houver contexto global, usar progresso dele
    if (editorLoading) {
      return editorLoading.progress;
    }

    // Senão, calcular baseado apenas em blocos
    // Nota: sem contexto não sabemos quantos blocos total existem
    // Retornar 100 se nenhum está carregando, 0 caso contrário
    return loadingBlocks.size === 0 ? 100 : 0;
  }, [editorLoading, loadingBlocks.size]);

  return {
    // Estado
    loadingBlocks,
    isLoading,
    progress,

    // Ações
    setBlockLoading,
    setBatchLoading,
    clearAllLoading,

    // Queries
    isBlockLoading,
    getLoadingBlockIds,
    getTotalLoadingBlocks,
  };
};

/**
 * Hook simplificado para um único bloco
 * Retorna apenas loading state e setter
 */
export const useSingleBlockLoading = (
  blockId: string,
): {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
} => {
  const { isBlockLoading, setBlockLoading } = useBlockLoading();

  const isLoading = useMemo(() => isBlockLoading(blockId), [blockId, isBlockLoading]);

  const setLoading = useCallback(
    (loading: boolean) => {
      setBlockLoading(blockId, loading);
    },
    [blockId, setBlockLoading],
  );

  return { isLoading, setLoading };
};

export default useBlockLoading;
