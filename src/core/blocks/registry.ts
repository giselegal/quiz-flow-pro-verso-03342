/*
 Core registry de blocks: centraliza metadados, schema de propriedades e defaults.
 Inicial: cobre alguns tipos usados pelo EditorPro; expandível gradualmente.
*/

export type PropKind =
    | 'text'
    | 'textarea'
    | 'number'
    | 'range'
    | 'color'
    | 'select'
    | 'switch'
    | 'array'
    | 'object'
    | 'url';

export interface PropSchema {
    key: string;
    kind: PropKind;
    label: string;
    category: 'content' | 'style' | 'layout' | 'behavior' | 'advanced' | 'animation' | 'accessibility' | 'seo' | string;
    description?: string;
    placeholder?: string;
    required?: boolean;
    default?: any;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    options?: Array<{ value: any; label: string; disabled?: boolean }>;
    dependsOn?: string[];
    when?: { key: string; value: any };
}

export interface BlockDefinition {
    type: string;
    title: string;
    category: string;
    icon?: string;
    defaultProps: Record<string, any>;
    propsSchema: PropSchema[];
}

// helpers
const prop = (p: PropSchema): PropSchema => p;
const select = (key: string, label: string, options: Array<{ value: any; label: string }>, defaults?: Partial<PropSchema>): PropSchema => ({ key, kind: 'select', label, category: 'content', options, ...defaults });

