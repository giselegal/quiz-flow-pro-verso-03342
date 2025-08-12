/**
 * 🎯 INDEX DOS COMPONENTES DE OFERTA
 *
 * Exporta todos os componentes modulares para páginas de oferta
 * Compatível com o sistema JSON/JavaScript do editor-fixed
 */

// Componentes principais
export { default as OfferFaqSection } from './OfferFaqSection';
export { default as OfferGuaranteeSection } from './OfferGuaranteeSection';
export { default as OfferHeader } from './OfferHeader';
export { default as OfferHeroSection } from './OfferHeroSection';
export { default as OfferProblemSection } from './OfferProblemSection';
export { default as OfferProductShowcase } from './OfferProductShowcase';
export { default as OfferSolutionSection } from './OfferSolutionSection';

// Estilos
export { injectOfferPageStyles, offerPageStyles } from './offerStyles';

// Types para componentes de oferta
export interface OfferComponentProps {
  containerWidth?: 'full' | 'narrow' | 'medium';
  spacing?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
}

export interface TrustElement {
  icon: string;
  text: string;
}

export interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}

export interface Pricing {
  installments: {
    quantity: number;
    amount: string;
  };
  fullPrice: string;
  discount: string;
  savings: string;
  limitedOffer: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// Mapping de tipos para o ENHANCED_BLOCK_REGISTRY
export const OFFER_COMPONENT_TYPES = {
  'offer-header': 'OfferHeader',
  'offer-hero-section': 'OfferHeroSection',
  'offer-problem-section': 'OfferProblemSection',
  'offer-solution-section': 'OfferSolutionSection',
  'offer-product-showcase': 'OfferProductShowcase',
  'offer-guarantee-section': 'OfferGuaranteeSection',
  'offer-faq-section': 'OfferFaqSection',
} as const;
