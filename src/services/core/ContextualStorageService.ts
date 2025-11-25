import { FunnelContext } from '@/core/contexts/FunnelContext';
import { safeGetItem, safeSetItem, safeRemoveItem } from '@/lib/utils/contextualStorage';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Minimal ContextualStorageService wrapper backed by localStorage
 * Provides the small API surface expected by services in this repo.
 */
export class ContextualStorageService {
  constructor(private context: FunnelContext = FunnelContext.EDITOR) {}

  setJSON(key: string, value: any): boolean {
    try {
      safeSetItem(key, JSON.stringify(value), this.context);
      return true;
    } catch (e) {
      appLogger.warn('[ContextualStorage] setJSON failed', { data: [e] });
      return false;
    }
  }

  getJSON<T = any>(key: string): T | null {
    try {
      const raw = safeGetItem(key, this.context);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (e) {
      appLogger.warn('[ContextualStorage] getJSON failed', { data: [e] });
      return null;
    }
  }

  remove(key: string): boolean {
    try {
      safeRemoveItem(key, this.context);
      return true;
    } catch (e) {
      return false;
    }
  }

  clearContext(): number {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return 0;
      const prefix = `${this.context}:`;
      const keys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(prefix)) keys.push(k);
      }
      keys.forEach(k => window.localStorage.removeItem(k));
      return keys.length;
    } catch (e) {
      return 0;
    }
  }

  getStats() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return { keysCount: 0 };
      const prefix = `${this.context}:`;
      let keysCount = 0;
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(prefix)) keysCount++;
      }
      return { keysCount };
    } catch (e) {
      return { keysCount: 0 };
    }
  }
}

export default ContextualStorageService;
