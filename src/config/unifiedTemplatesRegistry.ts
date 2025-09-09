/**
 * 🗂️ UNIFIED TEMPLATES REGISTRY
 * 
 * Fonte única e centralizada para todos os templates de funis
 * Elimina duplicações e garante consistência
 */

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
}

/**
 * Registry oficial de templates
 * ✅ Fonte única de verdade
 * ✅ IDs únicos garantidos
 * ✅ Categorias padronizadas
 */
export const UNIFIED_TEMPLATE_REGISTRY: Record<string, UnifiedTemplate> = {
    'quiz-estilo-21-steps': {
        id: 'quiz-estilo-21-steps',
        name: 'Quiz de Estilo Completo (21 Etapas)',
        description: 'Funil completo para descoberta de estilo pessoal com todas as 21 etapas otimizadas',
        category: 'quiz-style',
        theme: 'modern-chic',
        stepCount: 21,
        isOfficial: true,
        usageCount: 1247,
        tags: ['estilo', 'moda', 'personalidade', 'completo'],
        features: [
            '21 Etapas Otimizadas',
            'Quiz Interativo',
            'Resultado Personalizado',
            'Oferta Integrada',
        ],
        conversionRate: '87%',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
    },

    'quiz-estilo-otimizado': {
        id: 'quiz-estilo-otimizado',
        name: 'Quiz 21 Etapas (Otimizado)',
        description: 'Versão otimizada com blocos core, perguntas sincronizadas e pesos de pontuação',
        category: 'quiz-style',
        theme: 'fashion-optimized',
        stepCount: 21,
        isOfficial: true,
        usageCount: 892,
        tags: ['estilo', 'otimizado', 'conversão', 'pontuação'],
        features: [
            'Perguntas Sincronizadas',
            'Pesos de Pontuação',
            'Componentes Core',
            'Resultado + Oferta',
        ],
        conversionRate: '90%',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/c_fill,w_400,h_300/v1744911572/LOOKS_COMBINACOES.webp',
        createdAt: '2025-02-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
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
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/c_fill,w_400,h_300/v1744911572/LOOKS_COMBINACOES.webp',
        createdAt: '2025-03-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
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
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/c_fill,w_400,h_300/v1744911572/PERSONAL_BRANDING.webp',
        createdAt: '2025-04-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
    },

    'lead-capture-simple': {
        id: 'lead-capture-simple',
        name: 'Captura de Lead Simples',
        description: 'Funil básico com 5 etapas para captura eficiente de leads qualificados',
        category: 'lead-generation',
        theme: 'business-clean',
        stepCount: 5,
        isOfficial: true,
        usageCount: 445,
        tags: ['leads', 'simples', 'conversão', 'captura'],
        features: [
            'Setup Rápido',
            'Alta Conversão',
            'Integração CRM',
            'Analytics Incluído',
        ],
        conversionRate: '65%',
        image: 'https://via.placeholder.com/400x300?text=Lead+Generation',
        createdAt: '2025-05-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
    },

    'personality-assessment': {
        id: 'personality-assessment',
        name: 'Avaliação de Personalidade',
        description: 'Teste psicológico com 15 etapas para análise comportamental detalhada',
        category: 'personality-test',
        theme: 'wellness-soft',
        stepCount: 15,
        isOfficial: true,
        usageCount: 378,
        tags: ['personalidade', 'psicologia', 'comportamento', 'análise'],
        features: [
            'Base Científica',
            'Relatório Detalhado',
            'Insights Personalizados',
            'Recomendações',
        ],
        conversionRate: '72%',
        image: 'https://via.placeholder.com/400x300?text=Personality+Test',
        createdAt: '2025-06-01T00:00:00.000Z',
        updatedAt: '2025-09-09T12:00:00.000Z',
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
