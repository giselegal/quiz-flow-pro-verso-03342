import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Carrega .env.local
const envPath = fileURLToPath(new URL('../../../.env.local', import.meta.url));
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.error('Variáveis de ambiente VITE_SUPABASE_URL/ANON_KEY ausentes. Abortei.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: { headers: { 'x-client-info': 'qqcv-maintenance-dx' } },
});

async function countRows(table) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) return { table, count: null, error: error.message };
    return { table, count };
}

async function trySelectSessions(variant) {
    if (variant === 'A') {
        return supabase.from('quiz_sessions').select('id,quiz_user_id,funnel_id,status,current_step,last_activity').order('last_activity', { ascending: false }).limit(50);
    }
    if (variant === 'B') {
        return supabase.from('quiz_sessions').select('id,session_id,user_id,status,current_step,started_at,completed_at').order('started_at', { ascending: false }).limit(50);
    }
    return { data: [], error: { message: 'no variant' } };
}

async function trySelectResponses(variant) {
    if (variant === 'A') {
        return supabase.from('quiz_step_responses').select('id,session_id,step_number,question_id,responded_at').order('responded_at', { ascending: false }).limit(100);
    }
    if (variant === 'B') {
        return supabase.from('quiz_step_responses').select('id,session_id,step_number,step_id,question_id,answered_at').order('answered_at', { ascending: false }).limit(100);
    }
    if (variant === 'C') {
        return supabase.from('quiz_step_responses').select('id,session_id,step_number,question,answer,responded_at').order('responded_at', { ascending: false }).limit(100);
    }
    return { data: [], error: { message: 'no variant' } };
}

async function run() {
    const diagnostics = { timestamp: new Date().toISOString(), counts: [], errors: [], samples: {} };

    // Counts
    const tables = ['quiz_users', 'quiz_sessions', 'quiz_step_responses', 'quiz_results', 'quiz_analytics', 'quiz_conversions'];
    for (const t of tables) diagnostics.counts.push(await countRows(`public.${t}`));

    // Sessions variant detection
    let sessions, sessionVariant = null, sessionErrs = [];
    for (const v of ['A', 'B']) {
        const res = await trySelectSessions(v);
        if (!res.error) { sessions = res; sessionVariant = v; break; }
        sessionErrs.push(res.error.message);
    }
    if (!sessions) diagnostics.errors.push(`sessions variants failed: ${sessionErrs.join(' | ')}`);

    // Responses variant detection
    let responses, responseVariant = null, responseErrs = [];
    for (const v of ['A', 'B', 'C']) {
        const res = await trySelectResponses(v);
        if (!res.error) { responses = res; responseVariant = v; break; }
        responseErrs.push(res.error.message);
    }
    if (!responses) diagnostics.errors.push(`responses variants failed: ${responseErrs.join(' | ')}`);

    diagnostics.samples.sessions = sessions?.data || [];
    diagnostics.samples.responses = responses?.data || [];

    // Orphans (approx): compare recent response.session_id vs recent sessions ids
    try {
        const sessionIds = new Set((sessions?.data || []).map(s => s.id));
        const orphanResponses = (responses?.data || []).filter(r => !sessionIds.has(r.session_id)).map(r => r.id);
        diagnostics.orphans = { responseCountApprox: orphanResponses.length, sampleResponseIds: orphanResponses.slice(0, 20) };
    } catch (e) {
        diagnostics.errors.push(`orphan detection failed: ${e.message}`);
    }

    console.log(JSON.stringify({
        ...diagnostics,
        variants: { sessionVariant, responseVariant },
    }, null, 2));
}

run().catch(e => { console.error('diagnostics failed:', e?.message || e); process.exit(1); });
