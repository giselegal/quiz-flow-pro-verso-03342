/**
 * 🗄️ QUERY BATCHER - FASE 2: DATABASE QUERY BATCHING
 * 
 * Sistema de batching que resolve:
 * - Múltiplas queries individuais ao Supabase
 * - N+1 query problems
 * - Overhead de network requests
 * - Falta de cache de queries relacionadas
 * 
 * ✅ Query batching inteligente
 * ✅ Request deduplication
 * ✅ Automatic query optimization
 * ✅ Cache integration
 */

import { supabase } from '@/integrations/supabase/customClient';
import { queryCache } from '@/cache/IntelligentCacheSystem';

interface BatchQuery {
  id: string;
  table: string;
  operation: 'select' | 'insert' | 'update' | 'delete';
  query: any;
  filters?: Record<string, any>;
  resolve: (data: any) => void;
  reject: (error: any) => void;
  timestamp: number;
  priority: 'high' | 'medium' | 'low';
}

interface BatchConfig {
  maxBatchSize: number;
  batchTimeout: number;
  enableCache: boolean;
  enableDeduplication: boolean;
}

class QueryBatcher {
  private pendingQueries = new Map<string, BatchQuery[]>();
  private batchTimers = new Map<string, NodeJS.Timeout>();
  private inFlightBatches = new Set<string>();
  
  private readonly config: BatchConfig = {
    maxBatchSize: 10,
    batchTimeout: 50, // 50ms
    enableCache: true,
    enableDeduplication: true
  };

  private stats = {
    totalQueries: 0,
    batchedQueries: 0,
    cacheHits: 0,
    deduplicatedQueries: 0,
    networkRequests: 0
  };

  /**
   * 🎯 BATCH QUERY - Principal método de batching
   */
  async batchQuery<T = any>(
    table: string,
    operation: 'select' | 'insert' | 'update' | 'delete',
    query: any,
    options: {
      filters?: Record<string, any>;
      priority?: 'high' | 'medium' | 'low';
      skipCache?: boolean;
      deduplicationKey?: string;
    } = {}
  ): Promise<T> {
    const {
      filters = {},
      priority = 'medium',
      skipCache = false,
      deduplicationKey
    } = options;

    this.stats.totalQueries++;

    // 🧹 CACHE CHECK
    if (!skipCache && operation === 'select' && this.config.enableCache) {
      const cacheKey = this.generateCacheKey(table, operation, query, filters);
      const cached = queryCache.get(cacheKey);
      
      if (cached) {
        this.stats.cacheHits++;
        console.log(`⚡ Query cache hit: ${table}`);
        return cached;
      }
    }

    // 🔄 DEDUPLICATION CHECK
    if (this.config.enableDeduplication && deduplicationKey) {
      const existingQuery = this.findDuplicateQuery(table, deduplicationKey);
      if (existingQuery) {
        this.stats.deduplicatedQueries++;
        console.log(`🔄 Query deduplicated: ${table}:${deduplicationKey}`);
        return new Promise((resolve, reject) => {
          existingQuery.resolve = resolve;
          existingQuery.reject = reject;
        });
      }
    }

    // 📦 CREATE BATCH QUERY
    return new Promise<T>((resolve, reject) => {
      const batchQuery: BatchQuery = {
        id: this.generateQueryId(),
        table,
        operation,
        query,
        filters,
        resolve,
        reject,
        timestamp: Date.now(),
        priority
      };

      this.addToBatch(batchQuery);
    });
  }

  /**
   * 📦 ADD TO BATCH - Adiciona query ao batch
   */
  private addToBatch(batchQuery: BatchQuery): void {
    const batchKey = `${batchQuery.table}:${batchQuery.operation}`;
    
    if (!this.pendingQueries.has(batchKey)) {
      this.pendingQueries.set(batchKey, []);
    }

    const batch = this.pendingQueries.get(batchKey)!;
    batch.push(batchQuery);
    this.stats.batchedQueries++;

    console.log(`📦 Added to batch: ${batchKey} (${batch.length} queries)`);

    // 🚀 EXECUTE BATCH CONDITIONS
    if (
      batch.length >= this.config.maxBatchSize ||
      batchQuery.priority === 'high' ||
      this.shouldExecuteImmediately(batch)
    ) {
      this.executeBatch(batchKey);
    } else {
      this.scheduleBatchExecution(batchKey);
    }
  }

