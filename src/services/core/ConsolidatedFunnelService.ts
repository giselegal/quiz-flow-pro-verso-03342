/**
 * 🎯 CONSOLIDATED FUNNEL SERVICE - UNIFICAÇÃO COMPLETA
 * 
 * Substitui e unifica:
 * - FunnelUnifiedService
 * - FunnelUnifiedServiceV2 
 * - EnhancedFunnelService
 * - TemplateFunnelService
 * - contextualFunnelService
 */

import { BaseUnifiedService, ServiceConfig } from './UnifiedServiceManager';
import { supabase } from '@/integrations/supabase/client';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { deepClone } from '@/utils/cloneFunnel';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ConsolidatedFunnelData {
  id: string;
  name: string;
  description?: string;
  category: string;
  context: FunnelContext;
  userId: string;
  
  // Core data
  settings: any;
  pages: any[];
  
  // Metadata
  isPublished: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Template integration
  templateId?: string;
  isFromTemplate?: boolean;
}

export interface CreateFunnelParams {
  name: string;
  description?: string;
  category?: string;
  context: FunnelContext;
  templateId?: string;
  userId?: string;
  autoPublish?: boolean;
}

export interface UpdateFunnelParams {
  name?: string;
  description?: string;
  category?: string;
  settings?: any;
  pages?: any[];
  isPublished?: boolean;
}

export interface QueryFunnelParams {
  context?: FunnelContext;
  userId?: string;
  includeUnpublished?: boolean;
  category?: string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// CONSOLIDATED FUNNEL SERVICE
// ============================================================================

export class ConsolidatedFunnelService extends BaseUnifiedService {
  private static readonly CONFIG: ServiceConfig = {
    name: 'ConsolidatedFunnelService',
    priority: 1,
    cacheTTL: 5 * 60 * 1000, // 5 minutos
    retryAttempts: 3,
    timeout: 10000
  };

  private loadedFunnels = new Map<string, ConsolidatedFunnelData>();
  private currentUserId: string | null = null;

  constructor() {
    super(ConsolidatedFunnelService.CONFIG);
    this.initializeAuth();
  }

  getName(): string {
    return 'ConsolidatedFunnelService';
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Test basic Supabase connection
      const { error } = await supabase.from('funnels').select('count').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * 🔐 INITIALIZE AUTH
   */
  private async initializeAuth(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      this.currentUserId = user?.id || null;
      console.log('🔐 ConsolidatedFunnelService auth initialized:', !!this.currentUserId);
    } catch (error) {
      console.warn('⚠️ Auth initialization failed:', error);
    }
  }

  /**
   * 🎯 CREATE FUNNEL - Criação unificada
   */
  async createFunnel(params: CreateFunnelParams): Promise<ConsolidatedFunnelData> {
    return this.executeWithMetrics(async () => {
      console.log('🎯 Creating funnel:', params);

      // Ensure user ID
      const userId = params.userId || this.currentUserId;
      if (!userId) {
        throw new Error('User ID required for funnel creation');
      }

      // Generate ID
      const funnelId = this.generateFunnelId(params.name);
      
      // Build funnel data
      const funnelData: ConsolidatedFunnelData = {
        id: funnelId,
        name: params.name,
        description: params.description || '',
        category: params.category || 'outros',
        context: params.context,
        userId,
        settings: this.getDefaultSettings(),
        pages: await this.generateDefaultPages(params.templateId),
        isPublished: params.autoPublish || false,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        templateId: params.templateId,
        isFromTemplate: !!params.templateId
      };

      // Save to Supabase
      const { error } = await supabase
        .from('funnels')
        .insert({
          id: funnelData.id,
          name: funnelData.name,
          description: funnelData.description,
          user_id: funnelData.userId,
          settings: funnelData.settings,
          is_published: funnelData.isPublished,
          version: funnelData.version
        });

      if (error) {
        throw new Error(`Failed to create funnel: ${error.message}`);
      }

      // Save pages
      if (funnelData.pages.length > 0) {
        const pagesData = funnelData.pages.map((page, index) => ({
          funnel_id: funnelData.id,
          id: page.id || `page-${index + 1}`,
          page_order: page.page_order || index + 1,
          page_type: page.page_type || 'step',
          title: page.title || `Step ${index + 1}`,
          blocks: page.blocks || [],
          metadata: page.metadata || {}
        }));

        const { error: pagesError } = await supabase
          .from('funnel_pages')
          .insert(pagesData);

        if (pagesError) {
          console.warn('⚠️ Failed to save pages:', pagesError);
        }
      }

      // Cache the funnel
      this.setCached(funnelId, funnelData);
      this.loadedFunnels.set(funnelId, funnelData);

      console.log('✅ Funnel created successfully:', funnelId);
      return funnelData;
    }, 'createFunnel');
  }

