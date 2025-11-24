/**
 * 🧪 TESTES DE INTEGRAÇÃO: Aliases do UNIFIED_TEMPLATE_REGISTRY
 * 
 * Testa os aliases criados para compatibilidade com código legado
 */

import { describe, it, expect } from 'vitest';
import { UNIFIED_TEMPLATE_REGISTRY, TemplateRegistry } from '../../src/config/unifiedTemplatesRegistry';
import type { UnifiedTemplate } from '../../src/config/unifiedTemplatesRegistry';

describe('UNIFIED_TEMPLATE_REGISTRY - Aliases', () => {
    describe('Template Principal', () => {
        it('deve ter quiz21StepsComplete no registro', () => {
            expect(UNIFIED_TEMPLATE_REGISTRY).toHaveProperty('quiz21StepsComplete');
        });

        it('quiz21StepsComplete deve ter 21 steps', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz21StepsComplete'];

            expect(template.stepCount).toBe(21);
        });

        it('quiz21StepsComplete deve ter metadados corretos', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz21StepsComplete'];

            expect(template.id).toBe('quiz21StepsComplete');
            expect(template.name).toBeDefined();
            expect(template.description).toBeDefined();
            expect(template.category).toBe('quiz-complete');
            expect(template.isOfficial).toBe(true);
        });
    });

    describe('Alias: quiz-estilo-completo', () => {
        it('deve existir no registro', () => {
            expect(UNIFIED_TEMPLATE_REGISTRY).toHaveProperty('quiz-estilo-completo');
        });

        it('deve ter 21 steps', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-completo'];

            expect(template.stepCount).toBe(21);
        });

        it('deve apontar para quiz21StepsComplete via parentTemplateId', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-completo'];

            expect(template.parentTemplateId).toBe('quiz21StepsComplete');
        });

        it('deve ter tag legacy-alias', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-completo'];

            expect(template.tags).toContain('legacy-alias');
        });

        it('deve ter mesmo stepCount que quiz21StepsComplete', () => {
            const original = UNIFIED_TEMPLATE_REGISTRY['quiz21StepsComplete'];
            const alias = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-completo'];

            expect(alias.stepCount).toBe(original.stepCount);
        });
    });

    describe('Alias: quiz-estilo-21-steps', () => {
        it('deve existir no registro', () => {
            expect(UNIFIED_TEMPLATE_REGISTRY).toHaveProperty('quiz-estilo-21-steps');
        });

        it('deve ter 21 steps', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-21-steps'];

            expect(template.stepCount).toBe(21);
        });

        it('deve apontar para quiz21StepsComplete via parentTemplateId', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-21-steps'];

            expect(template.parentTemplateId).toBe('quiz21StepsComplete');
        });

        it('deve ter tag legacy-alias', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-21-steps'];

            expect(template.tags).toContain('legacy-alias');
        });

        it('deve ter inheritanceType extend', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-21-steps'];

            expect(template.inheritanceType).toBe('extend');
        });
    });

    describe('TemplateRegistry API', () => {
        it('getById deve retornar quiz21StepsComplete', () => {
            const template = TemplateRegistry.getById('quiz21StepsComplete');

            expect(template).not.toBeNull();
            expect(template?.id).toBe('quiz21StepsComplete');
        });

        it('getById deve retornar quiz-estilo-completo', () => {
            const template = TemplateRegistry.getById('quiz-estilo-completo');

            expect(template).not.toBeNull();
            expect(template?.id).toBe('quiz-estilo-completo');
        });

        it('getById deve retornar quiz-estilo-21-steps', () => {
            const template = TemplateRegistry.getById('quiz-estilo-21-steps');

            expect(template).not.toBeNull();
            expect(template?.id).toBe('quiz-estilo-21-steps');
        });

    it('getAll deve incluir todos os aliases', () => {
      const templates = TemplateRegistry.getAll();
      const ids = templates.map((t: UnifiedTemplate) => t.id);            expect(ids).toContain('quiz21StepsComplete');
            expect(ids).toContain('quiz-estilo-completo');
            expect(ids).toContain('quiz-estilo-21-steps');
        });

    it('getByCategory deve incluir templates com aliases', () => {
      const quizTemplates = TemplateRegistry.getByCategory('quiz-complete');
      const ids = quizTemplates.map((t: UnifiedTemplate) => t.id);            expect(ids).toContain('quiz21StepsComplete');
            expect(ids).toContain('quiz-estilo-completo');
            expect(ids).toContain('quiz-estilo-21-steps');
        });
    });

    describe('Consistência entre Templates', () => {
        it('aliases devem ter mesmos metadados essenciais', () => {
            const original = UNIFIED_TEMPLATE_REGISTRY['quiz21StepsComplete'];
            const alias1 = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-completo'];
            const alias2 = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-21-steps'];

            expect(alias1.stepCount).toBe(original.stepCount);
            expect(alias2.stepCount).toBe(original.stepCount);

            expect(alias1.category).toBe(original.category);
            expect(alias2.category).toBe(original.category);

            expect(alias1.theme).toBe(original.theme);
            expect(alias2.theme).toBe(original.theme);
        });

        it('aliases devem ter tags legacy-alias', () => {
            const alias1 = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-completo'];
            const alias2 = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-21-steps'];

            expect(alias1.tags).toContain('legacy-alias');
            expect(alias2.tags).toContain('legacy-alias');
        });

        it('original não deve ter tag legacy-alias', () => {
            const original = UNIFIED_TEMPLATE_REGISTRY['quiz21StepsComplete'];

            expect(original.tags).not.toContain('legacy-alias');
        });
    });

    describe('Validação de Estrutura', () => {
        const requiredFields = ['id', 'name', 'description', 'category', 'theme', 'stepCount', 'isOfficial', 'tags', 'features', 'version'];

        it('quiz21StepsComplete deve ter todos os campos obrigatórios', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz21StepsComplete'];

            requiredFields.forEach(field => {
                expect(template).toHaveProperty(field);
            });
        });

        it('quiz-estilo-completo deve ter todos os campos obrigatórios', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-completo'];

            requiredFields.forEach(field => {
                expect(template).toHaveProperty(field);
            });
        });

        it('quiz-estilo-21-steps deve ter todos os campos obrigatórios', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-21-steps'];

            requiredFields.forEach(field => {
                expect(template).toHaveProperty(field);
            });
        });
    });
});
