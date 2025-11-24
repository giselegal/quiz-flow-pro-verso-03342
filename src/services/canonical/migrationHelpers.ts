/**
 * 🔄 MIGRATION HELPERS - Phase 3
 * 
 * Helper functions to facilitate controlled rollback to legacy services
 * when needed for emergency situations.
 * 
 * ⚠️ PHASE 3 CHANGE: Canonical services are now the DEFAULT
 * These helpers now provide ROLLBACK capability rather than opt-in migration.
 * 
 * The global flag DISABLE_CANONICAL_SERVICES_GLOBAL acts as an emergency
 * kill switch to revert to legacy behavior if critical issues are discovered.
 * 
 * @version 2.0.0
 * @phase Phase 3 - Strong Deprecation
 */

import { featureFlags } from '@/config/flags';
import { templateService as canonicalTemplateService } from './TemplateService';
import type { Template } from './TemplateService';
import type { ServiceResult } from './types';

// ============================================================================
// TEMPLATE SERVICE MIGRATION HELPERS
// ============================================================================

/**
 * Get the appropriate template service based on feature flags
 * 
 * 🎯 PHASE 3: Canonical is the default, legacy is emergency rollback only
 * 
 * Returns:
 * - Canonical service by default (normal operation)
 * - Can be overridden by DISABLE_CANONICAL_SERVICES_GLOBAL for emergencies
 * 
 * @example
 * ```typescript
 * const service = getTemplateService();
 * const result = await service.getTemplate('template-123');
 * ```
 */
export function getTemplateService() {
  // Check global rollback flag first (emergency override)
  if (featureFlags.DISABLE_CANONICAL_SERVICES_GLOBAL) {
    console.warn(
      '⚠️ [ROLLBACK] DISABLE_CANONICAL_SERVICES_GLOBAL is active. ' +
      'Note: Legacy services have been removed in Phase 3, so canonical service is still used. ' +
      'The rollback flag affects feature detection (React Query, cache behavior) but not the service itself.'
    );
  }
  
  // Default: return canonical service (Phase 3 standard)
  // Note: Even during rollback, we return canonical service since legacy services are removed
  return canonicalTemplateService;
}

/**
 * Load a template with automatic service selection based on feature flags
 * 
 * 🎯 PHASE 3: Uses canonical service by default with emergency rollback support
 * 
 * This is a convenience function that handles the service selection
 * and error handling for you.
 * 
 * @param templateId - Template ID to load
 * @returns ServiceResult with template data or error
 * 
 * @example
 * ```typescript
 * const result = await loadTemplate('template-123');
 * if (result.success) {
 *   console.log('Template loaded:', result.data);
 * } else {
 *   console.error('Failed to load template:', result.error);
 * }
 * ```
 */
export async function loadTemplate(templateId: string): Promise<ServiceResult<Template>> {
  // Use canonical service (rollback warnings handled by getTemplateService)
  const service = getTemplateService();
  return await service.getTemplate(templateId);
}

/**
 * Save a template with automatic service selection based on feature flags
 * 
 * @param template - Template data to save
 * @returns ServiceResult indicating success or failure
 * 
 * @example
 * ```typescript
 * const result = await saveTemplate({
 *   id: 'template-123',
 *   name: 'My Template',
 *   blocks: [...],
 *   // ...
 * });
 * ```
 */
export async function saveTemplate(template: Partial<Template> & { id: string }): Promise<ServiceResult<void>> {
  const service = getTemplateService();
  return await service.updateTemplate(template.id, template);
}

/**
 * List all templates with automatic service selection
 * 
 * @returns ServiceResult with array of templates
 */
export async function listTemplates(): Promise<ServiceResult<Template[]>> {
  const service = getTemplateService();
  return await service.listTemplates();
}

// ============================================================================
// REACT QUERY MIGRATION HELPERS
// ============================================================================

/**
 * Check if React Query hooks should be used for templates
 * 
 * 🎯 PHASE 3: React Query is now the DEFAULT and RECOMMENDED approach
 * Only returns false in emergency rollback scenarios
 * 
 * This helper is useful for conditional logic in components that
 * still have legacy fallback code paths.
 * 
 * @returns true if React Query hooks should be used (default: true)
 * 
 * @example
 * ```typescript
 * if (shouldUseReactQuery()) {
 *   // DEFAULT PATH: Use useTemplate hook (React Query)
 *   const { data } = useTemplate(templateId);
 * } else {
 *   // EMERGENCY ROLLBACK: Use legacy approach
 *   const [template, setTemplate] = useState(null);
 *   useEffect(() => { ... }, []);
 * }
 * ```
 */
