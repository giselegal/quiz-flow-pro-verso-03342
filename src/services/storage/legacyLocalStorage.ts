/**
 * 🗄️ LEGACY LOCAL STORAGE HELPER
 * 
 * @deprecated Este helper encapsula acessos diretos a localStorage/sessionStorage
 * que estão espalhados pelo código. Use StorageService canônico ou React Query.
 * 
 * 🎯 ROADMAP DE MIGRAÇÃO:
 * - Fase 1 (Atual): Encapsulamento com @deprecated e TODOs
 * - Fase 2: Migração progressiva para StorageService canônico
 * - Fase 3: Migração de dados de negócio para React Query
 * - Fase 4: Remoção completa deste helper
 * 
 * ⚠️ IMPORTANTE:
 * Este código serve apenas para transição. Não adicione novas funcionalidades aqui.
 * Para novos usos de storage:
 * 
 * 1. Para arquivos/blobs: Use StorageService.files ou StorageService.images
 *    ```typescript
 *    import { storageService } from '@/services/canonical/StorageService';
 *    const result = await storageService.files.upload({ file, path });
 *    ```
 * 
 * 2. Para cache local simples: Use CacheService
 *    ```typescript
 *    import { cacheService } from '@/services/canonical/CacheService';
 *    cacheService.set('key', value, { ttl: 5 * 60 * 1000 });
 *    ```
 * 
 * 3. Para dados de negócio (templates, funnels): Use React Query hooks
 *    ```typescript
 *    import { useTemplate } from '@/hooks/useTemplate';
 *    const { data } = useTemplate(id);
 *    ```
 * 
 * @example Migração típica
 * ```typescript
 * // ❌ ANTES (usando este helper deprecated)
 * import { legacyLocalStorage } from '@/services/storage/legacyLocalStorage';
 * const template = legacyLocalStorage.getItem('template-123');
 * 
 * // ✅ DEPOIS (usando React Query)
 * import { useTemplate } from '@/hooks/useTemplate';
 * const { data: template } = useTemplate('123');
 * ```
 * 
 * @version 1.0.0
 * @status DEPRECATED - USE CANONICAL SERVICES
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * Storage type
 */
export type StorageType = 'local' | 'session';

/**
 * Stored item with metadata
 */
interface StoredItem<T = any> {
  value: T;
  timestamp: number;
  expiresAt?: number;
}

// ============================================================================
// LEGACY LOCAL STORAGE HELPER
// ============================================================================

/**
 * @deprecated Use StorageService canônico ou React Query
 * 
 * TODO (FASE 2): Migrar para StorageService.browser
 * TODO (FASE 3): Migrar dados de negócio para React Query hooks
 */
export class LegacyLocalStorageHelper {
  private readonly prefix: string = 'qfp_legacy_';

  constructor(prefix?: string) {
    if (prefix) {
      this.prefix = prefix;
    }
  }

  /**
   * @deprecated Use cacheService.set() ou React Query mutation
   * 
   * Armazenar item no storage
   * 
   * TODO: Migrar para:
   * - cacheService.set(key, value, { ttl }) para cache simples
   * - useUpdateTemplate/useUpdateFunnel para dados de negócio
   */
  setItem<T>(
    key: string,
    value: T,
    options: {
      type?: StorageType;
      ttl?: number; // milliseconds
    } = {}
  ): boolean {
    try {
      const storage = this.getStorage(options.type);
      
      const item: StoredItem<T> = {
        value,
        timestamp: Date.now(),
        expiresAt: options.ttl ? Date.now() + options.ttl : undefined,
      };

      const prefixedKey = this.prefix + key;
      storage.setItem(prefixedKey, JSON.stringify(item));

      return true;
    } catch (error) {
      console.error('[LegacyLocalStorage] setItem failed:', error);
      return false;
    }
  }

