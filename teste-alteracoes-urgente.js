// 🔥 TESTE URGENTE: Verificar alterações do painel de propriedades
console.log('🚨 INICIANDO TESTE URGENTE - VERIFICAÇÃO DE ALTERAÇÕES');
console.log('='.repeat(60));

// 1. Verificar se estamos na página correta
console.log('📍 URL atual:', window.location.href);
console.log('📍 Pathname:', window.location.pathname);

// 2. Verificar se o RegistryPropertiesPanel foi carregado
setTimeout(() => {
    console.log('\n🔍 VERIFICANDO PAINEL DE PROPRIEDADES...');
    
    // Procurar pelo texto "🔥 TESTE HOT RELOAD"
    const hotReloadText = document.body.textContent || '';
    const hasHotReloadText = hotReloadText.includes('🔥 TESTE HOT RELOAD');
    
    console.log('🔥 Texto "TESTE HOT RELOAD" encontrado:', hasHotReloadText ? '✅ SIM' : '❌ NÃO');
    
    // Procurar por elemento com background vermelho
    const redBackground = document.querySelector('[class*="bg-red"], [style*="background"]');
    console.log('🎨 Elemento com background vermelho:', redBackground ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO');
    
    if (redBackground) {
        console.log('   🎯 Elemento:', redBackground.tagName);
        console.log('   🎯 Classes:', redBackground.className);
        console.log('   🎯 Style:', redBackground.style.cssText);
    }
    
    // Verificar se existe painel de propriedades
    const propertyPanel = document.querySelector('[class*="properties"], [data-testid*="properties"]');
    console.log('🎛️ Painel de propriedades encontrado:', propertyPanel ? '✅ SIM' : '❌ NÃO');
    
    // Procurar por qualquer elemento que contenha "HOT RELOAD"
    const allElements = document.querySelectorAll('*');
    let hotReloadElements = [];
    
    allElements.forEach(el => {
        const text = el.textContent || '';
        if (text.includes('HOT RELOAD') || text.includes('TESTE HOT')) {
            hotReloadElements.push(el);
        }
    });
    
    console.log('🔥 Elementos com "HOT RELOAD":', hotReloadElements.length);
    hotReloadElements.forEach((el, index) => {
        console.log(`   ${index + 1}. ${el.tagName}: "${el.textContent?.slice(0, 50)}..."`);
    });
    
    // 3. Verificar se precisa selecionar um bloco
    const blocks = document.querySelectorAll('[class*="block"], [data-block], [class*="component"]');
    console.log('🧩 Blocos/componentes encontrados:', blocks.length);
    
    if (blocks.length > 0) {
        console.log('\n💡 DICA: Clique em um bloco para ver o painel de propriedades!');
        console.log('   Primeiro bloco disponível:', blocks[0].tagName, blocks[0].className);
        
        // Simular clique no primeiro bloco
        if (blocks[0]) {
            console.log('🖱️ Tentando simular clique no primeiro bloco...');
            blocks[0].click();
            
            // Verificar novamente após clique
            setTimeout(() => {
                const hotReloadAfterClick = document.body.textContent?.includes('🔥 TESTE HOT RELOAD');
                console.log('🔥 Após clique - "TESTE HOT RELOAD":', hotReloadAfterClick ? '✅ APARECEU' : '❌ AINDA NÃO');
                
                const redAfterClick = document.querySelector('[class*="bg-red"]');
                console.log('🎨 Após clique - Background vermelho:', redAfterClick ? '✅ APARECEU' : '❌ AINDA NÃO');
            }, 1000);
        }
    }
    
    // 4. Verificar cache do navegador
    console.log('\n🗄️ INFORMAÇÕES DE CACHE:');
    console.log('   localStorage keys:', Object.keys(localStorage).length);
    console.log('   sessionStorage keys:', Object.keys(sessionStorage).length);
    
    // 5. Diagnóstico final
    console.log('\n🎯 DIAGNÓSTICO FINAL:');
    if (hasHotReloadText) {
        console.log('✅ SUCESSO: As alterações estão aparecendo!');
    } else {
        console.log('❌ PROBLEMA: As alterações não estão visíveis');
        console.log('🔧 Possíveis soluções:');
        console.log('   1. Fazer hard refresh (Ctrl+F5)');
        console.log('   2. Limpar cache do navegador');
        console.log('   3. Selecionar um bloco no editor');
        console.log('   4. Verificar se está na rota correta');
    }
    
}, 2000);

// Registrar listener para cliques em elementos
document.addEventListener('click', (e) => {
    console.log('🖱️ Clicou em:', e.target.tagName, e.target.className);
    
    // Verificar se o painel apareceu após o clique
    setTimeout(() => {
        const hasHotReload = document.body.textContent?.includes('🔥 TESTE HOT RELOAD');
        if (hasHotReload) {
            console.log('🎉 PAINEL APARECEU APÓS CLIQUE!');
        }
    }, 500);
});

console.log('🎯 Script de teste carregado. Aguardando 2 segundos...');
