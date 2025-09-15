// Script avançado para analisar logs do registry
// Cole este código no console do navegador na página /editor

(function () {
    const logs = [];
    let errorCount = 0;

    // Capturar todos os logs do registry
    const originalLog = console.log;
    const originalError = console.error;

    console.log = function (...args) {
        const timestamp = Date.now();

        // Filtrar logs do registry
        if (args[0] && (
            args[0].includes('🔍') ||
            args[0].includes('🔧') ||
            args[0].includes('🎯') ||
            args[0].includes('normalizeBlockProperties') ||
            args[0].includes('getEnhancedBlockComponent') ||
            args[0].includes('getOptimizedBlockComponent')
        )) {
            logs.push({
                type: 'log',
                timestamp,
                args: [...args]
            });

            // Mostrar logs em tempo real
            originalLog.apply(console, [`[${new Date().toLocaleTimeString()}]`, ...args]);
        }

        return originalLog.apply(console, args);
    };

    console.error = function (...args) {
        const timestamp = Date.now();

        if (args[0] && args[0].includes('nenhum componente encontrado')) {
            errorCount++;
            logs.push({
                type: 'error',
                timestamp,
                args: [...args]
            });

            originalError.apply(console, [`[ERRO #${errorCount}]`, ...args]);

            // Analisar padrão dos erros após alguns segundos
            setTimeout(() => analyzeErrors(), 2000);
        }

        return originalError.apply(console, args);
    };

    function analyzeErrors() {
        if (logs.length === 0) {
            console.log('📊 Nenhum log do registry coletado ainda');
            return;
        }

        console.group('📊 ANÁLISE DOS LOGS DO REGISTRY');

        // Separar logs por tipo
        const logsByType = logs.reduce((acc, log) => {
            acc[log.type] = acc[log.type] || [];
            acc[log.type].push(log);
            return acc;
        }, {});

        console.log('📈 Estatísticas:');
        console.table({
            'Logs totais': logs.length,
            'Logs normais': logsByType.log?.length || 0,
            'Erros': logsByType.error?.length || 0
        });

        // Analisar tipos de bloco problemáticos
        const errorTypes = new Set();
        if (logsByType.error) {
            logsByType.error.forEach(log => {
                const match = log.args[0]?.match(/nenhum componente encontrado para (.+)/);
                if (match) {
                    errorTypes.add(match[1]);
                }
            });

            console.log('🔴 Tipos de bloco com erro:', Array.from(errorTypes));
        }

        // Analisar fluxo de normalização
        const normalizeEvents = logs.filter(log =>
            log.args[0]?.includes('normalizeBlockProperties')
        );

        if (normalizeEvents.length > 0) {
            console.log('🔧 Eventos de normalização:');
            normalizeEvents.forEach((event, i) => {
                console.log(`  ${i + 1}. ${event.args[1]?.originalType || 'tipo indefinido'}`);
            });
        }

        // Mostrar sequência completa para debugging
        console.log('📜 Sequência completa de logs:');
        logs.forEach((log, i) => {
            const time = new Date(log.timestamp).toLocaleTimeString();
            console.log(`${i + 1}. [${time}] [${log.type}]`, ...log.args);
        });

        console.groupEnd();
    }

    // Função para análise manual
    window.analyzeRegistryLogs = analyzeErrors;

    console.log('✅ Análise de logs do registry iniciada');
    console.log('📝 Execute "analyzeRegistryLogs()" no console para ver análise completa');

    // Análise automática após 10 segundos
    setTimeout(() => {
        console.log('⏰ Executando análise automática...');
        analyzeErrors();
    }, 10000);
})();