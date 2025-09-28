/**
 * 🎯 USE UNIFIED EDITOR PRODUCTION - HOOK PRINCIPAL DE PRODUÇÃO
 * 
 * Hook que integra todas as funcionalidades do sistema unificado:
 * - UnifiedCRUDService (operações CRUD)
 * - RealStagesProvider (pipeline de etapas)
 * - TemplatesCacheService (cache inteligente)
 * - Supabase (persistência)
 * 
 * FUNCIONALIDADES:
 * ✅ Operações CRUD completas
 * ✅ Pipeline de 21 etapas
 * ✅ Cache inteligente
 * ✅ Auto-save e versionamento
 * ✅ Error handling robusto
 * ✅ Performance monitoring
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Block } from '@/types/editor';
import { 
  unifiedCRUDService, 
  UnifiedFunnel, 
  UnifiedStage, 
  CRUDResult 
} from '@/services/UnifiedCRUDService';
import { templatesCacheService } from '@/services/TemplatesCacheService';

// Tipos principais
export interface ProductionEditorState {
  // Estado do funnel
  funnel: UnifiedFunnel | null;
  activeStageId: string | null;
  selectedBlockId: string | null;
  
  // Estados de operação
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  isPreviewing: boolean;
  
  // Versionamento
  lastSaved: Date | null;
  lastModified: Date | null;
  version: string;
  
  // Performance
  operationInProgress: boolean;
  error: string | null;
}

export interface ProductionEditorActions {
  // === FUNNEL OPERATIONS ===
  loadFunnel: (id: string) => Promise<void>;
  saveFunnel: () => Promise<boolean>;
  createFunnel: (name: string, description?: string) => Promise<string>;
  deleteFunnel: (id: string) => Promise<boolean>;
  duplicateFunnel: (id: string, newName?: string) => Promise<string>;
  
  // === STAGE OPERATIONS ===
  addStage: (name?: string) => Promise<string>;
  updateStage: (stageId: string, updates: Partial<UnifiedStage>) => Promise<void>;
  deleteStage: (stageId: string) => Promise<void>;
  reorderStages: (startIndex: number, endIndex: number) => Promise<void>;
  setActiveStage: (stageId: string) => void;
  duplicateStage: (stageId: string, newName?: string) => Promise<string>;
  
  // === BLOCK OPERATIONS ===
  addBlock: (type: string, stageId?: string) => Promise<string>;
  updateBlock: (blockId: string, updates: Partial<Block>) => Promise<void>;
  deleteBlock: (blockId: string) => Promise<void>;
  duplicateBlock: (blockId: string) => Promise<string>;
  reorderBlocks: (startIndex: number, endIndex: number) => Promise<void>;
  setSelectedBlock: (blockId: string | null) => void;
  
  // === PROPERTY OPERATIONS ===
  updateBlockProperty: (blockId: string, key: string, value: any) => Promise<void>;
  updateBlockProperties: (blockId: string, properties: Record<string, any>) => Promise<void>;
  
  // === STATE CONTROL ===
  setIsPreviewing: (value: boolean) => void;
  markDirty: () => void;
  markClean: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // === CACHE CONTROL ===
  refreshCache: () => Promise<void>;
  clearCache: () => void;
  getCacheStats: () => any;
}

export interface ProductionEditorReturn extends ProductionEditorState, ProductionEditorActions {
  // Estado derivado
  activeStage: UnifiedStage | null;
  activeBlocks: Block[];
  selectedBlock: Block | null;
  
  // Métricas
  performanceMetrics: {
    renderCount: number;
    operationsCount: number;
    averageOperationTime: number;
    memoryUsage: number;
    lastOperationTime: number;
  };
  
  // Status do sistema
  systemStatus: {
    isOnline: boolean;
    hasUnsavedChanges: boolean;
    cacheSize: number;
    lastSync: Date | null;
  };
}

/**
 * 🎯 HOOK PRINCIPAL DE PRODUÇÃO
 */
