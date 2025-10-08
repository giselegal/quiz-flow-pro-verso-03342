/**
 * 🛡️ QUIZ VALIDATION UTILITIES
 * 
 * Validações de integridade para prevenir erros ao editar funis de quiz.
 * Garante que todas as propriedades críticas estejam corretas.
 * 
 * Validações implementadas:
 * 1. Style IDs válidos (perguntas 02-11)
 * 2. nextStep válido (aponta para etapa existente)
 * 3. OfferMap completo (4 chaves obrigatórias)
 * 4. FormInput obrigatório no step-01
 */

import { QuizStep, QUIZ_STEPS, STEP_ORDER } from '@/data/quizSteps';
import { styleMapping, type StyleId } from '@/data/styles';

// ================================
// TIPOS
// ================================

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}

export interface ValidationError {
    stepId: string;
    field: string;
    message: string;
    severity: 'error';
}

export interface ValidationWarning {
    stepId: string;
    field: string;
    message: string;
    severity: 'warning';
}

// ================================
// VALIDAÇÃO 1: Style IDs Válidos
// ================================

/**
 * Valida que os IDs das opções das perguntas 02-11 são estilos válidos
 */
export function validateStyleIds(step: QuizStep & { id: string }): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Apenas para perguntas principais (02-11)
    if (step.type !== 'question') {
        return { isValid: true, errors, warnings };
    }

    // Verificar se tem opções
    if (!step.options || step.options.length === 0) {
        errors.push({
            stepId: step.id,
            field: 'options',
            message: 'Pergunta não tem opções definidas',
            severity: 'error'
        });
        return { isValid: false, errors, warnings };
    }

    // Obter lista de style IDs válidos
    const validStyleIds = Object.keys(styleMapping);

    // Verificar cada opção
    step.options.forEach((option, index) => {
        // Verificar se o ID da opção é um estilo válido
        if (!validStyleIds.includes(option.id)) {
            errors.push({
                stepId: step.id,
                field: `options[${index}].id`,
                message: `ID de opção inválido: "${option.id}". Deve ser um dos estilos válidos: ${validStyleIds.join(', ')}`,
                severity: 'error'
            });
        }

        // Verificar se tem imagem (obrigatório para perguntas principais)
        if (!option.image) {
            warnings.push({
                stepId: step.id,
                field: `options[${index}].image`,
                message: `Opção "${option.text}" não tem imagem. Perguntas principais devem ter imagens.`,
                severity: 'warning'
            });
        }
    });

    // Verificar se tem exatamente 8 opções (padrão do quiz-estilo)
    if (step.options.length !== 8) {
        warnings.push({
            stepId: step.id,
            field: 'options',
            message: `Pergunta tem ${step.options.length} opções. O padrão é 8 opções (uma para cada estilo).`,
            severity: 'warning'
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Retorna a lista de style IDs válidos para uso em dropdowns
 */
export function getValidStyleIds(): Array<{ value: StyleId; label: string }> {
    return Object.entries(styleMapping).map(([id, style]) => ({
        value: id as StyleId,
        label: style.name
    }));
}

// ================================
// VALIDAÇÃO 2: nextStep Válido
// ================================

/**
 * Valida que o nextStep aponta para uma etapa que existe
 */
export function validateNextStep(step: QuizStep & { id: string }, allStepIds?: string[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Determinar última etapa dinamicamente (permite excluir step-21)
    const ids = allStepIds && allStepIds.length > 0 ? allStepIds : STEP_ORDER;
    const lastId = ids[ids.length - 1];
    if (step.id === lastId) {
        if (step.nextStep !== null && step.nextStep !== undefined) {
            errors.push({
                stepId: step.id,
                field: 'nextStep',
                message: `Última etapa (${lastId}) deve ter nextStep = null`,
                severity: 'error'
            });
        }
        return { isValid: errors.length === 0, errors, warnings };
    }

    // Para todas as outras etapas, nextStep é obrigatório
    if (!step.nextStep) {
        errors.push({
            stepId: step.id,
            field: 'nextStep',
            message: 'nextStep é obrigatório (exceto na última etapa)',
            severity: 'error'
        });
        return { isValid: false, errors, warnings };
    }

    // Verificar se o nextStep existe no QUIZ_STEPS
    // Validar existência – se usamos lista dinâmica, confiar nela
    const exists = ids.includes(step.nextStep);
    if (!exists) {
        errors.push({
            stepId: step.id,
            field: 'nextStep',
            message: `nextStep "${step.nextStep}" não existe. Etapas válidas: ${ids.join(', ')}`,
            severity: 'error'
        });
        return { isValid: false, errors, warnings };
    }

    // Verificar se o nextStep segue a ordem correta (warning apenas)
    const currentIndex = ids.indexOf(step.id);
    const nextIndex = ids.indexOf(step.nextStep);

    if (currentIndex >= 0 && nextIndex >= 0) {
        // nextStep deve ser o próximo na sequência
        if (nextIndex !== currentIndex + 1) {
            warnings.push({
                stepId: step.id,
                field: 'nextStep',
                message: `nextStep "${step.nextStep}" não segue a ordem sequencial. Esperado: "${ids[currentIndex + 1]}"`,
                severity: 'warning'
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Retorna a lista de nextStep válidos para uso em dropdowns
 */
export function getValidNextSteps(currentStepId: string): Array<{ value: string; label: string }> {
    const currentIndex = STEP_ORDER.indexOf(currentStepId);

    // Se é a última etapa, não tem nextStep
    if (currentIndex === STEP_ORDER.length - 1) {
        return [{ value: 'null', label: 'Nenhum (última etapa)' }];
    }

    // Retornar todas as etapas após a atual
    return STEP_ORDER.slice(currentIndex + 1).map(stepId => ({
        value: stepId,
        label: `${stepId} (${QUIZ_STEPS[stepId]?.type || 'desconhecido'})`
    }));
}

// ================================
// VALIDAÇÃO 3: OfferMap Completo
// ================================

/**
 * IDs das opções do step-18 que mapeiam para as 4 ofertas
 */
export const OFFER_MAP_KEYS = [
    'Montar looks com mais facilidade e confiança',
    'Usar o que já tenho e me sentir estilosa',
    'Comprar com mais consciência e sem culpa',
    'Ser admirada pela imagem que transmito'
];

/**
 * Valida que o offerMap do step-21 tem as 4 chaves obrigatórias
 */
export function validateOfferMap(step: QuizStep & { id: string }, allStepIds?: string[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Apenas para a última etapa se ela for offer (dinâmico)
    const ids = allStepIds && allStepIds.length > 0 ? allStepIds : STEP_ORDER;
    const lastId = ids[ids.length - 1];
    if (step.type !== 'offer' || step.id !== lastId) {
        return { isValid: true, errors, warnings };
    }

    // Verificar se offerMap existe
    if (!step.offerMap) {
        errors.push({
            stepId: step.id,
            field: 'offerMap',
            message: `offerMap é obrigatório para última etapa (${step.id})`,
            severity: 'error'
        });
        return { isValid: false, errors, warnings };
    }

    // Verificar se tem as 4 chaves obrigatórias
    OFFER_MAP_KEYS.forEach(key => {
        if (!step.offerMap![key]) {
            errors.push({
                stepId: step.id,
                field: 'offerMap',
                message: `Falta oferta para a chave: "${key}"`,
                severity: 'error'
            });
        } else {
            // Verificar se a oferta está completa
            const offer = step.offerMap![key];

            if (!offer.title) {
                errors.push({
                    stepId: step.id,
                    field: `offerMap['${key}'].title`,
                    message: `Oferta "${key}" não tem título`,
                    severity: 'error'
                });
            }

            if (!offer.description) {
                warnings.push({
                    stepId: step.id,
                    field: `offerMap['${key}'].description`,
                    message: `Oferta "${key}" não tem descrição`,
                    severity: 'warning'
                });
            }

            if (!offer.buttonText) {
                errors.push({
                    stepId: step.id,
                    field: `offerMap['${key}'].buttonText`,
                    message: `Oferta "${key}" não tem texto do botão`,
                    severity: 'error'
                });
            }

            // Verificar testimonial
            if (!offer.testimonial) {
                warnings.push({
                    stepId: step.id,
                    field: `offerMap['${key}'].testimonial`,
                    message: `Oferta "${key}" não tem depoimento (testimonial)`,
                    severity: 'warning'
                });
            } else {
                if (!offer.testimonial.quote) {
                    warnings.push({
                        stepId: step.id,
                        field: `offerMap['${key}'].testimonial.quote`,
                        message: `Depoimento da oferta "${key}" não tem citação (quote)`,
                        severity: 'warning'
                    });
                }

                if (!offer.testimonial.author) {
                    warnings.push({
                        stepId: step.id,
                        field: `offerMap['${key}'].testimonial.author`,
                        message: `Depoimento da oferta "${key}" não tem autor`,
                        severity: 'warning'
                    });
                }
            }

            // Verificar se tem placeholder {userName}
            if (offer.title && !offer.title.includes('{userName}')) {
                warnings.push({
                    stepId: step.id,
                    field: `offerMap['${key}'].title`,
                    message: `Título da oferta "${key}" não contém variável {userName} para personalização`,
                    severity: 'warning'
                });
            }
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

// ================================
// VALIDAÇÃO 4: FormInput Obrigatório
// ================================

/**
 * Valida que o step-01 (intro) tem FormInput para coletar o nome
 */
export function validateFormInput(step: QuizStep & { id: string }): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Apenas para step-01 (intro)
    if (step.type !== 'intro' || step.id !== 'step-01') {
        return { isValid: true, errors, warnings };
    }

    // Verificar se tem formQuestion
    if (!step.formQuestion) {
        errors.push({
            stepId: step.id,
            field: 'formQuestion',
            message: 'formQuestion é obrigatório para coletar o nome do usuário',
            severity: 'error'
        });
    }

    // Verificar se tem placeholder
    if (!step.placeholder) {
        errors.push({
            stepId: step.id,
            field: 'placeholder',
            message: 'placeholder é obrigatório para o input de nome',
            severity: 'error'
        });
    }

    // Verificar se tem buttonText
    if (!step.buttonText) {
        errors.push({
            stepId: step.id,
            field: 'buttonText',
            message: 'buttonText é obrigatório para o botão de envio',
            severity: 'error'
        });
    }

    // Verificar se tem title
    if (!step.title) {
        warnings.push({
            stepId: step.id,
            field: 'title',
            message: 'Título é recomendado para a página inicial',
            severity: 'warning'
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

// ================================
// VALIDAÇÃO COMPLETA DE FUNNEL
// ================================

/**
 * Valida um funil completo (todas as 21 etapas)
 */
export function validateCompleteFunnel(steps: Record<string, QuizStep>): ValidationResult {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationWarning[] = [];

    const stepIds = Object.keys(steps);
    // Permitir agora funil de 20 ou 21 etapas (tornando step-21 opcional)
    if (stepIds.length < 20) {
        allErrors.push({
            stepId: 'global',
            field: 'steps',
            message: `Funil deve ter ao menos 20 etapas. Encontradas: ${stepIds.length}`,
            severity: 'error'
        });
    }

    // Validar cada step individualmente usando lista dinâmica
    Object.entries(steps).forEach(([stepId, step]) => {
        const stepWithId = { ...step, id: stepId };

        // Validação 1: Style IDs
        const styleValidation = validateStyleIds(stepWithId);
        allErrors.push(...styleValidation.errors);
        allWarnings.push(...styleValidation.warnings);

        // Validação 2: nextStep
    const nextStepValidation = validateNextStep(stepWithId, stepIds);
        allErrors.push(...nextStepValidation.errors);
        allWarnings.push(...nextStepValidation.warnings);

        // Validação 3: OfferMap
    const offerMapValidation = validateOfferMap(stepWithId, stepIds);
        allErrors.push(...offerMapValidation.errors);
        allWarnings.push(...offerMapValidation.warnings);

        // Validação 4: FormInput
        const formInputValidation = validateFormInput(stepWithId);
        allErrors.push(...formInputValidation.errors);
        allWarnings.push(...formInputValidation.warnings);
    });

    // Validação global: se estiver usando 21 etapas, checar faltantes; se 20, aceitar ausência de step-21
    if (stepIds.length >= 20) {
        const required = STEP_ORDER.filter(id => id !== 'step-21');
        const missing = required.filter(id => !stepIds.includes(id));
        if (missing.length > 0) {
            allErrors.push({
                stepId: 'global',
                field: 'steps',
                message: `Etapas obrigatórias faltando: ${missing.join(', ')}`,
                severity: 'error'
            });
        }
    }

    return {
        isValid: allErrors.length === 0,
        errors: allErrors,
        warnings: allWarnings
    };
}

// ================================
// HELPER: Formatar Resultado de Validação
// ================================

/**
 * Formata o resultado da validação para exibição
 */
export function formatValidationResult(result: ValidationResult): string {
    const lines: string[] = [];

    if (result.isValid) {
        lines.push('✅ Validação passou com sucesso!');
    } else {
        lines.push('❌ Validação falhou!');
        lines.push('');
    }

    if (result.errors.length > 0) {
        lines.push('🔴 ERROS:');
        result.errors.forEach(error => {
            lines.push(`  - [${error.stepId}] ${error.field}: ${error.message}`);
        });
        lines.push('');
    }

    if (result.warnings.length > 0) {
        lines.push('🟡 AVISOS:');
        result.warnings.forEach(warning => {
            lines.push(`  - [${warning.stepId}] ${warning.field}: ${warning.message}`);
        });
    }

    return lines.join('\n');
}
