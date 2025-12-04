/**
 * 🎯 TEMPLATE SERVICES - Entry Point
 * 
 * ⚠️ Este arquivo redireciona para o TemplateService canônico.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { MasterTemplateService } from '@/services/templates';
 * 
 * // ✅ DEPOIS
 * import { templateService } from '@/services';
 * ```
 */

// Re-export from canonical service
export { templateService, TemplateService } from '../canonical/TemplateService';

// Legacy exports (deprecated)
/** @deprecated Use templateService from '@/services' */
export { default as MasterTemplateService } from './MasterTemplateService';

/** @deprecated Use templateService from '@/services' */
export { UnifiedTemplateLoader } from './UnifiedTemplateLoader';

// Built-in templates
export type { BuiltTemplate } from './builtInTemplates';
export { giseleStyleTemplate } from './giseleStyleTemplate';
export { strategicQuestionsTemplate } from './strategicQuestionsTemplate';
export { styleQuizTemplate } from './styleQuizTemplate';
export { styleQuizTemplate2 } from './styleQuizTemplate2';

// Legacy placeholder (deprecated)
/** @deprecated Use templateService from '@/services' */
export const templateLibraryService = {
  listBuiltins: () => Promise.resolve([]),
  getTemplate: () => Promise.resolve(null),
  loadTemplate: () => Promise.resolve(null),
};

export default templateLibraryService;
