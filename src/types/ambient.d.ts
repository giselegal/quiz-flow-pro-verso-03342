// Ambient declarations to satisfy type-check for optional/legacy modules

declare const __DEV__: boolean;

declare module '../templates/registry/index' {
  export const loadFullTemplate: any;
  const _default: any;
  export default _default;
}

declare module '../../hooks/usePerformanceTest' {
  export const usePerformanceTest: any;
}

declare module '../types/editor' {
  export type Block = any;
}

declare module '../types/blocks' {
  export type BlockData = any;
}

declare module '../types/quiz' {
  export type StyleResult = any;
  export type SimpleComponent = any;
  export type QuizOption = any;
  export type BonusItem = any;
  export type FaqItem = any;
}

declare module '../services/phase5DataSimulator' {
  export const initializePhase5Data: any;
  export const getPhase5Data: any;
}

declare module '@/services/canonical/TemplateService' {
  // Alinhar com o módulo real para evitar erros de export inexistente
  export class TemplateService {
    static getInstance(...args: any[]): TemplateService;
  }
  export const templateService: any;
  export const quizEditorBridge: any;
}

declare module '@/lib/utils/logger' {
  export const appLogger: any;
}

declare module '@/components/editor/quiz/components/ThemeEditorPanel' {
  const Component: any;
  export default Component;
}

declare module '@/components/editor/quiz/components/StyleResultCard' {
  const Component: any;
  export default Component;
}

declare module '@/components/editor/quiz/components/OfferMap' {
  const Component: any;
  export default Component;
}
