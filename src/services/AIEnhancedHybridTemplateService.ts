/**
 * 🔄 REDIRECT: AIEnhancedHybridTemplateService → TemplateService (canonical)
 * 
 * @deprecated Use @/services/canonical/TemplateService
 */

export * from '@/services/deprecated/AIEnhancedHybridTemplateService';
export { default } from '@/services/deprecated/AIEnhancedHybridTemplateService';

if (typeof window !== 'undefined') {
  console.warn('[DEPRECATED] AIEnhancedHybridTemplateService → use @/services/canonical/TemplateService');
}
