/**
 * 🔄 MIGRATED FUNNEL LOCAL STORE - SIMPLIFIED INTEGRATION
 * 
 * Versão simplificada integrada com improvedFunnelSystem,
 * mantendo compatibilidade total com a API existente.
 * 
 * Features:
 * ✅ Integração com improvedFunnelSystem
 * ✅ Validação de IDs
 * ✅ Performance otimizada com cache
 * ✅ Compatibilidade total com API existente
 * ✅ Migration automático do localStorage
 */

import {
    validateFunnelId,
    performSystemHealthCheck
} from '../utils/improvedFunnelSystem';
import { advancedFunnelStorage } from './AdvancedFunnelStorage';
import { funnelDataMigration } from './FunnelDataMigration';
import { StorageService } from '@/services/core/StorageService';

// ============================================================================
// LEGACY TYPES - COMPATIBILIDADE TOTAL
// ============================================================================

export type FunnelItem = {
    id: string;
    name: string;
    status: 'draft' | 'published';
    url?: string;
    updatedAt?: string;
};

export type FunnelSettings = {
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
};

// ============================================================================
// TYPES E INTERFACES
// ============================================================================

interface SystemHealthStatus {
    isHealthy: boolean;
    score: number;
    issues: string[];
}

interface StorageMetrics {
    totalFunnels: number;
    totalSettings: number;
    estimatedSize: number;
    migrationStatus: 'not-needed' | 'pending' | 'completed';
    storageType: 'localStorage' | 'indexedDB' | 'hybrid';
    healthStatus: SystemHealthStatus;
}

interface OperationResult<T = void> {
    success: boolean;
    data?: T;
    message: string;
    duration?: number;
}

// ============================================================================
// CORE IMPLEMENTATION
// ============================================================================

class MigratedFunnelLocalStore {
    private cache = new Map<string, { data: FunnelItem; timestamp: number }>();
    private settingsCache = new Map<string, { data: FunnelSettings; timestamp: number }>();
    private isInitialized = false;
    private initPromise: Promise<void> | null = null;
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    private async ensureInitialized(): Promise<void> {
        if (this.isInitialized) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = this.performInitialization();
        return this.initPromise;
    }

    private async performInitialization(): Promise<void> {
        try {
            // Migração automática se necessária
            const migrationResult = await funnelDataMigration.checkAndPerformAutoMigration();

            if (migrationResult) {
                console.log('[MigratedLocalStore] Migration completed', {
                    success: migrationResult.success,
                    migratedFunnels: migrationResult.migratedFunnels,
                    migratedSettings: migrationResult.migratedSettings,
                    duration: migrationResult.duration
                });
            }

            this.isInitialized = true;

        } catch (error) {
            console.error('[MigratedLocalStore] Initialization failed', error);
            // Não fazer throw - permitir fallback para localStorage
        }
    }

    // ============================================================================
    // FUNNEL LIST OPERATIONS
    // ============================================================================

    list(): FunnelItem[] {
        try {
            const raw = StorageService.safeGetString('qqcv_funnels');
            const arr = raw ? JSON.parse(raw) : [];

            return Array.isArray(arr) ? arr.map(f => ({
                id: f.id,
                name: f.name,
                status: f.status,
                url: f.url,
                updatedAt: f.updatedAt
            })) : [];

        } catch (error) {
            console.error('[MigratedLocalStore] Failed to list funnels', error);
            return [];
        }
    }

    async listAsync(): Promise<FunnelItem[]> {
        try {
            await this.ensureInitialized();

            const funnels = await advancedFunnelStorage.listFunnels();

            // Validar cada funil
            const validatedFunnels: FunnelItem[] = [];
            for (const funnel of funnels) {
                try {
                    if (validateFunnelId(funnel.id)) {
                        validatedFunnels.push({
                            id: funnel.id,
                            name: funnel.name,
                            status: funnel.status,
                            url: funnel.url,
                            updatedAt: funnel.updatedAt
                        });
                    }
                } catch (validationError) {
                    console.warn('[MigratedLocalStore] Invalid funnel skipped', {
                        funnelId: funnel.id,
                        error: validationError
                    });
                }
            }

            return validatedFunnels;

        } catch (error) {
            console.error('[MigratedLocalStore] Failed to list funnels async', error);
            return this.list(); // Fallback para sync
        }
    }

