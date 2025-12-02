/**
 * 🎯 FUNNEL SERVICE ADAPTER - FASE 4.4
 * 
 * Adapter que permite UnifiedCRUDProvider usar o FunnelService canônico
 * mantendo compatibilidade com API antiga de FunnelUnifiedService.
 * 
 * Desbloqueia deprecation de:
 * - FunnelUnifiedService
 * - EnhancedFunnelService
 * - FunnelOrchestrator
 */

import { funnelService } from '@/services/canonical/FunnelService';
import type { FunnelMetadata } from '@/types/funnel';
import { Funnel } from '@/core/domains';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES - API antiga do FunnelUnifiedService
// ============================================================================

export interface UnifiedFunnelData {
  id: string;
  name: string;
  description: string;
  category: string;
  context: FunnelContext;
  templateId?: string;
  status: 'draft' | 'published' | 'archived';
  steps: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  metadata?: any;
}

export interface CreateFunnelInput {
  name: string;
  description?: string;
  category?: string;
  context?: FunnelContext;
  templateId?: string;
  config?: any;
}

export interface UpdateFunnelInput {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  steps?: Record<string, any>;
  metadata?: any;
}

// ============================================================================
// ADAPTER
// ============================================================================

export class FunnelServiceAdapter {
  /**
   * Converter FunnelMetadata (canonical) → UnifiedFunnelData (legacy)
   */
  private toUnifiedFormat(metadata: FunnelMetadata, steps?: Record<string, any>): UnifiedFunnelData {
    return {
      id: metadata.id,
      name: metadata.name,
      description: metadata.metadata?.description || '',
      category: metadata.category || 'outros',
      context: metadata.context || FunnelContext.EDITOR,
      templateId: metadata.templateId,
      status: metadata.status,
      steps: steps || {},
      createdAt: metadata.createdAt || new Date().toISOString(),
      updatedAt: metadata.updatedAt || new Date().toISOString(),
      metadata: metadata.metadata,
    };
  }

  /**
   * Converter UnifiedFunnelData → FunnelMetadata
   */
  private toCanonicalFormat(data: UnifiedFunnelData): FunnelMetadata {
    return {
      id: data.id,
      name: data.name,
      type: 'quiz',
      category: data.category,
      context: data.context,
      templateId: data.templateId,
      status: data.status,
      config: {},
      metadata: {
        description: data.description,
        ...data.metadata,
      },
      isActive: data.status !== 'archived',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  }

  /**
   * Criar funnel usando API antiga mas service canônico
   */
  async createFunnel(input: CreateFunnelInput): Promise<UnifiedFunnelData> {
    try {
      const metadata = await funnelService.createFunnel({
        name: input.name,
        type: 'quiz',
        category: input.category || 'outros',
        context: input.context || FunnelContext.EDITOR,
        templateId: input.templateId,
        status: 'draft',
        config: input.config || {},
        metadata: { 
          description: input.description || '',
        },
      });

      return this.toUnifiedFormat(metadata);
    } catch (error) {
      appLogger.error('[FunnelServiceAdapter] Error creating funnel:', { data: [error] });
      throw error;
    }
  }

  /**
   * Buscar funnel com componentes
   */
  async getFunnel(id: string): Promise<UnifiedFunnelData | null> {
    try {
      const metadata = await funnelService.getFunnel(id);
      if (!metadata) return null;

      // Carregar components/steps
      const withComponents = await funnelService.getFunnelWithComponents(id);
      
      return this.toUnifiedFormat(metadata, withComponents?.components || {});
    } catch (error) {
      appLogger.error('[FunnelServiceAdapter] Error getting funnel:', { data: [error] });
      return null;
    }
  }

  /**
   * Atualizar funnel
   */
  async updateFunnel(input: UpdateFunnelInput): Promise<UnifiedFunnelData> {
    try {
      const updates: Partial<FunnelMetadata> = {};

      if (input.name) updates.name = input.name;
      if (input.category) updates.category = input.category;
      if (input.status) updates.status = input.status;
      
      if (input.description || input.metadata) {
        updates.metadata = {
          description: input.description,
          ...input.metadata,
        };
      }

      const metadata = await funnelService.updateFunnel(input.id, updates);

      // Se houver steps, atualizar components
      if (input.steps) {
        // TODO: Implementar atualização de components via funnelService
        appLogger.warn('[FunnelServiceAdapter] Step updates not yet implemented');
      }

      if (!metadata) {
        throw new Error('Failed to update funnel');
      }

      return this.toUnifiedFormat(metadata, input.steps);
    } catch (error) {
      appLogger.error('[FunnelServiceAdapter] Error updating funnel:', { data: [error] });
      throw error;
    }
  }

  /**
   * Deletar funnel
   */
  async deleteFunnel(id: string): Promise<boolean> {
    try {
      return await funnelService.deleteFunnel(id);
    } catch (error) {
      appLogger.error('[FunnelServiceAdapter] Error deleting funnel:', { data: [error] });
      return false;
    }
  }

  /**
   * Listar funnels do usuário
   */
  async listUserFunnels(userId?: string): Promise<UnifiedFunnelData[]> {
    try {
      const metadataList = await funnelService.listFunnels({
        context: FunnelContext.EDITOR,
      });

      return metadataList.map(meta => this.toUnifiedFormat(meta));
    } catch (error) {
      appLogger.error('[FunnelServiceAdapter] Error listing funnels:', { data: [error] });
      return [];
    }
  }

  /**
   * Publicar funnel
   */
  async publishFunnel(id: string): Promise<UnifiedFunnelData> {
    try {
      const metadata = await funnelService.updateFunnel(id, { status: 'published' });
      if (!metadata) {
        throw new Error('Failed to publish funnel');
      }
      return this.toUnifiedFormat(metadata);
    } catch (error) {
      appLogger.error('[FunnelServiceAdapter] Error publishing funnel:', { data: [error] });
      throw error;
    }
  }

  /**
   * Duplicar funnel
   */
  async duplicateFunnel(id: string, newName?: string): Promise<UnifiedFunnelData> {
    try {
      const original = await this.getFunnel(id);
      if (!original) throw new Error('Funnel not found');

      return await this.createFunnel({
        name: newName || `${original.name} (Copy)`,
        description: original.description,
        category: original.category,
        context: original.context,
        templateId: original.templateId,
      });
    } catch (error) {
      appLogger.error('[FunnelServiceAdapter] Error duplicating funnel:', { data: [error] });
      throw error;
    }
  }

  /**
   * Converter para Domain Object (Funnel)
   */
  toDomainFunnel(data: UnifiedFunnelData): Funnel {
    return new Funnel(
      data.id,
      {
        name: data.name,
        description: data.description,
        category: data.category,
        tags: [],
        language: 'pt-BR',
        isTemplate: false,
        isPublished: data.status === 'published',
        createdBy: '',
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      },
      {
        allowAnonymous: false,
        collectEmail: true,
        collectPhone: false,
        requireEmailVerification: false,
        enableAnalytics: true,
        enableABTesting: false,
        conversionGoals: [],
      },
      {
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        accentColor: '#06b6d4',
        fontFamily: 'system-ui, sans-serif',
        theme: 'light',
      },
      [],
      {
        totalViews: 0,
        uniqueVisitors: 0,
        conversionRate: 0,
        averageTimeSpent: 0,
        exitRate: 0,
        topTrafficSources: {},
        deviceBreakdown: {},
        locationBreakdown: {},
      }
    );
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const funnelServiceAdapter = new FunnelServiceAdapter();

export default funnelServiceAdapter;
