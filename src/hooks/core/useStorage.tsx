import { useCallback, useEffect, useState } from 'react';

interface QuizData {
  answers: any[];
  strategicAnswers: Record<string, string>;
  userName: string;
  startTime: string;
  currentStep: number;
  lastUpdated: string;
}

interface StorageOptions {
  persistToLocal?: boolean;
  persistToSession?: boolean;
  autoSave?: boolean;
  saveInterval?: number;
}

/**
 * 💾 HOOK DE PERSISTÊNCIA DO QUIZ
 *
 * Gerencia salvamento local e sessão
 * Auto-save inteligente com debounce
 */
export const useStorage = (quizId: string, options: StorageOptions = {}) => {
  const {
    persistToLocal = true,
    persistToSession = true,
    autoSave = true,
    saveInterval = 2000,
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Chaves de armazenamento
  const localKey = `quiz_${quizId}_local`;
  const sessionKey = `quiz_${quizId}_session`;

  // Salvar dados no localStorage
  const saveToLocal = useCallback(
    (data: QuizData) => {
      if (!persistToLocal) return;

      try {
        localStorage.setItem(
          localKey,
          JSON.stringify({
            ...data,
            savedAt: new Date().toISOString(),
          })
        );
      } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
        setSaveError('Erro ao salvar localmente');
      }
    },
    [localKey, persistToLocal]
  );

  // Salvar dados no sessionStorage
  const saveToSession = useCallback(
    (data: QuizData) => {
      if (!persistToSession) return;

      try {
        sessionStorage.setItem(
          sessionKey,
          JSON.stringify({
            ...data,
            savedAt: new Date().toISOString(),
          })
        );
      } catch (error) {
        console.error('Erro ao salvar no sessionStorage:', error);
        setSaveError('Erro ao salvar na sessão');
      }
    },
    [sessionKey, persistToSession]
  );

  // Carregar dados do localStorage
  const loadFromLocal = useCallback((): QuizData | null => {
    if (!persistToLocal) return null;

    try {
      const saved = localStorage.getItem(localKey);
      if (saved) {
        const data = JSON.parse(saved);
        return data;
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
    }
    return null;
  }, [localKey, persistToLocal]);

  // Carregar dados do sessionStorage
  const loadFromSession = useCallback((): QuizData | null => {
    if (!persistToSession) return null;

    try {
      const saved = sessionStorage.getItem(sessionKey);
      if (saved) {
        const data = JSON.parse(saved);
        return data;
      }
    } catch (error) {
      console.error('Erro ao carregar do sessionStorage:', error);
    }
    return null;
  }, [sessionKey, persistToSession]);

  // Salvar dados (principal)
  const saveData = useCallback(
    async (data: QuizData) => {
      setIsSaving(true);
      setSaveError(null);

      try {
        // Salvar em ambos os storages
        saveToLocal(data);
        saveToSession(data);

        setLastSaved(new Date());
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
        setSaveError('Erro ao salvar dados');
      } finally {
        setIsSaving(false);
      }
    },
    [saveToLocal, saveToSession]
  );

  // Carregar dados (principal)
  const loadData = useCallback((): QuizData | null => {
    // Priorizar sessionStorage (mais recente)
    const sessionData = loadFromSession();
    if (sessionData) return sessionData;

    // Fallback para localStorage
    const localData = loadFromLocal();
    if (localData) return localData;

    return null;
  }, [loadFromSession, loadFromLocal]);

  // Limpar dados salvos
  const clearData = useCallback(() => {
    try {
      if (persistToLocal) {
        localStorage.removeItem(localKey);
      }
      if (persistToSession) {
        sessionStorage.removeItem(sessionKey);
      }
      setLastSaved(null);
      setSaveError(null);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      setSaveError('Erro ao limpar dados');
    }
  }, [localKey, sessionKey, persistToLocal, persistToSession]);

  // Verificar se há dados salvos
  const hasSavedData = useCallback((): boolean => {
    const sessionData = loadFromSession();
    const localData = loadFromLocal();
    return !!(sessionData || localData);
  }, [loadFromSession, loadFromLocal]);

  // Obter estatísticas de armazenamento
  const getStorageStats = useCallback(() => {
    const sessionData = loadFromSession();
    const localData = loadFromLocal();

    return {
      hasSessionData: !!sessionData,
      hasLocalData: !!localData,
      sessionSize: sessionData ? JSON.stringify(sessionData).length : 0,
      localSize: localData ? JSON.stringify(localData).length : 0,
      lastSaved,
      isSaving,
      saveError,
    };
  }, [loadFromSession, loadFromLocal, lastSaved, isSaving, saveError]);

  // Auto-save com debounce
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const scheduleAutoSave = useCallback(
    (data: QuizData) => {
      if (!autoSave) return;

      // Cancelar save anterior
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      // Agendar novo save
      const timeout = setTimeout(() => {
        saveData(data);
      }, saveInterval);

      setAutoSaveTimeout(timeout);
    },
    [autoSave, autoSaveTimeout, saveData, saveInterval]
  );

  // Cleanup do timeout
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  // Backup para servidor (placeholder)
  const backupToServer = useCallback(async (data: QuizData) => {
    // TODO: Implementar backup para servidor
    console.log('Backup para servidor:', data);
    return Promise.resolve();
  }, []);

  // Restaurar do servidor (placeholder)
  const restoreFromServer = useCallback(async (): Promise<QuizData | null> => {
    // TODO: Implementar restore do servidor
    return Promise.resolve(null);
  }, []);

  return {
    // Estado
    isSaving,
    lastSaved,
    saveError,

    // Ações principais
    saveData,
    loadData,
    clearData,

    // Auto-save
    scheduleAutoSave,

    // Utilitários
    hasSavedData,
    getStorageStats,

    // Servidor (futuro)
    backupToServer,
    restoreFromServer,

    // Ações diretas
    saveToLocal,
    saveToSession,
    loadFromLocal,
    loadFromSession,
  };
};
