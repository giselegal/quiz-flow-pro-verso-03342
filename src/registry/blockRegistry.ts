/**
 * 🎯 BLOCK REGISTRY - Lazy Loading System
 * 
 * Registry centralizado para lazy loading de blocos com:
 * - Code splitting automático
 * - Preloading inteligente
 * - Error boundaries
 * - Performance tracking
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';
import type { Block } from '@/types/editor';
import { perfLogger } from '@/utils/performanceLogger';

export interface BlockRendererProps {
  block: Block;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: (blockId: string) => void;
  onOpenProperties?: (blockId: string) => void;
  contextData?: Record<string, any>;
}

type BlockComponent = ComponentType<BlockRendererProps>;
type LazyBlockComponent = LazyExoticComponent<BlockComponent>;

interface BlockRegistryEntry {
  component: LazyBlockComponent;
  preloaded: boolean;
  aliases: string[];
  category: 'intro' | 'question' | 'transition' | 'result' | 'offer' | 'generic';
}

/**
 * Registry de blocos com lazy loading
 */
class BlockRegistry {
  private registry = new Map<string, BlockRegistryEntry>();
  private loadingPromises = new Map<string, Promise<any>>();

  constructor() {
    this.initializeRegistry();
  }

  /**
   * Inicializar registry com lazy imports
   */
  private initializeRegistry() {
    // ===== INTRO BLOCKS =====
    this.register('intro-logo-header', {
      component: lazy(() => import('@/components/editor/blocks/atomic/IntroLogoHeaderBlock')),
      aliases: ['intro-hero', 'quiz-intro-header', 'hero-block', 'hero'],
      category: 'intro',
    });

    this.register('intro-form', {
      component: lazy(() => import('@/components/editor/blocks/atomic/IntroFormBlock')),
      aliases: ['welcome-form', 'welcome-form-block'],
      category: 'intro',
    });

    this.register('intro-title', {
      component: lazy(() => import('@/components/editor/blocks/atomic/IntroTitleBlock')),
      aliases: ['heading', 'title'],
      category: 'intro',
    });

    this.register('intro-logo', {
      component: lazy(() => import('@/components/editor/blocks/atomic/IntroLogoBlock')),
      aliases: [],
      category: 'intro',
    });

    this.register('intro-image', {
      component: lazy(() => import('@/components/editor/blocks/atomic/IntroImageBlock')),
      aliases: ['image-display-inline'],
      category: 'intro',
    });

    this.register('intro-description', {
      component: lazy(() => import('@/components/editor/blocks/atomic/IntroDescriptionBlock')),
      aliases: [],
      category: 'intro',
    });

    // ===== QUESTION BLOCKS =====
    this.register('question-progress', {
      component: lazy(() => import('@/components/editor/blocks/atomic/QuestionProgressBlock')),
      aliases: [],
      category: 'question',
    });

    this.register('question-number', {
      component: lazy(() => import('@/components/editor/blocks/atomic/QuestionNumberBlock')),
      aliases: [],
      category: 'question',
    });

    this.register('question-text', {
      component: lazy(() => import('@/components/editor/blocks/atomic/QuestionTextBlock')),
      aliases: ['question-title'],
      category: 'question',
    });

    this.register('question-instructions', {
      component: lazy(() => import('@/components/editor/blocks/atomic/QuestionInstructionsBlock')),
      aliases: [],
      category: 'question',
    });

    this.register('options-grid', {
      component: lazy(() => import('@/components/editor/blocks/atomic/OptionsGridBlock')),
      aliases: ['question-block', 'option-grid', 'options grid', 'quiz-options'],
      category: 'question',
    });

    this.register('question-navigation', {
      component: lazy(() => import('@/components/editor/blocks/atomic/QuestionNavigationBlock')),
      aliases: ['quiz-navigation', 'navigation'],
      category: 'question',
    });

    // ===== TRANSITION BLOCKS =====
    this.register('transition-hero', {
      component: lazy(() => import('@/components/editor/blocks/atomic/TransitionHeroBlock')),
      aliases: ['transition.next'],
      category: 'transition',
    });

    this.register('transition-title', {
      component: lazy(() => import('@/components/editor/blocks/atomic/TransitionTitleBlock')),
      aliases: [],
      category: 'transition',
    });

    this.register('transition-text', {
      component: lazy(() => import('@/components/editor/blocks/atomic/TransitionTextBlock')),
      aliases: [],
      category: 'transition',
    });

    // ===== RESULT BLOCKS =====
    this.register('result-main', {
      component: lazy(() => import('@/components/editor/blocks/atomic/ResultMainBlock')),
      aliases: ['result.headline', 'result-congrats'],
      category: 'result',
    });

    this.register('result-image', {
      component: lazy(() => import('@/components/editor/blocks/atomic/ResultImageBlock')),
      aliases: [],
      category: 'result',
    });

    this.register('result-description', {
      component: lazy(() => import('@/components/editor/blocks/atomic/ResultDescriptionBlock')),
      aliases: [],
      category: 'result',
    });

    this.register('result-secondary-styles', {
      component: lazy(() => import('@/components/editor/blocks/atomic/ResultSecondaryStylesBlock')),
      aliases: ['result.secondarylist', 'result-progress-bars'],
      category: 'result',
    });

    this.register('result-share', {
      component: lazy(() => import('@/components/editor/blocks/atomic/ResultShareBlock')),
      aliases: [],
      category: 'result',
    });

    this.register('result-cta', {
      component: lazy(() => import('@/components/editor/blocks/atomic/ResultCTABlock')),
      aliases: [],
      category: 'result',
    });

    // ===== COMMON BLOCKS =====
    this.register('text-inline', {
      component: lazy(() => import('@/components/editor/blocks/atomic/TextInlineBlock')),
      aliases: ['heading-inline'],
      category: 'generic',
    });

    this.register('image-inline', {
      component: lazy(() => import('@/components/editor/blocks/atomic/ImageInlineBlock')),
      aliases: ['image'],
      category: 'generic',
    });

    this.register('cta-button', {
      component: lazy(() => import('@/components/editor/blocks/atomic/CTAButtonBlock')),
      aliases: ['CTAButton', 'button-inline', 'button'],
      category: 'generic',
    });

    this.register('footer-copyright', {
      component: lazy(() => import('@/components/editor/blocks/atomic/FooterCopyrightBlock')),
      aliases: [],
      category: 'generic',
    });

    // ===== OFFER BLOCKS =====
    this.register('offer.core', {
      component: lazy(() => import('@/components/editor/blocks/CTAInlineBlock')),
      aliases: [],
      category: 'offer',
    });

    this.register('offer.urgency', {
      component: lazy(() => import('@/components/editor/blocks/UrgencyTimerInlineBlock')),
      aliases: [],
      category: 'offer',
    });

    this.register('offer.testimonial', {
      component: lazy(() => import('@/components/editor/blocks/TestimonialsBlock')),
      aliases: [],
      category: 'offer',
    });

    // ===== SCORE BLOCK =====
    this.register('quiz-score-display', {
      component: lazy(() => 
        import('@/components/quiz/blocks/QuizScoreDisplay').then(m => ({
          default: m.default as any // Type cast para compatibilidade
        }))
      ),
      aliases: ['quiz-score-header', 'score-display'],
      category: 'generic',
    });
  }

