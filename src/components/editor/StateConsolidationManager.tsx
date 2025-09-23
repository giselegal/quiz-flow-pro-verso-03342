/**
 * 🎯 STATE CONSOLIDATION MANAGER - FASE 3
 * 
 * Gerenciador centralizado para consolidar e sincronizar estados entre providers
 * - Resolve conflitos entre EditorProvider e ConsolidatedEditorProvider
 * - Garantir migração suave e compatibilidade
 * - Estado unificado com fallbacks robustos
 */

import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { ConsolidatedEditorProvider, useConsolidatedEditor, ConsolidatedEditorState } from './ConsolidatedEditorProvider';
import { EditorProvider, useEditor, EditorState } from './EditorProvider';
import { logger } from '@/utils/debugLogger';

// 🎯 INTERFACE UNIFICADA DE ESTADO
export interface UnifiedEditorState {
  // Core editor properties
  stepBlocks: Record<string, any[]>;
  currentStep: number;
  selectedBlockId: string | null;
  stepValidation: Record<number, boolean>;
  isLoading: boolean;
  
  // Database integration
  isSupabaseEnabled: boolean;
  databaseMode: 'local' | 'supabase';
  
  // Advanced features
  mode: 'visual' | 'headless' | 'production' | 'funnel';
  loadedSteps: Set<number>;
  cacheTimestamps: Record<string, number>;
  
  // Provider metadata
  providerType: 'consolidated' | 'legacy' | 'hybrid';
  migrationStatus: 'complete' | 'in-progress' | 'pending';
}

// 🎯 INTERFACE UNIFICADA DE AÇÕES
export interface UnifiedEditorActions {
  // Core actions
  setCurrentStep: (step: number) => void;
  setSelectedBlockId: (blockId: string | null) => void;
  setStepValid: (step: number, isValid: boolean) => void;
  
  // Block operations
  addBlock: (stepKey: string, block: any) => Promise<void>;
  addBlockAtIndex: (stepKey: string, block: any, index: number) => Promise<void>;
  removeBlock: (stepKey: string, blockId: string) => Promise<void>;
  reorderBlocks: (stepKey: string, oldIndex: number, newIndex: number) => Promise<void>;
  updateBlock: (stepKey: string, blockId: string, updates: Record<string, any>) => Promise<void>;
  
  // Step management
  ensureStepLoaded: (step: number | string) => Promise<void>;
  preloadAdjacentSteps?: (currentStep: number) => Promise<void>;
  clearUnusedSteps?: () => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Template operations
  loadDefaultTemplate: () => void;
  createFromTemplate?: (templateName: string, customName?: string) => Promise<any>;
  
  // Import/Export
  exportJSON: () => string;
  importJSON: (json: string) => void;
  
  // Provider management
  migrateToConsolidated: () => Promise<void>;
  rollbackToLegacy: () => Promise<void>;
}

export interface UnifiedEditorContextValue {
  state: UnifiedEditorState;
  actions: UnifiedEditorActions;
  metadata: {
    providerType: 'consolidated' | 'legacy' | 'hybrid';
    availableProviders: string[];
    migrationReady: boolean;
  };
}

const UnifiedEditorContext = createContext<UnifiedEditorContextValue | undefined>(undefined);

// 🎯 HOOK UNIFICADO DE ACESSO
export const useUnifiedEditor = () => {
  const context = useContext(UnifiedEditorContext);
  if (!context) {
    throw new Error('useUnifiedEditor must be used within StateConsolidationManager');
  }
  return context;
};

