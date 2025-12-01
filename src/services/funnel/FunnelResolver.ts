/**
 * 🗺️ FUNNEL RESOLVER (V4.1-SAAS)
 * 
 * Resolve funnelId → templatePath, integrando:
 * - TEMPLATE_PATHS (src/config/template-paths.ts)
 * - TemplateService (templates estáticos)
 * - Supabase (drafts persistidos)
 * 
 * Resolve o GARGALO #1:
 * - /editor não é mais hard-coded em /templates/quiz21-v4.json
 * - Suporta múltiplos funis via ID
 * - Fallback para templates base quando draft não existe
 * 
 * @since v4.1.0
 */

import { TEMPLATE_PATHS, TEMPLATE_ID_MAP, DEFAULT_TEMPLATE_PATH } from '@/config/template-paths';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Funnel identification strategy
 */
export interface FunnelIdentifier {
  /** Business funnel ID (from URL ?funnel=) */
  funnelId: string;
  
  /** Template ID (base template) */
  templateId?: string;
  
  /** Draft ID (Supabase quiz_drafts.id) */
  draftId?: string;
  
  /** Resource ID (legacy compatibility) */
  resourceId?: string;
}

/**
 * Resolved funnel information
 */
export interface ResolvedFunnel {
  /** Final funnel ID */
  funnelId: string;
  
  /** Template path to load */
  templatePath: string;
  
  /** Template version */
  templateVersion: string;
  
  /** Is loading from draft? */
  isDraft: boolean;
  
  /** Draft ID if exists */
  draftId?: string;
  
  /** Resolved strategy used */
  strategy: 'draft' | 'template' | 'default';
}

/**
 * Funnel ID to template path mapping
 * 
 * This is the SOURCE OF TRUTH for multi-funnel support.
 * Add new funnels here.
 */
export const FUNNEL_TEMPLATE_MAP: Record<string, string> = {
  // V4.1 SaaS (default)
  'quiz21StepsComplete': TEMPLATE_PATHS.V4_SAAS,
  'quiz21-v4-saas': TEMPLATE_PATHS.V4_SAAS,
  'quiz21-v4': TEMPLATE_PATHS.V4_SAAS, // Redirect v4 → v4-saas
  
  // Legacy templates
  'quiz21-complete': TEMPLATE_PATHS.V3_COMPLETE,
  'quiz21-v4-gold': TEMPLATE_PATHS.V4_GOLD,
  'quiz21-v4-legacy': TEMPLATE_PATHS.V4_LEGACY,
  
  // Add new funnels here:
  // 'clienteX-quiz21': '/templates/funnels/clienteX/master.json',
  // 'quiz-style-moderne': '/templates/funnels/moderne/master.json',
};

/**
 * Resolve funnelId to template path
 * 
 * Strategy:
 * 1. Check FUNNEL_TEMPLATE_MAP
 * 2. Try dynamic path patterns
 * 3. Fallback to default
 */
export function resolveFunnelTemplatePath(funnelId: string | null | undefined): string {
  if (!funnelId) {
    appLogger.info('🗺️ [FunnelResolver] No funnelId, using default', {
      path: DEFAULT_TEMPLATE_PATH
    });
    return DEFAULT_TEMPLATE_PATH;
  }

  // 1. Direct mapping
  if (FUNNEL_TEMPLATE_MAP[funnelId]) {
    const path = FUNNEL_TEMPLATE_MAP[funnelId];
    appLogger.info('🗺️ [FunnelResolver] Direct mapping', { funnelId, path });
    return path;
  }

  // 2. Try TEMPLATE_ID_MAP (from template-paths.ts)
  if (TEMPLATE_ID_MAP[funnelId]) {
    const path = TEMPLATE_ID_MAP[funnelId];
    appLogger.info('🗺️ [FunnelResolver] Template ID mapping', { funnelId, path });
    return path;
  }

  // 3. Try dynamic patterns
  const dynamicPatterns = [
    `/templates/funnels/${funnelId}/master.json`,
    `/templates/funnels/${funnelId}/quiz.json`,
    `/templates/${funnelId}.json`,
  ];

  appLogger.warn('🗺️ [FunnelResolver] Unknown funnelId, trying dynamic patterns', {
    funnelId,
    patterns: dynamicPatterns
  });

  // For now, return first pattern
  // TODO: Implement existence check via fetch()
  return dynamicPatterns[0];
}

