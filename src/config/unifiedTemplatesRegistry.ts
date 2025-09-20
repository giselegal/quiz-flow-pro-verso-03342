/**
 * 🗂️ UNIFIED TEMPLATES REGISTRY
 * 
 * Fonte única e centralizada para todos os templates de funis
 * Elimina duplicações e garante consistência
 */

/**
 * 🗂️ UNIFIED TEMPLATES REGISTRY
 * 
 * Fonte única e centralizada para todos os templates de funis
 * Elimina duplicações e garante consistência
 * 🚀 NOVO: Sistema de herança e composição
 */

export interface PropertyOverride {
    path: string; // e.g., "step-1.blocks.0.properties.backgroundColor"
    value: any;
    reason?: string;
}

export interface TemplateVariant {
    id: string;
    name: string;
    description: string;
    overrides: PropertyOverride[];
    tags?: string[];
    conversionRate?: string;
}

export interface ComponentReference {
    componentId: string;
    componentType: 'header' | 'form' | 'cta' | 'footer' | 'quiz' | 'result';
    position: number;
    customProperties?: Record<string, any>;
}

export interface UnifiedTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    theme: string;
    stepCount: number;
    isOfficial: boolean;
    usageCount: number;
    tags: string[];
    features: string[];
    conversionRate: string;
    image: string;
    createdAt: string;
    updatedAt: string;

    // 🚀 TEMPLATE INHERITANCE SYSTEM
    parentTemplateId?: string; // ID do template pai
    inheritanceType?: 'extend' | 'override' | 'compose'; // Tipo de herança
    overrides?: PropertyOverride[]; // Customizações específicas
    variants?: TemplateVariant[]; // Variações A/B

    // 🚀 COMPONENT COMPOSITION SYSTEM  
    components?: ComponentReference[]; // Componentes reutilizáveis
    composition?: {
        layout: 'linear' | 'grid' | 'custom';
        responsive: boolean;
        breakpoints?: Record<string, any>;
    };

    // 🚀 VERSIONING SYSTEM
    version: string; // semantic versioning (e.g., "2.1.0")
    previousVersions?: string[];
    changeLog?: Array<{
        version: string;
        date: string;
        changes: string[];
        breaking: boolean;
    }>;

    // 🚀 MULTI-TENANCY
    visibility?: 'public' | 'organization' | 'private';
    organizationId?: string;
    permissions?: Array<{
        action: 'view' | 'duplicate' | 'edit';
        scope: 'public' | 'organization' | 'user';
    }>;
}

/**
 * Registry oficial de templates
 * ✅ Fonte única de verdade
 * ✅ IDs únicos garantidos
 * ✅ Categorias padronizadas
 */
