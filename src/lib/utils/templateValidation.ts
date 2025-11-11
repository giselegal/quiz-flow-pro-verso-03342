/**
 * 🔍 G5 FIX: VALIDAÇÃO COMPLETA DE INTEGRIDADE DE TEMPLATES
 * 
 * Valida templates em profundidade:
 * - Estrutura de steps (faltando, vazios, duplicados)
 * - Estrutura de blocos (tipo, schema, propriedades)
 * - IDs únicos (sem duplicação)
 * - Dependências entre blocos (parentId válido)
 * - Schemas completos (todos os tipos têm schema)
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */

import { blockPropertySchemas } from '@/config/blockPropertySchemas';
import type { Block } from '@/types/editor';
import { appLogger } from '@/lib/utils/logger';

export interface TemplateValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    summary: ValidationSummary;
}

export interface ValidationError {
    type: 'missing_step' | 'empty_step' | 'invalid_block' | 'duplicate_id' | 'invalid_parent' | 'missing_schema';
    severity: 'critical' | 'high' | 'medium';
    stepId?: string;
    blockId?: string;
    message: string;
    suggestion?: string;
}

export interface ValidationWarning {
    type: 'deprecated_type' | 'missing_property' | 'unused_block' | 'suspicious_data';
    stepId?: string;
    blockId?: string;
    message: string;
}

export interface ValidationSummary {
    totalSteps: number;
    validSteps: number;
    emptySteps: number;
    missingSteps: number;
    totalBlocks: number;
    validBlocks: number;
    invalidBlocks: number;
    duplicateIds: number;
    missingSchemas: number;
}

/**
 * Valida integridade completa de um template
 */
export async function validateTemplateIntegrity(
    templateId: string,
    expectedStepCount: number,
    getStepFn: (stepId: string) => Promise<Block[] | null>,
    options: {
        signal?: AbortSignal;
        validateSchemas?: boolean;
        validateDependencies?: boolean;
    } = {}
): Promise<TemplateValidationResult> {
    const { signal, validateSchemas = true, validateDependencies = true } = options;
    
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const seenIds = new Set<string>();
    
    let totalBlocks = 0;
    let validBlocks = 0;
    let invalidBlocks = 0;
    let duplicateIds = 0;
    let missingSchemas = 0;
    let validSteps = 0;
    let emptySteps = 0;
    let missingSteps = 0;

    appLogger.info(`[G5] Iniciando validação de integridade: ${templateId}`);

    // Validar todos os steps esperados
    for (let i = 1; i <= expectedStepCount; i++) {
        if (signal?.aborted) break;

        const stepId = `step-${String(i).padStart(2, '0')}`;
        
        try {
            const blocks = await getStepFn(stepId);
            
            if (blocks === null) {
                // Step não encontrado
                missingSteps++;
                errors.push({
                    type: 'missing_step',
                    severity: 'critical',
                    stepId,
                    message: `Step ${stepId} não encontrado no template`,
                    suggestion: 'Criar step vazio ou importar de backup',
                });
                continue;
            }
            
            if (blocks.length === 0) {
                // Step vazio
                emptySteps++;
                warnings.push({
                    type: 'unused_block',
                    stepId,
                    message: `Step ${stepId} está vazio (sem blocos)`,
                });
                continue;
            }
            
            // Step válido com blocos
            validSteps++;
            totalBlocks += blocks.length;
            
            // Validar cada bloco
            for (const block of blocks) {
                const blockValidation = validateBlock(block, {
                    stepId,
                    seenIds,
                    validateSchemas,
                    validateDependencies,
                    allBlocks: blocks,
                });
                
                if (blockValidation.isValid) {
                    validBlocks++;
                } else {
                    invalidBlocks++;
                    errors.push(...blockValidation.errors);
                }
                
                warnings.push(...blockValidation.warnings);
                
                if (blockValidation.isDuplicate) duplicateIds++;
                if (blockValidation.hasMissingSchema) missingSchemas++;
            }
            
        } catch (error) {
            if (!signal?.aborted) {
                missingSteps++;
                errors.push({
                    type: 'missing_step',
                    severity: 'critical',
                    stepId,
                    message: `Erro ao carregar step ${stepId}: ${error}`,
                    suggestion: 'Verificar conexão ou integridade do banco de dados',
                });
            }
        }
    }

    const isValid = errors.filter(e => e.severity === 'critical').length === 0;
    
    const result: TemplateValidationResult = {
        isValid,
        errors,
        warnings,
        summary: {
            totalSteps: expectedStepCount,
            validSteps,
            emptySteps,
            missingSteps,
            totalBlocks,
            validBlocks,
            invalidBlocks,
            duplicateIds,
            missingSchemas,
        },
    };

    appLogger.info(`[G5] Validação concluída:`, result.summary);
    
    return result;
}

