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
  const noop = async () => ({ data: null, error: null });
  const chain = () => ({ select: noop, upsert: noop, insert: noop, update: noop, delete: noop, eq: () => chain(), order: () => chain() });
  return {
    from: () => chain(),
    auth: { getSession: async () => ({ data: { session: null }, error: null }) }
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
        detectSessionInUrl: !isServer
      },
      global: { headers: { 'x-lazy-supabase': '1' } }
    }
  );
  return cached;
}

export function resetSupabaseLazyCache() { cached = null; }
