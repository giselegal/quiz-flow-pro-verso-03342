import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://pwtjuuhchtbzttrzoutw.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  global: { headers: { 'x-client-info': 'qqcv-analytics-seed' } },
});

function rid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

async function run() {
  try {
    const userId = rid('user');
    const sessionId = rid('session');

    const { error: uErr } = await supabase.from('quiz_users').insert([
      {
        id: userId,
        session_id: rid('seedSess'),
        name: 'Teste Usuário',
        email: `teste.${Math.random().toString(36).slice(2, 6)}@exemplo.com`,
        utm_source: 'seed',
        utm_medium: 'dev',
        utm_campaign: 'debug',
      },
    ]);
    if (uErr) throw uErr;

    const { error: sErr } = await supabase.from('quiz_sessions').insert([
      {
        id: sessionId,
        quiz_user_id: userId,
        funnel_id: 'default_funnel',
        status: 'active',
        current_step: 19,
        last_activity: new Date().toISOString(),
      },
    ]);
    if (sErr) throw sErr;

    const responses = [
      {
        id: rid('response'),
        session_id: sessionId,
        step_number: 2,
        question_id: 'q1',
        answer_value: JSON.stringify(['romantico_a']),
        answer_text: 'Opção A',
        responded_at: new Date().toISOString(),
      },
      {
        id: rid('response'),
        session_id: sessionId,
        step_number: 3,
        question_id: 'q2',
        answer_value: JSON.stringify(['romantico_b']),
        answer_text: 'Opção B',
        responded_at: new Date().toISOString(),
      },
    ];

    const { error: rErr } = await supabase.from('quiz_step_responses').insert(responses);
    if (rErr) throw rErr;

    console.log(JSON.stringify({ userId, sessionId, inserted: responses.length }, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('seed failed:', err?.message || err);
    process.exit(1);
  }
}

run();
