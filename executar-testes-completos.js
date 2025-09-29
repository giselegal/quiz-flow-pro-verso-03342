/**
 * 🧪 SCRIPT DE EXECUÇÃO: SUÍTE DE TESTES COMPLETA
 * 
 * Script para executar e validar toda a suíte de testes
 * do sistema de sincronização Quiz-Editor
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configurações
const TEST_TIMEOUT = 300000; // 5 minutos
const COVERAGE_THRESHOLD = 90;

// Cores para output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

console.log(`${colors.cyan}${colors.bright}
╔══════════════════════════════════════════════════════════════╗
║                    🧪 SUÍTE DE TESTES COMPLETA              ║
║              Sistema de Sincronização Quiz-Editor            ║
║                                                              ║
║  📊 Total: 397 casos de teste                               ║
║  🎯 Cobertura esperada: > ${COVERAGE_THRESHOLD}%                              ║
║  ⚡ Performance: Benchmarks incluídos                       ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}
`);

// Função para executar comando e capturar output
function runCommand(command, description, options = {}) {
    console.log(`${colors.blue}📋 ${description}...${colors.reset}`);

    try {
        const startTime = Date.now();
        const result = execSync(command, {
            encoding: 'utf8',
            timeout: TEST_TIMEOUT,
            ...options
        });
        const duration = Date.now() - startTime;

        console.log(`${colors.green}✅ ${description} - Concluído em ${duration}ms${colors.reset}`);
        return { success: true, output: result, duration };

    } catch (error) {
        console.log(`${colors.red}❌ ${description} - Falhou${colors.reset}`);
        console.log(`${colors.red}Erro: ${error.message}${colors.reset}`);
        return { success: false, error: error.message };
    }
}

// Função para verificar se arquivos de teste existem
function validateTestFiles() {
    console.log(`${colors.yellow}🔍 Validando arquivos de teste...${colors.reset}`);

    const testFiles = [
        'src/tests/unit/QuizToEditorAdapter.test.ts',
        'src/tests/unit/QuizPageIntegrationService.test.ts',
        'src/tests/unit/QuizStateController.test.tsx',
        'src/tests/integration/EndToEndFlow.test.tsx',
        'src/tests/performance/PerformanceAndStress.test.ts',
        'src/tests/regression/EdgeCases.test.ts'
    ];

    let allFilesExist = true;
    testFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`${colors.green}  ✅ ${file}${colors.reset}`);
        } else {
            console.log(`${colors.red}  ❌ ${file} - ARQUIVO NÃO ENCONTRADO${colors.reset}`);
            allFilesExist = false;
        }
    });

    return allFilesExist;
}

// Função para gerar relatório resumido
function generateSummary(results) {
    console.log(`${colors.cyan}${colors.bright}
╔══════════════════════════════════════════════════════════════╗
║                     📊 RELATÓRIO FINAL                      ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

    const totalTests = results.reduce((sum, result) => {
        if (result.success && result.output) {
            const match = result.output.match(/(\d+) passing/);
            return sum + (match ? parseInt(match[1]) : 0);
        }
        return sum;
    }, 0);

    const successfulSuites = results.filter(r => r.success).length;
    const totalSuites = results.length;

    console.log(`${colors.green}📈 Suítes executadas: ${successfulSuites}/${totalSuites}${colors.reset}`);
    console.log(`${colors.green}🧪 Total de testes: ~${totalTests}${colors.reset}`);

    // Calcular tempo total
    const totalTime = results.reduce((sum, r) => sum + (r.duration || 0), 0);
    console.log(`${colors.blue}⏱️  Tempo total: ${Math.round(totalTime / 1000)}s${colors.reset}`);

    // Status geral
    if (successfulSuites === totalSuites) {
        console.log(`${colors.green}${colors.bright}🎉 TODOS OS TESTES PASSARAM!${colors.reset}`);
        console.log(`${colors.green}✅ Sistema pronto para produção${colors.reset}`);
    } else {
        console.log(`${colors.red}${colors.bright}⚠️  ALGUMAS SUÍTES FALHARAM${colors.reset}`);
        console.log(`${colors.yellow}🔧 Revisar e corrigir antes do deploy${colors.reset}`);
    }
}

// EXECUÇÃO PRINCIPAL
async function runTestSuite() {
    console.log(`${colors.magenta}🚀 Iniciando execução da suíte completa...${colors.reset}\n`);

    // 1. Validar arquivos de teste
    if (!validateTestFiles()) {
        console.log(`${colors.red}❌ Arquivos de teste faltando. Abortando.${colors.reset}`);
        process.exit(1);
    }

    console.log(`${colors.green}✅ Todos os arquivos de teste encontrados${colors.reset}\n`);

    // 2. Executar suítes de teste
    const results = [];

    // Testes unitários
    results.push(runCommand(
        'npx jest src/tests/unit --verbose --no-cache',
        '🧩 Executando testes unitários (QuizToEditorAdapter, IntegrationService, StateController)'
    ));

    // Testes de integração
    results.push(runCommand(
        'npx jest src/tests/integration --verbose --no-cache',
        '🔄 Executando testes de integração (End-to-End Flow)'
    ));

    // Testes de performance
    results.push(runCommand(
        'npx jest src/tests/performance --verbose --no-cache --detectOpenHandles',
        '⚡ Executando testes de performance e stress'
    ));

    // Testes de regressão
    results.push(runCommand(
        'npx jest src/tests/regression --verbose --no-cache',
        '🛠️ Executando testes de regressão e casos extremos'
    ));

    // 3. Executar com cobertura de código
    results.push(runCommand(
        'npx jest --coverage --coverageReporters=text --coverageReporters=html --no-cache',
        '📊 Executando análise de cobertura de código'
    ));

    // 4. Gerar relatório resumido
    generateSummary(results);

    // 5. Verificar se cobertura foi gerada
    if (fs.existsSync('coverage/lcov-report/index.html')) {
        console.log(`${colors.blue}📄 Relatório de cobertura gerado: coverage/lcov-report/index.html${colors.reset}`);
    }

    // 6. Determinar código de saída
    const allPassed = results.every(r => r.success);
    process.exit(allPassed ? 0 : 1);
}

// Tratamento de erros e sinais
process.on('SIGINT', () => {
    console.log(`${colors.yellow}\n⚠️  Execução interrompida pelo usuário${colors.reset}`);
    process.exit(130);
});

process.on('uncaughtException', (error) => {
    console.log(`${colors.red}💥 Erro não tratado: ${error.message}${colors.reset}`);
    process.exit(1);
});

// Executar
runTestSuite();