    saveList(list: FunnelItem[]): void {
        try {
            // Validar estrutura da lista
            if (!Array.isArray(list)) {
                throw new Error('Invalid list format - must be array');
            }

            // Validar cada item básico
            for (const item of list) {
                if (!item.id || typeof item.id !== 'string') {
                    throw new Error(`Invalid funnel ID in list: ${item.id}`);
                }
            }

            StorageService.safeSetJSON('qqcv_funnels', list);

            // Invalidar cache
            this.cache.clear();

        } catch (error) {
            console.error('[MigratedLocalStore] Failed to save list', error);
            throw error;
        }
    }

    async saveListAsync(list: FunnelItem[]): Promise<void> {
        try {
            await this.ensureInitialized();

            // Validação da lista
            if (!Array.isArray(list)) {
                throw new Error('Invalid list format - must be array');
            }

            // Salvar cada funnel no IndexedDB
            const savePromises = list.map(async (item) => {
                try {
                    if (!validateFunnelId(item.id)) {
                        throw new Error(`Invalid funnel ID: ${item.id}`);
                    }

                    return await advancedFunnelStorage.upsertFunnel({
                        id: item.id,
                        name: item.name,
                        status: item.status,
                        url: item.url,
                    });
                } catch (error) {
                    console.warn('[MigratedLocalStore] Failed to save individual funnel', {
                        funnelId: item.id,
                        error
                    });
                    throw error;
                }
            });

            await Promise.all(savePromises);

            // Invalidar cache
            this.cache.clear();

        } catch (error) {
            console.error('[MigratedLocalStore] Failed to save list async', error);
            this.saveList(list); // Fallback para sync
        }
    }

    // ============================================================================
    // INDIVIDUAL FUNNEL OPERATIONS
    // ============================================================================

