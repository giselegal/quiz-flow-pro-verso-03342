import { getStepTemplate } from '@/config/templates/templates';
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import { Block } from '@/types/editor';
import { useCallback, useEffect, useState } from 'react';
import type { QuizStep } from '@/data/quizSteps';
import { QUIZ_STEPS } from '@/data/quizSteps';
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
  [key: string]: QuizStep;
}

const templateCache: TemplateCache = {};

interface UseTemplateLoaderResult {
  // Template Loading
  loadTemplate: (stageId: string) => Promise<StageTemplate | null>;
  loadTemplateBlocks: (stageId: string) => Promise<Block[]>;
  getTemplateMetadata: (stageId: string) => TemplateMetadata | null;
  loadQuizEstiloTemplate: (stepNumber: number) => Promise<QuizStep>; // 🎯 ATUALIZADO

  // 🎯 NOVOS métodos para JSON templates
  loadAllTemplates: () => Promise<Record<string, QuizStep>>;
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
   * 🎯 NOVO: Carrega template JSON do step específico
   */
  const loadQuizEstiloTemplate = useCallback(
    async (stepNumber: number): Promise<QuizStep> => {
      const stepId = `step-${stepNumber.toString().padStart(2, '0')}`;

      // 1. Verificar cache
      if (templateCache[stepId]) {
        console.log(`✅ Template ${stepId} carregado do cache`);
        return templateCache[stepId];
      }

      setIsLoading(true);
      setError(null);

      try {
        // 2. Tentar carregar JSON (priorizar canônico step-XX.json, depois fallback -v3)
        console.log(`📥 Carregando template JSON: ${stepId}`);

        let jsonTemplate: any | null = null;

        try {
          // Preferir v3 como fonte de verdade
          const jsonModuleV3 = await import(
            /* @vite-ignore */
            `/templates/${stepId}-v3.json`
          );
          jsonTemplate = (jsonModuleV3 as any).default || jsonModuleV3;
          console.log(`✅ Template ${stepId}-v3.json carregado`);
        } catch (errV3) {
          console.warn(`⚠️ Falha ao carregar ${stepId}-v3.json, tentando canônico .json...`, errV3);
          const jsonModuleCanonical = await import(
            /* @vite-ignore */
            `/templates/${stepId}.json`
          );
          jsonTemplate = (jsonModuleCanonical as any).default || jsonModuleCanonical;
          console.log(`✅ Template ${stepId}.json carregado (fallback)`);
        }

        // 3. Adaptar para QuizStep
        console.log(`🔄 Adaptando template ${stepId} de JSON para QuizStep`);
        const adapted = QuizStepAdapter.fromJSON(jsonTemplate);

        // 4. Salvar no cache
        templateCache[stepId] = adapted;

        console.log(`✅ Template ${stepId} carregado com sucesso do JSON`);
        return adapted;

      } catch (err) {
        console.warn(
          `⚠️ Erro ao carregar template JSON ${stepId}, usando fallback QUIZ_STEPS`,
          err,
        );

        // 5. Fallback para QUIZ_STEPS
        const fallbackStep = QUIZ_STEPS[stepId];

        if (!fallbackStep) {
          const error = new Error(`Step ${stepId} não encontrado em nenhum template`);
          setError(error);
          throw error;
        }

        // Salvar fallback no cache
        templateCache[stepId] = fallbackStep;

        return fallbackStep;

      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * 🎯 NOVO: Carrega todos os templates de uma vez (prefetch)
   */
  const loadAllTemplates = useCallback(
    async (): Promise<Record<string, QuizStep>> => {
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
        const validResults = results.filter(Boolean) as [string, QuizStep][];

        const stepsMap = Object.fromEntries(validResults);

        console.log(`✅ Templates carregados: ${Object.keys(stepsMap).length}/${TOTAL_STEPS}`);

        return stepsMap;

      } catch (err) {
        console.error('❌ Erro ao carregar templates:', err);
        setError(err as Error);

        // Fallback completo para QUIZ_STEPS
        return QUIZ_STEPS;

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
