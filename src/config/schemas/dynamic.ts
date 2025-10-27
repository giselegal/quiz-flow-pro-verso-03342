/**
 * 🔄 DYNAMIC SCHEMA REGISTRY
 * 
 * Sistema de registro de schemas com lazy loading para otimização de bundle.
 * Schemas são carregados sob demanda apenas quando necessários.
 */

import { BlockSchema, SchemaRegistry } from './base/types';

/**
 * Registry global de schemas com lazy loading
 */
const schemaRegistry: SchemaRegistry = new Map();

/**
 * Cache de schemas já carregados
 */
const schemaCache = new Map<string, BlockSchema>();

/**
 * Registra um schema com lazy loading
 */
export function registerSchema(type: string, loader: () => Promise<BlockSchema>): void {
  schemaRegistry.set(type, loader);
}

/**
 * Obtém um schema (carrega sob demanda se necessário)
 */
export async function getSchema(type: string): Promise<BlockSchema | null> {
  // Verifica cache primeiro
  if (schemaCache.has(type)) {
    return schemaCache.get(type)!;
  }

  // Carrega sob demanda
  const loader = schemaRegistry.get(type);
  if (!loader) {
    console.warn(`[SchemaRegistry] Schema não encontrado: ${type}`);
    return null;
  }

  try {
    const schema = await loader();
    schemaCache.set(type, schema);
    return schema;
  } catch (error) {
    console.error(`[SchemaRegistry] Erro ao carregar schema ${type}:`, error);
    return null;
  }
}

/**
 * Obtém schema de forma síncrona (apenas do cache)
 */
export function getSchemaSync(type: string): BlockSchema | null {
  return schemaCache.get(type) || null;
}

/**
 * Pré-carrega múltiplos schemas
 */
export async function preloadSchemas(...types: string[]): Promise<void> {
  await Promise.all(types.map(type => getSchema(type)));
}

/**
 * Verifica se um schema está registrado
 */
export function hasSchema(type: string): boolean {
  return schemaRegistry.has(type);
}

/**
 * Lista todos os tipos de schema registrados
 */
export function listSchemaTypes(): string[] {
  return Array.from(schemaRegistry.keys());
}

/**
 * Limpa o cache de schemas (útil para testes)
 */
export function clearSchemaCache(): void {
  schemaCache.clear();
}

/**
 * Obtém estatísticas do registry
 */
export function getRegistryStats() {
  return {
    registered: schemaRegistry.size,
    cached: schemaCache.size,
    types: listSchemaTypes(),
  };
}

// ============================================================================
// REGISTRO DE SCHEMAS COM LAZY LOADING
// ============================================================================

/**
 * Registra todos os schemas do sistema
 * Cada schema é registrado com uma função de importação dinâmica
 */
