import { supabase } from '../lib/supabase';

// Interfaces
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

// Tipo auxiliar
export type FunnelData = Omit<FunnelSchema, 'pages'>;

// Serviço de Funnel
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
  public async createFunnel(data: Partial<FunnelSchema>): Promise<SaveFunnelResult> {
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

    } catch (error) {
      console.error('Erro ao criar funnel:', error);
      return {
        success: false,
        error: error.message
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

    } catch (error) {
      console.error('Erro ao salvar funnel:', error);
      return {
        success: false,
        error: error.message
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

    } catch (error) {
      console.error('Erro ao carregar funnel:', error);
      return {
        success: false,
        error: error.message
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

    } catch (error) {
      console.error('Erro ao deletar funnel:', error);
      return {
        success: false,
        error: error.message
      };
    }
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

    } catch (error) {
      console.error('Erro ao criar funnel:', error);
      return {
        success: false,
        error: error.message
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

    } catch (error) {
      console.error('Erro ao salvar funnel:', error);
      return {
        success: false,
        error: error.message
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

    } catch (error) {
      console.error('Erro ao carregar funnel:', error);
      return {
        success: false,
        error: error.message
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

    } catch (error) {
      console.error('Erro ao deletar funnel:', error);
      return {
        success: false,
        error: error.message
      };
    }
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
  error?: string;
}

interface DeleteFunnelResult {
  success: boolean;
  error?: string;
}

interface ListFunnelsResult {
  success: boolean;
  funnels?: any[];
  error?: string;
}

export const supabaseFunnelService = {
  /**
   * Salva ou atualiza um funil no Supabase
   */
  async saveFunnel(funnelData: any): Promise<SaveFunnelResult> {
    try {
      if (!funnelData) {
        return { success: false, error: 'No funnel data provided' };
      }

      console.log('💾 Salvando funil no Supabase:', funnelData.name || 'Unnamed Funnel');

      // Se tem ID, é uma atualização
      if (funnelData.id) {
        const { data, error } = await supabase
          .from('funnels')
          .update({
            name: funnelData.name || 'Unnamed Funnel',
            description: funnelData.description,
            settings: funnelData.settings || {},
            version: (funnelData.version || 1) + 1,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', funnelData.id)
          .select()
          .single();

        if (error) {
          console.error('❌ Erro ao atualizar funil:', error);
          return { success: false, error: error.message };
        }

        // Salvar páginas do funil
        if (funnelData.pages && Array.isArray(funnelData.pages)) {
          await this.saveFunnelPages(data.id, funnelData.pages);
        }

        console.log('✅ Funil atualizado com sucesso:', data.id);
        return { success: true, id: data.id };
      } else {
        // Nova criação
        const { data, error } = await supabase
          .from('funnels')
          .insert({
            name: funnelData.name || 'Unnamed Funnel',
            description: funnelData.description,
            settings: funnelData.settings || {},
            version: 1,
            isPublished: false,
          })
          .select()
          .single();

        if (error) {
          console.error('❌ Erro ao criar funil:', error);
          return { success: false, error: error.message };
        }

        // Salvar páginas do funil
        if (funnelData.pages && Array.isArray(funnelData.pages)) {
          await this.saveFunnelPages(data.id, funnelData.pages);
        }

        console.log('✅ Funil criado com sucesso:', data.id);
        return { success: true, id: data.id };
      }
    } catch (error: any) {
      console.error('❌ Erro inesperado ao salvar funil:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Salva as páginas de um funil
   */
  async saveFunnelPages(funnelId: string, pages: any[]): Promise<void> {
    try {
      // Primeiro, remove as páginas existentes
      await supabase
        .from('funnel_pages')
        .delete()
        .eq('funnel_id', funnelId);

      // Insere as novas páginas
      const pagesData = pages.map((page, index) => ({
        funnel_id: funnelId,
        page_type: page.type || 'quiz',
        page_order: index,
        title: page.title || `Page ${index + 1}`,
        blocks: page.blocks || [],
        metadata: page.metadata || {},
      }));

      if (pagesData.length > 0) {
        const { error } = await supabase
          .from('funnel_pages')
          .insert(pagesData);

        if (error) {
          console.error('❌ Erro ao salvar páginas do funil:', error);
        }
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao salvar páginas:', error);
    }
  },

  /**
   * Carrega um funil do Supabase
   */
  async loadFunnel(id: string): Promise<LoadFunnelResult> {
    try {
      if (!id) {
        return { success: false, error: 'No funnel ID provided' };
      }

      console.log('📥 Carregando funil do Supabase:', id);

      // Carrega o funil
      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      if (funnelError) {
        console.error('❌ Erro ao carregar funil:', funnelError);
        return { success: false, error: funnelError.message };
      }

      // Carrega as páginas do funil
      const { data: pagesData, error: pagesError } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', id)
        .order('page_order', { ascending: true });

      if (pagesError) {
        console.error('❌ Erro ao carregar páginas do funil:', pagesError);
        return { success: false, error: pagesError.message };
      }

      // Monta o objeto completo do funil
      const funnel = {
        id: funnelData.id,
        name: funnelData.name,
        description: funnelData.description,
        settings: funnelData.settings || {},
        version: funnelData.version,
        isPublished: funnelData.is_published,
        createdAt: funnelData.created_at,
        updatedAt: funnelData.updated_at,
        pages: pagesData.map(page => ({
          id: page.id,
          type: page.page_type,
          title: page.title,
          blocks: page.blocks || [],
          metadata: page.metadata || {},
        })),
      };

      console.log('✅ Funil carregado com sucesso:', funnel.name);
      return { success: true, funnel };
    } catch (error: any) {
      console.error('❌ Erro inesperado ao carregar funil:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Deleta um funil do Supabase
   */
  async deleteFunnel(id: string): Promise<DeleteFunnelResult> {
    try {
      if (!id) {
        return { success: false, error: 'No funnel ID provided' };
      }

      console.log('🗑️ Deletando funil do Supabase:', id);

      // O cascade delete cuidará das páginas automaticamente
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao deletar funil:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Funil deletado com sucesso');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Erro inesperado ao deletar funil:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Lista todos os funis do Supabase
   */
  async listFunnels(): Promise<ListFunnelsResult> {
    try {
      console.log('📋 Carregando lista de funis do Supabase');

      const { data, error } = await supabase
        .from('funnels')
        .select(`
          id,
          name,
          description,
          version,
          is_published,
          created_at,
          updated_at,
          funnel_pages(count)
        `)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao listar funis:', error);
        return { success: false, error: error.message };
      }

      const funnels = data.map(funnel => ({
        id: funnel.id,
        name: funnel.name,
        description: funnel.description,
        version: funnel.version,
        isPublished: funnel.is_published,
        createdAt: funnel.created_at,
        updatedAt: funnel.updated_at,
        pageCount: funnel.funnel_pages?.[0]?.count || 0,
      }));

      console.log(`✅ ${funnels.length} funis carregados com sucesso`);
      return { success: true, funnels };
    } catch (error: any) {
      console.error('❌ Erro inesperado ao listar funis:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Publica/despublica um funil
   */
  async toggleFunnelPublish(id: string, isPublished: boolean): Promise<SaveFunnelResult> {
    try {
      if (!id) {
        return { success: false, error: 'No funnel ID provided' };
      }

      console.log(`🚀 ${isPublished ? 'Publicando' : 'Despublicando'} funil:`, id);

      const { data, error } = await supabase
        .from('funnels')
        .update({ 
          is_published: isPublished,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao alterar status de publicação:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ Status de publicação alterado com sucesso`);
      return { success: true, id: data.id };
    } catch (error: any) {
      console.error('❌ Erro inesperado ao alterar publicação:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Salva resultados de quiz no Supabase
   */
  async saveQuizResult(resultData: any): Promise<SaveFunnelResult> {
    try {
      console.log('📊 Salvando resultado de quiz no Supabase');

      const { data, error } = await supabase
        .from('quiz_results')
        .insert({
          participant_id: resultData.participantId || `temp_${Date.now()}`,
          quiz_id: resultData.quizId,
          responses: resultData.responses || {},
          scores: resultData.scores || {},
          predominant_style: resultData.predominantStyle,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao salvar resultado do quiz:', error);
        return { success: false, error: error.message };
      }

      // Salvar participante se houver dados
      if (resultData.participant) {
        await this.saveQuizParticipant({
          ...resultData.participant,
          quizId: resultData.quizId,
        });
      }

      console.log('✅ Resultado do quiz salvo com sucesso:', data.id);
      return { success: true, id: data.id };
    } catch (error: any) {
      console.error('❌ Erro inesperado ao salvar resultado:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Salva participante do quiz
   */
  async saveQuizParticipant(participantData: any): Promise<SaveFunnelResult> {
    try {
      const { data, error } = await supabase
        .from('quiz_participants')
        .insert({
          name: participantData.name,
          email: participantData.email,
          quiz_id: participantData.quizId,
          utm_source: participantData.utmSource,
          utm_medium: participantData.utmMedium,
          utm_campaign: participantData.utmCampaign,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao salvar participante:', error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data.id };
    } catch (error: any) {
      console.error('❌ Erro inesperado ao salvar participante:', error);
      return { success: false, error: error.message };
    }
  },
};

  /**
   * Carregar funnel por ID
   */
  static async getFunnelById(id: string): Promise<{ success: boolean; error?: string; funnel?: FunnelSchema }> {
    try {
      console.log('📖 Carregando funnel do Supabase:', id);

      // 1. Carregar dados do funnel
      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      if (funnelError || !funnelData) {
        console.error('❌ Funnel não encontrado:', funnelError?.message || 'Não encontrado');
        return { success: false, error: funnelError?.message || 'Funnel não encontrado' };
      }

      // 2. Carregar páginas do funnel
      const { data: pagesData, error: pagesError } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', id)
        .order('page_order', { ascending: true });

      if (pagesError) {
        console.error('❌ Erro ao carregar páginas:', pagesError);
        // Continuar sem páginas se houver erro
      }

      // 3. Montar funnel completo
      const funnel: FunnelSchema = {
        id: funnelData.id,
        name: funnelData.name,
        description: funnelData.description,
        userId: funnelData.user_id,
        isPublished: funnelData.is_published,
        version: funnelData.version,
        settings: funnelData.settings,
        createdAt: funnelData.created_at,
        updatedAt: funnelData.updated_at,
        pages: pagesData?.map(page => ({
          id: page.id,
          funnelId: page.funnel_id,
          pageType: page.page_type,
          pageOrder: page.page_order,
          title: page.title,
          blocks: page.blocks || [],
          metadata: page.metadata,
          createdAt: page.created_at,
          updatedAt: page.updated_at
        })) || []
      };

      console.log('✅ Funnel carregado com sucesso:', funnel.name);
      return { success: true, funnel };

    } catch (error) {
      console.error('❌ Erro inesperado ao carregar funnel:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  /**
   * Listar todos os funnels do usuário
   */
  static async listFunnels(userId?: string): Promise<{ success: boolean; error?: string; funnels?: FunnelData[] }> {
    try {
      console.log('📋 Listando funnels do Supabase');

      let query = supabase.from('funnels').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: funnelsData, error } = await query.order('updated_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao listar funnels:', error);
        return { success: false, error: error.message };
      }

      const funnels: FunnelData[] = funnelsData?.map(funnel => ({
        id: funnel.id,
        name: funnel.name,
        description: funnel.description,
        userId: funnel.user_id,
        isPublished: funnel.is_published,
        version: funnel.version,
        settings: funnel.settings,
        createdAt: funnel.created_at,
        updatedAt: funnel.updated_at
      })) || [];

      console.log(`✅ ${funnels.length} funnels carregados`);
      return { success: true, funnels };

    } catch (error) {
      console.error('❌ Erro inesperado ao listar funnels:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  /**
   * Deletar funnel
   */
  static async deleteFunnel(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🗑️ Deletando funnel do Supabase:', id);

      // Deletar funnel (páginas serão deletadas automaticamente por CASCADE)
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao deletar funnel:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Funnel deletado com sucesso');
      return { success: true };

    } catch (error) {
      console.error('❌ Erro inesperado ao deletar funnel:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  /**
   * Criar um novo funnel vazio
   */
  static async createNewFunnel(name?: string, userId?: string): Promise<{ success: boolean; error?: string; funnel?: FunnelSchema }> {
    try {
      const funnelId = this.generateId();
      
      const newFunnel: FunnelSchema = {
        id: funnelId,
        name: name || `Novo Funnel ${new Date().toLocaleDateString()}`,
        description: 'Funnel criado automaticamente',
        userId,
        isPublished: false,
        version: 1,
        settings: {},
        pages: []
      };

      console.log('🆕 Criando novo funnel:', newFunnel.name);
      return await this.saveFunnel(newFunnel);

    } catch (error) {
      console.error('❌ Erro ao criar funnel:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  /**
   * Publicar funnel
   */
  static async publishFunnel(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🚀 Publicando funnel:', id);

      const { error } = await supabase
        .from('funnels')
        .update({ 
          is_published: true, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao publicar funnel:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Funnel publicado com sucesso');
      return { success: true };

    } catch (error) {
      console.error('❌ Erro inesperado ao publicar funnel:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }
}
