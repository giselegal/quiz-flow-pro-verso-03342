/**
 * 🔄 FUNNEL DATA MIGRATION SERVICE
 * 
 * Serviço responsável por migrar dados de funis do localStorage para IndexedDB:
 * - Migração automática na primeira execução
 * - Versionamento e backup de dados
 * - Reset seguro com confirmação
 * - Rollback em caso de erro
 * - Validação de integridade dos dados
 */

import { advancedFunnelStorage, type FunnelItem, type FunnelSettings, type MigrationResult } from './AdvancedFunnelStorage';

// Simple console logger for migration process - fallback approach
const logger = {
    info: (message: string, data?: any, context?: string) => {
        console.log(`[${context || 'Migration'}] INFO: ${message}`, data || '');
    },
    error: (message: string, data?: any, context?: string) => {
        console.error(`[${context || 'Migration'}] ERROR: ${message}`, data || '');
    },
    warn: (message: string, data?: any, context?: string) => {
        console.warn(`[${context || 'Migration'}] WARN: ${message}`, data || '');
    }
};

// ============================================================================
// MIGRATION CONFIGURATION
// ============================================================================

const MIGRATION_VERSION_KEY = 'qqcv_migration_version';
const CURRENT_MIGRATION_VERSION = 1;
const LEGACY_BACKUP_KEY = 'qqcv_legacy_backup';

// Legacy localStorage keys
const LEGACY_LIST_KEY = 'qqcv_funnels';
const LEGACY_SETTINGS_PREFIX = 'qqcv_funnel_settings_';

// ============================================================================
// MIGRATION SERVICE
// ============================================================================

class FunnelDataMigrationService {

    // ============================================================================
    // MIGRATION STATUS CHECK
    // ============================================================================

    isMigrationNeeded(): boolean {
        try {
            const currentVersion = this.getCurrentMigrationVersion();
            const hasLegacyData = this.hasLegacyData();

            logger.info('Checking migration status', {
                currentVersion,
                requiredVersion: CURRENT_MIGRATION_VERSION,
                hasLegacyData
            }, 'Migration');

            return currentVersion < CURRENT_MIGRATION_VERSION && hasLegacyData;
        } catch (error) {
            logger.error('Failed to check migration status', { error }, 'Migration');
            return false;
        }
    }

    private getCurrentMigrationVersion(): number {
        try {
            const version = localStorage.getItem(MIGRATION_VERSION_KEY);
            return version ? parseInt(version, 10) : 0;
        } catch {
            return 0;
        }
    }

    private hasLegacyData(): boolean {
        try {
            const legacyList = localStorage.getItem(LEGACY_LIST_KEY);
            if (!legacyList) return false;

            const funnels = JSON.parse(legacyList);
            return Array.isArray(funnels) && funnels.length > 0;
        } catch {
            return false;
        }
    }

    // ============================================================================
    // MIGRATION EXECUTION
    // ============================================================================

    async performMigration(): Promise<MigrationResult> {
        const startTime = Date.now();
        const result: MigrationResult = {
            success: false,
            migratedFunnels: 0,
            migratedSettings: 0,
            errors: [],
            duration: 0,
        };

        try {
            logger.info('Starting funnel data migration', {
                fromVersion: this.getCurrentMigrationVersion(),
                toVersion: CURRENT_MIGRATION_VERSION
            }, 'Migration');

            // Step 1: Backup existing localStorage data
            await this.createLegacyBackup();

            // Step 2: Migrate funnels list
            const funnels = await this.migrateFunnelsList();
            result.migratedFunnels = funnels.length;

            // Step 3: Migrate funnel settings
            const migratedSettingsCount = await this.migrateFunnelSettings(funnels);
            result.migratedSettings = migratedSettingsCount;

            // Step 4: Verify migration integrity
            await this.verifyMigration(funnels);

            // Step 5: Update migration version
            this.setMigrationVersion(CURRENT_MIGRATION_VERSION);

            result.success = true;
            result.duration = Date.now() - startTime;

            logger.info('Migration completed successfully', {
                migratedFunnels: result.migratedFunnels,
                migratedSettings: result.migratedSettings,
                duration: result.duration
            }, 'Migration');

        } catch (error) {
            result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            result.duration = Date.now() - startTime;

            logger.error('Migration failed', {
                error,
                duration: result.duration,
                migratedFunnels: result.migratedFunnels,
                migratedSettings: result.migratedSettings
            }, 'Migration');

            // Attempt rollback
            await this.rollbackMigration();
        }

        return result;
    }

