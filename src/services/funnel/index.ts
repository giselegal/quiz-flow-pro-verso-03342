/**
 * 🎯 FUNNEL SERVICES - Entry Point
 * 
 * Exporta todos os serviços relacionados a funis.
 * 
 * @since v4.1.0
 */

export { funnelService, FunnelService } from './FunnelService';
export type { 
  Funnel, 
  LoadFunnelResult, 
  SaveFunnelResult 
} from './FunnelService';

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
