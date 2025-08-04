/**
 * 🎯 SERVIÇO DE INTEGRAÇÃO ENTRE EDITOR E BANCO DE DADOS
 * Conecta o EditorContext com o sistema de componentes reutilizáveis do Supabase
 */

// Primeiro devemos colocar os imports no topo do arquivo
import { createClient } from "@supabase/supabase-js";

// Configuração de ambiente compatível com navegador
const env = {
  // Valores padrão ou carregados de variáveis de ambiente durante o build
  API_URL: import.meta.env?.VITE_API_URL || "https://api.default.com",
  API_KEY: import.meta.env?.VITE_API_KEY || "",
  DEBUG: import.meta.env?.VITE_DEBUG === "true",
  // Adicione outras variáveis de ambiente necessárias aqui
};

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
===============================================================
// ============================================================================ANCO
// TIPOS PARA COMPONENTES DO BANCO=================================
// ============================================================================
export interface Block {
export interface Block {
  id: string;
  type: string;
  content: any;
  properties?: any;der?: number;
  order?: number;  metadata?: {
  metadata?: {
    database_id?: string;key?: string;
    stage_key?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface ComponentInstance {
  id: string; string;
  instance_key: string;
  type_key: string;string;
  stage_key: string;
  stage_order: number;
  content: any; any;
  properties: any;
  created_at: string;t: string;
  updated_at: string;
}
rface ComponentType {
export interface ComponentType {
  id: string;y: string;
  type_key: string;
  type_name: string;
  category: string;
  description?: string;_content: any;
  default_content: any;any;
  default_properties: any;
  created_at: string;_at: string;
  updated_at: string;
}
=========
// ============================================================================LASSE DE SERVIÇO PRINCIPAL
// CLASSE DE SERVIÇO PRINCIPAL/ ============================================================================
// ============================================================================

export class ComponentsService {sOnline em estática
  // Transformando a propriedade isOnline em estática
  private static isOnline = true;

  /**blocos de uma stage específica do banco de dados
   * Carrega blocos de uma stage específica do banco de dados
   */loadStageBlocks(stageKey: string): Promise<Block[]> {
  static async loadStageBlocks(stageKey: string): Promise<Block[]> {
    try {sOnline) throw new Error("Serviço offline");
      if (!this.isOnline) throw new Error("Serviço offline");
 } = await supabase
      const { data, error } = await supabaset_instances")
        .from("component_instances")
        .select(
          `      *,
          *,         component_types!inner(
          component_types!inner(            type_key,
            type_key,
            type_name,ategory,
            category,tent,
            default_content,_properties
            default_properties
          )
        `
        )_key", stageKey)
        .eq("stage_key", stageKey)_order", { ascending: true });
        .order("stage_order", { ascending: true });
     if (error) {
      if (error) {        console.error("Erro ao carregar blocos:", error);
        console.error("Erro ao carregar blocos:", error);
        return [];
      }
ata.length === 0) {
      if (!data || data.length === 0) {
        return [];
      }
tance: any) => ({
      return data.map((instance: any) => ({instance_key,
        id: instance.instance_key,e.component_types.type_key,
        type: instance.component_types.type_key,       content: instance.content || instance.component_types.default_content,
        content: instance.content || instance.component_types.default_content,        properties: instance.properties || instance.component_types.default_properties,
        properties: instance.properties || instance.component_types.default_properties,
        order: instance.stage_order,
        metadata: {
          database_id: instance.id,          stage_key: instance.stage_key,
          stage_key: instance.stage_key,reated_at,
          created_at: instance.created_at,
          updated_at: instance.updated_at,
        },      }));
      })); catch (error) {
    } catch (error) {r);
      console.error("Erro ao carregar blocos da stage:", error); return [];
      return [];
    }
  }
  /**
  /**nco de dados
   * Sincroniza blocos de uma stage com o banco de dados
   */yncStage(stageKey: string, blocks: Block[]): Promise<boolean> {
  static async syncStage(stageKey: string, blocks: Block[]): Promise<boolean> {
    try {his.isOnline) throw new Error("Serviço offline");
      if (!this.isOnline) throw new Error("Serviço offline");
ncias existentes da stage
      // Remove instâncias existentes da stagerom("component_instances").delete().eq("stage_key", stageKey);
      await supabase.from("component_instances").delete().eq("stage_key", stageKey);
cias
      // Insere novas instâncias.map((block, index) => ({
      const instances = blocks.map((block, index) => ({tance_key: block.id,
        instance_key: block.id,ype_key: block.type,
        type_key: block.type,tage_key: stageKey,
        stage_key: stageKey,| index + 1,
        stage_order: block.order || index + 1,
        content: block.content,        properties: block.properties,
        properties: block.properties,
      }));
s.length > 0) {
      if (instances.length > 0) { const { error } = await supabase.from("component_instances").insert(instances);
        const { error } = await supabase.from("component_instances").insert(instances);

        if (error) {error("Erro ao sincronizar stage:", error);
          console.error("Erro ao sincronizar stage:", error);   return false;
          return false;        }
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
   */sync createBlock(
  static async createBlock(
    stageKey: string,
    typeKey: string,y,
    content?: any,roperties?: any
    properties?: any: Promise<string | null> {
  ): Promise<string | null> {    try {
    try { if (!this.isOnline) throw new Error("Serviço offline");
      if (!this.isOnline) throw new Error("Serviço offline");
 // Busca o tipo do componente
      // Busca o tipo do componente
      const { data: componentType, error: typeError } = await supabasefrom("component_types")
        .from("component_types")
        .select("*")        .eq("type_key", typeKey)
        .eq("type_key", typeKey)
        .single();
      if (typeError || !componentType) {
      if (typeError || !componentType) {omponente não encontrado:", typeKey);
        console.error("Tipo de componente não encontrado:", typeKey);
        return null;
      }
utomaticamente
      // Gera instance_key automaticamentepabase.rpc("generate_instance_key", {
      const { data: result, error } = await supabase.rpc("generate_instance_key", {
        p_type_key: typeKey,
        p_stage_key: stageKey,
      });

      if (error || !result) {
        console.error("Erro ao gerar instance_key:", error);        return null;
        return null;
      }
 = result;
      const instanceKey = result;
/ Calcula a próxima ordem
      // Calcula a próxima ordem      const { data: maxOrder } = await supabase
      const { data: maxOrder } = await supabaseponent_instances")
        .from("component_instances")e_order")
        .select("stage_order")
        .eq("stage_key", stageKey)ge_order", { ascending: false })
        .order("stage_order", { ascending: false })   .limit(1);
        .limit(1);
      const nextOrder = (maxOrder?.[0]?.stage_order || 0) + 1;
      const nextOrder = (maxOrder?.[0]?.stage_order || 0) + 1;

      // Insere a nova instância const { error: insertError } = await supabase.from("component_instances").insert({
      const { error: insertError } = await supabase.from("component_instances").insert({nceKey,
        instance_key: instanceKey,eKey,
        type_key: typeKey,tageKey,
        stage_key: stageKey,r: nextOrder,
        stage_order: nextOrder,tent || componentType.default_content,
        content: content || componentType.default_content,s || componentType.default_properties,
        properties: properties || componentType.default_properties,
      });
      if (insertError) {
      if (insertError) {r bloco:", insertError);
        console.error("Erro ao criar bloco:", insertError);
        return null;
      }

      return instanceKey;) {
    } catch (error) {      console.error("Erro ao criar bloco:", error);
      console.error("Erro ao criar bloco:", error);
      return null;
    }
  }
  /**
  /**
   * Atualiza um bloco existente
   */
  static async updateBlock(
    instanceKey: string,es: Partial<Pick<Block, "content" | "properties" | "order">>
    updates: Partial<Pick<Block, "content" | "properties" | "order">>  ): Promise<boolean> {
  ): Promise<boolean> {
    try {
      const updateData: any = {};
f (updates.content !== undefined) {
      if (updates.content !== undefined) {        updateData.content = updates.content;
        updateData.content = updates.content;
      }      if (updates.properties !== undefined) {
      if (updates.properties !== undefined) {updates.properties;
        updateData.properties = updates.properties;
      }d) {
      if (updates.order !== undefined) { = updates.order;
        updateData.stage_order = updates.order;
      }
r } = await supabase
      const { error } = await supabase        .from("component_instances")
        .from("component_instances")
        .update(updateData)        .eq("instance_key", instanceKey);
        .eq("instance_key", instanceKey);

      if (error) {alizar bloco:", error);
        console.error("Erro ao atualizar bloco:", error);
        return false;
      }

      return true;
    } catch (error) {sole.error("Erro ao atualizar bloco:", error);
      console.error("Erro ao atualizar bloco:", error);      return false;
      return false;
    }
  }

  /**   * Remove um bloco
   * Remove um bloco
   */Block(instanceKey: string): Promise<boolean> {
  static async deleteBlock(instanceKey: string): Promise<boolean> {
    try {r } = await supabase
      const { error } = await supabase   .from("component_instances")
        .from("component_instances")     .delete()
        .delete()        .eq("instance_key", instanceKey);
        .eq("instance_key", instanceKey);

      if (error) {   console.error("Erro ao deletar bloco:", error);
        console.error("Erro ao deletar bloco:", error);
        return false;
      }

      return true;ch (error) {
    } catch (error) {tar bloco:", error);
      console.error("Erro ao deletar bloco:", error);      return false;
      return false;
    }
  }

  /**s
   * Lista todos os tipos de componentes disponíveis
   */ise<ComponentType[]> {
  static async getComponentTypes(): Promise<ComponentType[]> {
    try {onst { data, error } = await supabase
      const { data, error } = await supabase        .from("component_types")
        .from("component_types")
        .select("*")ng: true })
        .order("category", { ascending: true }) { ascending: true });
        .order("type_name", { ascending: true });
      if (error) {
      if (error) {ror("Erro ao carregar tipos de componentes:", error);
        console.error("Erro ao carregar tipos de componentes:", error);
        return [];
      }
      return data || [];
      return data || [];) {
    } catch (error) {Erro ao carregar tipos de componentes:", error);
      console.error("Erro ao carregar tipos de componentes:", error);
      return [];
    }
  }
  /**
  /**Verifica se uma stage existe no banco
   * Verifica se uma stage existe no banco
   */tic async stageExists(stageKey: string): Promise<boolean> {
  static async stageExists(stageKey: string): Promise<boolean> {
    try {st { data, error } = await supabase
      const { data, error } = await supabase
        .from("component_instances")
        .select("id")e_key", stageKey)
        .eq("stage_key", stageKey)
        .limit(1);

      if (error) {);
        console.error("Erro ao verificar stage:", error);
        return false;
      }
 && data.length > 0) || false;
      return (data && data.length > 0) || false;
    } catch (error) {);
      console.error("Erro ao verificar stage:", error);
      return false;
    }
  }

  /**
   * Lista todas as stages com componentes
   */
  static async getStagesWithComponents(): Promise<string[]> {
    try {
      const { data, error } = await supabasees")
        .from("component_instances")ge_key")
        .select("stage_key"));
        .order("stage_key", { ascending: true });
      if (error) {
      if (error) {ror("Erro ao carregar stages:", error);
        console.error("Erro ao carregar stages:", error);
        return [];
      }
      // Remove duplicatas
      // Remove duplicatasArray.from(new Set(data?.map(item => item.stage_key) || []));
      const stageKeys = Array.from(new Set(data?.map(item => item.stage_key) || []));s;
      return stageKeys;
    } catch (error) {ror("Erro ao carregar stages:", error);
      console.error("Erro ao carregar stages:", error); return [];
      return []; }
    }  }
  }

  /**Define o estado online/offline do serviço
   * Define o estado online/offline do serviço
   */setOnlineStatus(online: boolean): void {
  static setOnlineStatus(online: boolean): void {
    this.isOnline = online;${online ? "online" : "offline"}`);
    console.log(`Serviço agora está ${online ? "online" : "offline"}`);
  }
}
export default ComponentsService;
export default ComponentsService;