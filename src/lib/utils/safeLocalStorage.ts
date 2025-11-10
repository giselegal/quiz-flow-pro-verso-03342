import { appLogger } from '@/lib/utils/appLogger';
/**
 * Safe localStorage wrapper for SSR compatibility
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      appLogger.warn('localStorage.getItem failed:', { data: [error] });
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      appLogger.warn('localStorage.setItem failed:', { data: [error] });
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      appLogger.warn('localStorage.removeItem failed:', { data: [error] });
    }
  },
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      appLogger.warn('localStorage.clear failed:', { data: [error] });
    }
  },
};
