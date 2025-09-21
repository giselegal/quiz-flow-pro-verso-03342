// Script de teste simples para verificar carregamento
console.log('🔍 Iniciando teste simples de carregamento...');

// Teste 1: Verificar se a página está carregando
document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ DOM carregado com sucesso');

    // Teste 2: Verificar elementos básicos
    const rootElement = document.getElementById('root');
    if (rootElement) {
        console.log('✅ Elemento #root encontrado:', rootElement);
        console.log('📄 Conteúdo inicial:', rootElement.innerHTML.substring(0, 200) + '...');
    } else {
        console.error('❌ Elemento #root não encontrado!');
    }

    // Teste 3: Verificar se React está carregado
    setTimeout(() => {
        if (window.React) {
            console.log('✅ React carregado:', window.React.version || 'versão não detectada');
        } else {
            console.warn('⚠️ React não detectado globalmente');
        }

        // Teste 4: Verificar componentes React renderizados
        const reactElements = document.querySelectorAll('[data-reactroot], .react-component, [class*="Editor"]');
        if (reactElements.length > 0) {
            console.log('✅ Componentes React detectados:', reactElements.length);
            reactElements.forEach((el, index) => {
                console.log(`  Component ${index + 1}:`, el.className || el.tagName);
            });
        } else {
            console.warn('⚠️ Nenhum componente React visível detectado');
        }

        // Teste 5: Verificar console de erros
        const errors = [];
        const originalError = console.error;
        console.error = function (...args) {
            errors.push(args.join(' '));
            originalError.apply(console, args);
        };

        setTimeout(() => {
            if (errors.length > 0) {
                console.log('❌ Erros detectados:', errors);
            } else {
                console.log('✅ Nenhum erro detectado até agora');
            }
        }, 2000);

    }, 1000);
});

// Teste 6: Verificar URL e parâmetros
const urlParams = new URLSearchParams(window.location.search);
const template = urlParams.get('template');
console.log('📋 Parâmetros URL:', {
    template,
    fullUrl: window.location.href
});

// Teste 7: Função de debug global
window.testFunnelLoading = function () {
    console.log('🧪 Executando teste manual...');

    // Verificar se existem elementos de loading
    const loadingElements = document.querySelectorAll('[class*="loading"], [class*="Loading"], .spinner');
    if (loadingElements.length > 0) {
        console.log('⏳ Elementos de loading encontrados:', loadingElements.length);
    }

    // Verificar se existe conteúdo do funil
    const funnelElements = document.querySelectorAll('[class*="funnel"], [class*="Funnel"], [class*="quiz"], [class*="Quiz"]');
    if (funnelElements.length > 0) {
        console.log('🎯 Elementos do funil encontrados:', funnelElements.length);
    } else {
        console.warn('⚠️ Nenhum elemento de funil detectado');
    }

    // Verificar altura do conteúdo
    const bodyHeight = document.body.scrollHeight;
    const visibleHeight = window.innerHeight;
    console.log('📏 Dimensões:', {
        bodyHeight,
        visibleHeight,
        ratio: bodyHeight / visibleHeight
    });

    // Resumo final
    if (funnelElements.length > 0 && bodyHeight > visibleHeight * 0.5) {
        console.log('✅ Funil parece estar carregado corretamente!');
    } else {
        console.warn('❌ Funil pode não estar carregando corretamente');
        console.log('💡 Dicas para debug:');
        console.log('  1. Verifique o console para erros JavaScript');
        console.log('  2. Verifique a aba Network para arquivos que falharam');
        console.log('  3. Verifique se o servidor de desenvolvimento está rodando');
        console.log('  4. Tente recarregar a página (Ctrl+F5)');
    }
};

console.log('🔧 Script de teste carregado. Execute window.testFunnelLoading() para teste manual.');