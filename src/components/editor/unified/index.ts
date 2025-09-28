/**
 * 🎯 UNIFIED EDITOR COMPONENTS - EXPORTS CONSOLIDADOS
 * 
 * Ponto único de exportação para todos os componentes unificados do editor,
 * incluindo as correções do Ticket #2: Pipeline de Etapas e Preview em Tempo Real.
 * 
 * COMPONENTES INCLUÍDOS:
 * ✅ RealStagesProvider - Pipeline robusto de etapas
 * ✅ TemplatesCacheService - Cache inteligente de templates
 * ✅ UnifiedPreviewEngine - Preview com imports ESM
 * ✅ UnifiedPreviewWithFallbacks - Preview com fallbacks robustos
 * ✅ InteractivePreviewEngine - Preview interativo
 */

// 🏗️ PROVIDERS E CONTEXTOS
export { RealStagesProvider, useRealStages } from './RealStagesProvider';
export type { QuizStage, StageActions, RealStagesContextType } from './RealStagesProvider';

// 🔗 INTEGRAÇÃO CRUD
export { CRUDIntegrationProvider, useCRUDIntegration } from './UnifiedCRUDIntegration';
// Tipos do CRUD Integration serão exportados quando implementados

// 🎨 PREVIEW ENGINES
export { UnifiedPreviewEngine } from './UnifiedPreviewEngine';
export type { UnifiedPreviewEngineProps } from './UnifiedPreviewEngine';

export { default as UnifiedPreviewWithFallbacks, usePreviewWithFallbacks } from './UnifiedPreviewWithFallbacks';

export { InteractivePreviewEngine } from './InteractivePreviewEngine';
export type { InteractivePreviewEngineProps } from './InteractivePreviewEngine';

// 🗄️ SERVIÇOS DE CACHE
export { templatesCacheService } from '@/services/TemplatesCacheService';
export type { CacheConfig, CacheStats } from '@/services/TemplatesCacheService';

// 🎯 SERVIÇOS CRUD
export { unifiedCRUDService } from '@/services/UnifiedCRUDService';
export type { 
  UnifiedFunnel, 
  UnifiedStage, 
  FunnelSettings, 
  StageSettings, 
  CRUDOperation, 
  CRUDResult 
} from '@/services/UnifiedCRUDService';

// 🔄 SISTEMA DE VERSIONAMENTO
export { VersioningPanel } from './VersioningPanel';
// Hooks e serviços serão importados quando implementados

// 👥 SISTEMA DE COLABORAÇÃO
export { CollaborationPanel } from './CollaborationPanel';
// Hooks e serviços serão importados quando implementados

// 📊 SISTEMA DE ANALYTICS
export { AnalyticsDashboard } from './AnalyticsDashboard';
// Hooks e serviços serão importados quando implementados

// 🎯 INTEGRAÇÃO QUIZPAGE
export { QuizPageEditor } from '../quiz/QuizPageEditor';
// Hooks e serviços serão importados quando implementados

// 🔧 OUTROS COMPONENTES UNIFICADOS
export { EnhancedBlockRenderer } from './EnhancedBlockRenderer';
export { ProductionPreviewEngine } from './ProductionPreviewEngine';
export type { ProductionPreviewEngineProps } from './ProductionPreviewEngine';

// 🎯 WRAPPER INTEGRADO COMPLETO
// Sistema unificado será implementado quando todos os componentes estiverem prontos
export const UnifiedEditorSystem = {
  // Placeholder para sistema unificado
} as const;

/**
 * 🚀 CONFIGURAÇÃO PADRÃO RECOMENDADA
 * 
 * Use esta configuração como base para integrar o sistema unificado
 */
export const defaultUnifiedConfig = {
  stages: {
    maxStages: 21,
    enablePreload: true,
    enableCache: true,
    funnelId: 'quiz21StepsComplete',
  },
  preview: {
    fallbackMode: 'skeleton' as const,
    enableErrorRecovery: true,
    showDebugInfo: false,
    retryCount: 3,
  },
  cache: {
    maxEntries: 50,
    ttlMs: 10 * 60 * 1000, // 10 minutos
    preloadAdjacent: true,
    enableMetrics: true,
    maxMemoryMb: 25,
  },
} as const;

/**
 * 🎯 FUNÇÃO HELPER PARA SETUP RÁPIDO
 * 
 * Configura o sistema unificado com as melhores práticas
 */
export const setupUnifiedEditor = (customConfig?: {
  stages?: Partial<typeof defaultUnifiedConfig.stages>;
  preview?: Partial<typeof defaultUnifiedConfig.preview>;
  cache?: Partial<typeof defaultUnifiedConfig.cache>;
}) => {
  const config = {
    stages: { ...defaultUnifiedConfig.stages, ...customConfig?.stages },
    preview: { ...defaultUnifiedConfig.preview, ...customConfig?.preview },
    cache: { ...defaultUnifiedConfig.cache, ...customConfig?.cache },
  };

  // Configurar cache service será implementado

  return {
    config,
    components: UnifiedEditorSystem,
  };
};

/**
 * 📊 DIAGNÓSTICOS DO SISTEMA UNIFICADO
 */
export const getUnifiedSystemDiagnostics = () => {
  return {
    timestamp: new Date().toISOString(),
    cache: {
      stats: { totalEntries: 0, hitRate: 0 },
      hitRate: 0,
      isHealthy: false,
    },
    system: {
      componentsLoaded: {
        RealStagesProvider: false,
        UnifiedPreviewWithFallbacks: false,
        templatesCacheService: false,
      },
      version: '2.0.0-unified',
      ticketImplemented: 'Ticket #2 - Pipeline de Etapas e Preview em Tempo Real',
    },
  };
};

// 🎯 EXPORT DEFAULT PARA INTEGRAÇÃO RÁPIDA
export default UnifiedEditorSystem;