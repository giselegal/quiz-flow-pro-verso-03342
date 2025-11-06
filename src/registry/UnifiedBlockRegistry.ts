/**
 * 🎯 UNIFIED BLOCK REGISTRY - FASE 1.1 CONSOLIDADA
 * 
 * Registry único que consolida TODOS os sistemas fragmentados:
 * - EnhancedBlockRegistry (principal canônico)
 * - UnifiedComponentRegistry (tentativa prévia)
 * - BlockRegistry (runtime)
 * - HybridBlockRegistry (adapter)
 * - blockDefinitions (propriedades)
 * 
 * FEATURES:
 * ✅ Lazy loading com code splitting
 * ✅ Cache inteligente com TTL
 * ✅ Preload de componentes críticos
 * ✅ Fallbacks robustos
 * ✅ Type-safe com TypeScript
 * ✅ Performance monitoring
 * ✅ Backwards compatible
 */

import React, { lazy, type ComponentType, Suspense } from 'react';
import { appLogger } from '@/utils/logger';
import { isSimpleBlock, getTemplatePath } from '@/config/block-complexity-map';
import JSONTemplateRenderer from '@/core/renderers/JSONTemplateRenderer';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type BlockType = string;

export interface UnifiedBlockDefinition {
  id: string;
  component: React.ComponentType<any>;
  displayName: string;
  category: 'layout' | 'content' | 'interactive' | 'quiz' | 'result' | 'offer' | 'visual' | 'forms';
  schema?: Record<string, any>; // Property schema
  defaultProps: Record<string, any>;
  icon?: React.ComponentType;
  previewImage?: string;
  description?: string;
  isCritical?: boolean; // Se deve ser carregado imediatamente
}

interface CacheEntry {
  component: React.ComponentType<any>;
  timestamp: number;
  hits: number;
}

interface PerformanceMetrics {
  loads: number;
  avgLoadTime: number;
  errors: number;
  cacheHits: number;
}

// ============================================================================
// STATIC IMPORTS - COMPONENTES CRÍTICOS (Carregamento Imediato)
// ============================================================================
// 🎯 APENAS 10 BLOCOS MAIS CRÍTICOS - Carregamento imediato
// Todos os outros 100+ blocos usam lazy loading via lazyImports
// ============================================================================

// Blocos fundamentais essenciais (aparecem em 90%+ dos steps)
import TextInlineBlock from '@/components/editor/blocks/TextInlineBlock';
import ImageInlineBlock from '@/components/editor/blocks/ImageInlineBlock';
import ButtonInlineBlock from '@/components/editor/blocks/ButtonInlineBlock';

// Quiz core essencial (não funciona sem eles)
import OptionsGridBlock from '@/components/editor/blocks/OptionsGridBlock';
import FormInputBlock from '@/components/editor/blocks/FormInputBlock';

// TOTAL: 5 blocos críticos carregados estaticamente
// Os outros 105+ blocos (heading, intro, transitions, step20, ofertas, etc.) usam lazy loading

// ============================================================================
// LAZY IMPORTS - COMPONENTES NÃO-CRÍTICOS (Code Splitting)
// ============================================================================

