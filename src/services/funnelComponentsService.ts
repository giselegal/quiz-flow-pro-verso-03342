import { supabase } from '@/integrations/supabase/customClient';
import { generateInstanceKey } from '@/utils/idValidation';

// Cache simples de tipos conhecidos para reduzir chamadas
let __knownTypeKeys: Set<string> | null = null;
async function ensureKnownTypes(): Promise<Set<string>> {
  if (__knownTypeKeys && __knownTypeKeys.size > 0) return __knownTypeKeys;
  try {
    const { data, error } = await supabase.from('component_types').select('type_key');
    if (!error && Array.isArray(data)) {
      __knownTypeKeys = new Set(data.map((r: any) => r.type_key));
      return __knownTypeKeys;
    }
  } catch { }
  __knownTypeKeys = new Set<string>();
  return __knownTypeKeys;
}

function pickFallbackType(types: Set<string>, preferred: string | null = 'text-inline'): string | null {
  if (preferred && types.has(preferred)) return preferred;
  const first = types.values().next();
  return first.done ? null : first.value;
}

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
    return (data || []) as unknown as ComponentInstance[];
  },

  /**
   * Sincroniza todos os componentes de uma etapa a partir de uma lista de Blocks.
   * Estratégia:
   * 1) Deleta componentes existentes do step (limpeza)
   * 2) Tenta insert em lote (bulk). Se falhar por FK/colunas, faz fallback para addComponent fila a fila.
   */
  async syncStepComponents(params: { funnelId: string; stepNumber: number; blocks: Array<{ id: string; type: string; order?: number; properties?: Record<string, any>; content?: Record<string, any> }> }) {
    const { funnelId, stepNumber, blocks } = params;

    console.log(`🧩 Sincronizando ${blocks.length} blocks para step ${stepNumber} (funnel=${funnelId})`);

    // 1) Limpar existentes do step
    await supabase
      .from('component_instances')
      .delete()
      .eq('funnel_id', funnelId)
      .eq('step_number', stepNumber);

    if (!blocks || blocks.length === 0) {
      console.log('ℹ️ Nenhum bloco para inserir após limpeza');
      return true;
    }

    // 2) Preparar payloads
    const knownTypes = await ensureKnownTypes();
    const payloads = blocks.map((b, i) => {
      let typeKey = b.type;
      if (knownTypes.size > 0 && !knownTypes.has(typeKey)) {
        const fallback = pickFallbackType(knownTypes, 'text-inline');
        if (fallback) {
          console.warn(`⚠️ Tipo desconhecido "${typeKey}" — usando fallback "${fallback}"`);
          typeKey = fallback;
        }
      }
      const instanceKey = generateInstanceKey(typeKey, stepNumber, b.id);
      const orderIndex = typeof b.order === 'number' ? b.order : i + 1;
      // Unificar propriedades + conteúdo (modelo atual guarda em properties)
      const properties = { ...(b.properties || {}), ...(b.content || {}) } as Record<string, any>;
      return {
        funnel_id: funnelId,
        step_number: stepNumber,
        instance_key: instanceKey,
        component_type_key: typeKey,
        order_index: orderIndex,
        properties,
      } as any;
    });

    // 3) Tentar bulk insert
    const bulk = await supabase.from('component_instances').insert(payloads);
    if (!bulk.error) {
      console.log(`✅ Bulk insert concluído: ${payloads.length} itens`);
      return true;
    }

    const errMsg = String(bulk.error?.message || '');
    const errCode = String((bulk as any).error?.code || '');
    console.warn('⚠️ Bulk insert falhou, aplicando fallback item-a-item...', { code: errCode, msg: errMsg });

    // 4) Fallback: insere um a um via addComponent (aplica os mesmos fallbacks internos)
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i] as any;
      try {
        await this.addComponent({
          funnelId,
          stepNumber,
          instanceKey: b.id || generateInstanceKey(b.type, stepNumber),
          componentTypeKey: b.type,
          orderIndex: (typeof b.order === 'number' ? b.order : i + 1),
          properties: { ...(b.properties || {}), ...(b.content || {}) },
        });
      } catch (e) {
        console.error('❌ Falha ao inserir componente no fallback', { i, blockId: b?.id, err: (e as any)?.message });
        throw e;
      }
    }

    console.log(`✅ Fallback concluído: ${blocks.length} itens inseridos`);
    return true;
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
      stageId = null,
    } = input;

    console.log(`➕ Adicionando componente: ${componentTypeKey} na posição ${orderIndex}`);

    // garantir que o tipo exista quando usando schema novo
    const knownTypes = await ensureKnownTypes();
    let typeKeyToUse = componentTypeKey;
    if (knownTypes.size > 0 && !knownTypes.has(typeKeyToUse)) {
      const fallback = pickFallbackType(knownTypes, 'text-inline');
      if (fallback) {
        console.warn(`⚠️ Tipo desconhecido "${typeKeyToUse}". Usando fallback "${fallback}"`);
        typeKeyToUse = fallback;
      }
    }

    const payloadNew = {
      funnel_id: funnelId,
      step_number: stepNumber,
      stage_id: stageId,
      instance_key: instanceKey,
      component_type_key: typeKeyToUse,
      order_index: orderIndex,
      properties,
    } as any;

    // Insert com schema novo e fallbacks controlados
    let insertError: any | null = null;
    let inserted: any | null = null;
    try {
      const { data, error } = await supabase
        .from('component_instances')
        .insert(payloadNew)
        .select('*')
        .single();
      if (error) throw error;
      inserted = data;
    } catch (err: any) {
      insertError = err;
    }

    // Fallbacks: 1) Se erro de FK do tipo, tenta outro type_key; 2) Se erro de coluna (schema antigo), usa payload legado
    if (insertError) {
      const msg = String(insertError?.message || '');
      const code = String((insertError as any)?.code || '');

      // 1) FK de tipo inválido (23503) → tentar com fallback garantido
      if (code === '23503' || msg.includes('component_type_key_fkey')) {
        const types = await ensureKnownTypes();
        const alt = pickFallbackType(types, 'text-inline') || pickFallbackType(types, null);
        if (alt) {
          console.warn(`🔁 Retentando insert com type_key fallback: ${alt}`);
          const { data, error } = await supabase
            .from('component_instances')
            .insert({ ...payloadNew, component_type_key: alt })
            .select('*')
            .single();
          if (!error && data) {
            inserted = data;
          } else {
            insertError = error;
          }
        }
      }

      // 2) Coluna desconhecida (schema antigo) → usar payload legado
      if (!inserted && (code === '42703' || msg.includes('column') || msg.includes('properties'))) {
        console.warn('🔁 Schema antigo detectado, tentando insert legado...');
        const legacyPayload = {
          funnel_id: funnelId,
          component_type_id: null,
          config: { ...properties, blockType: typeKeyToUse, stepNumber },
          position: orderIndex - 1,
          is_active: true,
        } as any;
        const { data, error } = await supabase
          .from('component_instances')
          .insert(legacyPayload)
          .select('*')
          .single();
        if (!error && data) {
          inserted = data;
          insertError = null;
        } else {
          insertError = error;
        }
      }
    }

    if (!inserted) {
      console.error('❌ Erro ao adicionar componente:', insertError);
      throw insertError || new Error('Insert falhou');
    }

    console.log(`✅ Componente adicionado: ${inserted.id}`);
    return inserted as unknown as ComponentInstance;
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
    return data as unknown as ComponentInstance;
  },

  /**
   * Remove componente
   */
  async deleteComponent(id: string) {
    console.log(`🗑️ Removendo componente: ${id}`);

    const { error } = await supabase.from('component_instances').delete().eq('id', id);

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
  async reorderComponents(params: { funnelId: string; stepNumber: number; newOrderIds: string[] }) {
    const { funnelId, stepNumber, newOrderIds } = params;

    console.log(`🔀 Reordenando componentes: ${newOrderIds.length} itens`);

    // Buscar estado atual para validação
    const current = await this.getComponents({ funnelId, stepNumber });
    const currentIds = current.map(c => c.id).sort();
    const newIds = [...newOrderIds].sort();

    // Validação: mesmo tamanho e conjunto exato de IDs
    if (currentIds.length !== newIds.length) {
      throw new Error(
        `Reordenação inválida: quantidade diferente (atual: ${currentIds.length}, nova: ${newIds.length})`,
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

    // ✅ FASE 4.2: Usar batch update para atomicidade
    console.log('🔄 Aplicando nova ordem em lote...');

    const updates = newOrderIds.map((id, index) => ({
      id,
      order_index: index + 1,
    }));

    await this.batchUpdateComponents(updates);

    console.log(`✅ Reordenação concluída: ${newOrderIds.length} componentes`);
    return true;
  },

  /**
   * ✅ FASE 4.2: Batch update de componentes (operação atômica)
   * 
   * ESTRATÉGIA:
   * 1. Tenta usar RPC function batch_update_components (quando disponível)
   * 2. Fallback gracioso para Promise.all se RPC não existir
   * 
   * BENEFÍCIOS DO RPC:
   * - Transação atômica no banco
   * - ~70% mais rápido que múltiplos updates
   * - Rollback automático em caso de erro
   */
  async batchUpdateComponents(updates: UpdateComponentInput[]) {
    console.log(`🔄 Executando batch update de ${updates.length} componentes...`);

    // Preparar payload para RPC
    const rpcPayload = updates.map(update => ({
      id: update.id,
      properties: update.properties,
      custom_styling: update.custom_styling,
      order_index: update.order_index,
      is_active: update.is_active,
      is_locked: update.is_locked,
    }));

    try {
      // ✅ FASE 4.2: Tentar usar RPC function (se migration foi aplicada)
      // @ts-ignore - RPC function ainda não nos types gerados (aguardando regeneração)
      const { data, error } = await supabase.rpc('batch_update_components', {
        updates: rpcPayload,
      });

      if (!error && data) {
        const resultAny: any = Array.isArray(data) ? data[0] : data;
        console.log(`✅ Batch update (RPC) concluído: ${resultAny?.updated_count || updates.length} componentes`);
        return {
          success: true,
          updated: resultAny?.updated_count || updates.length,
          errors: resultAny?.errors || [],
        };
      }

      // Se RPC não existe (migration não aplicada), usar fallback
      if (error?.message?.includes('function') || error?.code === '42883') {
        console.warn('⚠️ RPC batch_update_components não disponível, usando fallback...');
        throw new Error('RPC_NOT_AVAILABLE');
      }

      throw error;

    } catch (error: any) {
      // Fallback: Usar Promise.all para quasi-atomicidade
      if (error?.message === 'RPC_NOT_AVAILABLE' || error?.code === '42883') {
        console.log('🔄 Usando fallback Promise.all para batch update...');

        const updatePromises = updates.map(update => {
          const { id, ...fields } = update;
          return supabase
            .from('component_instances')
            .update(fields)
            .eq('id', id);
        });

        const results = await Promise.all(updatePromises);

        // Verificar se algum update falhou
        const errors = results.filter(r => r.error);
        if (errors.length > 0) {
          console.error('❌ Erros no batch update (fallback):', errors);
          throw new Error(`Batch update falhou: ${errors.length} de ${updates.length} updates falharam`);
        }

        console.log(`✅ Batch update (fallback) concluído: ${updates.length} componentes`);
        return { success: true, updated: updates.length, errors: [] };
      }

      // Erro inesperado
      console.error('❌ Erro no batch update:', error);
      throw error;
    }
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
  },
};
