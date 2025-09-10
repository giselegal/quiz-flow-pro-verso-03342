/**
 * 🏗️ BUILDER SYSTEM - Sistema de construção completo
 * 
 * Sistema unificado de builders para criação de componentes, funis e layouts
 * com padrões modernos, validação automática e otimizações inteligentes.
 */

// ✨ IMPORTS PARA USO INTERNO
import ComponentBuilder, {
    ValidationResult,
    ValidationError,
    ValidationWarning,
    createQuizQuestion,
    createLeadCapture,
    createHero,
    createComponent,
    fromTemplate,
    validateComponent
} from './ComponentBuilder';

import FunnelBuilder, {
    FunnelConfig,
    createFunnel,
    createFunnelFromTemplate,
    createOptimizedFunnel
} from './FunnelBuilder';

import UIBuilder, {
    LayoutConfig,
    createSingleColumnLayout,
    createTwoColumnLayout,
    createGridLayout,
    createQuizLayout,
    createLandingLayout
} from './UIBuilder';

// ✨ EXPORTAR TODOS OS BUILDERS
export { ComponentBuilder, FunnelBuilder, UIBuilder };

// ✨ EXPORTAR TIPOS
export type {
    ValidationResult,
    ValidationError,
    ValidationWarning
} from './ComponentBuilder';

export type {
    FunnelConfig
} from './FunnelBuilder';

export type {
    LayoutConfig
} from './UIBuilder';

// ✨ EXPORTAR TEMPLATES
export { COMPONENT_TEMPLATES } from './ComponentBuilder';
export { FUNNEL_TEMPLATES } from './FunnelBuilder';
export { LAYOUT_TEMPLATES, THEME_PRESETS } from './UIBuilder';

// ✨ EXPORTAR FACTORY FUNCTIONS
export {
    createQuizQuestion,
    createLeadCapture,
    createHero,
    createComponent,
    fromTemplate,
    validateComponent
} from './ComponentBuilder';

export {
    createFunnel,
    createFunnelFromTemplate,
    createOptimizedFunnel
} from './FunnelBuilder';

export {
    createSingleColumnLayout,
    createTwoColumnLayout,
    createGridLayout,
    createQuizLayout,
    createLandingLayout
} from './UIBuilder';

// ✨ BUILDER FACADE - Interface unificada para uso simples
export class QuizBuilderFacade {
    /**
     * Cria um quiz completo com layout otimizado
     */
    static createCompleteQuiz(name: string) {
        const funnel = createFunnelFromTemplate('product-quiz')
            .autoConnect()
            .optimize();

        const layout = createQuizLayout(`${name} Layout`)
            .withTheme('modern-blue')
            .optimize();

        return {
            funnel: funnel.build(),
            layout: layout.build(),
            css: layout.generateCSS()
        };
    }

    /**
     * Cria uma landing page otimizada para conversão
     */
    static createLandingPage(name: string) {
        const layout = createLandingLayout(name)
            .withTheme('warm-orange')
            .withFullAccessibility();

        return {
            layout: layout.build(),
            css: layout.generateCSS()
        };
    }

    /**
     * Cria um funil de qualificação de leads
     */
    static createLeadQualification(name: string) {
        const funnel = createFunnelFromTemplate('lead-qualification')
            .withAnalytics({
                trackingEnabled: true,
                events: ['step_start', 'step_complete', 'lead_captured', 'funnel_complete']
            })
            .autoConnect()
            .optimize();

        const layout = createSingleColumnLayout(`${name} Layout`)
            .withTheme('minimal-gray')
            .optimizeForMobile();

        return {
            funnel: funnel.build(),
            layout: layout.build(),
            css: layout.generateCSS()
        };
    }
}

// ✨ BUILDER VALIDATOR - Validação cruzada entre builders
export class BuilderValidator {
    /**
     * Valida compatibilidade entre funil e layout
     */
    static validateFunnelLayout(funnel: FunnelConfig, layout: LayoutConfig): ValidationResult {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        // Verificar se o layout suporta o número de componentes
        const maxComponentsPerStep = Math.max(
            ...funnel.steps.map(step => step.components.length)
        );

        if (layout.type === 'single-column' && maxComponentsPerStep > 3) {
            warnings.push({
                field: 'layout',
                message: 'Layout de coluna única pode ficar sobrecarregado com muitos componentes',
                suggestion: 'Considere usar layout de duas colunas ou grid'
            });
        }

        // Verificar compatibilidade de tema
        if (funnel.settings.theme !== layout.theme.name) {
            warnings.push({
                field: 'theme',
                message: 'Tema do funil não coincide com tema do layout',
                suggestion: 'Sincronize os temas para consistência visual'
            });
        }

        // Verificar acessibilidade
        if (funnel.steps.some(step => step.components.length > 5) && !layout.accessibility.reducedMotion) {
            warnings.push({
                field: 'accessibility',
                message: 'Funil complexo sem configurações de acessibilidade',
                suggestion: 'Habilite suporte a movimento reduzido'
            });
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Sugere otimizações para a combinação funil + layout
     */
    static suggestOptimizations(funnel: FunnelConfig, layout: LayoutConfig): string[] {
        const suggestions: string[] = [];

        // Sugestões baseadas no número de etapas
        if (funnel.steps.length > 10) {
            suggestions.push('🔄 Considere dividir o funil em múltiplas seções');
            suggestions.push('📊 Adicione indicadores de progresso mais detalhados');
        }

        // Sugestões baseadas no layout
        if (layout.type === 'grid' && funnel.steps.every(step => step.components.length === 1)) {
            suggestions.push('📱 Layout de grid pode ser simplificado para coluna única');
        }

        // Sugestões de performance
        if (layout.animations.length > 5) {
            suggestions.push('⚡ Reduza animações para melhor performance mobile');
        }

        // Sugestões de conversão
        if (!funnel.steps.some(step => step.components.some(c => c.type === 'lead-capture'))) {
            suggestions.push('📧 Adicione captura de lead para melhor conversão');
        }

        return suggestions;
    }
}

// ✨ BUILDER PRESETS - Configurações predefinidas populares
export const BUILDER_PRESETS = {
    'quiz-product-recommendation': () => QuizBuilderFacade.createCompleteQuiz('Recomendação de Produto'),
    'lead-magnet-quiz': () => QuizBuilderFacade.createLeadQualification('Quiz Lead Magnet'),
    'customer-satisfaction': () => {
        const funnel = createFunnelFromTemplate('customer-satisfaction')
            .autoConnect()
            .optimize();

        const layout = createSingleColumnLayout('Pesquisa de Satisfação')
            .withTheme('minimal-gray');

        return {
            funnel: funnel.build(),
            layout: layout.build(),
            css: layout.generateCSS()
        };
    },
    'landing-page-hero': () => QuizBuilderFacade.createLandingPage('Landing Page Principal')
};

export default {
    ComponentBuilder,
    FunnelBuilder,
    UIBuilder,
    QuizBuilderFacade,
    BuilderValidator,
    BUILDER_PRESETS
};
