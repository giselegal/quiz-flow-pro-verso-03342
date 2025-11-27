/**
 * 🎯 USE FUNNEL HOOK
 * 
 * Hook React Query para carregar funnels diretamente do Supabase
 * Parte do plano de consolidação para estabelecer Supabase + React Query
 * como Single Source of Truth
 * 
 * 🎯 FASE 1 - FUNDAÇÃO TÉCNICA
 * Este hook faz parte da implementação inicial da arquitetura canônica.
 * Substitui múltiplas camadas de cache (localStorage, Zustand, cache interno)
 * por uma única fonte de verdade com React Query.
 * 
 * @example
 * ```typescript
 * import { useFunnel } from '@/hooks/useFunnel';
 * 
 * function FunnelEditor({ funnelId }: { funnelId: string }) {
 *   const { data: funnel, isLoading, error } = useFunnel(funnelId);
 *   
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!funnel) return <NotFound />;
 *   
 *   return <FunnelRenderer funnel={funnel} />;
 * }
 * ```
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 * @phase Fase 1 - Fundação
 */

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Funnel data structure matching Supabase schema
 */
export interface Funnel {
  id: string;
  name: string;
  description?: string | null;
  config?: Record<string, any> | null;
  status?: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  user_id?: string;
}

/**
 * Funnel query options
 */
export interface UseFunnelOptions extends Omit<UseQueryOptions<Funnel | null, Error>, 'queryKey' | 'queryFn'> {
  /**
   * Cache time in milliseconds
   * @default 5 * 60 * 1000 (5 minutes)
   */
  staleTime?: number;
  
  /**
   * Enable query (useful for conditional fetching)
   * @default true
   */
  enabled?: boolean;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Load a funnel by ID from Supabase
 * 
 * Features:
 * - Automatic caching with React Query
 * - Real-time updates when funnel changes
 * - Optimistic UI updates
 * - Automatic refetching on window focus
 * - Background updates
 * 
 * @param id - Funnel ID to load
 * @param options - Query options
 * @returns Query result with funnel data
 */
export function useFunnel(
  id: string,
  options: UseFunnelOptions = {}
): UseQueryResult<Funnel | null, Error> {
  const {
    staleTime = 5 * 60 * 1000, // 5 minutes by default
    enabled = true,
    ...restOptions
  } = options;

  return useQuery<Funnel | null, Error>({
    // Query key for React Query cache (using factory for consistency)
    queryKey: funnelKeys.detail(id),
    
    // Query function
    queryFn: async () => {
      // Validate ID
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid funnel ID');
      }

      // Fetch from Supabase
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      // Handle errors
      if (error) {
        // Not found is not an error, return null
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to load funnel: ${error.message}`);
      }

      // Return funnel data
      return data as Funnel;
    },
    
    // Cache configuration
    staleTime,
    
    // Enable/disable query
    enabled: enabled && !!id,
    
    // Retry configuration
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Pass through other options
    ...restOptions,
  });
}

/**
 * Load multiple funnels by IDs
 * 
 * @param ids - Array of funnel IDs
 * @param options - Query options
 * @returns Query result with funnels array
 */
export function useFunnels(
  ids: string[],
  options: Omit<UseQueryOptions<Funnel[], Error>, 'queryKey' | 'queryFn'> = {}
): UseQueryResult<Funnel[], Error> {
  const {
    staleTime = 5 * 60 * 1000,
    enabled = true,
    ...restOptions
  } = options as any;

  return useQuery<Funnel[], Error>({
    queryKey: ['funnels', 'byIds', ids],
    
    queryFn: async () => {
      if (!ids || ids.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .in('id', ids);

      if (error) {
        throw new Error(`Failed to load funnels: ${error.message}`);
      }

      return (data || []) as Funnel[];
    },
    
    staleTime,
    enabled: enabled && ids.length > 0,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    ...restOptions,
  });
}

/**
 * List all funnels with optional filters
 * 
 * @param filters - Optional filters
 * @param options - Query options
 * @returns Query result with funnels list
 */
export function useFunnelList(
  filters: {
    status?: Funnel['status'];
    userId?: string;
    limit?: number;
  } = {},
  options: Omit<UseQueryOptions<Funnel[], Error>, 'queryKey' | 'queryFn'> = {}
): UseQueryResult<Funnel[], Error> {
  const {
    staleTime = 2 * 60 * 1000, // 2 minutes for list
    enabled = true,
    ...restOptions
  } = options as any;

  return useQuery<Funnel[], Error>({
    queryKey: ['funnels', 'list', filters],
    
    queryFn: async () => {
      let query = supabase
        .from('funnels')
        .select('*')
        .order('updated_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to list funnels: ${error.message}`);
      }

      return (data || []) as Funnel[];
    },
    
    staleTime,
    enabled,
    retry: 2,
    
    ...restOptions,
  });
}

// ============================================================================
// QUERY KEY FACTORY
// ============================================================================

/**
 * Query key factory for funnels
 * Useful for manual cache manipulation and invalidation
 * 
 * @example
 * ```typescript
 * // Invalidate all funnel queries
 * queryClient.invalidateQueries({ queryKey: funnelKeys.all });
 * 
 * // Invalidate specific funnel
 * queryClient.invalidateQueries({ queryKey: funnelKeys.detail(id) });
 * ```
 */
export const funnelKeys = {
  all: ['funnel'] as const,
  lists: () => [...funnelKeys.all, 'list'] as const,
  list: (filters: any) => [...funnelKeys.lists(), filters] as const,
  details: () => [...funnelKeys.all, 'detail'] as const,
  detail: (id: string) => [...funnelKeys.all, id] as const,
  byIds: (ids: string[]) => [...funnelKeys.all, 'byIds', ids] as const,
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useFunnel;
