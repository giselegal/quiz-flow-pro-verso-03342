/**
 * 🔄 DRAFT SYNC SERVICE - Fase 4 Gargalos
 * 
 * Serviço para gerenciar drafts com:
 * - Fallback localStorage para usuários não autenticados
 * - Sync automático ao fazer login
 * - Validação de IDs antes de salvar
 * 
 * @version 1.0.0
 */

import { supabase } from '@/integrations/supabase/client';
import { appLogger } from '@/lib/utils/appLogger';
import { nanoid } from 'nanoid';
import type { QuizSchema, QuizStep, QuizBlock } from '@/schemas/quiz-schema.zod';

// Alias for clarity
type Quiz = QuizSchema;

// ============================================================================
// TYPES
// ============================================================================

export interface LocalDraft {
  id: string;
  funnelId: string;
  quiz: Quiz;
  createdAt: string;
  updatedAt: string;
  version: number;
  syncStatus: 'pending' | 'synced' | 'error';
  syncError?: string;
}

export interface DraftSyncResult {
  success: boolean;
  draftId?: string;
  version?: number;
  error?: string;
  syncedToCloud?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const LOCAL_DRAFTS_KEY = 'quiz-flow:local-drafts';
const DRAFT_INDEX_KEY = 'quiz-flow:draft-index';

// ============================================================================
// ID VALIDATION
// ============================================================================

/**
 * Verifica se um ID é um UUID válido
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Verifica se um ID é um nanoid válido (21 caracteres alfanuméricos)
 */
export function isValidNanoid(id: string): boolean {
  return /^[A-Za-z0-9_-]{21}$/.test(id);
}

/**
 * Gera um ID válido se o fornecido não for válido
 */
export function ensureValidId(id: string | undefined | null): string {
  if (id && (isValidUUID(id) || isValidNanoid(id))) {
    return id;
  }
  return nanoid();
}

/**
 * Valida e corrige IDs em um quiz
 */
export function validateAndFixQuizIds(quiz: Quiz): Quiz {
  const fixedQuiz = { ...quiz };
  
  // Garantir que metadata.id existe e é válido
  if (fixedQuiz.metadata) {
    fixedQuiz.metadata = {
      ...fixedQuiz.metadata,
      id: ensureValidId(fixedQuiz.metadata.id),
    };
  }
  
  // Validar IDs dos steps e blocks
  if (fixedQuiz.steps) {
    fixedQuiz.steps = fixedQuiz.steps.map((step: QuizStep) => ({
      ...step,
      id: ensureValidId(step.id),
      blocks: step.blocks?.map((block: QuizBlock) => ({
        ...block,
        id: ensureValidId(block.id),
      })) || [],
    }));
  }
  
  return fixedQuiz;
}

// ============================================================================
// LOCAL STORAGE OPERATIONS
// ============================================================================

/**
 * Carrega todos os drafts locais
 */
export function loadLocalDrafts(): Record<string, LocalDraft> {
  try {
    const stored = localStorage.getItem(LOCAL_DRAFTS_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch (error) {
    appLogger.error('[DraftSync] Erro ao carregar drafts locais:', error);
    return {};
  }
}

/**
 * Salva todos os drafts locais
 */
function saveLocalDrafts(drafts: Record<string, LocalDraft>): boolean {
  try {
    localStorage.setItem(LOCAL_DRAFTS_KEY, JSON.stringify(drafts));
    return true;
  } catch (error) {
    appLogger.error('[DraftSync] Erro ao salvar drafts locais:', error);
    return false;
  }
}

/**
 * Obtém índice de drafts pendentes de sync
 */
export function getPendingDrafts(): LocalDraft[] {
  const drafts = loadLocalDrafts();
  return Object.values(drafts).filter(d => d.syncStatus === 'pending');
}

/**
 * Conta drafts pendentes de sync
 */
export function getPendingSyncCount(): number {
  return getPendingDrafts().length;
}

// ============================================================================
// DRAFT SYNC SERVICE
// ============================================================================

export const DraftSyncService = {
  /**
   * Salva um draft (localmente ou no Supabase)
   */
  async saveDraft(
    funnelId: string,
    quiz: Quiz,
    userId?: string | null
  ): Promise<DraftSyncResult> {
    // Validar e corrigir IDs
    const validatedQuiz = validateAndFixQuizIds(quiz);
    
    // Se não autenticado, salvar apenas localmente
    if (!userId) {
      return this.saveLocalDraft(funnelId, validatedQuiz);
    }
    
    // Tentar salvar no Supabase
    try {
      const result = await this.saveToSupabase(funnelId, validatedQuiz, userId);
      
      if (result.success) {
        // Remover draft local se existir (já sincronizado)
        this.removeLocalDraft(funnelId);
      }
      
      return result;
    } catch (error) {
      appLogger.warn('[DraftSync] Falha ao salvar no Supabase, salvando localmente:', error);
      
      // Fallback para localStorage
      return this.saveLocalDraft(funnelId, validatedQuiz, 'error');
    }
  },

  /**
   * Salva draft no localStorage
   */
  saveLocalDraft(
    funnelId: string,
    quiz: Quiz,
    syncStatus: 'pending' | 'error' = 'pending'
  ): DraftSyncResult {
    try {
      const drafts = loadLocalDrafts();
      const existing = drafts[funnelId];
      const now = new Date().toISOString();
      
      const draft: LocalDraft = {
        id: existing?.id || nanoid(),
        funnelId,
        quiz,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        version: (existing?.version || 0) + 1,
        syncStatus,
      };
      
      drafts[funnelId] = draft;
      
      if (saveLocalDrafts(drafts)) {
        appLogger.info(`[DraftSync] Draft salvo localmente: ${funnelId} (v${draft.version})`);
        return {
          success: true,
          draftId: draft.id,
          version: draft.version,
          syncedToCloud: false,
        };
      }
      
      return { success: false, error: 'Falha ao salvar no localStorage' };
    } catch (error) {
      appLogger.error('[DraftSync] Erro ao salvar draft local:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  },

  /**
   * Salva draft no Supabase via edge function
   */
  async saveToSupabase(
    funnelId: string,
    quiz: Quiz,
    userId: string
  ): Promise<DraftSyncResult> {
    try {
      appLogger.info(`[DraftSync] Salvando no Supabase: ${funnelId}`);
      
      const { data, error } = await supabase.functions.invoke('quiz-save', {
        body: {
          funnelId,
          quiz: {
            ...quiz,
            metadata: {
              ...quiz.metadata,
              updatedAt: new Date().toISOString(),
            },
          },
          metadata: {
            userId,
            source: 'editor',
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (!data?.success) {
        throw new Error(data?.error || 'Erro desconhecido ao salvar');
      }
      
      appLogger.info(`[DraftSync] Salvo no Supabase: ${funnelId} (v${data.data?.version})`);
      
      return {
        success: true,
        draftId: data.data?.id,
        version: data.data?.version,
        syncedToCloud: true,
      };
    } catch (error) {
      appLogger.error('[DraftSync] Erro ao salvar no Supabase:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao sincronizar',
        syncedToCloud: false,
      };
    }
  },

  /**
   * Carrega draft (do Supabase ou localStorage)
   */
  async loadDraft(
    funnelId: string,
    userId?: string | null
  ): Promise<{ quiz: Quiz | null; source: 'cloud' | 'local' | null }> {
    // Tentar carregar do Supabase primeiro se autenticado
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('quiz_drafts')
          .select('content')
          .eq('funnel_id', funnelId)
          .order('version', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (!error && data?.content) {
          appLogger.info(`[DraftSync] Draft carregado do cloud: ${funnelId}`);
          return { quiz: data.content as Quiz, source: 'cloud' };
        }
      } catch (error) {
        appLogger.warn('[DraftSync] Falha ao carregar do cloud:', error);
      }
    }
    
    // Fallback para localStorage
    const localDrafts = loadLocalDrafts();
    const localDraft = localDrafts[funnelId];
    
    if (localDraft) {
      appLogger.info(`[DraftSync] Draft carregado do localStorage: ${funnelId}`);
      return { quiz: localDraft.quiz, source: 'local' };
    }
    
    return { quiz: null, source: null };
  },

  /**
   * Remove draft local
   */
  removeLocalDraft(funnelId: string): boolean {
    try {
      const drafts = loadLocalDrafts();
      if (drafts[funnelId]) {
        delete drafts[funnelId];
        saveLocalDrafts(drafts);
        appLogger.info(`[DraftSync] Draft local removido: ${funnelId}`);
        return true;
      }
      return false;
    } catch (error) {
      appLogger.error('[DraftSync] Erro ao remover draft local:', error);
      return false;
    }
  },

  /**
   * Sincroniza todos os drafts pendentes ao fazer login
   */
  async syncPendingDrafts(userId: string): Promise<{
    total: number;
    synced: number;
    failed: number;
    errors: string[];
  }> {
    const pendingDrafts = getPendingDrafts();
    const results = {
      total: pendingDrafts.length,
      synced: 0,
      failed: 0,
      errors: [] as string[],
    };
    
    if (pendingDrafts.length === 0) {
      appLogger.info('[DraftSync] Nenhum draft pendente para sincronizar');
      return results;
    }
    
    appLogger.info(`[DraftSync] Sincronizando ${pendingDrafts.length} drafts pendentes...`);
    
    for (const draft of pendingDrafts) {
      try {
        const result = await this.saveToSupabase(draft.funnelId, draft.quiz, userId);
        
        if (result.success) {
          this.removeLocalDraft(draft.funnelId);
          results.synced++;
          appLogger.info(`[DraftSync] ✅ Sincronizado: ${draft.funnelId}`);
        } else {
          results.failed++;
          results.errors.push(`${draft.funnelId}: ${result.error}`);
          
          // Atualizar status do draft local para error
          this.updateLocalDraftStatus(draft.funnelId, 'error', result.error);
        }
      } catch (error) {
        results.failed++;
        const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
        results.errors.push(`${draft.funnelId}: ${errorMsg}`);
        
        this.updateLocalDraftStatus(draft.funnelId, 'error', errorMsg);
      }
    }
    
    appLogger.info(`[DraftSync] Sincronização concluída: ${results.synced}/${results.total} sucesso`);
    return results;
  },

  /**
   * Atualiza status de um draft local
   */
  updateLocalDraftStatus(
    funnelId: string,
    status: 'pending' | 'synced' | 'error',
    error?: string
  ): boolean {
    try {
      const drafts = loadLocalDrafts();
      if (drafts[funnelId]) {
        drafts[funnelId].syncStatus = status;
        drafts[funnelId].syncError = error;
        drafts[funnelId].updatedAt = new Date().toISOString();
        return saveLocalDrafts(drafts);
      }
      return false;
    } catch {
      return false;
    }
  },

  /**
   * Limpa todos os drafts locais
   */
  clearLocalDrafts(): boolean {
    try {
      localStorage.removeItem(LOCAL_DRAFTS_KEY);
      localStorage.removeItem(DRAFT_INDEX_KEY);
      appLogger.info('[DraftSync] Todos os drafts locais removidos');
      return true;
    } catch (error) {
      appLogger.error('[DraftSync] Erro ao limpar drafts:', error);
      return false;
    }
  },
};

export default DraftSyncService;
