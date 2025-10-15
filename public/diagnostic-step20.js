/**
 * 🔍 DIAGNÓSTICO DO EDITOR - Step 20 Template Loading
 * 
 * Script para detectar exatamente qual template está sendo carregado
 * pelo canvas vs preview no Step 20
 */

// Executar no console do browser: http://localhost:5173/editor

(function() {
    console.log('🔍 DIAGNÓSTICO DO EDITOR - Step 20');
    console.log('=====================================\n');

    // 1. Verificar requests de templates
    const originalFetch = window.fetch;
    const templateRequests = [];

    window.fetch = async function(...args) {
        const url = args[0];
        if (typeof url === 'string' && url.includes('template')) {
            templateRequests.push({
                url,
                timestamp: new Date().toLocaleTimeString(),
                stack: new Error().stack
            });
            console.log('📥 Template Request:', url);
        }
        return originalFetch.apply(this, args);
    };

    // 2. Verificar localStorage e sessionStorage
    console.log('📦 STORAGE DATA:');
    Object.keys(localStorage).forEach(key => {
        if (key.includes('template') || key.includes('step')) {
            console.log(`• localStorage.${key}:`, localStorage.getItem(key)?.substring(0, 100) + '...');
        }
    });

    // 3. Verificar estado do React (se possível)
    setTimeout(() => {
        console.log('\n📊 TEMPLATE REQUESTS CAPTURADOS:');
        templateRequests.forEach((req, i) => {
            console.log(`${i + 1}. ${req.timestamp}: ${req.url}`);
        });

        // 4. Testar diretamente os templates
        console.log('\n🧪 TESTE DIRETO DOS TEMPLATES:');
        
        fetch('/templates/step-20-v3.json')
            .then(r => r.json())
            .then(data => {
                console.log('✅ step-20-v3.json:', data.metadata?.name);
                console.log('• Sections:', data.sections?.length);
                console.log('• Version:', data.templateVersion);
            })
            .catch(err => console.log('❌ step-20-v3.json:', err));

        // 5. Verificar se há templates antigos ainda sendo carregados
        fetch('/templates/step-20-template.json')
            .then(r => r.json())
            .then(data => {
                console.log('⚠️ step-20-template.json AINDA EXISTE:', data.metadata?.name);
            })
            .catch(err => console.log('✅ step-20-template.json não existe (bom!)'));

        // 6. Verificar elementos no DOM
        const canvasElements = document.querySelectorAll('[data-step="20"], [data-template*="20"]');
        console.log(`\n🎨 ELEMENTOS STEP 20 NO DOM: ${canvasElements.length}`);
        canvasElements.forEach((el, i) => {
            console.log(`${i + 1}. ${el.tagName}:`, el.dataset);
        });

    }, 2000);

    // 7. Monitor de mudanças no DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && (
                    node.textContent?.includes('step-20') ||
                    node.className?.includes('step') ||
                    node.dataset?.step === '20'
                )) {
                    console.log('🔄 DOM Update (Step 20):', node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-step', 'data-template']
    });

    console.log('✅ Diagnóstico ativo! Navegue até Step 20 no editor.');
    console.log('📋 Para parar o monitoramento: stopDiagnostic()');

    window.stopDiagnostic = () => {
        observer.disconnect();
        window.fetch = originalFetch;
        console.log('🔴 Diagnóstico parado.');
    };

})();