  /**
   * Registrar novo bloco
   */
  private register(type: string, entry: Omit<BlockRegistryEntry, 'preloaded'>) {
    this.registry.set(type, { ...entry, preloaded: false });

    // Registrar aliases
    entry.aliases.forEach(alias => {
      this.registry.set(alias, { ...entry, preloaded: false });
    });
  }

  /**
   * Obter componente por tipo (com normalização)
   */
  getComponent(type: string): LazyBlockComponent | null {
    const normalizedType = type.toLowerCase().trim();
    const entry = this.registry.get(normalizedType);
    return entry?.component || null;
  }

  /**
   * Preload componente
   */
  async preload(type: string): Promise<void> {
    const normalizedType = type.toLowerCase().trim();
    const entry = this.registry.get(normalizedType);
    
    if (!entry) {
      perfLogger.warn(`Block type "${type}" not found in registry`);
      return;
    }

    if (entry.preloaded) {
      return; // Já preloaded
    }

    // Evitar duplicação de load
    const key = normalizedType;
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    const startTime = performance.now();
    
    const loadPromise = (async () => {
      try {
        // @ts-ignore - Acessar _ctor para preload
        const preloadFn = entry.component._ctor;
        if (typeof preloadFn === 'function') {
          await preloadFn();
        }
        entry.preloaded = true;
        
        const duration = performance.now() - startTime;
        if (import.meta.env.DEV) {
          console.debug(`⚡ [BlockRegistry] Preloaded "${normalizedType}" in ${duration.toFixed(0)}ms`);
        }
      } catch (error) {
        console.error(`❌ [BlockRegistry] Failed to preload "${normalizedType}":`, error);
        throw error;
      }
    })();

    this.loadingPromises.set(key, loadPromise);
    
    try {
      await loadPromise;
    } finally {
      this.loadingPromises.delete(key);
    }
  }

  /**
   * Preload múltiplos componentes em paralelo
   */
  async preloadMultiple(types: string[]): Promise<void> {
    await Promise.all(types.map(type => this.preload(type)));
  }

  /**
   * Preload por categoria
   */
  async preloadCategory(category: BlockRegistryEntry['category']): Promise<void> {
    const types: string[] = [];
    
    for (const [type, entry] of this.registry.entries()) {
      if (entry.category === category && !entry.preloaded) {
        types.push(type);
      }
    }

    await this.preloadMultiple(types);
  }

  /**
   * Stats do registry
   */
  getStats() {
    const total = this.registry.size;
    const preloaded = Array.from(this.registry.values()).filter(e => e.preloaded).length;
    const byCategory = new Map<string, number>();

    for (const entry of this.registry.values()) {
      const count = byCategory.get(entry.category) || 0;
      byCategory.set(entry.category, count + 1);
    }

    return {
      total,
      preloaded,
      preloadedPercentage: total > 0 ? ((preloaded / total) * 100).toFixed(1) + '%' : '0%',
      byCategory: Object.fromEntries(byCategory),
    };
  }

  /**
   * Limpar cache de preload
   */
  clearPreloadCache() {
    for (const entry of this.registry.values()) {
      entry.preloaded = false;
    }
    this.loadingPromises.clear();
  }
}

// Singleton instance
export const blockRegistry = new BlockRegistry();

// Expor globalmente para debugging
if (typeof window !== 'undefined') {
  (window as any).__blockRegistry = blockRegistry;
}

export default blockRegistry;
