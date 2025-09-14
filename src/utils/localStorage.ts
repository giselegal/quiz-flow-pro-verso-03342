/**
 * TODO: TypeScript Migration - Deadline: Janeiro 2025
 * - [ ] Criar interface StorageWrapper com métodos tipados
 * - [ ] Adicionar tipos para valores serializáveis (string, object, etc)
 * - [ ] Implementar métodos getObject/setObject com JSON parse/stringify seguro
 * - [ ] Adicionar retry logic e fallback para quota exceeded
 * - [ ] Substituir por AdvancedStorageSystem quando disponível
 */

import { appLogger } from './logger';

// Tipos mínimos para migração
interface StorageWrapper {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

// Utilitário para usar localStorage de forma segura no SSR
export const localStorage: StorageWrapper = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      appLogger.warn('LocalStorage access failed', { key, error });
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      appLogger.warn('LocalStorage write failed', { key, error });
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      appLogger.warn('LocalStorage remove failed', { key, error });
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.clear();
    } catch (error) {
      appLogger.warn('LocalStorage clear failed', { error });
    }
  },
};
