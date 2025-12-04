/**
 * 🎯 SERVICES INDEX - FASE 4 CONSOLIDATION
 * 
 * Ponto de entrada único para todos os serviços da aplicação.
 * 
 * ARQUITETURA CONSOLIDADA:
 * ========================
 * 
 * 12 Serviços Canônicos (src/services/canonical/):
 * - CacheService      → Cache multi-camada (L1+L2+L3)
 * - TemplateService   → Carregamento e gestão de templates
 * - FunnelService     → CRUD de funnels e componentes
 * - DataService       → Operações de dados genéricas
 * - ValidationService → Validação de dados e schemas
 * - AnalyticsService  → Métricas e analytics
 * - AuthService       → Autenticação
 * - StorageService    → Persistência (local, Supabase)
 * - ConfigService     → Configurações
 * - HistoryService    → Undo/Redo
 * - MonitoringService → Observability
 * - EditorService     → Estado do editor
 * 
 * USO RECOMENDADO:
 * ```typescript
 * // ✅ CORRETO - Importar de @/services
 * import { templateService, funnelService, cacheService } from '@/services';
 * 
 * // ❌ EVITAR - Importar de caminhos profundos
 * import { templateService } from '@/services/canonical/TemplateService';
 * ```
 * 
 * @version 5.0.0 - Phase 4 Consolidation
 */

// =============================================================================
// CANONICAL SERVICES (PRIMARY EXPORTS)
// =============================================================================

// Cache
export { cacheService, CacheService } from './canonical/CacheService';
export type { CacheStore, CacheStats, CacheSetOptions } from './canonical/CacheService';

// Templates
export { templateService, TemplateService } from './canonical/TemplateService';

// Funnels
export { 
  funnelService, 
  CanonicalFunnelService,
  type FunnelMetadata,
  type CreateFunnelInput,
  type UpdateFunnelInput,
  type ComponentInstance,
  type FunnelWithComponents
} from './canonical/FunnelService';

// Funnel Resolver utilities
export {
  resolveFunnel,
  resolveFunnelTemplatePath,
  parseFunnelFromURL,
  normalizeFunnelId,
  isV41SaasFunnel,
  FUNNEL_TEMPLATE_MAP,
} from './funnel/FunnelResolver';

export type {
  FunnelIdentifier,
  ResolvedFunnel,
} from './funnel/FunnelResolver';

// Data
export { dataService, DataService } from './canonical/DataService';

// Validation
export { validationService, ValidationService } from './canonical/ValidationService';

// Analytics
export { analyticsService, AnalyticsService } from './canonical/AnalyticsService';

// Auth
export { authService, AuthService } from './canonical/AuthService';

// Storage
export { StorageService } from './canonical/StorageService';

// Config
export { ConfigService } from './canonical/ConfigService';

// History
export { HistoryService } from './canonical/HistoryService';

// Monitoring
export { monitoringService, MonitoringService } from './canonical/MonitoringService';

// Editor
export { EditorService } from './canonical/EditorService';

// Navigation
export { navigationService, NavigationService } from './canonical/NavigationService';

// Notification
export { NotificationService } from './canonical/NotificationService';

// =============================================================================
// TYPES
// =============================================================================

export type { 
  ServiceResult, 
  ServiceOptions, 
  UnifiedFunnelData 
} from './canonical/types';

// =============================================================================
// CACHE LAYER (Multi-Layer Strategy)
// =============================================================================

export { multiLayerCache, MultiLayerCacheStrategy } from './core/MultiLayerCacheStrategy';
export { indexedDBCache } from './core/IndexedDBCache';

// =============================================================================
// COMPATIBILITY ALIASES (DEPRECATED - use canonical exports above)
// =============================================================================

/** @deprecated Use templateService */
export { unifiedCacheService, unifiedCache } from './unified/UnifiedCacheService';

/** @deprecated Use funnelService */
export { default as ConsolidatedFunnelService } from './core/ConsolidatedFunnelService';

/** @deprecated Use templateService */
export { default as ConsolidatedTemplateService } from './core/ConsolidatedTemplateService';

/** @deprecated Use templateService */
export { default as MasterTemplateService } from './templates/MasterTemplateService';

// Quiz Services
export { quizDataService } from './quizDataService';
export { quizSupabaseService } from './quizSupabaseService';

// Validation (legacy)
export { funnelValidationService } from './funnelValidationService';

// Configuration (legacy)
export { ConfigurationService } from './ConfigurationService';
export { ConfigurationService as ConfigurationAPI } from './ConfigurationService';

// Template Registry
export { TemplateRegistry } from './TemplateRegistry';

// =============================================================================
// QUIZ NAVIGATION CONFIG
// =============================================================================

export {
  QUIZ_NAV_CONFIG,
  QUIZ_STRUCTURE,
  getConfiguredNextStep,
  isOptionalStep,
  getEnabledSteps,
  isStepEnabled,
} from '../config/quizNavigation';

// =============================================================================
// NAVIGATION TYPES
// =============================================================================

export type {
  StepNavigationInfo,
  NavigationMap,
  NavigationValidationResult,
  NavigationGraph,
} from './canonical/NavigationService';
