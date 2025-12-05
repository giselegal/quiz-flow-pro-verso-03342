/**
 * 🗺️ TEMPLATE PATHS CONFIGURATION (V4.1-SAAS)
 * 
 * Centralized template path configuration for the entire application.
 * All loaders, services, and components should import paths from here.
 * 
 * @since v4.1.0
 */

// Import template data directly for bundling
import quiz21V4Template from '@/data/templates/quiz21-v4.json';

/**
 * Template path constants
 */
export const TEMPLATE_PATHS = {
  /** V4 SaaS - Production template (canonical) */
  V4_SAAS: '@/data/templates/quiz21-v4.json',
} as const;

/**
 * Template ID to path mapping
 */
export const TEMPLATE_ID_MAP: Record<string, string> = {
  'quiz21-v4-saas': TEMPLATE_PATHS.V4_SAAS,
  'quiz21StepsComplete': TEMPLATE_PATHS.V4_SAAS,
  'quiz21-v4': TEMPLATE_PATHS.V4_SAAS,
  'quiz21-complete': TEMPLATE_PATHS.V4_SAAS,
};

/**
 * Default template path for the application
 */
export const DEFAULT_TEMPLATE_PATH = TEMPLATE_PATHS.V4_SAAS;

/**
 * Get template path by ID with fallback to default
 */
export function getTemplatePath(templateId: string | null | undefined): string {
  if (!templateId) {
    return DEFAULT_TEMPLATE_PATH;
  }
  
  return TEMPLATE_ID_MAP[templateId] || DEFAULT_TEMPLATE_PATH;
}

/**
 * Check if template is v4 format
 */
export function isV4Template(templatePath: string): boolean {
  return templatePath === TEMPLATE_PATHS.V4_SAAS;
}

/**
 * Get template version from path
 */
export function getTemplateVersion(templatePath: string): string {
  return 'v4.0';
}

/**
 * Get the canonical quiz21-v4 template data directly
 * This avoids HTTP fetching and uses bundled data
 */
export function getCanonicalTemplate() {
  return quiz21V4Template;
}

/**
 * Export the template data for direct import
 */
export { quiz21V4Template };
