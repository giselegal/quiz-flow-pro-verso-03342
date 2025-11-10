/**
 * 🔄 MIGRATION SCRIPTS - Scripts de Migração Automática
 * 
 * Scripts para facilitar a migração do localStorage para o novo sistema
 */

import { migrationManager, quickMigrate } from '../storage/MigrationManager';
import { advancedStorage } from '../storage/AdvancedStorageSystem';
import { StorageService } from '@/services/core/StorageService';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Script 1: Análise detalhada do localStorage atual
 */
export async function analyzeCurrentStorage() {
    appLogger.info('🔍 Analisando localStorage atual...');

    try {
        const analysis = await migrationManager.analyzeLocalStorage();

        appLogger.info('📊 Análise Completa:');
        appLogger.info(`  • Total de itens: ${analysis.totalItems}`);
        appLogger.info(`  • Tamanho total: ${(analysis.totalSize / 1024).toFixed(2)} KB`);

        appLogger.info('\n📋 Correspondências por regra:');
        Object.entries(analysis.ruleMatches).forEach(([rule, count]) => {
            appLogger.info(`  • ${rule}: ${count} itens`);
        });

        if (analysis.unmatched.length > 0) {
            appLogger.info('\n❓ Itens não reconhecidos:');
            analysis.unmatched.forEach(key => appLogger.info(`  • ${key}`));
        }

        return analysis;
    } catch (error) {
        appLogger.error('❌ Erro na análise:', { data: [error] });
        throw error;
    }
}

/**
 * Script 2: Migração completa com validação
 */
export async function performFullMigration() {
    appLogger.info('🚀 Iniciando migração completa...');

    try {
        // Etapa 1: Análise inicial
        const analysis = await analyzeCurrentStorage();

        if (analysis.totalItems === 0) {
            appLogger.info('ℹ️ Nenhum dado encontrado para migração');
            return { success: true, message: 'Nada para migrar' };
        }

        // Etapa 2: Dry run
        appLogger.info('\n🧪 Executando simulação (dry run)...');
        const dryRun = await migrationManager.migrate({
            dryRun: true,
            logProgress: true,
        });

        if (!dryRun.success) {
            appLogger.error('❌ Falha na simulação:', { data: [dryRun.errors] });
            throw new Error('Dry run falhou');
        }

        appLogger.info(`✅ Simulação ok - ${dryRun.migratedItems} itens podem ser migrados`);

        // Etapa 3: Migração real (preservando originais)
        appLogger.info('\n📦 Executando migração real...');
        const migration = await quickMigrate(true, true); // preserveOriginal=true, logProgress=true

        if (!migration.success) {
            appLogger.error('❌ Falha na migração:', { data: [migration.errors] });
            throw new Error('Migração falhou');
        }

        appLogger.info(`✅ Migração concluída - ${migration.migratedItems} itens migrados`);

        // Etapa 4: Validação
        appLogger.info('\n🔍 Validando dados migrados...');
        const validation = await migrationManager.validateMigration();

        if (!validation.valid) {
            appLogger.error('❌ Validação falhou:', { data: [validation.issues] });
            throw new Error('Dados migrados são inválidos');
        }

        appLogger.info('✅ Validação concluída - dados íntegros');

        // Etapa 5: Métricas finais
        const metrics = await advancedStorage.getMetrics();
        appLogger.info('\n📈 Métricas do novo sistema:');
        appLogger.info(`  • Itens armazenados: ${metrics.itemCount}`);
        appLogger.info(`  • Tamanho total: ${(metrics.totalSize / 1024).toFixed(2)} KB`);
        appLogger.info(`  • Namespaces: ${Object.keys(metrics.namespaces).join(', ')}`);

        return {
            success: true,
            analysis,
            migration,
            validation,
            metrics,
        };

    } catch (error) {
        appLogger.error('💥 Erro na migração completa:', { data: [error] });
        throw error;
    }
}

/**
 * Script 3: Limpeza segura após migração validada
 */
export async function performSafeCleanup(preserveKeys: string[] = []) {
    appLogger.info('🧹 Iniciando limpeza segura...');

    try {
        // Verificar se migração foi bem-sucedida
        const validation = await migrationManager.validateMigration();

        if (!validation.valid) {
            appLogger.warn('⚠️ Migração não validada - abortando limpeza');
            return { success: false, message: 'Migração não validada' };
        }

        // Lista padrão de itens a preservar
        const defaultPreserve = [
            'theme', // Tema global
            'language', // Idioma
            'user_preferences', // Preferências globais
            'auth_token', // Token de autenticação
            'last_visit', // Última visita
            ...preserveKeys,
        ];

        appLogger.info(`🛡️ Preservando: ${defaultPreserve.join(', ')}`);

        // Executar limpeza
        const cleaned = await migrationManager.cleanupAfterMigration(defaultPreserve);

        appLogger.info(`✅ Limpeza concluída - ${cleaned} itens removidos`);

        // Verificar localStorage final
        const remaining = Object.keys(localStorage).filter(key =>
            !defaultPreserve.includes(key),
        );

        if (remaining.length > 0) {
            appLogger.info(`ℹ️ Itens restantes: ${remaining.join(', ')}`);
        }

        return {
            success: true,
            cleaned,
            remaining,
            preserved: defaultPreserve,
        };

    } catch (error) {
        appLogger.error('❌ Erro na limpeza:', { data: [error] });
        throw error;
    }
}

/**
 * Script 4: Rollback de emergência
 */
