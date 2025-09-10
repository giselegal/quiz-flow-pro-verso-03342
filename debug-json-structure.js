// Vou executar esse script no console para verificar a estrutura atual dos JSONs
console.log('🔍 ANÁLISE DA ESTRUTURA ATUAL DOS JSONS DE FUNIS');
console.log('='.repeat(60));

// Verificar estrutura atual no localStorage
const funnelKeys = Object.keys(localStorage).filter(key =>
    key.includes('funnel') || key.includes('unified_funnel')
);

if (funnelKeys.length > 0) {
    const sampleKey = funnelKeys[0];
    const sampleData = localStorage.getItem(sampleKey);

    if (sampleData) {
        try {
            const parsed = JSON.parse(sampleData);
            console.log('📋 ESTRUTURA ATUAL DE UM FUNIL:');
            console.log('Chave:', sampleKey);
            console.log('Estrutura:', Object.keys(parsed));
            console.log('Dados completos:', parsed);

            // Verificar se já tem navegação/flow
            if (parsed.flow) {
                console.log('✅ JÁ TEM: Configuração de flow');
                console.log('Flow:', parsed.flow);
            } else {
                console.log('❌ NÃO TEM: Configuração de flow');
            }

            if (parsed.navigation) {
                console.log('✅ JÁ TEM: Configuração de navigation');
                console.log('Navigation:', parsed.navigation);
            } else {
                console.log('❌ NÃO TEM: Configuração de navigation');
            }

            if (parsed.steps) {
                console.log('✅ JÁ TEM: Steps');
                console.log('Steps:', parsed.steps);
            } else if (parsed.pages) {
                console.log('✅ JÁ TEM: Pages (equivalente a steps)');
                console.log('Pages:', parsed.pages);
            } else if (parsed.blocks) {
                console.log('✅ JÁ TEM: Blocks (podem ser convertidos em steps)');
                console.log('Blocks:', parsed.blocks);
            } else {
                console.log('❌ NÃO TEM: Steps/Pages/Blocks');
            }

        } catch (e) {
            console.log('❌ Erro ao parsear JSON:', e);
        }
    }
} else {
    console.log('❌ Nenhum funil encontrado no localStorage');
}
