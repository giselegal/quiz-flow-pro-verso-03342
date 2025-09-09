import { useCallback, useEffect, useRef, useState } from 'react';
import { useAutoSaveWithDebounce } from '@/hooks/editor/useAutoSaveWithDebounce';
import { schemaDrivenFunnelService } from '@/services/schemaDrivenFunnelService';
import { getFunnelIdFromEnvOrStorage } from '@/utils/funnelIdentity';
import { useToast } from '@/hooks/use-toast';

interface UseEditorAutoSaveOptions {
  funnelId?: string;
  data: any;
  enabled?: boolean;
  delay?: number;
  showToasts?: boolean;
}

interface UseEditorAutoSaveReturn {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  forceSave: () => Promise<void>;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  errorMessage?: string;
}

/**
 * 🔄 HOOK DE AUTO-SAVE MELHORADO PARA O EDITOR
 * 
 * Integra o auto-save com:
 * - Sistema de funis
 * - Indicadores de status
 * - Gestão de erros
 * - Notificações do usuário
 */
export const useEditorAutoSave = ({
  funnelId,
  data,
  enabled = true,
  delay = 2000,
  showToasts = false
}: UseEditorAutoSaveOptions): UseEditorAutoSaveReturn => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  const currentFunnelId = funnelId || getFunnelIdFromEnvOrStorage() || 'default-funnel';
  const lastDataRef = useRef(data);

  // 🔍 Detectar mudanças nos dados
  useEffect(() => {
    const currentDataString = JSON.stringify(data);
    const lastDataString = JSON.stringify(lastDataRef.current);

    if (currentDataString !== lastDataString) {
      setHasUnsavedChanges(true);
      setSaveStatus('idle');
      setErrorMessage(undefined);
    }
  }, [data]);

  // 💾 Função de salvamento
  const saveFunction = useCallback(async (dataToSave: any) => {
    try {
      console.log('💾 Salvando dados do funil:', currentFunnelId);
      setSaveStatus('saving');
      setErrorMessage(undefined);

      // Para funis do template, não tentar salvar no Supabase
      if (currentFunnelId.startsWith('template-') || currentFunnelId === 'default-funnel') {
        console.log('📋 Funil template/default - salvando apenas localmente');

        // Salvar no localStorage como backup
        try {
          localStorage.setItem(
            `editor:${currentFunnelId}`,
            JSON.stringify({
              data: dataToSave,
              timestamp: new Date().toISOString(),
              funnelId: currentFunnelId
            })
          );
        } catch (err) {
          console.warn('⚠️ Erro ao salvar no localStorage:', err);
        }
      } else {
        // Para funis personalizados, salvar no Supabase
        const funnelData = {
          id: currentFunnelId,
          name: `Funil ${currentFunnelId}`,
          description: `Funil editado em ${new Date().toLocaleDateString()}`,
          pages: [], // Os dados do editor vão aqui
          config: dataToSave || {}
        };

        await schemaDrivenFunnelService.saveFunnel(funnelData);

        console.log('✅ Dados salvos no Supabase com sucesso');
      }

      // Atualizar estado de sucesso
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      lastDataRef.current = dataToSave;

      if (showToasts) {
        toast({
          title: 'Alterações salvas',
          description: `Funil ${currentFunnelId} atualizado com sucesso`,
          variant: 'default'
        });
      }

    } catch (error) {
      console.error('❌ Erro ao salvar dados:', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido');

      if (showToasts) {
        toast({
          title: 'Erro ao salvar',
          description: 'Não foi possível salvar as alterações',
          variant: 'destructive'
        });
      }

      throw error; // Re-throw para o hook de auto-save
    }
  }, [currentFunnelId, showToasts, toast]);

  // 🔄 Hook de auto-save com debounce
  const { forceSave: forceAutoSave, isSaving } = useAutoSaveWithDebounce({
    data,
    onSave: saveFunction,
    delay,
    enabled,
    showToasts: false // Gerenciamos os toasts aqui
  });

  // 💾 Função de salvamento manual
  const forceSave = useCallback(async () => {
    try {
      await forceAutoSave();
    } catch (error) {
      // Erro já tratado no saveFunction
      console.error('Erro no salvamento manual:', error);
    }
  }, [forceAutoSave]);

  // 🕒 Resetar status após um tempo
  useEffect(() => {
    if (saveStatus === 'saved') {
      const timer = setTimeout(() => {
        setSaveStatus('idle');
      }, 5000); // Volta para idle após 5 segundos

      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  return {
    lastSaved,
    isSaving,
    hasUnsavedChanges,
    forceSave,
    saveStatus,
    errorMessage
  };
};

export default useEditorAutoSave;