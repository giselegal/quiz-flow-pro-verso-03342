/**
 * 🎯 SERVIÇO DE INTEGRAÇÃO ENTRE EDITOR E BANCO DE DADOS
 * Conecta o EditorContext com o sistema de componentes reutilizáveis do Supabase
 */

// Imports devem estar no topo do arquivo
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
const supabase = SUPABASE_URL && SUPABASE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : createMockSupabaseClient();

// Função para criar um cliente Supabase simulado
function createMockSupabaseClient() {
  console.warn('⚠️ Usando cliente Supabase simulado! Configure as variáveis de ambiente para usar o cliente real.');
  
  // Implementação simulada para testes locais
  return {
    from: (table: string) => ({
      select: (query?: string) => ({
        eq: (column: string, value: any) => ({
          order: (column: string, { ascending }: { ascending: boolean }) => ({
            limit: (num: number) => ({
              single: () => Promise.resolve({ data: null, error: null }),
              then: (callback: Function) => Promise.resolve(callback({ data: [], error: null }))
            }),
            then: (callback: Function) => Promise.resolve(callback({ data: [], error: null }))
          }),
          limit: (num: number) => ({
            then: (callback: Function) => Promise.resolve(callback({ data: [], error: null }))
          }),
          then: (callback: Function) => Promise.resolve(callback({ data: [], error: null }))
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          then: (callback: Function) => Promise.resolve(callback({ data: [], error: null }))
        }),
        then: (callback: Function) => Promise.resolve(callback({ data: [], error: null }))
      }),
      insert: (data: any) => Promise.resolve({ data: null, error: null }),
      update: (data: any) => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
      })
    }),
    rpc: (func: string, params: any) => Promise.resolve({ data: `mock-id-${Date.now()}`, error: null })
  };
}

