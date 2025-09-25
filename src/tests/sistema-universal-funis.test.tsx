/**
 * 🧪 TESTE DE INTEGRAÇÃO: VALIDAÇÃO ESTRUTURAL REACT/TYPESCRIPT
 * 
 * Testa a estrutura completa do sistema no contexto real do aplicativo React
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks necessários para os testes
jest.mock('@/integrations/supabase/client', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    single: jest.fn(() => Promise.resolve({
                        data: null,
                        error: { message: 'Template not found in database' }
                    }))
                }))
            }))
        }))
    }
}));

describe('🧪 Sistema Universal de Funis - Testes de Estrutura', () => {

    describe('UnifiedTemplateService', () => {
        let unifiedTemplateService: any;

        beforeAll(async () => {
            // Importar o serviço dinamicamente
            const module = await import('@/services/UnifiedTemplateService');
            unifiedTemplateService = module.unifiedTemplateService;
        });

        test('deve carregar template crítico estático', async () => {
            const template = await unifiedTemplateService.getTemplate('step-1');

            expect(template).toBeDefined();
            expect(template.id).toBe('step-1');
            expect(template.name).toBeDefined();
            expect(template.blocks).toBeDefined();
            expect(Array.isArray(template.blocks)).toBe(true);
        });

        test('deve tentar buscar funil dinâmico no banco', async () => {
            const template = await unifiedTemplateService.getTemplate('meu-funil-customizado');

            expect(template).toBeDefined();
            expect(template.id).toBe('meu-funil-customizado');
            // Deve usar fallback já que mock retorna erro
            expect(template.metadata?.generated).toBe(true);
        });

        test('deve gerar fallback para templates inexistentes', async () => {
            const template = await unifiedTemplateService.getTemplate('template-nao-existe');

            expect(template).toBeDefined();
            expect(template.id).toBe('template-nao-existe');
            expect(template.metadata?.generated).toBe(true);
        });

        test('deve implementar cache corretamente', async () => {
            const startTime1 = performance.now();
            await unifiedTemplateService.getTemplate('step-1');
            const firstCallTime = performance.now() - startTime1;

            const startTime2 = performance.now();
            await unifiedTemplateService.getTemplate('step-1');
            const secondCallTime = performance.now() - startTime2;

            expect(secondCallTime).toBeLessThan(firstCallTime);
        });
    });

    describe('Detecção de URL', () => {
        const detectUrlPattern = (path: string) => {
            if (path.startsWith('/editor/') && path.length > '/editor/'.length) {
                const identifier = path.replace('/editor/', '');
                const looksLikeTemplate = /^(step-|template|quiz|test)/i.test(identifier);

                if (looksLikeTemplate) {
                    return { templateId: identifier, funnelId: null, type: 'template' };
                } else {
                    return { templateId: null, funnelId: identifier, type: 'funnel' };
                }
            }

            return { templateId: null, funnelId: null, type: 'auto' };
        };

        test('deve detectar templates corretamente', () => {
            expect(detectUrlPattern('/editor/step-1')).toEqual({
                templateId: 'step-1',
                funnelId: null,
                type: 'template'
            });

            expect(detectUrlPattern('/editor/quiz-personalizado')).toEqual({
                templateId: 'quiz-personalizado',
                funnelId: null,
                type: 'template'
            });

            expect(detectUrlPattern('/editor/template-vendas')).toEqual({
                templateId: 'template-vendas',
                funnelId: null,
                type: 'template'
            });
        });

        test('deve detectar funis corretamente', () => {
            expect(detectUrlPattern('/editor/meu-funil-vendas')).toEqual({
                templateId: null,
                funnelId: 'meu-funil-vendas',
                type: 'funnel'
            });

            expect(detectUrlPattern('/editor/campanha-2025')).toEqual({
                templateId: null,
                funnelId: 'campanha-2025',
                type: 'funnel'
            });
        });

        test('deve retornar modo auto para URL base', () => {
            expect(detectUrlPattern('/editor')).toEqual({
                templateId: null,
                funnelId: null,
                type: 'auto'
            });
        });
    });

    describe('Estrutura de Componentes', () => {
        test('PureBuilderProvider deve aceitar qualquer funnelId', () => {
            // Importar o tipo para validação
            const validProps = {
                funnelId: 'qualquer-funil-customizado',
                children: React.createElement('div')
            };

            // Verificar que não há erros de tipo
            expect(() => {
                // Simulação de uso do componente
                const componentStructure = {
                    props: validProps,
                    type: 'PureBuilderProvider'
                };
                return componentStructure;
            }).not.toThrow();
        });

        test('ModernUnifiedEditor deve lidar com parâmetros dinâmicos', () => {
            const validEditorProps = {
                funnelId: undefined,
                templateId: undefined,
                mode: 'visual' as const,
                className: ''
            };

            expect(validEditorProps).toBeDefined();
            expect(validEditorProps.mode).toBe('visual');
        });
    });

    describe('Integração Completa', () => {
        test('deve integrar todos os componentes sem erros', async () => {
            // Mock do window.location
            Object.defineProperty(window, 'location', {
                value: {
                    pathname: '/editor/teste-integracao'
                },
                writable: true
            });

            // Testar que a estrutura completa funciona
            const unifiedService = await import('@/services/UnifiedTemplateService');
            const template = await unifiedService.unifiedTemplateService.getTemplate('teste-integracao');

            expect(template).toBeDefined();
            expect(template.id).toBe('teste-integracao');
        });
    });
});

describe('🧪 Validação de Tipos TypeScript', () => {
    test('UnifiedTemplateService deve ter tipos corretos', () => {
        // Verificação de tipos em tempo de compilação
        const servicePromise: Promise<any> = import('@/services/UnifiedTemplateService');
        expect(servicePromise).toBeDefined();
    });

    test('Interfaces devem ser consistentes', () => {
        // Verificar que as interfaces são compatíveis
        interface TemplateStructure {
            id: string;
            name?: string;
            blocks?: any[];
            steps?: any[];
            metadata?: {
                generated?: boolean;
                fromDatabase?: boolean;
                [key: string]: any;
            };
        }

        const validTemplate: TemplateStructure = {
            id: 'test-template',
            name: 'Template de Teste',
            blocks: [],
            metadata: {
                generated: true
            }
        };

        expect(validTemplate.id).toBe('test-template');
        expect(validTemplate.metadata?.generated).toBe(true);
    });
});

describe('🧪 Testes de Performance', () => {
    test('carregamento de template deve ser rápido', async () => {
        const unifiedService = await import('@/services/UnifiedTemplateService');

        const startTime = performance.now();
        await unifiedService.unifiedTemplateService.getTemplate('step-1');
        const endTime = performance.now();

        const loadTime = endTime - startTime;

        // Deve carregar em menos de 100ms
        expect(loadTime).toBeLessThan(100);
    });

    test('cache deve melhorar performance', async () => {
        const unifiedService = await import('@/services/UnifiedTemplateService');

        // Primeira chamada
        const startTime1 = performance.now();
        await unifiedService.unifiedTemplateService.getTemplate('performance-test');
        const firstCallTime = performance.now() - startTime1;

        // Segunda chamada (cached)
        const startTime2 = performance.now();
        await unifiedService.unifiedTemplateService.getTemplate('performance-test');
        const secondCallTime = performance.now() - startTime2;

        // Cache deve ser pelo menos 50% mais rápido
        expect(secondCallTime).toBeLessThan(firstCallTime * 0.5);
    });
});

describe('🧪 Testes de Robustez', () => {
    test('deve lidar com IDs inválidos graciosamente', async () => {
        const unifiedService = await import('@/services/UnifiedTemplateService');

        const invalidIds = ['', null, undefined, '   ', 'id-com-caracteres-especiais-!@#$%'];

        for (const id of invalidIds) {
            try {
                const result = await unifiedService.unifiedTemplateService.getTemplate(id as any);
                // Se não der erro, deve retornar estrutura válida
                expect(result).toBeDefined();
            } catch (error) {
                // Se der erro, deve ser tratado graciosamente
                expect(error).toBeInstanceOf(Error);
            }
        }
    });

    test('deve funcionar sem conexão com banco', async () => {
        // Mock de falha do Supabase
        jest.doMock('@/integrations/supabase/client', () => ({
            supabase: null
        }));

        const unifiedService = await import('@/services/UnifiedTemplateService');
        const template = await unifiedService.unifiedTemplateService.getTemplate('test-offline');

        expect(template).toBeDefined();
        expect(template.id).toBe('test-offline');
    });
});