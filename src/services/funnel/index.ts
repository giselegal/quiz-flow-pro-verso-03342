/**
 * 🎯 FUNNEL SERVICES - Entry Point
 * 
 * ⚠️ Este arquivo redireciona para o FunnelService canônico.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { funnelService } from '@/services/funnel';
 * 
 * // ✅ DEPOIS
 * import { funnelService } from '@/services';
 * ```
 */

// Re-export from canonical service
export { 
  funnelService, 
  CanonicalFunnelService as FunnelService,
  type FunnelMetadata,
  type CreateFunnelInput,
  type UpdateFunnelInput,
} from '../canonical/FunnelService';

// Legacy type aliases
export type Funnel = import('../canonical/FunnelService').FunnelMetadata;
export type LoadFunnelResult = { funnel: Funnel | null; error?: string };
export type SaveFunnelResult = { success: boolean; error?: string };

// Funnel resolver (utility functions)
export {
  resolveFunnel,
  resolveFunnelTemplatePath,
  parseFunnelFromURL,
  normalizeFunnelId,
  isV41SaasFunnel,
  FUNNEL_TEMPLATE_MAP,
} from './FunnelResolver';

export type {
  FunnelIdentifier,
  ResolvedFunnel,
} from './FunnelResolver';
