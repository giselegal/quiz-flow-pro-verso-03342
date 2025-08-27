import funnel21 from '@/templates/models/funnel-21-steps';

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
  } catch {}
}

export const templateLibraryService = {
  listBuiltins(): FunnelTemplate[] {
    return [funnel21 as FunnelTemplate];
  },
  listAll(): FunnelTemplate[] {
    return [...this.listBuiltins(), ...loadCustomTemplates()];
  },
  getById(id: string): FunnelTemplate | null {
    return this.listAll().find(t => t.id === id) || null;
  },
  saveCustom(template: FunnelTemplate) {
    const list = loadCustomTemplates();
    const idx = list.findIndex(t => t.id === template.id);
    if (idx >= 0) list[idx] = template;
    else list.push(template);
    saveCustomTemplates(list);
  },
};
