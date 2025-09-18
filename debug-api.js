/**
 * 🔬 DIAGNÓSTICO SIMPLES DA API 
 * 
 * Script para testar diretamente a API e identificar problemas
 */

// Para testar no console do browser:
// 1. Abra http://localhost:8081/editor
// 2. Abra DevTools (F12) → Console
// 3. Cole este código e execute

console.log('🔬 INICIANDO DIAGNÓSTICO DA API...');

// Testar se conseguimos acessar a API
try {
    // Simular import da API (ajustar path se necessário)
    const { BlockPropertiesAPI } = window;

    if (!BlockPropertiesAPI) {
        console.error('❌ BlockPropertiesAPI não está disponível no window');
        console.log('ℹ️  Tentando acessar via import dinâmico...');

        import('./src/api/internal/BlockPropertiesAPI.js').then(module => {
            const api = module.BlockPropertiesAPI.getInstance();
            runTests(api);
        }).catch(err => {
            console.error('❌ Erro ao importar API:', err);
        });
    } else {
        const api = BlockPropertiesAPI.getInstance();
        runTests(api);
    }
} catch (error) {
    console.error('❌ Erro ao acessar API:', error);
}

async function runTests(api) {
    console.log('📝 Testando API com options-grid...');

    try {
        // 1. Testar getBlockDefinition
        const definition = await api.getBlockDefinition('options-grid');

        console.log('📊 Resultado do getBlockDefinition:');
        console.log('- Definition exists:', !!definition);
        console.log('- Name:', definition?.name);
        console.log('- Category:', definition?.category);
        console.log('- Properties count:', Object.keys(definition?.properties || {}).length);

        if (definition?.properties) {
            console.log('🔧 Primeiras 5 propriedades:');
            const props = Object.entries(definition.properties).slice(0, 5);
            props.forEach(([key, schema]) => {
                console.log(`- ${key}: ${schema.kind} (${schema.label})`);
            });
        }

        // 2. Testar getDefaultProperties
        const defaults = await api.getDefaultProperties('options-grid');
        console.log('📋 Default properties:');
        console.log('- Title:', defaults.title);
        console.log('- Columns:', defaults.columns);
        console.log('- ShowImages:', defaults.showImages);
        console.log('- Options length:', defaults.options?.length);

        // 3. Testar getAllBlockTypes
        const types = await api.getAllBlockTypes();
        console.log('📝 Total block types available:', types.length);
        console.log('- Contains options-grid:', types.includes('options-grid'));

    } catch (error) {
        console.error('❌ Erro nos testes:', error);
    }
}

console.log('✅ Diagnóstico preparado. Cole no console do browser.');