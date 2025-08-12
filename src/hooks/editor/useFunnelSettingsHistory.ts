import { useState, useCallback, useEffect } from 'react';
import { useHistory } from '@/hooks/useHistory';
import { FunnelSettings, defaultFunnelSettings } from '@/types/funnelSettings';
import { FunnelSettingsService } from '@/services/funnelSettingsService';
import { useAutoSaveWithDebounce } from './useAutoSaveWithDebounce';

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
    [saveState]
  );

  // Auto-save com debounce
  const { forceSave } = useAutoSaveWithDebounce({
    data: settings,
    onSave: async (data: FunnelSettings) => {
      try {
        await FunnelSettingsService.saveSettings(funnelId, data);
        console.log('✅ Configurações salvas automaticamente');
      } catch (error) {
        console.error('❌ Erro no auto-save das configurações:', error);
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
        const loadedSettings = await FunnelSettingsService.loadSettings(funnelId);
        if (loadedSettings) {
          saveState(loadedSettings);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        // Usar configurações padrão em caso de erro
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
