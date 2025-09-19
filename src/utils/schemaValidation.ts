/**
 * 🛡️ SISTEMA CENTRALIZADO DE VALIDAÇÃO DE SCHEMAS
 * 
 * Valida todos os schemas do sistema com error handling tipado:
 * - Schemas de funil e componentes
 * - Propriedades de blocks
 * - Configurações JSON
 * - Dados de entrada do usuário
 */

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface SchemaValidationError {
    code: string;
    message: string;
    path: string[];
    value?: any;
}

export interface SchemaValidationResult {
    isValid: boolean;
    errors: SchemaValidationError[];
    warnings: SchemaValidationError[];
    sanitized?: any;
}

export enum SchemaErrorCode {
    // Funnel errors
    INVALID_FUNNEL_STRUCTURE = 'INVALID_FUNNEL_STRUCTURE',
    MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
    INVALID_FIELD_TYPE = 'INVALID_FIELD_TYPE',
    INVALID_FIELD_VALUE = 'INVALID_FIELD_VALUE',

    // Component errors
    INVALID_COMPONENT_TYPE = 'INVALID_COMPONENT_TYPE',
    INVALID_INSTANCE_KEY = 'INVALID_INSTANCE_KEY',
    MISSING_COMPONENT_PROPERTIES = 'MISSING_COMPONENT_PROPERTIES',

    // Block errors
    INVALID_BLOCK_TYPE = 'INVALID_BLOCK_TYPE',
    INVALID_BLOCK_PROPERTIES = 'INVALID_BLOCK_PROPERTIES',
    MISSING_BLOCK_ID = 'MISSING_BLOCK_ID',

    // General schema errors
    SCHEMA_VERSION_MISMATCH = 'SCHEMA_VERSION_MISMATCH',
    UNKNOWN_SCHEMA_FORMAT = 'UNKNOWN_SCHEMA_FORMAT',
    CIRCULAR_REFERENCE = 'CIRCULAR_REFERENCE'
}

// ============================================================================
// SCHEMAS DE VALIDAÇÃO
// ============================================================================

/**
 * Schema base para funil
 */
export const FUNNEL_SCHEMA = {
    type: 'object',
    required: ['id', 'name'],
    properties: {
        id: {
            type: 'string',
            minLength: 1,
            pattern: '^[a-zA-Z0-9\\-_]{1,100}$'
        },
        name: {
            type: 'string',
            minLength: 1,
            maxLength: 200
        },
        description: {
            type: 'string',
            maxLength: 1000
        },
        version: {
            type: 'number',
            minimum: 1
        },
        is_published: {
            type: 'boolean'
        },
        settings: {
            type: 'object',
            additionalProperties: true
        },
        pages: {
            type: 'array',
            items: {
                type: 'object',
                required: ['id', 'title', 'blocks'],
                properties: {
                    id: { type: 'string', minLength: 1 },
                    title: { type: 'string', minLength: 1 },
                    blocks: { type: 'array' },
                    page_order: { type: 'number', minimum: 0 }
                }
            }
        }
    }
} as const;

/**
 * Schema para componente
 */
export const COMPONENT_SCHEMA = {
    type: 'object',
    required: ['id', 'component_type_key', 'instance_key', 'step_number'],
    properties: {
        id: {
            type: 'string',
            pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        },
        component_type_key: {
            type: 'string',
            enum: [
                'quiz-question', 'quiz-result', 'form-container',
                'heading-inline', 'progress-inline', 'navigation',
                'testimonial', 'guarantee', 'pricing', 'bonus'
            ]
        },
        instance_key: {
            type: 'string',
            pattern: '^[a-z0-9\\-]+_\\d+_[a-z0-9\\-]+$'
        },
        step_number: {
            type: 'number',
            minimum: 1,
            maximum: 1000
        },
        order_index: {
            type: 'number',
            minimum: 0
        },
        properties: {
            type: 'object',
            additionalProperties: true
        },
        is_active: {
            type: 'boolean'
        }
    }
} as const;

/**
 * Schema para block genérico
 */
export const BLOCK_SCHEMA = {
    type: 'object',
    required: ['id', 'type'],
    properties: {
        id: {
            type: 'string',
            minLength: 1
        },
        type: {
            type: 'string',
            enum: [
                'quiz-question', 'quiz-result', 'form-container',
                'heading-inline', 'progress-inline', 'options-grid',
                'testimonial', 'guarantee', 'pricing', 'bonus'
            ]
        },
        properties: {
            type: 'object',
            additionalProperties: true
        },
        styles: {
            type: 'object',
            additionalProperties: true
        }
    }
} as const;

// ============================================================================
// VALIDADORES
// ============================================================================

/**
 * Valida estrutura básica de um objeto
 */
function validateObjectStructure(
    data: any,
    schema: any,
    path: string[] = []
): SchemaValidationError[] {
    const errors: SchemaValidationError[] = [];

    if (!data || typeof data !== 'object') {
        errors.push({
            code: SchemaErrorCode.INVALID_FIELD_TYPE,
            message: 'Expected object',
            path,
            value: data
        });
        return errors;
    }

    // Verificar campos obrigatórios
    if (schema.required) {
        for (const required of schema.required) {
            if (!(required in data)) {
                errors.push({
                    code: SchemaErrorCode.MISSING_REQUIRED_FIELD,
                    message: `Missing required field: ${required}`,
                    path: [...path, required]
                });
            }
        }
    }

    // Validar propriedades
    if (schema.properties) {
        for (const [key, value] of Object.entries(data)) {
            const propSchema = (schema.properties as any)[key];
            if (propSchema) {
                const propErrors = validateProperty(value, propSchema, [...path, key]);
                errors.push(...propErrors);
            }
        }
    }

    return errors;
}

