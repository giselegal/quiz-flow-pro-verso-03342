/**
 * 🔄 STORAGE SERVICE ADAPTER (LEGACY COMPATIBILITY)
 * 
 * Adapter para manter compatibilidade com código legado que usa StorageService.
 * Redireciona chamadas para o storageService canônico.
 * 
 * @deprecated Use storageService from '@/services/canonical/StorageService' instead
 * @version 1.0.0
 */

import { storageService } from '@/services/canonical/StorageService';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Legacy StorageService API
 * Fornece métodos simples de compatibilidade que redirecionam para o storageService canônico
 */
export class StorageService {
    /**
     * Get string from storage safely
     * @deprecated Use storageService.browser.get<string>(key) instead
     */
    static safeGetString(key: string): string | null {
        try {
            const result = storageService.browser.get<string>(key);
            return result.success && result.data !== null ? result.data : null;
        } catch (error) {
            appLogger.debug('[StorageService.safeGetString] Error:', { data: [error] });
            return null;
        }
    }

    /**
     * Get JSON from storage safely
     * @deprecated Use storageService.browser.get<T>(key) instead
     */
    static safeGetJSON<T = any>(key: string): T | null {
        try {
            const result = storageService.browser.get<T>(key);
            return result.success && result.data !== null ? result.data : null;
        } catch (error) {
            appLogger.debug('[StorageService.safeGetJSON] Error:', { data: [error] });
            return null;
        }
    }

    /**
     * Set string in storage safely
     * @deprecated Use storageService.browser.set(key, value) instead
     */
    static safeSetString(key: string, value: string): boolean {
        try {
            const result = storageService.browser.set(key, value);
            return result.success;
        } catch (error) {
            appLogger.debug('[StorageService.safeSetString] Error:', { data: [error] });
            return false;
        }
    }

    /**
     * Set JSON in storage safely
     * @deprecated Use storageService.browser.set(key, value) instead
     */
    static safeSetJSON<T = any>(key: string, value: T): boolean {
        try {
            const result = storageService.browser.set(key, value);
            return result.success;
        } catch (error) {
            appLogger.debug('[StorageService.safeSetJSON] Error:', { data: [error] });
            return false;
        }
    }

    /**
     * Remove item from storage safely
     * @deprecated Use storageService.browser.remove(key) instead
     */
    static safeRemove(key: string): boolean {
        try {
            const result = storageService.browser.remove(key);
            return result.success;
        } catch (error) {
            appLogger.debug('[StorageService.safeRemove] Error:', { data: [error] });
            return false;
        }
    }    /**
     * Clear all storage
     * @deprecated Use storageService.browser.clear() instead
     */
    static safeClear(): boolean {
        try {
            const result = storageService.browser.clear();
            return result.success;
        } catch (error) {
            appLogger.debug('[StorageService.safeClear] Error:', { data: [error] });
            return false;
        }
    }

    /**
     * Check if key exists in storage
     * @deprecated Use storageService.browser.get(key) and check result instead
     */
    static hasKey(key: string): boolean {
        try {
            const result = storageService.browser.get(key);
            return result.success && result.data !== null;
        } catch {
            return false;
        }
    }
}

// Default export for compatibility
export default StorageService;
