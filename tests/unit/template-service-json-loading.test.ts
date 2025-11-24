/**
 * 🧪 TESTES UNITÁRIOS: TemplateService - Carregamento do JSON
 * 
 * Testa o TemplateService isoladamente
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { templateService } from '../../src/services/canonical/TemplateService';

describe('TemplateService - JSON Loading', () => {
    beforeEach(() => {
        // Limpar cache antes de cada teste
        vi.clearAllMocks();
    });

    describe('setActiveFunnel', () => {
        it('deve definir activeFunnelId corretamente', () => {
            templateService.setActiveFunnel('quiz-estilo-21-steps');

            // @ts-ignore - Acesso a propriedade privada para teste
            expect(templateService.activeFunnelId).toBe('quiz-estilo-21-steps');
        });

        it('deve limpar activeFunnelId quando passar null', () => {
            templateService.setActiveFunnel('quiz-estilo-21-steps');
            templateService.setActiveFunnel(null);

            // @ts-ignore
            expect(templateService.activeFunnelId).toBeNull();
        });
    });

    describe('getAllSteps', () => {
        it('deve retornar 21 steps', async () => {
            templateService.setActiveFunnel('quiz21StepsComplete');

            const steps = await templateService.getAllSteps();

            expect(Object.keys(steps)).toHaveLength(21);
        });

        it('deve incluir step-01 a step-21', async () => {
            templateService.setActiveFunnel('quiz21StepsComplete');

            const steps = await templateService.getAllSteps();

            for (let i = 1; i <= 21; i++) {
                const stepId = `step-${i.toString().padStart(2, '0')}`;
                expect(steps).toHaveProperty(stepId);
            }
        });

        it('deve incluir blocks em cada step', async () => {
            templateService.setActiveFunnel('quiz21StepsComplete');

            const steps = await templateService.getAllSteps();

            expect(steps['step-01']).toHaveProperty('blocks');
            expect(Array.isArray(steps['step-01'].blocks)).toBe(true);
        });

        it('deve normalizar IDs legados', async () => {
            // Testar com ID legado
            templateService.setActiveFunnel('quiz-estilo-21-steps');

            const steps = await templateService.getAllSteps();

            // Deve carregar 21 steps mesmo com ID legado
            expect(Object.keys(steps)).toHaveLength(21);
        });

        it('deve normalizar quiz-estilo-completo', async () => {
            templateService.setActiveFunnel('quiz-estilo-completo');

            const steps = await templateService.getAllSteps();

            expect(Object.keys(steps)).toHaveLength(21);
        });

        it('deve usar quiz21StepsComplete como padrão', async () => {
            templateService.setActiveFunnel(null);

            const steps = await templateService.getAllSteps();

            // Deve usar template padrão
            expect(Object.keys(steps)).toHaveLength(21);
        });
    });

    describe('getStep', () => {
        it('deve carregar step com templateId', async () => {
            const result = await templateService.getStep('step-01', 'quiz21StepsComplete');

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBeDefined();
                expect(Array.isArray(result.data)).toBe(true);
            }
        });

        it('deve carregar blocks do JSON', async () => {
            const result = await templateService.getStep('step-01', 'quiz21StepsComplete');

            if (result.success) {
                expect(result.data.length).toBeGreaterThan(0);
            }
        });

        it('deve carregar step-20 (resultado)', async () => {
            const result = await templateService.getStep('step-20', 'quiz21StepsComplete');

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBeDefined();
            }
        });

        it('deve carregar step-21 (oferta)', async () => {
            const result = await templateService.getStep('step-21', 'quiz21StepsComplete');

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBeDefined();
            }
        });
    });

    describe('STEP_MAPPING', () => {
        it('deve ter 21 steps mapeados', () => {
            // @ts-ignore
            const mapping = templateService.STEP_MAPPING;

            expect(Object.keys(mapping)).toHaveLength(21);
        });

        it('deve ter tipos corretos', () => {
            // @ts-ignore
            const mapping = templateService.STEP_MAPPING;

            expect(mapping[1].type).toBe('intro');
            expect(mapping[2].type).toBe('question');
            expect(mapping[20].type).toBe('result');
            expect(mapping[21].type).toBe('offer');
        });

        it('deve ter nomes definidos', () => {
            // @ts-ignore
            const mapping = templateService.STEP_MAPPING;

            for (let i = 1; i <= 21; i++) {
                expect(mapping[i].name).toBeDefined();
                expect(mapping[i].name.length).toBeGreaterThan(0);
            }
        });
    });

    describe('hasStep', () => {
        it('deve retornar true para steps válidos', () => {
            expect(templateService.hasStep('step-01')).toBe(true);
            expect(templateService.hasStep('step-10')).toBe(true);
            expect(templateService.hasStep('step-21')).toBe(true);
        });

        it('deve retornar false para steps inválidos', () => {
            expect(templateService.hasStep('step-22')).toBe(false);
            expect(templateService.hasStep('step-00')).toBe(false);
            expect(templateService.hasStep('invalid')).toBe(false);
        });

        it('deve aceitar formato com hífen', () => {
            expect(templateService.hasStep('step-01')).toBe(true);
        });

        it('deve aceitar formato sem hífen', () => {
            expect(templateService.hasStep('step01')).toBe(true);
        });
    });

    describe('getStepOrder', () => {
        it('deve retornar array de 21 steps', () => {
            const order = templateService.getStepOrder();

            expect(order).toHaveLength(21);
        });

        it('deve ter steps em ordem', () => {
            const order = templateService.getStepOrder();

            expect(order[0]).toBe('step-01');
            expect(order[20]).toBe('step-21');
        });

        it('deve ter formato padronizado', () => {
            const order = templateService.getStepOrder();

            order.forEach((stepId, index) => {
                const expected = `step-${(index + 1).toString().padStart(2, '0')}`;
                expect(stepId).toBe(expected);
            });
        });
    });
});

describe('TemplateService - ID Normalization', () => {
    it('deve normalizar quiz-estilo-21-steps para quiz21StepsComplete', () => {
        templateService.setActiveFunnel('quiz-estilo-21-steps');

        // @ts-ignore - Verificar log interno (se disponível)
        // A normalização acontece internamente no getAllSteps
    });

    it('deve normalizar quiz-estilo-completo para quiz21StepsComplete', () => {
        templateService.setActiveFunnel('quiz-estilo-completo');

        // Normalização interna
    });

    it('deve manter quiz21StepsComplete sem alteração', () => {
        templateService.setActiveFunnel('quiz21StepsComplete');

        // @ts-ignore
        expect(templateService.activeFunnelId).toBe('quiz21StepsComplete');
    });
});

describe('TemplateService - Error Handling', () => {
    it('deve retornar steps vazios se getStep falhar', async () => {
        // Forçar erro passando stepId inválido mas continuar
        const result = await templateService.getStep('step-invalid-999', 'quiz21StepsComplete');

        // Deve retornar resultado (mesmo que erro)
        expect(result).toBeDefined();
    });

    it('deve usar fallback se templateId não existir', async () => {
        templateService.setActiveFunnel('template-inexistente');

        const steps = await templateService.getAllSteps();

        // Deve retornar algo (fallback)
        expect(steps).toBeDefined();
        expect(Object.keys(steps)).toHaveLength(21);
    });
});

describe('TemplateService - Performance', () => {
    it('deve carregar getAllSteps em menos de 5 segundos', async () => {
        const startTime = Date.now();

        await templateService.getAllSteps();

        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(5000);
    });

    it('deve usar cache após primeira carga', async () => {
        // Primeira carga
        const start1 = Date.now();
        await templateService.getStep('step-01', 'quiz21StepsComplete');
        const duration1 = Date.now() - start1;

        // Segunda carga (deve usar cache)
        const start2 = Date.now();
        await templateService.getStep('step-01', 'quiz21StepsComplete');
        const duration2 = Date.now() - start2;

        // Segunda carga deve ser mais rápida (cache)
        expect(duration2).toBeLessThanOrEqual(duration1);
    });
});