const lazyImports: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  // 🔄 BLOCOS MOVIDOS DE STATIC → LAZY (20 blocos)
  // Heading (4 variantes)
  'heading': () => import('@/components/editor/blocks/HeadingInlineBlock'),
  'heading-inline': () => import('@/components/editor/blocks/HeadingInlineBlock'),
  'headline': () => import('@/components/editor/blocks/HeadingInlineBlock'),
  'headline-inline': () => import('@/components/editor/blocks/HeadingInlineBlock'),

  // 🆕 QUIZ SCORE/PONTUAÇÃO (Sistema de Scoring v2.0)
  'quiz-score-display': () => import('@/components/quiz/blocks/QuizScoreDisplay'),
  'quiz-score-header': () => import('@/components/quiz/blocks/QuizScoreDisplay'),
  'score-display': () => import('@/components/quiz/blocks/QuizScoreDisplay'),

  // Intro blocks - Step 1 (7 blocos)
  'intro-logo': () => import('@/components/editor/blocks/atomic/IntroLogoBlock'),
  'intro-logo-header': () => import('@/components/editor/blocks/atomic/IntroLogoHeaderBlock'),
  'intro-title': () => import('@/components/editor/blocks/atomic/IntroTitleBlock'),
  'intro-image': () => import('@/components/editor/blocks/atomic/IntroImageBlock'),
  'intro-description': () => import('@/components/editor/blocks/atomic/IntroDescriptionBlock'),
  'intro-form': () => import('@/components/editor/blocks/atomic/IntroFormBlock'),
  'quiz-intro': () => import('@/components/editor/blocks/QuizIntroHeaderBlock'), // Alias

  // Decorative/UI (3 blocos)
  'quiz-intro-header': () => import('@/components/editor/blocks/QuizIntroHeaderBlock'),
  'decorative-bar': () => import('@/components/editor/blocks/DecorativeBarInlineBlock'),
  'decorative-bar-inline': () => import('@/components/editor/blocks/DecorativeBarInlineBlock'),
  'legal-notice': () => import('@/components/editor/blocks/LegalNoticeInlineBlock'),
  'legal-notice-inline': () => import('@/components/editor/blocks/LegalNoticeInlineBlock'),

  // Transition blocks - Steps 12, 19 (6 blocos)
  'quiz-transition-loader': () => import('@/components/editor/blocks/QuizTransitionLoaderBlock'),
  'transition-title': () => import('@/components/editor/blocks/atomic/TransitionTitleBlock'),
  'transition-loader': () => import('@/components/editor/blocks/atomic/TransitionLoaderBlock'),
  'transition-text': () => import('@/components/editor/blocks/atomic/TransitionTextBlock'),
  'transition-progress': () => import('@/components/editor/blocks/atomic/TransitionProgressBlock'),
  'transition-message': () => import('@/components/editor/blocks/atomic/TransitionMessageBlock'),

  // Quiz Components
  'quiz-logo': () => import('@/components/editor/blocks/QuizLogoBlock'),
  'quiz-progress-bar': () => import('@/components/editor/blocks/QuizProgressBlock'),
  'quiz-back-button': () => import('@/components/editor/blocks/QuizBackButtonBlock'),
  'quiz-question-header': () => import('@/components/editor/blocks/QuizQuestionHeaderBlock'),
  'quiz-result-header': () => import('@/components/editor/blocks/QuizResultHeaderBlock'),
  'quiz-offer-hero': () => import('@/components/editor/blocks/QuizOfferHeroBlock'),
  'offer-hero': () => import('@/components/editor/blocks/OfferHeroBlock'),

  // Question Components (Steps 02-11)
  'question-progress': () => import('@/components/editor/blocks/atomic/QuestionProgressBlock'),
  'question-number': () => import('@/components/editor/blocks/atomic/QuestionNumberBlock'),
  'question-text': () => import('@/components/editor/blocks/atomic/QuestionTextBlock'),
  'question-title': () => import('@/components/editor/blocks/atomic/QuestionTextBlock'), // Alias
  'question-instructions': () => import('@/components/editor/blocks/atomic/QuestionInstructionsBlock'),
  'question-navigation': () => import('@/components/editor/blocks/atomic/QuestionNavigationBlock'),

  // Options & Interactive
  'options-grid': () => import('@/components/editor/blocks/atomic/OptionsGridBlock'),
  'quiz-options': () => import('@/components/editor/blocks/atomic/OptionsGridBlock'),
  'quiz-options-grid-connected': () => import('@/components/editor/blocks/atomic/OptionsGridBlock'),
  'form-input': () => import('@/components/editor/blocks/FormInputBlock'),

  // CTA Buttons
  'CTAButton': () => import('@/components/editor/blocks/atomic/CTAButtonBlock'),
  'cta-button': () => import('@/components/editor/blocks/atomic/CTAButtonBlock'),

  // Sections V3 - with universal PropNormalizer
  'question-hero': () => Promise.all([
    import('@/components/sections/questions'),
    import('@/core/adapters/PropNormalizer')
  ]).then(([{ QuestionHeroSection }, { normalizeQuestionHeroProps }]) => ({
    default: (props: any) => {
      const normalized = normalizeQuestionHeroProps(props?.block || props);
      return React.createElement(QuestionHeroSection, normalized);
    },
  })),
  'transition-hero': () => Promise.all([
    import('@/components/sections/transitions'),
    import('@/core/adapters/PropNormalizer')
  ]).then(([{ TransitionHeroSection }, { normalizeTransitionHeroProps }]) => ({
    default: (props: any) => {
      const normalized = normalizeTransitionHeroProps(props?.block || props);
      return React.createElement(TransitionHeroSection, normalized);
    },
  })),
  'pricing': () => Promise.all([
    import('@/components/sections/offer'),
    import('@/core/adapters/PropNormalizer')
  ]).then(([{ PricingSection }, { normalizePricingProps }]) => ({
    default: (props: any) => {
      const normalized = normalizePricingProps(props?.block || props);
      return React.createElement(PricingSection, normalized);
    },
  })),

  // Container Components
  'container': () => import('@/components/editor/blocks/BasicContainerBlock'),
  'section': () => import('@/components/editor/blocks/BasicContainerBlock'),
  'box': () => import('@/components/editor/blocks/BasicContainerBlock'),
  'form-container': () => import('@/components/editor/blocks/BasicContainerBlock'),

  // Transition Components (Step 12 & 19)
  'hero': () => import('@/components/editor/blocks/QuizTransitionBlock'),
  'quiz-transition': () => import('@/components/editor/blocks/QuizTransitionBlock'),
  'transition-subtitle': () => import('@/components/editor/blocks/TransitionSubtitleBlock'),
  'transition-image': () => import('@/components/editor/blocks/TransitionImageBlock'),
  'transition-description': () => import('@/components/editor/blocks/TransitionDescriptionBlock'),
  'loading-animation': () => import('@/components/editor/blocks/LoaderInlineBlock'),
  'loader-inline': () => import('@/components/editor/blocks/LoaderInlineBlock'),

  // Strategic Question Components (Steps 13-18)
  'strategic-question': () => import('@/components/editor/blocks/StrategicQuestionBlock'),
  'quiz-advanced-question': () => import('@/components/editor/blocks/TextInlineBlock'),
  'quiz-style-question': () => import('@/components/editor/blocks/StyleCardInlineBlock'),
  'style-card-inline': () => import('@/components/editor/blocks/StyleCardInlineBlock'),
  'style-cards-grid': () => import('@/components/editor/blocks/StyleCardsGridBlock'),

  // Processing Components (Step 19)
  'quiz-processing': () => import('@/components/editor/blocks/LoaderInlineBlock'),
  'progress-bar': () => import('@/components/editor/blocks/ProgressInlineBlock'),
  'progress-inline': () => import('@/components/editor/blocks/ProgressInlineBlock'),

  // Result Components (Step 20)
  'result-header-inline': () => import('@/components/editor/blocks/ResultHeaderInlineBlock'),
  'modular-result-header': () => import('@/components/editor/modules/ModularResultHeader'),
  'quiz-result-style': () => import('@/components/editor/blocks/StyleCardInlineBlock'),
  'secondary-styles': () => import('@/components/editor/blocks/SecondaryStylesInlineBlock'),
  'quiz-result-secondary': () => import('@/components/editor/blocks/StyleCardsGridBlock'),
  'result-card': () => import('@/components/editor/blocks/StyleCardInlineBlock'),
  'result-congrats': () => import('@/components/editor/blocks/ResultCongratsBlock'),
  'result-main': () => import('@/components/editor/blocks/atomic/ResultMainBlock'),
  'result-style': () => import('@/components/editor/blocks/atomic/ResultStyleBlock'),
  'result-image': () => import('@/components/editor/blocks/atomic/ResultImageBlock'),
  'result-description': () => import('@/components/editor/blocks/atomic/ResultDescriptionBlock'),
  'result-header': () => import('@/components/editor/blocks/atomic/ResultHeaderBlock'),
  'result-characteristics': () => import('@/components/editor/blocks/atomic/ResultCharacteristicsBlock'),
  'result-cta': () => import('@/components/editor/blocks/atomic/ResultCTABlock'),
  'result-cta-primary': () => import('@/components/editor/blocks/atomic/ResultCTAPrimaryBlock'),
  'result-cta-secondary': () => import('@/components/editor/blocks/atomic/ResultCTASecondaryBlock'),
  'result-progress-bars': () => import('@/components/editor/blocks/ResultProgressBarsBlock'),
  'result-secondary-styles': () => import('@/components/editor/blocks/atomic/ResultSecondaryStylesBlock'),
  'result-share': () => import('@/components/editor/blocks/atomic/ResultShareBlock'),

  // Step 20 Modular Blocks (MOVIDOS DE STATIC PARA LAZY)
  'step20-result-header': () => import('@/components/editor/blocks/Step20ModularBlocks').then(m => ({ default: m.Step20ResultHeaderBlock })),
  'step20-style-reveal': () => import('@/components/editor/blocks/Step20ModularBlocks').then(m => ({ default: m.Step20StyleRevealBlock })),
  'step20-user-greeting': () => import('@/components/editor/blocks/Step20ModularBlocks').then(m => ({ default: m.Step20UserGreetingBlock })),
  'step20-compatibility': () => import('@/components/editor/blocks/Step20ModularBlocks').then(m => ({ default: m.Step20CompatibilityBlock })),
  'step20-secondary-styles': () => import('@/components/editor/blocks/Step20ModularBlocks').then(m => ({ default: m.Step20SecondaryStylesBlock })),
  'step20-personalized-offer': () => import('@/components/editor/blocks/Step20ModularBlocks').then(m => ({ default: m.Step20PersonalizedOfferBlock })),
  'step20-complete-template': () => import('@/components/editor/blocks/Step20ModularBlocks').then(m => ({ default: m.Step20CompleteTemplateBlock })),

  // Sales & AI (MOVIDOS DE STATIC PARA LAZY)
  'sales-hero': () => import('@/components/editor/blocks/SalesHeroBlock'),
  'fashion-ai-generator': () => import('@/components/blocks/ai').then(m => ({ default: m.FashionAIGeneratorBlock })),

  // Atomic Blocks - Footer (MOVIDOS DE STATIC PARA LAZY)
  'footer-copyright': () => import('@/components/editor/blocks/atomic/FooterCopyrightBlock'),
  'image-display-inline': () => import('@/components/editor/blocks/inline/ImageDisplayInlineBlock'),

  // Offer Components (Step 21)
  'urgency-timer-inline': () => import('@/components/editor/blocks/UrgencyTimerInlineBlock'),
  'offer-pricing': () => import('@/components/editor/blocks/PricingInlineBlock'),
  'offer-pricing-table': () => import('@/components/editor/blocks/PricingInlineBlock'),
  'pricing-table': () => import('@/components/editor/blocks/PricingInlineBlock'),
  'before-after-inline': () => import('@/components/editor/blocks/BeforeAfterInlineBlock'),
  'bonus': () => import('@/components/editor/blocks/BonusBlock'),
  'bonus-inline': () => import('@/components/editor/blocks/BonusInlineBlock'),
  'secure-purchase': () => import('@/components/editor/blocks/SecurePurchaseBlock'),
  'value-anchoring': () => import('@/components/editor/blocks/ValueAnchoringBlock'),
  'mentor-section-inline': () => import('@/components/editor/blocks/MentorSectionInlineBlock'),

  // Testimonials
  'testimonial-card-inline': () => import('@/components/editor/blocks/TestimonialCardInlineBlock'),
  'testimonials-carousel-inline': () => import('@/components/editor/blocks/TestimonialsCarouselInlineBlock'),
  'testimonials': () => import('@/components/editor/blocks/TestimonialsBlock'),
  'testimonials-grid': () => import('@/components/editor/blocks/TestimonialsBlock'),

  // Universal Components
  'lead-form': () => import('@/components/editor/blocks/LeadFormBlock'),
  'connected-lead-form': () => import('@/components/editor/blocks/ConnectedLeadFormBlock'),
  'connected-template-wrapper': () => import('@/components/editor/blocks/ConnectedTemplateWrapperBlock'),
  'quiz-navigation': () => import('@/components/editor/blocks/QuizNavigationBlock'),
  'gradient-animation': () => import('@/components/editor/blocks/GradientAnimationBlock'),
  'benefits': () => import('@/components/editor/blocks/BenefitsListBlock'),
  'benefits-list': () => import('@/components/editor/blocks/BenefitsListBlock'),
  'guarantee': () => import('@/components/editor/blocks/GuaranteeBlock'),

  // Accessibility
  'accessibility-skip-link': () => import('@/components/editor/blocks/AccessibilitySkipLinkBlock'),
};

