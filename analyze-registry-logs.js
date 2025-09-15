// Script avançado para analisar logs do registry
// Cole este código no console do navegador na página /editor

(function () {
    const logs = [];
    let errorCount = 0;
    let successCount = 0;

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
            args[0].includes('🧪') ||
            args[0].includes('normalizeBlockProperties') ||
            args[0].includes('getEnhancedBlockComponent') ||
            args[0].includes('getOptimizedBlockComponent') ||
            args[0].includes('SortableBlockWrapper block details')
        )) {
            logs.push({
                type: 'log',
                timestamp,
                args: [...args]
            });

            // Contar sucessos
            if (args[0].includes('Resultado do teste') && args[1] === 'SUCESSO') {
                successCount++;
            }

            // Mostrar logs em tempo real
            originalLog.apply(console, [`[${new Date().toLocaleTimeString()}]`, ...args]);
        }

        return originalLog.apply(console, args);
    };

    console.error = function (...args) {
        const timestamp = Date.now();

        if (args[0] && (
            args[0].includes('nenhum componente encontrado') ||
            args[0].includes('Erro ao buscar componente') ||
            args[0].includes('Erro no teste manual')
        )) {
            errorCount++;
            logs.push({
                type: 'error',
                timestamp,
                args: [...args]
            });

            originalError.apply(console, [`[ERRO #${errorCount}]`, ...args]);

            // Analisar padrão dos erros após alguns segundos
            setTimeout(() => analyzeErrors(), 1000);
        }

        return originalError.apply(console, args);
    };

    function analyzeErrors() {
        console.group('📊 ANÁLISE EM TEMPO REAL DOS LOGS');

        console.log('📈 Estatísticas atuais:');
        console.table({
            'Logs totais': logs.length,
            'Sucessos': successCount,
            'Erros': errorCount,
            'Última análise': new Date().toLocaleTimeString()
        });

        // Analisar tipos de bloco problemáticos
        const errorTypes = new Set();
        const successTypes = new Set();

        logs.forEach(log => {
            if (log.type === 'error') {
                const match = log.args[0]?.match(/nenhum componente encontrado para (.+)/);
                if (match) {
                    errorTypes.add(match[1]);
                }
            } else if (log.type === 'log') {
                // Capturar tipos de sucessos nos logs de teste
                if (log.args[0]?.includes('Teste manual do registry para:')) {
                    const type = log.args[1];
                    successTypes.add(type);
                }
            }
        });

        if (errorTypes.size > 0) {
            console.log('� Tipos com erro:', Array.from(errorTypes));
        }

        if (successTypes.size > 0) {
            console.log('✅ Tipos com sucesso:', Array.from(successTypes));
        }

        // Últimos 5 logs para contexto
        console.log('📜 Últimos 5 logs:');
        logs.slice(-5).forEach((log, i) => {
            const time = new Date(log.timestamp).toLocaleTimeString();
            console.log(`${i + 1}. [${time}] [${log.type}]`, ...log.args);
        });

        console.groupEnd();
    }

    // Função para análise manual
    window.analyzeRegistryLogs = analyzeErrors;

    // Função para limpar logs
    window.clearRegistryLogs = () => {
        logs.length = 0;
        errorCount = 0;
        successCount = 0;
        console.log('🧹 Logs do registry limpos');
    };

    console.log('✅ Análise de logs do registry iniciada');
    console.log('📝 Execute "analyzeRegistryLogs()" no console para ver análise completa');
    console.log('🧹 Execute "clearRegistryLogs()" para limpar e reiniciar');

    // Análise automática a cada 5 segundos
    setInterval(() => {
        if (logs.length > 0) {
            analyzeErrors();
        }
    }, 5000);
})();