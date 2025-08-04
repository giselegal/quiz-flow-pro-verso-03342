/**
 * 🎯 SERVIÇO DE INTEGRAÇÃO ENTRE EDITOR E BANCO DE DADOS
 * Conecta o EditorContext com o sistema de componentes reutilizáveis do Supabase
 */

import { createClient } from "@supabase/supabase-js";

// ============================================================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

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
  /**
   * Carrega blocos de uma stage específica do banco de dados
   */
  static async loadStageBlocks(stageKey: string): Promise<Block[]> {
    try {
      const { data, error } = await supabase
        .from('component_instances')
        .select(`
          *,
          component_types!inner(
            type_key,
            type_name,
            category,
            default_content,
            default_properties
          )
        `)
        .eq('stage_key', stageKey)
        .order('stage_order', { ascending: true });

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
          updated_at: instance.updated_at
        }
      }));
    } catch (error) {
      console.error('Erro ao carregar blocos da stage:', error);
      return [];
    }
  }

  /**
   * Sincroniza blocos de uma stage com o banco de dados
   */
  static async syncStage(stageKey: string, blocks: Block[]): Promise<boolean> {
    try {
      // Remove instâncias existentes da stage
      await supabase
        .from('component_instances')
        .delete()
        .eq('stage_key', stageKey);

      // Insere novas instâncias
      const instances = blocks.map((block, index) => ({
        instance_key: block.id,
        type_key: block.type,
        stage_key: stageKey,
        stage_order: block.order || index + 1,
        content: block.content,
        properties: block.properties
      }));

      if (instances.length > 0) {
        const { error } = await supabase
          .from('component_instances')
          .insert(instances);

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
   * Cria um novo bloco no banco de dados
   */
  static async createBlock(stageKey: string, typeKey: string, content?: any, properties?: any): Promise<string | null> {
    try {
      // Busca o tipo do componente
      const { data: componentType, error: typeError } = await supabase
        .from('component_types')
        .select('*')
        .eq('type_key', typeKey)
        .single();

      if (typeError || !componentType) {
        console.error('Tipo de componente não encontrado:', typeKey);
        return null;
      }

      // Gera instance_key automaticamente
      const { data: result, error } = await supabase
        .rpc('generate_instance_key', {
          p_type_key: typeKey,
          p_stage_key: stageKey
        });

      if (error || !result) {
        console.error('Erro ao gerar instance_key:', error);
        return null;
      }

      const instanceKey = result;

      // Calcula a próxima ordem
      const { data: maxOrder } = await supabase
        .from('component_instances')
        .select('stage_order')
        .eq('stage_key', stageKey)
        .order('stage_order', { ascending: false })
        .limit(1);

      const nextOrder = (maxOrder?.[0]?.stage_order || 0) + 1;

      // Insere a nova instância
      const { error: insertError } = await supabase
        .from('component_instances')
        .insert({
          instance_key: instanceKey,
          type_key: typeKey,
          stage_key: stageKey,
          stage_order: nextOrder,
          content: content || componentType.default_content,
          properties: properties || componentType.default_properties
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
   * Atualiza um bloco existente
   */
  static async updateBlock(instanceKey: string, updates: Partial<Pick<Block, 'content' | 'properties' | 'order'>>): Promise<boolean> {
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
   * Remove um bloco
   */
  static async deleteBlock(instanceKey: string): Promise<boolean> {
    try {
      const { error } = await supabase
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
   * Lista todos os tipos de componentes disponíveis
   */
  static async getComponentTypes(): Promise<ComponentType[]> {
    try {
      const { data, error } = await supabase
        .from('component_types')
        .select('*')
        .order('category', { ascending: true })
        .order('type_name', { ascending: true });

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
   * Verifica se uma stage existe no banco
   */
  static async stageExists(stageKey: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('component_instances')
        .select('id')
        .eq('stage_key', stageKey)
        .limit(1);

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
   * Lista todas as stages com componentes
   */
  static async getStagesWithComponents(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('component_instances')
        .select('stage_key')
        .order('stage_key', { ascending: true });

      if (error) {
        console.error('Erro ao carregar stages:', error);
        return [];
      }

      // Remove duplicatas
      const stageKeys = [...new Set(data?.map(item => item.stage_key) || [])];
      return stageKeys;
    } catch (error) {
      console.error('Erro ao carregar stages:', error);
      return [];
    }

}
}

export default ComponentsService;

        if (error) throw error;
        console.log(`✅ Bloco ${block.id} criado`);
      }

      return true;
    } catch (error) {
      console.error("❌ Erro ao salvar bloco:", error);
      return false;
    }
  }

  // ==========================================================================
  // DELETAR BLOCO DO BANCO
  // ==========================================================================

  static async deleteBlock(quizId: string, blockId: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deletando bloco ${blockId}`);

      const { error } = await supabase
        .from("component_instances")
        .delete()
        .eq("quiz_id", quizId)
        .eq("instance_key", blockId);

      if (error) throw error;

      console.log(`✅ Bloco ${blockId} deletado`);
      return true;
    } catch (error) {
      console.error("❌ Erro ao deletar bloco:", error);
      return false;
    }
  }

  // ==========================================================================
  // REORDENAR BLOCOS DE UMA ETAPA
  // ==========================================================================

  static async reorderBlocks(
    quizId: string,
    stepNumber: number,
    blockIds: string[]
  ): Promise<boolean> {
    try {
      console.log(`🔄 Reordenando ${blockIds.length} blocos na etapa ${stepNumber}`);

      // Atualizar order_index de cada bloco
      const updates = blockIds.map((blockId, index) =>
        supabase
          .from("component_instances")
          .update({ order_index: index + 1 })
          .eq("quiz_id", quizId)
          .eq("instance_key", blockId)
      );

      await Promise.all(updates);

      console.log(`✅ Blocos reordenados na etapa ${stepNumber}`);
      return true;
    } catch (error) {
      console.error("❌ Erro ao reordenar blocos:", error);
      return false;
    }
  }

  // ==========================================================================
  // DUPLICAR BLOCO
  // ==========================================================================

  static async duplicateBlock(
    quizId: string,
    originalBlockId: string,
    targetStepNumber: number
  ): Promise<string | null> {
    try {
      console.log(`🔄 Duplicando bloco ${originalBlockId} para etapa ${targetStepNumber}`);

      // Buscar bloco original
      const { data: original, error: fetchError } = await supabase
        .from("component_instances")
        .select("*")
        .eq("quiz_id", quizId)
        .eq("instance_key", originalBlockId)
        .single();

      if (fetchError) throw fetchError;

      // Gerar novo instance_key
      const timestamp = Date.now();
      const newInstanceKey = `${original.component_type_key}-copy-${timestamp}`;

      // Obter próximo order_index
      const { data: stepComponents } = await supabase
        .from("component_instances")
        .select("order_index")
        .eq("quiz_id", quizId)
        .eq("step_number", targetStepNumber)
        .order("order_index", { ascending: false })
        .limit(1);

      const nextOrderIndex = (stepComponents?.[0]?.order_index || 0) + 1;

      // Criar duplicata
      const { data: newComponent, error } = await supabase
        .from("component_instances")
        .insert({
          instance_key: newInstanceKey,
          component_type_key: original.component_type_key,
          quiz_id: quizId,
          step_number: targetStepNumber,
          order_index: nextOrderIndex,
          properties: original.properties,
          custom_styling: original.custom_styling,
          is_active: true,
        })
        .select("instance_key")
        .single();

      if (error) throw error;

      console.log(`✅ Bloco duplicado: ${newInstanceKey}`);
      return newComponent.instance_key;
    } catch (error) {
      console.error("❌ Erro ao duplicar bloco:", error);
      return null;
    }
  }

  // ==========================================================================
  // SINCRONIZAR ETAPA COMPLETA
  // ==========================================================================

  static async syncStage(
    quizId: string,
    stepNumber: number,
    blocks: EditorBlock[]
  ): Promise<boolean> {
    try {
      console.log(`🔄 Sincronizando etapa ${stepNumber} com ${blocks.length} blocos`);

      // 1. Buscar componentes existentes na etapa
      const { data: existingComponents } = await supabase
        .from("component_instances")
        .select("instance_key")
        .eq("quiz_id", quizId)
        .eq("step_number", stepNumber);

      const existingKeys = existingComponents?.map(c => c.instance_key) || [];
      const newKeys = blocks.map(b => b.id);

      // 2. Deletar componentes removidos
      const toDelete = existingKeys.filter(key => !newKeys.includes(key));
      if (toDelete.length > 0) {
        await supabase
          .from("component_instances")
          .delete()
          .eq("quiz_id", quizId)
          .eq("step_number", stepNumber)
          .in("instance_key", toDelete);

        console.log(`🗑️ Removidos ${toDelete.length} componentes`);
      }

      // 3. Salvar/atualizar todos os blocos
      const savePromises = blocks.map(block => this.saveBlock(quizId, stepNumber, block));

      await Promise.all(savePromises);

      console.log(`✅ Etapa ${stepNumber} sincronizada`);
      return true;
    } catch (error) {
      console.error("❌ Erro ao sincronizar etapa:", error);
      return false;
    }
  }

  // ==========================================================================
  // CARREGAR TIPOS DE COMPONENTES DISPONÍVEIS
  // ==========================================================================

  static async getAvailableComponentTypes(): Promise<
    Array<{
      type_key: string;
      display_name: string;
      category: string;
      icon: string;
      default_properties: Record<string, any>;
    }>
  > {
    try {
      const { data, error } = await supabase
        .from("component_types")
        .select("type_key, display_name, category, icon, default_properties")
        .eq("is_system", true)
        .order("category, display_name");

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("❌ Erro ao carregar tipos de componentes:", error);
      return [];
    }
  }

  // ==========================================================================
  // CRIAR NOVO BLOCO COM TIPO ESPECÍFICO
  // ==========================================================================

  static async createBlock(
    quizId: string,
    stepNumber: number,
    componentType: string,
    position?: number
  ): Promise<EditorBlock | null> {
    try {
      // Buscar configurações padrão do tipo
      const { data: componentTypeData } = await supabase
        .from("component_types")
        .select("default_properties")
        .eq("type_key", componentType)
        .single();

      // Gerar instance_key único
      const timestamp = Date.now();
      const instanceKey = `${componentType}-${timestamp}`;

      // Determinar order_index
      let orderIndex = position || 1;
      if (!position) {
        const { data: lastComponent } = await supabase
          .from("component_instances")
          .select("order_index")
          .eq("quiz_id", quizId)
          .eq("step_number", stepNumber)
          .order("order_index", { ascending: false })
          .limit(1);

        orderIndex = (lastComponent?.[0]?.order_index || 0) + 1;
      }

      // Criar no banco
      const { data, error } = await supabase
        .from("component_instances")
        .insert({
          instance_key: instanceKey,
          component_type_key: componentType,
          quiz_id: quizId,
          step_number: stepNumber,
          order_index: orderIndex,
          properties: componentTypeData?.default_properties || {},
          is_active: true,
        })
        .select("*")
        .single();

      if (error) throw error;

      // Retornar como EditorBlock
      return {
        id: data.instance_key,
        type: data.component_type_key as any,
        content: data.properties,
        order: data.order_index,
        properties: data.properties,
      };
    } catch (error) {
      console.error("❌ Erro ao criar bloco:", error);
      return null;
    }
  }

  // ==========================================================================
  // UTILITÁRIOS DE ANÁLISE
  // ==========================================================================

  static async getQuizStats(quizId: string): Promise<{
    totalSteps: number;
    totalComponents: number;
    componentsByType: Record<string, number>;
    stepCounts: Record<number, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from("step_components")
        .select("step_number, component_type")
        .eq("quiz_id", quizId)
        .eq("is_active", true);

      if (error) throw error;

      const components = data || [];
      const stepCounts: Record<number, number> = {};
      const componentsByType: Record<string, number> = {};

      components.forEach(comp => {
        stepCounts[comp.step_number] = (stepCounts[comp.step_number] || 0) + 1;
        componentsByType[comp.component_type] = (componentsByType[comp.component_type] || 0) + 1;
      });

      return {
        totalSteps: Object.keys(stepCounts).length,
        totalComponents: components.length,
        componentsByType,
        stepCounts,
      };
    } catch (error) {
      console.error("❌ Erro ao obter estatísticas:", error);
      return {
        totalSteps: 0,
        totalComponents: 0,
        componentsByType: {},
        stepCounts: {},
      };
    }
  }
}

export default ComponentsService;