export function initializeSchemaRegistry(): void {
  // Blocos básicos
  registerSchema('headline', () => 
    import('./blocks/headline').then(m => m.headlineSchema),
  );
  
  registerSchema('image', () => 
    import('./blocks/image').then(m => m.imageSchema),
  );
  
  registerSchema('button', () => 
    import('./blocks/button').then(m => m.buttonSchema),
  );
  
  registerSchema('options-grid', () => 
    import('./blocks/options-grid').then(m => m.optionsGridSchema),
  );
  registerSchema('text-inline', () => 
    import('./blocks/text-inline').then(m => m.textInlineSchema),
  );
  
  registerSchema('urgency-timer-inline', () => 
    import('./blocks/urgency-timer-inline').then(m => m.urgencyTimerInlineSchema),
  );

  // NEW: Intro blocks (já existentes em outro módulo, manter quando forem criados)
  registerSchema('intro-logo', () => import('./blocks/intro-blocks').then(m => m.introLogoSchema));
  registerSchema('intro-title', () => import('./blocks/intro-blocks').then(m => m.introTitleSchema));
  registerSchema('intro-image', () => import('./blocks/intro-blocks').then(m => m.introImageSchema));
  registerSchema('intro-description', () => import('./blocks/intro-blocks').then(m => m.introDescriptionSchema));
  registerSchema('intro-form', () => import('./blocks/intro-blocks').then(m => m.introFormSchema));
  registerSchema('intro-hero', () => import('./blocks/intro-blocks').then(m => m.introHeroSchema));

  // NEW: Question blocks
  registerSchema('question-hero', () => 
    import('./blocks/question-blocks').then(m => m.questionHeroSchema),
  );
  registerSchema('question-title', () => 
    import('./blocks/question-blocks').then(m => m.questionTitleSchema),
  );
  registerSchema('question-text', () => 
    import('./blocks/question-blocks').then(m => m.questionTextSchema),
  );
  registerSchema('question-number', () => 
    import('./blocks/question-blocks').then(m => m.questionNumberSchema),
  );
  registerSchema('question-progress', () => 
    import('./blocks/question-blocks').then(m => m.questionProgressSchema),
  );
  registerSchema('question-instructions', () => 
    import('./blocks/question-blocks').then(m => m.questionInstructionsSchema),
  );

  // NEW: Transition blocks
  registerSchema('transition-subtitle', () => 
    import('./blocks/transition-blocks').then(m => m.transitionSubtitleSchema),
  );
  registerSchema('transition-image', () => 
    import('./blocks/transition-blocks').then(m => m.transitionImageSchema),
  );
  registerSchema('transition-description', () => 
    import('./blocks/transition-blocks').then(m => m.transitionDescriptionSchema),
  );
  registerSchema('transition-hero', () => 
    import('./blocks/transition-blocks').then(m => m.transitionHeroSchema),
  );

  // NEW: Offer blocks
  registerSchema('offer-hero', () => 
    import('./blocks/offer-blocks').then(m => m.offerHeroSchema),
  );
  registerSchema('bonus', () => 
    import('./blocks/offer-blocks').then(m => m.bonusSchema),
  );
  registerSchema('benefits', () => 
    import('./blocks/offer-blocks').then(m => m.benefitsSchema),
  );
  registerSchema('guarantee', () => 
    import('./blocks/offer-blocks').then(m => m.guaranteeSchema),
  );

  // NEW: Step 20 blocks
  registerSchema('step20-result-header', () => 
    import('./blocks/step20-blocks').then(m => m.step20ResultHeaderSchema),
  );
  registerSchema('step20-style-reveal', () => 
    import('./blocks/step20-blocks').then(m => m.step20StyleRevealSchema),
  );

  // Aliases úteis para compatibilidade
  registerSchema('input-field', () => import('./blocks/form-and-navigation').then(m => m.formInputSchema));
  registerSchema('form-input', () => import('./blocks/form-and-navigation').then(m => m.formInputSchema));
  registerSchema('quiz-navigation', () => import('./blocks/form-and-navigation').then(m => m.quizNavigationSchema));
  registerSchema('navigation', () => import('./blocks/form-and-navigation').then(m => m.quizNavigationSchema));
  registerSchema('question-navigation', () => import('./blocks/form-and-navigation').then(m => m.questionNavigationSchema));
  registerSchema('image-display-inline', () => import('./blocks/image').then(m => m.imageSchema));
  registerSchema('image-inline', () => import('./blocks/image').then(m => m.imageSchema));
  registerSchema('button-inline', () => import('./blocks/button').then(m => m.buttonSchema));
  registerSchema('CTAButton', () => import('./blocks/button').then(m => m.buttonSchema));
  registerSchema('quiz-options', () => import('./blocks/options-grid').then(m => m.optionsGridSchema));
  // Header compacto do quiz (logo + barra)
  registerSchema('quiz-intro-header', () => import('./blocks/intro-blocks').then(m => m.quizIntroHeaderSchema));
  registerSchema('intro-logo-header', () => import('./blocks/intro-logo-header').then(m => m.introLogoHeaderSchema));
  // Footer simples
  registerSchema('footer-copyright', () => import('./blocks/intro-blocks').then(m => m.footerCopyrightSchema));
  // Pricing section
  registerSchema('pricing', () => import('./blocks/offer-blocks').then(m => m.pricingSchema));
  registerSchema('quiz-offer-hero', () => import('./blocks/offer-blocks').then(m => m.offerHeroSchema));
  registerSchema('offer.urgency', () => import('./blocks/urgency-timer-inline').then(m => m.urgencyTimerInlineSchema));
  registerSchema('offer.core', () => import('./blocks/button').then(m => m.buttonSchema));
  registerSchema('conversion', () => import('./blocks/button').then(m => m.buttonSchema));

  // JSON v3 Section types (registrados com schemas mínimos)
  registerSchema('HeroSection', () => import('./blocks/sections-v3').then(m => m.heroSectionSchema));
  registerSchema('StyleProfileSection', () => import('./blocks/sections-v3').then(m => m.styleProfileSectionSchema));
  registerSchema('ResultCalculationSection', () => import('./blocks/sections-v3').then(m => m.resultCalculationSectionSchema));
  registerSchema('MethodStepsSection', () => import('./blocks/sections-v3').then(m => m.methodStepsSectionSchema));
  registerSchema('BonusSection', () => import('./blocks/sections-v3').then(m => m.bonusSectionSchema));
  registerSchema('SocialProofSection', () => import('./blocks/sections-v3').then(m => m.socialProofSectionSchema));
  registerSchema('OfferSection', () => import('./blocks/sections-v3').then(m => m.offerSectionSchema));
  registerSchema('GuaranteeSection', () => import('./blocks/sections-v3').then(m => m.guaranteeSectionSchema));
  registerSchema('TransformationSection', () => import('./blocks/sections-v3').then(m => m.transformationSectionSchema));

  // NEW: Integration schemas
  registerSchema('tracking-config', () => import('./blocks/integrations').then(m => m.trackingConfigSchema));
  registerSchema('webhook-config', () => import('./blocks/integrations').then(m => m.webhookConfigSchema));
  registerSchema('utm-defaults', () => import('./blocks/integrations').then(m => m.utmDefaultsSchema));
  registerSchema('events-map', () => import('./blocks/events-map').then(m => m.eventsMapSchema));

  // NEW: Result configuration schemas
  registerSchema('result-categories-config', () => import('./blocks/step20-results-config').then(m => m.resultCategoriesConfigSchema));
  registerSchema('result-variables', () => import('./blocks/step20-results-config').then(m => m.resultVariablesSchema));
  registerSchema('result-messages', () => import('./blocks/step20-results-config').then(m => m.resultMessagesSchema));

  // NEW: Atomic result blocks (SchemaAPI unificado)
  registerSchema('result-header', () => import('./blocks/result-blocks').then(m => m.resultHeaderSchema));
  registerSchema('result-description', () => import('./blocks/result-blocks').then(m => m.resultDescriptionSchema));
  registerSchema('result-image', () => import('./blocks/result-blocks').then(m => m.resultImageSchema));
  registerSchema('result-cta', () => import('./blocks/result-blocks').then(m => m.resultCtaSchema));
  registerSchema('result-progress-bars', () => import('./blocks/result-blocks').then(m => m.resultProgressBarsSchema));
  registerSchema('result-main', () => import('./blocks/result-blocks').then(m => m.resultMainSchema));
  registerSchema('result-style', () => import('./blocks/result-blocks').then(m => m.resultStyleSchema));
  registerSchema('result-characteristics', () => import('./blocks/result-blocks').then(m => m.resultCharacteristicsSchema));
  registerSchema('result-secondary-styles', () => import('./blocks/result-blocks').then(m => m.resultSecondaryStylesSchema));
  registerSchema('result-cta-primary', () => import('./blocks/result-blocks').then(m => m.resultCtaPrimarySchema));
  registerSchema('result-cta-secondary', () => import('./blocks/result-blocks').then(m => m.resultCtaSecondarySchema));
  registerSchema('result-share', () => import('./blocks/result-blocks').then(m => m.resultShareSchema));

  // TODO: Adicionar mais schemas conforme criados
  // registerSchema('text', () => import('./blocks/text').then(m => m.textSchema));
  // registerSchema('divider', () => import('./blocks/divider').then(m => m.dividerSchema));
  // etc...
}

/**
 * Helper para uso direto em componentes
 */
export const SchemaAPI = {
  get: getSchema,
  getSync: getSchemaSync,
  preload: preloadSchemas,
  has: hasSchema,
  list: listSchemaTypes,
  stats: getRegistryStats,
  clearCache: clearSchemaCache,
};
