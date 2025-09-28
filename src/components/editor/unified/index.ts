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
export type {
  CRUDIntegrationState,
  CRUDIntegrationActions,
  CRUDIntegrationContextType
} from './UnifiedCRUDIntegration';

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
export { useUnifiedVersioning } from '../../hooks/core/useUnifiedVersioning';
export { versioningService } from '../../services/VersioningService';
export { historyManager } from '../../services/HistoryManager';

// 👥 SISTEMA DE COLABORAÇÃO
export { CollaborationPanel } from './CollaborationPanel';
export { useUnifiedCollaboration } from '../../hooks/core/useUnifiedCollaboration';
export { collaborationService } from '../../services/CollaborationService';
export { permissionService } from '../../services/PermissionService';
export { notificationService } from '../../services/NotificationService';

// 📊 SISTEMA DE ANALYTICS
export { AnalyticsDashboard } from './AnalyticsDashboard';
export { useUnifiedAnalytics } from '../../hooks/core/useUnifiedAnalytics';
export { analyticsService } from '../../services/AnalyticsService';

// 🎯 INTEGRAÇÃO QUIZPAGE
export { QuizPageEditor } from '../quiz/QuizPageEditor';
export { useQuizPageEditor } from '../../hooks/core/useQuizPageEditor';
export { quizPageIntegrationService } from '../../services/QuizPageIntegrationService';

// 🔧 OUTROS COMPONENTES UNIFICADOS
export { EnhancedBlockRenderer } from './EnhancedBlockRenderer';
export { ProductionPreviewEngine } from './ProductionPreviewEngine';
export type { ProductionPreviewEngineProps } from './ProductionPreviewEngine';

// 🎯 WRAPPER INTEGRADO COMPLETO
export const UnifiedEditorSystem = {
  RealStagesProvider,
  UnifiedPreviewWithFallbacks,
  CRUDIntegrationProvider,
  templatesCacheService,
  unifiedCRUDService,
  useRealStages,
  usePreviewWithFallbacks,
  useCRUDIntegration,
  // Versionamento
  VersioningPanel,
  useUnifiedVersioning,
  versioningService,
  historyManager,
  // Colaboração
  CollaborationPanel,
  useUnifiedCollaboration,
  collaborationService,
  permissionService,
  notificationService,
  // Analytics
  AnalyticsDashboard,
  useUnifiedAnalytics,
  analyticsService,
  // QuizPage Integration
  QuizPageEditor,
  useQuizPageEditor,
  quizPageIntegrationService,
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

  // Configurar cache service
  templatesCacheService.updateConfig(config.cache);

  return {
    config,
    components: UnifiedEditorSystem,
  };
};

/**
 * 📊 DIAGNÓSTICOS DO SISTEMA UNIFICADO
 */
export const getUnifiedSystemDiagnostics = () => {
  const cacheStats = templatesCacheService.getStats();
  
  return {
    timestamp: new Date().toISOString(),
    cache: {
      stats: cacheStats,
      hitRate: templatesCacheService.getHitRate(),
      isHealthy: cacheStats.totalEntries > 0,
    },
    system: {
      componentsLoaded: {
        RealStagesProvider: !!RealStagesProvider,
        UnifiedPreviewWithFallbacks: !!UnifiedPreviewWithFallbacks,
        templatesCacheService: !!templatesCacheService,
      },
      version: '2.0.0-unified',
      ticketImplemented: 'Ticket #2 - Pipeline de Etapas e Preview em Tempo Real',
    },
  };
};

// 🎯 EXPORT DEFAULT PARA INTEGRAÇÃO RÁPIDA
export default UnifiedEditorSystem;