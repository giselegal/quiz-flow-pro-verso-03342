import type { Database } from '@/services/integrations/supabase/types';
import { getSupabaseClient } from '@/services/supabaseClient';

// Configuração segura para SSR - sem chaves hardcoded
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cliente seguro para SSR
export const supabaseSafe = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
    detectSessionInUrl: typeof window !== 'undefined',
  },
  global: {
    headers: {
      'x-client-info': 'quiz-quest-challenge-verse',
    },
  },
});