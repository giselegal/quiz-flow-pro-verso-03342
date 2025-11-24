/**
 * ⚠️ DEPRECATED: UnifiedStorageService
 * 
 * Este serviço foi consolidado em `StorageService` canônico.
 * 
 * @deprecated Use `storageService` from '@/services/canonical/StorageService' instead
 * 
 * Migration guide:
 * - UnifiedStorageService.get(key) → storageService.browser.get<T>(key)
 * - UnifiedStorageService.set(key, value) → storageService.browser.set(key, value)
 * - UnifiedStorageService.list() → Use storageService.files.list() for file operations
 * - UnifiedStorageService.upsert() → Use storageService.files.upload() for file operations
 */

import { storageService } from '@/services/canonical/StorageService';

// Compatibility stub (redirects to canonical)
export const UnifiedStorageService = {
  get: <T = any>(key: string): T | null => {
    const result = storageService.browser.get<T>(key);
    return result.success ? result.data : null;
  },
  
  set: (key: string, value: any): void => {
    storageService.browser.set(key, value);
  },
  
  list: (): any[] => {
    // Legacy method - not supported in canonical
    console.warn('[UnifiedStorageService.list] Deprecated - use storageService.files.list() instead');
    return [];
  },
  
  upsert: async (item: any): Promise<{ success: boolean; data: any }> => {
    // Legacy method - not supported in canonical
    console.warn('[UnifiedStorageService.upsert] Deprecated - use storageService.files.upload() instead');
    return { success: true, data: item };
  },
};

export default UnifiedStorageService;
