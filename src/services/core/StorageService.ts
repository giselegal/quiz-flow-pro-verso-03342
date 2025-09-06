/**
 * StorageService – wrappers seguros para armazenamento no navegador
 * - JSON seguro (parse/stringify)
 * - Tratamento de quota excedida com fallback para sessionStorage
 * - Silencioso em produção; logs apenas em DEV
 */
export const StorageService = {
  // Fallback em memória para ambientes sem Storage (ex.: testes Node)
  _mem: new Map<string, string>(),
  _hasLocal(): boolean {
    try { return typeof localStorage !== 'undefined'; } catch { return false; }
  },
  _hasSession(): boolean {
    try { return typeof sessionStorage !== 'undefined'; } catch { return false; }
  },
  safeGetString(key: string): string | null {
    try {
      if (this._hasLocal()) {
        const v = localStorage.getItem(key);
        if (v != null) return v;
      }
      if (this._hasSession()) {
        const v = sessionStorage.getItem(key);
        if (v != null) return v;
      }
      return this._mem.get(key) ?? null;
    } catch (e) {
      if ((import.meta as any)?.env?.DEV)
        console.warn('[StorageService] getString falhou:', e);
      return this._mem.get(key) ?? null;
    }
  },

  safeGetJSON<T = any>(key: string): T | null {
    try {
      const raw = (this._hasLocal() ? localStorage.getItem(key) : null)
        ?? (this._hasSession() ? sessionStorage.getItem(key) : null)
        ?? this._mem.get(key) ?? null;
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (e) {
      if ((import.meta as any)?.env?.DEV) console.warn('[StorageService] getJSON falhou:', e);
      const raw = this._mem.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    }
  },

  safeSetJSON(key: string, value: unknown): boolean {
    try {
      const raw = JSON.stringify(value);
      if (this._hasLocal()) {
        localStorage.setItem(key, raw);
        return true;
      }
      // Sem localStorage → salvar em memória e tentar sessionStorage em seguida
      this._mem.set(key, raw);
      if (this._hasSession()) {
        sessionStorage.setItem(key, raw);
      }
      return true;
    } catch (e: any) {
      // Quota excedida ou storage indisponível → tentar sessionStorage
      try {
        const raw = JSON.stringify(value);
        if (this._hasSession()) {
          sessionStorage.setItem(key, raw);
          return true;
        }
        this._mem.set(key, raw);
        return true;
      } catch (e2) {
        if ((import.meta as any)?.env?.DEV)
          console.warn('[StorageService] setJSON falhou (local e session):', e, e2);
        this._mem.set(key, JSON.stringify(value));
        return true;
      }
    }
  },

  safeSetString(key: string, value: string): boolean {
    try {
      if (this._hasLocal()) {
        localStorage.setItem(key, value);
        return true;
      }
      this._mem.set(key, value);
      if (this._hasSession()) {
        sessionStorage.setItem(key, value);
      }
      return true;
    } catch (e) {
      try {
        if (this._hasSession()) {
          sessionStorage.setItem(key, value);
          return true;
        }
        this._mem.set(key, value);
        return true;
      } catch (e2) {
        if ((import.meta as any)?.env?.DEV)
          console.warn('[StorageService] setString falhou:', e, e2);
        this._mem.set(key, value);
        return true;
      }
    }
  },

  safeRemove(key: string): boolean {
    try {
      if (this._hasLocal()) {
        localStorage.removeItem(key);
      }
      this._mem.delete(key);
      return true;
    } catch (e) {
      try {
        if (this._hasSession()) {
          sessionStorage.removeItem(key);
        }
        this._mem.delete(key);
        return true;
      } catch (e2) {
        if ((import.meta as any)?.env?.DEV)
          console.warn('[StorageService] remove falhou:', e, e2);
        this._mem.delete(key);
        return true;
      }
    }
  },
};
