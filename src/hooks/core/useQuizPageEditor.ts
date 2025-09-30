// @ts-nocheck
/**
 * 🎯 USE QUIZ PAGE EDITOR HOOK
 * 
 * Hook para integrar o QuizPage com o sistema de editor existente
 * Funcionalidades:
 * - Carregar funil quiz
 * - Editar componentes
 * - Gerenciar versões
 * - Sincronizar com dashboard
 */

import { useState, useEffect, useCallback } from 'react';
import { quizPageIntegrationService, QuizPageFunnel, QuizPageComponent } from '@/services/QuizPageIntegrationService';
import { versioningService } from '@/services/VersioningService';
import { historyManager } from '@/services/HistoryManager';
import { unifiedEventTracker } from '@/analytics/UnifiedEventTracker';

export interface UseQuizPageEditorReturn {
  // Estado
  funnel: QuizPageFunnel | null;
  components: QuizPageComponent[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Ações
  loadFunnel: (funnelId: string) => Promise<void>;
  saveFunnel: () => Promise<void>;
  publishFunnel: () => Promise<void>;
  updateComponent: (componentId: string, updates: Partial<QuizPageComponent>) => Promise<void>;

  // Versões
  versions: any[];
  createVersion: (name: string, description: string) => Promise<void>;
  restoreVersion: (versionId: string) => Promise<void>;

  // Analytics
  analytics: any;
  refreshAnalytics: () => Promise<void>;

  // Histórico
  history: any[];
  refreshHistory: () => Promise<void>;
}

export function useQuizPageEditor(funnelId?: string): UseQuizPageEditorReturn {
  const [funnel, setFunnel] = useState<QuizPageFunnel | null>(null);
  const [components, setComponents] = useState<QuizPageComponent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Carregar funil
  const loadFunnel = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const quizFunnel = await quizPageIntegrationService.loadQuizFunnel(id);
      if (!quizFunnel) {
        // Criar funil padrão se não existir
        const newFunnel = await quizPageIntegrationService.createDefaultQuizFunnel(id);
        setFunnel(newFunnel);
        setComponents(newFunnel.components);
      } else {
        setFunnel(quizFunnel);
        setComponents(quizFunnel.components);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar funil:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar funil
  const saveFunnel = useCallback(async () => {
    if (!funnel) return;

    try {
      setIsSaving(true);
      setError(null);

      const updatedFunnel = {
        ...funnel,
        components,
        updatedAt: new Date().toISOString()
      };

      await quizPageIntegrationService.saveQuizFunnel(updatedFunnel);
      setFunnel(updatedFunnel);

      // Rastrear mudança
      await historyManager.trackCRUDChange('update', 'funnel', funnel.id, {
        name: funnel.name,
        components: components.length
      });

    } catch (err) {
      console.error('❌ Erro ao salvar funil:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setIsSaving(false);
    }
  }, [funnel, components]);

  // Publicar funil
  const publishFunnel = useCallback(async () => {
    if (!funnel) return;

    try {
      setIsSaving(true);
      setError(null);

      await quizPageIntegrationService.publishQuizFunnel(funnel.id);

      // Atualizar estado local
      const updatedFunnel = {
        ...funnel,
        status: 'published' as const,
        publishedAt: new Date().toISOString(),
        publishedVersion: funnel.version
      };

      setFunnel(updatedFunnel);

      // Rastrear publicação
      await historyManager.trackCRUDChange('publish', 'funnel', funnel.id, {
        name: funnel.name,
        version: funnel.version
      });

      // Analytics
      unifiedEventTracker.track({
        type: 'conversion',
        funnelId: funnel.id,
        sessionId: 'editor-session',
        userId: undefined,
        payload: {
          event: 'funnel_published',
          funnelType: 'quiz',
          version: funnel.version
        },
        context: { source: 'quiz-page-editor' }
      });

    } catch (err) {
      console.error('❌ Erro ao publicar funil:', err);
      setError(err instanceof Error ? err.message : 'Erro ao publicar');
    } finally {
      setIsSaving(false);
    }
  }, [funnel]);

  // Atualizar componente
  const updateComponent = useCallback(async (componentId: string, updates: Partial<QuizPageComponent>) => {
    if (!funnel) return;

    try {
      setError(null);

      await quizPageIntegrationService.updateComponent(funnel.id, componentId, updates);

      // Atualizar estado local
      const updatedComponents = components.map(comp =>
        comp.id === componentId ? { ...comp, ...updates } : comp
      );

      setComponents(updatedComponents);

      // Rastrear mudança
      await historyManager.trackCRUDChange('update', 'component', componentId, {
        funnelId: funnel.id,
        componentType: updates.type || 'unknown'
      });

    } catch (err) {
      console.error('❌ Erro ao atualizar componente:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar componente');
    }
  }, [funnel, components]);

  // Criar versão
  const createVersion = useCallback(async (name: string, description: string) => {
    if (!funnel) return;

    try {
      setError(null);

      await versioningService.createSnapshot(funnel, 'manual', description);

      // Recarregar versões
      const funnelVersions = await versioningService.getVersions(funnel.id);
      setVersions(funnelVersions);

      // Rastrear criação de versão
      await historyManager.trackCRUDChange('create', 'version', funnel.id, {
        name,
        description
      });

    } catch (err) {
      console.error('❌ Erro ao criar versão:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar versão');
    }
  }, [funnel]);

  // Restaurar versão
  const restoreVersion = useCallback(async (versionId: string) => {
    if (!funnel) return;

    try {
      setError(null);

      const version = await versioningService.getVersion(funnel.id, versionId);
      if (!version) {
        throw new Error('Versão não encontrada');
      }

      // Restaurar funil
      const restoredFunnel = version.data as QuizPageFunnel;
      setFunnel(restoredFunnel);
      setComponents(restoredFunnel.components);

      // Salvar versão restaurada
      await quizPageIntegrationService.saveQuizFunnel(restoredFunnel);

      // Rastrear restauração
      await historyManager.trackCRUDChange('restore', 'version', versionId, {
        funnelId: funnel.id,
        version: version.version
      });

    } catch (err) {
      console.error('❌ Erro ao restaurar versão:', err);
      setError(err instanceof Error ? err.message : 'Erro ao restaurar versão');
    }
  }, [funnel]);

  // Carregar versões
  const loadVersions = useCallback(async () => {
    if (!funnel) return;

    try {
      const funnelVersions = await versioningService.getVersions(funnel.id);
      setVersions(funnelVersions);
    } catch (err) {
      console.error('❌ Erro ao carregar versões:', err);
    }
  }, [funnel]);

  // Carregar analytics
  const refreshAnalytics = useCallback(async () => {
    if (!funnel) return;

    try {
      const funnelAnalytics = await quizPageIntegrationService.getFunnelAnalytics(funnel.id);
      setAnalytics(funnelAnalytics);
    } catch (err) {
      console.error('❌ Erro ao carregar analytics:', err);
    }
  }, [funnel]);

  // Carregar histórico
  const refreshHistory = useCallback(async () => {
    if (!funnel) return;

    try {
      const funnelHistory = await historyManager.getHistory(funnel.id);
      setHistory(funnelHistory);
    } catch (err) {
      console.error('❌ Erro ao carregar histórico:', err);
    }
  }, [funnel]);

  // Efeitos
  useEffect(() => {
    if (funnelId) {
      loadFunnel(funnelId);
    }
  }, [funnelId, loadFunnel]);

  useEffect(() => {
    if (funnel) {
      loadVersions();
      refreshAnalytics();
      refreshHistory();
    }
  }, [funnel, loadVersions, refreshAnalytics, refreshHistory]);

  return {
    // Estado
    funnel,
    components,
    isLoading,
    isSaving,
    error,

    // Ações
    loadFunnel,
    saveFunnel,
    publishFunnel,
    updateComponent,

    // Versões
    versions,
    createVersion,
    restoreVersion,

    // Analytics
    analytics,
    refreshAnalytics,

    // Histórico
    history,
    refreshHistory
  };
}
