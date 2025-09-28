/**
 * 🎯 UNIFIED CRUD INTEGRATION - CONEXÃO ENTRE CRUD E REAL STAGES
 * 
 * Componente que integra o UnifiedCRUDService com o RealStagesProvider,
 * criando uma ponte entre as operações CRUD e o pipeline de etapas.
 * 
 * FUNCIONALIDADES:
 * ✅ Integração bidirecional entre CRUD e Stages
 * ✅ Sincronização automática de dados
 * ✅ Fallbacks robustos para operações
 * ✅ Cache inteligente compartilhado
 * ✅ Error handling unificado
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Block } from '@/types/editor';
import { 
  unifiedCRUDService, 
  UnifiedFunnel, 
  UnifiedStage, 
  CRUDResult 
} from '@/services/UnifiedCRUDService';
import { templatesCacheService } from '@/services/TemplatesCacheService';

// Tipos de integração
interface CRUDIntegrationState {
  // Estado do funnel ativo
  activeFunnel: UnifiedFunnel | null;
  activeStageId: string | null;
  
  // Estados de operação
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  error: string | null;
  
  // Métricas de performance
  lastOperation: string | null;
  operationCount: number;
  cacheHitRate: number;
}

interface CRUDIntegrationActions {
  // === OPERAÇÕES DE FUNNEL ===
  loadFunnel: (funnelId: string) => Promise<void>;
  saveFunnel: () => Promise<boolean>;
  createFunnel: (name: string, description?: string) => Promise<string>;
  deleteFunnel: (funnelId: string) => Promise<boolean>;
  duplicateFunnel: (funnelId: string, newName?: string) => Promise<string>;
  
  // === OPERAÇÕES DE STAGE ===
  addStage: (name?: string, insertAfter?: string) => Promise<string>;
  updateStage: (stageId: string, updates: Partial<UnifiedStage>) => Promise<void>;
  deleteStage: (stageId: string) => Promise<void>;
  reorderStages: (startIndex: number, endIndex: number) => Promise<void>;
  setActiveStage: (stageId: string) => void;
  duplicateStage: (stageId: string, newName?: string) => Promise<string>;
  
  // === OPERAÇÕES DE BLOCK ===
  addBlock: (type: string, stageId?: string) => Promise<string>;
  updateBlock: (blockId: string, updates: Partial<Block>) => Promise<void>;
  deleteBlock: (blockId: string) => Promise<void>;
  duplicateBlock: (blockId: string) => Promise<string>;
  reorderBlocks: (startIndex: number, endIndex: number) => Promise<void>;
  
  // === OPERAÇÕES DE CACHE ===
  refreshCache: () => Promise<void>;
  clearCache: () => void;
  getCacheStats: () => any;
  
  // === CONTROLE DE ESTADO ===
  markDirty: () => void;
  markClean: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

interface CRUDIntegrationContextType extends CRUDIntegrationState, CRUDIntegrationActions {
  // Estado derivado
  activeStage: UnifiedStage | null;
  activeBlocks: Block[];
  
  // Status do sistema
  systemStatus: {
    isOnline: boolean;
    hasUnsavedChanges: boolean;
    cacheSize: number;
    lastSync: Date | null;
  };
}

const CRUDIntegrationContext = createContext<CRUDIntegrationContextType | null>(null);

// Props do provider
interface CRUDIntegrationProviderProps {
  children: React.ReactNode;
  initialFunnelId?: string;
  enableAutoSave?: boolean;
  autoSaveInterval?: number;
  enableCache?: boolean;
}

/**
 * 🏗️ PROVIDER DE INTEGRAÇÃO CRUD
 */
