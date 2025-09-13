/**
 * 🧪 STORAGE SYSTEM TEST SUITE - Testes do Sistema de Armazenamento
 * 
 * Testes unitários e de integração para o novo sistema de storage
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AdvancedStorageManager, advancedStorage } from '../AdvancedStorageSystem';
import { migrationManager, quickMigrate } from '../MigrationManager';

// Mock do IndexedDB para testes
const mockIndexedDB = {
    open: vi.fn(),
    deleteDatabase: vi.fn()
};

// Mock do BroadcastChannel
class MockBroadcastChannel {
    name: string;
    onmessage: ((event: MessageEvent) => void) | null = null;

    constructor(name: string) {
        this.name = name;
    }

    postMessage(_data: any) {
        // Simular mensagem para outros canais
    }

    addEventListener(type: string, listener: EventListener) {
        if (type === 'message') {
            this.onmessage = listener as any;
        }
    }

    close() { }
}

// Setup global mocks
global.indexedDB = mockIndexedDB as any;
global.BroadcastChannel = MockBroadcastChannel as any;

describe('AdvancedStorageManager', () => {
    beforeEach(() => {
        // Reset localStorage mock
        Object.defineProperty(window, 'localStorage', {
            value: {
                data: {} as Record<string, string>,
                getItem: vi.fn((key: string) => window.localStorage.data[key] || null),
                setItem: vi.fn((key: string, value: string) => {
                    window.localStorage.data[key] = value;
                }),
                removeItem: vi.fn((key: string) => {
                    delete window.localStorage.data[key];
                }),
                clear: vi.fn(() => {
                    window.localStorage.data = {};
                }),
                get length() {
                    return Object.keys(this.data).length;
                },
                key: vi.fn((index: number) => Object.keys(window.localStorage.data)[index])
            },
            writable: true
        });

        // Initialize storage manager
        AdvancedStorageManager.getInstance();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Basic Storage Operations', () => {
        it('should set and get items correctly', async () => {
            const testData = { message: 'Hello World', count: 42 };

            const setResult = await advancedStorage.setItem('test-key', testData, {
                namespace: 'test'
            });

            expect(setResult).toBe(true);

            const retrievedData = await advancedStorage.getItem('test-key', 'test');
            expect(retrievedData).toEqual(testData);
        });

        it('should handle namespace isolation', async () => {
            await advancedStorage.setItem('same-key', 'data1', { namespace: 'ns1' });
            await advancedStorage.setItem('same-key', 'data2', { namespace: 'ns2' });

            const data1 = await advancedStorage.getItem('same-key', 'ns1');
            const data2 = await advancedStorage.getItem('same-key', 'ns2');

            expect(data1).toBe('data1');
            expect(data2).toBe('data2');
        });

        it('should apply TTL correctly', async () => {
            const shortTTL = 100; // 100ms

            await advancedStorage.setItem('ttl-test', 'temp-data', {
                namespace: 'test',
                ttl: shortTTL
            });

            // Should exist immediately
            let data = await advancedStorage.getItem('ttl-test', 'test');
            expect(data).toBe('temp-data');

            // Wait for TTL expiration
            await new Promise(resolve => setTimeout(resolve, shortTTL + 50));

            // Should be expired
            data = await advancedStorage.getItem('ttl-test', 'test');
            expect(data).toBe(null);
        });
    });

    describe('Compression', () => {
        it('should compress large data automatically', async () => {
            const largeData = 'x'.repeat(5000); // 5KB string

            const setResult = await advancedStorage.setItem('large-data', largeData, {
                namespace: 'test',
                compress: true
            });

            expect(setResult).toBe(true);

            const retrievedData = await advancedStorage.getItem('large-data', 'test');
            expect(retrievedData).toBe(largeData);
        });

        it('should not compress small data', async () => {
            const smallData = 'small data';

            const setResult = await advancedStorage.setItem('small-data', smallData, {
                namespace: 'test',
                compress: true
            });

            expect(setResult).toBe(true);

            const retrievedData = await advancedStorage.getItem('small-data', 'test');
            expect(retrievedData).toBe(smallData);
        });
    });

    describe('Cleanup Operations', () => {
        beforeEach(async () => {
            // Setup test data
            await advancedStorage.setItem('recent', 'data1', { namespace: 'test' });
            await advancedStorage.setItem('old', 'data2', {
                namespace: 'test',
                ttl: 1 // 1ms TTL - should expire immediately
            });
            await advancedStorage.setItem('essential', 'important', {
                namespace: 'test',
                tags: ['essential']
            });
        });

        it('should clean up expired items', async () => {
            // Wait for TTL expiration
            await new Promise(resolve => setTimeout(resolve, 10));

            const cleaned = await advancedStorage.cleanup({
                namespace: 'test'
            });

            expect(cleaned).toBeGreaterThan(0);
        });

        it('should preserve essential items', async () => {
            await advancedStorage.cleanup({
                namespace: 'test',
                preserveEssential: true
            });

            const essentialData = await advancedStorage.getItem('essential', 'test');
            expect(essentialData).toBe('important');
        });
    });

    describe('Metrics and Monitoring', () => {
        beforeEach(async () => {
            await advancedStorage.setItem('item1', 'data1', { namespace: 'test' });
            await advancedStorage.setItem('item2', 'data2', { namespace: 'other' });
        });

        it('should provide storage metrics', async () => {
            const metrics = await advancedStorage.getMetrics();

            expect(metrics).toHaveProperty('itemCount');
            expect(metrics).toHaveProperty('totalSize');
            expect(metrics).toHaveProperty('namespaces');
            expect(metrics.itemCount).toBeGreaterThanOrEqual(2);
        });

        it('should track namespace usage', async () => {
            const metrics = await advancedStorage.getMetrics();

            expect(metrics.namespaces).toHaveProperty('test');
            expect(metrics.namespaces).toHaveProperty('other');
        });
    });
});

describe('MigrationManager', () => {
    beforeEach(() => {
        // Setup localStorage with test data
        localStorage.setItem('editor_config', JSON.stringify({ theme: 'dark' }));
        localStorage.setItem('funnel-settings-123', JSON.stringify({ name: 'Test Funnel' }));
        localStorage.setItem('user_name', 'Test User');
        localStorage.setItem('theme', 'light');
        localStorage.setItem('unrelated_data', 'should not migrate');
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('Migration Analysis', () => {
        it('should analyze localStorage correctly', async () => {
            const analysis = await migrationManager.analyzeLocalStorage();

            expect(analysis.totalItems).toBeGreaterThan(0);
            expect(analysis.ruleMatches).toHaveProperty('editor');
            expect(analysis.ruleMatches).toHaveProperty('funnel-settings');
            expect(analysis.ruleMatches).toHaveProperty('user');
        });

        it('should identify unmatched items', async () => {
            const analysis = await migrationManager.analyzeLocalStorage();

            expect(analysis.unmatched).toContain('unrelated_data');
        });
    });

    describe('Migration Execution', () => {
        it('should perform dry run without changes', async () => {
            const initialCount = localStorage.length;

            const result = await migrationManager.migrate({
                dryRun: true,
                logProgress: false
            });

            expect(result.success).toBe(true);
            expect(localStorage.length).toBe(initialCount); // No changes in dry run
        });

        it('should migrate data correctly', async () => {
            const result = await quickMigrate(true, false); // preserveOriginal=true, logProgress=false

            expect(result.success).toBe(true);
            expect(result.migratedItems).toBeGreaterThan(0);
            expect(result.errors).toHaveLength(0);
        });

        it('should handle migration errors gracefully', async () => {
            // Simulate storage failure
            vi.spyOn(advancedStorage, 'setItem').mockRejectedValue(new Error('Storage full'));

            const result = await migrationManager.migrate({
                preserveOriginal: true,
                logProgress: false
            });

            expect(result.success).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });

    describe('Migration Validation', () => {
        it('should validate migrated data', async () => {
            // First migrate
            await quickMigrate(true, false);

            // Then validate
            const validation = await migrationManager.validateMigration();

            expect(validation).toHaveProperty('valid');
            expect(validation).toHaveProperty('comparison');
            expect(validation.comparison.length).toBeGreaterThan(0);
        });
    });

    describe('Safe Cleanup', () => {
        it('should cleanup after successful migration', async () => {
            const initialCount = localStorage.length;

            // Migrate first
            await quickMigrate(true, false);

            // Then cleanup
            const cleaned = await migrationManager.cleanupAfterMigration();

            expect(cleaned).toBeGreaterThan(0);
            expect(localStorage.length).toBeLessThan(initialCount);
        });

        it('should preserve whitelisted items', async () => {
            localStorage.setItem('important_setting', 'preserve me');

            await quickMigrate(true, false);
            await migrationManager.cleanupAfterMigration(['important_setting']);

            expect(localStorage.getItem('important_setting')).toBe('preserve me');
        });
    });
});

describe('Integration Tests', () => {
    describe('Storage + Migration Integration', () => {
        it('should perform complete migration workflow', async () => {
            // Setup test data
            localStorage.setItem('editor_config', JSON.stringify({
                blocks: [{ id: '1', type: 'text' }],
                theme: 'dark'
            }));

            // Analyze
            const analysis = await migrationManager.analyzeLocalStorage();
            expect(analysis.totalItems).toBeGreaterThan(0);

            // Migrate
            const migration = await quickMigrate(true, false);
            expect(migration.success).toBe(true);

            // Verify migrated data
            const migratedData = await advancedStorage.getItem('config', 'editor') as any;
            expect(migratedData).toHaveProperty('blocks');
            expect(migratedData.theme).toBe('dark');

            // Cleanup
            const cleaned = await migrationManager.cleanupAfterMigration();
            expect(cleaned).toBeGreaterThan(0);
        });
    });

    describe('Error Recovery', () => {
        it('should fallback to localStorage when IndexedDB fails', async () => {
            // Mock IndexedDB failure
            vi.spyOn(mockIndexedDB, 'open').mockImplementation(() => {
                throw new Error('IndexedDB not available');
            });

            const result = await advancedStorage.setItem('test', 'data', {
                namespace: 'test'
            });

            expect(result).toBe(true); // Should succeed with localStorage fallback

            const retrieved = await advancedStorage.getItem('test', 'test');
            expect(retrieved).toBe('data');
        });
    });
});

describe('Performance Tests', () => {
    it('should handle large datasets efficiently', async () => {
        const startTime = performance.now();

        // Create large dataset
        const largeDataset = Array.from({ length: 100 }, (_, i) => ({
            id: i,
            data: 'x'.repeat(1000) // 1KB per item
        }));

        // Batch insert
        const promises = largeDataset.map((item, index) =>
            advancedStorage.setItem(`item-${index}`, item, {
                namespace: 'performance-test',
                compress: true
            })
        );

        await Promise.all(promises);

        const endTime = performance.now();
        const duration = endTime - startTime;

        // Should complete within reasonable time (adjust threshold as needed)
        expect(duration).toBeLessThan(5000); // 5 seconds max
    });

    it('should maintain performance with many namespaces', async () => {
        const namespaces = Array.from({ length: 50 }, (_, i) => `ns-${i}`);

        const startTime = performance.now();

        // Insert data in multiple namespaces
        const promises = namespaces.map(namespace =>
            advancedStorage.setItem('data', { namespace }, { namespace })
        );

        await Promise.all(promises);

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(2000); // 2 seconds max
    });
});
