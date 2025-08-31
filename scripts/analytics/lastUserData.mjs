import { createClient } from '@supabase/supabase-js';

// Resolve Supabase credentials from env or fallback (as in supabase-client-safe)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://pwtjuuhchtbzttrzoutw.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w';

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: { headers: { 'x-client-info': 'qqcv-analytics' } },
});

async function run() {
    try {
        const now = new Date().toISOString();
        const usersPromise = supabase
            .from('quiz_users')
            .select('id,name,email,created_at,utm_source,utm_medium,utm_campaign')
            .order('created_at', { ascending: false })
            .limit(10);

        const sessionsPromise = supabase
            .from('quiz_sessions')
            .select('id,quiz_user_id,funnel_id,status,current_step,last_activity,completed_at')
            .order('last_activity', { ascending: false })
            .limit(10);

        const responsesPromise = supabase
            .from('quiz_step_responses')
            .select('session_id,step_number,question_id,responded_at')
            .order('responded_at', { ascending: false })
            .limit(10);

        const [users, sessions, responses] = await Promise.all([
            usersPromise,
            sessionsPromise,
            responsesPromise,
        ]);

        const out = {
            timestamp: now,
            users: users.data || [],
            sessions: sessions.data || [],
            responses: responses.data || [],
            errors: [users.error, sessions.error, responses.error].filter(Boolean).map(e => e?.message),
        };

        console.log(JSON.stringify(out, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('analytics:lastUserData failed:', err?.message || err);
        process.exit(1);
    }
}

run();
