
/**
 * Componentes de Resultado Reutilizáveis - ETAPAS 20-21 DO FUNIL COMPLETO
 * 
 * Blocos 100% editáveis para uso no editor visual /editor
 * Cada componente é totalmente configurável via props e pode ser usado
 * independentemente ou integrado com o DynamicBlockRenderer.
 * 
 * COBERTURA COMPLETA:
 * - Etapa 20: Página de resultado completa ✅
 * - Etapa 21: Página de oferta/venda ✅
 */

// Blocos principais de resultado (implementados)
export { default as PrimaryStyleCardBlock } from './PrimaryStyleCardBlock';
export { default as SecondaryStylesBlock } from './SecondaryStylesBlock';
export { default as StyleDescriptionBlock } from './StyleDescriptionBlock';
export { default as PersonalizedTipsBlock } from './PersonalizedTipsBlock';
export { default as SocialProofBlock } from './SocialProofBlock';
export { default as FinalCTABlock } from './FinalCTABlock';
export { default as OfferCardBlock } from './OfferCardBlock';
export { default as TestimonialsBlock } from './TestimonialsBlock';
export { default as FAQBlock } from './FAQBlock';
export { default as CountdownBlock } from './CountdownBlock';
export { default as GuaranteeBlock } from './GuaranteeBlock';
export { default as BonusesBlock } from './BonusesBlock';
export { default as PricingBlock } from './PricingBlock';
export { default as UrgencyBlock } from './UrgencyBlock';
export { default as TrustSignalsBlock } from './TrustSignalsBlock';

// Re-export types para facilitar importação
export type { PrimaryStyleCardBlockProps } from './PrimaryStyleCardBlock';
export type { SecondaryStylesBlockProps } from './SecondaryStylesBlock';
export type { StyleDescriptionBlockProps } from './StyleDescriptionBlock';
export type { PersonalizedTipsBlockProps } from './PersonalizedTipsBlock';
export type { SocialProofBlockProps } from './SocialProofBlock';
export type { OfferCardBlockProps } from './OfferCardBlock';
export type { TestimonialsBlockProps } from './TestimonialsBlock';
export type { FAQBlockProps } from './FAQBlock';
export type { CountdownBlockProps } from './CountdownBlock';
export type { GuaranteeBlockProps } from './GuaranteeBlock';
export type { BonusesBlockProps } from './BonusesBlock';
export type { PricingBlockProps } from './PricingBlock';
export type { UrgencyBlockProps } from './UrgencyBlock';
export type { TrustSignalsBlockProps } from './TrustSignalsBlock';

// Export StyleResult types from the main component
export type { StyleResultData, StyleResultProps } from '@/components/result/StyleResult';

// Types dos blocos específicos
export interface FinalCTABlockProps {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
  showSecondaryButton?: boolean;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  buttonColor?: string;
  className?: string;
  isEditable?: boolean;
  onUpdate?: (updates: any) => void;
}
