/**
 * 🧪 TESTES DA FASE 2 - JSON Template Integration
 * 
 * Testes focados nas implementações da FASE 2:
 * - JsonTemplateService
 * - Feature flags integration
 * - Loading/Error states
 * - Type helpers
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jsonTemplateService, JsonTemplateService } from '@/services/JsonTemplateService';
import {
    isJsonBlockType,
    isQuizBlockType,
    isOfferBlockType,
    isInlineBlockType,
    getBlockCategory,
    isValidBlockType
} from '@/types/editor';

describe('FASE 2 - JSON Template Integration', () => {
    describe('JsonTemplateService', () => {
        beforeEach(() => {
            // Limpar cache antes de cada teste
            jsonTemplateService.clearCache();
            jsonTemplateService.resetMetrics();
        });

        it('deve ser um singleton', () => {
            const instance1 = JsonTemplateService.getInstance();
            const instance2 = JsonTemplateService.getInstance();

            expect(instance1).toBe(instance2);
            expect(instance1).toBe(jsonTemplateService);
        });

        it('deve configurar o serviço', () => {
            jsonTemplateService.configure({
                cacheEnabled: false,
                prefetchEnabled: false,
            });

            const stats = jsonTemplateService.getStats();
            expect(stats.config.cacheEnabled).toBe(false);
            expect(stats.config.prefetchEnabled).toBe(false);
        });

        it('deve listar templates disponíveis', async () => {
            const templates = await jsonTemplateService.listTemplates();

            expect(templates).toBeDefined();
            expect(Array.isArray(templates)).toBe(true);
            expect(templates.length).toBe(21); // Quiz tem 21 steps
        });

        it('deve ter métricas inicializadas', () => {
            const metrics = jsonTemplateService.getMetrics();

            expect(metrics).toBeDefined();
            expect(metrics.hits).toBe(0);
            expect(metrics.misses).toBe(0);
            expect(metrics.errors).toBe(0);
        });

        it('deve limpar cache', () => {
            jsonTemplateService.clearCache();

            const stats = jsonTemplateService.getStats();
            expect(stats.cache.size).toBe(0);
        });

        it('deve resetar métricas', () => {
            jsonTemplateService.resetMetrics();

            const metrics = jsonTemplateService.getMetrics();
            expect(metrics.hits).toBe(0);
            expect(metrics.misses).toBe(0);
            expect(metrics.totalLoadTime).toBe(0);
        });
    });

    describe('Type Helpers - isJsonBlockType', () => {
        it('deve identificar tipos JSON offer-*', () => {
            expect(isJsonBlockType('offer-header')).toBe(true);
            expect(isJsonBlockType('offer-hero-section')).toBe(true);
            expect(isJsonBlockType('offer-problem-section')).toBe(true);
            expect(isJsonBlockType('offer-solution-section')).toBe(true);
            expect(isJsonBlockType('offer-product-showcase')).toBe(true);
            expect(isJsonBlockType('offer-guarantee-section')).toBe(true);
            expect(isJsonBlockType('offer-faq-section')).toBe(true);
        });

        it('deve identificar tipos JSON de loading', () => {
            expect(isJsonBlockType('spinner')).toBe(true);
        });

        it('deve identificar tipos JSON de data', () => {
            expect(isJsonBlockType('category-points')).toBe(true);
            expect(isJsonBlockType('input')).toBe(true);
            expect(isJsonBlockType('selection')).toBe(true);
        });

        it('deve identificar tipos JSON de quiz flow', () => {
            expect(isJsonBlockType('strategic')).toBe(true);
            expect(isJsonBlockType('transition')).toBe(true);
            expect(isJsonBlockType('intro')).toBe(true);
            expect(isJsonBlockType('question')).toBe(true);
            expect(isJsonBlockType('result')).toBe(true);
            expect(isJsonBlockType('offer')).toBe(true);
            expect(isJsonBlockType('none')).toBe(true);
        });

        it('deve rejeitar tipos não-JSON', () => {
            expect(isJsonBlockType('text-inline')).toBe(false);
            expect(isJsonBlockType('button-inline')).toBe(false);
            expect(isJsonBlockType('options-grid')).toBe(false);
            expect(isJsonBlockType('invalid-type')).toBe(false);
        });
    });

    describe('Type Helpers - isQuizBlockType', () => {
        it('deve identificar tipos quiz-*', () => {
            expect(isQuizBlockType('quiz-intro-header')).toBe(true);
            expect(isQuizBlockType('quiz-question')).toBe(true);
            expect(isQuizBlockType('quiz-header')).toBe(true);
        });

        it('deve identificar tipos de flow de quiz', () => {
            expect(isQuizBlockType('question')).toBe(true);
            expect(isQuizBlockType('intro')).toBe(true);
            expect(isQuizBlockType('result')).toBe(true);
            expect(isQuizBlockType('strategic')).toBe(true);
            expect(isQuizBlockType('transition')).toBe(true);
        });

        it('deve rejeitar tipos não-quiz', () => {
            expect(isQuizBlockType('offer-header')).toBe(false);
            expect(isQuizBlockType('text-inline')).toBe(false);
        });
    });

    describe('Type Helpers - isOfferBlockType', () => {
        it('deve identificar tipos offer-*', () => {
            expect(isOfferBlockType('offer-header')).toBe(true);
            expect(isOfferBlockType('offer-hero-section')).toBe(true);
            expect(isOfferBlockType('offer')).toBe(true);
        });

        it('deve rejeitar tipos não-offer', () => {
            expect(isOfferBlockType('quiz-header')).toBe(false);
            expect(isOfferBlockType('text-inline')).toBe(false);
        });
    });

    describe('Type Helpers - isInlineBlockType', () => {
        it('deve identificar tipos *-inline', () => {
            expect(isInlineBlockType('text-inline')).toBe(true);
            expect(isInlineBlockType('button-inline')).toBe(true);
            expect(isInlineBlockType('image-display-inline')).toBe(true);
            expect(isInlineBlockType('decorative-bar-inline')).toBe(true);
        });

        it('deve rejeitar tipos não-inline', () => {
            expect(isInlineBlockType('offer-header')).toBe(false);
            expect(isInlineBlockType('quiz-question')).toBe(false);
        });
    });

    describe('Type Helpers - getBlockCategory', () => {
        it('deve categorizar blocos de quiz', () => {
            expect(getBlockCategory('quiz-intro-header')).toBe('quiz');
            expect(getBlockCategory('question')).toBe('quiz');
            expect(getBlockCategory('strategic')).toBe('quiz');
        });

        it('deve categorizar blocos de offer', () => {
            expect(getBlockCategory('offer-header')).toBe('offer');
            expect(getBlockCategory('offer-hero-section')).toBe('offer');
            expect(getBlockCategory('offer')).toBe('offer');
        });

        it('deve categorizar blocos de conteúdo', () => {
            expect(getBlockCategory('text')).toBe('content');
            expect(getBlockCategory('text-inline')).toBe('content');
            expect(getBlockCategory('headline')).toBe('content');
            expect(getBlockCategory('button')).toBe('content');
            expect(getBlockCategory('button-inline')).toBe('content');
        });

        it('deve categorizar blocos de formulário', () => {
            expect(getBlockCategory('form-input')).toBe('form');
            expect(getBlockCategory('lead-form')).toBe('form');
            expect(getBlockCategory('input')).toBe('form');
        });

        it('deve categorizar blocos de media', () => {
            expect(getBlockCategory('image')).toBe('media');
            expect(getBlockCategory('image-display-inline')).toBe('media');
            expect(getBlockCategory('video')).toBe('media');
        });

        it('deve categorizar blocos de layout', () => {
            expect(getBlockCategory('container')).toBe('layout');
            expect(getBlockCategory('grid')).toBe('layout');
            expect(getBlockCategory('two-column')).toBe('layout');
        });

        it('deve retornar unknown para tipos desconhecidos', () => {
            expect(getBlockCategory('unknown-type')).toBe('unknown');
            expect(getBlockCategory('spinner')).toBe('unknown');
        });
    });

    describe('Type Helpers - isValidBlockType', () => {
        it('deve aceitar strings não-vazias', () => {
            expect(isValidBlockType('text-inline')).toBe(true);
            expect(isValidBlockType('offer-header')).toBe(true);
            expect(isValidBlockType('any-string')).toBe(true);
        });

        it('deve rejeitar strings vazias', () => {
            expect(isValidBlockType('')).toBe(false);
        });

        it('deve rejeitar não-strings', () => {
            expect(isValidBlockType(null as any)).toBe(false);
            expect(isValidBlockType(undefined as any)).toBe(false);
            expect(isValidBlockType(123 as any)).toBe(false);
        });
    });
});