  /**
   * 📖 GET FUNNEL - Busca unificada
   */
  async getFunnel(funnelId: string): Promise<ConsolidatedFunnelData | null> {
    return this.executeWithMetrics(async () => {
      // Check cache first
      const cached = this.getCached<ConsolidatedFunnelData>(funnelId);
      if (cached) {
        console.log(`⚡ Funnel cache hit: ${funnelId}`);
        return cached;
      }

      // Load from Supabase
      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', funnelId)
        .single();

      if (funnelError || !funnelData) {
        console.log(`❌ Funnel not found: ${funnelId}`);
        return null;
      }

      // Load pages
      const { data: pagesData } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', funnelId)
        .order('page_order');

      // Transform to our format
      const funnel: ConsolidatedFunnelData = {
        id: funnelData.id,
        name: funnelData.name,
        description: funnelData.description || '',
        category: 'quiz',
        context: FunnelContext.EDITOR,
        userId: funnelData.user_id || '',
        settings: (funnelData.settings as any) || {},
        pages: pagesData || [],
        isPublished: funnelData.is_published || false,
        version: funnelData.version || 1,
        createdAt: new Date(funnelData.created_at || new Date()),
        updatedAt: new Date(funnelData.updated_at || new Date()),
        templateId: (funnelData.settings as any)?.templateId,
        isFromTemplate: !!((funnelData.settings as any)?.templateId)
      };

      // Cache and return
      this.setCached(funnelId, funnel);
      this.loadedFunnels.set(funnelId, funnel);

      console.log('✅ Funnel loaded from database:', funnelId);
      return funnel;
    }, 'getFunnel');
  }

  /**
   * 💾 UPDATE FUNNEL - Atualização unificada
   */
  async updateFunnel(funnelId: string, params: UpdateFunnelParams): Promise<ConsolidatedFunnelData> {
    return this.executeWithMetrics(async () => {
      // Get existing funnel
      const existingFunnel = await this.getFunnel(funnelId);
      if (!existingFunnel) {
        throw new Error(`Funnel not found: ${funnelId}`);
      }

      // Prepare updates
      const updates: any = {
        updated_at: new Date().toISOString()
      };

      if (params.name) updates.name = params.name;
      if (params.description !== undefined) updates.description = params.description;
      if (params.isPublished !== undefined) updates.is_published = params.isPublished;
      if (params.settings) updates.settings = { ...existingFunnel.settings, ...params.settings };

      // Update in Supabase
      const { error } = await supabase
        .from('funnels')
        .update(updates)
        .eq('id', funnelId);

      if (error) {
        throw new Error(`Failed to update funnel: ${error.message}`);
      }

      // Update pages if provided
      if (params.pages) {
        // Delete existing pages
        await supabase
          .from('funnel_pages')
          .delete()
          .eq('funnel_id', funnelId);

        // Insert new pages
        if (params.pages.length > 0) {
          const pagesData = params.pages.map((page, index) => ({
            funnel_id: funnelId,
            id: page.id || `page-${index + 1}`,
            page_order: page.page_order || index + 1,
            page_type: page.page_type || 'step',
            title: page.title || `Step ${index + 1}`,
            blocks: page.blocks || [],
            metadata: page.metadata || {}
          }));

          await supabase
            .from('funnel_pages')
            .insert(pagesData);
        }
      }

      // Build updated funnel
      const updatedFunnel: ConsolidatedFunnelData = {
        ...existingFunnel,
        name: updates.name || existingFunnel.name,
        description: updates.description || existingFunnel.description,
        settings: updates.settings || existingFunnel.settings,
        pages: params.pages || existingFunnel.pages,
        isPublished: updates.is_published ?? existingFunnel.isPublished,
        updatedAt: new Date()
      };

      // Update cache
      this.setCached(funnelId, updatedFunnel);
      this.loadedFunnels.set(funnelId, updatedFunnel);

      console.log('✅ Funnel updated successfully:', funnelId);
      return updatedFunnel;
    }, 'updateFunnel');
  }

