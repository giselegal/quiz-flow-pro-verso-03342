/**
 * 🎯 SERVIÇO DE INTEGRAÇÃO ENTRE EDITOR E BANCO DE DADOS
 * Conecta o EditorContext com o sistema de componentes reutilizáveis do Supabase
 */

import { supabase } from '@/lib/supabase';
import type { Block } from '@/types/block';
import type { QuizStage } from '@/types/quiz';

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

interface DatabaseComponent {
  id: string;
  instance_key: string;
  component_type_key: string;
  quiz_id: string;
  step_number: number;
  order_index: number;
  properties: Record<string, any>;
  custom_styling: Record<string, any>;
  is_active: boolean;
}

// ============================================================================
// CLASSE DE SERVIÇO PRINCIPAL
// ============================================================================

export class ComponentsService {
  // ==========================================================================
  // CARREGAR COMPONENTES DE UMA ETAPA COMO EditorBlocks
  // ==========================================================================

  static async loadStageBlocks(quizId: string, stepNumber: number): Promise<EditorBlock[]> {
    try {
      console.log(`🔍 Carregando componentes da etapa ${stepNumber} do quiz ${quizId}`);

      const { data, error } = await supabase
        .from("step_components")
        .select("*")
        .eq("quiz_id", quizId)
        .eq("step_number", stepNumber)
        .eq("is_active", true)
        .order("order_index");

      if (error) {
        console.error("❌ Erro ao carregar componentes:", error);
        throw error;
      }

      // Converter componentes do banco para EditorBlocks
      const editorBlocks: EditorBlock[] = (data || []).map(component => ({
        id: component.instance_key, // ✅ Usar instance_key como ID do bloco
        type: component.component_type as any,
        content: component.properties || {},
        order: component.order_index,
        properties: {
          ...component.properties,
          ...component.custom_styling,
        },
      }));

      console.log(`✅ Carregados ${editorBlocks.length} componentes da etapa ${stepNumber}`);
      return editorBlocks;
    } catch (error) {
      console.error("❌ Erro no ComponentsService.loadStageBlocks:", error);
      return [];
    }
  }

  // ==========================================================================
  // SALVAR EditorBlock NO BANCO COMO COMPONENTE
  // ==========================================================================

  static async saveBlock(quizId: string, stepNumber: number, block: EditorBlock): Promise<boolean> {
    try {
      console.log(`💾 Salvando bloco ${block.id} na etapa ${stepNumber}`);

      // Verificar se já existe
      const { data: existing } = await supabase
        .from("component_instances")
        .select("id")
        .eq("quiz_id", quizId)
        .eq("instance_key", block.id)
        .single();

      const componentData = {
        component_type_key: block.type,
        quiz_id: quizId,
        step_number: stepNumber,
        order_index: block.order,
        properties: block.properties || block.content || {},
        custom_styling: {},
        is_active: true,
      };

      if (existing) {
        // Atualizar existente
        const { error } = await supabase
          .from("component_instances")
          .update(componentData)
          .eq("id", existing.id);

        if (error) throw error;
        console.log(`✅ Bloco ${block.id} atualizado`);
      } else {
        // Criar novo
        const { error } = await supabase.from("component_instances").insert({
          instance_key: block.id,
          ...componentData,
        });

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
