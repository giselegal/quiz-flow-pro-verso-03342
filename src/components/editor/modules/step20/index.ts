// Provider de dados centralizado
export { QuizDataProvider, useQuizData } from './QuizDataProvider';

// Componentes modulares da Step 20 - arquivos diretos
export { default as ResultHeaderModule } from './ResultHeader/ResultHeaderModule';
export { default as StyleRevealModule } from './StyleRevealModule';
export { default as UserGreetingModule } from './UserGreetingModule';
export { default as CompatibilityModule } from './CompatibilityModule';
export { default as SecondaryStylesModule } from './SecondaryStylesModule';
export { default as OfferModule } from './OfferModule';

// Tipos das props
export type { ResultHeaderModuleProps } from './ResultHeader/ResultHeaderModule';
export type { StyleRevealModuleProps } from './StyleRevealModule';
export type { UserGreetingModuleProps } from './UserGreetingModule';
export type { CompatibilityModuleProps } from './CompatibilityModule';
export type { SecondaryStylesModuleProps } from './SecondaryStylesModule';
export type { OfferModuleProps } from './OfferModule';

// Utilitários e constantes
export const STEP20_MODULES = {
  RESULT_HEADER: 'step20-result-header',
  STYLE_REVEAL: 'step20-style-reveal',  
  USER_GREETING: 'step20-user-greeting',
  COMPATIBILITY: 'step20-compatibility',
  SECONDARY_STYLES: 'step20-secondary-styles',
  PERSONALIZED_OFFER: 'step20-personalized-offer'
} as const;

export type Step20ModuleType = typeof STEP20_MODULES[keyof typeof STEP20_MODULES];