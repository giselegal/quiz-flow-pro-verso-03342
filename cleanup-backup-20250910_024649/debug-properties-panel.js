/**
 * 🔍 DEBUG: Análise do Painel de Propriedades NOCODE
 * 
 * Script para diagnosticar problemas no painel de propriedades
 */

console.log('🔍 INICIANDO ANÁLISE DO PAINEL DE PROPRIEDADES...');

// 1. Verificar se os módulos estão carregando
function checkModuleImports() {
    console.log('📦 1. Verificando importações de módulos...');

    try {
        // Verificar se MODULAR_COMPONENTS está disponível
        const modularComponentsModule = require('/workspaces/quiz-quest-challenge-verse/src/config/modularComponents.ts');
        console.log('✅ MODULAR_COMPONENTS carregado:', {
            total: modularComponentsModule.MODULAR_COMPONENTS?.length || 0,
            primeiros5: modularComponentsModule.MODULAR_COMPONENTS?.slice(0, 5).map(c => c.type) || []
        });
    } catch (error) {
        console.error('❌ Erro ao carregar MODULAR_COMPONENTS:', error.message);
    }

    try {
        // Verificar PropertyDiscovery
        const propertyDiscoveryModule = require('/workspaces/quiz-quest-challenge-verse/src/components/editor/properties/core/PropertyDiscovery.ts');
        console.log('✅ PropertyDiscovery carregado:', {
            hasDiscoverFunction: typeof propertyDiscoveryModule.discoverComponentProperties === 'function',
            hasDiscoverAllFunction: typeof propertyDiscoveryModule.discoverAllComponentProperties === 'function'
        });
    } catch (error) {
        console.error('❌ Erro ao carregar PropertyDiscovery:', error.message);
    }
}

// 2. Verificar se o componente está sendo renderizado
function checkComponentRendering() {
    console.log('🎨 2. Verificando renderização de componentes...');

    // Verificar se o PropertiesColumn está na DOM
    const propertiesColumn = document.querySelector('[data-testid="properties-column"], .properties-column');
    console.log('PropertiesColumn na DOM:', !!propertiesColumn);

    // Verificar se há mensagens de loading do NOCODE
    const nocodeLoadingMessages = document.querySelectorAll('*').length > 0 ?
        Array.from(document.querySelectorAll('*')).filter(el =>
            el.textContent?.includes('Carregando painel NOCODE') ||
            el.textContent?.includes('Painel NOCODE Ativo')
        ) : [];
    console.log('Mensagens NOCODE encontradas:', nocodeLoadingMessages.length);

    // Verificar se há erros de Suspense
    const suspenseErrors = Array.from(document.querySelectorAll('*')).filter(el =>
        el.textContent?.includes('erro') || el.textContent?.includes('failed')
    );
    console.log('Possíveis erros de Suspense:', suspenseErrors.length);
}

// 3. Verificar seleção de blocos
function checkBlockSelection() {
    console.log('🎯 3. Verificando seleção de blocos...');

    // Verificar se há blocos selecionados no estado global
    const editorState = (window as any).__EDITOR_STATE__ || {};
    console.log('Estado do editor disponível:', !!Object.keys(editorState).length);

    // Verificar se há blocos na DOM para seleção
    const blocks = document.querySelectorAll('[data-block-id], [id^="dnd-block-"]');
    console.log('Blocos disponíveis para seleção:', blocks.length);

    if (blocks.length > 0) {
        const firstBlock = blocks[0];
        console.log('Primeiro bloco:', {
            id: firstBlock.id,
            dataBlockId: firstBlock.getAttribute('data-block-id'),
            tagName: firstBlock.tagName,
            classes: firstBlock.className
        });
    }
}

// 4. Testar descoberta de propriedades
function testPropertyDiscovery() {
    console.log('🔬 4. Testando descoberta de propriedades...');

    // Listar alguns tipos de componentes comuns
    const commonTypes = ['quiz-intro', 'quiz-header', 'quiz-question', 'quiz-results', 'button', 'text'];

    commonTypes.forEach(type => {
        try {
            // Simular chamada de descoberta
            console.log(`Testando tipo: ${type}`);

            // Verificar se existe no MODULAR_COMPONENTS
            const modularComponents = (window as any).MODULAR_COMPONENTS;
            if (modularComponents) {
                const component = modularComponents.find((c: any) => c.type === type);
                console.log(`  - Encontrado em MODULAR_COMPONENTS:`, !!component);
                if (component) {
                    console.log(`  - Propriedades disponíveis:`, Object.keys(component.properties || {}).length);
                }
            }
        } catch (error) {
            console.error(`  ❌ Erro ao testar ${type}:`, error.message);
        }
    });
}

// 5. Verificar console de erros
function checkConsoleErrors() {
    console.log('🚨 5. Verificando erros no console...');

    // Capturar próximos erros
    const originalError = console.error;
    const originalWarn = console.warn;

    const errors: any[] = [];
    const warnings: any[] = [];

    console.error = (...args) => {
        errors.push(args);
        originalError.apply(console, args);
    };

    console.warn = (...args) => {
        warnings.push(args);
        originalWarn.apply(console, args);
    };

    // Restaurar após 10 segundos
    setTimeout(() => {
        console.error = originalError;
        console.warn = originalWarn;

        console.log('📊 Resumo de erros capturados:');
        console.log('  Erros:', errors.length);
        console.log('  Warnings:', warnings.length);

        if (errors.length > 0) {
            console.log('  Principais erros:', errors.slice(0, 3));
        }
        if (warnings.length > 0) {
            console.log('  Principais warnings:', warnings.slice(0, 3));
        }
    }, 10000);
}

// Executar análise
function runCompleteAnalysis() {
    console.log('🎯 EXECUTANDO ANÁLISE COMPLETA...');

    checkModuleImports();

    setTimeout(() => {
        checkComponentRendering();
        checkBlockSelection();
        testPropertyDiscovery();
        checkConsoleErrors();

        console.log('✅ ANÁLISE CONCLUÍDA - Verifique os logs acima para identificar problemas');
    }, 1000);
}

// Auto-executar quando carregado
if (typeof window !== 'undefined') {
    runCompleteAnalysis();
}

// Expor funções para uso manual
(window as any).debugPropertiesPanel = {
    runCompleteAnalysis,
    checkModuleImports,
    checkComponentRendering,
    checkBlockSelection,
    testPropertyDiscovery,
    checkConsoleErrors
};

console.log('🔧 Funções de debug disponíveis em: window.debugPropertiesPanel');
