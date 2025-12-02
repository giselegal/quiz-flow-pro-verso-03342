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
  getTemplate(id: string) {
    const all = getUnifiedTemplates();
    const t: any = all.find(t => (t as any).id === id);
    if (!t) return null;
    const preview = t.image || t.preview || '';
    const stepCount = typeof t.stepCount === 'number' ? t.stepCount : (Array.isArray(t.steps) ? t.steps.length : 21);
    return {
      id: t.id,
      name: t.name,
      category: t.category ?? 'geral',
      difficulty: t.difficulty ?? 'Médio',
      stepCount,
      description: t.description ?? '',
      features: t.features ?? [],
      editorUrl: t.editorUrl ?? '/editor',
      preview,
    } as any;
  },
};

export default TemplateService;