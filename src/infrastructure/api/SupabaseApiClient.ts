/**
 * 🎯 SUPABASE API CLIENT - Infrastructure Implementation
 * 
 * Cliente centralizado para todas as operações com Supabase.
 * Fornece métodos padronizados para autenticação, CRUD e analytics.
 */

import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  count: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface QueryOptions {
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
}

export class SupabaseApiClient {
  
  // 🔍 Authentication Methods
  async signUp(email: string, password: string, metadata?: Record<string, any>): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      return {
        data: data.user,
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Sign up failed: ${error}`,
        success: false
      };
    }
  }

  async signIn(email: string, password: string): Promise<ApiResponse<Session>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      return {
        data: data.session,
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Sign in failed: ${error}`,
        success: false
      };
    }
  }

  async signOut(): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.auth.signOut();

      return {
        data: null,
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Sign out failed: ${error}`,
        success: false
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      return {
        data: user,
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Get user failed: ${error}`,
        success: false
      };
    }
  }

  async getCurrentSession(): Promise<ApiResponse<Session>> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      return {
        data: session,
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Get session failed: ${error}`,
        success: false
      };
    }
  }

  // 🔍 Generic CRUD Operations (usando any para evitar problemas de tipo)
  async findById<T>(table: string, id: string, options?: QueryOptions): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await (supabase as any)
        .from(table)
        .select(options?.select || '*')
        .eq('id', id)
        .single();

      return {
        data: data as T,
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Find by ID failed: ${error}`,
        success: false
      };
    }
  }

  async findMany<T>(table: string, options?: QueryOptions): Promise<PaginatedApiResponse<T>> {
    try {
      let query = supabase
        .from(table)
        .select(options?.select || '*', { count: 'exact' });

      // Apply filters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (typeof value === 'object' && value.operator) {
            // Advanced filtering
            const { operator, value: filterValue } = value;
            switch (operator) {
              case 'like':
                query = query.like(key, filterValue);
                break;
              case 'ilike':
                query = query.ilike(key, filterValue);
                break;
              case 'gt':
                query = query.gt(key, filterValue);
                break;
              case 'gte':
                query = query.gte(key, filterValue);
                break;
              case 'lt':
                query = query.lt(key, filterValue);
                break;
              case 'lte':
                query = query.lte(key, filterValue);
                break;
              case 'neq':
                query = query.neq(key, filterValue);
                break;
              default:
                query = query.eq(key, filterValue);
            }
          } else {
            query = query.eq(key, value);
          }
        });
      }

      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending ?? true 
        });
      }

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
        if (options.offset) {
          query = query.range(options.offset, options.offset + options.limit - 1);
        }
      }

      const { data, error, count } = await query;

      return {
        data: data as T[],
        error: error?.message || null,
        success: !error,
        count: count || 0,
        page: options?.offset ? Math.floor(options.offset / (options.limit || 10)) + 1 : 1,
        limit: options?.limit || 10,
        hasMore: count ? (options?.offset || 0) + (options?.limit || 10) < count : false
      };
    } catch (error) {
      return {
        data: null,
        error: `Find many failed: ${error}`,
        success: false,
        count: 0,
        page: 1,
        limit: 10,
        hasMore: false
      };
    }
  }

  async create<T>(table: string, data: any): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await (supabase as any)
        .from(table)
        .insert(data)
        .select()
        .single();

      return {
        data: result as T,
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Create failed: ${error}`,
        success: false
      };
    }
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      return {
        data: result as T,
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Update failed: ${error}`,
        success: false
      };
    }
  }

  async upsert<T>(table: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .upsert(data)
        .select()
        .single();

      return {
        data: result as T,
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Upsert failed: ${error}`,
        success: false
      };
    }
  }

  async delete(table: string, id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      return {
        data: null,
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Delete failed: ${error}`,
        success: false
      };
    }
  }

  // 🔍 Batch Operations
  async bulkCreate<T>(table: string, items: Partial<T>[]): Promise<ApiResponse<T[]>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .insert(items)
        .select();

      return {
        data: data as T[],
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Bulk create failed: ${error}`,
        success: false
      };
    }
  }

  async bulkUpdate<T>(table: string, items: (Partial<T> & { id: string })[]): Promise<ApiResponse<T[]>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .upsert(items)
        .select();

      return {
        data: data as T[],
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Bulk update failed: ${error}`,
        success: false
      };
    }
  }

  async bulkDelete(table: string, ids: string[]): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .in('id', ids);

      return {
        data: null,
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Bulk delete failed: ${error}`,
        success: false
      };
    }
  }

  // 🔍 Advanced Query Operations
  async executeQuery<T>(query: { sql: string; params?: any[] }): Promise<ApiResponse<T[]>> {
    try {
      const { data, error } = await supabase.rpc('execute_query', {
        query_sql: query.sql,
        query_params: query.params || []
      });

      return {
        data: data as T[],
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Query execution failed: ${error}`,
        success: false
      };
    }
  }

  async callFunction<T>(functionName: string, params: Record<string, any> = {}): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase.rpc(functionName, params);

      return {
        data: data as T,
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Function call failed: ${error}`,
        success: false
      };
    }
  }

  // 🔍 Real-time Subscriptions
  subscribeToTable<T>(
    table: string,
    callback: (payload: { eventType: string; new: T; old: T }) => void,
    filter?: string
  ) {
    let subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: table,
        filter: filter
      }, callback);

    subscription.subscribe();

    return {
      unsubscribe: () => subscription.unsubscribe()
    };
  }

  // 🔍 Analytics Helper Methods
  async trackEvent(eventType: string, eventData: Record<string, any>, sessionId?: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('quiz_analytics')
        .insert({
          event_type: eventType,
          event_data: eventData,
          session_id: sessionId,
          funnel_id: eventData.funnelId || null,
          user_id: (await this.getCurrentUser()).data?.id || null
        });

      return {
        data: null,
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Track event failed: ${error}`,
        success: false
      };
    }
  }

  async getAnalytics(funnelId: string, dateFrom?: Date, dateTo?: Date): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase
        .from('quiz_analytics')
        .select('*')
        .eq('funnel_id', funnelId)
        .order('timestamp', { ascending: false });

      if (dateFrom) {
        query = query.gte('timestamp', dateFrom.toISOString());
      }

      if (dateTo) {
        query = query.lte('timestamp', dateTo.toISOString());
      }

      const { data, error } = await query;

      return {
        data: data || [],
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Get analytics failed: ${error}`,
        success: false
      };
    }
  }

  // 🔍 Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: number }>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      return {
        data: {
          status: 'healthy',
          timestamp: Date.now()
        },
        error: error?.message || null,
        success: !error
      };
    } catch (error) {
      return {
        data: null,
        error: `Health check failed: ${error}`,
        success: false
      };
    }
  }
}

// Export singleton instance
export const supabaseApi = new SupabaseApiClient();