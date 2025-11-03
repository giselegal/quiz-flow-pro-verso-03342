/**
 * QUERY OPTIMIZER - Versão Simplificada
 * Reduz complexidade removendo batching problemático
 */

import { supabase } from '@/integrations/supabase/client';
import { performanceProfiler } from './PerformanceProfiler';

export class QueryOptimizer {
    /**
     * Select específico com campos customizados
     */
    async selectFields<T = any>(
        table: string,
        fields: string[],
        filter?: Record<string, any>,
        options?: { single?: boolean }
    ): Promise<T | T[] | null> {
        performanceProfiler.start('selectFields', 'api');

        try {
            let query = supabase.from(table as any).select(fields.join(','));

            // Aplicar filtros
            if (filter) {
                for (const [filterKey, value] of Object.entries(filter)) {
                    query = query.eq(filterKey, value);
                }
            }

            // Single ou multiple
            if (options?.single) {
                const { data, error } = await query.single();
                if (error) throw error;
                performanceProfiler.end('selectFields');
                return data as T;
            } else {
                const { data, error } = await query;
                if (error) throw error;
                performanceProfiler.end('selectFields');
                return (data || []) as T[];
            }

        } catch (error) {
            console.error('❌ selectFields error:', error);
            performanceProfiler.end('selectFields');
            throw error;
        }
    }

    /**
     * Update debounced (simplificado)
     */
    private updates = new Map<string, any>();
    private timers = new Map<string, NodeJS.Timeout>();

    debouncedUpdate(table: string, id: string, updates: Record<string, any>, delay: number = 500): void {
        const key = `${table}:${id}`;

        // Limpar timer anterior
        const existingTimer = this.timers.get(key);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        // Armazenar update
        this.updates.set(key, { table, id, updates });

        // Novo timer
        const timer = setTimeout(() => {
            this.saveUpdate(key);
        }, delay);

        this.timers.set(key, timer);
    }

    private async saveUpdate(key: string): Promise<void> {
        const update = this.updates.get(key);
        if (!update) return;

        this.updates.delete(key);
        this.timers.delete(key);

        try {
            const { error } = await supabase
                .from(update.table as any)
                .update(update.updates)
                .eq('id', update.id);

            if (error) throw error;

            console.log(`✅ Debounced update saved: ${key}`);
        } catch (error) {
            console.error(`❌ Debounced update failed: ${key}`, error);
        }
    }
}

export const queryOptimizer = new QueryOptimizer();
