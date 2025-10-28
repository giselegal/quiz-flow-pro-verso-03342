/**
 * 🔗 Aliases de Compatibilidade para Migração Canônica
 * 
 * Objetivo: Permitir migração incremental dos serviços legados para
 * os serviços canônicos sem quebrar importações existentes.
 * 
 * Uso recomendado (temporário):
 * import { HybridTemplateService } from '@/services/aliases';
 * import { UnifiedTemplateService } from '@/services/aliases';
 * import { templateService } from '@/services/aliases';
 * import { cacheService } from '@/services/aliases';
 * import { FunnelUnifiedService } from '@/services/aliases';
 */

// Canônicos diretos
export { templateService } from '@/services/canonical/TemplateService';
export { cacheService } from '@/services/canonical/CacheService';
export { dataService as FunnelUnifiedService } from '@/services/canonical/DataService';

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
export { default as HybridTemplateService } from '@/services/HybridTemplateService';
// Tipos úteis expostos via barrel para imports estáveis
export type { StepTemplate } from '@/services/HybridTemplateService';

// Storage compatível
export { UnifiedStorageService } from '@/services/UnifiedStorageService';

// Quiz e dados auxiliares
export { QUIZ_21_COMPLETE_DATA } from '@/services/Quiz21CompleteService';
export { quizDataService } from '@/services/quizDataService';
export { quizSupabaseService } from '@/services/quizSupabaseService';

// Validação e Analytics (barrel compatível)
export { funnelValidationService } from '@/services/funnelValidationService';
export { AnalyticsService } from '@/services/AnalyticsService';

// Config API e serviço
export { ConfigurationAPI } from '@/services/ConfigurationAPI';
export { ConfigurationService } from '@/services/ConfigurationService';
