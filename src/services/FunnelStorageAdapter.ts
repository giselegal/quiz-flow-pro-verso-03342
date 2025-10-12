/**
 * 🔄 FUNNEL STORAGE ADAPTER - COMPATIBILITY LAYER
 * 
 * Adapter que mantém a mesma API do funnelLocalStore original 
 * mas usa o AdvancedFunnelStorage (IndexedDB) por baixo.
 * Permite migração gradual sem breaking changes.
 */

import { advancedFunnelStorage } from './AdvancedFunnelStorage';
import { funnelDataMigration } from './FunnelDataMigration';
import { StorageService } from '@/services/core/StorageService';

// ============================================================================
// LEGACY TYPES - MANTÉM COMPATIBILIDADE
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
// MIGRATION HANDLER
// ============================================================================

class StorageInitializer {
    private static isInitialized = false;
    private static initPromise: Promise<void> | null = null;

    static async ensureInitialized(): Promise<void> {
        if (this.isInitialized) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = this.performInitialization();
        return this.initPromise;
    }

    private static async performInitialization(): Promise<void> {
        try {
            // Check if migration is needed and perform it
            const migrationResult = await funnelDataMigration.checkAndPerformAutoMigration();

            if (migrationResult) {
                console.log('[StorageAdapter] Migration completed', {
                    success: migrationResult.success,
                    migratedFunnels: migrationResult.migratedFunnels,
                    migratedSettings: migrationResult.migratedSettings,
                    duration: migrationResult.duration
                });
            }

            this.isInitialized = true;
        } catch (error) {
            console.error('[StorageAdapter] Initialization failed', error);
            // Don't throw - fallback to localStorage if available
        }
    }
}

// ============================================================================
// COMPATIBILITY ADAPTER
// ============================================================================

