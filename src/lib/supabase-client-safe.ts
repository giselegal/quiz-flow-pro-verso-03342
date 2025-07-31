import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Configuração segura para SSR
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pwtjuuhchtbzttrzoutw.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w";

// Cliente seguro para SSR
export const supabaseSafe = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
    detectSessionInUrl: typeof window !== 'undefined'
  },
  global: {
    headers: {
      'x-client-info': 'quiz-quest-challenge-verse'
    }
  }
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
    isReady: isClient
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

import { useState, useEffect } from 'react';