  /**
   * ⚡ EXECUTE BATCH - Executa um batch de queries
   */
  private async executeBatch(batchKey: string): Promise<void> {
    const batch = this.pendingQueries.get(batchKey);
    if (!batch || batch.length === 0) return;

    // Clear pending batch and timer
    this.pendingQueries.delete(batchKey);
    const timer = this.batchTimers.get(batchKey);
    if (timer) {
      clearTimeout(timer);
      this.batchTimers.delete(batchKey);
    }

    // Prevent duplicate execution
    if (this.inFlightBatches.has(batchKey)) return;
    this.inFlightBatches.add(batchKey);

    console.log(`🚀 Executing batch: ${batchKey} (${batch.length} queries)`);
    this.stats.networkRequests++;

    try {
      const results = await this.executeBatchQueries(batch);
      
      // Resolve individual queries
      batch.forEach((query, index) => {
        const result = results[index];
        
        // Cache successful SELECT results
        if (query.operation === 'select' && result && !result.error && this.config.enableCache) {
          const filters = query.filters || {};
          const cacheKey = this.generateCacheKey(query.table, query.operation, query.query, filters);
          queryCache.set(cacheKey, result, { priority: 'medium' });
        }

        query.resolve(result);
      });

      console.log(`✅ Batch executed successfully: ${batchKey}`);
    } catch (error) {
      console.error(`❌ Batch execution failed: ${batchKey}`, error);
      
      // Reject all queries in batch
      batch.forEach(query => query.reject(error));
    } finally {
      this.inFlightBatches.delete(batchKey);
    }
  }

  /**
   * 🗄️ EXECUTE BATCH QUERIES - Executa queries no Supabase
   */
  private async executeBatchQueries(batch: BatchQuery[]): Promise<any[]> {
    const results: any[] = [];
    
    // Group by operation type for optimal execution
    const selectQueries = batch.filter(q => q.operation === 'select');
    const insertQueries = batch.filter(q => q.operation === 'insert');
    const updateQueries = batch.filter(q => q.operation === 'update');
    const deleteQueries = batch.filter(q => q.operation === 'delete');

    // Execute SELECT queries in parallel
    if (selectQueries.length > 0) {
      const selectPromises = selectQueries.map(async (query) => {
        // Type assertion for dynamic table names
        let supabaseQuery = (supabase as any).from(query.table).select(query.query);
        
        // Apply filters safely
        const filters = query.filters || {};
        Object.entries(filters).forEach(([key, value]) => {
          supabaseQuery = supabaseQuery.eq(key, value);
        });

        const { data, error } = await supabaseQuery;
        return { data, error };
      });

      const selectResults = await Promise.all(selectPromises);
      results.push(...selectResults);
    }

    // Execute INSERT queries
    if (insertQueries.length > 0) {
      for (const query of insertQueries) {
        const { data, error } = await (supabase as any)
          .from(query.table)
          .insert(query.query);
        results.push({ data, error });
      }
    }

    // Execute UPDATE queries
    if (updateQueries.length > 0) {
      for (const query of updateQueries) {
        let supabaseQuery = (supabase as any).from(query.table).update(query.query);
        
        const filters = query.filters || {};
        Object.entries(filters).forEach(([key, value]) => {
          supabaseQuery = supabaseQuery.eq(key, value);
        });

        const { data, error } = await supabaseQuery;
        results.push({ data, error });
      }
    }

    // Execute DELETE queries
    if (deleteQueries.length > 0) {
      for (const query of deleteQueries) {
        let supabaseQuery = (supabase as any).from(query.table).delete();
        
        const filters = query.filters || {};
        Object.entries(filters).forEach(([key, value]) => {
          supabaseQuery = supabaseQuery.eq(key, value);
        });

        const { data, error } = await supabaseQuery;
        results.push({ data, error });
      }
    }

    return results;
  }

