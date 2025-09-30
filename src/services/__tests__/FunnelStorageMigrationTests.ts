/**
 * 🧪 FUNNEL STORAGE MIGRATION TESTS
 * 
 * Testes automatizados para garantir que a migração
 * e nova funcionalidade funcionam corretamente:
 * - Migração do localStorage para IndexedDB
 * - Integridade dos dados migrados
 * - Operações CRUD no novo sistema
 * - Fallback para localStorage em caso de erro
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { advancedFunnelStorage } from '../AdvancedFunnelStorage';
import { funnelDataMigration } from '../FunnelDataMigration';
import { funnelLocalStore } from '../FunnelStorageAdapter';

// ============================================================================
// TEST UTILITIES
// ============================================================================

class TestHelper {
    static async clearAllStorage(): Promise<void> {
        // Clear IndexedDB
        try {
            await advancedFunnelStorage.clearAllData();
        } catch (error) {
            console.warn('Failed to clear IndexedDB', error);
        }

        // Clear localStorage
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('qqcv_') || key.startsWith('QQCV_'))) {
                localStorage.removeItem(key);
            }
        }
    }

    static createMockFunnelData() {
        return {
            funnels: [
                {
                    id: 'test-funnel-1',
                    name: 'Test Funnel 1',
                    status: 'draft' as const,
                    url: 'https://test1.com',
                    updatedAt: '2024-01-01T10:00:00.000Z'
                },
                {
                    id: 'test-funnel-2',
                    name: 'Test Funnel 2',
                    status: 'published' as const,
                    url: 'https://test2.com',
                    updatedAt: '2024-01-02T10:00:00.000Z'
                }
            ],
            settings: {
                'test-funnel-1': {
                    name: 'Custom Funnel 1',
                    url: 'https://custom1.com',
                    seo: { title: 'SEO Title 1', description: 'SEO Description 1' },
                    pixel: 'pixel123',
                    token: 'token123',
                    utm: { source: 'test', medium: 'email' },
                    webhooks: [{ platform: 'zapier', url: 'https://webhook1.com' }],
                    custom: {
                        collectUserName: true,
                        variables: [
                            { key: 'test1', label: 'Test Variable 1' },
                            { key: 'test2', label: 'Test Variable 2' }
                        ]
                    }
                }
            }
        };
    }

    static setupMockLocalStorage(data: ReturnType<typeof TestHelper.createMockFunnelData>) {
        // Setup legacy localStorage data
        localStorage.setItem('qqcv_funnels', JSON.stringify(data.funnels));

        Object.entries(data.settings).forEach(([id, settings]) => {
            localStorage.setItem(`qqcv_funnel_settings_${id}`, JSON.stringify(settings));
        });
    }

    static async wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================================================
// TEST RUNNER
// ============================================================================

// Conversão para suíte Vitest padrão (reduz complexidade e integra ao reporter).

// ============================================================================
// TEST IMPLEMENTATION
// ============================================================================

beforeEach(async () => {
    await TestHelper.clearAllStorage();
});

describe('Funnel Storage Migration (schema + adapters)', () => {
    it('Advanced Storage - Basic CRUD Operations', async () => {
        const testFunnel = {
            id: 'crud-test-1',
            name: 'CRUD Test Funnel',
            status: 'draft' as const,
            url: 'https://crud-test.com'
        };

        // Create
        const created = await advancedFunnelStorage.upsertFunnel(testFunnel);
        if (created.id !== testFunnel.id) {
            throw new Error('Created funnel ID mismatch');
        }

        // Read
        const retrieved = await advancedFunnelStorage.getFunnel(testFunnel.id);
        if (!retrieved || retrieved.name !== testFunnel.name) {
            throw new Error('Retrieved funnel data mismatch');
        }

        // Update
        const updated = await advancedFunnelStorage.upsertFunnel({
            ...testFunnel,
            name: 'Updated CRUD Test Funnel'
        });
        if (updated.name !== 'Updated CRUD Test Funnel') {
            throw new Error('Updated funnel data mismatch');
        }

        // List
        const funnels = await advancedFunnelStorage.listFunnels();
        if (!funnels.find(f => f.id === testFunnel.id)) {
            throw new Error('Funnel not found in list');
        }

        // Delete
        await advancedFunnelStorage.deleteFunnel(testFunnel.id);
        const deletedCheck = await advancedFunnelStorage.getFunnel(testFunnel.id);
        if (deletedCheck) {
            throw new Error('Funnel was not deleted');
        }
    });

    it('Advanced Storage - Settings Operations', async () => {
        const funnelId = 'settings-test-1';
        const testSettings = {
            name: 'Settings Test',
            url: 'https://settings-test.com',
            seo: { title: 'Test SEO', description: 'Test Description' },
            pixel: 'test-pixel',
            token: 'test-token',
            utm: { source: 'test-source' },
            webhooks: [{ platform: 'test', url: 'https://test-webhook.com' }],
            custom: {
                collectUserName: false,
                variables: [{ key: 'test-var', label: 'Test Variable' }]
            }
        };

        // Save settings
        const saved = await advancedFunnelStorage.saveFunnelSettings(funnelId, testSettings);
        if (saved.name !== testSettings.name) {
            throw new Error('Settings save failed');
        }

        // Get settings
        const retrieved = await advancedFunnelStorage.getFunnelSettings(funnelId);
        if (retrieved.pixel !== testSettings.pixel) {
            throw new Error('Settings retrieval failed');
        }
    });

    // ============================================================================
    // MIGRATION TESTS
    // ============================================================================

    it('Migration - LocalStorage to IndexedDB', async () => {
        const mockData = TestHelper.createMockFunnelData();
        TestHelper.setupMockLocalStorage(mockData);

        // Verify localStorage has data
        const legacyList = JSON.parse(localStorage.getItem('qqcv_funnels') || '[]');
        if (legacyList.length !== 2) {
            throw new Error('Mock localStorage data not set up correctly');
        }

        // Perform migration
        const migrationResult = await funnelDataMigration.performMigration();
        if (!migrationResult.success) {
            throw new Error(`Migration failed: ${migrationResult.errors.join(', ')}`);
        }

        if (migrationResult.migratedFunnels !== 2) {
            throw new Error(`Expected 2 migrated funnels, got ${migrationResult.migratedFunnels}`);
        }

        // Verify data in IndexedDB
        const migratedFunnels = await advancedFunnelStorage.listFunnels();
        if (migratedFunnels.length !== 2) {
            throw new Error('Migrated funnels count mismatch');
        }

        const funnel1 = await advancedFunnelStorage.getFunnel('test-funnel-1');
        if (!funnel1 || funnel1.name !== 'Test Funnel 1') {
            throw new Error('Migrated funnel data incorrect');
        }

        // Verify settings migration
        const settings1 = await advancedFunnelStorage.getFunnelSettings('test-funnel-1');
        if (settings1.name !== 'Custom Funnel 1') {
            throw new Error('Migrated settings data incorrect');
        }
    });

    it('Migration - Data Integrity Verification', async () => {
        const mockData = TestHelper.createMockFunnelData();
        TestHelper.setupMockLocalStorage(mockData);

        // Perform migration
        const migrationResult = await funnelDataMigration.performMigration();
        if (!migrationResult.success) {
            throw new Error('Migration failed');
        }

        // Verify all original data is preserved
        for (const originalFunnel of mockData.funnels) {
            const migratedFunnel = await advancedFunnelStorage.getFunnel(originalFunnel.id);
            if (!migratedFunnel) {
                throw new Error(`Funnel ${originalFunnel.id} not migrated`);
            }

            if (migratedFunnel.name !== originalFunnel.name ||
                migratedFunnel.status !== originalFunnel.status ||
                migratedFunnel.url !== originalFunnel.url) {
                throw new Error(`Funnel ${originalFunnel.id} data corrupted during migration`);
            }
        }

        // Verify settings integrity
        for (const [funnelId, originalSettings] of Object.entries(mockData.settings)) {
            const migratedSettings = await advancedFunnelStorage.getFunnelSettings(funnelId);

            if (migratedSettings.name !== originalSettings.name ||
                migratedSettings.pixel !== originalSettings.pixel) {
                throw new Error(`Settings for ${funnelId} corrupted during migration`);
            }
        }
    });

    // ============================================================================
    // ADAPTER COMPATIBILITY TESTS
    // ============================================================================

    it('Storage Adapter - Backward Compatibility', async () => {
        // Test that the old API still works
        const testFunnel = {
            id: 'compat-test-1',
            name: 'Compatibility Test',
            status: 'draft' as const,
            url: 'https://compat.com',
            updatedAt: new Date().toISOString()
        };

        // Use legacy sync methods (should work)
        funnelLocalStore.upsert(testFunnel);
        const retrieved = funnelLocalStore.get(testFunnel.id);

        if (!retrieved || retrieved.name !== testFunnel.name) {
            throw new Error('Legacy API compatibility broken');
        }

        // Test new async methods
        await funnelLocalStore.upsertAsync({
            ...testFunnel,
            name: 'Updated Compatibility Test'
        });

        const retrievedAsync = await funnelLocalStore.getAsync(testFunnel.id);
        if (!retrievedAsync || retrievedAsync.name !== 'Updated Compatibility Test') {
            throw new Error('Async API not working');
        }
    });

    it('Storage Adapter - Settings Compatibility', async () => {
        const funnelId = 'settings-compat-test';
        const testSettings = funnelLocalStore.defaultSettings();
        testSettings.name = 'Test Settings Compatibility';
        testSettings.pixel = 'compat-pixel-123';

        // Test legacy sync methods
        funnelLocalStore.saveSettings(funnelId, testSettings);
        const retrieved = funnelLocalStore.getSettings(funnelId);

        if (retrieved.name !== testSettings.name) {
            throw new Error('Legacy settings API compatibility broken');
        }

        // Test new async methods
        testSettings.name = 'Updated Test Settings';
        await funnelLocalStore.saveSettingsAsync(funnelId, testSettings);

        const retrievedAsync = await funnelLocalStore.getSettingsAsync(funnelId);
        if (retrievedAsync.name !== 'Updated Test Settings') {
            throw new Error('Async settings API not working');
        }
    });

    // ============================================================================
    // FALLBACK AND ERROR HANDLING TESTS
    // ============================================================================

    it('Fallback - LocalStorage When IndexedDB Fails', async () => {
        // This is difficult to test in a real environment, but we can test
        // that the fallback methods work correctly
        const testFunnel = {
            id: 'fallback-test-1',
            name: 'Fallback Test',
            status: 'draft' as const,
            url: 'https://fallback.com',
            updatedAt: new Date().toISOString()
        };

        // Set up localStorage data directly
        localStorage.setItem('qqcv_funnels', JSON.stringify([testFunnel]));

        // Test that sync methods can read it
        const retrieved = funnelLocalStore.get(testFunnel.id);
        if (!retrieved || retrieved.name !== testFunnel.name) {
            throw new Error('Fallback to localStorage failed');
        }

        const list = funnelLocalStore.list();
        if (list.length !== 1 || list[0].id !== testFunnel.id) {
            throw new Error('Fallback list method failed');
        }
    });

    // ============================================================================
    // PERFORMANCE AND STRESS TESTS
    // ============================================================================

    it('Performance - Large Dataset Migration', async () => {
        // Create a larger dataset for performance testing
        const largeFunnelList = Array.from({ length: 50 }, (_, i) => ({
            id: `perf-test-${i}`,
            name: `Performance Test Funnel ${i}`,
            status: i % 2 === 0 ? 'draft' as const : 'published' as const,
            url: `https://perf${i}.com`,
            updatedAt: new Date(Date.now() - i * 1000).toISOString()
        }));

        // Setup localStorage with large dataset
        localStorage.setItem('qqcv_funnels', JSON.stringify(largeFunnelList));

        // Add some settings for a subset
        for (let i = 0; i < 10; i++) {
            const settings = {
                ...funnelLocalStore.defaultSettings(),
                name: `Performance Settings ${i}`
            };
            localStorage.setItem(`qqcv_funnel_settings_perf-test-${i}`, JSON.stringify(settings));
        }

        // Perform migration and measure time
        const startTime = Date.now();
        const migrationResult = await funnelDataMigration.performMigration();
        const migrationTime = Date.now() - startTime;

        if (!migrationResult.success) {
            throw new Error(`Large dataset migration failed: ${migrationResult.errors.join(', ')}`);
        }

        if (migrationResult.migratedFunnels !== 50) {
            throw new Error(`Expected 50 migrated funnels, got ${migrationResult.migratedFunnels}`);
        }

        // Reasonable performance expectation (adjust based on requirements)
        if (migrationTime > 5000) { // 5 seconds
            console.warn(`Migration took ${migrationTime}ms for 50 funnels - consider optimization`);
        }

        console.log(`Performance: Migrated 50 funnels in ${migrationTime}ms`);
    });

    // ============================================================================
    // BACKUP AND RESTORE TESTS
    // ============================================================================

    it('Backup and Restore - Full Data Cycle', async () => {
        const mockData = TestHelper.createMockFunnelData();
        TestHelper.setupMockLocalStorage(mockData);

        // Migrate data
        await funnelDataMigration.performMigration();

        // Create backup
        const backupResult = await funnelLocalStore.createBackup();
        if (!backupResult.success || !backupResult.backup) {
            throw new Error(`Backup failed: ${backupResult.message}`);
        }

        // Clear all data
        await funnelDataMigration.resetAllData('RESET_ALL_FUNNEL_DATA');

        // Verify data is cleared
        const clearedList = await advancedFunnelStorage.listFunnels();
        if (clearedList.length > 0) {
            throw new Error('Data was not properly cleared');
        }

        // Restore from backup
        const restoreResult = await funnelLocalStore.restoreFromBackup(backupResult.backup);
        if (!restoreResult.success) {
            throw new Error(`Restore failed: ${restoreResult.message}`);
        }

        // Verify data is restored
        const restoredList = await advancedFunnelStorage.listFunnels();
        if (restoredList.length !== 2) {
            throw new Error('Restored data count mismatch');
        }

        const restoredFunnel = await advancedFunnelStorage.getFunnel('test-funnel-1');
        if (!restoredFunnel || restoredFunnel.name !== 'Test Funnel 1') {
            throw new Error('Restored funnel data incorrect');
        }
    });
});

export { TestHelper };
