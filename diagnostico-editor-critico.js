// 🚨 DIAGNÓSTICO CRÍTICO: Detectar qual editor está carregando
console.log('🚨 INICIANDO DIAGNÓSTICO CRÍTICO - DETECÇÃO DO EDITOR');
console.log('='.repeat(70));

function diagnosticarEditor() {
    console.log('\n🔍 1. VERIFICANDO QUAL EDITOR ESTÁ ATIVO...');
    
    // Verificar variável global do editor
    const activeEditor = window.__ACTIVE_EDITOR__;
    console.log('📝 Editor ativo (variável global):', activeEditor || 'NÃO DEFINIDO');
    
    // Verificar elementos na DOM para identificar editor
    const editorIndicators = {
        'UnifiedEditor': document.querySelector('.unified-editor-container'),
        'EditorPro': document.querySelector('[data-editor="pro"], .editor-pro'),
        'SchemaDrivenEditor': document.querySelector('[class*="schema-driven"], [data-editor="schema"]'),
        'PropertiesPanel': document.querySelector('[class*="properties"], [data-testid*="properties"]'),
        'RegistryPanel': document.body.textContent?.includes('RegistryPropertiesPanel'),
        'HotReloadText': document.body.textContent?.includes('🔥 TESTE HOT RELOAD'),
        'RedBackground': document.querySelector('[class*="bg-red"]')
    };
    
    console.log('\n🧭 2. INDICADORES DE EDITOR NA DOM:');
    Object.entries(editorIndicators).forEach(([name, found]) => {
        const status = found ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO';
        console.log(`   ${name}: ${status}`);
        if (found && typeof found === 'object' && found.tagName) {
            console.log(`     → Elemento: ${found.tagName}.${found.className}`);
        }
    });
    
    // Verificar React DevTools ou componentes React
    console.log('\n🔧 3. VERIFICANDO COMPONENTES REACT...');
    const rootElement = document.getElementById('root');
    if (rootElement && (rootElement._reactInternalFiber || rootElement._reactInternalInstance)) {
        console.log('✅ Aplicação React detectada');
        
        // Tentar encontrar componentes específicos
        const findReactComponent = (element, componentName) => {
            try {
                const reactKeys = Object.keys(element).filter(key => 
                    key.startsWith('__reactInternalInstance') || 
                    key.startsWith('__reactFiber')
                );
                
                for (const key of reactKeys) {
                    const fiber = element[key];
                    if (fiber && fiber.type && fiber.type.name === componentName) {
                        return true;
                    }
                }
                return false;
            } catch {
                return false;
            }
        };
        
        const components = ['RegistryPropertiesPanel', 'UnifiedEditor', 'EditorPro', 'SchemaDrivenEditorResponsive'];
        components.forEach(comp => {
            const found = Array.from(document.querySelectorAll('*')).some(el => 
                findReactComponent(el, comp)
            );
            console.log(`   ${comp}: ${found ? '✅ ATIVO' : '❌ NÃO ENCONTRADO'}`);
        });
    }
    
    // Verificar estado de seleção de blocos
    console.log('\n🎯 4. VERIFICANDO SELEÇÃO DE BLOCOS...');
    const blocks = document.querySelectorAll('[data-block], [class*="block"], [class*="component"]');
    console.log(`   Blocos disponíveis: ${blocks.length}`);
    
    if (blocks.length > 0) {
        console.log('   🖱️ Tentando simular seleção do primeiro bloco...');
        const firstBlock = blocks[0];
        console.log(`   Primeiro bloco: ${firstBlock.tagName}.${firstBlock.className}`);
        
        // Simular clique
        firstBlock.click();
        
        // Verificar se apareceu o painel após clique
        setTimeout(() => {
            const hasHotReloadAfterClick = document.body.textContent?.includes('🔥 TESTE HOT RELOAD');
            const hasRedBgAfterClick = document.querySelector('[class*="bg-red"]');
            
            console.log('\n🎉 5. RESULTADOS APÓS CLIQUE:');
            console.log(`   HOT RELOAD apareceu: ${hasHotReloadAfterClick ? '✅ SIM' : '❌ NÃO'}`);
            console.log(`   Background vermelho: ${hasRedBgAfterClick ? '✅ SIM' : '❌ NÃO'}`);
            
            if (hasHotReloadAfterClick) {
                console.log('🎉 SUCESSO! As alterações estão funcionando!');
                console.log('💡 Você precisa SELECIONAR UM BLOCO para ver o painel de propriedades');
            } else {
                console.log('❌ As alterações ainda não aparecem');
                investigarCausa();
            }
        }, 1000);
    } else {
        console.log('❌ Nenhum bloco encontrado para selecionar');
        console.log('💡 Você precisa adicionar um componente primeiro!');
    }
}

function investigarCausa() {
    console.log('\n🔍 6. INVESTIGANDO CAUSA DO PROBLEMA...');
    
    // Verificar se o arquivo foi realmente atualizado
    const scriptTags = document.querySelectorAll('script[src*="RegistryPropertiesPanel"]');
    console.log(`   Scripts do RegistryPropertiesPanel: ${scriptTags.length}`);
    
    // Verificar imports no console
    console.log('   Verificando cache de módulos...');
    
    // Tentar forçar reimport (só funciona em dev)
    if (window.location.hostname === 'localhost') {
        console.log('   🔄 Ambiente local detectado, cache pode estar interferindo');
        console.log('   💡 Soluções:');
        console.log('     1. Hard refresh (Ctrl+Shift+R)');
        console.log('     2. Limpar cache do navegador');
        console.log('     3. Reiniciar servidor Vite');
    }
    
    // Verificar se o módulo existe
    fetch('/src/components/universal/RegistryPropertiesPanel.tsx')
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Arquivo não encontrado');
        })
        .then(content => {
            const hasHotReloadInFile = content.includes('🔥 TESTE HOT RELOAD');
            const hasRedBgInFile = content.includes('bg-red-500');
            
            console.log('\n📄 7. VERIFICAÇÃO DO ARQUIVO SOURCE:');
            console.log(`   Arquivo existe: ✅ SIM`);
            console.log(`   HOT RELOAD no código: ${hasHotReloadInFile ? '✅ SIM' : '❌ NÃO'}`);
            console.log(`   Background vermelho no código: ${hasRedBgInFile ? '✅ SIM' : '❌ NÃO'}`);
            
            if (hasHotReloadInFile && hasRedBgInFile) {
                console.log('✅ As alterações estão no arquivo source!');
                console.log('🔄 O problema é de cache ou componente não sendo usado');
                console.log('💡 Tente: Hard refresh + limpar cache');
            } else {
                console.log('❌ As alterações NÃO estão no arquivo source!');
                console.log('🔧 Verifique se o arquivo foi salvo corretamente');
            }
        })
        .catch(error => {
            console.log(`❌ Erro ao verificar arquivo: ${error.message}`);
        });
}

// Auto-executar
setTimeout(diagnosticarEditor, 1000);