  /**
   * 📋 LIST FUNNELS - Listagem unificada
   */
  async listFunnels(params: QueryFunnelParams = {}): Promise<ConsolidatedFunnelData[]> {
    return this.executeWithMetrics(async () => {
      const userId = params.userId || this.currentUserId;
      if (!userId) {
        console.warn('⚠️ No user ID for listing funnels');
        return [];
      }

      let query = supabase
        .from('funnels')
        .select(`
          *,
          funnel_pages (*)
        `)
        .eq('user_id', userId);

      if (!params.includeUnpublished) {
        query = query.eq('is_published', true);
      }

      if (params.limit) {
        query = query.limit(params.limit);
      }

      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to list funnels: ${error.message}`);
      }

      // Transform to our format
      const funnels = (data || []).map((item: any): ConsolidatedFunnelData => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        category: 'quiz',
        context: FunnelContext.EDITOR,
        userId: item.user_id,
        settings: item.settings || {},
        pages: item.funnel_pages || [],
        isPublished: item.is_published || false,
        version: item.version || 1,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        templateId: item.settings?.templateId,
        isFromTemplate: !!item.settings?.templateId
      }));

      console.log(`✅ Listed ${funnels.length} funnels for user ${userId}`);
      return funnels;
    }, 'listFunnels');
  }

  /**
   * 📋 DUPLICATE FUNNEL - Duplicação unificada
   */
  async duplicateFunnel(funnelId: string, newName?: string): Promise<ConsolidatedFunnelData> {
    return this.executeWithMetrics(async () => {
      const originalFunnel = await this.getFunnel(funnelId);
      if (!originalFunnel) {
        throw new Error(`Funnel not found for duplication: ${funnelId}`);
      }

      // Create duplicate
      const duplicateParams: CreateFunnelParams = {
        name: newName || `${originalFunnel.name} (Cópia)`,
        description: originalFunnel.description,
        category: originalFunnel.category,
        context: originalFunnel.context,
        templateId: originalFunnel.templateId,
        userId: originalFunnel.userId,
        autoPublish: false
      };

      const duplicate = await this.createFunnel(duplicateParams);

      // Copy pages with deep clone
      const clonedPages = deepClone(originalFunnel.pages);
      await this.updateFunnel(duplicate.id, { pages: clonedPages });

      console.log('✅ Funnel duplicated successfully:', duplicate.id);
      return duplicate;
    }, 'duplicateFunnel');
  }

  /**
   * 🗑️ DELETE FUNNEL - Exclusão unificada
   */
  async deleteFunnel(funnelId: string): Promise<boolean> {
    return this.executeWithMetrics(async () => {
      // Delete pages first (foreign key constraint)
      await supabase
        .from('funnel_pages')
        .delete()
        .eq('funnel_id', funnelId);

      // Delete funnel
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', funnelId);

      if (error) {
        throw new Error(`Failed to delete funnel: ${error.message}`);
      }

      // Clear from cache
      this.cache.delete(funnelId);
      this.loadedFunnels.delete(funnelId);

      console.log('✅ Funnel deleted successfully:', funnelId);
      return true;
    }, 'deleteFunnel');
  }

  /**
   * 🛠️ UTILITY METHODS
   */
  private generateFunnelId(name: string): string {
    const sanitized = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    
    return `${sanitized}-${timestamp}-${random}`;
  }

  private getDefaultSettings(): any {
    return {
      theme: {
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        accentColor: '#28a745'
      },
      navigation: {
        allowBack: true,
        showProgress: true,
        autoAdvance: false
      },
      analytics: {
        enabled: true,
        trackingId: null
      },
      seo: {
        title: '',
        description: '',
        keywords: []
      }
    };
  }

  private async generateDefaultPages(templateId?: string): Promise<any[]> {
    if (!templateId) {
      return [{
        id: 'page-1',
        page_order: 1,
        page_type: 'step',
        title: 'Step 1',
        blocks: [],
        metadata: {}
      }];
    }

    // Load template pages using ConsolidatedTemplateService
    try {
      const { consolidatedTemplateService } = await import('./ConsolidatedTemplateService');
      const template = await consolidatedTemplateService.getTemplate(templateId);
      
      if (template && template.steps) {
        return template.steps.map((step) => ({
          id: `step-${step.stepNumber}`,
          page_order: step.stepNumber,
          page_type: 'step',
          title: `Step ${step.stepNumber}`,
          blocks: step.blocks || [],
          metadata: step.metadata || {}
        }));
      }
    } catch (error) {
      console.warn('⚠️ Failed to load template pages:', error);
    }

    return [{
      id: 'page-1',
      page_order: 1,
      page_type: 'step',
      title: 'Step 1',
      blocks: [],
      metadata: {}
    }];
  }

  /**
   * 📊 GET CACHE STATS
   */
  getCacheStats() {
    return {
      loaded: this.loadedFunnels.size,
      cached: this.cache.size,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private estimateMemoryUsage(): string {
    const funnels = Array.from(this.loadedFunnels.values());
    const totalSize = funnels.reduce((acc, funnel) => {
      return acc + JSON.stringify(funnel).length;
    }, 0);
    return `${(totalSize / 1024).toFixed(2)} KB`;
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const consolidatedFunnelService = new ConsolidatedFunnelService();

export default consolidatedFunnelService;