export async function emergencyRollback() {
    appLogger.info('🚨 Executando rollback de emergência...');

    try {
        // Verificar se há backup no localStorage original
        const backupKeys = Object.keys(localStorage).filter(key =>
            key.startsWith('MIGRATED_'),
        );

        if (backupKeys.length === 0) {
            appLogger.warn('⚠️ Nenhum backup encontrado para rollback');
            return { success: false, message: 'Sem backups disponíveis' };
        }

        appLogger.info(`🔄 Encontrados ${backupKeys.length} itens para restaurar`);

        // Limpar namespace migrado
        await advancedStorage.cleanup({ namespace: 'editor' });
        await advancedStorage.cleanup({ namespace: 'funnel-settings' });
        await advancedStorage.cleanup({ namespace: 'user' });

        appLogger.info('✅ Dados migrados removidos');

        // Restaurar originais
        let restored = 0;
        for (const backupKey of backupKeys) {
            const originalKey = backupKey.replace('MIGRATED_', '');
            const data = localStorage.getItem(backupKey);

            if (data) {
                localStorage.setItem(originalKey, data);
                localStorage.removeItem(backupKey);
                restored++;
            }
        }

        appLogger.info(`✅ Rollback concluído - ${restored} itens restaurados`);

        return {
            success: true,
            restored,
        };

    } catch (error) {
        appLogger.error('💥 Erro no rollback:', { data: [error] });
        throw error;
    }
}

/**
 * Script 5: Teste de integridade completa
 */
export async function runIntegrityTest() {
    appLogger.info('🔬 Executando teste de integridade...');

    try {
        const results = {
            storageTest: false,
            migrationTest: false,
            contextTest: false,
            cleanupTest: false,
        };

        // Teste 1: Storage básico
        appLogger.info('1️⃣ Testando operações básicas...');
        await advancedStorage.setItem('test-integrity', { test: true }, { namespace: 'test' });
        const retrieved = await advancedStorage.getItem('test-integrity', 'test');
        results.storageTest = !!(retrieved && (retrieved as any).test === true);
        await advancedStorage.deleteItem('test-integrity', 'test');

        // Teste 2: Migração
        appLogger.info('2️⃣ Testando migração...');
        StorageService.safeSetJSON('test_migrate', { value: 'test' });
        const migrationResult = await quickMigrate(true, false);
        results.migrationTest = migrationResult.success;

        // Teste 3: Limpeza
        appLogger.info('3️⃣ Testando limpeza...');
        const cleanResult = await advancedStorage.cleanup({ namespace: 'test' });
        results.cleanupTest = cleanResult >= 0;

        // Teste 4: Métricas
        appLogger.info('4️⃣ Testando métricas...');
        const metrics = await advancedStorage.getMetrics();
        results.contextTest = metrics && typeof metrics.itemCount === 'number';

        appLogger.info('\n📋 Resultados dos testes:');
        Object.entries(results).forEach(([test, passed]) => {
            appLogger.info(`  ${passed ? '✅' : '❌'} ${test}`);
        });

        const allPassed = Object.values(results).every(Boolean);
        appLogger.info(`\n${allPassed ? '🎉' : '⚠️'} Integridade: ${allPassed ? 'OK' : 'PROBLEMAS DETECTADOS'}`);

        return { success: allPassed, results };

    } catch (error) {
        appLogger.error('💥 Erro no teste de integridade:', { data: [error] });
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
}

// Função de conveniência para executar migração completa
export async function runCompleteMigrationWorkflow() {
    appLogger.info('🎯 INICIANDO WORKFLOW COMPLETO DE MIGRAÇÃO');
    appLogger.info('='.repeat(50));

    try {
        // 1. Teste de integridade inicial
        appLogger.info('\n1️⃣ TESTE DE INTEGRIDADE INICIAL');
        const integrityTest = await runIntegrityTest();
        if (!integrityTest.success) {
            throw new Error('Sistema não passou no teste de integridade');
        }

        // 2. Análise do estado atual
        appLogger.info('\n2️⃣ ANÁLISE DO ESTADO ATUAL');
        const analysis = await analyzeCurrentStorage();

        // 3. Migração completa
        appLogger.info('\n3️⃣ MIGRAÇÃO COMPLETA');
        const migration = await performFullMigration();

        // 4. Aguardar confirmação para limpeza (simulado)
        appLogger.info('\n4️⃣ LIMPEZA SEGURA');
        appLogger.info('ℹ️ Aguardando 5 segundos antes da limpeza (simular confirmação)...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        const cleanup = await performSafeCleanup();

        // 5. Teste final
        appLogger.info('\n5️⃣ TESTE FINAL');
        const finalTest = await runIntegrityTest();

        appLogger.info(`\n${  '='.repeat(50)}`);
        appLogger.info('🏁 WORKFLOW CONCLUÍDO');
        appLogger.info(`  • Itens analisados: ${analysis.totalItems}`);
        appLogger.info(`  • Itens migrados: ${migration.migration?.migratedItems || 0}`);
        appLogger.info(`  • Itens limpos: ${cleanup.cleaned}`);
        appLogger.info(`  • Status final: ${finalTest.success ? '✅ SUCESSO' : '❌ FALHA'}`);

        return {
            success: finalTest.success,
            analysis,
            migration,
            cleanup,
            finalTest,
        };

    } catch (error) {
        appLogger.error('\n💥 FALHA NO WORKFLOW:', { data: [error] });
        appLogger.info('🚨 Execute emergencyRollback() se necessário');
        throw error;
    }
}
