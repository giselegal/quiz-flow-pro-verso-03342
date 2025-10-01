// Stub for EnhancedUnifiedDataService to fix import errors
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