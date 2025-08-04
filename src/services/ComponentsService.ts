/**
 * 🎯 SERVIÇO DE INTEGRAÇÃO ENTRE EDITOR E BANCO DE DADOS
 * Conecta o EditorContext com o sistema de componentes reutilizáveis do Supabase
 */

// Configuração de ambiente compatível com navegador
const env = {
  // Valores padrão ou carregados de variáveis de ambiente durante o build
  API_URL: import.meta.env?.VITE_API_URL || "https://api.default.com",
  API_KEY: import.meta.env?.VITE_API_KEY || "",
  DEBUG: import.meta.env?.VITE_DEBUG === "true",
  // Adicione outras variáveis de ambiente necessárias aqui
};

import { createClient } from "@supabase/supabase-js";

// ============================================================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================================================

// Verifique se as variáveis de ambiente do Supabase existem
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Criando um cliente real ou simulado com base na disponibilidade das credenciais
const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : createMockSupabaseClient();

// Função para criar um cliente Supabase simulado
function createMockSupabaseClient() {
  console.warn(
    "⚠️ Usando cliente Supabase simulado! Configure as variáveis de ambiente para usar o cliente real."
  );

  // Implementação simulada para testes locais
  return {
    from: (table: string) => ({
      select: (query?: string) => ({
        eq: (column: string, value: any) => ({
          order: (column: string, { ascending }: { ascending: boolean }) => ({
            limit: (num: number) => ({
              single: () => Promise.resolve({ data: null, error: null }),
              then: (callback: Function) => Promise.resolve(callback({ data: [], error: null })),
            }),
            then: (callback: Function) => Promise.resolve(callback({ data: [], error: null })),
          }),
          limit: (num: number) => ({
            then: (callback: Function) => Promise.resolve(callback({ data: [], error: null })),
          }),
          then: (callback: Function) => Promise.resolve(callback({ data: [], error: null })),
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          then: (callback: Function) => Promise.resolve(callback({ data: [], error: null })),
        }),
        then: (callback: Function) => Promise.resolve(callback({ data: [], error: null })),
      }),
      insert: (data: any) => Promise.resolve({ data: null, error: null }),
      update: (data: any) => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      }),
    }),
    rpc: (func: string, params: any) =>
      Promise.resolve({ data: `mock-id-${Date.now()}`, error: null }),
  };
}

// ============================================================================
// TIPOS PARA COMPONENTES DO BANCO
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
// CLASSE DE SERVIÇO PRINCIPAL
// ============================================================================

export class ComponentsService {
  // Transformando a propriedade isOnline em estática
  private static isOnline = true;

