// 🔗 Supabase central client
// Responsável por fornecer uma única instância (lazy) reutilizável no runtime.
// Evita múltiplos createClient espalhados.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;
let _warned = false;

export function getSupabase(): SupabaseClient | null {
    if (_client) return _client;
    const url = import.meta?.env?.VITE_SUPABASE_URL || (globalThis as any).SUPABASE_URL || process.env.SUPABASE_URL;
    const anon = import.meta?.env?.VITE_SUPABASE_ANON_KEY || (globalThis as any).SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !anon) {
        if (!_warned) {
            console.warn('[supabase/config] Variáveis SUPABASE_URL/SUPABASE_ANON_KEY ausentes – client inativo.');
            _warned = true;
        }
        return null;
    }
    _client = createClient(url, anon, { auth: { persistSession: true } });
    return _client;
}

export function resetSupabaseForTests() {
    _client = null;
    _warned = false;
}
