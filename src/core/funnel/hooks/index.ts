/**
 * 🪝 FUNNEL HOOKS INDEX
 * 
 * Exporta todos os hooks especializados para funis
 */

// Main hooks
export * from './useFunnel';
export * from './useFunnelState';
export * from './useFunnelTemplates';

// Re-export specific types for convenience
export type {
    UseFunnelOptions,
    UseFunnelReturn
} from './useFunnel';

export type {
    UseFunnelStateOptions,
    UseFunnelStateReturn
} from './useFunnelState';

export type {
    UseFunnelTemplatesOptions,
    UseFunnelTemplatesReturn
} from './useFunnelTemplates';
