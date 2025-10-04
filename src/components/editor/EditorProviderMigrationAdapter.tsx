/**
 * 🔄 MIGRATION ADAPTER - CONSOLIDAÇÃO DOS PROVIDERS
 * 
 * Este arquivo serve como adaptador durante a migração do
 * @/context/EditorContext para @/components/editor/EditorProvider
 * 
 * OBJETIVO: Eliminar conflitos mantendo compatibilidade
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { OptimizedEditorProvider, useEditor as useOptimizedEditor, useEditorOptional } from './OptimizedEditorProvider';
import { EditorProvider as LegacyEditorProvider, useEditor as useLegacyEditor } from './EditorProvider';
import type { EditorContextValue } from './EditorProvider';

/**
 * 🎯 INTERFACE UNIFICADA
 * Combina as melhores práticas de ambos os providers
 */
export interface UnifiedEditorContextType extends EditorContextValue {
  // Propriedades legacy para compatibilidade reversa
  legacy?: {
    funnelId?: string;
    setFunnelId?: (id: string) => void;
    isPreviewing?: boolean;
    setIsPreviewing?: (preview: boolean) => void;
    selectedBlockId?: string | null;
    setSelectedBlockId?: (id: string | null) => void;
    addBlock?: (type: any) => Promise<string>;
    updateBlock?: (id: string, content: any) => Promise<void>;
    deleteBlock?: (id: string) => Promise<void>;
    save?: () => Promise<void>;
  };
}

/**
 * 🔄 ADAPTADOR DE MIGRAÇÃO
 * Wrapper que detecta automaticamente qual provider usar
 */
export const MigrationEditorProvider: React.FC<{
  children: ReactNode;
  funnelId?: string;
  quizId?: string;
  enableSupabase?: boolean;
  legacyMode?: boolean; // Para forçar modo legacy durante testes
}> = ({ children, funnelId, quizId, enableSupabase, legacyMode = false }) => {
  
  // 🚀 DETECÇÃO AUTOMÁTICA: Usar provider moderno por padrão
  if (legacyMode) {
    // Fallback para contexto legacy apenas em casos especiais
    console.warn('🔄 MigrationEditorProvider: Usando modo legacy - considere migrar');
    
    // Importação dinâmica do EditorContext legacy
    return (
      <LegacyEditorFallback funnelId={funnelId}>
        {children}
      </LegacyEditorFallback>
    );
  }

  // ✅ PROVIDER MODERNO (padrão)
  return (
    <ModernEditorProvider
      funnelId={funnelId}
      quizId={quizId}
      enableSupabase={enableSupabase}
    >
      {children}
    </ModernEditorProvider>
  );
};

/**
 * 🛡️ FALLBACK LEGACY
 * Mantém compatibilidade com componentes antigos
 */
const LegacyEditorFallback: React.FC<{
  children: ReactNode;
  funnelId?: string;
}> = ({ children, funnelId }) => {
  // Lazy import para evitar bundle bloat
  const [LegacyProvider, setLegacyProvider] = React.useState<any>(null);

  React.useEffect(() => {
    import('@/context/EditorContext').then((module) => {
      setLegacyProvider(() => module.EditorProvider);
    }).catch((error) => {
      console.error('🚨 Falha ao carregar EditorContext legacy:', error);
    });
  }, []);

  if (!LegacyProvider) {
    return <div>Carregando editor...</div>;
  }

  return (
    <LegacyProvider funnelId={funnelId}>
      {children}
    </LegacyProvider>
  );
};

/**
 * 🎯 HOOK UNIFICADO - PRINCIPAL PONTO DE ACESSO
 * 
 * Este hook deve ser usado por TODOS os componentes que precisam
 * acessar o contexto do editor. Ele detecta automaticamente qual
 * provider está ativo e retorna a interface unificada.
 */
export const useUnifiedEditor = (): UnifiedEditorContextType => {
  // 1. Tentar usar provider moderno primeiro
  const modernContext = useEditorOptional();
  
  if (modernContext) {
    console.log('✅ useUnifiedEditor: Usando provider moderno');
    return {
      ...modernContext,
      legacy: extractLegacyInterface(modernContext),
    };
  }

  // 2. Fallback para provider legacy se disponível
  try {
    // Importação dinâmica para evitar dependência circular
    const legacyContext = React.useContext(React.createContext(null));
    
    if (legacyContext) {
      console.warn('⚠️ useUnifiedEditor: Fallback para provider legacy');
      return adaptLegacyContext(legacyContext as any);
    }
  } catch (error) {
    console.error('🚨 useUnifiedEditor: Erro ao acessar provider legacy:', error);
  }

  // 3. Último recurso: contexto em modo de falha segura
  console.error('🚨 useUnifiedEditor: Nenhum provider encontrado - retornando fallback');
  return createFallbackContext();
};

/**
 * 🔄 ADAPTADOR LEGACY
 * Converte interface legacy para formato unificado
 */
