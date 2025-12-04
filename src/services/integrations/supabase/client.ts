// Supabase Client - Configurado automaticamente pelo Lovable Cloud
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Priorizar VITE_SUPABASE_PUBLISHABLE_KEY (padrão Lovable Cloud)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log para debug (apenas em DEV)
if (import.meta.env.DEV) {
  console.log('[Supabase] URL:', SUPABASE_URL ? '✅' : '❌');
  console.log('[Supabase] KEY:', SUPABASE_KEY ? '✅' : '❌');
}

let supabaseInstance: SupabaseClient<Database> | null = null;

function getClient(): SupabaseClient<Database> {
  if (supabaseInstance) return supabaseInstance;
  
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('[Supabase] ❌ Variáveis de ambiente não configuradas!');
    console.error('[Supabase] VITE_SUPABASE_URL:', SUPABASE_URL || 'vazio');
    console.error('[Supabase] VITE_SUPABASE_PUBLISHABLE_KEY:', SUPABASE_KEY || 'vazio');
    throw new Error('Supabase não configurado. Verifique as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.');
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

export const supabase = getClient();

export function setSupabaseCredentials(url: string, anonKey: string) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('supabase:url', String(url || ''));
      localStorage.setItem('supabase:key', String(anonKey || ''));
    }
  } catch {}
}
