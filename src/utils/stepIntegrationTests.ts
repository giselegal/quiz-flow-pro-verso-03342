/**
 * 🧪 TESTES DE INTEGRAÇÃO - Validação de Steps
 * 
 * Valida que cada tipo de step tem dados corretos após adaptação.
 * Executa automaticamente em dev mode para detectar problemas.
 */

import { EditableQuizStep, StepType } from '@/components/editor/quiz/types';
import { adaptStepData } from './StepDataAdapter';
import { QUIZ_STEPS } from '@/data/quizSteps';

interface TestResult {
  stepId: string;
  stepType: StepType;
  passed: boolean;
  errors: string[];
  warnings: string[];
  data?: any;
}

/**
 * Testa um step individual
 */
export function testSingleStep(stepId: string): TestResult {
  const result: TestResult = {
    stepId,
    stepType: 'intro',
    passed: true,
    errors: [],
    warnings: [],
  };

  // Buscar dados de produção
  const productionData = QUIZ_STEPS[stepId];
  if (!productionData) {
    result.errors.push(`Step ${stepId} não encontrado em QUIZ_STEPS`);
    result.passed = false;
    return result;
  }

  result.stepType = productionData.type;

  // Criar EditableQuizStep mock
  const editableStep: EditableQuizStep = {
    id: stepId,
    type: productionData.type,
    order: parseInt(stepId.replace('step-', '')),
    blocks: [],
    metadata: productionData,
  };

  // Adaptar dados
  try {
    const adapted = adaptStepData(editableStep);
    result.data = adapted;

    // Validações por tipo
    switch (productionData.type) {
      case 'intro':
        if (!adapted.formQuestion) {
          result.errors.push('IntroStep: formQuestion ausente');
          result.passed = false;
        }
        if (!adapted.buttonText) {
          result.errors.push('IntroStep: buttonText ausente');
          result.passed = false;
        }
        if (!adapted.title) {
          result.warnings.push('IntroStep: title ausente (usando default)');
        }
        break;

      case 'question':
        if (!adapted.questionText) {
          result.errors.push('QuestionStep: questionText ausente');
          result.passed = false;
        }
        if (!adapted.options || adapted.options.length === 0) {
          result.errors.push('QuestionStep: options vazio');
          result.passed = false;
        }
        if (!adapted.requiredSelections || adapted.requiredSelections < 1) {
          result.errors.push('QuestionStep: requiredSelections inválido');
          result.passed = false;
        }
        const optionsLength = adapted.options?.length || 0;
        if (adapted.requiredSelections && adapted.requiredSelections > optionsLength) {
          result.warnings.push(
            `QuestionStep: requiredSelections (${adapted.requiredSelections}) > options (${optionsLength})`
          );
        }
        break;

      case 'strategic-question':
        if (!adapted.questionText) {
          result.errors.push('StrategicQuestionStep: questionText ausente');
          result.passed = false;
        }
        if (!adapted.options || adapted.options.length === 0) {
          result.errors.push('StrategicQuestionStep: options vazio');
          result.passed = false;
        }
        if (adapted.requiredSelections && adapted.requiredSelections !== 1) {
          result.warnings.push(
            `StrategicQuestionStep: requiredSelections deveria ser 1, mas é ${adapted.requiredSelections}`
          );
        }
        break;

      case 'transition':
      case 'transition-result':
        if (!adapted.title && !adapted.text) {
          result.errors.push('TransitionStep: title e text ausentes');
          result.passed = false;
        }
        if (!adapted.duration) {
          result.warnings.push('TransitionStep: duration ausente (usando default)');
        }
        break;

      case 'result':
        if (!adapted.title) {
          result.errors.push('ResultStep: title ausente');
          result.passed = false;
        }
        break;

      case 'offer':
        if (!adapted.buttonText) {
          result.errors.push('OfferStep: buttonText ausente');
          result.passed = false;
        }
        if (!adapted.offerMap || Object.keys(adapted.offerMap).length === 0) {
          result.warnings.push('OfferStep: offerMap vazio');
        }
        break;
    }
  } catch (error) {
    result.errors.push(`Erro ao adaptar dados: ${error}`);
    result.passed = false;
  }

  return result;
}