/**
 * Valida um bloco individual
 */
function validateBlock(
    block: Block,
    context: {
        stepId: string;
        seenIds: Set<string>;
        validateSchemas: boolean;
        validateDependencies: boolean;
        allBlocks: Block[];
    }
): {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    isDuplicate: boolean;
    hasMissingSchema: boolean;
} {
    const { stepId, seenIds, validateSchemas, validateDependencies, allBlocks } = context;
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let isDuplicate = false;
    let hasMissingSchema = false;

    // 1. Validar ID único
    if (!block.id) {
        errors.push({
            type: 'invalid_block',
            severity: 'critical',
            stepId,
            blockId: 'undefined',
            message: `Bloco sem ID no step ${stepId}`,
            suggestion: 'Adicionar UUID v4 ao bloco',
        });
    } else if (seenIds.has(block.id)) {
        isDuplicate = true;
        errors.push({
            type: 'duplicate_id',
            severity: 'high',
            stepId,
            blockId: block.id,
            message: `ID duplicado: ${block.id}`,
            suggestion: 'Gerar novo UUID v4 para o bloco',
        });
    } else {
        seenIds.add(block.id);
    }

    // 2. Validar tipo
    if (!block.type) {
        errors.push({
            type: 'invalid_block',
            severity: 'critical',
            stepId,
            blockId: block.id,
            message: `Bloco ${block.id} sem tipo definido`,
            suggestion: 'Definir tipo válido do blockPropertySchemas',
        });
    }

    // 3. Validar schema (se habilitado)
    if (validateSchemas && block.type) {
        const schema = blockPropertySchemas[block.type as keyof typeof blockPropertySchemas];
        
        if (!schema) {
            hasMissingSchema = true;
            errors.push({
                type: 'missing_schema',
                severity: 'high',
                stepId,
                blockId: block.id,
                message: `Tipo '${block.type}' não tem schema em blockPropertySchemas`,
                suggestion: 'Adicionar schema ou usar tipo válido',
            });
        } else {
            // Validar propriedades obrigatórias do schema
            const requiredProps = schema.fields?.filter((f: any) => f.required) || [];
            for (const prop of requiredProps) {
                const key = (prop as any).key;
                const value = key ? (block.properties?.[key] ?? block.content?.[key]) : undefined;
                if (key && (value === undefined || value === null)) {
                    warnings.push({
                        type: 'missing_property',
                        stepId,
                        blockId: block.id,
                        message: `Propriedade obrigatória '${key}' faltando em ${block.id}`,
                    });
                }
            }
        }
    }

    // 4. Validar dependências (parentId)
    if (validateDependencies && block.parentId) {
        const parentExists = allBlocks.some(b => b.id === block.parentId);
        if (!parentExists) {
            errors.push({
                type: 'invalid_parent',
                severity: 'medium',
                stepId,
                blockId: block.id,
                message: `Parent ID inválido: ${block.parentId} não existe`,
                suggestion: 'Remover parentId ou corrigir referência',
            });
        }
    }

    const isValid = errors.filter(e => e.severity === 'critical').length === 0;

    return {
        isValid,
        errors,
        warnings,
        isDuplicate,
        hasMissingSchema,
    };
}

/**
 * Formata resultado da validação para exibição
 */
