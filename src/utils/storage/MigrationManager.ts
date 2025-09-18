/**
 * 🔄 STORAGE MIGRATION UTILITY - Migração Segura do LocalStorage
 * 
 * Utilitário para migração segura e incremental dos dados do localStorage
 * para o novo sistema de armazenamento avançado
 */

import { advancedStorage } from './AdvancedStorageSystem';

export interface MigrationConfig {
    batchSize?: number;
    delay?: number;
    preserveOriginal?: boolean;
    dryRun?: boolean;
    logProgress?: boolean;
}

export interface MigrationResult {
    success: boolean;
    totalItems: number;
    migratedItems: number;
    skippedItems: number;
    errors: Array<{ key: string; error: string }>;
    duration: number;
}

export interface MigrationRule {
    pattern: string | RegExp;
    namespace: string;
    keyTransform?: (key: string) => string;
    valueTransform?: (value: any) => any;
    ttl?: number;
    compression?: boolean;
    tags?: string[];
}

/**
 * 🎯 MIGRATION MANAGER - Sistema de migração inteligente
 */
export class StorageMigrationManager {
    private static instance: StorageMigrationManager;
    private migrationRules: MigrationRule[] = [];

    static getInstance(): StorageMigrationManager {
        if (!StorageMigrationManager.instance) {
            StorageMigrationManager.instance = new StorageMigrationManager();
        }
        return StorageMigrationManager.instance;
    }

    private constructor() {
        this.setupDefaultRules();
    }

    /**
     * Configurar regras padrão de migração para o editor
     */
    private setupDefaultRules(): void {
        this.migrationRules = [
            // Configurações do editor
            {
                pattern: /^editor_config/,
                namespace: 'editor',
                keyTransform: (key) => key.replace('editor_', ''),
                ttl: 24 * 60 * 60 * 1000, // 24h
                compression: true,
                tags: ['config', 'editor']
            },

            // Dados de funil
            {
                pattern: /^funnel_/,
                namespace: 'funnel',
                keyTransform: (key) => key.replace('funnel_', ''),
                ttl: 7 * 24 * 60 * 60 * 1000, // 7 dias
                compression: true,
                tags: ['funnel', 'data']
            },

            // Configurações de funil específicas
            {
                pattern: /^funnel-settings-/,
                namespace: 'funnel-settings',
                keyTransform: (key) => key.replace('funnel-settings-', ''),
                ttl: 30 * 24 * 60 * 60 * 1000, // 30 dias
                compression: true,
                tags: ['settings', 'persistent']
            },

            // Dados de usuário
            {
                pattern: /^user_|^userName/,
                namespace: 'user',
                keyTransform: (key) => key.replace(/^user_/, '').replace('userName', 'name'),
                ttl: 30 * 24 * 60 * 60 * 1000, // 30 dias
                tags: ['user', 'essential']
            },

            // Resultados de quiz
            {
                pattern: /^quiz_|^quizResult|^userSelections/,
                namespace: 'quiz',
                keyTransform: (key) => key.replace(/^quiz_/, ''),
                ttl: 7 * 24 * 60 * 60 * 1000, // 7 dias
                tags: ['quiz', 'results']
            },

            // Cache temporário
            {
                pattern: /^cache_|^temp_/,
                namespace: 'cache',
                keyTransform: (key) => key.replace(/^(cache_|temp_)/, ''),
                ttl: 60 * 60 * 1000, // 1h
                tags: ['cache', 'temporary']
            },

            // Configurações de página
            {
                pattern: /^page-config-/,
                namespace: 'page-config',
                keyTransform: (key) => key.replace('page-config-', ''),
                ttl: 7 * 24 * 60 * 60 * 1000, // 7 dias
                compression: true,
                tags: ['page', 'config']
            },

            // Dados de A/B testing
            {
                pattern: /^ab_test/,
                namespace: 'ab-test',
                keyTransform: (key) => key.replace('ab_test_', ''),
                ttl: 30 * 24 * 60 * 60 * 1000, // 30 dias
                tags: ['ab-test', 'analytics']
            },

            // Tema e preferências
            {
                pattern: /^theme$/,
                namespace: 'user-preferences',
                keyTransform: () => 'theme',
                ttl: 365 * 24 * 60 * 60 * 1000, // 1 ano
                tags: ['preferences', 'ui']
            }
        ];
    }

