// 🚀 EXECUÇÃO AUTOMÁTICA DO DIAGNÓSTICO
// Este script simula e demonstra como executar o diagnóstico

console.log('🔍 EXECUTANDO OPÇÃO 1: DIAGNÓSTICO AUTOMÁTICO');
console.log('===============================================');

// Simular dados típicos que podem estar no localStorage
const simulatedLocalStorage = {
    // Dados legados (que precisam migração)
    'funnel-abc123': '{"id":"abc123","name":"Meu Funil Teste","steps":[]}',
    'funnels-list': '["abc123","def456"]',
    'editor:funnelId': 'abc123',
    'quiz_config': '{"currentStep":1,"totalSteps":5}',
    'quizResponses': '{"step1":"Resposta A","step2":"Resposta B"}',
    'template-template1': '{"id":"template1","name":"Template de Quiz"}',

    // Dados contextuais (corretos)
    'editor-funnel-xyz789': '{"id":"xyz789","name":"Funil Editor","context":"editor"}',
    'my-funnels-list': '["user1","user2"]',
    'templates-template-new1': '{"id":"new1","name":"Novo Template"}',

    // Outros dados
    'auth_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'user_settings': '{"theme":"dark","language":"pt-BR"}',
    'app_config': '{"version":"1.0.0","debug":true}'
};

function simulateAnalysis() {
    console.log('📊 SIMULAÇÃO DO DIAGNÓSTICO:');
    console.log('=============================');

    // 1. Análise geral
    console.log(`📋 Total de chaves encontradas: ${Object.keys(simulatedLocalStorage).length}`);

    // 2. Categorização
    const categories = {
        'Funis/Editor': [],
        'Quiz/Respostas': [],
        'Templates': [],
        'Auth/Usuário': [],
        'Configurações': [],
        'Outros': []
    };

    Object.entries(simulatedLocalStorage).forEach(([key, value]) => {
        let category = 'Outros';

        if (key.includes('funnel') || key.includes('editor')) {
            category = 'Funis/Editor';
        } else if (key.includes('quiz') || key.includes('response')) {
            category = 'Quiz/Respostas';
        } else if (key.includes('template')) {
            category = 'Templates';
        } else if (key.includes('auth') || key.includes('user')) {
            category = 'Auth/Usuário';
        } else if (key.includes('config') || key.includes('setting')) {
            category = 'Configurações';
        }

        categories[category].push({ key, size: value.length });
    });

    // Mostrar categorias
    Object.entries(categories).forEach(([category, items]) => {
        if (items.length > 0) {
            console.log(`\n📁 ${category} (${items.length} itens):`);
            items.forEach(({ key, size }) => {
                console.log(`  📄 ${key} (${size} chars)`);
            });
        }
    });

    // 3. Detecção de dados legados
    console.log('\n🕰️ DETECÇÃO DE DADOS LEGADOS:');
    console.log('=============================');

    const legacyPatterns = [
        { pattern: /^funnel-/, description: 'Funis antigos (funnel-*)' },
        { pattern: /^funnels-list$/, description: 'Lista de funis antiga' },
        { pattern: /^editor:funnelId$/, description: 'ID do funil ativo no editor' },
        { pattern: /^quiz_/, description: 'Dados de quiz antigos (quiz_*)' },
        { pattern: /^quizResponses$/, description: 'Respostas de quiz antigas' },
        { pattern: /^template-/, description: 'Templates antigos (template-*)' },
    ];

    const foundLegacy = [];

    Object.keys(simulatedLocalStorage).forEach(key => {
        for (const { pattern, description } of legacyPatterns) {
            if (pattern.test(key)) {
                foundLegacy.push({ key, description });
                break;
            }
        }
    });

    if (foundLegacy.length === 0) {
        console.log('✅ Nenhum dado legado detectado!');
    } else {
        console.log(`⚠️ Encontrados ${foundLegacy.length} dados legados que precisam ser migrados:`);
        foundLegacy.forEach(({ key, description }) => {
            console.log(`  🕰️ ${key} - ${description}`);
        });
    }

    // 4. Dados contextuais
    console.log('\n🎯 DADOS CONTEXTUAIS ATUAIS:');
    console.log('============================');

    const contextPrefixes = ['editor-', 'templates-', 'my-funnels-', 'preview-', 'dev-'];
    const contextualData = {};

    Object.keys(simulatedLocalStorage).forEach(key => {
        for (const prefix of contextPrefixes) {
            if (key.startsWith(prefix)) {
                const context = prefix.replace('-', '');
                if (!contextualData[context]) {
                    contextualData[context] = [];
                }
                contextualData[context].push(key);
                break;
            }
        }
    });

    if (Object.keys(contextualData).length === 0) {
        console.log('❌ Nenhum dado contextual encontrado!');
    } else {
        Object.entries(contextualData).forEach(([context, items]) => {
            console.log(`\n📁 Contexto: ${context.toUpperCase()} (${items.length} itens)`);
            items.forEach(key => {
                console.log(`  📄 ${key}`);
            });
        });
    }

    // 5. Resumo e recomendações
    console.log('\n📋 RESUMO E RECOMENDAÇÕES:');
    console.log('==========================');

    if (foundLegacy.length > 0) {
        console.log('⚠️ AÇÃO NECESSÁRIA:');
        console.log(`   - Encontrados ${foundLegacy.length} dados legados`);
        console.log('   - Execute a migração para corrigir o isolamento');
        console.log('   - Dados detectados que causam vazamento:');
        foundLegacy.forEach(({ key }) => {
            console.log(`     * ${key}`);
        });
    } else {
        console.log('✅ SISTEMA OK:');
        console.log('   - Nenhum dado legado encontrado');
        console.log('   - Dados estão no formato contextual correto');
    }

    return {
        totalItems: Object.keys(simulatedLocalStorage).length,
        legacyCount: foundLegacy.length,
        contextualCount: Object.keys(contextualData).length,
        needsMigration: foundLegacy.length > 0,
        categories,
        foundLegacy,
        contextualData
    };
}

// Executar simulação
const result = simulateAnalysis();

console.log('\n🎯 PRÓXIMOS PASSOS:');
console.log('==================');

if (result.needsMigration) {
    console.log('1. 🔍 Abra o navegador em http://localhost:5173');
    console.log('2. 🛠️ Abra o console do navegador (F12)');
    console.log('3. 📋 Cole o conteúdo do arquivo "full-diagnosis-script.js"');
    console.log('4. ▶️ Execute: fullDiagnosis()');
    console.log('5. 📊 Analise os resultados reais');
    console.log('6. 🔄 Se houver dados legados, execute a migração');
} else {
    console.log('✅ Sistema aparenta estar correto!');
    console.log('🔍 Ainda assim, execute o diagnóstico real para confirmar');
}

console.log('\n💡 DICA: O diagnóstico real mostrará os dados EXATOS do seu localStorage');

module.exports = { simulateAnalysis, result };
