/**
 * Template Validation and Normalization
 * 
 * Funções para validar e normalizar templates importados:
 * - Valida estrutura com Zod
 * - Substitui IDs legados (Date.now()) por UUIDs v4
 * - Normaliza estrutura para Template V3
 * - Reporta warnings para campos deprecados
 */

import { v4 as uuidv4 } from 'uuid';
import {
  templateV3Schema,
  blockSchema,
  isValidUUID,
  isLegacyId,
  extractIdPrefix,
  type TemplateV3,
  type Block,
  type ValidationResult,
  type ValidationSuccess,
  type ValidationError,
} from './templateV3Schema';
import { appLogger } from '@/lib/utils/logger';

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Valida template usando Zod schema
 * Retorna resultado estruturado com erros ou warnings
 */
export function validateTemplate(template: unknown): ValidationResult {
  try {
    const parsed = templateV3Schema.parse(template);
    
    // Coletar warnings para IDs legados
    const warnings = collectLegacyIdWarnings(parsed);
    
    return {
      success: true,
      data: parsed,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      const zodError = error as any;
      return {
        success: false,
        errors: zodError.issues.map((issue: any) => ({
          path: issue.path,
          message: issue.message,
          code: issue.code,
        })),
        rawError: zodError,
      };
    }
    
    // Erro inesperado
    return {
      success: false,
      errors: [{
        path: [],
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        code: 'UNKNOWN_ERROR',
      }],
      rawError: error as any,
    };
  }
}

/**
 * Coleta warnings sobre IDs legados no template
 */
function collectLegacyIdWarnings(template: TemplateV3): string[] {
  const warnings: string[] = [];
  
  for (const [stepKey, blocks] of Object.entries(template.steps)) {
    blocks.forEach((block, index) => {
      if (isLegacyId(block.id)) {
        warnings.push(`${stepKey}[${index}]: Block ID "${block.id}" usa formato legado (Date.now())`);
      }
      
      // Check options dentro de content
      if (block.content.options && Array.isArray(block.content.options)) {
        block.content.options.forEach((option: any, optIndex: number) => {
          if (option.id && isLegacyId(option.id)) {
            warnings.push(`${stepKey}[${index}].options[${optIndex}]: Option ID "${option.id}" usa formato legado`);
          }
        });
      }
    });
  }
  
  return warnings;
}

// ============================================================================
// UUID Normalization
// ============================================================================

/**
 * Normaliza IDs de um template:
 * - Substitui IDs legados (Date.now()) por UUIDs v4
 * - Preserva IDs já válidos (UUID format)
 * - Mantém prefixos ("block-", "option-", etc.)
 */
export function normalizeTemplateIds(template: TemplateV3): TemplateV3 {
  const normalized: TemplateV3 = {
    metadata: { ...template.metadata },
    steps: {},
  };
  
  for (const [stepKey, blocks] of Object.entries(template.steps)) {
    normalized.steps[stepKey] = blocks.map(block => normalizeBlockIds(block));
  }
  
  return normalized;
}

/**
 * Normaliza IDs de um único block
 */
function normalizeBlockIds(block: Block): Block {
  const normalized: Block = {
    ...block,
    id: normalizeId(block.id),
    content: { ...block.content },
    properties: { ...block.properties },
  };
  
  // Normalizar IDs de options, se existirem
  if (normalized.content.options && Array.isArray(normalized.content.options)) {
    normalized.content.options = normalized.content.options.map(option => ({
      ...option,
      id: normalizeId(option.id),
    }));
  }
  
  return normalized;
}

/**
 * Normaliza um único ID:
 * - step-N → preserva (formato especial para steps)
 * - UUID v4 válido → mantém
 * - Date.now() legado → substitui por UUID preservando prefixo
 * - Sem prefixo → adiciona "block-" + UUID
 */
export function normalizeId(id: string): string {
  // Caso especial PRIMEIRO: step-N (formato válido de step, não normalizar)
  if (/^step-\d+$/.test(id)) {
    return id;
  }
  
  // Já é UUID válido com prefixo? Mantém.
  const prefix = extractIdPrefix(id);
  if (prefix) {
    const idWithoutPrefix = id.slice(prefix.length);
    if (isValidUUID(idWithoutPrefix)) {
      return id;
    }
  }
  
  // É legado (Date.now() format)? Substitui por UUID mantendo prefixo.
  if (isLegacyId(id)) {
    const prefix = extractIdPrefix(id) || 'block-';
    return `${prefix}${uuidv4()}`;
  }
  
  // Não tem prefixo válido? Adiciona "block-" + UUID.
  if (!prefix) {
    return `block-${uuidv4()}`;
  }
  
  // Tem prefixo mas ID inválido? Substitui por UUID.
  return `${prefix}${uuidv4()}`;
}

// ============================================================================
// Combined Validation + Normalization
// ============================================================================

/**
 * Valida E normaliza template em um único passo
 * 
 * Fluxo:
 * 1. Valida estrutura com Zod
 * 2. Se válido, normaliza IDs legados → UUIDs
 * 3. Retorna template normalizado + warnings
 * 
 * @param template - Template raw importado do JSON
 * @returns ValidationResult com template normalizado ou erros
 */
export function validateAndNormalizeTemplate(template: unknown): ValidationResult {
  appLogger.info('[TemplateValidation] Iniciando validação de template importado');
  
  // Passo 1: Validar estrutura
  const validationResult = validateTemplate(template);
  
  if (!validationResult.success) {
    appLogger.error('[TemplateValidation] Validação falhou', {
      errorCount: validationResult.errors.length,
      errors: validationResult.errors,
    });
    return validationResult;
  }
  
  appLogger.info('[TemplateValidation] Estrutura válida, normalizando IDs...');
  
  // Passo 2: Normalizar IDs
  const normalizedTemplate = normalizeTemplateIds(validationResult.data);
  
  // Passo 3: Contar IDs substituídos
  const legacyIdCount = validationResult.warnings?.length || 0;
  
  if (legacyIdCount > 0) {
    appLogger.warn('[TemplateValidation] IDs legados detectados e normalizados', {
      count: legacyIdCount,
      warnings: validationResult.warnings,
    });
  }
  
  appLogger.info('[TemplateValidation] Template validado e normalizado com sucesso', {
    stepCount: Object.keys(normalizedTemplate.steps).length,
    totalBlocks: Object.values(normalizedTemplate.steps).reduce((sum, blocks) => sum + blocks.length, 0),
    legacyIdsReplaced: legacyIdCount,
  });
  
  return {
    success: true,
    data: normalizedTemplate,
    warnings: validationResult.warnings,
  };
}

// ============================================================================
// Error Formatting Helpers
// ============================================================================

/**
 * Formata erros de validação para exibição ao usuário
 */
export function formatValidationErrors(result: ValidationError): string {
  const lines: string[] = [
    '❌ Template inválido:',
    '',
  ];
  
  result.errors.forEach((error, index) => {
    const pathStr = error.path.length > 0 ? error.path.join('.') : 'root';
    lines.push(`${index + 1}. [${pathStr}] ${error.message}`);
  });
  
  return lines.join('\n');
}

/**
 * Formata warnings para exibição ao usuário
 */
export function formatValidationWarnings(warnings: string[]): string {
  const lines: string[] = [
    '⚠️ Avisos de normalização:',
    '',
  ];
  
  warnings.forEach((warning, index) => {
    lines.push(`${index + 1}. ${warning}`);
  });
  
  lines.push('');
  lines.push('✅ IDs foram automaticamente normalizados para UUID v4.');
  
  return lines.join('\n');
}
