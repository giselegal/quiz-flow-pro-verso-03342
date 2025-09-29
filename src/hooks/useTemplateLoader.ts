import { getStepTemplate } from '@/config/templates/templates';
// @ts-nocheck
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import { Block } from '@/types/editor';
import { useCallback, useEffect, useState } from 'react';

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
  loadQuizEstiloTemplate: (stepNumber: number) => Promise<{ blocks: Block[] }>; // 🎯 NOVO

  // Estado
  isLoading: boolean;
  error: Error | null;

  // Cache
  templatesMetadata: Record<string, TemplateMetadata>;
  cachedTemplates: Record<string, StageTemplate>;
}

export function useTemplateLoader(): UseTemplateLoaderResult {
  const { state } = useEditor();
  const stages = state.stepBlocks ? Object.keys(state.stepBlocks).map((id, index) => ({ id, order: index + 1 })) : [];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [templatesMetadata, setTemplatesMetadata] = useState<Record<string, TemplateMetadata>>({});
  const [cachedTemplates, setCachedTemplates] = useState<Record<string, StageTemplate>>({});

  // 🎯 NOVO: Carregar template quiz-estilo-21-steps
  const loadQuizEstiloTemplate = useCallback(
    async (stepNumber: number): Promise<{ blocks: Block[] }> => {
      try {
        setIsLoading(true);
        setError(null);

        // Importar adapter dinâmico
        const { QuizToEditorAdapter } = await import('@/adapters/QuizToEditorAdapter');
        
        // Obter configuração da etapa específica
        const stepConfig = await QuizToEditorAdapter.getStepConfiguration(stepNumber);
        if (!stepConfig) {
          throw new Error(`Quiz step ${stepNumber} not found`);
        }

        // Converter para formato de blocos do editor
        const stepId = `step-${stepNumber}`;
        const editorData = await QuizToEditorAdapter.convertQuizToEditor();
        const blocks = editorData.stepBlocks[stepId] || [];

        console.log(`✅ Quiz template loaded for step ${stepNumber}: ${blocks.length} blocks`);
        
        return { blocks };
      } catch (err) {
        console.error('❌ Error loading quiz template:', err);
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Carregar metadata de todos os templates
  useEffect(() => {
    const loadAllMetadata = async () => {
      const metadata: Record<string, TemplateMetadata> = {};

      for (const stage of stages) {
        const template = await getStepTemplate(stage.order);
        if (template) {
          metadata[stage.id] = {
            id: stage.id,
            name: template.metadata?.name || `Template ${stage.order}`,
            description: template.metadata?.description,
            type: template.metadata?.type || 'default',
            version: template.metadata?.version || '1.0.0',
            blocksCount: template.blocks?.length || 0,
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
        const stage = stages.find((s: any) => s.id === stageId);
        if (!stage) throw new Error(`Stage ${stageId} not found`);

        const template = await getStepTemplate(stage.order);
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
    loadQuizEstiloTemplate, // 🎯 NOVO: Método específico do quiz
    isLoading,
    error,
    templatesMetadata,
    cachedTemplates,
  };
}
