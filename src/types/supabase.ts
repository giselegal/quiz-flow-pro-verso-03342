// Canonical re-export of Supabase types
// FONTE DE VERDADE: src/integrations/supabase/types.ts (gerado do banco de dados)
// Este arquivo mantém retrocompatibilidade para imports antigos
export type { Database } from '@/services/integrations/supabase/types';

// Re-export de interfaces auxiliares do arquivo legado
export type { 
  AuthUser, 
  AuthState, 
  ApiResponse, 
  PaginatedResponse, 
  ValidationError, 
  ValidationResult,
} from '@/shared/types/supabase';
