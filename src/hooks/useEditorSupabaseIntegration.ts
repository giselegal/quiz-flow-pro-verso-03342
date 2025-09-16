import { useEditorSupabase } from '@/hooks/useEditorSupabase';
import { Block } from '@/types/editor';
import { groupSupabaseComponentsByStep, mapBlockToSupabaseComponent } from '@/utils/supabaseMapper';
import { useCallback, useEffect } from 'react';

/**
 * Hook personalizado para integrar EditorProvider com Supabase
 * Implementa padrão de update otimista com rollback
 */
export const useEditorSupabaseIntegration = (
  setState: (state: any) => void,
  rawState: any,
  funnelId?: string,
  quizId?: string
) => {
  const editorSupabase = useEditorSupabase(funnelId, quizId);

  // Carregar componentes do Supabase na inicialização
  const loadSupabaseComponents = useCallback(async () => {
    if (!editorSupabase || (!funnelId && !quizId)) {
      console.log('⚠️ Supabase not configured, skipping component load');
      return;
    }

    try {
      setState({
        ...rawState,
        isLoading: true,
      });

      // editorSupabase.loadComponents() já é chamado internamente pelo hook
      const { components } = editorSupabase;

      if (components && components.length > 0) {
        const groupedBlocks = groupSupabaseComponentsByStep(components);

        setState({
          ...rawState,
          stepBlocks: { ...rawState.stepBlocks, ...groupedBlocks },
          isLoading: false,
        });

        console.log(
          '✅ EditorProvider: populated stepBlocks from Supabase, steps:',
          Object.keys(groupedBlocks).length
        );
      } else {
        setState({
          ...rawState,
          isLoading: false,
        });
        console.log('ℹ️ No components found in Supabase for this funnel/quiz');
      }
    } catch (error) {
      console.error('❌ Error loading Supabase components:', error);
      setState({
        ...rawState,
        isLoading: false,
      });
    }
  }, [editorSupabase, rawState, setState, funnelId, quizId]);

  // Carregar automaticamente quando editorSupabase estiver pronto
  useEffect(() => {
    if (editorSupabase && (funnelId || quizId)) {
      console.log('🔄 Loading components from Supabase...');
      loadSupabaseComponents();
    }
  }, [editorSupabase, funnelId, quizId, loadSupabaseComponents]);

  // Adicionar bloco com update otimista
  const addBlockToStep = useCallback(
    async (stepKey: string, blockData: Block): Promise<void> => {
      if (!editorSupabase) {
        console.warn('⚠️ Supabase not available, falling back to local mode');
        setState({
          ...rawState,
          stepBlocks: {
            ...rawState.stepBlocks,
            [stepKey]: [...(rawState.stepBlocks[stepKey] || []), blockData],
          },
        });
        return;
      }

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const tempBlock = { ...blockData, id: tempId };

      // 1. Update otimista - adicionar imediatamente à UI
      setState({
        ...rawState,
        stepBlocks: {
          ...rawState.stepBlocks,
          [stepKey]: [...(rawState.stepBlocks[stepKey] || []), tempBlock],
        },
        isLoading: true,
      });

      try {
        // 2. Persistir no Supabase
        const stepNumber = parseInt(stepKey.replace('step-', '')) || 1;
        const supabaseData = mapBlockToSupabaseComponent(blockData, stepNumber, funnelId, quizId);

        const created = await editorSupabase.addComponent(
          supabaseData.component_type_key!,
          supabaseData.step_number!,
          supabaseData.properties,
          supabaseData.order_index
        );

        if (created) {
          // 3. Substituir bloco temporário pelo real do servidor
          const currentBlocks = rawState.stepBlocks[stepKey] || [];
          setState({
            ...rawState,
            stepBlocks: {
              ...rawState.stepBlocks,
              [stepKey]: currentBlocks.map((b: Block) =>
                b.id === tempId ? { ...blockData, id: created.id } : b
              ),
            },
            isLoading: false,
          });
          console.log('✅ Block synced with Supabase:', created.id);
        } else {
          throw new Error('Supabase addComponent returned null');
        }
      } catch (err) {
        console.error('❌ Erro ao salvar block no Supabase, rollback optimistic update', err);

        // 4. Rollback - remover bloco temporário
        const currentBlocks = rawState.stepBlocks[stepKey] || [];
        setState({
          ...rawState,
          stepBlocks: {
            ...rawState.stepBlocks,
            [stepKey]: currentBlocks.filter((b: Block) => b.id !== tempId),
          },
          isLoading: false,
        });

        throw err;
      }
    },
    [editorSupabase, rawState, setState, funnelId, quizId]
  );

  return {
    editorSupabase,
    loadSupabaseComponents,
    addBlockToStep,
    isSupabaseEnabled: !!(editorSupabase && (funnelId || quizId)),
  };
};
