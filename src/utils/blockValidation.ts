/**
 * 🧪 UTILITÁRIOS DE VALIDAÇÃO DE BLOCOS
 * Funções auxiliares para validação e sanitização das propriedades dos blocos
 * 
 * 🔄 CONSOLIDATION UPDATE:
 * - ValidationResult agora usa tipos unificados de @/types/core
 * - Mantém funcionalidades existentes com tipos consolidados
 */

import { BlockType } from '@/types/editor';
import { ValidationResult } from '@/types/core';

/**
 * Valida propriedades de um bloco específico
 */
export function validateBlockProperties(
    blockType: BlockType,
    properties: Record<string, any> | null,
    options?: {
        relatedBlocks?: any[];
        context?: Record<string, any>;
    }
): ValidationResult {
    if (!properties) {
        return {
            isValid: false,
            errors: ['Propriedades não fornecidas'],
            warnings: []
        };
    }

    // Verificar se o tipo de bloco é reconhecido
    if (!isValidBlockType(blockType)) {
        return {
            isValid: false,
            errors: ['Tipo de bloco não reconhecido'],
            warnings: []
        };
    }

    // Verificar propriedades circulares
    if (hasCircularReference(properties)) {
        return {
            isValid: false,
            errors: ['Propriedades contêm referência circular'],
            warnings: []
        };
    }

    const validator = getValidatorForBlockType(blockType);
    return validator(properties, options);
}

/**
 * Obtém propriedades padrão para um tipo de bloco
 */
export function getDefaultPropertiesForBlock(
    blockType: BlockType,
    context?: Record<string, any>
): Record<string, any> {
    const baseDefaults = getBaseDefaultProperties(blockType);

    if (context) {
        return applyContextualDefaults(baseDefaults, context);
    }

    return baseDefaults;
}

/**
 * Sanitiza propriedades removendo conteúdo perigoso
 */
export function sanitizeBlockProperties(
    blockType: BlockType,
    properties: Record<string, any>
): Record<string, any> {
    const sanitized = { ...properties };

    // Sanitizar strings HTML
    Object.keys(sanitized).forEach(key => {
        if (typeof sanitized[key] === 'string') {
            sanitized[key] = sanitizeHtml(sanitized[key]);
        }
    });

    // Sanitizar URLs
    ['imageUrl', 'linkUrl', 'src', 'href'].forEach(urlKey => {
        if (sanitized[urlKey]) {
            sanitized[urlKey] = sanitizeUrl(sanitized[urlKey]);
        }
    });

    // Normalizar valores numéricos
    normalizeNumericValues(sanitized, blockType);

    // Limpar strings
    cleanStringValues(sanitized);

    return sanitized;
}

// =============================================
// VALIDATORS POR TIPO DE BLOCO
// =============================================

function getValidatorForBlockType(blockType: BlockType) {
    const validators: Partial<Record<BlockType, (props: any, options?: any) => ValidationResult>> = {

        // ETAPA 1
        'quiz-intro-header': validateQuizIntroHeader,
        'text-inline': validateTextInline,
        'form-input': validateFormInput,
        'button-inline': validateButtonInline,

        // ETAPAS 2-11
        'quiz-question-inline': validateQuizQuestion,
        'options-grid': validateOptionsGrid,

        // ETAPA 12
        'quiz-navigation': validateQuizNavigation,

        // ETAPAS 13-18
        'heading-inline': validateHeadingInline,

        // ETAPA 19
        'progress-inline': validateProgressInline,

        // ETAPA 20
        'step20-result-header': validateStep20ResultHeader,
        'step20-style-reveal': validateStep20StyleReveal,
        'step20-user-greeting': validateStep20UserGreeting,
        'step20-compatibility': validateStep20Compatibility,
        'step20-secondary-styles': validateStep20SecondaryStyles,
        'step20-personalized-offer': validateStep20PersonalizedOffer,

        // ETAPA 21
        'urgency-timer-inline': validateUrgencyTimer,
        'before-after-inline': validateBeforeAfter,
        'bonus': validateBonus,
        'secure-purchase': validateSecurePurchase,
        'value-anchoring': validateValueAnchoring,
        'mentor-section-inline': validateMentorSection,

        // GERAIS
        'image-inline': validateImageInline,
        'spacer-inline': validateSpacerInline,
        'legal-notice-inline': validateLegalNotice
    };

    return validators[blockType] || validateGeneric;
}

// =============================================
// IMPLEMENTAÇÕES DOS VALIDATORS
// =============================================

