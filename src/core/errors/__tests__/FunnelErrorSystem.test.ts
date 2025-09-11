/**
 * 🧪 TESTES DO SISTEMA DE ERROS DE FUNIS
 * 
 * Testes unitários e cenários de erro para validar:
 * - Códigos de erro padronizados
 * - Classe FunnelError customizada
 * - Handler central de erros
 * - Estratégias de recovery
 * - Componentes UI de erro
 */

import { FunnelErrorCode, getErrorDefinition } from '../FunnelErrorCodes';
import { FunnelError } from '../FunnelError';
import { globalFunnelErrorHandler, ErrorHandlingResult } from '../FunnelErrorHandler';
import { globalFunnelRecovery } from '../FunnelErrorRecovery';

// ============================================================================
// HELPER DE TESTES
// ============================================================================

class TestRunner {
    private tests: Array<{ name: string; fn: () => void | Promise<void> }> = [];
    private results: Array<{ name: string; passed: boolean; error?: string }> = [];

    test(name: string, fn: () => void | Promise<void>) {
        this.tests.push({ name, fn });
    }

    async run(): Promise<void> {
        console.log('\n🧪 === TESTES DO SISTEMA DE ERROS === 🧪\n');

        for (const test of this.tests) {
            try {
                await test.fn();
                this.results.push({ name: test.name, passed: true });
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.results.push({
                    name: test.name,
                    passed: false,
                    error: error instanceof Error ? error.message : String(error)
                });
                console.log(`❌ ${test.name}: ${error}`);
            }
        }

        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;

        console.log(`\n📊 Resultados: ${passed} ✅ | ${failed} ❌\n`);

        if (failed > 0) {
            console.log('💥 Testes que falharam:');
            this.results
                .filter(r => !r.passed)
                .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
            console.log();
        }
    }
}

// ============================================================================
// TESTES DOS CÓDIGOS DE ERRO
// ============================================================================

async function testErrorCodes(): Promise<void> {
    const runner = new TestRunner();

    runner.test('Error Codes - Deve ter todos os códigos essenciais', () => {
        const essentialCodes = [
            'NOT_FOUND',
            'NO_PERMISSION',
            'TIMEOUT',
            'NETWORK_ERROR',
            'STORAGE_ERROR',
            'INVALID_DATA',
            'VALIDATION_ERROR'
        ];

        for (const code of essentialCodes) {
            if (!(code in FunnelErrorCode)) {
                throw new Error(`Código de erro obrigatório ausente: ${code}`);
            }
        }
    });

    runner.test('Error Definitions - Deve retornar definições válidas', () => {
        const definition = getErrorDefinition(FunnelErrorCode.NOT_FOUND);

        if (!definition) {
            throw new Error('Definição de erro não encontrada');
        }

        if (!definition.userMessage || !definition.severity || !definition.recoveryStrategy) {
            throw new Error('Definição incompleta de erro');
        }

        if (!definition.recoveryStrategy) {
            throw new Error('Nenhuma estratégia de recovery definida');
        }
    });

    runner.test('Error Definitions - Deve ter severidades corretas', () => {
        const lowSeverityDefinition = getErrorDefinition(FunnelErrorCode.NOT_FOUND);
        const highSeverityDefinition = getErrorDefinition(FunnelErrorCode.CORRUPTED_DATA);

        if (!lowSeverityDefinition || lowSeverityDefinition.severity === 'critical') {
            throw new Error('Severidade incorreta para NOT_FOUND');
        }

        if (!highSeverityDefinition || highSeverityDefinition.severity !== 'critical') {
            throw new Error('Severidade incorreta para CORRUPTED_DATA');
        }
    });

    await runner.run();
}

// ============================================================================
// TESTES DA CLASSE FUNNELERROR
// ============================================================================

