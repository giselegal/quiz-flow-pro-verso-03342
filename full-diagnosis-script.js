// 🔍 DIAGNÓSTICO COMPLETO DOS DADOS EXISTENTES
// Execute este script no console do navegador para ver EXATAMENTE quais dados existem

console.log('🔍 ANÁLISE COMPLETA DOS DADOS NO LOCALSTORAGE');
console.log('==============================================');

// Função para analisar todos os dados
window.analyzeCurrentData = function () {
    console.log('📊 DADOS ATUAIS NO LOCALSTORAGE:');
    console.log('=================================');

    // Obter todas as chaves
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) allKeys.push(key);
    }

    console.log(`📋 Total de chaves encontradas: ${allKeys.length}`);

    if (allKeys.length === 0) {
        console.log('❌ Nenhum dado encontrado no localStorage');
        return;
    }

    // Categorizar as chaves
    const categories = {
        'Funis/Editor': [],
        'Quiz/Respostas': [],
        'Templates': [],
        'Auth/Usuário': [],
        'Configurações': [],
        'Outros': []
    };

    allKeys.forEach(key => {
        const value = localStorage.getItem(key);
        const size = value ? value.length : 0;

        let category = 'Outros';

        if (key.includes('funnel') || key.includes('editor')) {
            category = 'Funis/Editor';
        } else if (key.includes('quiz') || key.includes('response') || key.includes('answer')) {
            category = 'Quiz/Respostas';
        } else if (key.includes('template') || key.includes('model')) {
            category = 'Templates';
        } else if (key.includes('auth') || key.includes('user') || key.includes('login')) {
            category = 'Auth/Usuário';
        } else if (key.includes('config') || key.includes('setting')) {
            category = 'Configurações';
        }

        categories[category].push({
            key,
            size,
            preview: value ? value.substring(0, 100) + (value.length > 100 ? '...' : '') : null
        });
    });

    // Mostrar categorias
    Object.entries(categories).forEach(([category, items]) => {
        if (items.length > 0) {
            console.log(`\n📁 ${category} (${items.length} itens):`);
            items.forEach(({ key, size, preview }) => {
                console.log(`  📄 ${key} (${size} chars)`);
                if (preview) {
                    try {
                        const parsed = JSON.parse(preview);
                        console.log(`    💾 Dados:`, parsed);
                    } catch {
                        console.log(`    📝 Conteúdo: ${preview}`);
                    }
                }
            });
        }
    });

    return categories;
};

