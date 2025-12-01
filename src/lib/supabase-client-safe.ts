import { getSupabaseClient } from '@/services/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js'

// ✅ LAZY: Cliente será criado apenas quando acessado
let _client: SupabaseClient | null = null;

export const supabaseSafe = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_client) {
      _client = getSupabaseClient();
    }
    return (_client as any)[prop];
  }
});