    /**
     * Adicionar regra customizada de migração
     */
    addRule(rule: MigrationRule): void {
        this.migrationRules.push(rule);
    }

    /**
     * Executar migração completa com análise prévia
     */
    async migrate(config: MigrationConfig = {}): Promise<MigrationResult> {
        const startTime = Date.now();
        const result: MigrationResult = {
            success: true,
            totalItems: 0,
            migratedItems: 0,
            skippedItems: 0,
            errors: [],
            duration: 0
        };

        const {
            batchSize = 10,
            delay = 100,
            preserveOriginal = true,
            dryRun = false,
            logProgress = true
        } = config;

        try {
            // Análise prévia
            const analysis = await this.analyzeLocalStorage();
            result.totalItems = analysis.totalItems;

            if (logProgress) {
                console.log('🔍 Análise de migração:', analysis);
            }

            if (dryRun) {
                console.log('🧪 Modo DRY RUN - Nenhuma migração será executada');
                result.duration = Date.now() - startTime;
                return result;
            }

            // Migração em lotes
            const keys = Object.keys(localStorage);

            for (let i = 0; i < keys.length; i += batchSize) {
                const batch = keys.slice(i, i + batchSize);

                await Promise.all(
                    batch.map(async (key) => {
                        try {
                            await this.migrateItem(key, preserveOriginal);
                            result.migratedItems++;

                            if (logProgress && result.migratedItems % 20 === 0) {
                                console.log(`📦 Migrados ${result.migratedItems}/${result.totalItems} itens`);
                            }
                        } catch (error) {
                            result.errors.push({
                                key,
                                error: error instanceof Error ? error.message : 'Erro desconhecido'
                            });
                        }
                    })
                );

                // Delay entre lotes para não bloquear UI
                if (delay > 0 && i + batchSize < keys.length) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }

            result.success = result.errors.length === 0;
            result.duration = Date.now() - startTime;

            if (logProgress) {
                console.log('✅ Migração concluída:', result);
            }

        } catch (error) {
            result.success = false;
            result.errors.push({
                key: 'MIGRATION_ERROR',
                error: error instanceof Error ? error.message : 'Erro geral de migração'
            });
        }

        return result;
    }

    /**
     * Migrar um item específico do localStorage
     */
    private async migrateItem(key: string, preserveOriginal: boolean): Promise<void> {
        const rule = this.findMatchingRule(key);
        if (!rule) {
            // Sem regra específica, pular item
            return;
        }

        const rawValue = localStorage.getItem(key);
        if (!rawValue) return;

        try {
            // Parse do valor
            let value: any;
            try {
                value = JSON.parse(rawValue);
            } catch {
                value = rawValue; // Manter como string se não for JSON
            }

            // Aplicar transformações
            const transformedKey = rule.keyTransform ? rule.keyTransform(key) : key;
            const transformedValue = rule.valueTransform ? rule.valueTransform(value) : value;

            // Salvar no novo sistema
            await advancedStorage.setItem(transformedKey, transformedValue, {
                namespace: rule.namespace,
                ttl: rule.ttl,
                compress: rule.compression,
                tags: rule.tags
            });

            // Remover do localStorage se não preservar
            if (!preserveOriginal) {
                localStorage.removeItem(key);
            }

        } catch (error) {
            console.warn(`Falha ao migrar ${key}:`, error);
            throw error;
        }
    }

    /**
     * Encontrar regra de migração para uma chave
     */
    private findMatchingRule(key: string): MigrationRule | null {
        return this.migrationRules.find(rule => {
            if (rule.pattern instanceof RegExp) {
                return rule.pattern.test(key);
            }
            return key.includes(rule.pattern);
        }) || null;
    }

    /**
     * Analisar localStorage antes da migração
     */
    async analyzeLocalStorage(): Promise<{
        totalItems: number;
        totalSize: number;
        namespaceBreakdown: Record<string, number>;
        ruleMatches: Record<string, number>;
        unmatched: string[];
    }> {
        const analysis = {
            totalItems: localStorage.length,
            totalSize: 0,
            namespaceBreakdown: {} as Record<string, number>,
            ruleMatches: {} as Record<string, number>,
            unmatched: [] as string[]
        };

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;

            const value = localStorage.getItem(key) || '';
            analysis.totalSize += key.length + value.length;

            const rule = this.findMatchingRule(key);
            if (rule) {
                analysis.ruleMatches[rule.namespace] = (analysis.ruleMatches[rule.namespace] || 0) + 1;
                analysis.namespaceBreakdown[rule.namespace] = (analysis.namespaceBreakdown[rule.namespace] || 0) + value.length;
            } else {
                analysis.unmatched.push(key);
            }
        }

