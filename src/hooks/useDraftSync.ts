/**
 * 🔄 USE DRAFT SYNC HOOK - Fase 4 Gargalos
 * 
 * Hook React para gerenciar sincronização de drafts com:
 * - Auto-sync ao fazer login
 * - Notificações de drafts pendentes
 * - Estado de sincronização
 * 
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStorage } from '@/contexts/consolidated/AuthStorageProvider';
import { 
  DraftSyncService, 
  getPendingSyncCount, 
  loadLocalDrafts,
  type LocalDraft,
  type DraftSyncResult 
} from '@/services/drafts/DraftSyncService';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';

// Alias for clarity
type Quiz = QuizSchema;
import { appLogger } from '@/lib/utils/appLogger';
import { toast } from 'sonner';

// ============================================================================
// TYPES
// ============================================================================

export interface DraftSyncState {
  isSyncing: boolean;
  pendingCount: number;
  lastSyncAt: string | null;
  syncError: string | null;
}

export interface UseDraftSyncReturn {
  // State
  state: DraftSyncState;
  isAuthenticated: boolean;
  
  // Actions
  saveDraft: (funnelId: string, quiz: Quiz) => Promise<DraftSyncResult>;
  loadDraft: (funnelId: string) => Promise<{ quiz: Quiz | null; source: 'cloud' | 'local' | null }>;
  syncNow: () => Promise<void>;
  clearLocalDrafts: () => void;
  
  // Utils
  getPendingDrafts: () => LocalDraft[];
  hasPendingDrafts: boolean;
}

// ============================================================================
// HOOK
// ============================================================================

export function useDraftSync(): UseDraftSyncReturn {
  const { user, isAuthenticated } = useAuthStorage();
  const [state, setState] = useState<DraftSyncState>({
    isSyncing: false,
    pendingCount: getPendingSyncCount(),
    lastSyncAt: null,
    syncError: null,
  });
  
  // Track if we've already synced on this auth session
  const hasSyncedRef = useRef(false);
  const previousAuthRef = useRef(isAuthenticated);

  // ============================================================================
  // AUTO-SYNC ON LOGIN
  // ============================================================================

  useEffect(() => {
    // Detectar transição de não-autenticado para autenticado
    const justLoggedIn = !previousAuthRef.current && isAuthenticated;
    previousAuthRef.current = isAuthenticated;
    
    if (justLoggedIn && user?.id && !hasSyncedRef.current) {
      const pendingCount = getPendingSyncCount();
      
      if (pendingCount > 0) {
        appLogger.info(`[useDraftSync] Login detectado, sincronizando ${pendingCount} drafts...`);
        
        // Mostrar toast de sincronização
        toast.info(`Sincronizando ${pendingCount} draft(s) pendente(s)...`, {
          duration: 3000,
        });
        
        // Sincronizar drafts pendentes
        syncPendingDrafts(user.id);
        hasSyncedRef.current = true;
      }
    }
    
    // Reset flag on logout
    if (!isAuthenticated) {
      hasSyncedRef.current = false;
    }
  }, [isAuthenticated, user?.id]);

  // ============================================================================
  // UPDATE PENDING COUNT
  // ============================================================================

  useEffect(() => {
    const updatePendingCount = () => {
      setState(prev => ({
        ...prev,
        pendingCount: getPendingSyncCount(),
      }));
    };

    // Atualizar contagem periodicamente
    const interval = setInterval(updatePendingCount, 5000);
    
    // Também atualizar quando a janela recebe foco
    window.addEventListener('focus', updatePendingCount);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', updatePendingCount);
    };
  }, []);

  // ============================================================================
  // SYNC PENDING DRAFTS
  // ============================================================================

  const syncPendingDrafts = useCallback(async (userId: string) => {
    setState(prev => ({ ...prev, isSyncing: true, syncError: null }));
    
    try {
      const results = await DraftSyncService.syncPendingDrafts(userId);
      
      setState(prev => ({
        ...prev,
        isSyncing: false,
        pendingCount: getPendingSyncCount(),
        lastSyncAt: new Date().toISOString(),
        syncError: results.errors.length > 0 ? results.errors.join('; ') : null,
      }));
      
      // Mostrar resultado
      if (results.synced > 0) {
        toast.success(`${results.synced} draft(s) sincronizado(s) com sucesso!`);
      }
      
      if (results.failed > 0) {
        toast.error(`${results.failed} draft(s) falharam ao sincronizar`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro ao sincronizar';
      setState(prev => ({
        ...prev,
        isSyncing: false,
        syncError: errorMsg,
      }));
      toast.error('Falha ao sincronizar drafts');
    }
  }, []);

  // ============================================================================
  // SAVE DRAFT
  // ============================================================================

  const saveDraft = useCallback(async (
    funnelId: string,
    quiz: Quiz
  ): Promise<DraftSyncResult> => {
    const result = await DraftSyncService.saveDraft(funnelId, quiz, user?.id);
    
    // Atualizar contagem de pendentes
    setState(prev => ({
      ...prev,
      pendingCount: getPendingSyncCount(),
    }));
    
    return result;
  }, [user?.id]);

  // ============================================================================
  // LOAD DRAFT
  // ============================================================================

  const loadDraft = useCallback(async (
    funnelId: string
  ): Promise<{ quiz: Quiz | null; source: 'cloud' | 'local' | null }> => {
    return DraftSyncService.loadDraft(funnelId, user?.id);
  }, [user?.id]);

  // ============================================================================
  // MANUAL SYNC
  // ============================================================================

  const syncNow = useCallback(async () => {
    if (!user?.id) {
      toast.error('Faça login para sincronizar seus drafts');
      return;
    }
    
    await syncPendingDrafts(user.id);
  }, [user?.id, syncPendingDrafts]);

  // ============================================================================
  // CLEAR LOCAL DRAFTS
  // ============================================================================

  const clearLocalDrafts = useCallback(() => {
    DraftSyncService.clearLocalDrafts();
    setState(prev => ({ ...prev, pendingCount: 0 }));
    toast.success('Drafts locais removidos');
  }, []);

  // ============================================================================
  // GET PENDING DRAFTS
  // ============================================================================

  const getPendingDrafts = useCallback((): LocalDraft[] => {
    const drafts = loadLocalDrafts();
    return Object.values(drafts).filter(d => d.syncStatus === 'pending');
  }, []);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    state,
    isAuthenticated,
    saveDraft,
    loadDraft,
    syncNow,
    clearLocalDrafts,
    getPendingDrafts,
    hasPendingDrafts: state.pendingCount > 0,
  };
}

export default useDraftSync;
