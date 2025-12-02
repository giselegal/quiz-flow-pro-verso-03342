/**
 * Templates config (compat layer) - Fase 0
 * Fornece AVAILABLE_TEMPLATES e TemplateService como ponte para módulos que ainda
 * usam '@/config/templates'. Redireciona para unifiedTemplatesRegistry quando possível.
 */
import { getUnifiedTemplates } from './unifiedTemplatesRegistry';

export type TemplateConfig = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  preview?: string;
  blocks?: Array<{ type: string; properties: Record<string, any> }>;
};

export const AVAILABLE_TEMPLATES: TemplateConfig[] = getUnifiedTemplates().map(t => ({
  id: t.id,
  name: t.name,
  description: t.description,
  category: t.category,
  preview: (t as any).image || (t as any).preview || '',
}));

export const TemplateService = {
  async getTemplate(id: string) {
    const all = getUnifiedTemplates();
    const found = all.find(t => t.id === id);
    return {
      success: !!found,
      data: found || null,
    } as { success: boolean; data: any };
  },
};

export default TemplateService;