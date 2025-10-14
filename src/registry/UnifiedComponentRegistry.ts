/**
 * 🎯 UNIFIED COMPONENT REGISTRY - FASE 1: CONSOLIDAÇÃO
 * 
 * Registry unificado que consolida os 3 sistemas fragmentados:
 * - EnhancedBlockRegistry (principal)
 * - LazyComponentRegistry (lazy loading)  
 * - ComponentRegistry (result-editor)
 * 
 * ✅ Sistema híbrido com preloading inteligente
 * ✅ Cache otimizado para performance
 * ✅ Fallbacks robustos
 */

import React, { lazy, type ComponentType } from 'react';

// Importações críticas estáticas (renderização imediata)
import ButtonInlineBlock from '@/components/editor/blocks/ButtonInlineBlock';
import FormInputBlock from '@/components/editor/blocks/FormInputBlock';
import ImageInlineBlock from '@/components/editor/blocks/ImageInlineBlock';
import LegalNoticeInlineBlock from '@/components/editor/blocks/LegalNoticeInlineBlock';
import OptionsGridBlock from '@/components/editor/blocks/OptionsGridBlock';
import QuizIntroHeaderBlock from '@/components/editor/blocks/QuizIntroHeaderBlock';
import TextInlineBlock from '@/components/editor/blocks/TextInlineBlock';
import SalesHeroBlock from '@/components/editor/blocks/SalesHeroBlock';
import DecorativeBarInlineBlock from '@/components/editor/blocks/DecorativeBarInlineBlock';
import {
    Step20ResultHeaderBlock,
    Step20StyleRevealBlock,
    Step20UserGreetingBlock,
    Step20CompatibilityBlock,
    Step20SecondaryStylesBlock,
    Step20PersonalizedOfferBlock,
    Step20CompleteTemplateBlock
} from '@/components/editor/blocks/Step20ModularBlocks';
import { FashionAIGeneratorBlock } from '@/components/blocks/ai';

// 🎯 CACHE INTELIGENTE - Evita re-loading desnecessário
const componentCache = new Map<string, ComponentType<any>>();
const preloadedComponents = new Set<string>();

// 🚀 COMPONENTS CRÍTICOS - Preload imediato
const CRITICAL_COMPONENTS = [
    'text', 'text-inline', 'button', 'button-inline', 'image', 'image-inline',
    'quiz-intro-header', 'options-grid', 'form-input', 'container'
];