function validateQuizIntroHeader(props: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!props.title || props.title.trim() === '') {
        errors.push('Título é obrigatório');
    } else if (props.title.length > 100) {
        errors.push('Título muito longo (máximo 100 caracteres)');
    }

    if (props.subtitle && props.subtitle.length > 200) {
        errors.push('Subtítulo muito longo (máximo 200 caracteres)');
    }

    if (props.backgroundColor && !isValidColor(props.backgroundColor)) {
        errors.push('Cor de fundo inválida');
    }

    if (props.textColor && !isValidColor(props.textColor)) {
        errors.push('Cor do texto inválida');
    }

    return { isValid: errors.length === 0, errors, warnings };
}

function validateTextInline(props: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!props.text) {
        errors.push('Texto é obrigatório');
    } else if (props.text.length > 10000) {
        errors.push('Texto muito longo');
    }

    if (props.fontSize && !isValidFontSize(props.fontSize)) {
        errors.push('Tamanho de fonte inválido');
    }

    if (props.color && !isValidColor(props.color)) {
        errors.push('Cor inválida');
    }

    return { isValid: errors.length === 0, errors, warnings };
}

function validateFormInput(props: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!props.label || props.label.trim() === '') {
        errors.push('Label é obrigatório');
    }

    if (props.type && !['text', 'email', 'number', 'tel', 'url'].includes(props.type)) {
        errors.push('Tipo de input inválido');
    }

    if (props.minLength && (props.minLength < 0 || props.minLength > 1000)) {
        errors.push('minLength deve estar entre 0 e 1000');
    }

    if (props.maxLength && (props.maxLength < 1 || props.maxLength > 5000)) {
        errors.push('maxLength deve estar entre 1 e 5000');
    }

    return { isValid: errors.length === 0, errors, warnings };
}

function validateQuizQuestion(props: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!props.question || props.question.trim() === '') {
        errors.push('Pergunta é obrigatória');
    }

    if (props.maxSelections && props.maxSelections < 1) {
        errors.push('Máximo de seleções deve ser maior que 0');
    }

    if (props.minSelections && props.minSelections < 0) {
        errors.push('Mínimo de seleções não pode ser negativo');
    }

    if (props.maxSelections && props.minSelections && props.maxSelections < props.minSelections) {
        errors.push('Máximo de seleções deve ser maior que mínimo');
    }

    return { isValid: errors.length === 0, errors, warnings };
}

function validateStep20Compatibility(props: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (typeof props.percentage !== 'number' || props.percentage < 0 || props.percentage > 100) {
        errors.push('Percentual deve ser um número entre 0 e 100');
    }

    if (props.color && !isValidColor(props.color)) {
        errors.push('Cor inválida');
    }

    if (props.animationDuration && (props.animationDuration < 100 || props.animationDuration > 10000)) {
        errors.push('Duração da animação deve estar entre 100ms e 10s');
    }

    return { isValid: errors.length === 0, errors, warnings };
}

function validateStep20PersonalizedOffer(props: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!props.offerTitle || props.offerTitle.trim() === '') {
        errors.push('Título da oferta é obrigatório');
    }

    if (props.showDiscount && props.discountPercentage) {
        if (props.discountPercentage < 0 || props.discountPercentage > 100) {
            errors.push('Percentual de desconto deve estar entre 0 e 100');
        }

        // Verificar consistência de preços
        if (props.originalPrice && props.discountedPrice) {
            const original = parseFloat(props.originalPrice);
            const discounted = parseFloat(props.discountedPrice);

            if (discounted >= original) {
                errors.push('Preço com desconto deve ser menor que preço original');
            }
        }
    }

    return { isValid: errors.length === 0, errors, warnings };
}

function validateUrgencyTimer(props: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!props.deadline) {
        errors.push('Data limite é obrigatória');
    } else {
        const deadlineDate = new Date(props.deadline);
        if (isNaN(deadlineDate.getTime())) {
            errors.push('Data limite inválida');
        } else if (deadlineDate <= new Date()) {
            errors.push('Data limite deve estar no futuro');
        }
    }

    return { isValid: errors.length === 0, errors, warnings };
}

function validateValueAnchoring(props: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!props.originalPrice) {
        errors.push('Preço original é obrigatório');
    }

    if (!props.currentPrice) {
        errors.push('Preço atual é obrigatório');
    }

    if (props.originalPrice && props.currentPrice) {
        const original = parseFloat(props.originalPrice);
        const current = parseFloat(props.currentPrice);

        if (current >= original) {
            warnings.push('Preço atual não é menor que preço original');
        }
    }

    return { isValid: errors.length === 0, errors, warnings };
}

// Validators genéricos para outros tipos
function validateGeneric(_props: any): ValidationResult {
    return { isValid: true, errors: [], warnings: [] };
}

function validateButtonInline(props: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!props.text || props.text.trim() === '') {
        errors.push('Texto do botão é obrigatório');
    }

    return { isValid: errors.length === 0, errors, warnings };
}

