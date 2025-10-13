// @ts-nocheck
/**
 * 🔄 STORAGE MIGRATION SERVICE - Migrador de localStorage para IndexedDB
 * 
 * Migra dados existentes do localStorage para IndexedDB de forma segura:
 * - Backup automático antes da migração
 * - Validação de integridade dos dados
 * - Rollback em caso de erro
 * - Versionamento e compatibilidade
 * - Migração incremental e progressiva
 */

import { indexedDBStorage, IndexedDBStorageService } from './IndexedDBStorageService';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface MigrationResult {
    success: boolean;
    migratedItems: number;
    skippedItems: number;
    errorItems: number;
    totalSize: number;
    duration: number;
    errors: MigrationError[];
}

export interface MigrationError {
    key: string;
    error: string;
    data?: any;
}

export interface MigrationConfig {
    batchSize: number;
    validateData: boolean;
    createBackup: boolean;
    removeOriginal: boolean;
    dryRun: boolean;
}

export interface BackupData {
    timestamp: number;
    version: string;
    items: Record<string, any>;
    metadata: {
        userAgent: string;
        url: string;
        totalItems: number;
        totalSize: number;
    };
}

// ============================================================================
// PADRÕES DE DADOS PARA MIGRAÇÃO
// ============================================================================

const DATA_PATTERNS = {
    // Dados de funil
    funnel: {
        patterns: [
            /^funnel-core-funnel-(.+)$/,
            /^unified_funnel:(.+)$/,
            /^funnel_(.+)$/,
            /^qqcv_funnel_(.+)$/
        ],
        targetStore: 'funnels',
        extractId: (key: string): string => {
            for (const pattern of DATA_PATTERNS.funnel.patterns) {
                const match = key.match(pattern);
                if (match) return match[1];
            }
            return key;
        }
    },

    // Configurações de funil
    settings: {
        patterns: [
            /^funnel-settings-(.+)$/,
            /^funnel-core-settings-(.+)$/,
            /^qqcv_funnel_settings_(.+)$/
        ],
        targetStore: 'settings',
        extractId: (key: string): string => {
            for (const pattern of DATA_PATTERNS.settings.patterns) {
                const match = key.match(pattern);
                if (match) return match[1];
            }
            return key;
        }
    },

    // Cache geral
    cache: {
        patterns: [
            /^funnel-core-cache-(.+)$/,
            /^editor-(.+)$/,
            /^template-(.+)$/,
            /^theme$/,
            /^user(.+)$/
        ],
        targetStore: 'cache',
        extractId: (key: string): string => key
    },

    // Metadados
    metadata: {
        patterns: [
            /^funnel-core-metadata$/,
            /^funnel-core-index$/,
            /^app-metadata$/,
            /^storage-version$/
        ],
        targetStore: 'metadata',
        extractId: (key: string): string => key
    }
};

// ============================================================================
// CLASSE PRINCIPAL DE MIGRAÇÃO
// ============================================================================

export class StorageMigrationService {
    private static instance: StorageMigrationService;
    private config: MigrationConfig = {
        batchSize: 50,
        validateData: true,
        createBackup: true,
        removeOriginal: false, // Segurança: não remove por padrão
        dryRun: false
    };

    static getInstance(): StorageMigrationService {
        if (!StorageMigrationService.instance) {
            StorageMigrationService.instance = new StorageMigrationService();
        }
        return StorageMigrationService.instance;
    }

    // ============================================================================
    // CONFIGURAÇÃO
    // ============================================================================

    setConfig(config: Partial<MigrationConfig>): void {
        this.config = { ...this.config, ...config };
        console.log('🔧 Configuração da migração atualizada:', this.config);
    }

    // ============================================================================
    // MIGRAÇÃO PRINCIPAL
    // ============================================================================

