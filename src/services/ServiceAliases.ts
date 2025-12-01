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
// FUNNEL SERVICES - CONSOLIDAÇÃO FASE 1 (2025-12-01)
// ============================================================================

/**
 * ⭐ SERVIÇO OFICIAL: src/services/funnel/FunnelService.ts (v4.1.0)
 * 
 * Responsabilidades:
 * - loadFunnel(identifier) → carrega draft do Supabase OU template base
 * - saveFunnel(quiz, funnelId) → salva no Supabase com versioning
 * - duplicateFunnel(funnelId) → clona funil
 * 
 * MIGRAÇÃO:
 * Código antigo usando src/services/funnelService.ts ou funnelService.refactored.ts
 * deve migrar para o serviço oficial acima.
 */
export { funnelService, FunnelService } from './funnel/FunnelService';
export type { Funnel, LoadFunnelResult, SaveFunnelResult } from './funnel/FunnelService';

/**
 * 🗂️ SERVICES LEGADOS (movidos para src/services/legacy/)
 * 
 * Mantidos apenas para compatibilidade temporária.
 * Serão removidos na Fase 2.
 */

// Legacy FunnelService (HTTP API - localhost:3001)
import { default as LegacyFunnelServiceClass } from './legacy/funnelService.legacy';
/** @deprecated Use funnel/FunnelService (v4.1.0) - Service HTTP legado, movido para /legacy */
export const LegacyFunnelService = LegacyFunnelServiceClass;

// Refactored FunnelService (tentativa de integração Supabase)
import { default as RefactoredFunnelServiceClass } from './legacy/funnelService.refactored';
/** @deprecated Use funnel/FunnelService (v4.1.0) - Refactor incompleto, movido para /legacy */
export const RefactoredFunnelService = RefactoredFunnelServiceClass;

// ============================================================================
// OUTROS ALIASES (mantidos do sistema antigo)
// ============================================================================

import { UnifiedCRUDService } from './UnifiedCRUDService';

/** @deprecated Use UnifiedCRUDService - Alias mantido para compatibilidade */
export const EnhancedFunnelService = createDeprecatedAlias(
  UnifiedCRUDService as any,
  'EnhancedFunnelService',
  'UnifiedCRUDService',
);

/** @deprecated Use UnifiedCRUDService - Alias mantido para compatibilidade */
export const FunnelUnifiedService = createDeprecatedAlias(
  UnifiedCRUDService as any,
  'FunnelUnifiedService',
  'UnifiedCRUDService',
);

/** @deprecated Use UnifiedCRUDService - Alias mantido para compatibilidade */
export const TemplateFunnelService = createDeprecatedAlias(
  UnifiedCRUDService as any,
  'TemplateFunnelService',
  'UnifiedCRUDService',
);

// ============================================================================
// TEMPLATE SERVICES - 12 serviços → 1 canônico
// ============================================================================

// 🎯 FASE 2: Use canonical TemplateService as the single source of truth
import { templateService } from './canonical/TemplateService';
export { templateService } from './canonical/TemplateService';

/** @deprecated Use templateService from '@/services/canonical/TemplateService' */
export const UnifiedTemplateService = createDeprecatedAlias(
  templateService as any,
  'UnifiedTemplateService',
  'templateService (canonical)',
);

/** @deprecated Use templateService from '@/services/canonical/TemplateService' */
export const TemplateService = createDeprecatedAlias(
  templateService as any,
  'TemplateService',
  'templateService (canonical)',
);

/** @deprecated Use templateService from '@/services/canonical/TemplateService' */
export const JsonTemplateService = createDeprecatedAlias(
  templateService as any,
  'JsonTemplateService',
  'templateService (canonical)',
);

// AIEnhancedHybridTemplateService removido (sem alias)

/** @deprecated Use templateService from '@/services/canonical/TemplateService' */
export const TemplateEditorService = createDeprecatedAlias(
  templateService as any,
  'TemplateEditorService',
  'templateService (canonical)',
);

/** @deprecated Use templateService from '@/services/canonical/TemplateService' */
export const TemplateRuntimeService = createDeprecatedAlias(
  templateService as any,
  'TemplateRuntimeService',
  'templateService (canonical)',
);

/** @deprecated Use templateService from '@/services/canonical/TemplateService' */
export const customTemplateService = createDeprecatedAlias(
  templateService as any,
  'customTemplateService',
  'templateService (canonical)',
);

// ============================================================================
// STORAGE SERVICES - 6 serviços → 1 canônico
// ============================================================================

import { UnifiedStorageService } from './UnifiedStorageService';
export { UnifiedStorageService } from './UnifiedStorageService';

/** @deprecated Use UnifiedStorageService - Alias mantido para compatibilidade */
export const FunnelStorageAdapter = createDeprecatedAlias(
  UnifiedStorageService as any,
  'FunnelStorageAdapter',
  'UnifiedStorageService',
);

