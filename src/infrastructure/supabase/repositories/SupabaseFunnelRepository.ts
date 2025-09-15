// @ts-nocheck
/**
 * 🎯 SUPABASE FUNNEL REPOSITORY - Infrastructure Implementation
 * 
 * Implementação concreta para persistência de Funnels no Supabase.
 * Mapeia entidades Funnel, Page e Block para as tabelas do banco.
 */

import { supabase } from '@/integrations/supabase/client';
import { Funnel, Page, Block } from '@/core/domains';

interface SupabaseFunnel {
  id: string;
  name: string;
  description?: string | null;
  user_id: string;
  is_published: boolean;
  version: number;
  settings?: any;
  created_at: string;
  updated_at: string;
}

interface SupabaseFunnelPage {
  id: string;
  funnel_id: string;
  page_type: string;
  title?: string | null;
  page_order: number;
  blocks: any[];
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface FunnelRepository {
  save(funnel: Funnel): Promise<Funnel>;
  findById(id: string): Promise<Funnel | null>;
  findByUserId(userId: string): Promise<Funnel[]>;
  findPublished(): Promise<Funnel[]>;
  delete(id: string): Promise<boolean>;
  clone(id: string, newName?: string): Promise<Funnel>;
  
  // Page management
  savePage(page: Page): Promise<Page>;
  findPagesByFunnel(funnelId: string): Promise<Page[]>;
  deletePage(pageId: string): Promise<boolean>;
  
  // Block management
  saveBlocks(pageId: string, blocks: Block[]): Promise<Block[]>;
  findBlocksByPage(pageId: string): Promise<Block[]>;
}

export class SupabaseFunnelRepository implements FunnelRepository {
  
  // 🔍 Funnel Operations
  async save(funnel: Funnel): Promise<Funnel> {
    try {
      const funnelData: Partial<SupabaseFunnel> = {
        id: funnel.id,
        name: funnel.metadata.name,
        description: funnel.metadata.description,
        user_id: funnel.metadata.createdBy,
        is_published: funnel.metadata.isPublished,
        version: 1,
        settings: {
          ...funnel.settings,
          branding: funnel.branding,
          category: funnel.metadata.category,
          tags: funnel.metadata.tags,
          language: funnel.metadata.language,
          isTemplate: funnel.metadata.isTemplate,
          analytics: funnel.analytics
        }
      };

      const { error } = await supabase
        .from('funnels')
        .upsert(funnelData as any)
        .select()
        .single();

      if (error) throw error;

      // Sync pages if they exist
      if (funnel.pageIds.length > 0) {
        await this.syncFunnelPages(funnel);
      }

      return funnel;
    } catch (error) {
      console.error('Error saving funnel:', error);
      throw new Error(`Failed to save funnel: ${error}`);
    }
  }

  async findById(id: string): Promise<Funnel | null> {
    try {
      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      if (funnelError || !funnelData) return null;

      const { data: pagesData, error: pagesError } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', id)
        .order('page_order');

      if (pagesError) throw pagesError;

      return this.mapToFunnelEntity(funnelData as any, pagesData || []);
    } catch (error) {
      console.error('Error finding funnel by id:', error);
      return null;
    }
  }

