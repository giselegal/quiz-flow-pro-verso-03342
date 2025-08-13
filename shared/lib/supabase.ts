// =============================================================================
// CLIENTE SUPABASE CONFIGURADO
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

// =============================================================================
// CONFIGURAÇÃO
// =============================================================================

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://pwtjuuhchtbzttrzoutw.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w";

// =============================================================================
// CLIENTE PRINCIPAL
// =============================================================================

export const supabase: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
    db: {
      schema: "public",
    },
    global: {
      headers: {
        "x-application-name": "quiz-quest-challenge-verse",
      },
    },
  }
);

// =============================================================================
// CLIENTE PARA ADMINISTRAÇÃO (apenas server-side)
// =============================================================================

export const supabaseAdmin: SupabaseClient<Database> | null = (() => {
  const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

  if (!serviceKey) {
    console.warn(
      "VITE_SUPABASE_SERVICE_KEY não encontrada. Operações administrativas não estarão disponíveis."
    );
    return null;
  }

  return createClient<Database>(SUPABASE_URL, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: "public",
    },
  });
})();

// =============================================================================
// UTILITÁRIOS
// =============================================================================

/**
 * Verifica se o cliente Supabase está configurado corretamente
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from("profiles").select("count").limit(1);
    if (error) {
      console.error("Erro na conexão com Supabase:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Erro ao verificar conexão:", error);
    return false;
  }
};

/**
 * Obtém informações do usuário atual
 */
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error);
    return null;
  }
};

/**
 * Obtém o perfil completo do usuário atual
 */
export const getCurrentProfile = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error("Erro ao obter perfil do usuário:", error);
    return null;
  }
};

/**
 * Verifica se o usuário tem permissão administrativa
 */
export const isAdmin = async (): Promise<boolean> => {
  try {
    const profile = await getCurrentProfile();
    return profile?.role === "admin";
  } catch (error) {
    console.error("Erro ao verificar permissões de admin:", error);
    return false;
  }
};

/**
 * Cria um perfil para um novo usuário
 */
export const createProfile = async (user: any) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          role: "user",
          plan: "free",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    throw error;
  }
};

/**
 * Utilitário para upload de arquivos
 */
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string; path: string }> => {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("Erro no upload do arquivo:", error);
    throw error;
  }
};

/**
 * Utilitário para deletar arquivos
 */
export const deleteFile = async (bucket: string, path: string): Promise<void> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    throw error;
  }
};

// =============================================================================
// TYPES HELPERS
// =============================================================================

export type SupabaseResponse<T> = {
  data: T | null;
  error: any;
};

export type SupabaseInsertResponse<T> = {
  data: T[] | null;
  error: any;
};

export type SupabaseUpdateResponse<T> = {
  data: T[] | null;
  error: any;
};

export type SupabaseSelectResponse<T> = {
  data: T[] | null;
  error: any;
  count?: number | null;
};

// =============================================================================
// CONSTANTES
// =============================================================================

export const STORAGE_BUCKETS = {
  QUIZ_IMAGES: "quiz-images",
  QUIZ_VIDEOS: "quiz-videos",
  QUIZ_AUDIO: "quiz-audio",
  PROFILE_AVATARS: "profile-avatars",
  TEMPLATES: "templates",
} as const;

export const REALTIME_CHANNELS = {
  QUIZ_UPDATES: "quiz-updates",
  USER_ACTIVITY: "user-activity",
  ANALYTICS: "analytics",
} as const;

// =============================================================================
// CONFIGURAÇÃO DE REALTIME
// =============================================================================

/**
 * Subscreve a atualizações de um quiz específico
 */
export const subscribeToQuizUpdates = (quizId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(REALTIME_CHANNELS.QUIZ_UPDATES)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "quizzes",
        filter: `id=eq.${quizId}`,
      },
      callback
    )
    .subscribe();
};

/**
 * Subscreve a atualizações de tentativas de quiz
 */
export const subscribeToQuizAttempts = (quizId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`quiz-attempts-${quizId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "quiz_attempts",
        filter: `quiz_id=eq.${quizId}`,
      },
      callback
    )
    .subscribe();
};

// =============================================================================
// LOGS E DEBUG
// =============================================================================

if (import.meta.env.MODE === "development") {
  console.log("🔗 Supabase configurado:", {
    url: SUPABASE_URL,
    hasServiceKey: !!import.meta.env.VITE_SUPABASE_SERVICE_KEY,
    environment: import.meta.env.MODE,
  });
}

export default supabase;