  /**
   * ⏰ SCHEDULE BATCH EXECUTION - Agenda execução do batch
   */
  private scheduleBatchExecution(batchKey: string): void {
    if (this.batchTimers.has(batchKey)) return;

    const timer = setTimeout(() => {
      this.executeBatch(batchKey);
    }, this.config.batchTimeout);

    this.batchTimers.set(batchKey, timer);
  }

  /**
   * 🎯 SHOULD EXECUTE IMMEDIATELY - Decide se deve executar imediatamente
   */
  private shouldExecuteImmediately(batch: BatchQuery[]): boolean {
    // Execute immediately if any query is high priority
    return batch.some(q => q.priority === 'high');
  }

  /**
   * 🔍 FIND DUPLICATE QUERY - Busca query duplicada
   */
  private findDuplicateQuery(table: string, deduplicationKey: string): BatchQuery | null {
    for (const [batchKey, batch] of this.pendingQueries) {
      if (batchKey.startsWith(table)) {
        const duplicate = batch.find(q => 
          this.generateQueryId(q) === deduplicationKey
        );
        if (duplicate) return duplicate;
      }
    }
    return null;
  }

  /**
   * 🔑 GENERATE CACHE KEY
   */
  private generateCacheKey(table: string, operation: string, query: any, filters: Record<string, any>): string {
    const queryStr = typeof query === 'string' ? query : JSON.stringify(query);
    const filtersStr = JSON.stringify(filters);
    return `query:${table}:${operation}:${btoa(queryStr + filtersStr)}`;
  }

  /**
   * 🆔 GENERATE QUERY ID
   */
  private generateQueryId(query?: BatchQuery): string {
    if (query) {
      return `${query.table}:${query.operation}:${JSON.stringify(query.query)}:${JSON.stringify(query.filters)}`;
    }
    return `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 📊 GET STATS
   */
  getStats() {
    const batchingEfficiency = this.stats.totalQueries > 0 
      ? ((this.stats.totalQueries - this.stats.networkRequests) / this.stats.totalQueries * 100).toFixed(1)
      : '0.0';

    return {
      ...this.stats,
      pendingBatches: this.pendingQueries.size,
      inFlightBatches: this.inFlightBatches.size,
      batchingEfficiency: `${batchingEfficiency}%`,
      averageBatchSize: this.stats.networkRequests > 0 
        ? (this.stats.batchedQueries / this.stats.networkRequests).toFixed(1)
        : '0.0'
    };
  }

  /**
   * 🧹 FLUSH ALL BATCHES - Força execução de todos os batches
   */
  async flushAllBatches(): Promise<void> {
    const batchKeys = Array.from(this.pendingQueries.keys());
    const flushPromises = batchKeys.map(key => this.executeBatch(key));
    await Promise.allSettled(flushPromises);
    console.log('🧹 All batches flushed');
  }

  /**
   * 🛑 CLEANUP
   */
  cleanup(): void {
    // Clear all timers
    this.batchTimers.forEach(timer => clearTimeout(timer));
    this.batchTimers.clear();
    
    // Clear pending queries
    this.pendingQueries.clear();
    this.inFlightBatches.clear();
    
    console.log('🛑 QueryBatcher cleaned up');
  }
}

// 🎯 SINGLETON INSTANCE
export const queryBatcher = new QueryBatcher();

// 🚀 CONVENIENCE METHODS
export const batchSelect = <T = any>(table: string, query: string, filters?: Record<string, any>) =>
  queryBatcher.batchQuery<T>(table, 'select', query, { filters });

export const batchInsert = <T = any>(table: string, data: any) =>
  queryBatcher.batchQuery<T>(table, 'insert', data);

export const batchUpdate = <T = any>(table: string, data: any, filters: Record<string, any>) =>
  queryBatcher.batchQuery<T>(table, 'update', data, { filters });

export const batchDelete = <T = any>(table: string, filters: Record<string, any>) =>
  queryBatcher.batchQuery<T>(table, 'delete', {}, { filters });

export default QueryBatcher;