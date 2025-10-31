/**
 * 🎯 INTERCEPTOR DE CHAMADAS - Template Loading
 * 
 * Cole no console ANTES de navegar no editor
 * Intercepta todas as chamadas de carregamento de template
 */

console.log('%c🎯 INTERCEPTOR ATIVADO', 'background: #f48771; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
console.log('Este script vai interceptar TODAS as chamadas de carregamento de templates\n');

// ============================================================================
// Criar proxy para fetch() global
// ============================================================================
const originalFetch = window.fetch;
const fetchLog = [];

window.fetch = function(...args) {
    const url = args[0];
    
    // Detectar requisições de template
    if (typeof url === 'string' && (url.includes('/templates/') || url.endsWith('.json'))) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            url,
            type: 'fetch',
            stack: new Error().stack
        };
        
        fetchLog.push(logEntry);
        
        console.log('%c📡 FETCH INTERCEPTADO', 'color: #dcdcaa; font-weight: bold;');
        console.log(`   URL: ${url}`);
        console.log(`   Time: ${timestamp}`);
        console.log(`   Stack trace:`, logEntry.stack);
        console.log('');
    }
    
    return originalFetch.apply(this, args);
};

console.log('✅ Fetch interceptor instalado');

// ============================================================================
// Interceptar console.log para capturar logs do sistema
// ============================================================================
const originalLog = console.log;
const systemLogs = [];

console.log = function(...args) {
    const message = args.join(' ');
    
    // Capturar logs do sistema de templates
    if (
        message.includes('lazyLoadStep') ||
        message.includes('L1 HIT') ||
        message.includes('L2 HIT') ||
        message.includes('L3 HIT') ||
        message.includes('Registry') ||
        message.includes('EditorProviderUnified') ||
        message.includes('TemplateService') ||
        message.includes('Carregado do servidor')
    ) {
        systemLogs.push({
            timestamp: new Date().toISOString(),
            message,
            args
        });
        
        console.log('%c🔍 LOG CAPTURADO', 'color: #569cd6; font-weight: bold;');
    }
    
    return originalLog.apply(this, args);
};

console.log('✅ Console interceptor instalado');
console.log('');

// ============================================================================
// Tentar interceptar módulos se disponíveis
// ============================================================================
if (typeof window.__vite_ssr_import_0__ !== 'undefined') {
    console.log('⚠️ Vite SSR modules detectados, mas não interceptáveis');
}

// ============================================================================
// Monitorar Performance API
// ============================================================================
const resourceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.name.includes('/templates/') && entry.name.endsWith('.json')) {
            console.log('%c⚡ RESOURCE TIMING', 'color: #4ec9b0; font-weight: bold;');
            console.log(`   URL: ${entry.name}`);
            console.log(`   Duration: ${Math.round(entry.duration)}ms`);
            console.log(`   Transfer Size: ${entry.transferSize} bytes`);
            console.log('');
        }
    }
});

try {
    resourceObserver.observe({ entryTypes: ['resource'] });
    console.log('✅ Performance observer instalado');
} catch (error) {
    console.log('⚠️ Performance observer não disponível');
}

console.log('');

// ============================================================================
// Função para exibir relatório
// ============================================================================
window.showTemplateLoadingReport = function() {
    console.log('%c📊 RELATÓRIO DE CARREGAMENTO DE TEMPLATES', 'background: #569cd6; color: white; padding: 10px; font-size: 14px; font-weight: bold;');
    console.log('');
    
    // Fetch calls
    console.log(`%c📡 FETCH CALLS: ${fetchLog.length}`, 'color: #dcdcaa; font-weight: bold;');
    if (fetchLog.length > 0) {
        fetchLog.forEach((entry, i) => {
            console.log(`\n${i + 1}. ${entry.url}`);
            console.log(`   Time: ${entry.timestamp}`);
        });
    } else {
        console.log('   Nenhuma requisição fetch detectada ainda');
    }
    console.log('');
    
    // System logs
    console.log(`%c🔍 SYSTEM LOGS: ${systemLogs.length}`, 'color: #569cd6; font-weight: bold;');
    if (systemLogs.length > 0) {
        systemLogs.forEach((log, i) => {
            console.log(`\n${i + 1}. [${log.timestamp}] ${log.message}`);
        });
    } else {
        console.log('   Nenhum log do sistema capturado ainda');
    }
    console.log('');
    
    // Performance entries
    const perfEntries = performance.getEntriesByType('resource')
        .filter(e => e.name.includes('/templates/') && e.name.endsWith('.json'));
    
    console.log(`%c⚡ PERFORMANCE ENTRIES: ${perfEntries.length}`, 'color: #4ec9b0; font-weight: bold;');
    if (perfEntries.length > 0) {
        perfEntries.forEach((entry, i) => {
            const url = new URL(entry.name);
            console.log(`\n${i + 1}. ${url.pathname}`);
            console.log(`   Duration: ${Math.round(entry.duration)}ms`);
            console.log(`   Size: ${entry.transferSize} bytes`);
        });
    } else {
        console.log('   Nenhuma performance entry detectada ainda');
    }
    console.log('');
    
    // Conclusão
    if (fetchLog.length === 0 && perfEntries.length === 0) {
        console.log('%c⚠️ NENHUM CARREGAMENTO DETECTADO', 'background: #dcdcaa; color: black; padding: 5px;');
        console.log('   Possíveis causas:');
        console.log('   1. Editor ainda não foi aberto');
        console.log('   2. Templates estão vindo de cache (L1/L2)');
        console.log('   3. Editor está usando quiz21-complete.json ao invés de JSONs individuais');
    } else {
        console.log('%c✅ CARREGAMENTO ATIVO', 'background: #4ec9b0; color: black; padding: 5px;');
    }
    
    return {
        fetchLog,
        systemLogs,
        perfEntries: perfEntries.map(e => ({
            url: e.name,
            duration: e.duration,
            size: e.transferSize
        }))
    };
};

console.log('');
console.log('%cPróximos passos:', 'font-weight: bold; font-size: 14px;');
console.log('1. Navegue no editor (abra /editor, troque de steps)');
console.log('2. Execute: showTemplateLoadingReport()');
console.log('3. Ou aguarde - os logs aparecerão automaticamente');
console.log('');
console.log('%c🎯 INTERCEPTOR PRONTO E AGUARDANDO...', 'background: #4ec9b0; color: black; padding: 5px; font-weight: bold;');
console.log('');
