/**
 * 🧪 COMPREHENSIVE TESTING SYSTEM - FASE 6
 * 
 * Sistema completo de testes para validação da arquitetura consolidada:
 * ✅ Unit Tests para componentes individuais
 * ✅ Integration Tests para fluxos completos  
 * ✅ Performance Tests para otimizações
 * ✅ Migration Validation Tests
 * ✅ End-to-End Testing automation
 * ✅ Code Quality & Coverage analysis
 */

import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { performance } from 'perf_hooks';

// Import dos sistemas consolidados
import { MasterSchema } from '../src/consolidated/schemas/masterSchema';
import { useUnifiedEditor } from '../src/consolidated/hooks/useUnifiedEditor';
import { UnifiedEditorService } from '../src/consolidated/services/UnifiedEditorService';
import { GlobalStateService } from '../src/consolidated/services/GlobalStateService';
import { BundleOptimizer } from '../src/optimization/BundleOptimizer';
import { MigrationSystem } from '../src/migration/MigrationSystem';

// === CONFIGURAÇÃO GLOBAL DE TESTES ===

export interface TestSuite {
    name: string;
    tests: TestCase[];
    setupFn?: () => Promise<void>;
    teardownFn?: () => Promise<void>;
}

export interface TestCase {
    name: string;
    testFn: () => Promise<void>;
    timeout?: number;
    skip?: boolean;
}

export interface PerformanceMetrics {
    duration: number;
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage?: NodeJS.CpuUsage;
}

export class ComprehensiveTestRunner {
    private results: Map<string, TestResult> = new Map();
    private metrics: Map<string, PerformanceMetrics> = new Map();

    async runAllTests(): Promise<TestReport> {
        console.log('🧪 Iniciando bateria completa de testes...');

        const suites = [
            this.createSchemaTestSuite(),
            this.createHooksTestSuite(),
            this.createServicesTestSuite(),
            this.createOptimizationTestSuite(),
            this.createMigrationTestSuite(),
            this.createIntegrationTestSuite(),
            this.createPerformanceTestSuite()
        ];

        const startTime = performance.now();

        for (const suite of suites) {
            await this.runTestSuite(suite);
        }

        const endTime = performance.now();

        return this.generateReport(endTime - startTime);
    }

    private async runTestSuite(suite: TestSuite): Promise<void> {
        console.log(`\n📋 Executando: ${suite.name}`);

        if (suite.setupFn) {
            await suite.setupFn();
        }

        try {
            for (const test of suite.tests) {
                if (test.skip) {
                    console.log(`⏭️  Pulando: ${test.name}`);
                    continue;
                }

                const result = await this.runSingleTest(test);
                this.results.set(`${suite.name} - ${test.name}`, result);
            }
        } finally {
            if (suite.teardownFn) {
                await suite.teardownFn();
            }
        }
    }

