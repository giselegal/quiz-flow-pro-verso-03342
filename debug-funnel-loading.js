// 🔍 DEBUG: Investigar ponto cego no carregamento do funil
console.log('🔍 INICIANDO DEBUG DO FUNIL...');

// 1. Verificar URL e parâmetros
const urlParams = new URLSearchParams(window.location.search);
const templateParam = urlParams.get('template');
console.log('📋 Parâmetros URL:', {
    template: templateParam,
    fullURL: window.location.href,
    pathname: window.location.pathname
});

// 2. Verificar se PureBuilderProvider está inicializando
setTimeout(() => {
    try {
        // Tentar encontrar elementos do editor
        const editorElements = document.querySelectorAll('[data-testid*="editor"], [class*="editor"], [id*="editor"]');
        console.log('🎨 Elementos do editor encontrados:', editorElements.length);
        
        // Verificar se há erro de carregamento no console
        const errorElements = document.querySelectorAll('[data-error], .error, .loading-error');
        console.log('❌ Elementos de erro:', errorElements.length);
        
        // Verificar state do React (se disponível)
        if (window.React && window.React.useState) {
            console.log('⚛️ React disponível');
        }
        
        // Verificar se há loading infinito
        const loadingElements = document.querySelectorAll('[data-loading], .loading, .spinner');
        console.log('⏳ Elementos de loading:', loadingElements.length);
        
        // Verificar erros específicos no console
        const originalError = console.error;
        console.error = function(...args) {
            console.log('🚨 ERRO CAPTURADO:', args);
            originalError.apply(console, args);
        };
        
        // Verificar se stepBlocks foi carregado
        if (window.__QUIZ_DEBUG__) {
            console.log('📊 Debug data disponível:', window.__QUIZ_DEBUG__);
        }
        
    } catch (error) {
        console.error('💥 Erro no debug:', error);
    }
}, 2000);

// 3. Verificar imports e dependências críticas
setTimeout(() => {
    console.log('🔍 Verificando dependências críticas...');
    
    // Verificar se template foi importado
    try {
        fetch('/src/templates/quiz21StepsComplete.ts')
            .then(response => console.log('📄 Template file status:', response.status))
            .catch(error => console.log('❌ Template file error:', error));
    } catch (e) {
        console.log('⚠️ Não foi possível verificar template file');
    }
    
    // Verificar se há erro de CORS ou network
    const errors = [];
    const originalFetch = fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).catch(error => {
            errors.push({ url: args[0], error: error.message });
            console.log('🌐 Network error:', { url: args[0], error: error.message });
            throw error;
        });
    };
    
}, 1000);

// 4. Debug específico do PureBuilderProvider
window.debugPureBuilder = function() {
    console.log('🔧 Debug PureBuilderProvider...');
    
    // Procurar por contextos React
    const contexts = document.querySelectorAll('[data-react-context]');
    console.log('⚛️ React contexts:', contexts.length);
    
    // Verificar se há erro de hidratação
    if (document.querySelector('[data-reactroot]')) {
        console.log('✅ React hidratado');
    } else {
        console.log('❌ React não hidratado - possível problema SSR');
    }
};

console.log('🎯 Debug script carregado. Execute debugPureBuilder() para debug adicional.');