        return analysis;
    }

    /**
     * Validar migração comparando dados
     */
    async validateMigration(): Promise<{
        valid: boolean;
        issues: string[];
        comparison: Array<{
            key: string;
            namespace: string;
            original: any;
            migrated: any;
            match: boolean;
        }>;
    }> {
        const validation = {
            valid: true,
            issues: [] as string[],
            comparison: [] as any[]
        };

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;

            const rule = this.findMatchingRule(key);
            if (!rule) continue;

            try {
                const originalRaw = localStorage.getItem(key);
                const original = originalRaw ? JSON.parse(originalRaw) : originalRaw;

                const transformedKey = rule.keyTransform ? rule.keyTransform(key) : key;
                const migrated = await advancedStorage.getItem(transformedKey, rule.namespace);

                const match = JSON.stringify(original) === JSON.stringify(migrated);

                validation.comparison.push({
                    key,
                    namespace: rule.namespace,
                    original,
                    migrated,
                    match
                });

                if (!match) {
                    validation.valid = false;
                    validation.issues.push(`Mismatch em ${key}: original !== migrated`);
                }

            } catch (error) {
                validation.valid = false;
                validation.issues.push(`Erro ao validar ${key}: ${error}`);
            }
        }

        return validation;
    }

    /**
     * Limpar localStorage após migração bem-sucedida
     */
    async cleanupAfterMigration(whitelist: string[] = []): Promise<number> {
        let cleaned = 0;
        const keysToPreserve = [
            'theme', // Preservar tema por compatibilidade
            ...whitelist
        ];

        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (!key) continue;

            if (keysToPreserve.includes(key)) {
                continue;
            }

            const rule = this.findMatchingRule(key);
            if (rule) {
                // Verificar se foi migrado com sucesso
                const transformedKey = rule.keyTransform ? rule.keyTransform(key) : key;
                const migrated = await advancedStorage.getItem(transformedKey, rule.namespace);

                if (migrated !== null) {
                    localStorage.removeItem(key);
                    cleaned++;
                }
            }
        }

        console.log(`🧹 Cleanup concluído: ${cleaned} itens removidos do localStorage`);
        return cleaned;
    }
}

// ========================================
// FUNÇÕES DE CONVENIÊNCIA
// ========================================

export const migrationManager = StorageMigrationManager.getInstance();

/**
 * Executar migração rápida com configurações padrão
 */
export const quickMigrate = async (
    preserveOriginal: boolean = true,
    logProgress: boolean = true
): Promise<MigrationResult> => {
    return migrationManager.migrate({
        preserveOriginal,
        logProgress,
        batchSize: 15,
        delay: 50
    });
};

/**
 * Executar análise de migração sem migrar dados
 */
export const analyzeMigration = async () => {
    return migrationManager.analyzeLocalStorage();
};

/**
 * Executar migração em modo seguro (dry run first)
 */
export const safeMigrate = async (): Promise<{
    analysis: any;
    dryRun: MigrationResult;
    migration: MigrationResult | null;
    validation: any;
}> => {
    // 1. Análise
    console.log('📊 Analisando localStorage...');
    const analysis = await migrationManager.analyzeLocalStorage();

    // 2. Dry run
    console.log('🧪 Executando dry run...');
    const dryRun = await migrationManager.migrate({ dryRun: true });

    // 3. Migração real apenas se dry run foi bem-sucedido
    let migration = null;
    let validation = null;

    if (dryRun.success) {
        console.log('✅ Dry run bem-sucedido, executando migração...');
        migration = await migrationManager.migrate({ preserveOriginal: true });

        if (migration.success) {
            console.log('🔍 Validando migração...');
            validation = await migrationManager.validateMigration();
        }
    }

    return { analysis, dryRun, migration, validation };
};

export default {
    migrationManager,
    quickMigrate,
    analyzeMigration,
    safeMigrate
};
