import { useState, useCallback, useEffect } from 'react';
import { useHistory } from '@/hooks/useHistory';
import { FunnelSettings, defaultFunnelSettings } from '@/types/funnelSettings';
import { useAutoSaveWithDebounce } from './useAutoSaveWithDebounce';
import { appLogger } from '@/lib/utils/appLogger';

export const useFunnelSettingsHistory = (funnelId: string, initialSettings: FunnelSettings) => {
  const [isLoading, setIsLoading] = useState(true);

  // Usar o hook useHistory para gerenciar histórico
  const {
    state: settings,
    saveState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  } = useHistory<FunnelSettings>(initialSettings);

  // Função para atualizar configurações
  const updateSettings = useCallback(
    (newSettings: FunnelSettings) => {
      saveState(newSettings);
    },
    [saveState],
  );

  // Auto-save com debounce
  const { forceSave } = useAutoSaveWithDebounce({
    data: settings,
    onSave: async (data: FunnelSettings) => {
      try {
        // TODO: Implement settings persistence via FunnelService canonical
        appLogger.info('✅ Configurações atualizadas (persistence pending):', { funnelId, data });
      } catch (error) {
        appLogger.error('❌ Erro no auto-save das configurações:', { data: [error] });
        throw error;
      }
    },
    delay: 2000, // 2 segundos de debounce para configurações
    enabled: !isLoading,
    showToasts: false, // Não mostrar toasts para auto-save
  });

  // Carregar configurações iniciais
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // TODO: Implement settings loading via FunnelService canonical
        appLogger.info('📋 Carregando settings (usando defaults por enquanto):', { funnelId });
        saveState(defaultFunnelSettings);
      } catch (error) {
        appLogger.error('Erro ao carregar configurações:', { data: [error] });
        saveState(defaultFunnelSettings);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [funnelId, saveState]);

  // Funcões de histórico customizadas que retornam as configurações
  const undoSettings = useCallback(() => {
    undo();
    return settings;
  }, [undo, settings]);

  const redoSettings = useCallback(() => {
    redo();
    return settings;
  }, [redo, settings]);

  const resetSettings = useCallback(() => {
    reset();
    return defaultFunnelSettings;
  }, [reset]);

  return {
    settings,
    updateSettings,
    saveState: updateSettings,
    undo: undoSettings,
    redo: redoSettings,
    reset: resetSettings,
    canUndo,
    canRedo,
    isLoading,
    forceSave,
  };
};