export function formatValidationResult(result: TemplateValidationResult): string {
    const { summary, errors, warnings } = result;
    
    const parts: string[] = [];
    
    // Resumo
    parts.push(`📊 Resumo: ${summary.validSteps}/${summary.totalSteps} steps válidos`);
    parts.push(`   ${summary.totalBlocks} blocos (${summary.validBlocks} válidos, ${summary.invalidBlocks} inválidos)`);
    
    // Problemas críticos
    const critical = errors.filter(e => e.severity === 'critical');
    if (critical.length > 0) {
        parts.push(`\n❌ ${critical.length} Erros Críticos:`);
        critical.slice(0, 3).forEach(e => {
            parts.push(`   • ${e.message}`);
            if (e.suggestion) parts.push(`     💡 ${e.suggestion}`);
        });
        if (critical.length > 3) {
            parts.push(`   ... e mais ${critical.length - 3} erros`);
        }
    }
    
    // Warnings
    if (warnings.length > 0) {
        parts.push(`\n⚠️ ${warnings.length} Avisos:`);
        warnings.slice(0, 2).forEach(w => {
            parts.push(`   • ${w.message}`);
        });
        if (warnings.length > 2) {
            parts.push(`   ... e mais ${warnings.length - 2} avisos`);
        }
    }
    
    return parts.join('\n');
}

/**
 * Gera relatório detalhado em formato Markdown
 */
export function generateValidationReport(result: TemplateValidationResult): string {
    const { summary, errors, warnings } = result;
    
    const lines: string[] = [];
    
    lines.push('# 🔍 Relatório de Validação de Integridade');
    lines.push('');
    lines.push(`**Status:** ${result.isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
    lines.push('');
    
    // Resumo
    lines.push('## 📊 Resumo');
    lines.push('');
    lines.push('| Métrica | Valor |');
    lines.push('|---------|-------|');
    lines.push(`| Steps Válidos | ${summary.validSteps}/${summary.totalSteps} |`);
    lines.push(`| Steps Vazios | ${summary.emptySteps} |`);
    lines.push(`| Steps Faltando | ${summary.missingSteps} |`);
    lines.push(`| Blocos Totais | ${summary.totalBlocks} |`);
    lines.push(`| Blocos Válidos | ${summary.validBlocks} |`);
    lines.push(`| Blocos Inválidos | ${summary.invalidBlocks} |`);
    lines.push(`| IDs Duplicados | ${summary.duplicateIds} |`);
    lines.push(`| Schemas Faltando | ${summary.missingSchemas} |`);
    lines.push('');
    
    // Erros críticos
    const critical = errors.filter(e => e.severity === 'critical');
    if (critical.length > 0) {
        lines.push('## ❌ Erros Críticos');
        lines.push('');
        critical.forEach((e, i) => {
            lines.push(`### ${i + 1}. ${e.type.toUpperCase()}`);
            lines.push(`- **Step:** ${e.stepId || 'N/A'}`);
            lines.push(`- **Bloco:** ${e.blockId || 'N/A'}`);
            lines.push(`- **Mensagem:** ${e.message}`);
            if (e.suggestion) lines.push(`- **Sugestão:** ${e.suggestion}`);
            lines.push('');
        });
    }
    
    // Erros de alta prioridade
    const high = errors.filter(e => e.severity === 'high');
    if (high.length > 0) {
        lines.push('## ⚠️ Erros de Alta Prioridade');
        lines.push('');
        high.forEach((e, i) => {
            lines.push(`### ${i + 1}. ${e.type.toUpperCase()}`);
            lines.push(`- **Step:** ${e.stepId || 'N/A'}`);
            lines.push(`- **Bloco:** ${e.blockId || 'N/A'}`);
            lines.push(`- **Mensagem:** ${e.message}`);
            if (e.suggestion) lines.push(`- **Sugestão:** ${e.suggestion}`);
            lines.push('');
        });
    }
    
    // Warnings
    if (warnings.length > 0) {
        lines.push('## 💡 Avisos');
        lines.push('');
        const grouped = warnings.reduce((acc, w) => {
            const key = w.stepId || 'global';
            if (!acc[key]) acc[key] = [];
            acc[key].push(w);
            return acc;
        }, {} as Record<string, ValidationWarning[]>);
        
        Object.entries(grouped).forEach(([stepId, warns]) => {
            lines.push(`### ${stepId}`);
            warns.forEach(w => {
                lines.push(`- ${w.message}`);
            });
            lines.push('');
        });
    }
    
    return lines.join('\n');
}
