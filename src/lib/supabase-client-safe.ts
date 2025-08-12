import type { Database } from '@/integrations/supabase/types';
import { createClient } from '@supabase/supabase-js';

// Configuração segura para SSR
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://inabgbgrgzfxgkbdaush.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYWJnYmdyZ3pmeGdrYmRhdXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjM1MTcsImV4cCI6MjA2NzgzOTUxN30.RftMKxnqV09nWIVAbJIWMTS-JxiVDOhPZneAXuocGfU';

// Cliente seguro para SSR
export const supabaseSafe = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
    detectSessionInUrl: typeof window !== 'undefined',
  },
  global: {
    headers: {
      'x-client-info': 'quiz-quest-challenge-verse',
    },
  },
});

// Hook para usar Supabase de forma segura
export const useSupabaseSafe = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return {
    supabase: supabaseSafe,
    isClient,
    isReady: isClient,
  };
};

// Função para operações seguras
export const withSupabase = async <T>(
  operation: (client: typeof supabaseSafe) => Promise<T>
): Promise<T | null> => {
  if (typeof window === 'undefined') {
    console.warn('Supabase operation skipped on server side');
    return null;
  }

  try {
    return await operation(supabaseSafe);
  } catch (error) {
    console.error('Supabase operation failed:', error);
    return null;
  }
};

import { useEffect, useState } from 'react';
