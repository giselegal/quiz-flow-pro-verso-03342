// Stub for EnhancedUnifiedDataService to fix import errors
export const DEPRECATED = true;
(() => { if (typeof console !== 'undefined' && !(globalThis as any).__DEP_LOG_ENHANCED_DATA) { (globalThis as any).__DEP_LOG_ENHANCED_DATA = true; console.warn('[DEPRECATED][EnhancedUnifiedDataService] Será removido após consolidação analytics.'); } })();
export class EnhancedUnifiedDataService {
  static getInstance() {
    return new EnhancedUnifiedDataService();
  }

  async getBackupData() {
    return { data: [], metadata: {} };
  }

  async loadTemplate(templateId: string) {
    return { id: templateId, data: {} };
  }
}

export const enhancedUnifiedDataService = EnhancedUnifiedDataService.getInstance();