// 📊 REGISTRY UNIFICADO - Consolidação dos 3 sistemas
export const UNIFIED_COMPONENT_REGISTRY: Record<string, ComponentType<any> | (() => Promise<{ default: ComponentType<any> }>)> = {
    // ✅ COMPONENTES CRÍTICOS - Estáticos (preload)
    'quiz-intro-header': QuizIntroHeaderBlock,
    'decorative-bar': DecorativeBarInlineBlock,
    'decorative-bar-inline': DecorativeBarInlineBlock,
    'text': TextInlineBlock,
    'text-inline': TextInlineBlock,
    'image': ImageInlineBlock,
    'image-inline': ImageInlineBlock,
    'form-input': FormInputBlock,
    'button': ButtonInlineBlock,
    'button-inline': ButtonInlineBlock,
    'legal-notice': LegalNoticeInlineBlock,
    'legal-notice-inline': LegalNoticeInlineBlock,
    'options-grid': OptionsGridBlock,
    // Container e aliases via lazy para evitar ciclo com BasicContainerBlock
    'container': lazy(() => import('@/components/editor/blocks/BasicContainerBlock')),
    'section': lazy(() => import('@/components/editor/blocks/BasicContainerBlock')),
    'box': lazy(() => import('@/components/editor/blocks/BasicContainerBlock')),
    // Compatibilidade explícita com templates de formulário
    'form-container': lazy(() => import('@/components/editor/blocks/BasicContainerBlock')),
    'sales-hero': SalesHeroBlock,

    // 🔌 COMPONENTES CONECTADOS À API - Controlados pelo /editor
    'quiz-options-grid-connected': lazy(() => import('@/components/blocks/quiz/QuizOptionsGridBlockConnected')),
    'quiz-app-connected': lazy(() => import('@/components/quiz/QuizAppConnected')),

    // ✅ STEP 20 - Módulos críticos (estáticos)
    'step20-result-header': Step20ResultHeaderBlock,
    'step20-style-reveal': Step20StyleRevealBlock,
    'step20-user-greeting': Step20UserGreetingBlock,
    'step20-compatibility': Step20CompatibilityBlock,
    'step20-secondary-styles': Step20SecondaryStylesBlock,
    'step20-personalized-offer': Step20PersonalizedOfferBlock,
    'step20-complete-template': Step20CompleteTemplateBlock,

    // 🤖 IA COMPONENTS
    'fashion-ai-generator': FashionAIGeneratorBlock,

    // 🔄 COMPONENTES LAZY - Para otimização de bundle
    'hero': lazy(() => import('@/components/editor/blocks/QuizTransitionBlock')),
    'quiz-transition': lazy(() => import('@/components/editor/blocks/QuizTransitionBlock')),
    'loading-animation': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),
    'loader-inline': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),
    'quiz-style-question': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
    'style-card-inline': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
    'style-cards-grid': lazy(() => import('@/components/editor/blocks/StyleCardsGridBlock')),
    'quiz-processing': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),
    'progress-bar': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),
    'progress-inline': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),
    'result-header-inline': lazy(() => import('@/components/editor/blocks/ResultHeaderInlineBlock')),
    'modular-result-header': lazy(() => import('@/components/editor/modules/ModularResultHeader')),
    'quiz-result-style': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
    'secondary-styles': lazy(() => import('@/components/editor/blocks/SecondaryStylesInlineBlock')),
    'quiz-result-secondary': lazy(() => import('@/components/editor/blocks/StyleCardsGridBlock')),
    'result-card': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
    'urgency-timer-inline': lazy(() => import('@/components/editor/blocks/UrgencyTimerInlineBlock')),
    'before-after-inline': lazy(() => import('@/components/editor/blocks/BeforeAfterInlineBlock')),
    'bonus': lazy(() => import('@/components/editor/blocks/BonusBlock')),
    'bonus-inline': lazy(() => import('@/components/editor/blocks/BonusInlineBlock')),
    'secure-purchase': lazy(() => import('@/components/editor/blocks/SecurePurchaseBlock')),
    'value-anchoring': lazy(() => import('@/components/editor/blocks/ValueAnchoringBlock')),
    'mentor-section-inline': lazy(() => import('@/components/editor/blocks/MentorSectionInlineBlock')),
    'testimonial-card-inline': lazy(() => import('@/components/editor/blocks/TestimonialCardInlineBlock')),
    'testimonials-carousel-inline': lazy(() => import('@/components/editor/blocks/TestimonialsCarouselInlineBlock')),
    'connected-template-wrapper': lazy(() => import('@/components/editor/blocks/ConnectedTemplateWrapperBlock')),
    'quiz-navigation': lazy(() => import('@/components/editor/blocks/QuizNavigationBlock')),
    'gradient-animation': lazy(() => import('@/components/editor/blocks/GradientAnimationBlock')),
    'heading': lazy(() => import('@/components/editor/blocks/HeadingInlineBlock')),
    'heading-inline': lazy(() => import('@/components/editor/blocks/HeadingInlineBlock')),
    'headline': lazy(() => import('@/components/editor/blocks/HeadingInlineBlock')),
    'headline-inline': lazy(() => import('@/components/editor/blocks/HeadingInlineBlock')),
    'image-display-inline': lazy(() => import('@/components/editor/blocks/ImageDisplayInline')),
    'lead-form': lazy(() => import('@/components/editor/blocks/LeadFormBlock')),
    'connected-lead-form': lazy(() => import('@/components/editor/blocks/ConnectedLeadFormBlock')),
    'benefits': lazy(() => import('@/components/editor/blocks/BenefitsListBlock')),
    'benefits-list': lazy(() => import('@/components/editor/blocks/BenefitsListBlock')),
    'testimonials': lazy(() => import('@/components/editor/blocks/TestimonialsBlock')),
    'testimonials-grid': lazy(() => import('@/components/editor/blocks/TestimonialsBlock')),
    'guarantee': lazy(() => import('@/components/editor/blocks/GuaranteeBlock')),
    'guarantee-badge': ImageInlineBlock,

    // ✅ FALLBACKS INTELIGENTES
    'form-*': FormInputBlock,
    'button-*': ButtonInlineBlock,
    'text-*': TextInlineBlock,
    'image-*': ImageInlineBlock,
    'quiz-*': TextInlineBlock,
};

/**
 * 🚀 PRELOADER INTELIGENTE - Carrega components críticos em paralelo
 */
