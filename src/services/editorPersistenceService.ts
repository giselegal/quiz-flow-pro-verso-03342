import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generateId } from '@/types/unified-schema';

export interface EditorSaveData {
  blocks: any[];
  activeStageId: string;
  funnelId?: string;
  timestamp: number;
}

/**
 * 🚀 EDITOR PERSISTENCE SERVICE - OTIMIZADO
 * Serviço de salvamento focado especificamente no editor
 * com fallbacks robustos e feedback claro
 */
export const editorPersistenceService = {
  async saveEditorState(data: EditorSaveData): Promise<{
    success: boolean;
    savedToCloud: boolean;
    savedToLocal: boolean;
    error?: string;
  }> {
    const result = {
      success: false,
      savedToCloud: false,
      savedToLocal: false,
      error: undefined as string | undefined,
    };

    // 1. SEMPRE salvar localmente primeiro (garantia)
    try {
      const localData = {
        ...data,
        savedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      localStorage.setItem('editor-current-state', JSON.stringify(localData));
      localStorage.setItem(`editor-backup-${Date.now()}`, JSON.stringify(localData));
      
      result.savedToLocal = true;
      console.log('✅ Editor: Salvamento local realizado');
    } catch (localError) {
      console.error('❌ Editor: Falha no salvamento local:', localError);
      result.error = 'Falha no salvamento local';
      return result;
    }

    // 2. Tentar salvar na nuvem (Supabase)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('⚠️ Editor: Usuário não autenticado - apenas local');
        result.success = true;
        return result;
      }

      const funnelId = data.funnelId || `editor-funnel-${generateId()}`;
      
      // Preparar dados para Supabase
      const funnelData = {
        id: funnelId,
        name: `Editor Funnel - ${new Date().toLocaleString('pt-BR')}`,
        description: `Funil criado no editor com ${data.blocks.length} blocos`,
        user_id: user.id,
        is_published: false,
        version: 1,
        settings: {
          editor: {
            activeStageId: data.activeStageId,
            blocksCount: data.blocks.length,
            lastModified: new Date().toISOString(),
          },
        },
      };

      // Upsert do funil
      const { data: savedFunnel, error: funnelError } = await supabase
        .from('funnels')
        .upsert(funnelData)
        .select()
        .single();

      if (funnelError) {
        throw new Error(`Erro no funil: ${funnelError.message}`);
      }

      // Salvar página com blocos
      const pageData = {
        id: `${funnelId}-page-1`,
        funnel_id: funnelId,
        page_type: 'editor-canvas',
        page_order: 1,
        title: 'Editor Canvas',
        blocks: data.blocks,
      };

      // Deletar página existente e criar nova (upsert simples)
      await supabase
        .from('funnel_pages')
        .delete()
        .eq('funnel_id', funnelId);

      const { error: pageError } = await supabase
        .from('funnel_pages')
        .insert([pageData]);

      if (pageError) {
        throw new Error(`Erro na página: ${pageError.message}`);
      }

      result.savedToCloud = true;
      result.success = true;
      
      console.log('✅ Editor: Salvamento na nuvem realizado');
      console.log('📊 Editor: Dados salvos:', {
        funnelId,
        blocksCount: data.blocks.length,
        activeStage: data.activeStageId,
      });

    } catch (cloudError) {
      console.error('❌ Editor: Falha no salvamento na nuvem:', cloudError);
      result.error = `Nuvem: ${cloudError.message}`;
      // Mas local já funcionou, então ainda é sucesso parcial
      result.success = true;
    }

    return result;
  },

  async loadEditorState(funnelId?: string): Promise<EditorSaveData | null> {
    // 1. Tentar carregar da nuvem primeiro
    if (funnelId) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: funnel } = await supabase
            .from('funnels')
            .select('*, funnel_pages(*)')
            .eq('id', funnelId)
            .eq('user_id', user.id)
            .single();

          if (funnel && funnel.funnel_pages?.[0]) {
            const page = funnel.funnel_pages[0];
            const settings = (funnel.settings as any) || {};
            
            return {
              blocks: (page.blocks as any) || [],
              activeStageId: settings.editor?.activeStageId || 'step-1',
              funnelId: funnel.id,
              timestamp: new Date(funnel.updated_at || funnel.created_at).getTime(),
            };
          }
        }
      } catch (error) {
        console.warn('⚠️ Editor: Falha ao carregar da nuvem:', error);
      }
    }

    // 2. Fallback para localStorage
    try {
      const localData = localStorage.getItem('editor-current-state');
      if (localData) {
        const parsed = JSON.parse(localData);
        console.log('📱 Editor: Carregado do localStorage');
        return parsed;
      }
    } catch (error) {
      console.error('❌ Editor: Falha ao carregar localStorage:', error);
    }

    return null;
  },

  async clearBackups(keepRecent: number = 10): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('editor-backup-')
      );
      
      // Ordenar por timestamp e manter apenas os mais recentes
      const sortedKeys = keys
        .map(key => ({
          key,
          timestamp: parseInt(key.replace('editor-backup-', '')),
        }))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(keepRecent)
        .map(item => item.key);

      sortedKeys.forEach(key => localStorage.removeItem(key));
      
      console.log(`🧹 Editor: ${sortedKeys.length} backups antigos removidos`);
    } catch (error) {
      console.error('❌ Editor: Erro ao limpar backups:', error);
    }
  },

  getBackupList(): Array<{ key: string; timestamp: number; date: string }> {
    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith('editor-backup-'))
        .map(key => {
          const timestamp = parseInt(key.replace('editor-backup-', ''));
          return {
            key,
            timestamp,
            date: new Date(timestamp).toLocaleString('pt-BR'),
          };
        })
        .sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('❌ Editor: Erro ao listar backups:', error);
      return [];
    }
  },
};

/**
 * 🎯 HOOK PARA O EDITOR
 * Hook simplificado para usar no editor com feedback automático
 */
export const useEditorSave = () => {
  const saveWithFeedback = async (data: EditorSaveData, showToast = true) => {
    const result = await editorPersistenceService.saveEditorState(data);

    if (showToast) {
      if (result.success) {
        if (result.savedToCloud && result.savedToLocal) {
          toast({
            title: '✅ Salvo com sucesso!',
            description: `${data.blocks.length} blocos salvos na nuvem e localmente.`,
            variant: 'default',
          });
        } else if (result.savedToLocal) {
          toast({
            title: '📱 Salvo localmente',
            description: 'Dados salvos no dispositivo. Sync na nuvem pendente.',
            variant: 'default',
          });
        }
      } else {
        toast({
          title: '❌ Erro no salvamento',
          description: result.error || 'Erro desconhecido',
          variant: 'destructive',
        });
      }
    }

    return result;
  };

  return {
    save: saveWithFeedback,
    load: editorPersistenceService.loadEditorState,
    clearBackups: editorPersistenceService.clearBackups,
    getBackups: editorPersistenceService.getBackupList,
  };
};
