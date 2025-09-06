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

// Em testes, fornecemos um registro mínimo para reduzir uso de memória
const minimalRegistry: Record<string, BlockDefinition> = {
    'text': { type: 'text', title: 'Texto', category: 'Conteúdo', defaultProps: { text: '' }, propsSchema: [] },
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
        propsSchema: [],
    },
};

export const blocksRegistry: Record<string, BlockDefinition> = process.env.NODE_ENV === 'test' ? minimalRegistry : {
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
            // === CONTEÚDO ===
            title: 'Escolha uma opção:',
            description: '',
            options: [
                {
                    id: 'option-1',
                    text: 'Opção A',
                    description: 'Descrição da opção A',
                    imageUrl: 'https://via.placeholder.com/256x256',
                    value: 'a',
                    category: 'Categoria A',
                    points: 1
                },
                {
                    id: 'option-2',
                    text: 'Opção B',
                    description: 'Descrição da opção B',
                    imageUrl: 'https://via.placeholder.com/256x256',
                    value: 'b',
                    category: 'Categoria B',
                    points: 2
                },
            ],

            // === LAYOUT E GRID ===
            columns: 2,
            gridGap: 16,
            responsiveColumns: true,
            containerWidth: 'full',
            padding: 16,
            marginTop: 0,
            marginBottom: 16,

            // === CONFIGURAÇÃO DE IMAGENS ===
            showImages: true,
            imageSize: 256,
            imageWidth: 256,
            imageHeight: 256,
            imagePosition: 'top',
            imageLayout: 'vertical',
            imageObjectFit: 'cover',
            imageBorderRadius: 8,

            // === OPÇÕES DE CONTEÚDO ===
            contentMode: 'text-and-image', // 'text-only', 'image-only', 'text-and-image'
            textPosition: 'below',
            showDescription: true,
            showCategory: false,
            showPoints: false,

            // === COMPORTAMENTO DE SELEÇÃO ===
            multipleSelection: false,
            minSelections: 1,
            maxSelections: 1,
            requiredSelections: 1,
            allowDeselection: true,
            showSelectionCount: false,
            selectionCountText: 'Selecionados: {count}',

            // === AUTO AVANÇO ===
            autoAdvanceOnComplete: false,
            autoAdvanceDelay: 1000,
            autoAdvanceOnMaxSelection: false,

            // === CORES E ESTILO ===
            backgroundColor: '#FFFFFF',
            borderColor: '#E5E7EB',
            selectedColor: '#B89B7A',
            selectedBorderColor: '#B89B7A',
            hoverColor: '#F3E8D3',
            hoverBorderColor: '#D4C2A8',
            textColor: '#1F2937',
            selectedTextColor: '#1F2937',
            borderRadius: 8,
            borderWidth: 1,

            // === ESTILO DE SELEÇÃO ===
            selectionStyle: 'border', // 'border', 'background', 'glow', 'scale', 'overlay'
            selectionAnimation: 'smooth', // 'none', 'smooth', 'bounce', 'pulse'
            hoverEffect: true,

            // === VALIDAÇÃO ===
            enableValidation: true,
            showValidationMessage: true,
            validationMessage: 'Selecione pelo menos uma opção para continuar',
            validationMessageColor: '#EF4444',

            // === CONTROLE AVANÇADO ===
            scale: 100,
            opacity: 100,
            disabledOpacity: 50,

            // === BOTÕES E NAVEGAÇÃO ===
            showButtons: true,
            buttonPosition: 'bottom',
            enableButtonOnlyWhenValid: true,
            nextButtonText: 'Continuar',
            nextButtonUrl: '',
            nextButtonAction: 'next-step',
            showPreviousButton: false,
            previousButtonText: 'Voltar',
        },
        propsSchema: [
            // === SEÇÃO: CONTEÚDO ===
            prop({ key: 'title', kind: 'text', label: 'Título da Questão', category: 'content', default: 'Escolha uma opção:', required: true, description: 'Pergunta principal exibida acima das opções' }),
            prop({ key: 'description', kind: 'textarea', label: 'Descrição/Subtítulo', category: 'content', default: '', description: 'Texto adicional explicativo (opcional)' }),
            prop({ key: 'options', kind: 'array', label: 'Opções da Questão', category: 'content', default: [], description: 'Configure todas as opções disponíveis para seleção' }),

            // === SEÇÃO: LAYOUT DO GRID ===
            prop({ key: 'columns', kind: 'range', label: 'Número de Colunas', category: 'layout', min: 1, max: 4, step: 1, default: 2, description: 'Quantas colunas terá o grid de opções' }),
            prop({ key: 'gridGap', kind: 'range', label: 'Espaçamento entre Opções', category: 'layout', min: 0, max: 48, step: 2, unit: 'px', default: 16, description: 'Distância entre cada opção no grid' }),
            prop({ key: 'responsiveColumns', kind: 'switch', label: 'Colunas Responsivas', category: 'layout', default: true, description: 'Ajusta automaticamente o número de colunas em telas menores' }),
            prop({ key: 'padding', kind: 'range', label: 'Padding Interno', category: 'layout', min: 0, max: 48, step: 2, unit: 'px', default: 16, description: 'Espaçamento interno de cada opção' }),
            prop({ key: 'marginTop', kind: 'range', label: 'Margem Superior', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 0 }),
            prop({ key: 'marginBottom', kind: 'range', label: 'Margem Inferior', category: 'layout', min: 0, max: 64, step: 2, unit: 'px', default: 16 }),

            // === SEÇÃO: CONFIGURAÇÃO DE IMAGENS ===
            prop({ key: 'showImages', kind: 'switch', label: 'Exibir Imagens', category: 'style', default: true, description: 'Ativar/desativar imagens nas opções' }),
            select('contentMode', 'Modo de Conteúdo', [
                { value: 'text-and-image', label: '🖼️ Imagem + Texto' },
                { value: 'image-only', label: '📷 Apenas Imagem' },
                { value: 'text-only', label: '📝 Apenas Texto' },
            ], { category: 'style', default: 'text-and-image', description: 'Que tipo de conteúdo exibir nas opções' }),
            prop({ key: 'imageSize', kind: 'range', label: 'Tamanho das Imagens', category: 'style', min: 100, max: 400, step: 10, unit: 'px', default: 256, description: 'Tamanho padrão das imagens', when: { key: 'showImages', value: true } }),
            prop({ key: 'imageWidth', kind: 'range', label: 'Largura Customizada', category: 'style', min: 100, max: 500, step: 10, unit: 'px', default: 256, when: { key: 'showImages', value: true } }),
            prop({ key: 'imageHeight', kind: 'range', label: 'Altura Customizada', category: 'style', min: 100, max: 500, step: 10, unit: 'px', default: 256, when: { key: 'showImages', value: true } }),
            select('imagePosition', 'Posição da Imagem', [
                { value: 'top', label: '⬆️ Acima do Texto' },
                { value: 'left', label: '⬅️ À Esquerda' },
                { value: 'right', label: '➡️ À Direita' },
                { value: 'bottom', label: '⬇️ Abaixo do Texto' },
            ], { category: 'style', default: 'top', when: { key: 'showImages', value: true } }),
            select('imageLayout', 'Layout da Opção', [
                { value: 'vertical', label: 'Vertical (empilhado)' },
                { value: 'horizontal', label: 'Horizontal (lado a lado)' },
            ], { category: 'style', default: 'vertical', when: { key: 'showImages', value: true } }),
            select('imageObjectFit', 'Ajuste da Imagem', [
                { value: 'cover', label: 'Cobrir (crop)' },
                { value: 'contain', label: 'Conter (fit)' },
                { value: 'fill', label: 'Preencher (stretch)' },
            ], { category: 'style', default: 'cover', when: { key: 'showImages', value: true } }),
            prop({ key: 'imageBorderRadius', kind: 'range', label: 'Bordas Arredondadas da Imagem', category: 'style', min: 0, max: 32, step: 1, unit: 'px', default: 8, when: { key: 'showImages', value: true } }),

            // === SEÇÃO: CONTEÚDO E TEXTO ===
            select('textPosition', 'Posição do Texto', [
                { value: 'above', label: 'Acima da Imagem' },
                { value: 'below', label: 'Abaixo da Imagem' },
                { value: 'overlay', label: 'Sobreposto à Imagem' },
            ], { category: 'style', default: 'below' }),
            prop({ key: 'showDescription', kind: 'switch', label: 'Mostrar Descrição', category: 'content', default: true, description: 'Exibir texto descritivo nas opções' }),
            prop({ key: 'showCategory', kind: 'switch', label: 'Mostrar Categoria', category: 'content', default: false, description: 'Exibir categoria/palavra-chave das opções' }),
            prop({ key: 'showPoints', kind: 'switch', label: 'Mostrar Pontuação', category: 'content', default: false, description: 'Exibir pontos de cada opção (para debug)' }),

            // === SEÇÃO: COMPORTAMENTO DE SELEÇÃO ===
            prop({ key: 'multipleSelection', kind: 'switch', label: 'Permitir Seleção Múltipla', category: 'behavior', default: false, description: 'Permitir selecionar várias opções simultaneamente' }),
            prop({ key: 'minSelections', kind: 'range', label: 'Mínimo de Seleções', category: 'behavior', min: 0, max: 10, step: 1, default: 1, description: 'Número mínimo de opções que devem ser selecionadas' }),
            prop({ key: 'maxSelections', kind: 'range', label: 'Máximo de Seleções', category: 'behavior', min: 1, max: 10, step: 1, default: 1, description: 'Número máximo de opções que podem ser selecionadas' }),
            prop({ key: 'requiredSelections', kind: 'range', label: 'Seleções Obrigatórias', category: 'behavior', min: 0, max: 10, step: 1, default: 1, description: 'Quantas seleções são necessárias para prosseguir' }),
            prop({ key: 'allowDeselection', kind: 'switch', label: 'Permitir Desmarcar', category: 'behavior', default: true, description: 'Permitir clicar novamente para desselecionar uma opção' }),
            prop({ key: 'showSelectionCount', kind: 'switch', label: 'Mostrar Contador', category: 'behavior', default: false, description: 'Exibir quantas opções foram selecionadas' }),
            prop({ key: 'selectionCountText', kind: 'text', label: 'Texto do Contador', category: 'behavior', default: 'Selecionados: {count}', when: { key: 'showSelectionCount', value: true } }),

            // === SEÇÃO: AUTO AVANÇO ===
            prop({ key: 'autoAdvanceOnComplete', kind: 'switch', label: 'Auto Avançar ao Completar', category: 'behavior', default: false, description: 'Avançar automaticamente quando atingir seleções obrigatórias' }),
            prop({ key: 'autoAdvanceDelay', kind: 'range', label: 'Delay do Auto Avanço', category: 'behavior', min: 0, max: 5000, step: 100, unit: 'ms', default: 1000, when: { key: 'autoAdvanceOnComplete', value: true } }),
            prop({ key: 'autoAdvanceOnMaxSelection', kind: 'switch', label: 'Auto Avançar no Máximo', category: 'behavior', default: false, description: 'Avançar automaticamente ao atingir número máximo de seleções' }),

            // === SEÇÃO: CORES E VISUAL ===
            prop({ key: 'backgroundColor', kind: 'color', label: 'Cor de Fundo', category: 'style', default: '#FFFFFF', description: 'Cor de fundo das opções não selecionadas' }),
            prop({ key: 'borderColor', kind: 'color', label: 'Cor da Borda', category: 'style', default: '#E5E7EB', description: 'Cor da borda padrão das opções' }),
            prop({ key: 'selectedColor', kind: 'color', label: 'Cor de Fundo Selecionado', category: 'style', default: '#B89B7A', description: 'Cor de fundo quando a opção está selecionada' }),
            prop({ key: 'selectedBorderColor', kind: 'color', label: 'Cor da Borda Selecionada', category: 'style', default: '#B89B7A', description: 'Cor da borda quando a opção está selecionada' }),
            prop({ key: 'hoverColor', kind: 'color', label: 'Cor no Hover', category: 'style', default: '#F3E8D3', description: 'Cor de fundo ao passar o mouse' }),
            prop({ key: 'hoverBorderColor', kind: 'color', label: 'Cor da Borda no Hover', category: 'style', default: '#D4C2A8' }),
            prop({ key: 'textColor', kind: 'color', label: 'Cor do Texto', category: 'style', default: '#1F2937' }),
            prop({ key: 'selectedTextColor', kind: 'color', label: 'Cor do Texto Selecionado', category: 'style', default: '#1F2937' }),

            // === SEÇÃO: BORDAS E FORMA ===
            prop({ key: 'borderRadius', kind: 'range', label: 'Bordas Arredondadas', category: 'style', min: 0, max: 32, step: 1, unit: 'px', default: 8, description: 'Raio das bordas arredondadas' }),
            prop({ key: 'borderWidth', kind: 'range', label: 'Largura da Borda', category: 'style', min: 0, max: 8, step: 1, unit: 'px', default: 1 }),

            // === SEÇÃO: EFEITOS VISUAIS ===
            select('selectionStyle', 'Estilo de Seleção', [
                { value: 'border', label: '🔲 Destaque na Borda' },
                { value: 'background', label: '🎨 Mudança de Fundo' },
                { value: 'glow', label: '✨ Efeito Brilho' },
                { value: 'scale', label: '🔍 Aumentar Tamanho' },
                { value: 'overlay', label: '📋 Overlay com Ícone' },
            ], { category: 'style', default: 'border', description: 'Como destacar visualmente opções selecionadas' }),
            select('selectionAnimation', 'Animação de Seleção', [
                { value: 'none', label: 'Sem Animação' },
                { value: 'smooth', label: 'Suave' },
                { value: 'bounce', label: 'Saltitante' },
                { value: 'pulse', label: 'Pulsante' },
            ], { category: 'animation', default: 'smooth' }),
            prop({ key: 'hoverEffect', kind: 'switch', label: 'Ativar Efeito Hover', category: 'style', default: true, description: 'Mostrar efeito visual ao passar o mouse' }),

            // === SEÇÃO: VALIDAÇÃO ===
            prop({ key: 'enableValidation', kind: 'switch', label: 'Ativar Validação', category: 'behavior', default: true, description: 'Verificar se seleções são válidas antes de prosseguir' }),
            prop({ key: 'showValidationMessage', kind: 'switch', label: 'Mostrar Mensagem de Erro', category: 'behavior', default: true, when: { key: 'enableValidation', value: true } }),
            prop({ key: 'validationMessage', kind: 'text', label: 'Mensagem de Validação', category: 'behavior', default: 'Selecione pelo menos uma opção para continuar', when: { key: 'showValidationMessage', value: true } }),
            prop({ key: 'validationMessageColor', kind: 'color', label: 'Cor da Mensagem de Erro', category: 'style', default: '#EF4444', when: { key: 'showValidationMessage', value: true } }),

            // === SEÇÃO: BOTÕES E NAVEGAÇÃO ===
            prop({ key: 'showButtons', kind: 'switch', label: 'Exibir Botões', category: 'behavior', default: true, description: 'Mostrar botões de navegação' }),
            select('buttonPosition', 'Posição dos Botões', [
                { value: 'top', label: 'Acima das Opções' },
                { value: 'bottom', label: 'Abaixo das Opções' },
                { value: 'both', label: 'Acima e Abaixo' },
            ], { category: 'layout', default: 'bottom', when: { key: 'showButtons', value: true } }),
            prop({ key: 'enableButtonOnlyWhenValid', kind: 'switch', label: 'Botão Apenas se Válido', category: 'behavior', default: true, description: 'Habilitar botão "Continuar" somente quando seleção for válida' }),
            prop({ key: 'nextButtonText', kind: 'text', label: 'Texto do Botão "Continuar"', category: 'content', default: 'Continuar', when: { key: 'showButtons', value: true } }),
            prop({ key: 'nextButtonUrl', kind: 'url', label: 'URL do Botão "Continuar"', category: 'behavior', default: '', when: { key: 'showButtons', value: true } }),
            select('nextButtonAction', 'Ação do Botão', [
                { value: 'next-step', label: 'Próxima Etapa' },
                { value: 'open-url', label: 'Abrir URL' },
                { value: 'submit', label: 'Enviar Formulário' },
                { value: 'custom', label: 'Ação Personalizada' },
            ], { category: 'behavior', default: 'next-step', when: { key: 'showButtons', value: true } }),
            prop({ key: 'showPreviousButton', kind: 'switch', label: 'Mostrar Botão "Voltar"', category: 'behavior', default: false, when: { key: 'showButtons', value: true } }),
            prop({ key: 'previousButtonText', kind: 'text', label: 'Texto do Botão "Voltar"', category: 'content', default: 'Voltar', when: { key: 'showPreviousButton', value: true } }),

            // === SEÇÃO: CONTROLES AVANÇADOS ===
            prop({ key: 'scale', kind: 'range', label: 'Escala do Componente', category: 'advanced', min: 50, max: 200, step: 5, unit: '%', default: 100, description: 'Controle de zoom geral do componente inteiro' }),
            prop({ key: 'opacity', kind: 'range', label: 'Opacidade', category: 'advanced', min: 0, max: 100, step: 5, unit: '%', default: 100, description: 'Transparência do componente' }),
            prop({ key: 'disabledOpacity', kind: 'range', label: 'Opacidade Desabilitado', category: 'advanced', min: 0, max: 100, step: 5, unit: '%', default: 50, description: 'Transparência quando opções estão desabilitadas' }),
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
        defaultProps: {
            text: 'Continuar',
            action: 'next-step',
            nextStepId: '',
            backgroundColor: '#B89B7A',
            textColor: '#FFFFFF',
            disabled: false,
            // Novos defaults expostos no painel
            size: 'medium',
            icon: 'none',
            iconPosition: 'right',
            loading: false,
        },
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
            // Aparência
            select('size', 'Tamanho', [
                { value: 'small', label: 'Pequeno' },
                { value: 'medium', label: 'Médio' },
                { value: 'large', label: 'Grande' },
            ], { category: 'layout', default: 'medium' }),
            select('icon', 'Ícone', [
                { value: 'none', label: 'Nenhum' },
                { value: 'arrow-right', label: 'Seta Direita' },
                { value: 'download', label: 'Download' },
                { value: 'play', label: 'Play' },
                { value: 'star', label: 'Estrela' },
            ], { category: 'style', default: 'none' }),
            select('iconPosition', 'Posição do Ícone', [
                { value: 'left', label: 'Esquerda' },
                { value: 'right', label: 'Direita' },
            ], { category: 'layout', default: 'right' }),
            // Estilo
            prop({ key: 'backgroundColor', kind: 'color', label: 'Cor de Fundo', category: 'style', default: '#B89B7A' }),
            prop({ key: 'textColor', kind: 'color', label: 'Cor do Texto', category: 'style', default: '#FFFFFF' }),
            prop({ key: 'borderColor', kind: 'color', label: 'Cor da Borda', category: 'style', default: '#B89B7A' }),
            prop({ key: 'borderRadius', kind: 'range', label: 'Raio da Borda', category: 'style', min: 0, max: 32, step: 1, unit: 'px', default: 8 }),
            // Estados
            prop({ key: 'disabled', kind: 'switch', label: 'Desativado', category: 'behavior', default: false }),
            prop({ key: 'disabledText', kind: 'text', label: 'Texto Desativado', category: 'behavior', default: '' }),
            prop({ key: 'loading', kind: 'switch', label: 'Carregando', category: 'behavior', default: false }),
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
        defaultProps: {
            columns: 2,
            showLetters: true,
            showDescriptions: false,
            interactive: true,
            selectable: false,
            animationType: 'hover',
            cardSize: 'md',
            gap: 'gap-6',
            themePreset: 'glass',
        },
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
            select('themePreset', 'Tema', [
                { value: 'glass', label: 'Glass (Translúcido)' },
                { value: 'light', label: 'Claro' },
                { value: 'solid', label: 'Sólido' },
            ], { category: 'style', default: 'glass' }),
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
            prop({ key: 'scrollToNext', kind: 'switch', label: 'Rolar até o próximo ao avançar', category: 'behavior', default: true }),
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
