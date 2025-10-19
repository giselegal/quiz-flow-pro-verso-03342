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
        // Métodos de construção de query — retornam o próprio builder para encadeamento
        select: (_cols?: any, _opts?: any) => chain(),
        upsert: (_data?: any, _opts?: any) => chain(),
        insert: (_data?: any, _opts?: any) => chain(),
        update: (_data?: any, _opts?: any) => chain(),
        delete: (_opts?: any) => chain(),
        eq: (_col?: any, _val?: any) => chain(),
        in: (_col?: any, _vals?: any[]) => chain(),
        like: (_col?: any, _pattern?: string) => chain(),
        ilike: (_col?: any, _pattern?: string) => chain(),
        order: (_col?: any, _opts?: any) => chain(),
        limit: (_n?: number) => chain(),
        range: (_from?: number, _to?: number) => chain(),
        // Métodos terminais — retornam Promises simuladas
        single: async () => ok,
        maybeSingle: async () => ok,
        then: (resolve: any) => Promise.resolve(ok).then(resolve),
        catch: (reject: any) => Promise.resolve(ok).catch(reject),
        finally: (cb: any) => Promise.resolve(ok).finally(cb),
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
