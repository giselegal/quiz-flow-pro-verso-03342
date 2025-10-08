// Block Property Schema Definitions
// Esta primeira versão define um contrato tipado para propriedades de blocos
// permitindo geração automática de forms, validação e defaults.

export type BlockPrimitiveType = 'string' | 'number' | 'boolean' | 'select' | 'color' | 'enum' | 'richtext' | 'options-list';

export interface BasePropertySchema<T = any> {
    key: string;               // nome interno
    label: string;             // rótulo UI
    type: BlockPrimitiveType;  // tipo primário
    required?: boolean;        // obrigatório
    description?: string;      // ajuda curta
    default?: T;               // valor padrão
    placeholder?: string;      // placeholder input
    min?: number;              // limites numéricos
    max?: number;
    step?: number;
    pattern?: RegExp;          // validação regex
    enumValues?: string[];     // para enum/select
    optionsFetcher?: () => Promise<string[]>; // select dinâmico futuro
    hidden?: boolean;          // condicional
    advanced?: boolean;        // marcar se pertence a seção avançada
    group?: string;            // agrupar no form
    // Regra condicional simples (executada em runtime no form)
    when?: (current: Record<string, any>) => boolean;
    validate?: (value: any, current: Record<string, any>) => string | null; // retorna mensagem de erro
}

export interface BlockPropertyGroup {
    id: string;
    label: string;
    description?: string;
    order?: number;
}

export interface BlockPropertySchemaDefinition {
    type: string; // block type
    groups?: BlockPropertyGroup[];
    properties: BasePropertySchema[];
}

