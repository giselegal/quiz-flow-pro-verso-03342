/**
 * 🔄 SERVICE ALIASES - Compatibility Layer
 * 
 * ⚠️ DEPRECATED: Este arquivo existe apenas para compatibilidade.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { templateService } from '@/services/aliases';
 * 
 * // ✅ DEPOIS
 * import { templateService } from '@/services';
 * ```
 * 
 * Todos os serviços canônicos estão disponíveis em '@/services'.
 */

// =============================================================================
// CANONICAL SERVICES (Re-exports from @/services)
// =============================================================================

export { 
  templateService,
  cacheService,
  dataService,
  navigationService,
  validationService,
  monitoringService,
  analyticsService,
  authService,
  funnelService,
  ConfigService,
  StorageService,
  HistoryService,
  EditorService,
} from '@/services';

// =============================================================================
// LEGACY COMPATIBILITY (DEPRECATED)
// =============================================================================

/** @deprecated Use funnelService from '@/services' */
export { default as ConsolidatedFunnelService } from '@/services/core/ConsolidatedFunnelService';

/** @deprecated Use templateService from '@/services' */
export { default as ConsolidatedTemplateService } from '@/services/core/ConsolidatedTemplateService';

/** @deprecated Use templateService from '@/services' */
export { default as MasterTemplateService } from '@/services/templates/MasterTemplateService';

// Quiz Services
export { quizDataService } from '@/services/quizDataService';
export { quizSupabaseService } from '@/services/quizSupabaseService';

// Validation
export { funnelValidationService } from '@/services/funnelValidationService';

// Configuration
export { ConfigurationService } from '@/services/ConfigurationService';
export { ConfigurationService as ConfigurationAPI } from '@/services/ConfigurationService';

// Types
export type { UnifiedFunnelData } from '@/services/canonical/types';
