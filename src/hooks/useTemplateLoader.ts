import { useEditor } from '@/hooks/useEditor';
import { Block } from '@/types/editor';
import { useCallback, useEffect, useState } from 'react';
import type { QuizStepV3 } from '@/types/quiz';
import { TemplateService } from '@/services/canonical/TemplateService';
import { QuizStepAdapter } from '@/lib/adapters/QuizStepAdapter';
import { TOTAL_STEPS } from '@/config/stepsConfig';
import { appLogger } from '@/lib/utils/appLogger';

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
  // Removed stepBlocks dependency - não existe em EditorState
  const stages: any[] = [];
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
        appLogger.info(`✅ Template ${stepId} carregado do cache`);
        return templateCache[stepId];
      }

      setIsLoading(true);
      setError(null);

      try {
        // 2. Usar TemplateService canonical
        appLogger.info(`📥 Carregando template via TemplateService: ${stepId}`);
        const templateService = TemplateService.getInstance();
        const result = await templateService.getStep(stepId);

        if (!result.success) {
          throw new Error(`Template ${stepId} não encontrado: ${result.error?.message || 'erro desconhecido'}`);
        }

        // 3. Adaptar blocos para QuizStep
        appLogger.info(`🔄 Adaptando template ${stepId} para QuizStep`);
        const blocks = result.data;
  const adapted = QuizStepAdapter.fromBlocks(blocks, stepId);

        // 4. Salvar no cache
        templateCache[stepId] = adapted;

        appLogger.info(`✅ Template ${stepId} carregado com sucesso via TemplateService`);
        return adapted;

      } catch (err) {
        const error = err as Error;
        appLogger.error(`❌ Erro ao carregar template ${stepId}:`, { data: [error] });
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
              appLogger.error(`Erro ao carregar step ${stepNumber}:`, { data: [err] });
              return null;
            });
        });

  const results = await Promise.all(promises);
  const validResults = results.filter(Boolean) as [string, QuizStepV3][];

        const stepsMap = Object.fromEntries(validResults);

        appLogger.info(`✅ Templates carregados via TemplateService: ${Object.keys(stepsMap).length}/${TOTAL_STEPS}`);

        return stepsMap;

      } catch (err) {
        appLogger.error('❌ Erro ao carregar templates:', { data: [err] });
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
    appLogger.info('🗑️ Cache de templates limpo');
  }, []);

  // Carregar metadata de todos os templates
  useEffect(() => {
    // ✅ Guard: só executa se tiver state (dentro do editor)
    if (!state) {
      return;
    }

    const loadAllMetadata = async () => {
      const metadata: Record<string, TemplateMetadata> = {};

      // Mantido vazio por ora; fonte de verdade via TemplateService/getStep
      // Opcional: preencher metadados sob demanda via TemplateService

      setTemplatesMetadata(metadata);
    };

    loadAllMetadata();
  }, [stages]);

  // Carregar template específico
  const loadTemplate = useCallback(
    async (stageId: string): Promise<StageTemplate | null> => {
      // ✅ Guard: método só funciona dentro do editor
      if (!state) {
        appLogger.warn('⚠️ loadTemplate não disponível fora do EditorProvider');
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Verificar cache primeiro
        if (cachedTemplates[stageId]) {
          return cachedTemplates[stageId];
        }

        // Carregar via TemplateService usando stageId → stepId
        const match = stageId.match(/(\d{1,2})$/) || stageId.match(/step-(\d{2})/);
        if (!match) throw new Error(`Stage ${stageId} inválido (sem step)`);
        const stepNumber = parseInt(match[1], 10);
        const stepId = `step-${String(stepNumber).padStart(2, '0')}`;

        const templateService = TemplateService.getInstance();
        const result = await templateService.getStep(stepId);
        if (!result.success) throw new Error(`Template para ${stageId} não encontrado`);

        // Adaptar para estrutura esperada por quem consome este hook
        const blocks = result.data as Block[];
        const stageTemplate = {
          metadata: { id: stepId, name: `Template ${stepNumber}` },
          blocks,
          version: 'v3.2',
        } as any;

        // Atualizar cache
        setCachedTemplates(prev => ({
          ...prev,
          [stageId]: stageTemplate,
        }));

        return stageTemplate;
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
