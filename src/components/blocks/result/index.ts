/**
 * Blocos de Resultado Reutilizáveis - ETAPA 20 DO FUNIL COMPLETO
 * 
 * Página de resultado completa com componentes implementados:
 * - Header com logo e nome do usuário ✅
 * - Card de estilo predominante ✅
 * - Depoimentos e prova social ✅
 * - Seções de motivação e transformação ✅
 * - Bônus e ofertas ✅
 * - Call-to-actions finais ✅
 * 
 * TODO: Implementar blocos adicionais conforme necessário
 */

// Blocos implementados
export { default as HeaderBlock } from './HeaderBlock';
export { default as PrimaryStyleCardBlock } from './PrimaryStyleCardBlock';
export { default as TestimonialsBlock } from './TestimonialsBlock';
export { default as BeforeAfterTransformationBlock } from './BeforeAfterTransformationBlock';
export { default as MotivationSectionBlock } from './MotivationSectionBlock';
export { default as BonusSectionBlock } from './BonusSectionBlock';
export { default as FinalCTABlock } from './FinalCTABlock';

// TODO: Implementar conforme necessário
// export { default as SecondaryStylesBlock } from './SecondaryStylesBlock';
// export { default as GuaranteeSectionBlock } from './GuaranteeSectionBlock';
// export { default as MentorSectionBlock } from './MentorSectionBlock';
// export { default as SecurePurchaseBlock } from './SecurePurchaseBlock';

// Re-export types para facilitar importação
export type { HeaderBlockProps } from './HeaderBlock';
export type { StyleResultData, PrimaryStyleCardBlockProps } from './PrimaryStyleCardBlock';
export type { TestimonialData, TestimonialsBlockProps } from './TestimonialsBlock';
export type { BeforeAfterTransformationBlockProps } from './BeforeAfterTransformationBlock';
export type { MotivationSectionBlockProps } from './MotivationSectionBlock';
export type { BonusItem, BonusSectionBlockProps } from './BonusSectionBlock';
export type { FinalCTABlockProps } from './FinalCTABlock';
