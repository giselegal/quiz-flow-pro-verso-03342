/**
 * 🎣 USE OPTIMIZED QUERY HOOK - Fase 3 Task 8
 * 
 * Hook React para queries otimizadas com:
 * - Debounced updates automáticos
 * - Optimistic updates integrados
 * - Batch queries transparentes
 * - Cache local inteligente
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { queryOptimizer } from '@/services/core/QueryOptimizer';

// ============================================================================
// TYPES
// ============================================================================

interface UseOptimizedQueryOptions<T> {
    table: string;
    id?: string;
    fields?: string[];
    filter?: Record<string, any>;
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
}

interface UseOptimizedQueryResult<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    update: (updates: Partial<T>) => void;
    updateImmediate: (updates: Partial<T>) => Promise<void>;
    hasPendingUpdates: boolean;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook para queries otimizadas com updates debounced e optimistic
 * 
 * @example
 * // Query com debounced updates
 * const { data: funnel, update } = useOptimizedQuery({
 *   table: 'funnels',
 *   id: funnelId,
 *   fields: ['id', 'name', 'settings'], // GraphQL-style
 * });
 * 
 * // Updates são automaticamente debounced (3s)
 * update({ name: 'Novo Nome' });
 * update({ settings: { theme: 'dark' } }); // Mesclados em uma única query
 */
export function useOptimizedQuery<T = any>(
    options: UseOptimizedQueryOptions<T>
): UseOptimizedQueryResult<T> {
    const {
        table,
        id,
        fields,
        filter,
        enabled = true,
        onSuccess,
        onError,
    } = options;

    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [hasPendingUpdates, setHasPendingUpdates] = useState(false);

    const previousDataRef = useRef<T | null>(null);
    const isMountedRef = useRef(true);

    // ========================================================================
    // FETCH DATA
    // ========================================================================

    const fetchData = useCallback(async () => {
        if (!enabled) return;

        setIsLoading(true);
        setError(null);

        try {
            let result: T | null = null;

            if (id) {
                // Query única com batch automático
                result = await queryOptimizer.batchQuery<T>(
                    table,
                    fields || ['*'],
                    { id, ...filter }
                );
            } else if (filter) {
                // Query múltipla com batch
      const results = await queryOptimizer.batchQueryMany<T>(
        table,
        fields || ['*'],
        filter
      );
                result = (results?.[0] || null) as T;
            }

            if (isMountedRef.current) {
                setData(result);
                previousDataRef.current = result;

                if (result && onSuccess) {
                    onSuccess(result);
                }
            }

        } catch (err) {
            const error = err as Error;

            if (isMountedRef.current) {
                setError(error);

                if (onError) {
                    onError(error);
                }
            }

        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [enabled, table, id, fields, filter, onSuccess, onError]);

    // ========================================================================
    // DEBOUNCED UPDATE
    // ========================================================================

    /**
     * Update com debounce automático (3s)
     * UI atualiza instantaneamente (optimistic)
     */
    const update = useCallback((updates: Partial<T>) => {
        if (!id || !data) return;

        // Optimistic update (UI atualiza instantaneamente)
        const previousValue = data;
        const newValue = { ...data, ...updates };

        setData(newValue);
        previousDataRef.current = newValue;
        setHasPendingUpdates(true);

        // Aplicar optimistic update
        queryOptimizer.optimisticUpdate(id, updates as Record<string, any>, table, { id });

        // Agendar save debounced
        queryOptimizer.debouncedUpdate(table, id, updates as Record<string, any>);

            // Monitorar conclusão (simplificado - em produção usar event emitter)
        setTimeout(() => {
            if (isMountedRef.current) {
                setHasPendingUpdates(false);
                queryOptimizer.confirmOptimistic(id);
            }
        }, 3500); // 3s de debounce + 500ms de buffer

    }, [id, data, table]);

    // ========================================================================
    // IMMEDIATE UPDATE
    // ========================================================================

    /**
     * Update imediato (sem debounce)
     * Útil para saves críticos antes de navegação
     */
    const updateImmediate = useCallback(async (updates: Partial<T>) => {
        if (!id || !data) return;

        const previousValue = data;
        const newValue = { ...data, ...updates };

        // Optimistic update
        setData(newValue);
        queryOptimizer.optimisticUpdate(id, updates as Record<string, any>, table, { id });

        try {
            // Force flush immediate
            queryOptimizer.debouncedUpdate(table, id, updates as Record<string, any>);
            await queryOptimizer.flushUpdates(table, id);

            // Confirmar optimistic
            queryOptimizer.confirmOptimistic(id);

        } catch (err) {
            // Reverter se erro
            const revertedValue = queryOptimizer.revertOptimistic<T>(id);
            if (revertedValue && isMountedRef.current) {
                setData(revertedValue);
            }

            throw err;
        }
    }, [id, data, table]);

    // ========================================================================
    // REFETCH
    // ========================================================================

    const refetch = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    // ========================================================================
    // EFFECTS
    // ========================================================================

    // Fetch inicial
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Cleanup: flush updates pendentes ao desmontar
    useEffect(() => {
        return () => {
            isMountedRef.current = false;

            if (id) {
                // Flush updates pendentes antes de desmontar
                queryOptimizer.flushUpdates(table, id).catch(console.error);
            }
        };
    }, [table, id]);

    // ========================================================================
    // RETURN
    // ========================================================================

    return {
        data,
        isLoading,
        error,
        refetch,
        update,
        updateImmediate,
        hasPendingUpdates,
    };
}

// ============================================================================
// HOOK AUXILIAR: USE BATCH QUERIES
// ============================================================================

/**
 * Hook para queries em batch de múltiplos IDs
 * 
 * @example
 * const { data: funnels, isLoading } = useBatchQueries({
 *   table: 'funnels',
 *   ids: ['id1', 'id2', 'id3'],
 *   fields: ['id', 'name'],
 * });
 */
export function useBatchQueries<T = any>(options: {
    table: string;
    ids: string[];
    fields?: string[];
    enabled?: boolean;
}) {
    const { table, ids, fields, enabled = true } = options;

    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!enabled || ids.length === 0) return;

        setIsLoading(true);
        setError(null);

        try {
            // Query com batch automático (in clause)
            const results = await queryOptimizer.batchQueryMany<T>(
                table,
                fields || ['*'],
                { id: ids } // in(id, [...ids])
            );

            setData(results);

        } catch (err) {
            setError(err as Error);

        } finally {
            setIsLoading(false);
        }
    }, [enabled, table, ids, fields]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
}
