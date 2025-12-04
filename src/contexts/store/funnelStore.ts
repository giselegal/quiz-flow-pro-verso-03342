/**
 * 🎯 FUNNEL STORE - Zustand Store para Gerenciamento de Funis
 * 
 * Gerencia todo o estado de funis:
 * - Lista de funis
 * - Funnel atual em edição
 * - CRUD operations
 * - Metadados e configurações
 * 
 * Substitui: FunnelDataProvider, FunnelContext, hooks de funnel fragmentados
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '@/integrations/supabase/client';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES
// ============================================================================

export interface FunnelStep {
  id: string;
  order: number;
  name: string;
  type: string;
  blocks: any[];
  metadata?: Record<string, any>;
}

export type FunnelConfig = Record<string, any>;

export interface Funnel {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: 'draft' | 'published' | 'archived';
  category?: string;
  config?: FunnelConfig;
  metadata?: Record<string, any>;
  steps?: FunnelStep[];
  created_at: string;
  updated_at: string;
  user_id: string;
  is_active?: boolean;
}

interface FunnelState {
  // Lista de funis
  funnels: Funnel[];
  
  // Funnel atual
  currentFunnel: Funnel | null;
  currentFunnelId: string | null;
  
  // Estado de carregamento
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Filtros e ordenação
  filter: {
    status?: string;
    category?: string;
    search?: string;
  };
  sortBy: 'name' | 'updated_at' | 'created_at';
  sortOrder: 'asc' | 'desc';
}

interface FunnelActions {
  // CRUD
  loadFunnels: () => Promise<void>;
  loadFunnel: (id: string) => Promise<Funnel | null>;
  createFunnel: (data: Partial<Funnel>) => Promise<Funnel | null>;
  updateFunnel: (id: string, updates: Partial<Funnel>) => Promise<void>;
  deleteFunnel: (id: string) => Promise<void>;
  duplicateFunnel: (id: string) => Promise<Funnel | null>;
  
  // Estado atual
  setCurrentFunnel: (funnel: Funnel | null) => void;
  setCurrentFunnelId: (id: string | null) => void;
  clearCurrentFunnel: () => void;
  
  // Filtros
  setFilter: (filter: Partial<FunnelState['filter']>) => void;
  setSort: (sortBy: FunnelState['sortBy'], sortOrder: FunnelState['sortOrder']) => void;
  clearFilters: () => void;
  
  // Estado
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  
  // Reset
  reset: () => void;
}

type FunnelStore = FunnelState & FunnelActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: FunnelState = {
  funnels: [],
  currentFunnel: null,
  currentFunnelId: null,
  isLoading: false,
  isSaving: false,
  error: null,
  filter: {},
  sortBy: 'updated_at',
  sortOrder: 'desc',
};

// ============================================================================
// STORE
// ============================================================================

export const useFunnelStore = create<FunnelStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // CRUD Operations
        loadFunnels: async () => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            appLogger.info('📂 [FunnelStore] Carregando funis...');

            const { data, error } = await supabase
              .from('funnels')
              .select('*')
              .order('updated_at', { ascending: false });

            if (error) throw error;

            set((state) => {
              state.funnels = (data || []) as Funnel[];
              state.isLoading = false;
            });

            appLogger.info('✅ [FunnelStore] Funis carregados:', data?.length || 0);
          } catch (err: any) {
            const errorMsg = err.message || 'Erro ao carregar funis';
            set((state) => {
              state.isLoading = false;
              state.error = errorMsg;
            });
            appLogger.error('❌ [FunnelStore] Erro ao carregar funis:', err);
          }
        },

        loadFunnel: async (id) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            appLogger.info('📂 [FunnelStore] Carregando funnel:', id);

            const { data, error } = await supabase
              .from('funnels')
              .select('*')
              .eq('id', id)
              .single();

            if (error) throw error;

            const funnel = data as Funnel;

            set((state) => {
              state.currentFunnel = funnel;
              state.currentFunnelId = id;
              state.isLoading = false;
            });

            appLogger.info('✅ [FunnelStore] Funnel carregado:', funnel?.name);
            return funnel;
          } catch (err: any) {
            const errorMsg = err.message || 'Erro ao carregar funnel';
            set((state) => {
              state.isLoading = false;
              state.error = errorMsg;
            });
            appLogger.error('❌ [FunnelStore] Erro ao carregar funnel:', err);
            return null;
          }
        },

        createFunnel: async (data) => {
          set((state) => {
            state.isSaving = true;
            state.error = null;
          });

          try {
            appLogger.info('➕ [FunnelStore] Criando funnel...');

            const insertData = {
              name: data.name || 'Novo Funil',
              description: data.description || '',
              type: data.type || 'quiz',
              status: 'draft' as const,
              config: (data.config || {}) as Record<string, any>,
              metadata: (data.metadata || {}) as Record<string, any>,
              user_id: data.user_id!,
            };

            const { data: created, error } = await supabase
              .from('funnels')
              .insert(insertData)
              .select()
              .single();

            if (error) throw error;

            const funnel = created as Funnel;

            set((state) => {
              state.funnels.unshift(funnel);
              state.currentFunnel = funnel;
              state.currentFunnelId = funnel.id;
              state.isSaving = false;
            });

            appLogger.info('✅ [FunnelStore] Funnel criado:', funnel?.name);
            return funnel;
          } catch (err: any) {
            const errorMsg = err.message || 'Erro ao criar funnel';
            set((state) => {
              state.isSaving = false;
              state.error = errorMsg;
            });
            appLogger.error('❌ [FunnelStore] Erro ao criar funnel:', err);
            return null;
          }
        },

        updateFunnel: async (id, updates) => {
          set((state) => {
            state.isSaving = true;
            state.error = null;
          });

          try {
            appLogger.info('🔄 [FunnelStore] Atualizando funnel:', id);

            // Build update object with proper typing
            const updateData: Record<string, any> = {
              updated_at: new Date().toISOString(),
            };
            
            if (updates.name !== undefined) updateData.name = updates.name;
            if (updates.description !== undefined) updateData.description = updates.description;
            if (updates.type !== undefined) updateData.type = updates.type;
            if (updates.status !== undefined) updateData.status = updates.status;
            if (updates.category !== undefined) updateData.category = updates.category;
            if (updates.config !== undefined) updateData.config = updates.config;
            if (updates.metadata !== undefined) updateData.metadata = updates.metadata;
            if (updates.is_active !== undefined) updateData.is_active = updates.is_active;

            const { data, error } = await supabase
              .from('funnels')
              .update(updateData)
              .eq('id', id)
              .select()
              .single();

            if (error) throw error;

            const funnel = data as Funnel;

            set((state) => {
              // Atualizar na lista
              const index = state.funnels.findIndex((f) => f.id === id);
              if (index !== -1) {
                state.funnels[index] = funnel;
              }
              
              // Atualizar current se for o mesmo
              if (state.currentFunnelId === id) {
                state.currentFunnel = funnel;
              }
              
              state.isSaving = false;
            });

            appLogger.info('✅ [FunnelStore] Funnel atualizado');
          } catch (err: any) {
            const errorMsg = err.message || 'Erro ao atualizar funnel';
            set((state) => {
              state.isSaving = false;
              state.error = errorMsg;
            });
            appLogger.error('❌ [FunnelStore] Erro ao atualizar funnel:', err);
          }
        },

        deleteFunnel: async (id) => {
          set((state) => {
            state.isSaving = true;
            state.error = null;
          });

          try {
            appLogger.info('🗑️ [FunnelStore] Deletando funnel:', id);

            const { error } = await supabase
              .from('funnels')
              .delete()
              .eq('id', id);

            if (error) throw error;

            set((state) => {
              state.funnels = state.funnels.filter((f) => f.id !== id);
              
              if (state.currentFunnelId === id) {
                state.currentFunnel = null;
                state.currentFunnelId = null;
              }
              
              state.isSaving = false;
            });

            appLogger.info('✅ [FunnelStore] Funnel deletado');
          } catch (err: any) {
            const errorMsg = err.message || 'Erro ao deletar funnel';
            set((state) => {
              state.isSaving = false;
              state.error = errorMsg;
            });
            appLogger.error('❌ [FunnelStore] Erro ao deletar funnel:', err);
          }
        },

        duplicateFunnel: async (id) => {
          const original = get().funnels.find((f) => f.id === id);
          if (!original) return null;

          return get().createFunnel({
            ...original,
            name: `${original.name} (cópia)`,
            status: 'draft',
          });
        },

        // Estado atual
        setCurrentFunnel: (funnel) =>
          set((state) => {
            state.currentFunnel = funnel;
            state.currentFunnelId = funnel?.id || null;
          }),

        setCurrentFunnelId: (id) =>
          set((state) => {
            state.currentFunnelId = id;
          }),

        clearCurrentFunnel: () =>
          set((state) => {
            state.currentFunnel = null;
            state.currentFunnelId = null;
          }),

        // Filtros
        setFilter: (filter) =>
          set((state) => {
            state.filter = { ...state.filter, ...filter };
          }),

        setSort: (sortBy, sortOrder) =>
          set((state) => {
            state.sortBy = sortBy;
            state.sortOrder = sortOrder;
          }),

        clearFilters: () =>
          set((state) => {
            state.filter = {};
          }),

        // Estado
        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setSaving: (saving) =>
          set((state) => {
            state.isSaving = saving;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        // Reset
        reset: () => set(initialState),
      })),
      {
        name: 'funnel-storage',
        partialize: (state) => ({
          currentFunnelId: state.currentFunnelId,
          filter: state.filter,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        }),
      },
    ),
    { name: 'FunnelStore' },
  ),
);

// ============================================================================
// SELECTORS
// ============================================================================

export const useFunnelList = () => useFunnelStore((state) => state.funnels);

export const useCurrentFunnel = () => useFunnelStore((state) => state.currentFunnel);

export const useFunnelLoading = () =>
  useFunnelStore((state) => ({
    isLoading: state.isLoading,
    isSaving: state.isSaving,
  }));

export const useFilteredFunnels = () =>
  useFunnelStore((state) => {
    let filtered = [...state.funnels];
    
    // Apply filters
    if (state.filter.status) {
      filtered = filtered.filter((f) => f.status === state.filter.status);
    }
    if (state.filter.category) {
      filtered = filtered.filter((f) => f.category === state.filter.category);
    }
    if (state.filter.search) {
      const search = state.filter.search.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(search) ||
          f.description?.toLowerCase().includes(search),
      );
    }
    
    // Apply sort
    filtered.sort((a, b) => {
      const aVal = a[state.sortBy] || '';
      const bVal = b[state.sortBy] || '';
      const cmp = aVal.localeCompare(bVal);
      return state.sortOrder === 'asc' ? cmp : -cmp;
    });
    
    return filtered;
  });

export const useFunnelActions = () =>
  useFunnelStore((state) => ({
    loadFunnels: state.loadFunnels,
    loadFunnel: state.loadFunnel,
    createFunnel: state.createFunnel,
    updateFunnel: state.updateFunnel,
    deleteFunnel: state.deleteFunnel,
    duplicateFunnel: state.duplicateFunnel,
    setCurrentFunnel: state.setCurrentFunnel,
    clearCurrentFunnel: state.clearCurrentFunnel,
  }));