// ============================================================================
// UNIFIED BLOCK REGISTRY CLASS
// ============================================================================

export class UnifiedBlockRegistry {
  private static instance: UnifiedBlockRegistry;

  // Core registries
  private registry: Map<string, React.ComponentType<any>>;
  private lazyRegistry: Map<string, () => Promise<{ default: React.ComponentType<any> }>>;

  // Cache system
  private cache: Map<string, CacheEntry>;
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutos

  // Performance tracking
  private metrics: Map<string, PerformanceMetrics>;

  // Critical components (pre-loaded)
  private criticalComponents = new Set<string>();

  private constructor() {
    this.registry = new Map();
    this.lazyRegistry = new Map();
    this.cache = new Map();
    this.metrics = new Map();

    this.initializeCriticalComponents();
    this.initializeLazyComponents();

    appLogger.info('✅ UnifiedBlockRegistry initialized', {
      critical: this.criticalComponents.size,
      lazy: this.lazyRegistry.size,
      total: this.registry.size + this.lazyRegistry.size,
    });
  }

  static getInstance(): UnifiedBlockRegistry {
    if (!UnifiedBlockRegistry.instance) {
      UnifiedBlockRegistry.instance = new UnifiedBlockRegistry();
    }
    return UnifiedBlockRegistry.instance;
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  private initializeCriticalComponents(): void {
    // 🎯 APENAS 5 BLOCOS CRÍTICOS - Os outros 105+ usam lazy loading
    const criticalBlocks: Record<string, React.ComponentType<any>> = {
      // Basic Components (aparecem em 90%+ dos steps)
      'text': TextInlineBlock,
      'text-inline': TextInlineBlock,
      'button': ButtonInlineBlock,
      'button-inline': ButtonInlineBlock,
      'image': ImageInlineBlock,
      'image-inline': ImageInlineBlock,

      // Quiz Core (não funciona sem eles)
      'form-input': FormInputBlock,
      'options-grid': OptionsGridBlock,
      'quiz-options': OptionsGridBlock,
      'quiz-options-inline': OptionsGridBlock,

      // Aliases para compatibilidade
      'cta-inline': ButtonInlineBlock,
      'quiz-form': FormInputBlock,
      'quiz-button': ButtonInlineBlock,
      'quiz-text': TextInlineBlock,
      'quiz-image': ImageInlineBlock,
      'guarantee-badge': ImageInlineBlock,
    };

    Object.entries(criticalBlocks).forEach(([type, component]) => {
      this.registry.set(type, component);
      this.criticalComponents.add(type);

      // Pre-warm cache
      this.cache.set(type, {
        component,
        timestamp: Date.now(),
        hits: 0,
      });
    });
  }

  private initializeLazyComponents(): void {
    Object.entries(lazyImports).forEach(([type, loader]) => {
      this.lazyRegistry.set(type, loader);
    });
  }

  // ==========================================================================
  // CORE API
  // ==========================================================================

  /**
   * Get component (sync) - for backwards compatibility
   * 🎯 SISTEMA HÍBRIDO: Decide automaticamente entre JSON e TSX
   */
  getComponent(type: BlockType): React.ComponentType<any> | null {
    // 0. Check if it's a simple block (JSON-driven) 
    if (isSimpleBlock(type)) {
      appLogger.info(`[UnifiedBlockRegistry] Using JSON renderer for: ${type}`);
      return ((props: any) =>
        React.createElement(JSONTemplateRenderer, { type, ...props })
      ) as React.ComponentType<any>;
    }

    // 1. Check cache
    const cached = this.getCachedComponent(type);
    if (cached) {
      return cached;
    }

    // 2. Check critical registry
    if (this.registry.has(type)) {
      const component = this.registry.get(type)!;
      this.updateCache(type, component);
      return component;
    }

    // 3. Check lazy registry (return lazy component wrapper)
    if (this.lazyRegistry.has(type)) {
      appLogger.info(`[UnifiedBlockRegistry] 🔄 Loading lazy component: ${type}`);

      // Create a wrapper that logs when the component loads
      const loader = this.lazyRegistry.get(type)!;
      const wrappedLoader = async () => {
        try {
          const module = await loader();
          appLogger.info(`[UnifiedBlockRegistry] ✅ Lazy component loaded: ${type}`, module);

          // Ensure we have a default export
          if (!module || !module.default) {
            appLogger.error(`[UnifiedBlockRegistry] ❌ No default export for: ${type}`, module);
            throw new Error(`No default export for ${type}`);
          }

          return module;
        } catch (error) {
          appLogger.error(`[UnifiedBlockRegistry] ❌ Failed to load lazy component: ${type}`, error);
          throw error;
        }
      };

      const lazyComponent = lazy(wrappedLoader);
      this.updateCache(type, lazyComponent);
      return lazyComponent;
    }

    // 4. Fallback system
    const fallback = this.getFallbackComponent(type);
    if (fallback) {
      appLogger.warn(`[UnifiedBlockRegistry] Using fallback for "${type}"`);
      return fallback;
    }

    appLogger.error(`[UnifiedBlockRegistry] ❌ Component not found: "${type}"`);
    return null;
  }

  /**
   * Get component (async) - recommended for new code
   */
  async getComponentAsync(type: BlockType): Promise<React.ComponentType<any>> {
    const startTime = performance.now();

    try {
      // 1. Check cache
      const cached = this.getCachedComponent(type);
      if (cached) {
        this.recordMetric(type, performance.now() - startTime, false, true);
        return cached;
      }

      // 2. Check critical registry
      if (this.registry.has(type)) {
        const component = this.registry.get(type)!;
        this.updateCache(type, component);
        this.recordMetric(type, performance.now() - startTime, false, false);
        return component;
      }

      // 3. Load from lazy registry
      if (this.lazyRegistry.has(type)) {
        const loader = this.lazyRegistry.get(type)!;
        const module = await loader();
        const component = module.default;

        this.updateCache(type, component);
        this.recordMetric(type, performance.now() - startTime, false, false);

        return component;
      }

      // 4. Fallback
      const fallback = this.getFallbackComponent(type);
      if (fallback) {
        appLogger.warn(`[UnifiedBlockRegistry] Using fallback for "${type}"`);
        this.recordMetric(type, performance.now() - startTime, false, false);
        return fallback;
      }

      throw new Error(`Component not found: ${type}`);
    } catch (error) {
      this.recordMetric(type, performance.now() - startTime, true, false);
      appLogger.error(`[UnifiedBlockRegistry] Failed to load "${type}":`, error);

      // Return fallback on error
      return this.getFallbackComponent(type) || TextInlineBlock;
    }
  }

  /**
   * Check if component exists
   */
  has(type: BlockType): boolean {
    return this.registry.has(type) || this.lazyRegistry.has(type);
  }

  /**
   * Preload component (non-blocking)
   */
  async prefetch(type: BlockType): Promise<void> {
    if (this.registry.has(type)) {
      return; // Already loaded
    }

    if (this.lazyRegistry.has(type)) {
      try {
        await this.getComponentAsync(type);
        appLogger.debug(`[UnifiedBlockRegistry] Prefetched: ${type}`);
      } catch (error) {
        appLogger.warn(`[UnifiedBlockRegistry] Prefetch failed for ${type}:`, error);
      }
    }
  }

  /**
   * Preload multiple components
   */
  async prefetchBatch(types: BlockType[]): Promise<void> {
    await Promise.allSettled(types.map(type => this.prefetch(type)));
  }

  /**
   * Register new component (runtime registration)
   */
  register(type: BlockType, component: React.ComponentType<any>, isCritical = false): void {
    this.registry.set(type, component);
    if (isCritical) {
      this.criticalComponents.add(type);
    }
    this.updateCache(type, component);
    appLogger.info(`[UnifiedBlockRegistry] Registered: ${type}`);
  }

  /**
   * ✅ FASE 3.1: Register critical component (immediate loading)
   * Blocos críticos são carregados imediatamente e não usam code splitting
   */
  registerCritical(definition: {
    id: string;
    component: React.ComponentType<any>;
    displayName?: string;
    category?: string;
  }): void {
    this.registry.set(definition.id, definition.component);
    this.criticalComponents.add(definition.id);
    this.updateCache(definition.id, definition.component);

    appLogger.info(`[UnifiedBlockRegistry] ✅ Registered CRITICAL: ${definition.id}`, {
      displayName: definition.displayName,
      category: definition.category,
    });
  }

  /**
   * ✅ FASE 3.1: Get React.lazy() component for lazy blocks
   * Retorna um componente lazy apenas se não for crítico
   */
  getLazyComponent(type: BlockType): React.ComponentType<any> | null {
    // Se é crítico, não retornar lazy
    if (this.criticalComponents.has(type) || this.registry.has(type)) {
      return null;
    }

    // Se tem loader lazy, criar React.lazy()
    const loader = this.lazyRegistry.get(type);
    if (loader) {
      return lazy(() => loader());
    }

    return null;
  }

  /**
   * ✅ FASE 3.1: Check if component is critical
   */
  isCritical(type: BlockType): boolean {
    return this.criticalComponents.has(type);
  }

  /**
   * Register lazy component
   */
  registerLazy(
    type: BlockType,
    loader: () => Promise<{ default: React.ComponentType<any> }>,
  ): void {
    this.lazyRegistry.set(type, loader);
    appLogger.info(`[UnifiedBlockRegistry] Registered lazy: ${type}`);
  }

  /**
   * Get all available types
   */
  getAllTypes(): string[] {
    const critical = Array.from(this.registry.keys());
    const lazy = Array.from(this.lazyRegistry.keys());
    return [...new Set([...critical, ...lazy])].sort();
  }

  /**
   * Get critical types
   */
  getCriticalTypes(): string[] {
    return Array.from(this.criticalComponents);
  }

  // ==========================================================================
  // CACHE MANAGEMENT
  // ==========================================================================

  private getCachedComponent(type: BlockType): React.ComponentType<any> | null {
    const entry = this.cache.get(type);
    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.timestamp > this.CACHE_TTL) {
      this.cache.delete(type);
      return null;
    }

    entry.hits++;
    return entry.component;
  }

