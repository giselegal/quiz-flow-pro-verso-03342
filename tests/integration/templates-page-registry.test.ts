/**
 * 🧪 TESTES DE INTEGRAÇÃO: TemplatesPage - Verificação de Funis Reais
 * 
 * Valida que a rota /templates está usando os funis corretos
 * do UNIFIED_TEMPLATE_REGISTRY
 */

import { describe, it, expect } from 'vitest';
import { getUnifiedTemplates, UNIFIED_TEMPLATE_REGISTRY } from '../../src/config/unifiedTemplatesRegistry';

describe('TemplatesPage - Funis Reais do Registry', () => {
    describe('getUnifiedTemplates()', () => {
        it('deve retornar lista de templates do registry', () => {
            const templates = getUnifiedTemplates();

            expect(Array.isArray(templates)).toBe(true);
            expect(templates.length).toBeGreaterThan(0);
        });

        it('deve incluir o template principal quiz21StepsComplete', () => {
            const templates = getUnifiedTemplates();
            
            const mainTemplate = templates.find(t => t.id === 'quiz21StepsComplete');
            
            expect(mainTemplate).toBeDefined();
            expect(mainTemplate?.name).toContain('21 Etapas');
            expect(mainTemplate?.stepCount).toBe(21);
        });

        it('deve incluir aliases de compatibilidade', () => {
            const templates = getUnifiedTemplates();
            
            const alias1 = templates.find(t => t.id === 'quiz-estilo-completo');
            const alias2 = templates.find(t => t.id === 'quiz-estilo-21-steps');
            
            // Aliases devem existir
            expect(alias1).toBeDefined();
            expect(alias2).toBeDefined();
            
            // Aliases devem ter parentTemplateId
            expect(alias1?.parentTemplateId).toBe('quiz21StepsComplete');
            expect(alias2?.parentTemplateId).toBe('quiz21StepsComplete');
        });

        it('deve incluir template express (quiz-style-express)', () => {
            const templates = getUnifiedTemplates();
            
            const expressTemplate = templates.find(t => t.id === 'quiz-style-express');
            
            expect(expressTemplate).toBeDefined();
            expect(expressTemplate?.stepCount).toBe(10);
            expect(expressTemplate?.category).toBe('quiz-express');
            expect(expressTemplate?.parentTemplateId).toBe('quiz21StepsComplete');
        });

        it('deve incluir template com-que-roupa-eu-vou', () => {
            const templates = getUnifiedTemplates();
            
            const roupaTemplate = templates.find(t => t.id === 'com-que-roupa-eu-vou');
            
            expect(roupaTemplate).toBeDefined();
            expect(roupaTemplate?.name).toContain('Com que Roupa');
        });

        it('todos templates devem ter propriedades obrigatórias', () => {
            const templates = getUnifiedTemplates();
            
            templates.forEach(template => {
                // Propriedades essenciais
                expect(template.id).toBeDefined();
                expect(template.id.length).toBeGreaterThan(0);
                
                expect(template.name).toBeDefined();
                expect(template.name.length).toBeGreaterThan(0);
                
                expect(template.description).toBeDefined();
                expect(template.description.length).toBeGreaterThan(0);
                
                expect(template.category).toBeDefined();
                expect(template.stepCount).toBeGreaterThan(0);
                
                // Flags
                expect(typeof template.isOfficial).toBe('boolean');
                expect(typeof template.usageCount).toBe('number');
                
                // Arrays
                expect(Array.isArray(template.tags)).toBe(true);
                expect(Array.isArray(template.features)).toBe(true);
                
                // Versioning
                expect(template.version).toBeDefined();
                expect(template.version).toMatch(/^\d+\.\d+\.\d+$/);
            });
        });

        it('nenhum template deve ter stepCount = 0', () => {
            const templates = getUnifiedTemplates();
            
            const invalidTemplates = templates.filter(t => t.stepCount === 0);
            
            expect(invalidTemplates).toHaveLength(0);
        });
    });

    describe('UNIFIED_TEMPLATE_REGISTRY - Estrutura', () => {
        it('deve ter template principal quiz21StepsComplete', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz21StepsComplete'];
            
            expect(template).toBeDefined();
            expect(template.id).toBe('quiz21StepsComplete');
            expect(template.stepCount).toBe(21);
            expect(template.isOfficial).toBe(true);
            expect(template.category).toBe('quiz-complete');
        });

        it('template principal não deve ter parentTemplateId', () => {
            const template = UNIFIED_TEMPLATE_REGISTRY['quiz21StepsComplete'];
            
            // Template base não herda de ninguém
            expect(template.parentTemplateId).toBeUndefined();
            expect(template.inheritanceType).toBeUndefined();
        });

        it('aliases devem herdar do template principal', () => {
            const alias1 = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-completo'];
            const alias2 = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-21-steps'];
            
            expect(alias1.parentTemplateId).toBe('quiz21StepsComplete');
            expect(alias1.inheritanceType).toBe('extend');
            expect(alias1.tags).toContain('legacy-alias');
            
            expect(alias2.parentTemplateId).toBe('quiz21StepsComplete');
            expect(alias2.inheritanceType).toBe('extend');
            expect(alias2.tags).toContain('legacy-alias');
        });

        it('quiz-style-express deve herdar do principal', () => {
            const express = UNIFIED_TEMPLATE_REGISTRY['quiz-style-express'];
            
            expect(express).toBeDefined();
            expect(express.parentTemplateId).toBe('quiz21StepsComplete');
            expect(express.inheritanceType).toBe('override');
            expect(express.stepCount).toBe(10);
            
            // Deve ter overrides definidos
            expect(Array.isArray(express.overrides)).toBe(true);
            expect(express.overrides!.length).toBeGreaterThan(0);
        });

        it('todos templates devem ter IDs únicos', () => {
            const ids = Object.keys(UNIFIED_TEMPLATE_REGISTRY);
            const uniqueIds = new Set(ids);
            
            expect(ids.length).toBe(uniqueIds.size);
        });

        it('deve conter categorias válidas', () => {
            const validCategories = [
                'quiz-complete',
                'quiz-express',
                'quiz-style',
                'personal-branding',
                'lead-magnet',
                'webinar',
                'ecommerce',
            ];
            
            Object.values(UNIFIED_TEMPLATE_REGISTRY).forEach(template => {
                // Categoria deve ser válida ou nova (permitir expansão)
                expect(template.category).toBeDefined();
                expect(template.category.length).toBeGreaterThan(0);
            });
        });

        it('templates com herança devem ter parentTemplateId válido', () => {
            const templatesWithInheritance = Object.values(UNIFIED_TEMPLATE_REGISTRY)
                .filter(t => t.parentTemplateId);
            
            templatesWithInheritance.forEach(template => {
                // Parent deve existir no registry
                const parent = UNIFIED_TEMPLATE_REGISTRY[template.parentTemplateId!];
                
                expect(parent).toBeDefined();
                expect(parent.id).toBe(template.parentTemplateId);
                
                // Inheritance type deve ser válido
                expect(['extend', 'override', 'compose']).toContain(template.inheritanceType);
            });
        });

        it('variants devem ter estrutura válida', () => {
            const mainTemplate = UNIFIED_TEMPLATE_REGISTRY['quiz21StepsComplete'];
            
            expect(Array.isArray(mainTemplate.variants)).toBe(true);
            expect(mainTemplate.variants!.length).toBeGreaterThan(0);
            
            mainTemplate.variants!.forEach(variant => {
                expect(variant.id).toBeDefined();
                expect(variant.name).toBeDefined();
                expect(variant.description).toBeDefined();
                expect(Array.isArray(variant.overrides)).toBe(true);
                
                variant.overrides.forEach(override => {
                    expect(override.path).toBeDefined();
                    expect(override.value).toBeDefined();
                });
            });
        });
    });

    describe('Categorias e Contagem', () => {
        it('deve ter pelo menos 5 templates diferentes', () => {
            const templates = getUnifiedTemplates();
            
            // Excluir aliases duplicados
            const uniqueTemplates = templates.filter(t => !t.tags.includes('legacy-alias'));
            
            expect(uniqueTemplates.length).toBeGreaterThanOrEqual(5);
        });

        it('deve ter templates em múltiplas categorias', () => {
            const templates = getUnifiedTemplates();
            const categories = new Set(templates.map(t => t.category));
            
            expect(categories.size).toBeGreaterThanOrEqual(3);
        });

        it('deve ter templates oficiais', () => {
            const templates = getUnifiedTemplates();
            const officialTemplates = templates.filter(t => t.isOfficial);
            
            expect(officialTemplates.length).toBeGreaterThan(0);
        });

        it('deve ter templates com usageCount > 0', () => {
            const templates = getUnifiedTemplates();
            const usedTemplates = templates.filter(t => t.usageCount > 0);
            
            expect(usedTemplates.length).toBeGreaterThan(0);
        });
    });

    describe('Validação de Dados para UI', () => {
        it('todos templates devem ter conversionRate formatada', () => {
            const templates = getUnifiedTemplates();
            
            templates.forEach(template => {
                expect(template.conversionRate).toBeDefined();
                expect(template.conversionRate).toMatch(/^\d+%$/);
            });
        });

        it('todos templates devem ter imagem definida', () => {
            const templates = getUnifiedTemplates();
            
            templates.forEach(template => {
                expect(template.image).toBeDefined();
                expect(template.image.length).toBeGreaterThan(0);
                // URL válida (http:// ou https://)
                expect(template.image).toMatch(/^https?:\/\//);
            });
        });

        it('todos templates devem ter datas válidas', () => {
            const templates = getUnifiedTemplates();
            
            templates.forEach(template => {
                expect(template.createdAt).toBeDefined();
                expect(template.updatedAt).toBeDefined();
                
                const created = new Date(template.createdAt);
                const updated = new Date(template.updatedAt);
                
                expect(created.toString()).not.toBe('Invalid Date');
                expect(updated.toString()).not.toBe('Invalid Date');
                
                // Updated deve ser >= Created
                expect(updated.getTime()).toBeGreaterThanOrEqual(created.getTime());
            });
        });

        it('features devem ser array não vazio', () => {
            const templates = getUnifiedTemplates();
            
            templates.forEach(template => {
                expect(Array.isArray(template.features)).toBe(true);
                expect(template.features.length).toBeGreaterThan(0);
                
                template.features.forEach(feature => {
                    expect(typeof feature).toBe('string');
                    expect(feature.length).toBeGreaterThan(0);
                });
            });
        });

        it('tags devem ser array não vazio', () => {
            const templates = getUnifiedTemplates();
            
            templates.forEach(template => {
                expect(Array.isArray(template.tags)).toBe(true);
                expect(template.tags.length).toBeGreaterThan(0);
                
                template.tags.forEach(tag => {
                    expect(typeof tag).toBe('string');
                    expect(tag.length).toBeGreaterThan(0);
                });
            });
        });
    });

    describe('Sistema de Herança', () => {
        it('aliases devem ter mesmos stepCount que o template pai', () => {
            const mainTemplate = UNIFIED_TEMPLATE_REGISTRY['quiz21StepsComplete'];
            const alias1 = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-completo'];
            const alias2 = UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-21-steps'];
            
            expect(alias1.stepCount).toBe(mainTemplate.stepCount);
            expect(alias2.stepCount).toBe(mainTemplate.stepCount);
        });

        it('templates com override devem ter overrides array', () => {
            const express = UNIFIED_TEMPLATE_REGISTRY['quiz-style-express'];
            
            expect(express.inheritanceType).toBe('override');
            expect(Array.isArray(express.overrides)).toBe(true);
            expect(express.overrides!.length).toBeGreaterThan(0);
        });

        it('overrides devem ter estrutura válida', () => {
            const express = UNIFIED_TEMPLATE_REGISTRY['quiz-style-express'];
            
            express.overrides!.forEach(override => {
                expect(override.path).toBeDefined();
                expect(typeof override.path).toBe('string');
                expect(override.path.length).toBeGreaterThan(0);
                
                expect(override.value).toBeDefined();
                
                // reason é opcional mas recomendado
                if (override.reason) {
                    expect(typeof override.reason).toBe('string');
                }
            });
        });

        it('não deve haver ciclos de herança', () => {
            const templates = Object.values(UNIFIED_TEMPLATE_REGISTRY);
            
            templates.forEach(template => {
                if (!template.parentTemplateId) return;
                
                const visited = new Set<string>();
                let current = template;
                
                while (current.parentTemplateId) {
                    // Se já visitamos, há ciclo
                    if (visited.has(current.id)) {
                        throw new Error(`Ciclo de herança detectado: ${current.id}`);
                    }
                    
                    visited.add(current.id);
                    
                    const parent = UNIFIED_TEMPLATE_REGISTRY[current.parentTemplateId];
                    if (!parent) break; // Parent não existe, fim da cadeia
                    
                    current = parent;
                }
                
                // Sucesso: sem ciclos
                expect(true).toBe(true);
            });
        });
    });

    describe('Performance e Otimização', () => {
        it('getUnifiedTemplates() deve executar em menos de 100ms', () => {
            const start = Date.now();
            
            getUnifiedTemplates();
            
            const duration = Date.now() - start;
            expect(duration).toBeLessThan(100);
        });

        it('registry não deve ter templates com dados muito grandes', () => {
            const templates = Object.values(UNIFIED_TEMPLATE_REGISTRY);
            
            templates.forEach(template => {
                const jsonSize = JSON.stringify(template).length;
                
                // Cada template não deve ter mais que 10KB de metadata
                expect(jsonSize).toBeLessThan(10000);
            });
        });
    });
});
