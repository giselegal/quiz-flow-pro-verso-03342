/**
 * Canonical Service Aliases
 *
 * Objetivo: expor serviços canônicos a partir de um ponto único e estável,
 * facilitando a migração gradual de serviços duplicados/legados.
 *
 * Como usar:
 *   import { ConsolidatedFunnelService } from '@services-alias';
 *   import { MasterTemplateService, ConsolidatedTemplateService } from '@services-alias';
 *
 * Vantagens:
 * - Centraliza os alvos canônicos
 * - Permite reforçar um único caminho de importação
 * - Reduz acoplamento com a estrutura interna de pastas
 */

export { default as ConsolidatedFunnelService } from '@/services/core/ConsolidatedFunnelService';
export { default as ConsolidatedTemplateService } from '@/services/core/ConsolidatedTemplateService';
export { default as MasterTemplateService } from '@/services/templates/MasterTemplateService';

// Exportações nomeadas opcionais (se os serviços não exportarem default)
// export { ConsolidatedFunnelService } from '@/services/core/ConsolidatedFunnelService';
// export { ConsolidatedTemplateService } from '@/services/core/ConsolidatedTemplateService';
// export { MasterTemplateService } from '@/services/templates/MasterTemplateService';
