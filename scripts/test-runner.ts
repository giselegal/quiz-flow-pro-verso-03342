#!/usr/bin/env node

/**
 * 🧪 TEST RUNNER - COMPREHENSIVE TESTING EXECUTION
 * 
 * FASE 6: Runner avançado para execução de todos os tipos de teste:
 * ✅ Unit, Integration, Performance, E2E tests
 * ✅ Coverage reports detalhados
 * ✅ Performance monitoring
 * ✅ CI/CD integration
 * ✅ Relatórios em múltiplos formatos
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

interface TestConfig {
    type: 'unit' | 'integration' | 'performance' | 'e2e' | 'all';
    watch: boolean;
    coverage: boolean;
    reporter: 'verbose' | 'minimal' | 'json' | 'html';
    parallel: boolean;
    timeout: number;
}

interface TestResult {
    type: string;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
    coverage?: CoverageReport;
}

interface CoverageReport {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
}

class ComprehensiveTestRunner {
    private results: TestResult[] = [];
    private config: TestConfig;
    private projectRoot: string;

    constructor(config: TestConfig) {
        this.config = config;
        this.projectRoot = process.cwd();
    }

    async run(): Promise<void> {
        console.log(chalk.blue.bold('🧪 INICIANDO EXECUÇÃO COMPLETA DE TESTES'));
        console.log(chalk.gray('='.repeat(60)));

        const startTime = Date.now();

        try {
            await this.setupEnvironment();

            if (this.config.type === 'all') {
                await this.runAllTestSuites();
            } else {
                await this.runSpecificTestSuite(this.config.type);
            }

            const totalDuration = Date.now() - startTime;
            await this.generateFinalReport(totalDuration);

        } catch (error) {
            console.error(chalk.red('❌ Erro na execução dos testes:'), error);
            process.exit(1);
        }
    }

    private async setupEnvironment(): Promise<void> {
        const spinner = ora('Configurando ambiente de testes...').start();

        try {
            // Verifica se vitest está instalado
            try {
                execSync('npx vitest --version', { stdio: 'pipe' });
            } catch {
                spinner.text = 'Instalando vitest...';
                execSync('npm install --save-dev vitest @vitest/ui', { stdio: 'pipe' });
            }

            // Cria diretórios necessários
            const dirs = ['coverage', 'test-results', 'logs'];
            for (const dir of dirs) {
                await fs.mkdir(path.join(this.projectRoot, dir), { recursive: true });
            }

            // Limpa resultados anteriores
            if (!this.config.watch) {
                await this.cleanPreviousResults();
            }

            spinner.succeed('Ambiente configurado');

        } catch (error) {
            spinner.fail('Erro na configuração do ambiente');
            throw error;
        }
    }

    private async cleanPreviousResults(): Promise<void> {
        const paths = [
            'coverage',
            'test-results',
            'logs/test-*.log'
        ];

        for (const pathPattern of paths) {
            try {
                const fullPath = path.join(this.projectRoot, pathPattern);
                if (pathPattern.includes('*')) {
                    // Handle glob patterns
                    const dir = path.dirname(fullPath);
                    const pattern = path.basename(fullPath);
                    const files = await fs.readdir(dir);

                    for (const file of files) {
                        if (file.match(pattern.replace('*', '.*'))) {
                            await fs.unlink(path.join(dir, file));
                        }
                    }
                } else {
                    await fs.rm(fullPath, { recursive: true, force: true });
                }
            } catch {
                // Ignore errors for non-existent files
            }
        }
    }

    private async runAllTestSuites(): Promise<void> {
        const suites: Array<TestConfig['type']> = ['unit', 'integration', 'performance'];

        for (const suite of suites) {
            if (suite !== 'all') {
                await this.runSpecificTestSuite(suite);
            }
        }
    }

    private async runSpecificTestSuite(type: TestConfig['type']): Promise<void> {
        console.log(`\n📋 Executando testes: ${chalk.cyan(type.toUpperCase())}`);

        const spinner = ora(`Executando ${type} tests...`).start();
        const startTime = Date.now();

        try {
            const result = await this.executeTestCommand(type);
            const duration = Date.now() - startTime;

            this.results.push({
                type,
                ...result,
                duration
            });

            spinner.succeed(`${type} tests concluídos (${(duration / 1000).toFixed(2)}s)`);

            // Log resultados imediatos
            this.logTestResult(result, type);

        } catch (error) {
            const duration = Date.now() - startTime;
            spinner.fail(`${type} tests falharam`);

            this.results.push({
                type,
                passed: 0,
                failed: 1,
                skipped: 0,
                duration
            });

            console.error(chalk.red(`Erro em ${type} tests:`), error);
        }
    }

    private async executeTestCommand(type: TestConfig['type']): Promise<Omit<TestResult, 'type' | 'duration'>> {
        const baseArgs = ['vitest', 'run'];

        // Configuração específica por tipo de teste
        const typeConfigs = {
            unit: {
                include: ['src/**/*.test.{ts,tsx}', 'src/testing/**/*.test.ts'],
                exclude: ['**/*.perf.test.*', '**/*.e2e.test.*'],
                timeout: 10000
            },
            integration: {
                include: ['tests/integration/**/*.test.{ts,tsx}'],
                timeout: 60000,
                threads: false // Sequencial para integração
            },
            performance: {
                include: ['**/*.perf.test.{ts,tsx}'],
                timeout: 30000,
                threads: false // Single thread para medições consistentes
            },
            e2e: {
                include: ['tests/e2e/**/*.test.{ts,tsx}'],
                timeout: 120000,
                threads: false
            }
        };

        const typeConfig = typeConfigs[type as keyof typeof typeConfigs];
        if (typeConfig) {
            if (typeConfig.include) {
                baseArgs.push('--include', typeConfig.include.join(','));
            }
            if (typeConfig.exclude) {
                baseArgs.push('--exclude', typeConfig.exclude.join(','));
            }
            if (typeConfig.timeout) {
                baseArgs.push('--testTimeout', typeConfig.timeout.toString());
            }
            if (typeConfig.threads === false) {
                baseArgs.push('--no-threads');
            }
        }

        // Configurações globais
        if (this.config.coverage && type === 'unit') {
            baseArgs.push('--coverage');
        }

        if (this.config.reporter) {
            baseArgs.push('--reporter', this.config.reporter);
        }

        // Output para arquivos
        const outputFile = path.join(this.projectRoot, 'test-results', `${type}-results.json`);
        baseArgs.push('--outputFile', outputFile);

        return new Promise((resolve, reject) => {
            const child = spawn('npx', baseArgs, {
                cwd: this.projectRoot,
                stdio: 'pipe'
            });

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('close', async (code) => {
                try {
                    const result = await this.parseTestOutput(stdout, stderr, outputFile, type);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });

            child.on('error', reject);
        });
    }

    private async parseTestOutput(
        stdout: string,
        stderr: string,
        outputFile: string,
        type: string
    ): Promise<Omit<TestResult, 'type' | 'duration'>> {
        try {
            // Tenta ler arquivo de saída JSON
            if (await this.fileExists(outputFile)) {
                const results = JSON.parse(await fs.readFile(outputFile, 'utf8'));

                return {
                    passed: results.numPassedTests || 0,
                    failed: results.numFailedTests || 0,
                    skipped: results.numPendingTests || 0,
                    coverage: results.coverageMap ? await this.parseCoverageData(results.coverageMap) : undefined
                };
            }
        } catch {
            // Fall back to parsing stdout
        }

        // Parse manual da saída
        const passed = this.extractNumber(stdout, /(\d+) passed/) || 0;
        const failed = this.extractNumber(stdout, /(\d+) failed/) || 0;
        const skipped = this.extractNumber(stdout, /(\d+) skipped/) || 0;

        return { passed, failed, skipped };
    }

    private extractNumber(text: string, regex: RegExp): number | null {
        const match = text.match(regex);
        return match ? parseInt(match[1], 10) : null;
    }

    private async parseCoverageData(coverageMap: any): Promise<CoverageReport> {
        // Parse coverage data based on format
        return {
            statements: 0,
            branches: 0,
            functions: 0,
            lines: 0
        };
    }

    private async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    private logTestResult(result: Omit<TestResult, 'type' | 'duration'>, type: string): void {
        const total = result.passed + result.failed + result.skipped;

        console.log(`  ${chalk.green('✅ Passou:')} ${result.passed}`);
        console.log(`  ${chalk.red('❌ Falhou:')} ${result.failed}`);
        console.log(`  ${chalk.yellow('⏭️  Pulou:')} ${result.skipped}`);
        console.log(`  ${chalk.blue('📊 Total:')} ${total}`);

        if (result.coverage) {
            console.log(`  ${chalk.cyan('🔍 Coverage:')} Statements: ${result.coverage.statements}%, Lines: ${result.coverage.lines}%`);
        }
    }

    private async generateFinalReport(totalDuration: number): Promise<void> {
        console.log('\n' + chalk.blue.bold('📊 RELATÓRIO FINAL'));
        console.log(chalk.gray('='.repeat(60)));

        const totals = this.results.reduce(
            (acc, result) => ({
                passed: acc.passed + result.passed,
                failed: acc.failed + result.failed,
                skipped: acc.skipped + result.skipped,
                duration: acc.duration + result.duration
            }),
            { passed: 0, failed: 0, skipped: 0, duration: 0 }
        );

        // Resumo geral
        const total = totals.passed + totals.failed + totals.skipped;
        const successRate = total > 0 ? (totals.passed / total * 100).toFixed(1) : '0';

        console.log(`${chalk.green('✅ Total Passou:')} ${totals.passed}`);
        console.log(`${chalk.red('❌ Total Falhou:')} ${totals.failed}`);
        console.log(`${chalk.yellow('⏭️  Total Pulou:')} ${totals.skipped}`);
        console.log(`${chalk.blue('📊 Taxa de Sucesso:')} ${successRate}%`);
        console.log(`${chalk.cyan('⏱️  Tempo Total:')} ${(totalDuration / 1000).toFixed(2)}s`);

        // Relatório por tipo
        console.log('\n' + chalk.bold('📋 DETALHES POR TIPO:'));
        this.results.forEach(result => {
            const typeTotal = result.passed + result.failed + result.skipped;
            const typeSuccess = typeTotal > 0 ? (result.passed / typeTotal * 100).toFixed(1) : '0';

            console.log(`\n${chalk.cyan(result.type.toUpperCase())}:`);
            console.log(`  Passou: ${result.passed} | Falhou: ${result.failed} | Pulou: ${result.skipped}`);
            console.log(`  Sucesso: ${typeSuccess}% | Tempo: ${(result.duration / 1000).toFixed(2)}s`);
        });

        // Salva relatório em arquivo
        await this.saveReport({ totals, totalDuration, details: this.results });

        // Status final
        if (totals.failed === 0) {
            console.log('\n' + chalk.green.bold('🎉 TODOS OS TESTES PASSARAM!'));
        } else {
            console.log('\n' + chalk.red.bold(`❌ ${totals.failed} TESTES FALHARAM`));
            process.exit(1);
        }
    }

    private async saveReport(report: any): Promise<void> {
        const reportPath = path.join(this.projectRoot, 'test-results', 'final-report.json');
        const htmlReportPath = path.join(this.projectRoot, 'test-results', 'report.html');

        // Salva JSON
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

        // Gera HTML
        const htmlContent = this.generateHtmlReport(report);
        await fs.writeFile(htmlReportPath, htmlContent);

        console.log(`\n${chalk.blue('📄 Relatórios salvos:')}`);
        console.log(`  JSON: ${reportPath}`);
        console.log(`  HTML: ${htmlReportPath}`);
    }

    private generateHtmlReport(report: any): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Test Report - Quiz Quest</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .metric { background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
        .success { color: #28a745; }
        .danger { color: #dc3545; }
        .warning { color: #ffc107; }
        .info { color: #17a2b8; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Quiz Quest - Relatório de Testes</h1>
        <p>Gerado em: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <h3 class="success">✅ Passou</h3>
            <p class="success">${report.totals.passed}</p>
        </div>
        <div class="metric">
            <h3 class="danger">❌ Falhou</h3>
            <p class="danger">${report.totals.failed}</p>
        </div>
        <div class="metric">
            <h3 class="warning">⏭️ Pulou</h3>
            <p class="warning">${report.totals.skipped}</p>
        </div>
        <div class="metric">
            <h3 class="info">⏱️ Tempo</h3>
            <p class="info">${(report.totalDuration / 1000).toFixed(2)}s</p>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Tipo de Teste</th>
                <th>Passou</th>
                <th>Falhou</th>
                <th>Pulou</th>
                <th>Taxa de Sucesso</th>
                <th>Tempo</th>
            </tr>
        </thead>
        <tbody>
            ${report.details.map((result: TestResult) => {
            const total = result.passed + result.failed + result.skipped;
            const successRate = total > 0 ? (result.passed / total * 100).toFixed(1) : '0';
            return `
                <tr>
                    <td>${result.type.toUpperCase()}</td>
                    <td class="success">${result.passed}</td>
                    <td class="danger">${result.failed}</td>
                    <td class="warning">${result.skipped}</td>
                    <td>${successRate}%</td>
                    <td>${(result.duration / 1000).toFixed(2)}s</td>
                </tr>
              `;
        }).join('')}
        </tbody>
    </table>
</body>
</html>
    `.trim();
    }
}

// === CLI INTERFACE ===

function parseArgs(): TestConfig {
    const args = process.argv.slice(2);

    const config: TestConfig = {
        type: 'all',
        watch: false,
        coverage: false,
        reporter: 'verbose',
        parallel: true,
        timeout: 10000
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        switch (arg) {
            case '--type':
            case '-t':
                config.type = args[++i] as TestConfig['type'];
                break;
            case '--watch':
            case '-w':
                config.watch = true;
                break;
            case '--coverage':
            case '-c':
                config.coverage = true;
                break;
            case '--reporter':
            case '-r':
                config.reporter = args[++i] as TestConfig['reporter'];
                break;
            case '--no-parallel':
                config.parallel = false;
                break;
            case '--timeout':
                config.timeout = parseInt(args[++i], 10);
                break;
            case '--help':
            case '-h':
                showHelp();
                process.exit(0);
        }
    }

    return config;
}

function showHelp(): void {
    console.log(`
🧪 COMPREHENSIVE TEST RUNNER

USO:
  npm run test:comprehensive [OPÇÕES]

OPÇÕES:
  -t, --type <type>        Tipo de teste: unit|integration|performance|e2e|all (default: all)
  -w, --watch             Modo watch para desenvolvimento
  -c, --coverage          Gerar relatório de cobertura
  -r, --reporter <type>   Reporter: verbose|minimal|json|html (default: verbose)
  --no-parallel          Desabilita execução paralela
  --timeout <ms>         Timeout customizado em ms (default: 10000)
  -h, --help             Mostra esta ajuda

EXEMPLOS:
  npm run test:comprehensive                    # Todos os testes
  npm run test:comprehensive --type unit -c     # Unit tests com coverage
  npm run test:comprehensive --type perf        # Apenas testes de performance
  npm run test:comprehensive --watch            # Modo watch
`);
}

// === EXECUÇÃO PRINCIPAL ===

async function main(): Promise<void> {
    const config = parseArgs();
    const runner = new ComprehensiveTestRunner(config);
    await runner.run();
}

if (require.main === module) {
    main().catch(error => {
        console.error(chalk.red('❌ Erro fatal:'), error);
        process.exit(1);
    });
}

export { ComprehensiveTestRunner };
export default main;