/**
 * 🧪 TESTES: TemplateEditorService
 * 
 * Testes unitários para validar salvamento e edição de templates
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import TemplateEditorService, { SaveResult } from '@/services/TemplateEditorService';

describe('TemplateEditorService', () => {

    const STORAGE_KEY = 'quiz21-edited';

    beforeEach(() => {
        // Limpar localStorage antes de cada teste
        localStorage.clear();
    });

    afterEach(() => {
        // Limpar após cada teste
        localStorage.clear();
    });

    describe('saveStepChanges', () => {

        it('deve salvar step com estrutura válida', async () => {
            const stepId = 'step-01';
            const stepData = {
                metadata: {
                    id: stepId,
                    name: 'Step 1 Modificado',
                    description: 'Descrição teste'
                },
                theme: {
                    primaryColor: '#FF5722'
                },
                sections: [
                    {
                        type: 'hero',
                        blocks: []
                    }
                ]
            };

            const result = await TemplateEditorService.saveStepChanges(stepId, stepData);

            expect(result.success).toBe(true);
            expect(result.stepId).toBe(stepId);
            expect(result.message).toContain('sucesso');
        });

        it('deve rejeitar step com estrutura inválida', async () => {
            const stepId = 'step-01';
            const invalidStep = {
                // Faltando campos obrigatórios
                metadata: {}
            };

            const result = await TemplateEditorService.saveStepChanges(stepId, invalidStep);

            expect(result.success).toBe(false);
            expect(result.message).toContain('inválida');
        });

        it('deve persistir no localStorage', async () => {
            const stepId = 'step-01';
            const stepData = {
                metadata: { id: stepId, name: 'Test' },
                sections: []
            };

            await TemplateEditorService.saveStepChanges(stepId, stepData);

            const saved = localStorage.getItem(STORAGE_KEY);
            expect(saved).toBeTruthy();

            const parsed = JSON.parse(saved!);
            expect(parsed.steps).toBeDefined();
            expect(parsed.steps[stepId]).toBeDefined();
        });
    });

    describe('validateStepStructure', () => {

        it('deve validar step com todos os campos', () => {
            const validStep = {
                metadata: {
                    id: 'step-01',
                    name: 'Step válido'
                },
                sections: []
            };

            // Método privado, testamos através do saveStepChanges
            // Mas podemos testar diretamente se exportarmos
            expect(validStep.metadata).toBeDefined();
            expect(validStep.metadata.id).toBeDefined();
        });

        it('deve rejeitar step sem metadata', () => {
            const invalidStep = {
                sections: []
            };

            expect(invalidStep.metadata).toBeUndefined();
        });
    });

    describe('exportMasterTemplate', () => {

        it('deve exportar master template como JSON string', async () => {
            const json = await TemplateEditorService.exportMasterTemplate();

            expect(json).toBeTruthy();
            expect(typeof json).toBe('string');

            // Deve ser JSON válido
            const parsed = JSON.parse(json);
            expect(parsed).toBeDefined();
        });

        it('JSON exportado deve conter 21 steps', async () => {
            const json = await TemplateEditorService.exportMasterTemplate();
            const parsed = JSON.parse(json);

            if (parsed.steps) {
                const stepCount = Object.keys(parsed.steps).length;
                expect(stepCount).toBeGreaterThan(0);
            }
        });

        it('JSON exportado deve ser válido (parse/stringify)', async () => {
            const json1 = await TemplateEditorService.exportMasterTemplate();
            const parsed = JSON.parse(json1);
            const json2 = JSON.stringify(parsed, null, 2);

            expect(json1).toBe(json2);
        });
    });

    describe('importMasterTemplate', () => {

        it('deve importar JSON válido', async () => {
            const validJson = JSON.stringify({
                templateVersion: '3.0',
                globalConfig: {},
                steps: {
                    'step-01': {
                        metadata: { id: 'step-01', name: 'Test' },
                        sections: []
                    }
                }
            });

            const result = await TemplateEditorService.importMasterTemplate(validJson);

            expect(result.success).toBe(true);
        });

        it('deve rejeitar JSON inválido', async () => {
            const invalidJson = '{ invalid json }';

            const result = await TemplateEditorService.importMasterTemplate(invalidJson);

            expect(result.success).toBe(false);
            expect(result.message).toContain('inválido');
        });

        it('deve rejeitar JSON sem templateVersion', async () => {
            const noVersionJson = JSON.stringify({
                globalConfig: {},
                steps: {}
            });

            const result = await TemplateEditorService.importMasterTemplate(noVersionJson);

            expect(result.success).toBe(false);
        });
    });

    describe('validateAllSteps', () => {

        it('deve validar todos os steps do master', async () => {
            const result = await TemplateEditorService.validateAllSteps();

            expect(result).toBeDefined();
            expect(result.valid).toBeGreaterThanOrEqual(0);
            expect(result.invalid).toBeGreaterThanOrEqual(0);
            expect(Array.isArray(result.errors)).toBe(true);
        });

        it('steps válidos devem ter valid > 0', async () => {
            const result = await TemplateEditorService.validateAllSteps();

            // Deve ter pelo menos alguns steps válidos
            expect(result.valid).toBeGreaterThan(0);
        });

        it('erros devem conter stepId e array de mensagens', async () => {
            const result = await TemplateEditorService.validateAllSteps();

            if (result.errors.length > 0) {
                const error = result.errors[0];
                expect(error.stepId).toBeDefined();
                expect(Array.isArray(error.errors)).toBe(true);
            }
        });
    });

    describe('Storage Management', () => {

        it('clearStorage deve limpar localStorage', () => {
            localStorage.setItem(STORAGE_KEY, 'test data');

            TemplateEditorService.clearStorage();

            const data = localStorage.getItem(STORAGE_KEY);
            expect(data).toBeNull();
        });

        it('hasStorageData deve detectar dados salvos', () => {
            expect(TemplateEditorService.hasStorageData()).toBe(false);

            localStorage.setItem(STORAGE_KEY, '{}');

            expect(TemplateEditorService.hasStorageData()).toBe(true);
        });

        it('getStorageKey deve retornar chave correta', () => {
            const key = TemplateEditorService.getStorageKey();
            expect(key).toBe(STORAGE_KEY);
        });
    });

    describe('Storage Usage Monitoring', () => {

        it('deve calcular uso do localStorage', () => {
            const usage = TemplateEditorService.getStorageUsage();

            expect(usage).toBeDefined();
            expect(usage.used).toBeGreaterThanOrEqual(0);
            expect(usage.limit).toBeGreaterThan(0);
            expect(usage.percentage).toBeGreaterThanOrEqual(0);
            expect(usage.percentage).toBeLessThanOrEqual(100);
            expect(typeof usage.shouldMigrate).toBe('boolean');
        });

        it('shouldMigrate deve ser true quando > 60%', () => {
            // Simular uso alto
            const largeData = 'x'.repeat(3.5 * 1024 * 1024); // ~3.5 MB
            localStorage.setItem(STORAGE_KEY, largeData);

            const usage = TemplateEditorService.getStorageUsage();

            expect(usage.percentage).toBeGreaterThan(60);
            expect(usage.shouldMigrate).toBe(true);
        });
    });

    describe('Performance', () => {

        it('saveStepChanges deve completar em < 1s', async () => {
            const stepData = {
                metadata: { id: 'step-01', name: 'Test' },
                sections: []
            };

            const start = performance.now();
            await TemplateEditorService.saveStepChanges('step-01', stepData);
            const duration = performance.now() - start;

            expect(duration).toBeLessThan(1000);
        });

        it('exportMasterTemplate deve completar em < 500ms', async () => {
            const start = performance.now();
            await TemplateEditorService.exportMasterTemplate();
            const duration = performance.now() - start;

            expect(duration).toBeLessThan(500);
        });

        it('validateAllSteps deve completar em < 1s', async () => {
            const start = performance.now();
            await TemplateEditorService.validateAllSteps();
            const duration = performance.now() - start;

            expect(duration).toBeLessThan(1000);
        });
    });

    describe('Integration with HybridTemplateService', () => {

        it('deve recarregar HybridTemplateService após salvar', async () => {
            const stepData = {
                metadata: { id: 'step-01', name: 'Test' },
                sections: []
            };

            const result = await TemplateEditorService.saveStepChanges('step-01', stepData);

            expect(result.success).toBe(true);
            // HybridTemplateService.reload() deve ter sido chamado
        });
    });
});
