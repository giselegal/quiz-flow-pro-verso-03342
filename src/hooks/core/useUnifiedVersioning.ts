/**
 * 🎯 USE UNIFIED VERSIONING - HOOK DE VERSIONAMENTO INTEGRADO
 * 
 * Hook que integra versionamento e histórico com o sistema CRUD existente,
 * fornecendo funcionalidades completas de versionamento no editor.
 * 
 * FUNCIONALIDADES:
 * ✅ Snapshots automáticos e manuais
 * ✅ Histórico detalhado de mudanças
 * ✅ Comparação entre versões
 * ✅ Rollback/restore de versões
 * ✅ Timeline de eventos
 * ✅ Integração com CRUD existente
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  versioningService, 
  VersionSnapshot, 
  VersionComparison,
  VersioningStats 
} from '@/services/VersioningService';
import { 
  historyManager, 
  HistoryEntry, 
  HistoryFilter,
  HistoryStats 
} from '@/services/HistoryManager';
import { UnifiedFunnel } from '@/services/UnifiedCRUDService';

// =============================================================================
// TIPOS E INTERFACES
// =============================================================================

export interface VersioningState {
  // Estado do versionamento
  currentSnapshot: VersionSnapshot | null;
  snapshots: VersionSnapshot[];
  history: HistoryEntry[];
  
  // Estados de operação
  isLoading: boolean;
  isCreatingSnapshot: boolean;
  isRestoring: boolean;
  
  // Filtros e busca
  historyFilter: HistoryFilter;
  searchQuery: string;
  
  // Estatísticas
  versioningStats: VersioningStats | null;
  historyStats: HistoryStats | null;
  
  // Erro
  error: string | null;
}

export interface VersioningActions {
  // === SNAPSHOTS ===
  createSnapshot: (type?: 'auto' | 'manual' | 'milestone', description?: string) => Promise<VersionSnapshot>;
  getSnapshot: (id: string) => VersionSnapshot | null;
  getLatestSnapshot: () => VersionSnapshot | null;
  deleteSnapshot: (id: string) => Promise<boolean>;
  
  // === HISTÓRICO ===
  getHistory: (filter?: HistoryFilter) => HistoryEntry[];
  searchHistory: (query: string) => HistoryEntry[];
  clearHistory: () => void;
  
  // === COMPARAÇÃO ===
  compareVersions: (idA: string, idB: string) => VersionComparison | null;
  
  // === RESTORE ===
  restoreSnapshot: (id: string) => Promise<UnifiedFunnel | null>;
  
  // === FILTROS ===
  setHistoryFilter: (filter: HistoryFilter) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  
  // === ESTATÍSTICAS ===
  refreshStats: () => void;
  
  // === CONTROLE ===
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface VersioningReturn extends VersioningState, VersioningActions {
  // Estado derivado
  filteredHistory: HistoryEntry[];
  searchResults: HistoryEntry[];
  
  // Métricas
  totalSnapshots: number;
  totalHistoryEntries: number;
  lastSnapshotDate: Date | null;
  lastHistoryDate: Date | null;
}

/**
 * 🎯 HOOK PRINCIPAL DE VERSIONAMENTO
 */
