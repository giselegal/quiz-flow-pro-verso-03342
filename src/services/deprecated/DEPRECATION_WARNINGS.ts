import { appLogger } from '@/lib/utils/appLogger';
/**
 * 🎯 FASE 3.2 - Avisos de Deprecação para Template Services
 * 
 * Este arquivo centraliza todos os avisos de deprecação
 * para serviços de template que devem ser migrados.
 * 
 * @phase FASE 3.2 - Template Services Consolidation
 */

/**
 * Emite aviso de deprecação no console (apenas em desenvolvimento)
 */
function emitDeprecationWarning(
  serviceName: string,
  replacement: string,
  migrationGuide?: string
) {
  if (process.env.NODE_ENV === 'development') {
    appLogger.warn(`⚠️ [DEPRECATED] ${serviceName} is deprecated.\n` +
            `   Use ${replacement} instead.\n` +
            (migrationGuide ? `   Migration Guide: ${migrationGuide}\n` : '') +
            `   Documentation: TEMPLATE_SERVICES_CONSOLIDATION.md`);
  }
}

/**
 * Avisos específicos por serviço
 */

export function warnTemplateService() {
  emitDeprecationWarning(
    'templateService.ts',
    'HierarchicalTemplateSource',
    'See src/services/core/HierarchicalTemplateSource.ts'
  );
}

export function warnTemplateServiceRefactored() {
  emitDeprecationWarning(
    'templateService.refactored.ts',
    'HierarchicalTemplateSource',
    'Refactor incomplete - use HierarchicalTemplateSource instead'
  );
}

export function warnUnifiedTemplateService() {
  emitDeprecationWarning(
    'UnifiedTemplateService.ts',
    'HierarchicalTemplateSource',
    'Not truly unified - use HierarchicalTemplateSource'
  );
}

export function warnTemplateLoader() {
  emitDeprecationWarning(
    'TemplateLoader.ts',
    'jsonStepLoader.ts',
    'See src/templates/loaders/jsonStepLoader.ts'
  );
}

export function warnTemplateProcessor() {
  emitDeprecationWarning(
    'TemplateProcessor.ts',
    'HierarchicalTemplateSource',
    'Logic obsolete - use HierarchicalTemplateSource'
  );
}

export function warnStepTemplateService() {
  emitDeprecationWarning(
    'stepTemplateService.ts',
    'HierarchicalTemplateSource',
    'Limited functionality - use HierarchicalTemplateSource'
  );
}

export function warnConsolidatedTemplateService() {
  emitDeprecationWarning(
    'ConsolidatedTemplateService.ts',
    'HierarchicalTemplateSource',
    'Name misleading - use HierarchicalTemplateSource'
  );
}

export function warnMasterTemplateService() {
  emitDeprecationWarning(
    'MasterTemplateService.ts',
    'HierarchicalTemplateSource',
    'Redundant - use HierarchicalTemplateSource'
  );
}

/**
 * Mapa de serviços deprecados para fácil lookup
 */
export const DEPRECATED_SERVICES = {
  'templateService.ts': warnTemplateService,
  'templateService.refactored.ts': warnTemplateServiceRefactored,
  'UnifiedTemplateService.ts': warnUnifiedTemplateService,
  'TemplateLoader.ts': warnTemplateLoader,
  'TemplateProcessor.ts': warnTemplateProcessor,
  'stepTemplateService.ts': warnStepTemplateService,
  'ConsolidatedTemplateService.ts': warnConsolidatedTemplateService,
  'MasterTemplateService.ts': warnMasterTemplateService,
} as const;

/**
 * Emitir avisos para todos os serviços deprecados
 */
export function warnAllDeprecated() {
  Object.values(DEPRECATED_SERVICES).forEach(warn => warn());
}

export default {
  warnTemplateService,
  warnTemplateServiceRefactored,
  warnUnifiedTemplateService,
  warnTemplateLoader,
  warnTemplateProcessor,
  warnStepTemplateService,
  warnConsolidatedTemplateService,
  warnMasterTemplateService,
  DEPRECATED_SERVICES,
  warnAllDeprecated,
};
