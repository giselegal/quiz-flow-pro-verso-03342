
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SupabaseComponent {
  id: string;
  component_type_key: string;
  created_at: string | null;
  created_by: string | null;
  custom_styling: any;
  funnel_id: string;
  instance_key: string;
  is_active: boolean | null;
  is_locked: boolean | null;
  is_template: boolean | null;
  order_index: number;
  properties: any;
  stage_id: string | null;
  step_number: number;
  updated_at: string | null;
}

export const useEditorSupabase = (funnelId: string) => {
  const [components, setComponents] = useState<SupabaseComponent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load components from Supabase
  const loadComponents = useCallback(async () => {
    if (!funnelId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('component_instances')
        .select('*')
        .eq('funnel_id', funnelId)
        .order('order_index', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setComponents(data || []);
      console.log('✅ Componentes carregados do Supabase:', data?.length || 0);
    } catch (err: any) {
      const errorMessage = `Erro ao carregar componentes: ${err.message}`;
      setError(errorMessage);
      console.error('❌', errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [funnelId]);

  // Add component to Supabase
  const addComponent = useCallback(async (
    componentTypeKey: string,
    stepNumber: number,
    properties: any = {},
    orderIndex?: number
  ) => {
    if (!funnelId) return null;

    setIsLoading(true);
    try {
      const newComponent = {
        component_type_key: componentTypeKey,
        funnel_id: funnelId,
        instance_key: `${componentTypeKey}_${Date.now()}`,
        step_number: stepNumber,
        order_index: orderIndex ?? components.length,
        properties: properties || {},
        custom_styling: {},
        is_active: true,
        is_locked: false,
        is_template: false,
        stage_id: null,
      };

      const { data, error: insertError } = await supabase
        .from('component_instances')
        .insert([newComponent])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      const componentWithDefaults: SupabaseComponent = {
        ...data,
        order_index: data.order_index ?? 0,
      };

      setComponents(prev => [...prev, componentWithDefaults]);
      console.log('✅ Componente adicionado ao Supabase:', componentWithDefaults.id);

      toast({
        title: 'Sucesso',
        description: 'Componente adicionado com sucesso',
      });

      return componentWithDefaults;
    } catch (err: any) {
      const errorMessage = `Erro ao adicionar componente: ${err.message}`;
      setError(errorMessage);
      console.error('❌', errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [funnelId, components.length]);

  // Update component in Supabase
  const updateComponent = useCallback(async (
    componentId: string,
    updates: Partial<SupabaseComponent>
  ) => {
    if (!componentId) return false;

    setIsLoading(true);
    try {
      const { data, error: updateError } = await supabase
        .from('component_instances')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', componentId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      const updatedComponent: SupabaseComponent = {
        ...data,
        order_index: data.order_index ?? 0,
      };

      setComponents(prev =>
        prev.map(comp =>
          comp.id === componentId ? updatedComponent : comp
        )
      );

      console.log('✅ Componente atualizado no Supabase:', componentId);
      return true;
    } catch (err: any) {
      const errorMessage = `Erro ao atualizar componente: ${err.message}`;
      setError(errorMessage);
      console.error('❌', errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete component from Supabase
  const deleteComponent = useCallback(async (componentId: string) => {
    if (!componentId) return false;

    setIsLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('component_instances')
        .delete()
        .eq('id', componentId);

      if (deleteError) {
        throw deleteError;
      }

      setComponents(prev => prev.filter(comp => comp.id !== componentId));
      console.log('✅ Componente removido do Supabase:', componentId);

      toast({
        title: 'Sucesso',
        description: 'Componente removido com sucesso',
      });

      return true;
    } catch (err: any) {
      const errorMessage = `Erro ao remover componente: ${err.message}`;
      setError(errorMessage);
      console.error('❌', errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reorder components in Supabase
  const reorderComponents = useCallback(async (
    sourceIndex: number,
    destinationIndex: number
  ) => {
    if (sourceIndex === destinationIndex) return false;

    const reorderedComponents = [...components];
    const [movedComponent] = reorderedComponents.splice(sourceIndex, 1);
    reorderedComponents.splice(destinationIndex, 0, movedComponent);

    // Update order_index for all affected components
    const updates = reorderedComponents.map((comp, index) => ({
      id: comp.id,
      order_index: index,
    }));

    setIsLoading(true);
    try {
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('component_instances')
          .update({ order_index: update.order_index })
          .eq('id', update.id);

        if (updateError) {
          throw updateError;
        }
      }

      setComponents(reorderedComponents);
      console.log('✅ Componentes reordenados no Supabase');
      return true;
    } catch (err: any) {
      const errorMessage = `Erro ao reordenar componentes: ${err.message}`;
      setError(errorMessage);
      console.error('❌', errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [components]);

  // Initialize component loading
  useEffect(() => {
    loadComponents();
  }, [loadComponents]);

  return {
    components,
    isLoading,
    error,
    loadComponents,
    addComponent,
    updateComponent,
    deleteComponent,
    reorderComponents,
  };
};
