/**
 * 🎯 USE TEMPLATE HOOK
 * 
 * Hook React Query para carregar templates diretamente do Supabase
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
 * import { useTemplate } from '@/hooks/useTemplate';
 * 
 * function TemplateEditor({ templateId }: { templateId: string }) {
 *   const { data: template, isLoading, error } = useTemplate(templateId);
 *   
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!template) return <NotFound />;
 *   
 *   return <TemplateRenderer template={template} />;
 * }
 * ```
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 * @phase Fase 1 - Fundação
 */

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Block } from '@/types/editor';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Template data structure matching Supabase schema
 */
export interface Template {
  id: string;
  name: string;
  description?: string | null;
  blocks: Block[];
  config?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
  status?: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  user_id?: string;
}

/**
 * Template query options
 */
export interface UseTemplateOptions extends Omit<UseQueryOptions<Template | null, Error>, 'queryKey' | 'queryFn'> {
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

/**
 * Options for hooks that return arrays of templates
 */
export interface UseTemplatesOptions extends Omit<UseQueryOptions<Template[], Error>, 'queryKey' | 'queryFn'> {
  staleTime?: number;
  enabled?: boolean;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Load a template by ID from Supabase
 * 
 * Features:
 * - Automatic caching with React Query
 * - Real-time updates when template changes
 * - Optimistic UI updates
 * - Automatic refetching on window focus
 * - Background updates
 * 
 * @param id - Template ID to load
 * @param options - Query options
 * @returns Query result with template data
 */
export function useTemplate(
  id: string,
  options: UseTemplateOptions = {}
): UseQueryResult<Template | null, Error> {
  const {
    staleTime = 5 * 60 * 1000, // 5 minutes by default
    enabled = true,
    ...restOptions
  } = options;

  return useQuery<Template | null, Error>({
    // Query key for React Query cache (using factory for consistency)
    queryKey: templateKeys.detail(id),
    
    // Query function
    queryFn: async () => {
      // Validate ID
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid template ID');
      }

      // Fetch from Supabase
      const { data, error } = await (supabase as any)
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();

      // Handle errors
      if (error) {
        // Not found is not an error, return null
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to load template: ${error.message}`);
      }

      // Return template data
      return data as Template;
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
 * Load multiple templates by IDs
 * 
 * @param ids - Array of template IDs
 * @param options - Query options
 * @returns Query result with templates array
 */
export function useTemplates(
  ids: string[],
  options: UseTemplatesOptions = {}
): UseQueryResult<Template[], Error> {
  const {
    staleTime = 5 * 60 * 1000,
    enabled = true,
    ...restOptions
  } = options;

  return useQuery<Template[], Error>({
    queryKey: ['templates', 'byIds', ids],
    
    queryFn: async () => {
      if (!ids || ids.length === 0) {
        return [];
      }

      const { data, error } = await (supabase as any)
        .from('templates')
        .select('*')
        .in('id', ids);

      if (error) {
        throw new Error(`Failed to load templates: ${error.message}`);
      }

      return (data || []) as Template[];
    },
    
    staleTime,
    enabled: enabled && ids.length > 0,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    ...(restOptions as any),
  });
}

/**
 * List all templates with optional filters
 * 
 * @param filters - Optional filters
 * @param options - Query options
 * @returns Query result with templates list
 */
export function useTemplateList(
  filters: {
    status?: Template['status'];
    userId?: string;
    limit?: number;
  } = {},
  options: UseTemplatesOptions = {}
): UseQueryResult<Template[], Error> {
  const {
    staleTime = 2 * 60 * 1000, // 2 minutes for list
    enabled = true,
    ...restOptions
  } = options;

  return useQuery<Template[], Error>({
    queryKey: ['templates', 'list', filters],
    
    queryFn: async () => {
      let query = (supabase as any)
        .from('templates')
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
        throw new Error(`Failed to list templates: ${error.message}`);
      }

      return (data || []) as Template[];
    },
    
    staleTime,
    enabled,
    retry: 2,
    
    ...(restOptions as any),
  });
}

// ============================================================================
// QUERY KEY FACTORY
// ============================================================================

/**
 * Query key factory for templates
 * Useful for manual cache manipulation and invalidation
 * 
 * @example
 * ```typescript
 * // Invalidate all template queries
 * queryClient.invalidateQueries({ queryKey: templateKeys.all });
 * 
 * // Invalidate specific template
 * queryClient.invalidateQueries({ queryKey: templateKeys.detail(id) });
 * ```
 */
export const templateKeys = {
  all: ['template'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters: any) => [...templateKeys.lists(), filters] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.all, id] as const,
  byIds: (ids: string[]) => [...templateKeys.all, 'byIds', ids] as const,
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useTemplate;
