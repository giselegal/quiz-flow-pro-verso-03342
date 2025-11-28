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
    Funnel,
    UseFunnelOptions,
} from './useFunnel';

export type {
    UseFunnelStateOptions,
    UseFunnelStateReturn,
} from './useFunnelState';

export type {
    UseFunnelTemplatesOptions,
    UseFunnelTemplatesReturn,
} from './useFunnelTemplates';

// Re-export UseQueryResult type for convenience (UseFunnelReturn)
export type { UseQueryResult } from '@tanstack/react-query';
