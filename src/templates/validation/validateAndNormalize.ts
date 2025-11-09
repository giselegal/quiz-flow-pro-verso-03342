/**
 * 🔒 TEMPLATE V3 VALIDATION & NORMALIZATION
 * 
 * Valida e normaliza templates importados via JSON, garantindo:
 * - Schema Zod validado (campos obrigatórios, tipos corretos)
 * - IDs normalizados (legados → UUID v4)
 * - Estrutura consistente
 * - Warnings para dados suspeitos
 * 
 * @module validateAndNormalize
 * @version 1.0.0
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  templateV3Schema, 
  type TemplateV3, 
  type ValidationResult,
  type Block as SchemaBlock,
  isLegacyId,
  extractIdPrefix,
} from './templateV3Schema';
import { appLogger } from '@/lib/utils/logger';
import type { Block } from '@/types/editor';

// ============================================================================
// Validation + Normalization Function
// ============================================================================

export interface NormalizeOptions {
  /**
   * Substituir IDs legados por UUIDs (default: true)
   */
  replaceLegacyIds?: boolean;

  /**
   * Validar schema rigoroso (default: true)
   */
  strictValidation?: boolean;

  /**
   * Permitir campos extras (default: true)
   */
  allowExtraFields?: boolean;
}

export interface NormalizeResult {
  success: true;
  data: TemplateV3;
  warnings: string[];
  stats: {
    totalBlocks: number;
    replacedIds: number;
    steps: number;
  };
}

export interface NormalizeError {
  success: false;
  errors: Array<{
    path: string[];
    message: string;
    code: string;
  }>;
  rawData?: unknown;
}

export type NormalizeAndValidateResult = NormalizeResult | NormalizeError;

/**
 * Valida e normaliza template V3 importado
 * 
 * Pipeline:
 * 1. Validação Zod (schema)
 * 2. Normalização de IDs (legados → UUID)
 * 3. Validação de integridade (blocks vazios, tipos)
 * 4. Retorno com stats e warnings
 * 
 * @example
 * ```typescript
 * const result = normalizeAndValidateTemplateV3(jsonData);
 * 
 * if (result.success) {
 *   console.log('✅ Template válido:', result.data);
 *   console.log('⚠️ Warnings:', result.warnings);
 *   console.log('📊 Stats:', result.stats);
 * } else {
 *   console.error('❌ Erros:', result.errors);
 * }
 * ```
 */