export const useUnifiedEditorProduction = (
  initialFunnelId?: string,
  options: {
    autoSave?: boolean;
    autoSaveInterval?: number;
    enableCache?: boolean;
    enablePerformanceTracking?: boolean;
  } = {}
): ProductionEditorReturn => {
  
  const {
    autoSave = true,
    autoSaveInterval = 5000,
    enableCache = true,
    enablePerformanceTracking = true,
  } = options;

  // =============================================================================
  // ESTADO PRINCIPAL
  // =============================================================================

  const [state, setState] = useState<ProductionEditorState>({
    funnel: null,
    activeStageId: null,
    selectedBlockId: null,
    isLoading: false,
    isSaving: false,
    isDirty: false,
    isPreviewing: false,
    lastSaved: null,
    lastModified: null,
    version: '1.0.0',
    operationInProgress: false,
    error: null,
  });

  // Performance tracking
  const [performanceMetrics, setPerformanceMetrics] = useState({
    renderCount: 0,
    operationsCount: 0,
    averageOperationTime: 0,
    memoryUsage: 0,
    lastOperationTime: 0,
  });

  // Auto-save timeout
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout>();

  /**
   * 🔄 ATUALIZAR ESTADO
   */
  const updateState = useCallback((updates: Partial<ProductionEditorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * 📊 ATUALIZAR MÉTRICAS
   */
  const updateMetrics = useCallback((operation: string, duration?: number) => {
    setPerformanceMetrics(prev => ({
      ...prev,
      renderCount: prev.renderCount + 1,
      operationsCount: prev.operationsCount + 1,
      lastOperationTime: duration || 0,
      averageOperationTime: prev.operationsCount > 0 
        ? (prev.averageOperationTime + (duration || 0)) / 2 
        : duration || 0,
      memoryUsage: typeof window !== 'undefined' && (performance as any).memory 
        ? (performance as any).memory.usedJSHeapSize / 1024 / 1024 
        : 0,
    }));
  }, []);

  /**
   * 🎯 AGENDAR AUTO-SAVE
   */
  const scheduleAutoSave = useCallback(() => {
    if (!autoSave || !state.isDirty || !state.funnel) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      if (state.isDirty && state.funnel && !state.isSaving) {
        console.log('🔄 Auto-save triggered');
        await saveFunnel();
      }
    }, autoSaveInterval);
  }, [autoSave, state.isDirty, state.funnel, state.isSaving, autoSaveInterval]);

  // =============================================================================
  // OPERAÇÕES DE FUNNEL
  // =============================================================================

  const loadFunnel = useCallback(async (id: string): Promise<void> => {
    const startTime = Date.now();
    updateState({ isLoading: true, error: null, operationInProgress: true });

    try {
      const result = await unifiedCRUDService.getFunnel(id);
      
      if (result.success && result.data) {
        updateState({
          funnel: result.data,
          activeStageId: result.data.stages[0]?.id || null,
          selectedBlockId: null,
          isLoading: false,
          isDirty: false,
          lastSaved: new Date(),
          version: result.data.version,
          operationInProgress: false,
        });

        // Preload cache se habilitado
        if (enableCache) {
          await templatesCacheService.preloadFunnel(id);
        }

        console.log(`✅ Funnel carregado: ${id}`);
      } else {
        throw new Error(result.error || 'Falha ao carregar funnel');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      updateState({
        isLoading: false,
        error: errorMessage,
        operationInProgress: false,
      });
      
      console.error('❌ Erro ao carregar funnel:', errorMessage);
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('loadFunnel', Date.now() - startTime);
      }
    }
  }, [enableCache, enablePerformanceTracking, updateState, updateMetrics]);

  const saveFunnel = useCallback(async (): Promise<boolean> => {
    if (!state.funnel) {
      console.warn('⚠️ Nenhum funnel para salvar');
      return false;
    }

    const startTime = Date.now();
    updateState({ isSaving: true, operationInProgress: true });

    try {
      const result = await unifiedCRUDService.saveFunnel(state.funnel);
      
      if (result.success) {
        updateState({
          isSaving: false,
          isDirty: false,
          lastSaved: new Date(),
          operationInProgress: false,
        });

        // Atualizar cache
        if (enableCache) {
          await templatesCacheService.invalidateFunnel(state.funnel.id);
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
        operationInProgress: false,
      });
      
      console.error('❌ Erro ao salvar funnel:', errorMessage);
      return false;
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('saveFunnel', Date.now() - startTime);
      }
    }
  }, [state.funnel, enableCache, enablePerformanceTracking, updateState, updateMetrics]);

  const createFunnel = useCallback(async (name: string, description?: string): Promise<string> => {
    const startTime = Date.now();
    updateState({ isLoading: true, operationInProgress: true });

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
          funnel: result.data,
          activeStageId: result.data.stages[0]?.id || null,
          selectedBlockId: null,
          isLoading: false,
          isDirty: false,
          lastSaved: new Date(),
          operationInProgress: false,
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
        operationInProgress: false,
      });
      
      throw new Error(errorMessage);
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('createFunnel', Date.now() - startTime);
      }
    }
  }, [enablePerformanceTracking, updateState, updateMetrics]);

  const deleteFunnel = useCallback(async (id: string): Promise<boolean> => {
    const startTime = Date.now();
    updateState({ operationInProgress: true });

    try {
      const result = await unifiedCRUDService.deleteFunnel(id);
      
      if (result.success) {
        // Se era o funnel ativo, limpar estado
        if (state.funnel?.id === id) {
          updateState({
            funnel: null,
            activeStageId: null,
            selectedBlockId: null,
            isDirty: false,
            operationInProgress: false,
          });
        } else {
          updateState({ operationInProgress: false });
        }

        // Limpar cache
        if (enableCache) {
          templatesCacheService.clearFunnel(id);
        }

        console.log(`✅ Funnel excluído: ${id}`);
        return true;
      } else {
        throw new Error(result.error || 'Falha ao excluir funnel');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir';
      updateState({
        error: errorMessage,
        operationInProgress: false,
      });
      
      console.error('❌ Erro ao excluir funnel:', errorMessage);
      return false;
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('deleteFunnel', Date.now() - startTime);
      }
    }
  }, [state.funnel?.id, enableCache, enablePerformanceTracking, updateState, updateMetrics]);

  const duplicateFunnel = useCallback(async (id: string, newName?: string): Promise<string> => {
    const startTime = Date.now();
    updateState({ isLoading: true, operationInProgress: true });

    try {
      const result = await unifiedCRUDService.duplicateFunnel(id, newName);
      
      if (result.success && result.data) {
        updateState({ isLoading: false, operationInProgress: false });
        
        console.log(`✅ Funnel duplicado: ${id} -> ${result.data.id}`);
        return result.data.id;
      } else {
        throw new Error(result.error || 'Falha ao duplicar funnel');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao duplicar';
      updateState({
        isLoading: false,
        error: errorMessage,
        operationInProgress: false,
      });
      
      throw new Error(errorMessage);
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('duplicateFunnel', Date.now() - startTime);
      }
    }
  }, [enablePerformanceTracking, updateState, updateMetrics]);

  // =============================================================================
  // OPERAÇÕES DE STAGE
  // =============================================================================

  const addStage = useCallback(async (name?: string): Promise<string> => {
    if (!state.funnel) throw new Error('Nenhum funnel carregado');

    const startTime = Date.now();
    updateState({ operationInProgress: true });

    try {
      const stageName = name || `Etapa ${state.funnel.stages.length + 1}`;
      
      const result = await unifiedCRUDService.addStage(state.funnel.id, {
        name: stageName,
        description: `Nova etapa: ${stageName}`,
        blocks: [],
        order: state.funnel.stages.length,
        isRequired: true,
      });

      if (result.success && result.data) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.funnel.id);
        
        updateState({ 
          isDirty: true,
          lastModified: new Date(),
          operationInProgress: false,
        });

        console.log(`✅ Stage adicionado: ${result.data.id}`);
        return result.data.id;
      } else {
        throw new Error(result.error || 'Falha ao adicionar stage');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar stage';
      updateState({
        error: errorMessage,
        operationInProgress: false,
      });
      
      throw new Error(errorMessage);
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('addStage', Date.now() - startTime);
      }
    }
  }, [state.funnel, loadFunnel, enablePerformanceTracking, updateState, updateMetrics]);

  const updateStage = useCallback(async (stageId: string, updates: Partial<UnifiedStage>): Promise<void> => {
    if (!state.funnel) throw new Error('Nenhum funnel carregado');

    const startTime = Date.now();
    updateState({ operationInProgress: true });

    try {
      const result = await unifiedCRUDService.updateStage(state.funnel.id, stageId, updates);

      if (result.success) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.funnel.id);
        
        updateState({ 
          isDirty: true,
          lastModified: new Date(),
          operationInProgress: false,
        });

        console.log(`✅ Stage atualizado: ${stageId}`);
      } else {
        throw new Error(result.error || 'Falha ao atualizar stage');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar stage';
      updateState({
        error: errorMessage,
        operationInProgress: false,
      });
      
      throw new Error(errorMessage);
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('updateStage', Date.now() - startTime);
      }
    }
  }, [state.funnel, loadFunnel, enablePerformanceTracking, updateState, updateMetrics]);

  const deleteStage = useCallback(async (stageId: string): Promise<void> => {
    if (!state.funnel) throw new Error('Nenhum funnel carregado');

    const startTime = Date.now();
    updateState({ operationInProgress: true });

    try {
      const result = await unifiedCRUDService.deleteStage(state.funnel.id, stageId);

      if (result.success) {
        // Se era o stage ativo, mudar para o primeiro
        let newActiveStageId = state.activeStageId;
        if (state.activeStageId === stageId) {
          const remainingStages = state.funnel.stages.filter(s => s.id !== stageId);
          newActiveStageId = remainingStages[0]?.id || null;
        }

        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.funnel.id);
        
        updateState({ 
          activeStageId: newActiveStageId,
          selectedBlockId: null,
          isDirty: true,
          lastModified: new Date(),
          operationInProgress: false,
        });

        console.log(`✅ Stage excluído: ${stageId}`);
      } else {
        throw new Error(result.error || 'Falha ao excluir stage');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir stage';
      updateState({
        error: errorMessage,
        operationInProgress: false,
      });
      
      throw new Error(errorMessage);
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('deleteStage', Date.now() - startTime);
      }
    }
  }, [state.funnel, state.activeStageId, loadFunnel, enablePerformanceTracking, updateState, updateMetrics]);

  const reorderStages = useCallback(async (startIndex: number, endIndex: number): Promise<void> => {
    if (!state.funnel) throw new Error('Nenhum funnel carregado');

    const startTime = Date.now();
    updateState({ operationInProgress: true });

    try {
      const result = await unifiedCRUDService.reorderStages(state.funnel.id, startIndex, endIndex);

      if (result.success) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.funnel.id);
        
        updateState({ 
          isDirty: true,
          lastModified: new Date(),
          operationInProgress: false,
        });

        console.log(`✅ Stages reordenados: ${startIndex} -> ${endIndex}`);
      } else {
        throw new Error(result.error || 'Falha ao reordenar stages');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao reordenar stages';
      updateState({
        error: errorMessage,
        operationInProgress: false,
      });
      
      throw new Error(errorMessage);
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('reorderStages', Date.now() - startTime);
      }
    }
  }, [state.funnel, loadFunnel, enablePerformanceTracking, updateState, updateMetrics]);

  const setActiveStage = useCallback((stageId: string) => {
    updateState({
      activeStageId: stageId,
      selectedBlockId: null, // Limpar seleção de block ao mudar stage
    });
  }, [updateState]);

  const duplicateStage = useCallback(async (stageId: string, newName?: string): Promise<string> => {
    if (!state.funnel) throw new Error('Nenhum funnel carregado');

    const stage = state.funnel.stages.find(s => s.id === stageId);
    if (!stage) throw new Error('Stage não encontrado');

    const startTime = Date.now();
    updateState({ operationInProgress: true });

    try {
      // Criar nova stage com dados copiados
      const duplicatedStageName = newName || `${stage.name} (Cópia)`;
      
      const result = await unifiedCRUDService.addStage(state.funnel.id, {
        name: duplicatedStageName,
        description: stage.description,
        blocks: stage.blocks, // Copiar blocos
        order: stage.order + 1,
        isRequired: stage.isRequired,
        settings: { ...stage.settings },
      });

      if (result.success && result.data) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.funnel.id);
        
        updateState({ 
          isDirty: true,
          lastModified: new Date(),
          operationInProgress: false,
        });

        console.log(`✅ Stage duplicado: ${stageId} -> ${result.data.id}`);
        return result.data.id;
      } else {
        throw new Error(result.error || 'Falha ao duplicar stage');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao duplicar stage';
      updateState({
        error: errorMessage,
        operationInProgress: false,
      });
      
      throw new Error(errorMessage);
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('duplicateStage', Date.now() - startTime);
      }
    }
  }, [state.funnel, loadFunnel, enablePerformanceTracking, updateState, updateMetrics]);

  // =============================================================================
  // OPERAÇÕES DE BLOCK
  // =============================================================================

  const addBlock = useCallback(async (type: string, stageId?: string): Promise<string> => {
    if (!state.funnel) throw new Error('Nenhum funnel carregado');
    
    const targetStageId = stageId || state.activeStageId;
    if (!targetStageId) throw new Error('Nenhum stage ativo');

    const startTime = Date.now();
    updateState({ operationInProgress: true });

    try {
      const result = await unifiedCRUDService.addBlock(state.funnel.id, targetStageId, {
        type: type as any,
        content: {},
        properties: {},
      });

      if (result.success && result.data) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.funnel.id);
        
        updateState({ 
          selectedBlockId: result.data.id,
          isDirty: true,
          lastModified: new Date(),
          operationInProgress: false,
        });

        console.log(`✅ Block adicionado: ${result.data.id} (${type})`);
        return result.data.id;
      } else {
        throw new Error(result.error || 'Falha ao adicionar block');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar block';
      updateState({
        error: errorMessage,
        operationInProgress: false,
      });
      
      throw new Error(errorMessage);
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('addBlock', Date.now() - startTime);
      }
    }
  }, [state.funnel, state.activeStageId, loadFunnel, enablePerformanceTracking, updateState, updateMetrics]);

  const updateBlock = useCallback(async (blockId: string, updates: Partial<Block>): Promise<void> => {
    if (!state.funnel || !state.activeStageId) throw new Error('Nenhum funnel ou stage ativo');

    const startTime = Date.now();
    updateState({ operationInProgress: true });

    try {
      const result = await unifiedCRUDService.updateBlock(state.funnel.id, state.activeStageId, blockId, updates);

      if (result.success) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.funnel.id);
        
        updateState({ 
          isDirty: true,
          lastModified: new Date(),
          operationInProgress: false,
        });

        // Agendar auto-save
        scheduleAutoSave();

        console.log(`✅ Block atualizado: ${blockId}`);
      } else {
        throw new Error(result.error || 'Falha ao atualizar block');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar block';
      updateState({
        error: errorMessage,
        operationInProgress: false,
      });
      
      throw new Error(errorMessage);
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('updateBlock', Date.now() - startTime);
      }
    }
  }, [state.funnel, state.activeStageId, loadFunnel, scheduleAutoSave, enablePerformanceTracking, updateState, updateMetrics]);

  const deleteBlock = useCallback(async (blockId: string): Promise<void> => {
    if (!state.funnel || !state.activeStageId) throw new Error('Nenhum funnel ou stage ativo');

    const startTime = Date.now();
    updateState({ operationInProgress: true });

    try {
      const result = await unifiedCRUDService.deleteBlock(state.funnel.id, state.activeStageId, blockId);

      if (result.success) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.funnel.id);
        
        updateState({ 
          selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
          isDirty: true,
          lastModified: new Date(),
          operationInProgress: false,
        });

        console.log(`✅ Block excluído: ${blockId}`);
      } else {
        throw new Error(result.error || 'Falha ao excluir block');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir block';
      updateState({
        error: errorMessage,
        operationInProgress: false,
      });
      
      throw new Error(errorMessage);
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('deleteBlock', Date.now() - startTime);
      }
    }
  }, [state.funnel, state.activeStageId, state.selectedBlockId, loadFunnel, enablePerformanceTracking, updateState, updateMetrics]);

  const duplicateBlock = useCallback(async (blockId: string): Promise<string> => {
    if (!state.funnel || !state.activeStageId) throw new Error('Nenhum funnel ou stage ativo');

    const startTime = Date.now();
    updateState({ operationInProgress: true });

    try {
      const result = await unifiedCRUDService.duplicateBlock(state.funnel.id, state.activeStageId, blockId);

      if (result.success && result.data) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.funnel.id);
        
        updateState({ 
          selectedBlockId: result.data.id,
          isDirty: true,
          lastModified: new Date(),
          operationInProgress: false,
        });

        console.log(`✅ Block duplicado: ${blockId} -> ${result.data.id}`);
        return result.data.id;
      } else {
        throw new Error(result.error || 'Falha ao duplicar block');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao duplicar block';
      updateState({
        error: errorMessage,
        operationInProgress: false,
      });
      
      throw new Error(errorMessage);
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('duplicateBlock', Date.now() - startTime);
      }
    }
  }, [state.funnel, state.activeStageId, loadFunnel, enablePerformanceTracking, updateState, updateMetrics]);

  const reorderBlocks = useCallback(async (startIndex: number, endIndex: number): Promise<void> => {
    if (!state.funnel || !state.activeStageId) throw new Error('Nenhum funnel ou stage ativo');

    const startTime = Date.now();
    updateState({ operationInProgress: true });

    try {
      const result = await unifiedCRUDService.reorderBlocks(state.funnel.id, state.activeStageId, startIndex, endIndex);

      if (result.success) {
        // Recarregar funnel para refletir mudanças
        await loadFunnel(state.funnel.id);
        
        updateState({ 
          isDirty: true,
          lastModified: new Date(),
          operationInProgress: false,
        });

        console.log(`✅ Blocks reordenados: ${startIndex} -> ${endIndex}`);
      } else {
        throw new Error(result.error || 'Falha ao reordenar blocks');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao reordenar blocks';
      updateState({
        error: errorMessage,
        operationInProgress: false,
      });
      
      throw new Error(errorMessage);
    } finally {
      if (enablePerformanceTracking) {
        updateMetrics('reorderBlocks', Date.now() - startTime);
      }
    }
  }, [state.funnel, state.activeStageId, loadFunnel, enablePerformanceTracking, updateState, updateMetrics]);

  const setSelectedBlock = useCallback((blockId: string | null) => {
    updateState({ selectedBlockId: blockId });
  }, [updateState]);

  // =============================================================================
  // OPERAÇÕES DE PROPRIEDADES
  // =============================================================================

  const updateBlockProperty = useCallback(async (blockId: string, key: string, value: any): Promise<void> => {
    if (!state.funnel || !state.activeStageId) throw new Error('Nenhum funnel ou stage ativo');

    const stage = state.funnel.stages.find(s => s.id === state.activeStageId);
    const block = stage?.blocks.find(b => b.id === blockId);
    
    if (!block) throw new Error('Block não encontrado');

    const updates: Partial<Block> = {
      properties: {
        ...block.properties,
        [key]: value,
      },
    };

    await updateBlock(blockId, updates);
  }, [state.funnel, state.activeStageId, updateBlock]);

  const updateBlockProperties = useCallback(async (blockId: string, properties: Record<string, any>): Promise<void> => {
    if (!state.funnel || !state.activeStageId) throw new Error('Nenhum funnel ou stage ativo');

    const stage = state.funnel.stages.find(s => s.id === state.activeStageId);
    const block = stage?.blocks.find(b => b.id === blockId);
    
    if (!block) throw new Error('Block não encontrado');

    const updates: Partial<Block> = {
      properties: {
        ...block.properties,
        ...properties,
      },
    };

    await updateBlock(blockId, updates);
  }, [state.funnel, state.activeStageId, updateBlock]);

  // =============================================================================
  // CONTROLE DE ESTADO
  // =============================================================================

  const setIsPreviewing = useCallback((value: boolean) => {
    updateState({ isPreviewing: value });
  }, [updateState]);

  const markDirty = useCallback(() => {
    updateState({ 
      isDirty: true,
      lastModified: new Date(),
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
  // ESTADO DERIVADO
  // =============================================================================

  const activeStage = useMemo(() => {
    if (!state.funnel || !state.activeStageId) return null;
    return state.funnel.stages.find(stage => stage.id === state.activeStageId) || null;
  }, [state.funnel, state.activeStageId]);

  const activeBlocks = useMemo(() => {
    return activeStage?.blocks || [];
  }, [activeStage]);

  const selectedBlock = useMemo(() => {
    if (!state.selectedBlockId || !activeBlocks) return null;
    return activeBlocks.find(block => block.id === state.selectedBlockId) || null;
  }, [state.selectedBlockId, activeBlocks]);

  const systemStatus = useMemo(() => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    hasUnsavedChanges: state.isDirty,
    cacheSize: getCacheStats().totalCached,
    lastSync: state.funnel?.updatedAt || null,
  }), [state.isDirty, state.funnel?.updatedAt, getCacheStats]);

  // =============================================================================
  // EFEITOS
  // =============================================================================

  // Carregar funnel inicial
  useEffect(() => {
    if (initialFunnelId && !state.funnel) {
      loadFunnel(initialFunnelId);
    }
  }, [initialFunnelId, state.funnel, loadFunnel]);

  // Agendar auto-save quando necessário
  useEffect(() => {
    if (state.isDirty && autoSave) {
      scheduleAutoSave();
    }
  }, [state.isDirty, autoSave, scheduleAutoSave]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    // Estado
    ...state,
    activeStage,
    activeBlocks,
    selectedBlock,
    performanceMetrics,
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
    setSelectedBlock,

    // Ações de Propriedades
    updateBlockProperty,
    updateBlockProperties,

    // Controle de Estado
    setIsPreviewing,
    markDirty,
    markClean,
    setError,
    clearError,

    // Ações de Cache
    refreshCache,
    clearCache,
    getCacheStats,
  };
};