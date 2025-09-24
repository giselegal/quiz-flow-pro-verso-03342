/**
 * 🎯 CONFIGURAÇÃO CENTRALIZADA DE TEMPLATES
 * 
 * Sistema unificado para gerenciar todos os templates de funis
 * Substitui dados mockados por configurações reais
 */

export interface TemplateConfig {
    id: string;
    name: string;
    description: string;
    category: 'Quiz' | 'B2B' | 'Lead Generation' | 'Pesquisa' | 'Onboarding' | 'Eventos';
    segment: 'Quiz' | 'B2B' | 'Cliente Final';
    difficulty: 'Fácil' | 'Intermediário' | 'Avançado';
    stepCount: number;
    preview: string;
    tags: string[];
    features: string[];
    isActive: boolean;
    templatePath: string;
    editorUrl: string;
    rating: number;
    downloads: number;
}

/**
 * 🎯 TEMPLATES REAIS DISPONÍVEIS
 * Configuração baseada na auditoria completa dos funis existentes
 */
export const AVAILABLE_TEMPLATES: TemplateConfig[] = [
    // === TEMPLATE PRINCIPAL - QUIZ 21 ETAPAS ===
    {
        id: 'quiz21StepsComplete',
        name: 'Quiz de Estilo Pessoal - 21 Etapas',
        description: 'Template completo para descoberta do estilo pessoal com sistema de pontuação avançado, personalização automática e analytics integrado.',
        category: 'Quiz',
        segment: 'Quiz',
        difficulty: 'Avançado',
        stepCount: 21,
        preview: 'https://placehold.co/400x240/B89B7A/ffffff?text=Quiz+21+Etapas',
        tags: ['Quiz Completo', 'Estilo', 'Personalização', 'Analytics', '21 Etapas'],
        features: [
            'Sistema de pontuação inteligente',
            'Personalização automática por funil',
            'Analytics e tracking integrado',
            'Cache otimizado para performance',
            'Múltiplos tipos de questão',
            'Resultados personalizados'
        ],
        isActive: true,
        templatePath: '/src/templates/quiz21StepsComplete.ts',
        editorUrl: '/editor?template=quiz21StepsComplete',
        rating: 4.9,
        downloads: 12450
    },

    // === LEAD MAGNET FASHION ===
    {
        id: 'lead-magnet-fashion',
        name: 'Lead Magnet Fashion',
        description: 'Funil rápido e otimizado para captura de leads com foco em moda e lifestyle. Ideal para negócios do setor fashion.',
        category: 'Lead Generation',
        segment: 'Cliente Final',
        difficulty: 'Fácil',
        stepCount: 7,
        preview: 'https://placehold.co/400x240/FF6B9D/ffffff?text=Lead+Magnet',
        tags: ['Lead Magnet', 'Moda', 'Fashion', 'Captura', 'Lifestyle'],
        features: [
            'Formulários otimizados',
            'Entrega automática de conteúdo',
            'Design responsivo premium',
            'Validação inteligente',
            'Integração com email marketing',
            'Analytics de conversão'
        ],
        isActive: true,
        templatePath: '/templates/funnels/lead-magnet-fashion/master.json',
        editorUrl: '/editor?template=lead-magnet-fashion',
        rating: 4.6,
        downloads: 5672
    },

    // === TEMPLATES ADICIONAIS BASEADOS NOS EXISTENTES ===
    {
        id: 'quiz-personalidade',
        name: 'Quiz de Personalidade Rápido',
        description: 'Versão simplificada do quiz de personalidade, ideal para captura de leads com engajamento alto.',
        category: 'Quiz',
        segment: 'Quiz',
        difficulty: 'Fácil',
        stepCount: 7,
        preview: 'https://placehold.co/400x240/8B5CF6/ffffff?text=Quiz+Personalidade',
        tags: ['Quiz', 'Personalidade', 'Engajamento', 'Rápido'],
        features: [
            'Resultados em tempo real',
            'Compartilhamento social',
            'Captura de leads integrada',
            'Analytics detalhado'
        ],
        isActive: true,
        templatePath: '/public/templates/quiz-steps/', // Baseado nos step templates existentes
        editorUrl: '/editor?template=quiz-personalidade',
        rating: 4.7,
        downloads: 8934
    },

    {
        id: 'calculadora-roi',
        name: 'Calculadora de ROI Empresarial',
        description: 'Demonstre o valor do seu produto/serviço com uma calculadora interativa de retorno sobre investimento.',
        category: 'B2B',
        segment: 'B2B',
        difficulty: 'Avançado',
        stepCount: 8,
        preview: 'https://placehold.co/400x240/EF4444/ffffff?text=ROI+Calculator',
        tags: ['ROI', 'B2B', 'Calculadora', 'Vendas', 'Conversão'],
        features: [
            'Cálculos personalizados em tempo real',
            'Relatórios em PDF automáticos',
            'Integração com CRM/pipelines',
            'Análise comparativa de cenários'
        ],
        isActive: true,
        templatePath: '/templates/calculadora-roi.json',
        editorUrl: '/editor?template=calculadora-roi',
        rating: 4.9,
        downloads: 1834
    },

    {
        id: 'pesquisa-nps',
        name: 'Pesquisa de Satisfação NPS',
        description: 'Colete feedback dos clientes usando metodologia NPS com dashboards visuais e alertas automáticos.',
        category: 'Pesquisa',
        segment: 'Cliente Final',
        difficulty: 'Fácil',
        stepCount: 5,
        preview: 'https://placehold.co/400x240/10B981/ffffff?text=NPS+Survey',
        tags: ['NPS', 'Satisfação', 'Pesquisa', 'Feedback', 'Cliente'],
        features: [
            'Cálculo automático do NPS',
            'Segmentação de respostas',
            'Dashboards visuais interativos',
            'Alertas automáticos para detratores'
        ],
        isActive: true,
        templatePath: '/templates/pesquisa-nps.json',
        editorUrl: '/editor?template=pesquisa-nps',
        rating: 4.5,
        downloads: 4123
    },

    {
        id: 'onboarding-clientes',
        name: 'Onboarding de Novos Clientes',
        description: 'Guie novos clientes através do processo de integração com seu produto de forma interativa e eficiente.',
        category: 'Onboarding',
        segment: 'Cliente Final',
        difficulty: 'Intermediário',
        stepCount: 6,
        preview: 'https://placehold.co/400x240/06B6D4/ffffff?text=Onboarding',
        tags: ['Onboarding', 'Cliente', 'Integração', 'Tutorial'],
        features: [
            'Progresso visual intuitivo',
            'Checkpoints interativos',
            'Recursos contextuais',
            'Suporte integrado'
        ],
        isActive: true,
        templatePath: '/templates/onboarding-clientes.json',
        editorUrl: '/editor?template=onboarding-clientes',
        rating: 4.8,
        downloads: 2891
    }
];