export function normalizeAndValidateTemplateV3(
  data: unknown,
  options: NormalizeOptions = {}
): NormalizeAndValidateResult {
  const {
    replaceLegacyIds = true,
    strictValidation = true,
    allowExtraFields = true,
  } = options;

  const warnings: string[] = [];
  let replacedIdsCount = 0;

  // ============================================================================
  // STEP 1: Zod Schema Validation
  // ============================================================================

  appLogger.debug('[validateAndNormalize] Iniciando validação Zod...');

  const validationResult = templateV3Schema.safeParse(data);

  if (!validationResult.success) {
    const zodErrors = validationResult.error.errors.map(err => ({
      path: err.path.map(String),
      message: err.message,
      code: err.code,
    }));

    appLogger.error('[validateAndNormalize] ❌ Validação Zod falhou:', zodErrors);

    return {
      success: false,
      errors: zodErrors,
      rawData: data,
    };
  }

  const template = validationResult.data;

  appLogger.info('[validateAndNormalize] ✅ Validação Zod passou');

  // ============================================================================
  // STEP 2: Normalize IDs (Legacy → UUID)
  // ============================================================================

  if (replaceLegacyIds) {
    appLogger.debug('[validateAndNormalize] Normalizando IDs legados...');

    for (const [stepKey, blocks] of Object.entries(template.steps)) {
      template.steps[stepKey] = blocks.map((block, index) => {
        // Block ID
        if (isLegacyId(block.id)) {
          const prefix = extractIdPrefix(block.id) || 'block-';
          const newId = `${prefix}${uuidv4()}`;
          
          warnings.push(
            `${stepKey}[${index}]: Block ID "${block.id}" substituído por "${newId}" (formato legado)`
          );

          block.id = newId;
          replacedIdsCount++;
        }

        // Option IDs (dentro de content.options)
        if (block.content?.options && Array.isArray(block.content.options)) {
          block.content.options = block.content.options.map((option, optIndex) => {
            if (isLegacyId(option.id)) {
              const prefix = 'option-';
              const newId = `${prefix}${uuidv4()}`;

              warnings.push(
                `${stepKey}[${index}].options[${optIndex}]: Option ID "${option.id}" substituído por "${newId}"`
              );

              replacedIdsCount++;
              return { ...option, id: newId };
            }
            return option;
          });
        }

        return block;
      });
    }

    appLogger.info(`[validateAndNormalize] 🔄 ${replacedIdsCount} IDs substituídos`);
  }

  // ============================================================================
  // STEP 3: Integrity Validation
  // ============================================================================

  let totalBlocks = 0;

  for (const [stepKey, blocks] of Object.entries(template.steps)) {
    totalBlocks += blocks.length;

    // Warn sobre steps vazios
    if (blocks.length === 0) {
      warnings.push(`⚠️ Step "${stepKey}" está vazio (0 blocos)`);
    }

    // Warn sobre blocks sem type
    blocks.forEach((block, index) => {
      if (!block.type || block.type.trim() === '') {
        warnings.push(`⚠️ ${stepKey}[${index}]: Block sem tipo definido`);
      }

      // Warn sobre order duplicado
      const orders = blocks.map(b => b.order);
      const duplicates = orders.filter((o, i) => orders.indexOf(o) !== i);
      if (duplicates.length > 0) {
        warnings.push(
          `⚠️ ${stepKey}: Orders duplicados detectados: ${[...new Set(duplicates)].join(', ')}`
        );
      }
    });
  }

  // ============================================================================
  // STEP 4: Return Result
  // ============================================================================

  const stats = {
    totalBlocks,
    replacedIds: replacedIdsCount,
    steps: Object.keys(template.steps).length,
  };

  appLogger.info('[validateAndNormalize] ✅ Normalização completa:', stats);

  if (warnings.length > 0) {
    appLogger.warn('[validateAndNormalize] ⚠️ Warnings:', warnings);
  }

  return {
    success: true,
    data: template as TemplateV3,
    warnings,
    stats,
  };
}

// ============================================================================
// Helper: Validate Built-in Template
// ============================================================================

/**
 * Valida template built-in (já carregado em memória)
 * Versão simplificada sem normalização de IDs (built-ins devem ter UUIDs corretos)
 */
export function validateBuiltInTemplate(
  templateId: string,
  data: unknown
): ValidationResult {
  appLogger.debug(`[validateBuiltIn] Validando template: ${templateId}`);

  const result = templateV3Schema.safeParse(data);

  if (!result.success) {
    const zodErrors = result.error.errors.map(err => ({
      path: err.path.map(String),
      message: err.message,
      code: err.code,
    }));

    appLogger.error(`[validateBuiltIn] ❌ Template "${templateId}" inválido:`, zodErrors);

    return {
      success: false,
      errors: zodErrors,
      rawError: result.error,
    };
  }

  const warnings: string[] = [];

  // Check for legacy IDs in built-ins (should not exist)
  for (const [stepKey, blocks] of Object.entries(result.data.steps)) {
    blocks.forEach((block, index) => {
      if (isLegacyId(block.id)) {
        warnings.push(`⚠️ Built-in "${templateId}" step "${stepKey}[${index}]" tem ID legado: ${block.id}`);
      }
    });
  }

  appLogger.info(`[validateBuiltIn] ✅ Template "${templateId}" válido`);

  if (warnings.length > 0) {
    appLogger.warn(`[validateBuiltIn] ⚠️ Template "${templateId}" warnings:`, warnings);
  }

  return {
    success: true,
    data: result.data,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard para NormalizeResult
 */
export function isNormalizeSuccess(
  result: NormalizeAndValidateResult
): result is NormalizeResult {
  return result.success === true;
}

/**
 * Type guard para NormalizeError
 */
export function isNormalizeError(
  result: NormalizeAndValidateResult
): result is NormalizeError {
  return result.success === false;
}
