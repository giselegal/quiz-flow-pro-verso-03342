import { supabase } from '../lib/supabase';

// Interfaces e tipos - devem estar fora da classe
export interface FunnelSchema {
  id: string;
  name: string;
  description?: string;
  userId?: string;
  isPublished: boolean;
  version: number;
  settings?: any;
  createdAt?: string;
  updatedAt?: string;
  pages: FunnelPage[];
}

export interface FunnelPage {
  id: string;
  funnelId: string;
  pageType: string;
  pageOrder: number;
  title?: string;
  blocks: any[];
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveFunnelResult {
  success: boolean;
  id?: string;
  error?: string;
}

export interface LoadFunnelResult {
  success: boolean;
  funnel?: FunnelSchema;
  error?: string;
}

export type FunnelData = Omit<FunnelSchema, 'pages'>;

// Serviço principal
export class SupabaseFunnelService {
  /**
   * Gerar um novo ID único para o funnel
   */
  private static generateId(): string {
    return 'funnel_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Criar um novo funnel
   */
  async createFunnel(data: Partial<FunnelSchema>): Promise<SaveFunnelResult> {
    try {
      const newFunnel: FunnelSchema = {
        id: SupabaseFunnelService.generateId(),
        name: data.name || 'Novo Funnel',
        description: data.description || '',
        userId: data.userId,
        isPublished: false,
        version: 1,
        settings: data.settings || {},
        pages: data.pages || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return this.saveFunnel(newFunnel);

    } catch (error: any) {
      console.error('Erro ao criar funnel:', error);
      return {
        success: false,
        error: error?.message || 'Erro desconhecido ao criar funnel'
      };
    }
  }

  /**
   * Salvar funnel completo (dados + páginas)
   */
  async saveFunnel(funnel: FunnelSchema): Promise<SaveFunnelResult> {
    try {
      // Preparar dados do funnel
      const funnelData: FunnelData = {
        id: funnel.id,
        name: funnel.name,
        description: funnel.description,
        userId: funnel.userId,
        isPublished: funnel.isPublished,
        version: funnel.version,
        settings: funnel.settings,
        updatedAt: new Date().toISOString()
      };

      // Salvar ou atualizar funnel
      const { data: savedFunnel, error: funnelError } = await supabase
        .from('funnels')
        .upsert(funnelData)
        .select()
        .single();

      if (funnelError) throw funnelError;

      // Preparar páginas
      const pages = funnel.pages.map(p => ({
        id: p.id,
        funnel_id: funnel.id,
        page_type: p.pageType,
        page_order: p.pageOrder,
        title: p.title,
        blocks: JSON.stringify(p.blocks),
        metadata: p.metadata,
        updated_at: new Date().toISOString()
      }));

      // Salvar páginas
      const { error: pagesError } = await supabase
        .from('funnel_pages')
        .upsert(pages);

      if (pagesError) throw pagesError;

      return {
        success: true,
        id: savedFunnel.id
      };

    } catch (error: any) {
      console.error('Erro ao salvar funnel:', error);
      return {
        success: false,
        error: error?.message || 'Erro desconhecido ao salvar funnel'
      };
    }
  }

  /**
   * Recuperar um funnel por ID
   */
  async loadFunnel(id: string): Promise<LoadFunnelResult> {
    try {
      // Buscar dados do funnel
      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      if (funnelError) throw funnelError;

      // Buscar páginas do funnel
      const { data: pages, error: pagesError } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', id)
        .order('page_order');

      if (pagesError) throw pagesError;

      // Montar objeto completo
      const funnel: FunnelSchema = {
        ...funnelData,
        pages: pages.map(p => ({
          ...p,
          funnelId: p.funnel_id,
          pageOrder: p.page_order,
          pageType: p.page_type,
          blocks: JSON.parse(p.blocks || '[]')
        }))
      };

      return { 
        success: true, 
        funnel 
      };

    } catch (error: any) {
      console.error('Erro ao carregar funnel:', error);
      return {
        success: false,
        error: error?.message || 'Erro desconhecido ao carregar funnel'
      };
    }
  }

  /**
   * Deletar um funnel por ID
   */
  async deleteFunnel(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };

    } catch (error: any) {
      console.error('Erro ao deletar funnel:', error);
      return {
        success: false,
        error: error?.message || 'Erro desconhecido ao deletar funnel'
      };
    }
  }
}