    async migrate(): Promise<MigrationResult> {
        const startTime = Date.now();
        const result: MigrationResult = {
            success: false,
            migratedItems: 0,
            skippedItems: 0,
            errorItems: 0,
            totalSize: 0,
            duration: 0,
            errors: []
        };

        try {
            console.log('🚀 Iniciando migração do localStorage para IndexedDB...');

            // Verificar disponibilidade do IndexedDB
            if (!await this.checkIndexedDBAvailability()) {
                throw new Error('IndexedDB não está disponível');
            }

            // Criar backup se solicitado
            if (this.config.createBackup) {
                await this.createBackup();
            }

            // Obter dados do localStorage
            const localStorageData = this.getLocalStorageData();
            console.log(`📊 ${localStorageData.length} itens encontrados no localStorage`);

            if (localStorageData.length === 0) {
                result.success = true;
                console.log('✅ Nenhum dado para migrar');
                return result;
            }

            // Migrar em lotes
            const batches = this.createBatches(localStorageData, this.config.batchSize);

            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                console.log(`🔄 Processando lote ${i + 1}/${batches.length} (${batch.length} itens)`);

                const batchResult = await this.migrateBatch(batch);

                result.migratedItems += batchResult.migrated;
                result.skippedItems += batchResult.skipped;
                result.errorItems += batchResult.errors.length;
                result.totalSize += batchResult.size;
                result.errors.push(...batchResult.errors);

                // Pausa entre lotes para não bloquear a UI
                await this.delay(100);
            }

            // Validar migração
            if (this.config.validateData) {
                await this.validateMigration(localStorageData);
            }

            // Remover dados originais se solicitado e migração bem-sucedida
            if (this.config.removeOriginal && !this.config.dryRun && result.errorItems === 0) {
                await this.cleanupLocalStorage(localStorageData);
            }

            result.success = result.errorItems === 0;
            result.duration = Date.now() - startTime;

            console.log('✅ Migração concluída:', {
                migrados: result.migratedItems,
                ignorados: result.skippedItems,
                erros: result.errorItems,
                duração: `${result.duration}ms`
            });

            return result;

        } catch (error) {
            console.error('❌ Erro na migração:', error);
            result.success = false;
            result.duration = Date.now() - startTime;
            result.errors.push({
                key: 'MIGRATION_SYSTEM',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });

            return result;
        }
    }

    // ============================================================================
    // VERIFICAÇÕES E VALIDAÇÕES
    // ============================================================================

    private async checkIndexedDBAvailability(): Promise<boolean> {
        try {
            if (!('indexedDB' in window)) {
                console.error('❌ IndexedDB não suportado neste navegador');
                return false;
            }

            // Tentar inicializar o serviço
            await indexedDBStorage.initialize();
            return true;

        } catch (error) {
            console.error('❌ Erro ao verificar IndexedDB:', error);
            return false;
        }
    }

    async checkMigrationNeeded(): Promise<{
        needed: boolean;
        localStorageItems: number;
        indexedDBItems: number;
        estimatedSize: number;
    }> {
        try {
            const localStorageData = this.getLocalStorageData();
            const localStorageItems = localStorageData.length;
            const estimatedSize = localStorageData.reduce((acc, item) => {
                return acc + (item.key.length + JSON.stringify(item.value).length);
            }, 0);

            // Verificar dados existentes no IndexedDB
            const stats = await indexedDBStorage.getStats();
            const indexedDBItems = stats.totalItems;

            const needed = localStorageItems > 0 && indexedDBItems === 0;

            return {
                needed,
                localStorageItems,
                indexedDBItems,
                estimatedSize
            };

        } catch (error) {
            console.error('❌ Erro ao verificar necessidade de migração:', error);
            return {
                needed: false,
                localStorageItems: 0,
                indexedDBItems: 0,
                estimatedSize: 0
            };
        }
    }

    // ============================================================================
    // BACKUP E RESTAURAÇÃO
    // ============================================================================

    private async createBackup(): Promise<string> {
        console.log('💾 Criando backup do localStorage...');

        const items: Record<string, any> = {};
        let totalSize = 0;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                const value = localStorage.getItem(key);
                items[key] = value;
                totalSize += key.length + (value?.length || 0);
            }
        }

        const backupData: BackupData = {
            timestamp: Date.now(),
            version: '1.0.0',
            items,
            metadata: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                totalItems: Object.keys(items).length,
                totalSize
            }
        };

        const backupString = JSON.stringify(backupData);

        // Salvar backup no IndexedDB
        await indexedDBStorage.set('metadata', 'localStorage_backup', backupData, {
            namespace: 'migration',
            tags: ['backup', 'localStorage']
        });

        console.log(`✅ Backup criado: ${Object.keys(items).length} itens (${Math.round(totalSize / 1024)}KB)`);
        return backupString;
    }

    async restoreFromBackup(): Promise<boolean> {
        try {
            console.log('🔄 Restaurando backup do localStorage...');

            const backupData = await indexedDBStorage.get<BackupData>('metadata', 'localStorage_backup');

            if (!backupData) {
                console.error('❌ Backup não encontrado');
                return false;
            }

            // Limpar localStorage atual
            localStorage.clear();

            // Restaurar dados
            let restoredCount = 0;
            for (const [key, value] of Object.entries(backupData.items)) {
                try {
                    localStorage.setItem(key, value as string);
                    restoredCount++;
                } catch (error) {
                    console.warn(`⚠️ Erro ao restaurar chave ${key}:`, error);
                }
            }

            console.log(`✅ Backup restaurado: ${restoredCount}/${backupData.metadata.totalItems} itens`);
            return true;

        } catch (error) {
            console.error('❌ Erro na restauração:', error);
            return false;
        }
    }

    // ============================================================================
    // PROCESSAMENTO DE DADOS
    // ============================================================================

    private getLocalStorageData(): Array<{ key: string, value: any }> {
        const data: Array<{ key: string, value: any }> = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                try {
                    const value = localStorage.getItem(key);
                    if (value !== null) {
                        // Tentar parsear como JSON
                        let parsedValue;
                        try {
                            parsedValue = JSON.parse(value);
                        } catch {
                            parsedValue = value; // Manter como string se não for JSON
                        }

                        data.push({ key, value: parsedValue });
                    }
                } catch (error) {
                    console.warn(`⚠️ Erro ao ler chave ${key}:`, error);
                }
            }
        }

        return data;
    }

    private createBatches<T>(items: T[], batchSize: number): T[][] {
        const batches: T[][] = [];
        for (let i = 0; i < items.length; i += batchSize) {
            batches.push(items.slice(i, i + batchSize));
        }
        return batches;
    }

    private async migrateBatch(batch: Array<{ key: string, value: any }>): Promise<{
        migrated: number;
        skipped: number;
        errors: MigrationError[];
        size: number;
    }> {
        const result = {
            migrated: 0,
            skipped: 0,
            errors: [] as MigrationError[],
            size: 0
        };

        for (const item of batch) {
            try {
                const migration = this.classifyData(item.key, item.value);

                if (!migration) {
                    result.skipped++;
                    continue;
                }

                if (this.config.dryRun) {
                    console.log(`🔍 [DRY RUN] Migraria: ${item.key} → ${migration.store}/${migration.id}`);
                    result.migrated++;
                    continue;
                }

                // Validar dados se solicitado
                if (this.config.validateData && !this.validateData(migration.store, item.value)) {
                    result.errors.push({
                        key: item.key,
                        error: 'Dados inválidos'
                    });
                    continue;
                }

                // Migrar para IndexedDB
                const success = await indexedDBStorage.set(
                    migration.store,
                    migration.id,
                    item.value,
                    {
                        namespace: migration.namespace,
                        tags: ['migrated', 'localStorage'],
                        originalKey: item.key
                    }
                );

                if (success) {
                    result.migrated++;
                    result.size += JSON.stringify(item.value).length;
                    console.log(`✅ Migrado: ${item.key} → ${migration.store}/${migration.id}`);
                } else {
                    result.errors.push({
                        key: item.key,
                        error: 'Falha ao salvar no IndexedDB'
                    });
                }

            } catch (error) {
                result.errors.push({
                    key: item.key,
                    error: error instanceof Error ? error.message : 'Erro desconhecido',
                    data: item.value
                });
            }
        }

        return result;
    }

    private classifyData(key: string, value: any): {
        store: string;
        id: string;
        namespace: string;
    } | null {
        // Verificar cada padrão
        for (const [category, config] of Object.entries(DATA_PATTERNS)) {
            for (const pattern of config.patterns) {
                if (pattern.test(key)) {
                    return {
                        store: config.targetStore,
                        id: config.extractId(key),
                        namespace: category
                    };
                }
            }
        }

        // Dados não classificados são ignorados por segurança
        console.log(`⚠️ Chave não reconhecida ignorada: ${key}`);
        return null;
    }

    private validateData(store: string, data: any): boolean {
        try {
            // Validações básicas por store
            switch (store) {
                case 'funnels':
                    return this.validateFunnelData(data);
                case 'settings':
                    return this.validateSettingsData(data);
                case 'cache':
                    return true; // Cache aceita qualquer formato
                case 'metadata':
                    return typeof data === 'object';
                default:
                    return true;
            }
        } catch (error) {
            console.warn('⚠️ Erro na validação:', error);
            return false;
        }
    }

    private validateFunnelData(data: any): boolean {
        return (
            typeof data === 'object' &&
            data !== null &&
            (data.id || data.funnelId || typeof data.name === 'string')
        );
    }

    private validateSettingsData(data: any): boolean {
        return (
            typeof data === 'object' &&
            data !== null
        );
    }

    // ============================================================================
    // VALIDAÇÃO PÓS-MIGRAÇÃO
    // ============================================================================

    private async validateMigration(originalData: Array<{ key: string, value: any }>): Promise<void> {
        console.log('🔍 Validando migração...');

        let validatedCount = 0;
        let errorCount = 0;

        for (const item of originalData) {
            const migration = this.classifyData(item.key, item.value);
            if (!migration) continue;

            try {
                const migratedData = await indexedDBStorage.get(migration.store, migration.id);

                if (JSON.stringify(migratedData) === JSON.stringify(item.value)) {
                    validatedCount++;
                } else {
                    console.error(`❌ Validação falhou para: ${item.key}`);
                    errorCount++;
                }

            } catch (error) {
                console.error(`❌ Erro na validação de ${item.key}:`, error);
                errorCount++;
            }
        }

        console.log(`✅ Validação concluída: ${validatedCount} válidos, ${errorCount} erros`);
    }

    // ============================================================================
    // LIMPEZA
    // ============================================================================

    private async cleanupLocalStorage(originalData: Array<{ key: string, value: any }>): Promise<void> {
        console.log('🧹 Removendo dados originais do localStorage...');

        let removedCount = 0;

        for (const item of originalData) {
            const migration = this.classifyData(item.key, item.value);
            if (migration) {
                try {
                    localStorage.removeItem(item.key);
                    removedCount++;
                } catch (error) {
                    console.warn(`⚠️ Erro ao remover ${item.key}:`, error);
                }
            }
        }

        console.log(`✅ ${removedCount} itens removidos do localStorage`);
    }

    // ============================================================================
    // UTILITÁRIOS
    // ============================================================================

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ============================================================================
    // ROLLBACK DE EMERGÊNCIA
    // ============================================================================

    async rollback(): Promise<boolean> {
        try {
            console.log('🔄 Executando rollback da migração...');

            // Restaurar backup
            const restored = await this.restoreFromBackup();
            if (!restored) {
                throw new Error('Falha na restauração do backup');
            }

            // Limpar dados migrados do IndexedDB
            const stores = ['funnels', 'settings', 'cache', 'metadata'];
            for (const store of stores) {
                await indexedDBStorage.clear(store);
            }

            console.log('✅ Rollback executado com sucesso');
            return true;

        } catch (error) {
            console.error('❌ Erro no rollback:', error);
            return false;
        }
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const storageMigrationService = StorageMigrationService.getInstance();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Executa migração com configuração padrão
 */
export async function migrateToIndexedDB(): Promise<MigrationResult> {
    return await storageMigrationService.migrate();
}

/**
 * Verifica se migração é necessária
 */
export async function checkMigrationStatus() {
    return await storageMigrationService.checkMigrationNeeded();
}

/**
 * Executa migração em modo dry-run (apenas simulação)
 */
export async function previewMigration(): Promise<MigrationResult> {
    storageMigrationService.setConfig({ dryRun: true });
    return await storageMigrationService.migrate();
}
