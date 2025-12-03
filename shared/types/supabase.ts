// =============================================================================
// TIPOS TYPESCRIPT PARA INTEGRAÇÃO COM SUPABASE
// Sistema de Quiz Quest Challenge Verse
// DEPRECADO: Use src/integrations/supabase/types.ts como fonte de verdade
// Este arquivo mantém apenas interfaces auxiliares para retrocompatibilidade
// =============================================================================

// Re-export da fonte oficial de tipos
export type { Database } from '../src/integrations/supabase/types';

// =============================================================================
// INTERFACES AUXILIARES
// =============================================================================
// NOTA: Para tipos de banco de dados, use src/integrations/supabase/types.ts

// =============================================================================
// TIPOS PARA AUTENTICAÇÃO
// =============================================================================

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// =============================================================================
// TIPOS PARA RESPOSTAS DA API
// =============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

// =============================================================================
// TIPOS PARA VALIDAÇÃO
// =============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
