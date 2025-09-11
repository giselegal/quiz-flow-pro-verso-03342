/**
 * 🔄 MIGRATION SCRIPTS - Scripts de Migração Automática
 * 
 * Scripts para facilitar a migração do localStorage para o novo sistema
 */

import { migrationManager, quickMigrate } from '../storage/MigrationManager';
import { advancedStorage } from '../storage/AdvancedStorageSystem';

/**
 * Script 1: Análise detalhada do localStorage atual
 */
export async function analyzeCurrentStorage() {
    console.log('🔍 Analisando localStorage atual...');

    try {
        const analysis = await migrationManager.analyzeLocalStorage();

        console.log('📊 Análise Completa:');
        console.log(`  • Total de itens: ${analysis.totalItems}`);
        console.log(`  • Tamanho total: ${(analysis.totalSize / 1024).toFixed(2)} KB`);

        console.log('\n📋 Correspondências por regra:');
        Object.entries(analysis.ruleMatches).forEach(([rule, count]) => {
            console.log(`  • ${rule}: ${count} itens`);
        });

        if (analysis.unmatched.length > 0) {
            console.log('\n❓ Itens não reconhecidos:');
            analysis.unmatched.forEach(key => console.log(`  • ${key}`));
        }

        return analysis;
    } catch (error) {
        console.error('❌ Erro na análise:', error);
        throw error;
    }
}

/**
 * Script 2: Migração completa com validação
 */
export async function performFullMigration() {
    console.log('🚀 Iniciando migração completa...');

    try {
        // Etapa 1: Análise inicial
        const analysis = await analyzeCurrentStorage();

        if (analysis.totalItems === 0) {
            console.log('ℹ️ Nenhum dado encontrado para migração');
            return { success: true, message: 'Nada para migrar' };
        }

        // Etapa 2: Dry run
        console.log('\n🧪 Executando simulação (dry run)...');
        const dryRun = await migrationManager.migrate({
            dryRun: true,
            logProgress: true
        });

        if (!dryRun.success) {
            console.error('❌ Falha na simulação:', dryRun.errors);
            throw new Error('Dry run falhou');
        }

        console.log(`✅ Simulação ok - ${dryRun.migratedItems} itens podem ser migrados`);

        // Etapa 3: Migração real (preservando originais)
        console.log('\n📦 Executando migração real...');
        const migration = await quickMigrate(true, true); // preserveOriginal=true, logProgress=true

        if (!migration.success) {
            console.error('❌ Falha na migração:', migration.errors);
            throw new Error('Migração falhou');
        }

        console.log(`✅ Migração concluída - ${migration.migratedItems} itens migrados`);

        // Etapa 4: Validação
        console.log('\n🔍 Validando dados migrados...');
        const validation = await migrationManager.validateMigration();

        if (!validation.valid) {
            console.error('❌ Validação falhou:', validation.issues);
            throw new Error('Dados migrados são inválidos');
        }

        console.log('✅ Validação concluída - dados íntegros');

        // Etapa 5: Métricas finais
        const metrics = await advancedStorage.getMetrics();
        console.log('\n📈 Métricas do novo sistema:');
        console.log(`  • Itens armazenados: ${metrics.itemCount}`);
        console.log(`  • Tamanho total: ${(metrics.totalSize / 1024).toFixed(2)} KB`);
        console.log(`  • Namespaces: ${Object.keys(metrics.namespaces).join(', ')}`);

        return {
            success: true,
            analysis,
            migration,
            validation,
            metrics
        };

    } catch (error) {
        console.error('💥 Erro na migração completa:', error);
        throw error;
    }
}

/**
 * Script 3: Limpeza segura após migração validada
 */
export async function performSafeCleanup(preserveKeys: string[] = []) {
    console.log('🧹 Iniciando limpeza segura...');

    try {
        // Verificar se migração foi bem-sucedida
        const validation = await migrationManager.validateMigration();

        if (!validation.valid) {
            console.warn('⚠️ Migração não validada - abortando limpeza');
            return { success: false, message: 'Migração não validada' };
        }

        // Lista padrão de itens a preservar
        const defaultPreserve = [
            'theme', // Tema global
            'language', // Idioma
            'user_preferences', // Preferências globais
            'auth_token', // Token de autenticação
            'last_visit', // Última visita
            ...preserveKeys
        ];

        console.log(`🛡️ Preservando: ${defaultPreserve.join(', ')}`);

        // Executar limpeza
        const cleaned = await migrationManager.cleanupAfterMigration(defaultPreserve);

        console.log(`✅ Limpeza concluída - ${cleaned} itens removidos`);

        // Verificar localStorage final
        const remaining = Object.keys(localStorage).filter(key =>
            !defaultPreserve.includes(key)
        );

        if (remaining.length > 0) {
            console.log(`ℹ️ Itens restantes: ${remaining.join(', ')}`);
        }

        return {
            success: true,
            cleaned,
            remaining,
            preserved: defaultPreserve
        };

    } catch (error) {
        console.error('❌ Erro na limpeza:', error);
        throw error;
    }
}