async function testFunnelError(): Promise<void> {
    const runner = new TestRunner();

    runner.test('FunnelError - Deve criar instância com dados corretos', () => {
        const error = new FunnelError(
            FunnelErrorCode.NOT_FOUND,
            'Test error message',
            { funnelId: 'test-123' }
        );

        if (error.code !== FunnelErrorCode.NOT_FOUND) {
            throw new Error('Código de erro incorreto');
        }

        if (error.message !== 'Test error message') {
            throw new Error('Mensagem de erro incorreta');
        }

        if (error.context.funnelId !== 'test-123') {
            throw new Error('Contexto de erro incorreto');
        }

        if (!error.definition) {
            throw new Error('Definição de erro não carregada');
        }

        if (!error.definition.recoveryStrategy) {
            throw new Error('Sem estratégias de recovery');
        }
    });

    runner.test('FunnelError - Deve herdar de Error nativo', () => {
        const error = new FunnelError(FunnelErrorCode.TIMEOUT, 'Test timeout');

        if (!(error instanceof Error)) {
            throw new Error('FunnelError deve herdar de Error');
        }

        if (!error.stack) {
            throw new Error('Stack trace não disponível');
        }
    });

    runner.test('FunnelError - Deve ter dados de recovery', () => {
        const error = new FunnelError(FunnelErrorCode.NETWORK_ERROR, 'Network failed');

        if (!error.definition.recoveryStrategy) {
            throw new Error('Sem estratégias de recovery');
        }

        if (!error.definition.userMessage) {
            throw new Error('Mensagem de usuário não definida');
        }
    });

    await runner.run();
}

// ============================================================================
// TESTES DO ERROR HANDLER
// ============================================================================

async function testErrorHandler(): Promise<void> {
    const runner = new TestRunner();

    runner.test('Error Handler - Deve processar FunnelError', async () => {
        const error = new FunnelError(
            FunnelErrorCode.VALIDATION_ERROR,
            'Invalid data provided',
            { funnelId: 'test-validation' }
        );

        const result: ErrorHandlingResult = await globalFunnelErrorHandler.handleError(error);

        if (!result.handled) {
            throw new Error('Erro não foi tratado');
        }
    });

    runner.test('Error Handler - Deve processar Error nativo', async () => {
        const nativeError = new Error('Generic error');

        const result: ErrorHandlingResult = await globalFunnelErrorHandler.handleError(nativeError);

        if (!result.handled) {
            throw new Error('Erro nativo não foi tratado');
        }
    });

    await runner.run();
}

// ============================================================================
// TESTES DO ERROR RECOVERY
// ============================================================================

async function testErrorRecovery(): Promise<void> {
    const runner = new TestRunner();

    runner.test('Error Recovery - Sistema existe e está disponível', () => {
        if (!globalFunnelRecovery) {
            throw new Error('Sistema de recovery não está disponível');
        }
    });

    await runner.run();
}

// ============================================================================
// TESTES DE INTEGRAÇÃO
// ============================================================================

async function testIntegration(): Promise<void> {
    const runner = new TestRunner();

    runner.test('Integração - Sistema completo está funcional', async () => {
        // Simula um erro real de storage
        const originalError = new Error('QuotaExceededError: Storage quota exceeded');

        // Handler deveria processar sem falhar
        const result = await globalFunnelErrorHandler.handleError(originalError);

        if (!result.handled) {
            throw new Error('Erro não foi tratado pelo handler');
        }
    });

    runner.test('Integração - Múltiplos erros consecutivos', async () => {
        const errors = [
            new FunnelError(FunnelErrorCode.NETWORK_ERROR, 'Network 1'),
            new FunnelError(FunnelErrorCode.TIMEOUT, 'Timeout 1'),
            new FunnelError(FunnelErrorCode.STORAGE_ERROR, 'Storage 1')
        ];

        const results = [];

        for (const error of errors) {
            const result = await globalFunnelErrorHandler.handleError(error);
            results.push(result);
        }

        if (results.length !== 3) {
            throw new Error('Nem todos os erros foram processados');
        }

        if (!results.every(r => r.handled)) {
            throw new Error('Algum erro não foi tratado');
        }
    });

    await runner.run();
}

// ============================================================================
// EXECUÇÃO DOS TESTES
// ============================================================================

export async function runFunnelErrorSystemTests(): Promise<void> {
    console.log('🚀 Iniciando testes do sistema de erros de funis...\n');

    try {
        await testErrorCodes();
        await testFunnelError();
        await testErrorHandler();
        await testErrorRecovery();
        await testIntegration();

        console.log('🎉 Todos os testes do sistema de erros concluídos!\n');
    } catch (error) {
        console.error('💥 Erro durante execução dos testes:', error);
        throw error;
    }
}

// Para executar diretamente
if (typeof window !== 'undefined' && window.location) {
    // Browser environment
    (window as any).runFunnelErrorSystemTests = runFunnelErrorSystemTests;
}
