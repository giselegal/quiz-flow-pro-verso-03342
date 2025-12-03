/**
 * 🔒 Template Validator - Validação Automática de Formato
 * 
 * Garante que templates SEMPRE estejam no formato V4 correto:
 * - steps: [{ id, type, blocks: [...] }] (array, não objeto)
 * - Todos os campos obrigatórios presentes
 * - Tipos válidos
 * - Estrutura consistente
 * 
 * Use antes de carregar qualquer template no Editor!
 */

import { z } from 'zod';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';

// ============================================================================
// VALIDATION RESULTS
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  fixed?: QuizSchema; // Template corrigido automaticamente (se possível)
}

export interface ValidationError {
  code: string;
  message: string;
  path: string;
  severity: 'critical' | 'error';
}

export interface ValidationWarning {
  code: string;
  message: string;
  path: string;
  suggestion?: string;
}

// ============================================================================
// VALIDATION RULES
// ============================================================================

/**
 * Valida formato completo do template
 */
export function validateTemplateFormat(template: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // ========================================================================
  // CRITICAL: Steps deve ser array
  // ========================================================================
  if (!template.steps) {
    errors.push({
      code: 'MISSING_STEPS',
      message: 'Template não possui propriedade "steps"',
      path: 'root',
      severity: 'critical',
    });
    return { valid: false, errors, warnings };
  }

  if (!Array.isArray(template.steps)) {
    errors.push({
      code: 'STEPS_NOT_ARRAY',
      message: `Steps deve ser um array, mas é ${typeof template.steps}. Formato legado detectado: steps: { "step-01": [...] }`,
      path: 'steps',
      severity: 'critical',
    });

    // Tentar auto-correção
    try {
      const fixed = attemptAutoFix(template, errors, warnings);
      if (fixed) {
        return {
          valid: false,
          errors,
          warnings,
          fixed,
        };
      }
    } catch (err) {
      warnings.push({
        code: 'AUTO_FIX_FAILED',
        message: 'Não foi possível corrigir automaticamente',
        path: 'steps',
        suggestion: 'Converta manualmente usando adaptLegacyQuizToV4()',
      });
    }

    return { valid: false, errors, warnings };
  }

  // ========================================================================
  // VALIDATION: Array de steps
  // ========================================================================
  if (template.steps.length === 0) {
    errors.push({
      code: 'EMPTY_STEPS',
      message: 'Template deve ter pelo menos 1 step',
      path: 'steps',
      severity: 'error',
    });
    return { valid: false, errors, warnings };
  }

  template.steps.forEach((step: any, index: number) => {
    const stepPath = `steps[${index}]`;

    // ID obrigatório
    if (!step.id) {
      errors.push({
        code: 'MISSING_STEP_ID',
        message: `Step ${index} não possui ID`,
        path: stepPath,
        severity: 'error',
      });
    }

    // Type obrigatório
    if (!step.type) {
      errors.push({
        code: 'MISSING_STEP_TYPE',
        message: `Step ${index} não possui type`,
        path: `${stepPath}.type`,
        severity: 'error',
      });
    }

    // Blocks obrigatório
    if (!step.blocks) {
      errors.push({
        code: 'MISSING_BLOCKS',
        message: `Step ${step.id || index} não possui propriedade "blocks"`,
        path: `${stepPath}.blocks`,
        severity: 'error',
      });
    } else if (!Array.isArray(step.blocks)) {
      errors.push({
        code: 'BLOCKS_NOT_ARRAY',
        message: `Step ${step.id || index}: blocks deve ser array`,
        path: `${stepPath}.blocks`,
        severity: 'error',
      });
    } else if (step.blocks.length === 0) {
      warnings.push({
        code: 'EMPTY_BLOCKS',
        message: `Step ${step.id || index} não possui blocos`,
        path: `${stepPath}.blocks`,
        suggestion: 'Adicione pelo menos 1 bloco ao step',
      });
    } else {
      // Validar cada bloco
      step.blocks.forEach((block: any, blockIndex: number) => {
        const blockPath = `${stepPath}.blocks[${blockIndex}]`;

        if (!block.id) {
          errors.push({
            code: 'MISSING_BLOCK_ID',
            message: `Bloco ${blockIndex} do step ${step.id || index} não possui ID`,
            path: `${blockPath}.id`,
            severity: 'error',
          });
        }

        if (!block.type) {
          errors.push({
            code: 'MISSING_BLOCK_TYPE',
            message: `Bloco ${block.id || blockIndex} não possui type`,
            path: `${blockPath}.type`,
            severity: 'error',
          });
        }

        if (block.metadata && typeof block.metadata !== 'object') {
          warnings.push({
            code: 'INVALID_METADATA',
            message: `Bloco ${block.id}: metadata deve ser objeto`,
            path: `${blockPath}.metadata`,
          });
        }
      });
    }

    // Navigation obrigatório
    if (!step.navigation) {
      warnings.push({
        code: 'MISSING_NAVIGATION',
        message: `Step ${step.id || index} não possui navigation`,
        path: `${stepPath}.navigation`,
        suggestion: 'Adicione: { allowBack: true, autoAdvance: false }',
      });
    }

    // Validation obrigatório
    if (!step.validation) {
      warnings.push({
        code: 'MISSING_VALIDATION',
        message: `Step ${step.id || index} não possui validation`,
        path: `${stepPath}.validation`,
        suggestion: 'Adicione: { required: false, minBlocks: 0, customRules: [] }',
      });
    }

    // Version obrigatório
    if (!step.version) {
      warnings.push({
        code: 'MISSING_VERSION',
        message: `Step ${step.id || index} não possui version`,
        path: `${stepPath}.version`,
        suggestion: 'Adicione: version: 1',
      });
    }
  });

  // ========================================================================
  // METADATA
  // ========================================================================
  if (!template.metadata) {
    warnings.push({
      code: 'MISSING_METADATA',
      message: 'Template não possui metadata',
      path: 'metadata',
      suggestion: 'Adicione informações do quiz (nome, autor, etc)',
    });
  }

  // ========================================================================
  // THEME
  // ========================================================================
  if (!template.theme) {
    warnings.push({
      code: 'MISSING_THEME',
      message: 'Template não possui theme',
      path: 'theme',
      suggestion: 'Adicione configurações de cores e fontes',
    });
  }

  // ========================================================================
  // SETTINGS
  // ========================================================================
  if (!template.settings) {
    warnings.push({
      code: 'MISSING_SETTINGS',
      message: 'Template não possui settings',
      path: 'settings',
      suggestion: 'Adicione configurações de scoring, navigation e validation',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Tenta corrigir automaticamente erros comuns
 */
function attemptAutoFix(template: any, errors: ValidationError[], warnings: ValidationWarning[]): QuizSchema | null {
  // Se steps for objeto, converter para array
  if (!Array.isArray(template.steps) && typeof template.steps === 'object') {
    console.log('🔧 Auto-fix: Convertendo steps de objeto para array...');

    const stepsArray = Object.entries(template.steps).map(([stepId, blocks], index) => {
      const stepOrder = parseInt(stepId.replace(/\D/g, '')) || index + 1;

      return {
        id: stepId,
        type: 'intro' as const,
        order: stepOrder,
        title: `Step ${stepOrder}`,
        blocks: Array.isArray(blocks) ? blocks.map((block: any, blockIndex: number) => ({
          ...block,
          order: block.order ?? blockIndex,
          metadata: block.metadata || {
            editable: true,
            reorderable: true,
            reusable: true,
            deletable: true,
          },
        })) : [],
        navigation: {
          allowBack: true,
          autoAdvance: false,
        },
        validation: {
          required: false,
          minBlocks: 0,
          customRules: [],
        },
        version: 1,
      };
    });

    warnings.push({
      code: 'AUTO_FIXED_STEPS',
      message: `Steps foi convertido de objeto para array (${stepsArray.length} steps)`,
      path: 'steps',
      suggestion: 'Verifique se a conversão está correta',
    });

    return {
      ...template,
      steps: stepsArray,
    } as QuizSchema;
  }

  return null;
}

/**
 * Valida template e lança exceção se inválido
 * Use no carregamento de templates críticos
 */
export function assertValidTemplate(template: any): asserts template is QuizSchema {
  const result = validateTemplateFormat(template);

  if (!result.valid) {
    const errorMessages = result.errors.map(e => `[${e.code}] ${e.path}: ${e.message}`).join('\n');
    throw new Error(
      `❌ TEMPLATE INVÁLIDO:\n\n${errorMessages}\n\n` +
      'Use normalizeQuizFormat() ou adaptLegacyQuizToV4() para corrigir.',
    );
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️ Template tem avisos:');
    result.warnings.forEach(w => {
      console.warn(`  [${w.code}] ${w.path}: ${w.message}`);
      if (w.suggestion) {
        console.warn(`    💡 ${w.suggestion}`);
      }
    });
  }
}

/**
 * Gera relatório de validação formatado
 */
export function formatValidationReport(result: ValidationResult): string {
  const lines: string[] = [];

  lines.push('📋 RELATÓRIO DE VALIDAÇÃO DE TEMPLATE');
  lines.push('='.repeat(50));
  lines.push('');

  if (result.valid) {
    lines.push('✅ TEMPLATE VÁLIDO');
  } else {
    lines.push('❌ TEMPLATE INVÁLIDO');
  }

  lines.push('');

  if (result.errors.length > 0) {
    lines.push(`🚨 ERROS (${result.errors.length}):`);
    result.errors.forEach(error => {
      lines.push(`  [${error.severity.toUpperCase()}] ${error.code}`);
      lines.push(`  📍 ${error.path}`);
      lines.push(`  💬 ${error.message}`);
      lines.push('');
    });
  }

  if (result.warnings.length > 0) {
    lines.push(`⚠️  AVISOS (${result.warnings.length}):`);
    result.warnings.forEach(warning => {
      lines.push(`  [WARN] ${warning.code}`);
      lines.push(`  📍 ${warning.path}`);
      lines.push(`  💬 ${warning.message}`);
      if (warning.suggestion) {
        lines.push(`  💡 ${warning.suggestion}`);
      }
      lines.push('');
    });
  }

  if (result.fixed) {
    lines.push('🔧 AUTO-CORREÇÃO DISPONÍVEL');
    lines.push('Use o template corrigido em result.fixed');
    lines.push('');
  }

  lines.push('='.repeat(50));

  return lines.join('\n');
}

/**
 * Validação rápida para verificar apenas formato de steps
 */
export function quickValidateStepsFormat(template: any): boolean {
  return template?.steps && Array.isArray(template.steps);
}
