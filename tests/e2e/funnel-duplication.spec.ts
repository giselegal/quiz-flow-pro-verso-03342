/**
 * 🎯 FASE 2: Testes E2E para Fluxo de Duplicação de Funis
 * 
 * Cobertura específica:
 * - Duplicar funil completo
 * - Validar normalização de IDs
 * - Validar preservação de referências
 * - Validar transformações
 */

import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

test.describe('🔄 Duplicação e Clonagem de Funis', () => {
  let originalFunnelId: string;
  let clonedFunnelId: string;

  test.beforeAll(async () => {
    // Criar funil de teste com blocos
    const { data: funnel, error: funnelError } = await supabase
      .from('funnels')
      .insert({
        name: `Original E2E ${Date.now()}`,
        description: 'Funil para teste de clonagem',
        is_published: true,
      })
      .select()
      .single();

    expect(funnelError).toBeNull();
    expect(funnel).toBeDefined();
    originalFunnelId = funnel!.id;

    // Criar step
    const { data: step, error: stepError } = await supabase
      .from('funnel_steps')
      .insert({
        funnel_id: originalFunnelId,
        step_order: 1,
      })
      .select()
      .single();

    expect(stepError).toBeNull();

    // Adicionar blocos
    const { error: blocksError } = await supabase
      .from('component_instances')
      .insert([
        {
          step_id: step!.id,
          component_type: 'quiz-intro-header',
          display_order: 0,
          properties: { title: 'Título Original' },
          content: {},
        },
        {
          step_id: step!.id,
          component_type: 'options-grid',
          display_order: 1,
          properties: { columns: 2 },
          content: {},
        },
      ]);

    expect(blocksError).toBeNull();

    console.log(`✅ Funil original criado: ${originalFunnelId}`);
  });

  test.afterAll(async () => {
    // Limpar funis de teste
    if (originalFunnelId) {
      await supabase.from('funnels').delete().eq('id', originalFunnelId);
    }
    if (clonedFunnelId) {
      await supabase.from('funnels').delete().eq('id', clonedFunnelId);
    }
  });

  test('1. Duplicar funil via API', async () => {
    // Importar serviço de clonagem
    const { funnelCloneService } = await import('@/services/funnel/FunnelCloneService');

    // Clonar funil
    const result = await funnelCloneService.clone(originalFunnelId, {
      name: 'Cópia via API',
      asDraft: false,
    });

    expect(result.success).toBe(true);
    expect(result.clonedFunnel).toBeDefined();
    expect(result.clonedFunnel?.id).not.toBe(originalFunnelId);
    expect(result.clonedFunnel?.name).toBe('Cópia via API');

    clonedFunnelId = result.clonedFunnel!.id;

    console.log(`✅ Funil clonado: ${clonedFunnelId}`);
    console.log(`📊 Estatísticas:`, result.stats);
  });

  test('2. Validar normalização de IDs', async () => {
    // Carregar steps de ambos os funis
    const { data: originalSteps } = await supabase
      .from('funnel_steps')
      .select('id')
      .eq('funnel_id', originalFunnelId);

    const { data: clonedSteps } = await supabase
      .from('funnel_steps')
      .select('id')
      .eq('funnel_id', clonedFunnelId);

    expect(originalSteps).toBeDefined();
    expect(clonedSteps).toBeDefined();
    expect(originalSteps!.length).toBe(clonedSteps!.length);

    // Validar que IDs são diferentes
    const originalStepIds = new Set(originalSteps!.map(s => s.id));
    const clonedStepIds = new Set(clonedSteps!.map(s => s.id));

    const intersection = new Set([...originalStepIds].filter(id => clonedStepIds.has(id)));
    expect(intersection.size).toBe(0); // Nenhum ID duplicado

    console.log('✅ IDs de steps foram normalizados');

    // Validar blocos
    const originalStepIdsList = originalSteps!.map(s => s.id);
    const clonedStepIdsList = clonedSteps!.map(s => s.id);

    const { data: originalBlocks } = await supabase
      .from('component_instances')
      .select('id')
      .in('step_id', originalStepIdsList);

    const { data: clonedBlocks } = await supabase
      .from('component_instances')
      .select('id')
      .in('step_id', clonedStepIdsList);

    expect(originalBlocks).toBeDefined();
    expect(clonedBlocks).toBeDefined();
    expect(originalBlocks!.length).toBe(clonedBlocks!.length);

    const originalBlockIds = new Set(originalBlocks!.map(b => b.id));
    const clonedBlockIds = new Set(clonedBlocks!.map(b => b.id));

    const blockIntersection = new Set([...originalBlockIds].filter(id => clonedBlockIds.has(id)));
    expect(blockIntersection.size).toBe(0); // Nenhum ID duplicado

    console.log('✅ IDs de blocos foram normalizados');
  });

  test('3. Validar preservação de propriedades', async () => {
    // Carregar steps
    const { data: originalSteps } = await supabase
      .from('funnel_steps')
      .select('id')
      .eq('funnel_id', originalFunnelId);

    const { data: clonedSteps } = await supabase
      .from('funnel_steps')
      .select('id')
      .eq('funnel_id', clonedFunnelId);

    // Carregar blocos
    const { data: originalBlocks } = await supabase
      .from('component_instances')
      .select('*')
      .in('step_id', originalSteps!.map(s => s.id))
      .order('display_order');

    const { data: clonedBlocks } = await supabase
      .from('component_instances')
      .select('*')
      .in('step_id', clonedSteps!.map(s => s.id))
      .order('display_order');

    expect(originalBlocks).toBeDefined();
    expect(clonedBlocks).toBeDefined();
    expect(originalBlocks!.length).toBe(clonedBlocks!.length);

    // Comparar propriedades (ignorando IDs)
    for (let i = 0; i < originalBlocks!.length; i++) {
      const original = originalBlocks![i];
      const cloned = clonedBlocks![i];

      expect(cloned.component_type).toBe(original.component_type);
      expect(cloned.display_order).toBe(original.display_order);
      
      // Validar que properties foram preservadas
      expect(cloned.properties).toEqual(original.properties);

      console.log(`✅ Bloco ${i + 1}: propriedades preservadas`);
    }
  });

  test('4. Duplicar com transformações', async () => {
    const { funnelCloneService } = await import('@/services/funnel/FunnelCloneService');

    const result = await funnelCloneService.clone(originalFunnelId, {
      name: 'Cópia com Transformações',
      renamePattern: '[original] - Variação A',
      asDraft: true,
      transforms: {
        blockProperties: (block) => {
          // Adicionar sufixo em títulos
          if (block.properties?.title) {
            return {
              properties: {
                ...block.properties,
                title: `${block.properties.title} - Variação A`,
              },
            };
          }
          return {};
        },
      },
    });

    expect(result.success).toBe(true);
    expect(result.clonedFunnel?.is_published).toBe(false); // Draft

    const transformedFunnelId = result.clonedFunnel!.id;

    // Validar transformações
    const { data: steps } = await supabase
      .from('funnel_steps')
      .select('id')
      .eq('funnel_id', transformedFunnelId);

    const { data: blocks } = await supabase
      .from('component_instances')
      .select('*')
      .in('step_id', steps!.map(s => s.id));

    // Verificar que títulos foram transformados
    const blockWithTitle = blocks?.find(b => b.properties?.title);
    expect(blockWithTitle).toBeDefined();
    expect(blockWithTitle!.properties.title).toContain('Variação A');

    console.log('✅ Transformações aplicadas com sucesso');

    // Limpar
    await supabase.from('funnels').delete().eq('id', transformedFunnelId);
  });

  test('5. Duplicar com filtro de steps', async () => {
    // Adicionar mais steps ao funil original
    const { data: steps, error } = await supabase
      .from('funnel_steps')
      .insert([
        { funnel_id: originalFunnelId, step_order: 2 },
        { funnel_id: originalFunnelId, step_order: 3 },
      ])
      .select();

    expect(error).toBeNull();

    const { funnelCloneService } = await import('@/services/funnel/FunnelCloneService');

    // Clonar apenas step 1 e 2
    const result = await funnelCloneService.clone(originalFunnelId, {
      name: 'Cópia Parcial',
      includeSteps: [1, 2],
    });

    expect(result.success).toBe(true);
    expect(result.stats?.clonedSteps).toBe(2);

    // Validar que apenas 2 steps foram clonados
    const { data: clonedSteps } = await supabase
      .from('funnel_steps')
      .select('*')
      .eq('funnel_id', result.clonedFunnel!.id);

    expect(clonedSteps?.length).toBe(2);

    console.log('✅ Clonagem parcial funcionou');

    // Limpar
    await supabase.from('funnels').delete().eq('id', result.clonedFunnel!.id);
  });
});
