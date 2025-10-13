/**
 * 🏗️ BUILDER SYSTEM - Sistema de construção completo
 */

import type { FunnelConfig } from './FunnelBuilder';
import type { LayoutConfig } from './UIBuilder';
import type { ValidationResult, ValidationError, ValidationWarning } from './ComponentBuilder';
import { FunnelBuilder } from './FunnelBuilder';
import { UIBuilder } from './UIBuilder';

// ✨ EXPORTS LIMPOS - Removendo imports não utilizados para corrigir build errors
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

// ✨ FACTORY FUNCTIONS ATIVAS (apenas as utilizadas)
export { COMPONENT_TEMPLATES } from './ComponentBuilder';
export { FUNNEL_TEMPLATES, FunnelBuilder } from './FunnelBuilder';
export { LAYOUT_TEMPLATES, THEME_PRESETS, UIBuilder } from './UIBuilder';

// ✨ BUILDER FACADE - Interface unificada para uso simples

export class QuizBuilderFacade {
    /**
     * Cria um quiz completo com layout otimizado
     */
    static createCompleteQuiz(name: string): { funnel: FunnelConfig; layout: LayoutConfig; css: string } {
        const funnel = new FunnelBuilder(name)
            .fromTemplate('product-quiz')
            .withTheme('modern-blue')
            .withSettings({ showProgress: true, autoAdvance: true })
            .autoConnect()
            .optimize()
            .build();

        const layout = new UIBuilder(`${name} Layout`, 'single-column')
            .withTheme('modern-blue')
            .withGrid({ maxWidth: '600px', gap: '2rem' })
            .build();

        const css = this.generateCSS(layout);

        return { funnel, layout, css };
    }

    /**
     * Cria uma landing page otimizada para conversão
     */
    static createLandingPage(name: string): { funnel: FunnelConfig; layout: LayoutConfig; css: string } {
        const funnel = new FunnelBuilder(name)
            .addStep('Hero').complete()
            .withTheme('warm-orange')
            .autoConnect()
            .build();

        const layout = new UIBuilder(`${name} Landing`, 'single-column')
            .withTheme('warm-orange')
            .withGrid({ maxWidth: '100%', padding: '0' })
            .build();

        const css = this.generateCSS(layout);

        return { funnel, layout, css };
    }

    /**
     * Cria um funil de qualificação de leads
     */
    static createLeadQualification(name: string): { funnel: FunnelConfig; layout: LayoutConfig; css: string } {
        const funnel = new FunnelBuilder(name)
            .fromTemplate('lead-qualification')
            .withTheme('minimal-gray')
            .withSettings({ saveProgress: true, showProgress: true })
            .withAnalytics({ trackingEnabled: true })
            .autoConnect()
            .optimize()
            .build();

        const layout = new UIBuilder(`${name} Layout`, 'two-column')
            .withTheme('minimal-gray')
            .withGrid({ columns: 2, gap: '3rem' })
            .build();

        const css = this.generateCSS(layout);

        return { funnel, layout, css };
    }

    /**
     * Gera CSS a partir do layout
     */
    static generateCSS(layout: LayoutConfig): string {
        const { theme } = layout;
        return `
/* Tema: ${theme.name} */
:root {
    --primary-500: ${theme.colors.primary[500]};
    --primary-600: ${theme.colors.primary[600]};
    --spacing-unit: ${theme.spacing.unit}px;
}

body {
    font-family: ${theme.typography.fontFamily.primary};
    line-height: ${theme.typography.lineHeight.normal};
}
        `.trim();
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
        const funnel = new FunnelBuilder('Pesquisa de Satisfação')
            .fromTemplate('customer-satisfaction')
            .withTheme('modern-blue')
            .autoConnect()
            .optimize()
            .build();

        const layout = new UIBuilder('Satisfação Layout', 'single-column')
            .withTheme('modern-blue')
            .build();

        return { funnel, layout, css: QuizBuilderFacade.generateCSS(layout) };
    },
    'landing-page-hero': () => QuizBuilderFacade.createLandingPage('Landing Page Principal')
};

export default {
    QuizBuilderFacade,
    BuilderValidator,
    BUILDER_PRESETS
};
