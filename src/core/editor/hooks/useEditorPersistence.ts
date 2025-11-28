import { useCallback, useState } from 'react';
import { useToast } from '../../components/ui/use-toast';
import { FunnelContext } from '../../core/contexts/FunnelContext';
import { ContextualFunnelService } from '@/services/core/ContextualFunnelService';
import type { ContextualFunnelData } from '@/types/funnel';
import { appLogger } from '@/lib/utils/appLogger';

// Tipo para aceitar valores do enum FunnelContext
export type FunnelContextType = typeof FunnelContext[keyof typeof FunnelContext];

// Interface para compatibilidade com o editor existente
export interface FunnelData {
  id: string;
  name: string;
  description?: string;
  userId?: string;
  isPublished: boolean;
  version: number;
  settings: any; // Accept any settings to avoid type mismatch
  pages: FunnelPage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FunnelPage {
  id: string;
  pageType: string;
  pageOrder: number;
  title: string;
  blocks: any[];
  metadata: Record<string, any>;
}

export const useEditorPersistence = (context: FunnelContextType = FunnelContext.EDITOR) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 🎯 Criar uma instância do serviço contextual
  const contextualFunnelService = new ContextualFunnelService(context || 'default');

  const saveFunnel = useCallback(
    async (data: FunnelData) => {
      setIsSaving(true);
      try {
        // Converter FunnelData para ContextualFunnelData
        const contextualData: ContextualFunnelData = {
          id: data.id,
          name: data.name,
          description: data.description || undefined,
          pages: data.pages || [],
          context: context || 'default',
          userId: data.userId,
          isPublished: data.isPublished,
          version: data.version,
          settings: data.settings,
        };

        // 🎯 Usar o serviço contextual para isolamento completo
        await contextualFunnelService.saveFunnel(contextualData as any);

        toast({
          title: 'Sucesso',
          description: `Funil salvo no contexto ${context}!`,
        });
        return { success: true };
      } catch (error) {
        appLogger.error('Error saving funnel:', { data: [error] });
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
    [toast, context, contextualFunnelService],
  );

  const loadFunnel = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        // 🎯 Usar o serviço contextual para isolamento completo
        const contextualData = (await contextualFunnelService.loadFunnel(id)) as any;

        if (!contextualData) {
          return null;
        }

        // Converter ContextualFunnelData para FunnelData
        const funnelData: FunnelData = {
          id: contextualData.id,
          name: contextualData.name,
          description: contextualData.description,
          isPublished: contextualData.isPublished || false,
          version: parseInt(String((contextualData as any).version || 1)),
          settings: (contextualData as any).settings || {},
          pages: ((contextualData as any).pages || []).map((page: any) => ({
            id: page.id,
            pageType: page.page_type || 'step',
            pageOrder: page.page_order || 1,
            title: page.title || 'Untitled',
            blocks: Array.isArray(page.blocks) ? page.blocks : [],
            metadata:
              typeof page.metadata === 'object' && page.metadata !== null ? page.metadata : {},
          })),
          createdAt:
            typeof (contextualData as any).createdAt === 'string'
              ? (contextualData as any).createdAt
              : (contextualData as any).createdAt?.toISOString(),
          updatedAt:
            typeof (contextualData as any).updatedAt === 'string'
              ? (contextualData as any).updatedAt
              : (contextualData as any).updatedAt?.toISOString(),
        };

        return funnelData;
      } catch (error) {
        appLogger.error('Error loading funnel:', { data: [error] });
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
    [toast, context, contextualFunnelService],
  );

  const listFunnels = useCallback(async () => {
    setIsLoading(true);
    try {
      // 🎯 Usar o serviço contextual para listar funis do contexto específico
      const funnels = await contextualFunnelService.listFunnels();
      return funnels.map((funnel: any) => ({
        id: funnel.id,
        name: funnel.name,
        description: funnel.description || '',
        isPublished: funnel.isPublished || false,
        version: funnel.version || 1,
        settings: funnel.config || {},
        pages: funnel.pages.map((page: any) => ({
          id: page.id,
          pageType: page.page_type || 'step',
          pageOrder: page.page_order || 1,
          title: page.title || 'Untitled',
          blocks: Array.isArray(page.blocks) ? page.blocks : [],
          metadata: typeof page.metadata === 'object' && page.metadata !== null ? page.metadata : {},
        })),
        createdAt: funnel.createdAt?.toISOString(),
        updatedAt: funnel.lastModified?.toISOString(),
      }));
    } catch (error) {
      appLogger.error('Error listing funnels:', { data: [error] });
      toast({
        title: 'Erro',
        description: 'Erro ao listar funis',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast, context, contextualFunnelService]);

  const deleteFunnel = useCallback(
    async (id: string) => {
      try {
        // 🎯 Usar o serviço contextual para deletar apenas do contexto específico
        await contextualFunnelService.deleteFunnel(id);
        toast({
          title: 'Sucesso',
          description: `Funil deletado do contexto ${context}!`,
        });
        return { success: true };
      } catch (error) {
        appLogger.error('Error deleting funnel:', { data: [error] });
        toast({
          title: 'Erro',
          description: 'Erro inesperado ao deletar',
          variant: 'destructive',
        });
        return { success: false, error: 'Unexpected error' };
      }
    },
    [toast, context, contextualFunnelService],
  );

  const publishFunnel = useCallback(
    async (id: string) => {
      try {
        // 🎯 Usar o serviço contextual para publicar apenas do contexto específico
        const funnel = await contextualFunnelService.loadFunnel(id);
        if (funnel) {
          const updatedFunnel = { ...funnel, isPublished: true };
          await contextualFunnelService.saveFunnel(updatedFunnel as any);
        }

        toast({
          title: 'Sucesso',
          description: `Funil publicado no contexto ${context}!`,
        });
        return { success: true };
      } catch (error) {
        appLogger.error('Error publishing funnel:', { data: [error] });
        toast({
          title: 'Erro',
          description: 'Erro inesperado ao publicar',
          variant: 'destructive',
        });
        return { success: false, error: 'Unexpected error' };
      }
    },
    [toast, context, contextualFunnelService],
  );

  return {
    saveFunnel,
    loadFunnel,
    listFunnels,
    deleteFunnel,
    publishFunnel,
    isSaving,
    isLoading,
  };
};
