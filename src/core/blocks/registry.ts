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
            // Conteúdo
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Descubra seu estilo', required: true }),
            prop({ key: 'subtitle', kind: 'textarea', label: 'Subtítulo', category: 'content', default: 'Responda algumas perguntas e veja o resultado' }),
            prop({ key: 'showLogo', kind: 'switch', label: 'Mostrar Logotipo', category: 'content', default: true }),
            prop({ key: 'logoUrl', kind: 'url', label: 'URL do Logotipo', category: 'content', placeholder: 'https://...', default: '' }),
            // Estilo/Branding
            prop({ key: 'textColor', kind: 'color', label: 'Cor do Texto', category: 'style', default: '#432818' }),
            prop({ key: 'backgroundColor', kind: 'color', label: 'Cor de Fundo', category: 'style', default: '#FFFFFF' }),
            prop({ key: 'containerBackground', kind: 'color', label: 'Fundo do Container', category: 'style', default: '' }),
            // Layout
            select('textAlign', 'Alinhamento', [
                { value: 'left', label: 'Esquerda' },
                { value: 'center', label: 'Centro' },
                { value: 'right', label: 'Direita' },
            ], { category: 'layout', default: 'center' }),
            prop({ key: 'logoWidth', kind: 'range', label: 'Largura do Logo', category: 'layout', min: 20, max: 300, step: 5, unit: 'px', default: 120 }),
            prop({ key: 'logoHeight', kind: 'range', label: 'Altura do Logo', category: 'layout', min: 20, max: 200, step: 5, unit: 'px', default: 50 }),
            prop({ key: 'paddingTop', kind: 'range', label: 'Padding Superior', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 16 }),
            prop({ key: 'paddingBottom', kind: 'range', label: 'Padding Inferior', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 16 }),
            prop({ key: 'paddingLeft', kind: 'range', label: 'Padding Esquerdo', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 24 }),
            prop({ key: 'paddingRight', kind: 'range', label: 'Padding Direito', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 24 }),
            prop({ key: 'marginBottom', kind: 'range', label: 'Margem Inferior', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 24 }),
            // Comportamento: progresso e navegação
            prop({ key: 'showProgress', kind: 'switch', label: 'Exibir Barra de Progresso', category: 'behavior', default: false }),
            prop({ key: 'enableProgressBar', kind: 'switch', label: 'Ativar Barra de Progresso', category: 'behavior', default: false }),
            prop({ key: 'progressValue', kind: 'range', label: 'Valor do Progresso', category: 'behavior', min: 0, max: 100, step: 1, default: 0 }),
            prop({ key: 'progressMax', kind: 'number', label: 'Progresso Máximo', category: 'behavior', default: 100 }),
            prop({ key: 'progressBarColor', kind: 'color', label: 'Cor da Barra de Progresso', category: 'style', default: '#B89B7A' }),
            prop({ key: 'progressBarThickness', kind: 'range', label: 'Espessura da Barra', category: 'style', min: 2, max: 16, step: 1, unit: 'px', default: 6 }),
            prop({ key: 'showBackButton', kind: 'switch', label: 'Mostrar Botão Voltar', category: 'behavior', default: true }),
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
            // Conteúdo
            prop({ key: 'question', kind: 'text', label: 'Título/Questão', category: 'content', default: '' }),
            prop({ key: 'options', kind: 'array', label: 'Opções', category: 'content', default: [] }),
            // Seleções e validação
            prop({ key: 'requiredSelections', kind: 'number', label: 'Seleções Obrigatórias', category: 'behavior', default: 1 }),
            prop({ key: 'minSelections', kind: 'number', label: 'Mínimo de Seleções', category: 'behavior', default: 1 }),
            prop({ key: 'maxSelections', kind: 'number', label: 'Máximo de Seleções', category: 'behavior', default: 1 }),
            prop({ key: 'multipleSelection', kind: 'switch', label: 'Permitir Multiseleção', category: 'behavior', default: false }),
            prop({ key: 'enableButtonOnlyWhenValid', kind: 'switch', label: 'Habilitar Botão Apenas se Válido', category: 'behavior', default: true }),
            prop({ key: 'showValidationFeedback', kind: 'switch', label: 'Mostrar Feedback de Validação', category: 'behavior', default: true }),
            prop({ key: 'validationMessage', kind: 'text', label: 'Mensagem de Validação', category: 'behavior', default: '' }),
            prop({ key: 'progressMessage', kind: 'text', label: 'Mensagem de Progresso', category: 'behavior', default: '' }),
            prop({ key: 'showSelectionCount', kind: 'switch', label: 'Mostrar Contador de Seleção', category: 'behavior', default: true }),
            // Avanço
            prop({ key: 'autoAdvanceOnComplete', kind: 'switch', label: 'Auto Avançar ao Completar', category: 'behavior', default: false }),
            prop({ key: 'autoAdvanceDelay', kind: 'number', label: 'Atraso de Auto Avanço (ms)', category: 'behavior', default: 0 }),
            // Pontuação
            prop({ key: 'scoreValues', kind: 'object', label: 'Pontuação por Opção', category: 'advanced', default: {} }),
            // Visual
            prop({ key: 'showImages', kind: 'switch', label: 'Mostrar Imagens', category: 'style', default: true }),
            select('selectionStyle', 'Estilo de Seleção', [
                { value: 'border', label: 'Borda' },
                { value: 'background', label: 'Fundo' },
            ], { category: 'style', default: 'border' }),
            prop({ key: 'selectedColor', kind: 'color', label: 'Cor ao Selecionar', category: 'style', default: '#3B82F6' }),
            prop({ key: 'hoverColor', kind: 'color', label: 'Cor no Hover', category: 'style', default: '#EBF5FF' }),
            // Imagem
            select('imageSize', 'Tamanho da Imagem', [
                { value: 'auto', label: 'Automático' },
                { value: 'small', label: 'Pequena' },
                { value: 'medium', label: 'Média' },
                { value: 'large', label: 'Grande' },
                { value: 'custom', label: 'Personalizado' },
            ], { category: 'style', default: 'auto' }),
            prop({ key: 'imageWidth', kind: 'number', label: 'Largura (px)', category: 'style', default: 300 }),
            prop({ key: 'imageHeight', kind: 'number', label: 'Altura (px)', category: 'style', default: 300 }),
            // Layout
            prop({ key: 'columns', kind: 'range', label: 'Colunas', category: 'layout', min: 1, max: 4, step: 1, default: 2 }),
            prop({ key: 'gridGap', kind: 'number', label: 'Espaçamento da Grade (px)', category: 'layout', default: 16 }),
            prop({ key: 'responsiveColumns', kind: 'switch', label: 'Colunas Responsivas', category: 'layout', default: true }),
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
            // Conteúdo
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Seu estilo é...' }),
            prop({ key: 'subtitle', kind: 'textarea', label: 'Subtítulo', category: 'content', default: 'Veja abaixo como ele se manifesta' }),
            prop({ key: 'description', kind: 'textarea', label: 'Descrição', category: 'content', default: '' }),
            // Imagens
            prop({ key: 'imageUrl', kind: 'url', label: 'Imagem do Estilo', category: 'content', default: '' }),
            prop({ key: 'guideImageUrl', kind: 'url', label: 'Imagem do Guia', category: 'content', default: '' }),
            prop({ key: 'showBothImages', kind: 'switch', label: 'Mostrar Ambas Imagens', category: 'style', default: true }),
            prop({ key: 'imageWidth', kind: 'number', label: 'Largura da Imagem (px)', category: 'layout', default: 380 }),
            prop({ key: 'imageHeight', kind: 'number', label: 'Altura da Imagem (px)', category: 'layout', default: 380 }),
            // Barra de progresso
            prop({ key: 'percentage', kind: 'number', label: 'Porcentagem (override)', category: 'behavior', default: undefined }),
            prop({ key: 'progressColor', kind: 'color', label: 'Cor da Barra', category: 'style', default: '#B89B7A' }),
            // Layout e estilo
            select('textAlign', 'Alinhamento', [
                { value: 'left', label: 'Esquerda' },
                { value: 'center', label: 'Centro' },
                { value: 'right', label: 'Direita' },
            ], { category: 'layout', default: 'center' }),
            prop({ key: 'badgeText', kind: 'text', label: 'Texto do Selo', category: 'content', default: 'Exclusivo' }),
            prop({ key: 'backgroundColor', kind: 'color', label: 'Cor de Fundo', category: 'style', default: '' }),
        ],
    },
    'text-inline': {
        type: 'text-inline',
        title: 'Texto Inline',
        category: 'Conteúdo',
        icon: 'doc',
        defaultProps: { text: 'Digite seu texto...', color: '#432818', alignment: 'left' },
        propsSchema: [
            prop({ key: 'text', kind: 'textarea', label: 'Texto', category: 'content', default: 'Digite seu texto...' }),
            prop({ key: 'color', kind: 'color', label: 'Cor do Texto', category: 'style', default: '#432818' }),
            select('alignment', 'Alinhamento', [
                { value: 'left', label: 'Esquerda' },
                { value: 'center', label: 'Centro' },
                { value: 'right', label: 'Direita' },
            ], { category: 'layout', default: 'left' }),
            prop({ key: 'fontSize', kind: 'range', label: 'Tamanho da Fonte', category: 'style', min: 10, max: 48, step: 1, unit: 'px', default: 16 }),
            prop({ key: 'fontFamily', kind: 'text', label: 'Família da Fonte', category: 'style', default: '' }),
        ],
    },
    'heading-inline': {
        type: 'heading-inline',
        title: 'Título Inline',
        category: 'Conteúdo',
        icon: 'heading',
        defaultProps: { content: 'Título', level: 'h2', textAlign: 'center', color: '#432818' },
        propsSchema: [
            prop({ key: 'content', kind: 'text', label: 'Título', category: 'content', default: 'Título' }),
            select('level', 'Nível', [
                { value: 'h1', label: 'H1' },
                { value: 'h2', label: 'H2' },
                { value: 'h3', label: 'H3' },
                { value: 'h4', label: 'H4' },
            ], { category: 'layout', default: 'h2' }),
            select('textAlign', 'Alinhamento', [
                { value: 'left', label: 'Esquerda' },
                { value: 'center', label: 'Centro' },
                { value: 'right', label: 'Direita' },
            ], { category: 'layout', default: 'center' }),
            prop({ key: 'color', kind: 'color', label: 'Cor', category: 'style', default: '#432818' }),
        ],
    },
    'image-display-inline': {
        type: 'image-display-inline',
        title: 'Imagem Display',
        category: 'Conteúdo',
        icon: 'image',
        defaultProps: { src: '', alt: '', width: '100%', height: 'auto', borderRadius: 12, shadow: true, alignment: 'center' },
        propsSchema: [
            prop({ key: 'src', kind: 'url', label: 'Imagem (URL)', category: 'content', default: '' }),
            prop({ key: 'alt', kind: 'text', label: 'Texto Alternativo', category: 'content', default: '' }),
            prop({ key: 'width', kind: 'text', label: 'Largura', category: 'layout', default: '100%' }),
            prop({ key: 'height', kind: 'text', label: 'Altura', category: 'layout', default: 'auto' }),
            prop({ key: 'borderRadius', kind: 'range', label: 'Raio da Borda', category: 'style', min: 0, max: 32, step: 1, unit: 'px', default: 12 }),
            prop({ key: 'shadow', kind: 'switch', label: 'Sombra', category: 'style', default: true }),
            select('alignment', 'Alinhamento', [
                { value: 'left', label: 'Esquerda' },
                { value: 'center', label: 'Centro' },
                { value: 'right', label: 'Direita' },
            ], { category: 'layout', default: 'center' }),
        ],
    },
    'button-inline': {
        type: 'button-inline',
        title: 'Botão',
        category: 'Ação',
        icon: 'bolt',
        defaultProps: { text: 'Continuar', action: 'next-step', nextStepId: '', backgroundColor: '#B89B7A', textColor: '#FFFFFF', disabled: false },
        propsSchema: [
            prop({ key: 'text', kind: 'text', label: 'Rótulo', category: 'content', default: 'Continuar' }),
            prop({ key: 'url', kind: 'url', label: 'URL (se for link)', category: 'content', default: '' }),
            // CTA/Ação
            select('action', 'Ação', [
                { value: 'next-step', label: 'Próxima etapa' },
                { value: 'prev-step', label: 'Etapa anterior' },
                { value: 'open-url', label: 'Abrir URL' },
                { value: 'submit', label: 'Submeter' },
            ], { category: 'behavior', default: 'next-step' }),
            prop({ key: 'nextStepId', kind: 'text', label: 'ID da Próxima Etapa', category: 'behavior', default: '' }),
            prop({ key: 'autoAdvanceOnComplete', kind: 'switch', label: 'Auto Avançar', category: 'behavior', default: false }),
            // Estilo
            prop({ key: 'backgroundColor', kind: 'color', label: 'Cor de Fundo', category: 'style', default: '#B89B7A' }),
            prop({ key: 'textColor', kind: 'color', label: 'Cor do Texto', category: 'style', default: '#FFFFFF' }),
            prop({ key: 'borderColor', kind: 'color', label: 'Cor da Borda', category: 'style', default: '#B89B7A' }),
            prop({ key: 'borderRadius', kind: 'range', label: 'Raio da Borda', category: 'style', min: 0, max: 32, step: 1, unit: 'px', default: 8 }),
            // Estados
            prop({ key: 'disabled', kind: 'switch', label: 'Desativado', category: 'behavior', default: false }),
            prop({ key: 'disabledText', kind: 'text', label: 'Texto Desativado', category: 'behavior', default: '' }),
        ],
    },
    'progress-inline': {
        type: 'progress-inline',
        title: 'Barra de Progresso',
        category: 'UI',
        icon: 'progress',
        defaultProps: { value: 0, max: 100, color: '#B89B7A', background: '#F3E8E6', height: 6 },
        propsSchema: [
            prop({ key: 'value', kind: 'range', label: 'Valor', category: 'behavior', min: 0, max: 100, step: 1, default: 0 }),
            prop({ key: 'max', kind: 'number', label: 'Máximo', category: 'behavior', default: 100 }),
            prop({ key: 'color', kind: 'color', label: 'Cor', category: 'style', default: '#B89B7A' }),
            prop({ key: 'background', kind: 'color', label: 'Fundo', category: 'style', default: '#F3E8E6' }),
            prop({ key: 'height', kind: 'range', label: 'Altura', category: 'layout', min: 2, max: 24, step: 1, unit: 'px', default: 6 }),
        ],
    },
    'style-card-inline': {
        type: 'style-card-inline',
        title: 'Card de Estilo',
        category: 'Resultado',
        icon: 'palette',
        defaultProps: { title: 'Seu Estilo Único', subtitle: '', description: '', features: [] },
        propsSchema: [
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Seu Estilo Único' }),
            prop({ key: 'subtitle', kind: 'text', label: 'Subtítulo', category: 'content', default: '' }),
            prop({ key: 'description', kind: 'textarea', label: 'Descrição', category: 'content', default: '' }),
            prop({ key: 'features', kind: 'array', label: 'Lista de Características', category: 'content', default: [] }),
            prop({ key: 'showIcon', kind: 'switch', label: 'Mostrar Ícone', category: 'style', default: true }),
            prop({ key: 'backgroundColor', kind: 'color', label: 'Cor de Fundo', category: 'style', default: '#FFFFFF' }),
            select('textAlign', 'Alinhamento', [
                { value: 'left', label: 'Esquerda' },
                { value: 'center', label: 'Centro' },
                { value: 'right', label: 'Direita' },
            ], { category: 'layout', default: 'left' }),
        ],
    },
    'secondary-styles': {
        type: 'secondary-styles',
        title: 'Estilos Secundários',
        category: 'Resultado',
        icon: 'grid',
        defaultProps: { title: 'Seus estilos complementares', subtitle: '', backgroundColor: '#F0F9FF' },
        propsSchema: [
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Seus estilos complementares' }),
            prop({ key: 'subtitle', kind: 'text', label: 'Subtítulo', category: 'content', default: '' }),
            prop({ key: 'backgroundColor', kind: 'color', label: 'Cor de Fundo', category: 'style', default: '#F0F9FF' }),
            prop({ key: 'padding', kind: 'range', label: 'Padding', category: 'layout', min: 0, max: 48, step: 2, unit: 'px', default: 24 }),
            prop({ key: 'borderRadius', kind: 'range', label: 'Raio da Borda', category: 'style', min: 0, max: 32, step: 1, unit: 'px', default: 16 }),
        ],
    },
    'style-cards-grid': {
        type: 'style-cards-grid',
        title: 'Grade de Estilos',
        category: 'Resultado',
        icon: 'grid',
        defaultProps: { columns: 2, showLetters: true, showDescriptions: false, interactive: true, selectable: false, animationType: 'hover', cardSize: 'md', gap: 'gap-6' },
        propsSchema: [
            prop({ key: 'columns', kind: 'range', label: 'Colunas', category: 'layout', min: 1, max: 4, step: 1, default: 2 }),
            prop({ key: 'showLetters', kind: 'switch', label: 'Mostrar Letras', category: 'style', default: true }),
            prop({ key: 'showDescriptions', kind: 'switch', label: 'Mostrar Descrições', category: 'style', default: false }),
            prop({ key: 'interactive', kind: 'switch', label: 'Interativo', category: 'behavior', default: true }),
            prop({ key: 'selectable', kind: 'switch', label: 'Selecionável', category: 'behavior', default: false }),
            prop({ key: 'maxSelections', kind: 'number', label: 'Máximo de Seleções', category: 'behavior', default: 1 }),
            prop({ key: 'gap', kind: 'text', label: 'Classe de Gap', category: 'layout', default: 'gap-6' }),
            select('cardSize', 'Tamanho do Card', [
                { value: 'sm', label: 'Pequeno' },
                { value: 'md', label: 'Médio' },
                { value: 'lg', label: 'Grande' },
            ], { category: 'layout', default: 'md' }),
            select('animationType', 'Animação', [
                { value: 'none', label: 'Nenhuma' },
                { value: 'hover', label: 'Hover' },
                { value: 'pulse', label: 'Pulso' },
                { value: 'glow', label: 'Brilho' },
            ], { category: 'animation', default: 'hover' }),
        ],
    },
    'urgency-timer-inline': {
        type: 'urgency-timer-inline',
        title: 'Timer de Urgência',
        category: 'Conversão',
        icon: 'timer',
        defaultProps: { title: 'Oferta especial por tempo limitado', urgencyMessage: '', initialMinutes: 15 },
        propsSchema: [
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Oferta especial por tempo limitado' }),
            prop({ key: 'urgencyMessage', kind: 'text', label: 'Mensagem de Urgência', category: 'content', default: '' }),
            prop({ key: 'initialMinutes', kind: 'number', label: 'Minutos Iniciais', category: 'behavior', default: 15 }),
            prop({ key: 'backgroundColor', kind: 'color', label: 'Cor de Fundo', category: 'style', default: '#dc2626' }),
            prop({ key: 'textColor', kind: 'color', label: 'Cor do Texto', category: 'style', default: '#ffffff' }),
            prop({ key: 'pulseColor', kind: 'color', label: 'Cor de Pulso', category: 'style', default: '#fbbf24' }),
            prop({ key: 'showAlert', kind: 'switch', label: 'Exibir Alerta', category: 'behavior', default: true }),
            prop({
                key: 'spacing', kind: 'select', label: 'Espaçamento', category: 'layout', options: [
                    { value: 'sm', label: 'Pequeno' }, { value: 'md', label: 'Médio' }, { value: 'lg', label: 'Grande' }
                ], default: 'md'
            }),
        ],
    },
    'before-after-inline': {
        type: 'before-after-inline',
        title: 'Antes e Depois',
        category: 'Conversão',
        icon: 'compare',
        defaultProps: { title: 'Sua transformação é possível', subtitle: '', beforeLabel: 'ANTES', afterLabel: 'DEPOIS', layoutStyle: 'side-by-side', showComparison: true },
        propsSchema: [
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Sua transformação é possível' }),
            prop({ key: 'subtitle', kind: 'text', label: 'Subtítulo', category: 'content', default: '' }),
            prop({ key: 'beforeLabel', kind: 'text', label: 'Rótulo ANTES', category: 'content', default: 'ANTES' }),
            prop({ key: 'afterLabel', kind: 'text', label: 'Rótulo DEPOIS', category: 'content', default: 'DEPOIS' }),
            select('layoutStyle', 'Layout', [
                { value: 'side-by-side', label: 'Lado a Lado' },
                { value: 'stacked', label: 'Empilhado' },
            ], { category: 'layout', default: 'side-by-side' }),
            prop({ key: 'showComparison', kind: 'switch', label: 'Mostrar Comparação', category: 'behavior', default: true }),
            prop({ key: 'marginTop', kind: 'range', label: 'Margem Superior', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 12 }),
            prop({ key: 'marginBottom', kind: 'range', label: 'Margem Inferior', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 20 }),
        ],
    },
    'bonus': {
        type: 'bonus',
        title: 'Bônus',
        category: 'Conversão',
        icon: 'gift',
        defaultProps: { title: 'Bônus de transformação inclusos', showImages: true },
        propsSchema: [
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Bônus de transformação inclusos' }),
            prop({ key: 'showImages', kind: 'switch', label: 'Mostrar Imagens', category: 'style', default: true }),
            prop({ key: 'marginTop', kind: 'range', label: 'Margem Superior', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 8 }),
            prop({ key: 'marginBottom', kind: 'range', label: 'Margem Inferior', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 16 }),
        ],
    },
    'bonus-inline': {
        type: 'bonus-inline',
        title: 'Bônus (Inline)',
        category: 'Conversão',
        icon: 'gift',
        defaultProps: { title: 'Bônus', showImages: true },
        propsSchema: [
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Bônus' }),
            prop({ key: 'showImages', kind: 'switch', label: 'Mostrar Imagens', category: 'style', default: true }),
        ],
    },
    'value-anchoring': {
        type: 'value-anchoring',
        title: 'Ancoragem de Valor',
        category: 'Conversão',
        icon: 'tag',
        defaultProps: { title: 'Tudo o que você recebe hoje', showPricing: true },
        propsSchema: [
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Tudo o que você recebe hoje' }),
            prop({ key: 'showPricing', kind: 'switch', label: 'Mostrar Preços', category: 'behavior', default: true }),
            prop({ key: 'marginTop', kind: 'range', label: 'Margem Superior', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 8 }),
            prop({ key: 'marginBottom', kind: 'range', label: 'Margem Inferior', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 16 }),
        ],
    },
    'secure-purchase': {
        type: 'secure-purchase',
        title: 'Compra Segura',
        category: 'Conversão',
        icon: 'shield',
        defaultProps: { title: 'Compra 100% segura e protegida', showFeatures: true },
        propsSchema: [
            prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Compra 100% segura e protegida' }),
            prop({ key: 'showFeatures', kind: 'switch', label: 'Mostrar Recursos', category: 'behavior', default: true }),
            prop({ key: 'marginTop', kind: 'range', label: 'Margem Superior', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 8 }),
            prop({ key: 'marginBottom', kind: 'range', label: 'Margem Inferior', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 16 }),
        ],
    },
    'quiz-navigation': {
        type: 'quiz-navigation',
        title: 'Navegação do Quiz',
        category: 'UI',
        icon: 'compass',
        defaultProps: { showNext: true, showPrev: true, showIndicators: true },
        propsSchema: [
            prop({ key: 'showNext', kind: 'switch', label: 'Mostrar Próximo', category: 'behavior', default: true }),
            prop({ key: 'showPrev', kind: 'switch', label: 'Mostrar Anterior', category: 'behavior', default: true }),
            prop({ key: 'showIndicators', kind: 'switch', label: 'Mostrar Indicadores', category: 'behavior', default: true }),
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
