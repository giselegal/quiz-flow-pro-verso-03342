// Script para console do browser - análise completa de registry vs tipos solicitados
// Cole no console do navegador na página /editor

(function() {
    console.group('🔬 ANÁLISE COMPLETA DO REGISTRY');
    
    try {
        // Acessar o registry através das props do React DevTools ou window
        const registryModule = window.__ENHANCED_BLOCK_REGISTRY__;
        
        if (!registryModule) {
            console.warn('Registry não encontrado no window. Tentando acessar via módulo...');
            console.log('💡 Execute este código APÓS a página carregar completamente');
            return;
        }
        
        console.log('📋 Chaves disponíveis no registry:');
        const keys = Object.keys(registryModule);
        keys.forEach((key, index) => {
            console.log(`${index + 1}. "${key}"`);
        });
        
        console.log('\n🔍 Testando tipos específicos que falharam:');
        const testTypes = ['quiz-intro-header', 'text', 'image', 'button'];
        
        testTypes.forEach(type => {
            const exists = registryModule[type];
            console.log(`${exists ? '✅' : '❌'} "${type}": ${exists ? 'EXISTE' : 'NÃO EXISTE'}`);
            
            if (exists) {
                console.log(`   Tipo: ${typeof exists}`);
                console.log(`   Nome: ${exists.name || exists.displayName || 'Sem nome'}`);
            }
        });
        
        console.log('\n🔎 Procurando variações dos tipos:');
        testTypes.forEach(type => {
            console.log(`\n🎯 Variações de "${type}":`);
            keys.filter(key => key.includes(type) || type.includes(key)).forEach(match => {
                console.log(`   - "${match}"`);
            });
        });
        
    } catch (error) {
        console.error('❌ Erro na análise:', error);
        console.log('💡 O registry pode não estar exposto no window. Tente novamente após a página carregar.');
    }
    
    console.groupEnd();
})();

// Expor registry no window para análise (execute este código primeiro se o registry não estiver disponível)
console.log('💡 Se o registry não for encontrado, execute este código para expô-lo:');
console.log('window.__ENHANCED_BLOCK_REGISTRY__ = require("@/components/editor/blocks/EnhancedBlockRegistry").ENHANCED_BLOCK_REGISTRY;');