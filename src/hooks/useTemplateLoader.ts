import { getStepTemplate } from '@/config/templates/templates';
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import { Block } from '@/types/editor';
import { useCallback, useEffect, useState } from 'react';
import type { QuizStepV3 } from '@/types/quiz';
import { TemplateService } from '@/services/canonical/TemplateService';
import { QuizStepAdapter } from '@/adapters/QuizStepAdapter';
import { TOTAL_STEPS } from '@/config/stepsConfig';

type StageTemplate = any;

interface TemplateMetadata {
  id: string;
  name: string;
  description?: string;
  type: string;
  version: string;
  blocksCount: number;
}

interface TemplateCache {
  [key: string]: QuizStepV3;
}

const templateCache: TemplateCache = {};

interface UseTemplateLoaderResult {
  // Template Loading
  loadTemplate: (stageId: string) => Promise<StageTemplate | null>;
  loadTemplateBlocks: (stageId: string) => Promise<Block[]>;
  getTemplateMetadata: (stageId: string) => TemplateMetadata | null;
  loadQuizEstiloTemplate: (stepNumber: number) => Promise<QuizStepV3>; // 🎯 ATUALIZADO

  // 🎯 NOVOS métodos para JSON templates
  loadAllTemplates: () => Promise<Record<string, QuizStepV3>>;
  prefetchNextSteps: (currentStep: number, count?: number) => Promise<void>;
  clearCache: () => void;

  // Estado
  isLoading: boolean;
  error: Error | null;

  // Cache
  templatesMetadata: Record<string, TemplateMetadata>;
  cachedTemplates: Record<string, StageTemplate>;
}

export function useTemplateLoader(): UseTemplateLoaderResult {
  // ✅ useEditor agora é opcional - não quebra se usado fora do EditorProvider
  const editorContext = useEditor({ optional: true });
  const state = editorContext?.state;
  const stages = state?.stepBlocks ? Object.keys(state.stepBlocks).map((id, index) => ({ id, order: index + 1 })) : [];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [templatesMetadata, setTemplatesMetadata] = useState<Record<string, TemplateMetadata>>({});
  const [cachedTemplates, setCachedTemplates] = useState<Record<string, StageTemplate>>({});

  /**
   * 🎯 MIGRADO: Carrega template usando TemplateService canonical
   */
  const loadQuizEstiloTemplate = useCallback(
    async (stepNumber: number): Promise<QuizStepV3> => {
      const stepId = `step-${stepNumber.toString().padStart(2, '0')}`;

      // 1. Verificar cache
      if (templateCache[stepId]) {
        console.log(`✅ Template ${stepId} carregado do cache`);
        return templateCache[stepId];
      }

      setIsLoading(true);
      setError(null);

      try {
        // 2. Usar TemplateService canonical
        console.log(`📥 Carregando template via TemplateService: ${stepId}`);
        const templateService = TemplateService.getInstance();
        const result = await templateService.getStep(stepId);

        if (!result.success) {
          throw new Error(`Template ${stepId} não encontrado: ${result.error.message}`);
        }

        // 3. Adaptar blocos para QuizStep
        console.log(`🔄 Adaptando template ${stepId} para QuizStep`);
        const blocks = result.data;
  const adapted = QuizStepAdapter.fromBlocks(blocks, stepId);

        // 4. Salvar no cache
        templateCache[stepId] = adapted;

        console.log(`✅ Template ${stepId} carregado com sucesso via TemplateService`);
        return adapted;

      } catch (err) {
        const error = err as Error;
        console.error(`❌ Erro ao carregar template ${stepId}:`, error);
        setError(error);
        throw error;

      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * 🎯 MIGRADO: Carrega todos os templates via TemplateService
   */
  const loadAllTemplates = useCallback(
    async (): Promise<Record<string, QuizStepV3>> => {
      setIsLoading(true);
      setError(null);

      try {
        const promises = Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const stepNumber = i + 1;
          return loadQuizEstiloTemplate(stepNumber)
            .then(step => [
              `step-${stepNumber.toString().padStart(2, '0')}`,
              step,
            ])
            .catch(err => {
              console.error(`Erro ao carregar step ${stepNumber}:`, err);
              return null;
            });
        });

  const results = await Promise.all(promises);
  const validResults = results.filter(Boolean) as [string, QuizStepV3][];

        const stepsMap = Object.fromEntries(validResults);

        console.log(`✅ Templates carregados via TemplateService: ${Object.keys(stepsMap).length}/${TOTAL_STEPS}`);

        return stepsMap;

      } catch (err) {
        console.error('❌ Erro ao carregar templates:', err);
        setError(err as Error);
        throw err;

      } finally {
        setIsLoading(false);
      }
    },
    [loadQuizEstiloTemplate],
  );

  /**
   * 🎯 NOVO: Prefetch dos próximos steps
   */
  const prefetchNextSteps = useCallback(
    async (currentStep: number, count: number = 2) => {
      const promises = Array.from({ length: count }, (_, i) => {
        const nextStep = currentStep + i + 1;
        if (nextStep <= TOTAL_STEPS) {
          return loadQuizEstiloTemplate(nextStep).catch(() => null);
        }
        return Promise.resolve(null);
      });

      await Promise.all(promises);
    },
    [loadQuizEstiloTemplate],
  );

  /**
   * 🎯 NOVO: Limpa cache de templates
   */
  const clearCache = useCallback(() => {
    Object.keys(templateCache).forEach(key => {
      delete templateCache[key];
    });
    console.log('🗑️ Cache de templates limpo');
  }, []);

  // Carregar metadata de todos os templates
  useEffect(() => {
    // ✅ Guard: só executa se tiver state (dentro do editor)
    if (!state?.stepBlocks) {
      return;
    }

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
      // ✅ Guard: método só funciona dentro do editor
      if (!state?.stepBlocks) {
        console.warn('⚠️ loadTemplate não disponível fora do EditorProvider');
        return null;
      }

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
    [state, stages, cachedTemplates],
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
    [loadTemplate],
  );

  // Obter metadata de um template
  const getTemplateMetadata = useCallback(
    (stageId: string): TemplateMetadata | null => {
      return templatesMetadata[stageId] || null;
    },
    [templatesMetadata],
  );

  return {
    loadTemplate,
    loadTemplateBlocks,
    getTemplateMetadata,
    loadQuizEstiloTemplate, // 🎯 NOVO: Método específico do quiz
    loadAllTemplates, // 🎯 NOVO
    prefetchNextSteps, // 🎯 NOVO
    clearCache, // 🎯 NOVO
    isLoading,
    error,
    templatesMetadata,
    cachedTemplates,
  };
}
