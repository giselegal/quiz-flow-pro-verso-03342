/**
 * 🏗️ FUNNEL CORE MODULE
 * 
 * Módulo principal do sistema de funis
 * Separado do sistema de quiz para melhor organização
 */

// Core classes
export { FunnelCore, FunnelUtils, funnelCore } from './FunnelCore';
export { FunnelEngine, FunnelActions, funnelEngine } from './FunnelEngine';

// Types
export type * from './types';

// Hooks - explicitly import to avoid conflicts
export {
    useFunnel,
    useFunnelNavigation,
    useFunnelValidation,
    useFunnelData,
    useFunnelProgress
} from './hooks/useFunnel';

export {
    useFunnelState,
    useFunnelPersistence,
    useFunnelHistory,
    useFunnelAnalytics,
    useFunnelComparison
} from './hooks/useFunnelState';

export {
    useFunnelTemplates,
    useCreateFunnelFromTemplate,
    useFunnelTemplatePreview
} from './hooks/useFunnelTemplates';

// Hook types
export type {
    UseFunnelOptions,
    UseFunnelReturn
} from './hooks/useFunnel';

export type {
    UseFunnelStateOptions,
    UseFunnelStateReturn
} from './hooks/useFunnelState';

export type { UseFunnelTemplatesOptions, UseFunnelTemplatesReturn } from './hooks/index';

// Re-export commonly used types
export type {
    FunnelState,
    FunnelStep,
    FunnelComponent,
    FunnelAction,
    FunnelEvent,
    FunnelTemplate,
    FunnelProgress,
    NavigationState,
    ValidationState,
    FunnelSettings,
    FunnelMetadata
} from './types';

// Utility constants
export const FUNNEL_VERSION = '1.0.0';

export const FUNNEL_DEFAULTS = {
    AUTO_SAVE_INTERVAL: 30000, // 30 segundos
    MAX_HISTORY_SIZE: 50,
    VALIDATION_DEBOUNCE: 500, // 500ms
    NAVIGATION_TIMEOUT: 5000 // 5 segundos
} as const;

// Common funnel configurations
export const FUNNEL_PRESETS = {
    SIMPLE_QUIZ: {
        autoSave: true,
        autoAdvance: false,
        progressTracking: true,
        allowBackward: true,
        showProgress: true
    },
    ONBOARDING_FLOW: {
        autoSave: true,
        autoAdvance: true,
        progressTracking: true,
        allowBackward: false,
        showProgress: true
    },
    SURVEY_FORM: {
        autoSave: true,
        autoAdvance: false,
        progressTracking: true,
        allowBackward: true,
        showProgress: false
    },
    PRODUCT_CONFIGURATOR: {
        autoSave: true,
        autoAdvance: false,
        progressTracking: true,
        allowBackward: true,
        showProgress: true
    }
} as const;
