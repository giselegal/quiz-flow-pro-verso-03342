// @ts-nocheck
// @/services/ComponentsService.ts

// ============================================================================
// 📦 IMPORTS
// ============================================================================
import { getSupabaseClient } from '@/integrations/supabase/supabaseLazy';

// ============================================================================
// ⚙️ CONFIGURAÇÃO DO SUPABASE
// ============================================================================
// Lazy client cache dentro do módulo
let supabase: any | null = null;
const ensureClient = async () => {
  if (supabase) return supabase;
  try {
    supabase = await getSupabaseClient();
  } catch (e) {
    console.warn('ComponentsService: Supabase indisponível, operações retornam defaults.');
    supabase = null;
  }
  return supabase;
};

// ============================================================================
// 📑 INTERFACES E TIPOS
// ============================================================================
export interface Block {
  id: string;
  type: string;
  content: any;
  properties?: any;
  order?: number;
  metadata?: {
    database_id?: string;
    stage_key?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface ComponentInstance {
  id: string;
  instance_key: string;
  type_key: string;
  stage_key: string;
  stage_order: number;
  content: any;
  properties: any;
  created_at: string;
  updated_at: string;
}

export interface ComponentType {
  id: string;
  type_key: string;
  type_name: string;
  category: string;
  description?: string;
  default_content: any;
  default_properties: any;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 🛠️ CLASSE DE SERVIÇO PRINCIPAL
// ============================================================================
export class ComponentsService {
  private static isOnline = true;

  /**
   * Define o estado online/offline do serviço.
   * @param online Status booleano do serviço
   */
  public static setOnlineStatus(online: boolean): void {
    this.isOnline = online;
    console.log(`Serviço agora está ${online ? 'online' : 'offline'}`);
  }

  /**
   * Carrega todos os blocos de uma stage específica do banco de dados.
   * @param stageKey A chave única da stage.
   * @returns Uma Promise que resolve para um array de blocos.
   */
  public static async loadStageBlocks(stageKey: string): Promise<Block[]> {
    try {
      if (!this.isOnline) throw new Error('Serviço offline');

      const client = await ensureClient();
      if (!client) return [];
      const query = client
        .from('component_instances')
        .select(
          `
          *,
          component_types!inner(
            type_key,
            type_name,
            category,
            default_content,
            default_properties
          )
        `
        )
        .eq('stage_key', stageKey)
        .order('stage_order', { ascending: true }) as any;

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao carregar blocos:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((instance: any) => ({
        id: instance.instance_key,
        type: instance.component_types.type_key,
        content: instance.content || instance.component_types.default_content,
        properties: instance.properties || instance.component_types.default_properties,
        order: instance.stage_order,
        metadata: {
          database_id: instance.id,
          stage_key: instance.stage_key,
          created_at: instance.created_at,
          updated_at: instance.updated_at,
        },
      }));
    } catch (error) {
      console.error('Erro ao carregar blocos da stage:', error);
      return [];
    }
  }

  /**
   * Sincroniza todos os blocos de uma stage com o banco de dados, substituindo os existentes.
   * @param stageKey A chave da stage.
   * @param blocks Array de blocos para sincronizar.
   * @returns Uma Promise que resolve para um booleano indicando o sucesso da operação.
   */
  public static async syncStage(stageKey: string, blocks: Block[]): Promise<boolean> {
    try {
      if (!this.isOnline) throw new Error('Serviço offline');

  const client = await ensureClient();
  if (!client) return false;
  await client.from('component_instances').delete().eq('stage_key', stageKey);

      const instances = blocks.map((block, index) => ({
        instance_key: block.id,
        type_key: block.type,
        stage_key: stageKey,
        stage_order: block.order || index + 1,
        content: block.content,
        properties: block.properties,
      }));

      if (instances.length > 0) {
  const { error } = await client.from('component_instances').insert(instances);
        if (error) {
          console.error('Erro ao sincronizar stage:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Erro ao sincronizar stage:', error);
      return false;
    }
  }

  /**
   * Cria um novo bloco no banco de dados para uma stage específica.
   * @param stageKey A chave da stage.
   * @param typeKey A chave do tipo de componente.
   * @param content Conteúdo inicial do bloco.
   * @param properties Propriedades iniciais do bloco.
   * @returns Uma Promise que resolve para a `instanceKey` do novo bloco ou `null` em caso de erro.
   */
  public static async createBlock(
    stageKey: string,
    typeKey: string,
    content?: any,
    properties?: any
  ): Promise<string | null> {
    try {
      if (!this.isOnline) throw new Error('Serviço offline');

      const client = await ensureClient();
      if (!client) return null;
      const componentQuery = client
        .from('component_types')
        .select('*')
        .eq('type_key', typeKey)
        .single() as any;

      const { data: componentType, error: typeError } = await componentQuery;

      if (typeError || !componentType) {
        console.error('Tipo de componente não encontrado:', typeKey);
        return null;
      }

      // 2. Gera uma chave única para a instância
      const { data: result, error } = await client.rpc('generate_instance_key', {
        p_type_key: typeKey,
        p_stage_key: stageKey,
      });

      if (error || !result) {
        console.error('Erro ao gerar instance_key:', error);
        return null;
      }

      const instanceKey = result as string;

      const orderQuery = client
        .from('component_instances')
        .select('stage_order')
        .eq('stage_key', stageKey)
        .order('stage_order', { ascending: false })
        .limit(1) as any;

      const { data: maxOrder } = await orderQuery;

      const nextOrder = (maxOrder?.[0]?.stage_order || 0) + 1;

      // 4. Insere a nova instância no banco
      const { error: insertError } = await client.from('component_instances').insert({
        instance_key: instanceKey,
        type_key: typeKey,
        stage_key: stageKey,
        stage_order: nextOrder,
        content: content || componentType.default_content,
        properties: properties || componentType.default_properties,
      });

      if (insertError) {
        console.error('Erro ao criar bloco:', insertError);
        return null;
      }

      return instanceKey;
    } catch (error) {
      console.error('Erro ao criar bloco:', error);
      return null;
    }
  }

  /**
   * Atualiza um bloco existente com novos dados.
   * @param instanceKey A chave da instância do bloco.
   * @param updates Objeto com os dados a serem atualizados.
   * @returns Uma Promise que resolve para um booleano indicando o sucesso da operação.
   */
  public static async updateBlock(
    instanceKey: string,
    updates: Partial<Pick<Block, 'content' | 'properties' | 'order'>>
  ): Promise<boolean> {
    try {
      const updateData: any = {};
      if (updates.content !== undefined) {
        updateData.content = updates.content;
      }
      if (updates.properties !== undefined) {
        updateData.properties = updates.properties;
      }
      if (updates.order !== undefined) {
        updateData.stage_order = updates.order;
      }

      const client = await ensureClient();
      if (!client) return false;
      const { error } = await client
        .from('component_instances')
        .update(updateData)
        .eq('instance_key', instanceKey);

      if (error) {
        console.error('Erro ao atualizar bloco:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar bloco:', error);
      return false;
    }
  }

  /**
   * Remove um bloco do banco de dados.
   * @param instanceKey A chave da instância do bloco a ser removido.
   * @returns Uma Promise que resolve para um booleano indicando o sucesso da operação.
   */
  public static async deleteBlock(instanceKey: string): Promise<boolean> {
    try {
      const client = await ensureClient();
      if (!client) return false;
      const { error } = await client
        .from('component_instances')
        .delete()
        .eq('instance_key', instanceKey);

      if (error) {
        console.error('Erro ao deletar bloco:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar bloco:', error);
      return false;
    }
  }

  /**
   * Lista todos os tipos de componentes disponíveis no banco.
   * @returns Uma Promise que resolve para um array de tipos de componentes.
   */
  public static async getComponentTypes(): Promise<ComponentType[]> {
    try {
  const client = await ensureClient();
  if (!client) return [];
  const query = client.from('component_types').select('*') as any;

      const queryWithOrder = query
        .order('category', { ascending: true })
        .order('type_name', { ascending: true });

      const { data, error } = await queryWithOrder;

      if (error) {
        console.error('Erro ao carregar tipos de componentes:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao carregar tipos de componentes:', error);
      return [];
    }
  }

  /**
   * Verifica se uma stage existe no banco de dados.
   * @param stageKey A chave da stage.
   * @returns Uma Promise que resolve para `true` se a stage existir, `false` caso contrário.
   */
  public static async stageExists(stageKey: string): Promise<boolean> {
    try {
      const client = await ensureClient();
      if (!client) return false;
      const query = client
        .from('component_instances')
        .select('id')
        .eq('stage_key', stageKey)
        .limit(1) as any;

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao verificar stage:', error);
        return false;
      }

      return (data && data.length > 0) || false;
    } catch (error) {
      console.error('Erro ao verificar stage:', error);
      return false;
    }
  }

  /**
   * Lista todas as stages que contêm pelo menos um componente.
   * @returns Uma Promise que resolve para um array de chaves de stages.
   */
  public static async getStagesWithComponents(): Promise<string[]> {
    try {
      const client = await ensureClient();
      if (!client) return [];
      const query = client
        .from('component_instances')
        .select('stage_key')
        .order('stage_key', { ascending: true }) as any;

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao carregar stages:', error);
        return [];
      }

      // Remove duplicatas usando Set
      const stageKeys = Array.from(
        new Set((data?.map((item: any) => item.stage_key) || []) as string[])
      );
      return stageKeys;
    } catch (error) {
      console.error('Erro ao carregar stages:', error);
      return [];
    }
  }
}

export default ComponentsService;