// ============================================================================
// TIPOS PARA COMPONENTES DO BANCO
// ============================================================================
===============================================================
export interface Block {ANCO
  id: string;=================================
  type: string;
  content: any;export interface Block {
  properties?: any;
  order?: number;
  metadata?: {
    database_id?: string;
    stage_key?: string;der?: number;
    created_at?: string;  metadata?: {
    updated_at?: string;
  };key?: string;
}

export interface ComponentInstance {
  id: string;
  instance_key: string;
  type_key: string;
  stage_key: string;
  stage_order: number; string;
  content: any;
  properties: any;string;
  created_at: string;
  updated_at: string;
} any;

export interface ComponentType {t: string;
  id: string;
  type_key: string;
  type_name: string;rface ComponentType {
  category: string;
  description?: string;y: string;
  default_content: any;
  default_properties: any;
  created_at: string;
  updated_at: string;_content: any;
}any;

// ============================================================================_at: string;
// CLASSE DE SERVIÇO PRINCIPAL
// ============================================================================
=========
export class ComponentsService {LASSE DE SERVIÇO PRINCIPAL
  // Propriedade estática para controle de estado online/offline/ ============================================================================
  private static isOnline = true;

  /**sOnline em estática
   * Carrega blocos de uma stage específica do banco de dados
   */
  static async loadStageBlocks(stageKey: string): Promise<Block[]> {
    try {blocos de uma stage específica do banco de dados
      if (!this.isOnline) throw new Error("Serviço offline");
loadStageBlocks(stageKey: string): Promise<Block[]> {
      const { data, error } = await supabase
        .from("component_instances")sOnline) throw new Error("Serviço offline");
        .select(
          ` } = await supabase
          *,t_instances")
          component_types!inner(
            type_key,
            type_name,      *,
            category,         component_types!inner(
            default_content,            type_key,
            default_properties
          )ategory,
        `tent,
        )_properties
        .eq("stage_key", stageKey)
        .order("stage_order", { ascending: true });

      if (error) {_key", stageKey)
        console.error("Erro ao carregar blocos:", error);_order", { ascending: true });
        return [];
      }     if (error) {
        console.error("Erro ao carregar blocos:", error);
      if (!data || data.length === 0) {
        return [];
      }
ata.length === 0) {
      return data.map((instance: any) => ({
        id: instance.instance_key,
        type: instance.component_types.type_key,
        content: instance.content || instance.component_types.default_content,tance: any) => ({
        properties: instance.properties || instance.component_types.default_properties,instance_key,
        order: instance.stage_order,e.component_types.type_key,
        metadata: {       content: instance.content || instance.component_types.default_content,
          database_id: instance.id,        properties: instance.properties || instance.component_types.default_properties,
          stage_key: instance.stage_key,
          created_at: instance.created_at,
          updated_at: instance.updated_at,
        },          stage_key: instance.stage_key,
      }));reated_at,
    } catch (error) {
      console.error("Erro ao carregar blocos da stage:", error);
      return [];      }));
    } catch (error) {
  }r);
 return [];
  /**
   * Sincroniza blocos de uma stage com o banco de dados
   */
  static async syncStage(stageKey: string, blocks: Block[]): Promise<boolean> {  /**
    try {nco de dados
      if (!this.isOnline) throw new Error("Serviço offline");
yncStage(stageKey: string, blocks: Block[]): Promise<boolean> {
      // Remove instâncias existentes da stage
      await supabase.from("component_instances").delete().eq("stage_key", stageKey);his.isOnline) throw new Error("Serviço offline");

      // Insere novas instânciasncias existentes da stage
      const instances = blocks.map((block, index) => ({rom("component_instances").delete().eq("stage_key", stageKey);
        instance_key: block.id,
        type_key: block.type,cias
        stage_key: stageKey,.map((block, index) => ({
        stage_order: block.order || index + 1,tance_key: block.id,
        content: block.content,ype_key: block.type,
        properties: block.properties,tage_key: stageKey,
      }));| index + 1,

      if (instances.length > 0) {        properties: block.properties,
        const { error } = await supabase.from("component_instances").insert(instances);

        if (error) {s.length > 0) {
          console.error("Erro ao sincronizar stage:", error); const { error } = await supabase.from("component_instances").insert(instances);
          return false;
        }
      }error("Erro ao sincronizar stage:", error);
   return false;
      return true;        }
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
    content?: any,sync createBlock(
    properties?: any
  ): Promise<string | null> {
    try {y,
      if (!this.isOnline) throw new Error("Serviço offline");roperties?: any
: Promise<string | null> {
      // Busca o tipo do componente    try {
      const { data: componentType, error: typeError } = await supabase if (!this.isOnline) throw new Error("Serviço offline");
        .from("component_types")
        .select("*") // Busca o tipo do componente
        .eq("type_key", typeKey)
        .single();from("component_types")

      if (typeError || !componentType) {        .eq("type_key", typeKey)
        console.error("Tipo de componente não encontrado:", typeKey);
        return null;
      }      if (typeError || !componentType) {
omponente não encontrado:", typeKey);
      // Gera instance_key automaticamente
      const { data: result, error } = await supabase.rpc("generate_instance_key", {
        p_type_key: typeKey,
        p_stage_key: stageKey,utomaticamente
      });pabase.rpc("generate_instance_key", {

      if (error || !result) {
        console.error("Erro ao gerar instance_key:", error);
        return null;
      }

      const instanceKey = result;        return null;

      // Calcula a próxima ordem
      const { data: maxOrder } = await supabase = result;
        .from("component_instances")
        .select("stage_order")/ Calcula a próxima ordem
        .eq("stage_key", stageKey)      const { data: maxOrder } = await supabase
        .order("stage_order", { ascending: false })ponent_instances")
        .limit(1);e_order")

      const nextOrder = (maxOrder?.[0]?.stage_order || 0) + 1;ge_order", { ascending: false })
   .limit(1);
      // Insere a nova instância
      const { error: insertError } = await supabase.from("component_instances").insert({      const nextOrder = (maxOrder?.[0]?.stage_order || 0) + 1;
        instance_key: instanceKey,
        type_key: typeKey,
        stage_key: stageKey, const { error: insertError } = await supabase.from("component_instances").insert({
        stage_order: nextOrder,nceKey,
        content: content || componentType.default_content,eKey,
        properties: properties || componentType.default_properties,tageKey,
      });r: nextOrder,
tent || componentType.default_content,
      if (insertError) {s || componentType.default_properties,
        console.error("Erro ao criar bloco:", insertError);
        return null;
      }      if (insertError) {
r bloco:", insertError);
      return instanceKey;
    } catch (error) {
      console.error("Erro ao criar bloco:", error);
      return null;
    }) {
  }      console.error("Erro ao criar bloco:", error);

  /**
   * Atualiza um bloco existente
   */
  static async updateBlock(  /**
    instanceKey: string,
    updates: Partial<Pick<Block, "content" | "properties" | "order">>
  ): Promise<boolean> {
    try {
      const updateData: any = {};es: Partial<Pick<Block, "content" | "properties" | "order">>
  ): Promise<boolean> {
      if (updates.content !== undefined) {
        updateData.content = updates.content;
      }
      if (updates.properties !== undefined) {f (updates.content !== undefined) {
        updateData.properties = updates.properties;        updateData.content = updates.content;
      }
      if (updates.order !== undefined) {      if (updates.properties !== undefined) {
        updateData.stage_order = updates.order;updates.properties;
      }
d) {
      const { error } = await supabase = updates.order;
        .from("component_instances")
        .update(updateData)
        .eq("instance_key", instanceKey);r } = await supabase
        .from("component_instances")
      if (error) {
        console.error("Erro ao atualizar bloco:", error);        .eq("instance_key", instanceKey);
        return false;
      }
alizar bloco:", error);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar bloco:", error);
      return false;
    }
  }sole.error("Erro ao atualizar bloco:", error);
      return false;
  /**
   * Remove um bloco
   */
  static async deleteBlock(instanceKey: string): Promise<boolean> {
    try {   * Remove um bloco
      const { error } = await supabase
        .from("component_instances")Block(instanceKey: string): Promise<boolean> {
        .delete()
        .eq("instance_key", instanceKey);r } = await supabase
   .from("component_instances")
      if (error) {     .delete()
        console.error("Erro ao deletar bloco:", error);        .eq("instance_key", instanceKey);
        return false;
      }
   console.error("Erro ao deletar bloco:", error);
      return true;
    } catch (error) {
      console.error("Erro ao deletar bloco:", error);
      return false;
    }ch (error) {
  }tar bloco:", error);
      return false;
  /**
   * Lista todos os tipos de componentes disponíveis
   */
  static async getComponentTypes(): Promise<ComponentType[]> {
    try {s
      const { data, error } = await supabase
        .from("component_types")ise<ComponentType[]> {
        .select("*")
        .order("category", { ascending: true })onst { data, error } = await supabase
        .order("type_name", { ascending: true });        .from("component_types")

      if (error) {ng: true })
        console.error("Erro ao carregar tipos de componentes:", error); { ascending: true });
        return [];
      }      if (error) {
ror("Erro ao carregar tipos de componentes:", error);
      return data || [];
    } catch (error) {
      console.error("Erro ao carregar tipos de componentes:", error);
      return [];      return data || [];
    }) {
  }Erro ao carregar tipos de componentes:", error);

  /**
   * Verifica se uma stage existe no banco
   */
  static async stageExists(stageKey: string): Promise<boolean> {  /**
    try {Verifica se uma stage existe no banco
      const { data, error } = await supabase
        .from("component_instances")tic async stageExists(stageKey: string): Promise<boolean> {
        .select("id")
        .eq("stage_key", stageKey)st { data, error } = await supabase
        .limit(1);

      if (error) {e_key", stageKey)
        console.error("Erro ao verificar stage:", error);
        return false;
      }
);
      return (data && data.length > 0) || false;
    } catch (error) {
      console.error("Erro ao verificar stage:", error);
      return false; && data.length > 0) || false;
    }
  });

  /**
   * Lista todas as stages com componentes
   */
  static async getStagesWithComponents(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("component_instances")
        .select("stage_key")
        .order("stage_key", { ascending: true });
es")
      if (error) {ge_key")
        console.error("Erro ao carregar stages:", error););
        return [];
      }      if (error) {
ror("Erro ao carregar stages:", error);
      // Remove duplicatas
      const stageKeys = Array.from(new Set(data?.map(item => item.stage_key) || []));
      return stageKeys;
    } catch (error) {      // Remove duplicatas
      console.error("Erro ao carregar stages:", error);Array.from(new Set(data?.map(item => item.stage_key) || []));
      return [];s;
    }
  }ror("Erro ao carregar stages:", error);
 return [];
  /** }
   * Define o estado online/offline do serviço  }
   */
  static setOnlineStatus(online: boolean): void {
    this.isOnline = online;Define o estado online/offline do serviço
    console.log(`Serviço agora está ${online ? "online" : "offline"}`);
  }setOnlineStatus(online: boolean): void {
}
${online ? "online" : "offline"}`);
export default ComponentsService;
  }
}
export default ComponentsService;
export default ComponentsService;