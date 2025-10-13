// @ts-nocheck
/**
 * 🧪 FUNNEL STORAGE MIGRATION TESTS (Vitest)
 * Refatorado para usar describe/it com expect, eliminando runner customizado.
 */
import { describe, it, beforeEach, expect } from 'vitest';
import { advancedFunnelStorage } from '../AdvancedFunnelStorage';
import { funnelDataMigration } from '../FunnelDataMigration';
import { funnelLocalStore } from '../FunnelStorageAdapter';

// Utilidades compartilhadas
const createMockFunnelData = () => ({
    funnels: [
        { id: 'test-funnel-1', name: 'Test Funnel 1', status: 'draft' as const, url: 'https://test1.com', updatedAt: '2024-01-01T10:00:00.000Z' },
        { id: 'test-funnel-2', name: 'Test Funnel 2', status: 'published' as const, url: 'https://test2.com', updatedAt: '2024-01-02T10:00:00.000Z' }
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
            custom: { collectUserName: true, variables: [{ key: 'test1', label: 'Test Variable 1' }, { key: 'test2', label: 'Test Variable 2' }] }
        }
    }
});

const setupMockLocalStorage = (data: ReturnType<typeof createMockFunnelData>) => {
    localStorage.setItem('qqcv_funnels', JSON.stringify(data.funnels));
    Object.entries(data.settings).forEach(([id, settings]) => {
        localStorage.setItem(`qqcv_funnel_settings_${id}`, JSON.stringify(settings));
    });
};

const clearAll = async () => {
    try { await advancedFunnelStorage.clearAllData(); } catch { /* ignore */ }
    // limpar chaves qqcv_
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('qqcv_') || k.startsWith('QQCV_'))) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
};

describe('AdvancedFunnelStorage - CRUD básico', () => {
    beforeEach(async () => { await clearAll(); });
    it('cria, lê, atualiza e remove funil', async () => {
        const funnel = { id: 'crud-test-1', name: 'CRUD Test Funnel', status: 'draft' as const, url: 'https://crud-test.com' };
        const created = await advancedFunnelStorage.upsertFunnel(funnel);
        expect(created.id).toBe(funnel.id);
        const retrieved = await advancedFunnelStorage.getFunnel(funnel.id);
        expect(retrieved?.name).toBe(funnel.name);
        await advancedFunnelStorage.upsertFunnel({ ...funnel, name: 'Updated CRUD Test Funnel' });
        const updated = await advancedFunnelStorage.getFunnel(funnel.id);
        expect(updated?.name).toBe('Updated CRUD Test Funnel');
        const list = await advancedFunnelStorage.listFunnels();
        expect(list.some(f => f.id === funnel.id)).toBe(true);
        await advancedFunnelStorage.deleteFunnel(funnel.id);
        const deleted = await advancedFunnelStorage.getFunnel(funnel.id);
        expect(deleted).toBeFalsy();
    });
});

describe('AdvancedFunnelStorage - Settings', () => {
    beforeEach(async () => { await clearAll(); });
    it('salva e recupera settings', async () => {
        const funnelId = 'settings-test-1';
        const testSettings = { name: 'Settings Test', url: 'https://settings-test.com', seo: { title: 'Test SEO', description: 'Test Description' }, pixel: 'test-pixel', token: 'test-token', utm: { source: 'test-source' }, webhooks: [{ platform: 'test', url: 'https://test-webhook.com' }], custom: { collectUserName: false, variables: [{ key: 'test-var', label: 'Test Variable' }] } };
        const saved = await advancedFunnelStorage.saveFunnelSettings(funnelId, testSettings as any);
        expect(saved.name).toBe(testSettings.name);
        const retrieved = await advancedFunnelStorage.getFunnelSettings(funnelId);
        expect(retrieved.pixel).toBe(testSettings.pixel);
    });
});

describe('Migração LocalStorage -> IndexedDB', () => {
    beforeEach(async () => { await clearAll(); });
    it('migra funis e settings', async () => {
        const mock = createMockFunnelData();
        setupMockLocalStorage(mock);
        const migration = await funnelDataMigration.performMigration();
        expect(migration.success).toBe(true);
        expect(migration.migratedFunnels).toBe(2);
        const migrated = await advancedFunnelStorage.listFunnels();
        expect(migrated.length).toBe(2);
        const f1 = await advancedFunnelStorage.getFunnel('test-funnel-1');
        expect(f1?.name).toBe('Test Funnel 1');
        const s1 = await advancedFunnelStorage.getFunnelSettings('test-funnel-1');
        expect(s1.name).toBe('Custom Funnel 1');
    });
    it('preserva integridade dos dados', async () => {
        const mock = createMockFunnelData();
        setupMockLocalStorage(mock);
        const migration = await funnelDataMigration.performMigration();
        expect(migration.success).toBe(true);
        for (const original of mock.funnels) {
            const migrated = await advancedFunnelStorage.getFunnel(original.id);
            expect(migrated).toBeTruthy();
            expect(migrated?.name).toBe(original.name);
            expect(migrated?.status).toBe(original.status);
            expect(migrated?.url).toBe(original.url);
        }
        for (const [id, settings] of Object.entries(mock.settings)) {
            const migratedSettings = await advancedFunnelStorage.getFunnelSettings(id);
            expect(migratedSettings.name).toBe(settings.name);
            expect(migratedSettings.pixel).toBe(settings.pixel);
        }
    });
});

