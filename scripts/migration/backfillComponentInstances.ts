/**
 * Backfill de component_instances a partir de funnel_pages.blocks
 *
 * Uso:
 *  - Dry-run (padrão): tsx scripts/migration/backfillComponentInstances.ts --dry-run
 *  - Aplicar:          tsx scripts/migration/backfillComponentInstances.ts --apply [--force]
 *
 * Requisitos para --apply:
 *  - SUPABASE_URL e SUPABASE_SERVICE_KEY no ambiente
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/integrations/supabase/types';

type Client = ReturnType<typeof createClient<Database>>;

const hasFlag = (flag: string) => process.argv.includes(flag);
const DRY_RUN = hasFlag('--dry-run') || !hasFlag('--apply');
const FORCE = hasFlag('--force');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function log(...args: any[]) {
  // eslint-disable-next-line no-console
  console.log('[backfillInstances]', ...args);
}

async function getClient(): Promise<Client | null> {
  if (!SUPABASE_URL) {
    log('SUPABASE_URL ausente. Execute com variáveis de ambiente ou use apenas --dry-run.');
    return null;
  }
  if (!SUPABASE_SERVICE_KEY) {
    if (!DRY_RUN) {
      log('SUPABASE_SERVICE_KEY ausente. Somente --dry-run é permitido sem service role key.');
      return null;
    }
    // Para dry-run, podemos criar um client com chave anônima se existir, mas não é obrigatório.
    const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (!anon) return null;
    return createClient<Database>(SUPABASE_URL, anon);
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

function safeArray<T = any>(val: any): T[] {
  return Array.isArray(val) ? (val as T[]) : [];
}

function genId(prefix = 'ci'): string {
  // Node 18+ tem crypto.randomUUID
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const c = (global as any).crypto || require('crypto');
  const uuid = c?.randomUUID ? c.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}_${uuid}`;
}

async function backfill(client: Client) {
  log('Iniciando backfill', { DRY_RUN, FORCE });

  // Buscar funis
  const { data: funnels, error: funnelsErr } = await client
    .from('funnels')
    .select('id, user_id')
    .order('created_at', { ascending: true });

  if (funnelsErr) throw funnelsErr;
  if (!funnels || funnels.length === 0) {
    log('Nenhum funil encontrado. Nada a fazer.');
    return;
  }

  let totalPlanned = 0;
  let totalInserted = 0;

  for (const funnel of funnels) {
    // Pular funis que já possuem instances, a menos que --force
    const { count, error: cntErr } = await client
      .from('component_instances')
      .select('id', { count: 'exact', head: true })
      .eq('funnel_id', funnel.id);

    if (cntErr) throw cntErr;
    if (!FORCE && (count || 0) > 0) {
      log(`Funnel ${funnel.id} já possui ${count} instances. Pulando (use --force para recriar).`);
      continue;
    }

    const { data: pages, error: pagesErr } = await client
      .from('funnel_pages')
      .select('id, page_order, page_type, blocks')
      .eq('funnel_id', funnel.id)
      .order('page_order', { ascending: true });

    if (pagesErr) throw pagesErr;

    const plannedInserts: Database['public']['Tables']['component_instances']['Insert'][] = [];

    for (const page of pages || []) {
      const blocks = (page as any).blocks ?? [];
      const arr = safeArray<any>(blocks);
      arr.forEach((block, idx) => {
        const component_type_key = (block?.type as string) || 'text-inline';
        const instance_key = (block?.id as string) || `page-${page.id}-idx-${idx}`;
        const step_number = typeof block?.stepNumber === 'number'
          ? block.stepNumber
          : (typeof page.page_order === 'number' ? page.page_order + 1 : 1);
        const order_index = idx;
        const properties = (block?.properties ?? block?.content ?? {}) as any;
        const insert: Database['public']['Tables']['component_instances']['Insert'] = {
          id: genId('ci'),
          component_type_key,
          funnel_id: funnel.id,
          instance_key,
          step_number,
          order_index,
          properties,
          is_active: true,
        };
        plannedInserts.push(insert);
      });
    }

    totalPlanned += plannedInserts.length;
    log(`Funnel ${funnel.id}: planejados ${plannedInserts.length} component_instances.`);

    if (!DRY_RUN && plannedInserts.length > 0) {
      // Se não for FORCE, apaga os existentes primeiro (idempotência básica)
      if (FORCE) {
        const { error: delErr } = await client
          .from('component_instances')
          .delete()
          .eq('funnel_id', funnel.id);
        if (delErr) throw delErr;
        log(`Funnel ${funnel.id}: registros antigos removidos.`);
      }

      // Inserir em lotes para evitar payloads grandes
      const BATCH = 100;
      for (let i = 0; i < plannedInserts.length; i += BATCH) {
        const batch = plannedInserts.slice(i, i + BATCH);
        const { error: insErr } = await client
          .from('component_instances')
          .insert(batch);
        if (insErr) throw insErr;
        totalInserted += batch.length;
        log(`Funnel ${funnel.id}: inseridos ${batch.length} (acumulado ${totalInserted}).`);
      }
    }
  }

  log(`Backfill finalizado. Planejados: ${totalPlanned}. Inseridos: ${totalInserted} ${DRY_RUN ? '(dry-run)' : ''}`);
}

(async () => {
  log('Parâmetros:', { DRY_RUN, FORCE });
  const client = await getClient();
  if (!client) {
    log('Sem client Supabase válido. Encerrando (nada alterado).');
    process.exit(0);
  }
  try {
    await backfill(client);
    process.exit(0);
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[backfillInstances] Erro:', e?.message || e);
    process.exit(1);
  }
})();
