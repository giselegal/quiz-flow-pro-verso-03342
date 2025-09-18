import {
    checkForLegacyData,
    executeMigrationWithConfirmation,
    cleanupLegacyData as migrationCleanup
} from '@/utils/dataMigration';

/**
 * 🔄 EXECUÇÃO DA MIGRAÇÃO DE DADOS LEGADOS
 * 
 * Script para migrar dados existentes no localStorage para o novo sistema contextual
 */

export const runDataMigration = async () => {
    console.log('🚀 Iniciando migração de dados legados para sistema contextual...');

    try {
        // Usar a função de migração automática
        const result = await executeMigrationWithConfirmation();

        if (result.success) {
            console.log('✅ Migração de dados concluída com sucesso!');
            console.log('📊 Resumo da migração:');
            console.log(`- Itens migrados: ${result.migratedItems}`);
            result.details.forEach(detail => console.log(`  ${detail}`));
        } else {
            console.error('❌ Erro durante a migração:', result.errors);
        }

        return result;

    } catch (error) {
        console.error('❌ Erro durante a migração:', error);
        return {
            success: false,
            migratedItems: 0,
            errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
            details: []
        };
    }
};

/**
 * 🧹 LIMPEZA DE DADOS LEGADOS (USE COM CUIDADO)
 */
export const cleanupLegacyData = () => {
    console.log('🧹 Executando limpeza de dados legados...');

    try {
        const cleanedCount = migrationCleanup();
        console.log(`✅ Limpeza concluída: ${cleanedCount} itens removidos`);
        return cleanedCount;
    } catch (error) {
        console.error('❌ Erro durante limpeza:', error);
        return 0;
    }
};

// Executar migração automaticamente se necessário
export const autoMigration = async () => {
    // Verificar se há dados legados para migrar
    const hasLegacyData = checkForLegacyData();

    if (hasLegacyData) {
        console.log('🔍 Dados legados detectados - executando migração automática...');
        return await runDataMigration();
    } else {
        console.log('✅ Nenhum dado legado encontrado - migração não necessária');
        return {
            success: true,
            migratedItems: 0,
            errors: [],
            details: ['Nenhum dado legado para migrar'],
            alreadyMigrated: true
        };
    }
};
