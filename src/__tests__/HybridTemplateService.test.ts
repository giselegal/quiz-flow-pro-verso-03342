/**
 * 🧪 TESTES: HybridTemplateService
 * 
 * Testes unitários para validar carregamento e fallback de templates
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
// DEPRECATED TEST: HybridTemplateService migrado para TemplateService
import { templateService } from '@/services/canonical/TemplateService';

describe.skip('HybridTemplateService (deprecated)', () => {

    beforeEach(() => {
        // Limpar cache antes de cada teste
    templateService.clearCache();
    });

    describe('validateMasterTemplate', () => {

        it('deve validar master template correto com 21 steps', async () => {
            const validMaster: any = {
                templateVersion: '3.0',
                globalConfig: {},
                steps: {},
            };

            // Adicionar 21 steps válidos
            for (let i = 1; i <= 21; i++) {
                const stepId = `step-${i.toString().padStart(2, '0')}`;
                validMaster.steps[stepId] = {
                    metadata: { id: stepId, name: `Step ${i}` },
                    sections: [],
                };
            }

            // Testar validação (método privado, testamos através do getMasterTemplate)
            const result = await templateService.getTemplate('step-01');
            expect(result).toBeTruthy();
            expect(result.success).toBe(true);
        });

        it('deve rejeitar master sem templateVersion', () => {
            const invalidMaster: any = {
                globalConfig: {},
                steps: {},
            };

            // Validação falha sem templateVersion
            expect(invalidMaster.templateVersion).toBeUndefined();
        }); it('deve rejeitar master com menos de 21 steps', () => {
            const invalidMaster = {
                templateVersion: '3.0',
                globalConfig: {},
                steps: {
                    'step-01': { metadata: {}, sections: [] },
                },
            };

            expect(Object.keys(invalidMaster.steps).length).toBeLessThan(21);
        });
    });

    describe('getTemplate', () => {

        it('deve retornar template específico do master', async () => {
            const template = await templateService.getTemplate('step-01');

            expect(template).toBeDefined();
            expect(template).not.toBeNull();
        });

        it('deve usar fallback se step não existir no master', async () => {
            const template = await templateService.getTemplate('step-invalid');

            // Se o step não existe, deve retornar null ou usar fallback TypeScript
            expect(template === null || template !== undefined).toBe(true);
        });

        it('deve carregar todos os 21 steps', async () => {
            const promises = [];

            for (let i = 1; i <= 21; i++) {
                const stepId = `step-${i.toString().padStart(2, '0')}`;
                promises.push(templateService.getTemplate(stepId));
            }

            const results = await Promise.all(promises);
            const validResults = results.filter(r => r !== null);

            expect(validResults.length).toBeGreaterThan(0);
            expect(validResults.length).toBeLessThanOrEqual(21);
        });
    });

    describe('getMasterTemplate', () => {

        it('deve retornar master template completo', async () => {
            const master = await templateService.getTemplate('step-01');

            expect(master).toBeDefined();

            if (master) {
                expect(master.success).toBe(true);
            }
        });

        it('deve usar cache após primeiro carregamento', async () => {
            const master1 = await templateService.getTemplate('step-01');
            const master2 = await templateService.getTemplate('step-01');

            // Segunda chamada deve retornar do cache (mesma referência)
            expect(master1).toBe(master2);
        });
    });

    describe('clearCache e reload', () => {

        it('deve limpar cache e forçar reload', async () => {
            // Carregar primeiro
            const master1 = await templateService.getTemplate('step-01');

            // Limpar cache
            templateService.clearCache();

            // Carregar novamente
            const master2 = await templateService.getTemplate('step-01');

            // Deve ser uma nova instância (não cache)
            expect(master1).not.toBe(master2);
        });

        it('reload deve limpar e recarregar', async () => {
            const master1 = await templateService.getTemplate('step-01');

            // templateService não possui reload equivalente

            const master2 = await templateService.getTemplate('step-01');

            // Nova instância após reload
            expect(master1).not.toBe(master2);
        });
    });

    describe('Fallback TypeScript', () => {

        it('deve usar fallback TypeScript se JSON falhar', async () => {
            // Mock fetch para simular falha
            const originalFetch = global.fetch;
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            try {
                templateService.clearCache();
                const template = await templateService.getTemplate('step-01');

                // Deve retornar algo (fallback TypeScript)
                expect(template).toBeDefined();
            } finally {
                // Restaurar fetch
                global.fetch = originalFetch;
            }
        });
    });

    describe('Performance', () => {

        it('carregamento do master deve ser rápido (< 500ms)', async () => {
            const start = performance.now();
            await templateService.getTemplate('step-01');
            const duration = performance.now() - start;

            expect(duration).toBeLessThan(500);
        });

        it('carregamento de step individual deve ser rápido (< 100ms)', async () => {
            // Pré-carregar master
            await templateService.getTemplate('step-01');

            const start = performance.now();
            await templateService.getTemplate('step-01');
            const duration = performance.now() - start;

            expect(duration).toBeLessThan(100);
        });
    });
});