/**
 * Script 4: Rollback de emergência
 */
export async function emergencyRollback() {
    console.log('🚨 Executando rollback de emergência...');

    try {
        // Verificar se há backup no localStorage original
        const backupKeys = Object.keys(localStorage).filter(key =>
            key.startsWith('MIGRATED_')
        );

        if (backupKeys.length === 0) {
            console.warn('⚠️ Nenhum backup encontrado para rollback');
            return { success: false, message: 'Sem backups disponíveis' };
        }

        console.log(`🔄 Encontrados ${backupKeys.length} itens para restaurar`);

        // Limpar namespace migrado
        await advancedStorage.cleanup({ namespace: 'editor' });
        await advancedStorage.cleanup({ namespace: 'funnel-settings' });
        await advancedStorage.cleanup({ namespace: 'user' });

        console.log('✅ Dados migrados removidos');

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

        console.log(`✅ Rollback concluído - ${restored} itens restaurados`);

        return {
            success: true,
            restored
        };

    } catch (error) {
        console.error('💥 Erro no rollback:', error);
        throw error;
    }
}

/**
 * Script 5: Teste de integridade completa
 */
export async function runIntegrityTest() {
    console.log('🔬 Executando teste de integridade...');

    try {
        const results = {
            storageTest: false,
            migrationTest: false,
            contextTest: false,
            cleanupTest: false
        };

        // Teste 1: Storage básico
        console.log('1️⃣ Testando operações básicas...');
        await advancedStorage.setItem('test-integrity', { test: true }, { namespace: 'test' });
        const retrieved = await advancedStorage.getItem('test-integrity', 'test');
        results.storageTest = !!(retrieved && (retrieved as any).test === true);
        await advancedStorage.deleteItem('test-integrity', 'test');

        // Teste 2: Migração
        console.log('2️⃣ Testando migração...');
        localStorage.setItem('test_migrate', JSON.stringify({ value: 'test' }));
        const migrationResult = await quickMigrate(true, false);
        results.migrationTest = migrationResult.success;

        // Teste 3: Limpeza
        console.log('3️⃣ Testando limpeza...');
        const cleanResult = await advancedStorage.cleanup({ namespace: 'test' });
        results.cleanupTest = cleanResult >= 0;

        // Teste 4: Métricas
        console.log('4️⃣ Testando métricas...');
        const metrics = await advancedStorage.getMetrics();
        results.contextTest = metrics && typeof metrics.itemCount === 'number';

        console.log('\n📋 Resultados dos testes:');
        Object.entries(results).forEach(([test, passed]) => {
            console.log(`  ${passed ? '✅' : '❌'} ${test}`);
        });

        const allPassed = Object.values(results).every(Boolean);
        console.log(`\n${allPassed ? '🎉' : '⚠️'} Integridade: ${allPassed ? 'OK' : 'PROBLEMAS DETECTADOS'}`);

        return { success: allPassed, results };

    } catch (error) {
        console.error('💥 Erro no teste de integridade:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
}

// Função de conveniência para executar migração completa
export async function runCompleteMigrationWorkflow() {
    console.log('🎯 INICIANDO WORKFLOW COMPLETO DE MIGRAÇÃO');
    console.log('='.repeat(50));

    try {
        // 1. Teste de integridade inicial
        console.log('\n1️⃣ TESTE DE INTEGRIDADE INICIAL');
        const integrityTest = await runIntegrityTest();
        if (!integrityTest.success) {
            throw new Error('Sistema não passou no teste de integridade');
        }

        // 2. Análise do estado atual
        console.log('\n2️⃣ ANÁLISE DO ESTADO ATUAL');
        const analysis = await analyzeCurrentStorage();

        // 3. Migração completa
        console.log('\n3️⃣ MIGRAÇÃO COMPLETA');
        const migration = await performFullMigration();

        // 4. Aguardar confirmação para limpeza (simulado)
        console.log('\n4️⃣ LIMPEZA SEGURA');
        console.log('ℹ️ Aguardando 5 segundos antes da limpeza (simular confirmação)...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        const cleanup = await performSafeCleanup();

        // 5. Teste final
        console.log('\n5️⃣ TESTE FINAL');
        const finalTest = await runIntegrityTest();

        console.log('\n' + '='.repeat(50));
        console.log('🏁 WORKFLOW CONCLUÍDO');
        console.log(`  • Itens analisados: ${analysis.totalItems}`);
        console.log(`  • Itens migrados: ${migration.migration?.migratedItems || 0}`);
        console.log(`  • Itens limpos: ${cleanup.cleaned}`);
        console.log(`  • Status final: ${finalTest.success ? '✅ SUCESSO' : '❌ FALHA'}`);

        return {
            success: finalTest.success,
            analysis,
            migration,
            cleanup,
            finalTest
        };

    } catch (error) {
        console.error('\n💥 FALHA NO WORKFLOW:', error);
        console.log('🚨 Execute emergencyRollback() se necessário');
        throw error;
    }
}
