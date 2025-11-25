import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useBlockMutations() {
  const queryClient = useQueryClient();

  const updateBlock = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('component_instances')
        .update({
          properties: updates.properties || {},
          config: updates.content || {},
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
      console.log('✅ Bloco atualizado:', id);
      toast.success('Bloco atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('❌ Erro ao atualizar bloco:', error);
      toast.error('Falha ao salvar alterações');
    }
  });

  const deleteBlock = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('component_instances')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
      toast.success('Bloco removido!');
    },
    onError: (error) => {
      console.error('Erro ao remover bloco:', error);
      toast.error('Falha ao remover bloco');
    }
  });

  const addBlock = useMutation({
    mutationFn: async ({ 
      funnelId, 
      stepNumber, 
      type, 
      orderIndex,
      content = {},
      properties = {}
    }: { 
      funnelId: string; 
      stepNumber: number; 
      type: string; 
      orderIndex: number;
      content?: any;
      properties?: any;
    }) => {
      const { data, error } = await supabase
        .from('component_instances')
        .insert({
          funnel_id: funnelId,
          step_number: stepNumber,
          component_type_key: type,
          order_index: orderIndex,
          config: content,
          properties: properties
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
      toast.success('Bloco adicionado!');
    },
    onError: (error) => {
      console.error('Erro ao adicionar bloco:', error);
      toast.error('Falha ao adicionar bloco');
    }
  });

  return {
    updateBlock: updateBlock.mutate,
    updateBlockAsync: updateBlock.mutateAsync,
    deleteBlock: deleteBlock.mutate,
    deleteBlockAsync: deleteBlock.mutateAsync,
    addBlock: addBlock.mutate,
    addBlockAsync: addBlock.mutateAsync
  };
}