export const funnelLocalStore = {
    // ============================================================================
    // FUNNEL LIST OPERATIONS
    // ============================================================================

    list(): FunnelItem[] {
        // SYNCHRONOUS FALLBACK - tries to use localStorage if available
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
        } catch {
            return [];
        }
    },

    async listAsync(): Promise<FunnelItem[]> {
        await StorageInitializer.ensureInitialized();

        try {
            const funnels = await advancedFunnelStorage.listFunnels();
            return funnels.map(f => ({
                id: f.id,
                name: f.name,
                status: f.status,
                url: f.url,
                updatedAt: f.updatedAt
            }));
        } catch (error) {
            console.error('[StorageAdapter] Failed to list funnels async', error);
            return this.list(); // Fallback to sync
        }
    },

    saveList(list: FunnelItem[]) {
        // LEGACY METHOD - saves to localStorage for compatibility
        try {
            StorageService.safeSetJSON('qqcv_funnels', list);
        } catch (error) {
            console.error('[StorageAdapter] Failed to save list to localStorage', error);
        }
    },

    async saveListAsync(list: FunnelItem[]): Promise<void> {
        await StorageInitializer.ensureInitialized();

        try {
            // Save each funnel to IndexedDB
            for (const item of list) {
                await advancedFunnelStorage.upsertFunnel({
                    id: item.id,
                    name: item.name,
                    status: item.status,
                    url: item.url,
                });
            }
        } catch (error) {
            console.error('[StorageAdapter] Failed to save list async', error);
            this.saveList(list); // Fallback to sync
        }
    },

    // ============================================================================
    // INDIVIDUAL FUNNEL OPERATIONS
    // ============================================================================

    get(id: string): FunnelItem | null {
        const list = this.list();
        return list.find(f => f.id === id) || null;
    },

    async getAsync(id: string): Promise<FunnelItem | null> {
        await StorageInitializer.ensureInitialized();

        try {
            const funnel = await advancedFunnelStorage.getFunnel(id);
            return funnel ? {
                id: funnel.id,
                name: funnel.name,
                status: funnel.status,
                url: funnel.url,
                updatedAt: funnel.updatedAt
            } : null;
        } catch (error) {
            console.error('[StorageAdapter] Failed to get funnel async', error);
            return this.get(id); // Fallback to sync
        }
    },

    upsert(item: FunnelItem) {
        const list = this.list();
        const idx = list.findIndex(f => f.id === item.id);
        if (idx >= 0) list[idx] = item;
        else list.push(item);
        this.saveList(list);
    },

    async upsertAsync(item: FunnelItem): Promise<void> {
        await StorageInitializer.ensureInitialized();

        try {
            await advancedFunnelStorage.upsertFunnel({
                id: item.id,
                name: item.name,
                status: item.status,
                url: item.url,
            });
        } catch (error) {
            console.error('[StorageAdapter] Failed to upsert funnel async', error);
            this.upsert(item); // Fallback to sync
        }
    },

    async deleteAsync(id: string): Promise<void> {
        await StorageInitializer.ensureInitialized();

        try {
            await advancedFunnelStorage.deleteFunnel(id);
        } catch (error) {
            console.error('[StorageAdapter] Failed to delete funnel async', error);
            // Remove from localStorage as fallback
            const list = this.list().filter(f => f.id !== id);
            this.saveList(list);
        }
    },

    // ============================================================================
    // SETTINGS OPERATIONS
    // ============================================================================

    getSettings(id: string): FunnelSettings {
        try {
            const raw = localStorage.getItem(`qqcv_funnel_settings_${id}`);
            if (raw) {
                const settings = JSON.parse(raw);
                return {
                    name: settings.name,
                    url: settings.url,
                    seo: settings.seo,
                    pixel: settings.pixel,
                    token: settings.token,
                    utm: settings.utm,
                    webhooks: settings.webhooks,
                    custom: settings.custom
                };
            }
        } catch (error) {
            console.error('[StorageAdapter] Failed to get settings from localStorage', error);
        }
        return this.defaultSettings();
    },

    async getSettingsAsync(id: string): Promise<FunnelSettings> {
        await StorageInitializer.ensureInitialized();

        try {
            const settings = await advancedFunnelStorage.getFunnelSettings(id);
            return {
                name: settings.name,
                url: settings.url,
                seo: settings.seo,
                pixel: settings.pixel,
                token: settings.token,
                utm: settings.utm,
                webhooks: settings.webhooks,
                custom: settings.custom
            };
        } catch (error) {
            console.error('[StorageAdapter] Failed to get settings async', error);
            return this.getSettings(id); // Fallback to sync
        }
    },

    saveSettings(id: string, s: FunnelSettings) {
        try {
            localStorage.setItem(`qqcv_funnel_settings_${id}`, JSON.stringify(s));
        } catch (error) {
            console.error('[StorageAdapter] Failed to save settings to localStorage', error);
        }
    },

    async saveSettingsAsync(id: string, settings: FunnelSettings): Promise<void> {
        await StorageInitializer.ensureInitialized();

        try {
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
        } catch (error) {
            console.error('[StorageAdapter] Failed to save settings async', error);
            this.saveSettings(id, settings); // Fallback to sync
        }
    },

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
    },

    // ============================================================================
    // ADVANCED OPERATIONS (NEW)
    // ============================================================================

    async getStorageInfo(): Promise<{
        totalFunnels: number;
        totalSettings: number;
        estimatedSize: number;
        migrationStatus: 'not-needed' | 'pending' | 'completed';
        storageType: 'localStorage' | 'indexedDB' | 'hybrid';
    }> {
        await StorageInitializer.ensureInitialized();

        try {
            const info = await advancedFunnelStorage.getStorageInfo();
            const migrationNeeded = funnelDataMigration.isMigrationNeeded();

            return {
                totalFunnels: info.totalFunnels,
                totalSettings: info.totalSettings,
                estimatedSize: info.estimatedSize,
                migrationStatus: migrationNeeded ? 'pending' : 'completed',
                storageType: info.totalFunnels > 0 ? 'indexedDB' : 'localStorage',
            };
        } catch (error) {
            console.error('[StorageAdapter] Failed to get storage info', error);
            const list = this.list();
            return {
                totalFunnels: list.length,
                totalSettings: 0, // Can't determine from localStorage easily
                estimatedSize: JSON.stringify(list).length,
                migrationStatus: 'pending',
                storageType: 'localStorage',
            };
        }
    },

    async performMigration(): Promise<{ success: boolean; message: string }> {
        try {
            const result = await funnelDataMigration.performMigration();
            return {
                success: result.success,
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
    },

    async resetAllData(confirmation: string): Promise<{ success: boolean; message: string }> {
        if (confirmation !== 'RESET_ALL_FUNNEL_DATA') {
            return {
                success: false,
                message: 'Invalid confirmation. Use "RESET_ALL_FUNNEL_DATA" to confirm.'
            };
        }

        try {
            await funnelDataMigration.resetAllData(confirmation);
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
    },

    async createBackup(): Promise<{ success: boolean; backup?: string; message: string }> {
        try {
            const backup = await funnelDataMigration.createFullBackup();
            return {
                success: true,
                backup,
                message: 'Backup created successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: `Backup failed: ${error}`
            };
        }
    },

    async restoreFromBackup(backupString: string): Promise<{ success: boolean; message: string }> {
        try {
            const result = await funnelDataMigration.restoreFromBackup(backupString);
            return {
                success: result.success,
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
};