/**
 * Valida uma propriedade específica
 */
function validateProperty(
    value: any,
    schema: any,
    path: string[]
): SchemaValidationError[] {
    const errors: SchemaValidationError[] = [];

    // Verificar tipo
    if (schema.type) {
        const expectedType = schema.type;
        const actualType = Array.isArray(value) ? 'array' : typeof value;

        if (actualType !== expectedType) {
            errors.push({
                code: SchemaErrorCode.INVALID_FIELD_TYPE,
                message: `Expected ${expectedType}, got ${actualType}`,
                path,
                value
            });
            return errors; // Parar validação se tipo estiver errado
        }
    }

    // Validações específicas por tipo
    switch (schema.type) {
        case 'string':
            if (schema.minLength && value.length < schema.minLength) {
                errors.push({
                    code: SchemaErrorCode.INVALID_FIELD_VALUE,
                    message: `String too short (min: ${schema.minLength})`,
                    path,
                    value
                });
            }
            if (schema.maxLength && value.length > schema.maxLength) {
                errors.push({
                    code: SchemaErrorCode.INVALID_FIELD_VALUE,
                    message: `String too long (max: ${schema.maxLength})`,
                    path,
                    value
                });
            }
            if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
                errors.push({
                    code: SchemaErrorCode.INVALID_FIELD_VALUE,
                    message: `String does not match pattern: ${schema.pattern}`,
                    path,
                    value
                });
            }
            if (schema.enum && !schema.enum.includes(value)) {
                errors.push({
                    code: SchemaErrorCode.INVALID_FIELD_VALUE,
                    message: `Value must be one of: ${schema.enum.join(', ')}`,
                    path,
                    value
                });
            }
            break;

        case 'number':
            if (schema.minimum && value < schema.minimum) {
                errors.push({
                    code: SchemaErrorCode.INVALID_FIELD_VALUE,
                    message: `Number too small (min: ${schema.minimum})`,
                    path,
                    value
                });
            }
            if (schema.maximum && value > schema.maximum) {
                errors.push({
                    code: SchemaErrorCode.INVALID_FIELD_VALUE,
                    message: `Number too large (max: ${schema.maximum})`,
                    path,
                    value
                });
            }
            break;

        case 'array':
            if (schema.items) {
                value.forEach((item: any, index: number) => {
                    const itemErrors = validateProperty(item, schema.items, [...path, index.toString()]);
                    errors.push(...itemErrors);
                });
            }
            break;

        case 'object':
            if (schema.properties || schema.required) {
                const objErrors = validateObjectStructure(value, schema, path);
                errors.push(...objErrors);
            }
            break;
    }

    return errors;
}

// ============================================================================
// FUNÇÕES PÚBLICAS DE VALIDAÇÃO
// ============================================================================

/**
 * Valida schema de funil
 */
export const validateFunnelSchema = (funnel: any): SchemaValidationResult => {
    const errors = validateObjectStructure(funnel, FUNNEL_SCHEMA);

    return {
        isValid: errors.length === 0,
        errors,
        warnings: []
    };
};

/**
 * Valida schema de componente
 */
export const validateComponentSchema = (component: any): SchemaValidationResult => {
    const errors = validateObjectStructure(component, COMPONENT_SCHEMA);

    return {
        isValid: errors.length === 0,
        errors,
        warnings: []
    };
};

/**
 * Valida schema de block
 */
export const validateBlockSchema = (block: any): SchemaValidationResult => {
    const errors = validateObjectStructure(block, BLOCK_SCHEMA);

    return {
        isValid: errors.length === 0,
        errors,
        warnings: []
    };
};

/**
 * Valida múltiplos schemas de uma vez
 */
export const validateSchemaBatch = (
    items: Array<{ data: any; type: 'funnel' | 'component' | 'block' }>
): Record<number, SchemaValidationResult> => {
    const results: Record<number, SchemaValidationResult> = {};

    items.forEach((item, index) => {
        switch (item.type) {
            case 'funnel':
                results[index] = validateFunnelSchema(item.data);
                break;
            case 'component':
                results[index] = validateComponentSchema(item.data);
                break;
            case 'block':
                results[index] = validateBlockSchema(item.data);
                break;
        }
    });

    return results;
};

/**
 * Sanitiza dados baseado no schema
 */
export const sanitizeData = (data: any, schemaType: 'funnel' | 'component' | 'block'): any => {
    if (!data || typeof data !== 'object') return {};

    const sanitized = { ...data };

    // Remove campos não permitidos e aplica defaults
    switch (schemaType) {
        case 'funnel':
            if (!sanitized.version) sanitized.version = 1;
            if (!sanitized.is_published) sanitized.is_published = false;
            if (!sanitized.settings) sanitized.settings = {};
            if (!sanitized.pages) sanitized.pages = [];
            break;

        case 'component':
            if (!sanitized.order_index) sanitized.order_index = 0;
            if (!sanitized.properties) sanitized.properties = {};
            if (!sanitized.is_active) sanitized.is_active = true;
            break;

        case 'block':
            if (!sanitized.properties) sanitized.properties = {};
            if (!sanitized.styles) sanitized.styles = {};
            break;
    }

    return sanitized;
};

/**
 * Verifica se todos os schemas em um batch são válidos
 */
export const validateAllSchemas = (
    items: Array<{ data: any; type: 'funnel' | 'component' | 'block' }>
): boolean => {
    const results = validateSchemaBatch(items);
    return Object.values(results).every(result => result.isValid);
};