/**
 * Resolve complete funnel information
 * 
 * This is the MAIN RESOLVER used by FunnelService
 * 
 * @param identifier - Funnel identification info
 * @returns Complete resolved funnel data
 */
export function resolveFunnel(identifier: FunnelIdentifier): ResolvedFunnel {
  const { funnelId, templateId, draftId, resourceId } = identifier;

  appLogger.info('🗺️ [FunnelResolver] Resolving funnel', {
    funnelId,
    templateId,
    draftId,
    resourceId
  });

  // Strategy 1: Draft exists (highest priority)
  if (draftId) {
    // When draftId exists, we'll load from Supabase
    // But still need templatePath for fallback
    const templatePath = templateId 
      ? resolveFunnelTemplatePath(templateId)
      : resolveFunnelTemplatePath(funnelId);

    return {
      funnelId: funnelId || draftId,
      templatePath,
      templateVersion: 'draft',
      isDraft: true,
      draftId,
      strategy: 'draft',
    };
  }

  // Strategy 2: Template ID specified
  if (templateId) {
    const templatePath = resolveFunnelTemplatePath(templateId);
    return {
      funnelId: funnelId || templateId,
      templatePath,
      templateVersion: getTemplateVersion(templatePath),
      isDraft: false,
      strategy: 'template',
    };
  }

  // Strategy 3: FunnelId only
  if (funnelId) {
    const templatePath = resolveFunnelTemplatePath(funnelId);
    return {
      funnelId,
      templatePath,
      templateVersion: getTemplateVersion(templatePath),
      isDraft: false,
      strategy: 'template',
    };
  }

  // Strategy 4: ResourceId (legacy compatibility)
  if (resourceId) {
    const templatePath = resolveFunnelTemplatePath(resourceId);
    return {
      funnelId: resourceId,
      templatePath,
      templateVersion: getTemplateVersion(templatePath),
      isDraft: false,
      strategy: 'template',
    };
  }

  // Strategy 5: Default fallback
  appLogger.warn('🗺️ [FunnelResolver] No identifier provided, using default');
  return {
    funnelId: 'quiz21StepsComplete',
    templatePath: DEFAULT_TEMPLATE_PATH,
    templateVersion: 'v4.1-saas',
    isDraft: false,
    strategy: 'default',
  };
}

/**
 * Get template version from path
 */
function getTemplateVersion(templatePath: string): string {
  if (templatePath.includes('v4-saas')) return 'v4.1-saas';
  if (templatePath.includes('v4-gold')) return 'v4.0-gold';
  if (templatePath.includes('v4')) return 'v4.0';
  if (templatePath.includes('complete')) return 'v3.0';
  return 'unknown';
}

/**
 * Normalize funnelId from various sources
 * 
 * Handles legacy naming conventions:
 * - quiz21StepsComplete → quiz21StepsComplete
 * - quiz21-complete → quiz21-complete
 * - templateId from URL params
 */
export function normalizeFunnelId(
  funnelId?: string | null,
  templateParam?: string | null,
  resourceId?: string | null
): string {
  // Priority: funnelId > templateParam > resourceId
  const id = funnelId || templateParam || resourceId;
  
  if (!id) {
    return 'quiz21StepsComplete'; // Default
  }

  // Normalize known aliases
  const aliases: Record<string, string> = {
    'quiz21': 'quiz21StepsComplete',
    'default': 'quiz21StepsComplete',
    'quiz-21': 'quiz21StepsComplete',
  };

  return aliases[id] || id;
}

/**
 * Parse funnel identifier from URL params
 * 
 * Usage:
 * ```ts
 * const identifier = parseFunnelFromURL(searchParams);
 * const resolved = resolveFunnel(identifier);
 * ```
 */
export function parseFunnelFromURL(searchParams: URLSearchParams): FunnelIdentifier {
  const funnelId = searchParams.get('funnel');
  const templateId = searchParams.get('template');
  const resourceId = searchParams.get('resource');
  const draftId = searchParams.get('draftId') || searchParams.get('quizId');

  const normalizedFunnelId = normalizeFunnelId(funnelId, templateId, resourceId);

  return {
    funnelId: normalizedFunnelId,
    templateId: templateId || undefined,
    draftId: draftId || undefined,
    resourceId: resourceId || undefined,
  };
}

/**
 * Check if funnel uses v4.1-saas format
 */
export function isV41SaasFunnel(resolved: ResolvedFunnel): boolean {
  return resolved.templateVersion === 'v4.1-saas' || 
         resolved.templatePath === TEMPLATE_PATHS.V4_SAAS;
}
