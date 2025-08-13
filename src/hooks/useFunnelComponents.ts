import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { funnelComponentsService, ComponentInstance, AddComponentInput, UpdateComponentInput } from '@/services/funnelComponentsService';
import { generateInstanceKey } from '@/utils/funnelIdentity';

interface UseFunnelComponentsProps {
  funnelId: string;
  stepNumber: number;
  enabled?: boolean; // Para habilitar/desabilitar persistência no Supabase
}

interface UseFunnelComponentsReturn {
  components: ComponentInstance[];
  isLoading: boolean;
  error: string | null;
  
  // Ações CRUD
  addComponent: (componentTypeKey: string, position?: number) => Promise<ComponentInstance | null>;
  updateComponent: (id: string, updates: Partial<UpdateComponentInput>) => Promise<ComponentInstance | null>;
  deleteComponent: (id: string) => Promise<boolean>;
  reorderComponents: (newOrderIds: string[]) => Promise<boolean>;
  
  // Utilidades
  refreshComponents: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook para gerenciar componentes de funil com persistência no Supabase
 * 
 * Funcionalidades:
 * - CRUD completo com validação
 * - Tratamento de erros com feedback visual
 * - Sincronização automática com Supabase
 * - Fallback quando Supabase está desabilitado
 * - Loading states e otimistic updates
 */
export const useFunnelComponents = ({
  funnelId,
  stepNumber,
  enabled = true,
}: UseFunnelComponentsProps): UseFunnelComponentsReturn => {
  const { toast } = useToast();
  const [components, setComponents] = useState<ComponentInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Habilitar/desabilitar baseado na env var
  const isSupabaseEnabled = enabled && (import.meta.env.VITE_EDITOR_SUPABASE_ENABLED === 'true');

  /**
   * Carrega componentes do Supabase
   */
  const loadComponents = useCallback(async () => {
    if (!isSupabaseEnabled) {
      console.log('📋 Supabase desabilitado, usando estado local');
      return;
    }

    if (!funnelId || !stepNumber) {
      console.warn('⚠️ FunnelId ou stepNumber inválido:', { funnelId, stepNumber });
      return;
    }

    console.log(`🔄 Carregando componentes: ${funnelId}/${stepNumber}`);
    setIsLoading(true);
    setError(null);

    try {
      const data = await funnelComponentsService.getComponents({ funnelId, stepNumber });
      setComponents(data);
      console.log(`✅ Componentes carregados: ${data.length}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Erro ao carregar componentes:', err);
      
      toast({
        title: "Erro ao carregar componentes",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [funnelId, stepNumber, isSupabaseEnabled, toast]);

  /**
   * Adiciona novo componente
   */
  const addComponent = useCallback(async (
    componentTypeKey: string, 
    position?: number
  ): Promise<ComponentInstance | null> => {
    console.log(`➕ Adicionando componente: ${componentTypeKey} na posição ${position || 'final'}`);

    if (!isSupabaseEnabled) {
      // Fallback local sem persistência
      const newComponent: ComponentInstance = {
        id: `local-${Date.now()}`,
        instance_key: generateInstanceKey(componentTypeKey, stepNumber),
        component_type_key: componentTypeKey,
        funnel_id: funnelId,
        step_number: stepNumber,
        order_index: position ?? components.length + 1,
        properties: {},
      };

      setComponents(prev => {
        if (position !== undefined) {
          const newList = [...prev];
          newList.splice(position, 0, newComponent);
          return newList.map((comp, index) => ({ ...comp, order_index: index + 1 }));
        }
        return [...prev, newComponent];
      });

      return newComponent;
    }

    try {
      const input: AddComponentInput = {
        funnelId,
        stepNumber,
        instanceKey: generateInstanceKey(componentTypeKey, stepNumber),
        componentTypeKey,
        orderIndex: position ?? components.length + 1,
        properties: {},
      };

      const newComponent = await funnelComponentsService.addComponent(input);
      
      // Atualização otimista do estado local
      setComponents(prev => {
        if (position !== undefined) {
          const newList = [...prev];
          newList.splice(position, 0, newComponent);
          return newList;
        }
        return [...prev, newComponent];
      });

      toast({
        title: "Componente adicionado",
        description: `${componentTypeKey} adicionado com sucesso`,
      });

      return newComponent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar componente';
      setError(errorMessage);
      console.error('❌ Erro ao adicionar componente:', err);
      
      toast({
        title: "Erro ao adicionar componente",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  }, [funnelId, stepNumber, components.length, isSupabaseEnabled, toast]);

  /**
   * Atualiza componente existente
   */
  const updateComponent = useCallback(async (
    id: string, 
    updates: Partial<UpdateComponentInput>
  ): Promise<ComponentInstance | null> => {
    console.log(`🔄 Atualizando componente: ${id}`);

    if (!isSupabaseEnabled) {
      // Fallback local
      setComponents(prev => prev.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      ));

      return components.find(c => c.id === id) || null;
    }

    try {
      const updatedComponent = await funnelComponentsService.updateComponent({ id, ...updates });
      
      // Atualização otimista do estado local
      setComponents(prev => prev.map(comp => 
        comp.id === id ? updatedComponent : comp
      ));

      return updatedComponent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar componente';
      setError(errorMessage);
      console.error('❌ Erro ao atualizar componente:', err);
      
      toast({
        title: "Erro ao atualizar componente",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  }, [isSupabaseEnabled, toast, components]);

  /**
   * Remove componente
   */
  const deleteComponent = useCallback(async (id: string): Promise<boolean> => {
    console.log(`🗑️ Removendo componente: ${id}`);

    if (!isSupabaseEnabled) {
      // Fallback local
      setComponents(prev => prev.filter(comp => comp.id !== id));
      return true;
    }

    try {
      await funnelComponentsService.deleteComponent(id);
      
      // Remoção otimista do estado local
      setComponents(prev => prev.filter(comp => comp.id !== id));

      toast({
        title: "Componente removido",
        description: "Componente removido com sucesso",
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover componente';
      setError(errorMessage);
      console.error('❌ Erro ao remover componente:', err);
      
      toast({
        title: "Erro ao remover componente",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    }
  }, [isSupabaseEnabled, toast]);

  /**
   * Reordena componentes com validação rigorosa
   */
  const reorderComponents = useCallback(async (newOrderIds: string[]): Promise<boolean> => {
    console.log(`🔀 Reordenando componentes: ${newOrderIds.length} itens`);

    // Validação local prévia
    const currentIds = components.map(c => c.id).sort();
    const newIds = [...newOrderIds].sort();

    if (currentIds.length !== newIds.length || 
        !currentIds.every(id => newIds.includes(id))) {
      const errorMessage = 'Reordenação inválida: conjunto de IDs inconsistente';
      setError(errorMessage);
      toast({
        title: "Erro na reordenação",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }

    if (!isSupabaseEnabled) {
      // Fallback local
      const reorderedComponents = newOrderIds
        .map(id => components.find(c => c.id === id))
        .filter(Boolean)
        .map((comp, index) => ({ ...comp!, order_index: index + 1 }));

      setComponents(reorderedComponents);
      return true;
    }

    try {
      await funnelComponentsService.reorderComponents({ 
        funnelId, 
        stepNumber, 
        newOrderIds 
      });
      
      // Atualização otimista do estado local
      const reorderedComponents = newOrderIds
        .map(id => components.find(c => c.id === id))
        .filter(Boolean)
        .map((comp, index) => ({ ...comp!, order_index: index + 1 }));

      setComponents(reorderedComponents);

      toast({
        title: "Componentes reordenados",
        description: `${newOrderIds.length} componentes reordenados`,
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reordenar componentes';
      setError(errorMessage);
      console.error('❌ Erro ao reordenar componentes:', err);
      
      toast({
        title: "Erro na reordenação",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    }
  }, [funnelId, stepNumber, components, isSupabaseEnabled, toast]);

  /**
   * Recarrega componentes do servidor
   */
  const refreshComponents = useCallback(async () => {
    await loadComponents();
  }, [loadComponents]);

  /**
   * Limpa erro atual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Carregar componentes quando parâmetros mudarem
  useEffect(() => {
    loadComponents();
  }, [loadComponents]);

  return {
    components,
    isLoading,
    error,
    addComponent,
    updateComponent,
    deleteComponent,
    reorderComponents,
    refreshComponents,
    clearError,
  };
};