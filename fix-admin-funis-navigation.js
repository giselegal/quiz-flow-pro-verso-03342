// 🔧 SCRIPT DE CORREÇÃO PARA NAVEGAÇÃO /admin/funis
// Cole este código no console do navegador na página /admin/funis

console.log('🚀 Iniciando correção da navegação em /admin/funis');

// 1. Localizar todos os botões "Usar Template"
const findTemplateButtons = () => {
    const allButtons = document.querySelectorAll('button');
    const templateButtons = Array.from(allButtons).filter(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        return text.includes('usar') || text.includes('use') || text.includes('template');
    });
    
    console.log(`📋 Encontrados ${templateButtons.length} botões de template`);
    return templateButtons;
};

// 2. Função de navegação robusta
const robustNavigation = (url) => {
    console.log(`🎯 Navegando para: ${url}`);
    console.log(`📍 URL atual: ${window.location.href}`);
    
    // Método 1: Tentar history.pushState + dispatchEvent
    try {
        console.log('🔧 Tentativa 1: history.pushState + popstate');
        window.history.pushState(null, '', url);
        window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
        
        // Verificar se funcionou após 500ms
        setTimeout(() => {
            if (window.location.pathname === url.split('?')[0]) {
                console.log('✅ Método 1 funcionou!');
                return;
            }
            
            // Método 2: window.location.href
            console.log('🔧 Tentativa 2: window.location.href');
            window.location.href = url;
        }, 500);
        
    } catch (error) {
        console.error('❌ Erro no método 1:', error);
        
        // Fallback imediato
        console.log('🔧 Fallback: window.location.href imediato');
        window.location.href = url;
    }
};

// 3. Substituir handlers dos botões
const fixNavigationButtons = () => {
    const buttons = findTemplateButtons();
    
    buttons.forEach((button, index) => {
        // Remover listeners existentes
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Adicionar novo handler
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`🎯 Clique interceptado no botão ${index + 1}: "${newButton.textContent}"`);
            
            // Extrair templateId do botão ou elementos próximos
            let templateId = 'quiz-estilo-21-steps'; // fallback
            
            // Tentar encontrar templateId em data attributes
            const card = newButton.closest('[data-template-id]');
            if (card) {
                templateId = card.getAttribute('data-template-id');
            }
            
            // Gerar funnelId único
            const funnelId = `funnel-${templateId}-${Date.now()}`;
            const editorUrl = `/editor/${encodeURIComponent(funnelId)}?template=${templateId}`;
            
            console.log('📊 Dados da navegação:', {
                templateId,
                funnelId,
                editorUrl
            });
            
            // Salvar no localStorage antes de navegar
            try {
                const funnelData = {
                    id: funnelId,
                    name: `Template ${templateId} - ${new Date().toLocaleTimeString()}`,
                    status: 'draft',
                    updatedAt: new Date().toISOString(),
                    templateId: templateId
                };
                
                localStorage.setItem(`funnel-${funnelId}`, JSON.stringify(funnelData));
                console.log('💾 Dados salvos no localStorage');
            } catch (storageError) {
                console.warn('⚠️ Erro ao salvar localStorage:', storageError);
            }
            
            // Executar navegação robusta
            robustNavigation(editorUrl);
        });
        
        console.log(`✅ Handler substituído no botão ${index + 1}`);
    });
    
    console.log(`🔧 ${buttons.length} botões foram corrigidos`);
};

// 4. Função de teste rápido
window.testQuickNavigation = (templateId = 'quiz-estilo-21-steps') => {
    const funnelId = `test-${templateId}-${Date.now()}`;
    const url = `/editor/${encodeURIComponent(funnelId)}?template=${templateId}`;
    
    console.log('🚀 Teste rápido de navegação:', url);
    robustNavigation(url);
};

// 5. Executar correção
try {
    fixNavigationButtons();
    console.log('✅ Correção aplicada com sucesso!');
    console.log('🎮 Para testar manualmente: testQuickNavigation()');
} catch (error) {
    console.error('❌ Erro na correção:', error);
}

// 6. Monitorar cliques futuros
document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'BUTTON') {
        const text = target.textContent?.toLowerCase() || '';
        if (text.includes('usar') || text.includes('use')) {
            console.log('🔍 Clique detectado em botão de template:', text);
        }
    }
}, true);

console.log('👂 Monitor de cliques ativado');
console.log('✨ Script de correção carregado com sucesso!');
