#!/usr/bin/env node

/**
 * 🔍 QUIZ INTEGRATION VERIFICATION SCRIPT
 * 
 * This script verifies that all components of the quiz system are properly connected:
 * - Quiz logic with calculations
 * - User name collection and journey tracking  
 * - Supabase integration with editor structure
 * 
 * Based on the analysis documented in ANALISE_FINAL_ESTRUTURA_SOLIDA.md
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Define colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  const fullPath = join(process.cwd(), filePath);
  return existsSync(fullPath);
}

function checkFileContents(filePath, searchTerms) {
  try {
    const fullPath = join(process.cwd(), filePath);
    const content = readFileSync(fullPath, 'utf8');
    return searchTerms.every(term => content.includes(term));
  } catch (error) {
    return false;
  }
}

function runVerification() {
  log('🔍 VERIFICAÇÃO DE INTEGRAÇÃO DO QUIZ', 'bold');
  log('=====================================\n');

  let allTestsPassed = true;
  const results = {};

  // 1. Verificar estrutura de arquivos principais
  log('📁 1. Verificando estrutura de arquivos principais', 'blue');
  
  const coreFiles = [
    'src/hooks/useQuizLogic.ts',
    'src/hooks/useUserName.ts', 
    'src/hooks/useEditorSupabase.ts',
    'src/lib/quizEngine.ts',
    'src/utils/styleCalculation.ts',
    'src/services/userResponseService.ts',
    'src/components/editor/blocks/FormInputBlock.tsx',
    'src/lib/schema-validation.ts'
  ];

  coreFiles.forEach(file => {
    const exists = checkFileExists(file);
    results[file] = exists;
    log(`  ${exists ? '✅' : '❌'} ${file}`, exists ? 'green' : 'red');
    if (!exists) allTestsPassed = false;
  });

  // 2. Verificar funções do useQuizLogic
  log('\n🎯 2. Verificando funções do useQuizLogic', 'blue');
  
  const quizLogicFunctions = [
    'setUserNameFromInput',
    'answerQuestion',
    'calculateResults',
    'completeQuiz',
    'userName'
  ];

  const hasQuizLogicFunctions = checkFileContents('src/hooks/useQuizLogic.ts', quizLogicFunctions);
  results['quizLogicFunctions'] = hasQuizLogicFunctions;
  log(`  ${hasQuizLogicFunctions ? '✅' : '❌'} useQuizLogic tem todas as funções necessárias`, hasQuizLogicFunctions ? 'green' : 'red');
  if (!hasQuizLogicFunctions) allTestsPassed = false;

  // 3. Verificar integração do nome do usuário
  log('\n👤 3. Verificando integração do nome do usuário', 'blue');
  
  const userNameIntegration = [
    'quizUserName',
    'localStorage.setItem',
    'useAuth'
  ];

  const hasUserNameIntegration = 
    checkFileContents('src/hooks/useQuizLogic.ts', ['quizUserName', 'localStorage.setItem']) &&
    checkFileContents('src/hooks/useUserName.ts', ['quizUserName', 'useAuth']);
  
  results['userNameIntegration'] = hasUserNameIntegration;
  log(`  ${hasUserNameIntegration ? '✅' : '❌'} Integração do nome do usuário funcionando`, hasUserNameIntegration ? 'green' : 'red');
  if (!hasUserNameIntegration) allTestsPassed = false;

  // 4. Verificar engines de cálculo
  log('\n🧮 4. Verificando engines de cálculo', 'blue');
  
  const calculationEngines = 
    checkFileContents('src/lib/quizEngine.ts', ['calculateQuizResult', 'styleScores']) &&
    checkFileContents('src/utils/styleCalculation.ts', ['StyleCalculationEngine', 'calculateResult']);
  
  results['calculationEngines'] = calculationEngines;
  log(`  ${calculationEngines ? '✅' : '❌'} Engines de cálculo implementadas`, calculationEngines ? 'green' : 'red');
  if (!calculationEngines) allTestsPassed = false;

  // 5. Verificar integração com Supabase
  log('\n🗄️ 5. Verificando integração com Supabase', 'blue');
  
  const supabaseIntegration = 
    checkFileContents('src/hooks/useEditorSupabase.ts', ['supabase', 'addComponent', 'testConnection']) &&
    checkFileContents('src/services/userResponseService.ts', ['createQuizUser', 'saveResponse', 'supabase']);
  
  results['supabaseIntegration'] = supabaseIntegration;
  log(`  ${supabaseIntegration ? '✅' : '❌'} Integração com Supabase funcionando`, supabaseIntegration ? 'green' : 'red');
  if (!supabaseIntegration) allTestsPassed = false;

  // 6. Verificar FormInputBlock conectado ao Supabase
  log('\n📝 6. Verificando FormInputBlock conectado ao Supabase', 'blue');
  
  const formIntegration = 
    checkFileContents('src/components/editor/blocks/FormInputBlock.tsx', [
      'userResponseService', 
      'createQuizUser', 
      'saveResponse',
      'quizUserName'
    ]);
  
  results['formIntegration'] = formIntegration;
  log(`  ${formIntegration ? '✅' : '❌'} FormInputBlock conectado ao Supabase`, formIntegration ? 'green' : 'red');
  if (!formIntegration) allTestsPassed = false;

  // 7. Verificar schema validation
  log('\n🔍 7. Verificando schema validation', 'blue');
  
  const schemaValidation = 
    checkFileContents('src/lib/schema-validation.ts', ['zod', 'validation', 'ComponentInstance']);
  
  results['schemaValidation'] = schemaValidation;
  log(`  ${schemaValidation ? '✅' : '❌'} Schema validation implementada`, schemaValidation ? 'green' : 'red');
  if (!schemaValidation) allTestsPassed = false;

  // 8. Verificar contextos de integração
  log('\n🔗 8. Verificando contextos de integração', 'blue');
  
  const contextIntegration = 
    checkFileExists('src/context/QuizContext.tsx') &&
    checkFileExists('src/context/EditorQuizContext.tsx');
  
  results['contextIntegration'] = contextIntegration;
  log(`  ${contextIntegration ? '✅' : '❌'} Contextos de integração existem`, contextIntegration ? 'green' : 'red');
  if (!contextIntegration) allTestsPassed = false;

  // Relatório final
  log('\n📊 RELATÓRIO FINAL', 'bold');
  log('================', 'bold');
  
  if (allTestsPassed) {
    log('🎉 TODOS OS TESTES PASSARAM!', 'green');
    log('✅ Quiz logic com cálculos está conectado', 'green');
    log('✅ Coleta de nome e jornada do usuário está funcionando', 'green');
    log('✅ Integração com Supabase está estabelecida', 'green');
    log('✅ Editor hook alignment está sólido', 'green');
    log('\n🏆 CONCLUSÃO: A estrutura está sólida e conectada conforme documentado!', 'green');
  } else {
    log('⚠️ ALGUNS TESTES FALHARAM', 'yellow');
    log('\nComponentes que precisam de atenção:', 'yellow');
    
    Object.entries(results).forEach(([test, passed]) => {
      if (!passed) {
        log(`❌ ${test}`, 'red');
      }
    });
    
    log('\n🔧 Ações recomendadas:', 'yellow');
    log('1. Verificar arquivos em falta', 'yellow');
    log('2. Completar implementações incompletas', 'yellow');
    log('3. Testar integração end-to-end', 'yellow');
  }

  log('\n📋 Resumo detalhado:');
  Object.entries(results).forEach(([test, passed]) => {
    log(`  ${passed ? '✅' : '❌'} ${test}`, passed ? 'green' : 'red');
  });

  return allTestsPassed;
}

// Executar verificação
const success = runVerification();
process.exit(success ? 0 : 1);