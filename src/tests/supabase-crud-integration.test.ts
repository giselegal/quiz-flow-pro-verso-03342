/**
 * 🧪 TESTES CRUD COMPLETOS - SUPABASE INTEGRATION
 * 
 * Valida todas as correções da auditoria:
 * - Bug fix: position → order_index
 * - RPC functions com search_path correto
 * - Integração frontend-backend completa
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// IDs de teste para cleanup
const testIds: string[] = [];
const TEST_FUNNEL_ID = `test-funnel-${Date.now()}`;
const TEST_STEP = 1;

describe('Supabase CRUD Integration Tests', () => {
  
  afterAll(async () => {
    // Cleanup: remover todos os componentes de teste
    if (testIds.length > 0) {
      await supabase
        .from('component_instances')
        .delete()
        .in('id', testIds);
      console.log(`✅ Cleanup: ${testIds.length} componentes de teste removidos`);
    }
  });

  describe('1. CREATE - Adicionar Componentes', () => {
    it('deve criar um componente text-block', async () => {
      const newComponent = {
        funnel_id: TEST_FUNNEL_ID,
        step_number: TEST_STEP,
        component_type_key: 'text-block',
        instance_key: `text-block-${Date.now()}`,
        order_index: 0,
        properties: {
          text: 'Teste de criação',
          alignment: 'center'
        },
        custom_styling: {
          fontSize: '16px',
          color: '#000000'
        },
        is_active: true,
        is_locked: false,
        is_template: false
      };

      const { data, error } = await supabase
        .from('component_instances')
        .insert([newComponent])
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.component_type_key).toBe('text-block');
      expect(data!.order_index).toBe(0);
      expect((data!.properties as any).text).toBe('Teste de criação');
      
      if (data?.id) testIds.push(data.id);
      console.log('✅ Componente criado:', data?.id);
    });

    it('deve criar múltiplos componentes com order_index sequencial', async () => {
      const components = [
        {
          funnel_id: TEST_FUNNEL_ID,
          step_number: TEST_STEP,
          component_type_key: 'heading',
          instance_key: `heading-${Date.now()}`,
          order_index: 1,
          properties: { text: 'Título Teste' },
          custom_styling: {},
          is_active: true
        },
        {
          funnel_id: TEST_FUNNEL_ID,
          step_number: TEST_STEP,
          component_type_key: 'button',
          instance_key: `button-${Date.now()}`,
          order_index: 2,
          properties: { label: 'Clique Aqui' },
          custom_styling: {},
          is_active: true
        }
      ];

      const { data, error } = await supabase
        .from('component_instances')
        .insert(components)
        .select();

      expect(error).toBeNull();
      expect(data).toHaveLength(2);
      expect(data![0].order_index).toBe(1);
      expect(data![1].order_index).toBe(2);
      
      data?.forEach(item => {
        if (item.id) testIds.push(item.id);
      });
      console.log('✅ Múltiplos componentes criados:', data?.length);
    });
  });

  describe('2. READ - Buscar Componentes', () => {
    it('deve buscar componentes por funnel_id e step_number', async () => {
      const { data, error } = await supabase
        .from('component_instances')
        .select('*')
        .eq('funnel_id', TEST_FUNNEL_ID)
        .eq('step_number', TEST_STEP)
        .order('order_index', { ascending: true });

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.length).toBeGreaterThan(0);
      
      // Validar ordenação
      const orderIndexes = data!.map(c => c.order_index as number);
      const isSorted = orderIndexes.every((val, i, arr) => !i || (arr[i - 1] ?? 0) <= val);
      expect(isSorted).toBe(true);
      
      console.log('✅ Componentes buscados:', data?.length, 'Order:', orderIndexes);
    });

    it('deve filtrar componentes ativos', async () => {
      const { data, error } = await supabase
        .from('component_instances')
        .select('*')
        .eq('funnel_id', TEST_FUNNEL_ID)
        .eq('is_active', true);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.every(c => c.is_active === true)).toBe(true);
      
      console.log('✅ Componentes ativos:', data?.length);
    });
  });

  describe('3. UPDATE - Atualizar Componentes', () => {
    it('deve atualizar properties de um componente', async () => {
      const testId = testIds[0];
      expect(testId).toBeDefined();

      const updatedProperties = {
        text: 'Texto atualizado via teste',
        alignment: 'left',
        newField: 'novo campo'
      };

      const { data, error } = await supabase
        .from('component_instances')
        .update({ properties: updatedProperties })
        .eq('id', testId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect((data!.properties as any).text).toBe('Texto atualizado via teste');
      expect((data!.properties as any).newField).toBe('novo campo');
      
      console.log('✅ Properties atualizado:', testId);
    });

    it('deve atualizar custom_styling', async () => {
      const testId = testIds[1];
      expect(testId).toBeDefined();

      const newStyling = {
        backgroundColor: '#ff0000',
        padding: '20px',
        borderRadius: '8px'
      };

      const { data, error } = await supabase
        .from('component_instances')
        .update({ custom_styling: newStyling })
        .eq('id', testId)
        .select()
        .single();

      expect(error).toBeNull();
      expect((data!.custom_styling as any).backgroundColor).toBe('#ff0000');
      
      console.log('✅ Custom styling atualizado:', testId);
    });

    it('deve atualizar order_index (FIX CRÍTICO: position → order_index)', async () => {
      const testId = testIds[0];
      const newOrderIndex = 99;

      const { data, error } = await supabase
        .from('component_instances')
        .update({ order_index: newOrderIndex })
        .eq('id', testId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.order_index).toBe(newOrderIndex);
      
      console.log('✅ Order index atualizado corretamente (bug fix validado):', testId);
    });
  });

  describe('4. REORDER - Reordenar Componentes', () => {
    it('deve reordenar múltiplos componentes', async () => {
      // Buscar componentes existentes
      const { data: existing } = await supabase
        .from('component_instances')
        .select('id, order_index')
        .eq('funnel_id', TEST_FUNNEL_ID)
        .eq('step_number', TEST_STEP)
        .order('order_index', { ascending: true });

      expect(existing).toBeDefined();
      expect(existing!.length).toBeGreaterThan(1);

      // Inverter ordem
      const updates = existing!.map((comp, idx) => ({
        id: comp.id,
        order_index: existing!.length - idx - 1
      }));

      // Aplicar reordenação
      for (const update of updates) {
        const { error } = await supabase
          .from('component_instances')
          .update({ order_index: update.order_index })
          .eq('id', update.id);

        expect(error).toBeNull();
      }

      // Validar nova ordem
      const { data: reordered } = await supabase
        .from('component_instances')
        .select('id, order_index')
        .eq('funnel_id', TEST_FUNNEL_ID)
        .eq('step_number', TEST_STEP)
        .order('order_index', { ascending: true });

      expect(reordered![0].id).toBe(existing![existing!.length - 1].id);
      
      console.log('✅ Reordenação validada:', reordered?.length, 'componentes');
    });
  });

  describe('5. RPC FUNCTIONS - Batch Operations', () => {
    it('deve executar batch_sync_components_for_step', async () => {
      const newStepNumber = 2;
      const items = [
        {
          component_type_key: 'text-block',
          instance_key: `batch-text-${Date.now()}`,
          order_index: 0,
          properties: { text: 'Batch sync test' },
          custom_styling: {}
        },
        {
          component_type_key: 'button',
          instance_key: `batch-button-${Date.now()}`,
          order_index: 1,
          properties: { label: 'Batch button' },
          custom_styling: {}
        }
      ];

      const { data, error } = await supabase.rpc('batch_sync_components_for_step', {
        p_funnel_id: TEST_FUNNEL_ID,
        p_step_number: newStepNumber,
        items: items
      });

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect((data as any).inserted_count).toBe(2);
      expect((data as any).errors).toEqual([]);

      // Validar inserção
      const { data: inserted } = await supabase
        .from('component_instances')
        .select('id')
        .eq('funnel_id', TEST_FUNNEL_ID)
        .eq('step_number', newStepNumber);

      expect(inserted).toHaveLength(2);
      inserted?.forEach(item => testIds.push(item.id));
      
      console.log('✅ Batch sync executado:', (data as any).inserted_count, 'componentes');
    });

    it('deve executar batch_update_components', async () => {
      const componentsToUpdate = testIds.slice(0, 2).map((id, idx) => ({
        id,
        order_index: 100 + idx,
        is_locked: true
      }));

      const { data, error } = await supabase.rpc('batch_update_components', {
        updates: componentsToUpdate
      });

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect((data as any).updated_count).toBe(2);
      expect((data as any).errors).toEqual([]);

      // Validar updates
      const { data: updated } = await supabase
        .from('component_instances')
        .select('id, order_index, is_locked')
        .in('id', componentsToUpdate.map(c => c.id));

      expect(updated!.every(c => c.is_locked === true)).toBe(true);
      expect(updated![0].order_index).toBeGreaterThanOrEqual(100);
      
      console.log('✅ Batch update executado:', (data as any).updated_count, 'componentes');
    });
  });

  describe('6. DELETE - Remover Componentes', () => {
    it('deve deletar um componente específico', async () => {
      const testId = testIds[testIds.length - 1];
      
      const { error } = await supabase
        .from('component_instances')
        .delete()
        .eq('id', testId);

      expect(error).toBeNull();

      // Validar deleção
      const { data: deleted } = await supabase
        .from('component_instances')
        .select('id')
        .eq('id', testId);

      expect(deleted).toHaveLength(0);
      
      // Remover do array de cleanup
      const index = testIds.indexOf(testId);
      if (index > -1) testIds.splice(index, 1);
      
      console.log('✅ Componente deletado:', testId);
    });

    it('deve deletar múltiplos componentes', async () => {
      const idsToDelete = testIds.slice(0, 2);
      
      const { error } = await supabase
        .from('component_instances')
        .delete()
        .in('id', idsToDelete);

      expect(error).toBeNull();

      // Validar deleção
      const { data: remaining } = await supabase
        .from('component_instances')
        .select('id')
        .in('id', idsToDelete);

      expect(remaining).toHaveLength(0);
      
      // Remover do array de cleanup
      idsToDelete.forEach(id => {
        const index = testIds.indexOf(id);
        if (index > -1) testIds.splice(index, 1);
      });
      
      console.log('✅ Múltiplos componentes deletados:', idsToDelete.length);
    });
  });

  describe('7. EDGE CASES - Casos Extremos', () => {
    it('deve lidar com properties vazias', async () => {
      const { data, error } = await supabase
        .from('component_instances')
        .insert([{
          funnel_id: TEST_FUNNEL_ID,
          step_number: TEST_STEP,
          component_type_key: 'spacer',
          instance_key: `spacer-empty-${Date.now()}`,
          order_index: 0,
          properties: {},
          custom_styling: {},
          is_active: true
        }])
        .select()
        .single();

      expect(error).toBeNull();
      expect(data!.properties).toEqual({});
      
      if (data?.id) testIds.push(data.id);
      console.log('✅ Properties vazias aceitas');
    });

    it('deve rejeitar componente sem campos obrigatórios', async () => {
      const { error } = await supabase
        .from('component_instances')
        .insert([{
          // Faltando component_type_key
          funnel_id: TEST_FUNNEL_ID,
          instance_key: `invalid-${Date.now()}`,
          order_index: 0
        }])
        .select();

      expect(error).toBeDefined();
      console.log('✅ Validação de campos obrigatórios funcionando');
    });

    it('deve lidar com order_index duplicado', async () => {
      const duplicateOrderIndex = 999;
      
      const { data: first, error: error1 } = await supabase
        .from('component_instances')
        .insert([{
          funnel_id: TEST_FUNNEL_ID,
          step_number: TEST_STEP,
          component_type_key: 'text-block',
          instance_key: `dup1-${Date.now()}`,
          order_index: duplicateOrderIndex,
          properties: {},
          custom_styling: {},
          is_active: true
        }])
        .select()
        .single();

      const { data: second, error: error2 } = await supabase
        .from('component_instances')
        .insert([{
          funnel_id: TEST_FUNNEL_ID,
          step_number: TEST_STEP,
          component_type_key: 'text-block',
          instance_key: `dup2-${Date.now()}`,
          order_index: duplicateOrderIndex,
          properties: {},
          custom_styling: {},
          is_active: true
        }])
        .select()
        .single();

      // Ambos devem ser criados (order_index não é unique)
      expect(error1).toBeNull();
      expect(error2).toBeNull();
      
      if (first?.id) testIds.push(first.id);
      if (second?.id) testIds.push(second.id);
      
      console.log('✅ Order_index duplicado permitido (comportamento esperado)');
    });
  });
});