    private async createLegacyBackup(): Promise<void> {
        try {
            const backup = {
                version: this.getCurrentMigrationVersion(),
                timestamp: new Date().toISOString(),
                funnelsList: localStorage.getItem(LEGACY_LIST_KEY),
                settings: {} as Record<string, string>,
            };

            // Backup all funnel settings
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(LEGACY_SETTINGS_PREFIX)) {
                    backup.settings[key] = localStorage.getItem(key) || '';
                }
            }

            localStorage.setItem(LEGACY_BACKUP_KEY, JSON.stringify(backup));
            logger.info('Legacy data backup created', {
                settingsCount: Object.keys(backup.settings).length
            }, 'Migration');

        } catch (error) {
            throw new Error(`Failed to create backup: ${error}`);
        }
    }

    private async migrateFunnelsList(): Promise<FunnelItem[]> {
        try {
            const legacyListRaw = localStorage.getItem(LEGACY_LIST_KEY);
            if (!legacyListRaw) return [];

            const legacyList = JSON.parse(legacyListRaw);
            if (!Array.isArray(legacyList)) return [];

            const migratedFunnels: FunnelItem[] = [];

            for (const legacyFunnel of legacyList) {
                try {
                    const now = new Date().toISOString();
                    const modernFunnel: FunnelItem = {
                        id: legacyFunnel.id || this.generateId(),
                        name: legacyFunnel.name || 'Untitled Funnel',
                        status: legacyFunnel.status || 'draft',
                        url: legacyFunnel.url || '',
                        version: legacyFunnel.version || 1,
                        createdAt: legacyFunnel.createdAt || legacyFunnel.updatedAt || now,
                        updatedAt: legacyFunnel.updatedAt || now,
                        checksum: this.generateChecksum(legacyFunnel),
                    };

                    await advancedFunnelStorage.upsertFunnel(modernFunnel);
                    migratedFunnels.push(modernFunnel);

                } catch (error) {
                    logger.warn('Failed to migrate individual funnel', {
                        funnelId: legacyFunnel.id,
                        error
                    }, 'Migration');
                }
            }

            return migratedFunnels;

        } catch (error) {
            throw new Error(`Failed to migrate funnels list: ${error}`);
        }
    }

    private async migrateFunnelSettings(funnels: FunnelItem[]): Promise<number> {
        let migratedCount = 0;

        for (const funnel of funnels) {
            try {
                const legacySettingsKey = `${LEGACY_SETTINGS_PREFIX}${funnel.id}`;
                const legacySettingsRaw = localStorage.getItem(legacySettingsKey);

                if (legacySettingsRaw) {
                    const legacySettings = JSON.parse(legacySettingsRaw);

                    const now = new Date().toISOString();
                    const modernSettings: Partial<FunnelSettings> = {
                        ...legacySettings,
                        version: legacySettings.version || 1,
                        createdAt: legacySettings.createdAt || now,
                        updatedAt: legacySettings.updatedAt || now,
                    };

                    await advancedFunnelStorage.saveFunnelSettings(funnel.id, modernSettings);
                    migratedCount++;
                }

            } catch (error) {
                logger.warn('Failed to migrate settings for funnel', {
                    funnelId: funnel.id,
                    error
                }, 'Migration');
            }
        }

        return migratedCount;
    }

    private async verifyMigration(originalFunnels: FunnelItem[]): Promise<void> {
        try {
            // Verify funnels were migrated correctly
            const migratedFunnels = await advancedFunnelStorage.listFunnels();

            if (migratedFunnels.length !== originalFunnels.length) {
                throw new Error(`Funnel count mismatch: expected ${originalFunnels.length}, got ${migratedFunnels.length}`);
            }

            // Verify each funnel exists and has correct data
            for (const originalFunnel of originalFunnels) {
                const migratedFunnel = await advancedFunnelStorage.getFunnel(originalFunnel.id);
                if (!migratedFunnel) {
                    throw new Error(`Funnel ${originalFunnel.id} not found after migration`);
                }

                // Verify essential properties
                if (migratedFunnel.name !== originalFunnel.name ||
                    migratedFunnel.status !== originalFunnel.status) {
                    throw new Error(`Funnel ${originalFunnel.id} data mismatch after migration`);
                }
            }

            logger.info('Migration verification passed', {
                verifiedFunnels: originalFunnels.length
            }, 'Migration');

        } catch (error) {
            throw new Error(`Migration verification failed: ${error}`);
        }
    }

    // ============================================================================
    // ROLLBACK AND CLEANUP
    // ============================================================================

    async rollbackMigration(): Promise<void> {
        try {
            logger.info('Starting migration rollback', {}, 'Migration');

            // Clear any partially migrated data
            await advancedFunnelStorage.clearAllData();

            // Reset migration version
            localStorage.removeItem(MIGRATION_VERSION_KEY);

            logger.info('Migration rollback completed', {}, 'Migration');

        } catch (error) {
            logger.error('Failed to rollback migration', { error }, 'Migration');
        }
    }

    async resetAllData(confirmation: string): Promise<void> {
        if (confirmation !== 'RESET_ALL_FUNNEL_DATA') {
            throw new Error('Invalid confirmation string. Data reset cancelled.');
        }

        try {
            logger.info('Starting complete data reset', {}, 'Migration');

            // Clear IndexedDB data
            await advancedFunnelStorage.clearAllData();

            // Clear legacy localStorage data
            localStorage.removeItem(LEGACY_LIST_KEY);

            // Clear all legacy settings
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith(LEGACY_SETTINGS_PREFIX)) {
                    localStorage.removeItem(key);
                }
            }

            // Clear migration data
            localStorage.removeItem(MIGRATION_VERSION_KEY);
            localStorage.removeItem(LEGACY_BACKUP_KEY);

            logger.info('Complete data reset finished', {}, 'Migration');

        } catch (error) {
            logger.error('Failed to reset data', { error }, 'Migration');
            throw new Error(`Data reset failed: ${error}`);
        }
    }

    // ============================================================================
    // BACKUP AND RESTORE
    // ============================================================================

    async createFullBackup(): Promise<string> {
        try {
            const timestamp = new Date().toISOString();
            const funnels = await advancedFunnelStorage.listFunnels();
            const settings: Record<string, FunnelSettings> = {};

            // Get all settings
            for (const funnel of funnels) {
                settings[funnel.id] = await advancedFunnelStorage.getFunnelSettings(funnel.id);
            }

            const backup = {
                version: CURRENT_MIGRATION_VERSION,
                timestamp,
                funnels,
                settings,
                metadata: {
                    totalFunnels: funnels.length,
                    totalSettings: Object.keys(settings).length,
                },
            };

            const backupString = JSON.stringify(backup, null, 2);

            logger.info('Full backup created', {
                funnels: funnels.length,
                settings: Object.keys(settings).length,
                size: backupString.length
            }, 'Migration');

            return backupString;

        } catch (error) {
            logger.error('Failed to create backup', { error }, 'Migration');
            throw new Error(`Backup creation failed: ${error}`);
        }
    }

    async restoreFromBackup(backupString: string): Promise<MigrationResult> {
        const startTime = Date.now();
        const result: MigrationResult = {
            success: false,
            migratedFunnels: 0,
            migratedSettings: 0,
            errors: [],
            duration: 0,
        };

        try {
            const backup = JSON.parse(backupString);

            if (!backup.funnels || !backup.settings) {
                throw new Error('Invalid backup format');
            }

            logger.info('Starting restore from backup', {
                backupDate: backup.timestamp,
                funnelsToRestore: backup.funnels.length
            }, 'Migration');

            // Clear existing data
            await advancedFunnelStorage.clearAllData();

            // Restore funnels
            for (const funnel of backup.funnels) {
                await advancedFunnelStorage.upsertFunnel(funnel);
                result.migratedFunnels++;
            }

            // Restore settings
            for (const [funnelId, settings] of Object.entries(backup.settings)) {
                await advancedFunnelStorage.saveFunnelSettings(funnelId, settings as FunnelSettings);
                result.migratedSettings++;
            }

            result.success = true;
            result.duration = Date.now() - startTime;

            logger.info('Restore completed successfully', result, 'Migration');

        } catch (error) {
            result.errors.push(`Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            result.duration = Date.now() - startTime;

            logger.error('Restore failed', { error, result }, 'Migration');
        }

        return result;
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    private setMigrationVersion(version: number): void {
        localStorage.setItem(MIGRATION_VERSION_KEY, version.toString());
    }

    private generateId(): string {
        return `funnel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateChecksum(data: any): string {
        // Simple checksum for data integrity
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
    // AUTO-MIGRATION ON STARTUP
    // ============================================================================

    async checkAndPerformAutoMigration(): Promise<MigrationResult | null> {
        if (!this.isMigrationNeeded()) {
            return null;
        }

        logger.info('Auto-migration triggered', {}, 'Migration');
        return await this.performMigration();
    }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const funnelDataMigration = new FunnelDataMigrationService();

// Export types
export type { MigrationResult };
