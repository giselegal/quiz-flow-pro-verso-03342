/**
 * Serviço de componentes para integração com banco de dados
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

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

export class ComponentsService {
  static async loadStageBlocks(stageKey: string): Promise<Block[]> {
    try {
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

  static async syncStage(stageKey: string, blocks: Block[]): Promise<boolean> {
    try {
      await supabase.from("component_instances").delete().eq("stage_key", stageKey);

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

  static async createBlock(
    stageKey: string,
    typeKey: string,
    content?: any,
    properties?: any
  ): Promise<string | null> {
    try {
      const { data: componentType, error: typeError } = await supabase
        .from("component_types")
        .select("*")
        .eq("type_key", typeKey)
        .single();

      if (typeError || !componentType) {
        console.error("Tipo de componente não encontrado:", typeKey);
        return null;
      }

      const { data: result, error } = await supabase.rpc("generate_instance_key", {
        p_type_key: typeKey,
        p_stage_key: stageKey,
      });

      if (error || !result) {
        console.error("Erro ao gerar instance_key:", error);
        return null;
      }

      const instanceKey = result;

      const { data: maxOrder } = await supabase
        .from("component_instances")
        .select("stage_order")
        .eq("stage_key", stageKey)
        .order("stage_order", { ascending: false })
        .limit(1);

      const nextOrder = (maxOrder?.[0]?.stage_order || 0) + 1;

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

  static async getComponentTypes(): Promise<any[]> {
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

      const uniqueStageKeys = new Set(data?.map(item => item.stage_key) || []);
      const stageKeys = Array.from(uniqueStageKeys);
      return stageKeys;
    } catch (error) {
      console.error("Erro ao carregar stages:", error);
      return [];
    }
  }
}

export default ComponentsService;
