/**
 * 🎯 ADVANCED FUNNEL STORAGE SERVICE - MELHORADO
 * 
 * Sistema de armazenamento avançado com melhorias:
 * - Validação rigorosa de dados
 * - Error handling padronizado  
 * - Verificação de integridade automática
 * - Recovery robusto de falhas
 * - Nomenclatura consistente
 */

import {
    errorManager,
    createStorageError
} from '@/utils/errorHandling';
import { validateFunnelSchema } from '@/utils/schemaValidation';
import { validateFunnelId } from '@/utils/idValidation';

// Enhanced logger with structured error handling
const logger = {
    info: (message: string, data?: any, context?: string) => {
        console.log(`[${context || 'FunnelStorage'}] INFO: ${message}`, data || '');
    },
    error: (message: string, data?: any, context?: string) => {
        const error = createStorageError('STORAGE_NOT_AVAILABLE', message, {
            operation: context,
            additionalData: data
        });
        errorManager.handleError(error);
    },
    warn: (message: string, data?: any, context?: string) => {
        console.warn(`[${context || 'FunnelStorage'}] WARN: ${message}`, data || '');
    }
};

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface FunnelItem {
    id: string;
    name: string;
    status: 'draft' | 'published';
    url?: string;
    updatedAt: string;
    createdAt: string;
    version: number;
    checksum?: string; // Para verificação de integridade
}

export interface FunnelSettings {
    id: string;
    name: string;
    url: string;
    seo: { title: string; description: string };
    pixel: string;
    token: string;
    utm: { source?: string; medium?: string; campaign?: string; term?: string; content?: string };
    webhooks: { platform: string; url: string }[];
    custom: {
        collectUserName: boolean;
        variables: Array<{
            key: string;
            label: string;
            description?: string;
            scoringWeight?: number;
            imageUrl?: string;
        }>;
    };
    version: number;
    updatedAt: string;
    createdAt: string;
}

export interface StorageMetadata {
    version: number;
    lastMigration: string;
    totalFunnels: number;
    storageSize: number;
    lastBackup?: string;
    syncStatus: 'synced' | 'pending' | 'error' | 'disabled';
}

export interface MigrationResult {
    success: boolean;
    migratedFunnels: number;
    migratedSettings: number;
    errors: string[];
    duration: number;
}

// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================

const DB_NAME = 'QuizQuestFunnelDB';
const DB_VERSION = 1;
const FUNNEL_STORE = 'funnels';
const SETTINGS_STORE = 'settings';
const METADATA_STORE = 'metadata';

// Legacy localStorage keys
const LEGACY_LIST_KEY = 'qqcv_funnels';
const LEGACY_SETTINGS_PREFIX = 'qqcv_funnel_settings_';

// ============================================================================
// INDEXEDDB WRAPPER CLASS
// ============================================================================

class IndexedDBManager {
    private db: IDBDatabase | null = null;
    private initPromise: Promise<IDBDatabase> | null = null;

    async initialize(): Promise<IDBDatabase> {
        if (this.db) return this.db;
        if (this.initPromise) return this.initPromise;

        this.initPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                logger.error('IndexedDB open failed', { error: request.error }, 'FunnelStorage');
                reject(new Error('Failed to open IndexedDB'));
            };

