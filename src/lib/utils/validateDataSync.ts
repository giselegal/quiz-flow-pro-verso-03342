/**
 * 🔍 VALIDADOR DE SINCRONIZAÇÃO DE DADOS
 * Verifica se stepTemplatesMapping.ts está sincronizado com quiz21StepsComplete.ts
 * 
 * ⚠️ DEPRECATED: Este validador usa imports diretos do .ts que devem ser migrados
 * para HierarchicalTemplateSource
 */

import { STEP_TEMPLATES_MAPPING } from '@/config/stepTemplatesMapping';
import { appLogger } from '@/lib/utils/appLogger';
// ✅ CORREÇÃO: Comentado import direto - validação deve ser refatorada para usar HierarchicalTemplateSource
// import { QUIZ_QUESTIONS_COMPLETE } from '@/templates/quiz21StepsComplete';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  details: {
    totalStepsInQuiz: number;
    totalStepsInMapping: number;
    missingSteps: number[];
    extraSteps: number[];
  };
}

export function validateDataSync(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ⚠️ FUNÇÃO DESABILITADA: Precisa ser refatorada para usar HierarchicalTemplateSource
  warnings.push('⚠️ Validação desabilitada - aguardando migração para HierarchicalTemplateSource');

  // Verificar se temos todas as 21 steps
  // const quizSteps = Object.keys(QUIZ_QUESTIONS_COMPLETE)
  //   .map(Number)
  //   .sort((a, b) => a - b);
  const mappingSteps = Object.keys(STEP_TEMPLATES_MAPPING)
    .map(Number)
    .sort((a, b) => a - b);

  const missingSteps: number[] = []; // quizSteps.filter(step => !mappingSteps.includes(step));
  const extraSteps: number[] = []; // mappingSteps.filter(step => !quizSteps.includes(step));

  // Verificar sequência 1-21 do STEP_TEMPLATES_MAPPING apenas
  for (let i = 1; i <= 21; i++) {
    // if (!QUIZ_QUESTIONS_COMPLETE[i]) {
    //   errors.push(`❌ QUIZ_QUESTIONS_COMPLETE missing step ${i}`);
    // }
    if (!STEP_TEMPLATES_MAPPING[i]) {
      errors.push(`❌ STEP_TEMPLATES_MAPPING missing step ${i}`);
    }
  }

  // Comentado: Verificar se os nomes estão sincronizados
  // for (let i = 1; i <= 21; i++) {
  //   const quizName = QUIZ_QUESTIONS_COMPLETE[i];
  //   const mappingTemplate = STEP_TEMPLATES_MAPPING[i];

  //   if (quizName && mappingTemplate) {
  //     if (
  //       !mappingTemplate.name.includes(quizName) &&
  //       !quizName.includes(mappingTemplate.name.split(' ')[0])
  //     ) {
  //       warnings.push(`⚠️ Step ${i}: Nome possivelmente dessincronizado`);
  //       warnings.push(`   Quiz: "${quizName}"`);
  //       warnings.push(`   Mapping: "${mappingTemplate.name}"`);
  //     }
  //   }
  // }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    details: {
      totalStepsInQuiz: 21, // quizSteps.length,
      totalStepsInMapping: mappingSteps.length,
      missingSteps,
      extraSteps,
    },
  };
}

// Função para executar e logar validação
export function runValidation(): void {
  const result = validateDataSync();

  appLogger.info('🔍 === VALIDAÇÃO DE SINCRONIZAÇÃO DE DADOS ===');
  appLogger.info(`Status: ${result.isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
  appLogger.info(`Steps no Quiz: ${result.details.totalStepsInQuiz}`);
  appLogger.info(`Steps no Mapping: ${result.details.totalStepsInMapping}`);

  if (result.errors.length > 0) {
    appLogger.info('\n❌ ERROS ENCONTRADOS:');
    result.errors.forEach(error => appLogger.info(String(error)));
  }

  if (result.warnings.length > 0) {
    appLogger.info('\n⚠️ AVISOS:');
    result.warnings.forEach(warning => appLogger.info(String(warning)));
  }

  if (result.details.missingSteps.length > 0) {
    appLogger.info(`\n🔍 Steps ausentes no mapping: ${result.details.missingSteps.join(', ')}`);
  }

  if (result.details.extraSteps.length > 0) {
    appLogger.info(`\n🔍 Steps extras no mapping: ${result.details.extraSteps.join(', ')}`);
  }

  appLogger.info('🔍 === FIM DA VALIDAÇÃO ===\n');
}

// Auto-executar se estiver em desenvolvimento
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  runValidation();
}
