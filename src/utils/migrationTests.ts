/**
 * 🧪 MIGRATION TESTS
 * 
 * Testes automatizados para validar migração de steps
 */

import type { QuizStep } from '@/data/quizSteps';
import {
  migrateStepToBlocks,
  validateMigratedStep,
  migrateFunnelSteps,
  generateMigrationReport
} from './migrateStepToBlocks';

/**
 * Dados de teste
 */
const TEST_INTRO_STEP: QuizStep = {
  id: 'intro-1',
  type: 'intro',
  title: '<span style="color: #B89B7A;">Teste</span> de Título',
  image: 'https://example.com/image.jpg',
  formQuestion: 'Qual seu nome?',
  placeholder: 'Digite aqui',
  buttonText: 'Começar'
};

const TEST_QUESTION_STEP: QuizStep = {
  id: 'question-1',
  type: 'question',
  questionNumber: 'Pergunta 1 de 10',
  questionText: 'Qual seu estilo preferido?',
  requiredSelections: 2,
  options: [
    { id: 'opt-1', text: 'Opção 1', image: 'https://example.com/1.jpg' },
    { id: 'opt-2', text: 'Opção 2', image: 'https://example.com/2.jpg' }
  ]
};

const TEST_RESULT_STEP: QuizStep = {
  id: 'result-1',
  type: 'result'
};

/**
 * Teste 1: Migração de IntroStep
 */
export function testIntroStepMigration(): {
  passed: boolean;
  message: string;
} {
  console.log('🧪 Teste 1: Migração de IntroStep');
  
  const migrated = migrateStepToBlocks(TEST_INTRO_STEP);
  
  if (!migrated) {
    return {
      passed: false,
      message: 'Migração retornou null'
    };
  }
  
  const validation = validateMigratedStep(migrated);
  
  if (!validation.valid) {
    return {
      passed: false,
      message: `Validação falhou: ${validation.errors.join(', ')}`
    };
  }
  
  // Verificar blocos esperados
  const expectedBlocks = 7; // Logo, Headline, Image, Text, Form, Button, Footer
  if (migrated.blocks.length !== expectedBlocks) {
    return {
      passed: false,
      message: `Esperado ${expectedBlocks} blocos, encontrado ${migrated.blocks.length}`
    };
  }
  
  // Verificar tipos de blocos
  const types = migrated.blocks.map(b => b.type);
  const expectedTypes = [
    'LogoBlock',
    'HeadlineBlock',
    'ImageBlock',
    'TextBlock',
    'FormInputBlock',
    'ButtonBlock',
    'FooterBlock'
  ];
  
  if (JSON.stringify(types) !== JSON.stringify(expectedTypes)) {
    return {
      passed: false,
      message: `Tipos incorretos: ${types.join(', ')}`
    };
  }
  
  // Verificar dados preservados
  const headlineBlock = migrated.blocks.find(b => b.type === 'HeadlineBlock');
  if (!headlineBlock?.props.html?.includes('Teste')) {
    return {
      passed: false,
      message: 'Título não foi preservado'
    };
  }
  
  return {
    passed: true,
    message: `✅ IntroStep migrado com ${migrated.blocks.length} blocos`
  };
}

/**
 * Teste 2: Migração de QuestionStep
 */
export function testQuestionStepMigration(): {
  passed: boolean;
  message: string;
} {
  console.log('🧪 Teste 2: Migração de QuestionStep');
  
  const migrated = migrateStepToBlocks(TEST_QUESTION_STEP);
  
  if (!migrated) {
    return {
      passed: false,
      message: 'Migração retornou null'
    };
  }
  
  const validation = validateMigratedStep(migrated);
  
  if (!validation.valid) {
    return {
      passed: false,
      message: `Validação falhou: ${validation.errors.join(', ')}`
    };
  }
  
  // Verificar blocos esperados
  const expectedBlocks = 8; // Progress, Number, Text, Instructions, Spacer, Options, Spacer, Button
  if (migrated.blocks.length !== expectedBlocks) {
    return {
      passed: false,
      message: `Esperado ${expectedBlocks} blocos, encontrado ${migrated.blocks.length}`
    };
  }
  
  // Verificar GridOptionsBlock
  const optionsBlock = migrated.blocks.find(b => b.type === 'GridOptionsBlock');
  if (!optionsBlock) {
    return {
      passed: false,
      message: 'GridOptionsBlock não encontrado'
    };
  }
  
  if (optionsBlock.props.maxSelections !== 2) {
    return {
      passed: false,
      message: 'requiredSelections não foi preservado'
    };
  }
  
  if (!Array.isArray(optionsBlock.props.options) || optionsBlock.props.options.length !== 2) {
    return {
      passed: false,
      message: 'Opções não foram preservadas'
    };
  }
  
  return {
    passed: true,
    message: `✅ QuestionStep migrado com ${migrated.blocks.length} blocos`
  };
}

