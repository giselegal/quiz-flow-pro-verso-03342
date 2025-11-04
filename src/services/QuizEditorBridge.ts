/**
 * 🔄 REDIRECT: QuizEditorBridge → TemplateService (canonical)
 * 
 * @deprecated Use @/services/canonical/TemplateService or UnifiedCRUDProvider
 */

export * from '@/services/deprecated/QuizEditorBridge';
export { default } from '@/services/deprecated/QuizEditorBridge';

if (typeof window !== 'undefined') {
  console.warn('[DEPRECATED] QuizEditorBridge → use @/services/canonical/TemplateService');
}
