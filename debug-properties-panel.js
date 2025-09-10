/**
 * 🔧 SCRIPT DE DIAGNÓSTICO - PAINEL DE PROPRIEDADES
 * 
 * Execute no console do browser para diagnosticar problemas
 */

(function () {
    console.log('🔍 INICIANDO DIAGNÓSTICO DO PAINEL DE PROPRIEDADES');

    // 1. Verificar se o EditorProvider está ativo
    function checkEditorContext() {
        console.log('\n📋 1. VERIFICANDO CONTEXTO DO EDITOR');

        try {
            // Procurar por elementos do editor
            const editorElements = document.querySelectorAll('[class*="editor"], [class*="properties"]');
            console.log('   🔍 Elementos de editor encontrados:', editorElements.length);

            // Verificar se há PropertiesColumn
            const propertiesColumn = document.querySelector('[class*="properties"]');
            console.log('   📱 PropertiesColumn presente:', !!propertiesColumn);

            // Verificar React context (se disponível)
            const reactRoot = document.getElementById('root');
            if (reactRoot && reactRoot._reactInternalFiber) {
                console.log('   ⚛️ React context detectado');
            }

            return {
                hasEditor: editorElements.length > 0,
                hasPropertiesPanel: !!propertiesColumn
            };
        } catch (error) {
            console.error('   ❌ Erro ao verificar contexto:', error);
            return { hasEditor: false, hasPropertiesPanel: false };
        }
    }

    // 2. Verificar seleção de blocos
    function checkBlockSelection() {
        console.log('\n🎯 2. VERIFICANDO SELEÇÃO DE BLOCOS');

        try {
            // Procurar por blocos selecionados visualmente
            const selectedBlocks = document.querySelectorAll('[class*="selected"], [class*="active"]');
            console.log('   🔸 Elementos com classe selected/active:', selectedBlocks.length);

            // Verificar por atributos de seleção
            const blockElements = document.querySelectorAll('[data-block-id], [data-id]');
            console.log('   🧱 Elementos com data-block-id:', blockElements.length);

            // Listar IDs dos blocos encontrados
            const blockIds = Array.from(blockElements).map(el =>
                el.getAttribute('data-block-id') || el.getAttribute('data-id')
            ).filter(Boolean);
            console.log('   📝 IDs de blocos encontrados:', blockIds);

            return {
                selectedCount: selectedBlocks.length,
                blockCount: blockElements.length,
                blockIds
            };
        } catch (error) {
            console.error('   ❌ Erro ao verificar seleção:', error);
            return { selectedCount: 0, blockCount: 0, blockIds: [] };
        }
    }

    // 3. Verificar painel de propriedades
    function checkPropertiesPanel() {
        console.log('\n🛠️ 3. VERIFICANDO PAINEL DE PROPRIEDADES');

        try {
            // Procurar por elementos do painel
            const panelSelectors = [
                '[class*="properties"]',
                '[class*="PropertiesColumn"]',
                '[class*="RegistryPropertiesPanel"]',
                'div:has(button:contains("Fechar"))'
            ];

            let panelElement = null;
            for (const selector of panelSelectors) {
                panelElement = document.querySelector(selector);
                if (panelElement) {
                    console.log('   📱 Painel encontrado com selector:', selector);
                    break;
                }
            }

            if (panelElement) {
                // Verificar conteúdo do painel
                const inputs = panelElement.querySelectorAll('input, textarea, select');
                const buttons = panelElement.querySelectorAll('button');
                console.log('   🔧 Inputs encontrados:', inputs.length);
                console.log('   🔲 Botões encontrados:', buttons.length);

                // Verificar se há mensagens de erro
                const errorMessages = panelElement.querySelectorAll('[class*="error"], .text-red');
                console.log('   ⚠️ Mensagens de erro:', errorMessages.length);

                return {
                    found: true,
                    hasInputs: inputs.length > 0,
                    hasButtons: buttons.length > 0,
                    hasErrors: errorMessages.length > 0
                };
            } else {
                console.log('   ❌ Painel de propriedades não encontrado');
                return { found: false };
            }
        } catch (error) {
            console.error('   ❌ Erro ao verificar painel:', error);
            return { found: false, error: error.message };
        }
    }

    // 4. Verificar estado global
    function checkGlobalState() {
        console.log('\n🌐 4. VERIFICANDO ESTADO GLOBAL');

        try {
            // Verificar localStorage
            const editorKeys = Object.keys(localStorage).filter(key =>
                key.includes('editor') || key.includes('funnel') || key.includes('quiz')
            );
            console.log('   💾 Chaves de editor no localStorage:', editorKeys);

            // Verificar window globals
            const globalKeys = Object.keys(window).filter(key =>
                key.includes('editor') || key.includes('Editor') || key.includes('React')
            );
            console.log('   🪟 Variáveis globais relacionadas:', globalKeys);

            return {
                localStorageKeys: editorKeys,
                globalKeys
            };
        } catch (error) {
            console.error('   ❌ Erro ao verificar estado global:', error);
            return { error: error.message };
        }
    }

    // 5. Executar diagnóstico completo
    function runDiagnosis() {
        console.log('\n🎯 RELATÓRIO DE DIAGNÓSTICO');
        console.log('='.repeat(50));

        const results = {
            context: checkEditorContext(),
            selection: checkBlockSelection(),
            panel: checkPropertiesPanel(),
            global: checkGlobalState()
        };

        console.log('\n📊 RESUMO:');
        console.log('   Editor ativo:', results.context.hasEditor ? '✅' : '❌');
        console.log('   Painel presente:', results.context.hasPropertiesPanel ? '✅' : '❌');
        console.log('   Blocos detectados:', results.selection.blockCount);
        console.log('   Painel funcional:', results.panel.found ? '✅' : '❌');

        // Sugestões baseadas nos resultados
        console.log('\n💡 SUGESTÕES:');
        if (!results.context.hasEditor) {
            console.log('   🔧 Editor não detectado - verificar se está na página correta');
        }
        if (!results.panel.found) {
            console.log('   🔧 Painel não encontrado - verificar componente PropertiesColumn');
        }
        if (results.selection.blockCount === 0) {
            console.log('   🔧 Nenhum bloco detectado - verificar data-block-id nos elementos');
        }
        if (results.panel.hasErrors) {
            console.log('   🔧 Erros no painel detectados - verificar console para detalhes');
        }

        return results;
    }

    // Executar diagnóstico
    const diagnosis = runDiagnosis();

    // Disponibilizar funções para uso manual
    window.editorDiagnosis = {
        run: runDiagnosis,
        checkContext: checkEditorContext,
        checkSelection: checkBlockSelection,
        checkPanel: checkPropertiesPanel,
        checkGlobal: checkGlobalState,
        results: diagnosis
    };

    console.log('\n🔧 Funções disponíveis em window.editorDiagnosis');
    console.log('   • window.editorDiagnosis.run() - Executar diagnóstico completo');
    console.log('   • window.editorDiagnosis.checkPanel() - Verificar apenas o painel');

})();