function validateOptionsGrid(props: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!props.options || !Array.isArray(props.options)) {
        errors.push('Opções devem ser um array');
    } else {
        props.options.forEach((option: any, index: number) => {
            if (!option.value) {
                errors.push(`Opção ${index + 1}: valor é obrigatório`);
            }
            if (!option.label) {
                errors.push(`Opção ${index + 1}: label é obrigatório`);
            }
            if (option.points && typeof option.points !== 'object') {
                errors.push(`Opção ${index + 1}: pontos devem ser um objeto`);
            }
        });
    }

    return { isValid: errors.length === 0, errors, warnings };
}

function validateQuizNavigation(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }
function validateHeadingInline(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }
function validateProgressInline(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }
function validateStep20ResultHeader(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }
function validateStep20StyleReveal(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }
function validateStep20UserGreeting(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }
function validateStep20SecondaryStyles(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }
function validateBeforeAfter(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }
function validateBonus(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }
function validateSecurePurchase(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }
function validateMentorSection(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }
function validateImageInline(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }
function validateSpacerInline(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }
function validateLegalNotice(_props: any): ValidationResult { return { isValid: true, errors: [], warnings: [] }; }

// =============================================
// FUNÇÕES AUXILIARES
// =============================================

function isValidBlockType(blockType: string): blockType is BlockType {
    const validTypes = [
        'quiz-intro-header', 'text-inline', 'form-input', 'button-inline',
        'quiz-question-inline', 'options-grid', 'quiz-navigation',
        'heading-inline', 'progress-inline',
        'step20-result-header', 'step20-style-reveal', 'step20-user-greeting',
        'step20-compatibility', 'step20-secondary-styles', 'step20-personalized-offer',
        'urgency-timer-inline', 'before-after-inline', 'bonus',
        'secure-purchase', 'value-anchoring', 'mentor-section-inline',
        'image-inline', 'spacer-inline', 'legal-notice-inline'
    ];
    return validTypes.includes(blockType as BlockType);
}

function hasCircularReference(obj: any, seen = new WeakSet()): boolean {
    if (obj && typeof obj === 'object') {
        if (seen.has(obj)) return true;
        seen.add(obj);

        for (const key in obj) {
            if (hasCircularReference(obj[key], seen)) return true;
        }
    }
    return false;
}

function isValidColor(color: string): boolean {
    // Hex colors
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) return true;

    // RGB/RGBA colors  
    if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)$/.test(color)) return true;

    // HSL/HSLA colors
    if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%(?:\s*,\s*[\d.]+)?\s*\)$/.test(color)) return true;

    // Named colors
    const namedColors = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'gray', 'brown'];
    return namedColors.includes(color.toLowerCase());
}

function isValidFontSize(fontSize: string): boolean {
    return /^\d+(px|em|rem|%)$/.test(fontSize);
}

function sanitizeHtml(str: string): string {
    return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
}

function sanitizeUrl(url: string): string {
    if (!url) return '';

    // Bloquear protocolos perigosos
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    const lowerUrl = url.toLowerCase();

    if (dangerousProtocols.some(protocol => lowerUrl.startsWith(protocol))) {
        return '';
    }

    // Permitir apenas HTTP/HTTPS e protocolos seguros
    if (!lowerUrl.startsWith('http://') &&
        !lowerUrl.startsWith('https://') &&
        !lowerUrl.startsWith('/') &&
        !lowerUrl.startsWith('./')) {
        return `https://${url}`;
    }

    return url;
}

function normalizeNumericValues(props: Record<string, any>, _blockType: BlockType) {
    // Converter strings numéricas para números
    ['percentage', 'maxSelections', 'minSelections', 'order', 'level'].forEach(key => {
        if (props[key] && typeof props[key] === 'string') {
            const num = parseFloat(props[key]);
            if (!isNaN(num)) props[key] = num;
        }
    });

    // Garantir valores dentro de ranges
    if (props.percentage) {
        props.percentage = Math.max(0, Math.min(100, props.percentage));
    }

    if (props.maxSelections) {
        props.maxSelections = Math.max(1, props.maxSelections);
    }

    if (props.order) {
        props.order = Math.max(0, Math.floor(props.order));
    }
}

function cleanStringValues(props: Record<string, any>) {
    Object.keys(props).forEach(key => {
        if (typeof props[key] === 'string') {
            props[key] = props[key].trim();
            // Limitar comprimento excessivo
            if (props[key].length > 50000) {
                props[key] = props[key].substring(0, 50000);
            }
        }
    });
}

function getBaseDefaultProperties(_blockType: BlockType): Record<string, any> {
    // Esta função retornaria as propriedades padrão base
    // (implementação similar à que já existe nos testes)
    return {};
}

function applyContextualDefaults(baseDefaults: Record<string, any>, _context: Record<string, any>) {
    // Aplicar contexto específico às propriedades padrão
    return { ...baseDefaults };
}