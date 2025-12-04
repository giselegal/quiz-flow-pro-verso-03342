/**
 * 🎯 HOOK PARA CARREGAR QUIZ V4
 * 
 * Carrega e valida quiz21-v4.json com Zod schemas
 * Substitui carregamento direto de v3
 * 
 * FASE 4: Integração E2E
 */

import { useState, useEffect, useCallback } from 'react';
import { QuizSchemaZ, validateQuizSchema, type QuizSchema, type QuizStep } from '@/schemas/quiz-schema.zod';
import { appLogger } from '@/lib/utils/appLogger';

interface UseQuizV4LoaderOptions {
  templatePath?: string;
  autoLoad?: boolean;
}

interface UseQuizV4LoaderResult {
  // Estado
  quiz: QuizSchema | null;
  steps: QuizStep[];
  currentStep: QuizStep | null;
  isLoading: boolean;
  isValid: boolean;
  error: Error | null;
  
  // Métodos
  loadQuiz: () => Promise<void>;
  getStep: (stepId: string) => QuizStep | undefined;
  getStepByOrder: (order: number) => QuizStep | undefined;
  validateSchema: () => boolean;
  reloadQuiz: () => Promise<void>;
}

// Path canônico para template V4
const DEFAULT_TEMPLATE_PATH = '/templates/quiz21-v4.json';

export function useQuizV4Loader(options: UseQuizV4LoaderOptions = {}): UseQuizV4LoaderResult {
  const {
    templatePath = DEFAULT_TEMPLATE_PATH,
    autoLoad = true,
  } = options;

  const [quiz, setQuiz] = useState<QuizSchema | null>(null);
  const [steps, setSteps] = useState<QuizStep[]>([]);
  const [currentStep, setCurrentStep] = useState<QuizStep | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Carrega e valida o quiz v4
   */
  const loadQuiz = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      appLogger.info('🔄 Carregando quiz v4...', { data: [templatePath] });

      // Fetch do JSON (usar fetch direto para evitar 'Illegal invocation')
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Falha ao carregar ${templatePath}: ${response.status}`);
      }

      const data = await response.json();

      // Validação com Zod
      const validationResult = validateQuizSchema(data);

      if (!validationResult.success) {
        appLogger.error('❌ Validação Zod falhou:', { 
          data: [validationResult.errors.errors] 
        });
        throw new Error(
          `Schema validation failed: ${validationResult.errors.errors
            .map(e => `${e.path.join('.')}: ${e.message}`)
            .join('; ')}`
        );
      }

      const validatedQuiz = validationResult.data;
      
      appLogger.info('✅ Quiz v4 carregado e validado', {
        data: [
          `Version: ${validatedQuiz.version}`,
          `Steps: ${validatedQuiz.steps.length}`,
          `Blocks: ${validatedQuiz.steps.reduce((sum, s) => sum + s.blocks.length, 0)}`,
        ],
      });

      // Atualizar estado
      setQuiz(validatedQuiz);
      setSteps(validatedQuiz.steps);
      setCurrentStep(validatedQuiz.steps[0] || null);
      setIsValid(true);
      setError(null);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      appLogger.error('❌ Erro ao carregar quiz v4:', { data: [errorMessage] });
      
      setError(err instanceof Error ? err : new Error(errorMessage));
      setQuiz(null);
      setSteps([]);
      setCurrentStep(null);
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  }, [templatePath]);

  /**
   * Busca step por ID
   */
  const getStep = useCallback((stepId: string): QuizStep | undefined => {
    return steps.find(s => s.id === stepId);
  }, [steps]);

  /**
   * Busca step por ordem (1-based)
   */
  const getStepByOrder = useCallback((order: number): QuizStep | undefined => {
    return steps.find(s => s.order === order);
  }, [steps]);

  /**
   * Valida schema atual
   */
  const validateSchema = useCallback((): boolean => {
    if (!quiz) return false;
    
    const result = validateQuizSchema(quiz);
    return result.success;
  }, [quiz]);

  /**
   * Recarrega o quiz
   */
  const reloadQuiz = useCallback(async () => {
    await loadQuiz();
  }, [loadQuiz]);

  /**
   * Auto-carregamento
   */
  useEffect(() => {
    if (autoLoad && !quiz && !isLoading) {
      loadQuiz();
    }
  }, [autoLoad, quiz, isLoading, loadQuiz]);

  return {
    // Estado
    quiz,
    steps,
    currentStep,
    isLoading,
    isValid,
    error,
    
    // Métodos
    loadQuiz,
    getStep,
    getStepByOrder,
    validateSchema,
    reloadQuiz,
  };
}
