// 🔍 DIAGNÓSTICO DE NAVEGAÇÃO - Quiz Quest
// Execute este script no console do navegador (F12) na página /admin/funis

console.log('🚀 INICIANDO DIAGNÓSTICO DE NAVEGAÇÃO');
console.log('📍 URL atual:', window.location.href);
console.log('📄 Path atual:', window.location.pathname);

// 1. Verificar se o Wouter está funcionando
console.log('\n🔧 TESTANDO WOUTER...');
try {
    const wooterTest = () => {
        // Simular a navegação que deveria funcionar
        const testUrl = '/editor/test-diagnosis-123';
        console.log('🎯 Testando navegação para:', testUrl);
        
        // Se existe setLocation global
        if (window.setLocation) {
            console.log('✅ setLocation encontrado globalmente');
            window.setLocation(testUrl);
        } else {
            console.log('❌ setLocation NÃO encontrado globalmente');
            console.log('⚠️ Tentando window.location.href...');
            window.location.href = testUrl;
        }
    };
    
    // Executar após 2 segundos
    setTimeout(wooterTest, 2000);
    console.log('⏰ Teste agendado para 2 segundos...');
    
} catch (error) {
    console.error('❌ Erro no teste do Wouter:', error);
}

// 2. Verificar elementos da página
console.log('\n🔍 VERIFICANDO ELEMENTOS DA PÁGINA...');
try {
    const templates = document.querySelectorAll('[data-template-id]');
    console.log(`📋 Templates encontrados: ${templates.length}`);
    
    const buttons = document.querySelectorAll('button');
    console.log(`🔘 Botões encontrados: ${buttons.length}`);
    
    // Verificar se há botões com texto específico
    const useTemplateButtons = Array.from(buttons).filter(btn => 
        btn.textContent?.includes('Usar Template') || 
        btn.textContent?.includes('Use Template')
    );
    console.log(`🎯 Botões "Usar Template": ${useTemplateButtons.length}`);
    
    if (useTemplateButtons.length > 0) {
        console.log('✅ Encontrados botões de template:', useTemplateButtons.map(btn => btn.textContent));
        
        // Adicionar event listeners de debug
        useTemplateButtons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                console.log(`🎯 CLIQUE DETECTADO no botão ${index + 1}:`, btn.textContent);
                console.log('📍 URL antes do clique:', window.location.href);
                
                // Aguardar um pouco e verificar se a URL mudou
                setTimeout(() => {
                    console.log('📍 URL após o clique:', window.location.href);
                    if (window.location.pathname.includes('/editor/')) {
                        console.log('✅ SUCESSO: Navegação funcionou!');
                    } else {
                        console.log('❌ PROBLEMA: Navegação NÃO funcionou!');
                    }
                }, 1000);
            });
        });
        console.log('👂 Event listeners adicionados aos botões');
    }
    
} catch (error) {
    console.error('❌ Erro na verificação de elementos:', error);
}

// 3. Verificar localStorage
console.log('\n💾 VERIFICANDO LOCALSTORAGE...');
try {
    const keys = Object.keys(localStorage);
    const funnelKeys = keys.filter(key => key.includes('funnel'));
    console.log(`🗃️ Chaves relacionadas a funis: ${funnelKeys.length}`);
    console.log('🔑 Chaves:', funnelKeys);
    
    // Verificar se há dados corrompidos
    funnelKeys.forEach(key => {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                JSON.parse(data);
                console.log(`✅ ${key}: JSON válido`);
            }
        } catch (parseError) {
            console.warn(`⚠️ ${key}: JSON inválido`, parseError);
        }
    });
    
} catch (error) {
    console.error('❌ Erro na verificação do localStorage:', error);
}

// 4. Verificar React/DOM
console.log('\n⚛️ VERIFICANDO REACT/DOM...');
try {
    const rootElement = document.getElementById('root');
    console.log('🌳 Root element:', rootElement ? '✅ Encontrado' : '❌ Não encontrado');
    
    // Verificar se há componentes React
    const reactElements = document.querySelectorAll('[data-reactroot], [data-react-*]');
    console.log(`⚛️ Elementos React encontrados: ${reactElements.length}`);
    
    // Verificar se há erros no console
    const originalError = console.error;
    let errorCount = 0;
    console.error = function(...args) {
        errorCount++;
        console.log(`🚨 ERRO ${errorCount}:`, ...args);
        originalError.apply(console, args);
    };
    
    console.log('👂 Monitoramento de erros ativado');
    
} catch (error) {
    console.error('❌ Erro na verificação React/DOM:', error);
}

// 5. Teste manual de navegação
console.log('\n🎮 FUNÇÕES DE TESTE MANUAL DISPONÍVEIS:');
console.log('Para testar navegação manual, execute:');
console.log('testNavigation("/editor/manual-test-123")');

window.testNavigation = function(url) {
    console.log(`🚀 Testando navegação para: ${url}`);
    console.log('📍 URL antes:', window.location.href);
    
    try {
        window.location.href = url;
        console.log('✅ Comando de navegação executado');
    } catch (error) {
        console.error('❌ Erro na navegação:', error);
    }
};

// 6. Simular clique em template
window.simulateTemplateClick = function() {
    console.log('🎯 Simulando clique em template...');
    const templateButtons = document.querySelectorAll('button');
    const useButton = Array.from(templateButtons).find(btn => 
        btn.textContent?.includes('Usar') || btn.textContent?.includes('Use')
    );
    
    if (useButton) {
        console.log('🔘 Botão encontrado:', useButton.textContent);
        useButton.click();
        console.log('✅ Clique simulado');
    } else {
        console.log('❌ Nenhum botão encontrado para simular clique');
    }
};

console.log('\n✨ DIAGNÓSTICO CONCLUÍDO!');
console.log('📝 Execute testNavigation() ou simulateTemplateClick() para testes manuais');
