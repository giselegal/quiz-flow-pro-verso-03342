import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/integrations/supabase/types';

function log(...args: any[]) {
    // eslint-disable-next-line no-console
    console.log('[diagnostic:backfill]', ...args);
}

const getArg = (name: string): string | undefined => {
    const prefix = `--${name}`;
    for (let i = 0; i < process.argv.length; i++) {
        const arg = process.argv[i];
        if (arg === prefix) return process.argv[i + 1];
        if (arg.startsWith(prefix + '=')) return arg.substring(prefix.length + 1);
    }
    return undefined;
};

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const FUNNEL_FILTER = (getArg('funnel') || getArg('only') || '').trim();

async function main() {
    log('Checando variáveis de ambiente');
    log('SUPABASE_URL:', SUPABASE_URL ? 'OK (definido)' : 'FALTANDO');
    log('SERVICE_KEY:', SERVICE_KEY ? 'OK' : 'FALTANDO');
    log('ANON_KEY:', ANON_KEY ? 'OK' : 'FALTANDO');

    if (!SUPABASE_URL) {
        log('Defina SUPABASE_URL no .env para continuar.');
        process.exit(0);
    }

    const key = SERVICE_KEY || ANON_KEY;
    if (!key) {
        log('Nenhuma chave encontrada. Defina SUPABASE_SERVICE_KEY (preferível) ou SUPABASE_ANON_KEY para teste de leitura.');
        process.exit(0);
    }

    const client = createClient<Database>(SUPABASE_URL, key);
    log('Testando conexão e permissões...');
    const meta = await client.from('funnels').select('id', { count: 'exact', head: true });
    if (meta.error) {
        log('Erro ao acessar funnels:', meta.error.message);
        process.exit(1);
    }
    log('Acesso a funnels OK. Total (estimado):', meta.count ?? 'desconhecido');

    let funnelsQuery = client.from('funnels').select('id').order('created_at', { ascending: true });
    if (FUNNEL_FILTER) {
        const ids = FUNNEL_FILTER.split(',').map((s) => s.trim()).filter(Boolean);
        funnelsQuery = ids.length > 1 ? funnelsQuery.in('id', ids) : funnelsQuery.eq('id', ids[0]);
    }
    const { data: funnels, error: fErr } = await funnelsQuery;
    if (fErr) {
        log('Erro listando funis:', fErr.message);
        process.exit(1);
    }
    log(`Funis alvo: ${funnels?.length || 0}`);

    if (!funnels || funnels.length === 0) {
        log('Nenhum funil alvo encontrado. Ajuste o filtro --funnel ou verifique dados.');
        process.exit(0);
    }

    let totalPages = 0;
    let totalInstancesExisting = 0;
    for (const f of funnels) {
        const pagesMeta = await client.from('funnel_pages').select('id', { count: 'exact', head: true }).eq('funnel_id', f.id);
        if (pagesMeta.error) {
            log('Erro ao contar páginas do funil', f.id, pagesMeta.error.message);
            continue;
        }
        const instMeta = await client.from('component_instances').select('id', { count: 'exact', head: true }).eq('funnel_id', f.id);
        if (instMeta.error) {
            log('Erro ao contar instances do funil', f.id, instMeta.error.message);
            continue;
        }
        log(`Funnel ${f.id}: pages=${pagesMeta.count || 0}, instances=${instMeta.count || 0}`);
        totalPages += pagesMeta.count || 0;
        totalInstancesExisting += instMeta.count || 0;
    }

    log('Resumo:', { totalFunnels: funnels.length, totalPages, totalInstancesExisting });
    log('Próximos passos sugeridos:');
    log('- Dry-run:    npm run backfill:component-instances:dry -- --funnel=<ids>');
    log('- Aplicar:    npm run backfill:component-instances -- --funnel=<ids>');
    log('- Recriar:    adicionar --force para apagar e recriar instances do(s) funil(is)');
}

main().catch((e) => {
    // eslint-disable-next-line no-console
    console.error('[diagnostic:backfill] Erro:', e?.message || e);
    process.exit(1);
});
