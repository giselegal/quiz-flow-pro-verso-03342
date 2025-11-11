// Ambient declarations to satisfy type-check for optional/legacy modules

declare const __DEV__: boolean;

declare module '../templates/registry/index' {
  export const loadFullTemplate: any;
  const _default: any;
  export default _default;
}

declare module '../../hooks/usePerformanceTest' {
  export const usePerformanceTest: (component: string, options?: {
    enabled?: boolean;
    onAlert?: (alert: { message: string; type?: string; timestamp: number }) => void;
  }) => {
    startTest: () => void;
    stopTest: () => void;
    metrics: { [key: string]: any } & { renderTime?: number; memoryUsage?: number; reRenderCount?: number; networkLatency?: number };
    alerts: Array<{ message: string; type?: string; timestamp: number }>;
  };
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
  // Declaração expandida para refletir API real usada no código
  export type Block = any;
  export interface ServiceResult<T> { success: boolean; data: T; error?: Error }
  export class TemplateService {
    static getInstance(...args: any[]): TemplateService;
    getStep(stepId: string, templateId?: string, options?: any): Promise<ServiceResult<Block[]>>;
    getAllStepsSync(): Record<string, any>;
    getStepOrder(): string[];
    lazyLoadStep(stepId: string, preloadNeighbors?: boolean): Promise<any>;
    prepareTemplate(templateId: string, options?: any): Promise<ServiceResult<void>>;
    setActiveTemplate(templateId: string, totalSteps: number): void;
    setActiveFunnel(funnelId: string | null): void;
    invalidateStepCache(stepId: string): void;
    clearCache(): void;
    getTemplate(id: string): Promise<ServiceResult<any>>;
    normalizeBlocks(blocks: any[]): Block[];
    steps: {
      list(): ServiceResult<any[]>;
      get(stepNumber: number): Promise<ServiceResult<Block[]>>;
      add(stepInfo: any): Promise<ServiceResult<void>>;
      remove(stepId: string): Promise<ServiceResult<void>>;
      duplicate(stepId: string): Promise<ServiceResult<any>>;
      reorder(stepIds: string[]): Promise<ServiceResult<void>>;
    };
  }
  export const templateService: TemplateService;
  export const quizEditorBridge: any;
  // Compat: alguns arquivos importam TemplateRegistry direto (não exportado publicamente)
  export const TemplateRegistry: any;
}

// Modular quiz steps (placeholder para tipos completos)
declare module '@/components/quiz-modular' {
  import * as React from 'react';
  export const ModularIntroStep: React.ComponentType<any>;
  export const ModularQuestionStep: React.ComponentType<any>;
  export const ModularStrategicQuestionStep: React.ComponentType<any>;
  export const ModularTransitionStep: React.ComponentType<any>;
  export const ModularResultStep: React.ComponentType<any>;
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
