/**
 * 🔄 REDIRECT: QuizEditorBridge → TemplateService (canonical)
 * 
 * @deprecated ARCHIVED - Original implementation moved to .archive/deprecated/services-legacy/
 * @see .archive/deprecated/services-legacy/QuizEditorBridge.ts
 * 
 * Migration path: Use @/services/canonical/TemplateService or UnifiedCRUDProvider instead
 */

/**
 * Stub class for backward compatibility
 * @deprecated Use templateService from @/services/canonical/TemplateService
 */
class QuizEditorBridge {
  constructor() {
    console.warn('⚠️ QuizEditorBridge is deprecated and has been archived. Use @/services/canonical/TemplateService instead.');
  }

  // Add any methods that might be called to prevent runtime errors
  loadSteps() {
    throw new Error('QuizEditorBridge has been archived. Use @/services/canonical/TemplateService instead.');
  }
  
  saveSteps() {
    throw new Error('QuizEditorBridge has been archived. Use @/services/canonical/TemplateService instead.');
  }

  async loadForRuntime() {
    throw new Error('QuizEditorBridge has been archived. Use @/services/canonical/TemplateService instead.');
  }
}

export const quizEditorBridge = new QuizEditorBridge();
export default quizEditorBridge;
