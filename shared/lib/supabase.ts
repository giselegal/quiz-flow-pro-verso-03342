// =============================================================================
// CLIENTE SUPABASE CONFIGURADO
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// =============================================================================
// CONFIGURAÇÃO
// =============================================================================

const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const supabaseKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

// =============================================================================
// CLIENTE PRINCIPAL
// =============================================================================

export const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// =============================================================================
// ADMIN CLIENT (SERVICE ROLE) - USO EXCLUSIVO EM BACKEND
// =============================================================================

const supabaseServiceKey =
  (import.meta as any).env?.VITE_SUPABASE_SERVICE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_KEY;

export const supabaseAdmin: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

// =============================================================================
// UTILIDADES DE AUTENTICAÇÃO
// =============================================================================

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
  
  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<Database['public']['Tables']['profiles']['Row']>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao atualizar perfil:', error);
    return null;
  }
  
  return data;
};