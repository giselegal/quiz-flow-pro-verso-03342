// Lista de componentes disponíveis no editor (dados estáticos)
export type IconName =
    | 'note'
    | 'flash'
    | 'doc'
    | 'button'
    | 'target'
    | 'palette'
    | 'chart'
    | 'chat'
    | 'shield'
    | 'rocket'
    | 'sparkle'
    | 'money'
    | 'refresh'
    | 'hourglass'
    | 'confetti'
    | 'question'
    | 'info';

export interface ComponentDef {
    type: string;
    name: string;
    icon: IconName;
    category: string;
    description: string;
}

export const availableComponents: ComponentDef[] = [
    {
        type: 'quiz-intro-header',
        name: 'Header Quiz',
        icon: 'note',
        category: 'Estrutura',
        description: 'Cabeçalho com título e descrição',
    },
    {
        type: 'options-grid',
        name: 'Grade Opções',
        icon: 'flash',
        category: 'Interação',
        description: 'Grid de opções para questões',
    },
    {
        type: 'form-container',
        name: 'Formulário',
        icon: 'note',
        category: 'Captura',
        description: 'Campo de entrada de dados',
    },
    {
        type: 'text',
        name: 'Texto',
        icon: 'doc',
        category: 'Conteúdo',
        description: 'Bloco de texto simples',
    },
    {
        type: 'button',
        name: 'Botão',
        icon: 'button',
        category: 'Interação',
        description: 'Botão de ação',
    },
    {
        type: 'result-header-inline',
        name: 'Header Resultado',
        icon: 'target',
        category: 'Resultado',
        description: 'Cabeçalho personalizado de resultado',
    },
    {
        type: 'style-card-inline',
        name: 'Card Estilo',
        icon: 'palette',
        category: 'Resultado',
        description: 'Card com características do estilo',
    },
    {
        type: 'secondary-styles',
        name: 'Estilos Secundários',
        icon: 'chart',
        category: 'Resultado',
        description: 'Lista de estilos complementares',
    },
    {
        type: 'testimonials',
        name: 'Depoimentos',
        icon: 'chat',
        category: 'Social Proof',
        description: 'Lista de depoimentos',
    },
    {
        type: 'guarantee',
        name: 'Garantia',
        icon: 'shield',
        category: 'Confiança',
        description: 'Selo de garantia',
    },
    {
        type: 'hero',
        name: 'Hero Section',
        icon: 'rocket',
        category: 'Layout',
        description: 'Seção hero para transições e ofertas',
    },
    // Páginas de Vendas - Hero
    {
        type: 'sales-hero',
        name: 'Sales Hero',
        icon: 'rocket',
        category: 'Vendas',
        description: 'Seção Hero pré-configurada para páginas de venda',
    },
    {
        type: 'benefits',
        name: 'Benefícios',
        icon: 'sparkle',
        category: 'Vendas',
        description: 'Lista de benefícios do produto',
    },
    {
        type: 'quiz-offer-cta-inline',
        name: 'CTA Oferta',
        icon: 'money',
        category: 'Conversão',
        description: 'Call-to-action para ofertas especiais',
    },
];