  /**
   * @deprecated Use cacheService.get() ou React Query hook
   * 
   * Recuperar item do storage
   * 
   * TODO: Migrar para:
   * - cacheService.get(key) para cache simples
   * - useTemplate(id)/useFunnel(id) para dados de negócio
   */
  getItem<T>(key: string, type: StorageType = 'local'): T | null {
    try {
      const storage = this.getStorage(type);
      const prefixedKey = this.prefix + key;
      const stored = storage.getItem(prefixedKey);

      if (!stored) {
        return null;
      }

      const item: StoredItem<T> = JSON.parse(stored);

      // Check expiration
      if (item.expiresAt && item.expiresAt < Date.now()) {
        this.removeItem(key, type);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('[LegacyLocalStorage] getItem failed:', error);
      return null;
    }
  }

  /**
   * @deprecated Use cacheService.delete() ou React Query invalidation
   * 
   * Remover item do storage
   * 
   * TODO: Migrar para:
   * - cacheService.delete(key) para cache simples
   * - queryClient.invalidateQueries() para React Query
   */
  removeItem(key: string, type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type);
      const prefixedKey = this.prefix + key;
      storage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error('[LegacyLocalStorage] removeItem failed:', error);
      return false;
    }
  }

  /**
   * @deprecated Use cacheService.clearStore()
   * 
   * Limpar todos os itens com o prefixo
   * 
   * TODO: Migrar para cacheService.clearStore('generic')
   */
  clear(type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type);
      const keysToRemove: string[] = [];

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => storage.removeItem(key));
      return true;
    } catch (error) {
      console.error('[LegacyLocalStorage] clear failed:', error);
      return false;
    }
  }

  /**
   * @deprecated Não adicione novos usos
   * 
   * Verificar se item existe
   */
  hasItem(key: string, type: StorageType = 'local'): boolean {
    return this.getItem(key, type) !== null;
  }

  /**
   * @deprecated Não adicione novos usos
   * 
   * Obter todas as chaves com o prefixo
   */
  getKeys(type: StorageType = 'local'): string[] {
    try {
      const storage = this.getStorage(type);
      const keys: string[] = [];

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          // Remove prefix
          keys.push(key.substring(this.prefix.length));
        }
      }

      return keys;
    } catch (error) {
      console.error('[LegacyLocalStorage] getKeys failed:', error);
      return [];
    }
  }

  /**
   * Get storage instance
   */
  private getStorage(type: StorageType = 'local'): Storage {
    if (typeof window === 'undefined') {
      throw new Error('Storage not available in non-browser environment');
    }

    return type === 'session' ? sessionStorage : localStorage;
  }

  /**
   * Check if storage is available
   */
  isAvailable(type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type);
      const testKey = '__storage_test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * @deprecated Use StorageService canônico ou React Query
 * 
 * Instância singleton do helper legado
 * 
 * ⚠️ ATENÇÃO: Este é código de transição. Não adicione novos usos!
 * 
 * Migração recomendada:
 * 1. Para cache: import { cacheService } from '@/services/canonical/CacheService'
 * 2. Para storage: import { storageService } from '@/services/canonical/StorageService'
 * 3. Para dados: import { useTemplate, useFunnel } from '@/hooks/...'
 */
export const legacyLocalStorage = new LegacyLocalStorageHelper();

// ============================================================================
// MIGRATION HELPERS
// ============================================================================

/**
 * Helper para identificar usos que precisam migração
 * 
 * TODO (FASE 2): Executar script de análise para encontrar todos os usos de:
 * - localStorage.getItem / setItem / removeItem direto
 * - sessionStorage.getItem / setItem / removeItem direto
 * - Zustand stores que armazenam dados de negócio
 * 
 * E migrar para os padrões canônicos apropriados.
 */
export function logDeprecationWarning(location: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[DEPRECATED] LegacyLocalStorage usado em: ${location}\n` +
      `Migre para:\n` +
      `- CacheService para cache simples\n` +
      `- StorageService para arquivos/storage\n` +
      `- React Query hooks para dados de negócio`
    );
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default legacyLocalStorage;