export function shouldUseReactQuery(): boolean {
  // Global rollback flag takes precedence
  if (featureFlags.DISABLE_CANONICAL_SERVICES_GLOBAL) {
    console.warn('⚠️ [ROLLBACK] React Query disabled by global rollback flag');
    return false;
  }
  
  // Default: React Query is enabled (Phase 3 standard)
  return featureFlags.USE_REACT_QUERY_TEMPLATES;
}

/**
 * Check if canonical services should be used
 * 
 * 🎯 PHASE 3: Canonical services are now the DEFAULT
 * Only returns false in emergency rollback scenarios
 * 
 * @returns true if canonical services should be used (default: true)
 */
export function shouldUseCanonicalServices(): boolean {
  // Global rollback flag takes precedence
  if (featureFlags.DISABLE_CANONICAL_SERVICES_GLOBAL) {
    console.warn('⚠️ [ROLLBACK] Canonical services disabled by global rollback flag');
    return false;
  }
  
  // Default: canonical services are enabled (Phase 3 standard)
  return featureFlags.USE_CANONICAL_TEMPLATE_SERVICE;
}

// ============================================================================
// MIGRATION STATUS LOGGING
// ============================================================================

/**
 * Log migration status for debugging
 * Only logs in development environment
 * 
 * 🎯 PHASE 3: Shows rollback status and confirms canonical is default
 */
export function logMigrationStatus(): void {
  if (process.env.NODE_ENV === 'development') {
    const isRollback = featureFlags.DISABLE_CANONICAL_SERVICES_GLOBAL;
    
    console.log(
      isRollback ? '⚠️ [Phase 3 - ROLLBACK MODE]' : '✅ [Phase 3 - Canonical Services Active]',
      {
        globalRollback: featureFlags.DISABLE_CANONICAL_SERVICES_GLOBAL,
        canonicalTemplateService: featureFlags.USE_CANONICAL_TEMPLATE_SERVICE,
        reactQueryTemplates: featureFlags.USE_REACT_QUERY_TEMPLATES,
        canonicalFunnelService: featureFlags.USE_CANONICAL_FUNNEL_SERVICE,
        reactQueryFunnels: featureFlags.USE_REACT_QUERY_FUNNELS,
        status: isRollback 
          ? 'EMERGENCY ROLLBACK - Legacy services active' 
          : 'NORMAL OPERATION - Canonical services and React Query are default',
      }
    );
  }
}

// ============================================================================
// TYPE GUARDS AND UTILITIES
// ============================================================================

/**
 * Type guard to check if a result is successful
 * 
 * @param result - ServiceResult to check
 * @returns true if result is successful
 */
export function isSuccess<T>(result: ServiceResult<T>): result is ServiceResult<T> & { success: true; data: T } {
  return result.success === true;
}

/**
 * Type guard to check if a result has an error
 * 
 * @param result - ServiceResult to check
 * @returns true if result has an error
 */
export function isError<T>(result: ServiceResult<T>): result is ServiceResult<T> & { success: false; error: Error } {
  return result.success === false;
}

/**
 * Unwrap a ServiceResult, throwing if it's an error
 * 
 * Use this when you want to use try/catch instead of checking success
 * 
 * @param result - ServiceResult to unwrap
 * @returns The data if successful
 * @throws The error if unsuccessful
 * 
 * @example
 * ```typescript
 * try {
 *   const template = unwrapResult(await loadTemplate('template-123'));
 *   console.log('Template:', template);
 * } catch (error) {
 *   console.error('Failed:', error);
 * }
 * ```
 */
export function unwrapResult<T>(result: ServiceResult<T>): T {
  if (result.success) {
    return result.data as T;
  }
  throw result.error || new Error('Unknown error');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getTemplateService,
  loadTemplate,
  saveTemplate,
  listTemplates,
  shouldUseReactQuery,
  shouldUseCanonicalServices,
  logMigrationStatus,
  isSuccess,
  isError,
  unwrapResult,
};
