import {
    checkForLegacyData,
    executeMigrationWithConfirmation,
    cleanupLegacyData as migrationCleanup,
} from '@/lib/utils/dataMigration';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * 🔄 EXECUÇÃO DA MIGRAÇÃO DE DADOS LEGADOS
 * 
 * Script para migrar dados existentes no localStorage para o novo sistema contextual
 */

export const runDataMigration = async () => {
    appLogger.info('🚀 Iniciando migração de dados legados para sistema contextual...');

    try {
        // Usar a função de migração automática
        const result = await executeMigrationWithConfirmation();

        if (result.success) {
            appLogger.info('✅ Migração de dados concluída com sucesso!');
            appLogger.info('📊 Resumo da migração:');
            appLogger.info(`- Itens migrados: ${result.migratedItems}`);
            result.details.forEach(detail => appLogger.info(`  ${detail}`));
        } else {
            appLogger.error('❌ Erro durante a migração:', { data: [result.errors] });
        }

        return result;

    } catch (error) {
        appLogger.error('❌ Erro durante a migração:', { data: [error] });
        return {
            success: false,
            migratedItems: 0,
            errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
            details: [],
        };
    }
};

/**
 * 🧹 LIMPEZA DE DADOS LEGADOS (USE COM CUIDADO)
 */
export const cleanupLegacyData = () => {
    appLogger.info('🧹 Executando limpeza de dados legados...');

    try {
        const cleanedCount = migrationCleanup();
        appLogger.info(`✅ Limpeza concluída: ${cleanedCount} itens removidos`);
        return cleanedCount;
    } catch (error) {
        appLogger.error('❌ Erro durante limpeza:', { data: [error] });
        return 0;
    }
};

// Executar migração automaticamente se necessário
export const autoMigration = async () => {
    // Verificar se há dados legados para migrar
    const hasLegacyData = checkForLegacyData();

    if (hasLegacyData) {
        appLogger.info('🔍 Dados legados detectados - executando migração automática...');
        return await runDataMigration();
    } else {
        appLogger.info('✅ Nenhum dado legado encontrado - migração não necessária');
        return {
            success: true,
            migratedItems: 0,
            errors: [],
            details: ['Nenhum dado legado para migrar'],
            alreadyMigrated: true,
        };
    }
};
