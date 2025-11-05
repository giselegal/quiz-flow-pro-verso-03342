/**
 * 📦 OfferSections - Index
 * 
 * Exporta todos os componentes de oferta
 */

export { OfferHeroSection } from './OfferHeroSection';
export { PricingSection } from './PricingSection';

export type {
    OfferHeroContent,
    OfferHeroSectionProps,
} from './OfferHeroSection';

export type {
    PricingInfo,
    PricingSectionContent,
    PricingSectionProps,
} from './PricingSection';

// Export default para BlockTypeRenderer (usa PricingSection como padrão)
export { PricingSection as default } from './PricingSection';
