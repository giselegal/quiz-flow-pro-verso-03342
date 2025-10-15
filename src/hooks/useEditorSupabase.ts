import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/customClient';
import { toast } from '@/hooks/use-toast';

export interface SupabaseComponent {
  id: string;
  component_type_key: string;
  created_at: string | null;
  created_by: string | null;
  custom_styling: any;
  funnel_id: string | null;
  quiz_id: string | null; // Added for backward compatibility
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

export const useEditorSupabase = (funnelId?: string, quizId?: string) => {
  const [components, setComponents] = useState<SupabaseComponent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load components from Supabase
  const loadComponents = useCallback(async () => {
    if (!funnelId && !quizId) return;

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('component_instances')
        .select('*')
        .order('order_index', { ascending: true });

      // Use funnel_id or quiz_id depending on what's available
      if (funnelId) {
        query = query.eq('funnel_id', funnelId);
      } else if (quizId) {
        query = query.eq('quiz_id', quizId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setComponents(
        (data || []).map(item => ({
          ...item,
          funnel_id: item.funnel_id || null,
          quiz_id: null, // Legacy field for backward compatibility
        }))
      );
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
  }, [funnelId, quizId]);

  // Add component to Supabase
  const addComponent = useCallback(
    async (
      componentTypeKey: string,
      stepNumber: number,
      properties: any = {},
      orderIndex?: number
    ) => {
      if (!funnelId && !quizId) return null;

      setIsLoading(true);
      try {
        const newComponent: any = {
          component_type_key: componentTypeKey,
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

        // Set the appropriate ID field
        if (funnelId) {
          newComponent.funnel_id = funnelId;
        } else if (quizId) {
          newComponent.quiz_id = quizId;
        }

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
          quiz_id: null, // Legacy field for backward compatibility
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
    },
    [funnelId, quizId, components.length]
  );

  // Update component in Supabase
  const updateComponent = useCallback(
    async (componentId: string, updates: Partial<SupabaseComponent>) => {
      if (!componentId) return false;

      setIsLoading(true);
      try {
        // Clean the updates object to remove null values that aren't allowed by Supabase
        const cleanedUpdates = Object.fromEntries(
          Object.entries(updates).filter(([_, value]) => value !== null)
        );

        const { data, error: updateError } = await supabase
          .from('component_instances')
          .update({
            ...cleanedUpdates,
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
          quiz_id: null, // Legacy field for backward compatibility
        };

        setComponents(prev =>
          prev.map(comp => (comp.id === componentId ? updatedComponent : comp))
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
    },
    []
  );

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
  const reorderComponents = useCallback(
    async (sourceIndex: number, destinationIndex: number) => {
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
    },
    [components]
  );

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
    // Add missing properties
    connectionStatus: 'connected' as const,
    isSaving: isLoading,
    lastSync: new Date().toISOString(),
  };
};
