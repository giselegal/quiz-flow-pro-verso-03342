import { createClient, SupabaseClient } from '@supabase/supabase-js'

let serviceClient: SupabaseClient | null = null

function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env[key]) return process.env[key]
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) return (import.meta as any).env[key]
  return undefined
}

function requireEnv(key: string): string {
  const v = getEnv(key)
  if (!v) throw new Error(`Missing env ${key} for Supabase service client`)
  return v
}

export function getSupabaseServiceClient(): SupabaseClient {
  if (serviceClient) return serviceClient
  const url = requireEnv('SUPABASE_URL') || requireEnv('VITE_SUPABASE_URL')
  const serviceKey = requireEnv('SUPABASE_ACCESS_TOKEN') || requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  serviceClient = createClient(url, serviceKey, {
    global: {
      fetch: (input, init) => fetchWithRetry(input, init),
    },
  })
  return serviceClient
}

async function fetchWithRetry(input: RequestInfo | URL, init?: RequestInit, attempts = 3): Promise<Response> {
  let lastErr: any
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(input, init)
      if (!res.ok && isRetryable(res.status)) {
        await backoff(i)
        continue
      }
      return res
    } catch (err) {
      lastErr = err
      await backoff(i)
    }
  }
  if (lastErr) throw lastErr
  return fetch(input, init!)
}

function isRetryable(status: number): boolean {
  return status >= 500 || status === 429
}

function backoff(attempt: number): Promise<void> {
  const base = 200
  const jitter = Math.floor(Math.random() * 50)
  const ms = base * Math.pow(2, attempt) + jitter
  return new Promise((r) => setTimeout(r, ms))
}

export async function withServiceTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  let timer: any
  const timeout = new Promise<never>((_, rej) => {
    timer = setTimeout(() => rej(new Error('Supabase service request timeout')), ms)
  })
  try {
    const result = await Promise.race([promise, timeout])
    return result as T
  } finally {
    clearTimeout(timer)
  }
}
