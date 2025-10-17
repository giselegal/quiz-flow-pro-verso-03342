/**
 * 🔌 Supabase Lazy Loader
 * Fornece carregamento dinâmico e seguro do cliente Supabase para reduzir impacto de build
 * e evitar falhas em ambientes de teste / CI onde variáveis não existem.
 */

export interface SupabaseLazyOptions {
    force?: boolean;               // Ignora cache
    allowOnServer?: boolean;       // Permitir em SSR (default false)
    mockOnMissingEnv?: boolean;    // Retorna mock se variáveis ausentes
}

let cached: any = null;

function hasEnv(): boolean {
    return !!(import.meta.env?.VITE_SUPABASE_URL && import.meta.env?.VITE_SUPABASE_ANON_KEY);
}

function buildMock() {
    const ok = { data: null, error: null } as any;
    const chain = () => ({
        select: async () => ok,
        upsert: async () => ok,
        insert: async () => ok,
        update: async () => ok,
        delete: async () => ok,
        eq: () => chain(),
        order: () => chain(),
        single: async () => ok,
        maybeSingle: async () => ok
    });

    const subscription = { unsubscribe: () => { /* noop */ } };

    return {
        from: () => chain(),
        auth: {
            // Compatível com Supabase v2
            onAuthStateChange: (_cb: any) => ({ data: { subscription } }),
            getSession: async () => ({ data: { session: null }, error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
            signInWithPassword: async () => ok,
            signOut: async () => ok
        }
    };
}

export async function getSupabaseClient(opts: SupabaseLazyOptions = {}) {
    const { force = false, allowOnServer = false, mockOnMissingEnv = true } = opts;
    if (!force && cached) return cached;

    const isServer = typeof window === 'undefined';
    if (isServer && !allowOnServer) {
        if (mockOnMissingEnv) return buildMock();
        throw new Error('Supabase client em SSR bloqueado');
    }

    if (!hasEnv()) {
        if (mockOnMissingEnv) {
            cached = buildMock();
            return cached;
        }
        throw new Error('Variáveis Supabase ausentes');
    }

    const { createClient } = await import('@supabase/supabase-js');
    cached = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
            auth: {
                persistSession: !isServer,
                autoRefreshToken: !isServer,
                detectSessionInUrl: !isServer,
                // Evitar colisão de múltiplas instâncias sob a mesma storageKey
                storageKey: 'sb-editor'
            },
            global: { headers: { 'x-lazy-supabase': '1' } }
        }
    );
    return cached;
}

export function resetSupabaseLazyCache() { cached = null; }
