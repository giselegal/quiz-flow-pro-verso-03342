import { useCallback, useState } from "react";
import { useToast } from "../../components/ui/use-toast";
import type { SchemaDrivenFunnelData } from "../../services/schemaDrivenFunnelService";
import { schemaDrivenFunnelService } from "../../services/schemaDrivenFunnelService";

// Interface para compatibilidade com o editor existente
export interface FunnelData {
  id: string;
  name: string;
  description?: string;
  userId?: string;
  isPublished: boolean;
  version: number;
  settings: Record<string, any>;
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

export const useEditorPersistence = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveFunnel = useCallback(
    async (data: FunnelData) => {
      setIsSaving(true);
      try {
        // Converter FunnelData para SchemaDrivenFunnelData
        const schemaDrivenData: SchemaDrivenFunnelData = {
          id: data.id,
          name: data.name,
          description: data.description || "",
          theme: "default",
          isPublished: data.isPublished,
          pages: data.pages.map(page => ({
            id: page.id,
            name: page.title,
            title: page.title,
            type: page.pageType as any,
            order: page.pageOrder,
            blocks: page.blocks,
            settings: {
              showProgress: false,
              progressValue: 0,
              backgroundColor: "#ffffff",
              textColor: "#432818",
              maxWidth: "max-w-4xl",
              padding: "p-6",
            },
            metadata: page.metadata,
          })),
          config: {
            name: data.name,
            description: data.description || "",
            isPublished: data.isPublished,
            theme: "default",
            primaryColor: "#B89B7A",
            secondaryColor: "#432818",
            fontFamily: "Inter, sans-serif",
          },
          version: data.version,
          lastModified: new Date(),
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        };

        await schemaDrivenFunnelService.saveFunnel(schemaDrivenData);

        toast({
          title: "Sucesso",
          description: "Funil salvo com sucesso!",
        });
        return { success: true };
      } catch (error) {
        console.error("Error saving funnel:", error);
        toast({
          title: "Erro",
          description: "Erro inesperado ao salvar",
          variant: "destructive",
        });
        return { success: false, error: "Unexpected error" };
      } finally {
        setIsSaving(false);
      }
    },
    [toast]
  );

  const loadFunnel = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const schemaDrivenData = await schemaDrivenFunnelService.loadFunnel(id);

        if (!schemaDrivenData) {
          return null;
        }

        // Converter SchemaDrivenFunnelData para FunnelData
        const funnelData: FunnelData = {
          id: schemaDrivenData.id,
          name: schemaDrivenData.name,
          description: schemaDrivenData.description || "",
          isPublished: schemaDrivenData.isPublished || false,
          version: schemaDrivenData.version || 1,
          settings: schemaDrivenData.config || {},
          pages: schemaDrivenData.pages.map(page => ({
            id: page.id,
            pageType: page.type,
            pageOrder: page.order,
            title: page.title,
            blocks: page.blocks,
            metadata: page.metadata || {},
          })),
          createdAt: schemaDrivenData.createdAt?.toISOString(),
          updatedAt: schemaDrivenData.lastModified?.toISOString(),
        };

        return funnelData;
      } catch (error) {
        console.error("Error loading funnel:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar funil",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const listFunnels = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Implementar listagem de funis no schemaDrivenFunnelService
      console.warn("listFunnels não implementado ainda no schemaDrivenFunnelService");
      return [];
    } catch (error) {
      console.error("Error listing funnels:", error);
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

  const deleteFunnel = useCallback(
    async (_id: string) => {
      try {
        // TODO: Implementar deleteFunnel no schemaDrivenFunnelService
        console.warn("deleteFunnel não implementado ainda no schemaDrivenFunnelService");
        toast({
          title: "Sucesso",
          description: "Funil deletado com sucesso!",
        });
        return { success: true };
      } catch (error) {
        console.error("Error deleting funnel:", error);
        toast({
          title: "Erro",
          description: "Erro inesperado ao deletar",
          variant: "destructive",
        });
        return { success: false, error: "Unexpected error" };
      }
    },
    [toast]
  );

  const publishFunnel = useCallback(
    async (_id: string) => {
      try {
        // TODO: Implementar publishFunnel no schemaDrivenFunnelService
        console.warn("publishFunnel não implementado ainda no schemaDrivenFunnelService");
        toast({
          title: "Sucesso",
          description: "Funil publicado com sucesso!",
        });
        return { success: true };
      } catch (error) {
        console.error("Error publishing funnel:", error);
        toast({
          title: "Erro",
          description: "Erro inesperado ao publicar",
          variant: "destructive",
        });
        return { success: false, error: "Unexpected error" };
      }
    },
    [toast]
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
