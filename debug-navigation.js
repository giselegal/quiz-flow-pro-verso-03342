// 🔍 SCRIPT DE TESTE DE NAVEGAÇÃO
// Copie e cole este script no console do navegador

console.log('🔍 Iniciando diagnóstico completo de navegação...');

// 1. Verificar ambiente
console.log('📊 Informações do ambiente:');
console.log('URL atual:', window.location.href);
console.log('Wouter instalado:', typeof window.location);
console.log('React carregado:', typeof React !== 'undefined');

// 2. Verificar localStorage
console.log('💾 Dados no localStorage:');
const funnelKeys = [];
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('funnel')) {
        const value = localStorage.getItem(key);
        funnelKeys.push({ key, size: value ? value.length : 0 });
    }
}
console.log('Chaves de funis encontradas:', funnelKeys);

// 3. Simular clonagem de template
console.log('🧪 Simulando clonagem de template...');
const simulateTemplateCloning = (templateId) => {
    const clonedId = `${templateId}-test-${Date.now()}`;
    const funnelData = {
        id: clonedId,
        name: `Template ${templateId} - Teste`,
        status: 'draft',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };

    console.log('Dados do funil simulado:', funnelData);
    localStorage.setItem(`funnel_${clonedId}`, JSON.stringify(funnelData));

    return { clonedId, funnelData };
};

// 4. Testar navegação
const testNavigation = (url) => {
    console.log(`🚀 Testando navegação para: ${url}`);

    // Simular clique em link
    const link = document.createElement('a');
    link.href = url;
    link.click();

    // Ou usar history API
    try {
        window.history.pushState(null, '', url);
        console.log('✅ history.pushState executado');
    } catch (e) {
        console.error('❌ Erro no history.pushState:', e);
    }
};

// 5. Executar testes
console.log('🎯 Executando testes...');

// Simular clonagem
const testResult = simulateTemplateCloning('quiz-estilo-21-steps');
console.log('Resultado da simulação:', testResult);

// Testar URLs
const testUrls = [
    '/editor',
    `/editor/${testResult.clonedId}`,
    `/editor/${testResult.clonedId}?template=quiz-estilo-21-steps`,
    '/admin/funis'
];

testUrls.forEach((url, index) => {
    setTimeout(() => {
        console.log(`\n🧪 Teste ${index + 1}/${testUrls.length}:`);
        testNavigation(url);

        // Verificar se a URL mudou
        setTimeout(() => {
            console.log('URL após navegação:', window.location.href);
            console.log('Path atual:', window.location.pathname);
        }, 500);
    }, index * 1000);
});

// 6. Verificar se há erros de JavaScript
window.addEventListener('error', (e) => {
    console.error('❌ Erro JavaScript detectado:', e.error);
});

console.log('✅ Diagnóstico configurado. Verifique os logs acima e aguarde os testes.');
