export type FunnelItem = {
  id: string;
  name: string;
  status: 'draft' | 'published';
  url?: string;
  updatedAt?: string;
};

export type FunnelSettings = {
  name: string;
  url: string;
  seo: { title: string; description: string };
  pixel: string;
  token: string;
  utm: { source?: string; medium?: string; campaign?: string; term?: string; content?: string };
  webhooks: { platform: string; url: string }[];
  custom: {
    collectUserName: boolean;
    variables: Array<{
      key: string;
      label: string;
      description?: string;
      scoringWeight?: number;
      imageUrl?: string;
    }>;
  };
};

const LIST_KEY = 'qqcv_funnels';
const settingsKey = (id: string) => `qqcv_funnel_settings_${id}`;

export const funnelLocalStore = {
  list(): FunnelItem[] {
    try {
      const raw = localStorage.getItem(LIST_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  },
  saveList(list: FunnelItem[]) {
    try {
      localStorage.setItem(LIST_KEY, JSON.stringify(list));
    } catch {}
  },
  get(id: string): FunnelItem | null {
    return this.list().find(f => f.id === id) || null;
  },
  upsert(item: FunnelItem) {
    const list = this.list();
    const idx = list.findIndex(f => f.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    this.saveList(list);
  },
  getSettings(id: string): FunnelSettings {
    try {
      const raw = localStorage.getItem(settingsKey(id));
      if (raw) return JSON.parse(raw);
    } catch {}
    return this.defaultSettings();
  },
  saveSettings(id: string, s: FunnelSettings) {
    try {
      localStorage.setItem(settingsKey(id), JSON.stringify(s));
    } catch {}
  },
  defaultSettings(): FunnelSettings {
    return {
      name: 'Funil Quiz 21 Etapas',
      url: '',
      seo: { title: 'Quiz de Estilo Pessoal', description: 'Descubra seu estilo' },
      pixel: '',
      token: '',
      utm: {},
      webhooks: [],
      custom: {
        collectUserName: true,
        variables: [
          { key: 'romantico', label: 'Romântico' },
          { key: 'classico', label: 'Clássico' },
          { key: 'natural', label: 'Natural' },
          { key: 'sexy', label: 'Sexy' },
          { key: 'dramatico', label: 'Dramático' },
          { key: 'esportivo', label: 'Esportivo' },
          { key: 'elegante', label: 'Elegante' },
        ],
      },
    };
  },
};
