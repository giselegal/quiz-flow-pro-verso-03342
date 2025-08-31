import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Carrega .env.local explicitamente a partir da raiz do workspace
const envPath = fileURLToPath(new URL('../../.env.local', import.meta.url));
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Variáveis de ambiente VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY ausentes. Abortei.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: { headers: { 'x-client-info': 'qqcv-analytics' } },
});

async function run() {
    try {
        const now = new Date().toISOString();
        const users = await supabase
            .from('quiz_users')
            .select('id,name,email,created_at,utm_source,utm_medium,utm_campaign')
            .order('created_at', { ascending: false })
            .limit(10);

        // Tentativas para sessions em diferentes esquemas
        const sessionQueries = [
            () => supabase
                .from('quiz_sessions')
                .select('id,quiz_user_id,funnel_id,status,current_step,last_activity,completed_at')
                .order('last_activity', { ascending: false })
                .limit(10),
            () => supabase
                .from('quiz_sessions')
                .select('id,user_id,session_id,status,current_step,last_activity_at,completed_at')
                .order('last_activity_at', { ascending: false })
                .limit(10),
            () => supabase
                .from('quiz_sessions')
                .select('id,user_id,current_step,started_at,completed_at')
                .order('started_at', { ascending: false })
                .limit(10),
        ];

        let sessions;
        const sessionErrors = [];
        for (const build of sessionQueries) {
            const res = await build();
            if (!res.error) { sessions = res; break; }
            sessionErrors.push(res.error.message);
        }
        if (!sessions) sessions = { data: [], error: new Error(sessionErrors.join(' | ')) };

        // Tentativas para responses em diferentes esquemas
        const responseQueries = [
            () => supabase
                .from('quiz_step_responses')
                .select('session_id,step_number,question_id,responded_at')
                .order('responded_at', { ascending: false })
                .limit(10),
            () => supabase
                .from('quiz_step_responses')
                .select('session_id,step_number,step_id,question_id,answered_at')
                .order('answered_at', { ascending: false })
                .limit(10),
            () => supabase
                .from('quiz_step_responses')
                .select('session_id,step_number,question,answer,responded_at')
                .order('responded_at', { ascending: false })
                .limit(10),
        ];

        let responses;
        const responseErrors = [];
        for (const build of responseQueries) {
            const res = await build();
            if (!res.error) { responses = res; break; }
            responseErrors.push(res.error.message);
        }
        if (!responses) responses = { data: [], error: new Error(responseErrors.join(' | ')) };

        const out = {
            timestamp: now,
            users: users.data || [],
            sessions: sessions.data || [],
            responses: responses.data || [],
            errors: [users.error?.message, sessions.error?.message, responses.error?.message].filter(Boolean),
        };

        console.log(JSON.stringify(out, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('analytics:lastUserData failed:', err?.message || err);
        process.exit(1);
    }
}

run();
