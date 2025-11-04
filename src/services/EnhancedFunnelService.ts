/**
 * Enhanced Funnel Service - Compatibility Wrapper
 *
 * Objetivo: manter compatibilidade com chamadores legados enquanto
 * delega operações ao serviço CANÔNICO de funil.
 *
 * Status: ponte de migração. Preferir importar diretamente
 * `funnelService` de `@/services/canonical/FunnelService` em novos códigos.
 */

import { FunnelContext } from '@/core/contexts/FunnelContext';
import { funnelService as canonicalFunnelService, type FunnelMetadata } from '@/services/canonical/FunnelService';
import { appLogger } from '@/utils/logger';
import type { UnifiedFunnelData } from './FunnelUnifiedService';

export class EnhancedFunnelService {
  private static instance: EnhancedFunnelService;
  // Delegação ao serviço canônico
  private funnelService = canonicalFunnelService;

  private constructor() {}

  static getInstance(): EnhancedFunnelService {
    if (!this.instance) {
      this.instance = new EnhancedFunnelService();
    }
    return this.instance;
  }

  /**
   * Get funnel with automatic fallback creation
   */
  async getFunnelWithFallback(
    funnelId: string,
    fallback?: any,
    context: FunnelContext = FunnelContext.EDITOR,
  ): Promise<UnifiedFunnelData | null> {
    try {
      if (import.meta?.env?.DEV) {
        appLogger.warn('[EnhancedFunnelService] Ponte de compatibilidade ativa. Migre para o serviço canônico diretamente.');
      }

      // Buscar via serviço canônico
      const funnel = await this.funnelService.getFunnel(funnelId);
      if (funnel) return this.mapCanonicalToUnified(funnel);

      // If not found, create fallback
      return await this.createFallbackFunnel(funnelId, context);
    } catch (error) {
      appLogger.error('Error in getFunnelWithFallback:', error);
      return fallback || null;
    }
  }

  /**
   * Create fallback funnel when not found
   */
  async createFallbackFunnel(
    funnelId: string,
    context: FunnelContext = FunnelContext.EDITOR,
  ): Promise<UnifiedFunnelData | null> {
    try {
      const created = await this.funnelService.createFunnel({
        name: `Funil ${funnelId}`,
        type: 'quiz',
        category: 'quiz',
        context,
        status: 'draft',
        config: { createdBy: 'enhanced-fallback' },
        metadata: { reason: 'auto-created', source: 'EnhancedFunnelService' },
      });

      return this.mapCanonicalToUnified(created);
    } catch (error) {
      appLogger.error('Error creating fallback funnel:', error);
      return null;
    }
  }

  // ================================================================
  // Mappers
  // ================================================================
  private mapCanonicalToUnified(meta: FunnelMetadata): UnifiedFunnelData {
    return {
      id: meta.id,
      name: meta.name,
      description: (meta.metadata && (meta.metadata as any).description) || '',
      userId: (meta.metadata && (meta.metadata as any).userId) || 'unknown',
      settings: meta.config || {},
      status: meta.status,
      version: '1',
      createdAt: new Date(meta.createdAt),
      updatedAt: new Date(meta.updatedAt),
    } as any;
  }
}

export const enhancedFunnelService = EnhancedFunnelService.getInstance();
