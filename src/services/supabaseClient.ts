import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

// Priorizar VITE_SUPABASE_PUBLISHABLE_KEY (padrão Lovable Cloud)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;
  
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase não configurado. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.');
  }
  
  client = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: (input, init) => fetchWithRetry(input, init),
    },
  });
  return client;
}

async function fetchWithRetry(input: RequestInfo | URL, init?: RequestInit, attempts = 3): Promise<Response> {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(input, init);
      if (!res.ok && isRetryable(res.status)) {
        await backoff(i);
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      await backoff(i);
    }
  }
  if (lastErr) throw lastErr;
  return fetch(input, init!);
}

function isRetryable(status: number): boolean {
  return status >= 500 || status === 429;
}

function backoff(attempt: number): Promise<void> {
  const base = 150;
  const ms = base * Math.pow(2, attempt);
  return new Promise((r) => setTimeout(r, ms));
}

export async function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  let timer: any;
  const timeout = new Promise<never>((_, rej) => {
    timer = setTimeout(() => rej(new Error('Supabase request timeout')), ms);
  });
  try {
    const result = await Promise.race([promise, timeout]);
    return result as T;
  } finally {
    clearTimeout(timer);
  }
}

function createNoopClient() {
  const noopFn = async () => ({ data: null, error: null });
  const builder = () => ({
    select: () => ({ maybeSingle: noopFn, single: noopFn, eq: () => ({ select: () => ({ maybeSingle: noopFn }) }) }),
    insert: () => ({ select: noopFn }),
    update: () => ({ select: noopFn }),
    delete: () => ({ select: noopFn }),
    eq: () => ({ select: noopFn, update: () => ({ select: noopFn }), delete: () => ({ select: noopFn }) }),
  });
  const client: any = {
    from: (_table: string) => builder(),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
  };
  return client;
}