export const UNIFIED_TEMPLATE_REGISTRY: Record<string, UnifiedTemplate> = {
    'quiz21StepsComplete': {
        id: 'quiz21StepsComplete',
        name: 'Quiz de Estilo Pessoal - 21 Etapas Completo',
        description: 'Template principal completo para descoberta do estilo pessoal com 21 etapas, incluindo coleta de dados, quiz pontuado, questões estratégicas e ofertas',
        category: 'quiz-complete',
        theme: 'fashion-premium',
        stepCount: 21,
        isOfficial: true,
        usageCount: 2150,
        tags: ['principal', 'estilo', 'completo', '21-etapas', 'premium'],
        features: [
            'Template Principal',
            'Quiz Pontuado Completo',
            'Questões Estratégicas',
            'Resultado + Oferta Premium',
            'Persistência JSON',
            'SEO Otimizado',
        ],
        conversionRate: '94%',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        createdAt: '2024-12-01T00:00:00.000Z',
        updatedAt: '2025-09-11T14:30:00.000Z',

        // 🚀 VERSIONING SYSTEM
        version: '2.1.0',
        changeLog: [
            {
                version: '2.1.0',
                date: '2025-09-11',
                changes: [
                    'Adicionado sistema de herança',
                    'Melhorado sistema multi-tenant',
                    'Otimizada performance de carregamento'
                ],
                breaking: false
            },
            {
                version: '2.0.0',
                date: '2025-03-01',
                changes: [
                    'Template completo implementado',
                    'Sistema de pontuação refinado'
                ],
                breaking: true
            }
        ],

        // 🚀 TEMPLATE BASE (sem herança - é o template pai)
        inheritanceType: undefined,
        parentTemplateId: undefined,

        // 🚀 VARIANTS para A/B testing
        variants: [
            {
                id: 'quiz21Steps-variant-short',
                name: 'Versão Curta (15 etapas)',
                description: 'Versão otimizada com 15 etapas para maior conversão',
                overrides: [
                    {
                        path: 'stepCount',
                        value: 15,
                        reason: 'Reduzir abandono mantendo qualidade'
                    }
                ],
                tags: ['conversao-otimizada', 'mobile-friendly'],
                conversionRate: '97%'
            },
            {
                id: 'quiz21Steps-variant-premium',
                name: 'Versão Premium (25 etapas)',
                description: 'Versão expandida com questões avançadas',
                overrides: [
                    {
                        path: 'stepCount',
                        value: 25,
                        reason: 'Análise mais profunda para clientes premium'
                    }
                ],
                tags: ['premium', 'analise-profunda'],
                conversionRate: '89%'
            }
        ]
    },

    // 🚀 EXEMPLO DE TEMPLATE COM HERANÇA
    'quiz-style-express': {
        id: 'quiz-style-express',
        name: 'Quiz de Estilo Express - 10 Etapas',
        description: 'Versão rápida e otimizada do quiz de estilo, herda do template principal com customizações para conversão',
        category: 'quiz-express',
        theme: 'fashion-premium',
        stepCount: 10,
        isOfficial: true,
        usageCount: 1420,
        tags: ['express', 'conversao', 'rapido', 'mobile-otimizado'],
        features: [
            'Quiz Rápido (10 etapas)',
            'Herda do Template Principal',
            'Otimizado para Mobile',
            'Alta Conversão',
            'Resultado Instantâneo'
        ],
        conversionRate: '98%',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        createdAt: '2025-06-01T00:00:00.000Z',
        updatedAt: '2025-09-19T10:00:00.000Z',

        // 🚀 TEMPLATE INHERITANCE - Herda do quiz21StepsComplete
        version: '1.2.0',
        parentTemplateId: 'quiz21StepsComplete',
        inheritanceType: 'override',

        // 🚀 OVERRIDES - Customizações específicas
        overrides: [
            {
                path: 'stepCount',
                value: 10,
                reason: 'Reduzir abandono em mobile'
            },
            {
                path: 'category',
                value: 'quiz-express',
                reason: 'Nova categoria para versão rápida'
            },
            {
                path: 'steps.transition',
                value: false,
                reason: 'Remover páginas de transição'
            },
            {
                path: 'result.showSecondaryStyles',
                value: false,
                reason: 'Mostrar apenas estilo principal'
            }
        ],

        changeLog: [
            {
                version: '1.2.0',
                date: '2025-09-19',
                changes: [
                    'Otimizado para dispositivos móveis',
                    'Removidas transições desnecessárias',
                    'Foco no estilo principal apenas'
                ],
                breaking: false
            }
        ]
    },

    'com-que-roupa-eu-vou': {
        id: 'com-que-roupa-eu-vou',
        name: 'Com que Roupa Eu Vou?',
        description: 'Quiz especializado em combinações de looks perfeitos com IA para cada ocasião',
        category: 'quiz-style',
        theme: 'fashion-ai',
        stepCount: 21,
        isOfficial: true,
        usageCount: 856,
        tags: ['moda', 'ia', 'looks', 'combinações', 'ocasiões'],
        features: [
            'IA Integrada',
            'Looks Personalizados',
            'Análise de Cores',
            'Sugestões Inteligentes',
        ],
        conversionRate: '92%',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        createdAt: '2025-03-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
        version: '1.1.0', // 🚀 Adicionada versão obrigatória
    },

    'personal-branding-quiz': {
        id: 'personal-branding-quiz',
        name: 'Personal Branding Quiz',
        description: 'Descubra seu estilo de marca pessoal com análise completa de personalidade',
        category: 'personal-branding',
        theme: 'business-professional',
        stepCount: 15,
        isOfficial: true,
        usageCount: 634,
        tags: ['personal branding', 'marca pessoal', 'profissional', 'negócios'],
        features: [
            'Análise de Personalidade',
            'Estilo de Marca',
            'Cores Estratégicas',
            'Guia Completo',
        ],
        conversionRate: '78%',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        createdAt: '2025-04-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
        version: '1.5.0', // 🚀 Adicionada versão obrigatória
    },

    'lead-magnet-fashion': {
        id: 'lead-magnet-fashion',
        name: 'Lead Magnet Moda',
        description: 'Ímã de leads focado em capturar leads qualificados no nicho de moda',
        category: 'lead-magnet',
        theme: 'minimal-fashion',
        stepCount: 5,
        isOfficial: true,
        usageCount: 445,
        tags: ['lead', 'moda', 'captura', 'conversão'],
        features: [
            'Captura Otimizada',
            'Oferta Irresistível',
            'Design Minimalista',
            'Alta Conversão',
        ],
        conversionRate: '65%',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        createdAt: '2025-04-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
        version: '2.0.1', // 🚀 Adicionada versão obrigatória
    },

    'quiz-tipo-corpo': {
        id: 'quiz-tipo-corpo',
        name: 'Quiz Descubra Seu Tipo de Corpo',
        description: 'Quiz interativo para identificar formato corporal e sugestões de looks ideais',
        category: 'quiz-style',
        theme: 'body-positive',
        stepCount: 12,
        isOfficial: true,
        usageCount: 923,
        tags: ['corpo', 'shapes', 'autoestima', 'personalização'],
        features: [
            'Análise de Formas',
            'Looks Personalizados',
            'Dicas de Styling',
            'Autoestima Positiva',
        ],
        conversionRate: '84%',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        createdAt: '2025-05-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
        version: '1.8.3', // 🚀 Adicionada versão obrigatória
    },

    'consultoria-imagem-premium': {
        id: 'consultoria-imagem-premium',
        name: 'Consultoria de Imagem Premium',
        description: 'Funil completo para venda de consultoria de imagem de alto valor',
        category: 'product-launch',
        theme: 'luxury-premium',
        stepCount: 15,
        isOfficial: true,
        usageCount: 367,
        tags: ['premium', 'consultoria', 'alto-valor', 'exclusivo'],
        features: [
            'Proposta Premium',
            'Qualificação Rigorosa',
            'Oferta Exclusiva',
            'Follow-up Automático',
        ],
        conversionRate: '45%',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        createdAt: '2025-06-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
        version: '3.0.0', // 🚀 Adicionada versão obrigatória
    },

    'capsule-wardrobe-guide': {
        id: 'capsule-wardrobe-guide',
        name: 'Guia Capsule Wardrobe',
        description: 'Funil educativo para criação de guarda-roupa cápsula funcional',
        category: 'lead-magnet',
        theme: 'sustainable-fashion',
        stepCount: 8,
        isOfficial: true,
        usageCount: 678,
        tags: ['sustentável', 'minimalista', 'funcional', 'organização'],
        features: [
            'Guia Completo',
            'Checklist Prático',
            'Vídeos Tutoriais',
            'Planilha de Planejamento',
        ],
        conversionRate: '72%',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        createdAt: '2025-07-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
        version: '1.3.0', // 🚀 Adicionada versão obrigatória
    },

    'masterclass-combinacoes': {
        id: 'masterclass-combinacoes',
        name: 'Masterclass: Arte das Combinações',
        description: 'Webinar gratuito sobre como criar looks incríveis com peças básicas',
        category: 'webinar',
        theme: 'educational',
        stepCount: 6,
        isOfficial: true,
        usageCount: 1205,
        tags: ['webinar', 'educacional', 'combinações', 'masterclass'],
        features: [
            'Conteúdo Exclusivo',
            'Aula ao Vivo',
            'Bônus Especiais',
            'Comunidade VIP',
        ],
        conversionRate: '38%',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        createdAt: '2025-08-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
        version: '2.1.0', // 🚀 Adicionada versão obrigatória
    },

    'quiz-cores-perfeitas': {
        id: 'quiz-cores-perfeitas',
        name: 'Quiz: Suas Cores Perfeitas',
        description: 'Descubra sua cartela de cores ideal com análise colorimétrica personalizada',
        category: 'quiz-style',
        theme: 'colorful',
        stepCount: 10,
        isOfficial: true,
        usageCount: 756,
        tags: ['cores', 'colorimetria', 'paleta', 'harmonização'],
        features: [
            'Análise de Cores',
            'Paleta Personalizada',
            'Guia de Harmonização',
            'Dicas de Maquiagem',
        ],
        conversionRate: '79%',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        createdAt: '2025-09-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
        version: '1.4.2', // 🚀 Adicionada versão obrigatória
    },

    'shopping-inteligente': {
        id: 'shopping-inteligente',
        name: 'Shopping Inteligente: Economia & Estilo',
        description: 'Aprenda a comprar roupas de forma inteligente economizando até 70%',
        category: 'ecommerce',
        theme: 'smart-shopping',
        stepCount: 7,
        isOfficial: true,
        usageCount: 523,
        tags: ['economia', 'compras', 'promoções', 'inteligente'],
        features: [
            'Dicas de Economia',
            'Lista de Outlets',
            'Apps Recomendados',
            'Cronograma de Promoções',
        ],
        conversionRate: '61%',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        createdAt: '2025-09-05T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
        version: '1.0.0', // 🚀 Adicionada versão obrigatória
    },


};

