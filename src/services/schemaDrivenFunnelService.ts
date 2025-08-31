import { supabase } from '@/integrations/supabase/client';
import {
  type InsertFunnel,
  type InsertFunnelPage,
  type UpdateFunnel,
  type AutoSaveState,
  type FunnelVersion,
  generateUuid,
  FUNNEL_PAGE_TYPES,
} from '@/types/unified-schema';

export interface SchemaDrivenFunnelData {
  id: string;
  name: string;
  description: string;
  pages: any[]; // Using any[] to avoid FunnelPage type conflicts
  theme?: string;
  isPublished?: boolean;
  version?: number;
  config?: any;
  createdAt?: Date;
  lastModified?: Date;
  user_id?: string;
}

export interface SchemaDrivenPageData {
  id: string;
  name: string;
  title: string;
  type: string;
  order: number;
  blocks: any[];
  funnel_id: string;
}

// Re-export types from unified schema for backward compatibility
export type { AutoSaveState, FunnelVersion };

export const schemaDrivenFunnelService = {
  async createFunnel(funnel: Partial<SchemaDrivenFunnelData>): Promise<SchemaDrivenFunnelData> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const funnelData: InsertFunnel = {
        // let DB generate UUID for funnels.id to comply with FK references
        name: funnel.name || 'Novo Funil',
        description: funnel.description || '',
        user_id: user.id,
        is_published: funnel.isPublished || false,
        version: funnel.version || 1,
        settings: {
          theme: funnel.theme,
          config: funnel.config || {},
        },
      };

      const { data, error } = await supabase.from('funnels').insert([funnelData]).select().single();

      if (error) throw error;

      // Criar páginas se existirem
      if (funnel.pages && funnel.pages.length > 0) {
        const pagesData: InsertFunnelPage[] = funnel.pages.map((page, index) => {
          const type = (page as any).type as string | undefined;
          const validTypes = Object.values(FUNNEL_PAGE_TYPES) as string[];
          const normalizedType =
            type && typeof type === 'string' && validTypes.includes(type)
              ? (type as (typeof FUNNEL_PAGE_TYPES)[keyof typeof FUNNEL_PAGE_TYPES])
              : FUNNEL_PAGE_TYPES.QUESTION; // default to a valid page_type
          return {
            id: generateUuid(),
            funnel_id: data.id,
            page_type: normalizedType,
            page_order: index,
            title: (page as any).title || (page as any).name || `Página ${index + 1}`,
            blocks: Array.isArray((page as any).blocks) ? (page as any).blocks : [],
          };
        });

        await supabase.from('funnel_pages').insert(pagesData);
      }

      const settings = (data.settings as any) || {};

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        pages: funnel.pages || [],
        theme: settings.theme,
        isPublished: data.is_published || false,
        version: data.version || 1,
        config: settings.config || {},
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        lastModified: data.updated_at ? new Date(data.updated_at) : new Date(),
        user_id: data.user_id || '',
      };
    } catch (error) {
      console.error('Erro ao criar funil:', error);
      throw error;
    }
  },

  async updateFunnel(
    id: string,
    updates: Partial<SchemaDrivenFunnelData>
  ): Promise<SchemaDrivenFunnelData | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const updateData: Partial<UpdateFunnel> = {};

      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.isPublished !== undefined) updateData.is_published = updates.isPublished;
      if (updates.version !== undefined) updateData.version = updates.version;

      if (updates.theme || updates.config) {
        const { data: currentFunnel } = await supabase
          .from('funnels')
          .select('settings')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        const currentSettings = (currentFunnel?.settings as any) || {};
        updateData.settings = {
          ...currentSettings,
          ...(updates.theme && { theme: updates.theme }),
          ...(updates.config && { config: updates.config }),
        };
      }

      const { data, error } = await supabase
        .from('funnels')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      // Buscar páginas do funil
      const { data: pages } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', id)
        .order('page_order');

      const settings = (data.settings as any) || {};

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        pages: pages || [],
        theme: settings.theme,
        isPublished: data.is_published || false,
        version: data.version || 1,
        config: settings.config || {},
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        lastModified: data.updated_at ? new Date(data.updated_at) : new Date(),
        user_id: data.user_id || '',
      };
    } catch (error) {
      console.error('Erro ao atualizar funil:', error);
      return null;
    }
  },

  async getFunnel(id: string): Promise<SchemaDrivenFunnelData | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: funnel, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (!funnel) return null;

      // Buscar páginas do funil
      const { data: pages } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', id)
        .order('page_order');

      const settings = (funnel.settings as any) || {};

      return {
        id: funnel.id,
        name: funnel.name,
        description: funnel.description || '',
        pages: pages || [],
        theme: settings.theme,
        isPublished: funnel.is_published || false,
        version: funnel.version || 1,
        config: settings.config || {},
        createdAt: funnel.created_at ? new Date(funnel.created_at) : new Date(),
        lastModified: funnel.updated_at ? new Date(funnel.updated_at) : new Date(),
        user_id: funnel.user_id || '',
      };
    } catch (error) {
      console.error('Erro ao buscar funil:', error);
      return null;
    }
  },

  async listFunnels(): Promise<SchemaDrivenFunnelData[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: funnels, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (funnels || []).map(funnel => {
        const settings = (funnel.settings as any) || {};
        return {
          id: funnel.id,
          name: funnel.name,
          description: funnel.description || '',
          pages: [],
          theme: settings.theme,
          isPublished: funnel.is_published || false,
          version: funnel.version || 1,
          config: settings.config || {},
          createdAt: funnel.created_at ? new Date(funnel.created_at) : new Date(),
          lastModified: funnel.updated_at ? new Date(funnel.updated_at) : new Date(),
          user_id: funnel.user_id || '',
        };
      });
    } catch (error) {
      console.error('Erro ao listar funis:', error);
      return [];
    }
  },

  async deleteFunnel(id: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Deletar páginas primeiro (devido à relação)
      await supabase.from('funnel_pages').delete().eq('funnel_id', id);

      // Deletar funil
      const { error } = await supabase.from('funnels').delete().eq('id', id).eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar funil:', error);
      return false;
    }
  },

  async saveFunnel(funnel: Partial<SchemaDrivenFunnelData>): Promise<SchemaDrivenFunnelData> {
    if (funnel.id) {
      const updated = await this.updateFunnel(funnel.id, funnel);
      if (updated) return updated;
    }
    return this.createFunnel(funnel);
  },

  async loadFunnel(id: string): Promise<SchemaDrivenFunnelData | null> {
    return this.getFunnel(id);
  },

  async updatePage(pageId: string, updates: Partial<SchemaDrivenPageData>): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.blocks !== undefined) updateData.blocks = updates.blocks;
      if (updates.order !== undefined) updateData.page_order = updates.order;

      const { error } = await supabase.from('funnel_pages').update(updateData).eq('id', pageId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar página:', error);
      return false;
    }
  },

  async createPage(
    funnelId: string,
    page: Partial<SchemaDrivenPageData>
  ): Promise<SchemaDrivenPageData | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const fallbackType = FUNNEL_PAGE_TYPES.QUESTION;
      const selectedType =
        page.type && Object.values(FUNNEL_PAGE_TYPES).includes(page.type as any)
          ? (page.type as any)
          : fallbackType;
      const pageData: InsertFunnelPage = {
        id: generateUuid(),
        funnel_id: funnelId,
        page_type: selectedType,
        page_order: page.order ?? 0,
        title: page.title || page.name || 'Nova Página',
        blocks: Array.isArray(page.blocks) ? page.blocks : [],
      };

      const { data, error } = await supabase
        .from('funnel_pages')
        .insert([pageData])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.title || '',
        title: data.title || '',
        type: data.page_type,
        order: data.page_order,
        blocks: (data.blocks as any) || [],
        funnel_id: data.funnel_id,
      };
    } catch (error) {
      console.error('Erro ao criar página:', error);
      return null;
    }
  },
};

export default schemaDrivenFunnelService;