/** @deprecated Use UnifiedStorageService - Alias mantido para compatibilidade */
export const AdvancedFunnelStorage = createDeprecatedAlias(
  UnifiedStorageService as any,
  'AdvancedFunnelStorage',
  'UnifiedStorageService',
);

/** @deprecated Use UnifiedStorageService - Alias mantido para compatibilidade */
export const funnelLocalStore = createDeprecatedAlias(
  UnifiedStorageService as any,
  'funnelLocalStore',
  'UnifiedStorageService',
);

/** @deprecated Use UnifiedStorageService - Alias mantido para compatibilidade */
export const migratedFunnelLocalStore = createDeprecatedAlias(
  UnifiedStorageService as any,
  'migratedFunnelLocalStore',
  'UnifiedStorageService',
);

// ============================================================================
// QUIZ SERVICES - 8 serviços → 2 canônicos
// ============================================================================

// Quiz21CompleteService é dados, não serviço
import { QUIZ_21_COMPLETE_DATA } from './Quiz21CompleteService';
import { quizDataService } from './quizDataService';
import { quizSupabaseService as _quizSupabaseService } from './quizSupabaseService';

/** @deprecated Use QUIZ_21_COMPLETE_DATA diretamente */
export const Quiz21CompleteData = createDeprecatedAlias(
  QUIZ_21_COMPLETE_DATA as any,
  'Quiz21CompleteData',
  'QUIZ_21_COMPLETE_DATA',
);

// Re-exports canônicos
export { QUIZ_21_COMPLETE_DATA } from './Quiz21CompleteService';
export { quizDataService } from './quizDataService';
export const quizSupabaseService = createDeprecatedAlias(
  _quizSupabaseService as any,
  'quizSupabaseService (from alias file)',
  'quizSupabaseService (canonical export)',
);

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
export const migratedFunnelValidationService = createDeprecatedAlias(
  funnelValidationService as any,
  'migratedFunnelValidationService',
  'funnelValidationService',
);

/** @deprecated Use funnelValidationService - Alias mantido para compatibilidade */
export const pageStructureValidator = createDeprecatedAlias(
  funnelValidationService as any,
  'pageStructureValidator',
  'funnelValidationService',
);

/** @deprecated Use funnelValidationService - Alias mantido para compatibilidade */
export const AlignmentValidator = createDeprecatedAlias(
  funnelValidationService as any,
  'AlignmentValidator',
  'funnelValidationService',
);

// ============================================================================
// CONFIGURATION SERVICES - 3 serviços → 1 canônico
// ============================================================================

import { ConfigurationService } from './ConfigurationService';
export { ConfigurationService } from './ConfigurationService';

// Expor a API de configuração compatível (mantida enquanto os testes/consumidores dependem desta interface)
export { ConfigurationAPI } from './ConfigurationAPI';

/** @deprecated Use ConfigurationService - Alias mantido para compatibilidade */
export const canvasConfigurationService = createDeprecatedAlias(
  ConfigurationService as any,
  'canvasConfigurationService',
  'ConfigurationService',
);

/** @deprecated Use ConfigurationService - Alias mantido para compatibilidade */
export const pageConfigService = createDeprecatedAlias(
  ConfigurationService as any,
  'pageConfigService',
  'ConfigurationService',
);

// ============================================================================
// HELPER: Log de uso de alias deprecated
// ============================================================================

import { appLogger } from '@/lib/utils/logger';

const logDeprecationWarning = (oldName: string, newName: string) => {
  if (import.meta.env.DEV) {
    appLogger.warn(
      `🚨 DEPRECATION: "${oldName}" é um alias deprecated. ` +
      `Use "${newName}" diretamente. ` +
      'Este alias será removido na v2.0.0',
      { alias: oldName, target: newName, fase: '2', area: 'services' },
    );
  }
};

// Telemetria: cria um Proxy que registra a primeira utilização do alias
function createDeprecatedAlias<T extends object>(target: T, oldName: string, newName: string): T {
  let logged = false;
  const ensureLog = () => {
    if (!logged) {
      logged = true;
      logDeprecationWarning(oldName, newName);
    }
  };
  try {
    const handler: ProxyHandler<any> = {
      get(t, p, r) {
        ensureLog();
        return Reflect.get(t, p, r);
      },
      apply(t, thisArg, argArray) {
        ensureLog();
        return Reflect.apply(t as any, thisArg, argArray as any);
      },
      construct(t, argArray, newTarget) {
        ensureLog();
        return Reflect.construct(t as any, argArray as any, newTarget as any);
      },
    };
  return new Proxy(target as any, handler) as T;
  } catch {
    ensureLog();
    return target;
  }
}

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
    confusion: '70% menos "qual serviço usar?"',
  },
};
