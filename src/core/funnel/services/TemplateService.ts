/**
 * Template Service Stub - Legacy compatibility
 */
import type { FunnelTemplate } from '../types';

export class TemplateService {
    async getTemplates(category?: string): Promise<FunnelTemplate[]> { 
        return []; 
    }
    async getTemplate(templateId: string): Promise<FunnelTemplate | null> { 
        return null; 
    }
}

export const templateService = new TemplateService();
