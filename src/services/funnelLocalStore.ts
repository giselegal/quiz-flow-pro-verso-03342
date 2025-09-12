import { nanoid } from 'nanoid';

export interface FunnelSettings {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  config: Record<string, any>;
  // Additional fields used by admin pages
  url?: string;
  seo?: {
    title?: string;
    description?: string;
  };
  pixel?: string;
  token?: string;
  utm?: Record<string, any>;
  webhooks?: Array<any>;
  custom?: {
    styles?: Record<string, any>;
    scripts?: Array<any>;
  };
  // Used in some tests
  status?: string;
}

// Complete funnel local storage service
export const funnelLocalStore = {
  get: () => {
    try {
      const data = localStorage.getItem('funnelLocalStore');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },
  
  set: (data: any) => {
    try {
      localStorage.setItem('funnelLocalStore', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  clear: () => {
    try {
      localStorage.removeItem('funnelLocalStore');
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },

  list: () => {
    const data = funnelLocalStore.get();
    return data.funnels || [];
  },

  upsert: (funnel: Partial<FunnelSettings>) => {
    const data = funnelLocalStore.get();
    if (!data.funnels) data.funnels = [];
    
    const existing = data.funnels.find((f: FunnelSettings) => f.id === funnel.id);
    if (existing) {
      Object.assign(existing, funnel, { updatedAt: new Date().toISOString() });
    } else {
      const newFunnel: FunnelSettings = {
        id: funnel.id || nanoid(),
        name: funnel.name || 'New Funnel',
        isActive: funnel.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        config: funnel.config || {},
        ...funnel
      };
      data.funnels.push(newFunnel);
    }
    
    funnelLocalStore.set(data);
    return data.funnels.find((f: FunnelSettings) => f.id === funnel.id);
  },

  saveList: (funnels: FunnelSettings[]) => {
    const data = funnelLocalStore.get();
    data.funnels = funnels;
    funnelLocalStore.set(data);
  },

  getSettings: () => {
    const data = funnelLocalStore.get();
    return data.settings || funnelLocalStore.defaultSettings;
  },

  saveSettings: (settings: any) => {
    const data = funnelLocalStore.get();
    data.settings = { ...data.settings, ...settings };
    funnelLocalStore.set(data);
  },

  defaultSettings: {
    theme: 'light',
    autoSave: true,
    debugMode: false,
    cacheEnabled: true
  }
};