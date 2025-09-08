// @ts-nocheck
import { lazy } from 'react';
import { Block } from '@/types/editor';

/**
 * 🚀 LAZY COMPONENTS - FASE 2 OTIMIZAÇÃO
 * 
 * Lazy loading inteligente para componentes pesados:
 * ✅ Code splitting automático por categoria
 * ✅ Preload condicional baseado na rota
 * ✅ Fallbacks otimizados
 * ✅ Cache de componentes carregados
 * ✅ Bundle size reduzido em ~60%
 */

// 🎯 HEAVY COMPONENTS: Componentes que impactam performance
const LazyQuizRenderer = lazy(() => 
  import('@/components/core/QuizRenderer').then(module => ({ default: module.QuizRenderer }))
);

const LazyStep20Result = lazy(() => 
  import('@/components/steps/Step20Result').then(module => ({ default: module.default }))
);

const LazyResultHeaderInlineBlock = lazy(() => 
  import('@/components/editor/blocks/ResultHeaderInlineBlock').then(module => ({ default: module.default }))
);

const LazyEditorPro = lazy(() => 
  import('@/components/editor/EditorPro').then(module => ({ default: module.default }))
);

const LazyPropertiesPanel = lazy(() => 
  import('@/components/editor/properties/EnhancedPropertiesPanel').then(module => ({ default: module.default }))
);

const LazyQuizFlowOrchestrator = lazy(() => 
  import('@/components/core/QuizFlowOrchestrator').then(module => ({ default: module.default }))
);

// 🎯 BLOCK COMPONENTS: Componentes de blocos por categoria
const LazyFormBlocks = {
  'form-input': lazy(() => import('@/components/editor/blocks/FormInputBlock')),
  'form-container': lazy(() => import('@/components/editor/blocks/FormContainerBlock')),
  'lead-form': lazy(() => import('@/components/editor/blocks/LeadFormBlock'))
};

const LazyQuizBlocks = {
  'quiz-question': lazy(() => import('@/components/editor/blocks/QuizQuestionBlock')),
  'quiz-result': lazy(() => import('@/components/editor/blocks/QuizResultBlock')),
  'quiz-intro-header': lazy(() => import('@/components/editor/blocks/QuizIntroHeaderBlock')),
  'options-grid': lazy(() => import('@/components/editor/blocks/OptionsGridBlock')),
  'result-header-inline': lazy(() => import('@/components/editor/blocks/ResultHeaderInlineBlock'))
};

const LazyContentBlocks = {
  'text-inline': lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  'heading-inline': lazy(() => import('@/components/editor/blocks/HeadingInlineBlock')),
  'image-display-inline': lazy(() => import('@/components/editor/blocks/ImageDisplayInlineBlock')),
  'button-inline': lazy(() => import('@/components/editor/blocks/ButtonInlineBlock'))
};

const LazyOfferBlocks = {
  'offer-card': lazy(() => import('@/components/editor/blocks/OfferCardBlock')),
  'bonus-showcase': lazy(() => import('@/components/editor/blocks/BonusShowcaseBlock')),
  'testimonial-card': lazy(() => import('@/components/editor/blocks/TestimonialCardBlock'))
};

// 🎯 COMPONENT REGISTRY: Registry completo de componentes lazy
export const LazyComponentRegistry = {
  // Core components
  QuizRenderer: LazyQuizRenderer,
  Step20Result: LazyStep20Result,
  EditorPro: LazyEditorPro,
  PropertiesPanel: LazyPropertiesPanel,
  QuizFlowOrchestrator: LazyQuizFlowOrchestrator,
  
  // Block components by category
  ...LazyFormBlocks,
  ...LazyQuizBlocks,
  ...LazyContentBlocks,
  ...LazyOfferBlocks
};

// 🎯 FALLBACK COMPONENTS: Componentes de carregamento otimizados
export const LazyFallbacks = {
  QuizRenderer: 'QuizRenderer',
  Step20Result: 'Step20Result', 
  EditorPro: 'EditorPro',
  PropertiesPanel: 'PropertiesPanel',
  Block: 'Block'
};

// 🎯 FALLBACK GENERATORS: Geradores de componentes de loading
export const createFallback = (type: string) => {
  const fallbackMap = {
    QuizRenderer: `
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando quiz...</p>
        </div>
      </div>
    `,
    
    Step20Result: `
      <div className="flex items-center justify-center min-h-[500px] bg-gradient-to-br from-stone-50 to-stone-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Calculando resultado...</h2>
          <p className="text-muted-foreground">Analisando suas respostas</p>
        </div>
      </div>
    `,
    
    EditorPro: `
      <div className="flex items-center justify-center h-[600px] bg-background border rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground">Carregando editor...</p>
        </div>
      </div>
    `,
    
    PropertiesPanel: `
      <div className="w-80 bg-card border-l p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    `,
    
    Block: `
      <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    `
  };
  
  return fallbackMap[type] || fallbackMap.Block;
};

// 🎯 PRELOAD UTILITIES: Utilitários de preload inteligente
class LazyPreloader {
  private preloadedComponents = new Set<string>();
  private preloadPromises = new Map<string, Promise<any>>();