  private updateCache(type: BlockType, component: React.ComponentType<any>): void {
    this.cache.set(type, {
      component,
      timestamp: Date.now(),
      hits: 0,
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    appLogger.info('[UnifiedBlockRegistry] Cache cleared');
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    let cleared = 0;

    this.cache.forEach((entry, type) => {
      if (now - entry.timestamp > this.CACHE_TTL) {
        this.cache.delete(type);
        cleared++;
      }
    });

    if (cleared > 0) {
      appLogger.info(`[UnifiedBlockRegistry] Cleared ${cleared} expired cache entries`);
    }
  }

  // ==========================================================================
  // FALLBACK SYSTEM
  // ==========================================================================

  private getFallbackComponent(type: BlockType): React.ComponentType<any> | null {
    // Fallback by prefix
    const prefix = type.split('-')[0];
    const suffixFallback = `${prefix}-*`;

    if (this.registry.has(suffixFallback)) {
      return this.registry.get(suffixFallback)!;
    }

    // Fallback by pattern matching
    if (type.includes('text') || type.includes('paragraph') || type.includes('heading')) {
      return TextInlineBlock;
    }
    if (type.includes('button') || type.includes('cta')) {
      return ButtonInlineBlock;
    }
    if (type.includes('image') || type.includes('img') || type.includes('photo')) {
      return ImageInlineBlock;
    }
    if (type.includes('form') || type.includes('input')) {
      return FormInputBlock;
    }
    if (type.includes('quiz')) {
      return TextInlineBlock;
    }

    // Final fallback
    return TextInlineBlock;
  }

  // ==========================================================================
  // PERFORMANCE METRICS
  // ==========================================================================

  private recordMetric(
    type: BlockType,
    loadTime: number,
    isError: boolean,
    isCacheHit: boolean,
  ): void {
    const existing = this.metrics.get(type) || {
      loads: 0,
      avgLoadTime: 0,
      errors: 0,
      cacheHits: 0,
    };

    existing.loads += 1;
    existing.avgLoadTime = (existing.avgLoadTime * (existing.loads - 1) + loadTime) / existing.loads;

    if (isError) {
      existing.errors += 1;
    }

    if (isCacheHit) {
      existing.cacheHits += 1;
    }

    this.metrics.set(type, existing);
  }

  /**
   * Get performance statistics
   */
  getStats() {
    const totalTypes = this.registry.size + this.lazyRegistry.size;
    const cachedCount = this.cache.size;
    const criticalCount = this.criticalComponents.size;

    // Calculate aggregate metrics
    let totalLoads = 0;
    let totalErrors = 0;
    let totalCacheHits = 0;

    this.metrics.forEach(metric => {
      totalLoads += metric.loads;
      totalErrors += metric.errors;
      totalCacheHits += metric.cacheHits;
    });

    const cacheHitRate = totalLoads > 0 ? (totalCacheHits / totalLoads) * 100 : 0;
    const errorRate = totalLoads > 0 ? (totalErrors / totalLoads) * 100 : 0;

    return {
      registry: {
        totalTypes,
        criticalTypes: criticalCount,
        lazyTypes: this.lazyRegistry.size,
        cachedTypes: cachedCount,
      },
      performance: {
        totalLoads,
        totalErrors,
        errorRate: Math.round(errorRate * 100) / 100,
        cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      },
      topComponents: this.getTopComponents(10),
    };
  }

  private getTopComponents(limit: number) {
    return Array.from(this.metrics.entries())
      .sort((a, b) => b[1].loads - a[1].loads)
      .slice(0, limit)
      .map(([type, metric]) => ({
        type,
        loads: metric.loads,
        avgLoadTime: Math.round(metric.avgLoadTime * 100) / 100,
        errors: metric.errors,
        cacheHits: metric.cacheHits,
      }));
  }

  /**
   * Print debug information
   */
  debug(): void {
    const stats = this.getStats();

    console.group('🎯 UnifiedBlockRegistry Stats');
    console.table({
      'Total Types': stats.registry.totalTypes,
      'Critical Types': stats.registry.criticalTypes,
      'Lazy Types': stats.registry.lazyTypes,
      'Cached Types': stats.registry.cachedTypes,
      'Total Loads': stats.performance.totalLoads,
      'Cache Hit Rate': `${stats.performance.cacheHitRate}%`,
      'Error Rate': `${stats.performance.errorRate}%`,
    });

    if (stats.topComponents.length > 0) {
      console.group('Top 10 Components');
      console.table(stats.topComponents);
      console.groupEnd();
    }

    console.groupEnd();
  }
}

// ============================================================================
// SINGLETON INSTANCE & EXPORTS
// ============================================================================

export const blockRegistry = UnifiedBlockRegistry.getInstance();

// Convenience functions
export const getBlockComponent = (type: BlockType) => blockRegistry.getComponent(type);
export const getBlockComponentAsync = (type: BlockType) => blockRegistry.getComponentAsync(type);
export const hasBlockComponent = (type: BlockType) => blockRegistry.has(type);
export const prefetchBlock = (type: BlockType) => blockRegistry.prefetch(type);
export const prefetchBlocks = (types: BlockType[]) => blockRegistry.prefetchBatch(types);
export const registerBlock = (type: BlockType, component: React.ComponentType<any>, isCritical = false) =>
  blockRegistry.register(type, component, isCritical);
export const registerLazyBlock = (type: BlockType, loader: () => Promise<{ default: React.ComponentType<any> }>) =>
  blockRegistry.registerLazy(type, loader);

// Stats & debugging
export const getRegistryStats = () => blockRegistry.getStats();
export const debugRegistry = () => blockRegistry.debug();
export const clearBlockCache = () => blockRegistry.clearCache();

export default blockRegistry;