    private async runSingleTest(test: TestCase): Promise<TestResult> {
        const startTime = performance.now();
        const startMemory = process.memoryUsage();
        const startCpu = process.cpuUsage();

        try {
            await Promise.race([
                test.testFn(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Test timeout')), test.timeout || 10000)
                )
            ]);

            const endTime = performance.now();
            const endMemory = process.memoryUsage();
            const endCpu = process.cpuUsage(startCpu);

            this.metrics.set(test.name, {
                duration: endTime - startTime,
                memoryUsage: endMemory,
                cpuUsage: endCpu
            });

            console.log(`✅ ${test.name} (${(endTime - startTime).toFixed(2)}ms)`);
            return { passed: true, duration: endTime - startTime };

        } catch (error) {
            const endTime = performance.now();
            console.log(`❌ ${test.name} - ${error instanceof Error ? error.message : String(error)}`);
            return {
                passed: false,
                duration: endTime - startTime,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

    // === SCHEMA TESTS ===

    private createSchemaTestSuite(): TestSuite {
        return {
            name: 'Master Schema Tests',
            tests: [
                {
                    name: 'Schema validation - Quiz creation',
                    testFn: async () => {
                        const validQuiz = {
                            id: 'test-quiz-1',
                            title: 'Test Quiz',
                            description: 'Quiz para testes',
                            questions: [{
                                id: 'q1',
                                type: 'multiple-choice' as const,
                                text: 'Pergunta teste?',
                                options: [
                                    { id: 'opt1', text: 'Opção 1', isCorrect: true },
                                    { id: 'opt2', text: 'Opção 2', isCorrect: false }
                                ]
                            }],
                            settings: {
                                timeLimit: 300,
                                allowBacktrack: true,
                                shuffleQuestions: false
                            }
                        };

                        const result = MasterSchema.Quiz.safeParse(validQuiz);
                        expect(result.success).toBe(true);
                    }
                },
                {
                    name: 'Schema validation - Invalid quiz rejection',
                    testFn: async () => {
                        const invalidQuiz = {
                            id: '', // ID vazio deve falhar
                            title: 'Test Quiz',
                            questions: [] // Array vazio deve falhar
                        };

                        const result = MasterSchema.Quiz.safeParse(invalidQuiz);
                        expect(result.success).toBe(false);
                    }
                },
                {
                    name: 'Schema performance - Large quiz validation',
                    testFn: async () => {
                        const largeQuiz = {
                            id: 'large-quiz',
                            title: 'Quiz com muitas perguntas',
                            description: 'Teste de performance',
                            questions: Array.from({ length: 100 }, (_, i) => ({
                                id: `q${i}`,
                                type: 'multiple-choice' as const,
                                text: `Pergunta ${i}?`,
                                options: [
                                    { id: `opt${i}a`, text: 'Opção A', isCorrect: true },
                                    { id: `opt${i}b`, text: 'Opção B', isCorrect: false }
                                ]
                            })),
                            settings: {
                                timeLimit: 600,
                                allowBacktrack: true,
                                shuffleQuestions: true
                            }
                        };

                        const startTime = performance.now();
                        const result = MasterSchema.Quiz.safeParse(largeQuiz);
                        const duration = performance.now() - startTime;

                        expect(result.success).toBe(true);
                        expect(duration).toBeLessThan(100); // Deve validar em menos de 100ms
                    }
                }
            ]
        };
    }

    // === HOOKS TESTS ===

    private createHooksTestSuite(): TestSuite {
        return {
            name: 'Consolidated Hooks Tests',
            tests: [
                {
                    name: 'useUnifiedEditor - Initialization',
                    testFn: async () => {
                        const { result } = renderHook(() => useUnifiedEditor());

                        expect(result.current.state.quiz).toBeDefined();
                        expect(result.current.state.currentQuestionIndex).toBe(0);
                        expect(result.current.state.isLoading).toBe(false);
                        expect(result.current.actions.addQuestion).toBeInstanceOf(Function);
                    }
                },
                {
                    name: 'useUnifiedEditor - Add question functionality',
                    testFn: async () => {
                        const { result } = renderHook(() => useUnifiedEditor());

                        act(() => {
                            result.current.actions.addQuestion({
                                id: 'new-question',
                                type: 'multiple-choice',
                                text: 'Nova pergunta?',
                                options: [
                                    { id: 'opt1', text: 'Opção 1', isCorrect: true },
                                    { id: 'opt2', text: 'Opção 2', isCorrect: false }
                                ]
                            });
                        });

                        expect(result.current.state.quiz.questions).toHaveLength(1);
                        expect(result.current.state.quiz.questions[0].text).toBe('Nova pergunta?');
                    }
                },
                {
                    name: 'useUnifiedEditor - Performance under load',
                    testFn: async () => {
                        const { result } = renderHook(() => useUnifiedEditor());

                        const startTime = performance.now();

                        // Adiciona 50 perguntas rapidamente
                        act(() => {
                            for (let i = 0; i < 50; i++) {
                                result.current.actions.addQuestion({
                                    id: `question-${i}`,
                                    type: 'multiple-choice',
                                    text: `Pergunta ${i}?`,
                                    options: [
                                        { id: `opt${i}a`, text: 'Opção A', isCorrect: true },
                                        { id: `opt${i}b`, text: 'Opção B', isCorrect: false }
                                    ]
                                });
                            }
                        });

                        const duration = performance.now() - startTime;

                        expect(result.current.state.quiz.questions).toHaveLength(50);
                        expect(duration).toBeLessThan(200); // Deve processar em menos de 200ms
                    }
                }
            ]
        };
    }

    // === SERVICES TESTS ===

    private createServicesTestSuite(): TestSuite {
        return {
            name: 'Consolidated Services Tests',
            tests: [
                {
                    name: 'UnifiedEditorService - Quiz operations',
                    testFn: async () => {
                        const service = new UnifiedEditorService();

                        const quiz = await service.createQuiz({
                            title: 'Teste Service',
                            description: 'Quiz criado via service'
                        });

                        expect(quiz.id).toBeDefined();
                        expect(quiz.title).toBe('Teste Service');
                        expect(quiz.questions).toEqual([]);
                    }
                },
                {
                    name: 'GlobalStateService - State management',
                    testFn: async () => {
                        const service = GlobalStateService.getInstance();

                        service.setState('currentQuiz', {
                            id: 'test',
                            title: 'Test Quiz',
                            questions: []
                        });

                        const state = service.getState();
                        expect(state.currentQuiz?.title).toBe('Test Quiz');
                    }
                },
                {
                    name: 'Services integration - Full workflow',
                    testFn: async () => {
                        const editorService = new UnifiedEditorService();
                        const globalService = GlobalStateService.getInstance();

                        // Cria quiz
                        const quiz = await editorService.createQuiz({
                            title: 'Integration Test',
                            description: 'Teste de integração'
                        });

                        // Define no estado global
                        globalService.setState('currentQuiz', quiz);

                        // Adiciona pergunta
                        const updatedQuiz = await editorService.addQuestion(quiz.id, {
                            id: 'int-q1',
                            type: 'multiple-choice',
                            text: 'Pergunta de integração?',
                            options: [
                                { id: 'opt1', text: 'Sim', isCorrect: true },
                                { id: 'opt2', text: 'Não', isCorrect: false }
                            ]
                        });

                        expect(updatedQuiz.questions).toHaveLength(1);

                        // Verifica estado global
                        const currentState = globalService.getState();
                        expect(currentState.currentQuiz?.id).toBe(quiz.id);
                    }
                }
            ]
        };
    }

    // === OPTIMIZATION TESTS ===

    private createOptimizationTestSuite(): TestSuite {
        return {
            name: 'Bundle Optimization Tests',
            tests: [
                {
                    name: 'BundleOptimizer - Code splitting',
                    testFn: async () => {
                        const optimizer = new BundleOptimizer();

                        const chunks = await optimizer.analyzeChunks('./src');
                        expect(chunks).toBeDefined();
                        expect(Object.keys(chunks).length).toBeGreaterThan(0);
                    }
                },
                {
                    name: 'Lazy loading - Component loading time',
                    testFn: async () => {
                        const startTime = performance.now();

                        // Simula lazy loading de componente
                        const LazyComponent = await import('../src/optimization/LazyLoadingSystem');

                        const loadTime = performance.now() - startTime;

                        expect(LazyComponent).toBeDefined();
                        expect(loadTime).toBeLessThan(100); // Carregamento rápido
                    }
                }
            ]
        };
    }

    // === MIGRATION TESTS ===

    private createMigrationTestSuite(): TestSuite {
        return {
            name: 'Migration System Tests',
            tests: [
                {
                    name: 'MigrationSystem - Dry run analysis',
                    testFn: async () => {
                        const migrationSystem = new MigrationSystem();

                        const report = await migrationSystem.migrateProject({
                            sourceDir: './test-fixtures',
                            dryRun: true
                        });

                        expect(report).toBeDefined();
                        expect(report.results).toBeInstanceOf(Array);
                    }
                }
            ]
        };
    }

    // === INTEGRATION TESTS ===

    private createIntegrationTestSuite(): TestSuite {
        return {
            name: 'Integration Tests',
            tests: [
                {
                    name: 'Full application workflow',
                    testFn: async () => {
                        // Testa fluxo completo: criar quiz → adicionar perguntas → salvar
                        const editorService = new UnifiedEditorService();

                        // Passo 1: Criar quiz
                        const quiz = await editorService.createQuiz({
                            title: 'Quiz de Integração',
                            description: 'Teste completo'
                        });

                        // Passo 2: Adicionar múltiplas perguntas
                        const questions = [
                            {
                                id: 'int-q1',
                                type: 'multiple-choice' as const,
                                text: 'Primeira pergunta?',
                                options: [
                                    { id: 'opt1', text: 'Opção 1', isCorrect: true },
                                    { id: 'opt2', text: 'Opção 2', isCorrect: false }
                                ]
                            },
                            {
                                id: 'int-q2',
                                type: 'true-false' as const,
                                text: 'Segunda pergunta?',
                                options: [
                                    { id: 'true', text: 'Verdadeiro', isCorrect: false },
                                    { id: 'false', text: 'Falso', isCorrect: true }
                                ]
                            }
                        ];

                        let updatedQuiz = quiz;
                        for (const question of questions) {
                            updatedQuiz = await editorService.addQuestion(updatedQuiz.id, question);
                        }

                        // Passo 3: Validar resultado final
                        expect(updatedQuiz.questions).toHaveLength(2);
                        expect(updatedQuiz.title).toBe('Quiz de Integração');

                        // Passo 4: Validar com schema
                        const validation = MasterSchema.Quiz.safeParse(updatedQuiz);
                        expect(validation.success).toBe(true);
                    }
                }
            ]
        };
    }

    // === PERFORMANCE TESTS ===

    private createPerformanceTestSuite(): TestSuite {
        return {
            name: 'Performance Tests',
            tests: [
                {
                    name: 'Memory usage - Large quiz handling',
                    testFn: async () => {
                        const startMemory = process.memoryUsage();

                        // Cria quiz com muitas perguntas
                        const editorService = new UnifiedEditorService();
                        const quiz = await editorService.createQuiz({
                            title: 'Large Quiz Performance Test',
                            description: 'Teste de performance com quiz grande'
                        });

                        let updatedQuiz = quiz;
                        for (let i = 0; i < 200; i++) {
                            updatedQuiz = await editorService.addQuestion(updatedQuiz.id, {
                                id: `perf-q${i}`,
                                type: 'multiple-choice',
                                text: `Pergunta de performance ${i}?`,
                                options: [
                                    { id: `opt${i}a`, text: 'Opção A', isCorrect: true },
                                    { id: `opt${i}b`, text: 'Opção B', isCorrect: false }
                                ]
                            });
                        }

                        const endMemory = process.memoryUsage();
                        const memoryIncrease = endMemory.heapUsed - startMemory.heapUsed;

                        // Verifica se o aumento de memória está dentro do esperado
                        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Menos de 50MB
                        expect(updatedQuiz.questions).toHaveLength(200);
                    }
                },
                {
                    name: 'Response time - Quick operations',
                    testFn: async () => {
                        const operations = [];
                        const editorService = new UnifiedEditorService();

                        // Testa 20 operações rápidas
                        for (let i = 0; i < 20; i++) {
                            const startTime = performance.now();

                            await editorService.createQuiz({
                                title: `Quick Quiz ${i}`,
                                description: 'Teste de velocidade'
                            });

                            const duration = performance.now() - startTime;
                            operations.push(duration);
                        }

                        const avgTime = operations.reduce((a, b) => a + b, 0) / operations.length;
                        const maxTime = Math.max(...operations);

                        expect(avgTime).toBeLessThan(10); // Média abaixo de 10ms
                        expect(maxTime).toBeLessThan(50);  // Máximo abaixo de 50ms
                    }
                }
            ]
        };
    }

    private generateReport(totalDuration: number): TestReport {
        const totalTests = this.results.size;
        const passedTests = Array.from(this.results.values()).filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;

        console.log('\n' + '='.repeat(60));
        console.log('📊 RELATÓRIO FINAL DE TESTES');
        console.log('='.repeat(60));
        console.log(`Total de testes: ${totalTests}`);
        console.log(`✅ Passou: ${passedTests}`);
        console.log(`❌ Falhou: ${failedTests}`);
        console.log(`⏱️  Tempo total: ${(totalDuration / 1000).toFixed(2)}s`);
        console.log(`📈 Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

        return {
            totalTests,
            passedTests,
            failedTests,
            totalDuration,
            successRate: (passedTests / totalTests) * 100,
            results: Array.from(this.results.entries()).map(([name, result]) => ({
                testName: name,
                ...result
            })),
            metrics: Object.fromEntries(this.metrics)
        };
    }
}

// === INTERFACES ===

interface TestResult {
    passed: boolean;
    duration: number;
    error?: string;
}

interface TestReport {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    totalDuration: number;
    successRate: number;
    results: Array<{ testName: string } & TestResult>;
    metrics: Record<string, PerformanceMetrics>;
}

// === EXECUÇÃO PRINCIPAL ===

export async function runComprehensiveTests(): Promise<TestReport> {
    const testRunner = new ComprehensiveTestRunner();
    return await testRunner.runAllTests();
}

// Execução automática se chamado diretamente
if (require.main === module) {
    runComprehensiveTests().then(report => {
        console.log('\n🎉 Testes concluídos!');
        process.exit(report.failedTests > 0 ? 1 : 0);
    }).catch(error => {
        console.error('❌ Erro na execução dos testes:', error);
        process.exit(1);
    });
}

export default ComprehensiveTestRunner;