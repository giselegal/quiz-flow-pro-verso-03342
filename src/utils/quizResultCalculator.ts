// Calculador robusto de resultados do quiz
import { StorageService } from '@/services/core/StorageService';
import { ResultEngine, type QuizResultPayload } from '@/services/core/ResultEngine';

export interface QuizCalculationResult {
  payload: QuizResultPayload;
  total: number;
  hasValidData: boolean;
  errors: string[];
}

export const calculateAndSaveQuizResult = (): QuizCalculationResult => {
  const errors: string[] = [];
  
  try {
    // Fase 1: Coletar dados de forma robusta
    const userSelections = StorageService.safeGetJSON<Record<string, string[]>>('userSelections') || {};
    const quizAnswers = StorageService.safeGetJSON<any[]>('quizAnswers') || [];
    const userName = StorageService.safeGetString('userName') || 
                    StorageService.safeGetString('quizUserName') || '';

    // Verificar se há dados suficientes
    const hasSelections = Object.keys(userSelections).length > 0;
    const hasAnswers = quizAnswers.length > 0;
    
    if (!hasSelections && !hasAnswers) {
      errors.push('Nenhuma resposta encontrada no storage');
      return {
        payload: createFallbackPayload(userName),
        total: 0,
        hasValidData: false,
        errors
      };
    }

    // Fase 2: Calcular resultado usando ResultEngine
    const { scores, total } = ResultEngine.computeScoresFromSelections(userSelections);
    
    if (total === 0) {
      errors.push('Nenhuma pontuação calculada');
      return {
        payload: createFallbackPayload(userName),
        total: 0,
        hasValidData: false,
        errors
      };
    }

    // Fase 3: Criar payload e persistir
    const payload = ResultEngine.toPayload(scores, total, userName);
    const success = ResultEngine.persist(payload);
    
    if (!success) {
      errors.push('Falha ao persistir resultado');
    }

    return {
      payload,
      total,
      hasValidData: true,
      errors
    };

  } catch (error) {
    console.error('[QuizResultCalculator] Erro no cálculo:', error);
    errors.push(error instanceof Error ? error.message : 'Erro desconhecido');
    
    return {
      payload: createFallbackPayload(''),
      total: 0,
      hasValidData: false,
      errors
    };
  }
};

// Payload padrão quando não há dados suficientes
const createFallbackPayload = (userName?: string): QuizResultPayload => {
  return {
    version: 'v1',
    primaryStyle: {
      style: 'Natural',
      category: 'Natural',
      score: 1,
      percentage: 100
    },
    secondaryStyles: [],
    scores: { Natural: 1 },
    totalQuestions: 1,
    userData: { name: userName }
  };
};

// Validar se há dados suficientes para cálculo
export const validateQuizData = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  const userSelections = StorageService.safeGetJSON<Record<string, string[]>>('userSelections') || {};
  const quizAnswers = StorageService.safeGetJSON<any[]>('quizAnswers') || [];
  
  const selectionCount = Object.keys(userSelections).length;
  const answerCount = quizAnswers.length;
  
  if (selectionCount === 0 && answerCount === 0) {
    errors.push('Nenhuma resposta foi registrada');
  }
  
  if (selectionCount < 5) {
    errors.push(`Apenas ${selectionCount} perguntas respondidas (mínimo 5)`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Recalcular resultado forçadamente
export const recalculateQuizResult = (): boolean => {
  try {
    const result = calculateAndSaveQuizResult();
    if (result.hasValidData) {
      // Disparar evento para atualizar UI
      try {
        window.dispatchEvent(new Event('quiz-result-updated'));
        window.dispatchEvent(new Event('quiz-result-refresh'));
      } catch {}
      return true;
    }
    return false;
  } catch {
    return false;
  }
};