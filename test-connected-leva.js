/**
 * 🧪 TESTE PAINEL LEVA CONECTADO
 * 
 * Script para testar a integração entre LEVA e os dados reais das 21 etapas
 */

console.log('🧪 Iniciando teste do Painel LEVA Conectado...');

// Função para verificar a conexão do LEVA
function testLevaConnection() {
    console.log('\n🔍 === VERIFICAÇÃO DE CONECTIVIDADE LEVA ===');

    // 1. Verificar se LEVA está disponível
    try {
        const levaDiv = document.querySelector('[data-leva-root]');
        if (levaDiv) {
            console.log('✅ LEVA painel encontrado no DOM');
            console.log('📍 Localização:', levaDiv);
        } else {
            console.log('❌ LEVA painel NÃO encontrado no DOM');
        }
    } catch (error) {
        console.log('❌ Erro ao verificar LEVA DOM:', error);
    }

    // 2. Verificar EditorContext
    try {
        const editorContext = window.__QUIZ_EDITOR_CONTEXT__;
        if (editorContext) {
            console.log('✅ EditorContext disponível');
            console.log('📊 Blocos ativos:', editorContext.blocks?.length || 0);
            console.log('🎯 Bloco selecionado:', editorContext.selectedBlock?.type || 'Nenhum');
        } else {
            console.log('❌ EditorContext NÃO encontrado');
        }
    } catch (error) {
        console.log('❌ Erro ao verificar EditorContext:', error);
    }

    // 3. Verificar PropertyDiscovery
    try {
        const propertyDiscovery = window.__PROPERTY_DISCOVERY__;
        if (propertyDiscovery) {
            console.log('✅ PropertyDiscovery ativo');
            console.log('🔍 Última descoberta:', propertyDiscovery.lastDiscovery || 'Nenhuma');
        } else {
            console.log('❌ PropertyDiscovery NÃO ativo');
        }
    } catch (error) {
        console.log('❌ Erro ao verificar PropertyDiscovery:', error);
    }
}

// Função para simular mudanças no LEVA
function testLevaChanges() {
    console.log('\n🎛️ === TESTE DE MUDANÇAS NO LEVA ===');

    try {
        // Procurar inputs do LEVA
        const levaInputs = document.querySelectorAll('[data-leva-root] input, [data-leva-root] select, [data-leva-root] textarea');
        console.log(`🎛️ Encontrados ${levaInputs.length} controles LEVA`);

        if (levaInputs.length > 0) {
            const firstInput = levaInputs[0];
            console.log('🧪 Testando primeiro controle:', firstInput.type, firstInput.name);

            // Simular mudança
            const originalValue = firstInput.value;
            const testValue = 'TESTE_LEVA_CONECTADO';

            // Disparar mudança
            firstInput.value = testValue;
            firstInput.dispatchEvent(new Event('input', { bubbles: true }));
            firstInput.dispatchEvent(new Event('change', { bubbles: true }));

            console.log('📤 Mudança simulada:', originalValue, '→', testValue);

            // Restaurar valor original após um tempo
            setTimeout(() => {
                firstInput.value = originalValue;
                firstInput.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('🔄 Valor restaurado');
            }, 2000);
        } else {
            console.log('⚠️ Nenhum controle LEVA encontrado para teste');
        }
    } catch (error) {
        console.log('❌ Erro ao testar mudanças LEVA:', error);
    }
}

// Função para verificar sincronização de dados
function testDataSync() {
    console.log('\n🔄 === TESTE DE SINCRONIZAÇÃO DE DADOS ===');

    try {
        // Verificar se mudanças no EditorContext refletem no LEVA
        const checkSync = () => {
            const editorContext = window.__QUIZ_EDITOR_CONTEXT__;
            const levaRoot = document.querySelector('[data-leva-root]');

            if (editorContext && levaRoot) {
                console.log('🔍 Verificando sincronização...');

                // Logs de estado atual
                console.log('📊 Estado Editor:', {
                    blocksCount: editorContext.blocks?.length,
                    selectedBlock: editorContext.selectedBlock?.type,
                    selectedBlockId: editorContext.selectedBlock?.id
                });

                // Verificar controles LEVA
                const levaControls = levaRoot.querySelectorAll('[data-testid], input, select, textarea');
                console.log('🎛️ Controles LEVA ativos:', levaControls.length);

                return true;
            }

            return false;
        };

        if (checkSync()) {
            console.log('✅ Verificação de sincronização concluída');
        } else {
            console.log('❌ Falha na verificação de sincronização');
        }

    } catch (error) {
        console.log('❌ Erro ao verificar sincronização:', error);
    }
}

// Função principal de teste
function runConnectedLevaTests() {
    console.log('\n🚀 === EXECUÇÃO COMPLETA DOS TESTES ===');

    // Teste 1: Conectividade
    testLevaConnection();

    // Teste 2: Mudanças (depois de 1 segundo)
    setTimeout(testLevaChanges, 1000);

    // Teste 3: Sincronização (depois de 2 segundos)
    setTimeout(testDataSync, 2000);

    // Resultado final (depois de 4 segundos)
    setTimeout(() => {
        console.log('\n🏁 === RESULTADO FINAL ===');
        console.log('✅ Teste do Painel LEVA Conectado concluído');
        console.log('📋 Verifique os logs acima para detalhes da conectividade');
        console.log('🔗 Se todos os itens mostrarem ✅, a integração está funcionando');
    }, 4000);
}

// Executar testes
runConnectedLevaTests();

// Expor função para uso manual
window.testConnectedLeva = runConnectedLevaTests;

console.log('💡 Use window.testConnectedLeva() para executar os testes novamente');