// 🎯 ADAPTADOR DE ESTADO
const createStateAdapter = (
  consolidatedState?: ConsolidatedEditorState,
  legacyState?: EditorState
): UnifiedEditorState => {
  // Prioritizar consolidated se disponível
  if (consolidatedState) {
    return {
      stepBlocks: consolidatedState.stepBlocks || {},
      currentStep: consolidatedState.currentStep || 1,
      selectedBlockId: consolidatedState.selectedBlockId || null,
      stepValidation: consolidatedState.stepValidation || {},
      isLoading: consolidatedState.isLoading || false,
      isSupabaseEnabled: consolidatedState.isSupabaseEnabled || false,
      databaseMode: consolidatedState.databaseMode || 'local',
      mode: consolidatedState.mode || 'visual',
      loadedSteps: consolidatedState.loadedSteps instanceof Set 
        ? consolidatedState.loadedSteps 
        : new Set(Array.isArray(consolidatedState.loadedSteps) ? consolidatedState.loadedSteps : [1]),
      cacheTimestamps: consolidatedState.cacheTimestamps || {},
      providerType: 'consolidated',
      migrationStatus: 'complete'
    };
  }
  
  // Fallback para legacy
  if (legacyState) {
    return {
      stepBlocks: legacyState.stepBlocks || {},
      currentStep: legacyState.currentStep || 1,
      selectedBlockId: legacyState.selectedBlockId || null,
      stepValidation: legacyState.stepValidation || {},
      isLoading: legacyState.isLoading || false,
      isSupabaseEnabled: legacyState.isSupabaseEnabled || false,
      databaseMode: legacyState.databaseMode || 'local',
      mode: 'visual', // Default for legacy
      loadedSteps: new Set([legacyState.currentStep || 1]), // Create Set for legacy
      cacheTimestamps: {},
      providerType: 'legacy',
      migrationStatus: 'pending'
    };
  }
  
  // Fallback absoluto
  return {
    stepBlocks: {},
    currentStep: 1,
    selectedBlockId: null,
    stepValidation: {},
    isLoading: false,
    isSupabaseEnabled: false,
    databaseMode: 'local',
    mode: 'visual',
    loadedSteps: new Set([1]),
    cacheTimestamps: {},
    providerType: 'hybrid',
    migrationStatus: 'pending'
  };
};

// 🎯 ADAPTADOR DE AÇÕES
const createActionsAdapter = (
  consolidatedActions?: any,
  legacyActions?: any
): UnifiedEditorActions => {
  const actions = consolidatedActions || legacyActions;
  
  if (!actions) {
    // Fallback actions que não fazem nada
    const noopAsync = async () => {};
    const noop = () => {};
    
    return {
      setCurrentStep: noop,
      setSelectedBlockId: noop,
      setStepValid: noop,
      addBlock: noopAsync,
      addBlockAtIndex: noopAsync,
      removeBlock: noopAsync,
      reorderBlocks: noopAsync,
      updateBlock: noopAsync,
      ensureStepLoaded: noopAsync,
      undo: noop,
      redo: noop,
      canUndo: false,
      canRedo: false,
      loadDefaultTemplate: noop,
      exportJSON: () => '{}',
      importJSON: noop,
      migrateToConsolidated: noopAsync,
      rollbackToLegacy: noopAsync
    };
  }
  
  return {
    // Core actions
    setCurrentStep: actions.setCurrentStep || (() => {}),
    setSelectedBlockId: actions.setSelectedBlockId || (() => {}),
    setStepValid: actions.setStepValid || (() => {}),
    
    // Block operations
    addBlock: actions.addBlock || (async () => {}),
    addBlockAtIndex: actions.addBlockAtIndex || (async () => {}),
    removeBlock: actions.removeBlock || (async () => {}),
    reorderBlocks: actions.reorderBlocks || (async () => {}),
    updateBlock: actions.updateBlock || (async () => {}),
    
    // Step management
    ensureStepLoaded: actions.ensureStepLoaded || (async () => {}),
    preloadAdjacentSteps: actions.preloadAdjacentSteps,
    clearUnusedSteps: actions.clearUnusedSteps,
    
    // History
    undo: actions.undo || (() => {}),
    redo: actions.redo || (() => {}),
    canUndo: actions.canUndo || false,
    canRedo: actions.canRedo || false,
    
    // Templates
    loadDefaultTemplate: actions.loadDefaultTemplate || (() => {}),
    createFromTemplate: actions.createFromTemplate,
    
    // Import/Export
    exportJSON: actions.exportJSON || (() => '{}'),
    importJSON: actions.importJSON || (() => {}),
    
    // Migration actions
    migrateToConsolidated: async () => {
      logger.info('StateConsolidationManager: Migration to consolidated requested');
    },
    rollbackToLegacy: async () => {
      logger.info('StateConsolidationManager: Rollback to legacy requested');
    }
  };
};