/**
 * Categorias padronizadas
 */
export const TEMPLATE_CATEGORIES = {
    'quiz-style': {
        id: 'quiz-style',
        name: 'Quiz de Estilo',
        description: 'Templates para descoberta de estilo pessoal e moda',
        icon: 'palette',
        color: '#E91E63',
    },
    'personal-branding': {
        id: 'personal-branding',
        name: 'Personal Branding',
        description: 'Templates para desenvolvimento de marca pessoal',
        icon: 'star',
        color: '#FF9800',
    },
    'lead-generation': {
        id: 'lead-generation',
        name: 'Geração de Leads',
        description: 'Funis otimizados para captura de contatos',
        icon: 'users',
        color: '#2196F3',
    },
    'personality-test': {
        id: 'personality-test',
        name: 'Teste de Personalidade',
        description: 'Avaliações psicológicas e comportamentais',
        icon: 'heart',
        color: '#9C27B0',
    },
} as const;

/**
 * Utilitários do Registry
 */
export const TemplateRegistry = {
    /**
     * Obter todos os templates
     */
    getAll(): UnifiedTemplate[] {
        return Object.values(UNIFIED_TEMPLATE_REGISTRY);
    },

    /**
     * Obter template por ID
     */
    getById(id: string): UnifiedTemplate | null {
        return UNIFIED_TEMPLATE_REGISTRY[id] || null;
    },

    /**
     * Obter templates por categoria
     */
    getByCategory(category: string): UnifiedTemplate[] {
        return this.getAll().filter(template => template.category === category);
    },

    /**
     * Obter apenas templates oficiais
     */
    getOfficial(): UnifiedTemplate[] {
        return this.getAll().filter(template => template.isOfficial);
    },

    /**
     * Buscar templates por texto
     */
    search(query: string): UnifiedTemplate[] {
        const searchTerm = query.toLowerCase();
        return this.getAll().filter(template =>
            template.name.toLowerCase().includes(searchTerm) ||
            template.description.toLowerCase().includes(searchTerm) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    },

    /**
     * Obter templates ordenados
     */
    getSorted(sortBy: 'name' | 'usageCount' | 'conversionRate' = 'usageCount'): UnifiedTemplate[] {
        const templates = [...this.getAll()];

        switch (sortBy) {
            case 'name':
                return templates.sort((a, b) => a.name.localeCompare(b.name));
            case 'usageCount':
                return templates.sort((a, b) => b.usageCount - a.usageCount);
            case 'conversionRate':
                return templates.sort((a, b) => {
                    const aRate = parseFloat(a.conversionRate.replace('%', ''));
                    const bRate = parseFloat(b.conversionRate.replace('%', ''));
                    return bRate - aRate;
                });
            default:
                return templates;
        }
    },

    /**
     * Obter estatísticas do registry
     */
    getStats() {
        const templates = this.getAll();
        const categories = new Set(templates.map(t => t.category));
        const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);
        const avgConversion = templates.reduce((sum, t) => {
            return sum + parseFloat(t.conversionRate.replace('%', ''));
        }, 0) / templates.length;

        return {
            totalTemplates: templates.length,
            totalCategories: categories.size,
            totalUsage,
            avgConversion: `${avgConversion.toFixed(1)}%`,
            officialTemplates: templates.filter(t => t.isOfficial).length,
        };
    },

    /**
     * Validar se um template existe
     */
    exists(id: string): boolean {
        return id in UNIFIED_TEMPLATE_REGISTRY;
    },

    /**
     * Obter IDs de todos os templates
     */
    getAllIds(): string[] {
        return Object.keys(UNIFIED_TEMPLATE_REGISTRY);
    },
};

