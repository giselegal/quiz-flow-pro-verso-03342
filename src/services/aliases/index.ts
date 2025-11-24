// Compatibility layer: re-export deprecated services with runtime warnings
// ⚠️ WARNING: For backward compatibility only! Migrate to new services ASAP

// Silenciado: aliases funcionando corretamente
// console.warn('⚠️ [Deprecated] Usando aliases retrocompatíveis. Migre para services canônicos.');

// Canonical Service Aliases
export { templateService } from '@/services/canonical/TemplateService';
export { cacheService } from '@/services/canonical/CacheService';
export { dataService } from '@/services/canonical/DataService';
export { navigationService } from '@/services/canonical/NavigationService';

// Exportações opcionais para ampliar adoção
export { validationService } from '@/services/canonical/ValidationService';
export { monitoringService } from '@/services/canonical/MonitoringService';
export { analyticsService } from '@/services/canonical/AnalyticsService';
// Alguns serviços ainda não expõem singletons; exportamos as classes para uso avançado
export { StorageService } from '@/services/canonical/StorageService';
export { authService } from '@/services/canonical/AuthService';
export { ConfigService } from '@/services/canonical/ConfigService';
export { HistoryService } from '@/services/canonical/HistoryService';
export { EditorService } from '@/services/canonical/EditorService';

/**
 * Canonical Service Aliases
 *
 * Objetivo: expor serviços canônicos a partir de um ponto único e estável,
 * facilitando a migração gradual de serviços duplicados/legados.
 *
 * Como usar:
 *   import { ConsolidatedFunnelService } from '@services-alias';
 *   import { MasterTemplateService, ConsolidatedTemplateService } from '@services-alias';
 *
 * Vantagens:
 * - Centraliza os alvos canônicos
 * - Permite reforçar um único caminho de importação
 * - Reduz acoplamento com a estrutura interna de pastas
 */

export { default as ConsolidatedFunnelService } from '@/services/core/ConsolidatedFunnelService';
export { default as ConsolidatedTemplateService } from '@/services/core/ConsolidatedTemplateService';
export { default as MasterTemplateService } from '@/services/templates/MasterTemplateService';

// Exportações nomeadas opcionais (se os serviços não exportarem default)
// export { ConsolidatedFunnelService } from '@/services/core/ConsolidatedFunnelService';
// export { ConsolidatedTemplateService } from '@/services/core/ConsolidatedTemplateService';
// export { MasterTemplateService } from '@/services/templates/MasterTemplateService';

// ===== Compatibilidade com ServiceAliases (ponte de migração) =====
// Template layer (legados com depreciação)
// REMOVIDO: HybridTemplateService (deprecated) – usar templateService canônico
// export { default as HybridTemplateService } from '@/services/deprecated/HybridTemplateService';
// Tipos úteis expostos via barrel para imports estáveis
// export type { StepTemplate } from '@/services/deprecated/HybridTemplateService';

// Storage compatível (já exportado acima como classe)
// export { StorageService } from '@/services/canonical/StorageService';

// Quiz e dados auxiliares
// REMOVED: QUIZ_21_COMPLETE_DATA (serviço Quiz21CompleteService removido - usar templateService canônico)
export { quizDataService } from '@/services/quizDataService';
export { quizSupabaseService } from '@/services/quizSupabaseService';

// ⚠️ DEPRECATED: Use quizDataService ou quizSupabaseService
// REMOVED: quizService (serviço removido - usar quizDataService ou quizSupabaseService)

// Validação e Analytics (barrel compatível)
export { funnelValidationService } from '@/services/funnelValidationService';
// AnalyticsService migrado para canonical - use: import { analyticsService, AnalyticsService } from '@/services/canonical'

// Config API e serviço
// export { ConfigurationAPI } from '@/services/ConfigurationAPI'; // DEPRECATED: Removido em 31/out/2025
export { ConfigurationService } from '@/services/ConfigurationService';
// Alias de compatibilidade para migração
export { ConfigurationService as ConfigurationAPI } from '@/services/ConfigurationService';

// ============================================================================
// Funnel Services - Compatibility aliases
// ============================================================================

// FunnelUnifiedService: DEPRECATED - Usar canonical/FunnelService em novos códigos
// Mantido apenas para compatibilidade temporária de types
export type { UnifiedFunnelData } from '@/services/canonical/types';