// Função para detectar dados legados específicos
window.detectLegacyData = function () {
    console.log('\n🕰️ DETECÇÃO DE DADOS LEGADOS:');
    console.log('=============================');

    const legacyPatterns = [
        // Padrões antigos de funis
        { pattern: /^funnel-/, description: 'Funis antigos (funnel-*)' },
        { pattern: /^funnels-list$/, description: 'Lista de funis antiga' },
        { pattern: /^editor:funnelId$/, description: 'ID do funil ativo no editor' },

        // Padrões antigos de quiz
        { pattern: /^quiz_/, description: 'Dados de quiz antigos (quiz_*)' },
        { pattern: /^quizResponses$/, description: 'Respostas de quiz antigas' },
        { pattern: /^quiz_funnel_config$/, description: 'Configuração de quiz antiga' },

        // Padrões antigos de templates
        { pattern: /^template-/, description: 'Templates antigos (template-*)' },
        { pattern: /^templates$/, description: 'Lista de templates antiga' },

        // Outros padrões legados
        { pattern: /^editorData$/, description: 'Dados do editor antigos' },
        { pattern: /^currentFunnel$/, description: 'Funil atual antigo' },
    ];

    const foundLegacy = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            for (const { pattern, description } of legacyPatterns) {
                if (pattern.test(key)) {
                    const value = localStorage.getItem(key);
                    foundLegacy.push({
                        key,
                        description,
                        size: value ? value.length : 0,
                        value: value
                    });
                    break;
                }
            }
        }
    }

    if (foundLegacy.length === 0) {
        console.log('✅ Nenhum dado legado detectado!');
        console.log('ℹ️ Todos os dados parecem estar no formato contextual correto.');
    } else {
        console.log(`⚠️ Encontrados ${foundLegacy.length} dados legados que precisam ser migrados:`);
        foundLegacy.forEach(({ key, description, size, value }) => {
            console.log(`  🕰️ ${key} - ${description} (${size} chars)`);
            if (value) {
                try {
                    const parsed = JSON.parse(value);
                    console.log(`    📊 Dados:`, parsed);
                } catch {
                    console.log(`    📝 Conteúdo: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
                }
            }
        });
    }

    return foundLegacy;
};

// Função para mostrar dados contextuais atuais
window.showContextualData = function () {
    console.log('\n🎯 DADOS CONTEXTUAIS ATUAIS:');
    console.log('============================');

    const contextPrefixes = [
        'editor-',
        'templates-',
        'my-funnels-',
        'preview-',
        'dev-'
    ];

    const contextualData = {};

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            for (const prefix of contextPrefixes) {
                if (key.startsWith(prefix)) {
                    const context = prefix.replace('-', '');
                    if (!contextualData[context]) {
                        contextualData[context] = [];
                    }

                    const value = localStorage.getItem(key);
                    contextualData[context].push({
                        key,
                        size: value ? value.length : 0,
                        value: value
                    });
                    break;
                }
            }
        }
    }

    if (Object.keys(contextualData).length === 0) {
        console.log('❌ Nenhum dado contextual encontrado!');
        console.log('ℹ️ Isso pode indicar que a migração ainda não foi executada.');
    } else {
        Object.entries(contextualData).forEach(([context, items]) => {
            console.log(`\n📁 Contexto: ${context.toUpperCase()} (${items.length} itens)`);
            items.forEach(({ key, size, value }) => {
                console.log(`  📄 ${key} (${size} chars)`);
                if (value) {
                    try {
                        const parsed = JSON.parse(value);
                        console.log(`    💾 Dados:`, parsed);
                    } catch {
                        console.log(`    📝 Conteúdo: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
                    }
                }
            });
        });
    }

    return contextualData;
};

// Função principal que executa todas as análises
window.fullDiagnosis = function () {
    console.clear();
    console.log('🚀 DIAGNÓSTICO COMPLETO DOS DADOS');
    console.log('==================================');

    // 1. Análise geral
    const categories = analyzeCurrentData();

    // 2. Detecção de dados legados
    const legacy = detectLegacyData();

    // 3. Dados contextuais atuais
    const contextual = showContextualData();

    // 4. Resumo e recomendações
    console.log('\n📋 RESUMO E RECOMENDAÇÕES:');
    console.log('==========================');

    if (legacy.length > 0) {
        console.log('⚠️ AÇÃO NECESSÁRIA:');
        console.log(`   - Encontrados ${legacy.length} dados legados`);
        console.log('   - Execute: migrateDataManual() para migrar');
        console.log('   - Ou use a migração automática do sistema');
    } else {
        console.log('✅ SISTEMA OK:');
        console.log('   - Nenhum dado legado encontrado');
        console.log('   - Dados estão no formato contextual correto');
    }

    const totalItems = Object.values(categories).flat().length;
    console.log(`📊 Total de itens no localStorage: ${totalItems}`);

    return {
        categories,
        legacy,
        contextual,
        needsMigration: legacy.length > 0
    };
};

console.log('🛠️ FUNÇÕES DE DIAGNÓSTICO DISPONÍVEIS:');
console.log('======================================');
console.log('- analyzeCurrentData() - Analisa todos os dados atuais');
console.log('- detectLegacyData() - Detecta dados legados específicos');
console.log('- showContextualData() - Mostra dados contextuais atuais');
console.log('- fullDiagnosis() - Executa diagnóstico completo');
console.log('');
console.log('▶️ EXECUTE: fullDiagnosis() para ver tudo');
