import React from 'react';

// Imports básicos primeiro
import ButtonInlineFixed from '../components/blocks/inline/ButtonInlineFixed';
import HeadingInline from '../components/blocks/inline/HeadingInline';
import TextInline from '../components/blocks/inline/TextInline';

// Imports das etapas 20-21 (Result e Offer)
import CountdownInlineBlock from '../components/blocks/inline/CountdownInlineBlock';
import QuizOfferPricingInlineBlock from '../components/blocks/inline/QuizOfferPricingInlineBlock';
import QuizOfferCTAInlineBlock from '../components/blocks/inline/QuizOfferCTAInlineBlock';
import ResultCardInlineBlock from '../components/blocks/inline/ResultCardInlineBlock';
import TestimonialsInlineBlock from '../components/blocks/inline/TestimonialsInlineBlock';

// Imports dos novos componentes da Etapa 21 (Offer)
import OfferHeaderInlineBlock from '../components/blocks/inline/OfferHeaderInlineBlock';
import OfferHeroSectionInlineBlock from '../components/blocks/inline/OfferHeroSectionInlineBlock';
import OfferProblemSectionInlineBlock from '../components/blocks/inline/OfferProblemSectionInlineBlock';
import OfferSolutionSectionInlineBlock from '../components/blocks/inline/OfferSolutionSectionInlineBlock';
import OfferProductShowcaseInlineBlock from '../components/blocks/inline/OfferProductShowcaseInlineBlock';
import OfferGuaranteeSectionInlineBlock from '../components/blocks/inline/OfferGuaranteeSectionInlineBlock';
import OfferFaqSectionInlineBlock from '../components/blocks/inline/OfferFaqSectionInlineBlock';

// Registry completo
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Text and Content básicos
  'text-inline': TextInline,
  'heading-inline': HeadingInline,
  'button-inline': ButtonInlineFixed,
  
  // Componentes de Resultado (Etapa 20)
  'countdown-inline': CountdownInlineBlock,
  'result-card-inline': ResultCardInlineBlock,
  'testimonials-inline': TestimonialsInlineBlock,
  
  // Componentes de Oferta existentes (Etapa 21)
  'quiz-offer-pricing': QuizOfferPricingInlineBlock,
  'quiz-offer-cta': QuizOfferCTAInlineBlock,
  
  // Novos componentes modulares da Etapa 21 (Offer)
  'offer-header': OfferHeaderInlineBlock,
  'offer-hero-section': OfferHeroSectionInlineBlock,
  'offer-problem-section': OfferProblemSectionInlineBlock,
  'offer-solution-section': OfferSolutionSectionInlineBlock,
  'offer-product-showcase': OfferProductShowcaseInlineBlock,
  'offer-guarantee-section': OfferGuaranteeSectionInlineBlock,
  'offer-faq-section': OfferFaqSectionInlineBlock,
};

export const getBlockComponent = (type: string): React.ComponentType<any> | null => {
  return ENHANCED_BLOCK_REGISTRY[type] || null;
};

// Generate block definitions for the sidebar
export const generateBlockDefinitions = () => {
  return Object.keys(ENHANCED_BLOCK_REGISTRY).map(type => ({
    type,
    name: type.replace('-inline', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    category: 'basic',
    component: ENHANCED_BLOCK_REGISTRY[type]
  }));
};

export default ENHANCED_BLOCK_REGISTRY;
