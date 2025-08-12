import { STEP_TEMPLATES } from "@/config/templates/templates";
import { useEditor } from "@/context/EditorContext";
import { Block } from "@/types/editor";
import { useCallback, useEffect, useState } from "react";

type StageTemplate = any;

interface TemplateMetadata {
  id: string;
  name: string;
  description?: string;
  type: string;
  version: string;
  blocksCount: number;
}

interface UseTemplateLoaderResult {
  // Template Loading
  loadTemplate: (stageId: string) => Promise<StageTemplate | null>;
  loadTemplateBlocks: (stageId: string) => Promise<Block[]>;
  getTemplateMetadata: (stageId: string) => TemplateMetadata | null;

  // Estado
  isLoading: boolean;
  error: Error | null;

  // Cache
  templatesMetadata: Record<string, TemplateMetadata>;
  cachedTemplates: Record<string, StageTemplate>;
}

export function useTemplateLoader(): UseTemplateLoaderResult {
  const { stages } = useEditor();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [templatesMetadata, setTemplatesMetadata] = useState<Record<string, TemplateMetadata>>({});
  const [cachedTemplates, setCachedTemplates] = useState<Record<string, StageTemplate>>({});

  // Carregar metadata de todos os templates
  useEffect(() => {
    const loadAllMetadata = async () => {
      const metadata: Record<string, TemplateMetadata> = {};

      for (const stage of stages) {
        const template = (STEP_TEMPLATES as any)[stage.order];
        if (template) {
          metadata[stage.id] = {
            id: stage.id,
            name: (template as any).metadata?.name || `Template ${stage.order}`,
            description: (template as any).metadata?.description,
            type: (template as any).metadata?.type || "default",
            version: (template as any).metadata?.version || "1.0.0",
            blocksCount: (template as any).blocks?.length || 0,
          };
        }
      }

      setTemplatesMetadata(metadata);
    };

    loadAllMetadata();
  }, [stages]);

  // Carregar template específico
  const loadTemplate = useCallback(
    async (stageId: string): Promise<StageTemplate | null> => {
      try {
        setIsLoading(true);
        setError(null);

        // Verificar cache primeiro
        if (cachedTemplates[stageId]) {
          return cachedTemplates[stageId];
        }

        // Carregar do sistema de templates
        const stage = stages.find(s => s.id === stageId);
        if (!stage) throw new Error(`Stage ${stageId} not found`);

        const template = (STEP_TEMPLATES as any)[stage.order];
        if (!template) throw new Error(`Template for stage ${stageId} not found`);

        // Atualizar cache
        setCachedTemplates(prev => ({
          ...prev,
          [stageId]: template,
        }));

        return template;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [stages, cachedTemplates]
  );

  // Carregar blocos do template
  const loadTemplateBlocks = useCallback(
    async (stageId: string): Promise<Block[]> => {
      const template = await loadTemplate(stageId);
      if (!template?.blocks) return [];

      return template.blocks.map((block: any, index: number) => ({
        id: `${stageId}-block-${index + 1}`,
        type: block.type,
        content: block.content || {},
        properties: block.properties || {},
        order: index + 1,
      }));
    },
    [loadTemplate]
  );

  // Obter metadata de um template
  const getTemplateMetadata = useCallback(
    (stageId: string): TemplateMetadata | null => {
      return templatesMetadata[stageId] || null;
    },
    [templatesMetadata]
  );

  return {
    loadTemplate,
    loadTemplateBlocks,
    getTemplateMetadata,
    isLoading,
    error,
    templatesMetadata,
    cachedTemplates,
  };
}
