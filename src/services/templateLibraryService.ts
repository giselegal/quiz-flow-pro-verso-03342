import funnel21 from '@/templates/models/funnel-21-steps';
import optimized21 from '@/templates/models/optimized-funnel-21-steps';

export type FunnelTemplate = typeof funnel21;

const LOCAL_KEY = 'qqcv_funnel_templates';

function loadCustomTemplates(): FunnelTemplate[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveCustomTemplates(list: FunnelTemplate[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch { }
}

export const templateLibraryService = {
  listBuiltins(): FunnelTemplate[] {
    return [funnel21 as FunnelTemplate, optimized21 as unknown as FunnelTemplate];
  },
  listAll(): FunnelTemplate[] {
    return [...this.listBuiltins(), ...loadCustomTemplates()];
  },
  getById(id: string): FunnelTemplate | null {
    // 🔧 CORREÇÃO CRÍTICA: Aliases expandidos para compatibilidade total
    const aliases: Record<string, string> = {
      // Aliases originais
      'default-quiz-funnel-21-steps': (funnel21 as any).id,
      'style-quiz-21-steps': (funnel21 as any).id,
      'funil-21-etapas': (funnel21 as any).id,
      'optimized-21-steps-funnel': (optimized21 as any).id,
      'optimized-21-steps': (optimized21 as any).id,
      'quiz-21-otimizado': (optimized21 as any).id,
      
      // 🎯 NOVOS ALIASES CRÍTICOS: Para resolver problemas de loading
      'quiz21StepsComplete': (funnel21 as any).id,
      'quiz-estilo-completo': (funnel21 as any).id,
      'quiz-style-21-steps': (funnel21 as any).id,
      'QUIZ_STYLE_21_STEPS_TEMPLATE': (funnel21 as any).id,
      'template-quiz21StepsComplete': (funnel21 as any).id,
      'template-optimized-21-steps-funnel': (optimized21 as any).id,
    };
    const resolvedId = aliases[id] || id;
    const found = this.listAll().find(t => t.id === resolvedId);
    
    if (!found) {
      console.warn('⚠️ Template não encontrado:', { originalId: id, resolvedId, availableIds: this.listAll().map(t => t.id) });
    }
    
    return found || null;
  },
  saveCustom(template: FunnelTemplate) {
    const list = loadCustomTemplates();
    const idx = list.findIndex(t => t.id === template.id);
    if (idx >= 0) list[idx] = template;
    else list.push(template);
    saveCustomTemplates(list);
  },
};