    get(id: string): FunnelItem | null {
        try {
            if (!validateFunnelId(id)) {
                return null;
            }

            // Verificar cache primeiro
            const cached = this.cache.get(id);
            if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
                return cached.data;
            }

            const list = this.list();
            const funnel = list.find(f => f.id === id) || null;

            // Atualizar cache se encontrou
            if (funnel) {
                this.cache.set(id, { data: funnel, timestamp: Date.now() });
            }

            return funnel;

        } catch (error) {
            console.error('[MigratedLocalStore] Failed to get funnel', error);
            return null;
        }
    }

    async getAsync(id: string): Promise<FunnelItem | null> {
        try {
            if (!validateFunnelId(id)) {
                return null;
            }

            await this.ensureInitialized();

            // Verificar cache primeiro
            const cached = this.cache.get(id);
            if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
                return cached.data;
            }

            const funnel = await advancedFunnelStorage.getFunnel(id);

            let result: FunnelItem | null = null;

            if (funnel) {
                result = {
                    id: funnel.id,
                    name: funnel.name,
                    status: funnel.status,
                    url: funnel.url,
                    updatedAt: funnel.updatedAt
                };

                // Atualizar cache
                this.cache.set(id, { data: result, timestamp: Date.now() });
            }

            return result;

        } catch (error) {
            console.error('[MigratedLocalStore] Failed to get funnel async', error);
            return this.get(id); // Fallback para sync
        }
    }

    upsert(item: FunnelItem): void {
        try {
            if (!validateFunnelId(item.id)) {
                throw new Error(`Invalid funnel ID: ${item.id}`);
            }

            const list = this.list();
            const idx = list.findIndex(f => f.id === item.id);

            if (idx >= 0) {
                list[idx] = { ...item, updatedAt: new Date().toISOString() };
            } else {
                list.push({ ...item, updatedAt: new Date().toISOString() });
            }

            this.saveList(list);

            // Atualizar cache
            this.cache.set(item.id, { data: item, timestamp: Date.now() });

        } catch (error) {
            console.error('[MigratedLocalStore] Failed to upsert funnel', error);
            throw error;
        }
    }

    async upsertAsync(item: FunnelItem): Promise<void> {
        try {
            if (!validateFunnelId(item.id)) {
                throw new Error(`Invalid funnel ID: ${item.id}`);
            }

            await this.ensureInitialized();

            const updatedItem = {
                ...item,
                updatedAt: new Date().toISOString()
            };

            await advancedFunnelStorage.upsertFunnel({
                id: updatedItem.id,
                name: updatedItem.name,
                status: updatedItem.status,
                url: updatedItem.url,
            });

            // Atualizar cache
            this.cache.set(item.id, { data: updatedItem, timestamp: Date.now() });

        } catch (error) {
            console.error('[MigratedLocalStore] Failed to upsert funnel async', error);
            this.upsert(item); // Fallback para sync
        }
    }

    async deleteAsync(id: string): Promise<void> {
        try {
            if (!validateFunnelId(id)) {
                throw new Error(`Invalid funnel ID: ${id}`);
            }

            await this.ensureInitialized();

            await advancedFunnelStorage.deleteFunnel(id);

            // Remover do cache
            this.cache.delete(id);
            this.settingsCache.delete(id);

        } catch (error) {
            console.error('[MigratedLocalStore] Failed to delete funnel async', error);

            // Fallback para localStorage
            const list = this.list().filter(f => f.id !== id);
            this.saveList(list);
        }
    }

    // ============================================================================
    // SETTINGS OPERATIONS
    // ============================================================================

    getSettings(id: string): FunnelSettings {
        try {
            if (!validateFunnelId(id)) {
                return this.defaultSettings();
            }

            // Verificar cache primeiro
            const cached = this.settingsCache.get(id);
            if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
                return cached.data;
            }

            const raw = localStorage.getItem(`qqcv_funnel_settings_${id}`);

            if (raw) {
                const settings = JSON.parse(raw);
                const validSettings: FunnelSettings = {
                    name: settings.name || '',
                    url: settings.url || '',
                    seo: settings.seo || { title: '', description: '' },
                    pixel: settings.pixel || '',
                    token: settings.token || '',
                    utm: settings.utm || {},
                    webhooks: Array.isArray(settings.webhooks) ? settings.webhooks : [],
                    custom: settings.custom || this.defaultSettings().custom
                };

                // Atualizar cache
                this.settingsCache.set(id, { data: validSettings, timestamp: Date.now() });

                return validSettings;
            }
        } catch (error) {
            console.error('[MigratedLocalStore] Failed to get settings', error);
        }

        return this.defaultSettings();
    }

    async getSettingsAsync(id: string): Promise<FunnelSettings> {
        try {
            if (!validateFunnelId(id)) {
                return this.defaultSettings();
            }

            await this.ensureInitialized();

            // Verificar cache primeiro
            const cached = this.settingsCache.get(id);
            if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
                return cached.data;
            }

            const settings = await advancedFunnelStorage.getFunnelSettings(id);

            const validSettings: FunnelSettings = {
                name: settings.name,
                url: settings.url,
                seo: settings.seo,
                pixel: settings.pixel,
                token: settings.token,
                utm: settings.utm,
                webhooks: settings.webhooks,
                custom: settings.custom
            };

            // Atualizar cache
            this.settingsCache.set(id, { data: validSettings, timestamp: Date.now() });

            return validSettings;

        } catch (error) {
            console.error('[MigratedLocalStore] Failed to get settings async', error);
            return this.getSettings(id); // Fallback para sync
        }
    }

    saveSettings(id: string, settings: FunnelSettings): void {
        try {
            if (!validateFunnelId(id)) {
                throw new Error(`Invalid funnel ID: ${id}`);
            }

            localStorage.setItem(`qqcv_funnel_settings_${id}`, JSON.stringify(settings));

            // Atualizar cache
            this.settingsCache.set(id, { data: settings, timestamp: Date.now() });

        } catch (error) {
            console.error('[MigratedLocalStore] Failed to save settings', error);
            throw error;
        }
    }

    async saveSettingsAsync(id: string, settings: FunnelSettings): Promise<void> {
        try {
            if (!validateFunnelId(id)) {
                throw new Error(`Invalid funnel ID: ${id}`);
            }

            await this.ensureInitialized();

            await advancedFunnelStorage.saveFunnelSettings(id, {
                name: settings.name,
                url: settings.url,
                seo: settings.seo,
                pixel: settings.pixel,
                token: settings.token,
                utm: settings.utm,
                webhooks: settings.webhooks,
                custom: settings.custom
            });

            // Atualizar cache
            this.settingsCache.set(id, { data: settings, timestamp: Date.now() });

        } catch (error) {
            console.error('[MigratedLocalStore] Failed to save settings async', error);
            this.saveSettings(id, settings); // Fallback para sync
        }
    }

    defaultSettings(): FunnelSettings {
        return {
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
        };
    }

    // ============================================================================
    // ADVANCED OPERATIONS
    // ============================================================================

    async getStorageInfo(): Promise<StorageMetrics> {
        try {
            await this.ensureInitialized();

            const [info, healthStatus] = await Promise.all([
                advancedFunnelStorage.getStorageInfo(),
                performSystemHealthCheck()
            ]);

            const migrationNeeded = funnelDataMigration.isMigrationNeeded();

            return {
                totalFunnels: info.totalFunnels,
                totalSettings: info.totalSettings,
                estimatedSize: info.estimatedSize,
                migrationStatus: migrationNeeded ? 'pending' : 'completed',
                storageType: info.totalFunnels > 0 ? 'indexedDB' : 'localStorage',
                healthStatus: {
                    isHealthy: healthStatus.overall === 'healthy',
                    score: healthStatus.overall === 'healthy' ? 100 : healthStatus.overall === 'warning' ? 50 : 0,
                    issues: healthStatus.issues
                }
            };

        } catch (error) {
            console.error('[MigratedLocalStore] Failed to get storage info', error);

            const list = this.list();
            return {
                totalFunnels: list.length,
                totalSettings: 0,
                estimatedSize: JSON.stringify(list).length,
                migrationStatus: 'pending',
                storageType: 'localStorage',
                healthStatus: { isHealthy: false, score: 0, issues: ['Storage info unavailable'] }
            };
        }
    }

    async performMigration(): Promise<OperationResult<{ migratedFunnels: number; migratedSettings: number }>> {
        try {
            await this.ensureInitialized();

            const result = await funnelDataMigration.performMigration();

            // Invalidar todos os caches após migração
            this.cache.clear();
            this.settingsCache.clear();

            return {
                success: result.success,
                data: {
                    migratedFunnels: result.migratedFunnels,
                    migratedSettings: result.migratedSettings
                },
                message: result.success
                    ? `Migration completed: ${result.migratedFunnels} funnels, ${result.migratedSettings} settings`
                    : `Migration failed: ${result.errors.join(', ')}`
            };

        } catch (error) {
            return {
                success: false,
                message: `Migration error: ${error}`
            };
        }
    }

    async createBackup(): Promise<OperationResult<string>> {
        try {
            await this.ensureInitialized();

            const backup = await funnelDataMigration.createFullBackup();

            return {
                success: true,
                data: backup,
                message: 'Backup created successfully'
            };

        } catch (error) {
            return {
                success: false,
                message: `Backup failed: ${error}`
            };
        }
    }

    async restoreFromBackup(backupString: string): Promise<OperationResult<{ migratedFunnels: number; migratedSettings: number }>> {
        try {
            await this.ensureInitialized();

            const result = await funnelDataMigration.restoreFromBackup(backupString);

            // Invalidar todos os caches após restore
            this.cache.clear();
            this.settingsCache.clear();

            return {
                success: result.success,
                data: {
                    migratedFunnels: result.migratedFunnels,
                    migratedSettings: result.migratedSettings
                },
                message: result.success
                    ? `Restore completed: ${result.migratedFunnels} funnels, ${result.migratedSettings} settings`
                    : `Restore failed: ${result.errors.join(', ')}`
            };

        } catch (error) {
            return {
                success: false,
                message: `Restore error: ${error}`
            };
        }
    }

    async resetAllData(confirmation: string): Promise<OperationResult> {
        try {
            if (confirmation !== 'RESET_ALL_FUNNEL_DATA') {
                return {
                    success: false,
                    message: 'Invalid confirmation. Use "RESET_ALL_FUNNEL_DATA" to confirm.'
                };
            }

            await this.ensureInitialized();

            await funnelDataMigration.resetAllData(confirmation);

            // Invalidar todos os caches
            this.cache.clear();
            this.settingsCache.clear();

            return {
                success: true,
                message: 'All funnel data has been reset successfully.'
            };

        } catch (error) {
            return {
                success: false,
                message: `Reset failed: ${error}`
            };
        }
    }
}

// ============================================================================
// FACTORY E EXPORT
// ============================================================================

export function createMigratedFunnelLocalStore(): MigratedFunnelLocalStore {
    return new MigratedFunnelLocalStore();
}

// Instance padrão para compatibilidade
export const migratedFunnelLocalStore = createMigratedFunnelLocalStore();

// Export da classe para casos especiais
export { MigratedFunnelLocalStore };

// ============================================================================
// LEGACY COMPATIBILITY EXPORTS
// ============================================================================

// Para compatibilidade total, exportar também como funnelLocalStore
export const funnelLocalStore = migratedFunnelLocalStore;