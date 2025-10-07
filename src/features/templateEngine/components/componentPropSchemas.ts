
// Registry de schemas de propriedades para geração dinâmica de formulário
// Simplificado: apenas tipos primitivos e arrays de objetos simples.

export type FieldType = 'string' | 'boolean' | 'number' | 'text' | 'json' | 'optionsArray';

export interface FieldSchema {
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
    description?: string;
    minItems?: number;
}

export interface ComponentSchema {
    kind: string;
    fields: FieldSchema[];
}

// Definições iniciais – futuramente pode vir do servidor
export const componentPropSchemas: Record<string, ComponentSchema> = {
    Header: {
        kind: 'Header',
        fields: [
            { name: 'title', label: 'Título', type: 'string', required: true },
            { name: 'subtitle', label: 'Subtítulo', type: 'string' },
            { name: 'description', label: 'Descrição', type: 'text' },
            { name: 'showProgress', label: 'Mostrar Progresso', type: 'boolean' }
        ]
    },
    Navigation: {
        kind: 'Navigation',
        fields: [
            { name: 'showNext', label: 'Mostrar Próximo', type: 'boolean', required: true },
            { name: 'showPrevious', label: 'Mostrar Voltar', type: 'boolean' },
            { name: 'nextButtonText', label: 'Texto Botão Próximo', type: 'string', placeholder: 'Avançar' }
        ]
    },
    QuestionSingle: {
        kind: 'QuestionSingle',
        fields: [
            { name: 'title', label: 'Título', type: 'string', required: true },
            { name: 'subtitle', label: 'Subtítulo', type: 'string' },
            { name: 'required', label: 'Obrigatória', type: 'boolean' },
            { name: 'options', label: 'Opções', type: 'optionsArray', minItems: 2, description: 'Lista de opções (id, label, points opcional)' }
        ]
    },
    QuestionMulti: {
        kind: 'QuestionMulti',
        fields: [
            { name: 'title', label: 'Título', type: 'string', required: true },
            { name: 'subtitle', label: 'Subtítulo', type: 'string' },
            { name: 'required', label: 'Obrigatória', type: 'boolean' },
            { name: 'maxSelections', label: 'Máx. Seleções', type: 'number', description: 'Deixar vazio para ilimitado' },
            { name: 'options', label: 'Opções', type: 'optionsArray', minItems: 2 }
        ]
    },
    Transition: {
        kind: 'Transition',
        fields: [
            { name: 'message', label: 'Mensagem', type: 'text', required: true },
            { name: 'variant', label: 'Variante (info/success/warning)', type: 'string' },
            { name: 'showDivider', label: 'Mostrar Divider', type: 'boolean' },
            { name: 'showButton', label: 'Mostrar Botão', type: 'boolean' },
            { name: 'buttonText', label: 'Texto Botão', type: 'string' }
        ]
    },
    ResultPlaceholder: {
        kind: 'ResultPlaceholder',
        fields: [
            { name: 'template', label: 'Template', type: 'text', required: true, placeholder: 'Seu resultado: {{score}}' }
        ]
    },
    RawLegacyBundle: {
        kind: 'RawLegacyBundle',
        fields: [
            { name: 'blocks', label: 'Blocks (JSON)', type: 'json' },
            { name: 'legacyStepId', label: 'Legacy Step Id', type: 'string' }
        ]
    }
};

export function getComponentSchema(kind: string | undefined) {
    if (!kind) return undefined;
    return componentPropSchemas[kind];
}
