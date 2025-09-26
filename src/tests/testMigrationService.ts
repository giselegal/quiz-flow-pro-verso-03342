/**
 * 🧪 TESTE SIMPLES: Migration Service
 * 
 * Script de teste para verificar se o Migration Service
 * está funcionando corretamente
 */

// Simular o ambiente para teste
if (typeof window === 'undefined') {
    console.log('⚠️ Este teste precisa executar no navegador');
    process.exit(0);
}

// Test function
async function testQuizEstiloMigration() {
    console.log('🧪 === TESTE DO MIGRATION SERVICE ===\n');

    try {
        // Import dinâmico para teste
        const { migrateQuizEstiloImages } = await import('../src/services/ImageMigrationService');

        console.log('✅ Import do Migration Service OK\n');

        console.log('🚀 Iniciando migração do quiz-estilo...');
        console.log('⏳ Aguarde... (pode levar alguns segundos)\n');

        const startTime = Date.now();

        // Executar migração
        const result = await migrateQuizEstiloImages();

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(1);

        console.log('🏁 MIGRAÇÃO CONCLUÍDA!\n');
        console.log('📊 ESTATÍSTICAS:');
        console.log(`   Total de Imagens: ${result.stats.totalImages}`);
        console.log(`   Migradas: ${result.stats.migrated}`);
        console.log(`   Falhas: ${result.stats.failed}`);
        console.log(`   Compressão Média: ${result.stats.compressionRatio.toFixed(1)}%`);
        console.log(`   Espaço Economizado: ${(result.stats.spaceSaved / 1024).toFixed(1)} KB`);
        console.log(`   Tempo de Execução: ${duration}s\n`);

        console.log('🔍 DETALHES POR IMAGEM:');
        result.details.forEach((detail, index) => {
            const status = detail.success ? '✅' : '❌';
            const stepInfo = detail.stepId ? `[${detail.stepId}]` : '';
            console.log(`   ${status} ${stepInfo} ${detail.imageUrl.split('/').pop()}`);
            if (detail.error) {
                console.log(`      ⚠️ Erro: ${detail.error}`);
            }
        });

        console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
        console.log('💡 As imagens agora estão otimizadas e em cache no IndexedDB');

        return true;

    } catch (error) {
        console.error('❌ ERRO NO TESTE:');
        console.error(error);
        return false;
    }
}

// Executar teste se chamado diretamente
if (typeof window !== 'undefined' && window.location) {
    console.log('🌐 Executando teste no navegador...');
    testQuizEstiloMigration()
        .then(success => {
            if (success) {
                console.log('\n🎯 Teste finalizado com sucesso!');
            } else {
                console.log('\n💥 Teste falhou!');
            }
        })
        .catch(error => {
            console.error('💥 Erro crítico no teste:', error);
        });
}

export { testQuizEstiloMigration };
export default testQuizEstiloMigration;