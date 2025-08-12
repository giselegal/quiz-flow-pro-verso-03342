// @ts-nocheck
import { safeLocalStorage } from '@/utils/safeLocalStorage';

// Utilitário para usar localStorage de forma segura no SSR
export const localStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn('LocalStorage access failed:', error);
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
      console.warn('LocalStorage write failed:', error);
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn('LocalStorage remove failed:', error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.clear();
    } catch (error) {
      console.warn('LocalStorage clear failed:', error);
    }
  },
};
