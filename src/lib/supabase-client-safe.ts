import { getSupabaseClient } from '@/services/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js'

// Cliente seguro para SSR usando wrapper unificado
export const supabaseSafe: SupabaseClient = getSupabaseClient();