/**
 * Teste 3: Migração de ResultStep
 */
export function testResultStepMigration(): {
  passed: boolean;
  message: string;
} {
  console.log('🧪 Teste 3: Migração de ResultStep');
  
  const migrated = migrateStepToBlocks(TEST_RESULT_STEP);
  
  if (!migrated) {
    return {
      passed: false,
      message: 'Migração retornou null'
    };
  }
  
  const validation = validateMigratedStep(migrated);
  
  if (!validation.valid) {
    return {
      passed: false,
      message: `Validação falhou: ${validation.errors.join(', ')}`
    };
  }
  
  // Verificar blocos mínimos
  if (migrated.blocks.length < 5) {
    return {
      passed: false,
      message: `Esperado pelo menos 5 blocos, encontrado ${migrated.blocks.length}`
    };
  }
  
  return {
    passed: true,
    message: `✅ ResultStep migrado com ${migrated.blocks.length} blocos`
  };
}

/**
 * Teste 4: Migração de funil completo
 */
export function testFunnelMigration(): {
  passed: boolean;
  message: string;
} {
  console.log('🧪 Teste 4: Migração de funil completo');
  
  const testSteps = [TEST_INTRO_STEP, TEST_QUESTION_STEP, TEST_RESULT_STEP];
  const result = migrateFunnelSteps(testSteps);
  
  if (!result.success) {
    return {
      passed: false,
      message: `Migração falhou: ${result.errors.join('; ')}`
    };
  }
  
  if (result.migratedSteps.length !== testSteps.length) {
    return {
      passed: false,
      message: 'Número de steps migrados não corresponde'
    };
  }
  
  const nullSteps = result.migratedSteps.filter(s => s === null).length;
  if (nullSteps > 0) {
    return {
      passed: false,
      message: `${nullSteps} steps falharam na migração`
    };
  }
  
  return {
    passed: true,
    message: `✅ Funil completo migrado (${testSteps.length} steps)`
  };
}

/**
 * Teste 5: Geração de relatório
 */
export function testReportGeneration(): {
  passed: boolean;
  message: string;
} {
  console.log('🧪 Teste 5: Geração de relatório');
  
  const testSteps = [TEST_INTRO_STEP, TEST_QUESTION_STEP, TEST_RESULT_STEP];
  const result = migrateFunnelSteps(testSteps);
  const report = generateMigrationReport(testSteps, result.migratedSteps);
  
  if (!report || report.length === 0) {
    return {
      passed: false,
      message: 'Relatório vazio'
    };
  }
  
  if (!report.includes('RELATÓRIO DE MIGRAÇÃO')) {
    return {
      passed: false,
      message: 'Relatório com formato inválido'
    };
  }
  
  if (!report.includes('Total de steps:')) {
    return {
      passed: false,
      message: 'Relatório sem resumo'
    };
  }
  
  return {
    passed: true,
    message: `✅ Relatório gerado (${report.length} caracteres)`
  };
}

/**
 * Executar todos os testes
 */
export function runAllMigrationTests(): {
  passed: number;
  failed: number;
  results: Array<{ test: string; passed: boolean; message: string }>;
} {
  console.log('\n🧪 ========== TESTES DE MIGRAÇÃO ==========\n');
  
  const tests = [
    { name: 'IntroStep Migration', fn: testIntroStepMigration },
    { name: 'QuestionStep Migration', fn: testQuestionStepMigration },
    { name: 'ResultStep Migration', fn: testResultStepMigration },
    { name: 'Funnel Migration', fn: testFunnelMigration },
    { name: 'Report Generation', fn: testReportGeneration }
  ];
  
  const results = tests.map(test => {
    const result = test.fn();
    console.log(`${result.passed ? '✅' : '❌'} ${test.name}: ${result.message}`);
    return {
      test: test.name,
      ...result
    };
  });
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 RESULTADO: ${passed}/${results.length} testes passaram`);
  console.log(`✅ Sucesso: ${passed}`);
  console.log(`❌ Falhas: ${failed}`);
  console.log('='.repeat(50) + '\n');
  
  return {
    passed,
    failed,
    results
  };
}

/**
 * Expor testes no console global
 */
if (typeof window !== 'undefined') {
  (window as any).__MIGRATION_TESTS__ = {
    runAll: runAllMigrationTests,
    testIntro: testIntroStepMigration,
    testQuestion: testQuestionStepMigration,
    testResult: testResultStepMigration,
    testFunnel: testFunnelMigration,
    testReport: testReportGeneration
  };
  
  console.log('🧪 Testes de migração disponíveis:');
  console.log('window.__MIGRATION_TESTS__.runAll() - Executar todos os testes');
  console.log('window.__MIGRATION_TESTS__.testIntro() - Testar IntroStep');
  console.log('window.__MIGRATION_TESTS__.testQuestion() - Testar QuestionStep');
  console.log('window.__MIGRATION_TESTS__.testResult() - Testar ResultStep');
}