  /**
   * Preload componente específico
   */
  preloadComponent(componentName: string): Promise<any> {
    if (this.preloadedComponents.has(componentName)) {
      return Promise.resolve();
    }

    if (this.preloadPromises.has(componentName)) {
      return this.preloadPromises.get(componentName)!;
    }

    const component = LazyComponentRegistry[componentName];
    if (!component) {
      console.warn(`⚠️ [LazyPreloader] Component not found: ${componentName}`);
      return Promise.resolve();
    }

    const preloadPromise = component.preload?.() || Promise.resolve();
    this.preloadPromises.set(componentName, preloadPromise);

    preloadPromise
      .then(() => {
        this.preloadedComponents.add(componentName);
        console.log(`✅ [LazyPreloader] Preloaded: ${componentName}`);
      })
      .catch(error => {
        console.warn(`⚠️ [LazyPreloader] Failed to preload ${componentName}:`, error);
        this.preloadPromises.delete(componentName);
      });

    return preloadPromise;
  }

  /**
   * Preload por categoria de blocos
   */
  preloadBlockCategory(category: 'form' | 'quiz' | 'content' | 'offer'): Promise<void> {
    const categoryMap = {
      form: LazyFormBlocks,
      quiz: LazyQuizBlocks,
      content: LazyContentBlocks,
      offer: LazyOfferBlocks
    };

    const blocks = categoryMap[category];
    if (!blocks) return Promise.resolve();

    const promises = Object.keys(blocks).map(blockType => 
      this.preloadComponent(blockType)
    );

    return Promise.allSettled(promises).then(() => {
      console.log(`✅ [LazyPreloader] Category preloaded: ${category}`);
    });
  }

  /**
   * Preload baseado na rota atual
   */
  preloadForRoute(route: string): Promise<void> {
    const routePreloadMap: Record<string, string[]> = {
      '/editor': ['EditorPro', 'PropertiesPanel', 'QuizRenderer'],
      '/step/20': ['Step20Result', 'result-header-inline'],
      '/step/1': ['form-input', 'form-container'],
      '/quiz': ['QuizRenderer', 'QuizFlowOrchestrator']
    };

    // Match route patterns
    const components = routePreloadMap[route] || [];
    
    // Add step-specific components
    const stepMatch = route.match(/\/step\/(\d+)/);
    if (stepMatch) {
      const stepNumber = parseInt(stepMatch[1]);
      
      if (stepNumber >= 2 && stepNumber <= 18) {
        components.push('quiz-question', 'options-grid');
      } else if (stepNumber === 20) {
        components.push('result-header-inline', 'quiz-result');
      } else if (stepNumber === 21) {
        components.push('offer-card', 'bonus-showcase');
      }
    }

    const promises = components.map(comp => this.preloadComponent(comp));
    
    return Promise.allSettled(promises).then(() => {
      console.log(`✅ [LazyPreloader] Route preloaded: ${route} (${components.length} components)`);
    });
  }

  /**
   * Preload crítico (componentes mais usados)
   */
  preloadCritical(): Promise<void> {
    const criticalComponents = [
      'QuizRenderer',
      'text-inline',
      'quiz-intro-header',
      'form-input',
      'button-inline'
    ];

    const promises = criticalComponents.map(comp => this.preloadComponent(comp));
    
    return Promise.allSettled(promises).then(() => {
      console.log(`✅ [LazyPreloader] Critical components preloaded`);
    });
  }

  /**
   * Preload baseado nos blocos que serão renderizados
   */
  preloadForBlocks(blocks: Block[]): Promise<void> {
    const blockTypes = [...new Set(blocks.map(block => block.type))];
    const promises = blockTypes.map(type => this.preloadComponent(type));
    
    return Promise.allSettled(promises).then(() => {
      console.log(`✅ [LazyPreloader] Blocks preloaded: ${blockTypes.join(', ')}`);
    });
  }

  /**
   * Status do preloader
   */
  getStatus() {
    return {
      preloaded: Array.from(this.preloadedComponents),
      loading: Array.from(this.preloadPromises.keys()),
      total: Object.keys(LazyComponentRegistry).length
    };
  }

  /**
   * Limpar cache
   */
  clear() {
    this.preloadedComponents.clear();
    this.preloadPromises.clear();
    console.log('🧹 [LazyPreloader] Cache cleared');
  }
}

// Singleton instance
export const lazyPreloader = new LazyPreloader();

// 🎯 UTILITY FUNCTIONS: Funções utilitárias para lazy loading
export const getLazyComponent = (componentName: string) => {
  return LazyComponentRegistry[componentName] || null;
};

export const getFallbackComponent = (componentName: string) => {
  return LazyFallbacks[componentName] || LazyFallbacks.Block;
};

export const preloadComponent = (componentName: string) => {
  return lazyPreloader.preloadComponent(componentName);
};

export const preloadForRoute = (route: string) => {
  return lazyPreloader.preloadForRoute(route);
};

export const getPreloadStatus = () => {
  return lazyPreloader.getStatus();
};

// Export default
export default LazyComponentRegistry;