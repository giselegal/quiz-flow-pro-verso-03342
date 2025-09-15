// Script para debug do erro de registry em tempo real
// Execute este script no console do navegador na página /editor

(function () {
    console.log('🚀 Debug Registry Script Iniciado');

    // Override do console.error para capturar os erros específicos
    const originalError = console.error;
    console.error = function (...args) {
        if (args[0] && args[0].includes('nenhum componente encontrado')) {
            console.log('🔴 ERRO DE REGISTRO DETECTADO!', args);

            // Tentar obter stack trace
            const stack = new Error().stack;
            console.log('📍 Stack trace:', stack);
        }

        return originalError.apply(console, args);
    };

    // Override do console.log para filtrar apenas logs do registry
    const originalLog = console.log;
    console.log = function (...args) {
        if (args[0] && (
            args[0].includes('getOptimizedBlockComponent') ||
            args[0].includes('getEnhancedBlockComponent') ||
            args[0].includes('🔍') ||
            args[0].includes('🎯') ||
            args[0].includes('✅') ||
            args[0].includes('🔎')
        )) {
            // Mostrar logs do registry com timestamp
            const timestamp = new Date().toLocaleTimeString();
            originalLog.apply(console, [`[${timestamp}]`, ...args]);
        }

        return originalLog.apply(console, args);
    };

    console.log('✅ Console override configurado, monitore os logs abaixo:');
})();