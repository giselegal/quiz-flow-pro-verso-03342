/**
 * StorageService – wrappers seguros para armazenamento no navegador
 * - JSON seguro (parse/stringify)
 * - Tratamento de quota excedida com fallback para sessionStorage
 * - Silencioso em produção; logs apenas em DEV
 */
export const StorageService = {
  safeGetString(key: string): string | null {
    try {
      const v = localStorage.getItem(key);
      if (v != null) return v;
      return sessionStorage.getItem(key);
    } catch (e) {
      if ((import.meta as any)?.env?.DEV)
        console.warn('[StorageService] getString falhou:', e);
      return null;
    }
  },

  safeGetJSON<T = any>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key) ?? sessionStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (e) {
      if ((import.meta as any)?.env?.DEV) console.warn('[StorageService] getJSON falhou:', e);
      return null;
    }
  },

  safeSetJSON(key: string, value: unknown): boolean {
    try {
      const raw = JSON.stringify(value);
      localStorage.setItem(key, raw);
      return true;
    } catch (e: any) {
      // Quota excedida ou storage indisponível → tentar sessionStorage
      try {
        const raw = JSON.stringify(value);
        sessionStorage.setItem(key, raw);
        return true;
      } catch (e2) {
        if ((import.meta as any)?.env?.DEV)
          console.warn('[StorageService] setJSON falhou (local e session):', e, e2);
        return false;
      }
    }
  },

  safeSetString(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      try {
        sessionStorage.setItem(key, value);
        return true;
      } catch (e2) {
        if ((import.meta as any)?.env?.DEV)
          console.warn('[StorageService] setString falhou:', e, e2);
        return false;
      }
    }
  },

  safeRemove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      try {
        sessionStorage.removeItem(key);
        return true;
      } catch (e2) {
        if ((import.meta as any)?.env?.DEV)
          console.warn('[StorageService] remove falhou:', e, e2);
        return false;
      }
    }
  },
};
