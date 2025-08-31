import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { randomUUID } from 'crypto';

// Carrega .env.local explicitamente
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
    global: { headers: { 'x-client-info': 'qqcv-analytics-seed' } },
});

const uuid = () => randomUUID();

async function run() {
    try {
        const userId = uuid();
        const sessionIdText = `sess_${Math.random().toString(36).slice(2, 10)}`;
        const sessionId = uuid();

        const { error: uErr } = await supabase.from('quiz_users').insert([
            {
                id: userId,
                session_id: sessionIdText,
                name: 'Teste Usuário',
                email: `teste.${Math.random().toString(36).slice(2, 6)}@exemplo.com`,
                utm_source: 'seed',
                utm_medium: 'dev',
                utm_campaign: 'debug',
            },
        ]);
        if (uErr) throw uErr;

        const { data: sessData, error: sErr } = await supabase.from('quiz_sessions').insert([
            {
                id: sessionId,
                user_id: userId,
                current_step: 19,
            },
        ]).select('id').single();
        if (sErr) throw sErr;
        const sessionIdForResponses = sessData?.id || sessionId;

        const responses = [
            {
                id: uuid(),
                session_id: sessionIdForResponses,
                step_number: 2,
                question: 'q1',
                answer: 'Opção A',
            },
            {
                id: uuid(),
                session_id: sessionIdForResponses,
                step_number: 3,
                question: 'q2',
                answer: 'Opção B',
            },
        ];

        const { error: rErr } = await supabase.from('quiz_step_responses').insert(responses);
        if (rErr) throw rErr;

        console.log(JSON.stringify({ userId, sessionId: sessionIdForResponses, inserted: responses.length }, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('seed failed:', err?.message || err);
        process.exit(1);
    }
}

run();
