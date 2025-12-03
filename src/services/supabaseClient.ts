import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function getEnv(key: string): string | undefined {
  // Prefer runtime-safe envs (Vite) but allow Node for server code
  if (typeof process !== 'undefined' && process.env[key]) return process.env[key];
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) return (import.meta as any).env[key];
  return undefined;
}

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;
  const disable = getEnv('VITE_DISABLE_SUPABASE');
  if (String(disable).toLowerCase() === 'true') {
    // Return a minimal no-op client to avoid network calls in DEV
    const noop = createNoopClient();
    client = noop as unknown as SupabaseClient;
    return client;
  }
  const url = getEnv('VITE_SUPABASE_URL');
  const anon = getEnv('VITE_SUPABASE_ANON_KEY');
  if (!url || !anon) {
    throw new Error('Missing Supabase env: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
  }
  client = createClient(url, anon, {
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
