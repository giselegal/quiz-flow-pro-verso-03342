import { nanoid } from 'nanoid';
import { CORE_BLOCK_TYPES, type BlockType } from './blockTypes';
import { blockSchemas } from './blockSchemas';

export interface BlockFactoryContext {
    partial?: boolean; // se true, não preenche defaults ausentes
}

export type BlockInstance = ReturnType<typeof createBlock>;

export function createBlock(type: BlockType, overrides: any = {}, ctx: BlockFactoryContext = {}) {
    const id = overrides.id || `${type}-${nanoid(6)}`;
    // defaults mínimos
    const base: any = {
        id,
        type,
        properties: {},
        content: {},
        order: overrides.order ?? 0
    };

    switch (type) {
        case 'heading':
            base.properties = { text: 'Título', level: 1, align: 'center', ...overrides.properties };
            break;
        case 'image':
            base.properties = { src: '', alt: '', rounded: true, ...overrides.properties };
            break;
        case 'input':
            base.properties = { name: 'nome', label: 'Nome', placeholder: 'Digite...', required: true, variant: 'text', ...overrides.properties };
            break;
        case 'button':
            base.properties = { text: 'Continuar', action: 'next', fullWidth: true, ...overrides.properties };
            break;
        case 'quiz-question-inline':
            base.properties = {
                title: 'Pergunta',
                options: [],
                variant: 'default',
                ...overrides.properties
            };
            break;
        case 'quiz-transition':
            base.properties = { label: 'Transição', ...overrides.properties };
            break;
        case 'quiz-result':
            base.properties = { title: 'Resultados', ...overrides.properties };
            break;
        case 'quiz-offer':
            base.properties = { title: 'Oferta', ...overrides.properties };
            break;
        default:
            throw new Error(`Unsupported block type: ${type}`);
    }

    const candidate = { ...base, ...overrides, properties: base.properties };
    if (!ctx.partial) {
        const schema = (blockSchemas as any)[type];
        const parsed = schema.safeParse(candidate);
        if (!parsed.success) {
            console.warn('[blockRegistry] invalid block generated', parsed.error.flatten());
            return candidate; // devolve bruto mesmo assim para debug
        }
        return parsed.data;
    }
    return candidate;
}

export const blockRegistry = {
    supported: CORE_BLOCK_TYPES,
    create: createBlock
};