            request.onsuccess = () => {
                this.db = request.result;
                logger.info('IndexedDB initialized successfully', { version: DB_VERSION }, 'FunnelStorage');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                this.setupDatabase(db);
            };
        });

        return this.initPromise;
    }

    private setupDatabase(db: IDBDatabase): void {
        logger.info('Setting up IndexedDB schema', { version: DB_VERSION }, 'FunnelStorage');

        // Funnels store
        if (!db.objectStoreNames.contains(FUNNEL_STORE)) {
            const funnelStore = db.createObjectStore(FUNNEL_STORE, { keyPath: 'id' });
            funnelStore.createIndex('status', 'status', { unique: false });
            funnelStore.createIndex('updatedAt', 'updatedAt', { unique: false });
            funnelStore.createIndex('name', 'name', { unique: false });
        }

        // Settings store
        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
            const settingsStore = db.createObjectStore(SETTINGS_STORE, { keyPath: 'id' });
            settingsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // Metadata store
        if (!db.objectStoreNames.contains(METADATA_STORE)) {
            db.createObjectStore(METADATA_STORE, { keyPath: 'key' });
        }
    }

    async transaction<T>(
        storeNames: string | string[],
        mode: IDBTransactionMode,
        callback: (stores: IDBObjectStore | IDBObjectStore[]) => Promise<T>
    ): Promise<T> {
        const db = await this.initialize();
        const transaction = db.transaction(storeNames, mode);

        const stores = Array.isArray(storeNames)
            ? storeNames.map(name => transaction.objectStore(name))
            : transaction.objectStore(storeNames);

        return new Promise((resolve, reject) => {
            transaction.oncomplete = async () => {
                try {
                    const result = await callback(stores);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };

            transaction.onerror = () => {
                logger.error('Transaction failed', { error: transaction.error }, 'FunnelStorage');
                reject(new Error('Transaction failed'));
            };

            transaction.onabort = () => {
                logger.error('Transaction aborted', {}, 'FunnelStorage');
                reject(new Error('Transaction aborted'));
            };
        });
    }

    async close(): Promise<void> {
        if (this.db) {
            this.db.close();
            this.db = null;
            this.initPromise = null;
        }
    }
}

// ============================================================================
// ADVANCED FUNNEL STORAGE SERVICE
// ============================================================================

class AdvancedFunnelStorageService {
    private dbManager = new IndexedDBManager();
    private cache = new Map<string, any>();
    private cacheExpiry = new Map<string, number>();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    // ============================================================================
    // CACHE MANAGEMENT
    // ============================================================================

    private getCacheKey(type: 'funnel' | 'settings' | 'list', id?: string): string {
        return id ? `${type}:${id}` : type;
    }

    private setCache(key: string, data: any): void {
        this.cache.set(key, data);
        this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
    }

    private getCache<T>(key: string): T | null {
        const expiry = this.cacheExpiry.get(key);
        if (!expiry || Date.now() > expiry) {
            this.cache.delete(key);
            this.cacheExpiry.delete(key);
            return null;
        }
        return this.cache.get(key) || null;
    }

