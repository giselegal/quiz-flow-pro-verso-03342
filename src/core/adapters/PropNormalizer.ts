/**
 * 🔄 PROP NORMALIZER - FASE 1: Normalização Universal de Props
 * 
 * Converte propriedades "flat" (block.properties) em estruturas SectionProps
 * Garante compatibilidade entre:
 * - Blocos antigos (content estruturado)
 * - Blocos novos (properties flat)
 */

import type { BaseSectionProps, SectionStyle, SectionAnimation } from '@/types/section-types';

export interface Block {
  id: string;
  type: string;
  properties?: Record<string, any>;
  content?: Record<string, any>;
  style?: Record<string, any>;
  animation?: Record<string, any>;
}

/**
 * Extrai style de propriedades flat
 */
export function extractStyleFromFlat(props: Record<string, any>): SectionStyle {
  return {
    backgroundColor: props.backgroundColor || props.bgColor,
    textColor: props.textColor || props.color,
    padding: props.padding,
    margin: props.margin,
    borderRadius: props.borderRadius,
    boxShadow: props.boxShadow || props.shadow,
  };
}

/**
 * Extrai animation de propriedades flat
 */
export function extractAnimationFromFlat(props: Record<string, any>): SectionAnimation {
  return {
    type: props.animationType || props.animation || 'fade',
    duration: props.animationDuration || props.duration || 300,
    delay: props.animationDelay || props.delay || 0,
    easing: props.animationEasing || props.easing || 'ease',
  };
}

/**
 * Normaliza Block para SectionProps compatível
 * 
 * Estratégia de merge (prioridade decrescente):
 * 1. block.content (se existir) - modo legado estruturado
 * 2. block.properties (se existir) - modo modular novo
 * 3. defaults - fallback seguro
 */
export function normalizeSectionProps(block: Block): BaseSectionProps {
  const properties = block.properties || {};
  const contentFromBlock = block.content || {};
  
  // Merge com prioridade: content > properties
  // Isso garante backward compatibility com blocos antigos
  const mergedContent: Record<string, any> = {
    ...properties,
    ...contentFromBlock,
  };

  // Extrair style (prioriza block.style > properties.style > fields flat)
  const style: SectionStyle = block.style
    ? { ...extractStyleFromFlat(properties), ...block.style }
    : extractStyleFromFlat(properties);

  // Extrair animation (prioriza block.animation > properties.animation > fields flat)
  const animation: SectionAnimation = block.animation
    ? { ...extractAnimationFromFlat(properties), ...block.animation }
    : extractAnimationFromFlat(properties);

  return {
    id: block.id,
    type: block.type,
    content: mergedContent,
    style,
    animation,
  };
}

/**
 * Normaliza props específicos para QuestionHeroSection
 */
export function normalizeQuestionHeroProps(block: Block) {
  const normalized = normalizeSectionProps(block);
  const p = normalized.content;
  
  return {
    ...normalized,
    content: {
      questionNumber: p.questionNumber ?? '',
      questionText: p.questionText ?? p.text ?? 'Pergunta',
      currentQuestion: p.currentQuestion ?? 1,
      totalQuestions: p.totalQuestions ?? 1,
      progressValue: p.progressValue ?? 0,
      showProgress: p.showProgress ?? true,
      logoUrl: p.logoUrl,
      logoAlt: p.logoAlt ?? 'Logo',
    },
  };
}

/**
 * Normaliza props específicos para TransitionHeroSection
 */
export function normalizeTransitionHeroProps(block: Block) {
  const normalized = normalizeSectionProps(block);
  const p = normalized.content;
  
  return {
    ...normalized,
    content: {
      title: p.title ?? p.text ?? 'Carregando...',
      subtitle: p.subtitle,
      message: p.message ?? 'Preparando a próxima etapa...',
      autoAdvanceDelay: p.autoAdvanceDelay ?? 3000,
    },
  };
}

/**
 * Normaliza props específicos para OfferHeroSection
 */
export function normalizeOfferHeroProps(block: Block) {
  const normalized = normalizeSectionProps(block);
  const p = normalized.content;
  
  return {
    ...normalized,
    content: {
      title: p.title ?? 'Oferta Especial',
      subtitle: p.subtitle,
      imageUrl: p.imageUrl,
      imageAlt: p.imageAlt ?? 'Oferta',
      description: p.description,
      urgencyMessage: p.urgencyMessage,
    },
  };
}

/**
 * Normaliza props específicos para PricingSection
 */
export function normalizePricingProps(block: Block) {
  const normalized = normalizeSectionProps(block);
  const p = normalized.content;
  
  return {
    ...normalized,
    content: {
      pricing: {
        originalPrice: p.originalPrice ?? p.pricing?.originalPrice ?? 0,
        salePrice: p.salePrice ?? p.pricing?.salePrice ?? 0,
        installments: p.installments ?? p.pricing?.installments,
        currency: p.currency ?? p.pricing?.currency ?? 'R$',
      },
      title: p.title ?? 'Oferta Especial',
      subtitle: p.subtitle,
      ctaText: p.ctaText ?? 'Quero Aproveitar Esta Oferta!',
      ctaUrl: p.ctaUrl,
      features: p.features ?? [],
    },
  };
}

/**
 * Mapeamento de normalizadores por tipo de bloco
 */
export const NORMALIZERS: Record<string, (block: Block) => BaseSectionProps> = {
  'question-hero': normalizeQuestionHeroProps,
  'transition-hero': normalizeTransitionHeroProps,
  'offer-hero': normalizeOfferHeroProps,
  'pricing': normalizePricingProps,
  // Adicionar mais normalizadores conforme necessário
};

/**
 * Normaliza block automaticamente baseado no tipo
 */
export function normalizeBlockProps(block: Block): BaseSectionProps {
  const normalizer = NORMALIZERS[block.type];
  return normalizer ? normalizer(block) : normalizeSectionProps(block);
}
