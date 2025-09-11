// 🧪 SCRIPT DE TESTE RÁPIDO
// Cole este código no console do navegador na página /admin/funis

console.log('🧪 Iniciando teste de navegação do editor...');

// Função para testar navegação
function testEditorNavigation() {
    // Simular clonagem de template
    const templateId = 'quiz-estilo-21-steps';
    const clonedId = `${templateId}-test-${Date.now()}`;
    
    // Criar dados de teste no localStorage
    const testFunnel = {
        id: clonedId,
        name: `Teste ${templateId}`,
        status: 'draft',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(`funnel_${clonedId}`, JSON.stringify(testFunnel));
    console.log('✅ Funil de teste criado:', testFunnel);
    
    // Navegar para o editor
    const editorUrl = `/editor/${encodeURIComponent(clonedId)}?template=${templateId}&debug=true`;
    console.log('🚀 Navegando para:', editorUrl);
    
    window.location.href = editorUrl;
}

// Função para limpar dados de teste
function clearTestData() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('test')) {
            keysToRemove.push(key);
        }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('🗑️ Dados de teste removidos:', keysToRemove.length);
}

// Função para verificar estado atual
function checkCurrentState() {
    console.log('📊 Estado atual:');
    console.log('URL:', window.location.href);
    console.log('Path:', window.location.pathname);
    console.log('Search:', window.location.search);
    
    // Verificar localStorage
    const funnelKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('funnel')) {
            funnelKeys.push(key);
        }
    }
    console.log('Funis no localStorage:', funnelKeys.length);
}

// Executar verificação inicial
checkCurrentState();

console.log('✅ Funções disponíveis:');
console.log('- testEditorNavigation() - Testa navegação para editor');
console.log('- clearTestData() - Limpa dados de teste');
console.log('- checkCurrentState() - Verifica estado atual');
console.log('');
console.log('🚀 Para testar: execute testEditorNavigation()');

// Auto-executar teste se estamos na página de admin
if (window.location.pathname.includes('/admin/funis')) {
    console.log('🎯 Página de admin detectada. Execute testEditorNavigation() para testar!');
}

// Retornar objeto com funções
window.editorTest = {
    test: testEditorNavigation,
    clear: clearTestData,
    check: checkCurrentState
};