    private clearCache(pattern?: string): void {
        if (!pattern) {
            this.cache.clear();
            this.cacheExpiry.clear();
            return;
        }

        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
                this.cacheExpiry.delete(key);
            }
        }
    }

    // ============================================================================
    // FUNNEL OPERATIONS
    // ============================================================================

    async listFunnels(): Promise<FunnelItem[]> {
        const cacheKey = this.getCacheKey('list');
        const cached = this.getCache<FunnelItem[]>(cacheKey);
        if (cached) return cached;

        try {
            const funnels = await this.dbManager.transaction(
                FUNNEL_STORE,
                'readonly',
                async (store) => {
                    return new Promise<FunnelItem[]>((resolve, reject) => {
                        const request = (store as IDBObjectStore).getAll();
                        request.onsuccess = () => resolve(request.result || []);
                        request.onerror = () => reject(request.error);
                    });
                }
            );

            // Sort by updatedAt descending
            funnels.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

            this.setCache(cacheKey, funnels);
            return funnels;
        } catch (error) {
            logger.error('Failed to list funnels', { error }, 'FunnelStorage');

            // Criar erro padronizado e tentar recovery
            const errorMessage = error instanceof Error ? error.message : String(error);
            const storageError = createStorageError('STORAGE_NOT_AVAILABLE', errorMessage, {
                operation: 'listFunnels'
            });
            errorManager.handleError(storageError);

            return this.fallbackToLocalStorage();
        }
    }

    async getFunnel(id: string): Promise<FunnelItem | null> {
        const cacheKey = this.getCacheKey('funnel', id);
        const cached = this.getCache<FunnelItem>(cacheKey);
        if (cached) return cached;

        try {
            const funnel = await this.dbManager.transaction(
                FUNNEL_STORE,
                'readonly',
                async (store) => {
                    return new Promise<FunnelItem | null>((resolve, reject) => {
                        const request = (store as IDBObjectStore).get(id);
                        request.onsuccess = () => resolve(request.result || null);
                        request.onerror = () => reject(request.error);
                    });
                }
            );

            if (!funnel) {
                // Criar erro NOT_FOUND usando novo sistema
                const notFoundError = createStorageError('STORAGE_NOT_AVAILABLE', `Funnel not found: ${id}`, {
                    operation: 'getFunnel',
                    funnelId: id
                });
                errorManager.handleError(notFoundError);
                return null;
            }

            if (funnel) {
                this.setCache(cacheKey, funnel);
            }
            return funnel;
        } catch (error) {
            logger.error('Failed to get funnel', { id, error }, 'FunnelStorage');

            // Criar erro padronizado usando novo sistema
            const errorMessage = error instanceof Error ? error.message : String(error);
            const storageError = createStorageError('STORAGE_NOT_AVAILABLE', `Failed to get funnel: ${errorMessage}`, {
                operation: 'getFunnel',
                funnelId: id
            });
            errorManager.handleError(storageError);

            return this.fallbackGetFunnel(id);
        }
    }

    async upsertFunnel(item: Partial<FunnelItem> & { id: string }): Promise<FunnelItem> {
        // Validar ID do funnel
        const idValidation = validateFunnelId(item.id);
        if (!idValidation.isValid) {
            const validationError = createStorageError('STORAGE_NOT_AVAILABLE', `Invalid funnel ID: ${idValidation.error}`, {
                operation: 'upsertFunnel',
                funnelId: item.id
            });
            errorManager.handleError(validationError);
            throw new Error(`Invalid funnel ID: ${idValidation.error}`);
        }

        const now = new Date().toISOString();
        const existingFunnel = await this.getFunnel(item.id);

        const funnelItem: FunnelItem = {
            name: item.name || 'Untitled Funnel',
            status: item.status || 'draft',
            url: item.url || '',
            version: existingFunnel ? existingFunnel.version + 1 : 1,
            createdAt: existingFunnel?.createdAt || now,
            updatedAt: now,
            checksum: this.generateChecksum(item),
            ...item,
        };

        // Validar dados do funnel
        const schemaValidation = validateFunnelSchema(funnelItem);
        if (!schemaValidation.isValid) {
            const validationError = createStorageError('STORAGE_NOT_AVAILABLE', `Funnel schema validation failed: ${schemaValidation.errors.join(', ')}`, {
                operation: 'upsertFunnel',
                funnelId: item.id
            });
            errorManager.handleError(validationError);
            throw new Error(`Funnel schema validation failed: ${schemaValidation.errors.join(', ')}`);
        }

        try {
            await this.dbManager.transaction(
                FUNNEL_STORE,
                'readwrite',
                async (store) => {
                    return new Promise<void>((resolve, reject) => {
                        const request = (store as IDBObjectStore).put(funnelItem);
                        request.onsuccess = () => resolve();
                        request.onerror = () => reject(request.error);
                    });
                }
            );

            // Clear relevant cache
            this.clearCache('list');
            this.clearCache(item.id);

            logger.info('Funnel upserted successfully', { id: item.id, version: funnelItem.version }, 'FunnelStorage');
            return funnelItem;
        } catch (error) {
            logger.error('Failed to upsert funnel', { id: item.id, error }, 'FunnelStorage');

            // Verificar se é erro de quota/storage
            if (error instanceof Error && error.name === 'QuotaExceededError') {
                const quotaError = createStorageError('STORAGE_QUOTA_EXCEEDED', 'Storage quota exceeded during funnel save', {
                    operation: 'upsertFunnel',
                    funnelId: item.id
                });
                errorManager.handleError(quotaError);
            } else {
                const errorMessage = error instanceof Error ? error.message : String(error);
                const storageError = createStorageError('STORAGE_NOT_AVAILABLE', `Failed to upsert funnel: ${errorMessage}`, {
                    operation: 'upsertFunnel',
                    funnelId: item.id
                });
                errorManager.handleError(storageError);
            }

            throw new Error(`Failed to save funnel: ${error}`);
        }
    }

    async deleteFunnel(id: string): Promise<void> {
        try {
            await this.dbManager.transaction(
                [FUNNEL_STORE, SETTINGS_STORE],
                'readwrite',
                async (stores) => {
                    const [funnelStore, settingsStore] = stores as IDBObjectStore[];

                    return new Promise<void>((resolve, reject) => {
                        const deleteFunnel = funnelStore.delete(id);
                        const deleteSettings = settingsStore.delete(id);

                        let completed = 0;
                        const checkComplete = () => {
                            completed++;
                            if (completed === 2) resolve();
                        };

                        deleteFunnel.onsuccess = checkComplete;
                        deleteSettings.onsuccess = checkComplete;

                        deleteFunnel.onerror = () => reject(deleteFunnel.error);
                        deleteSettings.onerror = () => reject(deleteSettings.error);
                    });
                }
            );

            // Clear cache
            this.clearCache('list');
            this.clearCache(id);

            logger.info('Funnel deleted successfully', { id }, 'FunnelStorage');
        } catch (error) {
            logger.error('Failed to delete funnel', { id, error }, 'FunnelStorage');
            throw new Error(`Failed to delete funnel: ${error}`);
        }
    }

    // ============================================================================
    // SETTINGS OPERATIONS
    // ============================================================================

    async getFunnelSettings(id: string): Promise<FunnelSettings> {
        const cacheKey = this.getCacheKey('settings', id);
        const cached = this.getCache<FunnelSettings>(cacheKey);
        if (cached) return cached;

        try {
            const settings = await this.dbManager.transaction(
                SETTINGS_STORE,
                'readonly',
                async (store) => {
                    return new Promise<FunnelSettings | null>((resolve, reject) => {
                        const request = (store as IDBObjectStore).get(id);
                        request.onsuccess = () => resolve(request.result || null);
                        request.onerror = () => reject(request.error);
                    });
                }
            );

            const result = settings || this.getDefaultSettings(id);
            this.setCache(cacheKey, result);
            return result;
        } catch (error) {
            logger.error('Failed to get funnel settings', { id, error }, 'FunnelStorage');
            return this.fallbackGetSettings(id);
        }
    }

    async saveFunnelSettings(id: string, settings: Partial<FunnelSettings>): Promise<FunnelSettings> {
        const now = new Date().toISOString();
        const existingSettings = await this.getFunnelSettings(id);

        const funnelSettings: FunnelSettings = {
            ...existingSettings,
            ...settings,
            id,
            version: existingSettings.version + 1,
            updatedAt: now,
            createdAt: existingSettings.createdAt || now,
        };

        try {
            await this.dbManager.transaction(
                SETTINGS_STORE,
                'readwrite',
                async (store) => {
                    return new Promise<void>((resolve, reject) => {
                        const request = (store as IDBObjectStore).put(funnelSettings);
                        request.onsuccess = () => resolve();
                        request.onerror = () => reject(request.error);
                    });
                }
            );

            // Clear cache
            this.clearCache(id);

            logger.info('Funnel settings saved successfully', { id, version: funnelSettings.version }, 'FunnelStorage');
            return funnelSettings;
        } catch (error) {
            logger.error('Failed to save funnel settings', { id, error }, 'FunnelStorage');
            throw new Error(`Failed to save settings: ${error}`);
        }
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    private getDefaultSettings(id: string): FunnelSettings {
        const now = new Date().toISOString();
        return {
            id,
            name: 'Funil Quiz 21 Etapas',
            url: '',
            seo: { title: 'Quiz de Estilo Pessoal', description: 'Descubra seu estilo' },
            pixel: '',
            token: '',
            utm: {},
            webhooks: [],
            custom: {
                collectUserName: true,
                variables: [
                    { key: 'romantico', label: 'Romântico' },
                    { key: 'classico', label: 'Clássico' },
                    { key: 'natural', label: 'Natural' },
                    { key: 'sexy', label: 'Sexy' },
                    { key: 'dramatico', label: 'Dramático' },
                    { key: 'esportivo', label: 'Esportivo' },
                    { key: 'elegante', label: 'Elegante' },
                ],
            },
            version: 1,
            createdAt: now,
            updatedAt: now,
        };
    }

    private generateChecksum(data: any): string {
        // Simple checksum for data integrity verification
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(16);
    }

    // ============================================================================
    // FALLBACK TO LOCALSTORAGE (LEGACY SUPPORT)
    // ============================================================================

    private fallbackToLocalStorage(): FunnelItem[] {
        try {
            const raw = localStorage.getItem(LEGACY_LIST_KEY);
            const arr = raw ? JSON.parse(raw) : [];
            const funnels = Array.isArray(arr) ? arr : [];

            // Convert to new format
            return funnels.map((funnel: any) => ({
                ...funnel,
                version: funnel.version || 1,
                createdAt: funnel.createdAt || funnel.updatedAt || new Date().toISOString(),
                updatedAt: funnel.updatedAt || new Date().toISOString(),
            }));
        } catch {
            return [];
        }
    }

    private fallbackGetFunnel(id: string): FunnelItem | null {
        const funnels = this.fallbackToLocalStorage();
        return funnels.find(f => f.id === id) || null;
    }

    private fallbackGetSettings(id: string): FunnelSettings {
        try {
            const raw = localStorage.getItem(`${LEGACY_SETTINGS_PREFIX}${id}`);
            if (raw) {
                const settings = JSON.parse(raw);
                return {
                    ...settings,
                    id,
                    version: settings.version || 1,
                    createdAt: settings.createdAt || new Date().toISOString(),
                    updatedAt: settings.updatedAt || new Date().toISOString(),
                };
            }
        } catch {
            // Ignore errors, return default
        }
        return this.getDefaultSettings(id);
    }

    // ============================================================================
    // CLEANUP AND MAINTENANCE
    // ============================================================================

    async clearAllData(): Promise<void> {
        try {
            await this.dbManager.transaction(
                [FUNNEL_STORE, SETTINGS_STORE, METADATA_STORE],
                'readwrite',
                async (stores) => {
                    const [funnelStore, settingsStore, metadataStore] = stores as IDBObjectStore[];

                    return new Promise<void>((resolve, reject) => {
                        const clearFunnels = funnelStore.clear();
                        const clearSettings = settingsStore.clear();
                        const clearMetadata = metadataStore.clear();

                        let completed = 0;
                        const checkComplete = () => {
                            completed++;
                            if (completed === 3) resolve();
                        };

                        clearFunnels.onsuccess = checkComplete;
                        clearSettings.onsuccess = checkComplete;
                        clearMetadata.onsuccess = checkComplete;

                        clearFunnels.onerror = () => reject(clearFunnels.error);
                        clearSettings.onerror = () => reject(clearSettings.error);
                        clearMetadata.onerror = () => reject(clearMetadata.error);
                    });
                }
            );

            this.clearCache();
            logger.info('All funnel data cleared successfully', {}, 'FunnelStorage');
        } catch (error) {
            logger.error('Failed to clear all data', { error }, 'FunnelStorage');
            throw new Error(`Failed to clear data: ${error}`);
        }
    }

    async getStorageInfo(): Promise<{
        totalFunnels: number;
        totalSettings: number;
        estimatedSize: number;
        cacheSize: number;
    }> {
        try {
            const [funnels, settingsCount] = await Promise.all([
                this.listFunnels(),
                this.dbManager.transaction(SETTINGS_STORE, 'readonly', async (store) => {
                    return new Promise<number>((resolve, reject) => {
                        const request = (store as IDBObjectStore).count();
                        request.onsuccess = () => resolve(request.result);
                        request.onerror = () => reject(request.error);
                    });
                })
            ]);

            const estimatedSize = JSON.stringify([...funnels]).length;

            return {
                totalFunnels: funnels.length,
                totalSettings: settingsCount,
                estimatedSize,
                cacheSize: this.cache.size,
            };
        } catch (error) {
            logger.error('Failed to get storage info', { error }, 'FunnelStorage');
            return {
                totalFunnels: 0,
                totalSettings: 0,
                estimatedSize: 0,
                cacheSize: this.cache.size,
            };
        }
    }

    async close(): Promise<void> {
        await this.dbManager.close();
        this.clearCache();
    }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const advancedFunnelStorage = new AdvancedFunnelStorageService();