export const preloadCriticalComponents = async (): Promise<void> => {
    const preloadPromises = CRITICAL_COMPONENTS.map(async (componentType) => {
        if (preloadedComponents.has(componentType)) return;

        try {
            const component = UNIFIED_COMPONENT_REGISTRY[componentType];
            if (component && typeof component === 'function' && !React.isValidElement(component)) {
                const loader = component as () => Promise<{ default: ComponentType<any> }>;
                const loadedComponent = await loader();
                componentCache.set(componentType, loadedComponent.default);
                preloadedComponents.add(componentType);
                console.log(`✅ Preloaded: ${componentType}`);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to preload ${componentType}:`, error);
        }
    });

    await Promise.allSettled(preloadPromises);
    console.log(`🚀 Preloaded ${preloadedComponents.size} critical components`);
};

/**
 * 🎯 UNIFIED COMPONENT GETTER - API única consolidada
 */
export const getUnifiedComponent = async (type: string): Promise<ComponentType<any> | null> => {
    console.log(`🔍 getUnifiedComponent: "${type}"`);

    // 1. Cache hit
    if (componentCache.has(type)) {
        console.log(`⚡ Cache hit: ${type}`);
        return componentCache.get(type)!;
    }

    // 2. Busca direta no registry
    const component = UNIFIED_COMPONENT_REGISTRY[type];
    if (component) {
        if (typeof component === 'function' && !React.isValidElement(component)) {
            // Check if it's a lazy loader (returns Promise)
            try {
                const result = (component as any)();
                if (result && typeof result.then === 'function') {
                    // It's a lazy component
                    const loadedComponent = await result;
                    componentCache.set(type, loadedComponent.default);
                    console.log(`✅ Lazy loaded: ${type}`);
                    return loadedComponent.default;
                } else {
                    // It's a regular React component
                    componentCache.set(type, component as ComponentType<any>);
                    console.log(`✅ Static component: ${type}`);
                    return component as ComponentType<any>;
                }
            } catch (error) {
                console.error(`❌ Failed to load component ${type}:`, error);
                return null;
            }
        } else {
            // Static component
            componentCache.set(type, component as ComponentType<any>);
            console.log(`✅ Static component: ${type}`);
            return component as ComponentType<any>;
        }
    }

    // 3. Fallbacks inteligentes
    const fallbackComponent = getFallbackComponent(type);
    if (fallbackComponent) {
        componentCache.set(type, fallbackComponent);
        console.log(`🎨 Fallback: ${type} → ${fallbackComponent.name}`);
        return fallbackComponent;
    }

    console.warn(`❌ Component not found: ${type}`);
    return null;
};

/**
 * 🎨 FALLBACK SYSTEM - Fallbacks inteligentes
 */
const getFallbackComponent = (type: string): ComponentType<any> | null => {
    // Verificar fallbacks com wildcard
    const prefix = type.split('-')[0];
    const fallbackKey = `${prefix}-*`;
    if (UNIFIED_COMPONENT_REGISTRY[fallbackKey]) {
        return UNIFIED_COMPONENT_REGISTRY[fallbackKey] as ComponentType<any>;
    }

    // Fallbacks por categoria
    if (type.includes('text') || type.includes('paragraph') || type.includes('heading')) {
        return TextInlineBlock;
    }
    if (type.includes('button') || type.includes('cta')) {
        return ButtonInlineBlock;
    }
    if (type.includes('image') || type.includes('img') || type.includes('photo')) {
        return ImageInlineBlock;
    }
    if (type.includes('quiz')) {
        return TextInlineBlock;
    }

    return TextInlineBlock; // Fallback final
};

/**
 * 📊 REGISTRY SYNC - Para compatibilidade com legacy
 */
export const getUnifiedComponentSync = (type: string): ComponentType<any> | null => {
    // Para componentes já em cache ou estáticos
    if (componentCache.has(type)) {
        return componentCache.get(type)!;
    }

    const component = UNIFIED_COMPONENT_REGISTRY[type];
    if (component && typeof component !== 'function') {
        return component;
    }

    return getFallbackComponent(type);
};

/**
 * 📈 PERFORMANCE METRICS
 */
export const getRegistryStats = () => ({
    totalComponents: Object.keys(UNIFIED_COMPONENT_REGISTRY).length,
    preloadedComponents: preloadedComponents.size,
    cachedComponents: componentCache.size,
    criticalComponents: CRITICAL_COMPONENTS.length,
    cacheHitRate: componentCache.size > 0 ? (preloadedComponents.size / componentCache.size) * 100 : 0
});

// 🚀 Auto-preload críticos na inicialização - DESABILITADO TEMPORARIAMENTE
if (typeof window !== 'undefined' && false) { // Desabilitado para evitar erros de undefined block
    // Preload após 100ms para não bloquear a inicialização
    setTimeout(() => {
        preloadCriticalComponents().catch(console.error);
    }, 100);
}

export default UNIFIED_COMPONENT_REGISTRY;