export const blocksRegistry: Record<string, BlockDefinition> = {
    'quiz-intro-header': {
        type: 'quiz-intro-header',
        title: 'Header do Quiz',
        category: 'Estrutura',
        icon: 'note',
        defaultProps: {
            title: 'Descubra seu estilo',
            subtitle: 'Responda algumas perguntas e veja o resultado',
            showLogo: true,
            logoUrl: '',
            textAlign: 'center',
        },
        propsSchema: [
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Descubra seu estilo', required: true }),
            prop({ key: 'subtitle', kind: 'textarea', label: 'Subtítulo', category: 'content', default: 'Responda algumas perguntas e veja o resultado' }),
            prop({ key: 'showLogo', kind: 'switch', label: 'Mostrar Logo', category: 'content', default: true }),
            prop({ key: 'logoUrl', kind: 'url', label: 'URL do Logo', category: 'content', placeholder: 'https://...', default: '' }),
            select('textAlign', 'Alinhamento', [
                { value: 'left', label: 'Esquerda' },
                { value: 'center', label: 'Centro' },
                { value: 'right', label: 'Direita' },
            ], { category: 'layout', default: 'center' }),
            prop({ key: 'textColor', kind: 'color', label: 'Cor do Texto', category: 'style', default: '#432818' }),
        ],
    },
    'text': {
        type: 'text',
        title: 'Texto',
        category: 'Conteúdo',
        icon: 'doc',
        defaultProps: { text: 'Digite seu texto aqui...', fontSize: 16, textColor: '#432818' },
        propsSchema: [
            prop({ key: 'text', kind: 'text', label: 'Texto', category: 'content', default: 'Digite seu texto aqui...', required: true }),
            prop({ key: 'fontSize', kind: 'range', label: 'Tamanho da Fonte', category: 'style', min: 10, max: 48, step: 1, unit: 'px', default: 16 }),
            prop({ key: 'textColor', kind: 'color', label: 'Cor do Texto', category: 'style', default: '#432818' }),
        ],
    },
    'options-grid': {
        type: 'options-grid',
        title: 'Grade de Opções',
        category: 'Interação',
        icon: 'flash',
        defaultProps: {
            options: [
                { id: 'a', label: 'Opção A' },
                { id: 'b', label: 'Opção B' },
            ],
            columns: 2,
        },
        propsSchema: [
            prop({ key: 'columns', kind: 'range', label: 'Colunas', category: 'layout', min: 1, max: 4, step: 1, default: 2 }),
            // simplificado: edição inline de opções pode ser tratada por editor específico
        ],
    },
    'form-container': {
        type: 'form-container',
        title: 'Formulário',
        category: 'Captura',
        icon: 'note',
        defaultProps: {
            title: 'Fale com a gente',
            description: 'Preencha seus dados',
            submitText: 'Enviar',
        },
        propsSchema: [
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Fale com a gente' }),
            prop({ key: 'description', kind: 'textarea', label: 'Descrição', category: 'content', default: 'Preencha seus dados' }),
            prop({ key: 'submitText', kind: 'text', label: 'Texto do Botão', category: 'content', default: 'Enviar' }),
        ],
    },
    'result-header-inline': {
        type: 'result-header-inline',
        title: 'Header Resultado',
        category: 'Resultado',
        icon: 'target',
        defaultProps: {
            title: 'Seu estilo é...',
            subtitle: 'Veja abaixo como ele se manifesta',
            textAlign: 'center',
        },
        propsSchema: [
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Seu estilo é...' }),
            prop({ key: 'subtitle', kind: 'textarea', label: 'Subtítulo', category: 'content', default: 'Veja abaixo como ele se manifesta' }),
            select('textAlign', 'Alinhamento', [
                { value: 'left', label: 'Esquerda' },
                { value: 'center', label: 'Centro' },
                { value: 'right', label: 'Direita' },
            ], { category: 'layout', default: 'center' }),
        ],
    },
    'quiz-offer-cta-inline': {
        type: 'quiz-offer-cta-inline',
        title: 'CTA Oferta do Quiz',
        category: 'Conversão',
        icon: 'money',
        defaultProps: {
            text: 'Aproveite a oferta especial',
            buttonLabel: 'Quero agora',
            buttonUrl: '#',
        },
        propsSchema: [
            prop({ key: 'text', kind: 'textarea', label: 'Texto', category: 'content', default: 'Aproveite a oferta especial' }),
            prop({ key: 'buttonLabel', kind: 'text', label: 'Rótulo do Botão', category: 'content', default: 'Quero agora' }),
            prop({ key: 'buttonUrl', kind: 'url', label: 'URL do Botão', category: 'content', default: '#' }),
        ],
    },
    'benefits': {
        type: 'benefits',
        title: 'Benefícios',
        category: 'Vendas',
        icon: 'sparkle',
        defaultProps: {
            items: [
                { title: 'Benefício 1', description: 'Descrição breve' },
                { title: 'Benefício 2', description: 'Descrição breve' },
            ],
        },
        propsSchema: [
            prop({ key: 'items', kind: 'array', label: 'Itens', category: 'content', default: [] }),
        ],
    },
    'testimonials': {
        type: 'testimonials',
        title: 'Depoimentos',
        category: 'Social Proof',
        icon: 'chat',
        defaultProps: {
            items: [
                { quote: 'Fantástico!', author: 'Cliente A' },
                { quote: 'Mudou meu jogo.', author: 'Cliente B' },
            ],
        },
        propsSchema: [
            prop({ key: 'items', kind: 'array', label: 'Depoimentos', category: 'content', default: [] }),
        ],
    },
    'guarantee': {
        type: 'guarantee',
        title: 'Garantia',
        category: 'Confiança',
        icon: 'shield',
        defaultProps: {
            text: 'Garantia incondicional de 7 dias',
        },
        propsSchema: [
            prop({ key: 'text', kind: 'text', label: 'Texto', category: 'content', default: 'Garantia incondicional de 7 dias' }),
        ],
    },
    'hero': {
        type: 'hero',
        title: 'Hero Section',
        category: 'Layout',
        icon: 'rocket',
        defaultProps: {
            title: 'Título chamativo',
            subtitle: 'Subtítulo inspirador',
            backgroundUrl: '',
        },
        propsSchema: [
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Título chamativo' }),
            prop({ key: 'subtitle', kind: 'textarea', label: 'Subtítulo', category: 'content', default: 'Subtítulo inspirador' }),
            prop({ key: 'backgroundUrl', kind: 'url', label: 'Imagem de Fundo', category: 'style', default: '' }),
        ],
    },
};

export const getBlockDefinition = (type: string): BlockDefinition | undefined => blocksRegistry[type];
