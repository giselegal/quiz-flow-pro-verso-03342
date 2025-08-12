// @ts-nocheck
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

export interface FunnelData {
  id: string;
  name: string;
  description?: string;
  userId?: string;
  isPublished: boolean;
  version: number;
  settings: Record<string, any>;
  pages: FunnelPage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FunnelPage {
  id: string;
  pageType: string;
  pageOrder: number;
  title: string;
  blocks: any[];
  metadata: Record<string, any>;
}

class FunnelPersistenceService {
  private readonly STORAGE_PREFIX = 'funnel_';

  // Save to localStorage as fallback
  private saveToLocalStorage(id: string, data: FunnelData): void {
    try {
      localStorage.setItem(`${this.STORAGE_PREFIX}${id}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  // Load from localStorage as fallback
  private loadFromLocalStorage(id: string): FunnelData | null {
    try {
      const data = localStorage.getItem(`${this.STORAGE_PREFIX}${id}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  // Save funnel with Supabase primary, localStorage fallback
  async saveFunnel(data: FunnelData): Promise<{ success: boolean; error?: string }> {
    try {
      // Save to Supabase first
      const { data: funnel, error: funnelError } = await supabase
        .from('funnels')
        .upsert({
          id: data.id,
          name: data.name,
          description: data.description,
          user_id: data.userId || null,
          is_published: data.isPublished,
          version: data.version,
          settings: data.settings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (funnelError) {
        console.error('Supabase funnel error:', funnelError);
        // Fallback to localStorage
        this.saveToLocalStorage(data.id, data);
        return {
          success: false,
          error: 'Failed to save to database, saved locally instead',
        };
      }

      // Save pages if they exist
      if (data.pages && data.pages.length > 0) {
        // Delete existing pages first
        await supabase.from('funnel_pages').delete().eq('funnel_id', data.id);

        // Insert new pages
        const pagesData = data.pages.map(page => ({
          id: page.id,
          funnel_id: data.id,
          page_type: page.pageType,
          page_order: page.pageOrder,
          title: page.title,
          blocks: page.blocks,
          metadata: page.metadata,
        }));

        const { error: pagesError } = await supabase.from('funnel_pages').insert(pagesData);

        if (pagesError) {
          console.error('Supabase pages error:', pagesError);
          this.saveToLocalStorage(data.id, data);
          return { success: false, error: 'Failed to save pages to database' };
        }
      }

      // Also save to localStorage for offline access
      this.saveToLocalStorage(data.id, data);

      return { success: true };
    } catch (error) {
      console.error('Error saving funnel:', error);
      // Fallback to localStorage
      this.saveToLocalStorage(data.id, data);
      return { success: false, error: 'Network error, saved locally' };
    }
  }

  // Load funnel with Supabase primary, localStorage fallback
  async loadFunnel(id: string): Promise<FunnelData | null> {
    try {
      // Try loading from Supabase first
      const { data: funnel, error } = await supabase
        .from('funnels')
        .select(
          `
          *,
          funnel_pages (*)
        `
        )
        .eq('id', id)
        .single();

      if (error || !funnel) {
        console.warn('Failed to load from Supabase, trying localStorage:', error);
        return this.loadFromLocalStorage(id);
      }

      // Transform data to expected format
      const transformedFunnel: FunnelData = {
        id: funnel.id,
        name: funnel.name,
        description: funnel.description || undefined,
        userId: funnel.user_id || undefined,
        isPublished: funnel.is_published || false,
        version: funnel.version || 1,
        settings: (funnel.settings as Record<string, any>) || {},
        pages:
          funnel.funnel_pages?.map((page: any) => ({
            id: page.id,
            pageType: page.page_type,
            pageOrder: page.page_order,
            title: page.title,
            blocks: page.blocks || [],
            metadata: page.metadata || {},
          })) || [],
        createdAt: funnel.created_at || undefined,
        updatedAt: funnel.updated_at || undefined,
      };

      // Also save to localStorage for offline access
      this.saveToLocalStorage(id, transformedFunnel);

      return transformedFunnel;
    } catch (error) {
      console.error('Error loading funnel:', error);
      return this.loadFromLocalStorage(id);
    }
  }

  // List all funnels
  async listFunnels(): Promise<FunnelData[]> {
    try {
      const { data: funnels, error } = await supabase
        .from('funnels')
        .select(
          `
          *,
          funnel_pages (*)
        `
        )
        .order('updated_at', { ascending: false });

      if (error || !funnels) {
        console.warn('Failed to load funnels from Supabase:', error);
        return [];
      }

      return funnels.map(funnel => ({
        id: funnel.id,
        name: funnel.name,
        description: funnel.description || undefined,
        userId: funnel.user_id || undefined,
        isPublished: funnel.is_published || false,
        version: funnel.version || 1,
        settings: (funnel.settings as Record<string, any>) || {},
        pages:
          funnel.funnel_pages?.map((page: any) => ({
            id: page.id,
            pageType: page.page_type || undefined,
            pageOrder: page.page_order,
            title: page.title || undefined,
            blocks: page.blocks || [],
            metadata: page.metadata || {},
          })) || [],
        createdAt: funnel.created_at || undefined,
        updatedAt: funnel.updated_at || undefined,
      }));
    } catch (error) {
      console.error('Error listing funnels:', error);
      return [];
    }
  }

  // Delete funnel
  async deleteFunnel(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('funnels').delete().eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        return { success: false, error: 'Failed to delete from database' };
      }

      // Also remove from localStorage
      localStorage.removeItem(`${this.STORAGE_PREFIX}${id}`);

      return { success: true };
    } catch (error) {
      console.error('Error deleting funnel:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Publish funnel
  async publishFunnel(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('funnels')
        .update({
          is_published: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Supabase publish error:', error);
        return { success: false, error: 'Failed to publish' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error publishing funnel:', error);
      return { success: false, error: 'Network error' };
    }
  }
}

export const funnelPersistenceService = new FunnelPersistenceService();
