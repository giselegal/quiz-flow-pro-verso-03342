/**
 * 🔄 FUNNEL LOCAL STORE - COMPATIBILITY STUB
 * 
 * ⚠️ DEPRECATED: Este arquivo é um stub de compatibilidade.
 * Use serviços canônicos diretamente:
 * - @/services/canonical/DataService (para dados de funnel)
 * - @/services/core/StorageService (para storage básico)
 * 
 * Este stub mantém compatibilidade temporária durante migração.
 */

import { StorageService } from '@/services/core/StorageService';

const FUNNELS_KEY = 'app:funnels:all';

// Stub básico para compatibilidade - operações simples via StorageService
export const funnelLocalStore = {
  list: () => {
    const data = StorageService.safeGetJSON<any[]>(FUNNELS_KEY);
    return data || [];
  },
  
  get: (id: string) => {
    const funnels = StorageService.safeGetJSON<any[]>(FUNNELS_KEY) || [];
    return funnels.find((f: any) => f.id === id) || null;
  },
  
  save: (id: string, data: any) => {
    const funnels = StorageService.safeGetJSON<any[]>(FUNNELS_KEY) || [];
    const index = funnels.findIndex((f: any) => f.id === id);
    const funnelData = { ...data, id };
    
    if (index >= 0) {
      funnels[index] = funnelData;
    } else {
      funnels.push(funnelData);
    }
    
    StorageService.safeSetJSON(FUNNELS_KEY, funnels);
    return funnelData;
  },
  
  delete: (id: string) => {
    const funnels = StorageService.safeGetJSON<any[]>(FUNNELS_KEY) || [];
    const filtered = funnels.filter((f: any) => f.id !== id);
    StorageService.safeSetJSON(FUNNELS_KEY, filtered);
    return true;
  },
  
  clear: () => {
    StorageService.safeRemove(FUNNELS_KEY);
    return true;
  }
};

// Compatibilidade: UnifiedStorageService alias
export { StorageService as UnifiedStorageService } from '@/services/core/StorageService';

// Re-export para evitar quebra de código existente
export { funnelLocalStore as migratedFunnelLocalStore };

// Types básicos para compatibilidade
export interface FunnelSettings {
  id: string;
  name: string;
  status?: 'draft' | 'published';
  [key: string]: any;
}