/**
 * 🔧 SERVIÇOS PARA TEMPLATES
 */
export class TemplateService {
    /**
     * Obter template por ID
     */
    static getTemplate(templateId: string): TemplateConfig | undefined {
        return AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    }

    /**
     * Obter todos os templates ativos
     */
    static getActiveTemplates(): TemplateConfig[] {
        return AVAILABLE_TEMPLATES.filter(t => t.isActive);
    }

    /**
     * Filtrar templates por categoria
     */
    static getTemplatesByCategory(category: string): TemplateConfig[] {
        if (category === 'Todos') return this.getActiveTemplates();
        return AVAILABLE_TEMPLATES.filter(t =>
            t.isActive && t.category === category
        );
    }

    /**
     * Filtrar templates por segmento
     */
    static getTemplatesBySegment(segment: string): TemplateConfig[] {
        if (segment === 'Todos') return this.getActiveTemplates();
        return AVAILABLE_TEMPLATES.filter(t =>
            t.isActive && t.segment === segment
        );
    }

    /**
     * Buscar templates por termo
     */
    static searchTemplates(searchTerm: string): TemplateConfig[] {
        if (!searchTerm.trim()) return this.getActiveTemplates();

        const term = searchTerm.toLowerCase();
        return AVAILABLE_TEMPLATES.filter(t =>
            t.isActive && (
                t.name.toLowerCase().includes(term) ||
                t.description.toLowerCase().includes(term) ||
                t.tags.some(tag => tag.toLowerCase().includes(term))
            )
        );
    }

    /**
     * Obter categorias disponíveis
     */
    static getAvailableCategories(): string[] {
        const categories = new Set(AVAILABLE_TEMPLATES.map(t => t.category));
        return ['Todos', ...Array.from(categories)];
    }

    /**
     * Obter segmentos disponíveis
     */
    static getAvailableSegments(): string[] {
        const segments = new Set(AVAILABLE_TEMPLATES.map(t => t.segment));
        return ['Todos', ...Array.from(segments)];
    }

    /**
     * Obter dificuldades disponíveis
     */
    static getAvailableDifficulties(): string[] {
        const difficulties = new Set(AVAILABLE_TEMPLATES.map(t => t.difficulty));
        return ['Todos', ...Array.from(difficulties)];
    }
}

/**
 * 🎯 CONFIGURAÇÕES ESPECÍFICAS DO QUIZ21STEPSCOMPLETE
 */
export const QUIZ21_EDITOR_CONFIG = {
    templateId: 'quiz21StepsComplete',
    loadUrl: '/editor?template=quiz21StepsComplete',
    directUrl: '/editor/quiz21StepsComplete',
    previewUrl: '/templates/preview/quiz21StepsComplete',

    // Configurações específicas do editor
    editorMode: 'advanced' as const,
    allowCustomization: true,
    saveToMyFunnels: true,
    enableAnalytics: true,

    // Metadata para o painel
    displayName: 'Quiz de Estilo Pessoal - 21 Etapas',
    category: 'Quiz Avançado',
    thumbnail: 'https://placehold.co/400x240/B89B7A/ffffff?text=Quiz+21+Etapas',

    // Features específicas  
    features: [
        'Sistema de pontuação inteligente',
        'Personalização automática por funil',
        'Analytics e tracking integrado',
        'Cache otimizado para performance'
    ],

    // Configurações técnicas
    technical: {
        stepCount: 21,
        fileSize: '3.668 linhas',
        cacheEnabled: true,
        lazyLoading: true,
        compressionEnabled: true
    }
};

export default AVAILABLE_TEMPLATES;