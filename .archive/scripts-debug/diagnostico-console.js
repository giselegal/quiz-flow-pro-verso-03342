/**
 * 🔍 DIAGNÓSTICO RÁPIDO - Estrutura de Template Ativa
 * 
 * Cole este script no console do navegador (F12) enquanto estiver no /editor
 * Ele vai mapear exatamente qual estrutura está sendo carregada
 */

console.log('%c🔍 DIAGNÓSTICO DE ESTRUTURA ATIVA', 'background: #0e639c; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
console.log('');

// ============================================================================
// TEST 1: Verificar JSONs individuais disponíveis
// ============================================================================
console.log('%c📦 TEST 1: Verificando JSONs individuais em /templates/blocks/', 'color: #4ec9b0; font-weight: bold; font-size: 14px;');

const stepsToTest = ['step-01', 'step-02', 'step-12', 'step-19', 'step-20', 'step-21'];
const jsonResults = {};

async function testJSONs() {
    for (const stepId of stepsToTest) {
        const paths = [
            `/templates/blocks/${stepId}.json`,
            `/templates/${stepId}-v3.json`,
            `/templates/${stepId}.json`,
        ];
        
        let found = false;
        for (const path of paths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    const data = await response.json();
                    jsonResults[stepId] = {
                        path,
                        blocks: data.blocks?.length || 0,
                        hasValidStructure: !!(data.blocks && Array.isArray(data.blocks) && data.blocks[0]?.id)
                    };
                    console.log(`✅ ${stepId}: ENCONTRADO em ${path}`);
                    console.log(`   → ${data.blocks?.length || 0} blocos`);
                    console.log(`   → Estrutura válida: ${jsonResults[stepId].hasValidStructure}`);
                    found = true;
                    break;
                }
            } catch (error) {
                // Continua tentando
            }
        }
        
        if (!found) {
            console.log(`❌ ${stepId}: NÃO ENCONTRADO`);
            jsonResults[stepId] = { found: false };
        }
    }
    
    console.log('');
    return jsonResults;
}

// ============================================================================
// TEST 2: Verificar requisições de rede já feitas
// ============================================================================
async function checkNetworkRequests() {
    console.log('%c🌐 TEST 2: Requisições de rede para templates', 'color: #4ec9b0; font-weight: bold; font-size: 14px;');
    
    if (window.performance && window.performance.getEntriesByType) {
        const resources = window.performance.getEntriesByType('resource');
        const templateRequests = resources.filter(r => 
            r.name.includes('/templates/') && r.name.endsWith('.json')
        );
        
        if (templateRequests.length > 0) {
            console.log(`✅ ${templateRequests.length} requisições de template detectadas:`);
            templateRequests.forEach(req => {
                const url = new URL(req.name);
                console.log(`   → ${url.pathname} (${Math.round(req.duration)}ms)`);
            });
        } else {
            console.log('⚠️ Nenhuma requisição de template detectada ainda');
            console.log('   Isso é normal se o editor não carregou nenhum step ainda');
        }
    } else {
        console.log('⚠️ Performance API não disponível');
    }
    
    console.log('');
}

// ============================================================================
// TEST 3: Verificar IndexedDB (L2 Cache)
// ============================================================================
async function checkIndexedDB() {
    console.log('%c💾 TEST 3: IndexedDB (L2 Cache)', 'color: #4ec9b0; font-weight: bold; font-size: 14px;');
    
    try {
        if ('indexedDB' in window) {
            const dbs = await indexedDB.databases();
            const quizDB = dbs.find(db => db.name?.includes('quiz-templates-cache'));
            
            if (quizDB) {
                console.log(`✅ IndexedDB encontrado: ${quizDB.name} (v${quizDB.version})`);
                
                // Abrir e verificar conteúdo
                return new Promise((resolve) => {
                    const request = indexedDB.open(quizDB.name);
                    request.onsuccess = (event) => {
                        const db = event.target.result;
                        const objectStoreNames = Array.from(db.objectStoreNames);
                        console.log(`   → Object Stores: ${objectStoreNames.join(', ')}`);
                        
                        if (objectStoreNames.includes('templates')) {
                            const transaction = db.transaction(['templates'], 'readonly');
                            const store = transaction.objectStore('templates');
                            const countRequest = store.count();
                            
                            countRequest.onsuccess = () => {
                                console.log(`   → ${countRequest.result} templates em cache`);
                                db.close();
                                resolve();
                            };
                        } else {
                            db.close();
                            resolve();
                        }
                    };
                    request.onerror = () => {
                        console.log('⚠️ Erro ao abrir IndexedDB');
                        resolve();
                    };
                });
            } else {
                console.log('⚠️ IndexedDB não inicializado ainda');
            }
        } else {
            console.log('❌ IndexedDB não suportado');
        }
    } catch (error) {
        console.log(`⚠️ Erro ao verificar IndexedDB: ${error.message}`);
    }
    
    console.log('');
}

