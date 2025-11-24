/**
 * 🔄 MIGRATION HELPERS - Phase 2
 * 
 * Helper functions to facilitate gradual migration to canonical services
 * using feature flags for controlled rollout.
 * 
 * These helpers provide a bridge between legacy services and canonical services,
 * allowing components to seamlessly switch between implementations based on
 * feature flags.
 * 
 * @version 1.0.0
 * @phase Phase 2 - Progressive Migration
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
 * NOTE: Currently always returns canonical service as legacy services are being phased out.
 * The feature flag controls whether components use this service or handle their own legacy logic.
 * 
 * @example
 * ```typescript
 * const service = getTemplateService();
 * const result = await service.getTemplate('template-123');
 * ```
 */
export function getTemplateService() {
  // Always return canonical service
  // Feature flags are used at the component level to decide whether to use this service
  // or maintain their own legacy implementation during the migration period
  return canonicalTemplateService;
}

/**
 * Load a template with automatic service selection based on feature flags
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
 * This helper is useful for conditional logic in components that
 * want to gradually migrate to React Query.
 * 
 * @returns true if React Query hooks should be used
 * 
 * @example
 * ```typescript
 * if (shouldUseReactQuery()) {
 *   // Use useTemplate hook
 *   const { data } = useTemplate(templateId);
 * } else {
 *   // Use legacy approach
 *   const [template, setTemplate] = useState(null);
 *   useEffect(() => { ... }, []);
 * }
 * ```
 */
export function shouldUseReactQuery(): boolean {
  return featureFlags.USE_REACT_QUERY_TEMPLATES;
}

/**
 * Check if canonical services should be used
 * 
 * @returns true if canonical services are enabled
 */
export function shouldUseCanonicalServices(): boolean {
  return featureFlags.USE_CANONICAL_TEMPLATE_SERVICE;
}

// ============================================================================
// MIGRATION STATUS LOGGING
// ============================================================================

/**
 * Log migration status for debugging
 * Only logs in development environment
 */
export function logMigrationStatus(): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 [Phase 2 Migration Status]', {
      canonicalTemplateService: featureFlags.USE_CANONICAL_TEMPLATE_SERVICE,
      reactQueryTemplates: featureFlags.USE_REACT_QUERY_TEMPLATES,
      canonicalFunnelService: featureFlags.USE_CANONICAL_FUNNEL_SERVICE,
      reactQueryFunnels: featureFlags.USE_REACT_QUERY_FUNNELS,
    });
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