  /**
   * Carrega blocos de uma stage específica do banco de dados
   */
  static async loadStageBlocks(stageKey: string): Promise<Block[]> {
    try {
      if (!this.isOnline) throw new Error("Serviço offline");

      const { data, error } = await supabase
        .from("component_instances")
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
        .eq("stage_key", stageKey)
        .order("stage_order", { ascending: true });

      if (error) {
        console.error("Erro ao carregar blocos:", error);
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
      console.error("Erro ao carregar blocos da stage:", error);
      return [];
    }
  }

  /**
   * Sincroniza blocos de uma stage com o banco de dados
   */
  static async syncStage(stageKey: string, blocks: Block[]): Promise<boolean> {
    try {
      if (!this.isOnline) throw new Error("Serviço offline");

      // Remove instâncias existentes da stage
      await supabase.from("component_instances").delete().eq("stage_key", stageKey);

      // Insere novas instâncias
      const instances = blocks.map((block, index) => ({
        instance_key: block.id,
        type_key: block.type,
        stage_key: stageKey,
        stage_order: block.order || index + 1,
        content: block.content,
        properties: block.properties,
      }));

      if (instances.length > 0) {
        const { error } = await supabase.from("component_instances").insert(instances);

        if (error) {
          console.error("Erro ao sincronizar stage:", error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Erro ao sincronizar stage:", error);
      return false;
    }
  }

  /**
   * Cria um novo bloco no banco de dados
   */
  static async createBlock(
    stageKey: string,
    typeKey: string,
    content?: any,
    properties?: any
  ): Promise<string | null> {
    try {
      if (!this.isOnline) throw new Error("Serviço offline");

      // Busca o tipo do componente
      const { data: componentType, error: typeError } = await supabase
        .from("component_types")
        .select("*")
        .eq("type_key", typeKey)
        .single();

      if (typeError || !componentType) {
        console.error("Tipo de componente não encontrado:", typeKey);
        return null;
      }

      // Gera instance_key automaticamente
      const { data: result, error } = await supabase.rpc("generate_instance_key", {
        p_type_key: typeKey,
        p_stage_key: stageKey,
      });

      if (error || !result) {
        console.error("Erro ao gerar instance_key:", error);
        return null;
      }

      const instanceKey = result;

      // Calcula a próxima ordem
      const { data: maxOrder } = await supabase
        .from("component_instances")
        .select("stage_order")
        .eq("stage_key", stageKey)
        .order("stage_order", { ascending: false })
        .limit(1);

      const nextOrder = (maxOrder?.[0]?.stage_order || 0) + 1;

      // Insere a nova instância
      const { error: insertError } = await supabase.from("component_instances").insert({
        instance_key: instanceKey,
        type_key: typeKey,
        stage_key: stageKey,
        stage_order: nextOrder,
        content: content || componentType.default_content,
        properties: properties || componentType.default_properties,
      });

      if (insertError) {
        console.error("Erro ao criar bloco:", insertError);
        return null;
      }

      return instanceKey;
    } catch (error) {
      console.error("Erro ao criar bloco:", error);
      return null;
    }
  }

  /**
   * Atualiza um bloco existente
   */
  static async updateBlock(
    instanceKey: string,
    updates: Partial<Pick<Block, "content" | "properties" | "order">>
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

      const { error } = await supabase
        .from("component_instances")
        .update(updateData)
        .eq("instance_key", instanceKey);

      if (error) {
        console.error("Erro ao atualizar bloco:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao atualizar bloco:", error);
      return false;
    }
  }

  /**
   * Remove um bloco
   */
  static async deleteBlock(instanceKey: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("component_instances")
        .delete()
        .eq("instance_key", instanceKey);

      if (error) {
        console.error("Erro ao deletar bloco:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao deletar bloco:", error);
      return false;
    }
  }

  /**
   * Lista todos os tipos de componentes disponíveis
   */
  static async getComponentTypes(): Promise<ComponentType[]> {
    try {
      const { data, error } = await supabase
        .from("component_types")
        .select("*")
        .order("category", { ascending: true })
        .order("type_name", { ascending: true });

      if (error) {
        console.error("Erro ao carregar tipos de componentes:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Erro ao carregar tipos de componentes:", error);
      return [];
    }
  }

  /**
   * Verifica se uma stage existe no banco
   */
  static async stageExists(stageKey: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("component_instances")
        .select("id")
        .eq("stage_key", stageKey)
        .limit(1);

      if (error) {
        console.error("Erro ao verificar stage:", error);
        return false;
      }

      return (data && data.length > 0) || false;
    } catch (error) {
      console.error("Erro ao verificar stage:", error);
      return false;
    }
  }

  /**
   * Lista todas as stages com componentes
   */
  static async getStagesWithComponents(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("component_instances")
        .select("stage_key")
        .order("stage_key", { ascending: true });

      if (error) {
        console.error("Erro ao carregar stages:", error);
        return [];
      }

      // Remove duplicatas
      const stageKeys = Array.from(new Set(data?.map(item => item.stage_key) || []));
      return stageKeys;
    } catch (error) {
      console.error("Erro ao carregar stages:", error);
      return [];
    }
  }

  /**
   * Define o estado online/offline do serviço
   */
  static setOnlineStatus(online: boolean): void {
    this.isOnline = online;
    console.log(`Serviço agora está ${online ? "online" : "offline"}`);
  }
}

export default ComponentsService;
