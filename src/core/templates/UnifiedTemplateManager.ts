/**
 * Manager unificado de templates
 */
import { UITemplate } from '@/services/templateService';

export class UnifiedTemplateManager {
  async getTemplates(): Promise<UITemplate[]> {
    return [];
  }

  async getTemplateById(_id: string): Promise<UITemplate | null> {
    return null;
  }
}

export const unifiedTemplateManager = new UnifiedTemplateManager();
export default UnifiedTemplateManager;