// Registro inicial mínimo por tipo de bloco existente
export const INITIAL_BLOCK_SCHEMAS: BlockPropertySchemaDefinition[] = [
    {
        type: 'heading',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 }
        ],
        properties: [
            { key: 'text', label: 'Texto', type: 'string', required: true, default: 'Novo Título', group: 'content' },
            { key: 'level', label: 'Nível', type: 'number', default: 2, min: 1, max: 6, group: 'style' },
            { key: 'textAlign', label: 'Alinhamento', type: 'select', enumValues: ['left', 'center', 'right'], default: 'center', group: 'style' },
            { key: 'color', label: 'Cor', type: 'color', default: '#432818', group: 'style' },
            { key: 'fontSize', label: 'Tamanho Fonte', type: 'string', default: '24px', group: 'style' }
        ]
    },
    {
        type: 'text',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 }
        ],
        properties: [
            { key: 'text', label: 'Texto', type: 'richtext', required: true, default: 'Novo texto', group: 'content' },
            { key: 'textAlign', label: 'Alinhamento', type: 'select', enumValues: ['left', 'center', 'right'], default: 'left', group: 'style' },
            { key: 'color', label: 'Cor', type: 'color', default: '#432818', group: 'style' },
            { key: 'fontSize', label: 'Tamanho Fonte', type: 'string', default: '16px', group: 'style' }
        ]
    },
    {
        type: 'image',
        groups: [{ id: 'content', label: 'Conteúdo', order: 1 }, { id: 'style', label: 'Estilo', order: 2 }],
        properties: [
            { key: 'src', label: 'URL', type: 'string', required: true, default: 'https://via.placeholder.com/400x300', group: 'content' },
            { key: 'alt', label: 'Alt', type: 'string', default: 'Imagem', group: 'content' },
            { key: 'width', label: 'Largura', type: 'string', default: '100%', group: 'style' },
            { key: 'borderRadius', label: 'Raio Borda', type: 'string', default: '8px', group: 'style' }
        ]
    },
    {
        type: 'button',
        groups: [{ id: 'content', label: 'Conteúdo', order: 1 }, { id: 'style', label: 'Estilo', order: 2 }, { id: 'logic', label: 'Lógica', order: 3 }],
        properties: [
            { key: 'text', label: 'Texto', type: 'string', required: true, default: 'Clique aqui', group: 'content' },
            { key: 'backgroundColor', label: 'Fundo', type: 'color', default: '#B89B7A', group: 'style' },
            { key: 'textColor', label: 'Cor Texto', type: 'color', default: '#FFFFFF', group: 'style' },
            { key: 'action', label: 'Ação', type: 'select', enumValues: ['next-step', 'open-url', 'submit-form'], default: 'next-step', group: 'logic' },
            { key: 'url', label: 'URL (se open-url)', type: 'string', group: 'logic', when: (current) => current.action === 'open-url' }
        ]
    },
    {
        type: 'quiz-options',
        groups: [{ id: 'content', label: 'Conteúdo', order: 1 }, { id: 'logic', label: 'Lógica', order: 2 }, { id: 'style', label: 'Estilo', order: 3 }],
        properties: [
            { key: 'options', label: 'Opções', type: 'options-list', required: true, default: [], group: 'content' },
            { key: 'multiSelect', label: 'Multi Seleção', type: 'boolean', default: true, group: 'logic' },
            { key: 'requiredSelections', label: 'Seleções Necessárias', type: 'number', default: 1, min: 1, group: 'logic', validate: (value, current) => (current.multiSelect && value < 1 ? 'Valor mínimo 1' : null) },
            { key: 'maxSelections', label: 'Máx Seleções', type: 'number', default: 3, min: 1, group: 'logic', when: (current) => current.multiSelect, validate: (value, current) => (current.multiSelect && value < (current.requiredSelections || 1) ? 'Máx não pode ser < necessárias' : null) },
            { key: 'autoAdvance', label: 'Auto Avançar', type: 'boolean', default: true, group: 'logic' },
            { key: 'showImages', label: 'Mostrar Imagens', type: 'boolean', default: true, group: 'style' },
            { key: 'layout', label: 'Layout', type: 'select', enumValues: ['auto', 'grid-2', 'grid-3'], default: 'auto', group: 'style' }
        ]
    },
    {
        type: 'form-input',
        groups: [{ id: 'content', label: 'Conteúdo', order: 1 }, { id: 'validation', label: 'Validação', order: 2 }],
        properties: [
            { key: 'label', label: 'Rótulo', type: 'string', required: true, default: 'Nome', group: 'content' },
            { key: 'placeholder', label: 'Placeholder', type: 'string', default: 'Digite aqui...', group: 'content' },
            { key: 'required', label: 'Obrigatório', type: 'boolean', default: true, group: 'validation' }
        ]
    },
    {
        type: 'container',
        groups: [{ id: 'style', label: 'Estilo', order: 1 }, { id: 'advanced', label: 'Avançado', order: 2 }],
        properties: [
            { key: 'backgroundColor', label: 'Fundo', type: 'color', default: '#F8F9FA', group: 'style' },
            { key: 'padding', label: 'Padding', type: 'string', default: '16px', group: 'style' },
            { key: 'borderRadius', label: 'Borda', type: 'string', default: '8px', group: 'style' }
        ]
    }
];

export const blockSchemaMap: Record<string, BlockPropertySchemaDefinition> = Object.fromEntries(
    INITIAL_BLOCK_SCHEMAS.map(def => [def.type, def])
);

export function getBlockSchema(type: string): BlockPropertySchemaDefinition | undefined {
    return blockSchemaMap[type];
}

export interface BlockValidationResult {
    valid: boolean;
    errors: string[];
}

export function validateBlock(type: string, values: Record<string, any>): BlockValidationResult {
    const schema = getBlockSchema(type);
    if (!schema) return { valid: true, errors: [] };
    const errors: string[] = [];
    for (const prop of schema.properties) {
        if (prop.when && !prop.when(values)) continue; // skip condicional
        const value = values[prop.key];
        if (prop.required && (value === undefined || value === null || value === '')) {
            errors.push(`${prop.label} é obrigatório`);
            continue;
        }
        if (prop.type === 'number' && value !== undefined) {
            if (typeof value !== 'number') errors.push(`${prop.label} deve ser número`);
            if (prop.min !== undefined && value < prop.min) errors.push(`${prop.label} mínimo ${prop.min}`);
            if (prop.max !== undefined && value > prop.max) errors.push(`${prop.label} máximo ${prop.max}`);
        }
        if (prop.pattern && value && !prop.pattern.test(String(value))) {
            errors.push(`${prop.label} formato inválido`);
        }
        if (prop.validate) {
            const msg = prop.validate(value, values);
            if (msg) errors.push(msg);
        }
    }
    return { valid: errors.length === 0, errors };
}
