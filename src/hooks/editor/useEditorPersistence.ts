import { useState, useCallback } from 'react';
import { funnelPersistenceService } from '@/services/funnelPersistence';
import type { FunnelData } from '@/services/funnelPersistence';
import { useToast } from '@/components/ui/use-toast';

export const useEditorPersistence = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveFunnel = useCallback(async (data: FunnelData) => {
    setIsSaving(true);
    try {
      const result = await funnelPersistenceService.saveFunnel(data);
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Funil salvo com sucesso!",
        });
        return { success: true };
      } else {
        toast({
          title: "Aviso",
          description: result.error || "Erro ao salvar no servidor, mas foi salvo localmente",
          variant: "destructive",
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error saving funnel:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar",
        variant: "destructive",
      });
      return { success: false, error: 'Unexpected error' };
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  const loadFunnel = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const data = await funnelPersistenceService.loadFunnel(id);
      return data;
    } catch (error) {
      console.error('Error loading funnel:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar funil",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const listFunnels = useCallback(async () => {
    setIsLoading(true);
    try {
      const funnels = await funnelPersistenceService.listFunnels();
      return funnels;
    } catch (error) {
      console.error('Error listing funnels:', error);
      toast({
        title: "Erro",
        description: "Erro ao listar funis",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deleteFunnel = useCallback(async (id: string) => {
    try {
      const result = await funnelPersistenceService.deleteFunnel(id);
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Funil deletado com sucesso!",
        });
        return { success: true };
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao deletar funil",
          variant: "destructive",
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error deleting funnel:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao deletar",
        variant: "destructive",
      });
      return { success: false, error: 'Unexpected error' };
    }
  }, [toast]);

  const publishFunnel = useCallback(async (id: string) => {
    try {
      const result = await funnelPersistenceService.publishFunnel(id);
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Funil publicado com sucesso!",
        });
        return { success: true };
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao publicar funil",
          variant: "destructive",
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error publishing funnel:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao publicar",
        variant: "destructive",
      });
      return { success: false, error: 'Unexpected error' };
    }
  }, [toast]);

  return {
    saveFunnel,
    loadFunnel,
    listFunnels,
    deleteFunnel,
    publishFunnel,
    isSaving,
    isLoading
  };
};