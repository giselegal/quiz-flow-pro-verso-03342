/**
 * 🗺️ TEMPLATE PATHS CONFIGURATION (V4.1-SAAS)
 * 
 * Centralized template path configuration for the entire application.
 * All loaders, services, and components should import paths from here.
 * 
 * @since v4.1.0
 */

/**
 * Template path constants
 */
export const TEMPLATE_PATHS = {
  /** V4.1 SaaS - Production template with normalized options and RichText */
  V4_SAAS: '/templates/quiz21-v4-saas.json',
  
  /** V4.0 - Previous production template (legacy) */
  V4_LEGACY: '/templates/quiz21-v4.json',
  
  /** V3 Complete - Complete v3 template (legacy) */
  V3_COMPLETE: '/templates/quiz21-complete.json',
  
  /** V4 Gold - Gold standard reference template */
  V4_GOLD: '/templates/quiz21-v4-gold.json',
} as const;

/**
 * Template ID to path mapping
 */
export const TEMPLATE_ID_MAP: Record<string, string> = {
  // V4.1 SaaS (current production)
  'quiz21-v4-saas': TEMPLATE_PATHS.V4_SAAS,
  'quiz21StepsComplete': TEMPLATE_PATHS.V4_SAAS, // Default for legacy IDs
  'quiz21-v4': TEMPLATE_PATHS.V4_SAAS, // Redirect v4 to v4-saas
  
  // Legacy templates
  'quiz21-complete': TEMPLATE_PATHS.V3_COMPLETE,
  'quiz21-v4-gold': TEMPLATE_PATHS.V4_GOLD,
  'quiz21-v4-legacy': TEMPLATE_PATHS.V4_LEGACY,
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
 * Check if template is v4.1-saas format
 */
export function isV41SaasTemplate(templatePath: string): boolean {
  return templatePath === TEMPLATE_PATHS.V4_SAAS;
}

/**
 * Get template version from path
 */
export function getTemplateVersion(templatePath: string): string {
  if (templatePath === TEMPLATE_PATHS.V4_SAAS) return 'v4.1-saas';
  if (templatePath === TEMPLATE_PATHS.V4_LEGACY) return 'v4.0';
  if (templatePath === TEMPLATE_PATHS.V3_COMPLETE) return 'v3.0';
  if (templatePath === TEMPLATE_PATHS.V4_GOLD) return 'v4.0-gold';
  return 'unknown';
}
