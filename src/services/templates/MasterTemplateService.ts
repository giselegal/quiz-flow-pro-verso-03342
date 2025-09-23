/**
 * 🎨 Master Template Service - Simplified for Phase 4
 * 
 * Provides a unified interface for template management
 * All template functionality has been moved to the core TemplateService
 */

export interface UnifiedTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  stepCount: number;
  steps: any[];
  isOfficial: boolean;
  isPublished: boolean;
  usageCount: number;
  templateData: any;
  thumbnailUrl?: string;
}

export class MasterTemplateService {
  private static instance: MasterTemplateService;

  public static getInstance(): MasterTemplateService {
    if (!MasterTemplateService.instance) {
      MasterTemplateService.instance = new MasterTemplateService();
    }
    return MasterTemplateService.instance;
  }

  /**
   * Get all available templates
   */
  async getTemplates(): Promise<UnifiedTemplate[]> {
    // Template functionality moved to core service
    console.log('📝 MasterTemplateService: Template functionality moved to core TemplateService');
    return [];
  }

  /**
   * Get a specific template by ID
   */
  async getTemplate(id: string): Promise<UnifiedTemplate | null> {
    // Template functionality moved to core service
    console.log(`📝 MasterTemplateService: Getting template ${id} - functionality moved to core TemplateService`);
    return null;
  }

  /**
   * Search templates by query
   */
  async searchTemplates(query: string): Promise<UnifiedTemplate[]> {
    console.log(`📝 MasterTemplateService: Searching templates for "${query}" - functionality moved to core TemplateService`);
    return [];
  }

  /**
   * Get templates by category
   */
  async getTemplatesByCategory(category: string): Promise<UnifiedTemplate[]> {
    console.log(`📝 MasterTemplateService: Getting templates for category "${category}" - functionality moved to core TemplateService`);
    return [];
  }

  /**
   * Get popular templates
   */
  async getPopularTemplates(limit: number = 10): Promise<UnifiedTemplate[]> {
    console.log(`📝 MasterTemplateService: Getting ${limit} popular templates - functionality moved to core TemplateService`);
    return [];
  }

  /**
   * Get recent templates
   */
  async getRecentTemplates(limit: number = 10): Promise<UnifiedTemplate[]> {
    console.log(`📝 MasterTemplateService: Getting ${limit} recent templates - functionality moved to core TemplateService`);
    return [];
  }

  /**
   * Save a template
   */
  async saveTemplate(template: Omit<UnifiedTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<UnifiedTemplate> {
    console.log(`📝 MasterTemplateService: Saving template "${template.name}" - functionality moved to core TemplateService`);
    
    // Return a mock template for compatibility
    return {
      ...template,
      id: `template_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Delete a template
   */
  async deleteTemplate(id: string): Promise<boolean> {
    console.log(`📝 MasterTemplateService: Deleting template ${id} - functionality moved to core TemplateService`);
    return true;
  }

  /**
   * Increment template usage count
   */
  async incrementUsageCount(id: string): Promise<void> {
    console.log(`📝 MasterTemplateService: Incrementing usage count for template ${id} - functionality moved to core TemplateService`);
  }

  /**
   * Get template categories
   */
  async getCategories(): Promise<string[]> {
    console.log('📝 MasterTemplateService: Getting template categories - functionality moved to core TemplateService');
    return ['business', 'lifestyle', 'education', 'entertainment'];
  }
}

// Export singleton instance
export const masterTemplateService = MasterTemplateService.getInstance();

// Export default for compatibility
export default masterTemplateService;