// ============================================================================
// TEST 4: Verificar logs do monkey-patch no console
// ============================================================================
async function checkConsoleLogs() {
    console.log('%c🔄 TEST 4: Verificação de logs do monkey-patch', 'color: #4ec9b0; font-weight: bold; font-size: 14px;');
    console.log('⚠️ Este teste depende de logs anteriores.');
    console.log('   Procure no console acima por:');
    console.log('   1. "🔄 [EditorProviderUnified] lazyLoadStep ativado"');
    console.log('   2. "⚡ L1 HIT" ou "💾 L2 HIT" ou "📦 L3 HIT" ou "✅ Carregado do servidor"');
    console.log('   3. "[Registry] getStep(...)"');
    console.log('');
    console.log('   Se você NÃO vê esses logs, o monkey-patch pode não estar ativo.');
    console.log('');
}

// ============================================================================
// TEST 5: Testar carregamento direto via fetch
// ============================================================================
async function testDirectLoad() {
    console.log('%c🎯 TEST 5: Teste de carregamento direto', 'color: #4ec9b0; font-weight: bold; font-size: 14px;');
    
    try {
        const response = await fetch('/templates/blocks/step-01.json');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ step-01.json carregado com sucesso via fetch');
            console.log('   Estrutura:', {
                hasBlocks: !!data.blocks,
                isArray: Array.isArray(data.blocks),
                blockCount: data.blocks?.length || 0,
                firstBlockId: data.blocks?.[0]?.id,
                firstBlockType: data.blocks?.[0]?.type
            });
        } else {
            console.log(`❌ Erro ao carregar step-01.json: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.log(`❌ Erro ao fazer fetch: ${error.message}`);
    }
    
    console.log('');
}

// ============================================================================
// RESUMO E RECOMENDAÇÕES
// ============================================================================
async function showSummary() {
    console.log('%c📊 RESUMO E RECOMENDAÇÕES', 'background: #569cd6; color: white; padding: 10px; font-size: 14px; font-weight: bold;');
    
    const foundCount = Object.values(jsonResults).filter(r => r.found !== false).length;
    const totalTests = stepsToTest.length;
    
    console.log(`\n✅ JSONs individuais encontrados: ${foundCount}/${totalTests}`);
    
    if (foundCount === totalTests) {
        console.log('✅ ESTRUTURA CORRETA: Todos os JSONs individuais estão disponíveis');
        console.log('   → Os arquivos em /templates/blocks/ estão prontos');
    } else if (foundCount > 0) {
        console.log('⚠️ ESTRUTURA PARCIAL: Alguns JSONs encontrados, outros faltando');
    } else {
        console.log('❌ ESTRUTURA INCORRETA: Nenhum JSON individual encontrado');
        console.log('   → Sistema pode estar usando quiz21-complete.json');
    }
    
    console.log('\n📋 Próximos passos:');
    console.log('   1. Verifique os logs acima para "🔄 lazyLoadStep ativado"');
    console.log('   2. Se NÃO aparecer, o monkey-patch não está funcionando');
    console.log('   3. Abra /editor e navegue entre steps para gerar logs');
    console.log('   4. Verifique a aba Network para ver requisições para /templates/blocks/');
    console.log('');
}

// ============================================================================
// EXECUTAR TODOS OS TESTES
// ============================================================================
async function runDiagnostic() {
    await testJSONs();
    await checkNetworkRequests();
    await checkIndexedDB();
    await checkConsoleLogs();
    await testDirectLoad();
    await showSummary();
    
    console.log('%c✅ DIAGNÓSTICO COMPLETO!', 'background: #4ec9b0; color: black; padding: 10px; font-size: 16px; font-weight: bold;');
    console.log('');
    
    // Retornar resultados
    return {
        jsonResults,
        timestamp: new Date().toISOString()
    };
}

// Executar automaticamente
runDiagnostic();
