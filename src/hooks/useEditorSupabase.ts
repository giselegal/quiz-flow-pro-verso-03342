/**
 * UNIFIED EDITOR-SUPABASE HOOK
 * 
 * Centralized hook that provides solid alignment between editor operations
 * and Supabase data persistence, addressing fragmentation issues.
 * 
 * Features:
 * - Unified state management for editor + Supabase
 * - Robust error handling and recovery mechanisms
 * - Optimistic updates with rollback
 * - Comprehensive loading states
 * - Type-safe operations with proper validation
 * - Automatic retry logic for failed operations
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { 
  ComponentInstance, 
  InsertComponentInstance, 
  UpdateComponentInstance,
  Funnel,
  FunnelPage
} from '@/types/unified-schema';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface EditorSupabaseState {
  components: ComponentInstance[];
  funnels: Funnel[];
  currentFunnel: Funnel | null;
  currentPage: FunnelPage | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  connectionStatus: 'checking' | 'connected' | 'error' | 'offline';
  lastSync: Date | null;
}

export interface EditorSupabaseOperations {
  // Connection Management
  testConnection: () => Promise<boolean>;
  reconnect: () => Promise<boolean>;
  
  // Component Operations
  addComponent: (input: Omit<InsertComponentInstance, 'id'>) => Promise<ComponentInstance | null>;
  updateComponent: (id: string, updates: Partial<UpdateComponentInstance>) => Promise<ComponentInstance | null>;
  deleteComponent: (id: string) => Promise<boolean>;
  reorderComponents: (componentIds: string[]) => Promise<boolean>;
  
  // Funnel Operations
  createFunnel: (name: string, description?: string) => Promise<Funnel | null>;
  loadFunnel: (funnelId: string) => Promise<boolean>;
  saveFunnel: () => Promise<boolean>;
  
  // Batch Operations
  batchUpdateComponents: (updates: Array<{ id: string; updates: Partial<UpdateComponentInstance> }>) => Promise<boolean>;
  syncLocalToSupabase: () => Promise<boolean>;
  
  // Utility
  clearError: () => void;
  forceRefresh: () => Promise<void>;
}

export interface UseEditorSupabaseConfig {
  funnelId?: string;
  stepNumber?: number;
  enableAutoSync?: boolean;
  enableOptimisticUpdates?: boolean;
  retryAttempts?: number;
  syncInterval?: number; // in milliseconds
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

export const useEditorSupabase = (config: UseEditorSupabaseConfig = {}) => {
  const {
    funnelId,
    stepNumber = 1,
    enableAutoSync = true,
    enableOptimisticUpdates = true,
    retryAttempts = 3,
    syncInterval = 30000, // 30 seconds
  } = config;

  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================

  const [state, setState] = useState<EditorSupabaseState>({
    components: [],
    funnels: [],
    currentFunnel: null,
    currentPage: null,
    isLoading: false,
    isSaving: false,
    error: null,
    connectionStatus: 'checking',
    lastSync: null,
  });

  // Refs for cleanup and state management
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const optimisticUpdatesRef = useRef<Map<string, any>>(new Map());

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  const updateState = useCallback((updates: Partial<EditorSupabaseState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  const handleError = useCallback((error: any, context: string) => {
    const errorMessage = error?.message || 'Erro desconhecido';
    console.error(`❌ [useEditorSupabase] ${context}:`, error);
    
    updateState({ 
      error: errorMessage,
      connectionStatus: error?.code === 'PGRST301' ? 'offline' : 'error'
    });

    toast({
      title: `Erro: ${context}`,
      description: errorMessage,
      variant: 'destructive',
    });
  }, [updateState]);

  // =============================================================================
  // CONNECTION MANAGEMENT
  // =============================================================================

  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      updateState({ connectionStatus: 'checking' });
      
      const { error } = await supabase
        .from('component_types')
        .select('count')
        .limit(1);

      if (error) throw error;

      updateState({ 
        connectionStatus: 'connected',
        lastSync: new Date(),
        error: null
      });
      
      console.log('✅ [useEditorSupabase] Conexão Supabase validada');
      return true;
    } catch (error) {
      handleError(error, 'Teste de Conexão');
      return false;
    }
  }, [updateState, handleError]);

  const reconnect = useCallback(async (): Promise<boolean> => {
    console.log('🔄 [useEditorSupabase] Tentando reconectar...');
    
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      console.log(`🔄 Tentativa ${attempt}/${retryAttempts}`);
      
      const success = await testConnection();
      if (success) {
        console.log('✅ [useEditorSupabase] Reconexão bem-sucedida');
        return true;
      }
      
      if (attempt < retryAttempts) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    console.log('❌ [useEditorSupabase] Falha na reconexão após todas as tentativas');
    return false;
  }, [testConnection, retryAttempts]);

  // =============================================================================
  // COMPONENT OPERATIONS
  // =============================================================================

  const addComponent = useCallback(async (
    input: Omit<InsertComponentInstance, 'id'>
  ): Promise<ComponentInstance | null> => {
    try {
      updateState({ isSaving: true, error: null });

      // Optimistic update
      if (enableOptimisticUpdates) {
        const optimisticComponent: ComponentInstance = {
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: null,
          custom_styling: null,
          is_active: true,
          is_locked: false,
          is_template: false,
          stage_id: null,
          ...input,
        };

        setState(prev => ({
          ...prev,
          components: [...prev.components, optimisticComponent].sort((a, b) => a.order_index - b.order_index)
        }));

        optimisticUpdatesRef.current.set(optimisticComponent.id, optimisticComponent);
      }

      const { data, error } = await supabase
        .from('component_instances')
        .insert(input)
        .select()
        .single();

      if (error) throw error;

      // Replace optimistic update with real data
      if (enableOptimisticUpdates && data) {
        const tempId = Array.from(optimisticUpdatesRef.current.keys())[0];
        if (tempId) {
          optimisticUpdatesRef.current.delete(tempId);
          setState(prev => ({
            ...prev,
            components: prev.components.map(c => 
              c.id === tempId ? data : c
            )
          }));
        }
      } else if (data) {
        setState(prev => ({
          ...prev,
          components: [...prev.components, data].sort((a, b) => a.order_index - b.order_index)
        }));
      }

      updateState({ lastSync: new Date() });
      
      console.log('✅ [useEditorSupabase] Componente adicionado:', data?.id);
      return data;
    } catch (error) {
      // Rollback optimistic update
      if (enableOptimisticUpdates) {
        const tempIds = Array.from(optimisticUpdatesRef.current.keys());
        setState(prev => ({
          ...prev,
          components: prev.components.filter(c => !tempIds.includes(c.id))
        }));
        optimisticUpdatesRef.current.clear();
      }

      handleError(error, 'Adicionar Componente');
      return null;
    } finally {
      updateState({ isSaving: false });
    }
  }, [updateState, handleError, enableOptimisticUpdates]);

  const updateComponent = useCallback(async (
    id: string, 
    updates: Partial<UpdateComponentInstance>
  ): Promise<ComponentInstance | null> => {
    try {
      updateState({ isSaving: true, error: null });

      // Optimistic update
      let originalComponent: ComponentInstance | null = null;
      if (enableOptimisticUpdates) {
        setState(prev => {
          const componentIndex = prev.components.findIndex(c => c.id === id);
          if (componentIndex === -1) return prev;

          originalComponent = prev.components[componentIndex];
          const updatedComponents = [...prev.components];
          updatedComponents[componentIndex] = {
            ...originalComponent,
            ...updates,
            updated_at: new Date().toISOString()
          };

          return {
            ...prev,
            components: updatedComponents
          };
        });
      }

      const { data, error } = await supabase
        .from('component_instances')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update with real data
      if (data) {
        setState(prev => ({
          ...prev,
          components: prev.components.map(c => 
            c.id === id ? data : c
          )
        }));
      }

      updateState({ lastSync: new Date() });
      
      console.log('✅ [useEditorSupabase] Componente atualizado:', id);
      return data;
    } catch (error) {
      // Rollback optimistic update
      if (enableOptimisticUpdates && originalComponent) {
        setState(prev => ({
          ...prev,
          components: prev.components.map(c => 
            c.id === id ? originalComponent! : c
          )
        }));
      }

      handleError(error, 'Atualizar Componente');
      return null;
    } finally {
      updateState({ isSaving: false });
    }
  }, [updateState, handleError, enableOptimisticUpdates]);

  const deleteComponent = useCallback(async (id: string): Promise<boolean> => {
    try {
      updateState({ isSaving: true, error: null });

      // Optimistic update
      let originalComponent: ComponentInstance | null = null;
      if (enableOptimisticUpdates) {
        setState(prev => {
          const component = prev.components.find(c => c.id === id);
          if (component) originalComponent = component;
          
          return {
            ...prev,
            components: prev.components.filter(c => c.id !== id)
          };
        });
      }

      const { error } = await supabase
        .from('component_instances')
        .delete()
        .eq('id', id);

      if (error) throw error;

      updateState({ lastSync: new Date() });
      
      console.log('✅ [useEditorSupabase] Componente removido:', id);
      return true;
    } catch (error) {
      // Rollback optimistic update
      if (enableOptimisticUpdates && originalComponent) {
        setState(prev => ({
          ...prev,
          components: [...prev.components, originalComponent!].sort((a, b) => a.order_index - b.order_index)
        }));
      }

      handleError(error, 'Remover Componente');
      return false;
    } finally {
      updateState({ isSaving: false });
    }
  }, [updateState, handleError, enableOptimisticUpdates]);

  const reorderComponents = useCallback(async (componentIds: string[]): Promise<boolean> => {
    try {
      updateState({ isSaving: true, error: null });

      // Optimistic update
      let originalComponents: ComponentInstance[] = [];
      if (enableOptimisticUpdates) {
        setState(prev => {
          originalComponents = [...prev.components];
          
          const reorderedComponents = componentIds.map((id, index) => {
            const component = prev.components.find(c => c.id === id);
            if (!component) return null;
            
            return {
              ...component,
              order_index: index,
              updated_at: new Date().toISOString()
            };
          }).filter(Boolean) as ComponentInstance[];

          return {
            ...prev,
            components: reorderedComponents
          };
        });
      }

      // Batch update order_index for all components
      const updates = componentIds.map((id, index) => ({
        id,
        order_index: index
      }));

      const { error } = await supabase.rpc('batch_update_component_order', {
        updates: updates
      });

      if (error) throw error;

      updateState({ lastSync: new Date() });
      
      console.log('✅ [useEditorSupabase] Componentes reordenados');
      return true;
    } catch (error) {
      // Rollback optimistic update
      if (enableOptimisticUpdates && originalComponents.length > 0) {
        setState(prev => ({
          ...prev,
          components: originalComponents
        }));
      }

      handleError(error, 'Reordenar Componentes');
      return false;
    } finally {
      updateState({ isSaving: false });
    }
  }, [updateState, handleError, enableOptimisticUpdates]);

  // =============================================================================
  // DATA LOADING
  // =============================================================================

  const loadComponents = useCallback(async (targetFunnelId?: string, targetStepNumber?: number) => {
    const effectiveFunnelId = targetFunnelId || funnelId;
    const effectiveStepNumber = targetStepNumber || stepNumber;

    if (!effectiveFunnelId) {
      console.warn('⚠️ [useEditorSupabase] FunnelId não fornecido para carregar componentes');
      return;
    }

    try {
      updateState({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from('component_instances')
        .select(`
          *,
          component_types (
            type_key,
            display_name,
            category,
            default_properties
          )
        `)
        .eq('funnel_id', effectiveFunnelId)
        .eq('step_number', effectiveStepNumber)
        .order('order_index');

      if (error) throw error;

      updateState({ 
        components: data || [],
        lastSync: new Date()
      });

      console.log(`✅ [useEditorSupabase] Componentes carregados: ${data?.length || 0}`);
    } catch (error) {
      handleError(error, 'Carregar Componentes');
    } finally {
      updateState({ isLoading: false });
    }
  }, [funnelId, stepNumber, updateState, handleError]);

  const forceRefresh = useCallback(async () => {
    console.log('🔄 [useEditorSupabase] Forçando atualização...');
    await Promise.all([
      testConnection(),
      loadComponents()
    ]);
  }, [testConnection, loadComponents]);

  // =============================================================================
  // BATCH OPERATIONS
  // =============================================================================

  const batchUpdateComponents = useCallback(async (
    updates: Array<{ id: string; updates: Partial<UpdateComponentInstance> }>
  ): Promise<boolean> => {
    try {
      updateState({ isSaving: true, error: null });

      // Execute all updates in parallel
      const promises = updates.map(({ id, updates: componentUpdates }) =>
        supabase
          .from('component_instances')
          .update(componentUpdates)
          .eq('id', id)
          .select()
          .single()
      );

      const results = await Promise.allSettled(promises);
      
      // Check for any failures
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        throw new Error(`${failures.length} atualizações falharam de ${updates.length}`);
      }

      // Update local state with successful results
      const successfulResults = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value.data)
        .filter(Boolean);

      setState(prev => ({
        ...prev,
        components: prev.components.map(component => {
          const updatedComponent = successfulResults.find(updated => updated.id === component.id);
          return updatedComponent || component;
        })
      }));

      updateState({ lastSync: new Date() });
      
      console.log(`✅ [useEditorSupabase] Batch update concluído: ${successfulResults.length} componentes`);
      return true;
    } catch (error) {
      handleError(error, 'Atualização em Lote');
      return false;
    } finally {
      updateState({ isSaving: false });
    }
  }, [updateState, handleError]);

  // =============================================================================
  // AUTO-SYNC & LIFECYCLE
  // =============================================================================

  // Initial connection test and data loading
  useEffect(() => {
    console.log('🚀 [useEditorSupabase] Inicializando...');
    
    const initialize = async () => {
      const connected = await testConnection();
      if (connected) {
        await loadComponents();
      }
    };

    initialize();

    // Setup auto-sync interval
    if (enableAutoSync && syncInterval > 0) {
      syncIntervalRef.current = setInterval(() => {
        if (state.connectionStatus === 'connected') {
          console.log('🔄 [useEditorSupabase] Auto-sync executando...');
          loadComponents();
        }
      }, syncInterval);
    }

    // Cleanup
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [funnelId, stepNumber]); // Re-run when funnel or step changes

  // Cleanup optimistic updates on unmount
  useEffect(() => {
    return () => {
      optimisticUpdatesRef.current.clear();
    };
  }, []);

  // =============================================================================
  // RETURN INTERFACE
  // =============================================================================

  const operations: EditorSupabaseOperations = {
    // Connection
    testConnection,
    reconnect,
    
    // Components
    addComponent,
    updateComponent,
    deleteComponent,
    reorderComponents,
    
    // Funnel operations (placeholder for future implementation)
    createFunnel: async () => null,
    loadFunnel: async () => false,
    saveFunnel: async () => false,
    
    // Batch operations
    batchUpdateComponents,
    syncLocalToSupabase: async () => false, // TODO: Implement
    
    // Utility
    clearError,
    forceRefresh,
  };

  return {
    ...state,
    ...operations,
  };
};

export type UseEditorSupabaseReturn = ReturnType<typeof useEditorSupabase>;