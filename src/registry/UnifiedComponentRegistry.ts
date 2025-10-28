/**
 * 🎯 UNIFIED COMPONENT REGISTRY - OTIMIZADO
 * 
 * Registry que delega para UnifiedBlockRegistry para evitar duplicação.
 * Mantém apenas cache e lógica de preload.
 * 
 * ✅ Delegação para UnifiedBlockRegistry (elimina duplicação)
 * ✅ Cache otimizado para performance
 * ✅ Fallbacks robustos
 */

import React, { type ComponentType } from 'react';
import { UnifiedBlockRegistry } from '@/registry/UnifiedBlockRegistry';

// ⚡ APENAS 5 BLOCOS CRÍTICOS - Evita duplicação
import ButtonInlineBlock from '@/components/editor/blocks/ButtonInlineBlock';
import FormInputBlock from '@/components/editor/blocks/FormInputBlock';
import ImageInlineBlock from '@/components/editor/blocks/ImageInlineBlock';
import OptionsGridBlock from '@/components/editor/blocks/OptionsGridBlock';
import TextInlineBlock from '@/components/editor/blocks/TextInlineBlock';

// 🔄 SINGLETON DO UNIFIED BLOCK REGISTRY
const _blockRegistry = UnifiedBlockRegistry.getInstance();

// 🎯 CACHE INTELIGENTE - Evita re-loading desnecessário
const componentCache = new Map<string, ComponentType<any>>();
const preloadedComponents = new Set<string>();

// 🚀 COMPONENTS CRÍTICOS - Preload imediato
const CRITICAL_COMPONENTS = [
    'text', 'text-inline', 'button', 'button-inline', 'image', 'image-inline',
    'form-input', 'container', 'options-grid', 'quiz-intro-header',
    'heading', 'heading-inline',
    'question-progress', 'question-hero', 'quiz-question-header',
    'question-number', 'question-text', 'question-instructions', 'question-navigation',
    'quiz-transition', 'transition-hero',
    'result-cta', 'offer-hero', 'pricing', 'testimonials', 'guarantee', 'secure-purchase',
];

// 📊 REGISTRY OTIMIZADO - Delega para UnifiedBlockRegistry
// Mantém apenas componentes únicos conectados à API
const UNIQUE_COMPONENTS: Record<string, ComponentType<any>> = {
    // 🔌 COMPONENTES CONECTADOS À API - Não estão no UnifiedBlockRegistry
    'quiz-options-grid-connected': React.lazy(() => import('@/components/blocks/quiz/QuizOptionsGridBlockConnected')),
    'quiz-app-connected': React.lazy(() => import('@/components/quiz/QuizAppConnected')),
};

// 🔄 PROXY REGISTRY - Delega para UnifiedBlockRegistry com fallback local
export const UNIFIED_COMPONENT_REGISTRY = new Proxy(UNIQUE_COMPONENTS, {
    get(target, prop: string) {
        // 1️⃣ Verificar se existe nos componentes únicos locais
        if (prop in target) {
            return target[prop];
        }
        
        // 2️⃣ Delegar para UnifiedBlockRegistry
        const blockComponent = _blockRegistry.getComponent(prop);
        if (blockComponent) {
            return blockComponent;
        }
        
        // 3️⃣ Fallback para TextInlineBlock
        console.warn(`⚠️ Componente "${prop}" não encontrado. Usando fallback TextInlineBlock.`);
        return TextInlineBlock;
    },
    
    has(target, prop: string) {
        return prop in target || _blockRegistry.has(prop as string);
    },
    
    ownKeys(target) {
        const blockKeys = _blockRegistry.getAllTypes();
        return [...Object.keys(target), ...blockKeys];
    },
});

/**
 * 🚀 PRELOADER INTELIGENTE - Carrega components críticos em paralelo
 */
export const preloadCriticalComponents = async (): Promise<void> => {
    const preloadPromises = CRITICAL_COMPONENTS.map(async (componentType) => {
        if (preloadedComponents.has(componentType)) return;

        try {
            const component = UNIFIED_COMPONENT_REGISTRY[componentType];
            // Não invoque componentes de função (causa erros por falta de props)
            // A meta aqui é só aquecer o cache local com o mapping
            if (component) {
                componentCache.set(componentType, component as any);
                preloadedComponents.add(componentType);
                // Nota: para componentes lazy, isso não força o download do chunk, mas evita lookups repetidos
                console.log(`✅ Registry cached: ${componentType}`);
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
        // Nunca invoque o componente aqui; apenas retorne a referência (estática ou lazy)
        componentCache.set(type, component as any);
        console.log(`✅ Component mapped: ${type}`);
        return component as any;
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
    cacheHitRate: componentCache.size > 0 ? (preloadedComponents.size / componentCache.size) * 100 : 0,
});

// 🚀 Auto-preload críticos na inicialização - DESABILITADO TEMPORARIAMENTE
if (typeof window !== 'undefined' && false) { // Mantido desabilitado para evitar side-effects; podemos ativar via chamada explícita
    // Preload após 100ms para não bloquear a inicialização
    setTimeout(() => {
        preloadCriticalComponents().catch(console.error);
    }, 100);
}

export default UNIFIED_COMPONENT_REGISTRY;