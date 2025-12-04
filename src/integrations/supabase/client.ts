/**
 * 🔌 Cliente Supabase Canônico
 * 
 * Este é o ÚNICO arquivo que deve criar a instância do Supabase.
 * Todos os outros arquivos devem re-exportar deste.
 * 
 * @canonical true
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Priorizar VITE_SUPABASE_PUBLISHABLE_KEY (padrão Lovable Cloud)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log para debug (apenas em DEV)
if (import.meta.env.DEV) {
    console.log('[Supabase Canônico] URL:', SUPABASE_URL ? '✅' : '❌');
    console.log('[Supabase Canônico] KEY:', SUPABASE_KEY ? '✅' : '❌');
}

let supabaseInstance: SupabaseClient<Database> | null = null;

// Mock client para quando variáveis não estão configuradas
function createMockClient(): SupabaseClient<Database> {
    const authError = new Error('Supabase não configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.');

    const mockAuth = {
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => { throw authError; },
        signUp: async () => { throw authError; },
        signOut: async () => ({ error: null }),
        resetPasswordForEmail: async () => { throw authError; },
        signInWithOAuth: async () => { throw authError; },
        updateUser: async () => { throw authError; },
        refreshSession: async () => ({ data: { user: null, session: null }, error: null }),
    };

    const chain = () => ({
        select: async () => ({ data: null, error: null }),
        upsert: async () => ({ data: null, error: null }),
        insert: async () => ({ data: null, error: null }),
        update: async () => ({ data: null, error: null }),
        delete: async () => ({ data: null, error: null }),
        eq: () => chain(),
        order: () => chain(),
        limit: () => chain(),
        single: async () => ({ data: null, error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
    });

    return {
        from: () => chain(),
        auth: mockAuth,
        storage: {
            from: () => ({
                upload: async () => ({ data: null, error: null }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
                remove: async () => ({ data: null, error: null }),
                list: async () => ({ data: [], error: null }),
            }),
        },
        channel: () => ({
            on: () => ({ subscribe: () => ({}) }),
            subscribe: () => ({}),
        }),
    } as unknown as SupabaseClient<Database>;
}

function getClient(): SupabaseClient<Database> {
    if (supabaseInstance) return supabaseInstance;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.warn('[Supabase] ⚠️ Variáveis de ambiente não configuradas - usando mock client');
        return createMockClient();
    }

    supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    });

    return supabaseInstance;
}

// Export da instância singleton
export const supabase = getClient();

// Função para configurar credenciais dinamicamente (para testes)
export function setSupabaseCredentials(url: string, anonKey: string) {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('supabase:url', String(url || ''));
            localStorage.setItem('supabase:key', String(anonKey || ''));
        }
    } catch {}
}

// Re-export para compatibilidade
export function getSupabaseClient(): SupabaseClient<Database> {
    return supabase;
}