export const CRUDIntegrationProvider: React.FC<CRUDIntegrationProviderProps> = ({
  children,
  initialFunnelId,
  enableAutoSave = true,
  autoSaveInterval = 5000,
  enableCache = true,
}) => {
  // Estados principais
  const [state, setState] = useState<CRUDIntegrationState>({
    activeFunnel: null,
    activeStageId: null,
    isLoading: false,
    isSaving: false,
    isDirty: false,
    error: null,
    lastOperation: null,
    operationCount: 0,
    cacheHitRate: 0,
  });

  // Auto-save timeout
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout>();

  /**
   * 🔄 ATUALIZAR ESTADO
   */
  const updateState = useCallback((updates: Partial<CRUDIntegrationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * 📊 ATUALIZAR MÉTRICAS
   */
  const updateMetrics = useCallback((operation: string) => {
    setState(prev => ({
      ...prev,
      lastOperation: operation,
      operationCount: prev.operationCount + 1,
    }));
  }, []);

  /**
   * 🎯 AGENDAR AUTO-SAVE
   */
  const scheduleAutoSave = useCallback(() => {
    if (!enableAutoSave || !state.isDirty || !state.activeFunnel) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      if (state.isDirty && state.activeFunnel && !state.isSaving) {
        console.log('🔄 Auto-save triggered');
        await saveFunnel();
      }
    }, autoSaveInterval);
  }, [enableAutoSave, state.isDirty, state.activeFunnel, state.isSaving, autoSaveInterval]);

  // =============================================================================
  // OPERAÇÕES DE FUNNEL
  // =============================================================================

  const loadFunnel = useCallback(async (funnelId: string): Promise<void> => {
    updateState({ isLoading: true, error: null });
    updateMetrics('loadFunnel');

    try {
      const result = await unifiedCRUDService.getFunnel(funnelId);
      
      if (result.success && result.data) {
        updateState({
          activeFunnel: result.data,
          activeStageId: result.data.stages[0]?.id || null,
          isLoading: false,
          isDirty: false,
        });

        // Atualizar cache se habilitado
        if (enableCache) {
          await templatesCacheService.preloadFunnel(funnelId);
        }

        console.log(`✅ Funnel carregado: ${funnelId}`);
      } else {
        throw new Error(result.error || 'Falha ao carregar funnel');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      updateState({
        isLoading: false,
        error: errorMessage,
      });
      
      console.error('❌ Erro ao carregar funnel:', errorMessage);
    }
  }, [enableCache, updateState, updateMetrics]);

  const saveFunnel = useCallback(async (): Promise<boolean> => {
    if (!state.activeFunnel) {
      console.warn('⚠️ Nenhum funnel para salvar');
      return false;
    }

    updateState({ isSaving: true });
    updateMetrics('saveFunnel');

    try {
      const result = await unifiedCRUDService.saveFunnel(state.activeFunnel);
      
      if (result.success) {
        updateState({
          isSaving: false,
          isDirty: false,
        });

        // Atualizar cache
        if (enableCache) {
          await templatesCacheService.invalidateFunnel(state.activeFunnel.id);
        }

        console.log('✅ Funnel salvo com sucesso');
        return true;
      } else {
        throw new Error(result.error || 'Falha ao salvar funnel');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar';
      updateState({
        isSaving: false,
        error: errorMessage,
      });
      
      console.error('❌ Erro ao salvar funnel:', errorMessage);
      return false;
    }
  }, [state.activeFunnel, enableCache, updateState, updateMetrics]);

  const createFunnel = useCallback(async (name: string, description?: string): Promise<string> => {
    updateState({ isLoading: true });
    updateMetrics('createFunnel');

    try {
      const newFunnel: UnifiedFunnel = {
        id: `funnel-${Date.now()}`,
        name,
        description: description || '',
        stages: [{
          id: `stage-1-${Date.now()}`,
          name: 'Etapa 1',
          description: 'Primeira etapa do funil',
          blocks: [],
          order: 0,
          isRequired: true,
          settings: {
            skipLogic: { enabled: false, conditions: [] },
            validation: { required: true, customRules: [] },
            timer: { enabled: false, duration: 0 },
          },
          metadata: {
            blocksCount: 0,
            isValid: true,
          },
        }],
        settings: {
          theme: 'default',
          branding: {},
          seo: {},
          integrations: {},
        },
        status: 'draft',
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          totalBlocks: 0,
          completedStages: 0,
          isValid: true,
        },
      };

      const result = await unifiedCRUDService.saveFunnel(newFunnel);
      
      if (result.success && result.data) {
        updateState({
          activeFunnel: result.data,
          activeStageId: result.data.stages[0]?.id || null,
          isLoading: false,
          isDirty: false,
        });

        console.log(`✅ Funnel criado: ${result.data.id}`);
        return result.data.id;
      } else {
        throw new Error(result.error || 'Falha ao criar funnel');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar funnel';
      updateState({
        isLoading: false,
        error: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
  }, [updateState, updateMetrics]);

  const deleteFunnel = useCallback(async (funnelId: string): Promise<boolean> => {
    updateMetrics('deleteFunnel');

    try {
      const result = await unifiedCRUDService.deleteFunnel(funnelId);
      
      if (result.success) {
        // Se era o funnel ativo, limpar estado
        if (state.activeFunnel?.id === funnelId) {
          updateState({
            activeFunnel: null,
            activeStageId: null,
            isDirty: false,
          });
        }

        // Limpar cache
        if (enableCache) {
          templatesCacheService.clearFunnel(funnelId);
        }

        console.log(`✅ Funnel excluído: ${funnelId}`);
        return true;
      } else {
        throw new Error(result.error || 'Falha ao excluir funnel');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir';
      updateState({ error: errorMessage });
      
      console.error('❌ Erro ao excluir funnel:', errorMessage);
      return false;
    }
  }, [state.activeFunnel?.id, enableCache, updateState, updateMetrics]);

  const duplicateFunnel = useCallback(async (funnelId: string, newName?: string): Promise<string> => {
    updateState({ isLoading: true });
    updateMetrics('duplicateFunnel');

    try {
      const result = await unifiedCRUDService.duplicateFunnel(funnelId, newName);
      
      if (result.success && result.data) {
        updateState({ isLoading: false });
        
        console.log(`✅ Funnel duplicado: ${funnelId} -> ${result.data.id}`);
        return result.data.id;
      } else {
        throw new Error(result.error || 'Falha ao duplicar funnel');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao duplicar';
      updateState({
        isLoading: false,
        error: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
  }, [updateState, updateMetrics]);

  // =============================================================================
  // OPERAÇÕES DE STAGE
  // =============================================================================

  const addStage = useCallback(async (name?: string, insertAfter?: string): Promise<string> => {
    if (!state.activeFunnel) throw new Error('Nenhum funnel carregado');

    updateMetrics('addStage');

    try {
      const stageName = name || `Etapa ${state.activeFunnel.stages.length + 1}`;
      
      const result = await unifiedCRUDService.addStage(state.activeFunnel.id, {
        name: stageName,
        description: `Nova etapa: ${stageName}`,
        blocks: [],
        order: state.activeFunnel.stages.length,
        isRequired: true,
      });

      if (result.success && result.data) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.activeFunnel.id);
        
        updateState({ 
          isDirty: true,
        });

        console.log(`✅ Stage adicionado: ${result.data.id}`);
        return result.data.id;
      } else {
        throw new Error(result.error || 'Falha ao adicionar stage');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar stage';
      updateState({ error: errorMessage });
      
      throw new Error(errorMessage);
    }
  }, [state.activeFunnel, loadFunnel, updateState, updateMetrics]);

  const updateStage = useCallback(async (stageId: string, updates: Partial<UnifiedStage>): Promise<void> => {
    if (!state.activeFunnel) throw new Error('Nenhum funnel carregado');

    updateMetrics('updateStage');

    try {
      const result = await unifiedCRUDService.updateStage(state.activeFunnel.id, stageId, updates);

      if (result.success) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.activeFunnel.id);
        
        updateState({ 
          isDirty: true,
        });

        console.log(`✅ Stage atualizado: ${stageId}`);
      } else {
        throw new Error(result.error || 'Falha ao atualizar stage');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar stage';
      updateState({ error: errorMessage });
      
      throw new Error(errorMessage);
    }
  }, [state.activeFunnel, loadFunnel, updateState, updateMetrics]);

  const deleteStage = useCallback(async (stageId: string): Promise<void> => {
    if (!state.activeFunnel) throw new Error('Nenhum funnel carregado');

    updateMetrics('deleteStage');

    try {
      const result = await unifiedCRUDService.deleteStage(state.activeFunnel.id, stageId);

      if (result.success) {
        // Se era o stage ativo, mudar para o primeiro
        let newActiveStageId = state.activeStageId;
        if (state.activeStageId === stageId) {
          const remainingStages = state.activeFunnel.stages.filter(s => s.id !== stageId);
          newActiveStageId = remainingStages[0]?.id || null;
        }

        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.activeFunnel.id);
        
        updateState({ 
          activeStageId: newActiveStageId,
          isDirty: true,
        });

        console.log(`✅ Stage excluído: ${stageId}`);
      } else {
        throw new Error(result.error || 'Falha ao excluir stage');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir stage';
      updateState({ error: errorMessage });
      
      throw new Error(errorMessage);
    }
  }, [state.activeFunnel, state.activeStageId, loadFunnel, updateState, updateMetrics]);

  const reorderStages = useCallback(async (startIndex: number, endIndex: number): Promise<void> => {
    if (!state.activeFunnel) throw new Error('Nenhum funnel carregado');

    updateMetrics('reorderStages');

    try {
      const result = await unifiedCRUDService.reorderStages(state.activeFunnel.id, startIndex, endIndex);

      if (result.success) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.activeFunnel.id);
        
        updateState({ 
          isDirty: true,
        });

        console.log(`✅ Stages reordenados: ${startIndex} -> ${endIndex}`);
      } else {
        throw new Error(result.error || 'Falha ao reordenar stages');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao reordenar stages';
      updateState({ error: errorMessage });
      
      throw new Error(errorMessage);
    }
  }, [state.activeFunnel, loadFunnel, updateState, updateMetrics]);

  const setActiveStage = useCallback((stageId: string) => {
    updateState({ activeStageId: stageId });
  }, [updateState]);

  const duplicateStage = useCallback(async (stageId: string, newName?: string): Promise<string> => {
    if (!state.activeFunnel) throw new Error('Nenhum funnel carregado');

    const stage = state.activeFunnel.stages.find(s => s.id === stageId);
    if (!stage) throw new Error('Stage não encontrado');

    updateMetrics('duplicateStage');

    try {
      // Criar nova stage com dados copiados
      const duplicatedStageName = newName || `${stage.name} (Cópia)`;
      
      const result = await unifiedCRUDService.addStage(state.activeFunnel.id, {
        name: duplicatedStageName,
        description: stage.description,
        blocks: stage.blocks, // Copiar blocos
        order: stage.order + 1,
        isRequired: stage.isRequired,
        settings: { ...stage.settings },
      });

      if (result.success && result.data) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.activeFunnel.id);
        
        updateState({ 
          isDirty: true,
        });

        console.log(`✅ Stage duplicado: ${stageId} -> ${result.data.id}`);
        return result.data.id;
      } else {
        throw new Error(result.error || 'Falha ao duplicar stage');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao duplicar stage';
      updateState({ error: errorMessage });
      
      throw new Error(errorMessage);
    }
  }, [state.activeFunnel, loadFunnel, updateState, updateMetrics]);

  // =============================================================================
  // OPERAÇÕES DE BLOCK
  // =============================================================================

  const addBlock = useCallback(async (type: string, stageId?: string): Promise<string> => {
    if (!state.activeFunnel) throw new Error('Nenhum funnel carregado');
    
    const targetStageId = stageId || state.activeStageId;
    if (!targetStageId) throw new Error('Nenhum stage ativo');

    updateMetrics('addBlock');

    try {
      const result = await unifiedCRUDService.addBlock(state.activeFunnel.id, targetStageId, {
        type: type as any,
        content: {},
        properties: {},
      });

      if (result.success && result.data) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.activeFunnel.id);
        
        updateState({ 
          isDirty: true,
        });

        console.log(`✅ Block adicionado: ${result.data.id} (${type})`);
        return result.data.id;
      } else {
        throw new Error(result.error || 'Falha ao adicionar block');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar block';
      updateState({ error: errorMessage });
      
      throw new Error(errorMessage);
    }
  }, [state.activeFunnel, state.activeStageId, loadFunnel, updateState, updateMetrics]);

  const updateBlock = useCallback(async (blockId: string, updates: Partial<Block>): Promise<void> => {
    if (!state.activeFunnel || !state.activeStageId) throw new Error('Nenhum funnel ou stage ativo');

    updateMetrics('updateBlock');

    try {
      const result = await unifiedCRUDService.updateBlock(state.activeFunnel.id, state.activeStageId, blockId, updates);

      if (result.success) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.activeFunnel.id);
        
        updateState({ 
          isDirty: true,
        });

        // Agendar auto-save
        scheduleAutoSave();

        console.log(`✅ Block atualizado: ${blockId}`);
      } else {
        throw new Error(result.error || 'Falha ao atualizar block');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar block';
      updateState({ error: errorMessage });
      
      throw new Error(errorMessage);
    }
  }, [state.activeFunnel, state.activeStageId, loadFunnel, scheduleAutoSave, updateState, updateMetrics]);

  const deleteBlock = useCallback(async (blockId: string): Promise<void> => {
    if (!state.activeFunnel || !state.activeStageId) throw new Error('Nenhum funnel ou stage ativo');

    updateMetrics('deleteBlock');

    try {
      const result = await unifiedCRUDService.deleteBlock(state.activeFunnel.id, state.activeStageId, blockId);

      if (result.success) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.activeFunnel.id);
        
        updateState({ 
          isDirty: true,
        });

        console.log(`✅ Block excluído: ${blockId}`);
      } else {
        throw new Error(result.error || 'Falha ao excluir block');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir block';
      updateState({ error: errorMessage });
      
      throw new Error(errorMessage);
    }
  }, [state.activeFunnel, state.activeStageId, loadFunnel, updateState, updateMetrics]);

  const duplicateBlock = useCallback(async (blockId: string): Promise<string> => {
    if (!state.activeFunnel || !state.activeStageId) throw new Error('Nenhum funnel ou stage ativo');

    updateMetrics('duplicateBlock');

    try {
      const result = await unifiedCRUDService.duplicateBlock(state.activeFunnel.id, state.activeStageId, blockId);

      if (result.success && result.data) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.activeFunnel.id);
        
        updateState({ 
          isDirty: true,
        });

        console.log(`✅ Block duplicado: ${blockId} -> ${result.data.id}`);
        return result.data.id;
      } else {
        throw new Error(result.error || 'Falha ao duplicar block');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao duplicar block';
      updateState({ error: errorMessage });
      
      throw new Error(errorMessage);
    }
  }, [state.activeFunnel, state.activeStageId, loadFunnel, updateState, updateMetrics]);

  const reorderBlocks = useCallback(async (startIndex: number, endIndex: number): Promise<void> => {
    if (!state.activeFunnel || !state.activeStageId) throw new Error('Nenhum funnel ou stage ativo');

    updateMetrics('reorderBlocks');

    try {
      const result = await unifiedCRUDService.reorderBlocks(state.activeFunnel.id, state.activeStageId, startIndex, endIndex);

      if (result.success) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.activeFunnel.id);
        
        updateState({ 
          isDirty: true,
        });

        console.log(`✅ Blocks reordenados: ${startIndex} -> ${endIndex}`);
      } else {
        throw new Error(result.error || 'Falha ao reordenar blocks');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao reordenar blocks';
      updateState({ error: errorMessage });
      
      throw new Error(errorMessage);
    }
  }, [state.activeFunnel, state.activeStageId, loadFunnel, updateState, updateMetrics]);

  // =============================================================================
  // OPERAÇÕES DE CACHE
  // =============================================================================

  const refreshCache = useCallback(async (): Promise<void> => {
    if (!enableCache) return;

    try {
      await templatesCacheService.refreshCache();
      console.log('✅ Cache atualizado');
    } catch (error) {
      console.warn('⚠️ Erro ao atualizar cache:', error);
    }
  }, [enableCache]);

  const clearCache = useCallback((): void => {
    if (!enableCache) return;

    templatesCacheService.clearCache();
    unifiedCRUDService.clearCache();
    console.log('🧹 Cache limpo');
  }, [enableCache]);

  const getCacheStats = useCallback(() => {
    if (!enableCache) {
      return { hitRate: 0, totalCached: 0, memoryUsage: 0 };
    }

    const templatesStats = templatesCacheService.getStats();
    const crudStats = unifiedCRUDService.getStats();
    
    return {
      hitRate: templatesCacheService.getHitRate(),
      totalCached: templatesStats.totalEntries + crudStats.totalFunnels,
      memoryUsage: templatesStats.memoryUsage,
    };
  }, [enableCache]);

  // =============================================================================
  // CONTROLE DE ESTADO
  // =============================================================================

  const markDirty = useCallback(() => {
    updateState({ 
      isDirty: true,
    });
    scheduleAutoSave();
  }, [updateState, scheduleAutoSave]);

  const markClean = useCallback(() => {
    updateState({ isDirty: false });
  }, [updateState]);

  const setError = useCallback((error: string | null) => {
    updateState({ error });
  }, [updateState]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // =============================================================================
  // ESTADO DERIVADO
  // =============================================================================

  const activeStage = useMemo(() => {
    if (!state.activeFunnel || !state.activeStageId) return null;
    return state.activeFunnel.stages.find(stage => stage.id === state.activeStageId) || null;
  }, [state.activeFunnel, state.activeStageId]);

  const activeBlocks = useMemo(() => {
    return activeStage?.blocks || [];
  }, [activeStage]);

  const systemStatus = useMemo(() => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    hasUnsavedChanges: state.isDirty,
    cacheSize: getCacheStats().totalCached,
    lastSync: state.activeFunnel?.updatedAt || null,
  }), [state.isDirty, state.activeFunnel?.updatedAt, getCacheStats]);

  // =============================================================================
  // EFEITOS
  // =============================================================================

  // Carregar funnel inicial
  useEffect(() => {
    if (initialFunnelId && !state.activeFunnel) {
      loadFunnel(initialFunnelId);
    }
  }, [initialFunnelId, state.activeFunnel, loadFunnel]);

  // Agendar auto-save quando necessário
  useEffect(() => {
    if (state.isDirty && enableAutoSave) {
      scheduleAutoSave();
    }
  }, [state.isDirty, enableAutoSave, scheduleAutoSave]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const contextValue: CRUDIntegrationContextType = {
    // Estado
    ...state,
    activeStage,
    activeBlocks,
    systemStatus,

    // Ações de Funnel
    loadFunnel,
    saveFunnel,
    createFunnel,
    deleteFunnel,
    duplicateFunnel,

    // Ações de Stage
    addStage,
    updateStage,
    deleteStage,
    reorderStages,
    setActiveStage,
    duplicateStage,

    // Ações de Block
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,

    // Ações de Cache
    refreshCache,
    clearCache,
    getCacheStats,

    // Controle de Estado
    markDirty,
    markClean,
    setError,
    clearError,
  };

  return (
    <CRUDIntegrationContext.Provider value={contextValue}>
      {children}
    </CRUDIntegrationContext.Provider>
  );
};

/**
 * 🎣 HOOK PARA USAR A INTEGRAÇÃO CRUD
 */
export const useCRUDIntegration = (): CRUDIntegrationContextType => {
  const context = useContext(CRUDIntegrationContext);
  
  if (!context) {
    throw new Error('useCRUDIntegration deve ser usado dentro de CRUDIntegrationProvider');
  }
  
  return context;
};

// Export do provider
export default CRUDIntegrationProvider;
