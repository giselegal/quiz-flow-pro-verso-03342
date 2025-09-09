/**
 * 🎯 HOOK CONTEXTUAL PARA PERSISTÊNCIA DE FUNIS
 * 
 * Hook que trabalha com contextos isolados para evitar vazamento de dados
 * Substitui o useEditorPersistence com isolamento completo
 */

import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { 
  ContextualFunnelService, 
  ContextualFunnelData,
  createContextualFunnelService 
} from '@/services/contextualFunnelService';

export interface FunnelData {
  id: string;
  name: string;
  description: string;
  isPublished: boolean;
  version: number;
  settings: Record<string, any>;
  pages: Array<{
    id: string;
    pageType: string;
    pageOrder: number;
    title: string;
    blocks: any[];
    metadata: Record<string, any>;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface UseContextualEditorPersistenceReturn {
  saveFunnel: (data: FunnelData) => Promise<{ success: boolean; error?: string }>;
  loadFunnel: (id: string) => Promise<FunnelData | null>;
  listFunnels: () => Promise<any[]>;
  deleteFunnel: (id: string) => Promise<{ success: boolean; error?: string }>;
  publishFunnel: (id: string) => Promise<{ success: boolean; error?: string }>;
  isSaving: boolean;
  isLoading: boolean;
  context: FunnelContext;
  service: ContextualFunnelService;
}

/**
 * Hook de persistência contextual para funis
 */
export const useContextualEditorPersistence = (
  context: FunnelContext
): UseContextualEditorPersistenceReturn => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [service] = useState(() => createContextualFunnelService(context));

  const convertToContextualData = (data: FunnelData): ContextualFunnelData => {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      pages: data.pages,
      theme: data.settings.theme,
      isPublished: data.isPublished,
      version: data.version,
      config: data.settings,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      lastModified: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      context,
    };
  };

  const convertFromContextualData = (data: ContextualFunnelData): FunnelData => {
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      isPublished: data.isPublished || false,
      version: data.version || 1,
      settings: data.config || {},
      pages: data.pages.map(page => ({
        id: page.id,
        pageType: page.page_type || 'step',
        pageOrder: page.page_order || 1,
        title: page.title || 'Untitled',
        blocks: Array.isArray(page.blocks) ? page.blocks : [],
        metadata: typeof page.metadata === 'object' && page.metadata !== null ? page.metadata : {},
      })),
      createdAt: data.createdAt?.toISOString(),
      updatedAt: data.lastModified?.toISOString(),
    };
  };

  const saveFunnel = useCallback(
    async (data: FunnelData): Promise<{ success: boolean; error?: string }> => {
      setIsSaving(true);
      try {
        console.log(`💾 Salvando funil no contexto ${context}:`, data.id);
        
        const contextualData = convertToContextualData(data);
        await service.saveFunnel(contextualData);

        toast({
          title: 'Sucesso',
          description: `Funil salvo com sucesso no contexto ${context}!`,
        });
        
        return { success: true };
      } catch (error) {
        console.error(`❌ Erro ao salvar funil no contexto ${context}:`, error);
        toast({
          title: 'Erro',
          description: 'Erro inesperado ao salvar',
          variant: 'destructive',
        });
        return { success: false, error: 'Unexpected error' };
      } finally {
        setIsSaving(false);
      }
    },
    [toast, context, service]
  );

  const loadFunnel = useCallback(
    async (id: string): Promise<FunnelData | null> => {
      setIsLoading(true);
      try {
        console.log(`📂 Carregando funil do contexto ${context}:`, id);
        
        const contextualData = await service.loadFunnel(id);

        if (!contextualData) {
          console.log(`⚠️ Funil ${id} não encontrado no contexto ${context}`);
          return null;
        }

        const funnelData = convertFromContextualData(contextualData);
        console.log(`✅ Funil carregado do contexto ${context}:`, funnelData.id);
        
        return funnelData;
      } catch (error) {
        console.error(`❌ Erro ao carregar funil do contexto ${context}:`, error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar funil',
          variant: 'destructive',
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, context, service]
  );

  const listFunnels = useCallback(async (): Promise<any[]> => {
    setIsLoading(true);
    try {
      console.log(`📋 Listando funis do contexto ${context}`);
      
      const contextualFunnels = await service.listFunnels();
      const funnelsList = contextualFunnels.map(convertFromContextualData);
      
      console.log(`✅ ${funnelsList.length} funis encontrados no contexto ${context}`);
      return funnelsList;
    } catch (error) {
      console.error(`❌ Erro ao listar funis do contexto ${context}:`, error);
      toast({
        title: 'Erro',
        description: 'Erro ao listar funis',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast, context, service]);

  const deleteFunnel = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      try {
        console.log(`🗑️ Deletando funil do contexto ${context}:`, id);
        
        const success = await service.deleteFunnel(id);
        
        if (success) {
          toast({
            title: 'Sucesso',
            description: `Funil deletado com sucesso do contexto ${context}!`,
          });
          return { success: true };
        } else {
          throw new Error('Falha ao deletar funil');
        }
      } catch (error) {
        console.error(`❌ Erro ao deletar funil do contexto ${context}:`, error);
        toast({
          title: 'Erro',
          description: 'Erro inesperado ao deletar',
          variant: 'destructive',
        });
        return { success: false, error: 'Unexpected error' };
      }
    },
    [toast, context, service]
  );

  const publishFunnel = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      try {
        console.log(`🚀 Publicando funil do contexto ${context}:`, id);
        
        // Carregar funil
        const funnel = await service.loadFunnel(id);
        if (!funnel) {
          throw new Error('Funil não encontrado');
        }

        // Marcar como publicado
        const updatedFunnel: ContextualFunnelData = {
          ...funnel,
          isPublished: true,
          lastModified: new Date(),
        };

        await service.saveFunnel(updatedFunnel);

        toast({
          title: 'Sucesso',
          description: `Funil publicado com sucesso no contexto ${context}!`,
        });
        return { success: true };
      } catch (error) {
        console.error(`❌ Erro ao publicar funil do contexto ${context}:`, error);
        toast({
          title: 'Erro',
          description: 'Erro inesperado ao publicar',
          variant: 'destructive',
        });
        return { success: false, error: 'Unexpected error' };
      }
    },
    [toast, context, service]
  );

  return {
    saveFunnel,
    loadFunnel,
    listFunnels,
    deleteFunnel,
    publishFunnel,
    isSaving,
    isLoading,
    context,
    service,
  };
};

// ============================================================================
// HOOKS PRÉ-CONFIGURADOS PARA CADA CONTEXTO
// ============================================================================

/**
 * Hook específico para o contexto do Editor
 */
export const useEditorPersistence = () => {
  return useContextualEditorPersistence(FunnelContext.EDITOR);
};

/**
 * Hook específico para o contexto de Templates
 */
export const useTemplatesPersistence = () => {
  return useContextualEditorPersistence(FunnelContext.TEMPLATES);
};

/**
 * Hook específico para o contexto de Meus Funis
 */
export const useMyFunnelsPersistence = () => {
  return useContextualEditorPersistence(FunnelContext.MY_FUNNELS);
};

/**
 * Hook específico para o contexto de Preview
 */
export const usePreviewPersistence = () => {
  return useContextualEditorPersistence(FunnelContext.PREVIEW);
};

/**
 * Hook específico para o contexto de Desenvolvimento
 */
export const useDevPersistence = () => {
  return useContextualEditorPersistence(FunnelContext.DEV);
};