// 🎯 REMOVIDO: Detector baseado em hooks que violava regras de hooks
// Substituído por detecção segura dentro do conteúdo usando hooks "safe"
// (mantemos a numeração de linhas estável evitando grandes alterações)


// 🎯 WRAPPER INTERNO PARA ACESSAR PROVIDERS
const StateConsolidationContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Detecção segura dos providers disponíveis (sem violar Rules of Hooks)
  const consolidatedContext = useConsolidatedEditorSafe();
  const legacyContext = useEditorSafe();

  const availableProviders = useMemo(() => {
    const providers: string[] = [];
    if (consolidatedContext) providers.push('consolidated');
    if (legacyContext) providers.push('legacy');
    return providers;
  }, [consolidatedContext, legacyContext]);

  // Criar estado unificado
  const unifiedState = useMemo(() => 
    createStateAdapter(consolidatedContext?.state, legacyContext?.state),
    [consolidatedContext?.state, legacyContext?.state]
  );
  
  // Criar ações unificadas
  const unifiedActions = useMemo(() => 
    createActionsAdapter(consolidatedContext?.actions, legacyContext?.actions),
    [consolidatedContext?.actions, legacyContext?.actions]
  );
  
  // Context value
  const contextValue = useMemo(() => ({
    state: unifiedState,
    actions: unifiedActions,
    metadata: {
      providerType: unifiedState.providerType,
      availableProviders,
      migrationReady: availableProviders.includes('consolidated')
    }
  }), [unifiedState, unifiedActions, availableProviders]);
  
  // Logging para debug
  useEffect(() => {
    logger.info('StateConsolidationManager: Context update', {
      providerType: unifiedState.providerType,
      availableProviders,
      currentStep: unifiedState.currentStep,
      loadedStepsSize: unifiedState.loadedSteps.size
    });
  }, [unifiedState.providerType, availableProviders, unifiedState.currentStep, unifiedState.loadedSteps]);
  
  return (
    <UnifiedEditorContext.Provider value={contextValue}>
      {children}
    </UnifiedEditorContext.Provider>
  );
};

// 🎯 COMPONENTE PRINCIPAL DO GERENCIADOR
export interface StateConsolidationManagerProps {
  children: React.ReactNode;
  preferConsolidated?: boolean;
  funnelId?: string;
  enableMigration?: boolean;
  debug?: boolean;
}

export const StateConsolidationManager: React.FC<StateConsolidationManagerProps> = ({
  children,
  preferConsolidated = true,
  funnelId,
  enableMigration = true,
  debug = false
}) => {
  if (debug) {
    logger.info('StateConsolidationManager: Initializing', {
      preferConsolidated,
      funnelId,
      enableMigration
    });
  }
  
  // Tentar usar consolidated primeiro se preferido
  if (preferConsolidated) {
    return (
      <ConsolidatedEditorProvider funnelId={funnelId} debug={debug}>
        <StateConsolidationContent>
          {children}
        </StateConsolidationContent>
      </ConsolidatedEditorProvider>
    );
  }
  
  // Fallback para legacy provider
  return (
    <EditorProvider funnelId={funnelId}>
      <StateConsolidationContent>
        {children}
      </StateConsolidationContent>
    </EditorProvider>
  );
};

// 🎯 HOOKS DE COMPATIBILIDADE
export const useConsolidatedEditorSafe = () => {
  try {
    return useConsolidatedEditor();
  } catch {
    return null;
  }
};

export const useEditorSafe = () => {
  try {
    return useEditor();
  } catch {
    return null;
  }
};

export default StateConsolidationManager;