describe('Adapter Compatibility', () => {
    beforeEach(async () => { await clearAll(); });
    it('mantém API legada e async', async () => {
        const funnel = { id: 'compat-test-1', name: 'Compatibility Test', status: 'draft' as const, url: 'https://compat.com', updatedAt: new Date().toISOString() };
        funnelLocalStore.upsert(funnel as any);
        const legacy = funnelLocalStore.get(funnel.id);
        expect(legacy?.name).toBe('Compatibility Test');
        await funnelLocalStore.upsertAsync({ ...funnel, name: 'Updated Compatibility Test' } as any);
        const asyncF = await funnelLocalStore.getAsync(funnel.id);
        expect(asyncF?.name).toBe('Updated Compatibility Test');
    });
    it('mantém compatibilidade de settings', async () => {
        const id = 'settings-compat-test';
        const settings = funnelLocalStore.defaultSettings();
        settings.name = 'Test Settings Compatibility';
        settings.pixel = 'compat-pixel-123';
        funnelLocalStore.saveSettings(id, settings as any);
        const legacy = funnelLocalStore.getSettings(id);
        expect(legacy.name).toBe('Test Settings Compatibility');
        settings.name = 'Updated Test Settings';
        await funnelLocalStore.saveSettingsAsync(id, settings as any);
        const asyncSettings = await funnelLocalStore.getSettingsAsync(id);
        expect(asyncSettings.name).toBe('Updated Test Settings');
    });
});

describe('Fallback localStorage', () => {
    beforeEach(async () => { await clearAll(); });
    it('lê dados legado quando IndexedDB falhar (simulado)', () => {
        const testFunnel = { id: 'fallback-test-1', name: 'Fallback Test', status: 'draft' as const, url: 'https://fallback.com', updatedAt: new Date().toISOString() };
        localStorage.setItem('qqcv_funnels', JSON.stringify([testFunnel]));
        const retrieved = funnelLocalStore.get(testFunnel.id);
        expect(retrieved?.name).toBe('Fallback Test');
        const list = funnelLocalStore.list();
        expect(list.length).toBe(1);
        expect(list[0].id).toBe(testFunnel.id);
    });
});

describe('Performance (smoke)', () => {
    beforeEach(async () => { await clearAll(); });
    it('migra 50 funis em tempo razoável', async () => {
        const data = Array.from({ length: 50 }, (_, i) => ({ id: `perf-test-${i}`, name: `Performance Test Funnel ${i}`, status: i % 2 === 0 ? 'draft' as const : 'published' as const, url: `https://perf${i}.com`, updatedAt: new Date(Date.now() - i * 1000).toISOString() }));
        localStorage.setItem('qqcv_funnels', JSON.stringify(data));
        for (let i = 0; i < 10; i++) {
            const s = { ...funnelLocalStore.defaultSettings(), name: `Performance Settings ${i}` } as any;
            localStorage.setItem(`qqcv_funnel_settings_perf-test-${i}`, JSON.stringify(s));
        }
        const start = Date.now();
        const migration = await funnelDataMigration.performMigration();
        expect(migration.success).toBe(true);
        expect(migration.migratedFunnels).toBe(50);
        const duration = Date.now() - start;
        expect(duration).toBeLessThan(6000); // margem segura
    });
});

describe('Backup e Restore', () => {
    beforeEach(async () => { await clearAll(); });
    it('cria backup, reseta e restaura', async () => {
        const mock = createMockFunnelData();
        setupMockLocalStorage(mock);
        await funnelDataMigration.performMigration();
        const backup = await funnelLocalStore.createBackup();
        expect(backup.success).toBe(true);
        expect(backup.backup).toBeTruthy();
        await funnelDataMigration.resetAllData('RESET_ALL_FUNNEL_DATA');
        const cleared = await advancedFunnelStorage.listFunnels();
        expect(cleared.length).toBe(0);
        const restore = await funnelLocalStore.restoreFromBackup(backup.backup!);
        expect(restore.success).toBe(true);
        const restored = await advancedFunnelStorage.listFunnels();
        expect(restored.length).toBe(2);
        const f1 = await advancedFunnelStorage.getFunnel('test-funnel-1');
        expect(f1?.name).toBe('Test Funnel 1');
    });
});

// Nota: a interface anterior exportava runMigrationTests; não é mais necessária.
export { }; 