/**
 * Hook-like function para usar com React
 */
export function getUnifiedTemplates(options: {
    category?: string;
    search?: string;
    sortBy?: 'name' | 'usageCount' | 'conversionRate';
    officialOnly?: boolean;
} = {}) {
    let templates = TemplateRegistry.getAll();

    // Filtrar por categoria
    if (options.category && options.category !== 'all') {
        templates = TemplateRegistry.getByCategory(options.category);
    }

    // Filtrar apenas oficiais
    if (options.officialOnly) {
        templates = templates.filter(t => t.isOfficial);
    }

    // Buscar por texto
    if (options.search) {
        const searchTerm = options.search.toLowerCase();
        templates = templates.filter(template =>
            template.name.toLowerCase().includes(searchTerm) ||
            template.description.toLowerCase().includes(searchTerm) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    // Ordenar
    if (options.sortBy) {
        switch (options.sortBy) {
            case 'name':
                templates.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'usageCount':
                templates.sort((a, b) => b.usageCount - a.usageCount);
                break;
            case 'conversionRate':
                templates.sort((a, b) => {
                    const aRate = parseFloat(a.conversionRate.replace('%', ''));
                    const bRate = parseFloat(b.conversionRate.replace('%', ''));
                    return bRate - aRate;
                });
                break;
        }
    }

    return templates;
}
