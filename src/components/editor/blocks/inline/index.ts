// Export de todos os componentes inline disponíveis
// Este arquivo resolve o problema de importação no UniversalBlockRenderer

// Componentes básicos
export { default as TextInlineBlock } from "./TextInlineBlock";
export { default as ImageDisplayInlineBlock } from "./ImageDisplayInlineBlock";
export { default as BadgeInlineBlock } from "./BadgeInlineBlock";
export { default as ProgressInlineBlock } from "./ProgressInlineBlock";
export { default as StatInlineBlock } from "./StatInlineBlock";
export { default as CountdownInlineBlock } from "./CountdownInlineBlock";
export { default as SpacerInlineBlock } from "./SpacerInlineBlock";

// Componentes de cards
export { default as PricingCardInlineBlock } from "./PricingCardInlineBlock";
export { default as TestimonialCardInlineBlock } from "./TestimonialCardInlineBlock";
export { default as StyleCardInlineBlock } from "./StyleCardInlineBlock";
export { default as ResultCardInlineBlock } from "./ResultCardInlineBlock";

// Componentes de resultado
export { default as ResultHeaderInlineBlock } from "./ResultHeaderInlineBlock";
export { default as StepHeaderInlineBlock } from "./StepHeaderInlineBlock";
export { default as SecondaryStylesInlineBlock } from "./SecondaryStylesInlineBlock";
export { default as StyleCharacteristicsInlineBlock } from "./StyleCharacteristicsInlineBlock";

// Componentes de quiz
export { default as LoadingAnimationBlock } from "./LoadingAnimationBlock";

// Componentes que existem mas podem estar vazios
// Missing inline blocks - removed exports
export { default as QuizOfferCTAInlineBlock } from "./QuizOfferCTAInlineBlock";

// Re-exportar tipos necessários
export type { BlockComponentProps } from "../../../../types/blocks";