export const useUnifiedVersioning = (
  funnel: UnifiedFunnel | null,
  options: {
    enableAutoSnapshots?: boolean;
    autoSnapshotInterval?: number;
    maxSnapshots?: number;
    enableHistoryTracking?: boolean;
  } = {}
): VersioningReturn => {
  
  const {
    enableAutoSnapshots = true,
    autoSnapshotInterval = 15, // 15 minutos
    maxSnapshots = 50,
    enableHistoryTracking = true,
  } = options;

  // =============================================================================
  // ESTADO PRINCIPAL
  // =============================================================================

  const [state, setState] = useState<VersioningState>({
    currentSnapshot: null,
    snapshots: [],
    history: [],
    isLoading: false,
    isCreatingSnapshot: false,
    isRestoring: false,
    historyFilter: {},
    searchQuery: '',
    versioningStats: null,
    historyStats: null,
    error: null,
  });

  // =============================================================================
  // FUNÇÕES AUXILIARES
  // =============================================================================

  const updateState = useCallback((updates: Partial<VersioningState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const refreshData = useCallback(async () => {
    try {
      updateState({ isLoading: true });
      
      const snapshots = versioningService.getSnapshots();
      const history = historyManager.getHistory();
      const versioningStats = versioningService.getStats();
      const historyStats = historyManager.getStats();
      
      updateState({
        snapshots,
        history,
        versioningStats,
        historyStats,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar dados';
      updateState({
        error: errorMessage,
        isLoading: false,
      });
    }
  }, [updateState]);

  // =============================================================================
  // OPERAÇÕES DE SNAPSHOT
  // =============================================================================

  const createSnapshot = useCallback(async (
    type: 'auto' | 'manual' | 'milestone' = 'manual',
    description?: string
  ): Promise<VersionSnapshot> => {
    if (!funnel) {
      throw new Error('Nenhum funnel carregado para criar snapshot');
    }

    updateState({ isCreatingSnapshot: true, error: null });

    try {
      const snapshot = await versioningService.createSnapshot(funnel, type, description);
      
      // Rastrear no histórico
      if (enableHistoryTracking) {
        await historyManager.trackCRUDChange(
          'snapshot',
          'funnel',
          funnel.id,
          [],
          `Snapshot ${type} criado: ${snapshot.version}`
        );
      }

      // Atualizar dados
      await refreshData();
      
      updateState({ 
        isCreatingSnapshot: false,
        currentSnapshot: snapshot,
      });

      console.log(`📸 Snapshot criado: ${snapshot.id} (${type})`);
      return snapshot;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar snapshot';
      updateState({
        isCreatingSnapshot: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [funnel, enableHistoryTracking, updateState, refreshData]);

  const getSnapshot = useCallback((id: string): VersionSnapshot | null => {
    return versioningService.getSnapshot(id);
  }, []);

  const getLatestSnapshot = useCallback((): VersionSnapshot | null => {
    return versioningService.getLatestSnapshot();
  }, []);

  const deleteSnapshot = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = await versioningService.deleteSnapshot(id);
      
      if (success) {
        // Rastrear no histórico
        if (enableHistoryTracking) {
          await historyManager.trackCRUDChange(
            'delete',
            'system',
            id,
            [],
            `Snapshot ${id} excluído`
          );
        }

        // Atualizar dados
        await refreshData();
        
        console.log(`🗑️ Snapshot excluído: ${id}`);
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir snapshot';
      updateState({ error: errorMessage });
      return false;
    }
  }, [enableHistoryTracking, updateState, refreshData]);

  // =============================================================================
  // OPERAÇÕES DE HISTÓRICO
  // =============================================================================

  const getHistory = useCallback((filter?: HistoryFilter): HistoryEntry[] => {
    return historyManager.getHistory(filter);
  }, []);

  const searchHistory = useCallback((query: string): HistoryEntry[] => {
    return historyManager.searchHistory(query);
  }, []);

  const clearHistory = useCallback((): void => {
    historyManager.clearAll();
    refreshData();
    console.log('🧹 Histórico limpo');
  }, [refreshData]);

  // =============================================================================
  // OPERAÇÕES DE COMPARAÇÃO
  // =============================================================================

  const compareVersions = useCallback((idA: string, idB: string): VersionComparison | null => {
    return versioningService.compareVersions(idA, idB);
  }, []);

  // =============================================================================
  // OPERAÇÕES DE RESTORE
  // =============================================================================

  const restoreSnapshot = useCallback(async (id: string): Promise<UnifiedFunnel | null> => {
    updateState({ isRestoring: true, error: null });

    try {
      const restoredFunnel = await versioningService.restoreSnapshot(id);
      
      if (restoredFunnel) {
        // Rastrear no histórico
        if (enableHistoryTracking) {
          await historyManager.trackCRUDChange(
            'restore',
            'funnel',
            restoredFunnel.id,
            [],
            `Funnel restaurado do snapshot ${id}`
          );
        }

        // Atualizar dados
        await refreshData();
        
        console.log(`🔙 Funnel restaurado do snapshot: ${id}`);
      }
      
      updateState({ isRestoring: false });
      return restoredFunnel;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao restaurar snapshot';
      updateState({
        isRestoring: false,
        error: errorMessage,
      });
      return null;
    }
  }, [enableHistoryTracking, updateState, refreshData]);

  // =============================================================================
  // OPERAÇÕES DE FILTROS
  // =============================================================================

  const setHistoryFilter = useCallback((filter: HistoryFilter) => {
    updateState({ historyFilter: filter });
  }, [updateState]);

  const setSearchQuery = useCallback((query: string) => {
    updateState({ searchQuery: query });
  }, [updateState]);

  const clearFilters = useCallback(() => {
    updateState({ 
      historyFilter: {},
      searchQuery: '',
    });
  }, [updateState]);

  // =============================================================================
  // OPERAÇÕES DE ESTATÍSTICAS
  // =============================================================================

  const refreshStats = useCallback(() => {
    const versioningStats = versioningService.getStats();
    const historyStats = historyManager.getStats();
    
    updateState({
      versioningStats,
      historyStats,
    });
  }, [updateState]);

  // =============================================================================
  // CONTROLE DE ERRO
  // =============================================================================

  const setError = useCallback((error: string | null) => {
    updateState({ error });
  }, [updateState]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // =============================================================================
  // ESTADO DERIVADO
  // =============================================================================

  const filteredHistory = useMemo(() => {
    return historyManager.getHistory(state.historyFilter);
  }, [state.historyFilter]);

  const searchResults = useMemo(() => {
    if (!state.searchQuery) return [];
    return historyManager.searchHistory(state.searchQuery);
  }, [state.searchQuery]);

  const totalSnapshots = useMemo(() => {
    return state.snapshots.length;
  }, [state.snapshots.length]);

  const totalHistoryEntries = useMemo(() => {
    return state.history.length;
  }, [state.history.length]);

  const lastSnapshotDate = useMemo(() => {
    return state.snapshots.length > 0 ? state.snapshots[0].timestamp : null;
  }, [state.snapshots]);

  const lastHistoryDate = useMemo(() => {
    return state.history.length > 0 ? state.history[0].timestamp : null;
  }, [state.history]);

  // =============================================================================
  // EFEITOS
  // =============================================================================

  // Carregar dados iniciais
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Auto-snapshots se habilitado
  useEffect(() => {
    if (!enableAutoSnapshots || !funnel) return;

    const interval = setInterval(async () => {
      try {
        await createSnapshot('auto', 'Auto-snapshot periódico');
      } catch (error) {
        console.warn('⚠️ Erro ao criar auto-snapshot:', error);
      }
    }, autoSnapshotInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [enableAutoSnapshots, autoSnapshotInterval, funnel, createSnapshot]);

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    // Estado
    ...state,
    filteredHistory,
    searchResults,
    totalSnapshots,
    totalHistoryEntries,
    lastSnapshotDate,
    lastHistoryDate,

    // Ações de Snapshot
    createSnapshot,
    getSnapshot,
    getLatestSnapshot,
    deleteSnapshot,

    // Ações de Histórico
    getHistory,
    searchHistory,
    clearHistory,

    // Ações de Comparação
    compareVersions,

    // Ações de Restore
    restoreSnapshot,

    // Ações de Filtros
    setHistoryFilter,
    setSearchQuery,
    clearFilters,

    // Ações de Estatísticas
    refreshStats,

    // Controle
    setError,
    clearError,
  };
};
