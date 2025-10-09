import { useCallback, useEffect, useState } from 'react';
import { getSupabaseClient } from '@/integrations/supabase/supabaseLazy';

// ============================================================================
// TIPOS PARA COMPONENTES REUTILIZÁVEIS
// ============================================================================

export interface ComponentType {
  id: string;
  type_key: string;
  display_name: string;
  description: string;
  category: string;
  icon: string;
  is_system: boolean;
  default_properties: Record<string, any>;
  validation_schema: Record<string, any>;
}

export interface ComponentInstance {
  id: string;
  instance_key: string;
  component_type_key: string;
  quiz_id: string;
  step_number: number;
  order_index: number;
  properties: Record<string, any>;
  custom_styling: Record<string, any>;
  is_active: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface StepComponent {
  id: string;
  instance_key: string;
  quiz_id: string;
  step_number: number;
  order_index: number;
  component_type: string;
  display_name: string;
  category: string;
  properties: Record<string, any>;
  custom_styling: Record<string, any>;
  is_active: boolean;
}

// ============================================================================
// HOOK PARA GERENCIAR COMPONENTES REUTILIZÁVEIS
// ============================================================================

export const useReusableComponents = (quizId?: string) => {
  const [componentTypes, setComponentTypes] = useState<ComponentType[]>([]);
  const [stepComponents, setStepComponents] = useState<Record<number, StepComponent[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lazy client: somente carregado quando necessário (cache por instância do hook)
  const [supabaseClient, setSupabaseClient] = useState<any | null>(null);
  const ensureClient = useCallback(async () => {
    if (supabaseClient) return supabaseClient;
    try {
      const client = await getSupabaseClient();
      setSupabaseClient(client);
      return client;
    } catch (e) {
      console.warn('[useReusableComponents] Supabase indisponível (mock).');
      setSupabaseClient(null);
      return null;
    }
  }, [supabaseClient]);

  // ============================================================================
  // CARREGAR TIPOS DE COMPONENTES DISPONÍVEIS
  // ============================================================================

  const loadComponentTypes = useCallback(async () => {
    try {
      setLoading(true);

      const supabase = await ensureClient();
      if (!supabase) {
        // Retorna dados mock quando Supabase não está configurado
        const mockData: ComponentType[] = [];
        setComponentTypes(mockData);
        setError(null);
        return;
      }

      const { data, error } = await supabase
        .from('component_types')
        .select('*')
        .order('category, display_name');

      if (error) throw error;
      setComponentTypes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipos de componentes');
    } finally {
      setLoading(false);
    }
  }, [ensureClient]);

  // ============================================================================
  // CARREGAR COMPONENTES DE UMA ETAPA ESPECÍFICA
  // ============================================================================

  const loadStepComponents = useCallback(
    async (stepNumber: number) => {
      if (!quizId) return;

      try {
        setLoading(true);
        const supabase = await ensureClient();
        if (!supabase) {
          setStepComponents(prev => ({ ...prev, [stepNumber]: [] }));
          return [];
        }
        const { data, error } = await supabase
          .from('step_components')
          .select('*')
          .eq('quiz_id', quizId)
          .eq('step_number', stepNumber)
          .eq('is_active', true)
          .order('order_index');

        if (error) throw error;

        setStepComponents(prev => ({
          ...prev,
          [stepNumber]: data || [],
        }));

        return data || [];
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar componentes da etapa');
        return [];
      } finally {
        setLoading(false);
      }
    },
    [quizId, ensureClient]
  );

  // ============================================================================
  // CARREGAR TODOS OS COMPONENTES DO QUIZ
  // ============================================================================

  const loadAllQuizComponents = useCallback(async () => {
    if (!quizId) return;

    try {
      setLoading(true);
      const supabase = await ensureClient();
      if (!supabase) {
        setStepComponents({});
        return {} as Record<number, StepComponent[]>;
      }
      const { data, error } = await supabase
        .from('step_components')
        .select('*')
        .eq('quiz_id', quizId)
        .eq('is_active', true)
        .order('step_number, order_index');

      if (error) throw error;

      // Agrupar por etapa
      const groupedComponents: Record<number, StepComponent[]> = {};
      (data || []).forEach((component: any) => {
        if (!groupedComponents[component.step_number]) {
          groupedComponents[component.step_number] = [];
        }
        groupedComponents[component.step_number].push(component);
      });

      setStepComponents(groupedComponents);
      return groupedComponents;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar componentes do quiz');
      return {};
    } finally {
      setLoading(false);
    }
  }, [quizId, ensureClient]);

  // ============================================================================
  // ADICIONAR COMPONENTE A UMA ETAPA
  // ============================================================================

  const addComponent = useCallback(
    async (
      componentTypeKey: string,
      stepNumber: number,
      properties: Record<string, any> = {},
      orderIndex?: number
    ) => {
      if (!quizId) throw new Error('Quiz ID é obrigatório');

      try {
        setLoading(true);

        // Se não especificado, adicionar no final
        if (orderIndex === undefined) {
          const currentComponents = stepComponents[stepNumber] || [];
          orderIndex = currentComponents.length + 1;
        }

        const supabase = await ensureClient();
        if (!supabase) throw new Error('Supabase não configurado');

        const { data, error } = await supabase
          .from('component_instances')
          .insert({
            component_type_key: componentTypeKey,
            quiz_id: quizId,
            step_number: stepNumber,
            order_index: orderIndex,
            properties,
            created_by: (await supabase.auth.getUser()).data.user?.id,
          })
          .select()
          .single();

        if (error) throw error;

        // Recarregar componentes da etapa
        await loadStepComponents(stepNumber);

        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao adicionar componente');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [quizId, stepComponents, loadStepComponents, ensureClient]
  );

  // ============================================================================
  // ATUALIZAR PROPRIEDADES DE UM COMPONENTE
  // ============================================================================

  const updateComponent = useCallback(
    async (
      instanceId: string,
      updates: Partial<Pick<ComponentInstance, 'properties' | 'custom_styling' | 'is_active'>>
    ) => {
      try {
        setLoading(true);

        const supabase = await ensureClient();
        if (!supabase) throw new Error('Supabase não configurado');

        const { data, error } = await supabase
          .from('component_instances')
          .update(updates)
          .eq('id', instanceId)
          .select()
          .single();

        if (error) throw error;

        // Recarregar componentes da etapa afetada
        if (data) {
          await loadStepComponents(data.step_number);
        }

        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao atualizar componente');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadStepComponents, ensureClient]
  );

  // ============================================================================
  // REORDENAR COMPONENTES DE UMA ETAPA
  // ============================================================================

  const reorderComponents = useCallback(
    async (stepNumber: number, orderedInstanceIds: string[]) => {
      try {
        setLoading(true);

        const supabase = await ensureClient();
        if (!supabase) throw new Error('Supabase não configurado');
        // Atualizar order_index de cada componente (executar em lote sequencial para evitar gargalos)
        for (let index = 0; index < orderedInstanceIds.length; index++) {
          const instanceId = orderedInstanceIds[index];
          const { error } = await supabase
            .from('component_instances')
            .update({ order_index: index + 1 })
            .eq('id', instanceId);
          if (error) throw error;
        }

        // Recarregar componentes da etapa
        await loadStepComponents(stepNumber);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao reordenar componentes');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadStepComponents, ensureClient]
  );

  // ============================================================================
  // DELETAR COMPONENTE
  // ============================================================================

  const deleteComponent = useCallback(
    async (instanceId: string) => {
      try {
        setLoading(true);

        const supabase = await ensureClient();
        if (!supabase) throw new Error('Supabase não configurado');

        // Obter dados do componente antes de deletar
        const { data: componentData } = await supabase
          .from('component_instances')
          .select('step_number')
          .eq('id', instanceId)
          .single();

        const { error } = await supabase.from('component_instances').delete().eq('id', instanceId);

        if (error) throw error;

        // Recarregar componentes da etapa
        if (componentData) {
          await loadStepComponents(componentData.step_number);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao deletar componente');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadStepComponents, ensureClient]
  );

  // ============================================================================
  // DUPLICAR COMPONENTE
  // ============================================================================

  const duplicateComponent = useCallback(
    async (instanceId: string, targetStepNumber?: number) => {
      try {
        setLoading(true);

        const supabase = await ensureClient();
        if (!supabase) throw new Error('Supabase não configurado');

        // Obter dados do componente original
        const { data: originalComponent, error: fetchError } = await supabase
          .from('component_instances')
          .select('*')
          .eq('id', instanceId)
          .single();

        if (fetchError) throw fetchError;

        const targetStep = targetStepNumber || originalComponent.step_number;
        const currentComponents = stepComponents[targetStep] || [];

        // Criar nova instância
        const { data, error } = await supabase
          .from('component_instances')
          .insert({
            component_type_key: originalComponent.component_type_key,
            quiz_id: originalComponent.quiz_id,
            step_number: targetStep,
            order_index: currentComponents.length + 1,
            properties: originalComponent.properties,
            custom_styling: originalComponent.custom_styling,
            created_by: (await supabase.auth.getUser()).data.user?.id,
          })
          .select()
          .single();

        if (error) throw error;

        // Recarregar componentes da etapa
        await loadStepComponents(targetStep);

        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao duplicar componente');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [stepComponents, loadStepComponents, ensureClient]
  );

  // ============================================================================
  // CARREGAR DADOS INICIAIS
  // ============================================================================

  useEffect(() => {
    loadComponentTypes();
  }, [loadComponentTypes]);

  useEffect(() => {
    if (quizId) {
      loadAllQuizComponents();
    }
  }, [quizId, loadAllQuizComponents]);

  // ============================================================================
  // RETORNAR API DO HOOK
  // ============================================================================

  return {
    // Estados
    componentTypes,
    stepComponents,
    loading,
    error,

    // Actions
    loadComponentTypes,
    loadStepComponents,
    loadAllQuizComponents,
    addComponent,
    updateComponent,
    reorderComponents,
    deleteComponent,
    duplicateComponent,

    // Utilitários
    getStepComponents: (stepNumber: number) => stepComponents[stepNumber] || [],
    getComponentsByType: (typeKey: string) =>
      Object.values(stepComponents)
        .flat()
        .filter(comp => comp.component_type === typeKey),

    clearError: () => setError(null),
  };
};

export default useReusableComponents;