/**
 * Testa todos os 21 steps
 */
export function testAllSteps(): Record<string, TestResult> {
  const results: Record<string, TestResult> = {};

  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    results[stepId] = testSingleStep(stepId);
  }

  return results;
}

/**
 * Gera relatório de testes
 */
export function generateTestReport(results: Record<string, TestResult>): string {
  const lines: string[] = [];
  lines.push('🧪 RELATÓRIO DE TESTES - STEPS');
  lines.push('='.repeat(60));
  lines.push('');

  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;

  // Agrupar por tipo
  const byType: Record<StepType, TestResult[]> = {
    intro: [],
    question: [],
    'strategic-question': [],
    transition: [],
    'transition-result': [],
    result: [],
    offer: [],
  };

  for (const [stepId, result] of Object.entries(results)) {
    byType[result.stepType].push(result);
    if (result.passed) totalPassed++;
    else totalFailed++;
    totalWarnings += result.warnings.length;
  }

  // Sumário
  lines.push('📊 SUMÁRIO');
  lines.push(`  ✅ Passou: ${totalPassed}`);
  lines.push(`  ❌ Falhou: ${totalFailed}`);
  lines.push(`  ⚠️  Avisos: ${totalWarnings}`);
  lines.push('');

  // Detalhes por tipo
  for (const [type, tests] of Object.entries(byType)) {
    if (tests.length === 0) continue;

    lines.push(`\n📦 ${type.toUpperCase()}`);
    lines.push('-'.repeat(60));

    for (const test of tests) {
      const icon = test.passed ? '✅' : '❌';
      lines.push(`  ${icon} ${test.stepId}`);

      if (test.errors.length > 0) {
        test.errors.forEach((err) => lines.push(`     ❌ ${err}`));
      }

      if (test.warnings.length > 0) {
        test.warnings.forEach((warn) => lines.push(`     ⚠️  ${warn}`));
      }
    }
  }

  lines.push('');
  lines.push('='.repeat(60));
  lines.push(
    `Resultado: ${totalFailed === 0 ? '✅ TODOS OS TESTES PASSARAM' : '❌ TESTES FALHARAM'}`
  );

  return lines.join('\n');
}

/**
 * Executa testes e loga resultado
 */
export function runStepTests(): boolean {
  console.log('🧪 Iniciando testes de integração de steps...');

  const results = testAllSteps();
  const report = generateTestReport(results);

  console.log(report);

  const allPassed = Object.values(results).every((r) => r.passed);
  return allPassed;
}

/**
 * Teste rápido para debug
 */
export function quickTest(stepId: string): void {
  console.log(`🔍 Teste rápido: ${stepId}`);
  const result = testSingleStep(stepId);

  console.log(`Tipo: ${result.stepType}`);
  console.log(`Status: ${result.passed ? '✅ PASSOU' : '❌ FALHOU'}`);

  if (result.errors.length > 0) {
    console.log('Erros:', result.errors);
  }

  if (result.warnings.length > 0) {
    console.log('Avisos:', result.warnings);
  }

  console.log('Dados adaptados:', result.data);
}

// Auto-run em dev mode
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Expor no window para debug
  (window as any).__STEP_TESTS__ = {
    runAll: runStepTests,
    testOne: quickTest,
    testAllSteps,
    generateReport: (results: Record<string, TestResult>) => console.log(generateTestReport(results)),
  };

  console.log('🧪 Testes de step disponíveis via window.__STEP_TESTS__');
  console.log('   - window.__STEP_TESTS__.runAll()');
  console.log('   - window.__STEP_TESTS__.testOne("step-01")');
}
