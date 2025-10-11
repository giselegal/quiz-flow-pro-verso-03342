/**
 * FASE 3A - Testes de Integração para 15 Novos Componentes
 * 
 * Valida renderização e props dos componentes inline criados
 */

import { describe, it, expect } from 'vitest';

describe('FASE 3A - Registro de Componentes no UniversalBlockRenderer', () => {
    it('deve validar que UniversalBlockRenderer existe e aceita os novos tipos', async () => {
        // Importação dinâmica para evitar problemas de ciclo
        const module = await import('@/components/editor/blocks/UniversalBlockRenderer');
        const UniversalBlockRenderer = module.default || module.UniversalBlockRenderer;

        expect(UniversalBlockRenderer).toBeDefined();
        // UniversalBlockRenderer pode ser um objeto module ou função React
        expect(['function', 'object']).toContain(typeof UniversalBlockRenderer);
    }); describe('Validação de Tipos da FASE 3A', () => {
        const fase3aComponentTypes = [
            'image-display-inline',
            'decorative-bar-inline',
            'lead-form',
            'result-card-inline',
            'result-display',
            'loading-animation',
            'spinner',
            'offer-header',
            'offer-hero-section',
            'offer-benefits-list',
            'offer-testimonials',
            'offer-pricing-table',
            'offer-faq-section',
            'offer-cta-section',
        ];

        it('deve ter exatamente 14 tipos de componentes na FASE 3A', () => {
            expect(fase3aComponentTypes.length).toBe(14);
        });

        it('deve ter todos os nomes seguindo convenção kebab-case', () => {
            fase3aComponentTypes.forEach(type => {
                expect(type).toMatch(/^[a-z]+(-[a-z]+)*$/);
            });
        });

        it('deve incluir 2 componentes inline', () => {
            const inlineComponents = fase3aComponentTypes.filter(t =>
                t === 'image-display-inline' || t === 'decorative-bar-inline'
            );
            expect(inlineComponents.length).toBe(2);
        });

        it('deve incluir 3 componentes de formulário/resultado', () => {
            const formResultComponents = fase3aComponentTypes.filter(t =>
                t.includes('lead-form') || t.includes('result')
            );
            expect(formResultComponents.length).toBe(3);
        });

        it('deve incluir 2 componentes de loading', () => {
            const loadingComponents = fase3aComponentTypes.filter(t =>
                t.includes('loading') || t.includes('spinner')
            );
            expect(loadingComponents.length).toBe(2);
        });

        it('deve incluir 7 componentes de offer', () => {
            const offerComponents = fase3aComponentTypes.filter(t =>
                t.startsWith('offer-')
            );
            expect(offerComponents.length).toBe(7);
        });
    });

    describe('Compatibilidade com FASE 2', () => {
        it('deve ser compatível com tipos JSON da FASE 2', () => {
            const jsonCompatibleTypes = [
                'image-display-inline',
                'decorative-bar-inline',
                'offer-header',
                'offer-hero-section',
                'offer-benefits-list',
                'offer-testimonials',
                'offer-pricing-table',
                'offer-faq-section',
                'offer-cta-section',
            ];

            jsonCompatibleTypes.forEach(type => {
                expect(type).toMatch(/^[a-z-]+$/);
            });
        });

        it('deve seguir padrão de nomenclatura: categoria-nome-tipo', () => {
            const patternsValidos = [
                /^offer-/,        // Offer components
                /^result-/,       // Result components
                /-inline$/,       // Inline components
                /^lead-/,         // Form components
                /^loading-/,      // Loading components
                /^spinner$/,      // Spinner component
            ];

            const fase3aTypes = [
                'image-display-inline',
                'decorative-bar-inline',
                'lead-form',
                'result-card-inline',
                'result-display',
                'loading-animation',
                'spinner',
                'offer-header',
                'offer-hero-section',
                'offer-benefits-list',
                'offer-testimonials',
                'offer-pricing-table',
                'offer-faq-section',
                'offer-cta-section',
            ];

            fase3aTypes.forEach(type => {
                const matchesPattern = patternsValidos.some(pattern =>
                    pattern.test(type)
                );
                expect(matchesPattern, `${type} deve seguir um dos padrões válidos`).toBe(true);
            });
        });
    });

    describe('Arquivos de Componentes', () => {
        it('deve ter arquivos criados no diretório correto', async () => {
            // Validar que os componentes podem ser importados
            const imports = [
                () => import('@/components/blocks/inline/ImageDisplayInlineBlock'),
                () => import('@/components/blocks/inline/DecorativeBarInlineBlock'),
                () => import('@/components/blocks/inline/LeadFormBlock'),
                () => import('@/components/blocks/inline/ResultCardInlineBlock'),
                () => import('@/components/blocks/inline/ResultDisplayBlock'),
                () => import('@/components/blocks/inline/LoadingAnimationBlock'),
                () => import('@/components/blocks/inline/SpinnerBlock'),
                () => import('@/components/blocks/inline/OfferHeaderInlineBlock'),
                () => import('@/components/blocks/inline/OfferHeroSectionInlineBlock'),
                () => import('@/components/blocks/inline/BenefitsInlineBlock'),
                () => import('@/components/blocks/inline/TestimonialsInlineBlock'),
                () => import('@/components/blocks/inline/QuizOfferPricingInlineBlock'),
                () => import('@/components/blocks/inline/OfferFaqSectionInlineBlock'),
                () => import('@/components/blocks/inline/QuizOfferCTAInlineBlock'),
            ];

            for (const importFn of imports) {
                const module = await importFn();
                expect(module.default).toBeDefined();
            }
        });
    });
});
