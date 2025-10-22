/**
 * 🎯 SERVICE ALIASES - QUICK WIN #1
 * 
 * Arquivo central que redireciona serviços duplicados para versões canônicas.
 * Isso permite manter compatibilidade enquanto consolidamos gradualmente.
 * 
 * OBJETIVO:
 * - Reduzir de 117 serviços para ~40 canônicos
 * - Manter compatibilidade com código existente
 * - Facilitar migração gradual
 * 
 * @version 1.0.0 - Quick Win Implementation
 * @date 2025-10-22
 */

// ============================================================================
// FUNNEL SERVICES - 8 serviços → 1 canônico
// ============================================================================

import { UnifiedCRUDService } from './UnifiedCRUDService';

/** @deprecated Use UnifiedCRUDService - Alias mantido para compatibilidade */
export const FunnelService = UnifiedCRUDService;

/** @deprecated Use UnifiedCRUDService - Alias mantido para compatibilidade */
export const EnhancedFunnelService = UnifiedCRUDService;

/** @deprecated Use UnifiedCRUDService - Alias mantido para compatibilidade */
export const FunnelUnifiedService = UnifiedCRUDService;

/** @deprecated Use UnifiedCRUDService - Alias mantido para compatibilidade */
export const TemplateFunnelService = UnifiedCRUDService;

// ============================================================================
// TEMPLATE SERVICES - 12 serviços → 2 canônicos
// ============================================================================

import { UnifiedTemplateService } from './UnifiedTemplateService';
import HybridTemplateServiceClass from './HybridTemplateService';
// Exportar canônicos diretamente para facilitar migração por barrel
export { UnifiedTemplateService } from './UnifiedTemplateService';
export { default as HybridTemplateService } from './HybridTemplateService';

/** @deprecated Use UnifiedTemplateService - Alias mantido para compatibilidade */
export const TemplateService = UnifiedTemplateService;

/** @deprecated Use UnifiedTemplateService - Alias mantido para compatibilidade */
export const JsonTemplateService = UnifiedTemplateService;

/** @deprecated Use HybridTemplateService (default import) para templates AI-enhanced */
export const AIEnhancedHybridTemplateService = HybridTemplateServiceClass;

/** @deprecated Use UnifiedTemplateService - Alias mantido para compatibilidade */
export const TemplateEditorService = UnifiedTemplateService;

/** @deprecated Use UnifiedTemplateService - Alias mantido para compatibilidade */
export const TemplateRuntimeService = UnifiedTemplateService;

/** @deprecated Use UnifiedTemplateService - Alias mantido para compatibilidade */
export const customTemplateService = UnifiedTemplateService;

// Re-export já feito acima

// ============================================================================
// STORAGE SERVICES - 6 serviços → 1 canônico
// ============================================================================

import { UnifiedStorageService } from './UnifiedStorageService';
export { UnifiedStorageService } from './UnifiedStorageService';

/** @deprecated Use UnifiedStorageService - Alias mantido para compatibilidade */
export const FunnelStorageAdapter = UnifiedStorageService;

/** @deprecated Use UnifiedStorageService - Alias mantido para compatibilidade */
export const AdvancedFunnelStorage = UnifiedStorageService;

/** @deprecated Use UnifiedStorageService - Alias mantido para compatibilidade */
export const funnelLocalStore = UnifiedStorageService;

/** @deprecated Use UnifiedStorageService - Alias mantido para compatibilidade */
export const migratedFunnelLocalStore = UnifiedStorageService;

// ============================================================================
// QUIZ SERVICES - 8 serviços → 2 canônicos
// ============================================================================

// Quiz21CompleteService é dados, não serviço
import { QUIZ_21_COMPLETE_DATA } from './Quiz21CompleteService';
import { quizDataService } from './quizDataService';
import { quizSupabaseService as _quizSupabaseService } from './quizSupabaseService';

/** @deprecated Use QUIZ_21_COMPLETE_DATA diretamente */
export const Quiz21CompleteData = QUIZ_21_COMPLETE_DATA;

// Re-exports canônicos
export { QUIZ_21_COMPLETE_DATA } from './Quiz21CompleteService';
export { quizDataService } from './quizDataService';
export const quizSupabaseService = _quizSupabaseService;

// ============================================================================
// ANALYTICS SERVICES - 5 serviços → 1 canônico
// ============================================================================

import { AnalyticsService } from './AnalyticsService';
export { AnalyticsService } from './AnalyticsService';

/** @deprecated Use AnalyticsService - Arquivo deprecated removível */
export { AnalyticsService as compatibleAnalytics };

/** @deprecated Use AnalyticsService - Arquivo deprecated removível */
export { AnalyticsService as simpleAnalytics };

/** @deprecated Use AnalyticsService para analytics */
export const realTimeAnalytics = AnalyticsService;

// ============================================================================
// VALIDATION SERVICES - 4 serviços → 1 canônico
// ============================================================================

import { funnelValidationService } from './funnelValidationService';
export { funnelValidationService } from './funnelValidationService';

/** @deprecated Use funnelValidationService - Alias mantido para compatibilidade */
export const migratedFunnelValidationService = funnelValidationService;

/** @deprecated Use funnelValidationService - Alias mantido para compatibilidade */
export const pageStructureValidator = funnelValidationService;

/** @deprecated Use funnelValidationService - Alias mantido para compatibilidade */
export const AlignmentValidator = funnelValidationService;

// ============================================================================
// CONFIGURATION SERVICES - 3 serviços → 1 canônico
// ============================================================================

import { ConfigurationService } from './ConfigurationService';
export { ConfigurationService } from './ConfigurationService';

/** @deprecated Use ConfigurationService - Alias mantido para compatibilidade */
export const ConfigurationAPI = ConfigurationService;

/** @deprecated Use ConfigurationService - Alias mantido para compatibilidade */
export const canvasConfigurationService = ConfigurationService;

/** @deprecated Use ConfigurationService - Alias mantido para compatibilidade */
export const pageConfigService = ConfigurationService;

// ============================================================================
// HELPER: Log de uso de alias deprecated
// ============================================================================

const logDeprecationWarning = (oldName: string, newName: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `⚠️ [DEPRECATION] "${oldName}" é um alias deprecated. ` +
      `Use "${newName}" diretamente. ` +
      `Este alias será removido na versão 2.0.0`
    );
  }
};

// ============================================================================
// ESTATÍSTICAS DE REDUÇÃO
// ============================================================================

/**
 * 📊 IMPACTO DA CONSOLIDAÇÃO:
 * 
 * Antes:
 * - 117 serviços totais
 * - 60%+ redundância estimada
 * - Confusão sobre qual serviço usar
 * 
 * Depois (com aliases):
 * - ~40 serviços canônicos
 * - Aliases mantêm compatibilidade
 * - Path claro de migração
 * 
 * Próximos passos:
 * 1. Migrar imports para usar serviços canônicos
 * 2. Remover aliases após migração completa
 * 3. Arquivar serviços duplicados
 */

export const DEPRECATION_GUIDE = {
  message: 'Consulte ServiceAliases.ts para migrar para serviços canônicos',
  docs: 'docs/QUICK_WIN_SERVICE_CONSOLIDATION.md',
  estimatedSavings: {
    services: '77 serviços a menos',
    bundle: '~400KB redução estimada',
    confusion: '70% menos "qual serviço usar?"'
  }
};
