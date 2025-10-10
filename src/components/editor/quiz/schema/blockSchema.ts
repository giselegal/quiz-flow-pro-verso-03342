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
            { key: 'allowHtml', label: 'Permitir HTML', type: 'boolean', default: false, group: 'content', advanced: true, description: 'Habilita interpretação de spans estilizadas (sanitizado)' },
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
            { key: 'height', label: 'Altura', type: 'string', default: 'auto', group: 'style' },
            { key: 'alignment', label: 'Alinhamento', type: 'select', enumValues: ['left', 'center', 'right'], default: 'center', group: 'style' },
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
            { key: 'showNextButton', label: 'Mostrar Botão Avançar', type: 'boolean', default: true, group: 'logic' },
            { key: 'enableButtonOnlyWhenValid', label: 'Habilitar Botão quando Válido', type: 'boolean', default: true, group: 'logic' },
            { key: 'nextButtonText', label: 'Texto do Botão', type: 'string', default: 'Avançar', group: 'content' },
            { key: 'showImages', label: 'Mostrar Imagens', type: 'boolean', default: true, group: 'style' },
            { key: 'layout', label: 'Layout', type: 'select', enumValues: ['auto', 'grid-2', 'grid-3'], default: 'auto', group: 'style' },
            // Cores e tamanho (aplicadas no preview via CSS vars e estilos inline)
            { key: 'selectedColor', label: 'Cor Selecionado', type: 'color', default: '#deac6d', group: 'style' },
            { key: 'hoverColor', label: 'Cor Hover', type: 'color', default: '#d4a05a', group: 'style' },
            { key: 'imageMaxWidth', label: 'Largura Máx. Imagem (px)', type: 'number', default: 200, min: 40, group: 'style', when: (c) => c.showImages },
            { key: 'imageMaxHeight', label: 'Altura Máx. Imagem (px)', type: 'number', default: 160, min: 40, group: 'style', when: (c) => c.showImages }
        ]
    },
    {
        type: 'form-input',
        groups: [{ id: 'content', label: 'Conteúdo', order: 1 }, { id: 'validation', label: 'Validação', order: 2 }, { id: 'style', label: 'Estilo', order: 3 }],
        properties: [
            { key: 'label', label: 'Rótulo', type: 'string', required: true, default: 'Nome', group: 'content' },
            { key: 'placeholder', label: 'Placeholder', type: 'string', default: 'Digite aqui...', group: 'content' },
            { key: 'name', label: 'Nome do Campo', type: 'string', default: 'field', group: 'content' },
            { key: 'inputType', label: 'Tipo de Entrada', type: 'select', enumValues: ['text', 'email', 'tel'], default: 'text', group: 'content' },
            { key: 'required', label: 'Obrigatório', type: 'boolean', default: true, group: 'validation' },
            { key: 'minLength', label: 'Mín. caracteres', type: 'number', default: 0, min: 0, group: 'validation' },
            { key: 'maxLength', label: 'Máx. caracteres', type: 'number', default: 100, min: 1, group: 'validation' },
            { key: 'fullWidth', label: 'Largura Total', type: 'boolean', default: true, group: 'style' }
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
    },
    {
        type: 'progress-header',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'appearance', label: 'Aparência', order: 2 },
            { id: 'logic', label: 'Lógica', order: 3 }
        ],
        properties: [
            { key: 'showLogo', label: 'Exibir Logo', type: 'boolean', default: true, group: 'content' },
            { key: 'logoUrl', label: 'Logo URL', type: 'string', default: 'https://via.placeholder.com/120x40?text=Logo', group: 'content', when: c => c.showLogo },
            { key: 'logoWidth', label: 'Largura Logo', type: 'string', default: '120px', group: 'appearance', when: c => c.showLogo },
            { key: 'progressEnabled', label: 'Exibir Barra', type: 'boolean', default: true, group: 'logic' },
            { key: 'progressPercent', label: 'Porcentagem', type: 'number', default: 0, min: 0, max: 100, group: 'logic', when: c => c.progressEnabled },
            { key: 'autoProgress', label: 'Auto (etapas)', type: 'boolean', default: true, group: 'logic', when: c => c.progressEnabled, description: 'Calcula % baseado na posição da etapa atual' },
            { key: 'barHeight', label: 'Espessura Barra', type: 'string', default: '4px', group: 'appearance', when: c => c.progressEnabled },
            { key: 'barColor', label: 'Cor Barra', type: 'color', default: '#D4AF37', group: 'appearance', when: c => c.progressEnabled },
            { key: 'barBackground', label: 'Fundo Barra', type: 'color', default: '#E5E7EB', group: 'appearance', when: c => c.progressEnabled }
        ]
    }
    ,
    // ===================== Tipos do template 21-steps =====================
    {
        type: 'quiz-intro-header',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 },
            { id: 'layout', label: 'Layout', order: 3 },
            { id: 'behavior', label: 'Comportamento', order: 4 }
        ],
        properties: [
            // Conteúdo
            { key: 'showLogo', label: 'Exibir Logo', type: 'boolean', default: true, group: 'content' },
            { key: 'showProgress', label: 'Mostrar Progresso', type: 'boolean', default: false, group: 'content' },
            { key: 'showNavigation', label: 'Mostrar Navegação', type: 'boolean', default: false, group: 'content' },
            // Estilo
            { key: 'backgroundColor', label: 'Fundo', type: 'color', default: '#F8F9FA', group: 'style' },
            { key: 'textAlign', label: 'Alinhamento', type: 'select', enumValues: ['left', 'center', 'right'], default: 'center', group: 'style' },
            { key: 'showBackground', label: 'Mostrar Fundo', type: 'boolean', default: true, group: 'style' },
            { key: 'boxShadow', label: 'Sombra', type: 'select', enumValues: ['none', 'sm', 'md', 'lg'], default: 'sm', group: 'style' },
            { key: 'logoUrl', label: 'Logo URL', type: 'string', default: 'https://via.placeholder.com/120x40?text=Logo', group: 'style', when: c => c.showLogo },
            { key: 'logoAlt', label: 'Logo Alt', type: 'string', default: 'Logo', group: 'style', when: c => c.showLogo },
            // Layout
            { key: 'padding', label: 'Padding', type: 'string', default: '24px', group: 'layout' },
            { key: 'borderRadius', label: 'Borda', type: 'string', default: '8px', group: 'layout' },
            { key: 'marginBottom', label: 'Margem Inferior', type: 'string', default: '16px', group: 'layout' },
            { key: 'contentMaxWidth', label: 'Largura Máx. Conteúdo', type: 'number', default: 640, group: 'layout' },
            // Comportamento
            { key: 'enableProgressBar', label: 'Ativar Barra de Progresso', type: 'boolean', default: false, group: 'behavior' },
            { key: 'progressValue', label: 'Progresso (%)', type: 'number', default: 0, min: 0, max: 100, group: 'behavior', when: c => c.enableProgressBar },
            { key: 'progressMax', label: 'Progresso Máx', type: 'number', default: 100, min: 1, group: 'behavior', when: c => c.enableProgressBar },
            { key: 'progressHeight', label: 'Altura Barra', type: 'number', default: 8, min: 1, group: 'behavior', when: c => c.enableProgressBar },
            { key: 'showBackButton', label: 'Mostrar Botão Voltar', type: 'boolean', default: false, group: 'behavior' }
        ]
    },
    {
        type: 'options-grid',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'logic', label: 'Lógica', order: 2 },
            { id: 'style', label: 'Estilo', order: 3 }
        ],
        properties: [
            { key: 'question', label: 'Pergunta', type: 'richtext', required: true, default: 'Pergunta do quiz', group: 'content' },
            // Observação: edição completa das opções (com imagem) será abordada em iteração futura
            { key: 'columns', label: 'Colunas', type: 'number', default: 2, min: 1, max: 4, group: 'style' },
            { key: 'showImages', label: 'Mostrar Imagens', type: 'boolean', default: true, group: 'style' },
            { key: 'imageSize', label: 'Tamanho Imagem', type: 'select', enumValues: ['auto', 'custom'], default: 'custom', group: 'style', when: c => c.showImages },
            { key: 'imageWidth', label: 'Largura Imagem', type: 'number', default: 300, min: 40, group: 'style', when: c => c.showImages && c.imageSize === 'custom' },
            { key: 'imageHeight', label: 'Altura Imagem', type: 'number', default: 300, min: 40, group: 'style', when: c => c.showImages && c.imageSize === 'custom' },
            { key: 'gridGap', label: 'Espaçamento', type: 'number', default: 16, min: 0, group: 'style' },
            { key: 'responsiveColumns', label: 'Colunas Responsivas', type: 'boolean', default: true, group: 'style' },
            { key: 'multipleSelection', label: 'Multi Seleção', type: 'boolean', default: true, group: 'logic' },
            { key: 'requiredSelections', label: 'Seleções Necessárias', type: 'number', default: 3, min: 1, group: 'logic' },
            { key: 'maxSelections', label: 'Máx Seleções', type: 'number', default: 3, min: 1, group: 'logic', when: c => c.multipleSelection },
            { key: 'minSelections', label: 'Mín Seleções', type: 'number', default: 1, min: 1, group: 'logic', when: c => c.multipleSelection },
            { key: 'autoAdvanceOnComplete', label: 'Avançar Automaticamente', type: 'boolean', default: true, group: 'logic' },
            { key: 'autoAdvanceDelay', label: 'Delay Auto (ms)', type: 'number', default: 1500, min: 0, group: 'logic', when: c => c.autoAdvanceOnComplete },
            { key: 'enableButtonOnlyWhenValid', label: 'Habilitar Botão quando Válido', type: 'boolean', default: true, group: 'logic' },
            { key: 'showValidationFeedback', label: 'Mostrar Validação', type: 'boolean', default: true, group: 'logic' },
            { key: 'validationMessage', label: 'Mensagem de Validação', type: 'string', default: 'Selecione as opções necessárias', group: 'logic', when: c => c.showValidationFeedback },
            { key: 'progressMessage', label: 'Mensagem de Progresso', type: 'string', default: 'Você selecionou {count} de {required} opções', group: 'logic' },
            { key: 'showSelectionCount', label: 'Mostrar Contador', type: 'boolean', default: true, group: 'logic' },
            { key: 'selectionStyle', label: 'Estilo de Seleção', type: 'select', enumValues: ['border', 'background'], default: 'border', group: 'style' },
            { key: 'selectedColor', label: 'Cor Selecionado', type: 'color', default: '#3B82F6', group: 'style' },
            { key: 'hoverColor', label: 'Cor Hover', type: 'color', default: '#EBF5FF', group: 'style' }
        ]
    },
    {
        type: 'text-inline',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 }
        ],
        properties: [
            { key: 'text', label: 'Texto', type: 'richtext', required: true, default: 'Texto inline', group: 'content' },
            { key: 'textAlign', label: 'Alinhamento', type: 'select', enumValues: ['left', 'center', 'right'], default: 'left', group: 'style' },
            { key: 'fontSize', label: 'Tamanho', type: 'select', enumValues: ['sm', 'base', 'lg', 'xl'], default: 'base', group: 'style' },
            { key: 'fontWeight', label: 'Peso', type: 'select', enumValues: ['normal', 'semibold', 'bold'], default: 'normal', group: 'style' },
            { key: 'color', label: 'Cor', type: 'color', default: '#432818', group: 'style' }
        ]
    },
    {
        type: 'button-inline',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 },
            { id: 'logic', label: 'Lógica', order: 3 }
        ],
        properties: [
            { key: 'text', label: 'Texto', type: 'string', required: true, default: 'Clique aqui', group: 'content' },
            { key: 'backgroundColor', label: 'Fundo', type: 'color', default: '#B89B7A', group: 'style' },
            { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#FFFFFF', group: 'style' },
            { key: 'borderColor', label: 'Borda', type: 'color', default: '#B89B7A', group: 'style' },
            { key: 'fontSize', label: 'Tamanho Fonte', type: 'string', default: '16', group: 'style' },
            { key: 'fontWeight', label: 'Peso Fonte', type: 'select', enumValues: ['400', '500', '600', '700'], default: '500', group: 'style' },
            { key: 'borderRadius', label: 'Raio Borda', type: 'number', default: 8, min: 0, group: 'style' },
            { key: 'showDisabledState', label: 'Estado Desabilitado', type: 'boolean', default: true, group: 'style' },
            { key: 'disabledText', label: 'Texto Desabilitado', type: 'string', default: 'Preencha para continuar', group: 'style', when: c => c.showDisabledState },
            { key: 'action', label: 'Ação', type: 'select', enumValues: ['next-step', 'open-url', 'submit-form'], default: 'next-step', group: 'logic' },
            { key: 'nextStepId', label: 'Próximo Step ID', type: 'string', group: 'logic', when: c => c.action === 'next-step' },
            { key: 'url', label: 'URL', type: 'string', group: 'logic', when: c => c.action === 'open-url' },
            { key: 'autoAdvanceOnComplete', label: 'Auto Avançar', type: 'boolean', default: true, group: 'logic' },
            { key: 'autoAdvanceDelay', label: 'Delay Auto (ms)', type: 'number', default: 600, min: 0, group: 'logic', when: c => c.autoAdvanceOnComplete }
        ]
    },
    {
        type: 'decorative-bar',
        groups: [
            { id: 'style', label: 'Estilo', order: 1 },
            { id: 'layout', label: 'Layout', order: 2 }
        ],
        properties: [
            { key: 'backgroundColor', label: 'Cor', type: 'color', default: '#B89B7A', group: 'style' },
            { key: 'height', label: 'Altura', type: 'number', default: 4, min: 1, group: 'style' },
            { key: 'width', label: 'Largura', type: 'string', default: 'min(640px, 100%)', group: 'layout' },
            { key: 'borderRadius', label: 'Raio Borda', type: 'number', default: 3, min: 0, group: 'layout' },
            { key: 'showShadow', label: 'Mostrar Sombra', type: 'boolean', default: true, group: 'style' }
        ]
    },
    {
        type: 'form-container',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'behavior', label: 'Comportamento', order: 2 },
            { id: 'style', label: 'Estilo', order: 3 },
            { id: 'layout', label: 'Layout', order: 4 }
        ],
        properties: [
            { key: 'title', label: 'Título', type: 'string', default: 'Formulário', group: 'content' },
            { key: 'placeholder', label: 'Placeholder', type: 'string', default: 'Digite aqui...', group: 'content' },
            { key: 'buttonText', label: 'Texto do Botão', type: 'string', default: 'Enviar', group: 'content' },
            { key: 'requiredMessage', label: 'Mensagem Obrigatório', type: 'string', default: 'Campo obrigatório', group: 'content' },
            { key: 'enableButtonOnlyWhenValid', label: 'Habilitar Botão se Válido', type: 'boolean', default: true, group: 'behavior' },
            { key: 'showValidationFeedback', label: 'Mostrar Validação', type: 'boolean', default: true, group: 'behavior' },
            { key: 'autoAdvanceOnComplete', label: 'Avançar Automaticamente', type: 'boolean', default: true, group: 'behavior' },
            { key: 'autoAdvanceDelay', label: 'Delay Auto (ms)', type: 'number', default: 600, min: 0, group: 'behavior', when: c => c.autoAdvanceOnComplete },
            { key: 'backgroundColor', label: 'Fundo', type: 'color', default: '#FFFFFF', group: 'style' },
            { key: 'borderColor', label: 'Borda', type: 'color', default: '#B89B7A', group: 'style' },
            { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#432818', group: 'style' },
            { key: 'paddingTop', label: 'Padding Top', type: 'number', default: 16, group: 'layout' },
            { key: 'paddingBottom', label: 'Padding Bottom', type: 'number', default: 16, group: 'layout' },
            { key: 'paddingLeft', label: 'Padding Left', type: 'number', default: 16, group: 'layout' },
            { key: 'paddingRight', label: 'Padding Right', type: 'number', default: 16, group: 'layout' },
            { key: 'borderRadius', label: 'Raio Borda', type: 'number', default: 8, group: 'layout' }
        ]
    },
    {
        type: 'legal-notice',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 },
            { id: 'layout', label: 'Layout', order: 3 }
        ],
        properties: [
            { key: 'copyrightText', label: 'Copyright', type: 'string', default: '© 2025 Sua Marca', group: 'content' },
            { key: 'privacyText', label: 'Texto Privacidade', type: 'string', default: 'Política de Privacidade', group: 'content' },
            { key: 'termsText', label: 'Texto Termos', type: 'string', default: 'Termos de Uso', group: 'content' },
            { key: 'privacyLinkUrl', label: 'URL Privacidade', type: 'string', default: '/privacy', group: 'content' },
            { key: 'termsLinkUrl', label: 'URL Termos', type: 'string', default: '/terms', group: 'content' },
            { key: 'showPrivacyLink', label: 'Mostrar Link Privacidade', type: 'boolean', default: true, group: 'content' },
            { key: 'showTermsLink', label: 'Mostrar Link Termos', type: 'boolean', default: true, group: 'content' },
            { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#9CA3AF', group: 'style' },
            { key: 'linkColor', label: 'Cor dos Links', type: 'color', default: '#B89B7A', group: 'style' },
            { key: 'fontSize', label: 'Tamanho Fonte', type: 'string', default: 'text-xs', group: 'style' },
            { key: 'textAlign', label: 'Alinhamento', type: 'select', enumValues: ['left', 'center', 'right'], default: 'center', group: 'layout' },
            { key: 'marginTop', label: 'Margem Topo', type: 'number', default: 32, group: 'layout' },
            { key: 'marginBottom', label: 'Margem Inferior', type: 'number', default: 8, group: 'layout' }
        ]
    },
    {
        type: 'quiz-offer-cta-inline',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 }
        ],
        properties: [
            { key: 'title', label: 'Título', type: 'string', default: 'Oferta Especial', group: 'content', required: true },
            { key: 'description', label: 'Descrição', type: 'richtext', default: 'Aproveite esta oportunidade única', group: 'content' },
            { key: 'buttonText', label: 'Texto do Botão', type: 'string', default: 'Quero Aproveitar', group: 'content' },
            { key: 'gradientStart', label: 'Gradiente Início', type: 'color', default: '#B89B7A', group: 'style' },
            { key: 'gradientEnd', label: 'Gradiente Fim', type: 'color', default: '#D4AF37', group: 'style' },
            { key: 'textColor', label: 'Cor do Texto', type: 'color', default: '#FFFFFF', group: 'style' }
        ]
    },
    {
        type: 'result-header-inline',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 }
        ],
        properties: [
            { key: 'title', label: 'Título', type: 'string', default: 'Seu Resultado', group: 'content', required: true },
            { key: 'subtitle', label: 'Subtítulo', type: 'string', default: '', group: 'content' },
            { key: 'textAlign', label: 'Alinhamento', type: 'select', enumValues: ['left', 'center', 'right'], default: 'center', group: 'style' }
        ]
    },
    {
        type: 'style-card-inline',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 }
        ],
        properties: [
            { key: 'styleName', label: 'Nome do Estilo', type: 'string', default: 'Seu Estilo', group: 'content' },
            { key: 'image', label: 'Imagem (URL)', type: 'string', default: '', group: 'content' },
            { key: 'description', label: 'Descrição', type: 'richtext', default: 'Descrição do estilo', group: 'content' },
            { key: 'cardBackground', label: 'Fundo do Card', type: 'color', default: '#FFFFFF', group: 'style' }
        ]
    },
    {
        type: 'urgency-timer-inline',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 }
        ],
        properties: [
            { key: 'label', label: 'Rótulo', type: 'string', default: 'Oferta Expira em:', group: 'content' },
            { key: 'durationSeconds', label: 'Duração (s)', type: 'number', default: 900, min: 0, group: 'content' },
            { key: 'backgroundColor', label: 'Fundo', type: 'color', default: '#FEF2F2', group: 'style' },
            { key: 'accentColor', label: 'Cor Destaque', type: 'color', default: '#DC2626', group: 'style' }
        ]
    },
    {
        type: 'guarantee',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 }
        ],
        properties: [
            { key: 'title', label: 'Título', type: 'string', default: 'Garantia', group: 'content' },
            { key: 'description', label: 'Descrição', type: 'richtext', default: 'Satisfação garantida', group: 'content' },
            { key: 'borderColor', label: 'Cor da Borda', type: 'color', default: '#A7F3D0', group: 'style' },
            { key: 'backgroundColor', label: 'Fundo', type: 'color', default: '#ECFDF5', group: 'style' }
        ]
    },
    {
        type: 'bonus',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 }
        ],
        properties: [
            { key: 'title', label: 'Título', type: 'string', default: 'Bônus Exclusivo', group: 'content' },
            { key: 'description', label: 'Descrição', type: 'richtext', default: 'Aproveite este bônus', group: 'content' },
            { key: 'borderColor', label: 'Cor da Borda', type: 'color', default: '#FDE68A', group: 'style' },
            { key: 'backgroundColor', label: 'Fundo', type: 'color', default: '#FFFBEB', group: 'style' }
        ]
    },
    {
        type: 'benefits',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 }
        ],
        properties: [
            { key: 'benefits', label: 'Benefícios', type: 'options-list', default: [], group: 'content' }
        ]
    },
    {
        type: 'secure-purchase',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 }
        ],
        properties: [
            { key: 'text', label: 'Texto', type: 'string', default: 'Compra 100% Segura', group: 'content' }
        ]
    },
    {
        type: 'value-anchoring',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 }
        ],
        properties: [
            { key: 'oldPrice', label: 'Preço Antigo', type: 'string', default: 'R$ 297,00', group: 'content' },
            { key: 'newPrice', label: 'Preço Novo', type: 'string', default: 'R$ 97,00', group: 'content' },
            { key: 'discount', label: 'Desconto', type: 'string', default: 'Economize 67%', group: 'content' }
        ]
    },
    {
        type: 'before-after-inline',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 }
        ],
        properties: [
            { key: 'beforeImage', label: 'Imagem Antes (URL)', type: 'string', default: '', group: 'content' },
            { key: 'beforeText', label: 'Texto Antes', type: 'string', default: 'Situação anterior', group: 'content' },
            { key: 'afterImage', label: 'Imagem Depois (URL)', type: 'string', default: '', group: 'content' },
            { key: 'afterText', label: 'Texto Depois', type: 'string', default: 'Resultado alcançado', group: 'content' }
        ]
    },
    {
        type: 'mentor-section-inline',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 }
        ],
        properties: [
            { key: 'mentorImage', label: 'Imagem Mentor (URL)', type: 'string', default: '', group: 'content' },
            { key: 'mentorName', label: 'Nome do Mentor', type: 'string', default: 'Mentor', group: 'content' },
            { key: 'mentorBio', label: 'Bio do Mentor', type: 'richtext', default: 'Descrição do mentor', group: 'content' }
        ]
    },
    {
        type: 'fashion-ai-generator',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 }
        ],
        properties: [
            { key: 'note', label: 'Observação', type: 'richtext', default: 'Componente interativo de IA (placeholder no editor).', group: 'content' }
        ]
    },
    {
        type: 'connected-template-wrapper',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 }
        ],
        properties: [
            { key: 'title', label: 'Título Interno', type: 'string', default: 'Wrapper', group: 'content' },
            { key: 'backgroundColor', label: 'Fundo', type: 'color', default: '#F8FAFC', group: 'style' }
        ]
    },
    {
        type: 'testimonials',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 }
        ],
        properties: [
            { key: 'testimonials', label: 'Depoimentos (texto simples)', type: 'options-list', default: [], group: 'content', description: 'Versão simples: apenas o texto do depoimento. Para avatar/autor use o editor avançado futuramente.' }
        ]
    },
    {
        type: 'secondary-styles',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 }
        ],
        properties: [
            { key: 'styles', label: 'Estilos (nomes)', type: 'options-list', default: [], group: 'content', description: 'Informe os nomes dos estilos secundários. Pontuações serão calculadas automaticamente.' }
        ]
    },
    {
        type: 'conversion',
        groups: [
            { id: 'content', label: 'Conteúdo', order: 1 },
            { id: 'style', label: 'Estilo', order: 2 }
        ],
        properties: [
            { key: 'headline', label: 'Headline', type: 'string', default: 'Pronta para transformar seu estilo?', group: 'content' },
            { key: 'subheadline', label: 'Subheadline', type: 'richtext', default: 'Conheça nosso programa completo.', group: 'content' },
            { key: 'ctaText', label: 'Texto do CTA', type: 'string', default: 'Quero participar', group: 'content' },
            { key: 'backgroundColor', label: 'Fundo', type: 'color', default: '#FFFFFF', group: 'style' }
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