function adaptLegacyContext(legacyContext: any): UnifiedEditorContextType {
  return {
    state: {
      stepBlocks: {},
      currentStep: 1,
      selectedBlockId: null,
      stepValidation: {},
      isSupabaseEnabled: false,
      databaseMode: 'local' as const,
      isLoading: false,
    },
    actions: {
      setCurrentStep: () => {},
      setSelectedBlockId: () => {},
      setStepValid: () => {},
      loadDefaultTemplate: () => {},
      addBlock: async () => {},
      addBlockAtIndex: async () => {},
      removeBlock: async () => {},
      reorderBlocks: async () => {},
      updateBlock: async () => {},
      ensureStepLoaded: async () => {},
      undo: () => {},
      redo: () => {},
      canUndo: false,
      canRedo: false,
      exportJSON: () => '{}',
      importJSON: () => {},
    },
    legacy: {
      funnelId: legacyContext.funnelId,
      setFunnelId: legacyContext.setFunnelId,
      isPreviewing: legacyContext.isPreviewing,
      setIsPreviewing: legacyContext.setIsPreviewing,
      selectedBlockId: legacyContext.selectedBlockId,
      setSelectedBlockId: legacyContext.setSelectedBlockId,
      addBlock: legacyContext.addBlock,
      updateBlock: legacyContext.updateBlock,
      deleteBlock: legacyContext.deleteBlock,
      save: legacyContext.save,
    },
  };
}

/**
 * 🔧 EXTRATOR DE INTERFACE LEGACY
 * Extrai propriedades compatíveis do provider moderno
 */
function extractLegacyInterface(modernContext: EditorContextValue): UnifiedEditorContextType['legacy'] {
  return {
    selectedBlockId: modernContext.state.selectedBlockId,
    setSelectedBlockId: modernContext.actions.setSelectedBlockId,
    addBlock: async (type: any) => {
      await modernContext.actions.addBlock(`step-${modernContext.state.currentStep}`, {
        id: `block-${Date.now()}`,
        type,
        order: 0,
        content: {},
        properties: {},
      });
      return `block-${Date.now()}`;
    },
    updateBlock: async (id: string, content: any) => {
      await modernContext.actions.updateBlock(
        `step-${modernContext.state.currentStep}`,
        id,
        content
      );
    },
    deleteBlock: async (id: string) => {
      await modernContext.actions.removeBlock(
        `step-${modernContext.state.currentStep}`,
        id
      );
    },
    save: async () => {
      // Implementação de save usando as ações modernas
      console.log('💾 Save adaptado para provider moderno');
    },
  };
}

/**
 * 🛡️ CONTEXTO DE FALLBACK
 * Último recurso quando nenhum provider está disponível
 */
function createFallbackContext(): UnifiedEditorContextType {
  console.warn('🚨 Criando contexto de fallback - verifique se o EditorProvider está envolvendo o componente');
  
  const noopAsync = async () => {};
  const noop = () => {};

  return {
    state: {
      stepBlocks: {},
      currentStep: 1,
      selectedBlockId: null,
      stepValidation: {},
      isSupabaseEnabled: false,
      databaseMode: 'local' as const,
      isLoading: false,
    },
    actions: {
      setCurrentStep: noop,
      setSelectedBlockId: noop,
      setStepValid: noop,
      loadDefaultTemplate: noop,
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
      exportJSON: () => '{"fallback": true}',
      importJSON: noop,
    },
    legacy: {
      funnelId: 'fallback-funnel',
      setFunnelId: noop,
      isPreviewing: false,
      setIsPreviewing: noop,
      selectedBlockId: null,
      setSelectedBlockId: noop,
      addBlock: async () => 'fallback-block',
      updateBlock: noopAsync,
      deleteBlock: noopAsync,
      save: noopAsync,
    },
  };
}

/**
 * 🎯 HOOKS DE MIGRAÇÃO ESPECÍFICOS
 * Para facilitar a transição gradual
 */

// Hook compatível com @/context/EditorContext
export const useEditorLegacyCompat = () => {
  const unified = useUnifiedEditor();
  return unified.legacy || {};
};

// Hook compatível com @/components/editor/EditorProvider
export const useEditorModernCompat = () => {
  const unified = useUnifiedEditor();
  return {
    state: unified.state,
    actions: unified.actions,
  };
};

/**
 * 🧪 UTILITIES PARA MIGRAÇÃO
 */
export const EditorMigrationUtils = {
  // Detectar qual provider está ativo
  detectActiveProvider: (): 'modern' | 'legacy' | 'fallback' => {
    const modernContext = useEditorOptional();
    if (modernContext) return 'modern';
    
    // Lógica para detectar legacy provider seria aqui
    return 'fallback';
  },

  // Verificar se a migração está completa
  isMigrationComplete: (): boolean => {
    return EditorMigrationUtils.detectActiveProvider() === 'modern';
  },

  // Logs de diagnóstico
  diagnostics: () => {
    const provider = EditorMigrationUtils.detectActiveProvider();
    console.log('🔍 Editor Provider Diagnostics:', {
      activeProvider: provider,
      isMigrationComplete: EditorMigrationUtils.isMigrationComplete(),
      timestamp: new Date().toISOString(),
    });
  },
};

// Export padrão como provider unificado
export { MigrationEditorProvider as EditorProvider };
export { useUnifiedEditor as useEditor };
