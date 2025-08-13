import { supabase } from '@/integrations/supabase/client';

export type ComponentInstance = {
  id: string;
  instance_key: string;
  component_type_key: string;
  funnel_id: string;
  stage_id?: string | null;
  step_number: number;
  order_index: number;
  properties: Record<string, any>;
  custom_styling?: Record<string, any>;
  is_active?: boolean;
  is_locked?: boolean;
  is_template?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
};

export type AddComponentInput = {
  funnelId: string;
  stepNumber: number;
  instanceKey: string;
  componentTypeKey: string;
  orderIndex: number;
  properties?: Record<string, any>;
  stageId?: string | null;
};

export type UpdateComponentInput = {
  id: string;
  properties?: Record<string, any>;
  custom_styling?: Record<string, any>;
  is_active?: boolean;
  is_locked?: boolean;
  order_index?: number;
};

/**
 * Serviço para gerenciar componentes do funil no Supabase
 * 
 * Funcionalidades:
 * - CRUD de componentes por etapa
 * - Validação rigorosa de reordenação
 * - Tratamento de erros e fallbacks
 * - Integração com RLS do Supabase
 */
export const funnelComponentsService = {
  /**
   * Busca componentes de uma etapa específica
   */
  async getComponents(params: { funnelId: string; stepNumber: number }) {
    const { funnelId, stepNumber } = params;
    
    console.log(`🔍 Buscando componentes: funil=${funnelId}, etapa=${stepNumber}`);
    
    const { data, error } = await supabase
      .from('component_instances')
      .select('*')
      .eq('funnel_id', funnelId)
      .eq('step_number', stepNumber)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar componentes:', error);
      throw error;
    }
    
    console.log(`✅ Encontrados ${data?.length || 0} componentes`);
    return (data || []) as ComponentInstance[];
  },

  /**
   * Adiciona novo componente à etapa
   */
  async addComponent(input: AddComponentInput) {
    const { 
      funnelId, 
      stepNumber, 
      instanceKey, 
      componentTypeKey, 
      orderIndex, 
      properties = {}, 
      stageId = null 
    } = input;

    console.log(`➕ Adicionando componente: ${componentTypeKey} na posição ${orderIndex}`);

    const payload = {
      funnel_id: funnelId,
      step_number: stepNumber,
      stage_id: stageId,
      instance_key: instanceKey,
      component_type_key: componentTypeKey,
      order_index: orderIndex,
      properties,
    };

    const { data, error } = await supabase
      .from('component_instances')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Erro ao adicionar componente:', error);
      throw error;
    }

    console.log(`✅ Componente adicionado: ${data.id}`);
    return data as ComponentInstance;
  },

  /**
   * Atualiza componente existente
   */
  async updateComponent(input: UpdateComponentInput) {
    const { id, ...updates } = input;

    console.log(`🔄 Atualizando componente: ${id}`);

    const { data, error } = await supabase
      .from('component_instances')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar componente:', error);
      throw error;
    }

    console.log(`✅ Componente atualizado: ${data.id}`);
    return data as ComponentInstance;
  },

  /**
   * Remove componente
   */
  async deleteComponent(id: string) {
    console.log(`🗑️ Removendo componente: ${id}`);

    const { error } = await supabase
      .from('component_instances')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Erro ao remover componente:', error);
      throw error;
    }

    console.log(`✅ Componente removido: ${id}`);
    return true;
  },

  /**
   * Reordena componentes com validação rigorosa
   * Garante que a nova ordem é uma permutação exata dos IDs existentes
   */
  async reorderComponents(params: { 
    funnelId: string; 
    stepNumber: number; 
    newOrderIds: string[] 
  }) {
    const { funnelId, stepNumber, newOrderIds } = params;

    console.log(`🔀 Reordenando componentes: ${newOrderIds.length} itens`);

    // Buscar estado atual para validação
    const current = await this.getComponents({ funnelId, stepNumber });
    const currentIds = current.map(c => c.id).sort();
    const newIds = [...newOrderIds].sort();

    // Validação: mesmo tamanho e conjunto exato de IDs
    if (currentIds.length !== newIds.length) {
      throw new Error(
        `Reordenação inválida: quantidade diferente (atual: ${currentIds.length}, nova: ${newIds.length})`
      );
    }

    // Validação: conjunto idêntico de IDs
    const currentSet = new Set(currentIds);
    const newSet = new Set(newIds);
    
    if (currentSet.size !== newSet.size) {
      throw new Error('Reordenação inválida: IDs duplicados detectados');
    }

    for (const id of newIds) {
      if (!currentSet.has(id)) {
        throw new Error(`ID desconhecido na reordenação: ${id}`);
      }
    }

    // Aplicar nova ordem sequencialmente
    // Para atomicidade total, considerar usar uma stored procedure/RPC
    console.log('🔄 Aplicando nova ordem...');
    
    for (let i = 0; i < newOrderIds.length; i++) {
      const id = newOrderIds[i];
      const { error } = await supabase
        .from('component_instances')
        .update({ order_index: i + 1 })
        .eq('id', id);
        
      if (error) {
        console.error(`❌ Erro ao reordenar item ${id}:`, error);
        throw error;
      }
    }

    console.log(`✅ Reordenação concluída: ${newOrderIds.length} componentes`);
    return true;
  },

  /**
   * Busca tipos de componentes disponíveis
   */
  async getComponentTypes() {
    console.log('🔍 Buscando tipos de componentes...');

    const { data, error } = await supabase
      .from('component_types')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('display_name', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar tipos de componentes:', error);
      throw error;
    }

    console.log(`✅ Encontrados ${data?.length || 0} tipos de componentes`);
    return data || [];
  }
};