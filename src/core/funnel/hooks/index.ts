/**
 * 🪝 FUNNEL HOOKS INDEX
 * 
 * Exporta todos os hooks especializados para funis
 */

// Main hooks
export * from './useFunnel';
export * from './useFunnelState';
export * from './useFunnelTemplates';

// Additional hooks (migrated from /src/hooks)
export { useFunnelAI } from './useFunnelAI';
export { useFunnelAnalytics } from './useFunnelAnalytics';
export { useFunnelComponents } from './useFunnelComponents';
export { useFunnelLivePreview } from './useFunnelLivePreview';
export { useFunnelLoader } from './useFunnelLoader';
// Corrigido: useFunnelLoaderRefactored usa default export
export { default as useFunnelLoaderRefactored } from './useFunnelLoaderRefactored';
export { useFunnelNavigation } from './useFunnelNavigation';
export { useFunnelPublication } from './useFunnelPublication';

// Re-export specific types for convenience
export type {
    UseFunnelOptions,
    UseFunnelReturn,
} from './useFunnel';

export type {
    UseFunnelStateOptions,
    UseFunnelStateReturn,
} from './useFunnelState';

export type {
    UseFunnelTemplatesOptions,
    UseFunnelTemplatesReturn,
} from './useFunnelTemplates';