  async findByUserId(userId: string): Promise<Funnel[]> {
    try {
      const { data: funnelsData, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const funnels = await Promise.all(
        (funnelsData || []).map(async (funnelData) => {
          const { data: pagesData } = await supabase
            .from('funnel_pages')
            .select('*')
            .eq('funnel_id', funnelData.id)
            .order('page_order');

          return this.mapToFunnelEntity(funnelData as any, pagesData || []);
        })
      );

      return funnels;
    } catch (error) {
      console.error('Error finding funnels by user:', error);
      return [];
    }
  }

  async findPublished(): Promise<Funnel[]> {
    try {
      const { data: funnelsData, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('is_published', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const funnels = await Promise.all(
        (funnelsData || []).map(async (funnelData) => {
          const { data: pagesData } = await supabase
            .from('funnel_pages')
            .select('*')
            .eq('funnel_id', funnelData.id)
            .order('page_order');

          return this.mapToFunnelEntity(funnelData as any, pagesData || []);
        })
      );

      return funnels;
    } catch (error) {
      console.error('Error finding published funnels:', error);
      return [];
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Delete pages first (cascade)
      await supabase
        .from('funnel_pages')
        .delete()
        .eq('funnel_id', id);

      // Delete funnel
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error deleting funnel:', error);
      return false;
    }
  }

  async clone(id: string, newName?: string): Promise<Funnel> {
    const originalFunnel = await this.findById(id);
    if (!originalFunnel) throw new Error('Funnel not found');

    const clonedFunnel = originalFunnel.clone(`${id}-copy`, newName);
    return this.save(clonedFunnel);
  }

  // 🔍 Page Operations
  async savePage(page: Page): Promise<Page> {
    try {
      const pageData: Partial<SupabaseFunnelPage> = {
        id: page.id,
        funnel_id: page.funnelId,
        page_type: page.type,
        title: page.title,
        page_order: page.metadata.order,
        blocks: page.blockIds.map(id => ({ id, type: 'reference' })), // Simplified
        metadata: {
          description: page.description,
          settings: page.settings,
          seo: page.seo,
          tracking: page.tracking,
          analytics: page.analytics,
          version: page.metadata.version
        }
      };

      const { error } = await supabase
        .from('funnel_pages')
        .upsert(pageData as any)
        .select()
        .single();

      if (error) throw error;

      return page;
    } catch (error) {
      console.error('Error saving page:', error);
      throw new Error(`Failed to save page: ${error}`);
    }
  }

  async findPagesByFunnel(funnelId: string): Promise<Page[]> {
    try {
      const { data, error } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', funnelId)
        .order('page_order');

      if (error) throw error;

      return (data || []).map(pageData => this.mapToPageEntity(pageData as any));
    } catch (error) {
      console.error('Error finding pages by funnel:', error);
      return [];
    }
  }

  async deletePage(pageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('funnel_pages')
        .delete()
        .eq('id', pageId);

      return !error;
    } catch (error) {
      console.error('Error deleting page:', error);
      return false;
    }
  }

  // 🔍 Block Operations (using component_instances)
  async saveBlocks(pageId: string, blocks: Block[]): Promise<Block[]> {
    try {
      // Delete existing blocks for this page
      await supabase
        .from('component_instances')
        .delete()
        .eq('stage_id', pageId);

      // Insert new blocks
      const blockData = blocks.map((block, index) => ({
        id: block.id,
        stage_id: pageId,
        funnel_id: block.pageId,
        instance_key: `block-${block.id}`,
        component_type_key: block.type,
        step_number: 1, // Simplified - all blocks in step 1
        order_index: index + 1,
        properties: {
          content: block.content,
          styles: block.styles,
          settings: block.settings,
          metadata: block.metadata
        },
        custom_styling: block.styles,
        is_active: block.settings.isVisible,
        is_template: block.metadata.isTemplate
      }));

      const { error } = await supabase
        .from('component_instances')
        .insert(blockData as any);

      if (error) throw error;

      return blocks;
    } catch (error) {
      console.error('Error saving blocks:', error);
      throw new Error(`Failed to save blocks: ${error}`);
    }
  }

  async findBlocksByPage(pageId: string): Promise<Block[]> {
    try {
      const { data, error } = await supabase
        .from('component_instances')
        .select('*')
        .eq('stage_id', pageId)
        .order('order_index');

      if (error) throw error;

      return (data || []).map(componentData => this.mapToBlockEntity(componentData));
    } catch (error) {
      console.error('Error finding blocks by page:', error);
      return [];
    }
  }

  // 🔍 Private Helper Methods
  private async syncFunnelPages(funnel: Funnel): Promise<void> {
    // Get existing pages
    const { data: existingPages } = await supabase
      .from('funnel_pages')
      .select('id')
      .eq('funnel_id', funnel.id);

    const existingPageIds = existingPages?.map(p => p.id) || [];
    
    // Remove pages that are no longer in the funnel
    const pagesToRemove = existingPageIds.filter(id => !funnel.pageIds.includes(id));
    if (pagesToRemove.length > 0) {
      await supabase
        .from('funnel_pages')
        .delete()
        .in('id', pagesToRemove);
    }

    // Create/update pages that should exist
    // This is simplified - in reality you'd need actual Page entities
    const missingPageIds = funnel.pageIds.filter(id => !existingPageIds.includes(id));
    if (missingPageIds.length > 0) {
      const placeholderPages = missingPageIds.map((id, index) => ({
        id,
        funnel_id: funnel.id,
        page_type: 'landing',
        title: `Page ${index + 1}`,
        page_order: index + 1,
        blocks: [],
        metadata: {}
      }));

      await supabase
        .from('funnel_pages')
        .insert(placeholderPages);
    }
  }

  private mapToFunnelEntity(funnelData: any, pagesData: any[]): Funnel {
    const settings = funnelData.settings || {};
    
    return new Funnel(
      funnelData.id,
      {
        name: funnelData.name,
        description: funnelData.description || undefined,
        category: settings.category || 'general',
        tags: settings.tags || [],
        templateId: settings.templateId,
        language: settings.language || 'pt-BR',
        isTemplate: settings.isTemplate || false,
        isPublished: funnelData.is_published,
        publishedAt: funnelData.is_published ? new Date(funnelData.updated_at) : undefined,
        createdAt: new Date(funnelData.created_at),
        updatedAt: new Date(funnelData.updated_at),
        createdBy: funnelData.user_id
      },
      {
        allowAnonymous: settings.allowAnonymous ?? true,
        collectEmail: settings.collectEmail ?? true,
        collectPhone: settings.collectPhone ?? false,
        requireEmailVerification: settings.requireEmailVerification ?? false,
        enableAnalytics: settings.enableAnalytics ?? true,
        enableABTesting: settings.enableABTesting ?? false,
        customDomain: settings.customDomain,
        seoTitle: settings.seoTitle,
        seoDescription: settings.seoDescription,
        seoKeywords: settings.seoKeywords || [],
        pixelId: settings.pixelId,
        conversionGoals: settings.conversionGoals || []
      },
      settings.branding || {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#F59E0B',
        fontFamily: 'Inter, sans-serif',
        theme: 'light'
      },
      pagesData.map(p => p.id),
      settings.analytics || {
        totalViews: 0,
        uniqueVisitors: 0,
        conversionRate: 0,
        averageTimeSpent: 0,
        exitRate: 0,
        topTrafficSources: {},
        deviceBreakdown: {},
        locationBreakdown: {}
      }
    );
  }

  private mapToPageEntity(pageData: any): Page {
    const metadata = pageData.metadata || {};
    
    return new Page(
      pageData.id,
      pageData.funnel_id,
      pageData.page_type as any,
      pageData.title || '',
      metadata.description || '',
      (pageData.blocks || []).map(b => b.id).filter(Boolean),
      metadata.settings || {
        slug: pageData.id,
        isActive: true,
        requireAuth: false,
        allowBack: true,
        showProgress: true
      },
      metadata.seo || {
        title: pageData.title || '',
        description: metadata.description || '',
        keywords: []
      },
      metadata.tracking || {
        pixelEvents: {},
        conversionGoals: [],
        heatmapEnabled: false,
        recordingEnabled: false
      },
      metadata.analytics || {
        views: 0,
        uniqueViews: 0,
        averageTimeSpent: 0,
        exitRate: 0,
        conversionRate: 0,
        interactions: {},
        topExitElements: [],
        deviceBreakdown: {}
      },
      {
        order: pageData.page_order,
        version: metadata.version || 1,
        createdAt: new Date(pageData.created_at),
        updatedAt: new Date(pageData.updated_at)
      }
    );
  }

  private mapToBlockEntity(componentData: any): Block {
    const properties = componentData.properties || {};
    
    return new Block(
      componentData.id,
      componentData.stage_id,
      componentData.component_type_key,
      properties.content || {},
      {
        ...componentData.custom_styling,
        ...properties.styles
      },
      {
        isVisible: componentData.is_active,
        ...properties.settings
      },
      {
        impressions: 0,
        clicks: 0,
        interactions: 0,
        conversionRate: 0,
        averageViewTime: 0
      },
      {
        order: componentData.order_index,
        version: 1,
        isTemplate: componentData.is_template,
        createdAt: new Date(componentData.created_at),
        updatedAt: new Date(componentData.updated_at)
      }
    );
  }
}