/**
 * @deprecated Use FunnelUnifiedService directly
 * 
 * Enhanced Funnel Service - Compatibility Wrapper
 * Provides getFunnelWithFallback and createFallbackFunnel methods
 */

import { FunnelUnifiedService, UnifiedFunnelData } from './FunnelUnifiedService';
import { FunnelContext } from '@/core/contexts/FunnelContext';

export class EnhancedFunnelService {
  private static instance: EnhancedFunnelService;
  private funnelService = FunnelUnifiedService.getInstance();

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
    context: FunnelContext = FunnelContext.EDITOR
  ): Promise<UnifiedFunnelData | null> {
    try {
      // Try to get funnel
      const funnel = await this.funnelService.getFunnel(funnelId);
      if (funnel) return funnel;

      // If not found, create fallback
      return await this.createFallbackFunnel(funnelId, context);
    } catch (error) {
      console.error('Error in getFunnelWithFallback:', error);
      return fallback || null;
    }
  }

  /**
   * Create fallback funnel when not found
   */
  async createFallbackFunnel(
    funnelId: string,
    context: FunnelContext = FunnelContext.EDITOR
  ): Promise<UnifiedFunnelData | null> {
    try {
      const created = await this.funnelService.createFunnel({
        name: `Funil ${funnelId}`,
        description: 'Funnel created automatically',
        category: 'quiz',
        context,
        userId: 'anonymous',
        autoPublish: false
      });

      return created;
    } catch (error) {
      console.error('Error creating fallback funnel:', error);
      return null;
    }
  }
}

export const enhancedFunnelService = EnhancedFunnelService.getInstance();
