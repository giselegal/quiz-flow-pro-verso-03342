/**
 * 🧪 SISTEMA DE VALIDAÇÃO E COMPARAÇÃO
 *
 * Testa compatibilidade entre sistema Supabase e sistema CORE
 * Garante que a migração não introduza regressões
 */

import { useSupabaseCompatibleQuiz } from '@/adapters/SupabaseToUnifiedAdapter';

export interface ValidationResult {
  testName: string;
  passed: boolean;
  expectedValue: any;
  actualValue: any;
  difference?: string | undefined;
  timestamp: string;
}

export interface ValidationReport {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  compatibilityScore: number;
  results: ValidationResult[];
  summary: string;
}

/**
 * 🔍 Hook para validação em tempo real
 */
export const useSystemValidation = () => {
  const runValidationSuite = async (): Promise<ValidationReport> => {
    const results: ValidationResult[] = [];
    const timestamp = new Date().toISOString();

    try {
      // Test 1: Inicialização do sistema
      const initTest = await validateInitialization();
      results.push({
        testName: 'system_initialization',
        passed: initTest.success,
        expectedValue: 'clean_state',
        actualValue: initTest.state,
        timestamp,
      });

      // Test 2: Navegação entre etapas
      const navTest = await validateNavigation();
      results.push({
        testName: 'step_navigation',
        passed: navTest.success,
        expectedValue: navTest.expected,
        actualValue: navTest.actual,
        difference: navTest.difference || undefined,
        timestamp,
      });

      // Test 3: Cálculo de estilos
      const calcTest = await validateStyleCalculation();
      results.push({
        testName: 'style_calculation',
        passed: calcTest.success,
        expectedValue: calcTest.expected,
        actualValue: calcTest.actual,
        timestamp,
      });

      // Test 4: Persistência de dados
      const persistTest = await validateDataPersistence();
      results.push({
        testName: 'data_persistence',
        passed: persistTest.success,
        expectedValue: persistTest.expected,
        actualValue: persistTest.actual,
        timestamp,
      });

      // Test 5: Resultado final
      const resultTest = await validateFinalResult();
      results.push({
        testName: 'final_result',
        passed: resultTest.success,
        expectedValue: resultTest.expected,
        actualValue: resultTest.actual,
        timestamp,
      });
    } catch (error) {
      results.push({
        testName: 'validation_error',
        passed: false,
        expectedValue: 'no_errors',
        actualValue: error,
        timestamp,
      });
    }

    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const compatibilityScore = (passedTests / totalTests) * 100;

    const report: ValidationReport = {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      compatibilityScore,
      results,
      summary: generateSummary(compatibilityScore, results),
    };

    // Log do relatório
    console.log('📊 Validation Report Generated:', {
      compatibilityScore,
      totalTests,
      passedTests,
      timestamp,
    });

    return report;
  };

  return { runValidationSuite };
};

/**
 * 🧪 Testes específicos
 */

const validateInitialization = async () => {
  try {
    const unifiedQuiz = useSupabaseCompatibleQuiz();

    return {
      success:
        unifiedQuiz.session.currentStep === 1 &&
        unifiedQuiz.session.progress === 0 &&
        !unifiedQuiz.session.isCompleted,
      state: {
        currentStep: unifiedQuiz.session.currentStep,
        progress: unifiedQuiz.session.progress,
        isCompleted: unifiedQuiz.session.isCompleted,
      },
    };
  } catch (error) {
    return {
      success: false,
      state: `error: ${error}`,
    };
  }
};

const validateNavigation = async () => {
  try {
    const unifiedQuiz = useSupabaseCompatibleQuiz();
    const initialStep = unifiedQuiz.session.currentStep;

    // Tentar navegar para próxima etapa
    unifiedQuiz.actions.navigateToStep(initialStep + 1);

    const newStep = unifiedQuiz.session.currentStep;
    const expected = initialStep + 1;

    return {
      success: newStep === expected,
      expected,
      actual: newStep,
      difference: newStep !== expected ? `Expected ${expected}, got ${newStep}` : null,
    };
  } catch (error) {
    return {
      success: false,
      expected: 'successful_navigation',
      actual: `error: ${error}`,
      difference: 'Navigation failed with error',
    };
  }
};

const validateStyleCalculation = async () => {
  try {
    const unifiedQuiz = useSupabaseCompatibleQuiz();

    // Simular algumas respostas
    unifiedQuiz.actions.submitAnswer('q1', { styleA: 3, styleB: 1 });
    unifiedQuiz.actions.submitAnswer('q2', { styleA: 2, styleB: 4 });

    const styles = unifiedQuiz.session.styleScores;
    const hasValidStyles = Object.keys(styles).length > 0;

    return {
      success: hasValidStyles,
      expected: 'valid_style_scores',
      actual: styles,
    };
  } catch (error) {
    return {
      success: false,
      expected: 'valid_style_scores',
      actual: `error: ${error}`,
    };
  }
};

const validateDataPersistence = async () => {
  try {
    const unifiedQuiz = useSupabaseCompatibleQuiz();

    // Submeter resposta
    unifiedQuiz.actions.submitAnswer('test_q', { value: 'test_answer' });

    // Verificar se foi salva
    const savedAnswer = unifiedQuiz.session.responses['test_q'];

    return {
      success: savedAnswer?.value === 'test_answer',
      expected: { value: 'test_answer' },
      actual: savedAnswer,
    };
  } catch (error) {
    return {
      success: false,
      expected: 'data_persisted',
      actual: `error: ${error}`,
    };
  }
};

const validateFinalResult = async () => {
  try {
    const unifiedQuiz = useSupabaseCompatibleQuiz();

    // Completar quiz
    unifiedQuiz.actions.calculateResult();

    const result = unifiedQuiz.session.result;
    const hasValidResult = result && typeof result === 'object';

    return {
      success: hasValidResult,
      expected: 'valid_result_object',
      actual: result,
    };
  } catch (error) {
    return {
      success: false,
      expected: 'valid_result_object',
      actual: `error: ${error}`,
    };
  }
};

/**
 * 📊 Geração de relatório
 */
const generateSummary = (score: number, _results: ValidationResult[]): string => {
  if (score >= 95) {
    return `🟢 EXCELENTE: Sistema 100% compatível (${score.toFixed(1)}%)`;
  } else if (score >= 80) {
    return `🟡 BOM: Sistema compatível com pequenos ajustes necessários (${score.toFixed(1)}%)`;
  } else if (score >= 60) {
    return `🟠 ATENÇÃO: Sistema parcialmente compatível, revisão necessária (${score.toFixed(1)}%)`;
  } else {
    return `🔴 CRÍTICO: Sistema incompatível, migração precisa de correções (${score.toFixed(1)}%)`;
  }
};

/**
 * 🎯 Comparador direto entre sistemas
 */
export const compareSystemsBehavior = async (
  testScenarios: Array<{
    name: string;
    actions: () => Promise<any>;
  }>
) => {
  const comparisons = [];

  for (const scenario of testScenarios) {
    try {
      const unifiedResult = await scenario.actions();

      comparisons.push({
        scenario: scenario.name,
        unifiedResult,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      comparisons.push({
        scenario: scenario.name,
        error: String(error),
        timestamp: new Date().toISOString(),
      });
    }
  }

  return comparisons;
};

export default useSystemValidation;
