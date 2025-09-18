/**
 * 🗄️ STORAGE SERVICE - STUB IMPLEMENTATION
 * 
 * Basic storage service to maintain compatibility
 */

export interface StorageServiceInterface {
  setItem(key: string, value: any): void;
  getItem<T>(key: string): T | null;
  removeItem(key: string): void;
  clear(): void;
}

export class StorageService implements StorageServiceInterface {
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to store item:', key, error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to retrieve item:', key, error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove item:', key, error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }

  // Static methods for compatibility
  static safeGetString(key: string, defaultValue: string = ''): string {
    try {
      const item = localStorage.getItem(key);
      return item || defaultValue;
    } catch (error) {
      console.warn('Failed to safely get string:', key, error);
      return defaultValue;
    }
  }

  static safeGetJSON<T>(key: string, defaultValue?: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : (defaultValue as T);
    } catch (error) {
      console.warn('Failed to safely get JSON:', key, error);
      return defaultValue as T;
    }
  }

  static safeSetString(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to safely set string:', key, error);
    }
  }

  static safeSetJSON(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to safely set JSON:', key, error);
    }
  }
}

export const storageService = new StorageService();
export default StorageService;