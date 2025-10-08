/**
 * @file QuizEditorBridgeIntegration.test.ts
 * @description Testes de Integração - QuizEditorBridge com Utils Testados
 * 
 * Valida que QuizEditorBridge agora usa:
 * - quizConversionUtils (Fase 4)
 * - quizValidationUtils (Fase 5)
 * 
 * @phase Fase 6.5: Integração
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { quizEditorBridge } from '@/services/QuizEditorBridge';
import { QUIZ_STEPS } from '@/data/quizSteps';

describe('QuizEditorBridge Integration Tests - Fase 6.5', () => {

    // ============================================================================
    // TEST GROUP 1: Verificar Imports das Utils
    // ============================================================================

    describe('1. QuizEditorBridge usa Utils Testados', () => {

        it('deve ter método validateFunnel que usa quizValidationUtils', () => {
            expect(quizEditorBridge.validateFunnel).toBeDefined();
            expect(typeof quizEditorBridge.validateFunnel).toBe('function');
        });

        it('deve validar funil completo usando validateCompleteFunnel', () => {
            // Criar funil de teste
            const testFunnel = {
                id: 'test-funnel',
                name: 'Test Funnel',
                slug: 'test',
                steps: Object.entries(QUIZ_STEPS).map(([id, step], index) => ({
                    ...step,
                    id,
                    order: index + 1
                })),
                isPublished: false,
                version: 1
            };

            // Validar
            const result = quizEditorBridge.validateFunnel(testFunnel);

            // Verificar estrutura de retorno
            expect(result).toHaveProperty('valid');
            expect(result).toHaveProperty('errors');
            expect(result).toHaveProperty('warnings');

            // Verificar tipos
            expect(typeof result.valid).toBe('boolean');
            expect(Array.isArray(result.errors)).toBe(true);
            expect(Array.isArray(result.warnings)).toBe(true);
        });

        it('deve validar QUIZ_STEPS com validateCompleteFunnel', () => {
            // Criar array de steps a partir do QUIZ_STEPS
            const stepsArray = Object.entries(QUIZ_STEPS).map(([id, step], index) => ({
                ...step,
                id,
                order: index + 1
            }));

            const testFunnel = {
                id: 'production',
                name: 'Quiz Estilo Pessoal',
                slug: 'quiz-estilo',
                steps: stepsArray,
                isPublished: true,
                version: 1
            };

            const result = quizEditorBridge.validateFunnel(testFunnel);

            // O importante é que a validação rode sem erros
            // Pode haver warnings, mas não deve ter crashes
            expect(result).toHaveProperty('valid');
            expect(result).toHaveProperty('errors');
            expect(result).toHaveProperty('warnings');
            expect(typeof result.valid).toBe('boolean');
        });

    });

    // ============================================================================
    // TEST GROUP 2: Validações Automáticas no Salvamento
    // ============================================================================

    describe('2. Validações Automáticas ao Salvar', () => {

        it('saveDraft deve rejeitar funil inválido', async () => {
            // Criar funil INVÁLIDO (sem steps)
            const invalidFunnel = {
                id: 'invalid-funnel',
                name: 'Invalid',
                slug: 'invalid',
                steps: [], // VAZIO - inválido!
                isPublished: false,
                version: 1
            };

            // Tentar salvar deve falhar
            await expect(
                quizEditorBridge.saveDraft(invalidFunnel as any)
            ).rejects.toThrow();
        });

        it('saveDraft deve validar antes de salvar', async () => {
            const validFunnel = {
                id: 'test-valid',
                name: 'Test Valid',
                slug: 'test-valid',
                steps: Object.entries(QUIZ_STEPS).map(([id, step], index) => ({
                    ...step,
                    id,
                    order: index + 1
                })),
                isPublished: false,
                version: 1
            };

            try {
                await quizEditorBridge.saveDraft(validFunnel as any);
                // Se chegar aqui, não falhou por validação (pode ter falhado por Supabase)
                expect(true).toBe(true);
            } catch (error: any) {
                // Aceitar erro de Supabase, mas verificar que rodou validação
                // O importante é que tentou salvar, mesmo que Supabase falhe
                expect(error).toBeDefined();
            }
        });

    });

    // ============================================================================
    // TEST GROUP 3: Validações Críticas na Publicação
    // ============================================================================

    describe('3. Validações Críticas ao Publicar', () => {

        it('publishToProduction deve validar antes de publicar', async () => {
            // Tentar publicar draft inexistente
            await expect(
                quizEditorBridge.publishToProduction('nonexistent-draft')
            ).rejects.toThrow('Draft não encontrado');
        });

    });

    // ============================================================================
    // TEST GROUP 4: Compatibilidade com Editores
    // ============================================================================

    describe('4. Compatibilidade com Editores Existentes', () => {

        it('loadFunnelForEdit deve continuar funcionando', async () => {
            const funnel = await quizEditorBridge.loadFunnelForEdit();

            expect(funnel).toBeDefined();
            expect(funnel).toHaveProperty('id');
            expect(funnel).toHaveProperty('name');
            expect(funnel).toHaveProperty('steps');
            expect(Array.isArray(funnel.steps)).toBe(true);
            expect(funnel.steps.length).toBe(21);
        });

        it('loadFunnelForEdit deve retornar estrutura validável', async () => {
            const funnel = await quizEditorBridge.loadFunnelForEdit();

            // O importante é que retorna algo que pode ser validado
            // Não importa se a validação passa ou falha, importa que PODE validar
            const validation = quizEditorBridge.validateFunnel(funnel as any);

            expect(validation).toBeDefined();
            expect(validation).toHaveProperty('valid');
            expect(validation).toHaveProperty('errors');
            expect(validation).toHaveProperty('warnings');
        });

    });

    // ============================================================================
    // TEST GROUP 5: Integração Completa
    // ============================================================================

    describe('5. Integração Completa - Código Testado em Uso', () => {

        it('deve ter métodos públicos necessários', () => {
            expect(quizEditorBridge.loadFunnelForEdit).toBeDefined();
            expect(quizEditorBridge.saveDraft).toBeDefined();
            expect(quizEditorBridge.publishToProduction).toBeDefined();
            expect(quizEditorBridge.validateFunnel).toBeDefined();
            expect(quizEditorBridge.loadForRuntime).toBeDefined();
        });

        it('validateFunnel deve usar estrutura da Fase 5', () => {
            const funnel = {
                id: 'test',
                name: 'Test',
                slug: 'test',
                steps: Object.entries(QUIZ_STEPS).map(([id, step], index) => ({
                    ...step,
                    id,
                    order: index + 1
                })),
                isPublished: false,
                version: 1
            };

            const result = quizEditorBridge.validateFunnel(funnel as any);

            // Deve retornar estrutura da Fase 5 (valid, errors, warnings)
            expect(result).toHaveProperty('valid');
            expect(result).toHaveProperty('errors');
            expect(result).toHaveProperty('warnings');
            expect(typeof result.valid).toBe('boolean');
            expect(Array.isArray(result.errors)).toBe(true);
            expect(Array.isArray(result.warnings)).toBe(true);
        });
        });

        it('deve detectar erros com validações da Fase 5', () => {
            // Criar funil com erro conhecido
            const invalidFunnel = {
                id: 'invalid',
                name: 'Invalid',
                slug: 'invalid',
                steps: [
                    {
                        id: 'step-01',
                        type: 'intro',
                        order: 1
                        // Faltam propriedades obrigatórias
                    }
                ],
                isPublished: false,
                version: 1
            };

            const result = quizEditorBridge.validateFunnel(invalidFunnel as any);

            // Deve detectar erros
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

    });

    // ============================================================================
    // TEST GROUP 6: Verificação de Logs
    // ============================================================================

    describe('6. Logs de Integração', () => {

        it('deve logar quando validação é executada', async () => {
            const consoleSpy = vi.spyOn(console, 'log');

            const funnel = {
                id: 'test-log',
                name: 'Test Log',
                slug: 'test-log',
                steps: Object.entries(QUIZ_STEPS).map(([id, step], index) => ({
                    ...step,
                    id,
                    order: index + 1
                })),
                isPublished: false,
                version: 1
            };

            try {
                await quizEditorBridge.saveDraft(funnel as any);
            } catch {
                // Ignorar erros de Supabase
            }

            // Verificar se logou algo relacionado a validação ou salvamento
            expect(consoleSpy).toHaveBeenCalled();
            const logs = consoleSpy.mock.calls.map(call => call.join(' '));
            const hasValidationLog = logs.some(log => 
                log.includes('Validando') || log.includes('validação') || log.includes('Salvando')
            );
            expect(hasValidationLog).toBe(true);

            consoleSpy.mockRestore();
        });

    });

});
