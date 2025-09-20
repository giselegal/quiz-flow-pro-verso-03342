/**
 * Manager unificado de templates
 */
import { UITemplate } from '@/services/templateService';

export interface UnifiedTemplateData {
  id: string;
  name: string;
  category: string;
  description?: string;
  isCustom?: boolean;
  theme?: string;
  tags?: string[];
  image?: string;
  isOfficial?: boolean;
  features?: string[];
  stepCount?: number;
  conversionRate?: number;
  usageCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateSearchFilters {
  category?: string;
  search?: string;
  sortBy?: string;
}

export class UnifiedTemplateManager {
  async getTemplates(): Promise<UITemplate[]> {
    return [];
  }

  async getAllTemplates(_filters?: TemplateSearchFilters): Promise<UnifiedTemplateData[]> {
    // Implementação placeholder que considera filtros
    return [];
  }

  async getTemplateById(_id: string): Promise<UITemplate | null> {
    return null;
  }

  async createCustomTemplate(_data: any): Promise<UITemplate> {
    throw new Error('Not implemented');
  }

  async deleteCustomTemplate(_id: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async createFunnelFromTemplate(_templateId: string, _options?: any): Promise<any> {
    throw new Error('Not implemented');
  }

  async getCategories(): Promise<string[]> {
    return ['quiz', 'funnel', 'landing'];
  }
}

export const unifiedTemplateManager = new UnifiedTemplateManager();
export default UnifiedTemplateManager;